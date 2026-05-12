import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { ImageUpload } from '@/shared/ui/image-upload';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import {
  useCreateLocation,
  useUpdateLocation,
  useAdminLocation,
} from '@/entities/location/model';
import { Loader2, Trash2 } from 'lucide-react';

const schema = z.object({
  name: z.string().min(1, 'Обязательно'),
  region: z.string().min(1, 'Обязательно'),
  distanceFromAlmatyKm: z.coerce.number().min(0, 'Минимум 0'),
  description: z.string().min(1, 'Обязательно'),
  imageUrl: z.string().default(''),
  features: z.string().default(''),
});

type FormData = z.infer<typeof schema>;

interface Props {
  mode: 'create' | 'edit';
  locationId?: string;
  onSuccess?: () => void;
  onDelete?: () => void;
}

export const LocationForm = ({ mode, locationId, onSuccess, onDelete }: Props) => {
  const { data: existing } = useAdminLocation(locationId || '');
  const create = useCreateLocation();
  const update = useUpdateLocation();

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
      name: '',
      region: '',
      distanceFromAlmatyKm: 0,
      description: '',
      imageUrl: '',
      features: '',
    },
  });

  const imageUrl = watch('imageUrl');

  useEffect(() => {
    if (existing && mode === 'edit') {
      reset({
        name: existing.name,
        region: existing.region,
        distanceFromAlmatyKm: existing.distanceFromAlmatyKm,
        description: existing.description,
        imageUrl: existing.imageUrl,
        features: Array.isArray(existing.features)
          ? existing.features.join(', ')
          : '',
      });
    }
  }, [existing, mode, reset]);

  const onSubmit = async (data: FormData) => {
    const payload = {
      ...data,
      features: data.features
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean),
    };

    if (mode === 'create') {
      await create.mutateAsync(payload);
    } else if (locationId) {
      await update.mutateAsync({ id: locationId, dto: payload });
    }
    onSuccess?.();
  };

  const isPending = create.isPending || update.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Основное</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">Название</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="region">Регион</Label>
            <Input id="region" {...register('region')} />
            {errors.region && <p className="text-xs text-destructive">{errors.region.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="distanceFromAlmatyKm">Расстояние от Алматы (км)</Label>
            <Input id="distanceFromAlmatyKm" type="number" {...register('distanceFromAlmatyKm')} />
            {errors.distanceFromAlmatyKm && (
              <p className="text-xs text-destructive">{errors.distanceFromAlmatyKm.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Описание</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <textarea
              id="description"
              {...register('description')}
              rows={4}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="features">Особенности (через запятую)</Label>
            <Input
              id="features"
              {...register('features')}
              placeholder="Например: озеро, лес, рыбалка"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Изображение</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload value={imageUrl} onChange={(url) => setValue('imageUrl', url)} />
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === 'create' ? 'Создать' : 'Сохранить'}
        </Button>
        <Button type="button" variant="outline" onClick={onSuccess}>
          Отмена
        </Button>
        {mode === 'edit' && onDelete && (
          <Button
            type="button"
            variant="destructive"
            className="ml-auto"
            onClick={onDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Удалить
          </Button>
        )}
      </div>
    </form>
  );
};
