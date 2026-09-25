import { useEffect, useState } from 'react';
import VehicleInquiryForm from './VehicleInquiryForm';
import type { InquiryType } from './VehicleInquiryForm';

interface VehicleInquiryModalProps {
  isOpen: boolean;
  vehicleName: string;
  vehicleYear?: number;
  requestType: InquiryType;
  onClose: () => void;
}

function VehicleInquiryModal({
  isOpen,
  vehicleName,
  vehicleYear,
  requestType,
  onClose,
}: VehicleInquiryModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setIsSubmitted(false);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const modalTitle =
    requestType === 'test-drive'
      ? 'Agenda una prueba de manejo'
      : 'Solicita una cotización';

  return (
    <div
      className="vehicle-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vehicle-modal-title"
    >
      <button
        type="button"
        className="vehicle-modal__backdrop"
        onClick={onClose}
        aria-label="Cerrar formulario"
      />

      <div className="vehicle-modal__dialog">
        <button
          type="button"
          className="vehicle-modal__close"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>

        {!isSubmitted ? (
          <>
            <div className="vehicle-modal__header">
              <span className="vehicle-modal__eyebrow">
                {vehicleYear && `${vehicleYear} · `}
                {vehicleName}
              </span>

              <h2 id="vehicle-modal-title">
                {modalTitle}
              </h2>

              <p>
                Completa tus datos y nos pondremos en contacto
                contigo.
              </p>
            </div>

            <VehicleInquiryForm
              key={`${vehicleName}-${requestType}`}
              vehicleName={vehicleName}
              vehicleYear={vehicleYear}
              initialRequestType={requestType}
              onSuccess={() => setIsSubmitted(true)}
            />
          </>
        ) : (
          <div className="vehicle-modal__success">
            <span
              className="vehicle-modal__success-icon"
              aria-hidden="true"
            >
              ✓
            </span>

            <h2 id="vehicle-modal-title">
              Solicitud enviada
            </h2>

            <p>
              Recibimos tu solicitud para{' '}
              <strong>
                {vehicleName}
                {vehicleYear ? ` ${vehicleYear}` : ''}
              </strong>
              .
            </p>

            <p>
              Nos pondremos en contacto contigo para continuar
              con el proceso.
            </p>

            <button
              type="button"
              className="vehicle-modal__success-button"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VehicleInquiryModal;