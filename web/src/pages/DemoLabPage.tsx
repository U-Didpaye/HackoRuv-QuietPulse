import React, { useState } from 'react';
import { Play, RotateCcw, FlaskConical, CheckCircle2, AlertCircle, Sparkles, Zap, Flame, ShieldAlert, Terminal } from 'lucide-react';
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
    <div className="space-y-6 max-w-7xl mx-auto py-4">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-v-surface border border-v-border shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-v-elevated border border-v-border flex items-center justify-center text-v-text">
                <Terminal className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-bold text-v-text tracking-wide uppercase font-mono">
                Simulation &amp; Stress Testing Lab
              </h2>
            </div>
            <p className="text-xs text-v-text-muted mt-1 font-sans">
              Inject deterministic synthetic notification patterns directly into the live heuristic classification &amp; burst detection pipeline.
            </p>
          </div>
          <button
            onClick={onResetDemo}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono font-semibold rounded-xl bg-v-secondary hover:bg-v-elevated text-v-text border border-v-border transition shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear Test Events ({simulatedCount} loaded)
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
              className="p-5 rounded-2xl bg-v-surface border border-v-border hover:border-v-accent/50 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-v-text">{scen.title}</h4>
                  {scen.id === 'storm' ? (
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                      <Flame className="w-3 h-3" /> Burst Test
                    </span>
                  ) : scen.id === 'critical' ? (
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      Bypass Test
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-v-secondary text-v-text-muted border border-v-border">
                      Deterministic
                    </span>
                  )}
                </div>
                <p className="text-xs text-v-text-muted leading-relaxed mb-4 font-sans">
                  {scen.description}
                </p>
              </div>

              <button
                onClick={() => handleRun(scen)}
                disabled={isRunning}
                className={`w-full py-2.5 px-4 text-xs font-mono font-bold rounded-xl flex items-center justify-center gap-2 transition ${
                  isRunning
                    ? 'bg-v-elevated text-v-accent border border-v-border'
                    : 'bg-v-text text-v-bg hover:opacity-90 shadow-md'
                }`}
              >
                {isRunning ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-v-accent" />
                    Injecting Scenario Stream...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Inject Test Events
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Attribution Note */}
      <div className="p-4 rounded-xl bg-v-surface/60 border border-v-border text-xs text-v-text-muted flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-v-accent shrink-0 mt-0.5" />
        <div className="font-sans">
          <strong className="text-v-text font-mono">System Integrity:</strong> All simulated test events are transparently marked with <span className="text-v-text font-mono font-bold">[SIMULATED]</span> badges to distinguish synthetic stress-tests from authentic device inputs.
        </div>
      </div>
    </div>
  );
};
