/**
 * PacketCodec - Protobuf serialization / deserialization for all mesh packet types.
 *
 * Task 13.1:  LocationUpdate encoding
 * Task 13.4:  LocationUpdate decoding
 * Task 13.5:  TextMessage encoding / decoding
 * Task 13.6:  SOSAlert encoding / decoding
 * Task 13.8:  SystemSignal encoding / decoding
 * Task 13.9:  MeshPacket envelope encoding / decoding
 * Task 13.13: Sequence number generation and tracking
 *
 * Requirements covered:
 *   LocationUpdate – 8.4, 8.8, 9.1, 9.2, 27.1, 27.6, 28.3, 31.1, 31.2, 31.3
 *   TextMessage    – 11.1, 11.2, 27.2, 28.3, 50.5
 *   SOSAlert       – 13.1, 13.2, 27.3, 27.7, 28.3
 *   SystemSignal   – 15.2, 27.4, 28.3, 29.1, 30.1
 *   MeshPacket     – 27.5, 28.1, 28.2
 *   Sequence       – 45.1, 45.2, 45.3, 45.4, 45.5
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { meshcore } = require('../generated/mesh');

// ── Packet type constants (mirror MeshRouter) ──────────────────────────
export const PACKET_TYPE_LOCATION = 0;
export const PACKET_TYPE_TEXT = 1;
export const PACKET_TYPE_SOS = 2;
export const PACKET_TYPE_SYSTEM = 3;

// ── SystemSignal types ─────────────────────────────────────────────────
export const SIGNAL_JOIN = 0;
export const SIGNAL_LEAVE = 1;
export const SIGNAL_END_TREK = 2;
export const SIGNAL_WAYPOINT = 3;
export const SIGNAL_GEOFENCE = 4;

// ── SOS signal types ───────────────────────────────────────────────────
export const SOS_EMERGENCY = 0;
export const SOS_MEDICAL = 1;
export const SOS_LOST = 2;

// ── Text message character limit ───────────────────────────────────────
const TEXT_MAX_CHARS = 140;

// ════════════════════════════════════════════════════════════════════════
//  Decoded result types
// ════════════════════════════════════════════════════════════════════════

export interface DecodedLocationUpdate {
  /** Latitude in decimal degrees */
  latitude: number;
  /** Longitude in decimal degrees */
  longitude: number;
  /** Altitude in meters above sea level */
  altitude: number;
  /** Accuracy in meters */
  accuracy: number;
  /** Unix timestamp in milliseconds */
  timestamp: number;
  /** Sender Node_ID (hex) */
  senderId: string;
}

export interface DecodedTextMessage {
  messageId: string;
  senderId: string;
  payload: string;
}

export interface DecodedSOSAlert {
  senderId: string;
  timestamp: number;
  signalType: number;
}

export interface DecodedSystemSignal {
  signalType: number;
  senderId: string;
  payload: Uint8Array;
}

export interface DecodedMeshPacket {
  packetId: string;
  seqNum: number;
  ttl: number;
  priority: number;
  packetType: number;
  payload: Uint8Array;
  signature: Uint8Array;
}

// ════════════════════════════════════════════════════════════════════════
//  13.1 – LocationUpdate encoding
// ════════════════════════════════════════════════════════════════════════

/**
 * Encodes GPS coordinates into a LocationUpdate protobuf buffer.
 *
 * - Multiplies lat/lon by 1e7 → sfixed32    (Req 8.4, 31.1, 31.2)
 * - Stores altitude, accuracy as uint32     (Req 27.1)
 * - Stores timestamp as uint64 (ms)         (Req 27.1)
 * - Serialized size ≈ 14–15 bytes           (Req 8.8, 27.6)
 *
 * Requirements: 8.4, 8.8, 27.1, 27.6, 31.1, 31.2
 */
export function encodeLocationUpdate(
  lat: number,
  lon: number,
  altitude: number,
  accuracy: number,
  timestamp: number,
  senderId: string,
): Uint8Array {
  const msg = meshcore.LocationUpdate.create({
    latI: Math.round(lat * 1e7),
    lonI: Math.round(lon * 1e7),
    altitude: Math.round(altitude),
    accuracy: Math.round(accuracy),
    timestamp,
    senderId,
  });
  return meshcore.LocationUpdate.encode(msg).finish();
}

// ════════════════════════════════════════════════════════════════════════
//  13.4 – LocationUpdate decoding
// ════════════════════════════════════════════════════════════════════════

/**
 * Decodes a LocationUpdate protobuf buffer back to GPS coordinates.
 *
 * - Divides sfixed32 lat_i/lon_i by 1e7    (Req 9.2, 31.3)
 * - Extracts altitude, accuracy, timestamp  (Req 9.1)
 * - Validates required fields               (Req 28.3)
 *
 * Requirements: 9.1, 9.2, 28.3, 31.3
 */
export function decodeLocationUpdate(buffer: Uint8Array): DecodedLocationUpdate {
  const msg = meshcore.LocationUpdate.decode(buffer);

  // Validate required fields (Req 28.3)
  if (msg.senderId == null || msg.senderId === '') {
    throw new Error('LocationUpdate: missing required field senderId');
  }

  return {
    latitude: msg.latI / 1e7,
    longitude: msg.lonI / 1e7,
    altitude: msg.altitude ?? 0,
    accuracy: msg.accuracy ?? 0,
    timestamp: typeof msg.timestamp === 'object'
      ? (msg.timestamp as any).toNumber()
      : Number(msg.timestamp),
    senderId: msg.senderId,
  };
}

// ════════════════════════════════════════════════════════════════════════
//  13.5 – TextMessage encoding / decoding
// ════════════════════════════════════════════════════════════════════════

/**
 * Encodes a group chat text message.
 *
 * - Enforces 140-character limit             (Req 11.2, 50.5)
 * - Creates TextMessage with message_id,
 *   sender_id, and payload                    (Req 11.1, 27.2)
 *
 * Requirements: 11.1, 11.2, 27.2, 50.5
 */
export function encodeTextMessage(
  messageId: string,
  senderId: string,
  payload: string,
): Uint8Array {
  if (payload.length > TEXT_MAX_CHARS) {
    throw new Error(
      `TextMessage payload exceeds ${TEXT_MAX_CHARS} character limit (got ${payload.length})`
    );
  }

  const msg = meshcore.TextMessage.create({
    messageId,
    senderId,
    payload,
  });
  return meshcore.TextMessage.encode(msg).finish();
}

/**
 * Decodes a TextMessage protobuf buffer.
 *
 * Requirements: 28.3
 */
export function decodeTextMessage(buffer: Uint8Array): DecodedTextMessage {
  const msg = meshcore.TextMessage.decode(buffer);

  // Validate required fields (Req 28.3)
  if (!msg.messageId) {
    throw new Error('TextMessage: missing required field messageId');
  }
  if (!msg.senderId) {
    throw new Error('TextMessage: missing required field senderId');
  }

  return {
    messageId: msg.messageId,
    senderId: msg.senderId,
    payload: msg.payload ?? '',
  };
}

// ════════════════════════════════════════════════════════════════════════
//  13.6 – SOSAlert encoding / decoding
// ════════════════════════════════════════════════════════════════════════

/**
 * Encodes an SOS alert packet.
 *
 * - Contains sender_id, timestamp, signal_type   (Req 13.1, 13.2)
 * - Serialized size ≈ 5–6 bytes                  (Req 27.7)
 *
 * Requirements: 13.1, 13.2, 27.3, 27.7
 */
export function encodeSOSAlert(
  senderId: string,
  timestamp: number,
  signalType: number,
): Uint8Array {
  const msg = meshcore.SOSAlert.create({
    senderId,
    timestamp,
    signalType,
  });
  return meshcore.SOSAlert.encode(msg).finish();
}

/**
 * Decodes an SOSAlert protobuf buffer.
 *
 * Requirements: 28.3
 */
export function decodeSOSAlert(buffer: Uint8Array): DecodedSOSAlert {
  const msg = meshcore.SOSAlert.decode(buffer);

  // Validate required fields (Req 28.3)
  if (!msg.senderId) {
    throw new Error('SOSAlert: missing required field senderId');
  }

  return {
    senderId: msg.senderId,
    timestamp: typeof msg.timestamp === 'object'
      ? (msg.timestamp as any).toNumber()
      : Number(msg.timestamp),
    signalType: msg.signalType ?? 0,
  };
}

// ════════════════════════════════════════════════════════════════════════
//  13.8 – SystemSignal encoding / decoding
// ════════════════════════════════════════════════════════════════════════

/**
 * Encodes a system control signal.
 *
 * Supported signal types (Req 15.2, 29.1, 30.1):
 *   0 = JOIN, 1 = LEAVE, 2 = END_TREK, 3 = WAYPOINT, 4 = GEOFENCE
 *
 * Requirements: 15.2, 27.4, 29.1, 30.1
 */
export function encodeSystemSignal(
  signalType: number,
  senderId: string,
  payload?: Uint8Array,
): Uint8Array {
  const msg = meshcore.SystemSignal.create({
    signalType,
    senderId,
    payload: payload ?? new Uint8Array(0),
  });
  return meshcore.SystemSignal.encode(msg).finish();
}

/**
 * Decodes a SystemSignal protobuf buffer.
 *
 * Requirements: 28.3
 */
export function decodeSystemSignal(buffer: Uint8Array): DecodedSystemSignal {
  const msg = meshcore.SystemSignal.decode(buffer);

  // Validate required fields (Req 28.3)
  if (!msg.senderId) {
    throw new Error('SystemSignal: missing required field senderId');
  }

  return {
    signalType: msg.signalType ?? 0,
    senderId: msg.senderId,
    payload: msg.payload instanceof Uint8Array
      ? msg.payload
      : new Uint8Array(msg.payload ?? []),
  };
}

// ════════════════════════════════════════════════════════════════════════
//  13.9 – MeshPacket envelope encoding / decoding
// ════════════════════════════════════════════════════════════════════════

/**
 * Encodes the MeshPacket envelope that wraps every mesh packet.
 *
 * Includes: packet_id, seq_num, ttl, priority, packet_type,
 *           payload (inner serialized message), signature (64 bytes)
 *
 * Requirements: 27.5, 28.1
 */
export function encodeMeshPacket(
  packetId: string,
  seqNum: number,
  ttl: number,
  priority: number,
  packetType: number,
  payload: Uint8Array,
  signature: Uint8Array,
): Uint8Array {
  const msg = meshcore.MeshPacket.create({
    packetId,
    seqNum,
    ttl,
    priority,
    packetType,
    payload,
    signature,
  });
  return meshcore.MeshPacket.encode(msg).finish();
}

/**
 * Decodes a MeshPacket envelope.
 *
 * Handles deserialization failures gracefully → throws with descriptive
 * message rather than crashing (Req 28.2).
 *
 * Requirements: 28.1, 28.2
 */
export function decodeMeshPacket(buffer: Uint8Array): DecodedMeshPacket {
  try {
    const msg = meshcore.MeshPacket.decode(buffer);

    // Validate required fields (Req 27.5)
    if (!msg.packetId) {
      throw new Error('MeshPacket: missing required field packetId');
    }

    return {
      packetId: msg.packetId,
      seqNum: msg.seqNum ?? 0,
      ttl: msg.ttl ?? 0,
      priority: msg.priority ?? 0,
      packetType: msg.packetType ?? 0,
      payload: msg.payload instanceof Uint8Array
        ? msg.payload
        : new Uint8Array(msg.payload ?? []),
      signature: msg.signature instanceof Uint8Array
        ? msg.signature
        : new Uint8Array(msg.signature ?? []),
    };
  } catch (err) {
    // Graceful handling of deserialization failures (Req 28.2)
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to decode MeshPacket: ${message}`);
  }
}

// ════════════════════════════════════════════════════════════════════════
//  13.13 – Sequence number generation and tracking
// ════════════════════════════════════════════════════════════════════════

/**
 * SequenceTracker manages per-sender monotonic sequence numbers for
 * outbound packets and gap detection for inbound packets.
 *
 * Requirements: 45.1, 45.2, 45.3, 45.4, 45.5
 */
export class SequenceTracker {
  /** Outbound sequence number counter (monotonically increasing) */
  private outboundSeqNum: number = 0;

  /** Last seen seq_num per sender for gap detection */
  private receivedSeqNums: Map<string, number> = new Map();

  /** Detected gaps: senderId → list of missing seq_nums */
  private detectedGaps: Map<string, number[]> = new Map();

  /**
   * Returns the next monotonically increasing sequence number for
   * a locally-created outbound packet.
   *
   * Requirements: 45.1, 45.2
   */
  getNextSeqNum(): number {
    this.outboundSeqNum += 1;
    return this.outboundSeqNum;
  }

  /**
   * Returns the current outbound sequence number (without incrementing).
   */
  getCurrentSeqNum(): number {
    return this.outboundSeqNum;
  }

  /**
   * Records a received sequence number from a sender and detects gaps.
   *
   * Requirements: 45.3, 45.4, 45.5
   *
   * @param senderId  The sender's Node_ID
   * @param seqNum    The seq_num from the received packet
   * @returns Array of missing sequence numbers (empty if no gaps)
   */
  recordReceived(senderId: string, seqNum: number): number[] {
    const lastSeen = this.receivedSeqNums.get(senderId);
    const missingNums: number[] = [];

    if (lastSeen !== undefined) {
      // Detect gaps: if seqNum > lastSeen + 1, there are missing packets
      if (seqNum > lastSeen + 1) {
        for (let i = lastSeen + 1; i < seqNum; i++) {
          missingNums.push(i);
        }

        // Log missing sequence numbers for diagnostics (Req 45.5)
        if (missingNums.length > 0) {
          console.warn(
            `[SequenceTracker] Gap detected from sender ${senderId}: ` +
            `expected ${lastSeen + 1}, got ${seqNum}. ` +
            `Missing: [${missingNums.join(', ')}]`
          );

          // Accumulate gaps
          const existing = this.detectedGaps.get(senderId) ?? [];
          this.detectedGaps.set(senderId, [...existing, ...missingNums]);
        }
      }
    }

    // Update last seen (only if this is a newer seq_num)
    if (lastSeen === undefined || seqNum > lastSeen) {
      this.receivedSeqNums.set(senderId, seqNum);
    }

    return missingNums;
  }

  /**
   * Returns all detected gaps for a given sender.
   *
   * Requirements: 45.4, 45.5
   */
  getGaps(senderId: string): number[] {
    return this.detectedGaps.get(senderId) ?? [];
  }

  /**
   * Returns all detected gaps across all senders.
   */
  getAllGaps(): Map<string, number[]> {
    return new Map(this.detectedGaps);
  }

  /**
   * Clears all tracking state (useful on trek end).
   */
  reset(): void {
    this.outboundSeqNum = 0;
    this.receivedSeqNums.clear();
    this.detectedGaps.clear();
  }
}
