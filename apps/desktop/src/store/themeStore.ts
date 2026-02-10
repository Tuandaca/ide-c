import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type ThemeVariant, setTheme as setThemeAttribute } from '@ide-c/theme';

interface ThemeStore {
    currentTheme: ThemeVariant;
    backgroundEnabled: boolean;
    animationsEnabled: boolean;
    showWelcomeScreen: boolean;

    setTheme: (theme: ThemeVariant) => void;
    toggleBackground: () => void;
    toggleAnimations: () => void;
    dismissWelcomeScreen: () => void;
    resetWelcomeScreen: () => void;
}

export const useThemeStore = create<ThemeStore>()(
    persist(
        (set) => ({
            currentTheme: 'green',
            backgroundEnabled: true,
            animationsEnabled: true,
            showWelcomeScreen: true,

            setTheme: (theme) => {
                setThemeAttribute(theme);
                set({ currentTheme: theme });
            },

            toggleBackground: () =>
                set((state) => ({ backgroundEnabled: !state.backgroundEnabled })),

            toggleAnimations: () =>
                set((state) => ({ animationsEnabled: !state.animationsEnabled })),

            dismissWelcomeScreen: () => set({ showWelcomeScreen: false }),

            resetWelcomeScreen: () => set({ showWelcomeScreen: true }),
        }),
        {
            name: 'ide-theme-store',
        }
    )
);
