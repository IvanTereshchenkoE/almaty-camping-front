import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/shared/config';
import { Tent, ClipboardList, Package, ListOrdered, LogIn, LogOut, Menu, X, BarChart3, Settings } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useAuthStore } from '@/entities/user/model';
import { useState } from 'react';
import { cn } from '@/shared/lib/cn';

export const Header = () => {
  const location = useLocation();
  const { isAuth, isAdmin, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { to: ROUTES.HOME, label: 'Главная' },
    { to: ROUTES.CATALOG, label: 'Каталог палаток' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to={ROUTES.HOME} className="flex items-center gap-2 text-primary">
          <Tent className="h-6 w-6" />
          <span className="text-xl font-bold tracking-tight">Almaty Camping</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === item.to ? "text-primary" : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to={ROUTES.MY_ORDERS}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              location.pathname === ROUTES.MY_ORDERS ? "text-primary" : "text-muted-foreground"
            )}
          >
            <ListOrdered className="inline h-4 w-4 mr-1" />
            Мои заказы
          </Link>
          {isAdmin && (
            <>
              <Link
                to={ROUTES.ADMIN_ORDERS}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname.startsWith(ROUTES.ADMIN_ORDERS) ? "text-primary" : "text-muted-foreground"
                )}
              >
                <ClipboardList className="inline h-4 w-4 mr-1" />
                Заказы
              </Link>
              <Link
                to={ROUTES.ADMIN_INVENTORY_TENTS}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === ROUTES.ADMIN_INVENTORY_TENTS ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Package className="inline h-4 w-4 mr-1" />
                Склад
              </Link>
              <Link
                to={ROUTES.ADMIN_ANALYTICS}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === ROUTES.ADMIN_ANALYTICS ? "text-primary" : "text-muted-foreground"
                )}
              >
                <BarChart3 className="inline h-4 w-4 mr-1" />
                Аналитика
              </Link>
              <Link
                to={ROUTES.ADMIN_SETTINGS}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === ROUTES.ADMIN_SETTINGS ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Settings className="inline h-4 w-4 mr-1" />
                Справочники
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {isAuth ? (
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-1" />
              Выйти
            </Button>
          ) : (
            <Link to={ROUTES.LOGIN} className="hidden md:inline-flex">
              <Button variant="ghost" size="sm">
                <LogIn className="h-4 w-4 mr-1" />
                Вход для админа
              </Button>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t md:hidden">
          <div className="space-y-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                  location.pathname === item.to ? "bg-accent text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to={ROUTES.MY_ORDERS}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                location.pathname === ROUTES.MY_ORDERS ? "bg-accent text-primary" : "text-muted-foreground"
              )}
            >
              <ListOrdered className="inline h-4 w-4 mr-1" />
              Мои заказы
            </Link>
            {isAdmin && (
              <>
                <Link
                  to={ROUTES.ADMIN_ORDERS}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                    location.pathname.startsWith(ROUTES.ADMIN_ORDERS) ? "bg-accent text-primary" : "text-muted-foreground"
                  )}
                >
                  <ClipboardList className="inline h-4 w-4 mr-1" />
                  Заказы
                </Link>
                <Link
                  to={ROUTES.ADMIN_INVENTORY_TENTS}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                    location.pathname === ROUTES.ADMIN_INVENTORY_TENTS ? "bg-accent text-primary" : "text-muted-foreground"
                  )}
                >
                  <Package className="inline h-4 w-4 mr-1" />
                  Склад
                </Link>
                <Link
                  to={ROUTES.ADMIN_ANALYTICS}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                    location.pathname === ROUTES.ADMIN_ANALYTICS ? "bg-accent text-primary" : "text-muted-foreground"
                  )}
                >
                  <BarChart3 className="inline h-4 w-4 mr-1" />
                  Аналитика
                </Link>
                <Link
                  to={ROUTES.ADMIN_SETTINGS}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                    location.pathname === ROUTES.ADMIN_SETTINGS ? "bg-accent text-primary" : "text-muted-foreground"
                  )}
                >
                  <Settings className="inline h-4 w-4 mr-1" />
                  Справочники
                </Link>
              </>
            )}
            {!isAuth && (
              <Link
                to={ROUTES.LOGIN}
                onClick={() => setMobileOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent"
              >
                <LogIn className="inline h-4 w-4 mr-1" />
                Вход для админа
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
