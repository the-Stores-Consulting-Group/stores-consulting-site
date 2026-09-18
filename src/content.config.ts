import {sharingSchema,businessSchema} from './lib/seo-schema';
import {articleBlocks} from './lib/article-blocks';
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { marketingSchema } from './lib/marketing-schema';

const imagePath = z.string().refine((value) => value.startsWith('/') || /^https:\/\//.test(value), 'Use a local image path or HTTPS URL');
const nullablePath = imagePath.nullish();
const metric = z.object({
  value: z.string(),
  label: z.string(),
});
const workstream = z.object({
  title: z.string(),
  description: z.string(),
});
const contentImage = z.object({
  src: imagePath,
  alt: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  position: z.string().optional(),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/services' }),
  schema: z.object({
    seo: sharingSchema,
    workstreamsTitle: z.string(),
    resultsTitle: z.string(),
    ctaTitle: z.string(),
    ctaDescription: z.string(),
    ctaHref: z.string(),
    ctaLabel: z.string(),
    title: z.string(),
    slug: z.string(),
    order: z.number().int().positive(),
    eyebrow: z.string(),
    summary: z.string(),
    thesisLabel: z.string(),
    thesis: z.string(),
    workstreams: z.array(workstream).length(6),
    metrics: z.array(metric).min(3),
    metricsNote: z.string(),
    relatedContent: z.array(z.string().startsWith('/')).nullish(),
    relatedPaths: z.array(z.string().startsWith('/')).min(1),
    heroMedia: contentImage.optional(),
    supportingMedia: contentImage.optional(),
  }),
});

const people = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/people' }),
  schema: z.object({
    seo: sharingSchema,
    name: z.string(),
    role: z.string(),
    tier: z.enum(['leadership', 'director', 'managing-consultant', 'senior-consultant']),
    order: z.number().int().positive(),
    image: nullablePath,
    alt: z.string().nullish(),
    linkedin: z.string().refine((value) => /^https:\/\/(www\.)?linkedin\.com\//.test(value), 'Use a full linkedin.com profile URL').nullish(),
  }),
});

const clients = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/clients' }),
  schema: z.object({
    seo: sharingSchema,
    name: z.string(),
    slug: z.string(),
    route: z.string().startsWith('/'),
    category: z.string(),
    tier: z.enum(['national', 'regional', 'unspecified']),
    caseStudy: z.object({published:z.boolean().nullish(),challenge:z.string().nullish(),work:z.string().nullish(),results:z.string().nullish(),services:z.array(z.string().startsWith('/')).nullish()}).nullish(),
    logo: nullablePath,
    logoWidth: z.number().int().positive().nullish(),
    logoHeight: z.number().int().positive().nullish(),
    legacyUrl: z.url().nullish(),
    updatedDate: z.coerce.date(),
    sourceId: z.number().int().positive().nullish(),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    seo: sharingSchema,
    title: z.string(),
    slug: z.string(),
    route: z.string().startsWith('/'),
    excerpt: z.string(),
    publishedDate: z.coerce.date(),
    updatedDate: z.coerce.date(),
    author: z.string(),
    categories: z.array(z.string()),
    relatedServices: z.array(z.string().startsWith('/')).nullish(),
    contentBlocks:articleBlocks,
    contentType: z.enum(['article','video','report']).nullish(),
    resource: z.object({title:z.string(),url:z.string()}).nullish(),
    featuredMedia: nullablePath,
    featuredAlt: z.string().nullish(),
    featuredWidth: z.number().int().positive().nullish(),
    featuredHeight: z.number().int().positive().nullish(),
    canonicalUrl: z.url(),
    draft: z.boolean(),
    sourceId: z.number().int().positive().nullish(),
  }),
});

const directoryEntry=z.object({title:z.string(),date:z.string(),url:z.string().regex(/^\/(?!\/)/),image:imagePath,alt:z.string(),width:z.number().positive(),height:z.number().positive()});
const legacyPages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/legacy-pages' }),
  schema: z.object({
    seo: sharingSchema,
    title: z.string(),
    slug: z.string(),
    route: z.string().startsWith('/'),
    description: z.string(),
    originalUrl: z.url(),
    updatedDate: z.coerce.date(),
    sourceId: z.number().int().positive().nullish(),
    directoryEntries:z.array(directoryEntry).nullish(),
    overlapStrategy: z.enum(['mockup-primary', 'legacy-preserved']),
  }),
});

const categories = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/categories' }),
  schema: z.object({
    seo: sharingSchema,
    name: z.string(),
    slug: z.string(),
    route: z.string().startsWith('/'),
    description: z.string(),
    count: z.number().int().nonnegative(),
    sourceId: z.number().int().positive().nullish(),
  }),
});

const authors = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/authors' }),
  schema: z.object({
    seo: sharingSchema,
    name: z.string(),
    slug: z.string(),
    route: z.string().startsWith('/'),
    description: z.string(),
    avatar: z.string().nullish(),
    sourceId: z.number().int().positive().nullish(),
  }),
});

const action = z.object({
  label: z.string(),
  href: z.string().startsWith('/'),
});

const metadata = z.object({
  title: z.string(),
  description: z.string(),
});

const homepage = z.object({
  seo: sharingSchema,
  pageType: z.literal('home'),
  metadata,
  hero: z.object({
    headline: z.string(),
    emphasis: z.string(),
    description: z.string(),
    primaryAction: action,
    secondaryAction: action,
    image: contentImage,
  }),
  problem: z.object({
    heading: z.string(),
    description: z.string(),
    cards: z.array(z.object({ label: z.string(), title: z.string(), copy: z.string() })).length(3),
  }),
  ratio: z.object({
    items: z.array(z.object({ value: z.string(), label: z.string(), copy: z.string() })).length(2),
    quote: z.string(),
  }),
  proof: z.object({
    eyebrow: z.string(),
    heading: z.string(),
    paragraphs: z.array(z.string()).min(1),
    action,
    image: contentImage,
    outcomes: z.array(metric).min(1),
    totalLabel: z.string(),
    totalValue: z.string(),
  }),
  servicesIntro: z.object({ heading: z.string(), description: z.string() }),
  approach: z.object({
    heading: z.string(),
    description: z.string(),
    action,
    steps: z.array(z.object({ number: z.string(), title: z.string(), copy: z.string() })).length(3),
  }),
  technology: z.object({
    eyebrow: z.string(),
    heading: z.string(),
    description: z.string(),
    pills: z.array(z.string()).min(1),
  }),
  teamProof: z.object({
    heading: z.string(),
    description: z.string(),
    metrics: z.array(metric).length(4),
  }),
});

const servicesPage = z.object({
  seo: sharingSchema,
  pageType: z.literal('services'),
  metadata,
  intro: z.object({ title: z.string(), description: z.string() }),
});

const contactPage = z.object({
  seo: sharingSchema,
  pageType: z.literal('contact'),
  form: z.object({rateLimited:z.string(),name:z.string(),email:z.string(),company:z.string(),phone:z.string(),message:z.string(),submit:z.string(),sending:z.string(),success:z.string(),invalid:z.string(),unavailable:z.string()}),
  metadata,
  intro: z.object({ title: z.string(), description: z.string() }),
  details: z.object({
    eyebrow: z.string(),
    name: z.string(),
    addressLines: z.array(z.string()).min(1),
    email: z.email(),
  }),
});

const sitePages = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/site-pages' }),
  schema: z.discriminatedUnion('pageType', [homepage, servicesPage, contactPage]),
});

const marketing = defineCollection({loader: glob({pattern: '**/*.yaml', base: './src/content/marketing'}), schema: marketingSchema});

const settings = defineCollection({loader: glob({pattern:'global.yaml',base:'./src/content/settings'}),schema:z.object({business:businessSchema,sharing:sharingSchema,labels:z.record(z.string(),z.string()),navigation:z.record(z.string(),z.string()),footer:z.object({services:z.string(),company:z.string(),explore:z.string(),organization:z.string(),location:z.string()}),cta:z.object({title:z.string(),description:z.string(),href:z.string().startsWith('/'),label:z.string()})})});
export const collections = { settings, marketing, services, people, clients, posts, 'legacy-pages': legacyPages, categories, authors, 'site-pages': sitePages };
