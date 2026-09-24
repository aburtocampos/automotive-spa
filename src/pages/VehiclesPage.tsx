import { useEffect, useState } from 'react';
import VehicleCard from '../components/VehicleCard';
import { getVehicleCards } from '../services/vehicleApi';
import type { VehicleCardData } from '../types/vehicle';
import '../assets/css/vehicles-page.css';

function VehiclesPage() {
  const [vehicles, setVehicles] = useState<VehicleCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadVehicles() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getVehicleCards();

        setVehicles(data);
      } catch (error) {
        console.error('Error loading vehicles:', error);
        setError('Unable to load vehicles. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    loadVehicles();
  }, []);

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

      <p>
        {vehicles.length} {vehicles.length === 1 ? 'vehicle' : 'vehicles'} found
      </p>

      <div className="vehicle-grid">
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
          />
        ))}
      </div>
    </main>
  );
}

export default VehiclesPage;