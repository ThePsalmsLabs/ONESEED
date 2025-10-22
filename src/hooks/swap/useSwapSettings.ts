import { useState, useEffect } from 'react';

export interface SwapSettings {
  slippageTolerance: number; // in basis points (50 = 0.5%)
  deadline: number; // in minutes
  showAdvanced: boolean;
  expertMode: boolean;
}

const DEFAULT_SETTINGS: SwapSettings = {
  slippageTolerance: 50, // 0.5%
  deadline: 20, // 20 minutes
  showAdvanced: false,
  expertMode: false,
};

const SETTINGS_KEY = 'oneseed_swap_settings';

export function useSwapSettings() {
  const [settings, setSettings] = useState<SwapSettings>(DEFAULT_SETTINGS);

  // Load settings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (error) {
        console.error('Failed to parse stored settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (updates: Partial<SwapSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return {
    settings,
    updateSettings,
    resetSettings,
  };
}

