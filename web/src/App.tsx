import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Inbox,
  Timer,
  FlaskConical,
  BarChart2,
  Sliders,
  Lock,
  Download,
  Github,
  Play,
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';
import { DashboardPage } from './pages/DashboardPage';
import { QueuePage } from './pages/QueuePage';
import { FocusPage } from './pages/FocusPage';
import { DemoLabPage } from './pages/DemoLabPage';
import { InsightsPage } from './pages/InsightsPage';
import { RulesPage } from './pages/RulesPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { BurstDetector } from './intelligence/burstDetector';
import { LocalLearningEngine } from './intelligence/localLearning';
import { ClassificationEngine } from './intelligence/classifier';
import { DemoScenario } from './intelligence/demoScenarios';
import {
  UiNotificationItem,
  UserRule,
  AnalyticsMetrics,
  UserFeedbackType,
  NotificationEvent
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'queue' | 'focus' | 'demo' | 'insights' | 'rules' | 'privacy'>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core Intelligence Engines
  const burstDetectorRef = useRef(new BurstDetector());
  const learningEngineRef = useRef(new LocalLearningEngine());
  const classifierRef = useRef(new ClassificationEngine(learningEngineRef.current));

  // State
  const [isFocusActive, setIsFocusActive] = useState(false);
  const [remainingFocusSeconds, setRemainingFocusSeconds] = useState(0);
  const [burstRate, setBurstRate] = useState(0);
  const [isBurstActive, setIsBurstActive] = useState(false);
  const [items, setItems] = useState<UiNotificationItem[]>([]);
  const [rules, setRules] = useState<Record<string, UserRule>>({
    'com.google.android.dialer': {
      id: 'rule_phone',
      appName: 'Phone',
      packageName: 'com.google.android.dialer',
      priorityLevel: 'ALWAYS_URGENT',
      allowDuringFocus: true
    },
    'com.flipkart.android': {
      id: 'rule_shopping',
      appName: 'Flipkart',
      packageName: 'com.flipkart.android',
      priorityLevel: 'NEVER_INTERRUPT',
      allowDuringFocus: false
    }
  });

  const [metrics, setMetrics] = useState<AnalyticsMetrics>({
    totalNotificationsObserved: 0,
    burstsDetected: 0,
    repeatedInterruptionCount: 0,
    urgentCount: 0,
    importantCount: 0,
    batchedCount: 0,
    lowPriorityCount: 0,
    totalFocusMinutes: 0,
    completedSessionsCount: 0,
    userCorrectionCount: 0,
    estimatedInterruptionsDeflected: 0
  });

  // Focus Timer Tick
  useEffect(() => {
    let timer: any;
    if (isFocusActive && remainingFocusSeconds > 0) {
      timer = setInterval(() => {
        setRemainingFocusSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsFocusActive(false);
            setMetrics(m => ({
              ...m,
              completedSessionsCount: m.completedSessionsCount + 1,
              totalFocusMinutes: m.totalFocusMinutes + 25
            }));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isFocusActive, remainingFocusSeconds]);

  // Process a notification through the intelligence engine
  const processNotification = (event: NotificationEvent) => {
    const burst = burstDetectorRef.current.recordEvent(event);
    const now = event.timestamp;
    const isBurst = burstDetectorRef.current.isBurstActive(now);
    const rate = burstDetectorRef.current.getRecentRate(now);

    const classification = classifierRef.current.classify(
      event,
      rules,
      isFocusActive,
      burstDetectorRef.current
    );

    const newItem: UiNotificationItem = {
      event,
      result: classification,
      isReviewed: false
    };

    setBurstRate(rate);
    setIsBurstActive(isBurst);

    setItems(prev => {
      const updated = [newItem, ...prev];
      updateMetrics(updated, Boolean(burst));
      return updated;
    });
  };

  const updateMetrics = (currentItems: UiNotificationItem[], hadBurst: boolean) => {
    const total = currentItems.length;
    const urgent = currentItems.filter(i => i.result.category === 'URGENT').length;
    const important = currentItems.filter(i => i.result.category === 'IMPORTANT').length;
    const batched = currentItems.filter(i => i.result.category === 'BATCH').length;
    const low = currentItems.filter(i => i.result.category === 'LOW_PRIORITY').length;
    const deflected = batched + low;

    setMetrics(m => ({
      ...m,
      totalNotificationsObserved: total,
      burstsDetected: m.burstsDetected + (hadBurst ? 1 : 0),
      urgentCount: urgent,
      importantCount: important,
      batchedCount: batched,
      lowPriorityCount: low,
      estimatedInterruptionsDeflected: deflected
    }));
  };

  // Focus Actions
  const handleStartFocus = (name: string, durationMins: number) => {
    setIsFocusActive(true);
    setRemainingFocusSeconds(durationMins * 60);
  };

  const handleEndFocus = () => {
    setIsFocusActive(false);
    setRemainingFocusSeconds(0);
  };

  // Queue Actions
  const handleMarkReviewed = (id: string) => {
    setItems(prev => prev.map(i => i.event.id === id ? { ...i, isReviewed: true } : i));
  };

  const handleDismiss = (id: string) => {
    setItems(prev => prev.filter(i => i.event.id !== id));
  };

  const handleReviewAll = () => {
    setItems(prev => prev.map(i => ({ ...i, isReviewed: true })));
  };

  const handleClearQueue = () => {
    setItems([]);
  };

  // Feedback Action
  const handleFeedback = (id: string, type: UserFeedbackType) => {
    const item = items.find(i => i.event.id === id);
    if (!item) return;

    learningEngineRef.current.recordFeedback({
      eventId: id,
      packageName: item.event.packageName,
      originalCategory: item.result.category,
      feedbackType: type,
      timestamp: Date.now()
    });

    setMetrics(m => ({ ...m, userCorrectionCount: m.userCorrectionCount + 1 }));
  };

  // Demo Lab runner
  const handleRunScenario = (scen: DemoScenario) => {
    const events = scen.events(Date.now());
    events.forEach((ev, idx) => {
      setTimeout(() => {
        processNotification(ev);
      }, idx * 300);
    });
  };

  const handleResetDemo = () => {
    burstDetectorRef.current.clear();
    setItems(prev => prev.filter(i => i.event.sourceType === 'REAL'));
    setBurstRate(0);
    setIsBurstActive(false);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Shield },
    { id: 'queue', label: `Queue (${items.length})`, icon: Inbox },
    { id: 'focus', label: 'Focus Mode', icon: Timer },
    { id: 'demo', label: 'Judge Demo Lab', icon: FlaskConical },
    { id: 'insights', label: 'Insights', icon: BarChart2 },
    { id: 'rules', label: 'Rules', icon: Sliders },
    { id: 'privacy', label: 'Privacy', icon: Lock }
  ] as const;

  return (
    <div className="min-h-screen bg-navy-dark text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-navy-surface/90 backdrop-blur-md border-b border-navy-border px-4 py-3 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-base tracking-wide">FocusShield AI</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  CASCADE '26
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Problem 3.1: The Attention Firewall</p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-navy-card'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Mobile Menu Toggle & Cloud APK Link */}
          <div className="flex items-center gap-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-navy-card hover:bg-navy-hover text-slate-300 border border-navy-border transition"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Get APK</span>
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-navy-card border border-navy-border text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden pt-3 pb-2 border-t border-navy-border mt-3 grid grid-cols-2 gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-left transition ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-navy-card'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'dashboard' && (
          <DashboardPage
            isFocusActive={isFocusActive}
            remainingFocusSeconds={remainingFocusSeconds}
            burstRate={burstRate}
            isBurstActive={isBurstActive}
            metrics={metrics}
            recentItems={items}
            onStartFocus={handleStartFocus}
            onEndFocus={handleEndFocus}
            onNavigate={tab => setActiveTab(tab as any)}
          />
        )}
        {activeTab === 'queue' && (
          <QueuePage
            items={items}
            onMarkReviewed={handleMarkReviewed}
            onDismiss={handleDismiss}
            onReviewAll={handleReviewAll}
            onClearQueue={handleClearQueue}
            onFeedback={handleFeedback}
          />
        )}
        {activeTab === 'focus' && (
          <FocusPage
            isFocusActive={isFocusActive}
            remainingSeconds={remainingFocusSeconds}
            metrics={metrics}
            onStartFocus={handleStartFocus}
            onEndFocus={handleEndFocus}
          />
        )}
        {activeTab === 'demo' && (
          <DemoLabPage
            onRunScenario={handleRunScenario}
            onResetDemo={handleResetDemo}
            simulatedCount={items.filter(i => i.event.sourceType === 'SIMULATED').length}
          />
        )}
        {activeTab === 'insights' && <InsightsPage metrics={metrics} />}
        {activeTab === 'rules' && (
          <RulesPage
            rules={rules}
            onAddRule={rule => setRules(prev => ({ ...prev, [rule.packageName]: rule }))}
            onRemoveRule={pkg => {
              setRules(prev => {
                const copy = { ...prev };
                delete copy[pkg];
                return copy;
              });
            }}
          />
        )}
        {activeTab === 'privacy' && (
          <PrivacyPage
            onResetLearning={() => learningEngineRef.current.reset()}
            onClearHistory={handleClearQueue}
            feedbackRecordsCount={learningEngineRef.current.getHistory().length}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-navy-border py-4 px-6 text-center text-xs text-slate-500">
        FocusShield AI — CASCADE '26 (IIIT Nagpur) | Problem 3.1: The Attention Firewall | 100% Privacy-Preserving On-Device Architecture
      </footer>
    </div>
  );
}
