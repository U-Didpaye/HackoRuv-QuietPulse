import { FeedbackRecord, UserFeedbackType } from '../types';

const STORAGE_KEY = 'quietpulse_learning_offsets';
const HISTORY_KEY = 'quietpulse_learning_history';

export class LocalLearningEngine {
  private packageOffsets: Record<string, number> = {};
  private history: FeedbackRecord[] = [];
  private learningRate = 0.18;
  private maxDelta = 0.45;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const storedOffsets = localStorage.getItem(STORAGE_KEY);
      if (storedOffsets) {
        this.packageOffsets = JSON.parse(storedOffsets);
      }
      const storedHistory = localStorage.getItem(HISTORY_KEY);
      if (storedHistory) {
        this.history = JSON.parse(storedHistory);
      }
    } catch (e) {
      console.warn('Could not load learning state from localStorage:', e);
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.packageOffsets));
      localStorage.setItem(HISTORY_KEY, JSON.stringify(this.history));
    } catch (e) {
      console.warn('Could not save learning state to localStorage:', e);
    }
  }

  recordFeedback(record: FeedbackRecord) {
    this.history.push(record);
    const current = this.packageOffsets[record.packageName] || 0;
    let delta = 0;

    switch (record.feedbackType) {
      case 'SHOULD_BE_URGENT':
        delta = this.learningRate * 1.5;
        break;
      case 'MORE_IMPORTANT_THAN_EXPECTED':
        delta = this.learningRate;
        break;
      case 'SAFE_TO_BATCH':
        delta = -this.learningRate;
        break;
      case 'NOT_RELEVANT':
        delta = -this.learningRate * 1.2;
        break;
      case 'SPAM':
        delta = -this.learningRate * 2.0;
        break;
      default:
        delta = 0;
        break;
    }

    const next = Math.max(-this.maxDelta, Math.min(this.maxDelta, current + delta));
    this.packageOffsets[record.packageName] = Number(next.toFixed(3));
    this.saveToStorage();
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
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(HISTORY_KEY);
      } catch (ignored) {}
    }
  }
}
