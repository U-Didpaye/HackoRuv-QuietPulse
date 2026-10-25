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
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">Privacy & Data Governance</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          FocusShield is designed with zero-cloud data collection principles.
        </p>
      </div>

      {/* Trust Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-navy-card border border-navy-border flex items-start gap-3">
          <ServerOff className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-white">100% Offline Core</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Notification parsing, scoring heuristics, and burst analysis run strictly in on-device local memory.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-navy-card border border-navy-border flex items-start gap-3">
          <EyeOff className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-white">No External AI / LLM Calls</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Your messages are never sent to third-party language models or remote telemetry collectors.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-navy-card border border-navy-border flex items-start gap-3">
          <Lock className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-white">Strict Minimal Permissions</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Zero requests for SMS, Contacts, Phone Logs, Location, or Accessibility Service abuse.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-navy-card border border-navy-border flex items-start gap-3">
          <Database className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-white">Bounded Local Learning</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              User corrections adjust bounded package weights locally without syncing behavioral profiles.
            </p>
          </div>
        </div>
      </div>

      {/* Local Data Management */}
      <div className="p-5 rounded-2xl bg-navy-card border border-navy-border space-y-3">
        <h3 className="text-sm font-bold text-white">Local Data Management</h3>
        <p className="text-xs text-slate-400">
          You maintain full ownership of all data generated during focus sessions.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onResetLearning}
            className="flex-1 py-2.5 px-4 text-xs font-bold rounded-xl bg-navy-surface hover:bg-slate-700 text-amber-400 border border-navy-border flex items-center justify-center gap-2 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Local Learning Weights ({feedbackRecordsCount} records)
          </button>
          <button
            onClick={onClearHistory}
            className="flex-1 py-2.5 px-4 text-xs font-bold rounded-xl bg-navy-surface hover:bg-rose-500/20 text-rose-400 border border-navy-border flex items-center justify-center gap-2 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Wipe Queue & Local Analytics
          </button>
        </div>
      </div>
    </div>
  );
};
