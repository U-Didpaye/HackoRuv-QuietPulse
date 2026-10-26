import React, { useState } from 'react';
import { Timer, Play, Square, Sparkles, CheckCircle2, Info, ShieldCheck } from 'lucide-react';
import { AnalyticsMetrics } from '../types';

interface FocusPageProps {
  isFocusActive: boolean;
  remainingSeconds: number;
  metrics: AnalyticsMetrics;
  onStartFocus: (name: string, durationMinutes: number) => void;
  onEndFocus: () => void;
}

export const FocusPage: React.FC<FocusPageProps> = ({
  isFocusActive,
  remainingSeconds,
  metrics,
  onStartFocus,
  onEndFocus
}) => {
  const [customDuration, setCustomDuration] = useState(30);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const targetSecs = (isFocusActive ? 25 : customDuration) * 60;
  const progressPercent = isFocusActive ? Math.min(100, Math.max(0, (1 - remainingSeconds / targetSecs) * 100)) : 0;

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-4">
      {/* Title per Section 8: Deep Focus */}
      <div className="text-center">
        <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-v-accent">
          COGNITIVE GATEWAYS
        </span>
        <h2 className="text-3xl font-black text-v-text uppercase font-editorial tracking-wide mt-1">
          Deep Focus
        </h2>
        <p className="text-xs text-v-text-muted mt-1 font-sans">
          Lock in your cognitive attention. Non-urgent alerts are organized into FlowQueue until your session finishes.
        </p>
      </div>

      {/* Main Focus Dial Card */}
      <div className="p-8 rounded-3xl bg-v-surface border border-v-border shadow-2xl flex flex-col items-center">
        <span className="text-[10px] font-mono font-bold tracking-widest text-v-accent uppercase mb-4">
          {isFocusActive ? 'Active Deep Focus Session' : 'Ready to Initialize'}
        </span>

        {/* Circular Progress Display */}
        <div className="relative w-56 h-56 flex items-center justify-center my-4">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="112"
              cy="112"
              r="96"
              className="stroke-v-border"
              strokeWidth="6"
              fill="transparent"
            />
            {isFocusActive && (
              <circle
                cx="112"
                cy="112"
                r="96"
                className="stroke-v-accent transition-all duration-1000"
                strokeWidth="6"
                strokeDasharray={2 * Math.PI * 96}
                strokeDashoffset={2 * Math.PI * 96 * (1 - progressPercent / 100)}
                strokeLinecap="round"
                fill="transparent"
              />
            )}
          </svg>

          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-mono font-black text-v-text tracking-tighter">
              {isFocusActive ? formatTime(remainingSeconds) : `${customDuration}:00`}
            </span>
            <span className="text-[10px] font-mono text-v-text-muted uppercase tracking-wider mt-1">
              {isFocusActive ? 'Remaining' : 'Preset Duration'}
            </span>
          </div>
        </div>

        {/* Session Controls */}
        {isFocusActive ? (
          <button
            onClick={onEndFocus}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-v-secondary hover:bg-v-elevated border border-v-border text-v-text font-bold text-xs uppercase tracking-widest font-mono transition"
          >
            <Square className="w-4 h-4 fill-current text-rose-400" />
            <span>End Session Early</span>
          </button>
        ) : (
          <div className="flex flex-col items-center gap-4 w-full max-w-sm">
            <div className="flex items-center justify-center gap-2 w-full">
              {[15, 25, 45, 60].map(mins => (
                <button
                  key={mins}
                  onClick={() => setCustomDuration(mins)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                    customDuration === mins
                      ? 'bg-v-text text-v-bg shadow-md'
                      : 'bg-v-secondary text-v-text-muted hover:text-v-text border border-v-border'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>

            <button
              onClick={() => onStartFocus(`${customDuration}m Deep Focus Session`, customDuration)}
              className="w-full py-3.5 rounded-xl bg-v-text text-v-bg font-bold text-xs uppercase tracking-widest font-mono hover:opacity-90 transition shadow-xl flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current text-cyan-400" />
              <span>Begin Deep Focus Session</span>
            </button>
          </div>
        )}
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-v-surface border border-v-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-v-secondary flex items-center justify-center text-v-accent border border-v-border">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-base font-bold text-v-text font-mono">
              {metrics.completedSessionsCount}
            </span>
            <p className="text-[10px] text-v-text-muted font-mono uppercase tracking-wider">
              Sessions Completed
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-v-surface border border-v-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-v-secondary flex items-center justify-center text-v-accent border border-v-border">
            <Timer className="w-4 h-4" />
          </div>
          <div>
            <span className="text-base font-bold text-v-text font-mono">
              {metrics.totalFocusMinutes}m
            </span>
            <p className="text-[10px] text-v-text-muted font-mono uppercase tracking-wider">
              Total Focus Time
            </p>
          </div>
        </div>
      </div>

      {/* Information Callout */}
      <div className="p-4 rounded-xl bg-v-secondary/50 border border-v-border flex items-start gap-3 text-xs text-v-text-muted font-sans">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          While Deep Focus is running, incoming notifications are evaluated silently. Time-sensitive emergencies (OTPs, urgent calls) still pass through, while recreational and promotional pings wait in FlowQueue.
        </p>
      </div>
    </div>
  );
};
