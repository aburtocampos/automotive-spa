import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import VehicleCard from '../components/VehicleCard';

import { getVehicleCards } from '../services/vehicleApi';

import {
  getVehicleBrands,
  getVehicleTypes,
  getVehicleTransmissions,
  getVehicleFuelTypes,
} from '../services/taxonomyApi';

import '../assets/css/vehicles-page.css';

const ITEMS_PER_PAGE_OPTIONS = [6, 9, 12];

function VehiclesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');

  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedVehicleType, setSelectedVehicleType] =
    useState('all');
  const [selectedTransmission, setSelectedTransmission] =
    useState('all');
  const [selectedFuelType, setSelectedFuelType] =
    useState('all');

  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [visibleItems, setVisibleItems] = useState(6);

  const vehiclesQuery = useQuery({
    queryKey: ['vehicles'],
    queryFn: getVehicleCards,
  });

  const brandsQuery = useQuery({
    queryKey: ['vehicle-brands'],
    queryFn: getVehicleBrands,
  });

  const vehicleTypesQuery = useQuery({
    queryKey: ['vehicle-types'],
    queryFn: getVehicleTypes,
  });

  const transmissionsQuery = useQuery({
    queryKey: ['vehicle-transmissions'],
    queryFn: getVehicleTransmissions,
  });

  const fuelTypesQuery = useQuery({
    queryKey: ['vehicle-fuel-types'],
    queryFn: getVehicleFuelTypes,
  });

  const vehicles = vehiclesQuery.data ?? [];
  const brands = brandsQuery.data ?? [];
  const vehicleTypes = vehicleTypesQuery.data ?? [];
  const transmissions = transmissionsQuery.data ?? [];
  const fuelTypes = fuelTypesQuery.data ?? [];

  function resetVisibleItems() {
    setVisibleItems(itemsPerPage);
  }

  function handleSearchChange(value: string) {
    setSearchTerm(value);
    resetVisibleItems();
  }

  function handleBrandChange(value: string) {
    setSelectedBrand(value);
    resetVisibleItems();
  }

  function handleVehicleTypeChange(value: string) {
    setSelectedVehicleType(value);
    resetVisibleItems();
  }

  function handleTransmissionChange(value: string) {
    setSelectedTransmission(value);
    resetVisibleItems();
  }

  function handleFuelTypeChange(value: string) {
    setSelectedFuelType(value);
    resetVisibleItems();
  }

  function handleSortChange(value: string) {
    setSortBy(value);
    resetVisibleItems();
  }

  function handleItemsPerPageChange(value: string) {
    const amount = Number(value);

    setItemsPerPage(amount);
    setVisibleItems(amount);
  }

  function handleLoadMore() {
    setVisibleItems((current) => current + itemsPerPage);
  }

  function handleClearFilters() {
    setSearchTerm('');
    setSortBy('default');
    setSelectedBrand('all');
    setSelectedVehicleType('all');
    setSelectedTransmission('all');
    setSelectedFuelType('all');
    setVisibleItems(itemsPerPage);
  }

  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    selectedBrand !== 'all' ||
    selectedVehicleType !== 'all' ||
    selectedTransmission !== 'all' ||
    selectedFuelType !== 'all' ||
    sortBy !== 'default';

  const filteredVehicles = vehicles.filter((vehicle) => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    const matchesSearch = vehicle.name
      .toLowerCase()
      .includes(normalizedSearch);

    const matchesBrand =
      selectedBrand === 'all' ||
      vehicle.brandIds.includes(Number(selectedBrand));

    const matchesVehicleType =
      selectedVehicleType === 'all' ||
      vehicle.typeIds.includes(Number(selectedVehicleType));

    const matchesTransmission =
      selectedTransmission === 'all' ||
      vehicle.transmissionIds.includes(
        Number(selectedTransmission)
      );

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

  const sortedVehicles = [...filteredVehicles].sort(
    (a, b) => {
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
    }
  );

  const visibleVehicles = sortedVehicles.slice(
    0,
    visibleItems
  );

  const hasMoreVehicles =
    visibleVehicles.length < sortedVehicles.length;

  const isLoading =
    vehiclesQuery.isLoading ||
    brandsQuery.isLoading ||
    vehicleTypesQuery.isLoading ||
    transmissionsQuery.isLoading ||
    fuelTypesQuery.isLoading;

  const hasError =
    vehiclesQuery.isError ||
    brandsQuery.isError ||
    vehicleTypesQuery.isError ||
    transmissionsQuery.isError ||
    fuelTypesQuery.isError;

  if (isLoading) {
    return (
      <main className="vehicles-page">
        <div className="vehicles-page__status">
          <span className="vehicles-page__loader" />

          <p>Cargando vehículos...</p>
        </div>
      </main>
    );
  }

  if (hasError) {
    return (
      <main className="vehicles-page">
        <div className="vehicles-page__status">
          <h1>No fue posible cargar los vehículos.</h1>

          <p>
            Intenta actualizar la página en unos momentos.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="vehicles-page">
      <div className="vehicles-page__inner">
        <header className="vehicles-page__header">
          <div>
            <span className="vehicles-page__eyebrow">
              Nuestro catálogo
            </span>

            <h1 className="vehicles-page__title">
              Vehículos
            </h1>

            <p className="vehicles-page__intro">
              Explora nuestro catálogo y encuentra el vehículo
              adecuado para ti.
            </p>
          </div>
        </header>

        <section
          className="vehicles-page__filters"
          aria-label="Filtros de vehículos"
        >
          <div className="vehicles-page__search">
            <label htmlFor="vehicle-search">
              Buscar vehículo
            </label>

            <div className="vehicles-page__search-control">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>

              <input
                id="vehicle-search"
                type="search"
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(event) =>
                  handleSearchChange(event.target.value)
                }
              />
            </div>
          </div>

          <div className="vehicles-page__filter-grid">
            <div className="vehicles-page__field">
              <label htmlFor="brand-filter">
                Marca
              </label>

              <select
                id="brand-filter"
                value={selectedBrand}
                onChange={(event) =>
                  handleBrandChange(event.target.value)
                }
              >
                <option value="all">
                  Todas las marcas
                </option>

                {brands.map((brand) => (
                  <option
                    key={brand.id}
                    value={brand.id}
                  >
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="vehicles-page__field">
              <label htmlFor="type-filter">
                Tipo
              </label>

              <select
                id="type-filter"
                value={selectedVehicleType}
                onChange={(event) =>
                  handleVehicleTypeChange(
                    event.target.value
                  )
                }
              >
                <option value="all">
                  Todos los tipos
                </option>

                {vehicleTypes.map((type) => (
                  <option
                    key={type.id}
                    value={type.id}
                  >
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="vehicles-page__field">
              <label htmlFor="transmission-filter">
                Transmisión
              </label>

              <select
                id="transmission-filter"
                value={selectedTransmission}
                onChange={(event) =>
                  handleTransmissionChange(
                    event.target.value
                  )
                }
              >
                <option value="all">
                  Todas
                </option>

                {transmissions.map((transmission) => (
                  <option
                    key={transmission.id}
                    value={transmission.id}
                  >
                    {transmission.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="vehicles-page__field">
              <label htmlFor="fuel-filter">
                Combustible
              </label>

              <select
                id="fuel-filter"
                value={selectedFuelType}
                onChange={(event) =>
                  handleFuelTypeChange(event.target.value)
                }
              >
                <option value="all">
                  Todos
                </option>

                {fuelTypes.map((fuelType) => (
                  <option
                    key={fuelType.id}
                    value={fuelType.id}
                  >
                    {fuelType.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="vehicles-page__field">
              <label htmlFor="sort-filter">
                Ordenar
              </label>

              <select
                id="sort-filter"
                value={sortBy}
                onChange={(event) =>
                  handleSortChange(event.target.value)
                }
              >
                <option value="default">
                  Relevancia
                </option>

                <option value="price-low">
                  Menor precio
                </option>

                <option value="price-high">
                  Mayor precio
                </option>

                <option value="year-newest">
                  Más recientes
                </option>
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="vehicles-page__filter-footer">
              <button
                type="button"
                className="vehicles-page__clear"
                onClick={handleClearFilters}
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </section>

        <div className="vehicles-page__results-bar">
          <p className="vehicles-page__count">
            <strong>{sortedVehicles.length}</strong>{' '}
            {sortedVehicles.length === 1
              ? 'vehículo encontrado'
              : 'vehículos encontrados'}
          </p>

          <div className="vehicles-page__amount">
            <label htmlFor="items-per-page">
              Mostrar
            </label>

            <select
              id="items-per-page"
              value={itemsPerPage}
              onChange={(event) =>
                handleItemsPerPageChange(
                  event.target.value
                )
              }
            >
              {ITEMS_PER_PAGE_OPTIONS.map((amount) => (
                <option
                  key={amount}
                  value={amount}
                >
                  {amount}
                </option>
              ))}
            </select>
          </div>
        </div>

        {sortedVehicles.length === 0 ? (
          <section className="vehicles-page__empty">
            <span className="vehicles-page__empty-label">
              Sin resultados
            </span>

            <h2>No encontramos vehículos</h2>

            <p>
              Cambia la búsqueda o elimina algunos filtros
              para ampliar los resultados.
            </p>

            <button
              type="button"
              onClick={handleClearFilters}
            >
              Limpiar filtros
            </button>
          </section>
        ) : (
          <>
            <div className="vehicle-grid">
              {visibleVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                />
              ))}
            </div>

            <div className="vehicles-page__pagination">
              <p>
                Mostrando{' '}
                <strong>{visibleVehicles.length}</strong>{' '}
                de{' '}
                <strong>{sortedVehicles.length}</strong>
              </p>

              {hasMoreVehicles && (
                <button
                  type="button"
                  className="vehicles-page__load-more"
                  onClick={handleLoadMore}
                >
                  Cargar más

                  <span aria-hidden="true">
                    ↓
                  </span>
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default VehiclesPage;