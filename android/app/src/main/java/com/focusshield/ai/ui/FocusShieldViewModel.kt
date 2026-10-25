package com.focusshield.ai.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.focusshield.ai.demo.DemoScenarioManager
import com.focusshield.ai.demo.DemoScenarioType
import com.focusshield.ai.intelligence.burst.BurstDetector
import com.focusshield.ai.intelligence.burst.BurstSensitivity
import com.focusshield.ai.intelligence.classifier.ClassificationEngine
import com.focusshield.ai.intelligence.learning.LocalLearningEngine
import com.focusshield.ai.model.*
import com.focusshield.ai.service.FocusShieldNotificationListenerService
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.util.UUID

data class UiNotificationItem(
    val event: NotificationEvent,
    val result: ClassificationResult,
    val isReviewed: Boolean = false
)

data class FocusShieldUiState(
    val isNotificationServiceConnected: Boolean = false,
    val isFocusSessionActive: Boolean = false,
    val activeFocusSession: FocusSession? = null,
    val remainingFocusSeconds: Int = 0,
    val burstDetectorSensitivity: BurstSensitivity = BurstSensitivity.MEDIUM,
    val isBurstActive: Boolean = false,
    val recentBurstRate: Int = 0,
    val allItems: List<UiNotificationItem> = emptyList(),
    val userRules: Map<String, UserRule> = emptyMap(),
    val feedbackHistory: List<FeedbackRecord> = emptyList(),
    val metrics: AnalyticsMetrics = AnalyticsMetrics(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
)

class FocusShieldViewModel : ViewModel() {

    private val burstDetector = BurstDetector()
    private val learningEngine = LocalLearningEngine()
    private val classificationEngine = ClassificationEngine(learningEngine)

    private val _uiState = MutableStateFlow(FocusShieldUiState())
    val uiState = _uiState.asStateFlow()

    private var focusTimerJob: Job? = null

    init {
        loadDefaultRules()
        listenToLiveSystemNotifications()
    }

    private fun loadDefaultRules() {
        val defaults = listOf(
            UserRule(
                id = "rule_phone",
                packageName = "com.google.android.dialer",
                appName = "Phone",
                priorityLevel = AppPriorityLevel.ALWAYS_URGENT,
                allowDuringFocus = true
            ),
            UserRule(
                id = "rule_shopping",
                packageName = "com.flipkart.android",
                appName = "Flipkart",
                priorityLevel = AppPriorityLevel.LOW_PRIORITY,
                lowPriorityKeywords = listOf("sale", "discount", "offer")
            )
        ).associateBy { it.packageName }

        _uiState.update { it.copy(userRules = defaults) }
    }

    private fun listenToLiveSystemNotifications() {
        viewModelScope.launch {
            FocusShieldNotificationListenerService.incomingLiveEvents.collect { liveEvent ->
                liveEvent?.let { processNotification(it) }
            }
        }
    }

    fun processNotification(event: NotificationEvent) {
        val currentState = _uiState.value
        val burstEvent = burstDetector.recordEvent(event)
        val isBurst = burstDetector.isBurstActive(event.timestamp)
        val burstRate = burstDetector.getRecentBurstRate(event.timestamp)

        val classification = classificationEngine.classify(
            event = event,
            userRules = currentState.userRules,
            isFocusSessionActive = currentState.isFocusSessionActive,
            burstDetector = burstDetector
        )

        val newItem = UiNotificationItem(event = event, result = classification)

        _uiState.update { state ->
            val updatedList = listOf(newItem) + state.allItems
            val updatedMetrics = computeMetrics(updatedList, burstEvent != null, state)

            state.copy(
                isBurstActive = isBurst,
                recentBurstRate = burstRate,
                allItems = updatedList,
                metrics = updatedMetrics
            )
        }
    }

    private fun computeMetrics(items: List<UiNotificationItem>, newBurst: Boolean, state: FocusShieldUiState): AnalyticsMetrics {
        val total = items.size
        val urgent = items.count { it.result.category == ClassificationCategory.URGENT }
        val important = items.count { it.result.category == ClassificationCategory.IMPORTANT }
        val batched = items.count { it.result.category == ClassificationCategory.BATCH }
        val low = items.count { it.result.category == ClassificationCategory.LOW_PRIORITY }

        val burstsCount = state.metrics.burstsDetected + (if (newBurst) 1 else 0)
        val deflected = batched + low

        return state.metrics.copy(
            totalNotificationsObserved = total,
            burstsDetected = burstsCount,
            urgentCount = urgent,
            importantCount = important,
            batchedCount = batched,
            lowPriorityCount = low,
            estimatedInterruptionsDeflected = deflected
        )
    }

    // --- Focus Mode Actions ---

    fun startFocusSession(name: String, durationMinutes: Int) {
        focusTimerJob?.cancel()
        val session = FocusSession(
            id = UUID.randomUUID().toString(),
            name = name,
            targetDurationMinutes = durationMinutes,
            startTimestamp = System.currentTimeMillis(),
            state = FocusSessionState.RUNNING
        )

        _uiState.update {
            it.copy(
                isFocusSessionActive = true,
                activeFocusSession = session,
                remainingFocusSeconds = durationMinutes * 60
            )
        }

        focusTimerJob = viewModelScope.launch {
            while (_uiState.value.remainingFocusSeconds > 0) {
                delay(1000L)
                _uiState.update {
                    it.copy(remainingFocusSeconds = it.remainingFocusSeconds - 1)
                }
            }
            endFocusSession(completed = true)
        }
    }

    fun endFocusSession(completed: Boolean = false) {
        focusTimerJob?.cancel()
        _uiState.update { state ->
            val updatedMetrics = state.metrics.copy(
                completedSessionsCount = state.metrics.completedSessionsCount + (if (completed) 1 else 0),
                totalFocusMinutes = state.metrics.totalFocusMinutes + (state.activeFocusSession?.targetDurationMinutes ?: 0)
            )
            state.copy(
                isFocusSessionActive = false,
                activeFocusSession = null,
                remainingFocusSeconds = 0,
                metrics = updatedMetrics
            )
        }
    }

    // --- Queue Management ---

    fun markItemReviewed(eventId: String) {
        _uiState.update { state ->
            state.copy(
                allItems = state.allItems.map {
                    if (it.event.id == eventId) it.copy(isReviewed = true) else it
                }
            )
        }
    }

    fun dismissItem(eventId: String) {
        _uiState.update { state ->
            state.copy(
                allItems = state.allItems.filterNot { it.event.id == eventId }
            )
        }
    }

    fun reviewAllQueued() {
        _uiState.update { state ->
            state.copy(
                allItems = state.allItems.map {
                    if (it.result.category == ClassificationCategory.BATCH || it.result.category == ClassificationCategory.LOW_PRIORITY) {
                        it.copy(isReviewed = true)
                    } else it
                }
            )
        }
    }

    fun clearQueue() {
        _uiState.update { state ->
            state.copy(allItems = emptyList())
        }
    }

    // --- Feedback & Local Learning ---

    fun submitFeedback(eventId: String, feedbackType: UserFeedbackType) {
        val item = _uiState.value.allItems.find { it.event.id == eventId } ?: return
        val record = FeedbackRecord(
            eventId = eventId,
            packageName = item.event.packageName,
            originalCategory = item.result.category,
            feedbackType = feedbackType,
            timestamp = System.currentTimeMillis()
        )
        learningEngine.recordFeedback(record)

        _uiState.update { state ->
            state.copy(
                feedbackHistory = learningEngine.getFeedbackHistory(),
                metrics = state.metrics.copy(userCorrectionCount = state.metrics.userCorrectionCount + 1)
            )
        }
    }

    fun resetLearning() {
        learningEngine.reset()
        _uiState.update { it.copy(feedbackHistory = emptyList()) }
    }

    // --- Demo Lab Runner ---

    fun runDemoScenario(scenario: DemoScenarioType) {
        viewModelScope.launch {
            val events = DemoScenarioManager.generateEventsForScenario(scenario)
            for (event in events) {
                processNotification(event)
                delay(400L) // Staggered arrival for visual impact in demo
            }
        }
    }

    fun resetDemoData() {
        burstDetector.clear()
        _uiState.update { state ->
            state.copy(
                allItems = state.allItems.filter { it.event.sourceType == SourceType.REAL },
                isBurstActive = false,
                recentBurstRate = 0
            )
        }
    }

    fun updateRule(rule: UserRule) {
        _uiState.update { state ->
            val updated = state.userRules.toMutableMap()
            updated[rule.packageName] = rule
            state.copy(userRules = updated)
        }
    }
}
