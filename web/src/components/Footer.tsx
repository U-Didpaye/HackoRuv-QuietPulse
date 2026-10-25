import React from 'react';
import { Shield, Sparkles, Play, ArrowUp } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string) => void;
  onReplaySplash: () => void;
  onOpenChokas: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onReplaySplash,
  onOpenChokas,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-v-border bg-v-surface mt-20 transition-colors duration-250">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 relative flex items-center justify-center bg-transparent">
                <img
                  src="/quietpulse-logo-transparent.png"
                  alt="QuietPulse"
                  className="h-9 w-auto object-contain bg-transparent"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/quietpulse-logo.png';
                  }}
                />
              </div>
            </div>
            <p className="text-xs text-v-text-muted max-w-sm leading-relaxed font-sans">
              QuietPulse is an intelligent, privacy-first attention firewall designed to protect human cognitive capacity from notification bursts and digital noise.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onReplaySplash}
                className="text-[11px] font-mono text-v-text-muted hover:text-v-text flex items-center gap-1.5 py-1 px-2.5 rounded-md bg-v-secondary border border-v-border transition"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Replay Cinematic Launch</span>
              </button>
            </div>
          </div>

          {/* Navigation Links (Exact Feature Names) */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-v-text mb-4">
              Architecture
            </h4>
            <ul className="space-y-2.5 text-xs text-v-text-muted font-sans">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-v-text transition">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('notify')} className="hover:text-v-text transition">
                  NotiFy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('flowqueue')} className="hover:text-v-text transition">
                  FlowQueue
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('deepfocus')} className="hover:text-v-text transition">
                  DeepFocus
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('demo')} className="hover:text-v-text transition">
                  Demo Lab
                </button>
              </li>
            </ul>
          </div>

          {/* System & Support */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-v-text mb-4">
              System
            </h4>
            <ul className="space-y-2.5 text-xs text-v-text-muted font-sans">
              <li>
                <button onClick={onOpenChokas} className="hover:text-v-text transition flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-v-accent" />
                  <span>ChokasAI Assistant</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pulseinsights')} className="hover:text-v-text transition">
                  PulseInsights
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('rules')} className="hover:text-v-text transition">
                  Context Rules
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-v-text transition">
                  Privacy &amp; Governance
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-v-text transition">
                  Contact
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar — Exact requested footer credit per Section 3 */}
        <div className="mt-12 pt-8 border-t border-v-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-v-text-muted">
          <div className="font-medium text-v-text">
            Made With Creativity By HackoRuv - Team
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-v-text-muted">QuietPulse • LESS NOISE. MORE FOCUS.</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-v-secondary hover:bg-v-elevated text-v-text border border-v-border transition"
              title="Return to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
