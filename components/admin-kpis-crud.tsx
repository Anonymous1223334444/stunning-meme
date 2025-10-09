'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2, TrendingUp, TrendingDown, Minus, ArrowUpDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DashboardKPI {
  id: string;
  key: string;
  label: string;
  value: number;
  unit: string | null;
  change: string | null;
  trend: 'up' | 'down' | 'neutral' | null;
  icon: string | null;
  color: string | null;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const TREND_OPTIONS = [
  { value: 'up', label: 'Hausse', icon: TrendingUp },
  { value: 'down', label: 'Baisse', icon: TrendingDown },
  { value: 'neutral', label: 'Stable', icon: Minus },
];

export function AdminKPIsCrud() {
  const [kpis, setKpis] = useState<DashboardKPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [editKPI, setEditKPI] = useState<DashboardKPI | null>(null);
  const [deleteKPI, setDeleteKPI] = useState<DashboardKPI | null>(null);
  const [addKPI, setAddKPI] = useState(false);
  const [saving, setSaving] = useState(false);

  const emptyForm = {
    key: '',
    label: '',
    value: 0,
    unit: '',
    change: '',
    trend: 'neutral' as 'up' | 'down' | 'neutral',
    icon: '',
    color: '',
    order: 0,
    is_active: true,
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadKPIs();
  }, []);

  const loadKPIs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('dashboard_kpis')
      .select('*')
      .order('order');

    if (error) {
      toast({
        title: 'Erreur',
        description: 'Échec du chargement des KPIs',
        variant: 'destructive',
      });
    } else {
      setKPIs(data || []);
    }
    setLoading(false);
  };

  const handleEdit = (kpi: DashboardKPI) => {
    setEditKPI(kpi);
    setForm({
      key: kpi.key,
      label: kpi.label,
      value: kpi.value,
      unit: kpi.unit || '',
      change: kpi.change || '',
      trend: (kpi.trend || 'neutral') as 'up' | 'down' | 'neutral',
      icon: kpi.icon || '',
      color: kpi.color || '',
      order: kpi.order,
      is_active: kpi.is_active,
    });
  };

  const handleSave = async () => {
    if (!form.key || !form.label) {
      toast({
        title: 'Erreur',
        description: 'La clé et le label sont obligatoires',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);

    if (editKPI) {
      const { error } = await supabase
        .from('dashboard_kpis')
        .update({
          ...form,
          unit: form.unit || null,
          change: form.change || null,
          icon: form.icon || null,
          color: form.color || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editKPI.id);

      if (error) {
        toast({
          title: 'Erreur',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({ title: 'Succès', description: 'KPI mis à jour avec succès' });
        setEditKPI(null);
        loadKPIs();
      }
    } else {
      const { error } = await supabase.from('dashboard_kpis').insert({
        ...form,
        unit: form.unit || null,
        change: form.change || null,
        icon: form.icon || null,
        color: form.color || null,
      });

      if (error) {
        toast({
          title: 'Erreur',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({ title: 'Succès', description: 'KPI créé avec succès' });
        setAddKPI(false);
        setForm(emptyForm);
        loadKPIs();
      }
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteKPI) return;

    const { error } = await supabase
      .from('dashboard_kpis')
      .delete()
      .eq('id', deleteKPI.id);

    if (error) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({ title: 'Succès', description: 'KPI supprimé avec succès' });
      setDeleteKPI(null);
      loadKPIs();
    }
  };

  const getTrendIcon = (trend: string | null) => {
    const option = TREND_OPTIONS.find(o => o.value === trend);
    if (!option) return null;
    const Icon = option.icon;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gestion des KPIs</CardTitle>
            <CardDescription>
              Gérer les indicateurs clés de performance affichés sur le tableau de bord ({kpis.length} KPIs)
            </CardDescription>
          </div>
          <Button onClick={() => { setAddKPI(true); setForm(emptyForm); }}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un KPI
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ordre</TableHead>
                  <TableHead>Clé</TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead>Valeur</TableHead>
                  <TableHead>Tendance</TableHead>
                  <TableHead>Actif</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kpis.map((kpi) => (
                  <TableRow key={kpi.id}>
                    <TableCell>{kpi.order}</TableCell>
                    <TableCell><Badge variant="outline">{kpi.key}</Badge></TableCell>
                    <TableCell className="font-medium">{kpi.label}</TableCell>
                    <TableCell className="text-lg font-semibold">
                      {kpi.value.toLocaleString('fr-FR')}
                      {kpi.unit && <span className="text-sm ml-1 text-muted-foreground">{kpi.unit}</span>}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(kpi.trend)}
                        {kpi.change && <span className="text-sm">{kpi.change}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={kpi.is_active ? 'default' : 'secondary'}>
                        {kpi.is_active ? 'Oui' : 'Non'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(kpi)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteKPI(kpi)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={!!editKPI || addKPI} onOpenChange={(open) => { if (!open) { setEditKPI(null); setAddKPI(false); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editKPI ? 'Modifier le KPI' : 'Ajouter un KPI'}</DialogTitle>
            <DialogDescription>
              Configurez les paramètres du KPI
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="key">Clé unique *</Label>
              <Input
                id="key"
                value={form.key}
                onChange={(e) => setForm({ ...form, key: e.target.value })}
                placeholder="total_projects"
                disabled={!!editKPI}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="label">Label *</Label>
              <Input
                id="label"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                placeholder="Total Activités"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Valeur *</Label>
              <Input
                id="value"
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unité</Label>
              <Input
                id="unit"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                placeholder="M, %, Mds FCFA"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="change">Changement</Label>
              <Input
                id="change"
                value={form.change}
                onChange={(e) => setForm({ ...form, change: e.target.value })}
                placeholder="+12%, -5%"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trend">Tendance</Label>
              <Select value={form.trend} onValueChange={(value: any) => setForm({ ...form, trend: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TREND_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <option.icon className="w-4 h-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Icône</Label>
              <Input
                id="icon"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                placeholder="BarChart3, Activity"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Couleur CSS</Label>
              <Input
                id="color"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                placeholder="text-blue-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order">Ordre</Label>
              <Input
                id="order"
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={form.is_active}
                onCheckedChange={(checked) => setForm({ ...form, is_active: checked })}
              />
              <Label htmlFor="is_active">Actif</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditKPI(null); setAddKPI(false); }}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteKPI} onOpenChange={(open) => !open && setDeleteKPI(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera définitivement ce KPI.
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
    </Card>
  );
}
