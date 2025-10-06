'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserProfileDropdown } from '@/components/user-profile-dropdown';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Database } from 'lucide-react';
import { AdminUserTable } from '@/components/admin-user-table';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
}

interface WebsiteStat {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_type: string;
  description: string | null;
  updated_at: string;
}

export default function AdminPage() {
  const { user, profile, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState<WebsiteStat[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/login');
    }
  }, [user, isAdmin, loading, router]);

  useEffect(() => {
    if (user && isAdmin) {
      loadData();
    }
  }, [user, isAdmin]);

  const loadData = async () => {
    setLoadingData(true);

    const { data: usersData } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: statsData } = await supabase
      .from('website_stats')
      .select('*')
      .order('metric_name');

    setUsers(usersData || []);
    setStats(statsData || []);
    setLoadingData(false);
  };

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Tableau de bord administrateur
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Gérer les utilisateurs et les statistiques du site web
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <UserProfileDropdown
              user={profile}
            />
          </div>
        </div>
      </header>

      <main className="p-6">
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Utilisateurs
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Statistiques du site web
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <AdminUserTable />
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Statistiques du site web</CardTitle>
                <CardDescription>
                  Aperçu de toutes les métriques et analyses du site web ({stats.length} métriques)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingData ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom de la métrique</TableHead>
                          <TableHead>Valeur</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Dernière mise à jour</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stats.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                              Aucune statistique trouvée
                            </TableCell>
                          </TableRow>
                        ) : (
                          stats.map((stat) => (
                            <TableRow key={stat.id}>
                              <TableCell className="font-medium">
                                {stat.metric_name}
                              </TableCell>
                              <TableCell className="text-lg font-semibold">
                                {stat.metric_value.toLocaleString('fr-FR')}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{stat.metric_type}</Badge>
                              </TableCell>
                              <TableCell className="max-w-md truncate">
                                {stat.description || 'N/A'}
                              </TableCell>
                              <TableCell>
                                {new Date(stat.updated_at).toLocaleDateString('fr-FR')}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}