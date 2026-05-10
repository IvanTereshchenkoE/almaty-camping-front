import { useNavigate } from 'react-router-dom';
import { useOrderStore } from '@/entities/order/model';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Card, CardContent } from '@/shared/ui/card';
import { ROUTES } from '@/shared/config';

export const OrderContactsPage = () => {
  const navigate = useNavigate();
  const { clientName, phone, telegram, whatsapp, email, comment, setContacts, tentItem } = useOrderStore();

  if (!tentItem) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Сначала выберите палатку</h2>
        <Button onClick={() => navigate(ROUTES.CATALOG)}>В каталог</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 md:px-6">
      <h2 className="text-3xl font-bold tracking-tight mb-8">Контактные данные</h2>
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="name">Имя *</Label>
            <Input id="name" value={clientName} onChange={(e) => setContacts({ clientName: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Телефон *</Label>
            <Input id="phone" value={phone} onChange={(e) => setContacts({ phone: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telegram">Telegram</Label>
            <Input id="telegram" value={telegram} onChange={(e) => setContacts({ telegram: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input id="whatsapp" value={whatsapp} onChange={(e) => setContacts({ whatsapp: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setContacts({ email: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="comment">Комментарий</Label>
            <Input id="comment" value={comment} onChange={(e) => setContacts({ comment: e.target.value })} />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => navigate(ROUTES.ORDER)}>Назад</Button>
            <Button className="flex-1" disabled={!clientName || !phone} onClick={() => navigate(ROUTES.ORDER_SUMMARY)}>
              Далее
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
