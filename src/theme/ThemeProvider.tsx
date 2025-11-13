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
            main: contrastMode === 'high' ? (isDark ? '#90caf9' : '#0d47a1') : '#1976d2',
          },
          secondary: {
            main: contrastMode === 'high' ? (isDark ? '#f48fb1' : '#c2185b') : '#dc004e',
          },
          background: {
            default: contrastMode === 'high'
              ? isDark
                ? '#000000'
                : '#ffffff'
              : isDark
              ? '#121212'
              : '#f5f5f5',
            paper: contrastMode === 'high'
              ? isDark
                ? '#0a0a0a'
                : '#ffffff'
              : isDark
              ? '#1e1e1e'
              : '#ffffff',
          },
          text: {
            primary: contrastMode === 'high'
              ? isDark
                ? '#ffffff'
                : '#000000'
              : isDark
              ? 'rgba(255, 255, 255, 0.87)'
              : 'rgba(0, 0, 0, 0.87)',
          },
          ...(contrastMode === 'high' && {
            divider: isDark ? '#ffffff' : '#000000',
          }),
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
