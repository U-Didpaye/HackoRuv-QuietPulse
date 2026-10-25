import {
  NotificationEvent,
  ClassificationResult,
  ClassificationCategory,
  UserRule,
  ContextMode,
  PersonalizedSettings
} from '../types';
import { BurstDetector } from './burstDetector';
import { LocalLearningEngine } from './localLearning';

const defaultUrgentKeywords = [
  'otp', 'verification code', 'security alert', 'emergency', 'hospital',
  'critical', 'fraud', 'server down', 'flight', 'boarding pass', 'arrived',
  'driver arrived', 'unauthorized login', 'urgent', 'sos', 'ambulance', 'fire alert'
];

const workApps = [
  'slack', 'teams', 'microsoft teams', 'outlook', 'gmail', 'google meet',
  'zoom', 'jira', 'github', 'gitlab', 'linear', 'asana', 'notion', 'trello'
];

const personalApps = [
  'whatsapp', 'phone', 'messages', 'telegram', 'signal', 'facetime',
  'google messages', 'uber', 'zomato', 'swiggy', 'door dash', 'blinkit', 'instacart'
];

const promotionalPatterns = [
  'sale', 'flat 50%', '70% off', 'discount', 'cashback', 'coins', 'streak',
  'free spins', 'exclusive deal', 'hurry', 'expires in', 'flash sale',
  'limited time', 'don\'t miss out', 'claim reward', 'jackpot', 'megasale',
  'promo code', 'bonus coins', 'unmissable deal'
];

export class ClassificationEngine {
  constructor(private learningEngine: LocalLearningEngine) {}

  classify(
    event: NotificationEvent,
    userRules: Record<string, UserRule>,
    isFocusSessionActive: boolean,
    burstDetector: BurstDetector,
    contextMode: ContextMode = 'OFFICE',
    personalizedSettings?: PersonalizedSettings
  ): ClassificationResult {
    const appliedRules: string[] = [];
    const content = `${event.title} ${event.text}`.toLowerCase();
    const appLower = `${event.appName} ${event.packageName}`.toLowerCase();
    const rule = userRules[event.packageName];

    // 1. Explicit User Rule Override (Top Priority)
    if (rule) {
      if (rule.priorityLevel === 'ALWAYS_URGENT') {
        appliedRules.push('Explicit Rule: Configured as ALWAYS URGENT');
        return {
          eventId: event.id,
          category: 'URGENT',
          priorityScore: 0.98,
          urgencyScore: 0.98,
          relevanceScore: 0.95,
          confidence: 'HIGH',
          explanation: `Allowed immediately because ${event.appName} is configured as an always-urgent VIP rule.`,
          appliedRules,
          recommendedAction: 'Deliver immediately',
          isUserOverrideApplied: true,
          appliedContextMode: contextMode
        };
      }
      if (rule.priorityLevel === 'SPAM') {
        appliedRules.push('Explicit Rule: Configured as SPAM');
        return {
          eventId: event.id,
          category: 'SPAM',
          priorityScore: 0.02,
          urgencyScore: 0.01,
          relevanceScore: 0.01,
          confidence: 'HIGH',
          explanation: `Filtered and marked as Spam because ${event.appName} is blocked by custom rule.`,
          appliedRules,
          recommendedAction: 'Silently quarantine in Spam folder',
          isUserOverrideApplied: true,
          appliedContextMode: contextMode
        };
      }
      if (rule.priorityLevel === 'NEVER_INTERRUPT' || rule.priorityLevel === 'LOW_PRIORITY') {
        appliedRules.push('Explicit Rule: Configured as NEVER INTERRUPT');
        return {
          eventId: event.id,
          category: 'LOW_PRIORITY',
          priorityScore: 0.1,
          urgencyScore: 0.05,
          relevanceScore: 0.1,
          confidence: 'HIGH',
          explanation: `Silenced and quarantined because ${event.appName} is set to Never Interrupt.`,
          appliedRules,
          recommendedAction: 'Mute silently and preserve in FlowQueue',
          isUserOverrideApplied: true,
          appliedContextMode: contextMode
        };
      }
    }

    // 2. Base Heuristics Initialization
    let urgency = 0.35;
    let relevance = 0.50;

    // Critical OS categories
    if (event.category === 'call' || event.category === 'alarm') {
      urgency += 0.55;
      relevance += 0.40;
      appliedRules.push('System category: Critical Call or Alarm');
    } else if (event.category === 'msg') {
      urgency += 0.20;
      relevance += 0.25;
      appliedRules.push('System category: Direct Message');
    } else if (event.category === 'promo') {
      urgency -= 0.35;
      relevance -= 0.40;
      appliedRules.push('System category: Promotional');
    }

    // 3. Context Mode Influence (Section 8 & 11)
    if (contextMode === 'OFFICE') {
      appliedRules.push('Active Context Mode: Office');
      const isWorkApp = workApps.some(w => appLower.includes(w));
      if (isWorkApp) {
        relevance += 0.30;
        appliedRules.push(`Office Mode: Prioritized work app (${event.appName})`);
        if (content.includes('prod') || content.includes('blocker') || content.includes('incident') || content.includes('urgent') || content.includes('break')) {
          urgency += 0.40;
          appliedRules.push('Office Mode: Critical work keyword detected');
        }
      } else {
        // Non-work apps get buffered in Office mode
        const isPersonal = personalApps.some(p => appLower.includes(p));
        if (!isPersonal && (appLower.includes('game') || appLower.includes('shop') || appLower.includes('deals'))) {
          urgency -= 0.30;
          relevance -= 0.30;
          appliedRules.push('Office Mode: Distraction/shopping app suppressed');
        }
      }
    } else if (contextMode === 'HOME') {
      appliedRules.push('Active Context Mode: Home');
      const isPersonal = personalApps.some(p => appLower.includes(p));
      if (isPersonal) {
        relevance += 0.30;
        appliedRules.push(`Home Mode: Prioritized personal communication (${event.appName})`);
      } else {
        const isWorkApp = workApps.some(w => appLower.includes(w));
        if (isWorkApp && !content.includes('emergency')) {
          urgency -= 0.25;
          relevance -= 0.15;
          appliedRules.push('Home Mode: Routine work notification batched for off-hours');
        }
      }
    } else if (contextMode === 'PERSONALIZED' && personalizedSettings) {
      appliedRules.push('Active Context Mode: Personalized Mode');
      // Personalized VIP Apps
      if (personalizedSettings.vipApps && personalizedSettings.vipApps.some(v => appLower.includes(v.toLowerCase()))) {
        relevance += 0.40;
        urgency += 0.30;
        appliedRules.push(`Personalized Rule: VIP App match (${event.appName})`);
      }
      // Personalized Work vs Personal
      if (personalizedSettings.workApps && personalizedSettings.workApps.some(w => appLower.includes(w.toLowerCase()))) {
        relevance += 0.25;
        appliedRules.push('Personalized Rule: Work app match');
      }
      // Personalized VIP Contacts
      if (personalizedSettings.vipContacts && personalizedSettings.vipContacts.some(c => content.includes(c.toLowerCase()))) {
        urgency += 0.45;
        relevance += 0.40;
        appliedRules.push('Personalized Rule: VIP contact match in message');
      }
      // Personalized Urgent Keywords
      if (personalizedSettings.urgentKeywords) {
        const customUrgent = personalizedSettings.urgentKeywords.find(k => content.includes(k.toLowerCase()));
        if (customUrgent) {
          urgency += 0.50;
          appliedRules.push(`Personalized Rule: Urgent keyword '${customUrgent}'`);
        }
      }
      // Personalized Spam Keywords
      if (personalizedSettings.spamKeywords) {
        const customSpam = personalizedSettings.spamKeywords.find(k => content.includes(k.toLowerCase()));
        if (customSpam) {
          urgency -= 0.50;
          relevance -= 0.50;
          appliedRules.push(`Personalized Rule: Custom spam keyword '${customSpam}'`);
        }
      }
    }

    // 4. Universal Keyword Detection
    const matchedUrgent = defaultUrgentKeywords.find(k => content.includes(k));
    if (matchedUrgent) {
      urgency += 0.50;
      relevance += 0.40;
      appliedRules.push(`Detected high-urgency token: '${matchedUrgent}'`);
    }

    const matchedPromo = promotionalPatterns.find(k => content.includes(k));
    if (matchedPromo) {
      urgency -= 0.35;
      relevance -= 0.40;
      appliedRules.push(`Detected promotional/FOMO phrase: '${matchedPromo}'`);
    }

    // 5. Burst Activity Penalty
    if (burstDetector.isBurstActive(event.timestamp)) {
      urgency -= 0.20;
      appliedRules.push('Burst storm active: 5+ pings in rolling 60s window');
    }

    // 6. User Feedback / Local Learning Calibration Offset
    const offset = this.learningEngine.getOffset(event.packageName);
    if (offset !== 0) {
      relevance += offset;
      if (offset > 0.15) urgency += offset * 0.5;
      appliedRules.push(`Local Learning Offset: ${offset > 0 ? '+' : ''}${offset.toFixed(2)} from user feedback`);
    }

    // 7. Active Focus Session
    if (isFocusSessionActive) {
      urgency -= 0.20;
      appliedRules.push('Active DeepFocus Session protected');
    }

    // Clamp values between 0 and 1
    urgency = Math.max(0, Math.min(1, urgency));
    relevance = Math.max(0, Math.min(1, relevance));
    const combinedScore = Math.max(0, Math.min(1, urgency * 0.65 + relevance * 0.35));

    // Thresholds
    const urgentThreshold = personalizedSettings?.urgencyThreshold ?? 0.72;
    const relevanceThreshold = personalizedSettings?.relevanceThreshold ?? 0.62;

    let category: ClassificationCategory = 'LOW_PRIORITY';
    let recommendedAction = 'Silenced into background history';
    let explanation = 'Identified as low priority or routine telemetry.';

    if (matchedPromo && combinedScore < 0.25) {
      category = 'SPAM';
      recommendedAction = 'Quarantined in Spam; vibration blocked';
      explanation = 'Commercial marketing or spam pattern detected; vibration and banner blocked.';
    } else if (urgency >= urgentThreshold) {
      category = 'URGENT';
      recommendedAction = 'Deliver immediately with audio/visual notification';
      explanation = `Time-critical urgency detected (${(urgency * 100).toFixed(0)}%). Bypasses firewalls for instant human attention.`;
    } else if (relevance >= relevanceThreshold && !isFocusSessionActive) {
      category = 'IMPORTANT';
      recommendedAction = 'Display in notification shade; prioritize in FlowQueue';
      explanation = `High relevance content (${(relevance * 100).toFixed(0)}%), but not strictly emergency time-sensitive.`;
    } else if (isFocusSessionActive || (urgency < 0.45 && relevance >= 0.30)) {
      category = 'BATCH';
      recommendedAction = 'Held safely in FlowQueue for scheduled batch delivery';
      explanation = isFocusSessionActive
        ? 'Held in FlowQueue because a DeepFocus session is currently in progress.'
        : `Held in FlowQueue batch buffer under ${contextMode} mode rules.`;
    } else {
      category = 'LOW_PRIORITY';
      recommendedAction = 'Silenced into digest without triggering screen wake';
      explanation = 'Low urgency and relevance; buffered silently in FlowQueue without alert sounds.';
    }

    return {
      eventId: event.id,
      category,
      priorityScore: Number(combinedScore.toFixed(2)),
      urgencyScore: Number(urgency.toFixed(2)),
      relevanceScore: Number(relevance.toFixed(2)),
      confidence: combinedScore > 0.85 || combinedScore < 0.2 ? 'HIGH' : combinedScore > 0.5 ? 'MEDIUM' : 'LOW',
      explanation,
      appliedRules,
      recommendedAction,
      isUserOverrideApplied: false,
      appliedContextMode: contextMode
    };
  }
}
