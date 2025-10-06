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
    light: 'oklch(0.99 0.005 264)',
    dark: 'oklch(0.08 0.015 264)',
  }

  const backgroundColor = themeColors[overlayTheme]
  const animationName = `expandCircle-${Date.now()}`
  const rippleAnimationName = `ripple-${Date.now()}`

  return (
    <>
      <div
        className="theme-transition-overlay"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor,
          clipPath: `circle(0px at ${overlayOrigin.x}px ${overlayOrigin.y}px)`,
          animation: `${animationName} 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
          zIndex: 99999,
          pointerEvents: "none",
          willChange: "clip-path",
        }}
      />
      <div
        className="theme-transition-ripple"
        style={{
          position: "fixed",
          top: overlayOrigin.y,
          left: overlayOrigin.x,
          width: "40px",
          height: "40px",
          marginLeft: "-20px",
          marginTop: "-20px",
          borderRadius: "50%",
          border: `2px solid ${backgroundColor}`,
          animation: `${rippleAnimationName} 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
          zIndex: 100000,
          pointerEvents: "none",
          opacity: 0.5,
        }}
      />
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes ${animationName} {
            0% {
              clip-path: circle(0px at ${overlayOrigin.x}px ${overlayOrigin.y}px);
            }
            100% {
              clip-path: circle(${maxRadius * 1.2}px at ${overlayOrigin.x}px ${overlayOrigin.y}px);
            }
          }
          @keyframes ${rippleAnimationName} {
            0% {
              transform: scale(1);
              opacity: 0.5;
            }
            100% {
              transform: scale(${maxRadius / 20});
              opacity: 0;
            }
          }
        `
      }} />
    </>
  )
}
