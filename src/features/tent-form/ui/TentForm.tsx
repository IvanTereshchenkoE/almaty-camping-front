import { useEffect, useState } from 'react';
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
import { useTentBrands } from '@/entities/tent-brand/model/use-tent-brands';
import { useTentTypes } from '@/entities/tent-type/model/use-tent-types';
import { useTentSeasons } from '@/entities/tent-season/model/use-tent-seasons';
import { useCreateTent, useUpdateTent, useAdminTent } from '@/entities/tent/model/use-admin-tents';
import { api } from '@/shared/api';
import { ROUTES } from '@/shared/config';
import { Loader2 } from 'lucide-react';

const schema = z.object({
  name: z.string().min(1, 'Обязательно'),
  tentBrandId: z.string().min(1, 'Обязательно'),
  tentTypeDictId: z.string().min(1, 'Обязательно'),
  tentSeasonId: z.string().min(1, 'Обязательно'),
  capacity: z.coerce.number().min(1, 'Минимум 1'),
  weight: z.coerce.number().min(0.1, 'Обязательно'),
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
  tentId?: string;
}

export const TentForm = ({ mode, tentId }: Props) => {
  const navigate = useNavigate();
  const { data: brands } = useTentBrands();
  const { data: types } = useTentTypes();
  const { data: seasons } = useTentSeasons();
  const { data: existing } = useAdminTent(tentId || '');
  const create = useCreateTent();
  const update = useUpdateTent();

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
      capacity: 2,
      weight: 1,
      dailyPrice: 3000,
      isActive: true,
      unitsCount: 1,
    },
  });

  const mainImage = watch('mainImage');
  const tentBrandId = watch('tentBrandId');
  const tentTypeDictId = watch('tentTypeDictId');
  const tentSeasonId = watch('tentSeasonId');
  const isActive = watch('isActive');
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (existing && mode === 'edit') {
      reset({
        name: existing.name,
        tentBrandId: existing.brand?.id ?? '',
        tentTypeDictId: existing.type?.id ?? '',
        tentSeasonId: existing.season?.id ?? '',
        capacity: existing.capacity,
        weight: existing.weight,
        dailyPrice: existing.dailyPrice,
        shortDescription: existing.shortDescription,
        description: existing.description,
        mainImage: existing.mainImage,
        isActive: existing.isActive,
        unitsCount: 0,
      });
      setImages(Array.isArray(existing.images) ? existing.images : []);
    }
  }, [existing, mode, reset]);

  const onSubmit = async (data: FormData) => {
    const payload = { ...data, images };
    delete (payload as any).unitsCount;

    if (mode === 'create') {
      const tent = await create.mutateAsync(payload);
      if (data.unitsCount > 0 && tent?.id) {
        await Promise.all(
          Array.from({ length: data.unitsCount }).map((_, i) =>
            api.post(`/admin/tents/${tent.id}/units`, {
              inventoryCode: `${tent.name.slice(0, 5).toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
              status: 'AVAILABLE',
            })
          )
        );
      }
    } else if (tentId) {
      await update.mutateAsync({ id: tentId, dto: payload });
    }
    navigate(ROUTES.ADMIN_INVENTORY_TENTS);
  };

  const isPending = create.isPending || update.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-3xl px-4 py-8 md:px-6 space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">
        {mode === 'create' ? 'Новая палатка' : 'Редактировать палатку'}
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
            <Label>Бренд</Label>
            <Select value={tentBrandId} onValueChange={(v) => setValue('tentBrandId', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите бренд" />
              </SelectTrigger>
              <SelectContent>
                {brands?.map((b) => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.tentBrandId && <p className="text-xs text-destructive">{errors.tentBrandId.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Тип</Label>
            <Select value={tentTypeDictId} onValueChange={(v) => setValue('tentTypeDictId', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип" />
              </SelectTrigger>
              <SelectContent>
                {types?.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.tentTypeDictId && <p className="text-xs text-destructive">{errors.tentTypeDictId.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Сезон</Label>
            <Select value={tentSeasonId} onValueChange={(v) => setValue('tentSeasonId', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите сезон" />
              </SelectTrigger>
              <SelectContent>
                {seasons?.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.tentSeasonId && <p className="text-xs text-destructive">{errors.tentSeasonId.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacity">Вместимость</Label>
            <Input id="capacity" type="number" {...register('capacity')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Вес (кг)</Label>
            <Input id="weight" type="number" step="0.1" {...register('weight')} />
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
          <CardTitle>Изображения</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Главное изображение</Label>
            <ImageUpload value={mainImage} onChange={(url) => setValue('mainImage', url)} />
          </div>

          <div className="space-y-3">
            <Label>Дополнительные фотографии</Label>
            <div className="flex flex-wrap gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative h-20 w-20 overflow-hidden rounded-lg border">
                  <img src={img} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] text-white shadow"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <div className="h-20 w-20">
                <ImageUpload
                  value=""
                  onChange={(url) => setImages((prev) => [...prev, url])}
                  className="h-full"
                />
              </div>
            </div>
          </div>
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
        <Button type="button" variant="outline" onClick={() => navigate(ROUTES.ADMIN_INVENTORY_TENTS)}>
          Отмена
        </Button>
      </div>
    </form>
  );
};
