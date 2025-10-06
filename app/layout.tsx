import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeTransitionProvider } from "@/hooks/use-theme-transition.tsx"
import { ThemeSettingsProvider } from "@/contexts/theme-settings-context"
import { AuthProvider } from "@/contexts/auth-context"
import { Suspense } from "react"
import { ThemeTransition } from "@/components/theme-transition"
import "./globals.css"

export const metadata: Metadata = {
  title: "Dashboard Paens",
  description: "Créé avec Drew",
  generator: "npm",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <ThemeTransitionProvider>
              <ThemeSettingsProvider>
                <AuthProvider>
                  <ThemeTransition />
                  {children}
                </AuthProvider>
              </ThemeSettingsProvider>
            </ThemeTransitionProvider>
          </ThemeProvider>
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
