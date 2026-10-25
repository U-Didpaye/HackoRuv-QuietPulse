import { NotificationEvent, ClassificationResult, UserRule } from '../types';
import { BurstDetector } from './burstDetector';
import { LocalLearningEngine } from './localLearning';

const urgentKeywords = [
  'otp', 'verification code', 'security alert', 'emergency', 'hospital',
  'critical', 'fraud', 'server down', 'flight', 'boarding pass', 'arrived',
  'driver arrived', 'unauthorized login', 'urgent'
];

const promotionalPatterns = [
  'sale', 'flat 50%', '70% off', 'discount', 'cashback', 'coins', 'streak',
  'free spins', 'exclusive deal', 'hurry', 'expires in', 'flash sale',
  'limited time', 'don\'t miss out', 'claim reward', 'jackpot'
];

export class ClassificationEngine {
  constructor(private learningEngine: LocalLearningEngine) {}

  classify(
    event: NotificationEvent,
    userRules: Record<string, UserRule>,
    isFocusSessionActive: boolean,
    burstDetector: BurstDetector
  ): ClassificationResult {
    const appliedRules: string[] = [];
    const content = `${event.title} ${event.text}`.toLowerCase();
    const rule = userRules[event.packageName];

    // 1. Explicit User Rule Override
    if (rule) {
      if (rule.priorityLevel === 'ALWAYS_URGENT') {
        appliedRules.push('Explicit Rule: Configured as ALWAYS URGENT');
        return {
          eventId: event.id,
          category: 'URGENT',
          priorityScore: 0.95,
          urgencyScore: 0.95,
          relevanceScore: 0.95,
          confidence: 'HIGH',
          explanation: `Allowed immediately because ${event.appName} is configured as an always-urgent VIP app.`,
          appliedRules,
          recommendedAction: 'Deliver immediately',
          isUserOverrideApplied: true
        };
      }
      if (rule.priorityLevel === 'NEVER_INTERRUPT') {
        appliedRules.push('Explicit Rule: Configured as NEVER INTERRUPT');
        return {
          eventId: event.id,
          category: 'LOW_PRIORITY',
          priorityScore: 0.1,
          urgencyScore: 0.05,
          relevanceScore: 0.1,
          confidence: 'HIGH',
          explanation: `Silenced and quarantined because ${event.appName} is marked as Never Interrupt.`,
          appliedRules,
          recommendedAction: 'Mute silently and preserve in queue',
          isUserOverrideApplied: true
        };
      }
    }

    // 2. Base Heuristics
    let urgency = 0.35;
    let relevance = 0.50;

    if (event.category === 'call' || event.category === 'alarm') {
      urgency += 0.55;
      relevance += 0.40;
      appliedRules.push('System category: Critical Call or Alarm');
    } else if (event.category === 'msg') {
      urgency += 0.20;
      relevance += 0.30;
      appliedRules.push('System category: Direct Communication');
    } else if (event.category === 'promo') {
      urgency -= 0.25;
      relevance -= 0.30;
      appliedRules.push('Category: Promotional / Algorithmic recommendation');
    }

    // Check urgent keywords
    const matchedUrgent = urgentKeywords.find(k => content.includes(k));
    if (matchedUrgent) {
      urgency += 0.45;
      relevance += 0.35;
      appliedRules.push(`Detected high-urgency phrase: '${matchedUrgent}'`);
    }

    // Check dark patterns / promotional hooks
    const matchedPromo = promotionalPatterns.find(k => content.includes(k));
    if (matchedPromo) {
      urgency -= 0.30;
      relevance -= 0.35;
      appliedRules.push(`Detected FOMO / promotional hook: '${matchedPromo}'`);
    }

    // Burst activity penalty
    if (burstDetector.isBurstActive(event.timestamp)) {
      urgency -= 0.20;
      appliedRules.push('Active Notification Storm detected in 60s rolling window');
    }

    // Local learning weight offset
    const offset = this.learningEngine.getOffset(event.packageName);
    if (offset !== 0) {
      relevance += offset;
      appliedRules.push(`Local Learning Adjustment: ${offset > 0 ? '+' : ''}${offset.toFixed(2)} from past user corrections`);
    }

    // Focus Session active
    if (isFocusSessionActive) {
      urgency -= 0.15;
      appliedRules.push('Focus Mode is currently ACTIVE');
    }

    urgency = Math.max(0, Math.min(1, urgency));
    relevance = Math.max(0, Math.min(1, relevance));
    const combined = Math.max(0, Math.min(1, urgency * 0.6 + relevance * 0.4));

    let category: 'URGENT' | 'IMPORTANT' | 'BATCH' | 'LOW_PRIORITY' = 'LOW_PRIORITY';
    let recommendedAction = 'Mute silently and preserve in queue history';
    let explanation = 'Identified as Low Priority or engagement bait.';

    if (urgency >= 0.75) {
      category = 'URGENT';
      recommendedAction = 'Deliver immediately';
      explanation = 'High time-sensitivity urgency detected; instant delivery granted.';
    } else if (relevance >= 0.65 && !isFocusSessionActive) {
      category = 'IMPORTANT';
      recommendedAction = 'Display in shade or prioritize in queue';
      explanation = 'Strong relevance cues detected, but not strictly time-critical.';
    } else if (isFocusSessionActive || (urgency < 0.35 && relevance >= 0.35)) {
      category = 'BATCH';
      recommendedAction = 'Hold in Attention Airlock until next focus break';
      explanation = isFocusSessionActive
        ? 'Routed to Attention Airlock because Focus Session is currently active.'
        : 'Held in batch queue for scheduled notification digest review.';
    }

    const confidence: 'HIGH' | 'MEDIUM' | 'LOW' = appliedRules.length >= 3 ? 'HIGH' : appliedRules.length >= 1 ? 'MEDIUM' : 'LOW';

    return {
      eventId: event.id,
      category,
      priorityScore: combined,
      urgencyScore: urgency,
      relevanceScore: relevance,
      confidence,
      explanation,
      appliedRules,
      recommendedAction,
      isUserOverrideApplied: false
    };
  }
}
