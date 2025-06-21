/**
 * Rate limiter for GitHub API calls
 */
export class RateLimiter {
  private lastRequestTime: number = 0;
  private requestCount: number = 0;
  private windowStart: number = Date.now();
  private readonly maxRequestsPerHour: number;
  private readonly minDelayMs: number;

  constructor(maxRequestsPerHour: number = 5000, minDelayMs: number = 100) {
    this.maxRequestsPerHour = maxRequestsPerHour;
    this.minDelayMs = minDelayMs;
  }

  /**
   * Wait for the appropriate amount of time before the next request
   */
  async waitForNextRequest(): Promise<void> {
    const now = Date.now();
    
    // Reset window if an hour has passed
    if (now - this.windowStart >= 3600000) { // 1 hour in ms
      this.requestCount = 0;
      this.windowStart = now;
    }
    
    // Check if we've exceeded the rate limit
    if (this.requestCount >= this.maxRequestsPerHour) {
      const timeToWait = 3600000 - (now - this.windowStart);
      console.log(`Rate limit reached. Waiting ${Math.ceil(timeToWait / 1000)}s...`);
      await this.delay(timeToWait);
      
      // Reset after waiting
      this.requestCount = 0;
      this.windowStart = Date.now();
    }
    
    // Ensure minimum delay between requests
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minDelayMs) {
      await this.delay(this.minDelayMs - timeSinceLastRequest);
    }
    
    this.lastRequestTime = Date.now();
    this.requestCount++;
  }

  /**
   * Get current rate limit status
   */
  getStatus(): { requestCount: number; maxRequests: number; windowStart: number; timeUntilReset: number } {
    const now = Date.now();
    return {
      requestCount: this.requestCount,
      maxRequests: this.maxRequestsPerHour,
      windowStart: this.windowStart,
      timeUntilReset: Math.max(0, 3600000 - (now - this.windowStart))
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}