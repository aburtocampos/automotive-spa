import { useState } from 'react';
import type { FormEvent } from 'react';

export type InquiryType = 'quote' | 'test-drive';

interface VehicleInquiryFormProps {
  vehicleName: string;
  vehicleYear?: number;
  initialRequestType?: InquiryType;
  onSuccess?: () => void;
}

interface FormData {
  requestType: InquiryType;
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
}

interface InquiryResponse {
  success: boolean;
  message: string;
}

const INQUIRY_API_URL =
  'https://pellas.aburto.dev/wp-json/automotive/v1/inquiries';

function VehicleInquiryForm({
  vehicleName,
  vehicleYear,
  initialRequestType = 'quote',
  onSuccess,
}: VehicleInquiryFormProps) {
  const [formData, setFormData] = useState<FormData>({
    requestType: initialRequestType,
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  function validateForm(): boolean {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Ingresa tu nombre.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Ingresa tu correo electrónico.';
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = 'Ingresa un correo electrónico válido.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(INQUIRY_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestType: formData.requestType,
          vehicleName,
          vehicleYear,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
        }),
      });

      const data = (await response.json()) as InquiryResponse;

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'No fue posible enviar la solicitud.'
        );
      }

      console.log('Vehicle inquiry submitted successfully.');

      onSuccess?.();
    } catch (error) {
      console.error('Unable to submit vehicle inquiry:', error);

      setSubmitError(
        'No fue posible enviar la solicitud. Intenta nuevamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="vehicle-inquiry-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="vehicle-inquiry-form__field">
        <label htmlFor="requestType">
          Tipo de solicitud
        </label>

        <select
          id="requestType"
          value={formData.requestType}
          disabled={isSubmitting}
          onChange={(event) =>
            setFormData({
              ...formData,
              requestType: event.target.value as InquiryType,
            })
          }
        >
          <option value="quote">
            Solicitar cotización
          </option>

          <option value="test-drive">
            Agendar prueba de manejo
          </option>
        </select>
      </div>

      <div className="vehicle-inquiry-form__field">
        <label htmlFor="name">
          Nombre
        </label>

        <input
          id="name"
          type="text"
          autoComplete="name"
          value={formData.name}
          disabled={isSubmitting}
          onChange={(event) =>
            setFormData({
              ...formData,
              name: event.target.value,
            })
          }
          aria-invalid={Boolean(errors.name)}
          aria-describedby={
            errors.name ? 'name-error' : undefined
          }
        />

        {errors.name && (
          <span
            id="name-error"
            className="vehicle-inquiry-form__error"
          >
            {errors.name}
          </span>
        )}
      </div>

      <div className="vehicle-inquiry-form__field">
        <label htmlFor="email">
          Correo electrónico
        </label>

        <input
          id="email"
          type="email"
          autoComplete="email"
          value={formData.email}
          disabled={isSubmitting}
          onChange={(event) =>
            setFormData({
              ...formData,
              email: event.target.value,
            })
          }
          aria-invalid={Boolean(errors.email)}
          aria-describedby={
            errors.email ? 'email-error' : undefined
          }
        />

        {errors.email && (
          <span
            id="email-error"
            className="vehicle-inquiry-form__error"
          >
            {errors.email}
          </span>
        )}
      </div>

      <div className="vehicle-inquiry-form__field">
        <label htmlFor="phone">
          Teléfono
        </label>

        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          value={formData.phone}
          disabled={isSubmitting}
          onChange={(event) =>
            setFormData({
              ...formData,
              phone: event.target.value,
            })
          }
        />
      </div>

      <div className="vehicle-inquiry-form__field vehicle-inquiry-form__field--full">
        <label htmlFor="message">
          Mensaje
        </label>

        <textarea
          id="message"
          rows={4}
          value={formData.message}
          disabled={isSubmitting}
          onChange={(event) =>
            setFormData({
              ...formData,
              message: event.target.value,
            })
          }
          placeholder={`Estoy interesado en ${vehicleName}.`}
        />
      </div>

      {submitError && (
        <div
          className="vehicle-inquiry-form__submit-error"
          role="alert"
        >
          {submitError}
        </div>
      )}

      <button
        className="vehicle-inquiry-form__submit"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? 'Enviando...'
          : 'Enviar solicitud'}
      </button>
    </form>
  );
}

export default VehicleInquiryForm;