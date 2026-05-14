export interface Location {
  id: string;
  name: string;
  name_kk?: string;
  name_ru?: string;
  name_en?: string;
  region: string;
  region_kk?: string;
  region_ru?: string;
  region_en?: string;
  distanceFromAlmatyKm: number;
  description: string;
  description_kk?: string;
  description_ru?: string;
  description_en?: string;
  imageUrl: string;
  features: string[];
  features_kk?: string[];
  features_ru?: string[];
  features_en?: string[];
}
