import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessoryCategories, useCreateAccessoryCategory, useDeleteAccessoryCategory } from '@/entities/accessory-category/model/use-accessory-categories';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Loader2, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/shared/config';

export const AdminCategoriesPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const { data: categories, isLoading } = useAccessoryCategories();
  const create = useCreateAccessoryCategory();
  const remove = useDeleteAccessoryCategory();

  const handleCreate = () => {
    if (!name.trim()) return;
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    create.mutate({ name: name.trim(), slug }, {
      onSuccess: () => setName(''),
    });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-6">
      <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate(ROUTES.ADMIN_INVENTORY_ACCESSORIES)}>
        <ArrowLeft className="h-4 w-4 mr-1" />
        Назад
      </Button>

      <h2 className="text-3xl font-bold tracking-tight mb-8">Категории периферии</h2>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Новая категория</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input
            placeholder="Название категории"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
          <Button onClick={handleCreate} disabled={create.isPending || !name.trim()}>
            <Plus className="h-4 w-4 mr-1" />
            Добавить
          </Button>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-3">
          {categories?.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">{cat.name}</p>
                <p className="text-xs text-muted-foreground">{cat.slug}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (confirm(`Удалить категорию "${cat.name}"?`)) remove.mutate(cat.id);
                }}
                disabled={remove.isPending}
              >
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
          {!categories?.length && (
            <p className="text-center text-muted-foreground py-8">Нет категорий</p>
          )}
        </div>
      )}
    </div>
  );
};
