// Cloudflare KV utilities for caching and session management
export class KVManager {
  private kv: KVNamespace;

  constructor(kvNamespace: KVNamespace) {
    this.kv = kvNamespace;
  }

  // Cache management
  async cacheSet(key: string, value: any, ttl: number = 3600): Promise<void> {
    const data = JSON.stringify({
      value,
      timestamp: Date.now(),
      ttl
    });
    
    await this.kv.put(key, data, {
      expirationTtl: ttl
    });
  }

  async cacheGet<T>(key: string): Promise<T | null> {
    const data = await this.kv.get(key);
    if (!data) return null;

    try {
      const parsed = JSON.parse(data);
      return parsed.value as T;
    } catch (error) {
      console.error('Error parsing cached data:', error);
      return null;
    }
  }

  async cacheDelete(key: string): Promise<void> {
    await this.kv.delete(key);
  }

  // Session management
  async setSession(sessionToken: string, userData: any, ttl: number = 604800): Promise<void> {
    const sessionKey = `session:${sessionToken}`;
    await this.cacheSet(sessionKey, userData, ttl);
  }

  async getSession(sessionToken: string): Promise<any | null> {
    const sessionKey = `session:${sessionToken}`;
    return await this.cacheGet(sessionKey);
  }

  async deleteSession(sessionToken: string): Promise<void> {
    const sessionKey = `session:${sessionToken}`;
    await this.cacheDelete(sessionKey);
  }

  // Rate limiting
  async checkRateLimit(identifier: string, limit: number = 100, window: number = 3600): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
  }> {
    const key = `rate_limit:${identifier}`;
    const now = Date.now();
    const windowStart = Math.floor(now / (window * 1000)) * (window * 1000);
    
    const data = await this.cacheGet<{
      count: number;
      windowStart: number;
    }>(key);

    let count = 0;
    if (data && data.windowStart === windowStart) {
      count = data.count;
    }

    const newCount = count + 1;
    const allowed = newCount <= limit;
    
    if (allowed) {
      await this.cacheSet(key, {
        count: newCount,
        windowStart
      }, window);
    }

    return {
      allowed,
      remaining: Math.max(0, limit - newCount),
      resetTime: windowStart + (window * 1000)
    };
  }

  // Property cache management
  async cacheProperties(filters: any, properties: any[], ttl: number = 1800): Promise<void> {
    const cacheKey = `properties:${this.hashFilters(filters)}`;
    await this.cacheSet(cacheKey, properties, ttl);
  }

  async getCachedProperties(filters: any): Promise<any[] | null> {
    const cacheKey = `properties:${this.hashFilters(filters)}`;
    return await this.cacheGet<any[]>(cacheKey);
  }

  // Agent cache management
  async cacheAgents(agents: any[], ttl: number = 3600): Promise<void> {
    await this.cacheSet('agents:all', agents, ttl);
  }

  async getCachedAgents(): Promise<any[] | null> {
    return await this.cacheGet<any[]>('agents:all');
  }

  // Search analytics
  async trackSearch(query: string, filters: any, resultsCount: number): Promise<void> {
    const searchKey = `search_analytics:${Date.now()}:${Math.random()}`;
    const searchData = {
      query,
      filters,
      resultsCount,
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    
    await this.cacheSet(searchKey, searchData, 86400 * 30); // 30 days
  }

  // Popular searches tracking
  async incrementPopularSearch(query: string): Promise<void> {
    if (!query.trim()) return;
    
    const key = `popular_search:${query.toLowerCase().trim()}`;
    const current = await this.cacheGet<number>(key) || 0;
    await this.cacheSet(key, current + 1, 86400 * 7); // 7 days
  }

  async getPopularSearches(limit: number = 10): Promise<Array<{query: string, count: number}>> {
    try {
      const list = await this.kv.list({ prefix: 'popular_search:' });
      const searches: Array<{query: string, count: number}> = [];
      
      for (const key of list.keys) {
        const count = await this.cacheGet<number>(key.name);
        if (count && count > 0) {
          const query = key.name.replace('popular_search:', '');
          searches.push({ query, count });
        }
      }
      
      return searches
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting popular searches:', error);
      return [];
    }
  }

  // User preferences caching
  async cacheUserPreferences(userId: number, preferences: any, ttl: number = 86400): Promise<void> {
    const key = `user_prefs:${userId}`;
    await this.cacheSet(key, preferences, ttl);
  }

  async getCachedUserPreferences(userId: number): Promise<any | null> {
    const key = `user_prefs:${userId}`;
    return await this.cacheGet(key);
  }

  // Application metrics
  async incrementMetric(metric: string, value: number = 1): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const key = `metrics:${metric}:${today}`;
    const current = await this.cacheGet<number>(key) || 0;
    await this.cacheSet(key, current + value, 86400 * 7); // 7 days
  }

  async getMetrics(metric: string, days: number = 7): Promise<Array<{date: string, value: number}>> {
    const metrics: Array<{date: string, value: number}> = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const key = `metrics:${metric}:${dateStr}`;
      const value = await this.cacheGet<number>(key) || 0;
      metrics.push({ date: dateStr, value });
    }
    
    return metrics.reverse();
  }

  // Utility methods
  private hashFilters(filters: any): string {
    return Buffer.from(JSON.stringify(filters)).toString('base64').slice(0, 32);
  }

  // Bulk operations
  async bulkDelete(prefix: string): Promise<void> {
    try {
      const list = await this.kv.list({ prefix });
      const deletePromises = list.keys.map(key => this.kv.delete(key.name));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error in bulk delete:', error);
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const testKey = 'health_check';
      const testValue = Date.now().toString();
      
      await this.kv.put(testKey, testValue);
      const retrieved = await this.kv.get(testKey);
      await this.kv.delete(testKey);
      
      return retrieved === testValue;
    } catch (error) {
      console.error('KV health check failed:', error);
      return false;
    }
  }
}

// Helper functions for common KV operations
export const KVHelpers = {
  // Generate cache keys
  generateCacheKey: (prefix: string, ...parts: (string | number)[]): string => {
    return `${prefix}:${parts.join(':')}`;
  },

  // Parse cache data with error handling
  safeParse: <T>(data: string | null): T | null => {
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  },

  // Create TTL based on data type
  getTTL: (dataType: 'session' | 'cache' | 'analytics' | 'metrics'): number => {
    switch (dataType) {
      case 'session': return 604800; // 7 days
      case 'cache': return 3600; // 1 hour
      case 'analytics': return 86400 * 30; // 30 days
      case 'metrics': return 86400 * 7; // 7 days
      default: return 3600;
    }
  }
};