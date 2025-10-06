"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react"

interface ModernMetricProps {
  title: string
  value: string | number
  change?: string
  trend?: "up" | "down" | "neutral"
  icon: LucideIcon
  color?: string
  bgColor?: string
  onClick?: () => void
}

export function ModernMetric({
  title,
  value,
  change,
  trend = "neutral",
  icon: Icon,
  color = "text-blue-600 dark:text-blue-400",
  bgColor = "bg-blue-50 dark:bg-blue-900/50",
  onClick,
}: ModernMetricProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
      case "down":
        return <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
      default:
        return <Minus className="h-3 w-3 text-gray-400 dark:text-gray-500" />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950/30 border-green-200 dark:border-green-800"
      case "down":
        return "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/30 border-red-200 dark:border-red-800"
      default:
        return "text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-950/30 border-gray-200 dark:border-gray-700"
    }
  }

  return (
    <Card
      className={cn(
        "relative overflow-hidden border shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group",
        "bg-gradient-to-br from-card to-card/80 dark:from-slate-900 dark:to-slate-800 dark:border-slate-700",
        "hover:scale-[1.02] active:scale-[0.98]",
        "animate-scale-in",
        onClick && "hover:shadow-xl"
      )}
      onClick={onClick}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10 dark:via-white/2 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Animated border */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
           style={{ padding: '1px' }}>
        <div className="w-full h-full bg-card rounded-lg" />
      </div>

      <CardContent className="relative p-4 sm:p-5 lg:p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 sm:space-y-3 flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate leading-tight">
              {title}
            </p>

            <div className="flex items-baseline space-x-2">
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-none">
                {value}
              </p>
              {trend === "up" && (
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <TrendingUp className="h-4 w-4" />
                </div>
              )}
            </div>

            {change && (
              <div className="flex items-center space-x-1.5">
                {getTrendIcon()}
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-xs font-medium px-2 py-0.5 transition-all duration-200 border",
                    getTrendColor()
                  )}
                >
                  <span className="hidden sm:inline">{change}</span>
                  <span className="sm:hidden">{change.split(" ")[0]}</span>
                </Badge>
              </div>
            )}
          </div>

          <div className="relative">
            <div
              className={cn(
                "p-2.5 sm:p-3 lg:p-4 rounded-xl flex-shrink-0 transition-all duration-300",
                bgColor,
                "group-hover:scale-110 group-hover:rotate-3",
                "shadow-sm group-hover:shadow-md"
              )}
            >
              <Icon className={cn("h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 transition-colors duration-200", color)} />
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      </CardContent>
    </Card>
  )
}