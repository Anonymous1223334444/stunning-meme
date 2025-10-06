"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, ChevronLeft, ChevronRight, Clock, Users, Target, FileText, AlertTriangle } from "lucide-react"

interface ProjectCalendarModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Sample project data for the calendar
const projectActivities = [
  { id: 1, title: "Audit Fibre SENUM", project: "Juridique", date: "2024-09-15", time: "10:00", status: "Terminé", priority: "normal", activity: "Audit et valorisation du patrimoine fibre optique SENUM SA" },
  { id: 2, title: "Analyse Impact Numérique", project: "Juridique", date: "2024-09-20", time: "14:00", status: "En cours", priority: "high", activity: "AT analyse impact numérique changement climatique" },
  { id: 3, title: "AMI Consultation", project: "Connectivité", date: "2024-09-22", time: "09:30", status: "Démarré", priority: "medium", activity: "Identification liaisons FO Casamance/Bassin arachidier" },
  { id: 4, title: "Survey Zones Blanches", project: "Connectivité", date: "2024-09-25", time: "11:00", status: "Terminé", priority: "normal", activity: "Survey zones blanches programme accès universel" },
  { id: 5, title: "Équipements ESS", project: "Adoption", date: "2024-10-02", time: "13:00", status: "Planifié", priority: "high", activity: "Équipements Espaces Sénégal Services (ESS)" },
  { id: 6, title: "Santé Numérique", project: "Santé", date: "2024-10-05", time: "15:00", status: "Planifié", priority: "high", activity: "Connexion internet haut débit salles télémédecine" },
  { id: 7, title: "Cybersécurité", project: "Juridique", date: "2024-10-10", time: "09:00", status: "En attente", priority: "high", activity: "Actualisation stratégie cybersécurité" },
  { id: 8, title: "Formation Numérique", project: "Adoption", date: "2024-10-15", time: "10:30", status: "Planifié", priority: "medium", activity: "AT stratégie renforcement compétences numériques" },
]

export default function ProjectCalendarModal({ open, onOpenChange }: ProjectCalendarModalProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Previous month days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i)
      days.push({ date: prevDate, isCurrentMonth: false })
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true })
    }

    // Next month days to complete the grid
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      days.push({ date: new Date(year, month + 1, day), isCurrentMonth: false })
    }

    return days
  }

  const getActivitiesForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return projectActivities.filter((act) => act.date === dateString)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
  ]

  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]

  // Get activity counts for the current month
  const monthActivities = projectActivities.filter(activity => {
    const activityDate = new Date(activity.date)
    return activityDate.getMonth() === currentDate.getMonth() && 
           activityDate.getFullYear() === currentDate.getFullYear()
  })
  
  const statusCounts = {
    Terminé: monthActivities.filter(a => a.status === "Terminé").length,
    "En cours": monthActivities.filter(a => a.status === "En cours").length,
    Démarré: monthActivities.filter(a => a.status === "Démarré").length,
    Planifié: monthActivities.filter(a => a.status === "Planifié").length,
    "En attente": monthActivities.filter(a => a.status === "En attente").length,
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Calendrier des Projets PAENS
          </DialogTitle>
          <DialogDescription>Planification et suivi des activités des différentes composantes</DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          {/* Calendar navigation */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Calendar grid header */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {dayNames.map((day) => (
              <div key={day} className="p-2 text-center font-medium text-sm text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentDate).map((day, index) => {
              const dayActivities = getActivitiesForDate(day.date)
              const isToday = day.date.toDateString() === new Date().toDateString()
              const hasActivities = dayActivities.length > 0

              return (
                <div
                  key={index}
                  className={`min-h-[120px] p-2 border rounded-lg transition-colors ${
                    day.isCurrentMonth
                      ? "bg-white dark:bg-slate-800"
                      : "bg-gray-50 dark:bg-slate-900 text-muted-foreground"
                  } ${isToday ? "ring-2 ring-blue-500" : ""} ${
                    hasActivities ? "bg-blue-50/30 dark:bg-blue-900/10" : ""
                  }`}
                >
                  <div className={`text-sm font-medium mb-1 ${isToday ? "text-blue-600 dark:text-blue-400" : ""}`}>
                    {day.date.getDate()}
                  </div>
                  <div className="space-y-1 overflow-y-auto max-h-20">
                    {dayActivities.slice(0, 3).map((act) => (
                      <div
                        key={act.id}
                        className={`text-xs p-1 rounded mb-1 truncate ${
                          act.status === "Terminé" 
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200" 
                            : act.status === "En cours" 
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200" 
                              : act.status === "Planifié"
                                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200"
                                : act.status === "En attente"
                                  ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                                  : "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200"
                        }`}
                      >
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{act.time}</span>
                        </div>
                        <div className="truncate font-medium">{act.title}</div>
                      </div>
                    ))}
                    {dayActivities.length > 3 && (
                      <div className="text-xs text-muted-foreground">+{dayActivities.length - 3} plus</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Legend and statistics */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Légende des Activités
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-100 dark:bg-green-900/30 rounded"></div>
                    <span className="text-sm">Terminé</span>
                  </div>
                  <Badge variant="outline">{statusCounts.Terminé}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900/30 rounded"></div>
                    <span className="text-sm">En Cours</span>
                  </div>
                  <Badge variant="outline">{statusCounts["En cours"]}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-amber-100 dark:bg-amber-900/30 rounded"></div>
                    <span className="text-sm">Démarré</span>
                  </div>
                  <Badge variant="outline">{statusCounts.Démarré}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-purple-100 dark:bg-purple-900/30 rounded"></div>
                    <span className="text-sm">Planifié</span>
                  </div>
                  <Badge variant="outline">{statusCounts.Planifié}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-100 dark:bg-red-900/30 rounded"></div>
                    <span className="text-sm">En Attente</span>
                  </div>
                  <Badge variant="outline">{statusCounts["En attente"]}</Badge>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 ring-2 ring-blue-500 rounded"></div>
                    <span className="text-sm">Aujourd'hui</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Statistiques du Mois
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    Total Activités:
                  </span>
                  <Badge variant="secondary" className="text-base font-medium">
                    {monthActivities.length}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Composante Juridique:
                    </span>
                    <Badge variant="outline">
                      {monthActivities.filter(a => a.project === "Juridique").length}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Composante Connectivité:
                    </span>
                    <Badge variant="outline">
                      {monthActivities.filter(a => a.project === "Connectivité").length}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Composante Adoption:
                    </span>
                    <Badge variant="outline">
                      {monthActivities.filter(a => a.project === "Adoption").length}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Composante Santé:
                    </span>
                    <Badge variant="outline">
                      {monthActivities.filter(a => a.project === "Santé").length}
                    </Badge>
                  </div>
                </div>
                
                {monthActivities.some(a => a.priority === "high") && (
                  <div className="mt-4 pt-2 border-t flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                      {monthActivities.filter(a => a.priority === "high").length} activités à haute priorité
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}