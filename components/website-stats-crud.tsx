'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Pencil, Trash2, Plus, TrendingUp, ChartBar as BarChart3, DollarSign } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface WebsiteStat {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_type: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

const METRIC_TYPES = [
  { value: 'user', label: 'Utilisateur' },
  { value: 'project', label: 'Projet' },
  { value: 'financial', label: 'Financier' },
  { value: 'activity', label: 'Activité' },
  { value: 'performance', label: 'Performance' },
  { value: 'engagement', label: 'Engagement' },
];

export function WebsiteStatsCrud() {
  const [stats, setStats] = useState<WebsiteStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [editStat, setEditStat] = useState<WebsiteStat | null>(null);
  const [deleteStat, setDeleteStat] = useState<WebsiteStat | null>(null);
  const [addStat, setAddStat] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editForm, setEditForm] = useState({
    metric_name: '',
    metric_value: 0,
    metric_type: 'user',
    description: '',
  });

  const [addForm, setAddForm] = useState({
    metric_name: '',
    metric_value: 0,
    metric_type: 'user',
    description: '',
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('website_stats')
      .select('*')
      .order('metric_name');

    if (error) {
      toast({
        title: 'Erreur',
        description: 'Échec du chargement des statistiques',
        variant: 'destructive',
      });
    } else {
      setStats(data || []);
    }
    setLoading(false);
  };

  const handleEdit = (stat: WebsiteStat) => {
    setEditStat(stat);
    setEditForm({
      metric_name: stat.metric_name,
      metric_value: stat.metric_value,
      metric_type: stat.metric_type,
      description: stat.description || '',
    });
  };

  const handleSaveEdit = async () => {
    if (!editStat) return;

    setSaving(true);
    const { error } = await supabase
      .from('website_stats')
      .update({
        metric_name: editForm.metric_name,
        metric_value: editForm.metric_value,
        metric_type: editForm.metric_type,
        description: editForm.description || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', editStat.id);

    if (error) {
      toast({
        title: 'Erreur',
        description: 'Échec de la mise à jour de la statistique',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Succès',
        description: 'Statistique mise à jour avec succès',
      });
      loadStats();
      setEditStat(null);
    }
    setSaving(false);
  };

  const handleAdd = async () => {
    setSaving(true);
    const { error } = await supabase.from('website_stats').insert({
      metric_name: addForm.metric_name,
      metric_value: addForm.metric_value,
      metric_type: addForm.metric_type,
      description: addForm.description || null,
    });

    if (error) {
      toast({
        title: 'Erreur',
        description: 'Échec de l\'ajout de la statistique',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Succès',
        description: 'Statistique ajoutée avec succès',
      });
      loadStats();
      setAddStat(false);
      setAddForm({
        metric_name: '',
        metric_value: 0,
        metric_type: 'user',
        description: '',
      });
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteStat) return;

    const { error } = await supabase
      .from('website_stats')
      .delete()
      .eq('id', deleteStat.id);

    if (error) {
      toast({
        title: 'Erreur',
        description: 'Échec de la suppression de la statistique',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Succès',
        description: 'Statistique supprimée avec succès',
      });
      loadStats();
      setDeleteStat(null);
    }
  };

  const getMetricTypeLabel = (type: string) => {
    const found = METRIC_TYPES.find((t) => t.value === type);
    return found ? found.label : type;
  };

  const getMetricIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <TrendingUp className="w-4 h-4" />;
      case 'project':
        return <BarChart3 className="w-4 h-4" />;
      case 'financial':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <BarChart3 className="w-4 h-4" />;
    }
  };

  const formatValue = (value: number, type: string) => {
    if (type === 'financial') {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'USD',
      }).format(value);
    }
    return value.toLocaleString('fr-FR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Statistiques du site web</CardTitle>
              <CardDescription>
                Gérer toutes les métriques et analyses du site web ({stats.length} métriques)
              </CardDescription>
            </div>
            <Button onClick={() => setAddStat(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une statistique
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom de la métrique</TableHead>
                  <TableHead>Valeur</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="max-w-md">Description</TableHead>
                  <TableHead>Dernière mise à jour</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
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
                        {formatValue(stat.metric_value, stat.metric_type)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="flex items-center gap-1 w-fit">
                          {getMetricIcon(stat.metric_type)}
                          {getMetricTypeLabel(stat.metric_type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-md truncate">
                        {stat.description || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {new Date(stat.updated_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(stat)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteStat(stat)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editStat} onOpenChange={(open) => !open && setEditStat(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier la statistique</DialogTitle>
            <DialogDescription>
              Mettre à jour les informations de la métrique
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit_metric_name">Nom de la métrique</Label>
              <Input
                id="edit_metric_name"
                value={editForm.metric_name}
                onChange={(e) =>
                  setEditForm({ ...editForm, metric_name: e.target.value })
                }
                placeholder="Ex: Nombre d'utilisateurs actifs"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_metric_value">Valeur</Label>
              <Input
                id="edit_metric_value"
                type="number"
                value={editForm.metric_value}
                onChange={(e) =>
                  setEditForm({ ...editForm, metric_value: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_metric_type">Type</Label>
              <Select
                value={editForm.metric_type}
                onValueChange={(value) =>
                  setEditForm({ ...editForm, metric_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {METRIC_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_description">Description</Label>
              <Textarea
                id="edit_description"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                placeholder="Description de la métrique"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditStat(null)}>
              Annuler
            </Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={addStat} onOpenChange={(open) => !open && setAddStat(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter une statistique</DialogTitle>
            <DialogDescription>
              Créer une nouvelle métrique pour le tableau de bord
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="add_metric_name">Nom de la métrique</Label>
              <Input
                id="add_metric_name"
                value={addForm.metric_name}
                onChange={(e) =>
                  setAddForm({ ...addForm, metric_name: e.target.value })
                }
                placeholder="Ex: Nombre d'utilisateurs actifs"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add_metric_value">Valeur</Label>
              <Input
                id="add_metric_value"
                type="number"
                value={addForm.metric_value}
                onChange={(e) =>
                  setAddForm({ ...addForm, metric_value: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add_metric_type">Type</Label>
              <Select
                value={addForm.metric_type}
                onValueChange={(value) =>
                  setAddForm({ ...addForm, metric_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {METRIC_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add_description">Description</Label>
              <Textarea
                id="add_description"
                value={addForm.description}
                onChange={(e) =>
                  setAddForm({ ...addForm, description: e.target.value })
                }
                placeholder="Description de la métrique"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddStat(false)}>
              Annuler
            </Button>
            <Button onClick={handleAdd} disabled={saving}>
              {saving ? 'Création...' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteStat}
        onOpenChange={(open) => !open && setDeleteStat(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Elle supprimera définitivement cette statistique.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
