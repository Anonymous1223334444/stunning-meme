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

  // Calculate the maximum radius needed to cover the entire screen
  const maxRadius = Math.sqrt(
    Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2)
  )

  // Theme colors - these should match your actual theme colors
  const backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--background')

  // Create a unique animation name to avoid conflicts
  const animationName = `expandThemeCircle-${Date.now()}`

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor,
          clipPath: `circle(0px at ${overlayOrigin.x}px ${overlayOrigin.y}px)`,
          animation: `${animationName} 500ms cubic-bezier(0.4, 0, 0.2, 1) forwards`,
          zIndex: 9999,
          pointerEvents: "none",
        }}
      />
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes ${animationName} {
            0% {
              clip-path: circle(0px at ${overlayOrigin.x}px ${overlayOrigin.y}px);
            }
            100% {
              clip-path: circle(${maxRadius}px at ${overlayOrigin.x}px ${overlayOrigin.y}px);
            }
          }
        `
      }} />
    </>
  )
}