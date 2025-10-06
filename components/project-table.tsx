"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Search, Filter, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

interface Activity {
  id: number
  activity: string
  responsible: string
  component: number
  tdr_done: boolean
  marche_done: boolean
  contract_done: boolean
  progress: number
  status: string
  priority: string
  comment: string
}

interface Component {
  id: number
  name: string
  icon: string
}

interface ProjectTableProps {
  activities: Activity[]
  components: Component[]
  searchQuery: string
  selectedFilter: string
  onFilterChange: (filter: string) => void
}

export function ProjectTable({
  activities,
  components,
  searchQuery,
  selectedFilter,
  onFilterChange,
}: ProjectTableProps) {
  const [localSearch, setLocalSearch] = useState("")

  const filteredActivities = useMemo(() => {
    let filtered = activities

    // Filter by component
    if (selectedFilter !== "all") {
      filtered = filtered.filter((activity) => activity.component.toString() === selectedFilter)
    }

    // Search functionality
    const query = (searchQuery || localSearch).toLowerCase()
    if (query) {
      filtered = filtered.filter(
        (activity) =>
          activity.activity.toLowerCase().includes(query) ||
          activity.responsible.toLowerCase().includes(query) ||
          activity.status.toLowerCase().includes(query) ||
          activity.comment.toLowerCase().includes(query),
      )
    }

    return filtered
  }, [activities, selectedFilter, searchQuery, localSearch])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Terminé":
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Terminé</Badge>
      case "Bloqué":
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Bloqué</Badge>
      case "En cours":
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">En cours</Badge>
      case "Démarré":
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Démarré</Badge>
      default:
        return <Badge className="bg-gray-500/10 text-gray-600 border-gray-500/20">{status}</Badge>
    }
  }

  const getPriorityIndicator = (priority: string) => {
    switch (priority) {
      case "high":
        return <div className="w-3 h-3 rounded-full bg-red-500" title="Priorité élevée"></div>
      case "medium":
        return <div className="w-3 h-3 rounded-full bg-yellow-500" title="Priorité moyenne"></div>
      default:
        return <div className="w-3 h-3 rounded-full bg-green-500" title="Priorité normale"></div>
    }
  }

  const getComponentName = (componentId: number) => {
    const component = components.find((c) => c.id === componentId)
    return component ? `${component.icon} ${component.name}` : "N/A"
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher une activité..."
            className="pl-10"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange("all")}
          >
            Toutes
          </Button>
          {components.map((component) => (
            <Button
              key={component.id}
              variant={selectedFilter === component.id.toString() ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange(component.id.toString())}
            >
              {component.icon} {component.name.split(" ")[0]}
            </Button>
          ))}
        </div>
      </div>

      <Card className="hover:shadow-lg transition-all duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Toutes les Activités ({filteredActivities.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Activité</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Responsable</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Composante</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">TDR</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Marché</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Contrat</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Progression</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Statut</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Priorité</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {filteredActivities.map((activity) => (
                  <tr
                    key={activity.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-4">
                      <div className="max-w-xs">
                        <p className="font-medium text-foreground text-sm leading-tight">{activity.activity}</p>
                        {activity.comment && (
                          <p className="text-xs text-muted-foreground mt-1 truncate">{activity.comment}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline" className="font-medium">
                        {activity.responsible}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-sm">{getComponentName(activity.component)}</td>
                    <td className="py-4 px-4 text-center">
                      {activity.tdr_done ? (
                        <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {activity.marche_done ? (
                        <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {activity.contract_done ? (
                        <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Progress value={activity.progress} className="w-16 h-2" />
                        <span className="text-sm font-medium min-w-[3rem]">{activity.progress}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">{getStatusBadge(activity.status)}</td>
                    <td className="py-4 px-4 text-center">{getPriorityIndicator(activity.priority)}</td>
                    <td className="py-4 px-4 text-center">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredActivities.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                <p>Aucune activité trouvée</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
