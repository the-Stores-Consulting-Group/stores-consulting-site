export type NavSection = 'services' | 'approach' | 'results' | 'about' | 'clients' | 'blog' | 'contact';

export interface NavigationLink {
  href: string;
  label: string;
  section: NavSection;
}

export const serviceLinks = [
  { href: '/services/', label: 'Services Overview' },
  { href: '/services/shrink-profit-recovery/', label: 'Shrink & Profit Recovery' },
  { href: '/services/fresh-inventory-operations/', label: 'Inventory & On-Shelf Availability' },
  { href: '/services/workforce-store-execution/', label: 'Workforce & Store Execution' },
  { href: '/services/technology-adoption-change-management/', label: 'Technology Adoption & Change Management' },
] as const;

export const primaryLinks: NavigationLink[] = [
  { href: '/approach/', label: 'Our Approach', section: 'approach' },
  { href: '/results/', label: 'Results', section: 'results' },
  { href: '/about/', label: 'About', section: 'about' },
  { href: '/clients/', label: 'Clients', section: 'clients' },
  { href: '/tscg-blog/', label: 'Blog', section: 'blog' },
];

export const footerGroups = [
  {
    label: 'Services',
    links: serviceLinks,
  },
  {
    label: 'Company',
    links: primaryLinks.filter((link) => link.section !== 'blog'),
  },
  {
    label: 'Explore',
    links: [
      primaryLinks.find((link) => link.section === 'blog')!,
      { href: '/contact-us/', label: 'Contact', section: 'contact' as const },
    ],
  },
] as const;

export function inferNavSection(pathname: string): NavSection | undefined {
  if (pathname.startsWith('/services/')) return 'services';
  if (pathname.startsWith('/approach/')) return 'approach';
  if (pathname.startsWith('/results/')) return 'results';
  if (pathname.startsWith('/about/')) return 'about';
  if (pathname.startsWith('/clients/') || pathname.startsWith('/project/')) return 'clients';
  if (pathname.startsWith('/tscg-blog/') || pathname.startsWith('/author/') || pathname.startsWith('/category/')) return 'blog';
  if (pathname.startsWith('/contact-us/')) return 'contact';
  return undefined;
}

// Shared label mapping: destinations remain code-owned, labels come from Tina.
export const navigationLabelKeys: Record<string, string> = {
 '/services/':'servicesOverview', '/services/shrink-profit-recovery/':'shrink',
 '/services/fresh-inventory-operations/':'fresh', '/services/workforce-store-execution/':'workforce',
 '/services/technology-adoption-change-management/':'technology', '/approach/':'approach',
 '/results/':'results', '/about/':'about', '/clients/':'clients', '/tscg-blog/':'blog', '/contact-us/':'contact',
};
export function navigationLabel(labels: Record<string,string>, href: string, fallback: string) {
 return labels[navigationLabelKeys[href]] || fallback;
}
