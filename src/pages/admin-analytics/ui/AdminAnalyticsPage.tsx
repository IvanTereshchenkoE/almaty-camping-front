import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAnalytics } from '@/entities/order/model/use-admin-orders';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Loader2, ArrowLeft, ShoppingCart, Tent, Puzzle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'];

type TabKey = 'orders' | 'tents' | 'accessories';

function formatValue(value: number, name: string) {
  if (String(name).includes('₸')) {
    return `${Number(value).toLocaleString()} ₸`;
  }
  return `${value} ${name.includes('Count') ? 'pcs' : 'pcs'}`;
}

function BarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border rounded-lg shadow-sm p-3 text-sm">
      <div className="font-medium mb-1">{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-medium">{formatValue(p.value, p.name)}</span>
        </div>
      ))}
    </div>
  );
}

function LineTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border rounded-lg shadow-sm p-3 text-sm">
      <div className="font-medium mb-1">{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-medium">{formatValue(p.value, p.name)}</span>
        </div>
      ))}
    </div>
  );
}

function TopChart({ data, nameKey, valueKey, formatter }: { data: any[]; nameKey: string; valueKey: string; formatter?: (v: number) => string }) {
  const { t } = useTranslation('admin');
  if (!data.length) return <p className="text-sm text-muted-foreground">{t('analytics.noDataTooltip')}</p>;
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={90}
          fill="#8884d8"
          dataKey={valueKey}
          nameKey={nameKey}
        >
          {data.map((_: any, i: number) => (
            <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => (formatter ? formatter(value) : `${value}`)} />
      </PieChart>
    </ResponsiveContainer>
  );
}

function WeeklyChart({ data, countLabel, revenueLabel }: { data: any[]; countLabel: string; revenueLabel: string }) {
  const { t } = useTranslation('admin');
  if (!data.length) return <p className="text-sm text-muted-foreground">{t('analytics.noDataTooltip')}</p>;
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" tick={{ fontSize: 11 }} interval={0} angle={data.length > 6 ? -30 : 0} textAnchor={data.length > 6 ? 'end' : 'middle'} height={data.length > 6 ? 50 : 30} />
        <YAxis yAxisId="left" allowDecimals={false} />
        <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => v.toLocaleString()} />
        <Tooltip content={<BarTooltip />} />
        <Legend />
        <Bar yAxisId="left" dataKey="count" name={countLabel} fill="#3b82f6" radius={[4, 4, 0, 0]} />
        <Bar yAxisId="right" dataKey="revenue" name={revenueLabel} fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function MonthlyChart({ data, countLabel, revenueLabel }: { data: any[]; countLabel: string; revenueLabel: string }) {
  const { t } = useTranslation('admin');
  if (!data.length) return <p className="text-sm text-muted-foreground">{t('analytics.noDataTooltip')}</p>;
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis yAxisId="left" allowDecimals={false} />
        <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => v.toLocaleString()} />
        <Tooltip content={<LineTooltip />} />
        <Legend />
        <Line yAxisId="left" type="monotone" dataKey="count" name={countLabel} stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
        <Line yAxisId="right" type="monotone" dataKey="revenue" name={revenueLabel} stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export const AdminAnalyticsPage = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>('orders');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 3);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const { data: analytics, isLoading } = useAnalytics(startDate, endDate);

  const current = analytics?.[tab];

  const pieData = useMemo(() => {
    if (!current?.byItem) return [];
    return current.byItem;
  }, [current]);

  const TAB_CONFIG: Record<TabKey, { label: string; icon: React.ReactNode }> = {
    orders: { label: t('analytics.ordersTab'), icon: <ShoppingCart className="h-4 w-4" /> },
    tents: { label: t('analytics.tentsTab'), icon: <Tent className="h-4 w-4" /> },
    accessories: { label: t('analytics.accessoriesTab'), icon: <Puzzle className="h-4 w-4" /> },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t('analytics.back')}
      </Button>

      <h2 className="text-3xl font-bold tracking-tight mb-6">{t('analytics.title')}</h2>

      <div className="flex flex-wrap gap-4 items-end mb-6">
        <div className="space-y-2">
          <Label>{t('analytics.from')}</Label>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>{t('analytics.to')}</Label>
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b pb-1">
        {(Object.keys(TAB_CONFIG) as TabKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`
              flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors
              ${tab === key
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'}
            `}
          >
            {TAB_CONFIG[key].icon}
            {TAB_CONFIG[key].label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !current ? (
        <div className="text-center py-24 text-muted-foreground">{t('analytics.noData')}</div>
      ) : (
        <div className="space-y-8">
          {/* Summary */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {tab === 'orders' ? t('analytics.completedOrders') : t('analytics.totalIssued')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{current.totalCount || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{t('analytics.revenue')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{(current.totalRevenue || 0).toLocaleString()} ₸</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {tab === 'orders' ? t('analytics.avgCheck') : t('analytics.items')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {tab === 'orders'
                    ? `${current.totalCount > 0 ? Math.round(current.totalRevenue / current.totalCount).toLocaleString() : 0} ₸`
                    : (current.byItem?.length || 0)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top items pie (only for tents & accessories) */}
          {tab !== 'orders' && (
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t('analytics.topByCount')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <TopChart data={pieData} nameKey="name" valueKey="count" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>{t('analytics.topByRevenue')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <TopChart data={pieData} nameKey="name" valueKey="revenue" formatter={(v) => `${v.toLocaleString()} ₸`} />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Weekly */}
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.byWeeks')}</CardTitle>
            </CardHeader>
            <CardContent>
              <WeeklyChart data={current.weekly || []} countLabel={t('analytics.count')} revenueLabel={t('analytics.revenueTg')} />
            </CardContent>
          </Card>

          {/* Monthly */}
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.byMonths')}</CardTitle>
            </CardHeader>
            <CardContent>
              <MonthlyChart data={current.monthly || []} countLabel={t('analytics.count')} revenueLabel={t('analytics.revenueTg')} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
