import type { VehicleTaxonomyTerm } from '../types/vehicle';

const API_URL = import.meta.env.VITE_WORDPRESS_API_URL;

async function getTaxonomyTerms(
  taxonomy: string
): Promise<VehicleTaxonomyTerm[]> {
  const response = await fetch(
    `${API_URL}/${taxonomy}?per_page=100`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${taxonomy}: ${response.status}`
    );
  }

  return response.json() as Promise<VehicleTaxonomyTerm[]>;
}

export async function getVehicleBrands(): Promise<VehicleTaxonomyTerm[]> {
  return getTaxonomyTerms('vehicle-brands');
}

export async function getVehicleTypes(): Promise<VehicleTaxonomyTerm[]> {
  return getTaxonomyTerms('vehicle-types');
}

export async function getVehicleTransmissions(): Promise<VehicleTaxonomyTerm[]> {
  return getTaxonomyTerms('vehicle-transmissions');
}

export async function getVehicleFuelTypes(): Promise<VehicleTaxonomyTerm[]> {
  return getTaxonomyTerms('vehicle-fuel-types');
}