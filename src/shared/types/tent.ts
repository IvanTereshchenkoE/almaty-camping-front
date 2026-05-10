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
  brand?: TentBrand | null;
  type?: TentTypeDict | null;
  season?: TentSeason | null;
  capacity: number;
  weight: number;
  dailyPrice: number;
  description: string;
  shortDescription?: string;
  mainImage: string;
  images: string[];
  isActive: boolean;
  units: TentUnit[];
  totalQuantity?: number;
  availableQuantity?: number;
  isAvailable?: boolean;
}
