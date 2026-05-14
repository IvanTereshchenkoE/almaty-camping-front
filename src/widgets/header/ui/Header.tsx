import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/shared/config';
import {
  Tent,
  ClipboardList,
  Package,
  ListOrdered,
  LogOut,
  Menu,
  X,
  BarChart3,
  Settings,
  Home,
  ShoppingBag,
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useAuthStore } from '@/entities/user/model';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/shared/lib/cn';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/features/language-switcher/ui/LanguageSwitcher';

export const Header = () => {
  const { t } = useTranslation('common');
  const location = useLocation();
  const { isAuth, isAdmin, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileRef = useRef<HTMLDivElement>(null);

  const desktopBP = isAdmin ? 'xl' : 'md';
  const mobileBP = isAdmin ? 'xl' : 'md';

  const navItems = [
    { to: ROUTES.HOME, label: t('nav.home'), icon: Home },
    { to: ROUTES.CATALOG, label: t('nav.catalog'), icon: ShoppingBag },
  ];

  const adminItems = [
    { to: ROUTES.ADMIN_ORDERS, label: t('nav.admin.orders'), icon: ClipboardList },
    { to: ROUTES.ADMIN_INVENTORY_TENTS, label: t('nav.admin.inventory'), icon: Package },
    { to: ROUTES.ADMIN_ANALYTICS, label: t('nav.admin.analytics'), icon: BarChart3 },
    { to: ROUTES.ADMIN_SETTINGS, label: t('nav.admin.settings'), icon: Settings },
  ];

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e: MouseEvent) => {
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [mobileOpen]);

  function isActive(pathname: string, to: string, exact = false) {
    if (exact) return pathname === to;
    return pathname === to || pathname.startsWith(to + '/');
  }

  const desktopNavLink = (item: { to: string; label: string; icon?: React.ElementType }, exact = false) => {
    const active = isActive(location.pathname, item.to, exact);
    return (
      <Link
        key={item.to}
        to={item.to}
        className={cn(
          'relative inline-flex items-center gap-1.5 h-11 px-3.5 text-sm font-medium rounded-full transition-all',
          active
            ? 'bg-white text-emerald-700 shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_rgba(15,118,110,0.08)]'
            : 'text-slate-600 hover:bg-white/70 hover:text-emerald-700'
        )}
      >
        {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <header
      ref={mobileRef}
      className="sticky top-0 z-50 w-full border-b border-emerald-900/10 bg-white/85 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to={ROUTES.HOME} className="flex items-center gap-2 text-emerald-800 shrink-0">
          <Tent className="h-6 w-6" />
          <span className="text-lg font-bold tracking-tight hidden sm:inline">Almaty Camping</span>
        </Link>

        {/* Desktop nav */}
        <nav
          className={cn(
            'hidden items-center',
            desktopBP === 'xl' ? 'xl:flex' : 'md:flex'
          )}
        >
          <div className="flex items-center gap-[3px] rounded-full border border-emerald-950/10 bg-emerald-950/[0.03] p-[5px]">
            {navItems.map((item) => desktopNavLink(item, item.to === ROUTES.HOME))}
            {desktopNavLink({ to: ROUTES.MY_ORDERS, label: t('nav.myOrders'), icon: ListOrdered })}
            {isAdmin && adminItems.map((item) => desktopNavLink(item))}
          </div>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          <div className={cn(
            mobileBP === 'xl' ? 'hidden xl:flex' : 'hidden md:flex'
          )}>
            <LanguageSwitcher />
          </div>

          {isAdmin && isAuth && (
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className={cn(
                'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50',
                mobileBP === 'xl' ? 'hidden xl:inline-flex' : 'hidden md:inline-flex'
              )}
            >
              <LogOut className="h-4 w-4 mr-1" />
              {t('nav.logout')}
            </Button>
          )}

          <Button
            variant="outline"
            size="icon"
            className={cn(
              'h-9 w-9 rounded-lg border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-50 hover:text-emerald-900',
              mobileBP === 'xl' ? 'xl:hidden' : 'md:hidden'
            )}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? t('nav.closeMenu') : t('nav.openMenu')}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          className={cn(
            'border-b border-emerald-900/10 bg-white/95 backdrop-blur-xl animate-in slide-in-from-top-2 fade-in duration-200',
            mobileBP === 'xl' ? 'xl:hidden' : 'md:hidden'
          )}
        >
          <div className="space-y-1 p-4 max-w-7xl mx-auto">
            <div className="flex items-center justify-between px-3 py-2">
              <LanguageSwitcher />
            </div>
            {[...navItems, { to: ROUTES.MY_ORDERS, label: t('nav.myOrders'), icon: ListOrdered }].map((item) => {
              const active = isActive(location.pathname, item.to, item.to === ROUTES.HOME);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                    active
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                  {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                </Link>
              );
            })}

            {isAdmin && (
              <div className="pt-2 mt-2 border-t border-slate-100">
                <p className="px-3 pb-1 text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {t('nav.admin.title', 'Админ')}
                </p>
                {adminItems.map((item) => {
                  const active = isActive(location.pathname, item.to);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={cn(
                        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                        active
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {item.label}
                      {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
