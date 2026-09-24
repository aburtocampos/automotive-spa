import type {
  Vehicle,
  VehicleCardData
} from '../types/vehicle';

import { getMedia } from './mediaApi';

const API_URL = import.meta.env.VITE_WORDPRESS_API_URL;

export async function getVehicles(): Promise<Vehicle[]> {
  const response = await fetch(
    `${API_URL}/vehicles?per_page=100`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch vehicles: ${response.status}`
    );
  }

  return response.json() as Promise<Vehicle[]>;
}

export async function getVehicleCards(): Promise<VehicleCardData[]> {
  const vehicles = await getVehicles();

  return Promise.all(
    vehicles.map(async (vehicle) => {
      const [image, video] = await Promise.all([
        getMedia(vehicle.featured_media),
        getMedia(vehicle.meta._vehicle_hover_video)
      ]);

      return {
        id: vehicle.id,
        slug: vehicle.slug,
        name: vehicle.title.rendered,
        year: vehicle.meta._vehicle_year,
        price: vehicle.meta._vehicle_price,
       imageUrl:
        image?.media_details?.sizes?.large?.source_url ??
        image?.media_details?.sizes?.medium_large?.source_url ??
        image?.source_url ??
        '',

        videoUrl: video?.source_url ?? null
      };
    })
  );
}