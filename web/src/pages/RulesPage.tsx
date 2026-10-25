import React, { useState } from 'react';
import { Sliders, Plus, Trash2, Shield, BellRing, BellOff } from 'lucide-react';
import { UserRule } from '../types';

interface RulesPageProps {
  rules: Record<string, UserRule>;
  onAddRule: (rule: UserRule) => void;
  onRemoveRule: (pkg: string) => void;
}

export const RulesPage: React.FC<RulesPageProps> = ({
  rules,
  onAddRule,
  onRemoveRule
}) => {
  const [appName, setAppName] = useState('');
  const [pkgName, setPkgName] = useState('');
  const [priority, setPriority] = useState<'ALWAYS_URGENT' | 'NEVER_INTERRUPT'>('ALWAYS_URGENT');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appName.trim() || !pkgName.trim()) return;

    onAddRule({
      id: 'rule_' + Date.now(),
      appName: appName.trim(),
      packageName: pkgName.trim(),
      priorityLevel: priority,
      allowDuringFocus: priority === 'ALWAYS_URGENT'
    });

    setAppName('');
    setPkgName('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-4">
      <div>
        <h2 className="text-xl font-bold text-v-text tracking-wide uppercase font-mono">
          Context Profiles &amp; Rules
        </h2>
        <p className="text-xs text-v-text-muted mt-0.5 font-sans">
          Explicit user rules always supersede heuristic scoring algorithms.
        </p>
      </div>

      {/* Add New Rule Form */}
      <form onSubmit={handleCreate} className="p-6 rounded-2xl bg-v-surface border border-v-border space-y-4 shadow-xl">
        <h3 className="text-xs font-mono font-bold text-v-text uppercase tracking-wider">
          Add Custom Application Override
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-mono text-v-text-muted block mb-1 uppercase">Application Label</label>
            <input
              type="text"
              placeholder="e.g. VIP Messaging, Server Alerts"
              value={appName}
              onChange={e => setAppName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-v-secondary border border-v-border rounded-xl text-v-text placeholder-v-text-muted focus:outline-none focus:border-v-accent transition"
              required
            />
          </div>
          <div>
            <label className="text-[11px] font-mono text-v-text-muted block mb-1 uppercase">Package Name</label>
            <input
              type="text"
              placeholder="e.g. com.vip.team"
              value={pkgName}
              onChange={e => setPkgName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-v-secondary border border-v-border rounded-xl text-v-text placeholder-v-text-muted focus:outline-none focus:border-v-accent transition font-mono"
              required
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPriority('ALWAYS_URGENT')}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg border transition ${
                priority === 'ALWAYS_URGENT'
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  : 'bg-v-secondary text-v-text-muted border-v-border'
              }`}
            >
              VIP (Always Urgent)
            </button>
            <button
              type="button"
              onClick={() => setPriority('NEVER_INTERRUPT')}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg border transition ${
                priority === 'NEVER_INTERRUPT'
                  ? 'bg-v-elevated text-v-text border-v-border'
                  : 'bg-v-secondary text-v-text-muted border-v-border'
              }`}
            >
              Silent (Quarantine)
            </button>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-mono font-bold rounded-xl bg-v-text text-v-bg hover:opacity-90 transition shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            Save Override Rule
          </button>
        </div>
      </form>

      {/* Rules List */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-v-text-muted">
          Active Policy Rules
        </h3>
        <div className="space-y-2">
          {Object.values(rules).map(rule => (
            <div
              key={rule.packageName}
              className="p-4 rounded-xl bg-v-surface border border-v-border flex items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-v-text">{rule.appName}</h4>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                      rule.priorityLevel === 'ALWAYS_URGENT'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        : 'bg-v-secondary text-v-text-muted border border-v-border'
                    }`}
                  >
                    {rule.priorityLevel.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-[11px] font-mono text-v-text-muted mt-0.5">{rule.packageName}</p>
              </div>

              <button
                onClick={() => onRemoveRule(rule.packageName)}
                className="p-1.5 rounded-lg text-v-text-muted hover:text-rose-400 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
