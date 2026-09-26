export interface NavItem {
  label: string;
  to: string;
}

export const NAV_ITEMS: ReadonlyArray<NavItem> = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Why Choose Us', to: '/why-choose-us' },
  { label: 'How We Work', to: '/how-we-work' },
  { label: 'Service Areas', to: '/service-areas' },
  { label: 'Contact', to: '/contact' },
];
