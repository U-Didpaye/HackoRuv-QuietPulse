package com.focusshield.ai

import com.focusshield.ai.intelligence.burst.BurstDetector
import com.focusshield.ai.intelligence.classifier.ClassificationEngine
import com.focusshield.ai.intelligence.learning.LocalLearningEngine
import com.focusshield.ai.model.*
import org.junit.Assert.*
import org.junit.Before
import org.junit.Test

class ClassificationEngineTest {

    private lateinit var learningEngine: LocalLearningEngine
    private lateinit var classificationEngine: ClassificationEngine
    private lateinit var burstDetector: BurstDetector

    @Before
    fun setUp() {
        learningEngine = LocalLearningEngine()
        classificationEngine = ClassificationEngine(learningEngine)
        burstDetector = BurstDetector()
    }

    private fun sampleEvent(title: String, text: String, pkg: String = "com.chat.sample", category: String? = "msg"): NotificationEvent {
        return NotificationEvent(
            id = "evt_1",
            packageName = pkg,
            appName = "SampleApp",
            title = title,
            text = text,
            category = category,
            timestamp = 1000L,
            sourceType = SourceType.SIMULATED
        )
    }

    @Test
    fun testUrgentKeywordsTriggerUrgentClassification() {
        val event = sampleEvent("Bank Security Alert", "Your OTP verification code is 492019.")
        val result = classificationEngine.classify(event, emptyMap(), isFocusSessionActive = false, burstDetector)

        assertEquals(ClassificationCategory.URGENT, result.category)
        assertTrue(result.urgencyScore >= 0.75f)
        assertTrue(result.appliedRules.any { it.contains("otp", ignoreCase = true) })
    }

    @Test
    fun testPromotionalPatternsTriggerLowPriorityClassification() {
        val event = sampleEvent("Mega Flash Sale", "Hurry! 70% off discount expires in 10 minutes!")
        val result = classificationEngine.classify(event, emptyMap(), isFocusSessionActive = false, burstDetector)

        assertEquals(ClassificationCategory.LOW_PRIORITY, result.category)
        assertTrue(result.appliedRules.any { it.contains("promotional hook", ignoreCase = true) })
    }

    @Test
    fun testExplicitUserRuleOverridesHeuristics() {
        val event = sampleEvent("Casual Message", "Hey check this out", pkg = "com.vip.boss")
        val rules = mapOf(
            "com.vip.boss" to UserRule(
                id = "rule_1",
                packageName = "com.vip.boss",
                appName = "Boss Chat",
                priorityLevel = AppPriorityLevel.ALWAYS_URGENT
            )
        )

        val result = classificationEngine.classify(event, rules, isFocusSessionActive = false, burstDetector)
        assertEquals(ClassificationCategory.URGENT, result.category)
        assertTrue(result.isUserOverrideApplied)
        assertTrue(result.appliedRules.any { it.contains("Explicit User Rule") })
    }

    @Test
    fun testFocusModeRoutesNonUrgentToBatch() {
        val event = sampleEvent("Team Standup", "Here are the notes from today's meeting")
        val result = classificationEngine.classify(event, emptyMap(), isFocusSessionActive = true, burstDetector)

        assertEquals(ClassificationCategory.BATCH, result.category)
        assertTrue(result.appliedRules.any { it.contains("Focus Mode is currently ACTIVE") })
    }

    @Test
    fun testLocalLearningAdaptsScoreOnCorrection() {
        val pkg = "com.news.daily"
        val event = sampleEvent("Morning Headlines", "Tech industry updates", pkg = pkg)

        // Initial classification
        val initialResult = classificationEngine.classify(event, emptyMap(), isFocusSessionActive = false, burstDetector)

        // User feedback: User marks it as NOT_RELEVANT
        learningEngine.recordFeedback(
            FeedbackRecord(
                eventId = event.id,
                packageName = pkg,
                originalCategory = initialResult.category,
                feedbackType = UserFeedbackType.NOT_RELEVANT,
                timestamp = 2000L
            )
        )

        // Subsequent classification of the same app
        val adaptedResult = classificationEngine.classify(event, emptyMap(), isFocusSessionActive = false, burstDetector)
        assertTrue("Adapted relevance score should be lower after NOT_RELEVANT feedback", adaptedResult.relevanceScore < initialResult.relevanceScore)
        assertTrue(adaptedResult.appliedRules.any { it.contains("Local Learning Adjustment") })
    }
}
