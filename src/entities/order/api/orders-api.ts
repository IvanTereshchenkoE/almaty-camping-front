import { api } from '@/shared/api';

export interface CreateOrderPayload {
  clientName: string;
  phone: string;
  telegram?: string;
  whatsapp?: string;
  email?: string;
  comment?: string;
  startDate: string;
  endDate: string;
  rentalDays: number;
  totalAmount: number;
  items: any[];
}

export interface PublicOrder {
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
}

export const ordersApi = {
  create: async (data: CreateOrderPayload): Promise<PublicOrder> => {
    const res = await api.post('/orders', data);
    return res.data;
  },
  getById: async (id: string): Promise<PublicOrder> => {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  },
};
