import React from 'react';
import {
  Shield,
  Timer,
  Flame,
  BellOff,
  Sparkles,
  ChevronRight,
  Terminal,
  Settings,
  Briefcase,
  Home,
  Sliders,
  CheckCircle2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { UiNotificationItem, AnalyticsMetrics, ContextMode } from '../types';

interface DashboardProps {
  isFocusActive: boolean;
  remainingFocusSeconds: number;
  burstRate: number;
  isBurstActive: boolean;
  metrics: AnalyticsMetrics;
  recentItems: UiNotificationItem[];
  onStartFocus: (name: string, duration: number) => void;
  onEndFocus: () => void;
  onNavigate: (tab: string) => void;
  activeContextMode: ContextMode;
  onChangeContextMode: (mode: ContextMode) => void;
  isNotificationAccessGranted: boolean;
  onRequestNotificationAccess: () => void;
  isNativeAndroid: boolean;
}

export const DashboardPage: React.FC<DashboardProps> = ({
  isFocusActive,
  remainingFocusSeconds,
  burstRate,
  isBurstActive,
  metrics,
  recentItems,
  onStartFocus,
  onEndFocus,
  onNavigate,
  activeContextMode,
  onChangeContextMode,
  isNotificationAccessGranted,
  onRequestNotificationAccess,
  isNativeAndroid
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-4">
      {/* 1. NotiFy Status Banner per Master Prompt */}
      <div className="p-6 rounded-2xl bg-v-surface border border-v-border shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-v-elevated border border-v-border flex items-center justify-center text-v-text">
                <Shield className="w-6 h-6 text-cyan-400" />
              </div>
              <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-v-surface ${isNotificationAccessGranted ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-v-text uppercase tracking-wider font-mono">
                  NotiFy Engine
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-v-secondary text-v-text border border-v-border">
                  TRIAGE ACTIVE
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-v-elevated text-cyan-400 border border-v-border">
                  {activeContextMode} MODE
                </span>
              </div>
              <p className="text-xs text-v-text-muted mt-0.5 font-sans">
                Prioritizes incoming alerts, halts repetitive bursts, and organizes non-urgent notifications into FlowQueue.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('rules')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono font-bold rounded-xl bg-v-secondary hover:bg-v-elevated border border-v-border text-v-text transition"
              title="Configure Context Modes & Rules"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Modes &amp; Rules</span>
            </button>
            <button
              onClick={() => onNavigate('demo')}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold rounded-xl bg-v-text text-v-bg hover:opacity-90 transition shadow-lg"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Demo Lab</span>
            </button>
          </div>
        </div>
      </div>

      {/* Android Notification Access Onboarding Strip (Section 9) */}
      <div className="p-4 rounded-xl bg-v-secondary/60 border border-v-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans">
        <div className="flex items-center gap-3">
          {isNotificationAccessGranted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-v-text font-mono text-[11px] uppercase">
                {isNativeAndroid
                  ? isNotificationAccessGranted
                    ? 'Android Notification Access: Enabled'
                    : 'Android Notification Access: Required'
                  : 'Platform Environment: Web Preview / Simulated Engine'}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-v-surface text-v-text-muted border border-v-border">
                100% On-Device
              </span>
            </div>
            <p className="text-[11px] text-v-text-muted mt-0.5">
              {isNotificationAccessGranted
                ? 'Incoming notification streams are being filtered on-device using your active Context Mode.'
                : 'QuietPulse requires Android Notification Access to evaluate distractions. Zero text is uploaded to any external server.'}
            </p>
          </div>
        </div>

        {isNativeAndroid && (
          <button
            onClick={onRequestNotificationAccess}
            className="px-3.5 py-1.5 rounded-lg bg-v-surface hover:bg-v-elevated border border-v-border text-v-text font-mono font-bold text-xs transition flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>{isNotificationAccessGranted ? 'Recheck Access' : 'Open Android Settings'}</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* 2. Context Mode Quick Switcher Strip (Exactly 3 Approved Modes) */}
      <div className="p-4 rounded-2xl bg-v-surface border border-v-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-v-accent uppercase block">
              Active Context Mode
            </span>
            <h4 className="text-xs font-bold text-v-text mt-0.5">
              Current Triage Heuristic: <span className="text-cyan-400">{activeContextMode}</span>
            </h4>
          </div>

          <div className="grid grid-cols-3 w-full sm:w-auto gap-1 bg-v-secondary p-1 rounded-xl border border-v-border">
            <button
              onClick={() => onChangeContextMode('OFFICE')}
              className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-bold rounded-lg transition ${
                activeContextMode === 'OFFICE'
                  ? 'bg-v-text text-v-bg shadow-sm'
                  : 'text-v-text-muted hover:text-v-text'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Office</span>
            </button>
            <button
              onClick={() => onChangeContextMode('HOME')}
              className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-bold rounded-lg transition ${
                activeContextMode === 'HOME'
                  ? 'bg-v-text text-v-bg shadow-sm'
                  : 'text-v-text-muted hover:text-v-text'
              }`}
            >
              <Home className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Home</span>
            </button>
            <button
              onClick={() => onChangeContextMode('PERSONALIZED')}
              className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-bold rounded-lg transition ${
                activeContextMode === 'PERSONALIZED'
                  ? 'bg-v-text text-v-bg shadow-sm'
                  : 'text-v-text-muted hover:text-v-text'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Personalized</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Real-Time Telemetry Cards: EXACTLY 3 BALANCED CARDS (FlowQueue Total removed per 5.3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Burst Frequency */}
        <div className="p-5 rounded-2xl bg-v-surface border border-v-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-v-text-muted mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider font-bold">Burst Frequency</span>
            <Flame className={`w-4 h-4 ${isBurstActive ? 'text-rose-400 animate-bounce' : 'text-v-accent'}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-black font-editorial ${isBurstActive ? 'text-rose-400' : 'text-v-text'}`}>
              {burstRate} <span className="text-xs font-sans font-normal text-v-text-muted">/min</span>
            </span>
            {isBurstActive && (
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 uppercase">
                Storm Active
              </span>
            )}
          </div>
          <p className="text-[11px] text-v-text-muted mt-2 font-sans">
            Measured over a continuous rolling 60-second window to prevent notification floods.
          </p>
        </div>

        {/* Card 2: Deflected */}
        <div className="p-5 rounded-2xl bg-v-surface border border-v-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-v-text-muted mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider font-bold">Deflected</span>
            <BellOff className="w-4 h-4 text-v-accent" />
          </div>
          <div className="text-3xl font-black font-editorial text-v-text">
            {metrics.estimatedInterruptionsDeflected}
          </div>
          <p className="text-[11px] text-v-text-muted mt-2 font-sans">
            Non-urgent and promotional alerts buffered quietly into FlowQueue without screen vibration.
          </p>
        </div>

        {/* Card 3: Focus Time */}
        <div className="p-5 rounded-2xl bg-v-surface border border-v-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-v-text-muted mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider font-bold">Focus Time</span>
            <Timer className="w-4 h-4 text-v-accent" />
          </div>
          <div className="text-3xl font-black font-editorial text-v-text">
            {metrics.totalFocusMinutes} <span className="text-xs font-sans font-normal text-v-text-muted">mins</span>
          </div>
          <p className="text-[11px] text-v-text-muted mt-2 font-sans">
            {metrics.completedSessionsCount} DeepFocus intervals completed without interruption.
          </p>
        </div>
      </div>

      {/* 4. DeepFocus Quick Gateway */}
      <div className="p-6 rounded-2xl bg-v-surface border border-v-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-v-accent uppercase">
              DeepFocus Window
            </span>
            <h3 className="text-base font-bold text-v-text mt-0.5">
              {isFocusActive ? 'DeepFocus Window Protected' : 'Initiate a Focused Work Window'}
            </h3>
            <p className="text-xs text-v-text-muted mt-0.5 font-sans">
              Non-urgent notifications are routed into FlowQueue during active focus sessions.
            </p>
          </div>

          {isFocusActive ? (
            <div className="flex items-center gap-4">
              <div className="text-2xl font-mono font-black text-v-text">
                {formatTime(remainingFocusSeconds)}
              </div>
              <button
                onClick={onEndFocus}
                className="px-4 py-2 text-xs font-mono font-bold rounded-xl bg-v-secondary hover:bg-v-elevated border border-v-border text-v-text transition"
              >
                End Session
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onStartFocus('25m Pomodoro Focus', 25)}
                className="px-4 py-2 text-xs font-mono font-bold rounded-xl bg-v-text text-v-bg hover:opacity-90 transition shadow-md"
              >
                25m Pomodoro
              </button>
              <button
                onClick={() => onStartFocus('50m Deep Work Block', 50)}
                className="px-4 py-2 text-xs font-mono font-bold rounded-xl bg-v-secondary hover:bg-v-elevated border border-v-border text-v-text transition"
              >
                50m Deep Work
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 5. Recent Intelligence Decisions Stream */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-v-text-muted">
            Live Cognitive Decisions
          </h3>
          <button
            onClick={() => onNavigate('flowqueue')}
            className="text-xs font-mono text-v-accent hover:text-v-text flex items-center gap-1"
          >
            FlowQueue ({recentItems.length}) <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentItems.length === 0 ? (
          <div className="p-10 rounded-2xl bg-v-surface border border-dashed border-v-border text-center">
            <Sparkles className="w-8 h-8 text-v-text-muted mx-auto mb-2" />
            <p className="text-sm font-medium text-v-text">No Notifications Evaluated Yet</p>
            <p className="text-xs text-v-text-muted mt-1 font-sans">
              {isNativeAndroid
                ? 'Waiting for notifications from your device, or test scenarios using the Demo Lab.'
                : 'Run a scenario in the Demo Lab to observe live NotiFy classification heuristics.'}
            </p>
            <button
              onClick={() => onNavigate('demo')}
              className="mt-4 px-4 py-2 text-xs font-mono font-semibold rounded-lg bg-v-secondary text-v-text border border-v-border hover:bg-v-elevated transition"
            >
              Open Demo Lab
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {recentItems.slice(0, 6).map(item => (
              <div
                key={item.event.id}
                className="p-4 rounded-xl bg-v-surface border border-v-border hover:border-v-accent/40 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-v-text truncate">{item.event.appName}</span>
                      {item.event.sourceType === 'SIMULATED' ? (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-v-secondary text-v-text-muted border border-v-border">
                          SIMULATED
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          LIVE ANDROID
                        </span>
                      )}
                      <span className="text-[11px] font-mono text-v-text-muted">
                        {new Date(item.event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-v-text">{item.event.title}</p>
                    <p className="text-xs text-v-text-muted line-clamp-1 mt-0.5">{item.event.text}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg border ${
                      item.result.category === 'URGENT'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : item.result.category === 'IMPORTANT'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : item.result.category === 'BATCH'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        : item.result.category === 'SPAM'
                        ? 'bg-neutral-800 text-rose-400 border-neutral-700'
                        : 'bg-v-secondary text-v-text-muted border-v-border'
                    }`}
                  >
                    {item.result.category}
                  </span>
                </div>
                <div className="mt-2.5 pt-2 border-t border-v-border/60 flex items-center gap-1.5 text-[11px] text-v-text font-mono">
                  <span>↳</span>
                  <span className="truncate">{item.result.explanation}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
