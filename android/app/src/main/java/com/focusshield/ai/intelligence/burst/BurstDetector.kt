package com.focusshield.ai.intelligence.burst

import com.focusshield.ai.model.BurstEvent
import com.focusshield.ai.model.NotificationEvent
import java.util.UUID

enum class BurstSensitivity(val thresholdEventsPerMinute: Int) {
    LOW(10),     // Only flags massive storms
    MEDIUM(6),   // Standard balanced setting
    HIGH(4)      // Strict focus protection
}

class BurstDetector(
    var sensitivity: BurstSensitivity = BurstSensitivity.MEDIUM,
    var windowDurationMillis: Long = 60_000L // 60 seconds rolling window
) {
    // Monotonic timestamp + event store for the rolling window
    private val recentEvents = mutableListOf<NotificationEvent>()
    private val processedEventIds = mutableSetOf<String>()

    fun recordEvent(event: NotificationEvent): BurstEvent? {
        // Prevent duplicate processing
        if (processedEventIds.contains(event.id)) {
            return null
        }
        processedEventIds.add(event.id)
        if (processedEventIds.size > 500) {
            // Keep memory bounded
            processedEventIds.clear()
        }

        val currentTime = event.timestamp
        recentEvents.add(event)

        // Evict events outside rolling window
        val windowStart = currentTime - windowDurationMillis
        recentEvents.removeAll { it.timestamp < windowStart }

        val count = recentEvents.size
        if (count >= sensitivity.thresholdEventsPerMinute) {
            // Detect dominant packages
            val packageCounts = recentEvents.groupingBy { it.packageName }.eachCount()
            val dominant = packageCounts.maxByOrNull { it.value }
            val dominantPackage = dominant?.key
            val dominantAppName = recentEvents.find { it.packageName == dominantPackage }?.appName
            val affectedPackages = packageCounts.keys.toList()

            val recommendation = if (dominant != null && dominant.value >= (count * 0.6)) {
                "Notification storm from $dominantAppName (${dominant.value} alerts in 60s). Recommend silencing this app temporarily."
            } else {
                "Rapid multi-app interruption storm ($count alerts across ${affectedPackages.size} apps). Activating Attention Airlock."
            }

            return BurstEvent(
                id = UUID.randomUUID().toString(),
                startTimeMillis = windowStart,
                endTimeMillis = currentTime,
                eventCount = count,
                dominantPackage = dominantPackage,
                dominantAppName = dominantAppName,
                affectedPackages = affectedPackages,
                recommendation = recommendation
            )
        }
        return null
    }

    fun isBurstActive(currentTime: Long): Boolean {
        val windowStart = currentTime - windowDurationMillis
        recentEvents.removeAll { it.timestamp < windowStart }
        return recentEvents.size >= sensitivity.thresholdEventsPerMinute
    }

    fun getRecentBurstRate(currentTime: Long): Int {
        val windowStart = currentTime - windowDurationMillis
        recentEvents.removeAll { it.timestamp < windowStart }
        return recentEvents.size
    }

    fun clear() {
        recentEvents.clear()
        processedEventIds.clear()
    }
}
