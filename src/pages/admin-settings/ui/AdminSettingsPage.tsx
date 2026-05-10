import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Loader2, Trash2, Save, Plus, ArrowLeft, Tent, Package, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTentBrands, useCreateTentBrand, useUpdateTentBrand, useDeleteTentBrand } from '@/entities/tent-brand/model/use-tent-brands';
import { useTentTypes, useCreateTentType, useUpdateTentType, useDeleteTentType } from '@/entities/tent-type/model/use-tent-types';
import { useTentSeasons, useCreateTentSeason, useUpdateTentSeason, useDeleteTentSeason } from '@/entities/tent-season/model/use-tent-seasons';
import { useAccessoryBrands, useCreateAccessoryBrand, useUpdateAccessoryBrand, useDeleteAccessoryBrand } from '@/entities/accessory-brand/model/use-accessory-brands';
import { useAccessoryTypes, useCreateAccessoryType, useUpdateAccessoryType, useDeleteAccessoryType } from '@/entities/accessory-type/model/use-accessory-types';
import { useAccessorySeasons, useCreateAccessorySeason, useUpdateAccessorySeason, useDeleteAccessorySeason } from '@/entities/accessory-season/model/use-accessory-seasons';

type DictTab = 'tent-brands' | 'tent-types' | 'tent-seasons' | 'accessory-brands' | 'accessory-types' | 'accessory-seasons';

const TABS: { key: DictTab; label: string; icon: React.ReactNode }[] = [
  { key: 'tent-brands', label: 'Бренды палаток', icon: <Tent className="h-4 w-4" /> },
  { key: 'tent-types', label: 'Типы палаток', icon: <Tent className="h-4 w-4" /> },
  { key: 'tent-seasons', label: 'Сезоны палаток', icon: <Tent className="h-4 w-4" /> },
  { key: 'accessory-brands', label: 'Бренды периферии', icon: <Package className="h-4 w-4" /> },
  { key: 'accessory-types', label: 'Типы периферии', icon: <Package className="h-4 w-4" /> },
  { key: 'accessory-seasons', label: 'Сезоны периферии', icon: <Package className="h-4 w-4" /> },
];

function DictionarySection({
  title,
  items,
  isLoading,
  create,
  update,
  del,
}: {
  title: string;
  items?: { id: string; name: string }[];
  isLoading: boolean;
  create: { mutateAsync: (dto: { name: string }) => Promise<any>; isPending: boolean };
  update: { mutateAsync: (vars: { id: string; dto: { name: string } }) => Promise<any>; isPending: boolean };
  del: { mutateAsync: (id: string) => Promise<any>; isPending: boolean };
}) {
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAdd = async () => {
    if (!newName.trim()) return;
    await create.mutateAsync({ name: newName.trim() });
    setNewName('');
  };

  const handleSave = async (id: string) => {
    if (!editName.trim()) return;
    await update.mutateAsync({ id, dto: { name: editName.trim() } });
    setEditingId(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Новое значение..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Button size="sm" onClick={handleAdd} disabled={create.isPending}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-2">
            {items?.map((item) => (
              <div key={item.id} className="flex items-center gap-2 rounded-md border px-3 py-2">
                {editingId === item.id ? (
                  <>
                    <Input
                      className="h-8"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSave(item.id)}
                      autoFocus
                    />
                    <Button size="sm" variant="ghost" onClick={() => handleSave(item.id)} disabled={update.isPending}>
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                      Отмена
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm">{item.name}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingId(item.id);
                        setEditName(item.name);
                      }}
                    >
                      <Tag className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => {
                        if (confirm('Удалить?')) del.mutateAsync(item.id);
                      }}
                      disabled={del.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            ))}
            {!items?.length && <p className="text-sm text-muted-foreground">Нет записей</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export const AdminSettingsPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<DictTab>('tent-brands');

  const tentBrands = useTentBrands();
  const tentTypes = useTentTypes();
  const tentSeasons = useTentSeasons();
  const accessoryBrands = useAccessoryBrands();
  const accessoryTypes = useAccessoryTypes();
  const accessorySeasons = useAccessorySeasons();

  const createTentBrand = useCreateTentBrand();
  const updateTentBrand = useUpdateTentBrand();
  const deleteTentBrand = useDeleteTentBrand();

  const createTentType = useCreateTentType();
  const updateTentType = useUpdateTentType();
  const deleteTentType = useDeleteTentType();

  const createTentSeason = useCreateTentSeason();
  const updateTentSeason = useUpdateTentSeason();
  const deleteTentSeason = useDeleteTentSeason();

  const createAccessoryBrand = useCreateAccessoryBrand();
  const updateAccessoryBrand = useUpdateAccessoryBrand();
  const deleteAccessoryBrand = useDeleteAccessoryBrand();

  const createAccessoryType = useCreateAccessoryType();
  const updateAccessoryType = useUpdateAccessoryType();
  const deleteAccessoryType = useDeleteAccessoryType();

  const createAccessorySeason = useCreateAccessorySeason();
  const updateAccessorySeason = useUpdateAccessorySeason();
  const deleteAccessorySeason = useDeleteAccessorySeason();

  const tabData: Record<DictTab, {
    title: string;
    items?: { id: string; name: string }[];
    isLoading: boolean;
    create: any;
    update: any;
    del: any;
  }> = {
    'tent-brands': { title: 'Бренды палаток', items: tentBrands.data, isLoading: tentBrands.isLoading, create: createTentBrand, update: updateTentBrand, del: deleteTentBrand },
    'tent-types': { title: 'Типы палаток', items: tentTypes.data, isLoading: tentTypes.isLoading, create: createTentType, update: updateTentType, del: deleteTentType },
    'tent-seasons': { title: 'Сезоны палаток', items: tentSeasons.data, isLoading: tentSeasons.isLoading, create: createTentSeason, update: updateTentSeason, del: deleteTentSeason },
    'accessory-brands': { title: 'Бренды периферии', items: accessoryBrands.data, isLoading: accessoryBrands.isLoading, create: createAccessoryBrand, update: updateAccessoryBrand, del: deleteAccessoryBrand },
    'accessory-types': { title: 'Типы периферии', items: accessoryTypes.data, isLoading: accessoryTypes.isLoading, create: createAccessoryType, update: updateAccessoryType, del: deleteAccessoryType },
    'accessory-seasons': { title: 'Сезоны периферии', items: accessorySeasons.data, isLoading: accessorySeasons.isLoading, create: createAccessorySeason, update: updateAccessorySeason, del: deleteAccessorySeason },
  };

  const current = tabData[tab];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
      <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-1" />
        Назад
      </Button>

      <h2 className="text-3xl font-bold tracking-tight mb-6">Справочники</h2>

      <div className="flex flex-wrap gap-2 mb-6 border-b pb-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              tab === t.key
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      <DictionarySection
        title={current.title}
        items={current.items}
        isLoading={current.isLoading}
        create={current.create}
        update={current.update}
        del={current.del}
      />
    </div>
  );
};
