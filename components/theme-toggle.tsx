"use client"
import { Moon, Sun } from "lucide-react"
import { useThemeTransition } from "@/hooks/use-theme-transition.tsx"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { toggleTheme, isTransitioning } = useThemeTransition()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={(e) => toggleTheme({ x: e.clientX, y: e.clientY })}
      className="h-9 w-9 relative overflow-hidden hover:bg-accent/50 transition-all duration-200"
      disabled={isTransitioning}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 ease-in-out dark:-rotate-180 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-180 scale-0 transition-all duration-300 ease-in-out dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Basculer le thème</span>
    </Button>
  )
}
