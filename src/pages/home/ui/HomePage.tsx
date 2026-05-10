import { Link } from 'react-router-dom';
import { useLocations } from '@/entities/location/model';
import { ROUTES } from '@/shared/config';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { MapPin, Car, Camera, Mountain, Loader2 } from 'lucide-react';

export const HomePage = () => {
  const { data: locations, isLoading } = useLocations();

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-600 to-green-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-24 md:py-32 md:px-6 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-6">
            Кемпинг в Алматы — просто и удобно
          </h1>
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-white/90 mb-8">
            Мы не профессиональные альпинисты. Мы обычные люди, которые любят природу.
            Возьми палатку в аренду или купи свою — и отправляйся на выходные в горы.
          </p>
          <Link to={ROUTES.CATALOG}>
            <Button size="lg" variant="secondary" className="font-semibold">
              Посмотреть палатки
            </Button>
          </Link>
        </div>
      </section>

      {/* Why us */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
            Почему выбирают нас
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: MapPin, title: 'Близко к городу', desc: 'Все локации в радиусе 450 км от Алматы' },
              { icon: Car, title: 'Доставка', desc: 'Привезем палатку к месту старта или заберем оттуда' },
              { icon: Camera, title: 'Простая аренда', desc: 'Без залога и лишних документов. Онлайн бронирование' },
              { icon: Mountain, title: 'Для всех', desc: 'От новичков до опытных. Подберем палатку под ваш уровень' },
            ].map((item) => (
              <Card key={item.title} className="text-center">
                <CardHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{item.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
            Популярные места для кемпинга
          </h2>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {locations?.map((loc) => (
                <Card key={loc.id} className="overflow-hidden">
                  <img
                    alt={loc.name}
                    src={loc.imageUrl}
                    className="h-48 w-full object-cover"
                  />
                  <CardHeader>
                    <CardTitle className="text-lg">{loc.name}</CardTitle>
                    <CardDescription>{loc.distanceFromAlmatyKm} км от Алматы</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{loc.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(loc.features) ? loc.features : []).map((f) => (
                        <Badge key={f} variant="secondary">{f}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Готовы к выходным на природе?
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground mb-8">
            Выбери палатку из каталога, укажи даты — и мы все подготовим. Останется только собрать рюкзак.
          </p>
          <Link to={ROUTES.CATALOG}>
            <Button size="lg">Перейти в каталог</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
