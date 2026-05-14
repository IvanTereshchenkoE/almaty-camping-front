import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Button } from '@/shared/ui/button';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export type ContactFormData = {
  clientName: string;
  phone: string;
  telegram?: string;
  whatsapp?: string;
  email?: string;
  comment?: string;
};

interface Props {
  defaultValues?: Partial<ContactFormData>;
  onSubmit: (data: ContactFormData) => void;
  onBack?: () => void;
  isPending?: boolean;
}

export const ContactForm = ({ defaultValues, onSubmit, onBack, isPending }: Props) => {
  const { t } = useTranslation('order');

  const schema = useMemo(() => z.object({
    clientName: z.string().min(2, t('contactForm.required')),
    phone: z.string().min(1, t('contactForm.required')).regex(/^\+?[0-9\s\-()]{10,}$/, t('contactForm.invalidPhone')),
    telegram: z.string().optional(),
    whatsapp: z.string().optional(),
    email: z.union([z.string().email(t('contactForm.required')), z.literal('')]),
    comment: z.string().optional(),
  }), [t]);

  type SchemaType = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      clientName: '',
      phone: '',
      telegram: '',
      whatsapp: '',
      email: '',
      comment: '',
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const onFormSubmit = (data: SchemaType) => {
    onSubmit(data as ContactFormData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="clientName">
            {t('contactForm.name')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="clientName"
            {...register('clientName')}
            placeholder={t('contactForm.namePlaceholder')}
            className="h-[52px] rounded-2xl border-emerald-900/10"
          />
          {errors.clientName && (
            <p className="text-xs text-red-500">{errors.clientName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            {t('contactForm.phone')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            {...register('phone')}
            placeholder={t('contactForm.phonePlaceholder')}
            className="h-[52px] rounded-2xl border-emerald-900/10"
          />
          {errors.phone && (
            <p className="text-xs text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="telegram">{t('contactForm.telegram')}</Label>
          <Input
            id="telegram"
            {...register('telegram')}
            placeholder={t('contactForm.telegramPlaceholder')}
            className="h-[52px] rounded-2xl border-emerald-900/10"
          />
          {errors.telegram && (
            <p className="text-xs text-red-500">{errors.telegram.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsapp">{t('contactForm.whatsapp')}</Label>
          <Input
            id="whatsapp"
            {...register('whatsapp')}
            placeholder={t('contactForm.whatsappPlaceholder')}
            className="h-[52px] rounded-2xl border-emerald-900/10"
          />
          {errors.whatsapp && (
            <p className="text-xs text-red-500">{errors.whatsapp.message}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="email">{t('contactForm.email')}</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder={t('contactForm.emailPlaceholder')}
            className="h-[52px] rounded-2xl border-emerald-900/10"
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="comment">{t('contactForm.comment')}</Label>
          <textarea
            id="comment"
            {...register('comment')}
            rows={3}
            placeholder={t('contactForm.commentPlaceholder')}
            className="flex w-full rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        {onBack && (
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="h-12 flex-1 rounded-2xl border-emerald-900/10"
          >
            {t('contactsPage.back')}
          </Button>
        )}
        <Button
          type="submit"
          disabled={isPending}
          className="h-12 flex-1 rounded-2xl bg-emerald-700 hover:bg-emerald-800"
        >
          {isPending ? `${t('contactsPage.next')}...` : t('contactsPage.next')}
        </Button>
      </div>
    </form>
  );
};
