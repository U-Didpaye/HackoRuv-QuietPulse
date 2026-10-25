export type ClassificationCategory = 'URGENT' | 'IMPORTANT' | 'BATCH' | 'LOW_PRIORITY';
export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type SourceType = 'REAL' | 'SIMULATED';

export interface NotificationEvent {
  id: string;
  packageName: string;
  appName: string;
  title: string;
  text: string;
  category?: string;
  timestamp: number;
  sourceType: SourceType;
  groupKey?: string;
}

export interface ClassificationResult {
  eventId: string;
  category: ClassificationCategory;
  priorityScore: number;
  urgencyScore: number;
  relevanceScore: number;
  confidence: ConfidenceLevel;
  explanation: string;
  appliedRules: string[];
  recommendedAction: string;
  isUserOverrideApplied: boolean;
}

export interface UiNotificationItem {
  event: NotificationEvent;
  result: ClassificationResult;
  isReviewed: boolean;
}

export interface BurstEvent {
  id: string;
  startTime: number;
  endTime: number;
  eventCount: number;
  dominantAppName?: string;
  recommendation: string;
}

export interface FocusSession {
  id: string;
  name: string;
  targetDurationMinutes: number;
  startTimestamp: number;
  state: 'IDLE' | 'RUNNING' | 'COMPLETED';
}

export interface UserRule {
  id: string;
  packageName: string;
  appName: string;
  priorityLevel: 'ALWAYS_URGENT' | 'NORMAL' | 'LOW_PRIORITY' | 'NEVER_INTERRUPT';
  urgentKeywords?: string[];
  lowPriorityKeywords?: string[];
  allowDuringFocus: boolean;
}

export type UserFeedbackType = 'CORRECT' | 'SHOULD_BE_URGENT' | 'MORE_IMPORTANT_THAN_EXPECTED' | 'SAFE_TO_BATCH' | 'NOT_RELEVANT';

export interface FeedbackRecord {
  eventId: string;
  packageName: string;
  originalCategory: ClassificationCategory;
  feedbackType: UserFeedbackType;
  timestamp: number;
}

export interface AnalyticsMetrics {
  totalNotificationsObserved: number;
  burstsDetected: number;
  repeatedInterruptionCount: number;
  urgentCount: number;
  importantCount: number;
  batchedCount: number;
  lowPriorityCount: number;
  totalFocusMinutes: number;
  completedSessionsCount: number;
  userCorrectionCount: number;
  estimatedInterruptionsDeflected: number;
}
