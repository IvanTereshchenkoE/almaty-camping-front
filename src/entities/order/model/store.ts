import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OrderItem {
  itemType: 'tent' | 'accessory';
  itemId: string;
  nameSnapshot: string;
  quantity: number;
  dailyPriceSnapshot: number;
  totalPrice: number;
}

interface OrderState {
  startDate: string;
  endDate: string;
  rentalDays: number;
  tentItem: OrderItem | null;
  accessories: OrderItem[];
  clientName: string;
  phone: string;
  telegram: string;
  whatsapp: string;
  email: string;
  comment: string;
  setDates: (start: string, end: string) => void;
  setTent: (item: OrderItem | null) => void;
  addAccessory: (item: OrderItem) => void;
  removeAccessory: (itemId: string) => void;
  setContacts: (data: Partial<OrderState>) => void;
  getTotal: () => number;
  clear: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      startDate: '',
      endDate: '',
      rentalDays: 0,
      tentItem: null,
      accessories: [],
      clientName: '',
      phone: '',
      telegram: '',
      whatsapp: '',
      email: '',
      comment: '',
      setDates: (start, end) => {
        const startD = new Date(start);
        const endD = new Date(end);
        const days = Math.max(1, Math.ceil((endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)));
        set({ startDate: start, endDate: end, rentalDays: days });
      },
      setTent: (item) => {
        set({ tentItem: item });
      },
      addAccessory: (item) => {
        set((s) => ({ accessories: [...s.accessories.filter((a) => a.itemId !== item.itemId), item] }));
      },
      removeAccessory: (itemId) => {
        set((s) => ({ accessories: s.accessories.filter((a) => a.itemId !== itemId) }));
      },
      setContacts: (data) => {
        set((s) => ({ ...s, ...data }));
      },
      getTotal: () => {
        const s = get();
        let total = 0;
        if (s.tentItem) total += s.tentItem.totalPrice;
        s.accessories.forEach((a) => (total += a.totalPrice));
        return total;
      },
      clear: () => {
        set({
          startDate: '', endDate: '', rentalDays: 0, tentItem: null, accessories: [],
          clientName: '', phone: '', telegram: '', whatsapp: '', email: '', comment: '',
        });
      },
    }),
    {
      name: 'almaty-camping-order-draft',
    }
  )
);
