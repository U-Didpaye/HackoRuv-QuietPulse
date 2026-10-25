package com.focusshield.ai.intelligence.classifier

import com.focusshield.ai.intelligence.burst.BurstDetector
import com.focusshield.ai.intelligence.learning.LocalLearningEngine
import com.focusshield.ai.model.*

class ClassificationEngine(
    private val learningEngine: LocalLearningEngine = LocalLearningEngine()
) {

    private val urgentKeywords = setOf(
        "otp", "verification code", "security alert", "emergency", "hospital",
        "fraud", "critical", "server down", "flight", "boarding pass", "arriving now",
        "driver arrived", "unauthorized login", "urgent"
    )

    private val promotionalDarkPatterns = setOf(
        "sale", "flat 50%", "70% off", "discount", "cashback", "coins", "streak",
        "free spins", "exclusive deal", "hurry", "expires in", "flash sale",
        "limited time", "don't miss out", "claim reward", "jackpot"
    )

    fun classify(
        event: NotificationEvent,
        userRules: Map<String, UserRule>,
        isFocusSessionActive: Boolean,
        burstDetector: BurstDetector
    ): ClassificationResult {
        val appliedRules = mutableListOf<String>()
        val contentLower = "${event.title} ${event.text}".lowercase()
        val packageName = event.packageName

        // 1. Check Explicit User Overrides (Absolute Precedence)
        val userRule = userRules[packageName]
        if (userRule != null) {
            when (userRule.priorityLevel) {
                AppPriorityLevel.ALWAYS_URGENT -> {
                    appliedRules.add("Explicit User Rule: App configured as ALWAYS URGENT")
                    return ClassificationResult(
                        eventId = event.id,
                        category = ClassificationCategory.URGENT,
                        priorityScore = 0.95f,
                        urgencyScore = 0.95f,
                        relevanceScore = 0.95f,
                        confidence = ConfidenceLevel.HIGH,
                        explanation = "Allowed immediately because ${event.appName} is configured as an always-urgent priority app in your settings.",
                        appliedRules = appliedRules,
                        recommendedAction = "Deliver immediately",
                        isUserOverrideApplied = true
                    )
                }
                AppPriorityLevel.NEVER_INTERRUPT -> {
                    appliedRules.add("Explicit User Rule: App configured as NEVER INTERRUPT")
                    return ClassificationResult(
                        eventId = event.id,
                        category = ClassificationCategory.LOW_PRIORITY,
                        priorityScore = 0.10f,
                        urgencyScore = 0.05f,
                        relevanceScore = 0.10f,
                        confidence = ConfidenceLevel.HIGH,
                        explanation = "Silenced because ${event.appName} is marked as Never Interrupt.",
                        appliedRules = appliedRules,
                        recommendedAction = "Mute silently and hold in Queue",
                        isUserOverrideApplied = true
                    )
                }
                else -> { /* Proceed to heuristic evaluation */ }
            }

            // Keyword overrides from user rule
            val matchedUrgentKeyword = userRule.urgentKeywords.firstOrNull { contentLower.contains(it.lowercase()) }
            if (matchedUrgentKeyword != null) {
                appliedRules.add("User Keyword Exception: Matched '$matchedUrgentKeyword'")
                return ClassificationResult(
                    eventId = event.id,
                    category = ClassificationCategory.URGENT,
                    priorityScore = 0.90f,
                    urgencyScore = 0.90f,
                    relevanceScore = 0.90f,
                    confidence = ConfidenceLevel.HIGH,
                    explanation = "Elevated to Urgent due to custom keyword rule: '$matchedUrgentKeyword'.",
                    appliedRules = appliedRules,
                    recommendedAction = "Deliver immediately",
                    isUserOverrideApplied = true
                )
            }
        }

        // 2. Base Urgency & Relevance Heuristic Evaluation
        var urgencyScore = 0.35f
        var relevanceScore = 0.50f

        // Category assessment
        when (event.category) {
            "call", "alarm" -> {
                urgencyScore += 0.55f
                relevanceScore += 0.40f
                appliedRules.add("System category: Critical Call or Alarm")
            }
            "msg" -> {
                urgencyScore += 0.20f
                relevanceScore += 0.30f
                appliedRules.add("System category: Direct Message")
            }
            "promo", "recommendation" -> {
                urgencyScore -= 0.25f
                relevanceScore -= 0.30f
                appliedRules.add("System category: Promotional / Algorithmic recommendation")
            }
            "social" -> {
                urgencyScore -= 0.15f
                relevanceScore -= 0.10f
                appliedRules.add("System category: Social Network")
            }
        }

        // Urgent keyword scanning
        val foundUrgent = urgentKeywords.firstOrNull { contentLower.contains(it) }
        if (foundUrgent != null) {
            urgencyScore += 0.45f
            relevanceScore += 0.35f
            appliedRules.add("Detected high-urgency phrase: '$foundUrgent'")
        }

        // Dark pattern / promo scanning
        val foundPromo = promotionalDarkPatterns.firstOrNull { contentLower.contains(it) }
        if (foundPromo != null) {
            urgencyScore -= 0.30f
            relevanceScore -= 0.35f
            appliedRules.add("Detected promotional hook / artificial urgency: '$foundPromo'")
        }

        // Burst Activity Evaluation
        val isBurst = burstDetector.isBurstActive(event.timestamp)
        if (isBurst) {
            urgencyScore -= 0.20f
            appliedRules.add("Active Notification Burst detected in rolling 60s window")
        }

        // Apply Local Learning Weights
        val learnedOffset = learningEngine.getWeightOffset(packageName)
        if (learnedOffset != 0.0f) {
            relevanceScore += learnedOffset
            appliedRules.add(
                "Local Learning Adjustment: ${if (learnedOffset > 0) "+" else ""}${String.format("%.2f", learnedOffset)} based on past corrections"
            )
        }

        // Focus Session Factor
        if (isFocusSessionActive) {
            urgencyScore -= 0.15f
            appliedRules.add("Focus Mode is currently ACTIVE")
        }

        // Normalize Scores (0.0 to 1.0)
        urgencyScore = urgencyScore.coerceIn(0.0f, 1.0f)
        relevanceScore = relevanceScore.coerceIn(0.0f, 1.0f)
        val combinedPriority = (urgencyScore * 0.6f + relevanceScore * 0.4f).coerceIn(0.0f, 1.0f)

        // 3. Triage Classification
        val category: ClassificationCategory
        val recommendedAction: String
        val explanation: String

        if (urgencyScore >= 0.75f) {
            category = ClassificationCategory.URGENT
            recommendedAction = "Deliver immediately"
            explanation = "Classified as Urgent because high time-sensitivity cues were detected."
        } else if (relevanceScore >= 0.65f && !isFocusSessionActive) {
            category = ClassificationCategory.IMPORTANT
            recommendedAction = "Display in shade or prioritize in queue"
            explanation = "Classified as Important due to strong relevance cues, but not strictly time-critical."
        } else if (isFocusSessionActive || urgencyScore < 0.35f && relevanceScore >= 0.35f) {
            category = ClassificationCategory.BATCH
            recommendedAction = "Hold in Attention Airlock until next focus break"
            explanation = if (isFocusSessionActive) {
                "Routed to Batch queue because Focus Session is currently active."
            } else {
                "Routed to Batch queue for review during scheduled notification digest."
            }
        } else {
            category = ClassificationCategory.LOW_PRIORITY
            recommendedAction = "Mute silently and preserve in queue history"
            explanation = "Identified as Low Priority or promotional engagement bait."
        }

        val confidence = when {
            appliedRules.size >= 3 -> ConfidenceLevel.HIGH
            appliedRules.size >= 1 -> ConfidenceLevel.MEDIUM
            else -> ConfidenceLevel.LOW
        }

        return ClassificationResult(
            eventId = event.id,
            category = category,
            priorityScore = combinedPriority,
            urgencyScore = urgencyScore,
            relevanceScore = relevanceScore,
            confidence = confidence,
            explanation = explanation,
            appliedRules = appliedRules,
            recommendedAction = recommendedAction,
            isUserOverrideApplied = false
        )
    }
}
