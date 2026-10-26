import React, { useState } from 'react';
import { useTheme, QuietPulseTheme } from '../context/ThemeContext';
import { Menu, X, Sparkles, User, ChevronDown, LogIn, ShieldCheck, Download } from 'lucide-react';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenChokas: () => void;
  queueCount: number;
  userEmail?: string | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  onOpenChokas,
  queueCount,
  userEmail,
  onLogout,
}) => {
  const { theme, setTheme, themes } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isPearl = theme === 'pearl';

  // Navigation links: Home, NotiFy, FlowQueue, Deep Focus, PulseInsights, Modes, ChokasAI, Contact
  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'notify', label: 'NotiFy' },
    { id: 'flowqueue', label: `FlowQueue${queueCount > 0 ? ` (${queueCount})` : ''}` },
    { id: 'deepfocus', label: 'Deep Focus' },
    { id: 'pulseinsights', label: 'PulseInsights' },
    { id: 'rules', label: 'Modes' },
    { id: 'chokas', label: 'ChokasAI' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md transition-colors duration-250 ${
        isPearl
          ? 'bg-black border-b border-neutral-800 text-white shadow-xl'
          : 'bg-v-bg/90 border-b border-v-border text-v-text'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Official QuietPulse Logo & Wordmark Header Asset (100% Transparent Alpha) */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 group focus:outline-none bg-transparent border-0 p-0"
          title="QuietPulse — Less Noise. More Focus."
        >
          <div className="h-9 relative flex items-center justify-center bg-transparent">
            <img
              src="./quietpulse-logo-transparent.png"
              alt="QuietPulse"
              className="h-8 sm:h-9 w-auto object-contain filter group-hover:brightness-110 transition bg-transparent"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = './quietpulse-logo.png';
              }}
            />
          </div>
        </button>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const isActive = currentRoute === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  if (link.id === 'chokas') {
                    onOpenChokas();
                  } else {
                    onNavigate(link.id);
                  }
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md tracking-wider transition-colors ${
                  isPearl
                    ? isActive
                      ? 'text-white bg-neutral-900 border border-neutral-700 shadow-sm'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-900/60'
                    : isActive
                    ? 'text-v-text bg-v-surface border border-v-border shadow-sm'
                    : 'text-v-text-muted hover:text-v-text hover:bg-v-secondary/50'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Controls in exact requested order: Login -> Theme Selector -> Hamburger Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick ChokasAI Launcher Button (Desktop only) */}
          <button
            onClick={onOpenChokas}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition font-mono ${
              isPearl
                ? 'bg-neutral-900 text-white border border-neutral-700 hover:bg-neutral-800 hover:border-cyan-400'
                : 'bg-v-text text-v-bg hover:opacity-90'
            }`}
            title="Open ChokasAI Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>ChokasAI</span>
          </button>

          {/* 1. Profile / Login Menu */}
          <div className="relative">
            {userEmail ? (
              <div>
                <button
                  onClick={() => {
                    setProfileDropdownOpen(!profileDropdownOpen);
                    setThemeDropdownOpen(false);
                  }}
                  className={`flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1.5 rounded-lg transition text-xs ${
                    isPearl
                      ? 'bg-neutral-900 border border-neutral-700 text-white hover:border-neutral-500'
                      : 'bg-v-surface border border-v-border text-v-text hover:border-v-accent'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[11px] font-bold ${
                    isPearl
                      ? 'bg-neutral-800 border border-neutral-600 text-white'
                      : 'bg-v-accent/20 border border-v-accent text-v-text'
                  }`}>
                    {userEmail.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline font-mono text-[11px] max-w-[100px] truncate">
                    {userEmail}
                  </span>
                  <ChevronDown className={`w-3 h-3 hidden sm:inline ${isPearl ? 'text-neutral-400' : 'text-v-text-muted'}`} />
                </button>

                {profileDropdownOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-48 p-2 rounded-xl shadow-2xl z-50 animate-reveal ${
                      isPearl
                        ? 'bg-neutral-950 border border-neutral-800 text-white'
                        : 'bg-v-surface border border-v-border text-v-text'
                    }`}
                  >
                    <div className={`px-3 py-2 border-b text-xs ${isPearl ? 'border-neutral-800' : 'border-v-border'}`}>
                      <div className="font-semibold truncate">{userEmail}</div>
                      <div className={`text-[10px] flex items-center gap-1 mt-0.5 ${isPearl ? 'text-neutral-400' : 'text-v-text-muted'}`}>
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>Sovereign Identity</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        if (onLogout) onLogout();
                      }}
                      className="w-full text-left px-3 py-2 mt-1 rounded-lg text-xs text-rose-400 hover:bg-neutral-900 transition"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition ${
                  isPearl
                    ? currentRoute === 'login'
                      ? 'bg-neutral-800 border border-neutral-600 text-white'
                      : 'bg-neutral-900 border border-neutral-700 text-white hover:border-neutral-500'
                    : currentRoute === 'login'
                    ? 'bg-v-elevated border border-v-accent text-v-text'
                    : 'bg-v-surface border border-v-border text-v-text hover:border-v-accent'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden xs:inline sm:inline">Log In</span>
              </button>
            )}
          </div>

          {/* 2. 3-Theme Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setThemeDropdownOpen(!themeDropdownOpen);
                setProfileDropdownOpen(false);
              }}
              className={`flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-lg transition ${
                isPearl
                  ? 'bg-neutral-900 border border-neutral-700 text-white hover:border-neutral-500'
                  : 'bg-v-surface border border-v-border text-v-text hover:border-v-accent'
              }`}
              title="Select Visual Theme"
            >
              <div
                className={`w-3.5 h-3.5 rounded-full border ${isPearl ? 'border-neutral-600' : 'border-v-border'}`}
                style={{
                  backgroundColor: themes.find((t) => t.id === theme)?.swatchBg,
                  borderColor: themes.find((t) => t.id === theme)?.swatchAccent,
                }}
              />
              <span className="hidden sm:inline capitalize font-mono text-[11px]">
                {themes.find((t) => t.id === theme)?.name}
              </span>
              <ChevronDown className={`w-3 h-3 ${isPearl ? 'text-neutral-400' : 'text-v-text-muted'}`} />
            </button>

            {themeDropdownOpen && (
              <div
                className={`absolute right-0 mt-2 w-56 max-w-[calc(100vw-2rem)] p-2 rounded-xl shadow-2xl z-50 animate-reveal ${
                  isPearl
                    ? 'bg-neutral-950 border border-neutral-800 text-white'
                    : 'bg-v-surface border border-v-border text-v-text'
                }`}
              >
                <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-1 block ${isPearl ? 'text-neutral-400' : 'text-v-text-muted'}`}>
                  Select Theme (3 Available)
                </span>
                <div className="space-y-1 mt-1">
                  {themes.map((t) => {
                    const isSelected = t.id === theme;
                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          setTheme(t.id);
                          setThemeDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition ${
                          isPearl
                            ? isSelected
                              ? 'bg-neutral-800 text-white font-bold'
                              : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                            : isSelected
                            ? 'bg-v-elevated text-v-text font-bold'
                            : 'text-v-text-muted hover:bg-v-secondary hover:text-v-text'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-4 h-4 rounded-full border"
                            style={{
                              backgroundColor: t.swatchBg,
                              borderColor: t.swatchAccent,
                            }}
                          />
                          <div>
                            <div className="font-semibold text-xs">{t.name}</div>
                            <div className={`text-[10px] ${isPearl ? 'text-neutral-400' : 'text-v-text-muted'}`}>{t.character}</div>
                          </div>
                        </div>
                        {isSelected && (
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${isPearl ? 'bg-white' : 'bg-v-accent'}`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 3. Mobile Menu Button (Hamburger) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg border transition ${
              isPearl
                ? 'text-neutral-300 hover:text-white hover:bg-neutral-900 border-neutral-700'
                : 'text-v-text-muted hover:text-v-text hover:bg-v-surface border-v-border'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className={`lg:hidden border-t px-4 py-4 space-y-2 ${
            isPearl
              ? 'bg-neutral-950 border-neutral-800 text-white'
              : 'bg-v-surface border-v-border text-v-text'
          }`}
        >
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setMobileMenuOpen(false);
                if (link.id === 'chokas') {
                  onOpenChokas();
                } else {
                  onNavigate(link.id);
                }
              }}
              className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold tracking-wider transition ${
                isPearl ? 'text-neutral-300 hover:text-white hover:bg-neutral-900' : 'text-v-text hover:bg-v-secondary'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigate('login');
            }}
            className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold tracking-wider flex items-center gap-2 transition ${
              isPearl ? 'text-cyan-400 hover:bg-neutral-900' : 'text-v-accent hover:bg-v-secondary'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{userEmail ? `Account (${userEmail})` : 'Log In to QuietPulse'}</span>
          </button>

          <a
            href="./QuietPulse.apk"
            download="QuietPulse.apk"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold tracking-wider flex items-center gap-2 transition text-emerald-400 hover:bg-white/10"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Android App</span>
          </a>

          {/* Clean Inline Theme Switcher for Mobile Devices */}
          <div className="pt-2.5 border-t border-white/10">
            <span className={`text-[10px] font-mono uppercase tracking-wider block mb-2 px-1 ${isPearl ? 'text-neutral-400' : 'text-v-text-muted'}`}>
              Theme (3 Options)
            </span>
            <div className="grid grid-cols-3 gap-2">
              {themes.map((t) => {
                const isSelected = t.id === theme;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-mono transition border ${
                      isSelected
                        ? isPearl
                          ? 'bg-neutral-800 text-white border-neutral-600 font-bold'
                          : 'bg-v-elevated text-v-text border-v-accent font-bold'
                        : isPearl
                        ? 'bg-neutral-900/60 text-neutral-400 border-neutral-800'
                        : 'bg-v-secondary/60 text-v-text-muted border-v-border'
                    }`}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full border shrink-0"
                      style={{
                        backgroundColor: t.swatchBg,
                        borderColor: t.swatchAccent,
                      }}
                    />
                    <span className="truncate">{t.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
