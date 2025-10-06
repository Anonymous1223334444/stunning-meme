"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  ChartBar as BarChart3, Calendar, Users, Target, TriangleAlert as AlertTriangle, 
  FileText, Settings, ChevronLeft, ChevronRight, Chrome as Home, TrendingUp, 
  Menu, X, Sparkles, Zap, Activity, ArrowRight, Dot, Search
} from "lucide-react"

import { organizationMembers } from "@/components/team-members-grid";
import { UserProfile } from "@/lib/supabase";

import { UserProfile } from "@/lib/supabase";

interface ModernSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  user: UserProfile | null;
}

const totalMembers = Object.values(organizationMembers).reduce((acc, members) => acc + members.length, 0);

const menuItems = [
  {
    id: "vue-ensemble",
    label: "Tableau de bord",
    icon: Home,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50/80 dark:bg-blue-950/50",
    gradient: "from-blue-500/10 via-blue-400/5 to-blue-600/10",
    description: "Vue d'ensemble",
  },
  {
    id: "analytiques",
    label: "Analytiques",
    icon: TrendingUp,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50/80 dark:bg-emerald-950/50",
    gradient: "from-emerald-500/10 via-emerald-400/5 to-emerald-600/10",
    description: "Analyses détaillées",
  },
  {
    id: "calendrier",
    label: "Calendrier",
    icon: Calendar,
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-50/80 dark:bg-violet-950/50",
    gradient: "from-violet-500/10 via-violet-400/5 to-violet-600/10",
    description: "Planification",
  },
  {
    id: "equipe",
    label: "Équipes",
    icon: Users,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50/80 dark:bg-orange-950/50",
    gradient: "from-orange-500/10 via-orange-400/5 to-orange-600/10",
    description: "Gestion équipes",
    badge: totalMembers.toString(),
  },
  {
    id: "projets",
    label: "Projets",
    icon: BarChart3,
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-50/80 dark:bg-indigo-950/50",
    gradient: "from-indigo-500/10 via-indigo-400/5 to-indigo-600/10",
    description: "Suivi projets",
  },
  {
    id: "actions-bloquees",
    label: "Actions Bloquées",
    icon: AlertTriangle,
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-50/80 dark:bg-rose-950/50",
    gradient: "from-rose-500/10 via-rose-400/5 to-rose-600/10",
    description: "Actions bloquées",
    badge: "8",
    urgent: true,
  },
  {
    id: "rapports",
    label: "Rapports",
    icon: FileText,
    color: "text-teal-600 dark:text-teal-400",
    bgColor: "bg-teal-50/80 dark:bg-teal-950/50",
    gradient: "from-teal-500/10 via-teal-400/5 to-teal-600/10",
    description: "Rapports BM",
  },
  {
    id: "objectifs",
    label: "Objectifs",
    icon: Target,
    color: "text-pink-600 dark:text-pink-400",
    bgColor: "bg-pink-50/80 dark:bg-pink-950/50",
    gradient: "from-pink-500/10 via-pink-400/5 to-pink-600/10",
    description: "Objectifs projet",
  },
  {
    id: "parametres",
    label: "Paramètres",
    icon: Settings,
    color: "text-slate-600 dark:text-slate-400",
    bgColor: "bg-slate-50/80 dark:bg-slate-950/50",
    gradient: "from-slate-500/10 via-slate-400/5 to-slate-600/10",
    description: "Configuration",
  },
]

export function ModernSidebar({ activeTab, onTabChange, collapsed, setCollapsed, user }: ModernSidebarProps) {

  const [mobileOpen, setMobileOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [mobileOpen])

  return (
    <>
      {/* Enhanced mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 mobile-menu-overlay z-40 lg:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Enhanced sidebar container */}
      <div
        className={cn(
          "flex flex-col glass-effect-strong border-r border-sidebar-border z-50 relative",
          "fixed inset-y-0 left-0 h-screen",
          // Desktop sizing with enhanced transitions
          "lg:transition-all lg:duration-700 lg:ease-[cubic-bezier(0.4,0,0.2,1)]",
          collapsed ? "lg:w-20" : "lg:w-80",
          // Mobile sizing
          "w-80 sm:w-96",
          // Mobile positioning with smooth transitions
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0 lg:shadow-none",
          "transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
        )}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-sidebar via-sidebar/95 to-sidebar/90 opacity-95" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] via-transparent to-primary/[0.03] opacity-0 hover:opacity-100 transition-opacity duration-1000" />

        {/* Enhanced Header */}
        <div className="relative flex items-center justify-between p-6 border-b border-sidebar-border/60 min-h-[5rem] bg-gradient-to-r from-sidebar to-sidebar/90">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-50" />
          
          {(!collapsed || mobileOpen) && (
            <div className="flex items-center space-x-4 flex-1 min-w-0 animate-slide-in z-10">
              <div className="relative group">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl ring-2 ring-primary/10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <span className="text-white font-bold text-lg animate-float">🇸🇳</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-sidebar animate-pulse-soft shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-sidebar-foreground text-xl truncate tracking-tight">PAENS</h2>
                <p className="text-sm text-sidebar-foreground/70 truncate flex items-center gap-2 mt-1">
                  Tableau de Bord Projet
                  <Zap className="w-3 h-3 text-yellow-500 animate-pulse" />
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex h-10 w-10 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-300 hover:scale-110 rounded-xl"
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5 transition-transform duration-300" />
              ) : (
                <ChevronLeft className="h-5 w-5 transition-transform duration-300" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(false)}
              className="lg:hidden h-10 w-10 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-300 hover:scale-110 rounded-xl"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Enhanced User Profile */}
        <div className="relative p-5 border-b border-sidebar-border/60 bg-gradient-to-r from-sidebar-accent/30 to-transparent">
          <div className="flex items-center space-x-4 animate-slide-in stagger-1">
            <div className="relative group">
              <Avatar className="h-14 w-14 flex-shrink-0 ring-4 ring-sidebar-primary/20 transition-all duration-500 group-hover:ring-sidebar-primary/40 group-hover:scale-105">
                <AvatarImage src={user?.avatar_url || "/placeholder-user.jpg"} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-bold">
                  {user?.full_name?.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-3 border-sidebar flex items-center justify-center shadow-lg">
                <Activity className="w-3 h-3 text-white animate-pulse" />
              </div>
            </div>
            {(!collapsed || mobileOpen) && (
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sidebar-foreground truncate text-lg">{user?.full_name || "Utilisateur"}</p>
                <p className="text-sm text-sidebar-foreground/70 truncate">{user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                    <Dot className="w-3 h-3 text-emerald-500 animate-pulse mr-1" />
                    En ligne
                  </Badge>
                </div>
              </div>
            )}
          </div>
          
          {/* Quick Stats Summary */}
          {(!collapsed || mobileOpen) && (
            <div className="mt-4 grid grid-cols-3 gap-2 pt-3 border-t border-sidebar-border/30">
              <div className="text-center">
                <div className="text-sm font-semibold text-emerald-500">34</div>
                <div className="text-[9px] opacity-75">En Cours</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-blue-500">12</div>
                <div className="text-[9px] opacity-75">Bloquées</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-purple-500">68%</div>
                <div className="text-[9px] opacity-75">Moy</div>
              </div>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="px-4 py-3 border-b border-sidebar-border/30">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full bg-sidebar/50 border border-sidebar-border/50 rounded-lg py-2 px-3 pl-9 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/30 transition-all"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sidebar-foreground/50" />
          </div>
        </div>
        
        {/* Enhanced Navigation */}
                <nav className="flex-1 p-3 flex flex-col justify-between overflow-y-auto scrollbar-thin">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            const isHovered = hoveredItem === item.id

            return (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Button
                  variant="ghost"
                  onClick={() => {
                    onTabChange(item.id)
                    setMobileOpen(false)
                  }}
                  className={cn(
                    "w-full justify-start h-14 px-4 transition-all duration-500 text-sm group relative overflow-hidden rounded-2xl",
                    "animate-slide-in-staggered",
                    collapsed ? "px-3" : "px-4",
                    isActive
                      ? `bg-gradient-to-r ${item.gradient} ${item.color} hover:${item.bgColor} shadow-lg border border-current/10 scale-105`
                      : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/60",
                    "hover:scale-105 hover:shadow-lg transform-gpu",
                    item.urgent && !isActive && "animate-pulse-soft"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Enhanced ripple effect */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-r from-transparent via-current/5 to-transparent transition-transform duration-1000",
                    isHovered ? "translate-x-0" : "-translate-x-full"
                  )} />
                  
                  <div className={cn(
                    "flex items-center justify-center rounded-xl p-2 mr-3 transition-all duration-500",
                    item.bgColor,
                    collapsed ? "mx-auto mr-0" : "mr-3",
                    isActive ? "shadow-lg scale-110" : "shadow-sm group-hover:scale-110"
                  )}>
                    <Icon className={cn(
                      "h-5 w-5 transition-all duration-300",
                      item.color,
                      isActive && "drop-shadow-sm"
                    )} />
                  </div>
                  
                  {(!collapsed || mobileOpen) && (
                    <>
                      <div className="flex-1 text-left">
                        <div className="font-semibold truncate">{item.label}</div>
                        <div className="text-xs text-current/60 truncate">{item.description}</div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {item.badge && (
                          <Badge 
                            variant={item.urgent ? "destructive" : "secondary"}
                            className={cn(
                              "h-6 px-2 text-xs flex-shrink-0 shadow-lg transition-all duration-300",
                              item.urgent && "animate-pulse-soft shadow-rose-500/25"
                            )}
                          >
                            {item.badge}
                          </Badge>
                        )}
                        
                        {isActive && (
                          <ArrowRight className="h-4 w-4 text-current/60 animate-pulse-soft" />
                        )}
                      </div>
                    </>
                  )}
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-current rounded-l-full animate-scale-in" />
                  )}
                </Button>

                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className={cn(
                    "absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-2 bg-popover border border-border rounded-lg shadow-lg z-50 transition-all duration-300 pointer-events-none",
                    isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                  )}>
                    <div className="font-medium text-sm">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  </div>
                )}
              </div>
            )
          })}
        </nav>

      </div>

      {/* Enhanced Mobile Trigger */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setMobileOpen(true)}
        className={cn(
          "fixed top-6 left-6 z-50 lg:hidden h-12 w-12 shadow-xl backdrop-blur-lg",
          "bg-background/90 border-border/50 hover:bg-background hover:shadow-2xl",
          "transition-all duration-500 hover:scale-110 rounded-2xl",
          "ring-1 ring-primary/10 hover:ring-primary/20",
          mobileOpen && "opacity-0 pointer-events-none scale-75 rotate-180",
        )}
      >
        <Menu className="h-6 w-6" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl" />
      </Button>
    </>
  )
}