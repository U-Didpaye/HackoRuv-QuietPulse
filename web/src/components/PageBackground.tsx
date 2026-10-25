import React from 'react';

interface PageBackgroundProps {
  imageSrc: string;
  children: React.ReactNode;
  opacity?: number;
  className?: string;
  overlayStyle?: 'standard' | 'focused' | 'subtle';
}

/**
 * Reusable Cinematic Page Background Component
 * Intelligently applies uploaded cosmic and planetary imagery with
 * adaptive gradient overlays to ensure 100% text legibility across all 5 themes.
 */
export const PageBackground: React.FC<PageBackgroundProps> = ({
  imageSrc,
  children,
  opacity = 0.55,
  className = '',
  overlayStyle = 'standard',
}) => {
  return (
    <div className={`relative min-h-[calc(100vh-4rem)] w-full overflow-hidden ${className}`}>
      {/* Background Artwork Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <img
          src={imageSrc}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center transform scale-105 animate-ambient-drift filter brightness-75 contrast-110"
        />

        {/* 
          Multi-Stop Theme-Adaptive Gradient Vignette:
          Blends smoothly into var(--v-bg) at top, sides, and bottom,
          preserving crisp contrast for cards, text, and tables.
        */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              overlayStyle === 'focused'
                ? `
                  radial-gradient(ellipse at 50% 40%, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.88) 80%, var(--v-bg) 100%),
                  linear-gradient(to bottom, var(--v-bg) 0%, transparent 15%, transparent 75%, var(--v-bg) 100%)
                `
                : overlayStyle === 'subtle'
                ? `
                  radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.8) 75%, var(--v-bg) 100%),
                  linear-gradient(to bottom, var(--v-bg) 0%, transparent 20%, transparent 80%, var(--v-bg) 100%)
                `
                : `
                  radial-gradient(ellipse at 50% 45%, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.85) 75%, var(--v-bg) 100%),
                  linear-gradient(to bottom, var(--v-bg) 0%, transparent 15%, transparent 75%, var(--v-bg) 100%)
                `,
          }}
        />
      </div>

      {/* Foreground Interactive Content with Silky Page-Entry Animation */}
      <div className="relative z-10 w-full animate-page-enter">
        {children}
      </div>
    </div>
  );
};
