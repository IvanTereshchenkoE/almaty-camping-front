import { Tent, Phone, Mail, MapPin, Clock, ArrowUpRight, LogIn, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/config';
import { useAuthStore } from '@/entities/user/model';
import { useTranslation } from 'react-i18next';

const FOOTER_LINKS = [
  { labelKey: 'nav.catalog', to: ROUTES.CATALOG },
  { labelKey: 'nav.myOrders', to: ROUTES.MY_ORDERS },
  { labelKey: 'locations.title', to: '/#locations' },
];

export const Footer = () => {
  const { t } = useTranslation(['common', 'home']);
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
              {t('footer.brandDesc')}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">
              {t('footer.navigation')}
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group inline-flex items-center text-sm text-white/70 transition-colors hover:text-emerald-300"
                  >
                    {t(link.labelKey, { ns: 'common' })}
                    <ArrowUpRight className="ml-1 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">
              {t('footer.contacts')}
            </h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
                <span>{t('footer.address')}</span>
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
                  {t('footer.workHoursWeek')}
                  <br />
                  <span className="text-white/50">{t('footer.workHoursWeekend')}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-white/40">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
          <div className="flex items-center gap-4">
            <p className="text-xs text-white/30">
              {t('footer.madeWithLove')}
            </p>
            {isAuth ? (
              <button
                onClick={() => {
                  logout();
                  navigate(ROUTES.HOME);
                }}
                className="inline-flex items-center gap-1 text-[11px] text-white/20 transition-colors hover:text-white/50"
              >
                <LogOut className="h-3 w-3" />
                {t('nav.logout')}
              </button>
            ) : (
              <Link
                to={ROUTES.LOGIN}
                className="inline-flex items-center gap-1 text-[11px] text-white/20 transition-colors hover:text-white/50"
              >
                <LogIn className="h-3 w-3" />
                {t('nav.login')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
