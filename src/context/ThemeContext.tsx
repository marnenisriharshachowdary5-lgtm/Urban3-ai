import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'dark' | 'light';
export type AccentColor = 'cyan' | 'indigo' | 'emerald' | 'rose' | 'amber';

interface AccentConfig {
  name: string;
  hex: string;
  rgb: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  glowClass: string;
  ringClass: string;
}

export const ACCENT_CONFIGS: Record<AccentColor, AccentConfig> = {
  cyan: {
    name: 'Cyan',
    hex: '#06b6d4',
    rgb: '6, 182, 212',
    bgClass: 'bg-cyan-500',
    textClass: 'text-cyan-400',
    borderClass: 'border-cyan-400',
    glowClass: 'shadow-cyan-500/20',
    ringClass: 'ring-cyan-400',
  },
  indigo: {
    name: 'Indigo',
    hex: '#6366f1',
    rgb: '99, 102, 241',
    bgClass: 'bg-indigo-500',
    textClass: 'text-indigo-400',
    borderClass: 'border-indigo-400',
    glowClass: 'shadow-indigo-500/20',
    ringClass: 'ring-indigo-400',
  },
  emerald: {
    name: 'Emerald',
    hex: '#10b981',
    rgb: '16, 185, 129',
    bgClass: 'bg-emerald-500',
    textClass: 'text-emerald-400',
    borderClass: 'border-emerald-400',
    glowClass: 'shadow-emerald-500/20',
    ringClass: 'ring-emerald-400',
  },
  rose: {
    name: 'Rose',
    hex: '#f43f5e',
    rgb: '244, 63, 94',
    bgClass: 'bg-rose-500',
    textClass: 'text-rose-400',
    borderClass: 'border-rose-400',
    glowClass: 'shadow-rose-500/20',
    ringClass: 'ring-rose-400',
  },
  amber: {
    name: 'Amber',
    hex: '#f59e0b',
    rgb: '245, 158, 11',
    bgClass: 'bg-amber-500',
    textClass: 'text-amber-400',
    borderClass: 'border-amber-400',
    glowClass: 'shadow-amber-500/20',
    ringClass: 'ring-amber-400',
  },
};

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
  accentConfig: AccentConfig;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('urbanmind_theme') as ThemeMode) || 'dark';
  });

  const [accent, setAccentState] = useState<AccentColor>(() => {
    const saved = localStorage.getItem('urbanmind_accent') as AccentColor;
    if (saved && ACCENT_CONFIGS[saved]) return saved;
    return 'cyan';
  });

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    localStorage.setItem('urbanmind_theme', mode);
  };

  const setAccent = (color: AccentColor) => {
    setAccentState(color);
    localStorage.setItem('urbanmind_accent', color);
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const config = ACCENT_CONFIGS[accent] || ACCENT_CONFIGS.cyan;
    document.documentElement.style.setProperty('--accent-rgb', config.rgb);
    document.documentElement.style.setProperty('--accent-hex', config.hex);
  }, [accent]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        accent,
        setAccent,
        accentConfig: ACCENT_CONFIGS[accent] || ACCENT_CONFIGS.cyan,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
