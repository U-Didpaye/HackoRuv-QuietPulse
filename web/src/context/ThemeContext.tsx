import React, { createContext, useContext, useEffect, useState } from 'react';

export type QuietPulseTheme = 'obsidian' | 'emerald' | 'pearl';

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
    id: 'pearl',
    name: 'Pearl',
    character: 'Clean Architectural Light (Active)',
    swatchBg: '#FFFFFF',
    swatchSurface: '#FFFFFF',
    swatchAccent: '#167D68',
  },
  {
    id: 'obsidian',
    name: 'Obsidian Silver',
    character: 'Cinematic & Metallic',
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
];

interface ThemeContextType {
  theme: QuietPulseTheme;
  setTheme: (theme: QuietPulseTheme) => void;
  themes: ThemeInfo[];
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'pearl',
  setTheme: () => {},
  themes: THEMES,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<QuietPulseTheme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quietpulse_theme') as QuietPulseTheme;
      if (saved && ['obsidian', 'emerald', 'pearl'].includes(saved)) {
        return saved;
      }
    }
    return 'pearl';
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
