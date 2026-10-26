import React from 'react';
import { BarChart3, TrendingUp, ShieldCheck, Flame, Bell, Zap, Layers, Sparkles, Inbox } from 'lucide-react';
import { AnalyticsMetrics } from '../types';

interface InsightsPageProps {
  metrics: AnalyticsMetrics;
}

export const InsightsPage: React.FC<InsightsPageProps> = ({ metrics }) => {
  const total = metrics.totalNotificationsObserved;
  const hasData = total > 0;

  const urgentPct = hasData ? Math.round((metrics.urgentCount / total) * 100) : 0;
  const importantPct = hasData ? Math.round((metrics.importantCount / total) * 100) : 0;
  const batchedPct = hasData ? Math.round((metrics.batchedCount / total) * 100) : 0;
  const lowPct = hasData ? Math.round((metrics.lowPriorityCount / total) * 100) : 0;
  const spamPct = hasData ? Math.round(((metrics.spamCount || 0) / total) * 100) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-4">
      {/* Top Banner per Section 7: PulseInsights (No "Attention Telemetry" label) */}
      <div className="p-7 rounded-2xl bg-v-surface border border-v-border shadow-xl">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono tracking-widest text-v-accent uppercase">
            PULSEINSIGHTS // COGNITIVE ANALYTICS
          </span>
          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-v-secondary border border-v-border text-v-text-muted">
            REAL-TIME ACTIVITY
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mt-2">
          <h2 className="text-3xl sm:text-4xl font-black font-editorial text-v-text">
            {metrics.estimatedInterruptionsDeflected} Interruptions Deflected
          </h2>
          <span className="text-xs text-v-text-muted font-sans">
            (~{Math.round(metrics.estimatedInterruptionsDeflected * 2.5)} minutes of cognitive context-switching preserved)
          </span>
        </div>
        <p className="text-xs text-v-text-muted mt-2 font-sans max-w-2xl leading-relaxed">
          Calculated by measuring non-urgent notifications triaged to FlowQueue and silent batch digests instead of triggering active device vibrations.
        </p>
      </div>

      {/* Empty State vs Real Distribution */}
      {!hasData ? (
        <div className="p-12 rounded-2xl bg-v-surface border border-dashed border-v-border text-center">
          <BarChart3 className="w-10 h-10 text-v-text-muted mx-auto mb-3" />
          <h3 className="text-base font-bold text-v-text font-mono uppercase">
            No Notification Activity Recorded Yet
          </h3>
          <p className="text-xs text-v-text-muted mt-1 font-sans max-w-md mx-auto">
            Live analytics will populate automatically as incoming device notifications are intercepted or when you run simulations in the Demo Lab.
          </p>
        </div>
      ) : (
        <>
          {/* Category Breakdown Cards */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-v-text-muted">
              Cognitive Triage Distribution ({total} Total Events)
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Urgent */}
              <div className="p-4 rounded-xl bg-v-surface border border-v-border shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-rose-400">Urgent</span>
                  <div className="text-2xl font-black font-editorial text-v-text mt-1">{metrics.urgentCount}</div>
                </div>
                <div>
                  <div className="w-full bg-v-secondary rounded-full h-1.5 mt-3">
                    <div className="bg-rose-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${urgentPct}%` }} />
                  </div>
                  <span className="text-[10px] font-mono text-v-text-muted mt-1 block">{urgentPct}% of stream</span>
                </div>
              </div>

              {/* Important */}
              <div className="p-4 rounded-xl bg-v-surface border border-v-border shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-amber-400">Important</span>
                  <div className="text-2xl font-black font-editorial text-v-text mt-1">{metrics.importantCount}</div>
                </div>
                <div>
                  <div className="w-full bg-v-secondary rounded-full h-1.5 mt-3">
                    <div className="bg-amber-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${importantPct}%` }} />
                  </div>
                  <span className="text-[10px] font-mono text-v-text-muted mt-1 block">{importantPct}% of stream</span>
                </div>
              </div>

              {/* Batched */}
              <div className="p-4 rounded-xl bg-v-surface border border-v-border shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-blue-400">Batched</span>
                  <div className="text-2xl font-black font-editorial text-v-text mt-1">{metrics.batchedCount}</div>
                </div>
                <div>
                  <div className="w-full bg-v-secondary rounded-full h-1.5 mt-3">
                    <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${batchedPct}%` }} />
                  </div>
                  <span className="text-[10px] font-mono text-v-text-muted mt-1 block">{batchedPct}% of stream</span>
                </div>
              </div>

              {/* Low Priority */}
              <div className="p-4 rounded-xl bg-v-surface border border-v-border shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-v-text-muted">Low Priority</span>
                  <div className="text-2xl font-black font-editorial text-v-text mt-1">{metrics.lowPriorityCount}</div>
                </div>
                <div>
                  <div className="w-full bg-v-secondary rounded-full h-1.5 mt-3">
                    <div className="bg-v-accent h-1.5 rounded-full transition-all duration-300" style={{ width: `${lowPct}%` }} />
                  </div>
                  <span className="text-[10px] font-mono text-v-text-muted mt-1 block">{lowPct}% of stream</span>
                </div>
              </div>

              {/* Spam */}
              <div className="p-4 rounded-xl bg-v-surface border border-v-border shadow-sm flex flex-col justify-between col-span-2 lg:col-span-1">
                <div>
                  <span className="text-xs font-mono font-bold text-rose-500">Spam</span>
                  <div className="text-2xl font-black font-editorial text-v-text mt-1">{metrics.spamCount || 0}</div>
                </div>
                <div>
                  <div className="w-full bg-v-secondary rounded-full h-1.5 mt-3">
                    <div className="bg-rose-700 h-1.5 rounded-full transition-all duration-300" style={{ width: `${spamPct}%` }} />
                  </div>
                  <span className="text-[10px] font-mono text-v-text-muted mt-1 block">{spamPct}% of stream</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Telemetry Summary Register */}
      <div className="p-6 rounded-2xl bg-v-surface border border-v-border shadow-xl">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-v-text mb-4">
          PulseInsights Activity Metrics
        </h4>
        <div className="divide-y divide-v-border text-xs font-sans">
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-v-text-muted">Total Events Evaluated</span>
            <span className="font-mono font-bold text-v-text">{metrics.totalNotificationsObserved}</span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-v-text-muted">Notification Storms Detected</span>
            <span className={`font-mono font-bold ${metrics.burstsDetected > 0 ? 'text-rose-400' : 'text-v-text'}`}>
              {metrics.burstsDetected}
            </span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-v-text-muted">Total Deep Focus Minutes Logged</span>
            <span className="font-mono font-bold text-v-text">{metrics.totalFocusMinutes} mins</span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-v-text-muted">Completed Focus Sessions</span>
            <span className="font-mono font-bold text-v-text">{metrics.completedSessionsCount}</span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-v-text-muted">Local Feedback Calibrations</span>
            <span className="font-mono font-bold text-cyan-400">{metrics.userCorrectionCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
