
import { useState, useEffect } from 'react';

interface HeaderSettings {
  showStickyHeader: boolean;
}

const HEADER_SETTINGS_KEY = 'chb-header-settings';

const defaultSettings: HeaderSettings = {
  showStickyHeader: false,
};

export const useHeaderSettings = () => {
  const [settings, setSettings] = useState<HeaderSettings>(defaultSettings);

  useEffect(() => {
    const stored = localStorage.getItem(HEADER_SETTINGS_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Error parsing header settings:', error);
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<HeaderSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem(HEADER_SETTINGS_KEY, JSON.stringify(updated));
  };

  return {
    settings,
    updateSettings,
  };
};
