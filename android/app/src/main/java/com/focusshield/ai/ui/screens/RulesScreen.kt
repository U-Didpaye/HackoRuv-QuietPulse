package com.focusshield.ai.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
import com.focusshield.ai.model.AppPriorityLevel
import com.focusshield.ai.model.UserRule
import com.focusshield.ai.ui.FocusShieldViewModel
import com.focusshield.ai.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RulesScreen(viewModel: FocusShieldViewModel) {
    val state by viewModel.uiState.collectAsState()
    var newAppName by remember { mutableStateOf("") }
    var newAppPkg by remember { mutableStateOf("") }
    var selectedPriority by remember { mutableStateOf(AppPriorityLevel.ALWAYS_URGENT) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Personalization & Rules", fontWeight = FontWeight.Bold, color = TextPrimary) },
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
                    shape = RoundedCornerShape(14.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text("Add Custom Application Override", fontWeight = FontWeight.Bold, color = TextPrimary, fontSize = 14.sp)
                        Spacer(modifier = Modifier.height(10.dp))

                        OutlinedTextField(
                            value = newAppName,
                            onValueChange = { newAppName = it },
                            label = { Text("App Name (e.g. Boss Chat, Hospital Alert)") },
                            modifier = Modifier.fillMaxWidth(),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = AccentCyan,
                                unfocusedBorderColor = BorderSubtle,
                                focusedTextColor = TextPrimary,
                                unfocusedTextColor = TextPrimary
                            )
                        )
                        Spacer(modifier = Modifier.height(8.dp))

                        OutlinedTextField(
                            value = newAppPkg,
                            onValueChange = { newAppPkg = it },
                            label = { Text("Package Name (e.g. com.vip.app)") },
                            modifier = Modifier.fillMaxWidth(),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = AccentCyan,
                                unfocusedBorderColor = BorderSubtle,
                                focusedTextColor = TextPrimary,
                                unfocusedTextColor = TextPrimary
                            )
                        )
                        Spacer(modifier = Modifier.height(10.dp))

                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Button(
                                onClick = {
                                    if (newAppName.isNotBlank() && newAppPkg.isNotBlank()) {
                                        viewModel.updateRule(
                                            UserRule(
                                                id = "rule_${System.currentTimeMillis()}",
                                                packageName = newAppPkg.trim(),
                                                appName = newAppName.trim(),
                                                priorityLevel = AppPriorityLevel.ALWAYS_URGENT,
                                                allowDuringFocus = true
                                            )
                                        )
                                        newAppName = ""
                                        newAppPkg = ""
                                    }
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = PrimaryIndigo),
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier.weight(1f)
                            ) {
                                Text("Add as VIP (Always Urgent)", fontSize = 11.sp)
                            }

                            Button(
                                onClick = {
                                    if (newAppName.isNotBlank() && newAppPkg.isNotBlank()) {
                                        viewModel.updateRule(
                                            UserRule(
                                                id = "rule_${System.currentTimeMillis()}",
                                                packageName = newAppPkg.trim(),
                                                appName = newAppName.trim(),
                                                priorityLevel = AppPriorityLevel.NEVER_INTERRUPT,
                                                allowDuringFocus = false
                                            )
                                        )
                                        newAppName = ""
                                        newAppPkg = ""
                                    }
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = LowPrioritySlate),
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier.weight(1f)
                            ) {
                                Text("Add as Silent", fontSize = 11.sp)
                            }
                        }
                    }
                }
            }

            item {
                Text("Active Override Rules", fontWeight = FontWeight.Bold, color = TextPrimary, fontSize = 15.sp)
            }

            items(state.userRules.values.toList()) { rule ->
                Card(
                    colors = CardDefaults.cardColors(containerColor = NavyCard),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(14.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(rule.appName, fontWeight = FontWeight.Bold, color = TextPrimary, fontSize = 14.sp)
                            Text(rule.packageName, color = TextMuted, fontSize = 11.sp)
                        }
                        Surface(
                            color = if (rule.priorityLevel == AppPriorityLevel.ALWAYS_URGENT) UrgencyRed.copy(alpha = 0.2f) else LowPrioritySlate.copy(alpha = 0.2f),
                            shape = RoundedCornerShape(6.dp)
                        ) {
                            Text(
                                rule.priorityLevel.name,
                                color = if (rule.priorityLevel == AppPriorityLevel.ALWAYS_URGENT) UrgencyRed else TextSecondary,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }
                    }
                }
            }

            item { Spacer(modifier = Modifier.height(24.dp)) }
        }
    }
}
