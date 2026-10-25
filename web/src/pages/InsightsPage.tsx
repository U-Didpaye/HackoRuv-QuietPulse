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
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-navy-card via-slate-900 to-navy-card border border-navy-border">
        <span className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase">Attention ROI</span>
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mt-1">
          <h2 className="text-3xl font-black text-white">
            {metrics.estimatedInterruptionsDeflected} Interruptions Deflected
          </h2>
          <span className="text-xs text-slate-400">
            (~{Math.round(metrics.estimatedInterruptionsDeflected * 2.5)} minutes of cognitive context-switching saved)
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Calculated by measuring alerts triaged to Attention Airlock and background batch digest instead of disrupting your active focus state.
        </p>
      </div>

      {/* Category Breakdown Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Classification Triage Breakdown</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-navy-card border border-navy-border">
            <span className="text-xs font-semibold text-rose-400">Urgent</span>
            <div className="text-2xl font-black text-white mt-1">{metrics.urgentCount}</div>
            <div className="w-full bg-navy-surface rounded-full h-1.5 mt-2">
              <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: `${urgentPct}%` }} />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">{urgentPct}% of total</span>
          </div>

          <div className="p-4 rounded-xl bg-navy-card border border-navy-border">
            <span className="text-xs font-semibold text-amber-400">Important</span>
            <div className="text-2xl font-black text-white mt-1">{metrics.importantCount}</div>
            <div className="w-full bg-navy-surface rounded-full h-1.5 mt-2">
              <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${importantPct}%` }} />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">{importantPct}% of total</span>
          </div>

          <div className="p-4 rounded-xl bg-navy-card border border-navy-border">
            <span className="text-xs font-semibold text-blue-400">Batched</span>
            <div className="text-2xl font-black text-white mt-1">{metrics.batchedCount}</div>
            <div className="w-full bg-navy-surface rounded-full h-1.5 mt-2">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${batchedPct}%` }} />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">{batchedPct}% of total</span>
          </div>

          <div className="p-4 rounded-xl bg-navy-card border border-navy-border">
            <span className="text-xs font-semibold text-slate-400">Low Priority</span>
            <div className="text-2xl font-black text-white mt-1">{metrics.lowPriorityCount}</div>
            <div className="w-full bg-navy-surface rounded-full h-1.5 mt-2">
              <div className="bg-slate-500 h-1.5 rounded-full" style={{ width: `${lowPct}%` }} />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">{lowPct}% of total</span>
          </div>
        </div>
      </div>

      {/* Telemetry Summary Table */}
      <div className="p-5 rounded-2xl bg-navy-card border border-navy-border">
        <h4 className="text-sm font-bold text-white mb-4">Deep Telemetry & Audit Log</h4>
        <div className="divide-y divide-navy-border text-xs">
          <div className="py-2.5 flex justify-between">
            <span className="text-slate-400">Total Notification Events Observed</span>
            <span className="font-bold text-white">{metrics.totalNotificationsObserved}</span>
          </div>
          <div className="py-2.5 flex justify-between">
            <span className="text-slate-400">Notification Storms Intercepted</span>
            <span className="font-bold text-rose-400">{metrics.burstsDetected}</span>
          </div>
          <div className="py-2.5 flex justify-between">
            <span className="text-slate-400">Total Focus Minutes Protected</span>
            <span className="font-bold text-cyan-400">{metrics.totalFocusMinutes} mins</span>
          </div>
          <div className="py-2.5 flex justify-between">
            <span className="text-slate-400">User Classification Feedback Adjustments</span>
            <span className="font-bold text-emerald-400">{metrics.userCorrectionCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
