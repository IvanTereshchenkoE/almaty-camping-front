import { Tent } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 text-primary mb-4">
              <Tent className="h-5 w-5" />
              <span className="text-lg font-bold">Almaty Camping</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Аренда и продажа палаток для кемпинга в Алматы и области. Просто, удобно, недорого.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Контакты</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>г. Алматы, Казахстан</p>
              <p>Тел: +7 (777) 123-45-67</p>
              <p>Email: hello@almatycamping.kz</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Часы работы</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Пн–Пт: 09:00 – 20:00</p>
              <p>Сб–Вс: 10:00 – 18:00</p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Almaty Camping. Все права защищены.
        </div>
      </div>
    </footer>
  );
};
