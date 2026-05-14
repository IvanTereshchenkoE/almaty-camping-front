import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
import { LanguageTabs } from '@/features/language-tabs/ui/LanguageTabs';
import { Loader2, Trash2 } from 'lucide-react';

const schema = z.object({
  name_kk: z.string().min(1, 'required'),
  name_ru: z.string().default(''),
  name_en: z.string().default(''),
  region_kk: z.string().min(1, 'required'),
  region_ru: z.string().default(''),
  region_en: z.string().default(''),
  distanceFromAlmatyKm: z.coerce.number().min(0, 'min0'),
  description_kk: z.string().default(''),
  description_ru: z.string().default(''),
  description_en: z.string().default(''),
  imageUrl: z.string().default(''),
  features_kk: z.string().default(''),
  features_ru: z.string().default(''),
  features_en: z.string().default(''),
});

type FormData = z.infer<typeof schema>;

interface Props {
  mode: 'create' | 'edit';
  locationId?: string;
  onSuccess?: () => void;
  onDelete?: () => void;
}

export const LocationForm = ({ mode, locationId, onSuccess, onDelete }: Props) => {
  const { t } = useTranslation('admin');
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
      name_kk: '',
      name_ru: '',
      name_en: '',
      region_kk: '',
      region_ru: '',
      region_en: '',
      distanceFromAlmatyKm: 0,
      description_kk: '',
      description_ru: '',
      description_en: '',
      imageUrl: '',
      features_kk: '',
      features_ru: '',
      features_en: '',
    },
  });

  const imageUrl = watch('imageUrl');

  useEffect(() => {
    if (existing && mode === 'edit') {
      reset({
        name_kk: existing.name_kk ?? existing.name ?? '',
        name_ru: existing.name_ru ?? '',
        name_en: existing.name_en ?? '',
        region_kk: existing.region_kk ?? existing.region ?? '',
        region_ru: existing.region_ru ?? '',
        region_en: existing.region_en ?? '',
        distanceFromAlmatyKm: existing.distanceFromAlmatyKm,
        description_kk: existing.description_kk ?? existing.description ?? '',
        description_ru: existing.description_ru ?? '',
        description_en: existing.description_en ?? '',
        imageUrl: existing.imageUrl,
        features_kk: Array.isArray(existing.features_kk) ? existing.features_kk.join(', ') : '',
        features_ru: Array.isArray(existing.features_ru) ? existing.features_ru.join(', ') : '',
        features_en: Array.isArray(existing.features_en) ? existing.features_en.join(', ') : '',
      });
    }
  }, [existing, mode, reset]);

  const onSubmit = async (data: FormData) => {
    const payload = {
      ...data,
      features_kk: data.features_kk.split(',').map((f) => f.trim()).filter(Boolean),
      features_ru: data.features_ru.split(',').map((f) => f.trim()).filter(Boolean),
      features_en: data.features_en.split(',').map((f) => f.trim()).filter(Boolean),
    };

    if (mode === 'create') {
      await create.mutateAsync(payload);
    } else if (locationId) {
      await update.mutateAsync({ id: locationId, dto: payload });
    }
    onSuccess?.();
  };

  const isPending = create.isPending || update.isPending;

  const nameField = (lang: string) => (
    <div className="space-y-2" key={`name-${lang}`}>
      <Label htmlFor={`name_${lang}`}>{t('locationForm.name')} ({lang.toUpperCase()}) {lang === 'kk' && '*'}</Label>
      <Input id={`name_${lang}`} {...register(`name_${lang}` as keyof FormData)} />
      {errors[`name_${lang}` as keyof FormData] && (
        <p className="text-xs text-destructive">{(errors[`name_${lang}` as keyof FormData] as any)?.message}</p>
      )}
    </div>
  );

  const regionField = (lang: string) => (
    <div className="space-y-2" key={`region-${lang}`}>
      <Label htmlFor={`region_${lang}`}>{t('locationForm.region')} ({lang.toUpperCase()}) {lang === 'kk' && '*'}</Label>
      <Input id={`region_${lang}`} {...register(`region_${lang}` as keyof FormData)} />
      {errors[`region_${lang}` as keyof FormData] && (
        <p className="text-xs text-destructive">{(errors[`region_${lang}` as keyof FormData] as any)?.message}</p>
      )}
    </div>
  );

  const descField = (lang: string) => (
    <div className="space-y-2" key={`desc-${lang}`}>
      <Label htmlFor={`description_${lang}`}>{t('locationForm.descriptionLabel')} ({lang.toUpperCase()})</Label>
      <textarea
        id={`description_${lang}`}
        {...register(`description_${lang}` as keyof FormData)}
        rows={4}
        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );

  const featuresField = (lang: string) => (
    <div className="space-y-2" key={`features-${lang}`}>
      <Label htmlFor={`features_${lang}`}>{t('locationForm.features')} ({lang.toUpperCase()})</Label>
      <Input
        id={`features_${lang}`}
        {...register(`features_${lang}` as keyof FormData)}
        placeholder="Например: озеро, лес, рыбалка"
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('locationForm.basic')}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <LanguageTabs>
              {{ kk: nameField('kk'), ru: nameField('ru'), en: nameField('en') }}
            </LanguageTabs>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <LanguageTabs>
              {{ kk: regionField('kk'), ru: regionField('ru'), en: regionField('en') }}
            </LanguageTabs>
          </div>
          <div className="space-y-2">
            <Label htmlFor="distanceFromAlmatyKm">{t('locationForm.distance')}</Label>
            <Input id="distanceFromAlmatyKm" type="number" {...register('distanceFromAlmatyKm')} />
            {errors.distanceFromAlmatyKm && (
              <p className="text-xs text-destructive">{errors.distanceFromAlmatyKm.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('locationForm.description')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <LanguageTabs>
            {{ kk: descField('kk'), ru: descField('ru'), en: descField('en') }}
          </LanguageTabs>
          <LanguageTabs>
            {{ kk: featuresField('kk'), ru: featuresField('ru'), en: featuresField('en') }}
          </LanguageTabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('locationForm.image')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload value={imageUrl} onChange={(url) => setValue('imageUrl', url)} />
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === 'create' ? t('locationForm.create') : t('locationForm.save')}
        </Button>
        <Button type="button" variant="outline" onClick={onSuccess}>
          {t('locationForm.cancel')}
        </Button>
        {mode === 'edit' && onDelete && (
          <Button
            type="button"
            variant="destructive"
            className="ml-auto"
            onClick={onDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t('locationForm.delete')}
          </Button>
        )}
      </div>
    </form>
  );
};
