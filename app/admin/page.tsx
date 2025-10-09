'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserProfileDropdown } from '@/components/user-profile-dropdown';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Users, Database, LogOut, BarChart3, ListTodo, TrendingUp } from 'lucide-react';
import { AdminUserTable } from '@/components/admin-user-table';
import { WebsiteStatsCrud } from '@/components/website-stats-crud';
import { AdminKPIsCrud } from '@/components/admin-kpis-crud';
import { AdminTasksCrud } from '@/components/admin-tasks-crud';

export default function AdminPage() {
  const { user, profile, loading, isAdmin, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/login');
    }
  }, [user, isAdmin, loading, router]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Administration
              </h1>
              <p className="text-sm text-muted-foreground">
                Gestion complète du système
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut()}
              className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
            <UserProfileDropdown user={profile} />
          </div>
        </div>
      </header>

      <main className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full max-w-3xl grid-cols-5 p-1 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
            <TabsTrigger value="users" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Utilisateurs</span>
            </TabsTrigger>
            <TabsTrigger value="kpis" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">KPIs</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all">
              <ListTodo className="w-4 h-4" />
              <span className="hidden sm:inline">Tâches</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all">
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">Stats</span>
            </TabsTrigger>
            <TabsTrigger value="charts" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Graphiques</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4 animate-in fade-in-50 duration-500">
            <AdminUserTable />
          </TabsContent>

          <TabsContent value="kpis" className="space-y-4 animate-in fade-in-50 duration-500">
            <AdminKPIsCrud />
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4 animate-in fade-in-50 duration-500">
            <AdminTasksCrud />
          </TabsContent>

          <TabsContent value="stats" className="space-y-4 animate-in fade-in-50 duration-500">
            <WebsiteStatsCrud />
          </TabsContent>

          <TabsContent value="charts" className="space-y-4 animate-in fade-in-50 duration-500">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <div className="text-center space-y-4">
                <BarChart3 className="w-16 h-16 mx-auto text-muted-foreground" />
                <h3 className="text-xl font-semibold">Gestion des graphiques</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Cette section permettra de gérer les données des graphiques affichés sur le tableau de bord.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
