import type { IndustryChoice } from '../types';

/** Dropdown options for the `industry` field on the enquiry endpoint. */
export const INDUSTRY_OPTIONS: ReadonlyArray<{ value: IndustryChoice; label: string }> = [
  { value: 'hotel_hospitality', label: 'Hotel / Hospitality' },
  { value: 'hospital_healthcare', label: 'Hospital / Healthcare' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'resort', label: 'Resort' },
  { value: 'residency', label: 'Residency' },
  { value: 'other', label: 'Other' },
];

/** Service categories exposed by `GET /services/?category=` */
export const SERVICE_CATEGORIES: ReadonlyArray<{ value: string; label: string }> = [
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'hospital', label: 'Hospital' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'facility_management', label: 'Facility Management' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'garden_landscape', label: 'Garden & Landscape' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'commercial', label: 'Commercial' },
];

export interface Highlight {
  title: string;
  description: string;
}

/** "Why Choose PHOENIX BIRDS" — bullet themes are fixed by the brief. */
export const WHY_CHOOSE_US: ReadonlyArray<Highlight> = [
  {
    title: 'Reliable Manpower',
    description:
      'Dependable staff supplied against agreed headcount and schedules, so your operations run without gaps.',
  },
  {
    title: 'Trained Workforce',
    description:
      'Workers are briefed and oriented on role expectations, hygiene, safety and on-site conduct before deployment.',
  },
  {
    title: 'Scalable Deployment',
    description:
      'Increase or reduce headcount as seasons, occupancy or production volumes change, without renegotiating from scratch.',
  },
  {
    title: 'Employee Management',
    description:
      'We handle supervision, shift allocation and day-to-day workforce coordination on your behalf.',
  },
  {
    title: 'Attendance & Payroll Support',
    description:
      'Attendance is recorded and reconciled, and wage processing is managed with clear, verifiable records.',
  },
  {
    title: 'PF & ESI Compliance',
    description:
      'Statutory obligations such as PF and ESI are handled as part of our engagement, keeping your contracts clean.',
  },
  {
    title: 'Replacement Support',
    description:
      'If a deployed worker is absent or unsuitable, we arrange a replacement so your shift coverage holds.',
  },
  {
    title: 'Client-Focused Service',
    description:
      'A single point of contact who understands your site, your standards and your escalation preferences.',
  },
  {
    title: 'Multi-Industry Experience',
    description:
      'We work across hotels, hospitals, factories, corporate offices and commercial properties.',
  },
  {
    title: 'Flexible Workforce Solutions',
    description:
      'Short-term, seasonal, project-based or long-term deployment — structured around how you actually operate.',
  },
];

export interface WorkStep {
  title: string;
  description: string;
}

/** "How We Work" — ordered workflow fixed by the brief. */
export const HOW_WE_WORK_STEPS: ReadonlyArray<WorkStep> = [
  {
    title: 'Understand Requirement',
    description:
      'We begin with a detailed discussion of your site, roles, shift pattern, skill expectations and timelines so the brief is unambiguous.',
  },
  {
    title: 'Manpower Planning',
    description:
      'Headcount, role mix, shift coverage and deployment dates are planned against your requirement and confirmed with you.',
  },
  {
    title: 'Recruitment & Screening',
    description:
      'Candidates are sourced and screened for suitability — relevant experience, physical fitness for the role and willingness for the shift pattern.',
  },
  {
    title: 'Verification & Documentation',
    description:
      'Identity and address proofs are collected and verified, and employment documentation is completed before anyone reaches your premises.',
  },
  {
    title: 'Workforce Deployment',
    description:
      'Workers are oriented on site rules, safety and hygiene expectations, then deployed to your location on the agreed date.',
  },
  {
    title: 'Attendance & Workforce Management',
    description:
      'Daily attendance, shift discipline and supervision are tracked, with records reconciled for transparent billing and payroll.',
  },
  {
    title: 'Ongoing Support & Replacement',
    description:
      'We stay engaged after deployment — reviewing performance, responding to feedback and arranging replacements when required.',
  },
];

export interface AboutSection {
  heading: string;
  paragraphs: string[];
}

/** About Us page narrative. Intentionally free of statistics and awards. */
export const ABOUT_SECTIONS: ReadonlyArray<AboutSection> = [
  {
    heading: 'Who We Are',
    paragraphs: [
      'PHOENIX BIRDS is a manpower supply and facility services company based in Madurai, Tamil Nadu. We provide trained and supervised staff to hotels, hospitals, industrial units, corporate offices and commercial establishments across the region.',
      'Our work is straightforward: we understand what a site needs, recruit and verify the right people, deploy them properly, and stay responsible for them once they are on the job. Clients get a workforce that turns up, performs to an agreed standard and is backed by proper records.',
    ],
  },
  {
    heading: 'Our Vision',
    paragraphs: [
      'To be a manpower and facility services partner that businesses in Tamil Nadu can rely on without hesitation — known for dependable deployment, disciplined staff and honest dealing.',
    ],
  },
  {
    heading: 'Our Mission',
    paragraphs: [
      'To supply the right people, properly trained and properly documented, to every client site we serve.',
      'To treat the workers we deploy fairly, with timely wages and statutory benefits, because a well-treated workforce is a dependable workforce.',
      'To keep communication direct and responsive, so issues are resolved on the same day they are raised wherever possible.',
    ],
  },
  {
    heading: 'Our Professional Approach',
    paragraphs: [
      'Every engagement begins with a clear scope: roles, headcount, shifts, skill level and reporting lines. We document what has been agreed so expectations on both sides are explicit.',
      'On site, we work to your standards and escalation preferences rather than imposing our own. A named coordinator remains available for the duration of the contract.',
    ],
  },
  {
    heading: 'Workforce Management',
    paragraphs: [
      'Deployed staff remain actively managed. Shift allocation, attendance, grooming and conduct, and adherence to site safety rules are monitored, with supervision appropriate to the size of the deployment.',
      'Attendance records are maintained and reconciled so billing and payroll can be checked line by line.',
    ],
  },
  {
    heading: 'Recruitment & Deployment',
    paragraphs: [
      'We recruit through our own channels and local networks, screening candidates for relevant experience and suitability for the specific role and shift pattern.',
      'Identity and address verification and employment documentation are completed before deployment. New joiners are briefed on the client site, their role and the conduct expected of them.',
    ],
  },
  {
    heading: 'Statutory Compliance',
    paragraphs: [
      'We handle the statutory side of employing a deployed workforce, including PF and ESI obligations and wage record-keeping, so our clients are not exposed to compliance gaps through their service contracts.',
      'Documentation is available for client audit and review on request.',
    ],
  },
  {
    heading: 'Employee Support',
    paragraphs: [
      'Timely wage payment, access to statutory benefits and a clear grievance channel are part of how we operate. Workers know who to approach and what to expect.',
      'This matters commercially as well as ethically: staff who are paid correctly and treated with respect stay in the role, which means lower churn on your site.',
    ],
  },
  {
    heading: 'Client Relationship',
    paragraphs: [
      'We keep the relationship direct. One point of contact, prompt responses, periodic reviews of how the deployment is performing, and a willingness to adjust when your requirement changes.',
    ],
  },
  {
    heading: 'Scalability',
    paragraphs: [
      'Requirements rarely stay still. Occupancy rises, a production order lands, a new floor opens, a festival season arrives. Our deployment model is built to scale up and scale back with your operations, and to support short-term, seasonal, project-based and long-term needs alike.',
    ],
  },
];
