import { api } from '@/shared/api';

export interface AdminOrder {
  id: string;
  orderNumber: string;
  clientName: string;
  phone: string;
  telegram?: string;
  whatsapp?: string;
  email?: string;
  comment?: string;
  startDate: string;
  endDate: string;
  rentalDays: number;
  status: string;
  paymentStatus: string;
  prepaymentAmount: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items: {
    id: string;
    itemType: string;
    nameSnapshot: string;
    quantity: number;
    dailyPriceSnapshot: number;
    rentalDays: number;
    totalPrice: number;
  }[];
  payments: {
    id: string;
    amount: number;
    type: string;
    method: string;
    comment?: string;
    createdAt: string;
  }[];
}

export interface StatusHistoryItem {
  id: string;
  orderId: string;
  fromStatus: string;
  toStatus: string;
  comment: string | null;
  createdAt: string;
}

export interface AnalyticsData {
  byTent: { name: string; count: number; revenue: number }[];
  totalRevenue: number;
  totalRentals: number;
}

export const adminOrdersApi = {
  getAll: async (status?: string): Promise<AdminOrder[]> => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    const { data } = await api.get(`/admin/orders?${params.toString()}`);
    return data;
  },
  getById: async (id: string): Promise<AdminOrder> => {
    const { data } = await api.get(`/admin/orders/${id}`);
    return data;
  },
  getStatusHistory: async (id: string): Promise<StatusHistoryItem[]> => {
    const { data } = await api.get(`/admin/orders/${id}/status-history`);
    return data;
  },
  updateStatus: async (id: string, status: string, comment?: string, resetHistory?: boolean): Promise<AdminOrder> => {
    const { data } = await api.patch(`/admin/orders/${id}/status`, { status, comment, resetHistory });
    return data;
  },
  updatePrepayment: async (id: string, amount: number): Promise<AdminOrder> => {
    const { data } = await api.patch(`/admin/orders/${id}/prepayment`, { amount });
    return data;
  },
  archiveOrder: async (id: string): Promise<AdminOrder> => {
    const { data } = await api.post(`/admin/orders/${id}/archive`);
    return data;
  },
  archiveOld: async (): Promise<{ count: number }> => {
    const { data } = await api.post('/admin/orders/archive-old');
    return data;
  },
  getAnalytics: async (startDate?: string, endDate?: string): Promise<any> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const { data } = await api.get(`/admin/orders/analytics?${params.toString()}`);
    return data;
  },
};
