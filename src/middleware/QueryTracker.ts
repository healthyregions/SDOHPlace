export class QueryTracker {
  private inFlightQueries: Map<string, boolean> = new Map();
  private recentQueries: Map<string, number> = new Map();
  private readonly TTL: number;

  constructor(ttl = 100) {
    this.TTL = ttl;
  }

  addInFlight(queryKey: string): void {
    this.inFlightQueries.set(queryKey, true);
  }

  removeInFlight(queryKey: string): void {
    this.inFlightQueries.delete(queryKey);
  }

  isInFlight(queryKey: string): boolean {
    return this.inFlightQueries.has(queryKey);
  }

  addRecent(queryKey: string): void {
    if (!this.isFilterQuery(queryKey)) {
      this.recentQueries.set(queryKey, Date.now());
    }
  }

  isRecentlyCompleted(queryKey: string): boolean {
    if (this.isFilterQuery(queryKey)) {
      return false;
    }
    if (!this.recentQueries.has(queryKey)) return false;
    const timestamp = this.recentQueries.get(queryKey);
    return Date.now() - timestamp < this.TTL;
  }

  cleanup(): void {
    const now = Date.now();
    Array.from(this.recentQueries.entries()).forEach(([key, timestamp]) => {
      if (now - timestamp > this.TTL) {
        this.recentQueries.delete(key);
      }
    });
  }

  shouldExecuteQuery(queryKey: string): boolean {
    if (this.isFilterQuery(queryKey)) {
      return !this.isInFlight(queryKey);
    }
    if (this.isInFlight(queryKey)) return false;
    if (this.isRecentlyCompleted(queryKey)) return false;
    return true;
  }

  isFilterQuery(queryKey: string): boolean {
    return queryKey.includes("spatial_resolution") || 
           queryKey.includes("subject") || 
           queryKey.includes("bbox") || 
           queryKey.includes("index_year") ||
           queryKey.includes("setSpatialResolution") ||
           queryKey.includes("setSubject") ||
           queryKey.includes("setBbox") ||
           queryKey.includes("setIndexYear");
  }

  generateQueryKey(query: string, filterQueries: any[], sortBy?: string, sortOrder?: string): string {
    return `${query}:${JSON.stringify(filterQueries)}:${sortBy || ''}:${sortOrder || ''}`;
  }
}

const queryTracker = new QueryTracker();
export default queryTracker; 