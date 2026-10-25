import { FeedbackRecord } from '../types';

export class LocalLearningEngine {
  private packageOffsets: Record<string, number> = {};
  private history: FeedbackRecord[] = [];
  private learningRate = 0.15;
  private maxDelta = 0.40;

  recordFeedback(record: FeedbackRecord) {
    this.history.push(record);
    const current = this.packageOffsets[record.packageName] || 0;
    let delta = 0;

    switch (record.feedbackType) {
      case 'SHOULD_BE_URGENT': delta = this.learningRate * 1.5; break;
      case 'MORE_IMPORTANT_THAN_EXPECTED': delta = this.learningRate; break;
      case 'SAFE_TO_BATCH': delta = -this.learningRate; break;
      case 'NOT_RELEVANT': delta = -this.learningRate * 1.5; break;
      default: delta = 0; break;
    }

    const next = Math.max(-this.maxDelta, Math.min(this.maxDelta, current + delta));
    this.packageOffsets[record.packageName] = next;
  }

  getOffset(packageName: string): number {
    return this.packageOffsets[packageName] || 0;
  }

  getHistory(): FeedbackRecord[] {
    return [...this.history];
  }

  reset() {
    this.packageOffsets = {};
    this.history = [];
  }
}
