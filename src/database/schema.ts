import { sqliteTable, text, integer, real, blob, index } from 'drizzle-orm/sqlite-core';

/**
 * Users table - stores user profile information
 * Requirements: 24.1
 */
export const users = sqliteTable('users', {
  user_id: text('user_id').primaryKey(),
  email: text('email').notNull(),
  display_name: text('display_name').notNull(),
  avatar_color: text('avatar_color').notNull(),
  public_key: blob('public_key').notNull(),
  node_id: text('node_id').notNull(),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull(),
});

/**
 * Treks table - stores trek session metadata
 * Requirements: 24.2
 */
export const treks = sqliteTable('treks', {
  trek_id: text('trek_id').primaryKey(),
  trek_name: text('trek_name').notNull(),
  join_code: text('join_code').notNull(),
  leader_id: text('leader_id').notNull(),
  start_time: integer('start_time', { mode: 'timestamp' }).notNull(),
  end_time: integer('end_time', { mode: 'timestamp' }),
  status: text('status').notNull(), // 'active', 'ended'
  map_region: text('map_region').notNull(), // JSON: {minLat, maxLat, minLon, maxLon}
  service_uuid: text('service_uuid').notNull(),
  emergency_contact: text('emergency_contact'), // JSON: {name, phone, relationship}
  geofence: text('geofence'), // JSON: array of coordinates
});

/**
 * Trek members table - stores member information for each trek
 * Requirements: 24.3
 */
export const trek_members = sqliteTable('trek_members', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  trek_id: text('trek_id').notNull().references(() => treks.trek_id),
  user_id: text('user_id').notNull(),
  display_name: text('display_name').notNull(),
  avatar_color: text('avatar_color').notNull(),
  public_key: blob('public_key').notNull(),
  node_id: text('node_id').notNull(),
  joined_at: integer('joined_at', { mode: 'timestamp' }).notNull(),
  left_at: integer('left_at', { mode: 'timestamp' }),
  status: text('status').notNull(), // 'active', 'left'
});

/**
 * Location history table - stores GPS location updates
 * Requirements: 24.4
 */
export const location_history = sqliteTable(
  'location_history',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    trek_id: text('trek_id').notNull().references(() => treks.trek_id),
    user_id: text('user_id').notNull(),
    latitude: real('latitude').notNull(),
    longitude: real('longitude').notNull(),
    altitude: integer('altitude').notNull(),
    accuracy: real('accuracy').notNull(),
    timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
  },
  (table) => ({
    // Composite index for efficient location queries
    location_history_trek_user_idx: index('location_history_trek_user_idx').on(
      table.trek_id,
      table.user_id,
      table.timestamp
    ),
  })
);

/**
 * Messages table - stores chat messages
 * Requirements: 24.5
 */
export const messages = sqliteTable(
  'messages',
  {
    message_id: text('message_id').primaryKey(),
    trek_id: text('trek_id').notNull().references(() => treks.trek_id),
    sender_id: text('sender_id').notNull(),
    sender_name: text('sender_name').notNull(),
    payload: text('payload').notNull(),
    timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
    status: text('status').notNull(), // 'pending', 'sent', 'failed'
  },
  (table) => ({
    // Index for efficient message retrieval
    messages_trek_timestamp_idx: index('messages_trek_timestamp_idx').on(
      table.trek_id,
      table.timestamp
    ),
  })
);

/**
 * Pending queue table - stores outbound mesh packets
 * Requirements: 24.6
 */
export const pending_queue = sqliteTable(
  'pending_queue',
  {
    packet_id: text('packet_id').primaryKey(),
    trek_id: text('trek_id').notNull().references(() => treks.trek_id),
    priority: integer('priority').notNull(),
    ttl: integer('ttl').notNull(),
    payload: blob('payload').notNull(),
    signature: blob('signature').notNull(),
    retry_count: integer('retry_count').notNull().default(0),
    status: text('status').notNull(), // 'pending', 'sent', 'failed'
    created_at: integer('created_at', { mode: 'timestamp' }).notNull(),
    next_retry_at: integer('next_retry_at', { mode: 'timestamp' }),
  },
  (table) => ({
    // Index for efficient packet queue processing
    pending_queue_status_priority_idx: index('pending_queue_status_priority_idx').on(
      table.status,
      table.priority,
      table.next_retry_at
    ),
  })
);

/**
 * Security events table - stores security audit logs
 * Requirements: 24.7
 */
export const security_events = sqliteTable(
  'security_events',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    trek_id: text('trek_id').notNull().references(() => treks.trek_id),
    event_type: text('event_type').notNull(), // 'signature_failure', 'unknown_node', 'malformed_packet'
    node_id: text('node_id'),
    details: text('details'), // JSON with additional context
    timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
  },
  (table) => ({
    // Index for efficient security audit queries
    security_events_trek_timestamp_idx: index('security_events_trek_timestamp_idx').on(
      table.trek_id,
      table.timestamp
    ),
  })
);
