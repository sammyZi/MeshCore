/**
 * RouteCache - Stores discovered AODV routes with automatic 10-minute expiry.
 *
 * Task 10.8: Implement Route Cache for AODV
 * Requirements: 26.3, 55.1, 55.2, 55.3
 *
 * - get(destination): returns a cached route or null
 * - set(destination, route): caches a route with 10-minute TTL
 * - evict(): removes expired routes
 */

export interface Route {
  /** The destination Node_ID */
  destination: string;
  /** The next-hop Node_ID to reach the destination */
  nextHop: string;
  /** Number of hops to the destination */
  hopCount: number;
  /** Timestamp (ms) when this route was established / last used */
  timestamp: number;
}

export class RouteCache {
  /** Internal store: destination Node_ID → Route */
  private routes: Map<string, Route> = new Map();

  /** Route TTL in milliseconds (10 minutes) */
  private readonly ttlMs: number;

  constructor(ttlMs: number = 10 * 60 * 1000) {
    this.ttlMs = ttlMs;
  }

  /**
   * Retrieves a cached route for the given destination, or null if none
   * exists or the route has expired.
   *
   * Requirements: 55.4, 55.5
   */
  get(destination: string): Route | null {
    const route = this.routes.get(destination);
    if (!route) {
      return null;
    }

    // Check if the route has expired
    if (Date.now() - route.timestamp > this.ttlMs) {
      this.routes.delete(destination);
      return null;
    }

    // Refresh timestamp on use (keeps active routes alive)
    route.timestamp = Date.now();
    return route;
  }

  /**
   * Caches a route for the given destination with a 10-minute TTL.
   *
   * Requirements: 55.1, 55.2
   */
  set(destination: string, route: Route): void {
    this.routes.set(destination, {
      ...route,
      timestamp: Date.now(),
    });
  }

  /**
   * Removes all routes whose TTL has expired.
   *
   * Requirements: 55.3
   */
  evict(): void {
    const now = Date.now();
    for (const [dest, route] of this.routes) {
      if (now - route.timestamp > this.ttlMs) {
        this.routes.delete(dest);
      }
    }
  }

  /**
   * Checks whether a valid (non-expired) route exists for the destination.
   */
  has(destination: string): boolean {
    return this.get(destination) !== null;
  }

  /**
   * Returns the current number of cached routes.
   */
  get size(): number {
    return this.routes.size;
  }

  /**
   * Removes a specific route.
   */
  delete(destination: string): boolean {
    return this.routes.delete(destination);
  }

  /**
   * Clears all cached routes.
   */
  clear(): void {
    this.routes.clear();
  }
}
