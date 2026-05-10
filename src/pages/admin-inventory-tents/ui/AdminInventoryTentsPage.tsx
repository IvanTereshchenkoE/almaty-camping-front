import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAdminTents, useDeleteTent } from '@/entities/tent/model/use-admin-tents';
import { useUsers } from '@/entities/user/model/use-users';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/shared/ui/select';
import { ImageUpload } from '@/shared/ui/image-upload';
import { Loader2, Trash2, Plus, PackageOpen, Tent, Package, Pencil, Settings } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { ROUTES } from '@/shared/config';
import { API_BASE_URL } from '@/shared/api';
import { api } from '@/shared/api';
import { useQueryClient } from '@tanstack/react-query';

const FALLBACK_IMAGE = 'https://placehold.co/400x300?text=No+Image';

const statusLabels: Record<string, string> = {
  AVAILABLE: 'Доступна',
  DAMAGED: 'Повреждена',
  MAINTENANCE: 'На ремонте',
};

const statusColors: Record<string, string> = {
  AVAILABLE: 'bg-green-500',
  DAMAGED: 'bg-red-500',
  MAINTENANCE: 'bg-yellow-500',
};

interface TentType {
  id: string;
  name: string;
  brand?: { name: string } | null;
  type?: { name: string } | null;
  season?: { name: string } | null;
  capacity: number;
  weight: number;
  dailyPrice: number;
  mainImage: string;
  isActive: boolean;
  units: {
    id: string;
    inventoryCode: string;
    status: string;
    photo?: string;
    ownerId?: string;
    owner?: { id: string; name: string | null; email: string } | null;
  }[];
}

export const AdminInventoryTentsPage = () => {
  const [search, setSearch] = useState('');
  const { data: tents, isLoading } = useAdminTents();
  const deleteTent = useDeleteTent();
  const location = useLocation();
  const qc = useQueryClient();

  const [selectedTent, setSelectedTent] = useState<TentType | null>(null);
  const [unitModalOpen, setUnitModalOpen] = useState(false);

  const [editUnit, setEditUnit] = useState<TentType['units'][0] | null>(null);
  const [editPhoto, setEditPhoto] = useState('');
  const [editStatus, setEditStatus] = useState('AVAILABLE');
  const [editOwnerId, setEditOwnerId] = useState<string | undefined>(undefined);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [savingUnit, setSavingUnit] = useState(false);

  const { data: users } = useUsers();

  const filtered = tents?.filter((t: any) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.brand?.name?.toLowerCase().includes(q) ||
      t.type?.name?.toLowerCase().includes(q)
    );
  });

  const openUnitModal = (tent: TentType) => {
    setSelectedTent(tent);
    setUnitModalOpen(true);
  };

  const openEditModal = (unit: TentType['units'][0]) => {
    setEditUnit(unit);
    setEditPhoto(unit.photo || '');
    setEditStatus(unit.status);
    setEditOwnerId(unit.ownerId || undefined);
    setEditModalOpen(true);
  };

  const saveUnit = async () => {
    if (!selectedTent || !editUnit) return;
    setSavingUnit(true);
    try {
      await api.patch(`/admin/tents/${selectedTent.id}/units/${editUnit.id}`, {
        photo: editPhoto || null,
        status: editStatus,
        ownerId: editOwnerId || null,
      });
      setEditModalOpen(false);
      qc.invalidateQueries({ queryKey: ['admin-tents'] });
      qc.invalidateQueries({ queryKey: ['admin-tent', selectedTent.id] });
    } finally {
      setSavingUnit(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Склад</h2>
        <div className="flex gap-2">
          <Link to={ROUTES.ADMIN_SETTINGS}>
            <Button size="sm" variant="outline">
              <Settings className="h-4 w-4 mr-1" />
              Справочники
            </Button>
          </Link>
          <Link to={`${ROUTES.ADMIN_INVENTORY_TENTS}/create`}>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Добавить тип палатки
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex gap-2 mb-8 border-b">
        <Link
          to={ROUTES.ADMIN_INVENTORY_TENTS}
          className={cn(
            'flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors',
            location.pathname === ROUTES.ADMIN_INVENTORY_TENTS
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <Tent className="h-4 w-4" />
          Палатки
        </Link>
        <Link
          to={ROUTES.ADMIN_INVENTORY_ACCESSORIES}
          className={cn(
            'flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors',
            location.pathname.startsWith(ROUTES.ADMIN_INVENTORY_ACCESSORIES)
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <Package className="h-4 w-4" />
          Периферия
        </Link>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Поиск по названию, бренду или типу..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filtered && filtered.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          <PackageOpen className="h-12 w-12 mx-auto mb-4" />
          <p>Палатки не найдены</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered?.map((tent: any) => {
            const imgUrl = tent.mainImage?.startsWith('/api/upload/')
              ? `${API_BASE_URL}${tent.mainImage}`
              : tent.mainImage || FALLBACK_IMAGE;
            const availableCount = tent.units?.filter((u: any) => u.status === 'AVAILABLE').length || 0;
            return (
              <Card
                key={tent.id}
                className={cn(!tent.isActive && 'opacity-60', 'overflow-hidden cursor-pointer hover:shadow-md transition-shadow')}
                onClick={() => openUnitModal(tent)}
              >
                <div className="flex flex-col sm:flex-row">
                  <img
                    src={imgUrl}
                    alt={tent.name}
                    className="h-40 w-full sm:w-48 object-cover bg-muted"
                    onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                  />
                  <div className="flex-1 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="font-semibold text-base">{tent.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {tent.brand?.name || '—'} · {tent.type?.name || '—'} · {tent.season?.name || '—'} · {tent.capacity} чел.
                        </p>
                      </div>
                      <Badge variant={tent.isActive ? 'default' : 'secondary'}>
                        {tent.isActive ? 'Активна' : 'Неактивна'}
                      </Badge>
                    </div>
                    <div className="text-sm space-y-1 mb-4">
                      <p><span className="text-muted-foreground">Цена:</span> {tent.dailyPrice.toLocaleString()} ₸/сут</p>
                      <p><span className="text-muted-foreground">Единиц на складе:</span> {tent.units?.length || 0} <span className="text-green-600">({availableCount} доступно)</span></p>
                      <p><span className="text-muted-foreground">Вес:</span> {tent.weight} кг</p>
                    </div>
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <Link to={`${ROUTES.ADMIN_INVENTORY_TENTS}/${tent.id}/edit`}>
                        <Button size="sm" variant="outline">Редактировать тип</Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (confirm('Удалить тип палатки и все единицы?')) deleteTent.mutate(tent.id);
                        }}
                        disabled={deleteTent.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Units Modal */}
      <Dialog open={unitModalOpen} onOpenChange={setUnitModalOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedTent?.name} — единицы на складе
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {selectedTent?.units?.length === 0 && (
              <p className="text-sm text-muted-foreground">Нет единиц на складе</p>
            )}
            {selectedTent?.units?.map((unit: any) => {
              const unitImg = unit.photo?.startsWith('/api/upload/')
                ? `${API_BASE_URL}${unit.photo}`
                : unit.photo || selectedTent?.mainImage || FALLBACK_IMAGE;
              return (
                <div key={unit.id} className="flex items-center gap-4 rounded-lg border p-3">
                  <img
                    src={unitImg}
                    alt={unit.inventoryCode}
                    className="h-16 w-16 rounded-md object-cover bg-muted shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{unit.inventoryCode}</span>
                      <Badge className={statusColors[unit.status] || 'bg-gray-500'}>{statusLabels[unit.status] || unit.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      Владелец: {unit.owner?.name || unit.owner?.email || 'Не назначен'}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => openEditModal(unit)}>
                    <Pencil className="h-3.5 w-3.5 mr-1" />
                    Изменить
                  </Button>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Unit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Редактировать единицу</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Фото единицы</Label>
              <ImageUpload value={editPhoto} onChange={setEditPhoto} />
              {!editPhoto && <p className="text-xs text-muted-foreground">Если не загрузить фото, будет использовано фото типа палатки</p>}
            </div>
            <div className="space-y-2">
              <Label>Статус</Label>
              <Select value={editStatus} onValueChange={setEditStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AVAILABLE">Доступна</SelectItem>
                  <SelectItem value="DAMAGED">Повреждена</SelectItem>
                  <SelectItem value="MAINTENANCE">На ремонте</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Владелец</Label>
              <Select value={editOwnerId || ''} onValueChange={(v) => setEditOwnerId(v || undefined)}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите владельца" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Не назначен</SelectItem>
                  {users?.map((u) => (
                    <SelectItem key={u.id} value={u.id}>{u.name || u.email}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>Отмена</Button>
            <Button onClick={saveUnit} disabled={savingUnit}>
              {savingUnit && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
