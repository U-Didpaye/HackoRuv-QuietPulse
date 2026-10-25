import React, { useState } from 'react';
import { Timer, Play, Square, Sparkles, CheckCircle2, Info } from 'lucide-react';
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
      {/* Title */}
      <div className="text-center">
        <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-v-accent">
          COGNITIVE GATEWAYS
        </span>
        <h2 className="text-3xl font-black text-v-text uppercase font-editorial tracking-wide mt-1">
          Focus Sessions
        </h2>
        <p className="text-xs text-v-text-muted mt-1 font-sans">
          Lock in your attention. Non-urgent interruptions are routed to the Attention Airlock.
        </p>
      </div>

      {/* Main Focus Dial Card */}
      <div className="p-8 rounded-3xl bg-v-surface border border-v-border shadow-2xl flex flex-col items-center">
        <span className="text-[10px] font-mono font-bold tracking-widest text-v-accent uppercase mb-4">
          {isFocusActive ? 'Active Focus Session' : 'Ready to Initialize'}
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
            <circle
              cx="112"
              cy="112"
              r="96"
              className="stroke-v-accent transition-all duration-1000 ease-linear"
              strokeWidth="6"
              strokeDasharray={2 * Math.PI * 96}
              strokeDashoffset={2 * Math.PI * 96 * (1 - progressPercent / 100)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center">
            <div className="text-4xl font-mono font-black text-v-text">
              {isFocusActive ? formatTime(remainingSeconds) : `${customDuration}:00`}
            </div>
            <span className="text-xs font-mono text-v-text-muted mt-1">
              {isFocusActive ? 'Remaining' : 'Target Duration'}
            </span>
          </div>
        </div>

        {/* Controls */}
        {isFocusActive ? (
          <button
            onClick={onEndFocus}
            className="w-full max-w-sm mt-4 py-3 text-xs font-mono font-bold rounded-xl bg-v-secondary hover:bg-v-elevated border border-v-border text-v-text flex items-center justify-center gap-2 transition"
          >
            <Square className="w-4 h-4 fill-current" />
            End Focus Session Early
          </button>
        ) : (
          <div className="w-full max-w-sm space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onStartFocus('25m Pomodoro Focus', 25)}
                className="py-2.5 px-4 text-xs font-mono font-bold rounded-xl bg-v-text text-v-bg hover:opacity-90 transition shadow-md"
              >
                25m Pomodoro
              </button>
              <button
                onClick={() => onStartFocus('50m Deep Work Block', 50)}
                className="py-2.5 px-4 text-xs font-mono font-bold rounded-xl bg-v-secondary hover:bg-v-elevated text-v-text border border-v-border transition"
              >
                50m Deep Work
              </button>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-mono text-v-text-muted">
                <span>Custom Duration</span>
                <span className="font-bold text-v-text">{customDuration} minutes</span>
              </div>
              <input
                type="range"
                min="5"
                max="120"
                step="5"
                value={customDuration}
                onChange={e => setCustomDuration(parseInt(e.target.value))}
                className="w-full accent-v-text cursor-pointer"
              />
            </div>

            <button
              onClick={() => onStartFocus('Custom Focus Window', customDuration)}
              className="w-full py-3 text-xs font-mono font-bold rounded-xl bg-v-text text-v-bg hover:opacity-90 flex items-center justify-center gap-2 transition shadow-lg"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Initialize Custom Session
            </button>
          </div>
        )}
      </div>

      {/* Focus Analytics Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-v-surface border border-v-border text-center">
          <span className="text-[10px] font-mono text-v-text-muted uppercase">Total Logged</span>
          <div className="text-xl font-bold font-editorial text-v-text mt-1">{metrics.totalFocusMinutes}m</div>
        </div>
        <div className="p-4 rounded-xl bg-v-surface border border-v-border text-center">
          <span className="text-[10px] font-mono text-v-text-muted uppercase">Completed</span>
          <div className="text-xl font-bold font-editorial text-v-text mt-1">{metrics.completedSessionsCount}</div>
        </div>
        <div className="p-4 rounded-xl bg-v-surface border border-v-border text-center">
          <span className="text-[10px] font-mono text-v-text-muted uppercase">Deflected</span>
          <div className="text-xl font-bold font-editorial text-v-accent mt-1">{metrics.estimatedInterruptionsDeflected}</div>
        </div>
      </div>

      {/* Platform Architecture Notice */}
      <div className="p-4 rounded-xl bg-v-surface/60 border border-v-border flex items-start gap-3">
        <Info className="w-5 h-5 text-v-accent shrink-0 mt-0.5" />
        <p className="text-xs text-v-text-muted leading-relaxed font-sans">
          <strong>Technical Integrity:</strong> VYROX prioritizes notifications into your local Attention Airlock. It does not falsely claim to mute system phone calls or override low-level OS audio drivers without explicit user permission.
        </p>
      </div>
    </div>
  );
};
