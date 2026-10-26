package com.focusshield.ai.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

enum class QuietPulseThemeType {
    OBSIDIAN,
    EMERALD,
    VIOLET,
    CRIMSON,
    PEARL
}

private val ObsidianColorScheme = darkColorScheme(
    primary = ObsidianAccent,
    onPrimary = ObsidianBg,
    primaryContainer = ObsidianElevated,
    onPrimaryContainer = ObsidianAccentGlow,
    secondary = ObsidianAccent,
    onSecondary = ObsidianBg,
    background = ObsidianBg,
    onBackground = TextPrimary,
    surface = ObsidianSurface,
    onSurface = TextPrimary,
    surfaceVariant = ObsidianElevated,
    onSurfaceVariant = TextSecondary,
    outline = BorderSubtle
)

private val EmeraldColorScheme = darkColorScheme(
    primary = EmeraldAccent,
    onPrimary = EmeraldBg,
    primaryContainer = EmeraldElevated,
    onPrimaryContainer = EmeraldMint,
    secondary = EmeraldMint,
    onSecondary = EmeraldBg,
    background = EmeraldBg,
    onBackground = TextPrimary,
    surface = EmeraldSurface,
    onSurface = TextPrimary,
    surfaceVariant = EmeraldElevated,
    onSurfaceVariant = TextSecondary,
    outline = BorderSubtle
)

private val VioletColorScheme = darkColorScheme(
    primary = VioletAccent,
    onPrimary = VioletBg,
    primaryContainer = VioletElevated,
    onPrimaryContainer = VioletLavender,
    secondary = VioletLavender,
    onSecondary = VioletBg,
    background = VioletBg,
    onBackground = TextPrimary,
    surface = VioletSurface,
    onSurface = TextPrimary,
    surfaceVariant = VioletElevated,
    onSurfaceVariant = TextSecondary,
    outline = BorderSubtle
)

private val CrimsonColorScheme = darkColorScheme(
    primary = CrimsonAccent,
    onPrimary = CrimsonBg,
    primaryContainer = CrimsonElevated,
    onPrimaryContainer = CrimsonRose,
    secondary = CrimsonRose,
    onSecondary = CrimsonBg,
    background = CrimsonBg,
    onBackground = TextPrimary,
    surface = CrimsonSurface,
    onSurface = TextPrimary,
    surfaceVariant = CrimsonElevated,
    onSurfaceVariant = TextSecondary,
    outline = BorderSubtle
)

private val PearlColorScheme = lightColorScheme(
    primary = PearlAccent,
    onPrimary = PearlSurface,
    primaryContainer = PearlElevated,
    onPrimaryContainer = PearlText,
    secondary = PearlAccent,
    onSecondary = PearlSurface,
    background = PearlBg,
    onBackground = PearlText,
    surface = PearlSurface,
    onSurface = PearlText,
    surfaceVariant = PearlElevated,
    onSurfaceVariant = PearlAccent,
    outline = PearlOutline
)

@Composable
fun QuietPulseTheme(
    themeType: QuietPulseThemeType = QuietPulseThemeType.OBSIDIAN,
    content: @Composable () -> Unit
) {
    val colorScheme = when (themeType) {
        QuietPulseThemeType.OBSIDIAN -> ObsidianColorScheme
        QuietPulseThemeType.EMERALD -> EmeraldColorScheme
        QuietPulseThemeType.VIOLET -> VioletColorScheme
        QuietPulseThemeType.CRIMSON -> CrimsonColorScheme
        QuietPulseThemeType.PEARL -> PearlColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}
