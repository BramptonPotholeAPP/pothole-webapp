import { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import type { Step, CallBackProps } from 'react-joyride';
import { useLocation } from 'react-router-dom';

const tourSteps: Step[] = [
  {
    target: 'body',
    content: '👋 Welcome to Brampton Pothole Detection! I\'m here to show you how this system helps keep our roads safe.',
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="nav-dashboard"]',
    content: '📊 This is your Dashboard - view all detected potholes, filter by status or severity, and export data with one click.',
    disableBeacon: true,
  },
  {
    target: '[data-tour="nav-map"]',
    content: '🗺️ The Map shows every pothole location. Color-coded markers indicate severity - red means critical!',
    disableBeacon: true,
  },
  {
    target: '[data-tour="nav-analytics"]',
    content: '📈 Analytics reveals trends and insights. See which areas need the most attention.',
    disableBeacon: true,
  },
  {
    target: '[data-tour="nav-dashcams"]',
    content: '🚗 Dash-Cams page monitors city vehicles that automatically detect potholes while driving. Pretty cool, right?',
    disableBeacon: true,
  },
  {
    target: '[data-tour="theme-toggle"]',
    content: '🌙 Prefer dark mode? Click here to switch themes anytime.',
    disableBeacon: true,
  },
  {
    target: 'body',
    content: '✨ That\'s it! You\'re ready to explore. Click "Report Pothole Now" to get started, or browse around at your own pace.',
    placement: 'center',
  },
];

export const GuidedTour = () => {
  const [run, setRun] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour && location.pathname === '/') {
      const timer = setTimeout(() => setRun(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finishedStatuses.includes(status as typeof STATUS.FINISHED)) {
      setRun(false);
      localStorage.setItem('hasSeenTour', 'true');
    }
  };

  return (
    <Joyride
      steps={tourSteps}
      run={run}
      continuous
      showProgress
      showSkipButton
      scrollToFirstStep
      disableOverlayClose
      spotlightClicks
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#1976d2',
          zIndex: 10000,
          arrowColor: '#fff',
          backgroundColor: '#fff',
          textColor: '#333',
        },
        buttonNext: {
          backgroundColor: '#1976d2',
          fontSize: 14,
          padding: '8px 16px',
          borderRadius: 4,
        },
        buttonBack: {
          color: '#666',
          marginRight: 10,
        },
        buttonSkip: {
          color: '#999',
        },
        tooltip: {
          borderRadius: 8,
          fontSize: 15,
          padding: 20,
        },
        tooltipContent: {
          padding: '10px 0',
        },
      }}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Got it!',
        next: 'Next',
        skip: 'Skip tour',
      }}
    />
  );
};
