"use client"

import { useTheme } from "next-themes"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

type ThemeMode = "light" | "dark"
type ThemeOrigin = { x: number; y: number }

interface ThemeTransitionContextType {
  isTransitioning: boolean
  overlayTheme: ThemeMode
  toggleTheme: (origin?: ThemeOrigin) => void
  setThemeWithTransition: (target: ThemeMode, origin?: ThemeOrigin) => void
  overlayOrigin: ThemeOrigin | null
}

const DEFAULT_THEME: ThemeMode = "light"

const ThemeTransitionContext = createContext<ThemeTransitionContextType | undefined>(
  undefined
)

const sanitizeTheme = (value?: string): ThemeMode => (value === "dark" ? "dark" : "light")

export function ThemeTransitionProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [overlayTheme, setOverlayTheme] = useState<ThemeMode>(DEFAULT_THEME)
  const [overlayOrigin, setOverlayOrigin] = useState<ThemeOrigin | null>(null)

  const startTransition = useCallback(
    (targetTheme: ThemeMode, origin?: ThemeOrigin) => {
      if (isTransitioning) return
      
      // Set up the overlay to show the TARGET theme
      setOverlayOrigin(origin || { x: window.innerWidth / 2, y: window.innerHeight / 2 })
      setOverlayTheme(targetTheme)
      setIsTransitioning(true)

      // After animation completes, actually change the theme and cleanup
      setTimeout(() => {
        setTheme(targetTheme)
        setIsTransitioning(false)
        setOverlayOrigin(null)
      }, 500) // Match animation duration
    },
    [isTransitioning, setTheme]
  )

  const toggleTheme = useCallback(
    (origin?: ThemeOrigin) => {
      const currentTheme = sanitizeTheme(resolvedTheme)
      const targetTheme: ThemeMode = currentTheme === "light" ? "dark" : "light"
      startTransition(targetTheme, origin)
    },
    [resolvedTheme, startTransition]
  )

  const setThemeWithTransition = useCallback(
    (target: ThemeMode, origin?: ThemeOrigin) => {
      const targetTheme = sanitizeTheme(target)
      if (targetTheme !== sanitizeTheme(resolvedTheme)) {
        startTransition(targetTheme, origin)
      }
    },
    [resolvedTheme, startTransition]
  )

  const value = useMemo(
    () => ({ 
      isTransitioning, 
      overlayTheme, 
      toggleTheme, 
      setThemeWithTransition, 
      overlayOrigin 
    }),
    [isTransitioning, overlayTheme, toggleTheme, setThemeWithTransition, overlayOrigin]
  )

  return (
    <ThemeTransitionContext.Provider value={value}>
      {children}
    </ThemeTransitionContext.Provider>
  )
}

export function useThemeTransition() {
  const context = useContext(ThemeTransitionContext)
  if (context === undefined) {
    throw new Error("useThemeTransition must be used within a ThemeTransitionProvider")
  }
  return context
}