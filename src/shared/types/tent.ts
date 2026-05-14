export interface TentBrand {
  id: string;
  name: string;
}

export interface TentTypeDict {
  id: string;
  name: string;
}

export interface TentSeason {
  id: string;
  name: string;
}

export interface TentUnit {
  id: string;
  tentId: string;
  inventoryCode: string;
  status: 'AVAILABLE' | 'DAMAGED' | 'MAINTENANCE';
  conditionComment?: string;
  photo?: string;
  ownerId?: string;
  owner?: { id: string; name: string | null; email: string } | null;
  createdAt: string;
}

export interface Tent {
  id: string;
  name: string;
  name_kk?: string;
  name_ru?: string;
  name_en?: string;
  brand?: TentBrand | null;
  type?: TentTypeDict | null;
  season?: TentSeason | null;
  capacity: number;
  weight: number;
  dailyPrice: number;
  description: string;
  description_kk?: string;
  description_ru?: string;
  description_en?: string;
  shortDescription?: string;
  shortDescription_kk?: string;
  shortDescription_ru?: string;
  shortDescription_en?: string;
  mainImage: string;
  images: string[];
  isActive: boolean;
  units: TentUnit[];
  totalQuantity?: number;
  availableQuantity?: number;
  isAvailable?: boolean;
}
