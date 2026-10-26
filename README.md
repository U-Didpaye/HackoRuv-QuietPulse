# QuietPulse — The Attention Firewall System
> **LESS NOISE. MORE FOCUS.**

**QuietPulse** is an intelligent, privacy-first attention firewall and cognitive decision intelligence application designed to eliminate notification anxiety, halt burst floods, protect deep focus, and provide sovereign on-device attention telemetry.

**Made With Creativity By HackoRuv - Team**

---

## 🌟 Approved 3-Theme System

QuietPulse features a refined, handcrafted cinematic design system across **exactly 3 approved themes**:

1. **Obsidian Silver (Default)**: Cinematic metallic black (`#000000`), deep obsidian surfaces (`#101010`), and brushed silver accents (`#C6C6C6`).
2. **Emerald**: Deep forest backdrop (`#051410`) with vibrant mint accents (`#14B8A6` and `#9FFFCB`).
3. **Pearl**: Architectural light canvas (`#F5F4F0`) paired with a high-contrast **pure black header** (`#000000`), gallery surfaces (`#FFFFFF`), and refined slate accents (`#737373`).

---

## 🧠 Hybrid ChokasAI Copilot (Powered by Google Gemini)

**ChokasAI** combines instant on-device execution with conversational intelligence powered by **Google Gemini 3.5**:

* **Instant In-App Commands**: Executes actions instantly without network lag:
  * Starts DeepFocus timers (`"Start 25m focus"`, `"Begin 50m session"`).
  * Clears buffered notification queues (`"Clear FlowQueue"`).
  * Switches visual themes (`"Switch to Emerald"`, `"Switch to Pearl"`).
  * Direct route navigation (`"Open NotiFy"`, `"Go to PulseInsights"`).
* **Gemini Conversational Intelligence**: Connects to Google Gemini (`gemini-3.5-flash-lite` with automatic fallback to `gemini-3.5-flash`) for deep guidance on:
  * Overcoming notification fatigue and digital anxiety.
  * Triage heuristics (Urgency vs. Relevance breakdown).
  * Focus strategies and productivity routines.
* **Sovereign Privacy**: Notification text remains 100% on-device; only direct user chat prompts are passed to the assistant interface.

---

## 🏛️ Core Modules & Navigation Destinations

Every destination adheres to the official one-word feature names:

* **Home** (`HomePage.tsx`):
  * Official cosmic space-horizon galaxy wallpaper (`bg-cosmic-rings.png`) with celestial planetary rings and nebula.
  * Exact master tagline: `LESS NOISE. MORE FOCUS.`
  * Dual primary CTAs: `Get Started →` and `▷ Watch Demo`.
  * Real **Replay Cinematic Launch** functionality in the footer.
  * 4 Feature Cards: *Prioritize*, *Organize*, *Focus*, and *Gain Insights*.
  * Section 10: Interactive Attention-Management Simulation Lab.
  * Direct download button for the official Android APK.

* **NotiFy** (`DashboardPage.tsx`):
  * Real-time cognitive triage engine evaluating incoming alerts.
  * Context Mode quick switcher strip (**Office**, **Home**, **Personalized**).
  * Exactly 3 balanced real-time metric cards:
    1. **Burst Frequency** (60s rolling window burst detection).
    2. **Deflected Interruptions** (count of buffered non-urgent alerts).
    3. **Focus Time** (active session minutes).
  * Native Android notification access status banner and bridge.

* **FlowQueue** (`QueuePage.tsx`):
  * Non-urgent notification airlock and scheduled batch digest buffer.
  * 3 Dedicated Triage Actions on each card:
    * **Was Urgent** (corrects false positives, bumps urgency score).
    * **Batch It** (confirms safe deferral to digest).
    * **Spam** (flags advertising and suppresses repeat vibrations).
  * Instant UI updates and bidirectional feedback recording in the local learning engine.

* **DeepFocus** (`FocusPage.tsx`):
  * Dedicated distraction blocker with Pomodoro presets (15m, 25m, 50m, 90m) and custom intervals.
  * Session completion tracker and soundscape toggles.

* **PulseInsights** (`InsightsPage.tsx`):
  * Clean, privacy-first cognitive analytics dashboard.
  * Telemetry on deflected interruptions and estimated cognitive switching time saved.
  * Categorical distribution: *Urgent*, *Important*, *Batched*, *Low Priority*, and *Spam*.
  * Clear distinction between fresh empty states and active telemetry.

* **Modes & Rules** (`RulesPage.tsx`):
  * Full configuration for the **3 Context Modes**:
    * **Office Mode**: Work-first filtering (Slack, Teams, Email, OTPs).
    * **Home Mode**: Family and emergency focus (Calls, Personal messengers).
    * **Personalized Mode**: Tunable urgency/relevance sliders, VIP application lists, VIP contact whitelists, and quiet hours.
  * One-click **Reset to Defaults** control.

* **Contact** (`ContactPage.tsx`):
  * Communication interface with field validation, Supabase backend persistence (`inquiries` table), and offline `localStorage` fallback.

* **Login** (`LoginPage.tsx`):
  * Sovereign frosted glass design over cosmic lake backdrop.
  * Integrated **Supabase Auth** (email/password sign-in and sign-up with session persistence).

---

## 📱 Android Application & APK Delivery

QuietPulse includes a production-ready, signed Android application:

* **Direct Root APK**: [`QuietPulse.apk`](./QuietPulse.apk) (Signed with APK Signature Scheme v2 & v3).
* **Website Download**: Embedded in the homepage hero and footer (`web/public/QuietPulse.apk`).
* **Android Architecture**:
  * `FocusShieldNotificationListenerService`: Native Android background service that listens for system notification events, extracts metadata on-device, and passes events to the decision engine.
  * `QuietPulseAndroid` JavaScript Interface: Bidirectional bridge between the WebView interface and native Android OS settings.
  * `build_apk.py`: Automated headless build pipeline utilizing Android SDK Build-Tools, `javac`, `d8`, `zipalign`, and `apksigner`.

---

## 🛠️ Tech Stack & Language Overview

| Language / Framework | Role in QuietPulse | Why It Is Used |
| :--- | :--- | :--- |
| **TypeScript (v5.5)** | Web Frontend & Decision Intelligence | Provides strict type safety for notification triage models, context modes, and telemetry calculations. |
| **React 18 & Vite** | Application UI & State Management | Delivers sub-millisecond fast re-renders, component modularity, and lightning-fast HMR dev server. |
| **Tailwind CSS** | Styling & Design System | Encapsulates CSS variable tokens for the 3 themes (Obsidian Silver, Emerald, Pearl) and cosmic animations. |
| **Java / Android SDK** | Native Android Listener & Bridge | Directly hooks into Android's `NotificationListenerService` and provides the native WebView interface. |
| **Google Gemini API** | ChokasAI Conversational AI | Powers conversational responses, focus advice, and cognitive triage explanations. |
| **Supabase JS** | Authentication & Cloud Persistence | Handles user sessions and inquiry database storage with seamless sovereign offline fallback. |
| **Python 3** | Automated APK Build Toolchain | Orchestrates headless Android resource compilation, Dex generation, zipalign, and key signing. |

---

## 🚀 Running the Project Locally

### 1. Web Application:
```bash
cd web
npm install
npm run build
npm run dev
```
Open [http://localhost:3000/](http://localhost:3000/) in your browser.

### 2. Environment Variables (`web/.env.local`):
```env
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-supabase-key>
VITE_GEMINI_API_KEY=<your-google-ai-studio-gemini-key>
```

### 3. Rebuilding the Android APK:
```bash
python build_apk.py
```
Outputs signed production binaries to `./QuietPulse.apk` and `web/public/QuietPulse.apk`.

---

**QuietPulse** — *Less Noise. More Focus.*
