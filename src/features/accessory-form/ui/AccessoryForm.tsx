import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Checkbox } from '@/shared/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { ImageUpload } from '@/shared/ui/image-upload';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/shared/ui/select';
import { useAccessoryBrands } from '@/entities/accessory-brand/model/use-accessory-brands';
import { useAccessoryTypes } from '@/entities/accessory-type/model/use-accessory-types';
import { useAccessorySeasons } from '@/entities/accessory-season/model/use-accessory-seasons';
import { useAccessoryCategories } from '@/entities/accessory-category/model/use-accessory-categories';
import { useCreateAccessory, useUpdateAccessory, useAdminAccessory } from '@/entities/accessory/model/use-admin-accessories';
import { api } from '@/shared/api';
import { ROUTES } from '@/shared/config';
import { Loader2 } from 'lucide-react';

const schema = z.object({
  name: z.string().min(1, 'Обязательно'),
  accessoryBrandId: z.string().min(1, 'Обязательно'),
  accessoryTypeDictId: z.string().min(1, 'Обязательно'),
  accessorySeasonId: z.string().min(1, 'Обязательно'),
  categoryId: z.string().min(1, 'Выберите категорию'),
  dailyPrice: z.coerce.number().min(1, 'Обязательно'),
  shortDescription: z.string().default(''),
  description: z.string().default(''),
  mainImage: z.string().default(''),
  isActive: z.boolean().default(true),
  unitsCount: z.coerce.number().min(0).default(0),
});

type FormData = z.infer<typeof schema>;

interface Props {
  mode: 'create' | 'edit';
  accessoryId?: string;
}

export const AccessoryForm = ({ mode, accessoryId }: Props) => {
  const navigate = useNavigate();
  const { data: brands } = useAccessoryBrands();
  const { data: types } = useAccessoryTypes();
  const { data: seasons } = useAccessorySeasons();
  const { data: categories } = useAccessoryCategories();
  const { data: existing } = useAdminAccessory(accessoryId || '');
  const create = useCreateAccessory();
  const update = useUpdateAccessory();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      dailyPrice: 1000,
      isActive: true,
      unitsCount: 1,
    },
  });

  const mainImage = watch('mainImage');
  const isActive = watch('isActive');
  const categoryId = watch('categoryId');
  const accessoryBrandId = watch('accessoryBrandId');
  const accessoryTypeDictId = watch('accessoryTypeDictId');
  const accessorySeasonId = watch('accessorySeasonId');

  useEffect(() => {
    if (existing && mode === 'edit') {
      reset({
        name: existing.name,
        accessoryBrandId:
          existing.accessoryBrandId ?? existing.brand?.id ?? '',
        accessoryTypeDictId:
          existing.accessoryTypeDictId ?? existing.type?.id ?? '',
        accessorySeasonId:
          existing.accessorySeasonId ?? existing.season?.id ?? '',
        categoryId: existing.categoryId,
        dailyPrice: existing.dailyPrice,
        shortDescription: existing.shortDescription,
        description: existing.description,
        mainImage: existing.mainImage,
        isActive: existing.isActive,
        unitsCount: 0,
      });
    }
  }, [existing, mode, reset]);

  const onSubmit = async (data: FormData) => {
    const { unitsCount, ...payload } = data;

    if (mode === 'create') {
      const accessory = await create.mutateAsync(payload);
      if (unitsCount > 0 && accessory?.id) {
        await Promise.all(
          Array.from({ length: unitsCount }).map((_, i) =>
            api.post(`/admin/accessories/${accessory.id}/units`, {
              inventoryCode: `ACC-${accessory.name.slice(0, 5).toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
              status: 'AVAILABLE',
            })
          )
        );
      }
    } else if (accessoryId) {
      await update.mutateAsync({ id: accessoryId, dto: payload });
    }
    navigate(ROUTES.ADMIN_INVENTORY_ACCESSORIES);
  };

  const isPending = create.isPending || update.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-3xl px-4 py-8 md:px-6 space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">
        {mode === 'create' ? 'Новая периферия' : 'Редактировать периферию'}
      </h2>

      <Card>
        <CardHeader>
          <CardTitle>Основное</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Название</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Категория</Label>
            <Select value={categoryId} onValueChange={(v) => setValue('categoryId', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Бренд</Label>
            <Select value={accessoryBrandId} onValueChange={(v) => setValue('accessoryBrandId', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите бренд" />
              </SelectTrigger>
              <SelectContent>
                {brands?.map((b) => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.accessoryBrandId && <p className="text-xs text-destructive">{errors.accessoryBrandId.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Тип</Label>
            <Select value={accessoryTypeDictId} onValueChange={(v) => setValue('accessoryTypeDictId', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип" />
              </SelectTrigger>
              <SelectContent>
                {types?.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.accessoryTypeDictId && <p className="text-xs text-destructive">{errors.accessoryTypeDictId.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Сезон</Label>
            <Select value={accessorySeasonId} onValueChange={(v) => setValue('accessorySeasonId', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите сезон" />
              </SelectTrigger>
              <SelectContent>
                {seasons?.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.accessorySeasonId && <p className="text-xs text-destructive">{errors.accessorySeasonId.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="dailyPrice">Цена за сутки (₸)</Label>
            <Input id="dailyPrice" type="number" {...register('dailyPrice')} />
          </div>
          {mode === 'create' && (
            <div className="space-y-2">
              <Label htmlFor="unitsCount">Количество единиц на складе</Label>
              <Input id="unitsCount" type="number" {...register('unitsCount')} />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Описание</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shortDescription">Краткое описание</Label>
            <Input id="shortDescription" {...register('shortDescription')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Полное описание</Label>
            <textarea
              id="description"
              {...register('description')}
              rows={4}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Изображение</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload value={mainImage} onChange={(url) => setValue('mainImage', url)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Настройки</CardTitle>
        </CardHeader>
        <CardContent>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={isActive}
              onCheckedChange={(checked) => setValue('isActive', !!checked)}
            />
            Активна (отображается в каталоге)
          </label>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === 'create' ? 'Создать' : 'Сохранить'}
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate(ROUTES.ADMIN_INVENTORY_ACCESSORIES)}>
          Отмена
        </Button>
      </div>
    </form>
  );
};
