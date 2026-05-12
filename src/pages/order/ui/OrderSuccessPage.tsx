import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Home, ClipboardList } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { ROUTES } from '@/shared/config';

export const OrderSuccessPage = () => {
  const location = useLocation();
  const { orderNumber, totalAmount } = (location.state || {}) as {
    orderNumber?: string;
    totalAmount?: number;
  };

  return (
    <main className="min-h-screen bg-stone-50/40">
      <div className="mx-auto max-w-xl px-4 py-16 text-center md:py-24">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle className="h-10 w-10 text-emerald-600" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-3">
          Заявка отправлена
        </h1>
        <p className="text-slate-500 mb-8">
          Мы свяжемся с вами для подтверждения бронирования
        </p>

        <div className="rounded-[28px] border border-emerald-900/10 bg-white p-6 shadow-sm mb-8">
          {orderNumber && (
            <div className="mb-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Номер заказа</p>
              <p className="text-lg font-bold text-slate-900">{orderNumber}</p>
            </div>
          )}
          {totalAmount !== undefined && (
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Итого</p>
              <p className="text-2xl font-bold text-slate-900">{totalAmount.toLocaleString()} ₸</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to={ROUTES.MY_ORDERS}>
            <Button variant="outline" className="h-12 w-full rounded-2xl border-emerald-900/10 sm:w-auto sm:px-8">
              <ClipboardList className="mr-2 h-4 w-4" />
              Мои заказы
            </Button>
          </Link>
          <Link to={ROUTES.HOME}>
            <Button className="h-12 w-full rounded-2xl bg-emerald-700 hover:bg-emerald-800 sm:w-auto sm:px-8">
              <Home className="mr-2 h-4 w-4" />
              На главную
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
};
