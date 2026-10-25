# QuietPulse — The Attention Firewall System
> **LESS NOISE. MORE FOCUS.**

**QuietPulse** is an intelligent, privacy-first attention firewall and cognitive triage system designed to protect human attention from notification bursts, digital noise, and manipulative interruption loops.

**Made With Creativity By HackoRuv - Team**

---

## 🌟 Brand Identity & 5-Theme System

QuietPulse features a refined design system across exactly 5 coordinated themes:

1. **Obsidian Silver (Default)**: Cinematic black (`#000000`), deep charcoal surfaces (`#101010`), and metallic silver accents (`#C6C6C6`).
2. **Emerald**: Deep forest backdrop (`#051410`) with mint accents (`#14B8A6` and `#9FFFCB`).
3. **Violet**: Dark celestial backdrop (`#0C0817`) with lavender accents (`#8B5CF6` and `#C4B5FD`).
4. **Crimson**: Dark rose backdrop (`#140508`) with soft crimson accents (`#FF4757` and `#FFB8BC`).
5. **Pearl**: Clean architectural light (`#F5F4F0`), pristine gallery white surfaces (`#FFFFFF`), and graphite accents (`#737373`).

---

## 🏛️ System Destinations & Exact Feature Names

Every primary destination strictly uses the approved one-word feature names:

* **Home** (`HomePage.tsx`): Cinematic cosmic space-horizon hero, QuietPulse logo and wordmark, exact tagline `LESS NOISE. MORE FOCUS.`, interactive attention-management demonstration, and 4 feature cards (*Prioritize*, *Organize*, *Focus*, *Gain Insights*).
* **NotiFy** (`DashboardPage.tsx`): Real-time cognitive triage engine, 60s rolling burst protection, and live decision feeds.
* **FlowQueue** (`QueuePage.tsx`): Intelligent holding buffer and scheduled batch digest that quarantines non-urgent alerts without triggering screen activations.
* **DeepFocus** (`FocusPage.tsx`): Gateway timer for deep work sessions with automatic background buffering.
* **PulseInsights** (`InsightsPage.tsx`): Privacy-preserving attention telemetry and context-switching metrics.
* **ChokasAI** (`ChokasModal.tsx`): 100% on-device natural-language assistant with typo tolerance, fuzzy matching, and real command routing.
* **Contact** (`ContactPage.tsx`): Sovereign communication interface with field validation and client-side persistence.
* **Login** (`LoginPage.tsx`): Frosted glassmorphic card over celestial cosmic lake with email/password authentication, show/hide password, remember me, and Google OAuth option.

---

## 📱 Mobile App & Android APK

QuietPulse is built to run on physical Android smartphones in two formats:

### 1. Native Android Application (`android/`)
* **Technology**: Kotlin, Jetpack Compose, Material 3, Android Coroutines.
* **Platform Service**: Real `FocusShieldNotificationListenerService` integration.
* **CI/CD Cloud Build**: `.github/workflows/build-apk.yml` automatically compiles `QuietPulse-debug.apk` upon GitHub push without requiring local Android Studio.
* **Target Output**: `android/app/build/outputs/apk/debug/app-debug.apk`.

### 2. Installable Progressive Mobile App (PWA)
* Configured with `manifest.json`, high-resolution icons, responsive touch gestures, safe area insets, and standalone mobile app display.
* Installable directly on any mobile browser (Chrome/Edge/Brave: *Add to Home Screen*).

---

## 🚀 Running the Project

### Web Application:
```bash
cd web
npm install
npm run build
npm run dev
```

### Native Android Application:
Push to GitHub to trigger the automated GitHub Actions CI/CD workflow, or build locally with JDK 17 & Android SDK:
```bash
cd android
./gradlew assembleDebug
```
Output path: `android/app/build/outputs/apk/debug/app-debug.apk`
