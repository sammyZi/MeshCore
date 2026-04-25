/**
 * Mesh Networking Module
 *
 * Exports all mesh-related classes and utilities:
 * - BLEMeshManager:   BLE advertising, scanning, GATT connections, packet I/O
 * - WiFiDirectManager: Wi-Fi Direct transport fallback for large packets
 * - DuplicateCache:    LRU cache for mesh packet deduplication
 * - RouteCache:        AODV route cache with 10-minute expiry
 * - MeshRouter:        Gossip protocol, adaptive TTL, AODV, hybrid unicast
 * - PacketQueue:       Priority queue with SOS preemption and retry logic
 */

export { BLEMeshManager, MESH_LOCATION_TASK, MESH_BLE_WATCHDOG_TASK } from './BLEManager';
export { WiFiDirectManager } from './WiFiDirectManager';
export { DuplicateCache } from './DuplicateCache';
export { RouteCache } from './RouteCache';
export type { Route } from './RouteCache';
export {
  MeshRouter,
  PACKET_TYPE_LOCATION,
  PACKET_TYPE_TEXT,
  PACKET_TYPE_SOS,
  PACKET_TYPE_SYSTEM,
  PACKET_TYPE_RREQ,
  PACKET_TYPE_RREP,
  PRIORITY_SOS,
  PRIORITY_ACK,
  PRIORITY_SYSTEM,
  PRIORITY_LOCATION,
  PRIORITY_TEXT,
} from './MeshRouter';
export type { MeshPacketInfo, MeshRouterCallbacks } from './MeshRouter';
export {
  PacketQueue,
  PACKET_TYPE_PRIORITY_MAP,
} from './PacketQueue';
export type { QueuedPacket, PacketStatus, TransmitCallback } from './PacketQueue';
