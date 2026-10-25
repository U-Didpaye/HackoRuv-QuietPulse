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
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">Personalization & Rules</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Explicit user rules always supersede generic heuristic scoring.
        </p>
      </div>

      {/* Add New Rule Form */}
      <form onSubmit={handleCreate} className="p-5 rounded-2xl bg-navy-card border border-navy-border space-y-4">
        <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Add Custom Application Override</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Friendly App Name</label>
            <input
              type="text"
              placeholder="e.g. Boss Chat, Hospital Alert"
              value={appName}
              onChange={e => setAppName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-navy-surface border border-navy-border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
              required
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Package Name</label>
            <input
              type="text"
              placeholder="e.g. com.vip.team"
              value={pkgName}
              onChange={e => setPkgName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-navy-surface border border-navy-border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
              required
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPriority('ALWAYS_URGENT')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                priority === 'ALWAYS_URGENT'
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  : 'bg-navy-surface text-slate-400 border-navy-border'
              }`}
            >
              VIP (Always Urgent)
            </button>
            <button
              type="button"
              onClick={() => setPriority('NEVER_INTERRUPT')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                priority === 'NEVER_INTERRUPT'
                  ? 'bg-slate-500/20 text-slate-300 border-slate-500/40'
                  : 'bg-navy-surface text-slate-400 border-navy-border'
              }`}
            >
              Silent (Never Interrupt)
            </button>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-cyan-500 text-navy-dark hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Rule
          </button>
        </div>
      </form>

      {/* Rules List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Active Policy Rules</h3>
        <div className="space-y-2">
          {Object.values(rules).map(rule => (
            <div
              key={rule.packageName}
              className="p-4 rounded-xl bg-navy-card border border-navy-border flex items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white">{rule.appName}</h4>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      rule.priorityLevel === 'ALWAYS_URGENT'
                        ? 'bg-rose-500/20 text-rose-400'
                        : 'bg-slate-500/20 text-slate-400'
                    }`}
                  >
                    {rule.priorityLevel.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{rule.packageName}</p>
              </div>

              <button
                onClick={() => onRemoveRule(rule.packageName)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
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
