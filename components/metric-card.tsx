"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  change: string
  trend: "up" | "down" | "neutral"
  icon: React.ReactNode
  variant?: "default" | "warning" | "success"
  onClick?: () => void
}

export function MetricCard({ title, value, change, trend, icon, variant = "default", onClick }: MetricCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3" />
      case "down":
        return <TrendingDown className="h-3 w-3" />
      default:
        return <Minus className="h-3 w-3" />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-muted-foreground"
    }
  }

  const getCardStyle = () => {
    const baseStyle = "transition-all duration-200 hover:shadow-lg"
    const clickableStyle = onClick ? "cursor-pointer hover:scale-[1.02]" : ""

    switch (variant) {
      case "warning":
        return `${baseStyle} ${clickableStyle} border-orange-500/20 bg-orange-500/5 hover:bg-orange-500/10`
      case "success":
        return `${baseStyle} ${clickableStyle} border-green-500/20 bg-green-500/5 hover:bg-green-500/10`
      default:
        return `${baseStyle} ${clickableStyle} hover:bg-muted/50`
    }
  }

  return (
    <Card className={getCardStyle()} onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
        <div className={`flex items-center text-xs ${getTrendColor()}`}>
          {getTrendIcon()}
          <span className="ml-1">{change}</span>
        </div>
      </CardContent>
    </Card>
  )
}
