"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock, TrendingUp, ArrowRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProjectCardProps {
  component: {
    id: number
    name: string
    icon: string
    budget: number
    progress: number
    activities: number
    blocked: number
    color: string
  }
  onClick?: () => void
}

export function ProjectCard({ component, onClick }: ProjectCardProps) {
  const getStatusIcon = () => {
    if (component.progress === 100) {
      return <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 drop-shadow-sm" />
    } else if (component.blocked > 2 || component.progress < 50) {
      return <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400 animate-pulse-soft drop-shadow-sm" />
    } else {
      return <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 drop-shadow-sm" />
    }
  }

  const getStatusBadge = () => {
    if (component.progress === 100) {
      return (
        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50 text-xs font-medium shadow-sm">
          <CheckCircle className="w-3 h-3 mr-1" />
          Terminé
        </Badge>
      )
    } else if (component.blocked > 2 || component.progress < 50) {
      return (
        <Badge className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/50 text-xs font-medium animate-pulse-soft shadow-sm">
          <AlertTriangle className="w-3 h-3 mr-1" />
          À Risque
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/50 text-xs font-medium shadow-sm">
          <TrendingUp className="w-3 h-3 mr-1" />
          En Cours
        </Badge>
      )
    }
  }

  const getProgressColor = () => {
    if (component.progress >= 80) return "from-emerald-500 to-emerald-600"
    if (component.progress >= 60) return "from-blue-500 to-blue-600"
    if (component.progress >= 40) return "from-yellow-500 to-yellow-600"
    return "from-rose-500 to-rose-600"
  }

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-500 ease-out cursor-pointer",
        "kpi-card hover:shadow-2xl",
        "hover:scale-[1.02] active:scale-[0.98] transform-gpu",
        "animate-scale-in border-l-4 hover:border-l-8 transition-all duration-300"
      )}
      style={{ 
        borderLeftColor: component.color,
        borderLeftWidth: '4px'
      }}
      onClick={onClick}
    >
      {/* Enhanced gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/[0.02] to-primary/[0.05] dark:via-primary/[0.05] dark:to-primary/[0.08] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div 
        className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500"
        style={{ backgroundColor: component.color }}
      />
      
      {/* Animated border glow */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-current/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
           style={{ color: component.color }} />

      <CardHeader className="pb-3 p-4 sm:p-5 lg:p-6 relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            <div className="relative">
              <span className="text-2xl sm:text-3xl lg:text-4xl flex-shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 drop-shadow-sm">
                {component.icon}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base sm:text-lg font-bold leading-tight text-balance line-clamp-2 mb-2">
                {component.name}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <p className="text-sm sm:text-base text-muted-foreground font-semibold">
                  <span className="hidden sm:inline">{component.budget} Mds FCFA</span>
                  <span className="sm:hidden">{component.budget}M FCFA</span>
                </p>
                <Badge 
                  variant="outline" 
                  className="text-xs bg-background/50 dark:bg-background/30 backdrop-blur-sm"
                  style={{ borderColor: component.color, color: component.color }}
                >
                  C{component.id}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 transition-all duration-500 group-hover:scale-110">
            {getStatusIcon()}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 sm:space-y-5 p-4 sm:p-5 lg:p-6 pt-0 relative z-10">
        {/* Progress section with enhanced styling */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground font-medium">Progression</span>
            <span className="text-lg sm:text-xl font-bold text-foreground">{component.progress}%</span>
          </div>
          
          <div className="relative">
            <Progress value={component.progress} className="h-3 sm:h-4" />
            <div 
              className={cn(
                "absolute top-0 left-0 h-full bg-gradient-to-r rounded-full transition-all duration-1000",
                getProgressColor()
              )}
              style={{ width: `${component.progress}%` }}
            >
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-background/50 dark:bg-background/30 rounded-xl p-3 border border-border/50 backdrop-blur-sm transition-all duration-300 group-hover:bg-background/70 dark:group-hover:bg-background/50">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-muted-foreground">Activités</span>
              <ArrowRight className="w-3 h-3 text-muted-foreground/50 group-hover:text-foreground transition-colors" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-foreground">{component.activities}</span>
          </div>
          
          <div className={cn(
            "rounded-xl p-3 border border-border/50 backdrop-blur-sm transition-all duration-300",
            component.blocked > 0 
              ? "bg-rose-50/80 dark:bg-rose-950/30 group-hover:bg-rose-50 dark:group-hover:bg-rose-950/50" 
              : "bg-emerald-50/80 dark:bg-emerald-950/30 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/50"
          )}>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-muted-foreground">Bloquées</span>
              {component.blocked > 0 && <AlertTriangle className="w-3 h-3 text-rose-500 animate-pulse" />}
            </div>
            <span className={cn(
              "text-lg sm:text-xl font-bold",
              component.blocked > 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"
            )}>
              {component.blocked}
            </span>
          </div>
        </div>

        {/* Status badge */}
        <div className="flex items-center justify-between pt-2">
          {getStatusBadge()}
          
          <div className="flex items-center space-x-1 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>Voir détails</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
        
        {/* Bottom accent line with enhanced animation */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out opacity-60"
          style={{ color: component.color }}
        />
        
        {/* Subtle shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 dark:via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out opacity-0 group-hover:opacity-100 pointer-events-none" />
        
        {/* Corner accent */}
        <div 
          className="absolute top-0 right-0 w-16 h-16 opacity-10 group-hover:opacity-20 transition-opacity duration-500"
          style={{ 
            background: `radial-gradient(circle at top right, ${component.color} 0%, transparent 70%)`
          }}
        />
      </CardContent>
    </Card>
  )
}
