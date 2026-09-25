export interface VehicleMeta {
  _vehicle_price: number;
  _vehicle_year: number;
  _vehicle_hover_video: number;
  _vehicle_gallery: number[];
}

export interface RenderedContent {
  rendered: string;
}

export interface Vehicle {
  id: number;
  slug: string;
  status: string;
  link: string;

  title: RenderedContent;
  excerpt: RenderedContent;
  content?: RenderedContent;
  featured_media: number;

  meta: VehicleMeta;

  'vehicle-brands': number[];
  'vehicle-types': number[];
  'vehicle-transmissions': number[];
  'vehicle-fuel-types': number[];
}

export interface WordPressMedia {
  id: number;
  source_url: string;
  media_type: 'image' | 'video' | 'file';
  alt_text?: string;

  media_details?: {
    width?: number;
    height?: number;

    sizes?: {
      medium?: {
        source_url: string;
        width: number;
        height: number;
      };

      medium_large?: {
        source_url: string;
        width: number;
        height: number;
      };

      large?: {
        source_url: string;
        width: number;
        height: number;
      };
    };
  };
}

export interface VehicleCardData {
  id: number;
  slug: string;
  name: string;
  year: number;
  price: number;
  imageUrl: string;
  videoUrl: string | null;
  brandIds: number[];
typeIds: number[];
transmissionIds: number[];
fuelTypeIds: number[];
}

export interface VehicleTaxonomyTerm {
  id: number;
  name: string;
  slug: string;
}