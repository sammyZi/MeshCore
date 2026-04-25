/**
 * PacketQueue - Priority-based outbound packet queue backed by the pending_queue table.
 *
 * Task 12.1: Packet Queue with priority ordering
 * Task 12.4: SOS alert queue preemption
 * Task 12.6: Packet retry logic with exponential backoff
 * Task 12.7: Packet status tracking
 *
 * Requirements covered:
 *   Queue    – 20.1, 20.2, 20.3, 20.4, 20.5, 20.6
 *   Priority – 65.1, 65.2, 65.3, 65.4, 65.5, 65.6, 65.7
 *   SOS      – 13.6
 *   Retry    – 77.1, 77.2, 77.3, 77.4, 77.5
 *   Status   – 43.1, 43.2, 43.3, 43.5
 */

import { DatabaseManager } from '../database/DatabaseManager';

// ── Priority constants (same as MeshRouter – re-exported for convenience) ──
export const PRIORITY_SOS = 0;
export const PRIORITY_ACK = 1;
export const PRIORITY_SYSTEM = 2;
export const PRIORITY_LOCATION = 3;
export const PRIORITY_TEXT = 4;

// ── Retry constants ────────────────────────────────────────────────────
const MAX_RETRIES = 3;
const BACKOFF_BASE_MS = 1000; // 1s, 2s, 4s

// ── Packet type → priority mapping ─────────────────────────────────────
export const PACKET_TYPE_PRIORITY_MAP: Record<number, number> = {
  2: PRIORITY_SOS,       // SOS_Alert  → 0
  5: PRIORITY_ACK,       // ACK        → 1  (RREP doubles as ACK in routing)
  3: PRIORITY_SYSTEM,    // System     → 2
  0: PRIORITY_LOCATION,  // Location   → 3
  1: PRIORITY_TEXT,       // Text       → 4
};

/** Status values for queue items */
export type PacketStatus = 'pending' | 'sent' | 'failed';

/**
 * Represents a single entry in the packet queue.
 */
export interface QueuedPacket {
  packetId: string;
  trekId: string;
  priority: number;
  ttl: number;
  payload: Uint8Array;
  signature: Uint8Array;
  retryCount: number;
  status: PacketStatus;
  createdAt: Date;
  nextRetryAt: Date | null;
}

/**
 * Callback invoked when the queue wants to transmit a packet.
 * Returns `true` if at least one peer received the packet.
 */
export type TransmitCallback = (packet: QueuedPacket) => Promise<boolean>;

/**
 * PacketQueue orchestrates outbound packet scheduling, priority ordering,
 * SOS preemption, exponential-backoff retries, and status tracking.
 */
export class PacketQueue {
  private db: DatabaseManager;
  private transmitFn: TransmitCallback | null = null;
  private isProcessing: boolean = false;
  private processingTimer: ReturnType<typeof setTimeout> | null = null;

  /** When true, a lower-priority transmission was interrupted by an SOS */
  private preempted: boolean = false;

  constructor(db?: DatabaseManager) {
    this.db = db ?? DatabaseManager.getInstance();
  }

  // ════════════════════════════════════════════════════════════════════
  //  12.1 – Enqueue / Dequeue with priority ordering
  // ════════════════════════════════════════════════════════════════════

  /**
   * Adds a packet to the queue with the given priority.
   *
   * Priority assignment (Req 65.1–65.5):
   *   0 = SOS_Alert, 1 = ACK, 2 = SystemSignal, 3 = Location, 4 = Text
   *
   * Requirements: 20.1, 65.1–65.5
   *
   * @param packetId  Unique packet identifier
   * @param trekId    Active trek ID
   * @param priority  Numeric priority (0 = highest)
   * @param ttl       Time-to-live hop count
   * @param payload   Serialized protobuf payload
   * @param signature Packet signature
   */
  async enqueue(
    packetId: string,
    trekId: string,
    priority: number,
    ttl: number,
    payload: Uint8Array,
    signature: Uint8Array,
  ): Promise<void> {
    const now = new Date();

    await this.db.insertPacket({
      packet_id: packetId,
      trek_id: trekId,
      priority,
      ttl,
      payload: payload as any,
      signature: signature as any,
      retry_count: 0,
      status: 'pending',
      created_at: now,
      next_retry_at: null,
    });

    // 12.4 SOS preemption: if this is an SOS, immediately preempt
    if (priority === PRIORITY_SOS) {
      this.preemptForSOS();
    }
  }

  /**
   * Returns the highest-priority pending packet (lowest number wins).
   * Within the same priority, packets are ordered FIFO by created_at.
   *
   * Requirements: 20.2, 65.6, 65.7
   */
  async dequeue(): Promise<QueuedPacket | null> {
    const rows = await this.db.getPendingPackets(1);
    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];

    // Check if the packet is scheduled for a future retry
    if (row.next_retry_at && new Date(row.next_retry_at) > new Date()) {
      return null; // Not ready yet
    }

    return this.rowToPacket(row);
  }

  /**
   * Returns all pending packets ordered by priority (ascending) then
   * created_at (ascending = FIFO).
   *
   * Requirements: 65.6, 65.7
   */
  async peekAll(limit: number = 50): Promise<QueuedPacket[]> {
    const rows = await this.db.getPendingPackets(limit);
    return rows.map(this.rowToPacket);
  }

  // ════════════════════════════════════════════════════════════════════
  //  12.4 – SOS alert queue preemption
  // ════════════════════════════════════════════════════════════════════

  /**
   * Interrupts any in-progress lower-priority transmission and forces
   * the queue processor to immediately send the SOS packet next.
   *
   * Requirements: 13.6, 20.3
   */
  private preemptForSOS(): void {
    this.preempted = true;

    // Restart processing immediately so the SOS is picked up
    if (this.processingTimer) {
      clearTimeout(this.processingTimer);
      this.processingTimer = null;
    }

    // Kick off an immediate processing round
    void this.processQueue();
  }

  // ════════════════════════════════════════════════════════════════════
  //  12.6 – Retry logic with exponential backoff
  // ════════════════════════════════════════════════════════════════════

  /**
   * Handles a failed transmission for the given packet.
   *
   * - Increments retry_count                  (Req 77.1)
   * - Re-queues if retry_count < 3            (Req 77.2)
   * - Marks as 'failed' at 3 retries          (Req 77.3)
   * - Schedules next retry with backoff       (Req 77.4)
   *   1s → 2s → 4s
   *
   * Requirements: 20.5, 20.6, 77.1–77.5
   */
  async handleTransmitFailure(packetId: string, currentRetryCount: number): Promise<void> {
    const newRetryCount = currentRetryCount + 1;

    if (newRetryCount >= MAX_RETRIES) {
      // Mark as failed (Req 77.3, 20.6)
      await this.db.updatePacketStatus(packetId, 'failed', newRetryCount);
    } else {
      // Schedule retry with exponential backoff (Req 77.4)
      const backoffMs = BACKOFF_BASE_MS * Math.pow(2, currentRetryCount); // 1s, 2s, 4s
      const nextRetryAt = new Date(Date.now() + backoffMs);
      await this.db.updatePacketStatus(packetId, 'pending', newRetryCount, nextRetryAt);
    }
  }

  /**
   * Marks a packet as successfully sent.
   *
   * Requirements: 20.5, 43.2
   */
  async handleTransmitSuccess(packetId: string): Promise<void> {
    await this.db.updatePacketStatus(packetId, 'sent');
  }

  // ════════════════════════════════════════════════════════════════════
  //  12.7 – Packet status tracking
  // ════════════════════════════════════════════════════════════════════

  /**
   * Updates the status of a packet in the pending_queue.
   *
   * Requirements: 43.1, 43.2, 43.3
   */
  async updateStatus(
    packetId: string,
    status: PacketStatus,
    retryCount?: number,
    nextRetryAt?: Date,
  ): Promise<void> {
    await this.db.updatePacketStatus(packetId, status, retryCount, nextRetryAt);
  }

  /**
   * Allows manual retry of a failed packet from the UI.
   * Resets the packet to 'pending' with retry_count = 0.
   *
   * Requirements: 43.5
   */
  async retryFailedPacket(packetId: string): Promise<void> {
    await this.db.updatePacketStatus(packetId, 'pending', 0, new Date());
  }

  // ════════════════════════════════════════════════════════════════════
  //  Queue processing engine
  // ════════════════════════════════════════════════════════════════════

  /**
   * Registers the callback used to actually transmit a packet over BLE.
   * Must be set before calling `startProcessing()`.
   */
  setTransmitCallback(fn: TransmitCallback): void {
    this.transmitFn = fn;
  }

  /**
   * Starts the queue processor loop. Processes one packet at a time,
   * respecting priority ordering and retry backoff.
   *
   * Requirements: 20.2, 20.4
   */
  async startProcessing(intervalMs: number = 200): Promise<void> {
    if (this.isProcessing) return;
    this.isProcessing = true;
    await this.processLoop(intervalMs);
  }

  /**
   * Stops the queue processor.
   */
  stopProcessing(): void {
    this.isProcessing = false;
    if (this.processingTimer) {
      clearTimeout(this.processingTimer);
      this.processingTimer = null;
    }
  }

  /**
   * Single processing round: dequeue the next packet, transmit, update status.
   */
  private async processQueue(): Promise<void> {
    if (!this.transmitFn) return;

    const packet = await this.dequeue();
    if (!packet) return;

    // Check SOS preemption: if a higher-priority packet arrived
    // while we were in the middle of transmitting a lower-priority one,
    // the preempted flag will be set. We re-dequeue to get the SOS first.
    if (this.preempted) {
      this.preempted = false;
      // Re-dequeue – the SOS (priority 0) will be at the head
      const sosPacket = await this.dequeue();
      if (sosPacket && sosPacket.priority === PRIORITY_SOS) {
        await this.transmitAndUpdateStatus(sosPacket);
      }
      // Now process the original packet (or the next one in line)
      const nextPacket = await this.dequeue();
      if (nextPacket) {
        await this.transmitAndUpdateStatus(nextPacket);
      }
      return;
    }

    await this.transmitAndUpdateStatus(packet);
  }

  /**
   * Transmits a single packet and updates its status based on the result.
   */
  private async transmitAndUpdateStatus(packet: QueuedPacket): Promise<void> {
    if (!this.transmitFn) return;

    try {
      const success = await this.transmitFn(packet);
      if (success) {
        await this.handleTransmitSuccess(packet.packetId);
      } else {
        await this.handleTransmitFailure(packet.packetId, packet.retryCount);
      }
    } catch (err) {
      console.error(`Transmission error for packet ${packet.packetId}:`, err);
      await this.handleTransmitFailure(packet.packetId, packet.retryCount);
    }
  }

  /**
   * Internal loop that continuously processes the queue.
   */
  private async processLoop(intervalMs: number): Promise<void> {
    if (!this.isProcessing) return;

    try {
      await this.processQueue();
    } catch (err) {
      console.error('Queue processing error:', err);
    }

    this.processingTimer = setTimeout(() => {
      void this.processLoop(intervalMs);
    }, intervalMs);
  }

  // ════════════════════════════════════════════════════════════════════
  //  Utilities
  // ════════════════════════════════════════════════════════════════════

  /**
   * Maps a priority number to a human-readable label.
   */
  static priorityLabel(priority: number): string {
    switch (priority) {
      case PRIORITY_SOS: return 'SOS (Critical)';
      case PRIORITY_ACK: return 'ACK (High)';
      case PRIORITY_SYSTEM: return 'System';
      case PRIORITY_LOCATION: return 'Location';
      case PRIORITY_TEXT: return 'Text';
      default: return `Unknown (${priority})`;
    }
  }

  /**
   * Assigns a priority based on the packet type constant.
   *
   * Requirements: 65.1–65.5
   */
  static assignPriority(packetType: number): number {
    return PACKET_TYPE_PRIORITY_MAP[packetType] ?? PRIORITY_TEXT;
  }

  /**
   * Converts a raw database row into a QueuedPacket.
   */
  private rowToPacket(row: any): QueuedPacket {
    return {
      packetId: row.packet_id,
      trekId: row.trek_id,
      priority: row.priority,
      ttl: row.ttl,
      payload: row.payload instanceof Uint8Array ? row.payload : new Uint8Array(row.payload),
      signature: row.signature instanceof Uint8Array ? row.signature : new Uint8Array(row.signature),
      retryCount: row.retry_count,
      status: row.status as PacketStatus,
      createdAt: row.created_at instanceof Date ? row.created_at : new Date(row.created_at),
      nextRetryAt: row.next_retry_at
        ? row.next_retry_at instanceof Date
          ? row.next_retry_at
          : new Date(row.next_retry_at)
        : null,
    };
  }

  /**
   * Cleans up the processing loop.
   */
  destroy(): void {
    this.stopProcessing();
    this.transmitFn = null;
  }
}
