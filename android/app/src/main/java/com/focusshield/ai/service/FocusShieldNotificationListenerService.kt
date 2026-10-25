package com.focusshield.ai.service

import android.app.Notification
import android.content.Intent
import android.os.IBinder
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import com.focusshield.ai.model.NotificationEvent
import com.focusshield.ai.model.SourceType
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow

class FocusShieldNotificationListenerService : NotificationListenerService() {

    companion object {
        private const val TAG = "FocusShieldService"
        var isServiceConnected = false
            private set

        private val _incomingLiveEvents = MutableStateFlow<NotificationEvent?>(null)
        val incomingLiveEvents = _incomingLiveEvents.asStateFlow()

        private val _dismissedKeyEvents = MutableStateFlow<String?>(null)
        val dismissedKeyEvents = _dismissedKeyEvents.asStateFlow()
    }

    override fun onListenerConnected() {
        super.onListenerConnected()
        isServiceConnected = true
        Log.i(TAG, "FocusShield NotificationListenerService connected successfully.")
    }

    override fun onListenerDisconnected() {
        super.onListenerDisconnected()
        isServiceConnected = false
        Log.w(TAG, "FocusShield NotificationListenerService disconnected.")
    }

    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        super.onNotificationPosted(sbn)
        if (sbn == null) return

        try {
            val packageName = sbn.packageName ?: "unknown"
            // Ignore FocusShield's own notifications to avoid feedback loops
            if (packageName == applicationContext.packageName) return

            val notification = sbn.notification ?: return
            val extras = notification.extras

            val title = extras?.getCharSequence(Notification.EXTRA_TITLE)?.toString() ?: ""
            val text = extras?.getCharSequence(Notification.EXTRA_TEXT)?.toString()
                ?: extras?.getCharSequence(Notification.EXTRA_BIG_TEXT)?.toString()
                ?: ""

            // Extract application friendly name safely
            val pm = applicationContext.packageManager
            val appName = try {
                val appInfo = pm.getApplicationInfo(packageName, 0)
                pm.getApplicationLabel(appInfo).toString()
            } catch (e: Exception) {
                packageName.substringAfterLast('.')
            }

            val category = notification.category
            val isOngoing = (notification.flags and Notification.FLAG_ONGOING_EVENT) != 0
            val isClearable = sbn.isClearable
            val groupKey = sbn.groupKey

            val event = NotificationEvent(
                id = sbn.key ?: "${packageName}_${sbn.postTime}",
                packageName = packageName,
                appName = appName,
                title = title,
                text = text,
                category = category,
                timestamp = sbn.postTime,
                sourceType = SourceType.REAL,
                groupKey = groupKey,
                isOngoing = isOngoing,
                isClearable = isClearable
            )

            // Publish safely to on-device memory stream
            _incomingLiveEvents.value = event

        } catch (t: Throwable) {
            Log.e(TAG, "Error safely processing StatusBarNotification: ${t.message}", t)
        }
    }

    override fun onNotificationRemoved(sbn: StatusBarNotification?) {
        super.onNotificationRemoved(sbn)
        if (sbn == null) return
        _dismissedKeyEvents.value = sbn.key
    }
}
