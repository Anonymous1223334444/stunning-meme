"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  FolderOpen,
  BarChart3,
  Users,
  Settings,
  Calendar,
  FileText,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Target,
} from "lucide-react"

const navigation = [
  { name: "Vue d'Ensemble", icon: LayoutDashboard, current: true, badge: null, key: "vue-ensemble" },
  { name: "Projets", icon: FolderOpen, current: false, badge: "25", key: "projets" },
  { name: "Analytiques", icon: BarChart3, current: false, badge: null, key: "analytiques" },
  { name: "Équipe", icon: Users, current: false, badge: "12", key: "equipe" },
  { name: "Calendrier", icon: Calendar, current: false, badge: null, key: "calendrier" },
  { name: "Rapports BM", icon: FileText, current: false, badge: null, key: "rapports" },
  { name: "Actions Bloquées", icon: AlertTriangle, current: false, badge: "8", key: "actions-bloquees" },
  { name: "Objectifs", icon: Target, current: false, badge: null, key: "objectifs" },
]

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={`bg-card border-r border-border transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">🇸🇳</span>
              </div>
              <div>
                <span className="font-bold text-foreground text-sm">PAENS</span>
                <div className="text-xs text-muted-foreground">Tableau de bord BM</div>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => (
            <Button
              key={item.name}
              variant={activeTab === item.key ? "secondary" : "ghost"}
              className={`w-full justify-start hover:bg-muted transition-colors ${
                activeTab === item.key ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
              } ${collapsed ? "px-2" : "px-3"}`}
              onClick={() => onTabChange(item.key)}
            >
              <item.icon className={`h-4 w-4 ${collapsed ? "" : "mr-3"}`} />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left text-sm">{item.name}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Button>
          ))}
        </nav>

        {/* Project Info */}
        {!collapsed && (
          <div className="border-t border-border p-4">
            <div className="space-y-3">
              <div className="text-xs text-muted-foreground">Projet PAENS</div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Budget :</span>
                  <span className="font-medium">89.98 Mds</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Progression :</span>
                  <span className="font-medium text-blue-600">68%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Coordinateur :</span>
                  <span className="font-medium">S. SENE</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-border p-4">
          <Button
            variant="ghost"
            className={`w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ${
              collapsed ? "px-2" : "px-3"
            }`}
            onClick={() => onTabChange("parametres")}
          >
            <Settings className={`h-4 w-4 ${collapsed ? "" : "mr-3"}`} />
            {!collapsed && <span className="text-sm">Paramètres</span>}
          </Button>
        </div>
      </div>
    </div>
  )
}
