import { useMemo, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useSettingsStore } from '../store/settingsStore';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { themeMode, contrastMode, reducedMotion, fontSize } = useSettingsStore();

  // Determine if dark mode should be active
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = themeMode === 'dark' || (themeMode === 'auto' && prefersDarkMode);

  // Font size multipliers
  const fontSizeMultiplier = fontSize === 'small' ? 0.875 : fontSize === 'large' ? 1.125 : 1;

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDark ? 'dark' : 'light',
          primary: {
            main: isDark ? '#60a5fa' : '#2563eb',
            light: isDark ? '#93c5fd' : '#60a5fa',
            dark: isDark ? '#3b82f6' : '#1e40af',
          },
          secondary: {
            main: isDark ? '#fbbf24' : '#f59e0b',
            light: isDark ? '#fcd34d' : '#fbbf24',
            dark: isDark ? '#f59e0b' : '#d97706',
          },
          background: {
            default: isDark ? '#0f172a' : '#f8fafc',
            paper: isDark ? '#1e293b' : '#ffffff',
          },
          text: {
            primary: isDark ? '#f1f5f9' : '#1e293b',
            secondary: isDark ? '#94a3b8' : '#64748b',
          },
        },
        typography: {
          fontSize: 14 * fontSizeMultiplier,
          h1: { fontSize: `${2.5 * fontSizeMultiplier}rem` },
          h2: { fontSize: `${2 * fontSizeMultiplier}rem` },
          h3: { fontSize: `${1.75 * fontSizeMultiplier}rem` },
          h4: { fontSize: `${1.5 * fontSizeMultiplier}rem` },
          h5: { fontSize: `${1.25 * fontSizeMultiplier}rem` },
          h6: { fontSize: `${1.1 * fontSizeMultiplier}rem` },
          body1: { fontSize: `${1 * fontSizeMultiplier}rem` },
          body2: { fontSize: `${0.875 * fontSizeMultiplier}rem` },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                '*:focus-visible': {
                  outline: contrastMode === 'high' ? '3px solid' : '2px solid',
                  outlineColor: isDark ? '#90caf9' : '#0d47a1',
                  outlineOffset: '2px',
                },
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 600,
                ...(contrastMode === 'high' && {
                  border: `2px solid`,
                }),
                transition: reducedMotion ? 'none' : undefined,
              },
            },
          },
          MuiLink: {
            styleOverrides: {
              root: {
                ...(contrastMode === 'high' && {
                  textDecoration: 'underline',
                  fontWeight: 600,
                }),
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                transition: reducedMotion ? 'none' : undefined,
              },
            },
          },
        },
      }),
    [isDark, contrastMode, reducedMotion, fontSizeMultiplier]
  );

  // Apply reduced motion globally
  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.style.setProperty('--transition-duration', '0s');
      document.body.classList.add('reduce-motion');
    } else {
      document.documentElement.style.removeProperty('--transition-duration');
      document.body.classList.remove('reduce-motion');
    }
  }, [reducedMotion]);

  // Apply high contrast styles
  useEffect(() => {
    if (contrastMode === 'high') {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [contrastMode]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
