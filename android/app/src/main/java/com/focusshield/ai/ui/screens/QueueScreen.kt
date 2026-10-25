package com.focusshield.ai.ui.screens

import androidx.compose.foundation.background
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
import com.focusshield.ai.model.ClassificationCategory
import com.focusshield.ai.model.UserFeedbackType
import com.focusshield.ai.ui.FocusShieldViewModel
import com.focusshield.ai.ui.UiNotificationItem
import com.focusshield.ai.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun QueueScreen(viewModel: FocusShieldViewModel) {
    val state by viewModel.uiState.collectAsState()
    var selectedFilter by remember { mutableStateOf("ALL") }
    var searchQuery by remember { mutableStateOf("") }
    var showDigestDialog by remember { mutableStateOf(false) }

    val filteredItems = state.allItems.filter { item ->
        val matchesCategory = when (selectedFilter) {
            "URGENT" -> item.result.category == ClassificationCategory.URGENT
            "IMPORTANT" -> item.result.category == ClassificationCategory.IMPORTANT
            "BATCH" -> item.result.category == ClassificationCategory.BATCH
            "LOW" -> item.result.category == ClassificationCategory.LOW_PRIORITY
            else -> true
        }
        val matchesSearch = searchQuery.isEmpty() ||
                item.event.appName.contains(searchQuery, ignoreCase = true) ||
                item.event.title.contains(searchQuery, ignoreCase = true) ||
                item.event.text.contains(searchQuery, ignoreCase = true)

        matchesCategory && matchesSearch
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Attention Queue", fontWeight = FontWeight.Bold, color = TextPrimary) },
                actions = {
                    IconButton(onClick = { showDigestDialog = true }) {
                        Icon(Icons.Default.Summarize, contentDescription = "Digest", tint = AccentCyan)
                    }
                    IconButton(onClick = { viewModel.reviewAllQueued() }) {
                        Icon(Icons.Default.DoneAll, contentDescription = "Review All", tint = SuccessGreen)
                    }
                    IconButton(onClick = { viewModel.clearQueue() }) {
                        Icon(Icons.Default.DeleteSweep, contentDescription = "Clear Queue", tint = TextSecondary)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = NavyDark)
            )
        },
        containerColor = NavyDark
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp)
        ) {
            // Search Input
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                placeholder = { Text("Search queued notifications...", color = TextMuted) },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = TextSecondary) },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp),
                shape = RoundedCornerShape(12.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = AccentCyan,
                    unfocusedBorderColor = BorderSubtle,
                    focusedTextColor = TextPrimary,
                    unfocusedTextColor = TextPrimary
                ),
                singleLine = true
            )

            // Category Filter Chips
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 6.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                listOf("ALL", "URGENT", "IMPORTANT", "BATCH", "LOW").forEach { filter ->
                    FilterChip(
                        selected = selectedFilter == filter,
                        onClick = { selectedFilter = filter },
                        label = { Text(filter, fontSize = 11.sp, fontWeight = FontWeight.SemiBold) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = PrimaryIndigo,
                            selectedLabelColor = TextPrimary,
                            containerColor = NavyCard,
                            labelColor = TextSecondary
                        )
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            if (filteredItems.isEmpty()) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(Icons.Default.CheckCircle, contentDescription = null, tint = SuccessGreen, modifier = Modifier.size(48.dp))
                        Spacer(modifier = Modifier.height(10.dp))
                        Text("Queue is Clear!", fontWeight = FontWeight.Bold, color = TextPrimary, fontSize = 16.sp)
                        Text("No pending interruptions match this filter.", color = TextSecondary, fontSize = 13.sp)
                    }
                }
            } else {
                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                    modifier = Modifier.fillMaxSize()
                ) {
                    items(filteredItems, key = { it.event.id }) { item ->
                        QueueItemCard(
                            item = item,
                            onDismiss = { viewModel.dismissItem(item.event.id) },
                            onMarkReviewed = { viewModel.markItemReviewed(item.event.id) },
                            onFeedback = { feedbackType -> viewModel.submitFeedback(item.event.id, feedbackType) }
                        )
                    }
                    item { Spacer(modifier = Modifier.height(24.dp)) }
                }
            }
        }
    }

    if (showDigestDialog) {
        val nonUrgent = state.allItems.filter {
            it.result.category == ClassificationCategory.BATCH || it.result.category == ClassificationCategory.LOW_PRIORITY
        }
        val appSummary = nonUrgent.groupingBy { it.event.appName }.eachCount()

        AlertDialog(
            onDismissRequest = { showDigestDialog = false },
            confirmButton = {
                TextButton(onClick = { showDigestDialog = false }) {
                    Text("Close Digest", color = AccentCyan)
                }
            },
            title = { Text("Smart Attention Digest", fontWeight = FontWeight.Bold) },
            text = {
                Column {
                    Text(
                        "${nonUrgent.size} non-urgent notifications held peacefully in the airlock without screen disturbance.",
                        fontSize = 13.sp,
                        color = TextSecondary
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Text("Breakdown by Application:", fontWeight = FontWeight.SemiBold, fontSize = 13.sp, color = TextPrimary)
                    Spacer(modifier = Modifier.height(6.dp))
                    appSummary.forEach { (app, count) ->
                        Text("• $app: $count notifications", fontSize = 12.sp, color = AccentCyanLight)
                    }
                }
            },
            containerColor = NavyCard,
            textContentColor = TextPrimary,
            titleContentColor = TextPrimary
        )
    }
}

@Composable
fun QueueItemCard(
    item: UiNotificationItem,
    onDismiss: () -> Unit,
    onMarkReviewed: () -> Unit,
    onFeedback: (UserFeedbackType) -> Unit
) {
    val categoryColor = when (item.result.category) {
        ClassificationCategory.URGENT -> UrgencyRed
        ClassificationCategory.IMPORTANT -> ImportantAmber
        ClassificationCategory.BATCH -> BatchBlue
        ClassificationCategory.LOW_PRIORITY -> LowPrioritySlate
    }

    Card(
        colors = CardDefaults.cardColors(
            containerColor = if (item.isReviewed) NavySurface else NavyCard
        ),
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
                    Text(item.event.appName, fontWeight = FontWeight.Bold, color = TextPrimary, fontSize = 14.sp)
                    if (item.event.sourceType == com.focusshield.ai.model.SourceType.SIMULATED) {
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("[SIMULATED]", fontSize = 10.sp, color = AccentCyan, fontWeight = FontWeight.SemiBold)
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
            Text(item.event.text, color = TextSecondary, fontSize = 12.sp)

            Spacer(modifier = Modifier.height(6.dp))
            Text(
                "💡 " + item.result.explanation,
                fontSize = 11.sp,
                color = AccentCyanLight
            )

            Spacer(modifier = Modifier.height(8.dp))
            Divider(color = BorderSubtle, thickness = 0.5.dp)
            Spacer(modifier = Modifier.height(8.dp))

            // Action row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                    TextButton(onClick = { onFeedback(UserFeedbackType.SHOULD_BE_URGENT) }) {
                        Text("Was Urgent", fontSize = 11.sp, color = UrgencyRed)
                    }
                    TextButton(onClick = { onFeedback(UserFeedbackType.SAFE_TO_BATCH) }) {
                        Text("Batch It", fontSize = 11.sp, color = BatchBlue)
                    }
                }
                Row {
                    IconButton(onClick = onMarkReviewed) {
                        Icon(Icons.Default.Check, contentDescription = "Reviewed", tint = if (item.isReviewed) SuccessGreen else TextMuted)
                    }
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, contentDescription = "Dismiss", tint = TextMuted)
                    }
                }
            }
        }
    }
}
