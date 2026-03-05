
export interface DownloadFile {
  label: string;
  url: string;
}

export interface FloorPlan {
  url: string;
  label: string;
}

export interface House {
  id: string;
  slug: string;
  name: string;
  description: string;
  style: string;
  beds: number;
  baths: number;
  garageCars: number;
  areaValue: number;
  areaUnit: string;
  price: number;
  imageUrl: string; // Main featured image
  galleryUrls: string[];
  floorplanUrls: (string | FloorPlan)[];
  downloadFiles: DownloadFile[];
  published: boolean;
  createdAt: number;
  updatedAt: number;
  floors?: number;
  propertyType?: string;
  dimensions?: {
    width: string;
    depth: string;
    maxRidgeHeight: string;
  };
  ceilingHeights?: {
    firstFloor: string;
    rooms?: { room: string; type: string; height: string }[];
  };
  roofDetails?: {
    primaryPitch: string;
    secondaryPitch: string;
    framingType: string;
  };
  exteriorWalls?: string;
  specialFeatures?: string[];
  planCollections?: string[];
  sqftBreakdown?: { label: string; value: string }[];
  foundationType?: { standard: string; optional: string };
}

export interface GlobalFilters {
  allowedStyles: string[];
  allowedPropertyTypes: string[];
  allowedBeds: number[];
  allowedBaths: number[];
  allowedFloors: number[];
}

/**
 * Interface representing a house plan as used in the UI and mock data.
 * Some fields are optional to allow compatibility with the base House model used in the application state.
 */
export interface HousePlan {
  id: string;
  planNumber?: string;
  name: string;
  style: string;
  sqft: number;
  beds: number;
  baths: number;
  floors?: number;
  garages: number;
  price: number;
  imageUrl: string;
  description: string;
  dimensions?: string;
  features?: string[];
  propertyType?: string;
}

export interface SearchFilters {
  query: string;
  minSqft: number;
  maxSqft: number;
  beds: number;
  baths: number;
  style: string;
  propertyType?: string;
}

export type SortOption = 'price-low' | 'price-high' | 'sqft-high' | 'newest';

export type AppView = 
  | { type: 'public-list' }
  | { type: 'public-detail', slug: string }
  | { type: 'admin-list' }
  | { type: 'admin-edit', id: string }
  | { type: 'wishlist' }
  | { type: 'cart' };
