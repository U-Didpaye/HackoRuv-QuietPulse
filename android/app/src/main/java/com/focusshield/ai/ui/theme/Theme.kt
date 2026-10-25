package com.focusshield.ai.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val DarkColorScheme = darkColorScheme(
    primary = PrimaryIndigo,
    onPrimary = TextPrimary,
    primaryContainer = NavyCard,
    onPrimaryContainer = AccentCyanLight,
    secondary = AccentCyan,
    onSecondary = NavyDark,
    background = NavyDark,
    onBackground = TextPrimary,
    surface = NavySurface,
    onSurface = TextPrimary,
    surfaceVariant = NavyCard,
    onSurfaceVariant = TextSecondary,
    outline = BorderSubtle
)

@Composable
fun FocusShieldAITheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    // Defaulting to DarkColorScheme for the cyber-firewall aesthetic
    MaterialTheme(
        colorScheme = DarkColorScheme,
        content = content
    )
}
