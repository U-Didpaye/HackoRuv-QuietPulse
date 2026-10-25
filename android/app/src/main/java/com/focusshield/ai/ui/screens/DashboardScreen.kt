package com.focusshield.ai.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.focusshield.ai.model.ClassificationCategory
import com.focusshield.ai.ui.FocusShieldViewModel
import com.focusshield.ai.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(
    viewModel: FocusShieldViewModel,
    onNavigateToQueue: () -> Unit,
    onNavigateToDemo: () -> Unit
) {
    val state by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.Shield,
                            contentDescription = "Shield",
                            tint = AccentCyan,
                            modifier = Modifier.size(28.dp)
                        )
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(
                            "FocusShield AI",
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = NavyDark)
            )
        },
        containerColor = NavyDark
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // 1. Connection Status Banner
            item {
                Card(
                    colors = CardDefaults.cardColors(
                        containerColor = if (state.isNotificationServiceConnected) NavyCard else NavyCardHover
                    ),
                    shape = RoundedCornerShape(14.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(12.dp)
                                .clip(CircleShape)
                                .background(if (state.isNotificationServiceConnected) SuccessGreen else ImportantAmber)
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = if (state.isNotificationServiceConnected) "Firewall Active & Listening" else "Demo & Standby Mode",
                                fontWeight = FontWeight.SemiBold,
                                color = TextPrimary,
                                fontSize = 14.sp
                            )
                            Text(
                                text = if (state.isNotificationServiceConnected) "Android NotificationListener bound" else "Real-time AI heuristics active in offline simulation",
                                color = TextSecondary,
                                fontSize = 12.sp
                            )
                        }
                    }
                }
            }

            // 2. Active Focus Status / Quick Launch
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = NavyCard),
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column {
                                Text(
                                    "ATTENTION SHIELD",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = AccentCyan,
                                    letterSpacing = 1.sp
                                )
                                Text(
                                    if (state.isFocusSessionActive) "Deep Work Session In Progress" else "Standard Interruption Filtering",
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = TextPrimary
                                )
                            }
                            if (state.isFocusSessionActive) {
                                val mins = state.remainingFocusSeconds / 60
                                val secs = state.remainingFocusSeconds % 60
                                Text(
                                    String.format("%02d:%02d", mins, secs),
                                    fontSize = 22.sp,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = AccentCyan
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(14.dp))

                        if (state.isFocusSessionActive) {
                            Button(
                                onClick = { viewModel.endFocusSession(completed = false) },
                                colors = ButtonDefaults.buttonColors(containerColor = UrgencyRed),
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(10.dp)
                            ) {
                                Text("End Focus Session Early", fontWeight = FontWeight.SemiBold)
                            }
                        } else {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(10.dp)
                            ) {
                                Button(
                                    onClick = { viewModel.startFocusSession("Pomodoro Focus", 25) },
                                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryIndigo),
                                    modifier = Modifier.weight(1f),
                                    shape = RoundedCornerShape(10.dp)
                                ) {
                                    Icon(Icons.Default.Timer, contentDescription = null, modifier = Modifier.size(16.dp))
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text("25m Focus", fontSize = 13.sp)
                                }
                                OutlinedButton(
                                    onClick = { viewModel.startFocusSession("Deep Work", 50) },
                                    modifier = Modifier.weight(1f),
                                    shape = RoundedCornerShape(10.dp)
                                ) {
                                    Text("50m Deep Work", fontSize = 13.sp, color = TextPrimary)
                                }
                            }
                        }
                    }
                }
            }

            // 3. Burst Rate & Triage Summary Cards
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Card(
                        colors = CardDefaults.cardColors(containerColor = NavyCard),
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier.weight(1f)
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Text("BURST RATE", fontSize = 11.sp, color = TextSecondary, fontWeight = FontWeight.SemiBold)
                            Spacer(modifier = Modifier.height(4.dp))
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    "${state.recentBurstRate}/min",
                                    fontSize = 20.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (state.isBurstActive) UrgencyRed else SuccessGreen
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                if (state.isBurstActive) {
                                    Text("STORM", fontSize = 10.sp, color = UrgencyRed, fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }

                    Card(
                        colors = CardDefaults.cardColors(containerColor = NavyCard),
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier.weight(1f)
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Text("DEFLECTED", fontSize = 11.sp, color = TextSecondary, fontWeight = FontWeight.SemiBold)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                "${state.metrics.estimatedInterruptionsDeflected} alerts",
                                fontSize = 20.sp,
                                fontWeight = FontWeight.Bold,
                                color = AccentCyan
                            )
                        }
                    }
                }
            }

            // 4. Quick Action Shortcut to Demo Lab
            item {
                OutlinedButton(
                    onClick = onNavigateToDemo,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = AccentCyan)
                ) {
                    Icon(Icons.Default.Science, contentDescription = null, modifier = Modifier.size(18.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Launch Judge Demo Lab (Simulate Notification Storms)", fontWeight = FontWeight.SemiBold)
                }
            }

            // 5. Recent Decisions Timeline
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        "Recent Intelligence Decisions",
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary,
                        fontSize = 16.sp
                    )
                    TextButton(onClick = onNavigateToQueue) {
                        Text("View Queue (${state.allItems.size})", color = AccentCyan)
                    }
                }
            }

            if (state.allItems.isEmpty()) {
                item {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 32.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Icon(Icons.Default.Inbox, contentDescription = null, tint = TextMuted, modifier = Modifier.size(40.dp))
                            Spacer(modifier = Modifier.height(8.dp))
                            Text("No notifications evaluated yet.", color = TextSecondary, fontSize = 14.sp)
                            Text("Run a scenario from Demo Lab to test.", color = TextMuted, fontSize = 12.sp)
                        }
                    }
                }
            } else {
                items(state.allItems.take(5)) { item ->
                    NotificationDecisionCard(item = item)
                }
            }

            item { Spacer(modifier = Modifier.height(16.dp)) }
        }
    }
}

@Composable
fun NotificationDecisionCard(item: com.focusshield.ai.ui.UiNotificationItem) {
    val categoryColor = when (item.result.category) {
        ClassificationCategory.URGENT -> UrgencyRed
        ClassificationCategory.IMPORTANT -> ImportantAmber
        ClassificationCategory.BATCH -> BatchBlue
        ClassificationCategory.LOW_PRIORITY -> LowPrioritySlate
    }

    Card(
        colors = CardDefaults.cardColors(containerColor = NavyCard),
        shape = RoundedCornerShape(12.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        item.event.appName,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary,
                        fontSize = 14.sp
                    )
                    if (item.event.sourceType == com.focusshield.ai.model.SourceType.SIMULATED) {
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            "[SIMULATED]",
                            fontSize = 10.sp,
                            color = AccentCyan,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }
                Surface(
                    color = categoryColor.copy(alpha = 0.2f),
                    shape = RoundedCornerShape(6.dp)
                ) {
                    Text(
                        item.result.category.name,
                        color = categoryColor,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(4.dp))
            Text(item.event.title, fontWeight = FontWeight.SemiBold, color = TextPrimary, fontSize = 13.sp)
            Text(item.event.text, color = TextSecondary, fontSize = 12.sp, maxLines = 2)

            Spacer(modifier = Modifier.height(8.dp))
            Divider(color = BorderSubtle, thickness = 0.5.dp)
            Spacer(modifier = Modifier.height(6.dp))

            Text(
                "💡 " + item.result.explanation,
                fontSize = 11.sp,
                color = AccentCyanLight,
                fontWeight = FontWeight.Medium
            )
        }
    }
}
