package com.focusshield.ai.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.focusshield.ai.ui.FocusShieldViewModel
import com.focusshield.ai.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun InsightsScreen(viewModel: FocusShieldViewModel) {
    val state by viewModel.uiState.collectAsState()
    val metrics = state.metrics

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Insights & Analytics", fontWeight = FontWeight.Bold, color = TextPrimary) },
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
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = NavyCard),
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(18.dp)) {
                        Text("ATTENTION IMPACT SCORE", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = AccentCyan)
                        Spacer(modifier = Modifier.height(6.dp))
                        Row(verticalAlignment = Alignment.Bottom) {
                            Text(
                                "${metrics.estimatedInterruptionsDeflected}",
                                fontSize = 34.sp,
                                fontWeight = FontWeight.ExtraBold,
                                color = TextPrimary
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                "Interruptions Deflected",
                                fontSize = 14.sp,
                                color = TextSecondary,
                                modifier = Modifier.padding(bottom = 6.dp)
                            )
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            "Based on notifications triaged into Attention Airlock and Low-Priority batching instead of interrupting your active state.",
                            fontSize = 11.sp,
                            color = TextSecondary
                        )
                    }
                }
            }

            // Classification Breakdown Grid
            item {
                Text("Category Distribution", fontWeight = FontWeight.Bold, color = TextPrimary, fontSize = 15.sp)
                Spacer(modifier = Modifier.height(8.dp))

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    MetricBox(title = "Urgent", count = metrics.urgentCount, color = UrgencyRed, modifier = Modifier.weight(1f))
                    MetricBox(title = "Important", count = metrics.importantCount, color = ImportantAmber, modifier = Modifier.weight(1f))
                }
                Spacer(modifier = Modifier.height(10.dp))
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    MetricBox(title = "Batched", count = metrics.batchedCount, color = BatchBlue, modifier = Modifier.weight(1f))
                    MetricBox(title = "Low Priority", count = metrics.lowPriorityCount, color = LowPrioritySlate, modifier = Modifier.weight(1f))
                }
            }

            // Burst & Focus Telemetry
            item {
                Text("Burst & Focus Telemetry", fontWeight = FontWeight.Bold, color = TextPrimary, fontSize = 15.sp)
                Spacer(modifier = Modifier.height(8.dp))

                Card(
                    colors = CardDefaults.cardColors(containerColor = NavyCard),
                    shape = RoundedCornerShape(14.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("Total Events Observed", color = TextSecondary, fontSize = 13.sp)
                            Text("${metrics.totalNotificationsObserved}", fontWeight = FontWeight.Bold, color = TextPrimary)
                        }
                        Divider(color = BorderSubtle, thickness = 0.5.dp)
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("Notification Storms Detected", color = TextSecondary, fontSize = 13.sp)
                            Text("${metrics.burstsDetected}", fontWeight = FontWeight.Bold, color = UrgencyRed)
                        }
                        Divider(color = BorderSubtle, thickness = 0.5.dp)
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("Total Focus Minutes", color = TextSecondary, fontSize = 13.sp)
                            Text("${metrics.totalFocusMinutes} mins", fontWeight = FontWeight.Bold, color = AccentCyan)
                        }
                        Divider(color = BorderSubtle, thickness = 0.5.dp)
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("User Learning Corrections", color = TextSecondary, fontSize = 13.sp)
                            Text("${metrics.userCorrectionCount}", fontWeight = FontWeight.Bold, color = SuccessGreen)
                        }
                    }
                }
            }

            item { Spacer(modifier = Modifier.height(24.dp)) }
        }
    }
}

@Composable
fun MetricBox(title: String, count: Int, color: androidx.compose.ui.graphics.Color, modifier: Modifier) {
    Card(
        colors = CardDefaults.cardColors(containerColor = NavyCard),
        shape = RoundedCornerShape(12.dp),
        modifier = modifier
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Text(title, fontSize = 12.sp, color = TextSecondary, fontWeight = FontWeight.SemiBold)
            Spacer(modifier = Modifier.height(4.dp))
            Text("$count", fontSize = 22.sp, fontWeight = FontWeight.Bold, color = color)
        }
    }
}
