package com.focusshield.ai.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.focusshield.ai.ui.FocusShieldViewModel
import com.focusshield.ai.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FocusScreen(viewModel: FocusShieldViewModel) {
    val state by viewModel.uiState.collectAsState()
    var customMinutes by remember { mutableStateOf(30f) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Focus Sessions", fontWeight = FontWeight.Bold, color = TextPrimary) },
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
            verticalArrangement = Arrangement.spacedBy(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = NavyCard),
                    shape = RoundedCornerShape(20.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = if (state.isFocusSessionActive) "PROTECTED ATTENTION WINDOW" else "READY TO FOCUS",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = AccentCyan,
                            letterSpacing = 1.sp
                        )

                        Spacer(modifier = Modifier.height(16.dp))

                        // Large Circular Focus Timer
                        Box(contentAlignment = Alignment.Center, modifier = Modifier.size(180.dp)) {
                            CircularProgressIndicator(
                                progress = {
                                    if (state.isFocusSessionActive && state.activeFocusSession != null) {
                                        val total = state.activeFocusSession!!.targetDurationMinutes * 60f
                                        (state.remainingFocusSeconds / total).coerceIn(0f, 1f)
                                    } else 1f
                                },
                                modifier = Modifier.fillMaxSize(),
                                color = AccentCyan,
                                strokeWidth = 8.dp,
                                trackColor = BorderSubtle
                            )
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                if (state.isFocusSessionActive) {
                                    val mins = state.remainingFocusSeconds / 60
                                    val secs = state.remainingFocusSeconds % 60
                                    Text(
                                        String.format("%02d:%02d", mins, secs),
                                        fontSize = 38.sp,
                                        fontWeight = FontWeight.ExtraBold,
                                        color = TextPrimary
                                    )
                                    Text(state.activeFocusSession?.name ?: "Focus", fontSize = 12.sp, color = TextSecondary)
                                } else {
                                    Text(
                                        "${customMinutes.toInt()}m",
                                        fontSize = 36.sp,
                                        fontWeight = FontWeight.ExtraBold,
                                        color = TextPrimary
                                    )
                                    Text("Duration", fontSize = 12.sp, color = TextSecondary)
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(24.dp))

                        if (state.isFocusSessionActive) {
                            Button(
                                onClick = { viewModel.endFocusSession(completed = false) },
                                colors = ButtonDefaults.buttonColors(containerColor = UrgencyRed),
                                shape = RoundedCornerShape(12.dp),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Icon(Icons.Default.Stop, contentDescription = null)
                                Spacer(modifier = Modifier.width(8.dp))
                                Text("Stop Focus Session", fontWeight = FontWeight.Bold)
                            }
                        } else {
                            Column(modifier = Modifier.fillMaxWidth()) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                                ) {
                                    Button(
                                        onClick = { viewModel.startFocusSession("Pomodoro Focus", 25) },
                                        colors = ButtonDefaults.buttonColors(containerColor = PrimaryIndigo),
                                        shape = RoundedCornerShape(10.dp),
                                        modifier = Modifier.weight(1f)
                                    ) {
                                        Text("25m Pomodoro")
                                    }
                                    Button(
                                        onClick = { viewModel.startFocusSession("Deep Work", 50) },
                                        colors = ButtonDefaults.buttonColors(containerColor = PrimaryIndigo),
                                        shape = RoundedCornerShape(10.dp),
                                        modifier = Modifier.weight(1f)
                                    ) {
                                        Text("50m Deep Work")
                                    }
                                }

                                Spacer(modifier = Modifier.height(16.dp))
                                Text("Custom Duration: ${customMinutes.toInt()} mins", color = TextSecondary, fontSize = 13.sp)
                                Slider(
                                    value = customMinutes,
                                    onValueChange = { customMinutes = it },
                                    valueRange = 5f..120f,
                                    steps = 22,
                                    colors = SliderDefaults.colors(thumbColor = AccentCyan, activeTrackColor = AccentCyan)
                                )

                                Spacer(modifier = Modifier.height(8.dp))
                                Button(
                                    onClick = { viewModel.startFocusSession("Custom Focus", customMinutes.toInt()) },
                                    colors = ButtonDefaults.buttonColors(containerColor = AccentCyan),
                                    shape = RoundedCornerShape(12.dp),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Text("Start Custom Focus", color = NavyDark, fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }
                }
            }

            // Real Metrics Card
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = NavyCard),
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text("FOCUS STATISTICS", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = TextSecondary)
                        Spacer(modifier = Modifier.height(12.dp))
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Column {
                                Text("${state.metrics.totalFocusMinutes} mins", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = AccentCyan)
                                Text("Focus Time Logged", fontSize = 12.sp, color = TextSecondary)
                            }
                            Column {
                                Text("${state.metrics.completedSessionsCount}", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = SuccessGreen)
                                Text("Completed Sessions", fontSize = 12.sp, color = TextSecondary)
                            }
                            Column {
                                Text("${state.metrics.estimatedInterruptionsDeflected}", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = PrimaryIndigo)
                                Text("Alerts Queued", fontSize = 12.sp, color = TextSecondary)
                            }
                        }
                    }
                }
            }

            // Platform Transparency Notice
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = NavySurface),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(modifier = Modifier.padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Info, contentDescription = null, tint = AccentCyan, modifier = Modifier.size(20.dp))
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(
                            "Transparent Architecture: FocusShield prioritizes and batches notifications in your local Attention Airlock. It does not tamper with system ringers or claim unsupported root blocking.",
                            fontSize = 11.sp,
                            color = TextSecondary
                        )
                    }
                }
            }

            item { Spacer(modifier = Modifier.height(16.dp)) }
        }
    }
}
