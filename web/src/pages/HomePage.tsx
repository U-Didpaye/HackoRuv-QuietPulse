import React from 'react';
import { ScrollReveal } from '../components/ScrollReveal';
import {
  Shield,
  ArrowRight,
  Sliders,
  Timer,
  Inbox,
  Sparkles,
  Lock,
  Layers,
  Cpu,
  EyeOff,
  Flame,
  CheckCircle2,
  Terminal,
  Play
} from 'lucide-react';
import { AnalyticsMetrics } from '../types';

interface HomePageProps {
  onNavigate: (route: string) => void;
  onOpenChokas: () => void;
  metrics: AnalyticsMetrics;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenChokas,
  metrics,
}) => {
  return (
    <div className="relative overflow-x-hidden">
      {/* 
        ========================================================================
        PAGE 2 HERO SECTION WITH THE OFFICIAL COSMIC METALLIC BG ARTWORK
        ========================================================================
      */}
      <section className="relative min-h-[92vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 py-20 sm:py-28 overflow-hidden">
        
        {/* 
          OFFICIAL ATMOSPHERIC BACKGROUND (PAGE 2 HOMEPAGE ONLY)
          Uses the user-provided leftmost cinematic image with cosmic light arc & emblem
        */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
          <img
            src="/vyrox-hero-bg.png"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center filter brightness-90 sm:brightness-95 contrast-110 transform scale-105 animate-subtle-float"
          />
          {/* Dual Multi-Stop Gradient Overlays to preserve 100% text legibility & integrate with themes */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse at 50% 45%, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.8) 70%, var(--v-bg) 100%),
                linear-gradient(to bottom, var(--v-bg) 0%, transparent 18%, transparent 75%, var(--v-bg) 100%)
              `
            }}
          />
        </div>

        {/* Hero Foreground Content Layer */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          
          {/* Editorial Label Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-neutral-200 text-[11px] font-mono tracking-[0.25em] uppercase mb-8 shadow-2xl">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            ATTENTION, BY DESIGN
          </div>

          {/* Monumental Editorial Headline */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-white uppercase font-editorial leading-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
            CHOOSE.
          </h1>

          {/* Supporting Statement */}
          <p className="text-xl sm:text-2xl md:text-3xl font-light text-neutral-100 mt-6 tracking-wide max-w-2xl drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">
            Your attention. Your priorities. <span className="font-semibold text-white underline decoration-white/30 underline-offset-8">Your rules.</span>
          </p>

          {/* Supporting Paragraph */}
          <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto mt-4 leading-relaxed font-sans drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            VYROX helps you intercept manipulative digital interactions, organize notifications into intelligent batch digests, and protect uninterrupted time for deep focus.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 mt-9">
            <button
              onClick={() => onNavigate('engine')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition shadow-2xl flex items-center justify-center gap-2 font-mono group"
            >
              <span>Explore Firewall</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('focus')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/25 text-white font-bold text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 font-mono"
            >
              <span>Focus Gateways</span>
            </button>

            <button
              onClick={onOpenChokas}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-neutral-900/70 hover:bg-neutral-800/80 backdrop-blur-md border border-white/15 text-neutral-300 font-medium text-xs tracking-wider transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ask ChokasAI</span>
            </button>
          </div>

          {/* Live Quick Metric Bar */}
          <div className="grid grid-cols-3 gap-6 sm:gap-12 mt-16 pt-10 border-t border-white/15 w-full max-w-2xl text-center bg-black/40 backdrop-blur-sm rounded-2xl p-6">
            <div>
              <div className="text-2xl sm:text-3xl font-black font-editorial text-white">
                {metrics.estimatedInterruptionsDeflected}
              </div>
              <div className="text-[11px] text-neutral-300 uppercase tracking-wider font-mono mt-1">
                Alerts Deflected
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black font-editorial text-white">
                {metrics.totalFocusMinutes}m
              </div>
              <div className="text-[11px] text-neutral-300 uppercase tracking-wider font-mono mt-1">
                Focus Time Logged
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black font-editorial text-cyan-300">
                100%
              </div>
              <div className="text-[11px] text-neutral-300 uppercase tracking-wider font-mono mt-1">
                On-Device Privacy
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 
        ========================================================================
        SCROLL REVEAL SECTION 1: PRODUCT PHILOSOPHY & ATTENTION FIREWALL
        ========================================================================
      */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-v-border">
        <ScrollReveal>
          <div className="max-w-3xl">
            <span className="text-xs font-mono tracking-[0.25em] uppercase text-v-accent">
              01 // THE ARCHITECTURE OF ATTENTION
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-v-text uppercase font-editorial mt-3 leading-tight">
              Technology that protects focus, rather than extracting it.
            </h2>
            <p className="text-sm sm:text-base text-v-text-muted mt-5 leading-relaxed font-sans">
              Traditional digital wellbeing utilities merely track screen time after the damage is done—generating post-mortem graphs of lost hours. VYROX operates as a real-time attention firewall: evaluating every notification event using independent urgency and relevance heuristics before screen vibration occurs.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <ScrollReveal delayMs={100}>
            <div className="p-7 rounded-2xl bg-v-surface border border-v-border h-full flex flex-col justify-between hover:border-v-accent/40 transition">
              <div>
                <div className="w-10 h-10 rounded-xl bg-v-secondary border border-v-border flex items-center justify-center text-v-text mb-5">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-v-text">Cognitive Triage Matrix</h3>
                <p className="text-xs text-v-text-muted mt-2.5 leading-relaxed">
                  Decouples urgency from relevance. Urgent security OTPs or emergency calls bypass filters instantly, while promotional dopamine loops are quarantined into silent digests.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-v-border/60 text-[11px] font-mono text-v-accent">
                URGENT • IMPORTANT • BATCH • LOW
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={200}>
            <div className="p-7 rounded-2xl bg-v-surface border border-v-border h-full flex flex-col justify-between hover:border-v-accent/40 transition">
              <div>
                <div className="w-10 h-10 rounded-xl bg-v-secondary border border-v-border flex items-center justify-center text-v-text mb-5">
                  <Flame className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-v-text">Burst Storm Protection</h3>
                <p className="text-xs text-v-text-muted mt-2.5 leading-relaxed">
                  Monitors a rolling 60-second window. When multiple applications ping in rapid succession or a single service floods repetitive pings, the firewall halts interruption escalation.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-v-border/60 text-[11px] font-mono text-v-accent">
                ROLLING TIME-WINDOW HEURISTICS
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={300}>
            <div className="p-7 rounded-2xl bg-v-surface border border-v-border h-full flex flex-col justify-between hover:border-v-accent/40 transition">
              <div>
                <div className="w-10 h-10 rounded-xl bg-v-secondary border border-v-border flex items-center justify-center text-v-text mb-5">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-v-text">Zero-Cloud Telemetry</h3>
                <p className="text-xs text-v-text-muted mt-2.5 leading-relaxed">
                  No notification text, contact info, or personal messages are ever sent to remote AI services or servers. All classification runs deterministically in local client memory.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-v-border/60 text-[11px] font-mono text-v-accent">
                100% PRIVATE • LOCAL ADAPTATION
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 
        ========================================================================
        SCROLL REVEAL SECTION 2: ATTENTION AIRLOCK & SMART DIGEST
        ========================================================================
      */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-v-border bg-v-surface/30">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal>
            <div>
              <span className="text-xs font-mono tracking-[0.25em] uppercase text-v-accent">
                02 // THE ATTENTION AIRLOCK
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-v-text uppercase font-editorial mt-3 leading-tight">
                No notification avalanche when focus ends.
              </h2>
              <p className="text-sm text-v-text-muted mt-4 leading-relaxed font-sans">
                The standard failure of "Do Not Disturb" modes is the post-session flood: the moment you turn off focus, 40 unread badges hit your screen at once, causing instant relapse into phone checking.
              </p>
              <p className="text-sm text-v-text-muted mt-3 leading-relaxed font-sans">
                VYROX routes non-urgent alerts into an <strong>Attention Airlock</strong>, summarizing notification volumes by application without exposing private text until you consciously decide to review them.
              </p>

              <div className="flex items-center gap-4 mt-8">
                <button
                  onClick={() => onNavigate('queue')}
                  className="px-5 py-2.5 rounded-xl bg-v-surface hover:bg-v-secondary border border-v-border text-v-text font-bold text-xs uppercase tracking-wider font-mono transition"
                >
                  View Airlock Queue
                </button>
                <button
                  onClick={() => onNavigate('focus')}
                  className="text-xs text-v-accent hover:text-v-text font-semibold flex items-center gap-1.5 transition"
                >
                  <span>Configure Focus Windows</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Interactive Airlock UI Preview Card */}
          <ScrollReveal delayMs={200}>
            <div className="p-6 rounded-2xl bg-v-surface border border-v-border shadow-2xl">
              <div className="flex items-center justify-between border-b border-v-border pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Inbox className="w-4 h-4 text-v-accent" />
                  <span className="text-xs font-bold text-v-text uppercase tracking-wider font-mono">
                    Attention Airlock Digest
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-v-secondary text-v-accent border border-v-border">
                  SCHEDULED RELEASE: 17:00
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-v-secondary/60 border border-v-border flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-v-text block">Social & Media Updates</span>
                    <span className="text-[11px] text-v-text-muted">18 items queued silently without screen activation</span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-v-elevated text-v-accent">
                    BATCH
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-v-secondary/60 border border-v-border flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-v-text block">Shopping & Promotional Offers</span>
                    <span className="text-[11px] text-v-text-muted">6 artificial urgency / flash-sale alerts deflected</span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-v-elevated text-v-text-muted">
                    LOW PRIORITY
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-v-secondary/60 border border-v-border flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-v-text block">Bank Security Alert</span>
                    <span className="text-[11px] text-v-text-muted">Instant delivery granted (High time sensitivity)</span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-v-elevated text-v-text">
                    URGENT
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 
        ========================================================================
        SCROLL REVEAL SECTION 3: CHOKASAI ASSISTANT SPOTLIGHT
        ========================================================================
      */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-v-border">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono tracking-[0.25em] uppercase text-v-accent">
              03 // IN-APP COMPANION
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-v-text uppercase font-editorial mt-3">
              Meet ChokasAI
            </h2>
            <p className="text-sm text-v-text-muted mt-3 leading-relaxed font-sans">
              A lightweight, offline intelligence guide engineered to help you navigate, explain, and command the VYROX Attention Firewall.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ScrollReveal delayMs={100}>
            <div className="p-6 rounded-2xl bg-v-surface border border-v-border h-full">
              <span className="text-[11px] font-mono text-v-accent uppercase">Mode 01</span>
              <h3 className="text-base font-bold text-v-text mt-1">Explain</h3>
              <p className="text-xs text-v-text-muted mt-2 leading-relaxed">
                Answers questions about how notifications were categorized, what burst thresholds mean, and why specific dark patterns were suppressed.
              </p>
              <div className="mt-4 p-2.5 rounded-lg bg-v-secondary text-[11px] font-mono text-v-text-muted border border-v-border">
                "Why was my shopping notification delayed?"
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={200}>
            <div className="p-6 rounded-2xl bg-v-surface border border-v-border h-full">
              <span className="text-[11px] font-mono text-v-accent uppercase">Mode 02</span>
              <h3 className="text-base font-bold text-v-text mt-1">Navigate</h3>
              <p className="text-xs text-v-text-muted mt-2 leading-relaxed">
                Directly transports you across all system surfaces, rule preferences, telemetry logs, and privacy audits with simple conversational prompts.
              </p>
              <div className="mt-4 p-2.5 rounded-lg bg-v-secondary text-[11px] font-mono text-v-text-muted border border-v-border">
                "Open my quiet hours settings"
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={300}>
            <div className="p-6 rounded-2xl bg-v-surface border border-v-border h-full">
              <span className="text-[11px] font-mono text-v-accent uppercase">Mode 03</span>
              <h3 className="text-base font-bold text-v-text mt-1">Act</h3>
              <p className="text-xs text-v-text-muted mt-2 leading-relaxed">
                Executes verified in-app commands: starts focus sessions, wipes queued histories, or switches between Obsidian, Graphite, and Pearl themes.
              </p>
              <div className="mt-4 p-2.5 rounded-lg bg-v-secondary text-[11px] font-mono text-v-text-muted border border-v-border">
                "Start a 50m deep work session"
              </div>
            </div>
          </ScrollReveal>
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={onOpenChokas}
            className="px-6 py-3 rounded-xl bg-v-text text-v-bg font-bold text-xs uppercase tracking-widest font-mono hover:opacity-90 transition inline-flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch ChokasAI Terminal</span>
          </button>
        </div>
      </section>

      {/* 
        ========================================================================
        SCROLL REVEAL SECTION 4: CALL TO ACTION
        ========================================================================
      */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-v-border text-center">
        <ScrollReveal>
          <div className="p-10 sm:p-14 rounded-3xl bg-v-surface border border-v-border relative overflow-hidden">
            <h2 className="text-3xl sm:text-5xl font-black text-v-text uppercase font-editorial tracking-tight">
              Reclaim Your Cognitive Bandwidth.
            </h2>
            <p className="text-sm text-v-text-muted max-w-lg mx-auto mt-4 leading-relaxed font-sans">
              Download the native Android application or explore the firewall engine directly in this environment.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <button
                onClick={() => onNavigate('engine')}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-v-text text-v-bg font-bold text-xs uppercase tracking-widest font-mono hover:opacity-90 transition shadow-lg"
              >
                Launch Live Engine
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-v-secondary hover:bg-v-elevated border border-v-border text-v-text font-bold text-xs uppercase tracking-widest font-mono transition"
              >
                Contact Team
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};
