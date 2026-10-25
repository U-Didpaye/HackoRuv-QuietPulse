import React from 'react';
import { ShieldCheck, Lock, EyeOff, ServerOff, Database, RotateCcw, Trash2 } from 'lucide-react';

interface PrivacyPageProps {
  onResetLearning: () => void;
  onClearHistory: () => void;
  feedbackRecordsCount: number;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({
  onResetLearning,
  onClearHistory,
  feedbackRecordsCount
}) => {
  return (
    <div className="space-y-6 max-w-3xl mx-auto py-4">
      <div>
        <h2 className="text-xl font-bold text-v-text tracking-wide uppercase font-mono">
          Privacy &amp; Data Governance
        </h2>
        <p className="text-xs text-v-text-muted mt-0.5 font-sans">
          QuietPulse is engineered with zero-cloud data collection principles.
        </p>
      </div>

      {/* Trust Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-v-surface border border-v-border flex items-start gap-3.5">
          <ServerOff className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-v-text uppercase font-mono">100% Offline Core</h4>
            <p className="text-xs text-v-text-muted mt-1 leading-relaxed font-sans">
              Notification parsing, scoring heuristics, and rolling burst analysis execute strictly in local memory.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-v-surface border border-v-border flex items-start gap-3.5">
          <EyeOff className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-v-text uppercase font-mono">Zero External LLMs</h4>
            <p className="text-xs text-v-text-muted mt-1 leading-relaxed font-sans">
              Personal messages are never transmitted to third-party cloud models or remote behavioral aggregators.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-v-surface border border-v-border flex items-start gap-3.5">
          <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-v-text uppercase font-mono">Minimal Permissions</h4>
            <p className="text-xs text-v-text-muted mt-1 leading-relaxed font-sans">
              Zero requests for SMS, Contacts, Phone Logs, GPS Location, or Android Accessibility privileges.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-v-surface border border-v-border flex items-start gap-3.5">
          <Database className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-v-text uppercase font-mono">Bounded Local Adaptation</h4>
            <p className="text-xs text-v-text-muted mt-1 leading-relaxed font-sans">
              User calibrations adjust bounded package weights locally without syncing behavioral profiles to servers.
            </p>
          </div>
        </div>
      </div>

      {/* Local Data Management */}
      <div className="p-6 rounded-2xl bg-v-surface border border-v-border space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-v-text">
          Local Data Controls
        </h3>
        <p className="text-xs text-v-text-muted font-sans">
          You retain sovereign ownership of all data generated during focus sessions.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onResetLearning}
            className="flex-1 py-2.5 px-4 text-xs font-mono font-bold rounded-xl bg-v-secondary hover:bg-v-elevated text-v-text border border-v-border flex items-center justify-center gap-2 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Calibrated Weights ({feedbackRecordsCount} records)
          </button>
          <button
            onClick={onClearHistory}
            className="flex-1 py-2.5 px-4 text-xs font-mono font-bold rounded-xl bg-v-secondary hover:bg-v-elevated text-rose-400 border border-v-border flex items-center justify-center gap-2 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Wipe Queue &amp; Local Telemetry
          </button>
        </div>
      </div>
    </div>
  );
};
