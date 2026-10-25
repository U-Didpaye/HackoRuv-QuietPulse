import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Trash2,
  Check,
  X,
  FileText,
  AlertTriangle,
  Flame,
  ShieldCheck,
  CheckCheck
} from 'lucide-react';
import { UiNotificationItem, UserFeedbackType, ClassificationCategory } from '../types';

interface QueuePageProps {
  items: UiNotificationItem[];
  onMarkReviewed: (id: string) => void;
  onDismiss: (id: string) => void;
  onReviewAll: () => void;
  onClearQueue: () => void;
  onFeedback: (id: string, type: UserFeedbackType) => void;
  onUpdateCategory: (id: string, newCategory: ClassificationCategory, feedbackType: 'WAS_URGENT' | 'BATCHED' | 'SPAM') => void;
}

export const QueuePage: React.FC<QueuePageProps> = ({
  items,
  onMarkReviewed,
  onDismiss,
  onReviewAll,
  onClearQueue,
  onFeedback,
  onUpdateCategory
}) => {
  const [filter, setFilter] = useState<'ALL' | 'URGENT' | 'IMPORTANT' | 'BATCH' | 'LOW_PRIORITY' | 'SPAM'>('ALL');
  const [search, setSearch] = useState('');
  const [showDigest, setShowDigest] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const filtered = items.filter(item => {
    const matchesCat = filter === 'ALL' || item.result.category === filter;
    const matchesSearch =
      item.event.appName.toLowerCase().includes(search.toLowerCase()) ||
      item.event.title.toLowerCase().includes(search.toLowerCase()) ||
      item.event.text.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const nonUrgent = items.filter(i => i.result.category === 'BATCH' || i.result.category === 'LOW_PRIORITY');
  const appCounts: Record<string, number> = {};
  nonUrgent.forEach(i => {
    appCounts[i.event.appName] = (appCounts[i.event.appName] || 0) + 1;
  });

  const handleAction = async (id: string, targetCategory: ClassificationCategory, feedbackType: 'WAS_URGENT' | 'BATCHED' | 'SPAM') => {
    if (processingId === id) return;
    setProcessingId(id);

    try {
      let fType: UserFeedbackType = 'SHOULD_BE_URGENT';
      if (feedbackType === 'BATCHED') fType = 'SAFE_TO_BATCH';
      else if (feedbackType === 'SPAM') fType = 'SPAM';

      // 1. Record feedback in learning engine
      onFeedback(id, fType);

      // 2. Update category & card state in parent (and persist)
      onUpdateCategory(id, targetCategory, feedbackType);
    } finally {
      setTimeout(() => {
        setProcessingId(null);
      }, 250);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-4">
      {/* Top Header & Actions per Section 6 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-v-text tracking-wide uppercase font-mono">
              FlowQueue
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-v-secondary border border-v-border text-v-accent">
              {items.length} QUEUED
            </span>
          </div>
          <p className="text-xs text-v-text-muted mt-0.5 font-sans">
            Triaged notifications organized safely into batch digests without interrupting your cognitive focus.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDigest(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold rounded-lg bg-v-surface text-v-text border border-v-border hover:bg-v-secondary transition"
          >
            <FileText className="w-3.5 h-3.5" />
            Digest Summary
          </button>
          <button
            onClick={onReviewAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold rounded-lg bg-v-secondary text-v-text border border-v-border hover:bg-v-elevated transition"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Review All
          </button>
          <button
            onClick={onClearQueue}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold rounded-lg bg-v-surface text-v-text-muted border border-v-border hover:text-v-text hover:bg-v-secondary transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-v-text-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search FlowQueue notifications..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-v-surface border border-v-border rounded-xl text-v-text placeholder-v-text-muted focus:outline-none focus:border-v-accent transition"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['ALL', 'URGENT', 'IMPORTANT', 'BATCH', 'LOW_PRIORITY', 'SPAM'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition shrink-0 ${
                filter === cat
                  ? 'bg-v-text text-v-bg shadow-sm'
                  : 'bg-v-surface text-v-text-muted hover:text-v-text border border-v-border'
              }`}
            >
              {cat === 'ALL' ? 'ALL QUEUE' : cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* FlowQueue Items List */}
      {filtered.length === 0 ? (
        <div className="p-12 rounded-2xl bg-v-surface border border-dashed border-v-border text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
          <p className="text-base font-bold text-v-text font-mono uppercase">FlowQueue is Clear</p>
          <p className="text-xs text-v-text-muted mt-1 font-sans max-w-md mx-auto">
            No notifications match your current filter ({filter.replace('_', ' ')}). Triaged alerts buffer here safely without triggering lock-screen distractions.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => {
            const isProcessing = processingId === item.event.id;
            const currentCat = item.result.category;
            const feedback = item.userFeedback;

            return (
              <div
                key={item.event.id}
                className={`p-4 rounded-xl border transition ${
                  item.isReviewed
                    ? 'bg-v-secondary/30 border-v-border/40 opacity-60'
                    : 'bg-v-surface border-v-border hover:border-v-accent/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-v-text">{item.event.appName}</span>
                      {item.event.sourceType === 'SIMULATED' ? (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-v-secondary text-v-text-muted border border-v-border">
                          SIMULATED
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          LIVE ANDROID
                        </span>
                      )}
                      <span className="text-[11px] font-mono text-v-text-muted">
                        {new Date(item.event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {feedback && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-v-elevated text-cyan-400 border border-v-border flex items-center gap-1">
                          <CheckCheck className="w-3 h-3" />
                          <span>Feedback Saved</span>
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-v-text">{item.event.title}</h4>
                    <p className="text-xs text-v-text-muted mt-0.5">{item.event.text}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-2.5 py-0.5 text-[11px] font-mono font-bold rounded-lg border ${
                        currentCat === 'URGENT'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : currentCat === 'IMPORTANT'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : currentCat === 'BATCH'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                          : currentCat === 'SPAM'
                          ? 'bg-neutral-800 text-rose-400 border-neutral-700'
                          : 'bg-v-secondary text-v-text-muted border-v-border'
                      }`}
                    >
                      {currentCat}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onMarkReviewed(item.event.id)}
                        title="Mark Reviewed"
                        className="p-1 rounded text-v-text-muted hover:text-v-text transition"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDismiss(item.event.id)}
                        title="Dismiss from FlowQueue"
                        className="p-1 rounded text-v-text-muted hover:text-rose-400 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Explainable Reasoning Strip */}
                <div className="mt-3 pt-2.5 border-t border-v-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="text-[11px] font-mono text-v-text">
                    <span className="text-v-text-muted">Reasoning: </span>
                    {item.result.explanation}
                  </div>

                  {/* FlowQueue Notification Action Controls (Section 6.2) */}
                  <div className="flex items-center gap-1.5 text-[10px] font-mono">
                    <span className="text-v-text-muted">Calibrate:</span>

                    {/* Was Urgent Button */}
                    <button
                      disabled={isProcessing || feedback === 'WAS_URGENT'}
                      onClick={() => handleAction(item.event.id, 'URGENT', 'WAS_URGENT')}
                      className={`px-2.5 py-1 rounded transition flex items-center gap-1 ${
                        feedback === 'WAS_URGENT'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 cursor-default'
                          : 'bg-v-secondary hover:bg-v-elevated text-v-text border border-v-border'
                      }`}
                      title="Mark that this notification should have been classified as urgent"
                    >
                      {feedback === 'WAS_URGENT' && <Check className="w-3 h-3 text-rose-400" />}
                      <span>Was Urgent</span>
                    </button>

                    {/* Batch It Button */}
                    <button
                      disabled={isProcessing || feedback === 'BATCHED'}
                      onClick={() => handleAction(item.event.id, 'BATCH', 'BATCHED')}
                      className={`px-2.5 py-1 rounded transition flex items-center gap-1 ${
                        feedback === 'BATCHED'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 cursor-default'
                          : 'bg-v-secondary hover:bg-v-elevated text-v-text border border-v-border'
                      }`}
                      title="Assign this notification to batch digest view"
                    >
                      {feedback === 'BATCHED' && <Check className="w-3 h-3 text-blue-400" />}
                      <span>Batch It</span>
                    </button>

                    {/* Spam Button */}
                    <button
                      disabled={isProcessing || feedback === 'SPAM'}
                      onClick={() => handleAction(item.event.id, 'SPAM', 'SPAM')}
                      className={`px-2.5 py-1 rounded transition flex items-center gap-1 ${
                        feedback === 'SPAM'
                          ? 'bg-neutral-800 text-rose-300 border border-neutral-700 cursor-default'
                          : 'bg-v-secondary hover:bg-v-elevated text-v-text-muted border border-v-border hover:text-rose-400'
                      }`}
                      title="Mark as unwanted marketing or spam"
                    >
                      {feedback === 'SPAM' && <Check className="w-3 h-3 text-rose-400" />}
                      <span>Spam</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Smart Digest Modal */}
      {showDigest && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl bg-v-surface border border-v-border shadow-2xl animate-reveal">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-v-accent" />
                <h3 className="text-base font-bold text-v-text font-mono uppercase">FlowQueue Digest</h3>
              </div>
              <button onClick={() => setShowDigest(false)} className="text-v-text-muted hover:text-v-text">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-v-text-muted mb-4 font-sans leading-relaxed">
              <strong>{nonUrgent.length} non-urgent notifications</strong> were buffered quietly during your focus hours. No message contents were exposed on lock screens.
            </p>

            <div className="space-y-2 p-3 rounded-xl bg-v-secondary border border-v-border mb-4 font-sans">
              <h5 className="text-[11px] font-mono font-bold text-v-text-muted uppercase tracking-wider">
                Breakdown By Application
              </h5>
              {Object.keys(appCounts).length === 0 ? (
                <p className="text-xs text-v-text-muted">No non-urgent notifications currently held.</p>
              ) : (
                Object.entries(appCounts).map(([app, c]) => (
                  <div key={app} className="flex justify-between text-xs">
                    <span className="text-v-text">{app}</span>
                    <span className="font-mono font-bold text-v-accent">{c} alerts</span>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setShowDigest(false)}
              className="w-full py-2.5 text-xs font-mono font-bold rounded-xl bg-v-text text-v-bg hover:opacity-90 transition"
            >
              Done Reading Digest
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
