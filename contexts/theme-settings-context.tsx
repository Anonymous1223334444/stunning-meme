"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface ThemeSettingsContextType {
  accentColor: string;
  setAccentColor: (color: string) => void;
  saturation: number;
  setSaturation: (value: number) => void;
  contrast: number;
  setContrast: (value: number) => void;
  isRounded: boolean;
  setIsRounded: (value: boolean) => void;
}

const ThemeSettingsContext = createContext<ThemeSettingsContextType | undefined>(undefined);

export function ThemeSettingsProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [accentColor, setAccentColorState] = useState('#3b82f6');
  const [saturation, setSaturationState] = useState(100);
  const [contrast, setContrastState] = useState(100);
  const [isRounded, setIsRoundedState] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    
    // Only run on the client side
    if (typeof window !== 'undefined') {
      const applyThemeSettings = () => {
        // Load settings from localStorage
        const savedAccent = localStorage.getItem('theme-accent-color') || '#3b82f6';
        const savedSaturation = parseInt(localStorage.getItem('theme-saturation') || '100');
        const savedContrast = parseInt(localStorage.getItem('theme-contrast') || '100');
        const savedRounded = localStorage.getItem('theme-rounded') === 'true';
        
        // Update state
        setAccentColorState(savedAccent);
        setSaturationState(savedSaturation);
        setContrastState(savedContrast);
        setIsRoundedState(savedRounded);
        
        // Apply accent color
        document.documentElement.style.setProperty('--primary', savedAccent);
        
        // Calculate appropriate foreground color based on accent color brightness
        const hexToRgb = (hex: string) => {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          } : { r: 0, g: 0, b: 0 };
        };
        
        const rgb = hexToRgb(savedAccent);
        const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
        const accentForeground = luminance > 0.5 ? '#000000' : '#ffffff';
        document.documentElement.style.setProperty('--primary-foreground', accentForeground);
        
        // Apply saturation and contrast
        document.documentElement.style.setProperty('--saturation', `${savedSaturation}%`);
        document.documentElement.style.setProperty('--contrast', `${savedContrast}%`);
        
        // Apply rounded corners
        const borderRadius = savedRounded ? '0.5rem' : '0.125rem';
        document.documentElement.style.setProperty('--radius', borderRadius);
      };
      
      applyThemeSettings();
      
      // Listen for storage changes in other tabs
      window.addEventListener('storage', applyThemeSettings);
      
      return () => {
        window.removeEventListener('storage', applyThemeSettings);
      };
    }
  }, [theme]);

  // We'll provide setter functions that update localStorage and CSS vars
  const setAccentColor = (color: string) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('theme-accent-color', color);
      setAccentColorState(color); // Update state
      document.documentElement.style.setProperty('--primary', color);
      
      // Calculate and set foreground color based on accent color brightness
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
      };
      
      const rgb = hexToRgb(color);
      const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
      const foreground = luminance > 0.5 ? '#000000' : '#ffffff';
      document.documentElement.style.setProperty('--primary-foreground', foreground);
    }
  };

  const setSaturation = (value: number) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('theme-saturation', value.toString());
      setSaturationState(value); // Update state
      document.documentElement.style.setProperty('--saturation', `${value}%`);
    }
  };

  const setContrast = (value: number) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('theme-contrast', value.toString());
      setContrastState(value); // Update state
      document.documentElement.style.setProperty('--contrast', `${value}%`);
    }
  };

  const setIsRounded = (value: boolean) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('theme-rounded', value.toString());
      setIsRoundedState(value); // Update state
      const borderRadius = value ? '0.5rem' : '0.125rem';
      document.documentElement.style.setProperty('--radius', borderRadius);
    }
  };

  // Provide default values until mounted on client
  if (!isMounted) {
    return (
      <ThemeSettingsContext.Provider 
        value={{ 
          accentColor: '#3b82f6',
          setAccentColor: () => {},
          saturation: 100,
          setSaturation: () => {},
          contrast: 100,
          setContrast: () => {},
          isRounded: true,
          setIsRounded: () => {}
        }}
      >
        {children}
      </ThemeSettingsContext.Provider>
    );
  }

  return (
    <ThemeSettingsContext.Provider 
      value={{ 
        accentColor,
        setAccentColor,
        saturation,
        setSaturation,
        contrast,
        setContrast,
        isRounded,
        setIsRounded
      }}
    >
      {children}
    </ThemeSettingsContext.Provider>
  );
}

export const useThemeSettings = () => {
  const context = useContext(ThemeSettingsContext);
  if (context === undefined) {
    throw new Error('useThemeSettings must be used within a ThemeSettingsProvider');
  }
  return context;
};