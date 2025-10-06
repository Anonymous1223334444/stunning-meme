"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, ChartPie as PieChart, Activity, ChartBar as BarChart3 } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Pie as RechartsPie,
  BarChart,
  Bar,
  Cell,
} from "recharts"

export function AnalyticsCharts() {
  const monthlyProgress = [
    { month: "Jan", progress: 15, budget: 5.2, activities: 2 },
    { month: "Fév", progress: 25, budget: 8.7, activities: 4 },
    { month: "Mar", progress: 35, budget: 12.3, activities: 6 },
    { month: "Avr", progress: 42, budget: 18.9, activities: 8 },
    { month: "Mai", progress: 48, budget: 25.4, activities: 12 },
    { month: "Jun", progress: 55, budget: 32.1, activities: 15 },
    { month: "Jul", progress: 60, budget: 38.7, activities: 18 },
    { month: "Aoû", progress: 65, budget: 45.2, activities: 21 },
    { month: "Sep", progress: 68, budget: 51.8, activities: 23 },
  ]

  const budgetAllocation = [
    { name: "Environnement Juridique", budget: 3.8, percentage: 4, color: "#ef4444", icon: "⚖️" },
    { name: "Connectivité Haut Débit", budget: 34.85, percentage: 38, color: "#3b82f6", icon: "📡" },
    { name: "Adoption Numérique", budget: 22.18, percentage: 24, color: "#10b981", icon: "💻" },
    { name: "Digitalisation Santé", budget: 29.15, percentage: 32, color: "#f59e0b", icon: "🏥" },
  ]

  const componentProgress = [
    { name: "Juridique", progress: 65, activities: 8, blocked: 2 },
    { name: "Connectivité", progress: 72, activities: 5, blocked: 2 },
    { name: "Adoption", progress: 68, activities: 6, blocked: 2 },
    { name: "Santé", progress: 45, activities: 6, blocked: 4 },
  ]

  const COLORS = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b"]

  return (
    <div className="space-y-6">
      <Card className="hover:shadow-lg transition-all duration-300 card-enhanced animate-scale-in dark:bg-slate-900 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Évolution Mensuelle du Projet PAENS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center animate-slide-in-staggered">
              <div className="p-4 bg-blue-500/10 dark:bg-blue-900/50 rounded-lg hover:bg-blue-500/20 dark:hover:bg-blue-900/60 transition-colors duration-200 group">
                <div className="text-2xl font-bold text-blue-600">68%</div>
                <div className="text-sm text-muted-foreground">Progression Globale</div>
              </div>
              <div className="p-4 bg-green-500/10 dark:bg-green-900/50 rounded-lg hover:bg-green-500/20 dark:hover:bg-green-900/60 transition-colors duration-200 group stagger-1">
                <div className="text-2xl font-bold text-green-600">17</div>
                <div className="text-sm text-muted-foreground">Activités Actives</div>
              </div>
              <div className="p-4 bg-red-500/10 dark:bg-red-900/50 rounded-lg hover:bg-red-500/20 dark:hover:bg-red-900/60 transition-colors duration-200 group stagger-2">
                <div className="text-2xl font-bold text-red-600">8</div>
                <div className="text-sm text-muted-foreground">Actions Bloquées</div>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%" className="bg-transparent">
                <LineChart data={monthlyProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }} />
                  <Line type="monotone" dataKey="progress" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 card-enhanced animate-scale-in stagger-1 dark:bg-slate-900 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Répartition Budget par Composante
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%" className="bg-transparent">
                <RechartsPie
                  data={budgetAllocation}
                  cx={150}
                  cy={150}
                  labelLine={false}
                  label={({ name, percentage }) => `${name} (${percentage}%)`}
                  outerRadius={100}
                  fill="var(--foreground)"
                >
                  {budgetAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </RechartsPie>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {budgetAllocation.map((comp, index) => (
                <div key={comp.name} className="flex items-center justify-between text-sm hover:bg-muted/50 p-2 rounded transition-colors duration-200">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[index] }}></div>
                    <span>
                      {comp.icon} {comp.name}
                    </span>
                  </div>
                  <span className="font-medium">
                    {comp.budget} Mds ({comp.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 card-enhanced animate-scale-in stagger-2 dark:bg-slate-900 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Progression par Composante
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%" className="bg-transparent">
                <BarChart data={componentProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }} />
                  <Bar dataKey="progress" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="hover:shadow-lg transition-all duration-300 card-enhanced animate-scale-in stagger-3 dark:bg-slate-900 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Indicateurs Clés de Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Activités Terminées</span>
                <span className="font-medium">6/25</span>
              </div>
              <div className="relative">
                <Progress value={24} className="h-2" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Respect des Délais</span>
                <span className="font-medium">60%</span>
              </div>
              <div className="relative">
                <Progress value={60} className="h-2" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Contractualisation</span>
                <span className="font-medium">3/25</span>
              </div>
              <div className="relative">
                <Progress value={12} className="h-2" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Processus Marché</span>
                <span className="font-medium">8/25</span>
              </div>
              <div className="relative">
                <Progress value={32} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
