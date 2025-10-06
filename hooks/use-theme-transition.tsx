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

      const originPoint = origin || { x: window.innerWidth / 2, y: window.innerHeight / 2 }

      setOverlayOrigin(originPoint)
      setOverlayTheme(targetTheme)
      setIsTransitioning(true)

      requestAnimationFrame(() => {
        setTimeout(() => {
          setTheme(targetTheme)
        }, 100)

        setTimeout(() => {
          setIsTransitioning(false)
          setOverlayOrigin(null)
        }, 600)
      })
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