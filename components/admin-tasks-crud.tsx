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
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Pencil, Trash2, Eye, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider';

interface ProjectComponent {
  id: string;
  name: string;
}

interface ProjectActivity {
  id: string;
  component_id: string | null;
  activity_name: string;
  responsible: string | null;
  status: string;
  priority: string;
  progress: number;
  tdr_done: boolean;
  marche_done: boolean;
  contract_done: boolean;
  comment: string | null;
  start_date: string | null;
  end_date: string | null;
  budget_allocated: number | null;
  budget_spent: number | null;
  order: number;
}

const STATUS_OPTIONS = ['En cours', 'Terminé', 'Bloqué', 'Démarré', 'Non démarré'];
const PRIORITY_OPTIONS = [
  { value: 'high', label: 'Haute', color: 'bg-red-100 text-red-800' },
  { value: 'normal', label: 'Normale', color: 'bg-blue-100 text-blue-800' },
  { value: 'low', label: 'Basse', color: 'bg-gray-100 text-gray-800' },
];

export function AdminTasksCrud() {
  const [tasks, setTasks] = useState<ProjectActivity[]>([]);
  const [components, setComponents] = useState<ProjectComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editTask, setEditTask] = useState<ProjectActivity | null>(null);
  const [viewTask, setViewTask] = useState<ProjectActivity | null>(null);
  const [deleteTask, setDeleteTask] = useState<ProjectActivity | null>(null);
  const [addTask, setAddTask] = useState(false);
  const [saving, setSaving] = useState(false);

  const emptyForm = {
    component_id: '',
    activity_name: '',
    responsible: '',
    status: 'Non démarré',
    priority: 'normal',
    progress: 0,
    tdr_done: false,
    marche_done: false,
    contract_done: false,
    comment: '',
    start_date: '',
    end_date: '',
    budget_allocated: 0,
    budget_spent: 0,
    order: 0,
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    const [tasksRes, componentsRes] = await Promise.all([
      supabase.from('project_activities').select('*').order('order'),
      supabase.from('project_components').select('id, name').order('order'),
    ]);

    if (tasksRes.error) {
      toast({ title: 'Erreur', description: 'Échec du chargement des tâches', variant: 'destructive' });
    } else {
      setTasks(tasksRes.data || []);
    }

    if (componentsRes.error) {
      toast({ title: 'Erreur', description: 'Échec du chargement des composantes', variant: 'destructive' });
    } else {
      setComponents(componentsRes.data || []);
    }

    setLoading(false);
  };

  const handleEdit = (task: ProjectActivity) => {
    setEditTask(task);
    setForm({
      component_id: task.component_id || '',
      activity_name: task.activity_name,
      responsible: task.responsible || '',
      status: task.status,
      priority: task.priority,
      progress: task.progress,
      tdr_done: task.tdr_done,
      marche_done: task.marche_done,
      contract_done: task.contract_done,
      comment: task.comment || '',
      start_date: task.start_date || '',
      end_date: task.end_date || '',
      budget_allocated: task.budget_allocated || 0,
      budget_spent: task.budget_spent || 0,
      order: task.order,
    });
  };

  const handleSave = async () => {
    if (!form.activity_name || !form.status) {
      toast({ title: 'Erreur', description: 'Le nom et le statut sont obligatoires', variant: 'destructive' });
      return;
    }

    setSaving(true);

    const data = {
      ...form,
      component_id: form.component_id || null,
      responsible: form.responsible || null,
      comment: form.comment || null,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      budget_allocated: form.budget_allocated || null,
      budget_spent: form.budget_spent || null,
    };

    if (editTask) {
      const { error } = await supabase
        .from('project_activities')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', editTask.id);

      if (error) {
        toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Succès', description: 'Tâche mise à jour avec succès' });
        setEditTask(null);
        loadData();
      }
    } else {
      const { error } = await supabase.from('project_activities').insert(data);

      if (error) {
        toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Succès', description: 'Tâche créée avec succès' });
        setAddTask(false);
        setForm(emptyForm);
        loadData();
      }
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTask) return;

    const { error } = await supabase.from('project_activities').delete().eq('id', deleteTask.id);

    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Succès', description: 'Tâche supprimée avec succès' });
      setDeleteTask(null);
      loadData();
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'En cours': 'bg-blue-100 text-blue-800',
      'Terminé': 'bg-green-100 text-green-800',
      'Bloqué': 'bg-red-100 text-red-800',
      'Démarré': 'bg-yellow-100 text-yellow-800',
      'Non démarré': 'bg-gray-100 text-gray-800',
    };
    return <Badge className={colors[status] || ''}>{status}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const option = PRIORITY_OPTIONS.find(p => p.value === priority);
    return <Badge className={option?.color || ''}>{option?.label || priority}</Badge>;
  };

  const getComponentName = (componentId: string | null) => {
    if (!componentId) return 'N/A';
    const component = components.find(c => c.id === componentId);
    return component?.name || 'N/A';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gestion des Tâches</CardTitle>
            <CardDescription>
              Gérer toutes les activités du projet ({tasks.length} tâches)
            </CardDescription>
          </div>
          <Button onClick={() => { setAddTask(true); setForm(emptyForm); }}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une tâche
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
                  <TableHead>Activité</TableHead>
                  <TableHead>Responsable</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Priorité</TableHead>
                  <TableHead>Progrès</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow
                    key={task.id}
                    className="cursor-pointer hover:bg-accent/50"
                    onClick={() => setViewTask(task)}
                  >
                    <TableCell className="font-medium max-w-md truncate">
                      {task.activity_name}
                    </TableCell>
                    <TableCell>{task.responsible || 'N/A'}</TableCell>
                    <TableCell>{getStatusBadge(task.status)}</TableCell>
                    <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                        <span className="text-sm">{task.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(task)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteTask(task)}>
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

      <Dialog open={!!viewTask} onOpenChange={(open) => !open && setViewTask(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la tâche</DialogTitle>
          </DialogHeader>
          {viewTask && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Activité</Label>
                  <p className="font-medium">{viewTask.activity_name}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Responsable</Label>
                  <p className="font-medium">{viewTask.responsible || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Statut</Label>
                  <div className="mt-1">{getStatusBadge(viewTask.status)}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Priorité</Label>
                  <div className="mt-1">{getPriorityBadge(viewTask.priority)}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Composante</Label>
                  <p className="font-medium">{getComponentName(viewTask.component_id)}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Progrès</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600"
                        style={{ width: `${viewTask.progress}%` }}
                      />
                    </div>
                    <span className="font-medium">{viewTask.progress}%</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <Label className="text-sm text-muted-foreground">Documents</Label>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <Checkbox checked={viewTask.tdr_done} disabled />
                    <span>TDR</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox checked={viewTask.marche_done} disabled />
                    <span>Marché</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox checked={viewTask.contract_done} disabled />
                    <span>Contrat</span>
                  </div>
                </div>
              </div>

              {(viewTask.start_date || viewTask.end_date) && (
                <div className="border-t pt-4">
                  <Label className="text-sm text-muted-foreground">Dates</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {viewTask.start_date && (
                      <div>
                        <span className="text-sm">Début: </span>
                        <span className="font-medium">{new Date(viewTask.start_date).toLocaleDateString('fr-FR')}</span>
                      </div>
                    )}
                    {viewTask.end_date && (
                      <div>
                        <span className="text-sm">Fin: </span>
                        <span className="font-medium">{new Date(viewTask.end_date).toLocaleDateString('fr-FR')}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(viewTask.budget_allocated || viewTask.budget_spent) && (
                <div className="border-t pt-4">
                  <Label className="text-sm text-muted-foreground">Budget</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {viewTask.budget_allocated && (
                      <div>
                        <span className="text-sm">Alloué: </span>
                        <span className="font-medium">{viewTask.budget_allocated.toLocaleString('fr-FR')} FCFA</span>
                      </div>
                    )}
                    {viewTask.budget_spent && (
                      <div>
                        <span className="text-sm">Dépensé: </span>
                        <span className="font-medium">{viewTask.budget_spent.toLocaleString('fr-FR')} FCFA</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {viewTask.comment && (
                <div className="border-t pt-4">
                  <Label className="text-sm text-muted-foreground">Commentaire</Label>
                  <p className="mt-2 text-sm">{viewTask.comment}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewTask(null)}>Fermer</Button>
            <Button onClick={() => {
              if (viewTask) {
                handleEdit(viewTask);
                setViewTask(null);
              }
            }}>
              Modifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editTask || addTask} onOpenChange={(open) => { if (!open) { setEditTask(null); setAddTask(false); } }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editTask ? 'Modifier la tâche' : 'Ajouter une tâche'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="activity_name">Nom de l'activité *</Label>
              <Textarea
                id="activity_name"
                value={form.activity_name}
                onChange={(e) => setForm({ ...form, activity_name: e.target.value })}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="responsible">Responsable</Label>
              <Input
                id="responsible"
                value={form.responsible}
                onChange={(e) => setForm({ ...form, responsible: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="component_id">Composante</Label>
              <Select value={form.component_id} onValueChange={(value) => setForm({ ...form, component_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucune</SelectItem>
                  {components.map((comp) => (
                    <SelectItem key={comp.id} value={comp.id}>{comp.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Statut *</Label>
              <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priorité</Label>
              <Select value={form.priority} onValueChange={(value) => setForm({ ...form, priority: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="progress">Progrès: {form.progress}%</Label>
              <Slider
                id="progress"
                value={[form.progress]}
                onValueChange={([value]) => setForm({ ...form, progress: value })}
                max={100}
                step={5}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Documents</Label>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={form.tdr_done}
                    onCheckedChange={(checked) => setForm({ ...form, tdr_done: !!checked })}
                  />
                  <span>TDR</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={form.marche_done}
                    onCheckedChange={(checked) => setForm({ ...form, marche_done: !!checked })}
                  />
                  <span>Marché</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={form.contract_done}
                    onCheckedChange={(checked) => setForm({ ...form, contract_done: !!checked })}
                  />
                  <span>Contrat</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="start_date">Date de début</Label>
              <Input
                id="start_date"
                type="date"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">Date de fin</Label>
              <Input
                id="end_date"
                type="date"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget_allocated">Budget alloué</Label>
              <Input
                id="budget_allocated"
                type="number"
                value={form.budget_allocated}
                onChange={(e) => setForm({ ...form, budget_allocated: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget_spent">Budget dépensé</Label>
              <Input
                id="budget_spent"
                type="number"
                value={form.budget_spent}
                onChange={(e) => setForm({ ...form, budget_spent: Number(e.target.value) })}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="comment">Commentaire</Label>
              <Textarea
                id="comment"
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order">Ordre d'affichage</Label>
              <Input
                id="order"
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditTask(null); setAddTask(false); }}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTask} onOpenChange={(open) => !open && setDeleteTask(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera définitivement cette tâche.
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
