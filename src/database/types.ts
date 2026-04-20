import * as schema from './schema';

/**
 * Type definitions for database entities
 */

// User types
export type User = typeof schema.users.$inferSelect;
export type NewUser = typeof schema.users.$inferInsert;

// Trek types
export type Trek = typeof schema.treks.$inferSelect;
export type NewTrek = typeof schema.treks.$inferInsert;

// Trek member types
export type TrekMember = typeof schema.trek_members.$inferSelect;
export type NewTrekMember = typeof schema.trek_members.$inferInsert;

// Location history types
export type LocationHistory = typeof schema.location_history.$inferSelect;
export type NewLocationHistory = typeof schema.location_history.$inferInsert;

// Message types
export type Message = typeof schema.messages.$inferSelect;
export type NewMessage = typeof schema.messages.$inferInsert;

// Pending queue types
export type PendingPacket = typeof schema.pending_queue.$inferSelect;
export type NewPendingPacket = typeof schema.pending_queue.$inferInsert;

// Security event types
export type SecurityEvent = typeof schema.security_events.$inferSelect;
export type NewSecurityEvent = typeof schema.security_events.$inferInsert;

// Status enums
export type TrekStatus = 'active' | 'ended';
export type MemberStatus = 'active' | 'left';
export type MessageStatus = 'pending' | 'sent' | 'failed';
export type PacketStatus = 'pending' | 'sent' | 'failed';
export type SecurityEventType = 'signature_failure' | 'unknown_node' | 'malformed_packet';

// Map region type
export interface MapRegion {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
}

// Emergency contact type
export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

// Geofence coordinate type
export interface Coordinate {
  latitude: number;
  longitude: number;
}
