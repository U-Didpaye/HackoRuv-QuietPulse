package com.focusshield.ai

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.focusshield.ai.ui.FocusShieldViewModel
import com.focusshield.ai.ui.screens.*
import com.focusshield.ai.ui.theme.*
import kotlinx.coroutines.delay

enum class AppDestination(val route: String, val title: String, val icon: androidx.compose.ui.graphics.vector.ImageVector) {
    NOTIFY("notify", "NotiFy", Icons.Default.Shield),
    FLOWQUEUE("flowqueue", "FlowQueue", Icons.Default.Inbox),
    DEEPFOCUS("deepfocus", "DeepFocus", Icons.Default.Timer),
    PULSEINSIGHTS("pulseinsights", "PulseInsights", Icons.Default.BarChart),
    DEMO("demo", "Demo Lab", Icons.Default.Science),
    RULES("rules", "Context Rules", Icons.Default.Tune),
    PRIVACY("privacy", "Privacy", Icons.Default.Security)
}

class MainActivity : ComponentActivity() {

    private val viewModel: FocusShieldViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            var showLaunchScreen by remember { mutableStateOf(true) }

            // Target 2.5s cinematic launch experience per Section 6
            LaunchedEffect(Unit) {
                delay(2500)
                showLaunchScreen = false
            }

            QuietPulseTheme {
                if (showLaunchScreen) {
                    NativeLaunchScreen(onSkip = { showLaunchScreen = false })
                } else {
                    val navController = rememberNavController()
                    val navBackStackEntry by navController.currentBackStackEntryAsState()
                    val currentRoute = navBackStackEntry?.destination?.route ?: AppDestination.NOTIFY.route

                    Scaffold(
                        bottomBar = {
                            NavigationBar(
                                containerColor = MaterialTheme.colorScheme.surface,
                                contentColor = MaterialTheme.colorScheme.primary
                            ) {
                                listOf(
                                    AppDestination.NOTIFY,
                                    AppDestination.FLOWQUEUE,
                                    AppDestination.DEEPFOCUS,
                                    AppDestination.PULSEINSIGHTS,
                                    AppDestination.DEMO
                                ).forEach { destination ->
                                    NavigationBarItem(
                                        selected = currentRoute == destination.route,
                                        onClick = {
                                            navController.navigate(destination.route) {
                                                popUpTo(navController.graph.startDestinationId) { saveState = true }
                                                launchSingleTop = true
                                                restoreState = true
                                            }
                                        },
                                        icon = { Icon(destination.icon, contentDescription = destination.title) },
                                        label = { Text(destination.title, fontSize = 11.sp, fontWeight = FontWeight.SemiBold) },
                                        colors = NavigationBarItemDefaults.colors(
                                            selectedIconColor = MaterialTheme.colorScheme.primary,
                                            selectedTextColor = MaterialTheme.colorScheme.primary,
                                            indicatorColor = MaterialTheme.colorScheme.primaryContainer
                                        )
                                    )
                                }
                            }
                        }
                    ) { innerPadding ->
                        NavHost(
                            navController = navController,
                            startDestination = AppDestination.NOTIFY.route,
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(innerPadding)
                        ) {
                            composable(AppDestination.NOTIFY.route) {
                                DashboardScreen(
                                    viewModel = viewModel,
                                    onNavigateToQueue = { navController.navigate(AppDestination.FLOWQUEUE.route) },
                                    onNavigateToDemo = { navController.navigate(AppDestination.DEMO.route) }
                                )
                            }
                            composable(AppDestination.FLOWQUEUE.route) {
                                QueueScreen(viewModel = viewModel)
                            }
                            composable(AppDestination.DEEPFOCUS.route) {
                                FocusScreen(viewModel = viewModel)
                            }
                            composable(AppDestination.PULSEINSIGHTS.route) {
                                InsightsScreen(viewModel = viewModel)
                            }
                            composable(AppDestination.DEMO.route) {
                                DemoLabScreen(viewModel = viewModel)
                            }
                            composable(AppDestination.RULES.route) {
                                RulesScreen(viewModel = viewModel)
                            }
                            composable(AppDestination.PRIVACY.route) {
                                PrivacyScreen(viewModel = viewModel)
                            }
                        }
                    }
                }
            }
        }
    }
}

/**
 * Genuine Android Launch Screen per Section 6 of Master Prompt:
 * Pure black background, QuietPulse emblem and wordmark, tagline "LESS NOISE. MORE FOCUS.",
 * silver-blue progress line / light sweep, smooth fade into main destination.
 */
@Composable
fun NativeLaunchScreen(onSkip: () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier.padding(24.dp)
        ) {
            // QuietPulse Wordmark & Crest Representation
            Text(
                text = "QUIETPULSE",
                color = Color.White,
                fontSize = 32.sp,
                fontWeight = FontWeight.Black,
                letterSpacing = 4.sp,
                fontFamily = FontFamily.Serif
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Exact Tagline per Section 3
            Text(
                text = "LESS NOISE. MORE FOCUS.",
                color = Color(0xFFA3A3A3),
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 2.sp,
                fontFamily = FontFamily.Monospace
            )

            Spacer(modifier = Modifier.height(28.dp))

            // Silver-Blue Progress Line
            val transition = rememberInfiniteTransition(label = "LaunchProgress")
            val progressAlpha by transition.animateFloat(
                initialValue = 0.4f,
                targetValue = 1f,
                animationSpec = infiniteRepeatable(
                    animation = tween(1200, easing = LinearEasing),
                    repeatMode = RepeatMode.Reverse
                ),
                label = "ProgressAlpha"
            )

            Box(
                modifier = Modifier
                    .width(180.dp)
                    .height(2.dp)
                    .background(
                        Brush.horizontalGradient(
                            listOf(
                                Color(0xFF06B6D4).copy(alpha = progressAlpha),
                                Color.White.copy(alpha = progressAlpha),
                                Color(0xFF3B82F6).copy(alpha = progressAlpha)
                            )
                        )
                    )
            )

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "INITIALIZING ATTENTION FIREWALL",
                color = Color(0xFF555555),
                fontSize = 9.sp,
                fontFamily = FontFamily.Monospace,
                letterSpacing = 1.sp
            )
        }
    }
}
