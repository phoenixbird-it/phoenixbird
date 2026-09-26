import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo/Seo';
import PageHero from '../../components/PageHero/PageHero';
import FormField from '../../components/Form/FormField';
import FormAlert from '../../components/Form/FormAlert';
import { useCompanySettings } from '../../hooks/useCompanySettings';
import { submitContactMessage } from '../../services/api';
import { ApiError } from '../../services/apiClient';
import type { ContactPayload } from '../../types';
import {
  addressLines,
  displayName,
  mailHref,
  mapEmbedSrc,
  socialLinks,
  telHref,
} from '../../utils/company';
import { buildWhatsAppUrl } from '../../utils/whatsapp';
import { flattenFieldErrors, isValidMobile, normaliseMobile } from '../../utils/validation';
import formStyles from '../../components/Form/Form.module.scss';
import styles from './Contact.module.scss';

interface FormValues {
  name: string;
  mobile_number: string;
  subject: string;
  message: string;
}

const EMPTY_FORM: FormValues = {
  name: '',
  mobile_number: '',
  subject: '',
  message: '',
};

type Errors = Partial<Record<keyof FormValues, string>>;

const GENERIC_ERROR =
  'Something went wrong while submitting your enquiry. Please try again or contact us directly.';

export default function Contact() {
  const { settings, loading } = useCompanySettings();
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const name = displayName(settings);
  const lines = addressLines(settings);
  const phone = telHref(settings?.phone_primary);
  const altPhone = telHref(settings?.phone_secondary);
  const email = mailHref(settings?.email_primary);
  const enquiryEmail = mailHref(settings?.email_enquiries);
  const socials = socialLinks(settings);
  const mapSrc = mapEmbedSrc(settings);
  const mapsLink = settings?.google_maps_url?.trim() || null;
  const whatsapp = settings?.whatsapp_number?.trim()
    ? buildWhatsAppUrl(settings.whatsapp_number, `Hello ${name}, I would like to get in touch.`)
    : null;

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

    if (!values.mobile_number.trim()) {
      next.mobile_number = 'Please enter your mobile number.';
    } else if (!isValidMobile(values.mobile_number)) {
      next.mobile_number = 'Enter a valid mobile number (7–15 digits, optionally starting with +).';
    }

    if (!values.message.trim()) next.message = 'Please tell us how we can help.';
    return next;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      document.getElementById(`contact-${Object.keys(validationErrors)[0]}`)?.focus();
      return;
    }

    const payload: ContactPayload = {
      name: values.name.trim(),
      mobile_number: normaliseMobile(values.mobile_number),
      message: values.message.trim(),
    };
    if (values.subject.trim()) payload.subject = values.subject.trim();

    setSubmitting(true);
    try {
      await submitContactMessage(payload);
      setSubmitted(true);
      setValues(EMPTY_FORM);
      setErrors({});
    } catch (error) {
      if (error instanceof ApiError) {
        const flat = flattenFieldErrors(error.fieldErrors);
        const mapped: Errors = {};
        for (const [key, message] of Object.entries(flat)) {
          if (key in EMPTY_FORM) mapped[key as keyof FormValues] = message;
        }
        setErrors(mapped);
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

  return (
    <>
      <Seo
        title="Contact Us"
        description="Contact PHOENIX BIRDS for manpower supply and facility services in Madurai and across Tamil Nadu. Call, WhatsApp or send us a message and our team will respond promptly."
      />
      <PageHero
        eyebrow="Contact"
        title="Contact Us"
        description="Talk to our team about housekeeping, hospitality, hospital, industrial or facility management manpower for your site."
      />

      <div className={`container ${styles.layout}`}>
        <section className={styles.formPanel} aria-labelledby="contact-form-title">
          <h2 id="contact-form-title" className={styles.panelTitle}>
            Send us a message
          </h2>

          {submitted ? (
            <FormAlert
              tone="success"
              title="Thank you for contacting PHOENIX BIRDS. Our team will get in touch with you shortly."
            >
              <p>Your message has been received and we will respond as soon as possible.</p>
              {whatsapp ? (
                <p className={styles.successCta}>
                  <a
                    className="btn btnWhatsapp"
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Continue on WhatsApp
                  </a>
                </p>
              ) : null}
            </FormAlert>
          ) : null}

          {formError ? (
            <FormAlert tone="error" title="Your message was not sent">
              <p>{formError}</p>
            </FormAlert>
          ) : null}

          <form noValidate onSubmit={handleSubmit}>
            <div className={formStyles.row}>
              <FormField id="contact-name" label="Name" required error={errors.name}>
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
                id="contact-mobile_number"
                label="Mobile"
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

              <FormField id="contact-subject" label="Subject" error={errors.subject}>
                {(props) => (
                  <input
                    {...props}
                    type="text"
                    name="subject"
                    placeholder="For example: housekeeping staff enquiry"
                    value={values.subject}
                    onChange={(event) => setField('subject', event.target.value)}
                  />
                )}
              </FormField>
            </div>

            <FormField id="contact-message" label="Message" required error={errors.message}>
              {(props) => (
                <textarea
                  {...props}
                  name="message"
                  rows={6}
                  value={values.message}
                  onChange={(event) => setField('message', event.target.value)}
                />
              )}
            </FormField>

            <div className={formStyles.actions}>
              <button type="submit" className="btn btnPrimary" disabled={submitting}>
                {submitting ? 'Sending…' : 'Send Message'}
              </button>
              <p className={formStyles.actionsNote}>
                For a staffing requirement, the{' '}
                <Link to="/request-manpower">Request Manpower form</Link> captures more detail.
              </p>
            </div>
          </form>
        </section>

        <aside className={styles.info} aria-label="Company contact details">
          <div className={styles.infoCard}>
            <h2 className={styles.panelTitle}>{name}</h2>
            {loading ? (
              <p className={styles.muted}>Loading contact details…</p>
            ) : (
              <dl className={styles.detailList}>
                {lines.length > 0 ? (
                  <div className={styles.detailRow}>
                    <dt>Office</dt>
                    <dd>
                      <address className={styles.address}>
                        {lines.map((line) => (
                          <span key={line}>{line}</span>
                        ))}
                      </address>
                    </dd>
                  </div>
                ) : null}

                {phone || altPhone ? (
                  <div className={styles.detailRow}>
                    <dt>Phone</dt>
                    <dd>
                      {phone ? <a href={phone}>{settings?.phone_primary}</a> : null}
                      {altPhone ? (
                        <>
                          <br />
                          <a href={altPhone}>{settings?.phone_secondary}</a>
                        </>
                      ) : null}
                    </dd>
                  </div>
                ) : null}

                {whatsapp ? (
                  <div className={styles.detailRow}>
                    <dt>WhatsApp</dt>
                    <dd>
                      <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                        {settings?.whatsapp_number}
                      </a>
                    </dd>
                  </div>
                ) : null}

                {email || enquiryEmail ? (
                  <div className={styles.detailRow}>
                    <dt>Email</dt>
                    <dd>
                      {email ? <a href={email}>{settings?.email_primary}</a> : null}
                      {enquiryEmail && settings?.email_enquiries !== settings?.email_primary ? (
                        <>
                          <br />
                          <a href={enquiryEmail}>{settings?.email_enquiries}</a>
                        </>
                      ) : null}
                    </dd>
                  </div>
                ) : null}

                {settings?.office_hours?.trim() ? (
                  <div className={styles.detailRow}>
                    <dt>Office hours</dt>
                    <dd>{settings.office_hours}</dd>
                  </div>
                ) : null}

                {lines.length === 0 && !phone && !email ? (
                  <div>
                    <p className={styles.muted}>
                      Our contact details are being updated. Please send us a message using the form
                      and we will get back to you.
                    </p>
                  </div>
                ) : null}
              </dl>
            )}

            {socials.length > 0 ? (
              <ul className={styles.socials}>
                {socials.map((social) => (
                  <li key={social.label}>
                    <a href={social.url} target="_blank" rel="noopener noreferrer">
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className={styles.infoCard}>
            <h2 className={styles.panelTitle}>Find us</h2>
            {mapSrc ? (
              <div className={styles.mapFrame}>
                <iframe
                  title={`Map showing the location of ${name}`}
                  src={mapSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            ) : (
              <p className={styles.muted}>
                Our map location will be available here shortly. In the meantime, we are based in
                Madurai, Tamil Nadu and serve clients across the region.
              </p>
            )}
            {mapsLink ? (
              <a
                className={styles.mapLink}
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Google Maps
                <span aria-hidden="true"> →</span>
              </a>
            ) : null}
          </div>
        </aside>
      </div>
    </>
  );
}
