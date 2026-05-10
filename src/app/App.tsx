import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@/shared/config';
import { useAuthStore } from '@/entities/user/model';
import { Header } from '@/widgets/header/ui';
import { Footer } from '@/widgets/footer/ui';
import { Loader2 } from 'lucide-react';

const HomePage = lazy(() => import('@/pages/home/ui').then((m) => ({ default: m.HomePage })));
const CatalogPage = lazy(() => import('@/pages/catalog/ui').then((m) => ({ default: m.CatalogPage })));
const LoginPage = lazy(() => import('@/pages/login/ui').then((m) => ({ default: m.LoginPage })));
const OrderPage = lazy(() => import('@/pages/order/ui').then((m) => ({ default: m.OrderPage })));
const OrderContactsPage = lazy(() => import('@/pages/order/ui').then((m) => ({ default: m.OrderContactsPage })));
const OrderSummaryPage = lazy(() => import('@/pages/order/ui').then((m) => ({ default: m.OrderSummaryPage })));
const OrderSuccessPage = lazy(() => import('@/pages/order/ui').then((m) => ({ default: m.OrderSuccessPage })));
const MyOrdersPage = lazy(() => import('@/pages/my-orders/ui').then((m) => ({ default: m.MyOrdersPage })));
const AdminOrdersPage = lazy(() => import('@/pages/admin-orders/ui').then((m) => ({ default: m.AdminOrdersPage })));
const AdminOrderDetailPage = lazy(() => import('@/pages/admin-order-detail/ui').then((m) => ({ default: m.AdminOrderDetailPage })));
const AdminInventoryTentsPage = lazy(() => import('@/pages/admin-inventory-tents/ui').then((m) => ({ default: m.AdminInventoryTentsPage })));
const TentCreatePage = lazy(() => import('@/pages/admin-inventory-tents-create/ui').then((m) => ({ default: m.TentCreatePage })));
const TentEditPage = lazy(() => import('@/pages/admin-inventory-tents-edit/ui').then((m) => ({ default: m.TentEditPage })));
const AdminInventoryAccessoriesPage = lazy(() => import('@/pages/admin-inventory-accessories/ui').then((m) => ({ default: m.AdminInventoryAccessoriesPage })));
const AccessoryCreatePage = lazy(() => import('@/pages/admin-inventory-accessories-create/ui').then((m) => ({ default: m.AccessoryCreatePage })));
const AccessoryEditPage = lazy(() => import('@/pages/admin-inventory-accessories-edit/ui').then((m) => ({ default: m.AccessoryEditPage })));
const AdminCategoriesPage = lazy(() => import('@/pages/admin-categories/ui').then((m) => ({ default: m.AdminCategoriesPage })));
const AdminAnalyticsPage = lazy(() => import('@/pages/admin-analytics/ui').then((m) => ({ default: m.AdminAnalyticsPage })));
const AdminSettingsPage = lazy(() => import('@/pages/admin-settings/ui').then((m) => ({ default: m.AdminSettingsPage })));

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuthStore();
  return isAdmin ? <>{children}</> : <Navigate to={ROUTES.LOGIN} replace />;
}

function PageSpinner() {
  return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

export const App = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<PageSpinner />}>
          <Routes>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.CATALOG} element={<CatalogPage />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.MY_ORDERS} element={<MyOrdersPage />} />
            <Route path={ROUTES.ORDER} element={<OrderPage />} />
            <Route path={ROUTES.ORDER_CONTACTS} element={<OrderContactsPage />} />
            <Route path={ROUTES.ORDER_SUMMARY} element={<OrderSummaryPage />} />
            <Route path={ROUTES.ORDER_SUCCESS} element={<OrderSuccessPage />} />

            {/* Admin */}
            <Route
              path={ROUTES.ADMIN_ORDERS}
              element={
                <AdminGuard>
                  <AdminOrdersPage />
                </AdminGuard>
              }
            />
            <Route
              path={`${ROUTES.ADMIN_ORDERS}/:orderId`}
              element={
                <AdminGuard>
                  <AdminOrderDetailPage />
                </AdminGuard>
              }
            />

            {/* Admin Inventory — Tents */}
            <Route
              path={ROUTES.ADMIN_INVENTORY_TENTS}
              element={
                <AdminGuard>
                  <AdminInventoryTentsPage />
                </AdminGuard>
              }
            />
            <Route
              path={`${ROUTES.ADMIN_INVENTORY_TENTS}/create`}
              element={
                <AdminGuard>
                  <TentCreatePage />
                </AdminGuard>
              }
            />
            <Route
              path={`${ROUTES.ADMIN_INVENTORY_TENTS}/:id/edit`}
              element={
                <AdminGuard>
                  <TentEditPage />
                </AdminGuard>
              }
            />

            {/* Admin Inventory — Accessories */}
            <Route
              path={ROUTES.ADMIN_INVENTORY_ACCESSORIES}
              element={
                <AdminGuard>
                  <AdminInventoryAccessoriesPage />
                </AdminGuard>
              }
            />
            <Route
              path={`${ROUTES.ADMIN_INVENTORY_ACCESSORIES}/create`}
              element={
                <AdminGuard>
                  <AccessoryCreatePage />
                </AdminGuard>
              }
            />
            <Route
              path={`${ROUTES.ADMIN_INVENTORY_ACCESSORIES}/:id/edit`}
              element={
                <AdminGuard>
                  <AccessoryEditPage />
                </AdminGuard>
              }
            />
            <Route
              path={`${ROUTES.ADMIN_INVENTORY_ACCESSORIES}/categories`}
              element={
                <AdminGuard>
                  <AdminCategoriesPage />
                </AdminGuard>
              }
            />

            <Route
              path={ROUTES.ADMIN_ANALYTICS}
              element={
                <AdminGuard>
                  <AdminAnalyticsPage />
                </AdminGuard>
              }
            />
            <Route
              path={ROUTES.ADMIN_SETTINGS}
              element={
                <AdminGuard>
                  <AdminSettingsPage />
                </AdminGuard>
              }
            />

            <Route
              path={ROUTES.ADMIN}
              element={<Navigate to={ROUTES.ADMIN_ORDERS} replace />}
            />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};
