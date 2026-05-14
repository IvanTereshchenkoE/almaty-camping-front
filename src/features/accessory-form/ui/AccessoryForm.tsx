import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import { LanguageTabs } from '@/features/language-tabs/ui/LanguageTabs';
import { api } from '@/shared/api';
import { ROUTES } from '@/shared/config';
import { Loader2 } from 'lucide-react';

const schema = z.object({
  name_kk: z.string().min(1, 'required'),
  name_ru: z.string().default(''),
  name_en: z.string().default(''),
  accessoryBrandId: z.string().min(1, 'required'),
  accessoryTypeDictId: z.string().min(1, 'required'),
  accessorySeasonId: z.string().min(1, 'required'),
  categoryId: z.string().min(1, 'selectCategory'),
  dailyPrice: z.coerce.number().min(1, 'required'),
  shortDescription_kk: z.string().default(''),
  shortDescription_ru: z.string().default(''),
  shortDescription_en: z.string().default(''),
  description_kk: z.string().default(''),
  description_ru: z.string().default(''),
  description_en: z.string().default(''),
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
  const { t } = useTranslation('admin');
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
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (existing && mode === 'edit') {
      reset({
        name_kk: existing.name_kk ?? existing.name ?? '',
        name_ru: existing.name_ru ?? '',
        name_en: existing.name_en ?? '',
        accessoryBrandId:
          existing.accessoryBrandId ?? existing.brand?.id ?? '',
        accessoryTypeDictId:
          existing.accessoryTypeDictId ?? existing.type?.id ?? '',
        accessorySeasonId:
          existing.accessorySeasonId ?? existing.season?.id ?? '',
        categoryId: existing.categoryId,
        dailyPrice: existing.dailyPrice,
        shortDescription_kk: existing.shortDescription_kk ?? existing.shortDescription ?? '',
        shortDescription_ru: existing.shortDescription_ru ?? '',
        shortDescription_en: existing.shortDescription_en ?? '',
        description_kk: existing.description_kk ?? existing.description ?? '',
        description_ru: existing.description_ru ?? '',
        description_en: existing.description_en ?? '',
        mainImage: existing.mainImage,
        isActive: existing.isActive,
        unitsCount: 0,
      });
      setImages(Array.isArray(existing.images) ? existing.images : []);
    }
  }, [existing, mode, reset]);

  const onSubmit = async (data: FormData) => {
    const { unitsCount, ...rest } = data;
    const payload = { ...rest, images };

    if (mode === 'create') {
      const accessory = await create.mutateAsync(payload);
      if (unitsCount > 0 && accessory?.id) {
        await Promise.all(
          Array.from({ length: unitsCount }).map((_, i) =>
            api.post(`/admin/accessories/${accessory.id}/units`, {
              inventoryCode: `ACC-${(accessory.name || data.name_kk).slice(0, 5).toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
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

  const nameField = (lang: string) => (
    <div className="space-y-2" key={`name-${lang}`}>
      <Label htmlFor={`name_${lang}`}>{t('accessoryForm.name')} ({lang.toUpperCase()}) {lang === 'kk' && '*'}</Label>
      <Input id={`name_${lang}`} {...register(`name_${lang}` as keyof FormData)} />
      {errors[`name_${lang}` as keyof FormData] && (
        <p className="text-xs text-destructive">{(errors[`name_${lang}` as keyof FormData] as any)?.message}</p>
      )}
    </div>
  );

  const shortDescField = (lang: string) => (
    <div className="space-y-2" key={`short-${lang}`}>
      <Label htmlFor={`shortDescription_${lang}`}>{t('accessoryForm.shortDescription')} ({lang.toUpperCase()})</Label>
      <Input id={`shortDescription_${lang}`} {...register(`shortDescription_${lang}` as keyof FormData)} />
    </div>
  );

  const descField = (lang: string) => (
    <div className="space-y-2" key={`desc-${lang}`}>
      <Label htmlFor={`description_${lang}`}>{t('accessoryForm.fullDescription')} ({lang.toUpperCase()})</Label>
      <textarea
        id={`description_${lang}`}
        {...register(`description_${lang}` as keyof FormData)}
        rows={4}
        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-3xl px-4 py-8 md:px-6 space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">
        {mode === 'create' ? t('accessoryForm.createTitle') : t('accessoryForm.editTitle')}
      </h2>

      <Card>
        <CardHeader>
          <CardTitle>{t('accessoryForm.basic')}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <LanguageTabs>
              {{ kk: nameField('kk'), ru: nameField('ru'), en: nameField('en') }}
            </LanguageTabs>
          </div>
          <div className="space-y-2">
            <Label>{t('accessoryForm.category')}</Label>
            <Select value={categoryId} onValueChange={(v) => setValue('categoryId', v)}>
              <SelectTrigger>
                <SelectValue placeholder={t('accessoryForm.selectCategory')} />
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
            <Label>{t('accessoryForm.brand')}</Label>
            <Select value={accessoryBrandId} onValueChange={(v) => setValue('accessoryBrandId', v)}>
              <SelectTrigger>
                <SelectValue placeholder={t('accessoryForm.selectBrand')} />
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
            <Label>{t('accessoryForm.type')}</Label>
            <Select value={accessoryTypeDictId} onValueChange={(v) => setValue('accessoryTypeDictId', v)}>
              <SelectTrigger>
                <SelectValue placeholder={t('accessoryForm.selectType')} />
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
            <Label>{t('accessoryForm.season')}</Label>
            <Select value={accessorySeasonId} onValueChange={(v) => setValue('accessorySeasonId', v)}>
              <SelectTrigger>
                <SelectValue placeholder={t('accessoryForm.selectSeason')} />
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
            <Label htmlFor="dailyPrice">{t('accessoryForm.dailyPrice')}</Label>
            <Input id="dailyPrice" type="number" {...register('dailyPrice')} />
          </div>
          {mode === 'create' && (
            <div className="space-y-2">
              <Label htmlFor="unitsCount">{t('accessoryForm.unitsCount')}</Label>
              <Input id="unitsCount" type="number" {...register('unitsCount')} />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('accessoryForm.description')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <LanguageTabs>
            {{ kk: shortDescField('kk'), ru: shortDescField('ru'), en: shortDescField('en') }}
          </LanguageTabs>
          <LanguageTabs>
            {{ kk: descField('kk'), ru: descField('ru'), en: descField('en') }}
          </LanguageTabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('accessoryForm.images')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>{t('accessoryForm.mainImage')}</Label>
            <ImageUpload value={mainImage} onChange={(url) => setValue('mainImage', url)} />
          </div>

          <div className="space-y-3">
            <Label>{t('accessoryForm.additionalImages')}</Label>
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
          <CardTitle>{t('accessoryForm.settings')}</CardTitle>
        </CardHeader>
        <CardContent>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={isActive}
              onCheckedChange={(checked) => setValue('isActive', !!checked)}
            />
            {t('accessoryForm.isActive')}
          </label>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === 'create' ? t('accessoryForm.create') : t('accessoryForm.save')}
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate(ROUTES.ADMIN_INVENTORY_ACCESSORIES)}>
          {t('accessoryForm.cancel')}
        </Button>
      </div>
    </form>
  );
};
