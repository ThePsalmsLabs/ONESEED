'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

interface TimeBasedThemeConfig {
  currentTheme: string;
  isAuto: boolean;
  timeBasedTheme: 'light' | 'dark';
  nextSwitchTime: string;
  resetToAuto: () => void;
  setManualTheme: (theme: string) => void;
}

export function useTimeBasedTheme(): TimeBasedThemeConfig {
  const { theme, setTheme } = useTheme();
  const [timeBasedTheme, setTimeBasedTheme] = useState<'light' | 'dark'>('dark');
  const [nextSwitchTime, setNextSwitchTime] = useState<string>('');
  
  // Check if user has manually overridden the theme
  const manualOverride = typeof window !== 'undefined' 
    ? localStorage.getItem('theme-manual-override') 
    : null;
  
  const isAuto = !manualOverride;

  // Determine theme based on time of day
  const getTimeBasedTheme = (): 'light' | 'dark' => {
    const hour = new Date().getHours();
    // Dark mode: 6 PM (18:00) to 5:59 AM (05:59)
    // Light mode: 6 AM (06:00) to 5:59 PM (17:59)
    return (hour >= 18 || hour < 6) ? 'dark' : 'light';
  };

  // Calculate next switch time
  const getNextSwitchTime = (): string => {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour >= 18 || hour < 6) {
      // Currently dark, next switch at 6 AM
      const nextSwitch = new Date(now);
      if (hour >= 18) {
        nextSwitch.setDate(nextSwitch.getDate() + 1);
      }
      nextSwitch.setHours(6, 0, 0, 0);
      return '6:00 AM';
    } else {
      // Currently light, next switch at 6 PM
      return '6:00 PM';
    }
  };

  useEffect(() => {
    // Only update on mount - no interval needed
    const newTimeBasedTheme = getTimeBasedTheme();
    setTimeBasedTheme(newTimeBasedTheme);
    setNextSwitchTime(getNextSwitchTime());
    
    // Only apply time-based theme if user hasn't manually overridden
    if (isAuto) {
      setTheme(newTimeBasedTheme);
    }
  }, []);

  // Reset to auto mode (remove manual override)
  const resetToAuto = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('theme-manual-override');
      setTheme(timeBasedTheme);
    }
  };

  // Set manual theme override
  const setManualTheme = (newTheme: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme-manual-override', newTheme);
      setTheme(newTheme);
    }
  };

  return {
    currentTheme: theme || 'dark',
    isAuto,
    timeBasedTheme,
    nextSwitchTime,
    resetToAuto,
    setManualTheme,
  };
}



