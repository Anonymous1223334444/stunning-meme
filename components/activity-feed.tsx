"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Info, User, Clock, RefreshCw, Activity, Zap, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface Activity {
  id: number
  type: string
  title: string
  description: string
  timestamp: string
  user: string
}

interface ActivityFeedProps {
  activities: Activity[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [hoveredActivity, setHoveredActivity] = useState<number | null>(null)

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 drop-shadow-sm" />
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400 drop-shadow-sm" />
      case "update":
        return <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 drop-shadow-sm" />
      default:
        return <Clock className="h-5 w-5 text-slate-600 dark:text-slate-400 drop-shadow-sm" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "success":
        return "border-emerald-500/30 bg-emerald-50/80 dark:bg-emerald-950/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
      case "alert":
        return "border-rose-500/30 bg-rose-50/80 dark:bg-rose-950/30 hover:bg-rose-50 dark:hover:bg-rose-950/50"
      case "update":
        return "border-blue-500/30 bg-blue-50/80 dark:bg-blue-950/30 hover:bg-blue-50 dark:hover:bg-blue-950/50"
      default:
        return "border-slate-500/30 bg-slate-50/80 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/50"
    }
  }

  const getActivityBadge = (type: string) => {
    switch (type) {
      case "success":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/50 text-xs">
            <CheckCircle className="w-3 h-3 mr-1" />
            Succès
          </Badge>
        )
      case "alert":
        return (
          <Badge className="bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/50 text-xs animate-pulse-soft">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Alerte
          </Badge>
        )
      case "update":
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800/50 text-xs">
            <Info className="w-3 h-3 mr-1" />
            Mise à jour
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="text-xs">
            <Clock className="w-3 h-3 mr-1" />
            Standard
          </Badge>
        )
    }
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 2000)
  }

  const formatRelativeTime = (timestamp: string) => {
    const now = new Date()
    const activityTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return "À l'instant"
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes}min`
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`
    return `Il y a ${Math.floor(diffInMinutes / 1440)}j`
  }

  return (
    <Card className="kpi-card hover:shadow-xl transition-all duration-500 animate-scale-in group">
      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/[0.02] to-primary/[0.05] dark:via-primary/[0.05] dark:to-primary/[0.08] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
      
      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-3">
            <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-xl">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span className="font-bold">Activités Récentes</span>
              <p className="text-sm text-muted-foreground font-normal mt-1">
                Dernières mises à jour du projet
              </p>
            </div>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
              {activities.length} activités
            </Badge>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleRefresh} 
              disabled={isRefreshing} 
              className="h-10 w-10 hover:bg-accent/50 transition-all duration-300 hover:scale-110 rounded-xl group/refresh"
            >
              <RefreshCw className={cn(
                "h-5 w-5 transition-all duration-300",
                isRefreshing ? "animate-spin text-primary" : "text-muted-foreground group-hover/refresh:text-foreground"
              )} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 relative z-10">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className={cn(
              "group/item p-4 rounded-xl border backdrop-blur-sm transition-all duration-500 cursor-pointer",
              getActivityColor(activity.type),
              "hover:shadow-lg hover:scale-[1.01] animate-slide-in-staggered",
              hoveredActivity === activity.id && "scale-[1.01] shadow-lg"
            )}
            style={{ animationDelay: `${index * 0.1}s` }}
            onMouseEnter={() => setHoveredActivity(activity.id)}
            onMouseLeave={() => setHoveredActivity(null)}
          >
            {/* Content wrapper */}
            <div className="flex items-start space-x-4 relative">
              {/* Icon with enhanced styling */}
              <div className="mt-1 flex-shrink-0 transition-all duration-300 group-hover/item:scale-110 relative">
                <div className="p-2 bg-background/50 dark:bg-background/30 rounded-xl backdrop-blur-sm border border-border/50">
                  {getActivityIcon(activity.type)}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 space-y-3">
                {/* Title and badge */}
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-sm font-semibold text-foreground leading-tight text-balance line-clamp-2 flex-1">
                    {activity.title}
                  </h4>
                  {getActivityBadge(activity.type)}
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground/90 leading-relaxed text-pretty line-clamp-2">
                  {activity.description}
                </p>

                {/* Footer with user and timestamp */}
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div className="flex items-center text-xs text-muted-foreground space-x-2">
                    <div className="flex items-center space-x-1.5 bg-background/50 dark:bg-background/30 rounded-full px-2.5 py-1 backdrop-blur-sm">
                      <User className="h-3 w-3" />
                      <span className="font-medium">{activity.user}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground font-medium bg-background/50 dark:bg-background/30 rounded-full px-2.5 py-1 backdrop-blur-sm">
                      {formatRelativeTime(activity.timestamp)}
                    </span>
                    <ArrowRight className={cn(
                      "w-3 h-3 text-muted-foreground/50 transition-all duration-300",
                      hoveredActivity === activity.id && "text-foreground translate-x-1"
                    )} />
                  </div>
                </div>
              </div>
            </div>

          </div>
        ))}

        {/* Empty state */}
        {activities.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-16 h-16 bg-muted/20 dark:bg-muted/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group">
              <Clock className="h-8 w-8 text-muted-foreground/50 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="font-medium text-foreground mb-2">Aucune activité récente</h3>
            <p className="text-sm text-muted-foreground">Les nouvelles activités apparaîtront ici</p>
          </div>
        )}

        {/* View all activities button */}
        {activities.length > 0 && (
          <div className="pt-4 border-t border-border/50">
            <Button 
              variant="ghost" 
              className="w-full h-12 hover:bg-accent/50 transition-all duration-300 group/view-all rounded-xl"
            >
              <span className="mr-2">Voir toutes les activités</span>
              <ArrowRight className="w-4 h-4 group-hover/view-all:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        )}
      </CardContent>

      {/* Loading indicator */}
      {isRefreshing && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary/20 rounded-t-xl overflow-hidden" />
      )}
    </Card>
  )
}
