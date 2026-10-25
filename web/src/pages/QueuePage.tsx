import React, { useState } from 'react';
import { Search, CheckCircle2, Trash2, Check, X, FileText, Filter } from 'lucide-react';
import { UiNotificationItem, UserFeedbackType } from '../types';

interface QueuePageProps {
  items: UiNotificationItem[];
  onMarkReviewed: (id: string) => void;
  onDismiss: (id: string) => void;
  onReviewAll: () => void;
  onClearQueue: () => void;
  onFeedback: (id: string, type: UserFeedbackType) => void;
}

export const QueuePage: React.FC<QueuePageProps> = ({
  items,
  onMarkReviewed,
  onDismiss,
  onReviewAll,
  onClearQueue,
  onFeedback
}) => {
  const [filter, setFilter] = useState<'ALL' | 'URGENT' | 'IMPORTANT' | 'BATCH' | 'LOW_PRIORITY'>('ALL');
  const [search, setSearch] = useState('');
  const [showDigest, setShowDigest] = useState(false);

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

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-4">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-v-text tracking-wide uppercase font-mono">
            Attention Airlock &amp; Queue
          </h2>
          <p className="text-xs text-v-text-muted mt-0.5 font-sans">
            Triaged notifications held safely without cognitive interruption.
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
            placeholder="Search queued notifications..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-v-surface border border-v-border rounded-xl text-v-text placeholder-v-text-muted focus:outline-none focus:border-v-accent transition"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['ALL', 'URGENT', 'IMPORTANT', 'BATCH', 'LOW_PRIORITY'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition shrink-0 ${
                filter === cat
                  ? 'bg-v-text text-v-bg shadow-sm'
                  : 'bg-v-surface text-v-text-muted hover:text-v-text border border-v-border'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Queue Items List */}
      {filtered.length === 0 ? (
        <div className="p-12 rounded-2xl bg-v-surface border border-dashed border-v-border text-center">
          <CheckCircle2 className="w-10 h-10 text-v-accent mx-auto mb-2" />
          <p className="text-base font-bold text-v-text font-mono uppercase">Queue is Clear</p>
          <p className="text-xs text-v-text-muted mt-1 font-sans">
            No notifications match your current filter. Your attention is fully protected.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => (
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
                    {item.event.sourceType === 'SIMULATED' && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-v-secondary text-v-text-muted border border-v-border">
                        SIMULATED
                      </span>
                    )}
                    <span className="text-[11px] font-mono text-v-text-muted">
                      {new Date(item.event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-v-text">{item.event.title}</h4>
                  <p className="text-xs text-v-text-muted mt-0.5">{item.event.text}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-2.5 py-0.5 text-[11px] font-mono font-bold rounded-lg border ${
                      item.result.category === 'URGENT'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : item.result.category === 'IMPORTANT'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : item.result.category === 'BATCH'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        : 'bg-v-secondary text-v-text-muted border-v-border'
                    }`}
                  >
                    {item.result.category}
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
                      title="Dismiss from queue"
                      className="p-1 rounded text-v-text-muted hover:text-rose-400 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Explainable AI Strip */}
              <div className="mt-3 pt-2.5 border-t border-v-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="text-[11px] font-mono text-v-text">
                  <span className="text-v-text-muted">Reasoning: </span>
                  {item.result.explanation}
                </div>
                {/* Local Learning Feedback Buttons */}
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="text-v-text-muted">Calibrate:</span>
                  <button
                    onClick={() => onFeedback(item.event.id, 'SHOULD_BE_URGENT')}
                    className="px-2 py-0.5 rounded bg-v-secondary hover:bg-v-elevated text-v-text border border-v-border transition"
                  >
                    Was Urgent
                  </button>
                  <button
                    onClick={() => onFeedback(item.event.id, 'SAFE_TO_BATCH')}
                    className="px-2 py-0.5 rounded bg-v-secondary hover:bg-v-elevated text-v-text border border-v-border transition"
                  >
                    Batch It
                  </button>
                  <button
                    onClick={() => onFeedback(item.event.id, 'NOT_RELEVANT')}
                    className="px-2 py-0.5 rounded bg-v-secondary hover:bg-v-elevated text-v-text-muted border border-v-border transition"
                  >
                    Spam
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Smart Digest Modal */}
      {showDigest && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl bg-v-surface border border-v-border shadow-2xl animate-reveal">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-v-accent" />
                <h3 className="text-base font-bold text-v-text font-mono uppercase">Attention Digest</h3>
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
