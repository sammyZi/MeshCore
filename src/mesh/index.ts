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
 * - PacketCodec:       Protobuf serialization / deserialization for all packet types
 * - SequenceTracker:   Monotonic seq_num generation and gap detection
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
export {
  // Encoding
  encodeLocationUpdate,
  encodeTextMessage,
  encodeSOSAlert,
  encodeSystemSignal,
  encodeMeshPacket,
  // Decoding
  decodeLocationUpdate,
  decodeTextMessage,
  decodeSOSAlert,
  decodeSystemSignal,
  decodeMeshPacket,
  // Sequence tracking
  SequenceTracker,
  // Signal type constants
  SIGNAL_JOIN,
  SIGNAL_LEAVE,
  SIGNAL_END_TREK,
  SIGNAL_WAYPOINT,
  SIGNAL_GEOFENCE,
  SOS_EMERGENCY,
  SOS_MEDICAL,
  SOS_LOST,
} from './PacketCodec';
export type {
  DecodedLocationUpdate,
  DecodedTextMessage,
  DecodedSOSAlert,
  DecodedSystemSignal,
  DecodedMeshPacket,
} from './PacketCodec';
