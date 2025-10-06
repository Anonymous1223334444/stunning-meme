'use client';

import { useState, useEffect } from 'react';
import { supabase, UserProfile } from '@/lib/supabase';
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
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { MoveHorizontal as MoreHorizontal, Pencil, Trash2, Shield, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

export function AdminUserTable() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState<UserProfile | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserProfile | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  const [editForm, setEditForm] = useState({
    full_name: '',
    email: '',
    role: 'user' as 'user' | 'admin',
  });

  const [addUser, setAddUser] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addForm, setAddForm] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'user' as 'user' | 'admin',
  });

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [deleteSelection, setDeleteSelection] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length && users.length > 0) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.id));
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Erreur',
        description: 'Échec du chargement des utilisateurs',
        variant: 'destructive',
      });
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };

  const handleEdit = (user: UserProfile) => {
    setEditUser(user);
    setEditForm({
      full_name: user.full_name || '',
      email: user.email,
      role: user.role,
    });
  };

  const handleSaveEdit = async () => {
    if (!editUser) return;

    setEditLoading(true);
    const { error } = await supabase
      .from('user_profiles')
      .update({
        full_name: editForm.full_name,
        role: editForm.role,
      })
      .eq('id', editUser.id);

    if (error) {
      toast({
        title: 'Erreur',
        description: "Échec de la mise à jour de l'utilisateur",
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Succès',
        description: 'Utilisateur mis à jour avec succès',
      });
      loadUsers();
      setEditUser(null);
    }
    setEditLoading(false);
  };

  const handleSaveUser = async () => {
    setAddLoading(true);
    const { data, error } = await supabase.auth.admin.createUser({
      email: addForm.email,
      password: addForm.password,
      email_confirm: true, // User will be confirmed automatically
      user_metadata: { full_name: addForm.full_name, role: addForm.role }
    });

    if (error) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Succès',
        description: 'Utilisateur ajouté avec succès',
      });
      loadUsers();
      setAddUser(false);
    }
    setAddLoading(false);
  };

  const handleDeleteSelected = async () => {
    const promises = selectedUsers.map(userId => supabase.auth.admin.deleteUser(userId));
    const results = await Promise.allSettled(promises);

    const failedDeletions = results.filter(result => result.status === 'rejected');

    if (failedDeletions.length > 0) {
      toast({
        title: 'Erreur',
        description: `${failedDeletions.length} utilisateurs n'ont pas pu être supprimés.`,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Succès',
        description: 'Utilisateurs sélectionnés supprimés avec succès',
      });
    }
    loadUsers();
    setSelectedUsers([]);
    setDeleteSelection(false);
  };

  const handleDelete = async () => {
    if (!deleteUser) return;

    const { error } = await supabase.auth.admin.deleteUser(deleteUser.id);

    if (error) {
      toast({
        title: 'Erreur',
        description: "Échec de la suppression de l'utilisateur",
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Succès',
        description: 'Utilisateur supprimé avec succès',
      });
      loadUsers();
      setDeleteUser(null);
    }
  };

  const getRoleBadge = (role: string) => {
    if (role === 'admin') {
      return (
        <Badge className="bg-purple-600 text-white">
          <Shield className="w-3 h-3 mr-1" />
          Administrateur
        </Badge>
      );
    }
    return (
      <Badge variant="secondary">
        <Eye className="w-3 h-3 mr-1" />
        Lecteur
      </Badge>
    );
  };

  const getStatusBadge = (createdAt: string) => {
    const isRecent = new Date(createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return (
      <Badge variant={isRecent ? 'default' : 'outline'}>
        {isRecent ? 'Actif' : 'Inactif'}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return <div>Chargement des utilisateurs...</div>;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Gestion des utilisateurs</h2>
        <div className="flex items-center gap-2">
          {selectedUsers.length > 0 && (
            <Button variant="destructive" onClick={() => setDeleteSelection(true)}>
              Supprimer ({selectedUsers.length})
            </Button>
          )}
          <Button onClick={() => setAddUser(true)}>Ajouter un utilisateur</Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  className="rounded"
                  checked={selectedUsers.length === users.length && users.length > 0}
                  onChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Rôle de l'utilisateur</TableHead>
              <TableHead>Statut</TableHead>

              <TableHead>Dernière connexion</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={user.avatar_url || undefined} />
                      <AvatarFallback>
                        {user.full_name
                          ?.split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase() || user.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.full_name || user.email}</span>
                  </div>
                </TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>{getStatusBadge(user.created_at)}</TableCell>

                <TableCell>{formatDate(user.updated_at)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(user)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeleteUser(user)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
            <DialogDescription>Mettre à jour les informations et le rôle de l'utilisateur</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nom complet</Label>
              <Input
                id="full_name"
                value={editForm.full_name}
                onChange={(e) =>
                  setEditForm({ ...editForm, full_name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={editForm.email} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rôle</Label>
              <Select
                value={editForm.role}
                onValueChange={(value: 'user' | 'admin') =>
                  setEditForm({ ...editForm, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Utilisateur</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUser(null)}>
              Annuler
            </Button>
            <Button onClick={handleSaveEdit} disabled={editLoading}>
              {editLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteUser}
        onOpenChange={(open) => !open && setDeleteUser(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Elle supprimera définitivement le compte de l'utilisateur et ses données du système.
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

      <AlertDialog
        open={deleteSelection}
        onOpenChange={(open) => !open && setDeleteSelection(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Elle supprimera définitivement les {selectedUsers.length} utilisateurs sélectionnés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSelected} className="bg-red-600">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={addUser} onOpenChange={(open) => !open && setAddUser(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un utilisateur</DialogTitle>
            <DialogDescription>Créer un nouveau compte utilisateur</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="add_full_name">Nom complet</Label>
              <Input
                id="add_full_name"
                value={addForm.full_name}
                onChange={(e) =>
                  setAddForm({ ...addForm, full_name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add_email">Email</Label>
              <Input id="add_email" value={addForm.email} onChange={(e) =>
                  setAddForm({ ...addForm, email: e.target.value })
                } />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add_password">Mot de passe</Label>
              <Input id="add_password" type="password" value={addForm.password} onChange={(e) =>
                  setAddForm({ ...addForm, password: e.target.value })
                } />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add_role">Rôle</Label>
              <Select
                value={addForm.role}
                onValueChange={(value: 'user' | 'admin') =>
                  setAddForm({ ...addForm, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Utilisateur</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddUser(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveUser} disabled={addLoading}>
              {addLoading ? 'Création...' : 'Créer l\'utilisateur'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}