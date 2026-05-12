import { create } from 'zustand';

export type SortOption = 'availability' | 'price_asc' | 'price_desc' | 'capacity' | 'weight';

export interface TentFiltersState {
  minPrice?: number;
  maxPrice?: number;
  capacity: number[];
  season: string[];
  type: string[];
  maxWeight?: number;
  brand: string[];
  sort: SortOption;
  setMinPrice: (v?: number) => void;
  setMaxPrice: (v?: number) => void;
  toggleCapacity: (v: number) => void;
  toggleSeason: (v: string) => void;
  toggleType: (v: string) => void;
  setMaxWeight: (v?: number) => void;
  toggleBrand: (v: string) => void;
  setSort: (v: SortOption) => void;
  reset: () => void;
}

const initial = {
  capacity: [] as number[],
  season: [] as string[],
  type: [] as string[],
  brand: [] as string[],
  sort: 'availability' as SortOption,
};

export const useTentFiltersStore = create<TentFiltersState>((set) => ({
  ...initial,
  setMinPrice: (v) => set({ minPrice: v }),
  setMaxPrice: (v) => set({ maxPrice: v }),
  toggleCapacity: (v) =>
    set((s) => ({
      capacity: s.capacity.includes(v) ? s.capacity.filter((c) => c !== v) : [...s.capacity, v],
    })),
  toggleSeason: (v) =>
    set((s) => ({
      season: s.season.includes(v) ? s.season.filter((c) => c !== v) : [...s.season, v],
    })),
  toggleType: (v) =>
    set((s) => ({
      type: s.type.includes(v) ? s.type.filter((c) => c !== v) : [...s.type, v],
    })),
  setMaxWeight: (v) => set({ maxWeight: v }),
  toggleBrand: (v) =>
    set((s) => ({
      brand: s.brand.includes(v) ? s.brand.filter((c) => c !== v) : [...s.brand, v],
    })),
  setSort: (v) => set({ sort: v }),
  reset: () => set(initial),
}));
