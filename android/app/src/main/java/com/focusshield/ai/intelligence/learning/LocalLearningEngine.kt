package com.focusshield.ai.intelligence.learning

import com.focusshield.ai.model.FeedbackRecord
import com.focusshield.ai.model.UserFeedbackType

/**
 * Privacy-Preserving Bounded Local Learning Engine
 * Adjusts heuristic weight offsets per package entirely on-device.
 * Clamps changes within [-0.4, +0.4] so a single accidental tap cannot break the firewall.
 */
class LocalLearningEngine {

    // Package-level priority delta adjustments (bounded between -0.4f and +0.4f)
    private val packageWeightOffsets = mutableMapOf<String, Float>()
    private val feedbackHistory = mutableListOf<FeedbackRecord>()

    private val learningRate = 0.15f
    private val maxDelta = 0.40f

    fun recordFeedback(record: FeedbackRecord) {
        feedbackHistory.add(record)
        val currentOffset = packageWeightOffsets.getOrDefault(record.packageName, 0.0f)

        val delta = when (record.feedbackType) {
            UserFeedbackType.CORRECT -> 0.0f
            UserFeedbackType.SHOULD_BE_URGENT -> +learningRate * 1.5f
            UserFeedbackType.MORE_IMPORTANT_THAN_EXPECTED -> +learningRate
            UserFeedbackType.SAFE_TO_BATCH -> -learningRate
            UserFeedbackType.NOT_RELEVANT -> -learningRate * 1.5f
        }

        val newOffset = (currentOffset + delta).coerceIn(-maxDelta, maxDelta)
        packageWeightOffsets[record.packageName] = newOffset
    }

    fun getWeightOffset(packageName: String): Float {
        return packageWeightOffsets.getOrDefault(packageName, 0.0f)
    }

    fun getFeedbackCount(): Int = feedbackHistory.size

    fun getFeedbackHistory(): List<FeedbackRecord> = feedbackHistory.toList()

    fun reset() {
        packageWeightOffsets.clear()
        feedbackHistory.clear()
    }
}
