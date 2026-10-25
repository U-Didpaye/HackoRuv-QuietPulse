import React, { createContext, useContext, useEffect, useState } from 'react';

export type VyroxTheme = 'obsidian' | 'graphite' | 'pearl';

interface ThemeInfo {
  id: VyroxTheme;
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
    character: 'Cinematic & Metallic',
    swatchBg: '#000000',
    swatchSurface: '#181818',
    swatchAccent: '#C6C6C6',
  },
  {
    id: 'graphite',
    name: 'Graphite',
    character: 'Sophisticated Charcoal',
    swatchBg: '#111214',
    swatchSurface: '#222328',
    swatchAccent: '#D0D0D0',
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
  theme: VyroxTheme;
  setTheme: (theme: VyroxTheme) => void;
  themes: ThemeInfo[];
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'obsidian',
  setTheme: () => {},
  themes: THEMES,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<VyroxTheme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vyrox_theme') as VyroxTheme;
      if (saved && ['obsidian', 'graphite', 'pearl'].includes(saved)) {
        return saved;
      }
    }
    return 'obsidian';
  });

  const setTheme = (newTheme: VyroxTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('vyrox_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
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
