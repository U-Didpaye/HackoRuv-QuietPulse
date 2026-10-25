import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { SplashScreen } from './components/SplashScreen';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ChokasModal } from './components/ChokasModal';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { QueuePage } from './pages/QueuePage';
import { FocusPage } from './pages/FocusPage';
import { DemoLabPage } from './pages/DemoLabPage';
import { InsightsPage } from './pages/InsightsPage';
import { RulesPage } from './pages/RulesPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { ContactPage } from './pages/ContactPage';

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

function VyroxApp() {
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const seen = sessionStorage.getItem('vyrox_splash_seen');
      return seen !== 'true';
    }
    return true;
  });

  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [isChokasOpen, setIsChokasOpen] = useState<boolean>(false);

  // Core Intelligence Engines (Preserved)
  const burstDetectorRef = useRef(new BurstDetector());
  const learningEngineRef = useRef(new LocalLearningEngine());
  const classifierRef = useRef(new ClassificationEngine(learningEngineRef.current));

  // Focus Session State
  const [isFocusActive, setIsFocusActive] = useState(false);
  const [remainingFocusSeconds, setRemainingFocusSeconds] = useState(0);

  // Interruption Stream & Telemetry State
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
    'com.shopping.deals': {
      id: 'rule_shopping',
      appName: 'SuperDeals',
      packageName: 'com.shopping.deals',
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

  // Process Notification through Heuristics
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

  // Actions
  const handleStartFocus = (name: string, durationMins: number) => {
    setIsFocusActive(true);
    setRemainingFocusSeconds(durationMins * 60);
  };

  const handleEndFocus = () => {
    setIsFocusActive(false);
    setRemainingFocusSeconds(0);
  };

  const handleMarkReviewed = (id: string) => {
    setItems(prev => prev.map(i => (i.event.id === id ? { ...i, isReviewed: true } : i)));
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

  const navigateTo = (route: string) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-v-bg text-v-text flex flex-col selection:bg-neutral-500 selection:text-white transition-colors duration-250">
      {/* 5-Second Cinematic Splash Screen */}
      {showSplash && (
        <SplashScreen
          onComplete={() => setShowSplash(false)}
        />
      )}

      {/* Main Navigation Bar */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={navigateTo}
        onOpenChokas={() => setIsChokasOpen(true)}
        queueCount={items.filter(i => !i.isReviewed).length}
      />

      {/* Main View Router */}
      <main className="flex-1 w-full">
        {/* Page 2: Homepage with Atmospheric Large VYROX Background Logo */}
        {currentRoute === 'home' && (
          <HomePage
            onNavigate={navigateTo}
            onOpenChokas={() => setIsChokasOpen(true)}
            metrics={metrics}
          />
        )}

        {/* Engine / Live Interception Feed */}
        {currentRoute === 'engine' && (
          <div className="px-4 sm:px-6 lg:px-8">
            <DashboardPage
              isFocusActive={isFocusActive}
              remainingFocusSeconds={remainingFocusSeconds}
              burstRate={burstRate}
              isBurstActive={isBurstActive}
              metrics={metrics}
              recentItems={items}
              onStartFocus={handleStartFocus}
              onEndFocus={handleEndFocus}
              onNavigate={navigateTo}
            />
          </div>
        )}

        {/* Attention Airlock Queue */}
        {currentRoute === 'queue' && (
          <div className="px-4 sm:px-6 lg:px-8">
            <QueuePage
              items={items}
              onMarkReviewed={handleMarkReviewed}
              onDismiss={handleDismiss}
              onReviewAll={handleReviewAll}
              onClearQueue={handleClearQueue}
              onFeedback={handleFeedback}
            />
          </div>
        )}

        {/* Focus Gateways */}
        {currentRoute === 'focus' && (
          <div className="px-4 sm:px-6 lg:px-8">
            <FocusPage
              isFocusActive={isFocusActive}
              remainingSeconds={remainingFocusSeconds}
              metrics={metrics}
              onStartFocus={handleStartFocus}
              onEndFocus={handleEndFocus}
            />
          </div>
        )}

        {/* Telemetry & Telemetry ROI */}
        {currentRoute === 'insights' && (
          <div className="px-4 sm:px-6 lg:px-8">
            <InsightsPage metrics={metrics} />
          </div>
        )}

        {/* Context Profiles & Rules */}
        {currentRoute === 'rules' && (
          <div className="px-4 sm:px-6 lg:px-8">
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
          </div>
        )}

        {/* Privacy & Permissions */}
        {currentRoute === 'privacy' && (
          <div className="px-4 sm:px-6 lg:px-8">
            <PrivacyPage
              onResetLearning={() => learningEngineRef.current.reset()}
              onClearHistory={handleClearQueue}
              feedbackRecordsCount={learningEngineRef.current.getHistory().length}
            />
          </div>
        )}

        {/* Stress Testing Lab */}
        {currentRoute === 'demo' && (
          <div className="px-4 sm:px-6 lg:px-8">
            <DemoLabPage
              onRunScenario={handleRunScenario}
              onResetDemo={handleResetDemo}
              simulatedCount={items.filter(i => i.event.sourceType === 'SIMULATED').length}
            />
          </div>
        )}

        {/* Contact Page */}
        {currentRoute === 'contact' && (
          <ContactPage />
        )}
      </main>

      {/* ChokasAI Terminal Modal */}
      <ChokasModal
        isOpen={isChokasOpen}
        onClose={() => setIsChokasOpen(false)}
        onNavigate={navigateTo}
        onStartFocus={handleStartFocus}
        onClearQueue={handleClearQueue}
      />

      {/* Professional Footer */}
      <Footer
        onNavigate={navigateTo}
        onReplaySplash={() => setShowSplash(true)}
        onOpenChokas={() => setIsChokasOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <VyroxApp />
    </ThemeProvider>
  );
}
