"use client"

import { useEffect, useState } from "react"
import { useThemeTransition } from "@/hooks/use-theme-transition"

export function ThemeTransition() {
  const { isTransitioning, overlayTheme, overlayOrigin } = useThemeTransition()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isTransitioning || !overlayOrigin) {
    return null
  }

  const maxRadius = Math.sqrt(
    Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2)
  )

  const themeColors = {
    light: 'hsl(0, 0%, 100%)',
    dark: 'hsl(240, 10%, 5%)',
  }

  const backgroundColor = themeColors[overlayTheme]
  const animationName = `expandCircle-${Date.now()}`

  return (
    <>
      <div
        className="theme-transition-overlay"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
          backgroundColor,
          clipPath: `circle(0% at ${overlayOrigin.x}px ${overlayOrigin.y}px)`,
          animation: `${animationName} 500ms cubic-bezier(0.4, 0, 0.2, 1) forwards`,
          zIndex: 999999,
          pointerEvents: "none",
          willChange: "clip-path",
          isolation: "isolate",
        }}
      />
      <style>{`
        @keyframes ${animationName} {
          from {
            clip-path: circle(0% at ${overlayOrigin.x}px ${overlayOrigin.y}px);
          }
          to {
            clip-path: circle(${maxRadius * 1.5}px at ${overlayOrigin.x}px ${overlayOrigin.y}px);
          }
        }
      `}</style>
    </>
  )
}
