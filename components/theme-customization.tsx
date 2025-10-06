"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Moon, Sun, Palette, Contrast, Monitor, SwatchBook } from "lucide-react"
import { useTheme } from "next-themes"
import { useThemeTransition } from "@/hooks/use-theme-transition.tsx"
import { useThemeSettings } from "@/contexts/theme-settings-context"

const themePresets = [
  { id: "default", name: "Défaut", lightBg: "0.99 0.005 264", darkBg: "0.08 0.015 264", lightFg: "0.145 0.015 264", darkFg: "0.97 0.008 264" },
  { id: "ocean", name: "Océan", lightBg: "0.92 0.015 220", darkBg: "0.1 0.025 220", lightFg: "0.145 0.015 220", darkFg: "0.97 0.008 220" },
  { id: "sunset", name: "Coucher de soleil", lightBg: "0.97 0.025 40", darkBg: "0.15 0.03 40", lightFg: "0.145 0.015 40", darkFg: "0.97 0.008 40" },
  { id: "forest", name: "Forêt", lightBg: "0.9 0.02 140", darkBg: "0.12 0.03 140", lightFg: "0.145 0.015 140", darkFg: "0.97 0.008 140" },
  { id: "lavender", name: "Lavande", lightBg: "0.94 0.02 280", darkBg: "0.14 0.025 280", lightFg: "0.145 0.015 280", darkFg: "0.97 0.008 280" },
]

export function ThemeCustomization() {
  const { theme, setTheme, themes } = useTheme()
  const { setThemeWithTransition } = useThemeTransition()
  const { accentColor, setAccentColor, saturation, setSaturation, contrast, setContrast, isRounded, setIsRounded } = useThemeSettings()
  const [isMounted, setIsMounted] = useState(false)
  const [activePreset, setActivePreset] = useState("default")

  useEffect(() => {
    setIsMounted(true)
    
    // Load saved preset from localStorage if it exists
    const savedPreset = localStorage.getItem('theme-preset')
    if (savedPreset) setActivePreset(savedPreset)
  }, [])

  const handlePresetChange = (presetId: string) => {
    setActivePreset(presetId)
    localStorage.setItem('theme-preset', presetId)
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300 rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Personnalisation du Thème
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="theme-mode">Mode Thème</Label>
            <div className="flex items-center space-x-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={(e) => setThemeWithTransition("light", { x: e.clientX || window.innerWidth / 2, y: e.clientY || 40 })}
                className="px-3"
              >
                <Sun className="h-4 w-4 mr-1" />
                Clair
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={(e) => setThemeWithTransition("dark", { x: e.clientX || window.innerWidth / 2, y: e.clientY || 40 })}
                className="px-3"
              >
                <Moon className="h-4 w-4 mr-1" />
                Sombre
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("system")}
                className="px-3"
              >
                <Monitor className="h-4 w-4 mr-1" />
                Système
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label>Préréglages de thème</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {themePresets.map((preset) => (
              <Button
                key={preset.id}
                variant={activePreset === preset.id ? "default" : "outline"}
                size="sm"
                onClick={() => handlePresetChange(preset.id)}
                className="flex flex-col items-center justify-center h-auto py-3"
              >
                <div className="w-6 h-6 rounded-full mb-1 border" 
                  style={{ 
                    background: `oklch(${preset.lightBg})`
                  }} 
                />
                <span className="text-xs">{preset.name}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label htmlFor="accent-color">Couleur d'accentuation</Label>
          <div className="flex items-center gap-3">
            <div className="grid grid-cols-6 gap-2 flex-1">
              {[
                "#3b82f6", "#ef4444", "#10b981", "#f59e0b", 
                "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"
              ].map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full border-2 ${accentColor === color ? 'border-primary ring-2 ring-offset-2 ring-primary/30' : 'border-border'}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setAccentColor(color)}
                  aria-label={`Couleur d'accentuation: ${color}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-10 h-10 border-0 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="saturation">Saturation</Label>
            <span className="text-sm text-muted-foreground">{saturation}%</span>
          </div>
          <Slider
            id="saturation"
            min={50}
            max={150}
            step={5}
            value={[saturation]}
            onValueChange={(value) => setSaturation(value[0])}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="contrast">Contraste</Label>
            <span className="text-sm text-muted-foreground">{contrast}%</span>
          </div>
          <Slider
            id="contrast"
            min={80}
            max={120}
            step={5}
            value={[contrast]}
            onValueChange={(value) => setContrast(value[0])}
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <Label htmlFor="rounded" className="text-base">
            Coins arrondis
          </Label>
          <Switch
            id="rounded"
            checked={isRounded}
            onCheckedChange={setIsRounded}
          />
        </div>
      </CardContent>
    </Card>
  )
}
