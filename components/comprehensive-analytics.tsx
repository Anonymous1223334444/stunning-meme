"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveGrid } from "@/components/responsive-grid"
import { AdvancedAnalyticsChart } from "@/components/advanced-analytics-chart"
import { Activity, Target, TrendingUp, DollarSign, Users, Calendar, Clock, CheckCircle, AlertTriangle } from "lucide-react"

export function ComprehensiveAnalytics() {
  // Mock data for different analytics
  const progressData = [
    { name: 'Jan', value: 45 },
    { name: 'Fév', value: 52 },
    { name: 'Mar', value: 48 },
    { name: 'Avr', value: 65 },
    { name: 'Mai', value: 68 },
    { name: 'Jui', value: 72 },
  ]
  
  const budgetData = [
    { name: 'Juridique', value: 3.8 },
    { name: 'Connectivité', value: 34.85 },
    { name: 'Adoption', value: 22.18 },
    { name: 'Santé', value: 29.15 },
  ]
  
  const statusData = [
    { name: 'Terminé', value: 12 },
    { name: 'En Cours', value: 34 },
    { name: 'Démarré', value: 8 },
    { name: 'Bloqué', value: 12 },
  ]
  
  const timelineData = [
    { name: 'Q1', value: 25 },
    { name: 'Q2', value: 35 },
    { name: 'Q3', value: 20 },
    { name: 'Q4', value: 20 },
  ]

  // Stats data
  const stats = [
    {
      title: "Progression Globale",
      value: "68%",
      change: "+12%",
      trend: "up",
      icon: TrendingUp,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      title: "Budget Utilisé",
      value: "61%",
      change: "-4%",
      trend: "down",
      icon: DollarSign,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/20"
    },
    {
      title: "Tâches En Cours",
      value: "34",
      change: "+5",
      trend: "up",
      icon: Activity,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/20"
    },
    {
      title: "Actions Bloquées",
      value: "12",
      change: "-3",
      trend: "down",
      icon: AlertTriangle,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-950/20"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 4 }} gap={{ sm: "gap-4", md: "gap-4", lg: "gap-6" }}>
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <div className="flex items-baseline mt-1">
                    <span className="text-2xl font-bold">{stat.value}</span>
                    <span className={`ml-2 text-xs ${stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {stat.trend === 'up' ? '↑' : '↓'} {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </ResponsiveGrid>

      {/* Charts Grid */}
      <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 2, xl: 2, '2xl': 2 }} gap={{ sm: "gap-4", md: "gap-4", lg: "gap-6", xl: "gap-6", '2xl': "gap-8" }}>
        <AdvancedAnalyticsChart 
          title="Progression Mensuelle" 
          description="Suivi de l'avancement des différentes composantes" 
          data={progressData}
          type="line"
        />
        <AdvancedAnalyticsChart 
          title="Répartition par Composante" 
          description="Distribution du budget sur les différentes composantes" 
          data={budgetData}
          type="pie"
        />
        <AdvancedAnalyticsChart 
          title="Statut des Activités" 
          description="Répartition des activités par statut" 
          data={statusData}
          type="bar"
        />
        <AdvancedAnalyticsChart 
          title="Répartition par Trimestre" 
          description="Distribution des activités par trimestre" 
          data={timelineData}
          type="bar"
        />
      </ResponsiveGrid>

      {/* Additional Analytics Cards */}
      <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 4 }} gap={{ sm: "gap-4", md: "gap-4", lg: "gap-6" }}>
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Activités Récentes
            </CardTitle>
            <CardDescription>Dernières modifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Composante Juridique</span>
                <span className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">+12%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Composante Connectivité</span>
                <span className="text-xs bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-1 rounded">+8%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Composante Santé</span>
                <span className="text-xs bg-red-500/10 text-red-600 dark:text-red-400 px-2 py-1 rounded">-2%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              Objectifs
            </CardTitle>
            <CardDescription>Atteinte des objectifs clés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Connectivité</span>
                <span className="text-xs font-medium">85%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Adoption</span>
                <span className="text-xs font-medium">72%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '72%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              Équipe
            </CardTitle>
            <CardDescription>Performance de l'équipe par composante</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Juridique</span>
                <span className="text-xs bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-1 rounded">78%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Connectivité</span>
                <span className="text-xs bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-1 rounded">92%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Adoption</span>
                <span className="text-xs bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-1 rounded">85%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-500" />
              Timeline
            </CardTitle>
            <CardDescription>Avancement par période</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Semaine</span>
                <span className="text-xs bg-orange-500/10 text-orange-600 dark:text-orange-400 px-2 py-1 rounded">+5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Mois</span>
                <span className="text-xs bg-orange-500/10 text-orange-600 dark:text-orange-400 px-2 py-1 rounded">+12%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Trimestre</span>
                <span className="text-xs bg-orange-500/10 text-orange-600 dark:text-orange-400 px-2 py-1 rounded">+28%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </ResponsiveGrid>
    </div>
  )
}