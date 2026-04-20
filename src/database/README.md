# Database Module

This module provides offline-first data persistence for the MeshCore application using expo-sqlite and Drizzle ORM.

## Overview

The database module implements all seven tables required for offline trek operation:

1. **users** - User profile information
2. **treks** - Trek session metadata
3. **trek_members** - Member information for each trek
4. **location_history** - GPS location updates
5. **messages** - Chat messages
6. **pending_queue** - Outbound mesh packets
7. **security_events** - Security audit logs

## Architecture

- **DatabaseManager**: Singleton class managing all database operations
- **schema.ts**: Drizzle ORM schema definitions
- **types.ts**: TypeScript type definitions
- **Indexes**: Optimized for common query patterns

## Usage

### Initialization

```typescript
import { DatabaseManager } from './database';

const db = DatabaseManager.getInstance();
await db.initialize();
```

### User Operations

```typescript
// Insert user
await db.insertUser({
  user_id: 'user-123',
  email: 'user@example.com',
  display_name: 'John Doe',
  avatar_color: '#FF5733',
  public_key: Buffer.from('...'),
  node_id: 'abcd1234',
  created_at: new Date(),
});

// Get user
const user = await db.getUser('user-123');

// Update user
await db.updateUser('user-123', {
  display_name: 'Jane Doe',
});
```

### Trek Operations

```typescript
// Insert trek
await db.insertTrek({
  trek_id: 'trek-456',
  trek_name: 'Mountain Trek',
  join_code: 'ABC123',
  leader_id: 'user-123',
  start_time: new Date(),
  status: 'active',
  map_region: JSON.stringify({ minLat: 0, maxLat: 1, minLon: 0, maxLon: 1 }),
  service_uuid: 'uuid-...',
});

// Get trek
const trek = await db.getTrek('trek-456');

// Update trek
await db.updateTrek('trek-456', {
  status: 'ended',
  end_time: new Date(),
});
```

### Location Operations

```typescript
// Insert location
await db.insertLocation({
  trek_id: 'trek-456',
  user_id: 'user-123',
  latitude: 37.7749,
  longitude: -122.4194,
  altitude: 100,
  accuracy: 5.0,
  timestamp: new Date(),
});

// Get location history with pagination
const history = await db.getLocationHistory('trek-456', 'user-123', 100, 0);
```

### Message Operations

```typescript
// Insert message
await db.insertMessage({
  message_id: 'msg-789',
  trek_id: 'trek-456',
  sender_id: 'user-123',
  sender_name: 'John Doe',
  payload: 'Hello, world!',
  timestamp: new Date(),
  status: 'pending',
});

// Get messages
const messages = await db.getMessages('trek-456');

// Update message status
await db.updateMessageStatus('msg-789', 'sent');
```

### Packet Queue Operations

```typescript
// Insert packet
await db.insertPacket({
  packet_id: 'pkt-001',
  trek_id: 'trek-456',
  priority: 3,
  ttl: 100,
  payload: Buffer.from('...'),
  signature: Buffer.from('...'),
  retry_count: 0,
  status: 'pending',
  created_at: new Date(),
});

// Get pending packets
const packets = await db.getPendingPackets(50);

// Update packet status
await db.updatePacketStatus('pkt-001', 'sent', 1);
```

### Security Event Operations

```typescript
// Insert security event
await db.insertSecurityEvent({
  trek_id: 'trek-456',
  event_type: 'signature_failure',
  node_id: 'abcd1234',
  details: JSON.stringify({ reason: 'Invalid signature' }),
  timestamp: new Date(),
});

// Get security events
const events = await db.getSecurityEvents('trek-456');
```

## Error Handling

All write operations include automatic retry logic with exponential backoff:
- Maximum 3 retry attempts
- Exponential backoff: 1s, 2s, 4s
- Throws error after all retries exhausted

## Database Integrity

The DatabaseManager performs integrity checks on initialization using SQLite's `PRAGMA integrity_check`.

## Indexes

Optimized indexes for common query patterns:

- **location_history_trek_user_idx**: (trek_id, user_id, timestamp)
- **messages_trek_timestamp_idx**: (trek_id, timestamp)
- **pending_queue_status_priority_idx**: (status, priority, next_retry_at)
- **security_events_trek_timestamp_idx**: (trek_id, timestamp)

## Requirements Mapping

- **Requirement 24.1**: User profile storage
- **Requirement 24.2**: Trek metadata storage
- **Requirement 24.3**: Trek member information storage
- **Requirement 24.4**: Location history storage with indexes
- **Requirement 24.5**: Chat message storage
- **Requirement 24.6**: Packet queue storage
- **Requirement 24.7**: Security event logging
- **Requirement 24.8**: Database initialization and integrity checks
