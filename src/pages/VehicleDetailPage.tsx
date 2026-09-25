import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';

import VehicleInquiryModal from '../components/VehicleInquiryModal';
import type { InquiryType } from '../components/VehicleInquiryForm';

import { getVehicleBySlug } from '../services/vehicleApi';
import {
  getVehicleBrands,
  getVehicleTypes,
  getVehicleTransmissions,
  getVehicleFuelTypes
} from '../services/taxonomyApi';
import { getMedia } from '../services/mediaApi';

import '../assets/css/vehicle-detail.css';

function VehicleDetailPage() {
  const { slug } = useParams();

  const [inquiryType, setInquiryType] =
    useState<InquiryType>('quote');

  const [isInquiryOpen, setIsInquiryOpen] =
    useState(false);

  function openInquiry(type: InquiryType) {
    setInquiryType(type);
    setIsInquiryOpen(true);
  }

  const vehicleQuery = useQuery({
    queryKey: ['vehicle', slug],
    queryFn: () => getVehicleBySlug(slug!),
    enabled: Boolean(slug),
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

  const vehicle = vehicleQuery.data;

  const brands = brandsQuery.data ?? [];
  const vehicleTypes = vehicleTypesQuery.data ?? [];
  const transmissions = transmissionsQuery.data ?? [];
  const fuelTypes = fuelTypesQuery.data ?? [];

  const heroVideoId =
    vehicle?.meta._vehicle_hover_video ?? 0;

  const featuredImageId =
    vehicle?.featured_media ?? 0;

  const galleryIds =
    vehicle?.meta._vehicle_gallery ?? [];

  const heroVideoQuery = useQuery({
    queryKey: ['media', heroVideoId],
    queryFn: () => getMedia(heroVideoId),
    enabled: heroVideoId > 0,
  });

  const heroImageQuery = useQuery({
    queryKey: ['media', featuredImageId],
    queryFn: () => getMedia(featuredImageId),
    enabled: featuredImageId > 0,
  });

  const galleryQuery = useQuery({
    queryKey: ['vehicle-gallery', vehicle?.id, galleryIds],
    queryFn: async () => {
      const galleryMedia = await Promise.all(
        galleryIds.map((mediaId) => getMedia(mediaId))
      );

      return galleryMedia
        .map((media) => media?.source_url)
        .filter((url): url is string => Boolean(url));
    },
    enabled: galleryIds.length > 0,
  });

  const isLoading =
    vehicleQuery.isLoading ||
    brandsQuery.isLoading ||
    vehicleTypesQuery.isLoading ||
    transmissionsQuery.isLoading ||
    fuelTypesQuery.isLoading;

  const hasError =
    vehicleQuery.isError ||
    brandsQuery.isError ||
    vehicleTypesQuery.isError ||
    transmissionsQuery.isError ||
    fuelTypesQuery.isError;

  if (isLoading) {
    return <p>Cargando vehículo...</p>;
  }

  if (hasError) {
    return <p>No fue posible cargar el vehículo.</p>;
  }

  if (!vehicle) {
    return <p>Vehículo no encontrado.</p>;
  }

  const brand = brands.find((term) =>
    vehicle['vehicle-brands'].includes(term.id)
  );

  const vehicleType = vehicleTypes.find((term) =>
    vehicle['vehicle-types'].includes(term.id)
  );

  const transmission = transmissions.find((term) =>
    vehicle['vehicle-transmissions'].includes(term.id)
  );

  const fuelType = fuelTypes.find((term) =>
    vehicle['vehicle-fuel-types'].includes(term.id)
  );

  const heroVideoUrl =
    heroVideoQuery.data?.source_url ?? '';

  const heroImageUrl =
    heroImageQuery.data?.media_details?.sizes?.large?.source_url ??
    heroImageQuery.data?.source_url ??
    '';

  const galleryUrls =
    galleryQuery.data ?? [];

  return (
    <main className="vehicle-detail">
      <section className="vehicle-detail__hero">
        <Link
          to="/vehicles"
          className="vehicle-detail__back"
        >
          ← Volver
        </Link>

        {heroImageUrl && (
          <img
            className="vehicle-detail__hero-image"
            src={heroImageUrl}
            alt={vehicle.title.rendered}
          />
        )}

        {heroVideoUrl && (
          <video
            className="vehicle-detail__hero-video"
            src={heroVideoUrl}
            autoPlay
            muted
            loop
            playsInline
          />
        )}

        <div className="vehicle-detail__hero-overlay" />

        <div className="vehicle-detail__hero-content">
          <div className="vehicle-detail-caption">
             <p className="vehicle-detail__hero-year">
            {vehicle.meta._vehicle_year}
          </p>

          <h1 className="vehicle-detail__hero-title">
            {vehicle.title.rendered}
          </h1>

          <p className="vehicle-detail__hero-price">
            $
            {vehicle.meta._vehicle_price.toLocaleString(
              'en-US'
            )}
          </p>
          </div>
         

       <div className="vehicle-detail__hero-actions">
            <button
              type="button"
              className="vehicle-detail__hero-cta vehicle-detail__hero-cta--primary"
              onClick={() => openInquiry('quote')}
            >
              Cotizar
              <span aria-hidden="true">→</span>
            </button>

          </div>

        </div>
      </section>

      <section className="vehicle-detail__details">
        <div className="vehicle-detail__details-inner">
          <div className="vehicle-detail__section-heading">
            <span>Información</span>
            <h2>Detalles del vehículo</h2>
          </div>

          <div className="vehicle-detail__details-grid">
            <div className="vehicle-detail__detail">
              <span>Marca</span>
              <strong>
                {brand?.name ?? 'No especificada'}
              </strong>
            </div>

            <div className="vehicle-detail__detail">
              <span>Tipo</span>
              <strong>
                {vehicleType?.name ?? 'No especificado'}
              </strong>
            </div>

            <div className="vehicle-detail__detail">
              <span>Transmisión</span>
              <strong>
                {transmission?.name ?? 'No especificada'}
              </strong>
            </div>

            <div className="vehicle-detail__detail">
              <span>Combustible</span>
              <strong>
                {fuelType?.name ?? 'No especificado'}
              </strong>
            </div>
          </div>
        </div>
      </section>

      {vehicle.content?.rendered?.trim() && (
        <section className="vehicle-detail__description">
          <div className="vehicle-detail__description-inner">
            <div className="vehicle-detail__section-heading">
              <span>Conoce más</span>
              <h2>
                {vehicle.title.rendered}
              </h2>
            </div>

            <div
              className="vehicle-detail__description-content"
              dangerouslySetInnerHTML={{
                __html: vehicle.content.rendered
              }}
            />
          </div>
        </section>
      )}

      {galleryQuery.isLoading && (
        <section className="vehicle-detail__gallery">
          <div className="vehicle-detail__gallery-inner">
            <p>Cargando galería...</p>
          </div>
        </section>
      )}

      {galleryUrls.length > 0 && (
        <section className="vehicle-detail__gallery">
          <div className="vehicle-detail__gallery-inner">
            <div className="vehicle-detail__gallery-heading">
              <div className="vehicle-detail__section-heading">
                <span>Explora</span>
                <h2>Galería</h2>
              </div>

              <p>
                {galleryUrls.length}{' '}
                {galleryUrls.length === 1
                  ? 'fotografía'
                  : 'fotografías'}
              </p>
            </div>

            <div className="vehicle-detail__gallery-grid">
              {galleryUrls.map((imageUrl, index) => (
                <img
                  key={`${imageUrl}-${index}`}
                  src={imageUrl}
                  alt={`${vehicle.title.rendered} - imagen ${
                    index + 1
                  }`}
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <VehicleInquiryModal
        isOpen={isInquiryOpen}
        vehicleName={vehicle.title.rendered}
        vehicleYear={vehicle.meta._vehicle_year}
        requestType={inquiryType}
        onClose={() => setIsInquiryOpen(false)}
      />
    </main>
  );
}

export default VehicleDetailPage;