import React from 'react';
import { Shield, Timer, Flame, BellOff, Sparkles, CheckCircle2, AlertTriangle, Play, ChevronRight, Activity, Terminal } from 'lucide-react';
import { UiNotificationItem, AnalyticsMetrics } from '../types';

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
  onNavigate
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-4">
      {/* 1. NotiFy Status Banner per Section 8 of Master Prompt */}
      <div className="p-6 rounded-2xl bg-v-surface border border-v-border shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-v-elevated border border-v-border flex items-center justify-center text-v-text">
                <Shield className="w-6 h-6 text-cyan-400" />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-v-surface" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-v-text uppercase tracking-wider font-mono">
                  NotiFy Engine
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-v-secondary text-v-text border border-v-border">
                  TRIAGE ACTIVE
                </span>
              </div>
              <p className="text-xs text-v-text-muted mt-0.5 font-sans">
                Prioritizes incoming alerts, halts repetitive bursts, and organizes non-urgent notifications into FlowQueue.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('demo')}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold rounded-xl bg-v-text text-v-bg hover:opacity-90 transition shadow-lg"
            >
              <Terminal className="w-3.5 h-3.5" />
              Demo Lab
            </button>
          </div>
        </div>
      </div>

      {/* 2. Real-Time Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-v-surface border border-v-border">
          <div className="flex items-center justify-between text-v-text-muted mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Burst Frequency</span>
            <Flame className={`w-4 h-4 ${isBurstActive ? 'text-rose-400 animate-bounce' : 'text-v-accent'}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black font-editorial ${isBurstActive ? 'text-rose-400' : 'text-v-text'}`}>
              {burstRate} <span className="text-xs font-sans font-normal text-v-text-muted">/min</span>
            </span>
            {isBurstActive && (
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 uppercase">
                Storm
              </span>
            )}
          </div>
          <p className="text-[11px] text-v-text-muted mt-1 font-sans">60s rolling window</p>
        </div>

        <div className="p-5 rounded-2xl bg-v-surface border border-v-border">
          <div className="flex items-center justify-between text-v-text-muted mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Deflected</span>
            <BellOff className="w-4 h-4 text-v-accent" />
          </div>
          <div className="text-2xl font-black font-editorial text-v-text">
            {metrics.estimatedInterruptionsDeflected}
          </div>
          <p className="text-[11px] text-v-text-muted mt-1 font-sans">Buffered in FlowQueue</p>
        </div>

        <div className="p-5 rounded-2xl bg-v-surface border border-v-border">
          <div className="flex items-center justify-between text-v-text-muted mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Focus Time</span>
            <Timer className="w-4 h-4 text-v-accent" />
          </div>
          <div className="text-2xl font-black font-editorial text-v-text">
            {metrics.totalFocusMinutes} <span className="text-xs font-sans font-normal text-v-text-muted">mins</span>
          </div>
          <p className="text-[11px] text-v-text-muted mt-1 font-sans">{metrics.completedSessionsCount} sessions completed</p>
        </div>

        <div className="p-5 rounded-2xl bg-v-surface border border-v-border">
          <div className="flex items-center justify-between text-v-text-muted mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">FlowQueue Total</span>
            <Activity className="w-4 h-4 text-v-accent" />
          </div>
          <div className="text-2xl font-black font-editorial text-v-text">
            {recentItems.length}
          </div>
          <p className="text-[11px] text-v-text-muted mt-1 font-sans">
            {recentItems.filter(i => i.result.category === 'URGENT').length} urgent permitted
          </p>
        </div>
      </div>

      {/* 3. DeepFocus Quick Gateway */}
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

      {/* 4. Recent Intelligence Decisions Stream */}
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
              Run a scenario in the Demo Lab to observe live NotiFy classification heuristics.
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
                      {item.event.sourceType === 'SIMULATED' && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-v-secondary text-v-text-muted border border-v-border">
                          SIMULATED
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
