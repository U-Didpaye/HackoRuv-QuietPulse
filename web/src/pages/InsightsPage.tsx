import React from 'react';
import { BarChart3, TrendingUp, ShieldCheck, Flame, Bell, Zap, Layers } from 'lucide-react';
import { AnalyticsMetrics } from '../types';

interface InsightsPageProps {
  metrics: AnalyticsMetrics;
}

export const InsightsPage: React.FC<InsightsPageProps> = ({ metrics }) => {
  const total = metrics.totalNotificationsObserved || 1;
  const urgentPct = Math.round((metrics.urgentCount / total) * 100);
  const importantPct = Math.round((metrics.importantCount / total) * 100);
  const batchedPct = Math.round((metrics.batchedCount / total) * 100);
  const lowPct = Math.round((metrics.lowPriorityCount / total) * 100);

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-4">
      {/* Top Banner per Section 8: PulseInsights */}
      <div className="p-7 rounded-2xl bg-v-surface border border-v-border shadow-xl">
        <span className="text-[10px] font-mono tracking-widest text-v-accent uppercase">
          PULSEINSIGHTS // ATTENTION TELEMETRY
        </span>
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

      {/* Category Breakdown Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-v-text-muted">
          Cognitive Triage Distribution
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-v-surface border border-v-border">
            <span className="text-xs font-mono font-bold text-rose-400">Urgent</span>
            <div className="text-2xl font-black font-editorial text-v-text mt-1">{metrics.urgentCount}</div>
            <div className="w-full bg-v-secondary rounded-full h-1.5 mt-2">
              <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: `${urgentPct}%` }} />
            </div>
            <span className="text-[10px] font-mono text-v-text-muted mt-1 block">{urgentPct}% of stream</span>
          </div>

          <div className="p-4 rounded-xl bg-v-surface border border-v-border">
            <span className="text-xs font-mono font-bold text-amber-400">Important</span>
            <div className="text-2xl font-black font-editorial text-v-text mt-1">{metrics.importantCount}</div>
            <div className="w-full bg-v-secondary rounded-full h-1.5 mt-2">
              <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${importantPct}%` }} />
            </div>
            <span className="text-[10px] font-mono text-v-text-muted mt-1 block">{importantPct}% of stream</span>
          </div>

          <div className="p-4 rounded-xl bg-v-surface border border-v-border">
            <span className="text-xs font-mono font-bold text-blue-400">Batched</span>
            <div className="text-2xl font-black font-editorial text-v-text mt-1">{metrics.batchedCount}</div>
            <div className="w-full bg-v-secondary rounded-full h-1.5 mt-2">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${batchedPct}%` }} />
            </div>
            <span className="text-[10px] font-mono text-v-text-muted mt-1 block">{batchedPct}% of stream</span>
          </div>

          <div className="p-4 rounded-xl bg-v-surface border border-v-border">
            <span className="text-xs font-mono font-bold text-v-text-muted">Low Priority</span>
            <div className="text-2xl font-black font-editorial text-v-text mt-1">{metrics.lowPriorityCount}</div>
            <div className="w-full bg-v-secondary rounded-full h-1.5 mt-2">
              <div className="bg-v-accent h-1.5 rounded-full" style={{ width: `${lowPct}%` }} />
            </div>
            <span className="text-[10px] font-mono text-v-text-muted mt-1 block">{lowPct}% of stream</span>
          </div>
        </div>
      </div>

      {/* Telemetry Summary Table */}
      <div className="p-6 rounded-2xl bg-v-surface border border-v-border">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-v-text mb-4">
          PulseInsights Telemetry Register
        </h4>
        <div className="divide-y divide-v-border text-xs font-sans">
          <div className="py-2.5 flex justify-between">
            <span className="text-v-text-muted">Total Events Evaluated</span>
            <span className="font-mono font-bold text-v-text">{metrics.totalNotificationsObserved}</span>
          </div>
          <div className="py-2.5 flex justify-between">
            <span className="text-v-text-muted">Notification Storms Detected</span>
            <span className="font-mono font-bold text-rose-400">{metrics.burstsDetected}</span>
          </div>
          <div className="py-2.5 flex justify-between">
            <span className="text-v-text-muted">Total Focus Minutes Logged</span>
            <span className="font-mono font-bold text-v-text">{metrics.totalFocusMinutes} mins</span>
          </div>
          <div className="py-2.5 flex justify-between">
            <span className="text-v-text-muted">Local Learning Calibrations</span>
            <span className="font-mono font-bold text-v-accent">{metrics.userCorrectionCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
