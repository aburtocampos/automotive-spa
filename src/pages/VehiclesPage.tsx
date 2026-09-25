import { useEffect, useState } from 'react';
import VehicleCard from '../components/VehicleCard';
import { getVehicleCards } from '../services/vehicleApi';
import {
  getVehicleBrands,
  getVehicleTypes,
  getVehicleTransmissions,
  getVehicleFuelTypes
} from '../services/taxonomyApi';
import type { VehicleCardData, VehicleTaxonomyTerm } from '../types/vehicle';
import '../assets/css/vehicles-page.css';

function VehiclesPage() {
  const [vehicles, setVehicles] = useState<VehicleCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
const [brands, setBrands] = useState<VehicleTaxonomyTerm[]>([]);
const [vehicleTypes, setVehicleTypes] = useState<VehicleTaxonomyTerm[]>([]);
const [transmissions, setTransmissions] = useState<VehicleTaxonomyTerm[]>([]);
const [fuelTypes, setFuelTypes] = useState<VehicleTaxonomyTerm[]>([]);
const [selectedBrand, setSelectedBrand] = useState('all');
const [selectedVehicleType, setSelectedVehicleType] = useState('all');
const [selectedTransmission, setSelectedTransmission] = useState('all');
const [selectedFuelType, setSelectedFuelType] = useState('all');

  useEffect(() => {
    async function loadVehicles() {
      try {
        setIsLoading(true);
        setError(null);

const vehicleData = await getVehicleCards();
const brandData = await getVehicleBrands();
const vehicleTypeData = await getVehicleTypes();
const transmissionData = await getVehicleTransmissions();
const fuelTypeData = await getVehicleFuelTypes();

setVehicles(vehicleData);
setBrands(brandData);
setVehicleTypes(vehicleTypeData);
setTransmissions(transmissionData);
setFuelTypes(fuelTypeData);

      } catch (error) {
        console.error('Error loading vehicles:', error);
        setError('Unable to load vehicles. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    loadVehicles();
  }, []);

const filteredVehicles = vehicles.filter((vehicle) => {
  const matchesSearch = vehicle.name
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  const matchesBrand =
    selectedBrand === 'all' ||
    vehicle.brandIds.includes(Number(selectedBrand));

  const matchesVehicleType =
    selectedVehicleType === 'all' ||
    vehicle.typeIds.includes(Number(selectedVehicleType));

  const matchesTransmission =
  selectedTransmission === 'all' ||
  vehicle.transmissionIds.includes(Number(selectedTransmission));

  const matchesFuelType =
  selectedFuelType === 'all' ||
  vehicle.fuelTypeIds.includes(Number(selectedFuelType));

return (
  matchesSearch &&
  matchesBrand &&
  matchesVehicleType &&
  matchesTransmission &&
  matchesFuelType
);
});

const sortedVehicles = [...filteredVehicles].sort((a, b) => {
  if (sortBy === 'price-low') {
    return a.price - b.price;
  }

  if (sortBy === 'price-high') {
    return b.price - a.price;
  }

  if (sortBy === 'year-newest') {
    return b.year - a.year;
  }

  return 0;
});

  if (isLoading) {
    return <p>Loading vehicles...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (vehicles.length === 0) {
    return <p>No vehicles found.</p>;
  }

  return (
    <main>
      <h1>Vehicles</h1>
<input
  type="search"
  placeholder="Search vehicles..."
  value={searchTerm}
  onChange={(event) => setSearchTerm(event.target.value)}
  aria-label="Search vehicles"
/>

<select
  value={selectedBrand}
  onChange={(event) => setSelectedBrand(event.target.value)}
  aria-label="Filter by brand"
>
  <option value="all">All Brands</option>

  {brands.map((brand) => (
    <option key={brand.id} value={brand.id}>
      {brand.name}
    </option>
  ))}
</select>

<select
  value={selectedVehicleType}
  onChange={(event) => setSelectedVehicleType(event.target.value)}
  aria-label="Filter by vehicle type"
>
  <option value="all">All Vehicle Types</option>

  {vehicleTypes.map((type) => (
    <option key={type.id} value={type.id}>
      {type.name}
    </option>
  ))}
</select>

<select
  value={selectedTransmission}
  onChange={(event) => setSelectedTransmission(event.target.value)}
  aria-label="Filter by transmission"
>
  <option value="all">All Transmissions</option>

  {transmissions.map((transmission) => (
    <option key={transmission.id} value={transmission.id}>
      {transmission.name}
    </option>
  ))}
</select>

<select
  value={selectedFuelType}
  onChange={(event) => setSelectedFuelType(event.target.value)}
  aria-label="Filter by fuel type"
>
  <option value="all">All Fuel Types</option>

  {fuelTypes.map((fuelType) => (
    <option key={fuelType.id} value={fuelType.id}>
      {fuelType.name}
    </option>
  ))}
</select>

<select
  value={sortBy}
  onChange={(event) => setSortBy(event.target.value)}
  aria-label="Sort vehicles"
>
  <option value="default">Sort by</option>
  <option value="price-low">Price: Low to High</option>
  <option value="price-high">Price: High to Low</option>
  <option value="year-newest">Year: Newest First</option>
</select>
      <p>
      {filteredVehicles.length}{' '}
{filteredVehicles.length === 1 ? 'vehicle' : 'vehicles'} found
      </p>

     {sortedVehicles.length === 0 ? (
  <p>No vehicles match your filters.</p>
) : (
  <div className="vehicle-grid">
    {sortedVehicles.map((vehicle) => (
      <VehicleCard key={vehicle.id} vehicle={vehicle} />
    ))}
  </div>
)}



    </main>
  );
}

export default VehiclesPage;