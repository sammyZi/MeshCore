/**
 * DuplicateCache - LRU cache for tracking seen packet IDs to prevent loops.
 *
 * Task 10.1: Implement Duplicate Cache with LRU eviction
 * Requirements: 12.1, 12.2, 12.3, 12.7, 34.1, 34.2, 34.3, 34.4, 34.5
 *
 * - has(packetId): checks if a packet ID has been seen
 * - add(packetId): adds a packet ID with 30-minute TTL
 * - evict(): removes expired entries
 * - Max size: 2048 entries with LRU eviction
 */

interface CacheEntry {
  /** Timestamp (ms) when the entry was added */
  insertedAt: number;
  /** Timestamp (ms) when the entry was last accessed (for LRU) */
  lastAccessedAt: number;
}

export class DuplicateCache {
  /** Internal store: packetId → CacheEntry */
  private cache: Map<string, CacheEntry> = new Map();

  /** Maximum number of entries before LRU eviction kicks in */
  private readonly maxSize: number;

  /** Time-to-live in milliseconds (30 minutes) */
  private readonly ttlMs: number;

  constructor(maxSize: number = 2048, ttlMs: number = 30 * 60 * 1000) {
    this.maxSize = maxSize;
    this.ttlMs = ttlMs;
  }

  /**
   * Checks whether the given packetId has been seen and is still within TTL.
   * Updates lastAccessedAt for LRU tracking on hit.
   *
   * Requirements: 12.1, 34.1, 34.2
   */
  has(packetId: string): boolean {
    const entry = this.cache.get(packetId);
    if (!entry) {
      return false;
    }

    // Check TTL expiration
    if (Date.now() - entry.insertedAt > this.ttlMs) {
      // Expired – remove and report as not found
      this.cache.delete(packetId);
      return false;
    }

    // Update last-accessed time (promotes in LRU ordering)
    entry.lastAccessedAt = Date.now();
    return true;
  }

  /**
   * Adds a packetId to the cache with a 30-minute TTL.
   * If the cache is at capacity, evicts expired entries first,
   * then evicts the least-recently-used entry if still full.
   *
   * Requirements: 12.3, 34.3, 34.4
   */
  add(packetId: string): void {
    // If already present, just update timestamps
    if (this.cache.has(packetId)) {
      const entry = this.cache.get(packetId)!;
      entry.insertedAt = Date.now();
      entry.lastAccessedAt = Date.now();
      return;
    }

    // Evict expired entries first
    this.evict();

    // If still at capacity, evict the LRU entry
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    this.cache.set(packetId, {
      insertedAt: Date.now(),
      lastAccessedAt: Date.now(),
    });
  }

  /**
   * Removes all entries whose TTL has expired.
   *
   * Requirements: 12.7, 34.5
   */
  evict(): void {
    const now = Date.now();
    for (const [id, entry] of this.cache) {
      if (now - entry.insertedAt > this.ttlMs) {
        this.cache.delete(id);
      }
    }
  }

  /**
   * Returns the current number of entries in the cache.
   */
  get size(): number {
    return this.cache.size;
  }

  /**
   * Clears all entries.
   */
  clear(): void {
    this.cache.clear();
  }

  // ── Private helpers ────────────────────────────────────────────────

  /**
   * Evicts the single least-recently-used entry from the cache.
   */
  private evictLRU(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [id, entry] of this.cache) {
      if (entry.lastAccessedAt < oldestTime) {
        oldestTime = entry.lastAccessedAt;
        oldestKey = id;
      }
    }

    if (oldestKey !== null) {
      this.cache.delete(oldestKey);
    }
  }
}
