import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'fr' | 'pa' | 'hi' | 'ar';
export type ThemeMode = 'light' | 'dark' | 'auto';
export type ContrastMode = 'normal' | 'high';

export interface DashboardWidget {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
}

interface SettingsState {
  // Theme settings
  themeMode: ThemeMode;
  contrastMode: ContrastMode;
  
  // Language settings
  language: Language;
  
  // Dashboard customization
  widgets: DashboardWidget[];
  
  // Accessibility settings
  reducedMotion: boolean;
  screenReaderMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  
  // Actions
  setThemeMode: (mode: ThemeMode) => void;
  setContrastMode: (mode: ContrastMode) => void;
  setLanguage: (language: Language) => void;
  setReducedMotion: (enabled: boolean) => void;
  setScreenReaderMode: (enabled: boolean) => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  toggleWidget: (widgetId: string) => void;
  reorderWidgets: (widgets: DashboardWidget[]) => void;
  resetSettings: () => void;
}

const defaultWidgets: DashboardWidget[] = [
  { id: 'stats', name: 'Statistics Cards', enabled: true, order: 0 },
  { id: 'map', name: 'Interactive Map', enabled: true, order: 1 },
  { id: 'table', name: 'Pothole Table', enabled: true, order: 2 },
  { id: 'filters', name: 'Filters & Search', enabled: true, order: 3 },
];

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Default values
      themeMode: 'light',
      contrastMode: 'normal',
      language: 'en',
      widgets: defaultWidgets,
      reducedMotion: false,
      screenReaderMode: false,
      fontSize: 'medium',

      // Actions
      setThemeMode: (mode) => set({ themeMode: mode }),
      setContrastMode: (mode) => set({ contrastMode: mode }),
      setLanguage: (language) => set({ language }),
      setReducedMotion: (enabled) => set({ reducedMotion: enabled }),
      setScreenReaderMode: (enabled) => set({ screenReaderMode: enabled }),
      setFontSize: (size) => set({ fontSize: size }),
      
      toggleWidget: (widgetId) =>
        set((state) => ({
          widgets: state.widgets.map((widget) =>
            widget.id === widgetId
              ? { ...widget, enabled: !widget.enabled }
              : widget
          ),
        })),
      
      reorderWidgets: (widgets) => set({ widgets }),
      
      resetSettings: () =>
        set({
          themeMode: 'light',
          contrastMode: 'normal',
          language: 'en',
          widgets: defaultWidgets,
          reducedMotion: false,
          screenReaderMode: false,
          fontSize: 'medium',
        }),
    }),
    {
      name: 'settings-storage',
    }
  )
);
