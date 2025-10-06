import { cn } from "@/lib/utils"
import React from "react"

interface ResponsiveGridProps {
  children: React.ReactNode
  className?: string
  cols?: {
    sm?: number
    md?: number
    lg?: number
    xl?: number
    '2xl'?: number
  }
  gap?: {
    sm?: string
    md?: string
    lg?: string
    xl?: string
    '2xl'?: string
  }
}

export function ResponsiveGrid({ 
  children, 
  className = "", 
  cols = { sm: 1, md: 2, lg: 3, xl: 4, '2xl': 5 },
  gap = { sm: "gap-4", md: "gap-4", lg: "gap-6", xl: "gap-6", '2xl': "gap-8" }
}: ResponsiveGridProps) {
  const gridColumnClasses = {
    sm: `grid-cols-${cols.sm}`,
    md: `md:grid-cols-${cols.md}`,
    lg: `lg:grid-cols-${cols.lg}`,
    xl: `xl:grid-cols-${cols.xl}`,
    '2xl': `2xl:grid-cols-${cols['2xl']}`,
  }
  
  const gapClasses = {
    sm: gap.sm,
    md: gap.md,
    lg: gap.lg,
    xl: gap.xl,
    '2xl': gap['2xl'],
  }
  
  return (
    <div 
      className={cn(
        "grid",
        gridColumnClasses.sm,
        gridColumnClasses.md,
        gridColumnClasses.lg,
        gridColumnClasses.xl,
        gridColumnClasses['2xl'],
        gapClasses.sm,
        gapClasses.md,
        gapClasses.lg,
        gapClasses.xl,
        gapClasses['2xl'],
        className
      )}
    >
      {children}
    </div>
  )
}