# the Stores Consulting Group website

Astro 7, strict TypeScript, Node 24, npm, TinaCMS and Vercel. Marketing and editorial pages are prerendered; contact delivery and Tina preview rendering use server endpoints.

## Start locally

```bash
npm ci
npm run dev
```

- Website: http://localhost:4321/
- Local editor: http://localhost:4321/admin/ — choose **Enter Edit Mode**. Save changes the local working tree; it does not publish.
- Design reference: http://localhost:4321/styleguide/

Local Tina editing and validation do not require cloud credentials. Environment variable names and placeholders are in [.env.example](.env.example); never commit actual credentials. Hosted contact delivery requires configured Resend credentials and a verified sender.

## Read first

| Reference | Purpose |
|---|---|
| [AGENTS.md](AGENTS.md) | Shared agent rules, design constraints and code review workflow |
| [CLAUDE.md](CLAUDE.md) | Claude entry point to those same instructions |
| [Developer guide](docs/DEVELOPMENT.md) | Architecture, field ownership, change recipes and checks |
| [Tina editor guide](docs/TINA-EDITOR.md) | Editing, direct publishing, image uploads and recovery |
| [Content guide](docs/CONTENT-EDITING.md) | Content locations, schemas and examples |
| [Launch runbook](docs/LAUNCH-RUNBOOK.md) | Account, domain, delivery and cutover gates |
| [Accessibility notes](docs/ACCESSIBILITY-NOTES.md) | Accessibility implementation and verification |
| [Editability audit](docs/TINA-EDITABILITY-AUDIT.md) | Historical baseline, implemented fixes and verification scope |
| [Migration report](docs/MIGRATION-REPORT.md) | Historical inventory and unresolved source-media exceptions |

## Design source

The living `/styleguide/` renders production tokens and shared components. Its source is [src/pages/styleguide/index.astro](src/pages/styleguide/index.astro); tokens live in [src/styles/global.css](src/styles/global.css), and the approved logo is [Brand.astro](src/components/Brand.astro). Browser icons have an opaque white background for dark-mode legibility and are generated with the brand assets. These are the maintained design references; no separate Figma source is bundled. The styleguide is unlinked and excluded from indexing and the sitemap.

## Publishing

- Live review site: https://stores-consulting-site-dusky.vercel.app/
- Hosted editor: https://stores-consulting-site-dusky.vercel.app/admin/index.html
- Repository: https://github.com/hmpsn/stores-consulting-site
- Deployments: https://vercel.com/josh-hampsons-projects/stores-consulting-site/deployments

Tina covers marketing pages, services, people, articles, client profiles, additional pages, taxonomy and shared display copy. Hosted Save commits to `main` and triggers deployment without Josh approval. Draft posts stay unpublished. A save is live only after its deployment succeeds.

Code changes use branches, pull requests and Vercel previews. Fetch current `main` before integrating code so newer Tina saves survive. Never force-push production. Repository protections depend on account configuration; do not assume a technical approval gate exists. See the developer guide for the review workflow.

## Verification

```bash
npm run validate
npm run test:ops
npx playwright install --with-deps chromium
npm run test:e2e
npm run test:editing
```

Stop local Tina before audit/check/build commands to avoid port conflicts. Run these commands sequentially in one checkout; build and dev commands regenerate the Tina client. The developer guide explains which checks apply to each change.

## Search and social metadata

Tina Site settings contains business-profile facts and the default social image; public page records have optional social-image overrides. JSON-LD is generated from these settings and page content. See [the editor guide](docs/TINA-EDITOR.md#search-schema-and-social-previews) for field ownership and publishing behavior. Browser metadata includes versioned favicons, Apple touch icons and a web manifest.

## Remaining handoff gates

Team account access, DNS/domain cutover and real email delivery acceptance require the team session. GA4 property `G-73E0EDSM19` is confirmed and tracking is implemented; received events/key-event configuration still require the correct dashboard. A proposed Vercel contact rate limit requires paid opt-in and has not been enabled.

Three documented source-media exceptions still require recovery or an explicit disposition before domain cutover. Keep the prior WordPress host for 30 days after cutover. `npm run migrate` is a historical import tool, never a normal build or publishing step; rerunning it can overwrite editor-managed content.
