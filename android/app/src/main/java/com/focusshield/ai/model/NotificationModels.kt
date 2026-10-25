package com.focusshield.ai.model

enum class SourceType {
    REAL,
    SIMULATED
}

data class NotificationEvent(
    val id: String,
    val packageName: String,
    val appName: String,
    val title: String,
    val text: String,
    val category: String?,
    val timestamp: Long,
    val sourceType: SourceType = SourceType.REAL,
    val groupKey: String? = null,
    val isOngoing: Boolean = false,
    val isClearable: Boolean = true
)

enum class ClassificationCategory {
    URGENT,        // Time-sensitive, requires immediate attention (calls, OTPs, critical alarms)
    IMPORTANT,     // Highly relevant but can wait a few minutes or until a natural pause
    BATCH,         // Low urgency, non-critical updates suitable for batched review
    LOW_PRIORITY   // Repetitive, spam, engagement bait, or promotional notifications
}

enum class ConfidenceLevel {
    HIGH,
    MEDIUM,
    LOW
}

data class ClassificationResult(
    val eventId: String,
    val category: ClassificationCategory,
    val priorityScore: Float,         // 0.0 to 1.0
    val urgencyScore: Float,          // 0.0 to 1.0 (separate from relevance)
    val relevanceScore: Float,        // 0.0 to 1.0 (separate from urgency)
    val confidence: ConfidenceLevel,
    val explanation: String,
    val appliedRules: List<String>,
    val recommendedAction: String,
    val isUserOverrideApplied: Boolean = false
)
