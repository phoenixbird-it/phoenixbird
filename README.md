# PHOENIX BIRDS — Manpower & Facility Services Platform

Corporate website and enquiry-management platform for **PHOENIX BIRDS**, a manpower supply and
facility support company based in Madurai, Tamil Nadu, serving hotels, hospitals, industries,
corporate offices and commercial establishments.

## Architecture

```
                 Django REST API (backend/)
                         |
          ---------------------------------
          |                               |
     React Web (frontend/)          Future Mobile App
          |                               |
       Desktop / Mobile Web         Android / iOS (React Native, etc.)
```

- **Backend**: Django + Django REST Framework, PostgreSQL-ready, modular apps
  (`core`, `companies`, `services`, `industries`, `locations`, `enquiries`, `contact`, `users`).
  All business content (services, industries, locations, company contact details) is
  editable from the Django Admin — nothing is hard-coded in the frontend.
- **Frontend**: React + Vite + TypeScript, React Router, SCSS. Consumes the REST API only —
  no business logic lives in the frontend, so the same API can power a future mobile app.
- **Database**: SQLite for local development, PostgreSQL in production via `DATABASE_URL`.

## Project structure

```
phoenix-birds/
├── backend/
│   ├── config/          # Django project settings, root urls
│   ├── core/            # Shared base models, exception handling, sitemap/robots, seed command
│   ├── companies/       # Company settings singleton (phone, email, address, socials)
│   ├── services/        # Manpower service catalog
│   ├── industries/      # Industries served
│   ├── locations/       # Service areas
│   ├── enquiries/       # Request Manpower enquiries + email notifications
│   ├── contact/         # Contact form messages + email notifications
│   ├── users/           # Reserved for future auth/employee/client login modules
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/, components/, layouts/, services/, hooks/, utils/, types/, assets/
│   └── .env.example
├── .gitignore
└── README.md
```

## Backend setup (local development)

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
copy .env.example .env       # then edit values as needed
python manage.py migrate
python manage.py seed_data          # optional: creates starter services/industries/locations
python manage.py createsuperuser
python manage.py runserver 8000
```

Django Admin: http://127.0.0.1:8000/admin/
API root: http://127.0.0.1:8000/api/v1/

### Environment variables (`backend/.env`)

See `backend/.env.example` for the full list. Key ones:

- `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`
- `DATABASE_URL` — leave empty for local SQLite; set to a Postgres URL in staging/production
- `CORS_ALLOWED_ORIGINS` — frontend origin(s) allowed to call the API
- `EMAIL_*`, `DEFAULT_FROM_EMAIL`, `ENQUIRY_RECEIVER_EMAIL` — enquiry/contact notification email
- `FRONTEND_BASE_URL` — used to build `sitemap.xml` entries
- `USE_S3`, `AWS_*` — enable S3-backed media/static storage in production

Company phone number, WhatsApp number, email, and address are **not** environment
variables — they are stored in the `CompanySettings` singleton, editable from
Django Admin → Company Settings, so they can change without a deployment.

## Frontend setup (local development)

```bash
cd frontend
npm install
copy .env.example .env.development   # already present; edit VITE_API_BASE_URL if needed
npm run dev
```

Runs at http://127.0.0.1:5173 and talks to the API at the URL in `VITE_API_BASE_URL`.

## API overview

```
GET    /api/v1/services/                  list active services (filter: ?category=<slug>)
GET    /api/v1/services/<slug>/           service detail
GET    /api/v1/industries/                list active industries
GET    /api/v1/locations/                 list active service locations
POST   /api/v1/enquiries/                 submit a "Request Manpower" enquiry
POST   /api/v1/contact/                   submit a contact form message
GET    /api/v1/company-settings/          company contact info (phone/email/whatsapp/address)
GET    /robots.txt
GET    /sitemap.xml
```

Enquiry and contact endpoints are rate-limited (5/minute per IP) to reduce spam;
all POST input is validated server-side regardless of frontend validation.

## Production deployment (AWS)

Live domain: **www.phoenixbirds.in**. Frontend and backend are served from the same
domain — a reverse proxy (nginx, CloudFront, or your host's routing rules) sends
`/api/*`, `/admin/*`, `/static/*` and `/media/*` to Django, and everything else to the
built React app. This avoids any CORS configuration in the browser.

Suggested, cost-conscious architecture:

- **Frontend**: build with `npm run build` (uses `frontend/.env.production`, which already
  points `VITE_API_BASE_URL` at `https://www.phoenixbirds.in/api/v1`); host the static
  output behind the same domain, e.g. **S3 + CloudFront**, with the proxy rules above.
- **Backend**: run Django via Gunicorn on **AWS App Runner** or a small **EC2**/**ECS**
  instance, routed under `www.phoenixbirds.in/api/` by the same proxy/CDN.
- **Database**: **RDS PostgreSQL** (set `DATABASE_URL` accordingly).
- **Media/static files**: **S3** bucket, served via CloudFront (`USE_S3=True` in backend `.env`).
- **Email**: Gmail SMTP (`phoenixbirdspsk@gmail.com`, requires a Gmail **App Password** —
  see `EMAIL_HOST_PASSWORD` in `.env.production.example`) or **AWS SES** if preferred.
- **Monitoring**: **CloudWatch** logs/alarms on the backend service.
- **DNS/SSL**: **Route 53** for `www.phoenixbirds.in` / `phoenixbirds.in`, certificate via **ACM**.

Copy `backend/.env.production.example` to `backend/.env` on the production server
(it already has `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS` and `FRONTEND_BASE_URL` set for
`www.phoenixbirds.in`) and fill in the real `SECRET_KEY`, `DATABASE_URL`, email password,
and AWS credentials. Then run `python manage.py collectstatic`.

If the API ends up hosted on its own subdomain instead (e.g. `api.phoenixbirds.in`) rather
than path-based routing on the same domain, update `frontend/.env.production`'s
`VITE_API_BASE_URL` accordingly and add that subdomain to the backend's `CORS_ALLOWED_ORIGINS`.

## Notes on content

Services, industries, locations, and company contact details ship with a small seed
dataset (`python manage.py seed_data`) so the site isn't empty during development —
all of it is meant to be reviewed and edited by PHOENIX BIRDS via Django Admin before
going live. No certifications, awards, client names, or statistics have been invented;
placeholders should be replaced with real, approved content only.
