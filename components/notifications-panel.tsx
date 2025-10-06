"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Bell, 
  X, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  MessageCircle,
  ScrollText,
  TrendingUp,
  Clock,
  Mail,
  Settings
} from "lucide-react"

interface Notification {
  id: string
  title: string
  description: string
  timestamp: string
  type: "info" | "warning" | "error" | "success" | "alert"
  read: boolean
  priority: "low" | "medium" | "high"
}

export function NotificationsPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Mock notification data
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: "1",
        title: "Projet Connectivité - Retard",
        description: "Le projet pilote 20 localités est en retard de 2 semaines",
        timestamp: "Il y a 30 min",
        type: "warning",
        read: false,
        priority: "high"
      },
      {
        id: "2",
        title: "Nouveau rapport disponible",
        description: "Le rapport mensuel de la composante Juridique est prêt",
        timestamp: "Il y a 2h",
        type: "info",
        read: false,
        priority: "medium"
      },
      {
        id: "3",
        title: "Tâche terminée",
        description: "L'audit du patrimoine fibre optique est terminé",
        timestamp: "Hier",
        type: "success",
        read: true,
        priority: "low"
      },
      {
        id: "4",
        title: "Réunion de coordination",
        description: "Réunion prévue pour la semaine prochaine",
        timestamp: "Il y a 1 jour",
        type: "info",
        read: true,
        priority: "medium"
      },
      {
        id: "5",
        title: "Budget dépassé",
        description: "La composante Santé a dépassé son budget de 15%",
        timestamp: "Il y a 3 jours",
        type: "error",
        read: false,
        priority: "high"
      }
    ]
    
    setNotifications(mockNotifications)
    setUnreadCount(mockNotifications.filter(n => !n.read).length)
  }, [])

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success": return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning": return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "error": return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "alert": return <Bell className="h-5 w-5 text-orange-500" />
      default: return <Bell className="h-5 w-5 text-blue-500" />
    }
  }

  const getPriorityBadge = (priority: Notification["priority"]) => {
    switch (priority) {
      case "high": return <Badge variant="destructive" className="text-xs">Élevée</Badge>
      case "medium": return <Badge variant="secondary" className="text-xs bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">Moyenne</Badge>
      case "low": return <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-600 dark:text-green-400">Faible</Badge>
      default: return <Badge variant="secondary" className="text-xs">Normale</Badge>
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
    setUnreadCount(prev => prev - 1)
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const toggleReadStatus = (id: string) => {
    const notification = notifications.find(n => n.id === id)
    if (notification) {
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: !n.read } : n
      ))
      if (notification.read) {
        setUnreadCount(prev => prev + 1)
      } else {
        setUnreadCount(prev => prev - 1)
      }
    }
  }

  return (
    <>
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 hover:bg-accent/50 transition-all duration-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-background bg-red-500 text-xs text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </div>

      {isOpen && (
        <div className="fixed top-16 right-4 z-50 w-80 max-h-[calc(100vh-5rem)] bg-background border border-border rounded-lg shadow-lg overflow-hidden animate-slide-in">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} non lues
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={markAllAsRead}
                title="Tout marquer comme lu"
              >
                <Mail className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setIsOpen(false)}
                title="Fermer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(100vh-8rem)]">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <Bell className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>Aucune notification</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 hover:bg-accent/50 transition-colors cursor-pointer relative ${
                      !notification.read ? "bg-accent/20" : ""
                    }`}
                    onClick={() => toggleReadStatus(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`text-sm font-medium ${!notification.read ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                            {notification.title}
                          </h4>
                          {getPriorityBadge(notification.priority)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {notification.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.timestamp}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="h-2 w-2 bg-blue-500 rounded-full self-center" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-border bg-muted/10 flex items-center justify-between">
            <Button variant="link" className="text-xs text-muted-foreground hover:text-foreground p-0 h-auto">
              Voir tout
            </Button>
            <Button variant="ghost" size="sm" className="h-7">
              <Settings className="h-3 w-3 mr-1" />
              Paramètres
            </Button>
          </div>
        </div>
      )}

      {/* Backdrop when panel is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}