import { Tent, Phone, Mail, MapPin, Clock, ArrowUpRight, LogIn, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/config';
import { useAuthStore } from '@/entities/user/model';

const FOOTER_LINKS = [
  { label: 'Каталог палаток', to: ROUTES.CATALOG },
  { label: 'Мои заказы', to: ROUTES.MY_ORDERS },
  { label: 'Популярные места', to: '/#locations' },
];

export const Footer = () => {
  const { isAuth, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <footer className="bg-emerald-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Tent className="h-5 w-5 text-emerald-400" />
              <span className="text-lg font-bold tracking-tight">Almaty Camping</span>
            </div>
            <p className="text-sm leading-relaxed text-white/60 max-w-xs">
              Аренда и продажа палаток для кемпинга в Алматы и области. Просто, удобно, с доставкой.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">
              Навигация
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group inline-flex items-center text-sm text-white/70 transition-colors hover:text-emerald-300"
                  >
                    {link.label}
                    <ArrowUpRight className="ml-1 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">
              Контакты
            </h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
                <span>г. Алматы, Казахстан</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>+7 (777) 123-45-67</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>hello@almatycamping.kz</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
                <span>
                  Пн–Пт: 09:00 – 20:00
                  <br />
                  <span className="text-white/50">Сб–Вс: 10:00 – 18:00</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Almaty Camping. Все права защищены.
          </p>
          <div className="flex items-center gap-4">
            <p className="text-xs text-white/30">
              Сделано с любовью к горам
            </p>
            {/* Hidden admin auth link */}
            {isAuth ? (
              <button
                onClick={() => {
                  logout();
                  navigate(ROUTES.HOME);
                }}
                className="inline-flex items-center gap-1 text-[11px] text-white/20 transition-colors hover:text-white/50"
              >
                <LogOut className="h-3 w-3" />
                Выйти
              </button>
            ) : (
              <Link
                to={ROUTES.LOGIN}
                className="inline-flex items-center gap-1 text-[11px] text-white/20 transition-colors hover:text-white/50"
              >
                <LogIn className="h-3 w-3" />
                Вход для админа
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
