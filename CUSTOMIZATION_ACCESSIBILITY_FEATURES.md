# Customization & Accessibility Features

## Overview
This document describes the comprehensive customization and accessibility features added to the Brampton Pothole Detection application.

## Features Implemented

### 1. Customization Features

#### Theme Modes
- **Light Mode**: Traditional bright interface
- **Dark Mode**: Easy on the eyes for low-light environments
- **Auto Mode**: Automatically switches based on system preferences

#### High Contrast Mode
- Enhanced color contrast for better visibility
- Stronger color definitions
- Black/white backgrounds for maximum readability
- 3px focus outlines (vs 2px in normal mode)

#### Font Sizes
- **Small**: 0.875x multiplier
- **Medium**: 1x multiplier (default)
- **Large**: 1.125x multiplier
- Applied across all typography components

#### Multi-Language Support
Supported languages:
- 🇬🇧 **English** (en)
- 🇫🇷 **French** (fr) 
- 🇮🇳 **Punjabi** (pa)
- 🇮🇳 **Hindi** (hi)

Translated sections:
- Navigation menu
- Home page
- Settings page
- Dashboard labels
- Status indicators
- Priority levels

#### Dashboard Widgets
Customizable widgets with toggle controls:
- Recent Reports
- Status Overview
- Priority Distribution
- Map View
- Quick Stats
- Work Orders

### 2. Accessibility Features

#### WCAG 2.1 AA Compliance
- Proper color contrast ratios
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support

#### Screen Reader Support
- Descriptive ARIA labels on all interactive elements
- Screen reader mode flag for optimized announcements
- Proper heading hierarchy
- Skip links (to be added)

#### Keyboard Navigation
- Tab order follows logical flow
- Focus indicators on all interactive elements
- Enhanced focus outlines in high contrast mode
- Keyboard shortcuts support

#### Reduced Motion
- Disables animations for users sensitive to motion
- Removes transitions via CSS class
- Respects `prefers-reduced-motion` system preference

### 3. Technical Implementation

#### State Management
- **Zustand** store for centralized settings management
- **Persist middleware** for saving preferences to localStorage
- Reactive updates across all components

#### Theme System
- Dynamic theme generation based on user preferences
- Auto dark mode detection via `prefers-color-scheme`
- High contrast palette adjustments
- Font size multiplication across typography variants

#### Translation System
- Custom `useTranslation()` hook
- Dot notation for nested keys (`t('nav.home')`)
- Fallback to English if translation missing
- Type-safe language selection

## File Structure

```
src/
├── store/
│   └── settingsStore.ts          # Zustand store for user preferences
├── i18n/
│   ├── translations.ts            # Translation objects for 4 languages
│   └── useTranslation.ts          # Custom translation hook
├── theme/
│   └── ThemeProvider.tsx          # Dynamic theme generation
├── pages/
│   ├── Settings.tsx               # Settings configuration UI
│   ├── Home.tsx                   # Updated with translations
│   └── ...
└── components/
    └── Layout.tsx                 # Updated with translations
```

## Usage

### Accessing Settings
1. Click the **Settings** icon in the navigation menu
2. Or navigate to `/settings` route

### Changing Theme
1. Go to Settings → Appearance
2. Select theme mode: Light, Dark, or Auto
3. Toggle High Contrast mode if needed

### Changing Language
1. Go to Settings → Language
2. Select from dropdown: English, French, Punjabi, or Hindi
3. All UI text updates immediately

### Adjusting Font Size
1. Go to Settings → Accessibility
2. Select Small, Medium, or Large
3. All text scales accordingly

### Customizing Dashboard
1. Go to Settings → Dashboard Widgets
2. Toggle individual widgets on/off
3. Dashboard updates to show only enabled widgets

### Enabling Accessibility Features
1. Go to Settings → Accessibility
2. Toggle Reduced Motion for animation-free experience
3. Enable Screen Reader Mode for optimized announcements

### Resetting Preferences
1. Go to Settings
2. Click "Reset to Defaults" at bottom
3. Confirm in dialog
4. All settings return to default values

## Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- All modern browsers with CSS Grid and CSS Variables support

## Future Enhancements
- [ ] Additional languages (Spanish, Mandarin, Arabic)
- [ ] Voice navigation
- [ ] More color themes (Blue, Green, Purple)
- [ ] Custom accent colors
- [ ] Export/Import settings
- [ ] Per-page preferences
- [ ] Keyboard shortcut customization
- [ ] ARIA landmarks on all pages
- [ ] Skip links for main content

## Testing Checklist
- [ ] Dark mode toggles correctly
- [ ] High contrast increases color strength
- [ ] Language switching updates all text
- [ ] Font size changes affect all typography
- [ ] Reduced motion disables animations
- [ ] Dashboard widgets show/hide correctly
- [ ] Settings persist after page reload
- [ ] Keyboard navigation works throughout app
- [ ] Screen readers announce all elements
- [ ] Focus indicators visible in all modes
- [ ] WCAG 2.1 AA contrast ratios met

## Resources
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material-UI Accessibility](https://mui.com/material-ui/guides/accessibility/)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Web Accessibility Initiative](https://www.w3.org/WAI/)
