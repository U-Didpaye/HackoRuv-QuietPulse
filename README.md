# 🛡️ FocusShield AI — The Attention Firewall
### CASCADE '26 | Problem 3.1: The Attention Economy | IIIT Nagpur

> **"Antivirus software protects computers from malware. FocusShield AI protects human minds from cognitive malware."**

FocusShield AI is a privacy-first, on-device attention firewall for Android. Unlike traditional digital wellbeing tools that merely generate "post-mortem" charts after you've already lost your focus, FocusShield intelligently intercepts, classifies, and triages notifications in real-time before they fragment your concentration.

---

## 🌟 Dual-Engine Architecture

This project is built with a dual-delivery model specifically tailored for hackathon evaluation:

1. **Native Android Subsystem (`android/`)**:
   - **Framework**: Kotlin, Jetpack Compose, Material 3, Coroutines, StateFlow.
   - **System Integration**: Authentic Android `NotificationListenerService` for non-intrusive, privacy-preserving notification metadata parsing.
   - **Zero-Cloud Intelligence**: Local heuristic scoring, 60-second rolling burst detection, and bounded local learning.
   - **Automated Cloud APK Build**: A pre-configured GitHub Actions CI/CD pipeline (`.github/workflows/build-apk.yml`) automatically compiles and releases `FocusShield-AI-debug.apk` upon push—**requiring zero local Android Studio or 15GB SDK installation on the developer's laptop!**

2. **Interactive Live Web Companion & Simulator (`web/`)**:
   - **Framework**: Vite, React 18, TypeScript, Tailwind CSS, Lucide Icons, Supabase adapter.
   - **Vercel-Ready**: Pre-configured `vercel.json` for 1-click live web deployment and projector presentations during pitches.
   - **Modular Destination Previews**: Every single page (Dashboard, Queue, Focus, Demo Lab, Insights, Rules, Privacy) can be previewed, tested, and demonstrated independently.

---

## 🚀 Key Features & Differentiators

### 1. 🔍 Intelligent Notification Intelligence Engine
Evaluates every incoming notification across two independent axes:
* **Urgency Score**: Time-sensitive signals (critical calls, OTPs, fraud alerts, flight status).
* **Relevance Score**: Relationship cues, direct messages vs. broadcast channels, and user priorities.
* **Triage Outcomes**:
  * 🔴 **URGENT**: Bypasses all filters immediately.
  * 🟡 **IMPORTANT**: Prioritized in shade or queue.
  * 🔵 **BATCH**: Held in the Attention Airlock for scheduled digest reviews.
  * ⚪ **LOW PRIORITY**: Quarantined silently without vibrating or lighting up the screen.

### 2. ⚡ Interruption Burst Detection
* Real-time rolling 60-second event window with configurable sensitivity (Low, Medium, High).
* Flags high-frequency multi-app notification storms (e.g., 6+ alerts within 60s).
* Detects single-app repetitive harassment (e.g., e-commerce streak and flash sale spam).

### 3. 🎯 Transparent Explainable AI
Every classification displays human-readable reasoning explaining *why* it was categorized:
> *"Held in Attention Airlock because a 60s notification storm was detected and an active Focus Session is in progress."*

### 4. 🧠 Privacy-Preserving Bounded Local Learning
* Users can provide 1-tap feedback: *Was Urgent*, *Batch It*, or *Not Relevant (Spam)*.
* Feedback deterministically adjusts package weight offsets within strict `[-0.40, +0.40]` bounds entirely in local device memory.
* An accidental click will never break the firewall.
* **100% offline**: Zero notification bodies or private text ever leave the device.

### 5. 🎛️ Hackathon Judge Demo Lab
Because evaluation rooms often lack live incoming spam notifications, the built-in **Demo Lab** provides 6 deterministic test scenarios:
1. **Normal Day Traffic**: Dispersed emails and calendar reminders.
2. **Notification Storm (Burst)**: 8 rapid promo/social alerts in 30 seconds testing the burst detector.
3. **Repetitive App Harassment**: Shopping app spamming repeated alerts with dark patterns.
4. **Critical Exception**: Bank OTP and family emergency breaking through active Focus Mode.
5. **Study Session / Airlock**: Social pings quietly buffered during deep work.
6. **Adaptive Local Learning**: Demonstrates immediate classification adjustment after user feedback.

*All simulated events are explicitly labeled with `[SIMULATED]` tags to maintain full compliance and academic integrity.*

---

## 📂 Project Structure

```
FocusShieldAI/
├── .github/
│   └── workflows/
│       └── build-apk.yml          # GitHub Actions cloud compiler for debug APK
├── android/                       # Native Android Project (Kotlin + Compose)
│   ├── app/
│   │   ├── build.gradle.kts
│   │   └── src/
│   │       ├── main/
│   │       │   ├── AndroidManifest.xml
│   │       │   └── java/com/focusshield/ai/
│   │       │       ├── model/             # Typed domain & notification models
│   │       │       ├── intelligence/      # Classifier, BurstDetector, Learning
│   │       │       ├── service/           # NotificationListenerService
│   │       │       ├── demo/              # Deterministic Judge Scenarios
│   │       │       └── ui/                # Jetpack Compose Screens A through H
│   │       └── test/java/com/focusshield/ai/
│   │           ├── BurstDetectorTest.kt   # Unit tests for rolling windows
│   │           └── ClassificationEngineTest.kt
│   ├── build.gradle.kts
│   └── settings.gradle.kts
├── web/                           # Interactive Web / PWA Companion
│   ├── src/
│   │   ├── intelligence/          # Ported TypeScript intelligence engines
│   │   ├── pages/                 # Modular pages (Dashboard, Queue, Focus, etc.)
│   │   ├── data/                  # Supabase client adapter & mock sources
│   │   ├── App.tsx                # Master responsive shell
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── vercel.json                    # 1-Click Vercel Deployment Configuration
└── README.md
```

---

## 🛠️ How to Run & Deploy

### Running the Web Companion Locally:
```bash
cd web
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

### Deploying to Vercel:
Push this repository to GitHub and import it into Vercel. `vercel.json` is pre-configured to detect Vite in the `web/` folder automatically.

### Compiling & Downloading the Android APK:
1. Push this repository to GitHub (`main` or `master` branch).
2. The GitHub Actions workflow (`Build FocusShield AI Debug APK`) will automatically execute in the cloud.
3. Go to the **Actions** tab or **Releases** tab in your GitHub repository to download **`FocusShield-AI-debug.apk`** straight to your phone!
