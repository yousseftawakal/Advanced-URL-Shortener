import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
      localStorage.setItem('theme', 'system');
    }
    if (savedTheme === 'system' || !savedTheme) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return savedTheme;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = (e) => {
      if (localStorage.getItem('theme') === 'system') {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () =>
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  useEffect(() => {
    // Update localStorage when theme changes
    localStorage.setItem('theme', theme);

    // Update document attribute
    document.documentElement.setAttribute('data-theme', theme);

    // Apply theme colors
    const root = document.documentElement;
    if (theme === 'dark') {
      root.style.setProperty('--color-bg-dark', '#0f172a');
      root.style.setProperty('--color-bg-card', '#1e293b');
      root.style.setProperty('--color-bg-input', '#334155');
      root.style.setProperty('--color-text-primary', '#f8fafc');
      root.style.setProperty('--color-text-secondary', '#94a3b8');
      root.style.setProperty('--color-primary', '#8b5cf6');
      root.style.setProperty('--color-primary-dark', '#7c3aed');
      root.style.setProperty('--color-border', '#334155');
      root.style.setProperty('--color-border-light', '#1e293b');
      root.style.setProperty('--color-hover', 'rgba(148, 163, 184, 0.1)');
    } else {
      root.style.setProperty('--color-bg-dark', '#f8fafc');
      root.style.setProperty('--color-bg-card', '#ffffff');
      root.style.setProperty('--color-bg-input', '#f1f5f9');
      root.style.setProperty('--color-text-primary', '#0f172a');
      root.style.setProperty('--color-text-secondary', '#64748b');
      root.style.setProperty('--color-primary', '#8b5cf6');
      root.style.setProperty('--color-primary-dark', '#7c3aed');
      root.style.setProperty('--color-border', '#e2e8f0');
      root.style.setProperty('--color-border-light', '#f1f5f9');
      root.style.setProperty('--color-hover', 'rgba(51, 65, 85, 0.05)');
    }
  }, [theme]);

  const toggleTheme = (newTheme) => {
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      setTheme(systemTheme);
    } else {
      setTheme(newTheme);
    }
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
