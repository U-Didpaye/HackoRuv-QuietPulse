import React from 'react';
import { Shield, Timer, Flame, BellOff, Sparkles, CheckCircle2, AlertTriangle, Play, ChevronRight, Activity } from 'lucide-react';
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
    <div className="space-y-6">
      {/* 1. Firewall Shield Status Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-navy-card via-navy-card to-slate-900 border border-navy-border shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Shield className="w-6 h-6 animate-pulse" />
              </div>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-navy-card" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">FocusShield AI Firewall</h2>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Privacy-first on-device interruption filtering & cognitive triage
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('demo')}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-cyan-500 text-navy-dark hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/20"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Judge Demo Lab
          </button>
        </div>
      </div>

      {/* 2. Real-Time Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-navy-card border border-navy-border">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Burst Rate</span>
            <Flame className={`w-4 h-4 ${isBurstActive ? 'text-rose-500 animate-bounce' : 'text-emerald-400'}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black ${isBurstActive ? 'text-rose-400' : 'text-white'}`}>
              {burstRate} <span className="text-xs font-normal text-slate-400">/min</span>
            </span>
            {isBurstActive && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 uppercase">
                Storm
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Rolling 60s event window</p>
        </div>

        <div className="p-4 rounded-xl bg-navy-card border border-navy-border">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Deflected</span>
            <BellOff className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">
            {metrics.estimatedInterruptionsDeflected}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Held in Attention Airlock</p>
        </div>

        <div className="p-4 rounded-xl bg-navy-card border border-navy-border">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Focus Time</span>
            <Timer className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {metrics.totalFocusMinutes} <span className="text-xs font-normal text-slate-400">mins</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{metrics.completedSessionsCount} sessions completed</p>
        </div>

        <div className="p-4 rounded-xl bg-navy-card border border-navy-border">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Queue Total</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {recentItems.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {recentItems.filter(i => i.result.category === 'URGENT').length} urgent pending
          </p>
        </div>
      </div>

      {/* 3. Focus Session Control Bar */}
      <div className="p-5 rounded-2xl bg-navy-card border border-navy-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase">Attention Gateway</span>
            <h3 className="text-base font-bold text-white mt-0.5">
              {isFocusActive ? 'Deep Focus Session In Progress' : 'Start a Focused Attention Window'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Non-urgent alerts are silently routed to the Attention Airlock during focus.
            </p>
          </div>

          {isFocusActive ? (
            <div className="flex items-center gap-4">
              <div className="text-2xl font-mono font-black text-cyan-400">
                {formatTime(remainingFocusSeconds)}
              </div>
              <button
                onClick={onEndFocus}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30 transition"
              >
                End Session
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onStartFocus('Pomodoro Focus', 25)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/20"
              >
                25m Pomodoro
              </button>
              <button
                onClick={() => onStartFocus('Deep Work', 50)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-navy-hover hover:bg-slate-700 text-slate-200 border border-navy-border transition"
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
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Live Cognitive Decisions
          </h3>
          <button
            onClick={() => onNavigate('queue')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            Open Queue ({recentItems.length}) <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentItems.length === 0 ? (
          <div className="p-8 rounded-xl bg-navy-card/50 border border-dashed border-navy-border text-center">
            <Sparkles className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-300">No Notifications Evaluated Yet</p>
            <p className="text-xs text-slate-500 mt-1">
              Go to the Judge Demo Lab to simulate realistic notification storms.
            </p>
            <button
              onClick={() => onNavigate('demo')}
              className="mt-4 px-4 py-1.5 text-xs font-semibold rounded-lg bg-navy-hover text-cyan-400 border border-navy-border hover:bg-slate-700 transition"
            >
              Open Demo Lab
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {recentItems.slice(0, 5).map(item => (
              <div
                key={item.event.id}
                className="p-4 rounded-xl bg-navy-card border border-navy-border hover:border-slate-600 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-white truncate">{item.event.appName}</span>
                      {item.event.sourceType === 'SIMULATED' && (
                        <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.2 rounded border border-cyan-500/20">
                          SIMULATED
                        </span>
                      )}
                      <span className="text-[11px] text-slate-500">
                        {new Date(item.event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-200">{item.event.title}</p>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{item.event.text}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border ${
                      item.result.category === 'URGENT'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : item.result.category === 'IMPORTANT'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : item.result.category === 'BATCH'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        : 'bg-slate-500/10 text-slate-400 border-slate-500/30'
                    }`}
                  >
                    {item.result.category}
                  </span>
                </div>
                <div className="mt-2.5 pt-2 border-t border-navy-border/60 flex items-center gap-1.5 text-[11px] text-cyan-300">
                  <span>💡</span>
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
