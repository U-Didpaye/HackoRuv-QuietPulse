import React, { useState } from 'react';
import { Play, RotateCcw, FlaskConical, CheckCircle2, AlertCircle, Sparkles, Zap, Flame, ShieldAlert } from 'lucide-react';
import { DEMO_SCENARIOS, DemoScenario } from '../intelligence/demoScenarios';

interface DemoLabPageProps {
  onRunScenario: (scenario: DemoScenario) => void;
  onResetDemo: () => void;
  simulatedCount: number;
}

export const DemoLabPage: React.FC<DemoLabPageProps> = ({
  onRunScenario,
  onResetDemo,
  simulatedCount
}) => {
  const [runningId, setRunningId] = useState<string | null>(null);

  const handleRun = (scenario: DemoScenario) => {
    setRunningId(scenario.id);
    onRunScenario(scenario);
    setTimeout(() => {
      setRunningId(null);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-navy-card via-indigo-950/40 to-navy-card border border-navy-border shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Zap className="w-4 h-4 fill-current" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-wide">Judge Demonstration Lab</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Trigger deterministic simulated notification storms directly through the live AI heuristics & burst detection pipeline.
            </p>
          </div>
          <button
            onClick={onResetDemo}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-navy-hover hover:bg-slate-700 text-slate-300 border border-navy-border transition shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Demo ({simulatedCount} simulated events)
          </button>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DEMO_SCENARIOS.map(scen => {
          const isRunning = runningId === scen.id;
          return (
            <div
              key={scen.id}
              className="p-5 rounded-2xl bg-navy-card border border-navy-border hover:border-slate-600 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-white">{scen.title}</h4>
                  {scen.id === 'storm' ? (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                      <Flame className="w-3 h-3" /> Burst Test
                    </span>
                  ) : scen.id === 'critical' ? (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      Bypass Test
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      Deterministic
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {scen.description}
                </p>
              </div>

              <button
                onClick={() => handleRun(scen)}
                disabled={isRunning}
                className={`w-full py-2.5 px-4 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition ${
                  isRunning
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                }`}
              >
                {isRunning ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
                    Simulating Traffic...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Simulate Scenario
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Compliance / Offline Integrity Note */}
      <div className="p-4 rounded-xl bg-navy-surface border border-navy-border text-xs text-slate-400 flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-300">Hackathon Compliance & Attribution:</strong> All simulated test events are transparently tagged with <span className="text-cyan-400 font-mono">[SIMULATED]</span> markers. Simulated items feed into the identical burst detectors, classifier scoring pipeline, and local weight adjustments as live notifications.
        </div>
      </div>
    </div>
  );
};
