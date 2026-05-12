import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Button } from '@/shared/ui/button';
import { useEffect } from 'react';

const schema = z.object({
  clientName: z.string().min(2, 'Минимум 2 символа'),
  phone: z.string().min(1, 'Обязательно').regex(/^\+?[0-9\s\-()]{10,}$/, 'Некорректный номер'),
  telegram: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.union([z.string().email('Некорректный email'), z.literal('')]),
  comment: z.string().optional(),
});

export type ContactFormData = z.infer<typeof schema>;

interface Props {
  defaultValues?: Partial<ContactFormData>;
  onSubmit: (data: ContactFormData) => void;
  onBack?: () => void;
  isPending?: boolean;
}

export const ContactForm = ({ defaultValues, onSubmit, onBack, isPending }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="clientName">
            Имя <span className="text-red-500">*</span>
          </Label>
          <Input
            id="clientName"
            {...register('clientName')}
            placeholder="Ваше имя"
            className="h-[52px] rounded-2xl border-emerald-900/10"
          />
          {errors.clientName && (
            <p className="text-xs text-red-500">{errors.clientName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            Телефон <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            {...register('phone')}
            placeholder="+7 (XXX) XXX-XX-XX"
            className="h-[52px] rounded-2xl border-emerald-900/10"
          />
          {errors.phone && (
            <p className="text-xs text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="telegram">Telegram</Label>
          <Input
            id="telegram"
            {...register('telegram')}
            placeholder="@username"
            className="h-[52px] rounded-2xl border-emerald-900/10"
          />
          {errors.telegram && (
            <p className="text-xs text-red-500">{errors.telegram.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            id="whatsapp"
            {...register('whatsapp')}
            placeholder="+7..."
            className="h-[52px] rounded-2xl border-emerald-900/10"
          />
          {errors.whatsapp && (
            <p className="text-xs text-red-500">{errors.whatsapp.message}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="email@example.com"
            className="h-[52px] rounded-2xl border-emerald-900/10"
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="comment">Комментарий</Label>
          <textarea
            id="comment"
            {...register('comment')}
            rows={3}
            placeholder="Дополнительная информация..."
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
            Назад
          </Button>
        )}
        <Button
          type="submit"
          disabled={isPending}
          className="h-12 flex-1 rounded-2xl bg-emerald-700 hover:bg-emerald-800"
        >
          {isPending ? 'Сохранение...' : 'Далее'}
        </Button>
      </div>
    </form>
  );
};
