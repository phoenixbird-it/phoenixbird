import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Seo from '../../components/Seo/Seo';
import PageHero from '../../components/PageHero/PageHero';
import FormField from '../../components/Form/FormField';
import FormAlert from '../../components/Form/FormAlert';
import { useAsyncData } from '../../hooks/useAsyncData';
import { useCompanySettings } from '../../hooks/useCompanySettings';
import { getLocations, getServices, submitEnquiry } from '../../services/api';
import type { EnquiryPayload, IndustryChoice, Location, Service } from '../../types';
import { INDUSTRY_OPTIONS } from '../../data/content';
import { ApiError } from '../../services/apiClient';
import { flattenFieldErrors, isValidMobile, normaliseMobile } from '../../utils/validation';
import { mailHref, telHref } from '../../utils/company';
import { buildWhatsAppUrl } from '../../utils/whatsapp';
import formStyles from '../../components/Form/Form.module.scss';
import styles from './RequestManpower.module.scss';

const OTHER = 'other';

interface FormValues {
  name: string;
  company_name: string;
  mobile_number: string;
  whatsapp_number: string;
  industry: string;
  service: string;
  service_name_freeform: string;
  manpower_required: string;
  location: string;
  location_freeform: string;
  preferred_start_date: string;
  message: string;
}

const EMPTY_FORM: FormValues = {
  name: '',
  company_name: '',
  mobile_number: '',
  whatsapp_number: '',
  industry: '',
  service: '',
  service_name_freeform: '',
  manpower_required: '',
  location: '',
  location_freeform: '',
  preferred_start_date: '',
  message: '',
};

type Errors = Partial<Record<keyof FormValues, string>>;

const GENERIC_ERROR =
  'Something went wrong while submitting your enquiry. Please try again or contact us directly.';

export default function RequestManpower() {
  const [searchParams] = useSearchParams();
  const serviceSlugParam = searchParams.get('service');

  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const prefilledRef = useRef(false);

  const { settings } = useCompanySettings();
  const servicesState = useAsyncData<Service[]>(() => getServices(), []);
  const locationsState = useAsyncData<Location[]>(() => getLocations(), []);

  // Memoised so the prefill effect below does not re-run on every render.
  const services = useMemo(() => servicesState.data ?? [], [servicesState.data]);
  const locations = useMemo(() => locationsState.data ?? [], [locationsState.data]);

  /** Resolve the ?service=<slug> query param to a dropdown value once loaded. */
  useEffect(() => {
    if (prefilledRef.current || !serviceSlugParam || services.length === 0) return;
    const match = services.find((service) => service.slug === serviceSlugParam);
    prefilledRef.current = true;
    if (match) {
      setValues((current) => ({ ...current, service: String(match.id) }));
    } else {
      // Unknown slug — fall back to the free-text route rather than dropping it.
      setValues((current) => ({
        ...current,
        service: OTHER,
        service_name_freeform: serviceSlugParam.replace(/-/g, ' '),
      }));
    }
  }, [serviceSlugParam, services]);

  const selectedService = useMemo(
    () => services.find((service) => String(service.id) === values.service) ?? null,
    [services, values.service],
  );

  const setField = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  function validate(): Errors {
    const next: Errors = {};

    if (!values.name.trim()) next.name = 'Please enter your name.';
    if (!values.company_name.trim()) next.company_name = 'Please enter your company name.';

    if (!values.mobile_number.trim()) {
      next.mobile_number = 'Please enter your mobile number.';
    } else if (!isValidMobile(values.mobile_number)) {
      next.mobile_number = 'Enter a valid mobile number (7–15 digits, optionally starting with +).';
    }

    if (values.whatsapp_number.trim() && !isValidMobile(values.whatsapp_number)) {
      next.whatsapp_number = 'Enter a valid WhatsApp number (7–15 digits, optionally starting with +).';
    }

    if (!values.industry) next.industry = 'Please select your industry.';

    if (!values.service) {
      next.service = 'Please select the service you need.';
    } else if (values.service === OTHER && !values.service_name_freeform.trim()) {
      next.service_name_freeform = 'Please describe the service you need.';
    }

    if (!values.location) {
      next.location = 'Please select a location.';
    } else if (values.location === OTHER && !values.location_freeform.trim()) {
      next.location_freeform = 'Please enter your location.';
    }

    if (values.manpower_required.trim()) {
      const count = Number(values.manpower_required);
      if (!Number.isInteger(count) || count < 1) {
        next.manpower_required = 'Enter the number of people required as a whole number.';
      }
    }

    return next;
  }

  function buildPayload(): EnquiryPayload {
    const payload: EnquiryPayload = {
      name: values.name.trim(),
      mobile_number: normaliseMobile(values.mobile_number),
      industry: values.industry as IndustryChoice,
    };

    if (values.company_name.trim()) payload.company_name = values.company_name.trim();
    if (values.whatsapp_number.trim()) {
      payload.whatsapp_number = normaliseMobile(values.whatsapp_number);
    }

    if (values.service === OTHER) {
      payload.service_name_freeform = values.service_name_freeform.trim();
    } else if (values.service) {
      payload.service = Number(values.service);
    }

    if (values.location === OTHER) {
      payload.location_freeform = values.location_freeform.trim();
    } else if (values.location) {
      payload.location = Number(values.location);
    }

    if (values.manpower_required.trim()) {
      payload.manpower_required = Number(values.manpower_required);
    }
    if (values.preferred_start_date) payload.preferred_start_date = values.preferred_start_date;
    if (values.message.trim()) payload.message = values.message.trim();

    return payload;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstKey = Object.keys(validationErrors)[0];
      document.getElementById(`enquiry-${firstKey}`)?.focus();
      return;
    }

    setSubmitting(true);
    try {
      await submitEnquiry(buildPayload());
      setSubmitted(true);
      setErrors({});
    } catch (error) {
      if (error instanceof ApiError) {
        const flat = flattenFieldErrors(error.fieldErrors);
        const mapped: Errors = {};
        for (const [key, message] of Object.entries(flat)) {
          if (key in EMPTY_FORM) mapped[key as keyof FormValues] = message;
        }
        setErrors(mapped);
        // `non_field_errors` and unknown keys surface at form level.
        const leftovers = Object.entries(flat)
          .filter(([key]) => !(key in EMPTY_FORM))
          .map(([, message]) => message);
        setFormError(leftovers.length > 0 ? leftovers.join(' ') : GENERIC_ERROR);
      } else {
        setFormError(GENERIC_ERROR);
      }
    } finally {
      setSubmitting(false);
    }
  }

  const whatsappFollowUp = settings?.whatsapp_number
    ? buildWhatsAppUrl(
        settings.whatsapp_number,
        `Hello PHOENIX BIRDS, I have just submitted a manpower enquiry.\nName: ${
          values.name || '-'
        }\nCompany: ${values.company_name || '-'}\nService: ${
          values.service === OTHER
            ? values.service_name_freeform || '-'
            : selectedService?.title || '-'
        }`,
      )
    : null;

  const phone = telHref(settings?.phone_primary);
  const email = mailHref(settings?.email_enquiries || settings?.email_primary);

  return (
    <>
      <Seo
        title="Request Manpower"
        description="Send your manpower requirement to PHOENIX BIRDS in Madurai — tell us the roles, headcount, shifts and location, and our team will respond with a deployment plan for your hotel, hospital, factory or office."
      />
      <PageHero
        eyebrow="Enquiry"
        title="Request Manpower"
        description="Share your requirement and our team will get back to you with a workable deployment plan. Fields marked with * are required."
      />

      <div className={`container ${styles.layout}`}>
        <section className={styles.formPanel} aria-labelledby="enquiry-form-title">
          {submitted ? (
            <div className={styles.successWrap}>
              <FormAlert
                tone="success"
                title="Thank you for contacting PHOENIX BIRDS. Our team will get in touch with you shortly."
              >
                <p>
                  We have received your manpower requirement. A member of our team will review the
                  details and contact you on the number you provided.
                </p>
                <div className={styles.successActions}>
                  {whatsappFollowUp ? (
                    <a
                      className="btn btnWhatsapp"
                      href={whatsappFollowUp}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Continue on WhatsApp
                    </a>
                  ) : null}
                  <button
                    type="button"
                    className="btn btnOutline"
                    onClick={() => {
                      setValues(EMPTY_FORM);
                      setSubmitted(false);
                      prefilledRef.current = true;
                    }}
                  >
                    Submit another enquiry
                  </button>
                  <Link className={styles.quietLink} to="/services">
                    Browse our services
                  </Link>
                </div>
              </FormAlert>
            </div>
          ) : (
            <>
              <h2 id="enquiry-form-title" className={styles.formTitle}>
                Tell us what you need
              </h2>

              {formError ? (
                <FormAlert tone="error" title="Your enquiry was not submitted">
                  <p>{formError}</p>
                </FormAlert>
              ) : null}

              <form noValidate onSubmit={handleSubmit}>
                <fieldset className={formStyles.fieldset}>
                  <legend className={formStyles.legend}>Your details</legend>
                  <div className={formStyles.row}>
                    <FormField id="enquiry-name" label="Name" required error={errors.name}>
                      {(props) => (
                        <input
                          {...props}
                          type="text"
                          name="name"
                          autoComplete="name"
                          value={values.name}
                          onChange={(event) => setField('name', event.target.value)}
                        />
                      )}
                    </FormField>

                    <FormField
                      id="enquiry-company_name"
                      label="Company Name"
                      required
                      error={errors.company_name}
                    >
                      {(props) => (
                        <input
                          {...props}
                          type="text"
                          name="company_name"
                          autoComplete="organization"
                          value={values.company_name}
                          onChange={(event) => setField('company_name', event.target.value)}
                        />
                      )}
                    </FormField>

                    <FormField
                      id="enquiry-mobile_number"
                      label="Mobile Number"
                      required
                      error={errors.mobile_number}
                    >
                      {(props) => (
                        <input
                          {...props}
                          type="tel"
                          name="mobile_number"
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder="+91 XXXXX XXXXX"
                          value={values.mobile_number}
                          onChange={(event) => setField('mobile_number', event.target.value)}
                        />
                      )}
                    </FormField>

                    <FormField
                      id="enquiry-whatsapp_number"
                      label="WhatsApp Number"
                      hint="Leave blank if it is the same as your mobile number."
                      error={errors.whatsapp_number}
                    >
                      {(props) => (
                        <input
                          {...props}
                          type="tel"
                          name="whatsapp_number"
                          inputMode="tel"
                          value={values.whatsapp_number}
                          onChange={(event) => setField('whatsapp_number', event.target.value)}
                        />
                      )}
                    </FormField>

                    <FormField
                      id="enquiry-industry"
                      label="Industry"
                      required
                      error={errors.industry}
                    >
                      {(props) => (
                        <select
                          {...props}
                          name="industry"
                          value={values.industry}
                          onChange={(event) => setField('industry', event.target.value)}
                        >
                          <option value="">Select your industry</option>
                          {INDUSTRY_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </FormField>
                  </div>
                </fieldset>

                <fieldset className={formStyles.fieldset}>
                  <legend className={formStyles.legend}>Your requirement</legend>

                  <FormField
                    id="enquiry-service"
                    label="Required Service"
                    required
                    error={errors.service}
                    hint={
                      servicesState.status === 'error'
                        ? 'Our service list could not be loaded. Choose "Other" and describe what you need.'
                        : undefined
                    }
                  >
                    {(props) => (
                      <select
                        {...props}
                        name="service"
                        value={values.service}
                        onChange={(event) => setField('service', event.target.value)}
                      >
                        <option value="">
                          {servicesState.status === 'loading'
                            ? 'Loading services…'
                            : 'Select a service'}
                        </option>
                        {services.map((service) => (
                          <option key={service.id} value={String(service.id)}>
                            {service.title}
                          </option>
                        ))}
                        <option value={OTHER}>Other (describe below)</option>
                      </select>
                    )}
                  </FormField>

                  {values.service === OTHER ? (
                    <FormField
                      id="enquiry-service_name_freeform"
                      label="Describe the service you need"
                      required
                      error={errors.service_name_freeform}
                    >
                      {(props) => (
                        <input
                          {...props}
                          type="text"
                          name="service_name_freeform"
                          placeholder="For example: night-shift security staff"
                          value={values.service_name_freeform}
                          onChange={(event) =>
                            setField('service_name_freeform', event.target.value)
                          }
                        />
                      )}
                    </FormField>
                  ) : null}

                  <div className={formStyles.row}>
                    <FormField
                      id="enquiry-manpower_required"
                      label="Number of Manpower Required"
                      error={errors.manpower_required}
                    >
                      {(props) => (
                        <input
                          {...props}
                          type="number"
                          name="manpower_required"
                          min={1}
                          step={1}
                          inputMode="numeric"
                          placeholder="For example: 12"
                          value={values.manpower_required}
                          onChange={(event) => setField('manpower_required', event.target.value)}
                        />
                      )}
                    </FormField>

                    <FormField
                      id="enquiry-preferred_start_date"
                      label="Preferred Start Date"
                      error={errors.preferred_start_date}
                    >
                      {(props) => (
                        <input
                          {...props}
                          type="date"
                          name="preferred_start_date"
                          value={values.preferred_start_date}
                          onChange={(event) => setField('preferred_start_date', event.target.value)}
                        />
                      )}
                    </FormField>
                  </div>

                  <FormField
                    id="enquiry-location"
                    label="Location"
                    required
                    error={errors.location}
                    hint={
                      locationsState.status === 'error'
                        ? 'Our location list could not be loaded. Choose "Other" and type your location.'
                        : undefined
                    }
                  >
                    {(props) => (
                      <select
                        {...props}
                        name="location"
                        value={values.location}
                        onChange={(event) => setField('location', event.target.value)}
                      >
                        <option value="">
                          {locationsState.status === 'loading'
                            ? 'Loading locations…'
                            : 'Select a location'}
                        </option>
                        {locations.map((location) => (
                          <option key={location.id} value={String(location.id)}>
                            {location.name}
                            {location.state ? `, ${location.state}` : ''}
                          </option>
                        ))}
                        <option value={OTHER}>Other (enter below)</option>
                      </select>
                    )}
                  </FormField>

                  {values.location === OTHER ? (
                    <FormField
                      id="enquiry-location_freeform"
                      label="Enter your location"
                      required
                      error={errors.location_freeform}
                    >
                      {(props) => (
                        <input
                          {...props}
                          type="text"
                          name="location_freeform"
                          placeholder="City / town and district"
                          value={values.location_freeform}
                          onChange={(event) => setField('location_freeform', event.target.value)}
                        />
                      )}
                    </FormField>
                  ) : null}

                  <FormField
                    id="enquiry-message"
                    label="Message / Requirement Details"
                    error={errors.message}
                    hint="Roles, shift pattern, skill level, duration — anything that helps us plan accurately."
                  >
                    {(props) => (
                      <textarea
                        {...props}
                        name="message"
                        rows={5}
                        value={values.message}
                        onChange={(event) => setField('message', event.target.value)}
                      />
                    )}
                  </FormField>
                </fieldset>

                <div className={formStyles.actions}>
                  <button type="submit" className="btn btnPrimary" disabled={submitting}>
                    {submitting ? 'Submitting…' : 'Submit Enquiry'}
                  </button>
                  <p className={formStyles.actionsNote}>
                    We use your details only to respond to this enquiry.
                  </p>
                </div>
              </form>
            </>
          )}
        </section>

        <aside className={styles.aside} aria-label="Other ways to reach us">
          <div className={styles.asideCard}>
            <h2 className={styles.asideTitle}>Prefer to talk?</h2>
            <p className={styles.asideText}>
              Call or message us directly and we can take your requirement over the phone.
            </p>
            <ul className={styles.asideList}>
              {phone ? (
                <li>
                  <a href={phone}>{settings?.phone_primary}</a>
                </li>
              ) : null}
              {email ? (
                <li>
                  <a href={email}>{settings?.email_enquiries || settings?.email_primary}</a>
                </li>
              ) : null}
              {settings?.office_hours?.trim() ? <li>{settings.office_hours}</li> : null}
              {!phone && !email ? (
                <li className={styles.asideText}>
                  Our contact numbers will be listed here shortly — please use this form in the
                  meantime.
                </li>
              ) : null}
            </ul>
          </div>

          <div className={styles.asideCard}>
            <h2 className={styles.asideTitle}>What happens next</h2>
            <ol className={styles.asideSteps}>
              <li>We review your requirement and confirm the details with you.</li>
              <li>We plan the headcount, roles and shift coverage.</li>
              <li>Screened and verified staff are deployed on the agreed date.</li>
            </ol>
            <Link className={styles.quietLink} to="/how-we-work">
              See our full process
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
