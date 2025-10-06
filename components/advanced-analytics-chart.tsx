"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { useTheme } from "next-themes"

// Theme-aware color palettes
const LIGHT_THEME_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#8b5aef'];
const DARK_THEME_COLORS = ['#60a5fa', '#f87171', '#34d399', '#fbbf24', '#a78bfa', '#f472b6', '#22d3ee', '#c4b5fd'];

interface ChartData {
  name: string
  value: number
  fill?: string
}

interface AdvancedAnalyticsChartProps {
  title: string
  description: string
  data: ChartData[]
  type?: 'bar' | 'line' | 'pie'
  dataKey?: string
  className?: string
}

export function AdvancedAnalyticsChart({
  title,
  description,
  data,
  type = 'bar',
  dataKey = 'value',
  className
}: AdvancedAnalyticsChartProps) {
  const { theme } = useTheme();
  const colors = theme === 'dark' ? DARK_THEME_COLORS : LIGHT_THEME_COLORS;

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart 
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis 
                dataKey="name" 
                stroke="var(--muted-foreground)" 
                fontSize={11}
                tickLine={true}
                axisLine={true}
                tick={{ fill: 'var(--muted-foreground)' }}
              />
              <YAxis 
                stroke="var(--muted-foreground)" 
                fontSize={11}
                tickLine={true}
                axisLine={true}
                tick={{ fill: 'var(--muted-foreground)' }}
                domain={['dataMin - 5', 'dataMax + 5']} // Add some padding to Y-axis
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--popover)', 
                  border: '1px solid var(--border)',
                  borderRadius: '0.5rem',
                }} 
                itemStyle={{ color: 'var(--foreground)' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={dataKey} 
                stroke="var(--primary)" 
                strokeWidth={3}
                dot={{ r: 5, strokeWidth: 2, stroke: 'var(--primary)', fill: 'var(--background)' }}
                activeDot={{ r: 8, stroke: 'var(--primary)', strokeWidth: 2, fill: 'var(--background)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                innerRadius={40} // Make it a donut chart which is often more visually appealing
                dataKey={dataKey}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--popover)', 
                  border: '1px solid var(--border)',
                  borderRadius: '0.5rem',
                }} 
                itemStyle={{ color: 'var(--foreground)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        )
      default: // bar chart
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart 
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis 
                dataKey="name" 
                stroke="var(--muted-foreground)" 
                fontSize={11}
                tickLine={true}
                axisLine={true}
                tick={{ fill: 'var(--muted-foreground)' }}
              />
              <YAxis 
                stroke="var(--muted-foreground)" 
                fontSize={11}
                tickLine={true}
                axisLine={true}
                tick={{ fill: 'var(--muted-foreground)' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--popover)', 
                  border: '1px solid var(--border)',
                  borderRadius: '0.5rem',
                }} 
                itemStyle={{ color: 'var(--foreground)' }}
                cursor={{ fill: 'transparent' }}
              />
              <Legend />
              <Bar 
                dataKey={dataKey} 
                radius={[4, 4, 0, 0]}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )
    }
  }

  return (
    <Card className={`hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-primary/50 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="min-h-[350px]">
        {renderChart()}
      </CardContent>
    </Card>
  )
}
