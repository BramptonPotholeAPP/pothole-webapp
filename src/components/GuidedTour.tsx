import { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import type { Step, CallBackProps } from 'react-joyride';
import { useLocation } from 'react-router-dom';

const tourSteps: Step[] = [
  {
    target: 'body',
    content: 'Welcome to the Brampton Pothole Detection System! Let me show you around.',
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="nav-dashboard"]',
    content: 'View all detected potholes with filters, search, and export options.',
  },
  {
    target: '[data-tour="nav-map"]',
    content: 'See potholes on an interactive map with severity markers.',
  },
  {
    target: '[data-tour="nav-analytics"]',
    content: 'Check trends, costs, and statistics over time.',
  },
  {
    target: '[data-tour="nav-dashcams"]',
    content: 'Monitor city vehicles with dash-cams that detect potholes automatically.',
  },
  {
    target: '[data-tour="theme-toggle"]',
    content: 'Switch between light and dark mode.',
  },
  {
    target: '[data-tour="language-menu"]',
    content: 'Change language to English, French, Punjabi, or Hindi.',
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
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#1976d2',
          zIndex: 10000,
        },
      }}
    />
  );
};
