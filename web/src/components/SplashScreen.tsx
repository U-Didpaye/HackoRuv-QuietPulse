import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
  forceShow?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, forceShow = false }) => {
  const [phase, setPhase] = useState<number>(0);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  useEffect(() => {
    // Check if user has already seen launch screen in this session
    if (!forceShow) {
      const seen = sessionStorage.getItem('quietpulse_splash_seen');
      if (seen === 'true') {
        onComplete();
        return;
      }
    }

    // Respect user's reduced-motion preference
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      sessionStorage.setItem('quietpulse_splash_seen', 'true');
      onComplete();
      return;
    }

    // Sequence stages (Target ~2.5 seconds):
    // 0ms: Pure black
    // 300ms: Reveal QuietPulse emblem with scale and opacity
    const t1 = setTimeout(() => setPhase(1), 300);

    // 1000ms: Silver-blue light sweep & progress line
    const t2 = setTimeout(() => setPhase(2), 1000);

    // 2000ms: Hold completed logo & tagline
    const t3 = setTimeout(() => setPhase(3), 2000);

    // 2600ms: Fade out to destination
    const t4 = setTimeout(() => {
      setIsFadingOut(true);
    }, 2600);

    // 3000ms: Complete and unmount
    const t5 = setTimeout(() => {
      sessionStorage.setItem('quietpulse_splash_seen', 'true');
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete, forceShow]);

  const handleSkip = () => {
    sessionStorage.setItem('quietpulse_splash_seen', 'true');
    setIsFadingOut(true);
    setTimeout(onComplete, 250);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-500 select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Skip button for user convenience */}
      <button
        onClick={handleSkip}
        className="absolute top-8 right-8 text-[11px] font-mono tracking-widest uppercase text-neutral-500 hover:text-white transition py-1.5 px-3.5 rounded-full border border-neutral-800 hover:border-neutral-600 bg-black/60 backdrop-blur-sm"
      >
        Skip Launch
      </button>

      <div className="relative flex flex-col items-center text-center px-4 max-w-md w-full">
        {/* Official QuietPulse Logo & Wordmark Container */}
        <div
          className={`relative max-w-[280px] sm:max-w-[320px] w-full transition-all duration-700 ease-out transform ${
            phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {/* Authentic High-Res Centered Artwork on Black */}
          <img
            src="/quietpulse-logo-centered.png"
            alt="QuietPulse"
            className="w-full h-auto object-contain filter drop-shadow-[0_0_35px_rgba(255,255,255,0.18)]"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/quietpulse-logo.png';
            }}
          />

          {/* Restrained Metallic Light Sweep Overlay */}
          {phase >= 2 && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
              <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent animate-metallic-sweep" />
            </div>
          )}
        </div>

        {/* Tagline & Silver-Blue Progress Line */}
        <div
          className={`mt-6 flex flex-col items-center transition-all duration-700 delay-150 ${
            phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <div className="text-[12px] sm:text-xs font-mono tracking-[0.25em] text-neutral-300 uppercase font-semibold">
            LESS NOISE. MORE FOCUS.
          </div>

          {/* Subtle Silver-Blue Progress Line */}
          <div className="w-44 h-[2px] bg-neutral-900 rounded-full mt-4 overflow-hidden relative">
            <div className="h-full bg-gradient-to-r from-cyan-500 via-white to-blue-400 rounded-full animate-light-sweep" />
          </div>

          <div className="text-[10px] font-mono text-neutral-600 mt-3 tracking-wider">
            INITIALIZING ATTENTION FIREWALL
          </div>
        </div>
      </div>
    </div>
  );
};
