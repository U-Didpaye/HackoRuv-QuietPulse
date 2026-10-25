import { NotificationEvent, BurstEvent } from '../types';

export class BurstDetector {
  private recentEvents: NotificationEvent[] = [];
  private processedIds = new Set<string>();
  private threshold = 5; // 5 events per minute
  private windowDuration = 60_000; // 60s

  recordEvent(event: NotificationEvent): BurstEvent | null {
    if (this.processedIds.has(event.id)) return null;
    this.processedIds.add(event.id);

    const currentTime = event.timestamp;
    this.recentEvents.push(event);

    const windowStart = currentTime - this.windowDuration;
    this.recentEvents = this.recentEvents.filter(e => e.timestamp >= windowStart);

    const count = this.recentEvents.length;
    if (count >= this.threshold) {
      const counts: Record<string, number> = {};
      for (const ev of this.recentEvents) {
        counts[ev.appName] = (counts[ev.appName] || 0) + 1;
      }
      let dominantApp = '';
      let maxAppCount = 0;
      for (const [app, c] of Object.entries(counts)) {
        if (c > maxAppCount) {
          maxAppCount = c;
          dominantApp = app;
        }
      }

      const recommendation = maxAppCount >= count * 0.6
        ? `Repeated notification flood from ${dominantApp} (${maxAppCount} alerts in 60s). Recommending mute.`
        : `High-frequency cross-app notification storm (${count} alerts). Routing non-urgent alerts to Airlock.`;

      return {
        id: 'burst_' + Math.random().toString(36).substring(2, 9),
        startTime: windowStart,
        endTime: currentTime,
        eventCount: count,
        dominantAppName: dominantApp,
        recommendation
      };
    }
    return null;
  }

  isBurstActive(currentTime: number): boolean {
    const windowStart = currentTime - this.windowDuration;
    this.recentEvents = this.recentEvents.filter(e => e.timestamp >= windowStart);
    return this.recentEvents.length >= this.threshold;
  }

  getRecentRate(currentTime: number): number {
    const windowStart = currentTime - this.windowDuration;
    this.recentEvents = this.recentEvents.filter(e => e.timestamp >= windowStart);
    return this.recentEvents.length;
  }

  clear() {
    this.recentEvents = [];
    this.processedIds.clear();
  }
}
