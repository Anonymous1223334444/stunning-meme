"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ChartBar as BarChart3, TrendingUp, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Monitor, Shield, Award, Mail, Palette, Zap, Info, Database, RefreshCw, MapPin, LayoutGrid as Layout, Briefcase, Phone, DollarSign, Activity, Search, FileText, Bell, User, Users, Download, Target, Settings, Calendar, ChevronLeft, ChevronRight, Clock, LogOut } from "lucide-react"
import { ProjectCard } from "@/components/project-card"
import { ActivityFeed } from "@/components/activity-feed"
import { ProjectTable } from "@/components/project-table"
import { AnalyticsCharts } from "@/components/analytics-charts"
import { ModernSidebar } from "@/components/modern-sidebar"
import { ModernMetric } from "@/components/modern-metrics"
import { TeamMembersGrid, organizationMembers } from "@/components/team-members-grid"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { NotificationsPanel } from "@/components/notifications-panel"
import { UserProfileDropdown } from "@/components/user-profile-dropdown"
import { AdvancedAnalyticsChart } from "@/components/advanced-analytics-chart"
import { ComprehensiveAnalytics } from "@/components/comprehensive-analytics"
import { cn } from "@/lib/utils"
import { ResponsiveGrid } from "@/components/responsive-grid"
import { ThemeCustomization } from "@/components/theme-customization"
import { useWebsiteStats } from "@/hooks/use-website-stats"

// Données du projet PAENS basées sur le fichier HTML original
const paensData = {
  projectInfo: {
    name: "PAENS",
    objective:
      "Étendre l'accès à une connectivité à haut débit abordable et résiliente aux changements climatiques et améliorer l'adoption des services gouvernementaux en ligne et des dossiers médicaux électroniques",
    funding: "Banque Mondiale",
    duration: "5 ans",
    coordinator: "Samba SENE",
    totalBudget: 89.98,
  },

  components: [
    {
      id: 1,
      name: "Environnement Juridique & Réglementaire",
      budget: 3.8,
      percentage: 4,
      icon: "⚖️",
      progress: 65,
      activities: 8,
      blocked: 2,
      color: "var(--chart-1)",
    },
    {
      id: 2,
      name: "Connectivité Haut Débit",
      budget: 34.85,
      percentage: 38,
      icon: "📡",
      progress: 72,
      activities: 5,
      blocked: 2,
      color: "var(--chart-2)",
    },
    {
      id: 3,
      name: "Adoption Numérique",
      budget: 22.18,
      percentage: 24,
      icon: "💻",
      progress: 68,
      activities: 6,
      blocked: 2,
      color: "var(--chart-3)",
    },
    {
      id: 4,
      name: "Digitalisation Santé",
      budget: 29.15,
      percentage: 32,
      icon: "🏥",
      progress: 45,
      activities: 6,
      blocked: 4,
      color: "var(--chart-4)",
    },
  ],

  activities: [
    // Composante 1 - Juridique
    {
      id: 1,
      activity: "Audit et valorisation du patrimoine fibre optique SENUM SA",
      responsible: "SENUM",
      component: 1,
      tdr_done: true,
      marche_done: true,
      contract_done: true,
      progress: 100,
      status: "Terminé",
      priority: "normal",
      comment: "Rapport final attendu, réunion octobre",
    },
    {
      id: 2,
      activity: "Conseiller PPP pour exploitation infrastructures fibre SENUM",
      responsible: "SENUM",
      component: 1,
      tdr_done: false,
      marche_done: false,
      contract_done: false,
      progress: 0,
      status: "Bloqué",
      priority: "high",
      comment: "Dossier en stand-by demande SENUM",
    },
    {
      id: 3,
      activity: "AT analyse impact numérique changement climatique",
      responsible: "ARTP",
      component: 1,
      tdr_done: true,
      marche_done: true,
      contract_done: false,
      progress: 67,
      status: "En cours",
      priority: "medium",
      comment: "AMI finalisé, DP à lancer",
    },
    {
      id: 4,
      activity: "AT renforcement réglementation partage infrastructures",
      responsible: "ARTP",
      component: 1,
      tdr_done: true,
      marche_done: true,
      contract_done: false,
      progress: 67,
      status: "En cours",
      priority: "medium",
      comment: "AMI finalisé, DP à lancer",
    },
    {
      id: 5,
      activity: "AT mise en œuvre décision libéralisation USSD",
      responsible: "ARTP",
      component: 1,
      tdr_done: true,
      marche_done: true,
      contract_done: false,
      progress: 67,
      status: "En cours",
      priority: "medium",
      comment: "AMI finalisé, DP à lancer",
    },
    {
      id: 6,
      activity: "Assistance technique amélioration gestion spectre",
      responsible: "ARTP",
      component: 1,
      tdr_done: true,
      marche_done: false,
      contract_done: false,
      progress: 33,
      status: "Démarré",
      priority: "high",
      comment: "TDR finalisés, AMI à lancer",
    },
    {
      id: 7,
      activity: "AT appui actualisation cadre légal numérique (LOSI)",
      responsible: "DTIC",
      component: 1,
      tdr_done: true,
      marche_done: true,
      contract_done: false,
      progress: 67,
      status: "En cours",
      priority: "medium",
      comment: "AMI lancé",
    },
    {
      id: 8,
      activity: "AT actualisation stratégie cybersécurité",
      responsible: "DTIC",
      component: 1,
      tdr_done: true,
      marche_done: false,
      contract_done: false,
      progress: 33,
      status: "Démarré",
      priority: "high",
      comment: "TDR finalisés, consultation à lancer",
    },

    // Composante 2 - Connectivité
    {
      id: 9,
      activity: "Consultant individuel appui MCTN/DT composante 2",
      responsible: "DT",
      component: 2,
      tdr_done: true,
      marche_done: true,
      contract_done: false,
      progress: 67,
      status: "En cours",
      priority: "medium",
      comment: "Évaluation faite, CM en attente",
    },
    {
      id: 10,
      activity: "AT identification liaisons FO Casamance/Bassin arachidier",
      responsible: "DT",
      component: 2,
      tdr_done: false,
      marche_done: false,
      contract_done: false,
      progress: 0,
      status: "Bloqué",
      priority: "high",
      comment: "TDR seront élaborés par consultant",
    },
    {
      id: 11,
      activity: "Survey zones blanches programme accès universel",
      responsible: "FDSUT",
      component: 2,
      tdr_done: true,
      marche_done: true,
      contract_done: true,
      progress: 100,
      status: "Terminé",
      priority: "normal",
      comment: "Contrat signé MCTN avril 2024",
    },
    {
      id: 12,
      activity: "Projet pilote 20 localités zones prioritaires",
      responsible: "FDSUT",
      component: 2,
      tdr_done: true,
      marche_done: false,
      contract_done: false,
      progress: 33,
      status: "Démarré",
      priority: "medium",
      comment: "Consultation en attente lancement",
    },
    {
      id: 13,
      activity: "Acquisition véhicules suivi travaux infrastructures",
      responsible: "FDSUT",
      component: 2,
      tdr_done: true,
      marche_done: false,
      contract_done: false,
      progress: 33,
      status: "Démarré",
      priority: "high",
      comment: "Autorisation SG PR en attente",
    },

    // Composante 3 - Adoption
    {
      id: 14,
      activity: "Consolidation plateforme Sénégal Services",
      responsible: "SENUM",
      component: 3,
      tdr_done: true,
      marche_done: true,
      contract_done: false,
      progress: 67,
      status: "En cours",
      priority: "medium",
      comment: "Processus arrêté demande SENUM",
    },
    {
      id: 15,
      activity: "Méthodologie harmonisée événements de la vie",
      responsible: "SENUM",
      component: 3,
      tdr_done: false,
      marche_done: false,
      contract_done: false,
      progress: 0,
      status: "Bloqué",
      priority: "medium",
      comment: "",
    },
    {
      id: 16,
      activity: "Équipements Espaces Sénégal Services (ESS)",
      responsible: "SENUM",
      component: 3,
      tdr_done: true,
      marche_done: false,
      contract_done: false,
      progress: 33,
      status: "Démarré",
      priority: "medium",
      comment: "SPEC validées, consultation à lancer",
    },
    {
      id: 17,
      activity: "Étude faisabilité architecture entreprise gouvernementale",
      responsible: "SENUM",
      component: 3,
      tdr_done: true,
      marche_done: true,
      contract_done: false,
      progress: 67,
      status: "En cours",
      priority: "medium",
      comment: "AMI finalisé, DP à lancer",
    },
    {
      id: 18,
      activity: "Consultant appui Senegal Connect Start-up",
      responsible: "SCP",
      component: 3,
      tdr_done: false,
      marche_done: false,
      contract_done: false,
      progress: 0,
      status: "Bloqué",
      priority: "medium",
      comment: "TDR à finaliser et valider UGP",
    },
    {
      id: 19,
      activity: "AT stratégie renforcement compétences numériques",
      responsible: "SCP",
      component: 3,
      tdr_done: true,
      marche_done: true,
      contract_done: false,
      progress: 67,
      status: "En cours",
      priority: "medium",
      comment: "AMI lancée, évaluations septembre",
    },

    // Composante 4 - Santé
    {
      id: 20,
      activity: "Réfections salles télémédecine centres santé",
      responsible: "CSSDOS",
      component: 4,
      tdr_done: false,
      marche_done: false,
      contract_done: false,
      progress: 0,
      status: "Bloqué",
      priority: "high",
      comment: "",
    },
    {
      id: 21,
      activity: "Connexion internet haut débit salles télémédecine",
      responsible: "CSSDOS",
      component: 4,
      tdr_done: false,
      marche_done: false,
      contract_done: false,
      progress: 0,
      status: "Bloqué",
      priority: "high",
      comment: "",
    },
    {
      id: 22,
      activity: "Équipements informatiques salles télémédecine",
      responsible: "CSSDOS",
      component: 4,
      tdr_done: false,
      marche_done: false,
      contract_done: false,
      progress: 0,
      status: "Bloqué",
      priority: "high",
      comment: "",
    },
    {
      id: 23,
      activity: "Équipements télémédecine (kits sondes) phase pilote",
      responsible: "CSSDOS",
      component: 4,
      tdr_done: false,
      marche_done: false,
      contract_done: false,
      progress: 0,
      status: "Bloqué",
      priority: "high",
      comment: "",
    },
    {
      id: 24,
      activity: "Infrastructures SDIS et cartes santé numériques",
      responsible: "CSSDOS",
      component: 4,
      tdr_done: true,
      marche_done: false,
      contract_done: false,
      progress: 33,
      status: "Démarré",
      priority: "medium",
      comment: "DAO en attente inscription SYGMAP",
    },
    {
      id: 25,
      activity: "Véhicules équipe technique CSSDOS (4x4 + Pickup)",
      responsible: "CSSDOS",
      component: 4,
      tdr_done: true,
      marche_done: false,
      contract_done: false,
      progress: 33,
      status: "Démarré",
      priority: "medium",
      comment: "DAO après validation STEP",
    },
  ],

  blockedActions: [
    {
      id: "senum_ppp",
      title: "SENUM - Conseil PPP Fibre Optique",
      description: "Conseiller en transactions pour la structuration du modèle PPP retenu",
      organization: "SENUM SA",
      status: "Dossier en stand-by",
      priority: "high",
    },
    {
      id: "artp_climat",
      title: "ARTP - Analyse Impact Numérique/Climat",
      description: "AT pour l'analyse de l'impact du numérique sur le changement climatique",
      organization: "ARTP",
      status: "AMI finalisé, DP à lancer",
      priority: "high",
    },
    {
      id: "artp_spectre",
      title: "ARTP - Gestion du Spectre",
      description: "Assistance technique pour l'amélioration de la gestion du spectre",
      organization: "ARTP",
      status: "TDR finalisés, AMI à lancer",
      priority: "high",
    },
    {
      id: "dtic_cyber",
      title: "DTIC - Stratégie Cybersécurité",
      description: "Actualisation de la stratégie de cybersécurité nationale",
      organization: "DTIC",
      status: "TDR finalisés, consultation à lancer",
      priority: "high",
    },
    {
      id: "dt_consultant",
      title: "DT - Consultant Composante 2",
      description: "Recrutement consultant individuel pour appuyer MTCN/DT",
      organization: "Direction Télécom",
      status: "Évaluation faite, CM en attente",
      priority: "medium",
    },
    {
      id: "cssdos_sante",
      title: "CSSDOS - Infrastructures Santé",
      description: "Réfections et mise aux normes des salles de télémédecine",
      organization: "CSSDOS",
      status: "Aucun processus démarré",
      priority: "high",
    },
    {
      id: "fdsut_vehicules",
      title: "FDSUT - Acquisition Véhicules",
      description: "Acquisition véhicules pour suivi travaux infrastructures",
      organization: "FDSUT",
      status: "Autorisation SG PR en attente",
      priority: "high",
    },
    {
      id: "scp_competences",
      title: "SCP - Consultant Compétences",
      description: "Consultant pour appuyer Senegal Connect Start-up",
      organization: "Senegal Connect",
      status: "TDR à finaliser",
      priority: "medium",
    },
  ],

  recentActivities: [
    {
      id: 1,
      type: "update",
      title: "Audit Fibre SENUM Terminé",
      description: "Rapport final soumis pour validation",
      timestamp: "Il y a 2 heures",
      user: "Samba SENE",
    },
    {
      id: 2,
      type: "alert",
      title: "Gestion Spectre ARTP Retardée",
      description: "Lancement AMI en attente d'approbation",
      timestamp: "Il y a 4 heures",
      user: "Système",
    },
    {
      id: 3,
      type: "success",
      title: "Contrat Survey FDSUT Signé",
      description: "20 localités prioritaires identifiées",
      timestamp: "Il y a 1 jour",
      user: "Équipe Projet",
    },
  ],
}

const progressData = [
    { name: 'Jan', value: 45 },
    { name: 'Fév', value: 52 },
    { name: 'Mar', value: 48 },
    { name: 'Avr', value: 65 },
    { name: 'Mai', value: 68 },
    { name: 'Jui', value: 72 },
  ]

const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

export default function Dashboard() {
  const { user, profile, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "vue-ensemble")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [selectedComponent, setSelectedComponent] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const { stats, loading: statsLoading, getStatByName } = useWebsiteStats()
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    const tab = searchParams.get("tab")
    const filter = searchParams.get("filter")
    if (tab) {
      setActiveTab(tab)
    }
    if (filter) {
      setSelectedFilter(filter)
    }
  }, [searchParams])

  if (loading || !user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // --- Start of Calendar Logic ---
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
  // --- End of Calendar Logic ---


  const projectInfo = {
    ...paensData.projectInfo,
    coordinator: profile?.full_name || paensData.projectInfo.coordinator,
  }

  const overview = {
    totalProjects: getStatByName('total_users') || paensData.activities.length,
    activeProjects: getStatByName('active_projects') || paensData.activities.filter((a) => a.status === "En cours" || a.status === "Démarré").length,
    completedProjects: getStatByName('completed_projects') || paensData.activities.filter((a) => a.status === "Terminé").length,
    blockedProjects: paensData.activities.filter((a) => a.status === "Bloqué").length,
    totalBudget: getStatByName('total_revenue') ? getStatByName('total_revenue') / 1000 : projectInfo.totalBudget,
    overallProgress: Math.round(
      paensData.activities.reduce((sum, a) => sum + a.progress, 0) / paensData.activities.length,
    ),
  }

  const handleComponentClick = (componentId: number) => {
    router.push(`${pathname}?tab=projets&filter=${componentId}`)
    setSelectedComponent(componentId)
    setActiveTab("projets")
    setSelectedFilter(componentId.toString())
  }

  const handleBlockedActionsClick = () => {
    setIsLoading(true)
    router.push(`/?tab=actions-bloquees`)
    setTimeout(() => {
      setActiveTab("actions-bloquees")
      setIsLoading(false)
    }, 500)
  }

  const handleGenerateReport = () => {
    setIsLoading(true)
    setTimeout(() => {
      // Simulate report generation
      const reportData = {
        date: new Date().toLocaleDateString("fr-FR"),
        progress: overview.overallProgress,
        blocked: overview.blockedProjects,
        budget: overview.totalBudget,
      }

      // Create and download a simple report
      const reportContent = `Rapport PAENS - ${reportData.date}\n\nProgression Globale: ${reportData.progress}%\nActions Bloquées: ${reportData.blocked}\nBudget Total: ${reportData.budget} Mds FCFA`

      const blob = new Blob([reportContent], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `Rapport_PAENS_${reportData.date.replace(/\//g, "-")}.txt`
      a.click()
      URL.revokeObjectURL(url)

      setIsLoading(false)
    }, 1500)
  }

  const handleExportExcel = () => {
    setIsLoading(true)
    setTimeout(() => {
      // Simulate Excel export
      console.log("Export Excel des données PAENS")
      setIsLoading(false)
    }, 1000)
  }

  const handleSidebarNavigation = (tab: string) => {
    router.push(`${pathname}?tab=${tab}`)
    setActiveTab(tab)
    // Reset filters when changing tabs
    if (tab !== "projets") {
      setSelectedFilter("all")
      setSelectedComponent(null)
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "vue-ensemble":
        return (
          <div className="space-y-8">
            {/* Modern Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-in-staggered">
              <ModernMetric
                title="Total Activités"
                value={overview.totalProjects}
                change="+12%"
                trend="up"
                icon={BarChart3}
                color="text-blue-600 dark:text-blue-400"
                bgColor="bg-blue-50 dark:bg-blue-950/20"
                onClick={() => handleSidebarNavigation("projets")}
              />
              <ModernMetric
                title="En Cours"
                value={overview.activeProjects}
                change={`${overview.overallProgress}%`}
                trend="up"
                icon={Activity}
                color="text-green-600 dark:text-green-400"
                bgColor="bg-green-50 dark:bg-green-950/20"
                onClick={() => handleSidebarNavigation("projets")}
              />
              <ModernMetric
                title="Budget"
                value={`${overview.totalBudget}M`}
                change="89.98 Mds FCFA"
                trend="neutral"
                icon={DollarSign}
                color="text-purple-600 dark:text-purple-400"
                bgColor="bg-purple-50 dark:bg-purple-950/20"
                onClick={() => handleSidebarNavigation("rapports")}
              />
              <ModernMetric
                title="Bloquées"
                value={overview.blockedProjects}
                change="Attention requise"
                trend="down"
                icon={AlertTriangle}
                color="text-red-600 dark:text-red-400"
                bgColor="bg-red-50 dark:bg-red-950/20"
                onClick={() => handleSidebarNavigation("actions-bloquees")}
              />
            </div>

            {/* Project Components Grid */}
            <div className="animate-slide-in-staggered stagger-2">
              <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 2, xl: 4 }} gap={{ sm: "gap-4", md: "gap-4", lg: "gap-6", xl: "gap-6" }}>
                {paensData.components.map((component) => (
                  <ProjectCard
                    key={component.id}
                    component={component}
                    onClick={() => handleComponentClick(component.id)}
                  />
                ))}
              </ResponsiveGrid>
            </div>

            {/* Analytics and Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-in-staggered stagger-3">
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AdvancedAnalyticsChart 
                    title="Progression Mensuelle" 
                    description="Suivi de l'avancement des différentes composantes" 
                    data={[
                      { name: 'Jan', value: 45 },
                      { name: 'Fév', value: 52 },
                      { name: 'Mar', value: 48 },
                      { name: 'Avr', value: 65 },
                      { name: 'Mai', value: 68 },
                      { name: 'Jui', value: 72 },
                    ]}
                    type="line"
                  />
                  <AdvancedAnalyticsChart 
                    title="Répartition par Composante" 
                    description="Distribution du budget sur les différentes composantes" 
                    data={[
                      { name: 'Juridique', value: 3.8 },
                      { name: 'Connectivité', value: 34.85 },
                      { name: 'Adoption', value: 22.18 },
                      { name: 'Santé', value: 29.15 },
                    ]}
                    type="pie"
                  />
                </div>
              </div>
              <div>
                <ActivityFeed activities={paensData.recentActivities} />
              </div>
            </div>
          </div>
        )

      case "projets":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Projets</h2>
              <Button variant="outline" onClick={() => handleSidebarNavigation("vue-ensemble")}>
                Retour au Dashboard
              </Button>
            </div>
            <ProjectTable
              activities={paensData.activities}
              components={paensData.components}
              searchQuery={searchQuery}
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
            />
          </div>
        )

      case "analytiques":
        return (
          <div className="space-y-6">
            <ComprehensiveAnalytics />
          </div>
        )

      case "actions-bloquees":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Actions Bloquées</h2>
              <Button variant="outline" onClick={() => handleSidebarNavigation("vue-ensemble")}>
                Retour au Dashboard
              </Button>
            </div>
            <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 3 }} gap={{ sm: "gap-4", md: "gap-4", lg: "gap-6" }}>
              {paensData.blockedActions.map((action) => (
                <Card
                  key={action.id}
                  className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-red-500"
                >
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      {action.title}
                    </CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Organisation:</span>
                        <Badge variant="outline">{action.organization}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Statut:</span>
                        <Badge variant={action.priority === "high" ? "destructive" : "secondary"}>
                          {action.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Priorité:</span>
                        <Badge variant={action.priority === "high" ? "destructive" : "secondary"}>
                          {action.priority === "high" ? "🔴 Critique" : "🟡 Importante"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </ResponsiveGrid>
          </div>
        )

      case "rapports":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AdvancedAnalyticsChart 
                title="📊 Évolution Mensuelle" 
                description="Progression globale du projet PAENS" 
                data={progressData}
                type="line"
              />
                  {/* <CardTitle>📊 Évolution Mensuelle</CardTitle>
                  <CardDescription>Progression globale du projet PAENS</CardDescription> */}

              <Card className="hover:shadow-2xl transition-all duration-300 border-2 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CardHeader className="relative pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg">
                      💰
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                        Répartition Budget
                      </CardTitle>
                      <CardDescription className="text-sm mt-1">Budget par composante</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="relative">
                  <div className="space-y-3">
                    {paensData.components.map((comp, index) => (
                      <div 
                        key={comp.id} 
                        className="group/item relative p-4 rounded-xl border border-border/50 hover:border-border transition-all duration-300 hover:shadow-md bg-card/50 hover:bg-card backdrop-blur-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-sm transition-transform duration-300 group-hover/item:scale-110"
                              style={{ 
                                backgroundColor: `${colors[index]}15`,
                                border: `2px solid ${colors[index]}30`
                              }}
                            >
                              {comp.icon}
                            </div>
                            <div className="flex-1">
                              <span className="font-medium text-sm block">{comp.name}</span>
                              <div className="mt-1.5 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full rounded-full transition-all duration-500 group-hover/item:animate-pulse"
                                  style={{ 
                                    width: `${comp.percentage}%`,
                                    backgroundColor: colors[index]
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right ml-4">
                            <div 
                              className="font-bold text-lg transition-colors duration-300"
                              style={{ color: colors[index] }}
                            >
                              {comp.budget} Mds
                            </div>
                            <div className="text-xs font-medium text-muted-foreground mt-0.5">
                              {comp.percentage}%
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-muted-foreground">Total Budget</span>
                      <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                        1,275 Mds
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card
                className="hover:shadow-lg transition-all duration-200 cursor-pointer"
                onClick={handleGenerateReport}
              >
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Rapport Mensuel
                  </CardTitle>
                  <CardDescription>Générer le rapport mensuel complet</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" disabled={isLoading}>
                    {isLoading ? "Génération..." : "Générer Rapport"}
                  </Button>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-all duration-200 cursor-pointer"
                onClick={() => setActiveTab("actions-bloquees")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Actions Bloquées
                  </CardTitle>
                  <CardDescription>Exporter la liste des actions bloquées</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    Exporter Excel
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={handleExportExcel}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Export Analytique
                  </CardTitle>
                  <CardDescription>Télécharger les données détaillées</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent" disabled={isLoading}>
                    {isLoading ? "Export..." : "Télécharger Données"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "equipe":
        const getOrgKeyFromComponent = (componentName: string) => {
          if (componentName.includes("Juridique")) return "ARTP";
          if (componentName.includes("Connectivité")) return "DT";
          if (componentName.includes("Adoption")) return "SENUM";
          if (componentName.includes("Santé")) return "CSSDOS";
          return "SENUM";
        };

        const selectedOrgKey = selectedComponent
          ? getOrgKeyFromComponent(paensData.components.find(c => c.id === selectedComponent)?.name || '')
          : null;
        
        const membersOfSelectedComponent = selectedOrgKey ? organizationMembers[selectedOrgKey] || [] : [];

        return (
          <div className="space-y-8">
            {/* Enhanced Header with Gradient Background */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-900 p-8 text-white shadow-2xl">
              <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-white/15 rounded-2xl backdrop-blur-sm shadow-lg">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                          Équipes du Projet
                        </h2>
                        <p className="text-blue-100 text-lg font-medium mt-2">
                          Gestion collaborative et suivi des performances d'équipe
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="hidden lg:grid grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300">
                      <div className="text-3xl font-bold text-white">
                        {Object.values(organizationMembers).reduce((total, members) => total + (members?.length || 0), 0)}
                      </div>
                      <div className="text-sm text-blue-100 mt-1">Membres Total</div>
                    </div>
                    <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300">
                      <div className="text-3xl font-bold text-green-300">4</div>
                      <div className="text-sm text-blue-100 mt-1">Équipes Actives</div>
                    </div>
                    <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300">
                      <div className="text-3xl font-bold text-yellow-300">
                        {Math.round((paensData.components.reduce((sum, c) => sum + c.progress, 0)) / paensData.components.length)}%
                      </div>
                      <div className="text-sm text-blue-100 mt-1">Progression</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Team Component Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paensData.components.map((component) => {
                const orgKey = getOrgKeyFromComponent(component.name);
                const members = organizationMembers[orgKey] || [];
                const isSelected = selectedComponent === component.id;

                return (
                  <Card
                    key={component.id}
                    className={cn(
                      "group relative overflow-hidden cursor-pointer",
                      "bg-gradient-to-br from-white via-white to-slate-50/80 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950/80",
                      "border-2 transition-all duration-500 ease-out",
                      "hover:shadow-2xl hover:scale-105 hover:-translate-y-2",
                      "backdrop-blur-sm",
                      isSelected 
                        ? "scale-105 -translate-y-2 shadow-2xl ring-4 ring-blue-500/50 dark:ring-blue-400/50 border-blue-300 dark:border-blue-600" 
                        : "shadow-lg border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600"
                    )}
                    onClick={() => {
                      setSelectedComponent(prev => prev === component.id ? null : component.id);
                    }}
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-purple-500/10 dark:via-blue-400/5 dark:to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Floating Background Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-700"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-400/10 to-blue-400/10 rounded-full translate-y-12 -translate-x-12 group-hover:scale-110 transition-transform duration-700 delay-150"></div>

                    <CardHeader className="pb-4 relative z-10">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "p-4 rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
                          "bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700",
                          "group-hover:shadow-2xl"
                        )}>
                          <span className="text-3xl filter drop-shadow-sm">{component.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 font-bold">
                            {component.name}
                          </CardTitle>
                          <CardDescription className="mt-2 flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <Users className="h-4 w-4 shrink-0" />
                            <span className="truncate">{members.length} membres • {component.activities} activités</span>
                          </CardDescription>
                        </div>
                      </div>

                      {/* Progress Section */}
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-slate-700 dark:text-slate-300">Progression</span>
                          <span className="text-blue-600 dark:text-blue-400 font-bold">{component.progress}%</span>
                        </div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 dark:from-blue-400 dark:via-blue-500 dark:to-blue-600 rounded-full transition-all duration-1000 ease-out relative overflow-hidden group-hover:shadow-lg"
                            style={{ width: `${component.progress}%` }}
                          >
                            <div className="absolute inset-0 bg-white/20"></div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="relative z-10">
                      {/* Team Member Avatars with Enhanced Design */}
                      <div className="flex -space-x-3 overflow-hidden mb-4">
                        {members.slice(0, 5).map((member) => (
                          <div 
                            key={member.id}
                            className="relative group/avatar"
                          >
                            <Avatar className="h-12 w-12 border-3 border-white dark:border-slate-700 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:z-10 relative hover:shadow-xl hover:-translate-y-1">
                              <AvatarImage
                                src={member.avatar || `/.jpg?key=pwdcn&height=48&width=48&query=${member.name.split(" ")[0]}`}
                              />
                              <AvatarFallback className="text-sm font-bold text-white bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700">
                                {member.name.split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            
                            {/* Status Indicator */}
                            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-700 shadow-sm"></div>
                            
                            {/* Hover Tooltip */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200 z-20 pointer-events-none">
                              <div className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs py-2 px-3 rounded-lg shadow-xl whitespace-nowrap">
                                <div className="font-semibold">{member.name}</div>
                                <div className="text-slate-300 dark:text-slate-600">{member.role}</div>
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-100"></div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {members.length > 5 && (
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 border-3 border-white dark:border-slate-700 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300 shadow-lg transition-all duration-300 hover:scale-110">
                            +{members.length - 5}
                          </div>
                        )}
                      </div>

                      {/* Enhanced Stats Grid */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/50 rounded-xl border border-blue-200/50 dark:border-blue-800/50 transition-all duration-300 group-hover:shadow-md">
                          <div className="font-bold text-blue-700 dark:text-blue-300 text-lg">{component.budget.toFixed(1)}M</div>
                          <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Budget</div>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/50 rounded-xl border border-green-200/50 dark:border-green-800/50 transition-all duration-300 group-hover:shadow-md">
                          <div className="font-bold text-green-700 dark:text-green-300 text-lg">{members.length}</div>
                          <div className="text-xs text-green-600 dark:text-green-400 font-medium">Actifs</div>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/50 rounded-xl border border-purple-200/50 dark:border-purple-800/50 transition-all duration-300 group-hover:shadow-md">
                          <div className="font-bold text-purple-700 dark:text-purple-300 text-lg">{component.activities}</div>
                          <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">Tâches</div>
                        </div>
                      </div>
                    </CardContent>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute top-4 right-4 p-2 bg-blue-500 text-white rounded-full shadow-lg animate-pulse">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>

            {/* Enhanced Detailed Team View */}
            {selectedComponent && membersOfSelectedComponent.length > 0 && (
              <div className="mt-12 space-y-6 animate-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                      <span className="text-2xl">{paensData.components.find(c => c.id === selectedComponent)?.icon}</span>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                        Équipe: {paensData.components.find(c => c.id === selectedComponent)?.name}
                      </h2>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
                          {membersOfSelectedComponent.length} membres
                        </Badge>
                        <Badge variant="outline" className="bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                          {paensData.components.find(c => c.id === selectedComponent)?.activities} activités
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedComponent(null)}
                    className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 hover:scale-105"
                  >
                    Fermer
                  </Button>
                </div>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {membersOfSelectedComponent.map((member) => (
                    <Card 
                      key={member.id} 
                      className="group hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden"
                    >
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* Member Header */}
                          <div className="flex items-start gap-4">
                            <div className="relative">
                              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 truncate">{member.name}</h3>
                              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">{member.role}</p>
                            </div>
                          </div>

                          {/* Location and Projects */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <MapPin className="h-4 w-4" />
                              <span>Dakar, Sénégal</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <Users className="h-4 w-4" />
                              <span>{Math.floor(Math.random() * 3) + 3} projets actifs</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <Calendar className="h-4 w-4" />
                              <span>Depuis {new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                            </div>
                          </div>

                          {/* Expertises */}
                          <div>
                            <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-2">Expertises:</h4>
                            <div className="flex flex-wrap gap-1">
                              {['Réglementation', 'Spectre', '+1'].map((expertise, index) => (
                                <Badge key={index} variant="secondary" className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md">
                                  {expertise}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Status and Actions */}
                          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                            <Badge variant="outline" className="bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                              Disponible
                            </Badge>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700">
                                <Mail className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700">
                                <Phone className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "calendrier":
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
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Calendrier des Événements
                </CardTitle>
                <CardDescription>Planification et suivi des activités du projet PAENS</CardDescription>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </div>
        )

                  case "objectifs":
                  return (
                    <div className="space-y-8">
                      {/* Enhanced Header Section */}
                      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-blue-600 to-purple-700 dark:from-emerald-700 dark:via-blue-700 dark:to-purple-800 p-8 text-white shadow-2xl">
                        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
                        
                        <div className="relative z-10">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div className="space-y-4">
                              <div className="flex items-center gap-4">
                                <div className="p-4 bg-white/15 rounded-2xl backdrop-blur-sm shadow-lg">
                                  <Target className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                  <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                                    Objectifs du Projet PAENS
                                  </h1>
                                  <p className="text-emerald-100 text-lg font-medium mt-2">
                                    Vision stratégique et indicateurs de performance clés
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="hidden lg:grid grid-cols-3 gap-6">
                              <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300">
                                <div className="text-3xl font-bold text-white">{projectInfo.totalBudget}M</div>
                                <div className="text-sm text-emerald-100 mt-1">Budget Total</div>
                              </div>
                              <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300">
                                <div className="text-3xl font-bold text-yellow-300">{projectInfo.duration}</div>
                                <div className="text-sm text-emerald-100 mt-1">Durée</div>
                              </div>
                              <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300">
                                <div className="text-3xl font-bold text-green-300">4</div>
                                <div className="text-sm text-emerald-100 mt-1">Composantes</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
        
                      {/* Main Objective Card */}
                      <Card className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-950/30 shadow-xl border-2 border-blue-200 dark:border-blue-800/50">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
                        
                        <CardHeader className="relative z-10 pb-6">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                              <Target className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                                Objectif Principal du Projet
                              </CardTitle>
                              <CardDescription className="text-lg text-slate-600 dark:text-slate-400 font-medium">
                                Vision stratégique pour le développement numérique du Sénégal
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
        
                        <CardContent className="relative z-10">
                          <div className="p-6 bg-gradient-to-br from-blue-50/80 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl border-l-4 border-l-blue-500 dark:border-l-blue-400">
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                              <p className="text-slate-800 dark:text-slate-200 leading-relaxed text-lg font-medium">
                                {projectInfo.objective}
                              </p>
                            </div>
                          </div>
                          
                          {/* Project Info Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/30 rounded-xl border border-green-200 dark:border-green-800/50">
                              <div className="flex items-center gap-2 mb-2">
                                <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
                                <span className="text-sm font-semibold text-green-800 dark:text-green-200">Financement</span>
                              </div>
                              <div className="text-lg font-bold text-green-900 dark:text-green-100">{projectInfo.funding}</div>
                            </div>
                            
                            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/30 rounded-xl border border-purple-200 dark:border-purple-800/50">
                              <div className="flex items-center gap-2 mb-2">
                                <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                <span className="text-sm font-semibold text-purple-800 dark:text-purple-200">Durée</span>
                              </div>
                              <div className="text-lg font-bold text-purple-900 dark:text-purple-100">{projectInfo.duration}</div>
                            </div>
                            
                            <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/30 rounded-xl border border-orange-200 dark:border-orange-800/50">
                              <div className="flex items-center gap-2 mb-2">
                                <User className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                <span className="text-sm font-semibold text-orange-800 dark:text-orange-200">Coordinateur</span>
                              </div>
                              <div className="text-lg font-bold text-orange-900 dark:text-orange-100">{projectInfo.coordinator}</div>
                            </div>
                            
                            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-800/50">
                              <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">Budget Total</span>
                              </div>
                              <div className="text-lg font-bold text-blue-900 dark:text-blue-100">{projectInfo.totalBudget} Mds FCFA</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
              {/* Components Objectives Grid */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Objectifs par Composante
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {paensData.components.map((comp, index) => (
                    <Card
                      key={comp.id}
                      className="group relative overflow-hidden bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300"
                    >
                      {/* Background Pattern */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-500"></div>
                      
                      <CardHeader className="relative z-10">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-md group-hover:scale-110 transition-transform duration-300">
                            <span className="text-2xl">{comp.icon}</span>
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {comp.name}
                            </CardTitle>
                            <CardDescription className="text-slate-600 dark:text-slate-400">
                              Composante stratégique du projet PAENS
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="relative z-10 space-y-6">
                        {/* Progress Section */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Progression Actuelle</span>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{comp.progress}%</span>
                              <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                              </div>
                            </div>
                          </div>
                          
                          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 dark:from-blue-400 dark:via-blue-500 dark:to-blue-600 rounded-full transition-all duration-1000 ease-out relative"
                              style={{ width: `${comp.progress}%` }}
                            >
                              <div className="absolute inset-0 bg-white/20"></div>
                            </div>
                          </div>
                        </div>

                        {/* Key Metrics Grid */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/50 rounded-xl border border-green-200/50 dark:border-green-800/50">
                            <div className="text-xl font-bold text-green-700 dark:text-green-300">{comp.budget}</div>
                            <div className="text-xs text-green-600 dark:text-green-400 font-medium">Mds FCFA</div>
                          </div>
                          <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/50 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
                            <div className="text-xl font-bold text-blue-700 dark:text-blue-300">{comp.activities}</div>
                            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Activités</div>
                          </div>
                          <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/50 rounded-xl border border-purple-200/50 dark:border-purple-800/50">
                            <div className="text-xl font-bold text-purple-700 dark:text-purple-300">{comp.percentage}%</div>
                            <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">Budget</div>
                          </div>
                        </div>

                        {/* Status Indicators */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                              {comp.progress >= 70 ? 'En bonne voie' : comp.progress >= 40 ? 'Progression normale' : 'Attention requise'}
                            </span>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "font-semibold",
                              comp.progress >= 70 
                                ? "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                                : comp.progress >= 40 
                                ? "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                                : "bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800"
                            )}
                          >
                            {comp.blocked > 0 ? `${comp.blocked} bloquées` : 'Actif'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Key Performance Indicators */}
              <Card className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 shadow-lg border border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl">
                      <Activity className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        Indicateurs Clés de Performance
                      </CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400">
                        Suivi des objectifs stratégiques et opérationnels
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-900/30 rounded-xl border border-emerald-200 dark:border-emerald-800/50">
                      <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-1">
                        {paensData.activities.filter(a => a.status === "Terminé").length}
                      </div>
                      <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Activités Terminées</div>
                    </div>
                    
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-800/50">
                      <Activity className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-1">
                        {paensData.activities.filter(a => a.status === "En cours" || a.status === "Démarré").length}
                      </div>
                      <div className="text-sm font-medium text-blue-600 dark:text-blue-400">Activités Actives</div>
                    </div>
                    
                    <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/30 rounded-xl border border-orange-200 dark:border-orange-800/50">
                      <AlertTriangle className="h-8 w-8 text-orange-600 dark:text-orange-400 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-orange-800 dark:text-orange-200 mb-1">
                        {paensData.activities.filter(a => a.status === "Bloqué").length}
                      </div>
                      <div className="text-sm font-medium text-orange-600 dark:text-orange-400">Actions Bloquées</div>
                    </div>
                    
                    <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/30 rounded-xl border border-purple-200 dark:border-purple-800/50">
                      <Target className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-purple-800 dark:text-purple-200 mb-1">
                        {Math.round(paensData.activities.reduce((sum, a) => sum + a.progress, 0) / paensData.activities.length)}%
                      </div>
                      <div className="text-sm font-medium text-purple-600 dark:text-purple-400">Progression Globale</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );

          case "parametres":
            return (
              <div className="space-y-8">
                {/* Enhanced Header Section */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 dark:from-slate-800 dark:via-slate-700 dark:to-slate-900 p-8 text-white shadow-2xl">
                  <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-white/15 rounded-2xl backdrop-blur-sm shadow-lg">
                        <Settings className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h1 className="text-4xl font-bold tracking-tight">Configuration du Dashboard</h1>
                        <p className="text-slate-200 text-lg font-medium mt-2">
                          Paramètres système et préférences utilisateur
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Main Settings Panel */}
                  <div className="xl:col-span-2 space-y-6">
                    
                    {/* Project Information Card */}
                    <Card className="shadow-lg border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                            <Briefcase className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                              Informations du Projet
                            </CardTitle>
                            <CardDescription className="text-slate-600 dark:text-slate-400">
                              Détails généraux et configuration du projet PAENS
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-800/50">
                                                <div className="flex items-center gap-2 mb-2">
                                                  <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                  <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">Nom du Projet</span>
                                                </div>
                                                <div className="text-lg font-bold text-blue-900 dark:text-blue-100">{projectInfo.name}</div>
                                              </div>
                                              
                                              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/30 rounded-xl border border-green-200 dark:border-green-800/50">
                                                <div className="flex items-center gap-2 mb-2">
                                                  <User className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                  <span className="text-sm font-semibold text-green-800 dark:text-green-200">Coordinateur</span>
                                                </div>
                                                <div className="text-lg font-bold text-green-900 dark:text-green-100">{projectInfo.coordinator}</div>
                                              </div>
                                              
                                              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/30 rounded-xl border border-purple-200 dark:border-purple-800/50">
                                                <div className="flex items-center gap-2 mb-2">
                                                  <Award className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                                  <span className="text-sm font-semibold text-purple-800 dark:text-purple-200">Financement</span>
                                                </div>
                                                <div className="text-lg font-bold text-purple-900 dark:text-purple-100">{projectInfo.funding}</div>
                                              </div>
                                              
                                              <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/30 rounded-xl border border-orange-200 dark:border-orange-800/50">
                                                <div className="flex items-center gap-2 mb-2">
                                                  <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                                  <span className="text-sm font-semibold text-orange-800 dark:text-orange-200">Durée</span>
                                                </div>
                                                <div className="text-lg font-bold text-orange-900 dark:text-orange-100">{projectInfo.duration}</div>
                                              </div>
                                            </div>
                                            
                                            <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl border border-slate-200 dark:border-slate-600">
                                              <div className="flex items-center gap-2 mb-3">
                                                <FileText className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Objectif Principal</span>
                                              </div>
                                              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                                {projectInfo.objective}
                                              </p>
                                            </div>                      </CardContent>
                    </Card>

                    {/* Dashboard Configuration */}
                    <Card className="shadow-lg border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl">
                            <Monitor className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                              Configuration du Dashboard
                            </CardTitle>
                            <CardDescription className="text-slate-600 dark:text-slate-400">
                              Paramètres d'affichage et préférences d'interface
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Refresh Rate Setting */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                              <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900 dark:text-slate-100">Actualisation Automatique</div>
                              <div className="text-sm text-slate-600 dark:text-slate-400">Mise à jour des données en temps réel</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Toutes les 30s</span>
                            <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer">
                              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
                            </div>
                          </div>
                        </div>

                        {/* Notifications Setting */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                              <Bell className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900 dark:text-slate-100">Notifications Push</div>
                              <div className="text-sm text-slate-600 dark:text-slate-400">Alertes pour actions bloquées</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Activé</span>
                            <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer">
                              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
                            </div>
                          </div>
                        </div>

                        {/* Compact Mode Setting */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                              <Layout className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900 dark:text-slate-100">Mode Compact</div>
                              <div className="text-sm text-slate-600 dark:text-slate-400">Interface condensée pour écrans plus petits</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Désactivé</span>
                            <div className="w-12 h-6 bg-slate-300 dark:bg-slate-600 rounded-full relative cursor-pointer">
                              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm"></div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* System Status */}
                    <Card className="shadow-lg border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                            <Shield className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                              Statut du Système
                            </CardTitle>
                            <CardDescription className="text-slate-600 dark:text-slate-400">
                              Informations sur l'état et la performance du dashboard
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/30 rounded-xl border border-green-200 dark:border-green-800/50">
                            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                            <div className="text-sm font-semibold text-green-800 dark:text-green-200">Connexion API</div>
                            <div className="text-xs text-green-600 dark:text-green-400 mt-1">Opérationnelle</div>
                          </div>
                          
                          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-800/50">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-2"></div>
                            <div className="text-sm font-semibold text-blue-800 dark:text-blue-200">Base de Données</div>
                            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Synchronisée</div>
                          </div>
                          
                          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/30 rounded-xl border border-orange-200 dark:border-orange-800/50">
                            <div className="w-3 h-3 bg-orange-500 rounded-full mx-auto mb-2"></div>
                            <div className="text-sm font-semibold text-orange-800 dark:text-orange-200">Performance</div>
                            <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">98% Uptime</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Sidebar with Theme and Quick Actions */}
                  <div className="space-y-6">
                    {/* Theme Customization Panel */}
                    <Card className="shadow-lg border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl">
                            <Palette className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
                              Thème & Apparence
                            </CardTitle>
                            <CardDescription className="text-slate-600 dark:text-slate-400">
                              Personnalisation visuelle
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ThemeCustomization />
                        
                        {/* Color Scheme Options */}
                        <div className="space-y-3">
                          <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">Schéma de couleurs</div>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg cursor-pointer border-2 border-blue-500"></div>
                            <div className="h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg cursor-pointer border-2 border-transparent hover:border-green-500"></div>
                            <div className="h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg cursor-pointer border-2 border-transparent hover:border-purple-500"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="shadow-lg border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                            <Zap className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
                              Actions Rapides
                            </CardTitle>
                            <CardDescription className="text-slate-600 dark:text-slate-400">
                              Opérations système courantes
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button className="w-full justify-start bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md">
                          <Download className="h-4 w-4 mr-2" />
                          Exporter Configuration
                        </Button>
                        
                        <Button variant="outline" className="w-full justify-start border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-950/20">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Actualiser Cache
                        </Button>
                        
                        <Button variant="outline" className="w-full justify-start border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-950/20">
                          <Database className="h-4 w-4 mr-2" />
                          Vérifier Intégrité
                        </Button>
                      </CardContent>
                    </Card>

                    {/* System Information */}
                    <Card className="shadow-lg border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl">
                            <Info className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
                              Informations Système
                            </CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Version Dashboard:</span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">v2.1.0</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Dernière MAJ:</span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">27/09/2024</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Base de données:</span>
                          <span className="font-medium text-green-600 dark:text-green-400">Synchronisée</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Utilisateur actuel:</span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">Samba SENE</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            );

      default:
        return (
          <div className="space-y-8">
            {/* Modern Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-in-staggered">
              <ModernMetric
                title="Total Activités"
                value={overview.totalProjects}
                change="+12%"
                trend="up"
                icon={BarChart3}
                color="text-blue-600 dark:text-blue-400"
                bgColor="bg-blue-50 dark:bg-blue-950/20"
                onClick={() => setActiveTab("projets")}
              />
              <ModernMetric
                title="En Cours"
                value={overview.activeProjects}
                change={`${overview.overallProgress}%`}
                trend="up"
                icon={Activity}
                color="text-green-600 dark:text-green-400"
                bgColor="bg-green-50 dark:bg-green-950/20"
                onClick={() => setActiveTab("projets")}
              />
              <ModernMetric
                title="Budget"
                value={`${overview.totalBudget}M`}
                change="89.98 Mds FCFA"
                trend="neutral"
                icon={DollarSign}
                color="text-purple-600 dark:text-purple-400"
                bgColor="bg-purple-50 dark:bg-purple-950/20"
                onClick={() => setActiveTab("rapports")}
              />
              <ModernMetric
                title="Bloquées"
                value={overview.blockedProjects}
                change="Attention requise"
                trend="down"
                icon={AlertTriangle}
                color="text-red-600 dark:text-red-400"
                bgColor="bg-red-50 dark:bg-red-950/20"
                onClick={() => setActiveTab("actions-bloquees")}
              />
            </div>

            {/* Project Components Grid */}
            <div className="animate-slide-in-staggered stagger-2">
              <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 2, xl: 4 }} gap={{ sm: "gap-4", md: "gap-4", lg: "gap-6", xl: "gap-6" }}>
                {paensData.components.map((component) => (
                  <ProjectCard
                    key={component.id}
                    component={component}
                    onClick={() => handleComponentClick(component.id)}
                  />
                ))}
              </ResponsiveGrid>
            </div>

            {/* Analytics and Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-in-staggered stagger-3">
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AdvancedAnalyticsChart 
                    title="Progression Mensuelle" 
                    description="Suivi de l'avancement des différentes composantes" 
                    data={[
                      { name: 'Jan', value: 45 },
                      { name: 'Fév', value: 52 },
                      { name: 'Mar', value: 48 },
                      { name: 'Avr', value: 65 },
                      { name: 'Mai', value: 68 },
                      { name: 'Jui', value: 72 },
                    ]}
                    type="line"
                  />
                  <AdvancedAnalyticsChart 
                    title="Répartition par Composante" 
                    description="Distribution du budget sur les différentes composantes" 
                    data={[
                      { name: 'Juridique', value: 3.8 },
                      { name: 'Connectivité', value: 34.85 },
                      { name: 'Adoption', value: 22.18 },
                      { name: 'Santé', value: 29.15 },
                    ]}
                    type="pie"
                  />
                </div>
              </div>
              <div>
                <ActivityFeed activities={paensData.recentActivities} />
              </div>
            </div>
          </div>
        )
  }}

  return (
    <div className="flex min-h-screen bg-background">
            <ModernSidebar
              activeTab={activeTab}
              onTabChange={handleSidebarNavigation}
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              user={profile}
            />

      <div className={`flex-1 flex flex-col overflow-hidden min-w-0 animate-fade-in ${collapsed ? 'lg:ml-20' : 'lg:ml-80'}`}>
        <header className="border-b border-border glass-effect sticky top-0 z-41 shadow-sm pl-20 sm:pl-0">
          <div className="flex h-16 sm:h-18 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <h1 className="text-base sm:text-lg lg:text-2xl font-bold text-foreground truncate bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                <span className="hidden sm:inline">🇸🇳 Dashboard PAENS</span>
                <span className="sm:hidden">🇸🇳 PAENS</span>
              </h1>
              <Badge
                className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 hidden md:flex text-xs animate-pulse shadow-sm"
              >
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse shadow-sm"></span>
                En Ligne - BM
              </Badge>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
              <div className="relative hidden lg:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher projets, tâches..."
                  className="pl-10 w-48 xl:w-64 bg-background/50 backdrop-blur-sm transition-all duration-300 focus:w-56 xl:focus:w-72 focus:shadow-md border-border/50 focus:border-primary/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Button variant="ghost" size="icon" className="h-8 w-8 lg:hidden hover:bg-accent/50 transition-colors duration-200">
                <Search className="h-4 w-4" />
              </Button>

            <ThemeToggle />
            <NotificationsPanel />
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut()}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
            {profile && <UserProfileDropdown user={profile} />}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-3 sm:p-4 lg:p-6 xl:p-8">
          <div className="max-w-7xl mx-auto">
            {renderTabContent()}

            {activeTab === "vue-ensemble" && (
              <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-0 sm:flex sm:flex-wrap sm:gap-3 lg:gap-4 animate-slide-in-staggered stagger-3">
                <Button
                  onClick={() => setActiveTab("actions-bloquees")}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white w-full sm:w-auto transition-all duration-300 hover:shadow-lg hover:scale-105 shadow-md"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 mr-2" />
                  )}
                  <span className="hidden lg:inline">🚨 Actions Bloquantes Prioritaires</span>
                  <span className="lg:hidden">🚨 Actions Bloquées</span>
                </Button>
                <Button
                  onClick={handleGenerateReport}
                  variant="outline"
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-transparent hover:shadow-lg transition-all duration-300 hover:scale-105 border-border/50 hover:border-primary/50"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2" />
                  )}
                  <span className="hidden lg:inline">📊 Rapport Mensuel BM</span>
                  <span className="lg:hidden">📊 Rapport</span>
                </Button>
                <Button
                  onClick={handleExportExcel}
                  variant="outline"
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-transparent hover:shadow-lg transition-all duration-300 hover:scale-105 border-border/50 hover:border-primary/50"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  <span className="hidden lg:inline">📋 Export Excel Complet</span>
                  <span className="lg:hidden">📋 Export</span>
                </Button>
              </div>
            )}
          </div>
        </main>

        <footer className="border-t border-border glass-effect p-3 sm:p-4 text-center text-xs sm:text-sm text-muted-foreground">
          <div className="hidden lg:block">
            Projet PAENS - Banque Mondiale | Coordinateur: {paensData.projectInfo.coordinator}
          </div>
          <div className="lg:hidden">
            PAENS — {paensData.projectInfo.coordinator}
          </div>
        </footer>
      </div>
    </div>
  )
}
