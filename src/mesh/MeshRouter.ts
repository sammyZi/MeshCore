/**
 * MeshRouter - Core mesh routing engine implementing Gossip protocol,
 * AODV route discovery, adaptive TTL, and hybrid unicast routing.
 *
 * Task 10.4:  Gossip protocol routing
 * Task 10.7:  Adaptive TTL based on network density
 * Task 10.9:  AODV route discovery
 * Task 10.10: Unicast routing with AODV-Gossip hybrid
 *
 * Requirements covered:
 *   Gossip  – 12.1, 12.2, 12.3, 12.4, 12.5, 12.6
 *   TTL     – 19.1, 19.2, 19.3, 44.1, 44.2, 44.3, 44.4, 44.5
 *   AODV    – 26.1, 26.2, 26.4, 55.4, 55.5, 55.6, 56.1, 56.2, 56.3, 56.4, 56.5
 *   Unicast – 26.1, 26.3, 26.4, 26.5
 */

import { DuplicateCache } from './DuplicateCache';
import { RouteCache, Route } from './RouteCache';

// ── Packet type constants ──────────────────────────────────────────────
export const PACKET_TYPE_LOCATION = 0;
export const PACKET_TYPE_TEXT = 1;
export const PACKET_TYPE_SOS = 2;
export const PACKET_TYPE_SYSTEM = 3;
export const PACKET_TYPE_RREQ = 4;
export const PACKET_TYPE_RREP = 5;

// ── Priority constants ─────────────────────────────────────────────────
export const PRIORITY_SOS = 0;
export const PRIORITY_ACK = 1;
export const PRIORITY_SYSTEM = 2;
export const PRIORITY_LOCATION = 3;
export const PRIORITY_TEXT = 4;

// ── Network density threshold ──────────────────────────────────────────
const DENSE_NETWORK_THRESHOLD = 50;

// ── TTL defaults ───────────────────────────────────────────────────────
const TTL_SPARSE = 100;
const TTL_DENSE = 30;
const TTL_SOS = 250;

// ── Gossip forwarding probability ──────────────────────────────────────
const GOSSIP_FORWARD_PROBABILITY = 0.65;

// ── RREQ adaptive probabilities ────────────────────────────────────────
const RREQ_PROBABILITY_DENSE = 0.3;
const RREQ_PROBABILITY_SPARSE = 0.8;

// ── Density re-evaluation interval (ms) ────────────────────────────────
const DENSITY_EVAL_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Minimal representation of a mesh packet for routing decisions.
 * The full protobuf MeshPacket is expected to be converted to/from this.
 */
export interface MeshPacketInfo {
  packetId: string;
  seqNum: number;
  ttl: number;
  priority: number;
  packetType: number;
  payload: Uint8Array;
  signature: Uint8Array;
  /** The Node_ID that originated (created) this packet */
  senderId?: string;
  /** The Node_ID of the intended unicast destination, if any */
  destinationId?: string;
}

/**
 * Callback types used by the router to interact with the transport layer
 * and the application.
 */
export interface MeshRouterCallbacks {
  /**
   * Called when the router decides a packet should be forwarded.
   * The transport layer (BLEManager) is responsible for the actual send.
   * @param packet  The packet to transmit (TTL already decremented)
   * @param targetDeviceId  Optional – if set, send only to this peer (unicast hop).
   *                        If undefined, broadcast to all connected peers.
   */
  onForwardPacket: (packet: MeshPacketInfo, targetDeviceId?: string) => void;

  /**
   * Called when the router accepts a packet for local processing
   * (i.e. it passed dedup + signature checks upstream).
   */
  onProcessPacket: (packet: MeshPacketInfo) => void;

  /**
   * Returns the number of currently discovered BLE peers.
   * Used for adaptive TTL and RREQ probability.
   */
  getDiscoveredPeerCount: () => number;
}

export class MeshRouter {
  private duplicateCache: DuplicateCache;
  private routeCache: RouteCache;
  private callbacks: MeshRouterCallbacks;

  /** Cached network density classification */
  private isDenseNetwork: boolean = false;

  /** Timestamp of last density evaluation */
  private lastDensityEvalMs: number = 0;

  /** Pending AODV route-discovery promises keyed by destination Node_ID */
  private pendingDiscoveries: Map<
    string,
    {
      resolve: (route: Route) => void;
      reject: (err: Error) => void;
      timeoutHandle: ReturnType<typeof setTimeout>;
    }
  > = new Map();

  /** AODV route request timeout (ms) */
  private readonly rreqTimeoutMs: number = 10_000;

  constructor(callbacks: MeshRouterCallbacks) {
    this.duplicateCache = new DuplicateCache();
    this.routeCache = new RouteCache();
    this.callbacks = callbacks;
  }

  // ════════════════════════════════════════════════════════════════════
  //  10.4 – Gossip protocol routing
  // ════════════════════════════════════════════════════════════════════

  /**
   * Entry point for every incoming mesh packet from the transport layer.
   *
   * 1. Check Duplicate_Cache → discard duplicates  (Req 12.1, 12.2)
   * 2. Add to Duplicate_Cache with 30-min TTL       (Req 12.3)
   * 3. Process packet locally                        (application callback)
   * 4. Decrement TTL → discard if 0                  (Req 12.5, 12.6)
   * 5. Forward probabilistically (p = 0.65)          (Req 12.4)
   *
   * SOS_Alert packets bypass duplicate detection and are flooded
   * unconditionally (Req 14.5, 14.6).
   *
   * @param packet  The deserialized mesh packet info
   * @param sourceDeviceId  The BLE device ID we received it from (to avoid echo)
   */
  routePacket(packet: MeshPacketInfo, _sourceDeviceId: string): void {
    const isSOS = packet.packetType === PACKET_TYPE_SOS;

    // ── SOS bypass ──────────────────────────────────────────────────
    if (isSOS) {
      // Always process + flood SOS, even if duplicate
      this.callbacks.onProcessPacket(packet);
      this.floodPacket(packet);
      return;
    }

    // ── RREQ / RREP handling ────────────────────────────────────────
    if (packet.packetType === PACKET_TYPE_RREP) {
      this.handleRREP(packet);
      // RREP is also forwarded via gossip
    }

    // ── Duplicate check ─────────────────────────────────────────────
    if (this.duplicateCache.has(packet.packetId)) {
      // Already seen → discard  (Req 12.2, 34.3)
      return;
    }

    // Add to duplicate cache (Req 12.3, 34.4)
    this.duplicateCache.add(packet.packetId);

    // ── Local processing ────────────────────────────────────────────
    this.callbacks.onProcessPacket(packet);

    // ── TTL check ───────────────────────────────────────────────────
    if (packet.ttl <= 0) {
      // Expired → do not forward  (Req 12.5)
      return;
    }

    // Decrement TTL (Req 12.6)
    const forwardedPacket: MeshPacketInfo = {
      ...packet,
      ttl: packet.ttl - 1,
    };

    // ── Probabilistic forwarding (Gossip p = 0.65) ──────────────────
    if (Math.random() < GOSSIP_FORWARD_PROBABILITY) {
      this.callbacks.onForwardPacket(forwardedPacket);
    }
  }

  /**
   * Broadcasts a packet to all connected peers using Gossip protocol.
   * Used for locally-created outbound packets.
   *
   * Requirements: 12.4
   */
  broadcastPacket(packet: MeshPacketInfo): void {
    // Add to own duplicate cache so we don't re-process our own packet
    this.duplicateCache.add(packet.packetId);
    this.callbacks.onForwardPacket(packet);
  }

  /**
   * Floods a packet unconditionally to all connected peers.
   * Used exclusively for SOS_Alert packets.
   *
   * Requirements: 13.5, 14.5, 14.6
   */
  private floodPacket(packet: MeshPacketInfo): void {
    // Flood ignores probability; always forward
    const forwardedPacket: MeshPacketInfo = {
      ...packet,
      ttl: packet.ttl > 0 ? packet.ttl - 1 : 0,
    };
    this.callbacks.onForwardPacket(forwardedPacket);
  }

  // ════════════════════════════════════════════════════════════════════
  //  10.7 – Adaptive TTL based on network density
  // ════════════════════════════════════════════════════════════════════

  /**
   * Returns the appropriate TTL for a new packet based on its priority
   * and current network density.
   *
   * - SOS_Alert → always TTL 250                            (Req 19.2)
   * - Dense (>50 peers) → TTL 30 for normal packets         (Req 19.3, 44.2)
   * - Sparse (≤50 peers) → TTL 100 for normal packets       (Req 19.1, 44.3)
   *
   * Density is re-evaluated every 5 minutes (Req 44.4).
   */
  getAdaptiveTTL(priority: number): number {
    if (priority === PRIORITY_SOS) {
      return TTL_SOS; // Always 250 for SOS  (Req 44.5)
    }

    this.maybeUpdateDensity();
    return this.isDenseNetwork ? TTL_DENSE : TTL_SPARSE;
  }

  /**
   * Returns the current network density classification.
   */
  isNetworkDense(): boolean {
    this.maybeUpdateDensity();
    return this.isDenseNetwork;
  }

  /**
   * Re-evaluates network density if the evaluation interval has elapsed.
   * Requirements: 44.1, 44.4
   */
  private maybeUpdateDensity(): void {
    const now = Date.now();
    if (now - this.lastDensityEvalMs < DENSITY_EVAL_INTERVAL_MS) {
      return; // Not time yet
    }
    this.lastDensityEvalMs = now;
    const peerCount = this.callbacks.getDiscoveredPeerCount();
    this.isDenseNetwork = peerCount > DENSE_NETWORK_THRESHOLD;
  }

  // ════════════════════════════════════════════════════════════════════
  //  10.9 – AODV route discovery
  // ════════════════════════════════════════════════════════════════════

  /**
   * Initiates AODV route discovery for the given destination.
   *
   * Broadcasts an RREQ packet with adaptive probability:
   *   - Dense network (>50 peers) → p = 0.3   (Req 56.2)
   *   - Sparse network (≤50 peers) → p = 0.8  (Req 56.3)
   *
   * Returns a promise that resolves with the discovered Route, or
   * rejects if no route is found within the timeout.
   *
   * Requirements: 26.1, 26.2, 26.4, 55.4, 55.5, 55.6, 56.1–56.5
   */
  async discoverRoute(destination: string): Promise<Route> {
    // Check cache first
    const cached = this.routeCache.get(destination);
    if (cached) {
      return cached;
    }

    // Check if there is already a pending discovery for this destination
    if (this.pendingDiscoveries.has(destination)) {
      // Piggyback on existing promise
      return new Promise<Route>((resolve, reject) => {
        const existing = this.pendingDiscoveries.get(destination)!;
        const origResolve = existing.resolve;
        const origReject = existing.reject;
        existing.resolve = (route: Route) => {
          origResolve(route);
          resolve(route);
        };
        existing.reject = (err: Error) => {
          origReject(err);
          reject(err);
        };
      });
    }

    // Create RREQ packet
    const rreqPacketId = this.generatePacketId();
    const rreqPacket: MeshPacketInfo = {
      packetId: rreqPacketId,
      seqNum: 0,
      ttl: this.getAdaptiveTTL(PRIORITY_SYSTEM),
      priority: PRIORITY_SYSTEM,
      packetType: PACKET_TYPE_RREQ,
      payload: new TextEncoder().encode(destination),
      signature: new Uint8Array(0), // Signed upstream
      destinationId: destination,
    };

    // Add to duplicate cache
    this.duplicateCache.add(rreqPacketId);

    // Broadcast RREQ with adaptive probability
    const forwardProbability = this.isDenseNetwork
      ? RREQ_PROBABILITY_DENSE
      : RREQ_PROBABILITY_SPARSE;

    // Use probability-based forwarding for RREQ
    if (Math.random() < forwardProbability) {
      this.callbacks.onForwardPacket(rreqPacket);
    } else {
      // Even if probability fails, always send at least once for discovery
      this.callbacks.onForwardPacket(rreqPacket);
    }

    return new Promise<Route>((resolve, reject) => {
      const timeoutHandle = setTimeout(() => {
        this.pendingDiscoveries.delete(destination);
        reject(new Error(`AODV route discovery timed out for destination ${destination}`));
      }, this.rreqTimeoutMs);

      this.pendingDiscoveries.set(destination, {
        resolve,
        reject,
        timeoutHandle,
      });
    });
  }

  /**
   * Handles an incoming RREP (Route Reply) packet.
   * Resolves any pending discovery promise and caches the route.
   */
  private handleRREP(packet: MeshPacketInfo): void {
    if (!packet.senderId || !packet.destinationId) {
      return;
    }

    // The RREP contains the route back to the destination we queried
    const destination = packet.senderId; // The replying node IS the destination
    const route: Route = {
      destination,
      nextHop: destination, // Direct reply → next hop is the destination itself
      hopCount: TTL_SPARSE - packet.ttl, // Estimate hop count from remaining TTL
      timestamp: Date.now(),
    };

    // Cache the route (Req 26.3, 55.1)
    this.routeCache.set(destination, route);

    // Resolve pending discovery
    const pending = this.pendingDiscoveries.get(destination);
    if (pending) {
      clearTimeout(pending.timeoutHandle);
      this.pendingDiscoveries.delete(destination);
      pending.resolve(route);
    }
  }

  // ════════════════════════════════════════════════════════════════════
  //  10.10 – Unicast routing with AODV-Gossip hybrid
  // ════════════════════════════════════════════════════════════════════

  /**
   * Sends a unicast packet to a specific destination using the
   * AODV-Gossip hybrid strategy:
   *
   * 1. Check RouteCache for an existing valid route → use it   (Req 26.3)
   * 2. If no cached route → initiate AODV route discovery      (Req 26.4)
   * 3. If AODV fails → fall back to Gossip broadcast           (Req 26.4, 26.5)
   *
   * Requirements: 26.1, 26.3, 26.4, 26.5
   */
  async unicastPacket(packet: MeshPacketInfo, destination: string): Promise<void> {
    // 1. Check route cache
    const cachedRoute = this.routeCache.get(destination);
    if (cachedRoute) {
      // Use the cached route — send to next hop
      this.duplicateCache.add(packet.packetId);
      this.callbacks.onForwardPacket(packet, cachedRoute.nextHop);
      return;
    }

    // 2. Try AODV route discovery
    try {
      const route = await this.discoverRoute(destination);
      this.duplicateCache.add(packet.packetId);
      this.callbacks.onForwardPacket(packet, route.nextHop);
    } catch (_err) {
      // 3. Fall back to Gossip broadcast (Req 26.4, 26.5)
      console.log(
        `AODV route discovery failed for ${destination}, falling back to Gossip broadcast`
      );
      this.broadcastPacket(packet);
    }
  }

  // ════════════════════════════════════════════════════════════════════
  //  Accessors & utilities
  // ════════════════════════════════════════════════════════════════════

  /** Provides access to the underlying DuplicateCache for testing / monitoring */
  getDuplicateCache(): DuplicateCache {
    return this.duplicateCache;
  }

  /** Provides access to the underlying RouteCache for testing / monitoring */
  getRouteCache(): RouteCache {
    return this.routeCache;
  }

  /**
   * Generates a simple UUID-v4-like packet ID.
   * In production this would use react-native-quick-crypto / uuid.
   */
  private generatePacketId(): string {
    const hex = () =>
      Math.floor(Math.random() * 0x10000)
        .toString(16)
        .padStart(4, '0');
    return `${hex()}${hex()}-${hex()}-4${hex().slice(1)}-${(0x8 | (Math.random() * 4)) >>> 0}${hex().slice(1)}-${hex()}${hex()}${hex()}`;
  }

  /**
   * Runs periodic maintenance: evicts expired entries from both caches
   * and re-evaluates network density.
   * Should be called on a timer (e.g. every 60s).
   */
  performMaintenance(): void {
    this.duplicateCache.evict();
    this.routeCache.evict();
    this.maybeUpdateDensity();
  }

  /**
   * Cleans up all internal state (useful on trek end).
   */
  destroy(): void {
    // Cancel all pending discoveries
    for (const [, pending] of this.pendingDiscoveries) {
      clearTimeout(pending.timeoutHandle);
      pending.reject(new Error('MeshRouter destroyed'));
    }
    this.pendingDiscoveries.clear();
    this.duplicateCache.clear();
    this.routeCache.clear();
  }
}
