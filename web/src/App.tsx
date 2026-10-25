import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import { LoginPage } from './pages/LoginPage';
import { PageBackground } from './components/PageBackground';
import { isSupabaseConfigured, supabase, getCurrentSession, signOutUser } from './data/supabaseClient';

import { BurstDetector } from './intelligence/burstDetector';
import { LocalLearningEngine } from './intelligence/localLearning';
import { ClassificationEngine } from './intelligence/classifier';
import { DemoScenario } from './intelligence/demoScenarios';
import {
  UiNotificationItem,
  UserRule,
  AnalyticsMetrics,
  UserFeedbackType,
  NotificationEvent,
  ContextMode,
  PersonalizedSettings,
  ClassificationCategory
} from './types';

const defaultPersonalizedSettings: PersonalizedSettings = {
  urgentKeywords: ['otp', 'emergency', 'critical', 'hospital', 'urgent', 'verification', 'code', 'sos'],
  batchKeywords: ['newsletter', 'digest', 'social', 'updates', 'trending'],
  spamKeywords: ['sale', 'discount', '50% off', 'cashback', 'jackpot', 'coins', 'promo', 'deal'],
  vipApps: ['slack', 'whatsapp', 'phone', 'dialer', 'teams'],
  workApps: ['slack', 'teams', 'outlook', 'gmail', 'zoom', 'jira', 'github'],
  personalApps: ['whatsapp', 'phone', 'messages', 'telegram', 'signal'],
  vipContacts: ['Mom', 'Family', 'Team Lead', 'Boss', 'Dr.'],
  urgencyThreshold: 0.72,
  relevanceThreshold: 0.62,
  autoBatchNonUrgent: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00'
};

function QuietPulseApp() {
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const seen = sessionStorage.getItem('quietpulse_splash_seen');
      return seen !== 'true';
    }
    return true;
  });
  const [splashKey, setSplashKey] = useState<number>(0);
  const [forceSplash, setForceSplash] = useState<boolean>(false);

  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [isChokasOpen, setIsChokasOpen] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('quietpulse_user') || sessionStorage.getItem('quietpulse_user');
    }
    return null;
  });

  // Context Modes State (Office, Home, Personalized Mode)
  const [activeContextMode, setActiveContextMode] = useState<ContextMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quietpulse_context_mode') as ContextMode;
      if (saved === 'OFFICE' || saved === 'HOME' || saved === 'PERSONALIZED') return saved;
    }
    return 'OFFICE';
  });

  const [personalizedSettings, setPersonalizedSettings] = useState<PersonalizedSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('quietpulse_personalized_settings');
        if (saved) return { ...defaultPersonalizedSettings, ...JSON.parse(saved) };
      } catch (ignored) {}
    }
    return defaultPersonalizedSettings;
  });

  // Android Native Notification Access State
  const [isNativeAndroid, setIsNativeAndroid] = useState<boolean>(false);
  const [isNotificationAccessGranted, setIsNotificationAccessGranted] = useState<boolean>(false);

  // Core Intelligence Engines
  const burstDetectorRef = useRef(new BurstDetector());
  const learningEngineRef = useRef(new LocalLearningEngine());
  const classifierRef = useRef(new ClassificationEngine(learningEngineRef.current));

  // Focus Session State
  const [isFocusActive, setIsFocusActive] = useState(false);
  const [remainingFocusSeconds, setRemainingFocusSeconds] = useState(0);

  // Interruption Stream & Telemetry State
  const [burstRate, setBurstRate] = useState(0);
  const [isBurstActive, setIsBurstActive] = useState(false);

  // FlowQueue Items with Local Persistence
  const [items, setItems] = useState<UiNotificationItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('quietpulse_queued_items');
        if (saved) return JSON.parse(saved);
      } catch (ignored) {}
    }
    return [];
  });

  const [rules, setRules] = useState<Record<string, UserRule>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('quietpulse_rules');
        if (saved) return JSON.parse(saved);
      } catch (ignored) {}
    }
    return {
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
        priorityLevel: 'SPAM',
        allowDuringFocus: false
      }
    };
  });

  const [metrics, setMetrics] = useState<AnalyticsMetrics>({
    totalNotificationsObserved: 0,
    burstsDetected: 0,
    repeatedInterruptionCount: 0,
    urgentCount: 0,
    importantCount: 0,
    batchedCount: 0,
    lowPriorityCount: 0,
    spamCount: 0,
    totalFocusMinutes: 0,
    completedSessionsCount: 0,
    userCorrectionCount: 0,
    estimatedInterruptionsDeflected: 0
  });

  // Recompute and synchronize metrics whenever items change
  const recalculateMetrics = useCallback((currentItems: UiNotificationItem[], burstCountDelta: number = 0) => {
    const total = currentItems.length;
    const urgent = currentItems.filter(i => i.result.category === 'URGENT').length;
    const important = currentItems.filter(i => i.result.category === 'IMPORTANT').length;
    const batched = currentItems.filter(i => i.result.category === 'BATCH').length;
    const low = currentItems.filter(i => i.result.category === 'LOW_PRIORITY').length;
    const spam = currentItems.filter(i => i.result.category === 'SPAM').length;
    const deflected = batched + low + spam;

    setMetrics(m => ({
      ...m,
      totalNotificationsObserved: total,
      burstsDetected: m.burstsDetected + burstCountDelta,
      urgentCount: urgent,
      importantCount: important,
      batchedCount: batched,
      lowPriorityCount: low,
      spamCount: spam,
      estimatedInterruptionsDeflected: deflected
    }));

    try {
      localStorage.setItem('quietpulse_queued_items', JSON.stringify(currentItems));
    } catch (ignored) {}
  }, []);

  // Initialize metrics from stored items on mount
  useEffect(() => {
    if (items.length > 0) {
      recalculateMetrics(items, 0);
    }
  }, [items, recalculateMetrics]);

  // Synchronize Supabase session
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    getCurrentSession().then((session) => {
      if (session?.user?.email) {
        setUserEmail(session.user.email);
        localStorage.setItem('quietpulse_user', session.user.email);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        setUserEmail(session.user.email);
        localStorage.setItem('quietpulse_user', session.user.email);
      } else if (_event === 'SIGNED_OUT') {
        setUserEmail(null);
        localStorage.removeItem('quietpulse_user');
        sessionStorage.removeItem('quietpulse_user');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Detect Android Native Bridge & Poll Captured Notifications
  const checkAndroidAccess = useCallback(() => {
    const bridge = (window as any).QuietPulseAndroid;
    if (bridge && typeof bridge.isAndroidApp === 'function') {
      setIsNativeAndroid(true);
      if (typeof bridge.isNotificationAccessGranted === 'function') {
        const granted = Boolean(bridge.isNotificationAccessGranted());
        setIsNotificationAccessGranted(granted);
      }
    } else {
      setIsNativeAndroid(false);
      setIsNotificationAccessGranted(false);
    }
  }, []);

  // Check on mount and bind Android resume hook
  useEffect(() => {
    checkAndroidAccess();
    (window as any).onAndroidResume = () => {
      checkAndroidAccess();
    };
  }, [checkAndroidAccess]);

  // Process a notification through the complete classification pipeline
  const processNotification = useCallback((event: NotificationEvent) => {
    const burst = burstDetectorRef.current.recordEvent(event);
    const now = event.timestamp;
    const isBurst = burstDetectorRef.current.isBurstActive(now);
    const rate = burstDetectorRef.current.getRecentRate(now);

    const classification = classifierRef.current.classify(
      event,
      rules,
      isFocusActive,
      burstDetectorRef.current,
      activeContextMode,
      personalizedSettings
    );

    const newItem: UiNotificationItem = {
      event,
      result: classification,
      isReviewed: false
    };

    setBurstRate(rate);
    setIsBurstActive(isBurst);

    setItems(prev => {
      // Prevent duplicate event IDs
      if (prev.some(i => i.event.id === event.id)) return prev;
      const updated = [newItem, ...prev];
      recalculateMetrics(updated, burst ? 1 : 0);
      return updated;
    });
  }, [rules, isFocusActive, activeContextMode, personalizedSettings, recalculateMetrics]);

  // Android notification polling loop
  useEffect(() => {
    if (!isNativeAndroid) return;

    const interval = setInterval(() => {
      const bridge = (window as any).QuietPulseAndroid;
      if (bridge && typeof bridge.getCapturedNotifications === 'function') {
        try {
          const jsonStr = bridge.getCapturedNotifications();
          if (jsonStr && jsonStr.length > 2) {
            const rawEvents = JSON.parse(jsonStr) as NotificationEvent[];
            if (Array.isArray(rawEvents) && rawEvents.length > 0) {
              rawEvents.forEach(ev => {
                processNotification(ev);
              });
              // Clear processed notifications from Android memory queue
              if (typeof bridge.clearCapturedNotifications === 'function') {
                bridge.clearCapturedNotifications();
              }
            }
          }
        } catch (e) {
          console.warn('Error reading Android notifications:', e);
        }
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [isNativeAndroid, processNotification]);

  // Request Android Notification Access
  const handleRequestNotificationAccess = () => {
    const bridge = (window as any).QuietPulseAndroid;
    if (bridge && typeof bridge.openNotificationSettings === 'function') {
      bridge.openNotificationSettings();
    } else {
      alert("Notification access can only be enabled inside the installed QuietPulse Android app.");
    }
  };

  // Switch Context Mode
  const handleChangeContextMode = (mode: ContextMode) => {
    setActiveContextMode(mode);
    try {
      localStorage.setItem('quietpulse_context_mode', mode);
    } catch (ignored) {}
  };

  // Update Personalized Settings
  const handleUpdatePersonalizedSettings = (settings: PersonalizedSettings) => {
    setPersonalizedSettings(settings);
    try {
      localStorage.setItem('quietpulse_personalized_settings', JSON.stringify(settings));
    } catch (ignored) {}
  };

  // Reset Personalized Settings
  const handleResetPersonalizedSettings = () => {
    setPersonalizedSettings(defaultPersonalizedSettings);
    try {
      localStorage.setItem('quietpulse_personalized_settings', JSON.stringify(defaultPersonalizedSettings));
    } catch (ignored) {}
  };

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
    setItems(prev => {
      const updated = prev.map(i => (i.event.id === id ? { ...i, isReviewed: true } : i));
      recalculateMetrics(updated, 0);
      return updated;
    });
  };

  const handleDismiss = (id: string) => {
    setItems(prev => {
      const updated = prev.filter(i => i.event.id !== id);
      recalculateMetrics(updated, 0);
      return updated;
    });
  };

  const handleReviewAll = () => {
    setItems(prev => {
      const updated = prev.map(i => ({ ...i, isReviewed: true }));
      recalculateMetrics(updated, 0);
      return updated;
    });
  };

  const handleClearQueue = () => {
    setItems([]);
    recalculateMetrics([], 0);
  };

  // FlowQueue Action Handler (Was Urgent, Batch It, Spam)
  const handleUpdateCategory = (
    id: string,
    newCategory: ClassificationCategory,
    feedbackType: 'WAS_URGENT' | 'BATCHED' | 'SPAM'
  ) => {
    setItems(prev => {
      const updated = prev.map(i => {
        if (i.event.id === id) {
          return {
            ...i,
            userFeedback: feedbackType,
            result: {
              ...i.result,
              category: newCategory,
              explanation: `User calibrated this notification as ${newCategory.replace('_', ' ')}.`
            }
          };
        }
        return i;
      });
      recalculateMetrics(updated, 0);
      return updated;
    });
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
      }, idx * 280);
    });
  };

  const handleResetDemo = () => {
    burstDetectorRef.current.clear();
    setItems(prev => {
      const updated = prev.filter(i => i.event.sourceType === 'REAL');
      recalculateMetrics(updated, 0);
      return updated;
    });
    setBurstRate(0);
    setIsBurstActive(false);
  };

  const navigateTo = (route: string) => {
    if (route === 'engine') route = 'notify';
    else if (route === 'queue') route = 'flowqueue';
    else if (route === 'focus') route = 'deepfocus';
    else if (route === 'insights') route = 'pulseinsights';

    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (email: string) => {
    setUserEmail(email);
    navigateTo('home');
  };

  const handleTriggerReplaySplash = () => {
    setForceSplash(true);
    setSplashKey(prev => prev + 1);
    setShowSplash(true);
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
    } catch (err) {
      console.warn('Sign out warning:', err);
    }
    localStorage.removeItem('quietpulse_user');
    sessionStorage.removeItem('quietpulse_user');
    setUserEmail(null);
  };

  return (
    <div className="min-h-screen bg-v-bg text-v-text flex flex-col selection:bg-neutral-500 selection:text-white transition-colors duration-250">
      {/* 2.5-Second Cinematic Launch Screen */}
      {showSplash && (
        <SplashScreen
          key={splashKey}
          forceShow={forceSplash}
          onComplete={() => {
            setShowSplash(false);
            setForceSplash(false);
          }}
        />
      )}

      {/* Main Navigation Bar */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={navigateTo}
        onOpenChokas={() => setIsChokasOpen(true)}
        queueCount={items.filter(i => !i.isReviewed).length}
        userEmail={userEmail}
        onLogout={handleLogout}
      />

      {/* Main View Router */}
      <main className="flex-1 w-full pb-safe">
        {/* Home */}
        {currentRoute === 'home' && (
          <HomePage
            onNavigate={navigateTo}
            onOpenChokas={() => setIsChokasOpen(true)}
            metrics={metrics}
            onReplaySplash={handleTriggerReplaySplash}
          />
        )}

        {/* NotiFy: Live Interception Feed */}
        {(currentRoute === 'notify' || currentRoute === 'engine') && (
          <PageBackground imageSrc="./backgrounds/bg-monolith-overlook.jpg">
            <div className="px-3 sm:px-6 lg:px-8">
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
                activeContextMode={activeContextMode}
                onChangeContextMode={handleChangeContextMode}
                isNotificationAccessGranted={isNotificationAccessGranted}
                onRequestNotificationAccess={handleRequestNotificationAccess}
                isNativeAndroid={isNativeAndroid}
              />
            </div>
          </PageBackground>
        )}

        {/* FlowQueue */}
        {(currentRoute === 'flowqueue' || currentRoute === 'queue') && (
          <PageBackground imageSrc="./backgrounds/bg-bioluminescent-river.png">
            <div className="px-3 sm:px-6 lg:px-8">
              <QueuePage
                items={items}
                onMarkReviewed={handleMarkReviewed}
                onDismiss={handleDismiss}
                onReviewAll={handleReviewAll}
                onClearQueue={handleClearQueue}
                onFeedback={handleFeedback}
                onUpdateCategory={handleUpdateCategory}
              />
            </div>
          </PageBackground>
        )}

        {/* DeepFocus */}
        {(currentRoute === 'deepfocus' || currentRoute === 'focus') && (
          <PageBackground imageSrc="./backgrounds/bg-golden-summit.png" overlayStyle="focused">
            <div className="px-3 sm:px-6 lg:px-8">
              <FocusPage
                isFocusActive={isFocusActive}
                remainingSeconds={remainingFocusSeconds}
                metrics={metrics}
                onStartFocus={handleStartFocus}
                onEndFocus={handleEndFocus}
              />
            </div>
          </PageBackground>
        )}

        {/* PulseInsights */}
        {(currentRoute === 'pulseinsights' || currentRoute === 'insights') && (
          <PageBackground imageSrc="./backgrounds/bg-violet-stream.png">
            <div className="px-3 sm:px-6 lg:px-8">
              <InsightsPage metrics={metrics} />
            </div>
          </PageBackground>
        )}

        {/* Rules & Context Modes */}
        {currentRoute === 'rules' && (
          <PageBackground imageSrc="./backgrounds/bg-metallic-portrait-emblem.png" overlayStyle="focused">
            <div className="px-3 sm:px-6 lg:px-8">
              <RulesPage
                rules={rules}
                onAddRule={rule => {
                  setRules(prev => {
                    const updated = { ...prev, [rule.packageName]: rule };
                    try {
                      localStorage.setItem('quietpulse_rules', JSON.stringify(updated));
                    } catch (ignored) {}
                    return updated;
                  });
                }}
                onRemoveRule={pkg => {
                  setRules(prev => {
                    const copy = { ...prev };
                    delete copy[pkg];
                    try {
                      localStorage.setItem('quietpulse_rules', JSON.stringify(copy));
                    } catch (ignored) {}
                    return copy;
                  });
                }}
                activeContextMode={activeContextMode}
                onChangeContextMode={handleChangeContextMode}
                personalizedSettings={personalizedSettings}
                onUpdatePersonalizedSettings={handleUpdatePersonalizedSettings}
                onResetPersonalizedSettings={handleResetPersonalizedSettings}
              />
            </div>
          </PageBackground>
        )}

        {/* Demo Lab */}
        {currentRoute === 'demo' && (
          <DemoLabPage
            onRunScenario={handleRunScenario}
            onResetDemo={handleResetDemo}
            metrics={metrics}
            onNavigate={navigateTo}
          />
        )}

        {/* Privacy */}
        {currentRoute === 'privacy' && (
          <PageBackground imageSrc="./backgrounds/bg-monolith-overlook.jpg">
            <div className="px-3 sm:px-6 lg:px-8">
              <PrivacyPage
                onResetLearning={() => {
                  learningEngineRef.current.reset();
                  setMetrics(m => ({ ...m, userCorrectionCount: 0 }));
                }}
                onClearHistory={handleClearQueue}
                feedbackRecordsCount={metrics.userCorrectionCount}
              />
            </div>
          </PageBackground>
        )}

        {/* Contact */}
        {currentRoute === 'contact' && (
          <PageBackground imageSrc="./backgrounds/bg-golden-summit.png">
            <div className="px-3 sm:px-6 lg:px-8">
              <ContactPage />
            </div>
          </PageBackground>
        )}

        {/* Login / Supabase Auth */}
        {currentRoute === 'login' && (
          <PageBackground imageSrc="./backgrounds/bg-monolith-overlook.jpg">
            <div className="px-3 sm:px-6 lg:px-8">
              <LoginPage
                onLoginSuccess={handleLoginSuccess}
                onNavigateHome={() => navigateTo('home')}
              />
            </div>
          </PageBackground>
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={navigateTo}
        onReplaySplash={handleTriggerReplaySplash}
        onOpenChokas={() => setIsChokasOpen(true)}
      />

      {/* ChokasAI On-Device Assistant Modal */}
      <ChokasModal
        isOpen={isChokasOpen}
        onClose={() => setIsChokasOpen(false)}
        onNavigate={navigateTo}
        onStartFocus={handleStartFocus}
        onClearQueue={handleClearQueue}
      />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <QuietPulseApp />
    </ThemeProvider>
  );
}

export default App;
