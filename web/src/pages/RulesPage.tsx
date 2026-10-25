import React, { useState } from 'react';
import {
  Sliders,
  Plus,
  Trash2,
  Shield,
  Briefcase,
  Home,
  RotateCcw,
  Check,
  Clock,
  UserCheck,
  AlertOctagon,
  Sparkles
} from 'lucide-react';
import { UserRule, ContextMode, PersonalizedSettings } from '../types';

interface RulesPageProps {
  rules: Record<string, UserRule>;
  onAddRule: (rule: UserRule) => void;
  onRemoveRule: (pkg: string) => void;
  activeContextMode: ContextMode;
  onChangeContextMode: (mode: ContextMode) => void;
  personalizedSettings: PersonalizedSettings;
  onUpdatePersonalizedSettings: (settings: PersonalizedSettings) => void;
  onResetPersonalizedSettings: () => void;
}

export const RulesPage: React.FC<RulesPageProps> = ({
  rules,
  onAddRule,
  onRemoveRule,
  activeContextMode,
  onChangeContextMode,
  personalizedSettings,
  onUpdatePersonalizedSettings,
  onResetPersonalizedSettings
}) => {
  const [appName, setAppName] = useState('');
  const [pkgName, setPkgName] = useState('');
  const [priority, setPriority] = useState<'ALWAYS_URGENT' | 'LOW_PRIORITY' | 'SPAM'>('ALWAYS_URGENT');

  // Personalized Mode Local Form State
  const [vipAppsText, setVipAppsText] = useState(personalizedSettings.vipApps.join(', '));
  const [vipContactsText, setVipContactsText] = useState(personalizedSettings.vipContacts.join(', '));
  const [urgentKeywordsText, setUrgentKeywordsText] = useState(personalizedSettings.urgentKeywords.join(', '));
  const [spamKeywordsText, setSpamKeywordsText] = useState(personalizedSettings.spamKeywords.join(', '));
  const [urgencyThreshold, setUrgencyThreshold] = useState(personalizedSettings.urgencyThreshold);
  const [relevanceThreshold, setRelevanceThreshold] = useState(personalizedSettings.relevanceThreshold);
  const [quietStart, setQuietStart] = useState(personalizedSettings.quietHoursStart);
  const [quietEnd, setQuietEnd] = useState(personalizedSettings.quietHoursEnd);
  const [saveConfirmation, setSaveConfirmation] = useState(false);

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

  const handleSavePersonalized = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: PersonalizedSettings = {
      ...personalizedSettings,
      vipApps: vipAppsText.split(',').map(s => s.trim()).filter(Boolean),
      vipContacts: vipContactsText.split(',').map(s => s.trim()).filter(Boolean),
      urgentKeywords: urgentKeywordsText.split(',').map(s => s.trim()).filter(Boolean),
      spamKeywords: spamKeywordsText.split(',').map(s => s.trim()).filter(Boolean),
      urgencyThreshold: Number(urgencyThreshold),
      relevanceThreshold: Number(relevanceThreshold),
      quietHoursStart: quietStart,
      quietHoursEnd: quietEnd
    };

    onUpdatePersonalizedSettings(updated);
    setSaveConfirmation(true);
    setTimeout(() => setSaveConfirmation(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-4">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-v-text tracking-wide uppercase font-mono">
            Context Modes &amp; Policy Rules
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-v-secondary border border-v-border text-cyan-400">
            {activeContextMode} ACTIVE
          </span>
        </div>
        <p className="text-xs text-v-text-muted mt-0.5 font-sans">
          Select between three approved modes (Office, Home, Personalized Mode) and define explicit app overrides.
        </p>
      </div>

      {/* Mode Switcher Cards (Section 8: Exactly 3 Approved Modes) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Office Mode Card */}
        <div
          onClick={() => onChangeContextMode('OFFICE')}
          className={`p-5 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
            activeContextMode === 'OFFICE'
              ? 'bg-v-surface border-cyan-400/80 shadow-lg ring-1 ring-cyan-400/40'
              : 'bg-v-surface/60 border-v-border hover:border-v-border/80'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-v-secondary border border-v-border flex items-center justify-center text-cyan-400">
                <Briefcase className="w-4 h-4" />
              </div>
              {activeContextMode === 'OFFICE' && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 uppercase">
                  Active
                </span>
              )}
            </div>
            <h3 className="text-sm font-bold text-v-text uppercase font-mono">1. Office Mode</h3>
            <p className="text-xs text-v-text-muted mt-2 leading-relaxed font-sans">
              Prioritizes work tools (Slack, Teams, Outlook, Zoom, Jira) and elevates critical incidents. Non-urgent social alerts are buffered into FlowQueue.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-v-border/60 text-[10px] font-mono text-v-accent">
            DEFAULT: WORK APPS HIGHER • SOCIAL BATCHED
          </div>
        </div>

        {/* Home Mode Card */}
        <div
          onClick={() => onChangeContextMode('HOME')}
          className={`p-5 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
            activeContextMode === 'HOME'
              ? 'bg-v-surface border-cyan-400/80 shadow-lg ring-1 ring-cyan-400/40'
              : 'bg-v-surface/60 border-v-border hover:border-v-border/80'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-v-secondary border border-v-border flex items-center justify-center text-cyan-400">
                <Home className="w-4 h-4" />
              </div>
              {activeContextMode === 'HOME' && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 uppercase">
                  Active
                </span>
              )}
            </div>
            <h3 className="text-sm font-bold text-v-text uppercase font-mono">2. Home Mode</h3>
            <p className="text-xs text-v-text-muted mt-2 leading-relaxed font-sans">
              Prioritizes personal communications (Calls, Family, WhatsApp, Deliveries). Routine workplace alerts and marketing spam are deferred.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-v-border/60 text-[10px] font-mono text-v-accent">
            DEFAULT: PERSONAL APPS HIGHER • WORK BATCHED
          </div>
        </div>

        {/* Personalized Mode Card */}
        <div
          onClick={() => onChangeContextMode('PERSONALIZED')}
          className={`p-5 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
            activeContextMode === 'PERSONALIZED'
              ? 'bg-v-surface border-cyan-400/80 shadow-lg ring-1 ring-cyan-400/40'
              : 'bg-v-surface/60 border-v-border hover:border-v-border/80'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-v-secondary border border-v-border flex items-center justify-center text-cyan-400">
                <Sliders className="w-4 h-4" />
              </div>
              {activeContextMode === 'PERSONALIZED' && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 uppercase">
                  Active
                </span>
              )}
            </div>
            <h3 className="text-sm font-bold text-v-text uppercase font-mono">3. Personalized Mode</h3>
            <p className="text-xs text-v-text-muted mt-2 leading-relaxed font-sans">
              Genuinely customizable heuristic engine. Tune VIP apps, custom urgent/spam tokens, contact exceptions, and urgency sensitivity thresholds.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-v-border/60 text-[10px] font-mono text-v-accent">
            CUSTOMIZABLE: TUNABLE THRESHOLDS &amp; TOKENS
          </div>
        </div>
      </div>

      {/* Personalized Mode Detailed Configurator */}
      {activeContextMode === 'PERSONALIZED' && (
        <form onSubmit={handleSavePersonalized} className="p-6 rounded-2xl bg-v-surface border border-cyan-400/40 shadow-xl space-y-5 animate-reveal">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-v-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-v-text uppercase font-mono">
                  Personalized Mode Configuration
                </h3>
              </div>
              <p className="text-xs text-v-text-muted mt-0.5 font-sans">
                Fine-tune priority rules, exceptions, and sensitivity thresholds. Saved changes immediately influence triage.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onResetPersonalizedSettings();
                setVipAppsText('Slack, WhatsApp, Phone');
                setVipContactsText('Family, Lead, Mom, Boss');
                setUrgentKeywordsText('otp, emergency, critical, hospital, urgent, code');
                setSpamKeywordsText('sale, 50% off, win, cashback, jackpot, promo');
                setUrgencyThreshold(0.72);
                setRelevanceThreshold(0.62);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold rounded-lg bg-v-secondary border border-v-border text-v-text hover:bg-v-elevated transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-mono text-v-text font-bold block mb-1 uppercase">
                VIP Applications (Always Elevated)
              </label>
              <input
                type="text"
                value={vipAppsText}
                onChange={e => setVipAppsText(e.target.value)}
                placeholder="Comma-separated: Slack, WhatsApp, Dial, Phone..."
                className="w-full px-3.5 py-2 text-xs bg-v-secondary border border-v-border rounded-xl text-v-text font-mono focus:outline-none focus:border-cyan-400"
              />
              <span className="text-[10px] text-v-text-muted font-sans block mt-1">
                Notifications from these packages receive a +0.40 relevance boost.
              </span>
            </div>

            <div>
              <label className="text-[11px] font-mono text-v-text font-bold block mb-1 uppercase">
                VIP Contacts &amp; Senders
              </label>
              <input
                type="text"
                value={vipContactsText}
                onChange={e => setVipContactsText(e.target.value)}
                placeholder="Comma-separated: Mom, Team Lead, Manager, Dr. Smith..."
                className="w-full px-3.5 py-2 text-xs bg-v-secondary border border-v-border rounded-xl text-v-text font-mono focus:outline-none focus:border-cyan-400"
              />
              <span className="text-[10px] text-v-text-muted font-sans block mt-1">
                Messages from these contact labels bypass silent digests.
              </span>
            </div>

            <div>
              <label className="text-[11px] font-mono text-v-text font-bold block mb-1 uppercase">
                Custom Urgent Keywords
              </label>
              <input
                type="text"
                value={urgentKeywordsText}
                onChange={e => setUrgentKeywordsText(e.target.value)}
                placeholder="otp, security, server down, urgent, blocker..."
                className="w-full px-3.5 py-2 text-xs bg-v-secondary border border-v-border rounded-xl text-v-text font-mono focus:outline-none focus:border-cyan-400"
              />
              <span className="text-[10px] text-v-text-muted font-sans block mt-1">
                Presence of these tokens triggers urgent pass-through.
              </span>
            </div>

            <div>
              <label className="text-[11px] font-mono text-v-text font-bold block mb-1 uppercase">
                Custom Spam / Dark Pattern Tokens
              </label>
              <input
                type="text"
                value={spamKeywordsText}
                onChange={e => setSpamKeywordsText(e.target.value)}
                placeholder="flash sale, limited offer, coins, discount..."
                className="w-full px-3.5 py-2 text-xs bg-v-secondary border border-v-border rounded-xl text-v-text font-mono focus:outline-none focus:border-cyan-400"
              />
              <span className="text-[10px] text-v-text-muted font-sans block mt-1">
                Matches are quarantined into Spam with vibrations suppressed.
              </span>
            </div>
          </div>

          {/* Threshold Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-v-border">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-v-text font-bold">Urgency Threshold</span>
                <span className="text-cyan-400">{Math.round(urgencyThreshold * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.4"
                max="0.95"
                step="0.05"
                value={urgencyThreshold}
                onChange={e => setUrgencyThreshold(parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <span className="text-[10px] text-v-text-muted font-sans block mt-0.5">
                Notifications with urgency above this score cut through to sound/vibration.
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-v-text font-bold">Relevance Threshold</span>
                <span className="text-cyan-400">{Math.round(relevanceThreshold * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.3"
                max="0.9"
                step="0.05"
                value={relevanceThreshold}
                onChange={e => setRelevanceThreshold(parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <span className="text-[10px] text-v-text-muted font-sans block mt-0.5">
                Notifications with relevance above this score are prioritized in FlowQueue.
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-v-border">
            {saveConfirmation ? (
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-bold">
                <Check className="w-4 h-4" />
                Settings Saved &amp; Applied!
              </span>
            ) : (
              <span className="text-xs text-v-text-muted font-sans">
                Changes persist locally in your browser/device.
              </span>
            )}
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-v-text text-v-bg font-bold font-mono text-xs uppercase tracking-wider hover:opacity-90 transition shadow-md"
            >
              Save Personalized Rules
            </button>
          </div>
        </form>
      )}

      {/* Custom Application Overrides Form */}
      <form onSubmit={handleCreate} className="p-6 rounded-2xl bg-v-surface border border-v-border space-y-4 shadow-xl">
        <h3 className="text-xs font-mono font-bold text-v-text uppercase tracking-wider">
          Add Explicit Application Override
        </h3>
        <p className="text-xs text-v-text-muted font-sans -mt-2">
          Explicit application overrides strictly supersede all heuristic scoring algorithms in any mode.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-mono text-v-text-muted block mb-1 uppercase">Application Label</label>
            <input
              type="text"
              placeholder="e.g. Server Monitoring, VIP Direct"
              value={appName}
              onChange={e => setAppName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-v-secondary border border-v-border rounded-xl text-v-text placeholder-v-text-muted focus:outline-none focus:border-cyan-400 transition"
              required
            />
          </div>
          <div>
            <label className="text-[11px] font-mono text-v-text-muted block mb-1 uppercase">Package Name</label>
            <input
              type="text"
              placeholder="e.g. com.pagerduty.android"
              value={pkgName}
              onChange={e => setPkgName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-v-secondary border border-v-border rounded-xl text-v-text placeholder-v-text-muted focus:outline-none focus:border-cyan-400 transition font-mono"
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
              onClick={() => setPriority('LOW_PRIORITY')}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg border transition ${
                priority === 'LOW_PRIORITY'
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                  : 'bg-v-secondary text-v-text-muted border-v-border'
              }`}
            >
              Batch in FlowQueue
            </button>
            <button
              type="button"
              onClick={() => setPriority('SPAM')}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg border transition ${
                priority === 'SPAM'
                  ? 'bg-neutral-800 text-rose-400 border-neutral-700'
                  : 'bg-v-secondary text-v-text-muted border-v-border'
              }`}
            >
              Mark as Spam
            </button>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-mono font-bold rounded-xl bg-v-text text-v-bg hover:opacity-90 transition shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Save Override Rule</span>
          </button>
        </div>
      </form>

      {/* Rules List */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-v-text-muted">
          Active Override Rules ({Object.keys(rules).length})
        </h3>
        <div className="space-y-2">
          {Object.values(rules).map(rule => (
            <div
              key={rule.packageName}
              className="p-4 rounded-xl bg-v-surface border border-v-border flex items-center justify-between gap-3 shadow-sm"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-v-text">{rule.appName}</h4>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                      rule.priorityLevel === 'ALWAYS_URGENT'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        : rule.priorityLevel === 'SPAM'
                        ? 'bg-neutral-800 text-rose-400 border border-neutral-700'
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
                className="p-1.5 text-v-text-muted hover:text-rose-400 hover:bg-v-secondary rounded-lg transition"
                title="Remove rule"
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
