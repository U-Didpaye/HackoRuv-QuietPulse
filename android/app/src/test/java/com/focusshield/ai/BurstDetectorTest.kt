package com.focusshield.ai

import com.focusshield.ai.intelligence.burst.BurstDetector
import com.focusshield.ai.intelligence.burst.BurstSensitivity
import com.focusshield.ai.model.NotificationEvent
import com.focusshield.ai.model.SourceType
import org.junit.Assert.*
import org.junit.Before
import org.junit.Test

class BurstDetectorTest {

    private lateinit var burstDetector: BurstDetector

    @Before
    fun setUp() {
        // High sensitivity: threshold of 4 events per minute
        burstDetector = BurstDetector(sensitivity = BurstSensitivity.HIGH, windowDurationMillis = 60_000L)
    }

    private fun createEvent(id: String, timestamp: Long, pkg: String = "com.test.app"): NotificationEvent {
        return NotificationEvent(
            id = id,
            packageName = pkg,
            appName = "TestApp",
            title = "Test Title",
            text = "Test Text",
            category = "msg",
            timestamp = timestamp,
            sourceType = SourceType.SIMULATED
        )
    }

    @Test
    fun testNormalTrafficDoesNotTriggerBurst() {
        val baseTime = 100_000L
        val event1 = createEvent("1", baseTime)
        val event2 = createEvent("2", baseTime + 15_000L)

        assertNull(burstDetector.recordEvent(event1))
        assertNull(burstDetector.recordEvent(event2))
        assertFalse(burstDetector.isBurstActive(baseTime + 15_000L))
    }

    @Test
    fun testBurstTriggeredWhenThresholdExceeded() {
        val baseTime = 100_000L
        createEvent("1", baseTime).also { burstDetector.recordEvent(it) }
        createEvent("2", baseTime + 2_000L).also { burstDetector.recordEvent(it) }
        createEvent("3", baseTime + 4_000L).also { burstDetector.recordEvent(it) }

        // 4th event reaches threshold (4 events in 60s)
        val burst = burstDetector.recordEvent(createEvent("4", baseTime + 6_000L))
        assertNotNull("Burst should be triggered on 4th rapid event", burst)
        assertEquals(4, burst?.eventCount)
        assertTrue(burstDetector.isBurstActive(baseTime + 6_000L))
    }

    @Test
    fun testDuplicateEventsAreIgnored() {
        val baseTime = 100_000L
        val event = createEvent("duplicate_1", baseTime)
        burstDetector.recordEvent(event)
        val secondAttempt = burstDetector.recordEvent(event)
        assertNull("Duplicate event should be rejected and return null", secondAttempt)
        assertEquals(1, burstDetector.getRecentBurstRate(baseTime))
    }

    @Test
    fun testRollingWindowExpiresOldEvents() {
        val baseTime = 100_000L
        burstDetector.recordEvent(createEvent("1", baseTime))
        burstDetector.recordEvent(createEvent("2", baseTime + 10_000L))
        burstDetector.recordEvent(createEvent("3", baseTime + 20_000L))

        // Fast forward 70 seconds past baseTime (60s window duration)
        val futureTime = baseTime + 75_000L
        assertEquals(0, burstDetector.getRecentBurstRate(futureTime))
        assertFalse(burstDetector.isBurstActive(futureTime))
    }
}
