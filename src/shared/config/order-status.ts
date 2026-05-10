export const statusLabels: Record<string, string> = {
  NEW: 'Новый',
  VIEWED: 'Просмотрен',
  CONFIRMED: 'Подтвержден',
  PREPAID: 'Предоплата',
  ISSUED: 'Выдан',
  RETURNED: 'Возвращен',
  COMPLETED: 'Завершен',
  CANCELLED: 'Отменен',
  DAMAGED: 'Поврежден',
  ARCHIVED: 'Архив',
};

export const statusColors: Record<string, string> = {
  NEW: 'bg-blue-500',
  VIEWED: 'bg-slate-500',
  CONFIRMED: 'bg-yellow-500',
  PREPAID: 'bg-emerald-500',
  ISSUED: 'bg-purple-500',
  RETURNED: 'bg-orange-500',
  COMPLETED: 'bg-green-500',
  CANCELLED: 'bg-gray-500',
  DAMAGED: 'bg-red-500',
  ARCHIVED: 'bg-stone-500',
};

export const allStatuses = Object.keys(statusLabels).filter((s) => s !== 'ARCHIVED');

export const transitions: Record<string, string[]> = {
  NEW: ['VIEWED'],
  VIEWED: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PREPAID', 'CANCELLED'],
  PREPAID: ['ISSUED', 'CANCELLED'],
  ISSUED: ['RETURNED'],
  RETURNED: ['COMPLETED', 'DAMAGED'],
  DAMAGED: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
};
