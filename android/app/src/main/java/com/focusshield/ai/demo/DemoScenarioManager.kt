package com.focusshield.ai.demo

import com.focusshield.ai.model.NotificationEvent
import com.focusshield.ai.model.SourceType

enum class DemoScenarioType(val title: String, val description: String) {
    NORMAL_DAY(
        "1. Normal Day Traffic",
        "A regular workday flow with a few dispersed emails and routine calendar alerts."
    ),
    NOTIFICATION_STORM(
        "2. Interruption Storm (Burst)",
        "Rapid burst of 10 promotional and social pings within 30 seconds testing firewall burst response."
    ),
    REPETITIVE_ALERTS(
        "3. Repetitive App Harassment",
        "Single shopping app spamming repeated alerts ('Flash Sale Ends in 5m') testing de-duplication and dark-pattern detection."
    ),
    CRITICAL_EXCEPTION(
        "4. Critical Urgency During Focus",
        "A critical bank security OTP and emergency family call breaks through strict Focus Mode cleanly."
    ),
    STUDY_SESSION(
        "5. Deep Work / Study Airlock",
        "Group chats and meme pings arrive while deep focus timer is active and are quietly diverted to the Airlock."
    ),
    LEARNING_DEMO(
        "6. Adaptive Local Learning",
        "Demonstrates real-time on-device weight adaptation after a user corrects a past notification classification."
    )
}

object DemoScenarioManager {

    fun generateEventsForScenario(scenario: DemoScenarioType, baseTimestamp: Long = System.currentTimeMillis()): List<NotificationEvent> {
        return when (scenario) {
            DemoScenarioType.NORMAL_DAY -> listOf(
                NotificationEvent(
                    id = "demo_norm_1",
                    packageName = "com.google.android.gm",
                    appName = "Gmail",
                    title = "Project Roadmap Review",
                    text = "Arnav sent you the updated presentation slides for tomorrow.",
                    category = "email",
                    timestamp = baseTimestamp - 300_000L,
                    sourceType = SourceType.SIMULATED
                ),
                NotificationEvent(
                    id = "demo_norm_2",
                    packageName = "com.google.android.calendar",
                    appName = "Google Calendar",
                    title = "CASCADE '26 Hackathon Check-in",
                    text = "Event starts in 30 minutes in Auditorium Hall B.",
                    category = "reminder",
                    timestamp = baseTimestamp - 120_000L,
                    sourceType = SourceType.SIMULATED
                )
            )

            DemoScenarioType.NOTIFICATION_STORM -> {
                val stormList = mutableListOf<NotificationEvent>()
                val apps = listOf(
                    Triple("com.instagram.android", "Instagram", "Someone liked your photo"),
                    Triple("com.snapchat.android", "Snapchat", "Keep your 42-day streak alive!"),
                    Triple("com.flipkart.android", "Flipkart", "Mega Billion Day: 80% discount ending!"),
                    Triple("in.swiggy.android", "Swiggy", "Hungry? Free dessert on orders above 299"),
                    Triple("com.twitter.android", "X", "Trending near you: Tech Hackathon"),
                    Triple("com.whatsapp", "WhatsApp", "Group: [Meme Club] 15 new messages"),
                    Triple("com.amazon.mShop.android.shopping", "Amazon", "Items in your cart are on sale!"),
                    Triple("com.spotify.music", "Spotify", "Discover weekly playlist updated")
                )
                apps.forEachIndexed { index, app ->
                    stormList.add(
                        NotificationEvent(
                            id = "demo_storm_$index",
                            packageName = app.first,
                            appName = app.second,
                            title = app.second,
                            text = app.third,
                            category = "promo",
                            timestamp = baseTimestamp - ((apps.size - index) * 3_000L), // 3-second intervals
                            sourceType = SourceType.SIMULATED
                        )
                    )
                }
                stormList
            }

            DemoScenarioType.REPETITIVE_ALERTS -> listOf(
                NotificationEvent(
                    id = "demo_rep_1",
                    packageName = "com.shopping.deals",
                    appName = "SuperDeals",
                    title = "Sale Alert!",
                    text = "Hurry! 50% discount on headphones expires in 15 mins!",
                    category = "promo",
                    timestamp = baseTimestamp - 45_000L,
                    sourceType = SourceType.SIMULATED
                ),
                NotificationEvent(
                    id = "demo_rep_2",
                    packageName = "com.shopping.deals",
                    appName = "SuperDeals",
                    title = "Sale Alert!",
                    text = "Hurry! 50% discount on headphones expires in 10 mins!",
                    category = "promo",
                    timestamp = baseTimestamp - 25_000L,
                    sourceType = SourceType.SIMULATED
                ),
                NotificationEvent(
                    id = "demo_rep_3",
                    packageName = "com.shopping.deals",
                    appName = "SuperDeals",
                    title = "Sale Alert!",
                    text = "Last chance! Flash sale closing in 2 minutes!",
                    category = "promo",
                    timestamp = baseTimestamp - 5_000L,
                    sourceType = SourceType.SIMULATED
                )
            )

            DemoScenarioType.CRITICAL_EXCEPTION -> listOf(
                NotificationEvent(
                    id = "demo_crit_1",
                    packageName = "com.sbi.banking",
                    appName = "State Bank",
                    title = "Security Alert: One-Time Password",
                    text = "Your OTP for transaction of Rs 1,499 is 839201. Do not share.",
                    category = "msg",
                    timestamp = baseTimestamp - 10_000L,
                    sourceType = SourceType.SIMULATED
                ),
                NotificationEvent(
                    id = "demo_crit_2",
                    packageName = "com.google.android.dialer",
                    appName = "Phone",
                    title = "Incoming Urgent Call",
                    text = "Mom (+91 98230 XXXXX) - Calling",
                    category = "call",
                    timestamp = baseTimestamp - 2_000L,
                    sourceType = SourceType.SIMULATED
                )
            )

            DemoScenarioType.STUDY_SESSION -> listOf(
                NotificationEvent(
                    id = "demo_study_1",
                    packageName = "com.discord",
                    appName = "Discord",
                    title = "#general in CS26",
                    text = "Anyone free for valorant unranked?",
                    category = "social",
                    timestamp = baseTimestamp - 30_000L,
                    sourceType = SourceType.SIMULATED
                ),
                NotificationEvent(
                    id = "demo_study_2",
                    packageName = "com.reddit.frontpage",
                    appName = "Reddit",
                    title = "r/developers",
                    text = "10 mistakes every junior engineer makes",
                    category = "recommendation",
                    timestamp = baseTimestamp - 15_000L,
                    sourceType = SourceType.SIMULATED
                )
            )

            DemoScenarioType.LEARNING_DEMO -> listOf(
                NotificationEvent(
                    id = "demo_learn_1",
                    packageName = "com.medium.reader",
                    appName = "Medium",
                    title = "Architecture Digest",
                    text = "How to architect offline-first mobile applications with Jetpack Compose.",
                    category = "recommendation",
                    timestamp = baseTimestamp,
                    sourceType = SourceType.SIMULATED
                )
            )
        }
    }
}
