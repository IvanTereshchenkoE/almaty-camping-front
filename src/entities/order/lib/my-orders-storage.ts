export interface MyOrderMeta {
  id: string;
  orderNumber: string;
  clientName: string;
  phone: string;
  createdAt: string;
  status: string;
  totalAmount: number;
}

const STORAGE_KEY = 'almaty-camping-my-orders';

export const getMyOrders = (): MyOrderMeta[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const addMyOrder = (order: MyOrderMeta) => {
  const existing = getMyOrders();
  if (existing.some((o) => o.id === order.id)) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify([order, ...existing]));
};

export const removeMyOrder = (id: string) => {
  const existing = getMyOrders();
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(existing.filter((o) => o.id !== id))
  );
};
