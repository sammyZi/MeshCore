import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  darkMode: boolean;
  language: string;
  privacyMode: boolean;
  notificationsEnabled: boolean;
  setDarkMode: (enabled: boolean) => void;
  setLanguage: (language: string) => void;
  setPrivacyMode: (enabled: boolean) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    set => ({
      darkMode: false,
      language: 'en',
      privacyMode: false,
      notificationsEnabled: true,
      setDarkMode: enabled => set({ darkMode: enabled }),
      setLanguage: language => set({ language }),
      setPrivacyMode: enabled => set({ privacyMode: enabled }),
      setNotificationsEnabled: enabled => set({ notificationsEnabled: enabled }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
