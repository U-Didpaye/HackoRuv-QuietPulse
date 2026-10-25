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
    // 600ms: Reveal emblem & subtle scale
    const t1 = setTimeout(() => setPhase(1), 600);

    // 1800ms: Metallic light sweep
    const t2 = setTimeout(() => setPhase(2), 1800);

    // 2800ms: Reveal wordmark "VYROX"
    const t3 = setTimeout(() => setPhase(3), 2800);

    // 4000ms: Fade out to homepage
    const t4 = setTimeout(() => {
      setIsFadingOut(true);
    }, 4200);

    // 4800ms: Complete and unmount
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
      {/* Skip button for user control */}
      <button
        onClick={handleSkip}
        className="absolute top-8 right-8 text-[11px] font-mono tracking-widest uppercase text-neutral-500 hover:text-white transition py-1.5 px-3 rounded-full border border-neutral-800 hover:border-neutral-600"
      >
        Skip Intro
      </button>

      <div className="relative flex flex-col items-center text-center px-4 max-w-sm">
        {/* Emblem Layer with metallic sweep */}
        <div
          className={`relative w-28 h-28 mb-6 transition-all duration-1000 ease-out transform ${
            phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          {/* Official Emblem Image / SVG */}
          <img
            src="/vyrox-emblem.svg"
            alt="VYROX Emblem"
            className="w-full h-full object-contain filter drop-shadow-[0_4px_24px_rgba(255,255,255,0.12)]"
            onError={(e) => {
              // Fallback to png if needed
              (e.currentTarget as HTMLImageElement).src = '/vyrox-emblem.png';
            }}
          />

          {/* Restrained Metallic Light Sweep Overlay */}
          {phase >= 2 && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
              <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-metallic-sweep" />
            </div>
          )}
        </div>

        {/* Wordmark Layer */}
        <div
          className={`transition-all duration-1000 ease-out transform ${
            phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <h1 className="text-3xl font-black tracking-[0.35em] text-white uppercase pl-2 font-editorial">
            VYROX
          </h1>
          <p className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 mt-2 font-mono">
            ATTENTION FIREWALL
          </p>
        </div>

        {/* Minimal Progress Line Indicator */}
        <div className="w-32 h-[1px] bg-neutral-900 mt-8 overflow-hidden rounded-full">
          <div
            className="h-full bg-gradient-to-r from-neutral-600 via-neutral-300 to-neutral-600 transition-all duration-1000 ease-linear"
            style={{ width: `${(phase / 3) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
