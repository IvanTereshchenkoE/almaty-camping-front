import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { ROUTES } from '@/shared/config';
import { CheckCircle } from 'lucide-react';

export const OrderSuccessPage = () => {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <CheckCircle className="h-16 w-16 text-primary mx-auto mb-6" />
      <h2 className="text-3xl font-bold tracking-tight mb-4">Заявка отправлена!</h2>
      <p className="text-muted-foreground mb-8">
        Мы получили ваш заказ. Администратор свяжется с вами в ближайшее время для подтверждения.
      </p>
      <Link to={ROUTES.HOME}>
        <Button>На главную</Button>
      </Link>
    </div>
  );
};
