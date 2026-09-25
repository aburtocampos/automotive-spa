import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { VehicleCardData } from '../types/vehicle';
import VehicleInquiryModal from './VehicleInquiryModal';
import '../assets/css/vehicle-card.css';

interface VehicleCardProps {
  vehicle: VehicleCardData;
}

function VehicleCard({ vehicle }: VehicleCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  async function handleMouseEnter() {
    const video = videoRef.current;

    if (!video || !vehicle.videoUrl) {
      return;
    }

    try {
      await video.play();
      setIsVideoActive(true);
    } catch (error) {
      console.error('Unable to play vehicle video:', error);
    }
  }

  function handleMouseLeave() {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    setIsVideoActive(false);
    video.pause();
    video.currentTime = 0;
  }

  return (
    <>
      <article
        className={`vehicle-card ${
          isVideoActive ? 'vehicle-card--video-active' : ''
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="vehicle-card__media">
          <img
            className="vehicle-card__image"
            src={vehicle.imageUrl}
            alt={vehicle.name}
            loading="lazy"
          />

          {vehicle.videoUrl && (
            <video
              ref={videoRef}
              className="vehicle-card__video"
              src={vehicle.videoUrl}
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
            />
          )}
        </div>

        <div className="vehicle-card__overlay" />

        <div className="vehicle-card__content">
          <span className="vehicle-card__year">
            {vehicle.year}
          </span>

          <h2 className="vehicle-card__title">
            {vehicle.name}
          </h2>

          <p className="vehicle-card__price">
            ${vehicle.price.toLocaleString('en-US')}
          </p>

          <div className="vehicle-card__actions">
            <Link
              className="vehicle-card__button"
              to={`/vehicles/${vehicle.slug}`}
            >
              Ver detalles

              <span
                className="vehicle-card__button-arrow"
                aria-hidden="true"
              >
                →
              </span>
            </Link>

            <button
              type="button"
              className="vehicle-card__quote"
              onClick={() => setIsQuoteModalOpen(true)}
            >
              Cotizar
            </button>
          </div>
        </div>
      </article>

      <VehicleInquiryModal
        isOpen={isQuoteModalOpen}
        vehicleName={vehicle.name}
        vehicleYear={vehicle.year}
        requestType="quote"
        onClose={() => setIsQuoteModalOpen(false)}
      />
    </>
  );
}

export default VehicleCard;