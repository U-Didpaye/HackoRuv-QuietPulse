package com.focusshield.ai

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.focusshield.ai.ui.FocusShieldViewModel
import com.focusshield.ai.ui.screens.*
import com.focusshield.ai.ui.theme.AccentCyan
import com.focusshield.ai.ui.theme.FocusShieldAITheme
import com.focusshield.ai.ui.theme.NavyDark
import com.focusshield.ai.ui.theme.NavySurface

enum class AppDestination(val route: String, val title: String, val icon: androidx.compose.ui.graphics.vector.ImageVector) {
    DASHBOARD("dashboard", "Dashboard", Icons.Default.Shield),
    QUEUE("queue", "Queue", Icons.Default.Inbox),
    FOCUS("focus", "Focus", Icons.Default.Timer),
    DEMO("demo", "Demo Lab", Icons.Default.Science),
    INSIGHTS("insights", "Insights", Icons.Default.BarChart),
    RULES("rules", "Rules", Icons.Default.Tune),
    PRIVACY("privacy", "Privacy", Icons.Default.Security)
}

class MainActivity : ComponentActivity() {

    private val viewModel: FocusShieldViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            FocusShieldAITheme {
                val navController = rememberNavController()
                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentRoute = navBackStackEntry?.destination?.route ?: AppDestination.DASHBOARD.route

                Scaffold(
                    bottomBar = {
                        NavigationBar(
                            containerColor = NavySurface,
                            contentColor = AccentCyan
                        ) {
                            listOf(
                                AppDestination.DASHBOARD,
                                AppDestination.QUEUE,
                                AppDestination.FOCUS,
                                AppDestination.DEMO,
                                AppDestination.INSIGHTS
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
                                    label = { Text(destination.title) },
                                    colors = NavigationBarItemDefaults.colors(
                                        selectedIconColor = AccentCyan,
                                        selectedTextColor = AccentCyan,
                                        indicatorColor = NavyDark
                                    )
                                )
                            }
                        }
                    }
                ) { innerPadding ->
                    NavHost(
                        navController = navController,
                        startDestination = AppDestination.DASHBOARD.route,
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(innerPadding)
                    ) {
                        composable(AppDestination.DASHBOARD.route) {
                            DashboardScreen(
                                viewModel = viewModel,
                                onNavigateToQueue = { navController.navigate(AppDestination.QUEUE.route) },
                                onNavigateToDemo = { navController.navigate(AppDestination.DEMO.route) }
                            )
                        }
                        composable(AppDestination.QUEUE.route) {
                            QueueScreen(viewModel = viewModel)
                        }
                        composable(AppDestination.FOCUS.route) {
                            FocusScreen(viewModel = viewModel)
                        }
                        composable(AppDestination.DEMO.route) {
                            DemoLabScreen(viewModel = viewModel)
                        }
                        composable(AppDestination.INSIGHTS.route) {
                            InsightsScreen(viewModel = viewModel)
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
