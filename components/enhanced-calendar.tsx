"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Clock, Users, AlertTriangle, CheckCircle, PlayCircle, Eye } from "lucide-react"

// Données des équipes avec membres détaillés
const teamMembers = {
  SENUM: [
    { name: "Amadou DIALLO", role: "Chef d'équipe", expertise: "Architecture Numérique", status: "actif" },
    { name: "Fatou NDIAYE", role: "Analyste Système", expertise: "Intégration Services", status: "actif" },
    { name: "Moussa KANE", role: "Développeur", expertise: "Plateforme Gouvernementale", status: "actif" },
    { name: "Aïcha FALL", role: "Consultante UX", expertise: "Expérience Utilisateur", status: "actif" },
  ],
  ARTP: [
    { name: "Ousmane SARR", role: "Directeur Technique", expertise: "Réglementation Télécom", status: "actif" },
    { name: "Mariama DIOP", role: "Juriste Numérique", expertise: "Cadre Légal", status: "actif" },
    { name: "Ibrahima SECK", role: "Analyste Spectre", expertise: "Gestion Fréquences", status: "actif" },
  ],
  DTIC: [
    { name: "Cheikh MBAYE", role: "Expert Cybersécurité", expertise: "Sécurité Numérique", status: "actif" },
    { name: "Ndeye GUEYE", role: "Analyste Politique", expertise: "Stratégie Numérique", status: "actif" },
  ],
  DT: [
    { name: "Mamadou THIAM", role: "Ingénieur Télécom", expertise: "Infrastructure Fibre", status: "actif" },
    { name: "Khady DIAGNE", role: "Coordinatrice Projet", expertise: "Gestion Technique", status: "actif" },
  ],
  FDSUT: [
    { name: "Alioune NDOYE", role: "Responsable Accès Universel", expertise: "Zones Blanches", status: "actif" },
    { name: "Binta SOW", role: "Ingénieure Réseau", expertise: "Connectivité Rurale", status: "actif" },
    { name: "Modou FAYE", role: "Technicien Terrain", expertise: "Déploiement Infrastructure", status: "actif" },
  ],
  CSSDOS: [
    { name: "Dr. Aminata TOURE", role: "Directrice e-Santé", expertise: "Télémédecine", status: "actif" },
    { name: "Babacar DIENG", role: "Ingénieur Biomédical", expertise: "Équipements Médicaux", status: "actif" },
    { name: "Coumba NIANG", role: "Gestionnaire Données", expertise: "Dossiers Électroniques", status: "actif" },
    { name: "Seydou CAMARA", role: "Technicien IT", expertise: "Infrastructure Santé", status: "actif" },
  ],
  SCP: [
    { name: "Pape DIOUF", role: "Responsable Innovation", expertise: "Start-up Numérique", status: "actif" },
    { name: "Rama SYLLA", role: "Formatrice", expertise: "Compétences Numériques", status: "actif" },
  ],
}

// Échéances et événements du calendrier
const calendarEvents = [
  {
    date: new Date(2024, 11, 15), // 15 décembre 2024
    title: "Rapport Final Audit SENUM",
    type: "deadline",
    priority: "high",
    organization: "SENUM",
    status: "pending",
  },
  {
    date: new Date(2024, 11, 20),
    title: "Lancement AMI Gestion Spectre",
    type: "milestone",
    priority: "high",
    organization: "ARTP",
    status: "pending",
  },
  {
    date: new Date(2024, 11, 25),
    title: "Réunion Coordination Composante 2",
    type: "meeting",
    priority: "medium",
    organization: "DT",
    status: "scheduled",
  },
  {
    date: new Date(2025, 0, 10), // 10 janvier 2025
    title: "Démarrage Projet Pilote Zones Blanches",
    type: "milestone",
    priority: "high",
    organization: "FDSUT",
    status: "pending",
  },
  {
    date: new Date(2025, 0, 15),
    title: "Validation Stratégie Cybersécurité",
    type: "deadline",
    priority: "high",
    organization: "DTIC",
    status: "pending",
  },
  {
    date: new Date(2025, 0, 30),
    title: "Livraison Équipements ESS",
    type: "delivery",
    priority: "medium",
    organization: "SENUM",
    status: "pending",
  },
  {
    date: new Date(2025, 1, 5), // 5 février 2025
    title: "Formation Compétences Numériques",
    type: "training",
    priority: "medium",
    organization: "SCP",
    status: "scheduled",
  },
  {
    date: new Date(2025, 1, 20),
    title: "Mise en Service Salles Télémédecine",
    type: "milestone",
    priority: "high",
    organization: "CSSDOS",
    status: "pending",
  },
]

const getEventIcon = (type: string) => {
  switch (type) {
    case "deadline":
      return <AlertTriangle className="h-4 w-4" />
    case "milestone":
      return <CheckCircle className="h-4 w-4" />
    case "meeting":
      return <Users className="h-4 w-4" />
    case "delivery":
      return <PlayCircle className="h-4 w-4" />
    case "training":
      return <Eye className="h-4 w-4" />
    default:
      return <CalendarIcon className="h-4 w-4" />
  }
}

const getEventColor = (type: string, priority: string) => {
  if (priority === "high") return "border-red-500 bg-red-50 text-red-700"
  if (type === "milestone") return "border-green-500 bg-green-50 text-green-700"
  if (type === "meeting") return "border-blue-500 bg-blue-50 text-blue-700"
  return "border-gray-500 bg-gray-50 text-gray-700"
}

const organizationColors = {
  SENUM: "bg-blue-500",
  ARTP: "bg-green-500",
  DTIC: "bg-purple-500",
  DT: "bg-orange-500",
  FDSUT: "bg-teal-500",
  CSSDOS: "bg-red-500",
  SCP: "bg-indigo-500",
}

interface EnhancedCalendarProps {
  onTeamSelect?: (team: string) => void
}

export function EnhancedCalendar({ onTeamSelect }: EnhancedCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedOrganization, setSelectedOrganization] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"calendar" | "timeline" | "teams">("calendar")

  const getEventsForDate = (date: Date) => {
    return calendarEvents.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear(),
    )
  }

  const getEventsForMonth = (date: Date) => {
    return calendarEvents.filter(
      (event) => event.date.getMonth() === date.getMonth() && event.date.getFullYear() === date.getFullYear(),
    )
  }

  const renderTeamCard = (orgName: string, members: any[]) => (
    <Card
      key={orgName}
      className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4"
      style={{
        borderLeftColor:
          organizationColors[orgName as keyof typeof organizationColors]?.replace("bg-", "") || "#6b7280",
      }}
      onClick={() => onTeamSelect?.(orgName)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${organizationColors[orgName as keyof typeof organizationColors] || "bg-gray-500"}`}
            />
            {orgName}
          </CardTitle>
          <Badge variant="secondary">{members.length} membres</Badge>
        </div>
        <CardDescription>
          {orgName === "SENUM" && "Adoption Numérique & Services Gouvernementaux"}
          {orgName === "ARTP" && "Réglementation & Juridique Télécom"}
          {orgName === "DTIC" && "Cybersécurité & Cadre Légal Numérique"}
          {orgName === "DT" && "Infrastructure & Connectivité Haut Débit"}
          {orgName === "FDSUT" && "Accès Universel & Zones Blanches"}
          {orgName === "CSSDOS" && "Digitalisation Santé & Télémédecine"}
          {orgName === "SCP" && "Innovation & Compétences Numériques"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {members.map((member, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {member.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="font-medium text-sm">{member.name}</div>
                  <div className="text-xs text-muted-foreground">{member.role}</div>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="text-xs">
                  {member.expertise}
                </Badge>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-green-600">Actif</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header avec contrôles */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">📅 Calendrier & Équipes PAENS</h2>
          <p className="text-muted-foreground">Planification des activités et gestion des équipes</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "calendar" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("calendar")}
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            Calendrier
          </Button>
          <Button variant={viewMode === "teams" ? "default" : "outline"} size="sm" onClick={() => setViewMode("teams")}>
            <Users className="h-4 w-4 mr-2" />
            Équipes
          </Button>
          <Button
            variant={viewMode === "timeline" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("timeline")}
          >
            <Clock className="h-4 w-4 mr-2" />
            Timeline
          </Button>
        </div>
      </div>

      {/* Vue Calendrier */}
      {viewMode === "calendar" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Calendrier des Échéances</CardTitle>
                <CardDescription>Cliquez sur une date pour voir les événements</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  modifiers={{
                    hasEvents: calendarEvents.map((event) => event.date),
                  }}
                  modifiersStyles={{
                    hasEvents: {
                      backgroundColor: "var(--primary)",
                      color: "var(--primary-foreground)",
                      fontWeight: "bold",
                    },
                  }}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {/* Événements du jour sélectionné */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {selectedDate ? selectedDate.toLocaleDateString("fr-FR") : "Sélectionnez une date"}
                </CardTitle>
                <CardDescription>Événements prévus</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedDate && getEventsForDate(selectedDate).length > 0 ? (
                  <div className="space-y-3">
                    {getEventsForDate(selectedDate).map((event, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border-l-4 ${getEventColor(event.type, event.priority)}`}
                      >
                        <div className="flex items-start gap-2">
                          {getEventIcon(event.type)}
                          <div className="flex-1">
                            <div className="font-medium text-sm">{event.title}</div>
                            <div className="text-xs opacity-75 mt-1">{event.organization}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Aucun événement prévu</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Prochaines échéances */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🚨 Prochaines Échéances</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {calendarEvents
                    .filter((event) => event.date >= new Date())
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .slice(0, 5)
                    .map((event, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                        {getEventIcon(event.type)}
                        <div className="flex-1">
                          <div className="text-sm font-medium">{event.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {event.date.toLocaleDateString("fr-FR")} - {event.organization}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Vue Équipes */}
      {viewMode === "teams" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Object.entries(teamMembers).map(([orgName, members]) => renderTeamCard(orgName, members))}
          </div>

          {/* Statistiques des équipes */}
          <Card>
            <CardHeader>
              <CardTitle>📊 Statistiques des Équipes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {Object.values(teamMembers).reduce((sum, team) => sum + team.length, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Membres</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{Object.keys(teamMembers).length}</div>
                  <div className="text-sm text-gray-600">Organisations</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">4</div>
                  <div className="text-sm text-gray-600">Composantes</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">25</div>
                  <div className="text-sm text-gray-600">Activités</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Vue Timeline */}
      {viewMode === "timeline" && (
        <Card>
          <CardHeader>
            <CardTitle>🗓️ Timeline des Événements</CardTitle>
            <CardDescription>Chronologie des activités et échéances</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {calendarEvents
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .map((event, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                          organizationColors[event.organization as keyof typeof organizationColors] || "bg-gray-500"
                        }`}
                      >
                        {getEventIcon(event.type)}
                      </div>
                      {index < calendarEvents.length - 1 && <div className="w-px h-8 bg-border mt-2" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{event.title}</h4>
                        <Badge variant="outline">{event.organization}</Badge>
                        <Badge variant={event.priority === "high" ? "destructive" : "secondary"}>
                          {event.priority === "high" ? "🔴 Critique" : "🟡 Important"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        📅{" "}
                        {event.date.toLocaleDateString("fr-FR", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
