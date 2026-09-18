import {sharingSchema} from './seo-schema';
import { z } from 'astro/zod';
export const marketingSchema = z.union([
z.object({seo:sharingSchema,copy: z.object({title1: z.string(),description2: z.string(),title3: z.string(),description4: z.string(),title5: z.string(),description6: z.string()}),groups: z.array(z.object({tier: z.string(),title: z.string()})).min(1)}),
z.object({seo:sharingSchema,copy: z.object({title1: z.string(),description2: z.string(),title3: z.string(),description4: z.string(),title5: z.string(),description6: z.string(),text27: z.string(),text28: z.string(),text29: z.string(),text30: z.string()}),foundations: z.array(z.object({title: z.string(),description: z.string()})).min(1)}),
z.object({seo:sharingSchema,copy: z.object({title1: z.string(),description2: z.string(),eyebrow3: z.string(),title4: z.string(),description5: z.string(),title6: z.string(),description7: z.string(),text8: z.string(),text9: z.string(),text10: z.string(),text11: z.string(),text12: z.string(),text13: z.string(),text14: z.string(),text15: z.string()}),resultGroups: z.array(z.object({title: z.string(),items: z.array(z.string()).min(1)})).min(1)}),
z.object({seo:sharingSchema,copy: z.object({title1: z.string(),description2: z.string(),title3: z.string(),description4: z.string(),title5: z.string(),description6: z.string(),text7: z.string(),text8: z.string(),text9: z.string(),text10: z.string()}),logos: z.array(z.object({name: z.string(),href: z.string(),image: z.object({src: z.string(),alt: z.string(),width: z.number().positive(),height: z.number().positive()})})).min(1)}),
z.object({seo:sharingSchema,copy: z.object({title1: z.string(),description2: z.string(),title3: z.string(),description4: z.string()})})
]);
