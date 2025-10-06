"use client"
import { Moon, Sun } from "lucide-react"
import { useThemeTransition } from "@/hooks/use-theme-transition.tsx"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { toggleTheme } = useThemeTransition()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={(e) => toggleTheme({ x: e.clientX, y: e.clientY })}
      className="h-9 w-9"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Basculer le thème</span>
    </Button>
  )
}
