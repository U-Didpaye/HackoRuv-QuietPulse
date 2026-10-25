import React, { createContext, useContext, useEffect, useState } from 'react';

export type QuietPulseTheme = 'obsidian' | 'emerald' | 'violet' | 'crimson' | 'pearl';

export interface ThemeInfo {
  id: QuietPulseTheme;
  name: string;
  character: string;
  swatchBg: string;
  swatchSurface: string;
  swatchAccent: string;
}

export const THEMES: ThemeInfo[] = [
  {
    id: 'obsidian',
    name: 'Obsidian Silver',
    character: 'Cinematic & Metallic (Default)',
    swatchBg: '#000000',
    swatchSurface: '#181818',
    swatchAccent: '#C6C6C6',
  },
  {
    id: 'emerald',
    name: 'Emerald',
    character: 'Deep Forest & Mint Accents',
    swatchBg: '#051410',
    swatchSurface: '#0E2C24',
    swatchAccent: '#14B8A6',
  },
  {
    id: 'violet',
    name: 'Violet',
    character: 'Celestial Dark & Lavender',
    swatchBg: '#0C0817',
    swatchSurface: '#1D1535',
    swatchAccent: '#8B5CF6',
  },
  {
    id: 'crimson',
    name: 'Crimson',
    character: 'Dark Rose & Soft Crimson',
    swatchBg: '#140508',
    swatchSurface: '#2C0D14',
    swatchAccent: '#FF4757',
  },
  {
    id: 'pearl',
    name: 'Pearl',
    character: 'Clean Architectural Light',
    swatchBg: '#F5F4F0',
    swatchSurface: '#ECEBE7',
    swatchAccent: '#737373',
  },
];

interface ThemeContextType {
  theme: QuietPulseTheme;
  setTheme: (theme: QuietPulseTheme) => void;
  themes: ThemeInfo[];
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'obsidian',
  setTheme: () => {},
  themes: THEMES,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<QuietPulseTheme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quietpulse_theme') as QuietPulseTheme;
      if (saved && ['obsidian', 'emerald', 'violet', 'crimson', 'pearl'].includes(saved)) {
        return saved;
      }
    }
    return 'obsidian';
  });

  const setTheme = (newTheme: QuietPulseTheme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('quietpulse_theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
