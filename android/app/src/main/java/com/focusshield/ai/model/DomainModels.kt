package com.focusshield.ai.model

data class BurstEvent(
    val id: String,
    val startTimeMillis: Long,
    val endTimeMillis: Long,
    val eventCount: Int,
    val dominantPackage: String?,
    val dominantAppName: String?,
    val affectedPackages: List<String>,
    val recommendation: String
)

enum class FocusSessionState {
    IDLE,
    RUNNING,
    PAUSED,
    COMPLETED
}

data class FocusSession(
    val id: String,
    val name: String,
    val targetDurationMinutes: Int,
    val startTimestamp: Long,
    var elapsedMillis: Long = 0L,
    var state: FocusSessionState = FocusSessionState.IDLE,
    val notificationsObservedCount: Int = 0,
    val nonUrgentInterruptedCount: Int = 0,
    val burstsDuringSessionCount: Int = 0,
    val completedSuccessfully: Boolean = false
)

enum class AppPriorityLevel {
    ALWAYS_URGENT,   // Family, primary work, bank alerts
    NORMAL,          // Standard default heuristic
    LOW_PRIORITY,    // Social media, shopping, games
    NEVER_INTERRUPT  // Quarantined always
}

data class UserRule(
    val id: String,
    val packageName: String,
    val appName: String,
    val priorityLevel: AppPriorityLevel,
    val urgentKeywords: List<String> = emptyList(),     // e.g. "OTP", "urgent", "call me", "security"
    val lowPriorityKeywords: List<String> = emptyList(),// e.g. "sale", "discount", "streak", "coins"
    val allowDuringFocus: Boolean = false
)

enum class UserFeedbackType {
    CORRECT,                    // Agrees with classification
    SHOULD_BE_URGENT,           // False negative on urgency
    MORE_IMPORTANT_THAN_EXPECTED,// False negative on relevance
    SAFE_TO_BATCH,              // Should have been held
    NOT_RELEVANT                // Spam / Low priority
}

data class FeedbackRecord(
    val eventId: String,
    val packageName: String,
    val originalCategory: ClassificationCategory,
    val feedbackType: UserFeedbackType,
    val timestamp: Long
)

data class AnalyticsMetrics(
    val totalNotificationsObserved: Int,
    val burstsDetected: Int,
    val repeatedInterruptionCount: Int,
    val urgentCount: Int,
    val importantCount: Int,
    val batchedCount: Int,
    val lowPriorityCount: Int,
    val totalFocusMinutes: Int,
    val completedSessionsCount: Int,
    val userCorrectionCount: Int,
    val estimatedInterruptionsDeflected: Int
)
