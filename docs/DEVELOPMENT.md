# Developer and agent handoff

Read [AGENTS.md](../AGENTS.md) first. Use Node 24 and `npm ci` with the committed lockfile. The site is designed for editors to publish content through Tina and developers to extend shared components through reviewed code changes.

## Architecture and source ownership

| Layer | Maintained source | Responsibility |
|---|---|---|
| Routes and metadata | `src/pages/`, `src/layouts/BaseLayout.astro` | Public URLs, route generation, SEO and page shells |
| Content | `src/content/` | Git-backed Markdown and YAML edited by both Tina and developers |
| Astro validation | `src/content.config.ts`, `src/lib/marketing-schema.ts`, `src/lib/article-blocks.ts` | Content types and build-time constraints |
| Tina forms | `tina/config.ts`, `tina/extended-schema.ts`, `tina/shared-labels.ts`, `tina/content-blocks.ts` | Editor fields, defaults, labels and validation |
| Queries | `src/lib/tina-data.ts`, `src/lib/tina-extended-data.ts` | Metadata-preserving queries and paginated related records |
| Live previews | `src/lib/tina-islands.ts`, `src/components/editable/`, `src/pages/tina-island/[name].ts` | Register, fetch and rerender editable page regions |
| Design | `src/styles/global.css`, `src/components/`, `src/pages/styleguide/index.astro` | Tokens, shared markup, responsive behavior and living examples |
| Contact | `src/pages/api/contact.ts`, `src/pages/contact-us/index.astro` | Server validation/delivery and browser submit handling |
| Support | `src/pages/api/support.ts`, `src/components/SupportForm.astro`, `src/pages/[...slug].astro` | Software support form on the `/support/` legacy page; delivers to `SUPPORT_TO_EMAIL` (default `support@storesconsulting.com`) using the same Resend settings as Contact |
| Analytics | `src/scripts/analytics.ts` | Production-only GA4 tracking and conversion events |
| Checks | `scripts/check-*.mjs`, `tests/`, `.github/workflows/validate.yml` | Content, route, layout, accessibility and editing regressions |

Public pages are generated at build time. `/api/contact` handles delivery; `/tina-island/[name]` renders preview HTML on demand. A successful hosted Tina save commits content to GitHub; Vercel builds that commit. Unsaved preview changes are overlays and must not write files or send inquiries.

### Preserve the owner of every field

A CMS field must exist in the schemas, be fetched through a metadata-aware query, render from that queried object, and bind to its exact source with `tinaField`. Adding a form field alone does not make preview text editable.

- Service titles and summaries belong to service records. Cards and related links use those records. Navigation defaults to service titles; optional global short-label overrides are resolved by `src/lib/navigation-editing.ts`.
- Navigation routes/order remain in `src/data/navigation.ts`. Editable labels, footer copy and default CTAs live in `src/content/settings/global.yaml`.
- Page CTA overrides belong to the page record. Pass their field bindings through `CtaBand`; do not bind an override to global defaults.
- Author/category names belong to taxonomy records. A post's selected author/categories belong to that post.
- Related-content selectors belong to the containing page; displayed titles belong to the referenced documents.
- Article blocks and directory cards are structured content. Existing imported Markdown/HTML bodies remain editable as a body field; avoid lossy automatic conversions.

Keep metadata on records passed through components. Do not replace live editable lists with `getCollection` snapshots or generated option labels. Use `getEditorialList` for supported related collections; it preserves metadata and handles pagination. Generated picker options support selection, not live rendered copy. Bind individual list values rather than wrapping a whole page in one broad field target.

## Change recipes

### Change existing content

1. Locate its owning record using the content/editor guides. Preserve filenames, public routes and approved claims.
2. Edit the Markdown/YAML or use local Tina. Add images under `public/assets/editorial/` with appropriate alt text and dimensions.
3. Inspect the diff and run `npm run validate`. Check the affected page locally. Do not rerun migration tools.

### Add or change an editable field

1. Add the stored value/default and align the Tina and Astro schemas. Follow existing required/optional conventions; new required fields need values in every affected record.
2. Add the field to any explicit query selection and render from the metadata-bearing result. Bind the precise owning object/key with `tinaField`; preserve metadata through shared components.
3. If a region is optional or initially empty, provide a sidebar field or editor-only control so editors can create it. Follow the existing `data-editor-controls` pattern; controls must stay hidden publicly.
4. Regenerate through the repository commands, inspect generated tracked changes, then run validation and `npm run test:editing`.
5. Check select → edit → unsaved preview → save → reload, plus Reset. For shared records, check another appearance updates too. Restore test content before committing. Update the editor guide and a meaningful regression case when needed.

For new article block types, update `tina/content-blocks.ts`, `src/lib/article-blocks.ts` and `ArticleBlocks.astro` together. Rendering must support persisted `_template` and GraphQL `__typename`; use the existing video URL normalizer for supported video embeds.

### Add a page or collection

1. Decide whether an existing collection/template fits. New posts and client profiles already have creation defaults and stable-route handling.
2. For a new page family, add the content schema and Tina collection/form, metadata-aware fetcher, editable component, and matching registry entry in `src/lib/tina-islands.ts`.
3. Follow `src/pages/services/index.astro` for a route shell with `BaseLayout` and a primary `TinaIsland`. The initial render and preview registry must use the same data shape and component.
4. Configure the Tina router to the real public URL. Extend `scripts/build-editor-options.mjs` when filename-to-route maps or pickers need the new collection; never assume a filename equals its public slug.
5. Check route collisions, draft behavior, SEO, sitemap inclusion and internal links. Preserve historical route manifests; update their expectations only for an intentional route change, not to silence a failure.
6. Add navigation only when requested. Register the page in editor coverage and verify both its public route and editor preview.

### Add or change a visual component

1. Review local `/styleguide/` and the shared component closest to the requested pattern.
2. Reuse tokens and semantic markup. Preserve responsive layout, heading order, keyboard focus, reduced motion and no-JavaScript content visibility.
3. Carry field ownership through component props. Layout changes must not remove editing targets or misdirect clicks.
4. Add reusable variants/tokens to the styleguide in the same PR. Run public browser tests and editor tests when editable markup changes.
5. If the approved identity changes, update `Brand.astro` and the exports generated by `scripts/generate-brand-assets.mjs`; verify header/footer, favicon, touch icon and social card together.

## Generated files and local processes

- Do not hand-edit `tina/__generated__/`, `public/admin/`, `.astro/`, `dist/` or test outputs; they are ignored generated artifacts.
- `tina/tina-lock.json` and `tina/editor-options.json` are tracked generated files. Regenerate with project commands, inspect their diffs and include intentional changes.
- `scripts/run-with-tina.mjs` generates editor options before dev/check/build. Builds use local content even when cloud credentials are configured; configured cloud builds also require the search token to upload the branch index.
- Local Astro uses port 4321 and Tina normally uses 4001. Stop the Tina process you own before audit/check/build. Do not terminate someone else's development process without coordination.
- Do not run builds and editor/browser tests concurrently in one checkout: they change generated client configuration. Restart `npm run dev` after build/schema work. Playwright starts a dev server or reuses an existing local one; ensure a reused server belongs to this checkout.

## Verification and release

`npm run validate` is required before any PR, including documentation batches under the repository working agreement. It validates content, checks types, builds and checks generated HTML, links, navigation and route/media parity.

| Change | Additional verification |
|---|---|
| Documentation only | Check referenced paths, commands and statements against the source; no new behavioral tests needed |
| Content | Inspect the affected rendered page and draft/reference behavior |
| Layout/shared markup | `npm run test:e2e` |
| Tina/schema/field ownership | `npm run tina:audit`, then `npm run test:editing`; public tests if rendering changes |
| Contact, video validation or publishing alerts | `npm run test:ops` and relevant browser tests with mocked delivery |

Install Chromium once with `npx playwright install --with-deps chromium`. Run test/build commands sequentially. CI runs validation/operations tests, public browser tests and editor tests in separate jobs. A skipped conditional test is not evidence that its scenario was exercised.

Before merging, fetch current `main`, integrate newer Tina commits, inspect content diffs and resolve conflicts without discarding editorial work. Review the PR checks and Vercel preview. After an authorized merge, confirm the intended production commit is Ready and inspect affected live pages. A Git save or successful local build alone does not prove production is updated.

For recovery, follow [the editor guide](TINA-EDITOR.md#undo-or-recover): restore only the intended content or revert the relevant change on current history. Vercel rollback changes serving state, not Git content. Never force-push `main` or restore an entire stale checkout over later saves.

## Access and external acceptance

Credentials stay in local environment files or hosting settings, never documentation or Git. `.env.example` lists configuration names. Displayed contact email is content; delivery recipient is server configuration. Preserve the stable Vercel alias used by existing asset URLs when changing domains.

Real email delivery is reserved for the team sync. Use mocks during development and retain the editor-preview no-send guard. DNS access, team invitations, GA4 reporting verification and any paid service opt-in require the relevant account owner. See [the launch runbook](LAUNCH-RUNBOOK.md); do not claim these gates are complete from code tests alone.


## SEO and browser assets

`src/lib/structured-data.ts` builds linked JSON-LD from actual content and safely serializes it for HTML. `BaseLayout.astro` selects social images and emits metadata. Keep JSON-LD facts aligned with public content; never invent reviews, ratings, author credentials or business locations. Page `seo` fields are attached through `tina/seo-fields.ts` and validated in `src/lib/seo-schema.ts`; all CMS-backed public page shells must pass their record's `seo` to BaseLayout. Schema and social metadata are build outputs, not Tina island overlays.

`src/pages/site.webmanifest.ts` emits the browser manifest. The brand generator writes opaque white SVG/PNG/ICO and touch/home-screen icons, including the root Apple touch fallback. Rebuild all exports together and update icon URL versions when changing the design. The organization search logo is a separate editable asset.

Run `npm run test:ops` for JSON-LD escaping, entity references and icon opacity; `tests/seo.spec.ts` checks generated page graphs and metadata. Editor coverage includes business-profile and social-sharing fields. Google references: [Organization](https://developers.google.com/search/docs/appearance/structured-data/organization), [Article](https://developers.google.com/search/docs/appearance/structured-data/article), [Breadcrumb](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb); [Service vocabulary](https://schema.org/Service). Search Console reception and rich-result eligibility are separate from local validation.
