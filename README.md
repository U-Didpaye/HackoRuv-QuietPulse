# VYROX — The Attention Firewall System

> *"Antivirus software protects computers from malware. VYROX protects human minds from cognitive malware."*

**VYROX** is a sovereign, privacy-first attention firewall and cognitive triage system designed to protect human attention from manipulative digital interruptions, algorithmic dopamine loops, and notification bursts.

---

## 🌟 Brand Identity & Aesthetics

* **Brand Characteristics**: Premium, Minimal, Intelligent, Monochrome (metallic silver, obsidian black, graphite, and pearl gallery white).
* **Official Branding**: Official geometric monolith emblem and wide-tracked architectural typography.
* **Themes**:
  1. **Obsidian Silver (Default)**: Pure black (`#000000`), deep charcoal surfaces (`#101010`), metallic silver accents (`#C6C6C6`).
  2. **Graphite**: Sophisticated charcoal (`#111214`), soft dark surfaces (`#191A1E`), platinum accents (`#D0D0D0`).
  3. **Pearl**: Crisp architectural light (`#F5F4F0`), pristine gallery white surfaces (`#FFFFFF`), graphite accents (`#737373`).

---

## 🏛️ System Architecture

### 1. 🎬 Cinematic 5-Second Splash Screen (`SplashScreen.tsx`)
* Starts on pure black.
* Reveals the official VYROX emblem with smooth opacity and restrained metallic light sweep.
* Displays the architectural wordmark beneath it.
* Gracefully dissolves into the homepage.
* Session-aware (skips on internal navigation, with a manual replay trigger in the footer).
* Respects `prefers-reduced-motion`.

### 2. 🏛️ Page 2: Homepage with Oversized Atmospheric Logo Artwork (`HomePage.tsx`)
* Features the oversized VYROX emblem positioned behind the hero content on **Page 2 only**.
* Atmospheric, responsive, non-blocking, with carefully tuned opacity and radial edge blending.
* Hero Typography:
  * Small label: `ATTENTION, BY DESIGN`
  * Monolithic Display Title: `CHOOSE.` (editorial serif typography with scale contrast)
  * Statement: `Your attention. Your priorities. Your rules.`
  * Supporting Paragraph: `VYROX helps you manage interruptions, organize notifications and protect time for what matters.`

### 3. 📜 Intersection Scroll-Reveal Animation Engine (`useScrollReveal.ts`)
* Content sections trigger entrance animations only when scrolled into view.
* Light, performant intersection observers without bulky third-party dependencies.
* Fallback protection ensuring content is never permanently hidden.

### 4. 🤖 ChokasAI In-App Companion (`ChokasModal.tsx`)
* Offline knowledge base and safe command router.
* Capabilities:
  * **Explain**: Answers questions on notification bursts, urgency vs relevance, airlock queueing, and quiet hours.
  * **Navigate**: Teleports directly to Queue, Privacy, Focus, Telemetry, and Contact.
  * **Act**: Executes real in-app actions (initiates 25m or 50m focus sessions, clears the airlock queue, switches themes).

### 5. 📬 Attention Airlock & Scheduled Digest (`QueuePage.tsx`)
* Quarantines non-urgent notifications without triggering device vibrations or screen illumination.
* Summarizes alert volumes without exposing private message bodies on lock screens.

### 6. ✉️ Sovereign Contact Interface (`ContactPage.tsx`)
* Validated name, email, subject, and message fields with accessible labels.
* Zero-tracking client-side audit persistence and submission states.

---

## 🛠️ Running the Application

```bash
cd web
npm install
npm run dev
```

Open `http://localhost:3000` in any modern browser.

Production build verification:
```bash
npm run build
```
Compiled bundle: ~250 kB gzipped into single high-performance chunk.
