import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import { eq, and, desc } from 'drizzle-orm';
import * as schema from './schema';

/**
 * DatabaseManager - Manages SQLite database operations using Drizzle ORM
 * Requirements: 24.1, 24.2, 24.3, 24.4, 24.5, 24.6, 24.7, 24.8
 */
export class DatabaseManager {
  private db: ReturnType<typeof drizzle> | null = null;
  private expoDb: ReturnType<typeof openDatabaseSync> | null = null;
  private static instance: DatabaseManager | null = null;
  private readonly DB_NAME = 'meshcore.db';

  private constructor() {}

  /**
   * Get singleton instance of DatabaseManager
   */
  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  /**
   * Initialize database connection and run migrations
   * Requirements: 24.8
   */
  public async initialize(): Promise<void> {
    try {
      // Open database connection
      this.expoDb = openDatabaseSync(this.DB_NAME);
      this.db = drizzle(this.expoDb);

      // Run integrity check
      await this.checkIntegrity();

      // Create tables if they don't exist
      await this.createTables();

      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw new Error(`Failed to initialize database: ${error}`);
    }
  }

  /**
   * Check database integrity using SQLite PRAGMA
   * Requirements: 24.8
   */
  private async checkIntegrity(): Promise<void> {
    if (!this.expoDb) {
      throw new Error('Database not initialized');
    }

    try {
      const result = this.expoDb.execSync('PRAGMA integrity_check') as any;
      if (result && result.length > 0 && result[0].integrity_check !== 'ok') {
        throw new Error('Database integrity check failed');
      }
    } catch (error) {
      console.error('Database integrity check error:', error);
      throw error;
    }
  }

  /**
   * Create database tables
   */
  private async createTables(): Promise<void> {
    if (!this.expoDb) {
      throw new Error('Database not initialized');
    }

    // Create users table
    this.expoDb.execSync(`
      CREATE TABLE IF NOT EXISTS users (
        user_id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        display_name TEXT NOT NULL,
        avatar_color TEXT NOT NULL,
        public_key BLOB NOT NULL,
        node_id TEXT NOT NULL,
        created_at INTEGER NOT NULL
      )
    `);

    // Create treks table
    this.expoDb.execSync(`
      CREATE TABLE IF NOT EXISTS treks (
        trek_id TEXT PRIMARY KEY,
        trek_name TEXT NOT NULL,
        join_code TEXT NOT NULL,
        leader_id TEXT NOT NULL,
        start_time INTEGER NOT NULL,
        end_time INTEGER,
        status TEXT NOT NULL,
        map_region TEXT NOT NULL,
        service_uuid TEXT NOT NULL,
        emergency_contact TEXT,
        geofence TEXT
      )
    `);

    // Create trek_members table
    this.expoDb.execSync(`
      CREATE TABLE IF NOT EXISTS trek_members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        trek_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        display_name TEXT NOT NULL,
        avatar_color TEXT NOT NULL,
        public_key BLOB NOT NULL,
        node_id TEXT NOT NULL,
        joined_at INTEGER NOT NULL,
        left_at INTEGER,
        status TEXT NOT NULL,
        FOREIGN KEY (trek_id) REFERENCES treks(trek_id)
      )
    `);

    // Create location_history table
    this.expoDb.execSync(`
      CREATE TABLE IF NOT EXISTS location_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        trek_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        altitude INTEGER NOT NULL,
        accuracy REAL NOT NULL,
        timestamp INTEGER NOT NULL,
        FOREIGN KEY (trek_id) REFERENCES treks(trek_id)
      )
    `);

    // Create location_history index
    this.expoDb.execSync(`
      CREATE INDEX IF NOT EXISTS location_history_trek_user_idx 
      ON location_history(trek_id, user_id, timestamp)
    `);

    // Create messages table
    this.expoDb.execSync(`
      CREATE TABLE IF NOT EXISTS messages (
        message_id TEXT PRIMARY KEY,
        trek_id TEXT NOT NULL,
        sender_id TEXT NOT NULL,
        sender_name TEXT NOT NULL,
        payload TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        status TEXT NOT NULL,
        FOREIGN KEY (trek_id) REFERENCES treks(trek_id)
      )
    `);

    // Create messages index
    this.expoDb.execSync(`
      CREATE INDEX IF NOT EXISTS messages_trek_timestamp_idx 
      ON messages(trek_id, timestamp)
    `);

    // Create pending_queue table
    this.expoDb.execSync(`
      CREATE TABLE IF NOT EXISTS pending_queue (
        packet_id TEXT PRIMARY KEY,
        trek_id TEXT NOT NULL,
        priority INTEGER NOT NULL,
        ttl INTEGER NOT NULL,
        payload BLOB NOT NULL,
        signature BLOB NOT NULL,
        retry_count INTEGER NOT NULL DEFAULT 0,
        status TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        next_retry_at INTEGER,
        FOREIGN KEY (trek_id) REFERENCES treks(trek_id)
      )
    `);

    // Create pending_queue index
    this.expoDb.execSync(`
      CREATE INDEX IF NOT EXISTS pending_queue_status_priority_idx 
      ON pending_queue(status, priority, next_retry_at)
    `);

    // Create security_events table
    this.expoDb.execSync(`
      CREATE TABLE IF NOT EXISTS security_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        trek_id TEXT NOT NULL,
        event_type TEXT NOT NULL,
        node_id TEXT,
        details TEXT,
        timestamp INTEGER NOT NULL,
        FOREIGN KEY (trek_id) REFERENCES treks(trek_id)
      )
    `);

    // Create security_events index
    this.expoDb.execSync(`
      CREATE INDEX IF NOT EXISTS security_events_trek_timestamp_idx 
      ON security_events(trek_id, timestamp)
    `);
  }

  /**
   * Get database instance
   */
  private getDb() {
    if (!this.db) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.db;
  }

  /**
   * Retry wrapper for write operations
   * Requirements: 24.1, 24.2, 24.3, 24.4, 24.5, 24.6, 24.7
   */
  private async retryWrite<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        console.warn(`Write operation failed (attempt ${attempt + 1}/${maxRetries}):`, error);
        
        // Wait before retry with exponential backoff
        if (attempt < maxRetries - 1) {
          await new Promise<void>(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }
    
    throw new Error(`Write operation failed after ${maxRetries} retries: ${lastError?.message}`);
  }

  // ==================== User Operations ====================

  /**
   * Insert a new user
   * Requirements: 24.1
   */
  public async insertUser(user: {
    user_id: string;
    email: string;
    display_name: string;
    avatar_color: string;
    public_key: Uint8Array | any;
    node_id: string;
    created_at: Date;
  }): Promise<void> {
    await this.retryWrite(async () => {
      await this.getDb().insert(schema.users).values(user);
    });
  }

  /**
   * Get user by ID
   * Requirements: 24.1
   */
  public async getUser(userId: string): Promise<typeof schema.users.$inferSelect | null> {
    const result = await this.getDb()
      .select()
      .from(schema.users)
      .where(eq(schema.users.user_id, userId))
      .limit(1);
    
    return result[0] || null;
  }

  /**
   * Update user information
   * Requirements: 24.1
   */
  public async updateUser(
    userId: string,
    updates: Partial<Omit<typeof schema.users.$inferInsert, 'user_id'>>
  ): Promise<void> {
    await this.retryWrite(async () => {
      await this.getDb()
        .update(schema.users)
        .set(updates)
        .where(eq(schema.users.user_id, userId));
    });
  }

  // ==================== Trek Operations ====================

  /**
   * Insert a new trek
   * Requirements: 24.2
   */
  public async insertTrek(trek: typeof schema.treks.$inferInsert): Promise<void> {
    await this.retryWrite(async () => {
      await this.getDb().insert(schema.treks).values(trek);
    });
  }

  /**
   * Get trek by ID
   * Requirements: 24.2
   */
  public async getTrek(trekId: string): Promise<typeof schema.treks.$inferSelect | null> {
    const result = await this.getDb()
      .select()
      .from(schema.treks)
      .where(eq(schema.treks.trek_id, trekId))
      .limit(1);
    
    return result[0] || null;
  }

  /**
   * Update trek information
   * Requirements: 24.2
   */
  public async updateTrek(
    trekId: string,
    updates: Partial<Omit<typeof schema.treks.$inferInsert, 'trek_id'>>
  ): Promise<void> {
    await this.retryWrite(async () => {
      await this.getDb()
        .update(schema.treks)
        .set(updates)
        .where(eq(schema.treks.trek_id, trekId));
    });
  }

  // ==================== Trek Member Operations ====================

  /**
   * Insert a new trek member
   * Requirements: 24.3
   */
  public async insertTrekMember(
    member: Omit<typeof schema.trek_members.$inferInsert, 'id'>
  ): Promise<void> {
    await this.retryWrite(async () => {
      await this.getDb().insert(schema.trek_members).values(member);
    });
  }

  /**
   * Get all members of a trek
   * Requirements: 24.3
   */
  public async getTrekMembers(
    trekId: string
  ): Promise<(typeof schema.trek_members.$inferSelect)[]> {
    return await this.getDb()
      .select()
      .from(schema.trek_members)
      .where(eq(schema.trek_members.trek_id, trekId));
  }

  /**
   * Update trek member information
   * Requirements: 24.3
   */
  public async updateTrekMember(
    memberId: number,
    updates: Partial<Omit<typeof schema.trek_members.$inferInsert, 'id'>>
  ): Promise<void> {
    await this.retryWrite(async () => {
      await this.getDb()
        .update(schema.trek_members)
        .set(updates)
        .where(eq(schema.trek_members.id, memberId));
    });
  }

  // ==================== Location Operations ====================

  /**
   * Insert a location update
   * Requirements: 24.4
   */
  public async insertLocation(
    location: Omit<typeof schema.location_history.$inferInsert, 'id'>
  ): Promise<void> {
    await this.retryWrite(async () => {
      await this.getDb().insert(schema.location_history).values(location);
    });
  }

  /**
   * Get location history for a user with pagination
   * Requirements: 24.4
   */
  public async getLocationHistory(
    trekId: string,
    userId: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<(typeof schema.location_history.$inferSelect)[]> {
    return await this.getDb()
      .select()
      .from(schema.location_history)
      .where(
        and(
          eq(schema.location_history.trek_id, trekId),
          eq(schema.location_history.user_id, userId)
        )
      )
      .orderBy(desc(schema.location_history.timestamp))
      .limit(limit)
      .offset(offset);
  }

  // ==================== Message Operations ====================

  /**
   * Insert a message
   * Requirements: 24.5
   */
  public async insertMessage(
    message: typeof schema.messages.$inferInsert
  ): Promise<void> {
    await this.retryWrite(async () => {
      await this.getDb().insert(schema.messages).values(message);
    });
  }

  /**
   * Get messages for a trek
   * Requirements: 24.5
   */
  public async getMessages(
    trekId: string,
    limit: number = 100
  ): Promise<(typeof schema.messages.$inferSelect)[]> {
    return await this.getDb()
      .select()
      .from(schema.messages)
      .where(eq(schema.messages.trek_id, trekId))
      .orderBy(desc(schema.messages.timestamp))
      .limit(limit);
  }

  /**
   * Update message status
   * Requirements: 24.5
   */
  public async updateMessageStatus(
    messageId: string,
    status: 'pending' | 'sent' | 'failed'
  ): Promise<void> {
    await this.retryWrite(async () => {
      await this.getDb()
        .update(schema.messages)
        .set({ status })
        .where(eq(schema.messages.message_id, messageId));
    });
  }

  // ==================== Packet Queue Operations ====================

  /**
   * Insert a packet into the queue
   * Requirements: 24.6
   */
  public async insertPacket(
    packet: typeof schema.pending_queue.$inferInsert
  ): Promise<void> {
    await this.retryWrite(async () => {
      await this.getDb().insert(schema.pending_queue).values(packet);
    });
  }

  /**
   * Get pending packets ordered by priority
   * Requirements: 24.6
   */
  public async getPendingPackets(
    limit: number = 50
  ): Promise<(typeof schema.pending_queue.$inferSelect)[]> {
    return await this.getDb()
      .select()
      .from(schema.pending_queue)
      .where(eq(schema.pending_queue.status, 'pending'))
      .orderBy(schema.pending_queue.priority, schema.pending_queue.created_at)
      .limit(limit);
  }

  /**
   * Update packet status
   * Requirements: 24.6
   */
  public async updatePacketStatus(
    packetId: string,
    status: 'pending' | 'sent' | 'failed',
    retryCount?: number,
    nextRetryAt?: Date
  ): Promise<void> {
    await this.retryWrite(async () => {
      const updates: any = { status };
      if (retryCount !== undefined) {
        updates.retry_count = retryCount;
      }
      if (nextRetryAt !== undefined) {
        updates.next_retry_at = nextRetryAt;
      }
      
      await this.getDb()
        .update(schema.pending_queue)
        .set(updates)
        .where(eq(schema.pending_queue.packet_id, packetId));
    });
  }

  // ==================== Security Event Operations ====================

  /**
   * Insert a security event
   * Requirements: 24.7
   */
  public async insertSecurityEvent(
    event: Omit<typeof schema.security_events.$inferInsert, 'id'>
  ): Promise<void> {
    await this.retryWrite(async () => {
      await this.getDb().insert(schema.security_events).values(event);
    });
  }

  /**
   * Get security events for a trek
   * Requirements: 24.7
   */
  public async getSecurityEvents(
    trekId: string,
    limit: number = 100
  ): Promise<(typeof schema.security_events.$inferSelect)[]> {
    return await this.getDb()
      .select()
      .from(schema.security_events)
      .where(eq(schema.security_events.trek_id, trekId))
      .orderBy(desc(schema.security_events.timestamp))
      .limit(limit);
  }

  /**
   * Close database connection
   */
  public async close(): Promise<void> {
    if (this.expoDb) {
      this.expoDb.closeSync();
      this.expoDb = null;
      this.db = null;
    }
  }
}

// Export singleton instance
export default DatabaseManager.getInstance();
