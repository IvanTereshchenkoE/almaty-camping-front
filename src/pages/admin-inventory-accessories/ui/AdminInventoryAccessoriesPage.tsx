import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAdminAccessories, useDeleteAccessory } from '@/entities/accessory/model/use-admin-accessories';
import { useAccessoryCategories } from '@/entities/accessory-category/model/use-accessory-categories';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Input } from '@/shared/ui/input';
import { Loader2, Trash2, Plus, PackageOpen, Tag, Tent, Package } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { ROUTES } from '@/shared/config';
import { API_BASE_URL } from '@/shared/api';

const FALLBACK_IMAGE = 'https://placehold.co/400x300?text=No+Image';

export const AdminInventoryAccessoriesPage = () => {
  const [search, setSearch] = useState('');
  const { data: accessories, isLoading } = useAdminAccessories();
  const { data: categories } = useAccessoryCategories();
  const deleteAccessory = useDeleteAccessory();
  const location = useLocation();

  const categoryMap = new Map(categories?.map((c) => [c.id, c.name]));

  const filtered = accessories?.filter((a) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return a.name.toLowerCase().includes(q) || categoryMap.get(a.categoryId)?.toLowerCase().includes(q);
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Склад</h2>
        <div className="flex gap-2">
          <Link to={`${ROUTES.ADMIN_INVENTORY_ACCESSORIES}/categories`}>
            <Button size="sm" variant="outline">
              <Tag className="h-4 w-4 mr-1" />
              Категории
            </Button>
          </Link>
          <Link to={`${ROUTES.ADMIN_INVENTORY_ACCESSORIES}/create`}>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Добавить периферию
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
          placeholder="Поиск по названию или категории..."
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
          <p>Периферия не найдена</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered?.map((acc) => {
            const imgUrl = acc.mainImage?.startsWith('/api/upload/')
              ? `${API_BASE_URL}${acc.mainImage}`
              : acc.mainImage || FALLBACK_IMAGE;
            return (
              <Card key={acc.id} className={cn(!acc.isActive && 'opacity-60', 'overflow-hidden')}>
                <div className="flex flex-col sm:flex-row">
                  <img
                    src={imgUrl}
                    alt={acc.name}
                    className="h-40 w-full sm:w-48 object-cover bg-muted"
                    onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                  />
                  <div className="flex-1 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="font-semibold text-base">{acc.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {categoryMap.get(acc.categoryId) || 'Без категории'}
                        </p>
                      </div>
                      <Badge variant={acc.isActive ? 'default' : 'secondary'}>
                        {acc.isActive ? 'Активна' : 'Неактивна'}
                      </Badge>
                    </div>
                    <div className="text-sm space-y-1 mb-4">
                      <p><span className="text-muted-foreground">Цена:</span> {acc.dailyPrice.toLocaleString()} ₸/сут</p>
                      <p><span className="text-muted-foreground">Единиц:</span> {acc.units.length}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`${ROUTES.ADMIN_INVENTORY_ACCESSORIES}/${acc.id}/edit`}>
                        <Button size="sm" variant="outline">Редактировать</Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (confirm('Удалить периферию?')) deleteAccessory.mutate(acc.id);
                        }}
                        disabled={deleteAccessory.isPending}
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
    </div>
  );
};
