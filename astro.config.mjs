// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import tina from '@tinacms/astro/integration';
import { tinaAdminDevRedirect } from '@tinacms/astro/vite';
import { unified } from '@astrojs/markdown-remark';
import remarkNormalizeMigratedHeadings from './src/lib/remark-normalize-migrated-headings.mjs';

export default defineConfig({
  site: 'https://storesconsulting.com',
  output: 'static',
  adapter: vercel(),
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith('/styleguide/') && !page.endsWith('/insights/'),
    }),
    tina(),
  ],
  trailingSlash: 'ignore',
  markdown: {
    processor: unified({ remarkPlugins: [remarkNormalizeMigratedHeadings] }),
  },
  redirects: {},
  vite: {
    plugins: [tinaAdminDevRedirect()],
    build: {
      cssMinify: true,
    },
  },
});
