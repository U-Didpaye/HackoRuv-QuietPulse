import React, { useState } from 'react';
import { Timer, Play, Square, Sparkles, CheckCircle2, ShieldAlert, Info } from 'lucide-react';
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
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-2xl font-black text-white tracking-wide">Focus Sessions & Gateways</h2>
        <p className="text-xs text-slate-400 mt-1">
          Lock in your attention. Non-urgent alerts are automatically triaged into the Attention Airlock.
        </p>
      </div>

      {/* Main Focus Dial Card */}
      <div className="p-8 rounded-3xl bg-navy-card border border-navy-border shadow-2xl flex flex-col items-center">
        <span className="text-[11px] font-bold tracking-widest text-cyan-400 uppercase mb-4">
          {isFocusActive ? 'Active Focus Session' : 'Ready to Start'}
        </span>

        {/* Circular Progress Display */}
        <div className="relative w-56 h-56 flex items-center justify-center my-4">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="112"
              cy="112"
              r="96"
              className="stroke-navy-border"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="112"
              cy="112"
              r="96"
              className="stroke-cyan-400 transition-all duration-1000 ease-linear"
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 96}
              strokeDashoffset={2 * Math.PI * 96 * (1 - progressPercent / 100)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center">
            <div className="text-4xl font-mono font-black text-white">
              {isFocusActive ? formatTime(remainingSeconds) : `${customDuration}:00`}
            </div>
            <span className="text-xs font-semibold text-slate-400 mt-1">
              {isFocusActive ? 'Remaining' : 'Target Duration'}
            </span>
          </div>
        </div>

        {/* Controls */}
        {isFocusActive ? (
          <button
            onClick={onEndFocus}
            className="w-full max-w-sm mt-4 py-3 text-sm font-bold rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/40 flex items-center justify-center gap-2 transition"
          >
            <Square className="w-4 h-4 fill-current" />
            End Focus Session Early
          </button>
        ) : (
          <div className="w-full max-w-sm space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onStartFocus('25m Pomodoro', 25)}
                className="py-2.5 px-4 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/30"
              >
                25m Pomodoro
              </button>
              <button
                onClick={() => onStartFocus('50m Deep Work', 50)}
                className="py-2.5 px-4 text-xs font-bold rounded-xl bg-navy-hover hover:bg-slate-700 text-slate-200 border border-navy-border transition"
              >
                50m Deep Work
              </button>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Custom Duration</span>
                <span className="font-bold text-cyan-400">{customDuration} minutes</span>
              </div>
              <input
                type="range"
                min="5"
                max="120"
                step="5"
                value={customDuration}
                onChange={e => setCustomDuration(parseInt(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <button
              onClick={() => onStartFocus('Custom Focus', customDuration)}
              className="w-full py-3 text-sm font-bold rounded-xl bg-cyan-500 text-navy-dark hover:bg-cyan-400 flex items-center justify-center gap-2 transition shadow-lg shadow-cyan-500/20"
            >
              <Play className="w-4 h-4 fill-current" />
              Start Focus Session
            </button>
          </div>
        )}
      </div>

      {/* Focus Analytics Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-navy-card border border-navy-border text-center">
          <span className="text-[11px] font-semibold text-slate-400">Total Focus</span>
          <div className="text-xl font-black text-cyan-400 mt-1">{metrics.totalFocusMinutes}m</div>
        </div>
        <div className="p-4 rounded-xl bg-navy-card border border-navy-border text-center">
          <span className="text-[11px] font-semibold text-slate-400">Completed</span>
          <div className="text-xl font-black text-emerald-400 mt-1">{metrics.completedSessionsCount}</div>
        </div>
        <div className="p-4 rounded-xl bg-navy-card border border-navy-border text-center">
          <span className="text-[11px] font-semibold text-slate-400">Deflected</span>
          <div className="text-xl font-black text-indigo-400 mt-1">{metrics.estimatedInterruptionsDeflected}</div>
        </div>
      </div>

      {/* Platform Transparency Notice */}
      <div className="p-4 rounded-xl bg-navy-surface border border-navy-border flex items-start gap-3">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400 leading-relaxed">
          <strong>Technical Integrity Notice:</strong> FocusShield AI works within Android operating system permissions. It buffers notifications into your in-app Attention Airlock and issues quiet digests. It does not falsely claim to mute system phone calls or override low-level OS audio drivers.
        </p>
      </div>
    </div>
  );
};
