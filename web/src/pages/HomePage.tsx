import React, { useState } from 'react';
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
  Flame,
  CheckCircle2,
  Play,
  ChevronDown,
  BarChart3,
  BellRing,
  Filter,
  Zap,
  HelpCircle,
  Download
} from 'lucide-react';
import { AnalyticsMetrics } from '../types';

interface HomePageProps {
  onNavigate: (route: string) => void;
  onOpenChokas: () => void;
  metrics: AnalyticsMetrics;
  onReplaySplash?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenChokas,
  metrics,
  onReplaySplash,
}) => {
  // Section 10: Interactive Attention-Management Demo State
  const [demoActiveNotification, setDemoActiveNotification] = useState<{
    app: string;
    title: string;
    body: string;
    decision: 'URGENT' | 'IMPORTANT' | 'BATCH' | 'LOW_PRIORITY';
    urgencyScore: number;
    relevanceScore: number;
    explanation: string;
  } | null>({
    app: 'Federal Reserve Bank',
    title: 'Verification Code: 492018',
    body: 'Your single-use sign-in token expires in 3 minutes.',
    decision: 'URGENT',
    urgencyScore: 0.94,
    relevanceScore: 0.88,
    explanation: 'Time-sensitive authentication OTP detected. Interception bypassed for immediate human delivery.',
  });

  const handleSimulateDemo = (type: 'otp' | 'slack_burst' | 'shopping') => {
    if (type === 'otp') {
      setDemoActiveNotification({
        app: 'Chase Security',
        title: 'Two-Factor Passcode: 839210',
        body: 'Do not share this code with anyone. Valid for 5 minutes.',
        decision: 'URGENT',
        urgencyScore: 0.96,
        relevanceScore: 0.90,
        explanation: 'Critical time-decay token identified. NotiFy bypasses silent airlock and alerts immediately.',
      });
    } else if (type === 'slack_burst') {
      setDemoActiveNotification({
        app: 'Slack (#production-sync)',
        title: 'Dev Lead (Burst: 5 messages in 12s)',
        body: 'Can everyone check the release tags? We are ready to cut the branch.',
        decision: 'BATCH',
        urgencyScore: 0.45,
        relevanceScore: 0.85,
        explanation: 'Rolling window burst storm detected (5+ pings in <60s). Quarantined into FlowQueue to safeguard active focus.',
      });
    } else {
      setDemoActiveNotification({
        app: 'FlashDeals Retail',
        title: '⚡ 80% OFF — Ends in 10 Minutes!',
        body: 'Hurry! Items in your cart are selling out fast. Buy now before stocks vanish.',
        decision: 'LOW_PRIORITY',
        urgencyScore: 0.15,
        relevanceScore: 0.10,
        explanation: 'Dark pattern / artificial urgency detected. Suppressed into silent background digest without vibration.',
      });
    }
  };

  return (
    <div className="relative overflow-x-hidden min-h-screen">
      {/* 
        OFFICIAL COSMIC SPACE-HORIZON ATMOSPHERIC BACKGROUND (Page-Wide)
        Pristine cosmic galaxy wallpaper: planetary rings, mountain landscape, twilight horizon over calm water
      */}
      <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <img
          src="./backgrounds/bg-cosmic-rings.png"
          alt="Cosmic Galaxy Horizon"
          className="w-full h-full object-cover object-center filter brightness-90 contrast-105"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = './quietpulse-hero-bg.jpg';
          }}
        />
        {/* Multi-stop atmospheric vignette maintaining cosmic galaxy visibility across entire page */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 50% 30%, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.65) 60%, var(--v-bg) 100%),
              linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.85) 75%, var(--v-bg) 100%)
            `
          }}
        />
      </div>

      {/* 
        ========================================================================
        HERO SECTION: RECREATING THE OFFICIAL QUIETPULSE DESKTOP HOMEPAGE
        Visual Direction: media_1792930078537_99d85ef5.jpg
        ========================================================================
      */}
      <section className="relative min-h-[96vh] flex flex-col justify-between items-center text-center px-4 sm:px-6 lg:px-8 pt-16 pb-12 overflow-hidden z-10">

        {/* Hero Foreground Content Layer (Balanced Composition without Central Logo) */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center pt-16 sm:pt-24 md:pt-28">
          
          {/* Exact Master Tagline */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-neutral-200 text-xs sm:text-sm font-mono tracking-[0.25em] uppercase mb-6 shadow-2xl animate-reveal">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            LESS NOISE. MORE FOCUS.
          </div>

          {/* Monumental Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase font-editorial leading-tight drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] max-w-3xl">
            THE ATTENTION FIREWALL
          </h1>

          {/* Concise Product Statement per Mockup & Master Prompt */}
          <p className="text-base sm:text-xl text-neutral-200 max-w-2xl mx-auto mt-6 leading-relaxed font-sans drop-shadow-[0_2px_15px_rgba(0,0,0,0.85)]">
            QuietPulse helps you prioritize what matters and filter out what doesn't, so you can do your best work without notification anxiety.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-9 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('notify')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition shadow-2xl flex items-center justify-center gap-2 font-mono group"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('demo')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/25 text-white font-bold text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 font-mono"
            >
              <Play className="w-3.5 h-3.5 fill-current text-cyan-400" />
              <span>Watch Demo</span>
            </button>

            <button
              onClick={onOpenChokas}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-neutral-900/70 hover:bg-neutral-800/80 backdrop-blur-md border border-white/15 text-neutral-300 font-medium text-xs tracking-wider transition flex items-center justify-center gap-2 font-mono"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ask ChokasAI</span>
            </button>
          </div>

          {/* Subtle Scroll Cue */}
          <div className="mt-12 flex flex-col items-center gap-1.5 opacity-60 hover:opacity-100 transition cursor-pointer" onClick={() => window.scrollTo({ top: 750, behavior: 'smooth' })}>
            <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">Scroll to Explore</span>
            <ChevronDown className="w-4 h-4 text-neutral-400 animate-bounce" />
          </div>

        </div>

        {/* 
          ========================================================================
          FOUR BOTTOM FEATURE CARDS (FROM APPROVED HOMEPAGE REFERENCE MOCKUP)
          1. Prioritize  2. Organize  3. Focus  4. Gain Insights
          ========================================================================
        */}
        <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/15">
          {/* Card 1: Prioritize */}
          <button
            onClick={() => onNavigate('notify')}
            className="p-5 rounded-2xl bg-black/50 hover:bg-black/75 backdrop-blur-md border border-white/15 hover:border-cyan-400/50 text-left transition shadow-lg group"
          >
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-cyan-300 mb-3 group-hover:scale-110 transition-transform">
              <Filter className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Prioritize
            </h3>
            <p className="text-xs text-neutral-300 mt-1.5 leading-relaxed">
              Filter notifications based on what matters most to you. Critical alerts cut through; trivial pings wait.
            </p>
          </button>

          {/* Card 2: Organize */}
          <button
            onClick={() => onNavigate('flowqueue')}
            className="p-5 rounded-2xl bg-black/50 hover:bg-black/75 backdrop-blur-md border border-white/15 hover:border-cyan-400/50 text-left transition shadow-lg group"
          >
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-cyan-300 mb-3 group-hover:scale-110 transition-transform">
              <Inbox className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Organize
            </h3>
            <p className="text-xs text-neutral-300 mt-1.5 leading-relaxed">
              Group and schedule notifications into FlowQueue digests so they don't interrupt your cognitive flow.
            </p>
          </button>

          {/* Card 3: Focus */}
          <button
            onClick={() => onNavigate('deepfocus')}
            className="p-5 rounded-2xl bg-black/50 hover:bg-black/75 backdrop-blur-md border border-white/15 hover:border-cyan-400/50 text-left transition shadow-lg group"
          >
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-cyan-300 mb-3 group-hover:scale-110 transition-transform">
              <Timer className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Focus
            </h3>
            <p className="text-xs text-neutral-300 mt-1.5 leading-relaxed">
              Enter Deep Focus sessions with zero distractions. Reclaim uninterrupted blocks for creative work.
            </p>
          </button>

          {/* Card 4: Gain Insights */}
          <button
            onClick={() => onNavigate('pulseinsights')}
            className="p-5 rounded-2xl bg-black/50 hover:bg-black/75 backdrop-blur-md border border-white/15 hover:border-cyan-400/50 text-left transition shadow-lg group"
          >
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-cyan-300 mb-3 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Gain Insights
            </h3>
            <p className="text-xs text-neutral-300 mt-1.5 leading-relaxed">
              Understand your digital habits with PulseInsights: clear, actionable telemetry without privacy invasion.
            </p>
          </button>
        </div>

      </section>

      {/* 
        ========================================================================
        SECTION 10: INTERACTIVE ATTENTION-MANAGEMENT DEMO SANDBOX
        Master Prompt Section 10: Clearly labeled as simulated, interactive triage
        ========================================================================
      */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-v-border bg-v-surface/40">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-mono tracking-[0.25em] uppercase text-v-accent">
              SIMULATED TRIAGE LAB // INTERACTIVE TEST
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-v-text uppercase font-editorial mt-2">
              See NotiFy in Action
            </h2>
            <p className="text-sm text-v-text-muted mt-3 leading-relaxed font-sans">
              Test how the QuietPulse intelligence engine evaluates incoming notification signals in real time using independent Urgency and Relevance heuristics.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-v-text-muted block mb-1">
              Trigger Simulated Event:
            </span>

            <button
              onClick={() => handleSimulateDemo('otp')}
              className="w-full p-4 rounded-xl bg-v-surface border border-v-border hover:border-v-accent text-left transition flex items-start gap-3 group"
            >
              <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <Shield className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-v-text">Time-Critical OTP / Bank Alert</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    URGENT
                  </span>
                </div>
                <p className="text-[11px] text-v-text-muted mt-1 leading-relaxed">
                  Single-use authentication code requiring immediate entry before expiration.
                </p>
              </div>
            </button>

            <button
              onClick={() => handleSimulateDemo('slack_burst')}
              className="w-full p-4 rounded-xl bg-v-surface border border-v-border hover:border-v-accent text-left transition flex items-start gap-3 group"
            >
              <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <Flame className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-v-text">Repetitive Chat Burst (5 pings)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    BATCHED
                  </span>
                </div>
                <p className="text-[11px] text-v-text-muted mt-1 leading-relaxed">
                  Multiple rapid-fire messages flooding from a team channel inside 12 seconds.
                </p>
              </div>
            </button>

            <button
              onClick={() => handleSimulateDemo('shopping')}
              className="w-full p-4 rounded-xl bg-v-surface border border-v-border hover:border-v-accent text-left transition flex items-start gap-3 group"
            >
              <div className="p-2 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30">
                <Zap className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-v-text">Promotional FOMO Notification</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                    LOW PRIORITY
                  </span>
                </div>
                <p className="text-[11px] text-v-text-muted mt-1 leading-relaxed">
                  Artificial marketing countdown ("Cart items selling out in 10 minutes!").
                </p>
              </div>
            </button>

            <div className="pt-2 text-[10px] font-mono text-v-text-muted flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Simulated Demonstration • Zero Telemetry Transmitted</span>
            </div>
          </div>

          {/* Decision Terminal Column */}
          <div className="lg:col-span-7">
            {demoActiveNotification ? (
              <div className="p-6 rounded-2xl bg-v-surface border border-v-border shadow-2xl space-y-5 animate-reveal">
                
                {/* Header with App and Classification Badge */}
                <div className="flex items-center justify-between border-b border-v-border pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-v-text-muted uppercase tracking-wider">
                      Incoming Notification Event
                    </span>
                    <h4 className="text-sm font-bold text-v-text mt-0.5">
                      {demoActiveNotification.app}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-v-text-muted uppercase tracking-wider block">
                      Decision
                    </span>
                    <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md inline-block mt-0.5 ${
                      demoActiveNotification.decision === 'URGENT'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : demoActiveNotification.decision === 'BATCH'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}>
                      {demoActiveNotification.decision}
                    </span>
                  </div>
                </div>

                {/* Simulated Notification Card */}
                <div className="p-4 rounded-xl bg-v-secondary/70 border border-v-border">
                  <span className="text-xs font-bold text-v-text block">
                    {demoActiveNotification.title}
                  </span>
                  <p className="text-xs text-v-text-muted mt-1">
                    {demoActiveNotification.body}
                  </p>
                </div>

                {/* Scoring Matrix */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-v-secondary/40 border border-v-border">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-v-text-muted font-mono">Urgency Score</span>
                      <span className="font-bold text-v-text font-mono">
                        {Math.round(demoActiveNotification.urgencyScore * 100)}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-v-surface rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                        style={{ width: `${demoActiveNotification.urgencyScore * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-v-secondary/40 border border-v-border">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-v-text-muted font-mono">Relevance Score</span>
                      <span className="font-bold text-v-text font-mono">
                        {Math.round(demoActiveNotification.relevanceScore * 100)}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-v-surface rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-indigo-400 rounded-full transition-all duration-500"
                        style={{ width: `${demoActiveNotification.relevanceScore * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                <div className="p-4 rounded-xl bg-v-secondary/30 border border-v-border/60">
                  <span className="text-[10px] font-mono uppercase text-v-accent block mb-1">
                    Reasoning Explanation:
                  </span>
                  <p className="text-xs text-v-text-muted leading-relaxed">
                    {demoActiveNotification.explanation}
                  </p>
                </div>

              </div>
            ) : null}
          </div>

        </div>
      </section>

      {/* 
        ========================================================================
        SCROLL REVEAL SECTION: NOTIFY INTELLIGENCE ARCHITECTURE
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
              Traditional digital wellbeing utilities merely track screen time after the damage is done—generating post-mortem graphs of lost hours. <strong>QuietPulse</strong> operates as a real-time attention firewall: evaluating every notification event using independent urgency and relevance heuristics before screen vibration occurs.
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
                  Monitors a rolling 60-second window. When multiple applications ping in rapid succession or a single service floods repetitive alerts, the firewall halts interruption escalation.
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
        SCROLL REVEAL SECTION 2: FLOWQUEUE DIGEST
        ========================================================================
      */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-v-border bg-v-surface/30">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal>
            <div>
              <span className="text-xs font-mono tracking-[0.25em] uppercase text-v-accent">
                02 // THE FLOWQUEUE SYSTEM
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-v-text uppercase font-editorial mt-3 leading-tight">
                No notification avalanche when focus ends.
              </h2>
              <p className="text-sm text-v-text-muted mt-4 leading-relaxed font-sans">
                The standard failure of "Do Not Disturb" modes is the post-session flood: the moment you turn off focus, 40 unread badges hit your screen at once, causing instant relapse into phone checking.
              </p>
              <p className="text-sm text-v-text-muted mt-3 leading-relaxed font-sans">
                <strong>FlowQueue</strong> routes non-urgent alerts into an intelligent holding buffer, organizing notification volumes by application without exposing private text until you consciously decide to review them.
              </p>

              <div className="flex items-center gap-4 mt-8">
                <button
                  onClick={() => onNavigate('flowqueue')}
                  className="px-5 py-2.5 rounded-xl bg-v-surface hover:bg-v-secondary border border-v-border text-v-text font-bold text-xs uppercase tracking-wider font-mono transition"
                >
                  View FlowQueue
                </button>
                <button
                  onClick={() => onNavigate('deepfocus')}
                  className="text-xs text-v-accent hover:text-v-text font-semibold flex items-center gap-1.5 transition"
                >
                  <span>Configure Deep Focus</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Interactive FlowQueue Digest Card */}
          <ScrollReveal delayMs={200}>
            <div className="p-6 rounded-2xl bg-v-surface border border-v-border shadow-2xl">
              <div className="flex items-center justify-between border-b border-v-border pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Inbox className="w-4 h-4 text-v-accent" />
                  <span className="text-xs font-bold text-v-text uppercase tracking-wider font-mono">
                    FlowQueue Digest Preview
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
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono tracking-[0.25em] uppercase text-cyan-400">
              03 // IN-APP COMPANION
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-v-text uppercase font-editorial mt-3 tracking-tight">
              MEET CHOKASAI
            </h2>
            <p className="text-sm text-v-text-muted mt-3 leading-relaxed font-sans max-w-xl mx-auto">
              Your intelligent attention copilot powered by Google Gemini conversational AI and on-device command execution. Explain triage decisions, navigate features, and protect your focus.
            </p>
          </div>
        </ScrollReveal>

        {/* ChokasAI Cards Grid: Translucent Frosted Glass floating over Cosmic Backdrop */}
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <ScrollReveal delayMs={100} className="w-full min-w-0">
            <div className="p-6 sm:p-7 rounded-2xl bg-black/50 hover:bg-black/70 backdrop-blur-xl border border-white/15 hover:border-cyan-400/50 h-full flex flex-col justify-between overflow-hidden transition-all shadow-xl group">
              <div>
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-bold">Mode 01</span>
                <h3 className="text-base font-bold text-white mt-1.5">Explain</h3>
                <p className="text-xs text-neutral-300 mt-2.5 leading-relaxed font-sans">
                  Answers questions about how notifications were categorized, what burst thresholds mean, and why specific alerts were buffered into FlowQueue.
                </p>
              </div>
              <div className="mt-5 p-3 rounded-lg bg-white/5 text-[11px] font-mono text-neutral-300 border border-white/10 break-words">
                "Why was my social notification delayed?"
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={200} className="w-full min-w-0">
            <div className="p-6 sm:p-7 rounded-2xl bg-black/50 hover:bg-black/70 backdrop-blur-xl border border-white/15 hover:border-cyan-400/50 h-full flex flex-col justify-between overflow-hidden transition-all shadow-xl group">
              <div>
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-bold">Mode 02</span>
                <h3 className="text-base font-bold text-white mt-1.5">Navigate</h3>
                <p className="text-xs text-neutral-300 mt-2.5 leading-relaxed font-sans">
                  Directly transports you across NotiFy, FlowQueue, Deep Focus, PulseInsights, and Privacy with natural voice-like commands.
                </p>
              </div>
              <div className="mt-5 p-3 rounded-lg bg-white/5 text-[11px] font-mono text-neutral-300 border border-white/10 break-words">
                "Open my focus settings"
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={300} className="w-full min-w-0">
            <div className="p-6 sm:p-7 rounded-2xl bg-black/50 hover:bg-black/70 backdrop-blur-xl border border-white/15 hover:border-cyan-400/50 h-full flex flex-col justify-between overflow-hidden transition-all shadow-xl group">
              <div>
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-bold">Mode 03</span>
                <h3 className="text-base font-bold text-white mt-1.5">Act</h3>
                <p className="text-xs text-neutral-300 mt-2.5 leading-relaxed font-sans">
                  Executes verified in-app commands: starts Deep Focus sessions, clears FlowQueue, or switches between Obsidian Silver, Emerald, and Pearl themes.
                </p>
              </div>
              <div className="mt-5 p-3 rounded-lg bg-white/5 text-[11px] font-mono text-neutral-300 border border-white/10 break-words">
                "Switch to Emerald theme"
              </div>
            </div>
          </ScrollReveal>
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={onOpenChokas}
            className="px-8 py-3.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest font-mono hover:bg-neutral-200 transition inline-flex items-center gap-2.5 shadow-2xl group"
          >
            <Sparkles className="w-4 h-4 text-cyan-500 group-hover:scale-110 transition-transform" />
            <span>Launch ChokasAI Assistant</span>
          </button>
        </div>
      </section>

      {/* 
        ========================================================================
        CALL TO ACTION (Clean Download Android App & Contact Team, No Launch NotiFy)
        ========================================================================
      */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-white/10 text-center">
        <ScrollReveal>
          <div className="p-10 sm:p-14 rounded-3xl bg-black/60 backdrop-blur-xl border border-white/15 relative overflow-hidden shadow-2xl">
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-editorial tracking-tight">
              Reclaim Your Cognitive Bandwidth.
            </h2>
            <p className="text-sm text-neutral-300 max-w-lg mx-auto mt-4 leading-relaxed font-sans">
              Install QuietPulse on your mobile phone or run the live attention firewall directly in this environment.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <a
                href="./QuietPulse.apk"
                download="QuietPulse.apk"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest font-mono hover:bg-neutral-200 transition shadow-2xl flex items-center justify-center gap-2.5 group"
                title="Download Official QuietPulse Android APK"
              >
                <Download className="w-4 h-4" />
                <span>Download Android App</span>
              </a>
              <button
                onClick={() => onNavigate('contact')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-black/50 hover:bg-black/80 border border-white/25 text-white font-bold text-xs uppercase tracking-widest font-mono transition flex items-center justify-center gap-2"
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
