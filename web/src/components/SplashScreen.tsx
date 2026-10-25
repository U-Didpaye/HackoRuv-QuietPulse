import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
  forceShow?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, forceShow = false }) => {
  const [phase, setPhase] = useState<number>(0);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  useEffect(() => {
    // Check if user has already seen splash in this session
    if (!forceShow) {
      const seen = sessionStorage.getItem('vyrox_splash_seen');
      if (seen === 'true') {
        onComplete();
        return;
      }
    }

    // Check reduced motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      sessionStorage.setItem('vyrox_splash_seen', 'true');
      onComplete();
      return;
    }

    // Sequence stages:
    // 0ms: Start pure black
    // 600ms: Reveal official emblem with scale & opacity
    const t1 = setTimeout(() => setPhase(1), 500);

    // 1600ms: Metallic light sweep
    const t2 = setTimeout(() => setPhase(2), 1600);

    // 2600ms: Hold completed logo
    const t3 = setTimeout(() => setPhase(3), 2600);

    // 4200ms: Fade out to homepage
    const t4 = setTimeout(() => {
      setIsFadingOut(true);
    }, 4200);

    // 4900ms: Complete and unmount
    const t5 = setTimeout(() => {
      sessionStorage.setItem('vyrox_splash_seen', 'true');
      onComplete();
    }, 4900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete, forceShow]);

  const handleSkip = () => {
    sessionStorage.setItem('vyrox_splash_seen', 'true');
    setIsFadingOut(true);
    setTimeout(onComplete, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-700 select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Skip button for user convenience */}
      <button
        onClick={handleSkip}
        className="absolute top-8 right-8 text-[11px] font-mono tracking-widest uppercase text-neutral-500 hover:text-white transition py-1.5 px-3.5 rounded-full border border-neutral-800 hover:border-neutral-600 bg-black/60 backdrop-blur-sm"
      >
        Skip Intro
      </button>

      <div className="relative flex flex-col items-center text-center px-4 max-w-md w-full">
        {/* Official VYROX Logo Container */}
        <div
          className={`relative max-w-[280px] sm:max-w-[340px] w-full transition-all duration-1000 ease-out transform ${
            phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {/* Authentic High-Res Artwork on Black */}
          <img
            src="/vyrox-splash.png"
            alt="VYROX Official Brand"
            className="w-full h-auto object-contain filter drop-shadow-[0_0_35px_rgba(255,255,255,0.18)]"
          />

          {/* Restrained Metallic Light Sweep Overlay */}
          {phase >= 2 && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
              <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent animate-metallic-sweep" />
            </div>
          )}
        </div>

        {/* Minimal Progress Line Indicator */}
        <div className="w-36 h-[1.5px] bg-neutral-900 mt-6 overflow-hidden rounded-full">
          <div
            className="h-full bg-gradient-to-r from-neutral-600 via-neutral-200 to-neutral-600 transition-all duration-1000 ease-linear"
            style={{ width: `${Math.min(100, (phase / 3) * 100)}%` }}
          />
        </div>

        <p
          className={`text-[10px] tracking-[0.4em] uppercase text-neutral-500 mt-4 font-mono transition-opacity duration-1000 ${
            phase >= 2 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          ATTENTION FIREWALL SYSTEM
        </p>
      </div>
    </div>
  );
};
