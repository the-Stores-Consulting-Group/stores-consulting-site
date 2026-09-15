# Tina Editor & Team Handoff

Tina edits the same Git-backed content records used by the Astro build. Their team can save and publish without Josh's approval; larger layout or code changes use the repository.

## What the team can edit

| Collection | Coverage |
|---|---|
| Homepage | Copy, actions, evidence, metrics and images |
| About, Approach, Results, Clients and Blog index | Page/search copy, existing section content, methodology steps, results lists and approved client-logo gallery |
| Services Index and Services | Introduction, all four service pages, workstreams, metrics, images and closing CTAs |
| Contact Page | Public contact details, introduction, form labels and messages |
| People & bios | Names, roles, team groups, bios, optional portraits; new people can be added |
| Blog posts | Titles, excerpts, dates, author/category associations, body and featured images; new posts can be added |
| Client profiles | Names, logos and profile body; new profiles can be added |
| Blog authors and categories | Display names and archive descriptions |
| Additional pages | Public legacy page copy and body; superseded WordPress versions of primary pages are excluded from the editor |
| Site settings | Navigation labels, footer headings/details and the default closing action |

Existing routes, filenames, migration identifiers and component layout stay protected. Existing records cannot be deleted from Tina. Styleguide, 404/system messages, automatic date/count formatting, CSS and code remain developer-maintained. Shared display labels, including breadcrumb labels, are editable in global settings.

Older article/profile/page bodies use a Markdown text field to preserve their embedded legacy HTML without a lossy rich-text conversion. Plain paragraphs, lists, emphasis and Markdown links are editable there; retain existing HTML/image structures. A new layout or structural rewrite belongs in the codebase.

## Editing locally

Run `npm ci`, then `npm run dev`, and open `http://localhost:4321/admin/`. Choose **Enter Edit Mode**. No Tina account is required locally; Save writes to the working tree and does not publish online.

Choose a collection from the navigation menu or click an editable region in the preview. Related records, such as people on About, appear under **Referenced Files**. Save changes and check the source diff. If a schema change reloads the local editor bundle, reload `/admin/` to refresh its forms.

New posts begin as drafts. Drafts are edited in the collection form and excluded from public routes, archives and RSS. Turn off **Draft** when ready to publish. New public routes become available after the next successful site build; a dev-server restart may be necessary when adding records locally. Existing published URLs do not change when a title changes.

## Production accounts and direct publishing

Confirmed by Josh on 2026-09-08:

- GitHub stays under Josh; their technical team receives repository access.
- Vercel stays under Josh unless their team prefers its own account. Transfer can happen later.
- Update 2026-09-09: Josh connected the repository through his Tina account for now (user-reported). Team ownership can follow later. Individual login count is still to be settled; a shared login was suggested but its suitability has not been confirmed.
- Their team replaces imagery as needed. Current imagery stays for the handoff.

Setup:

1. Verify the TinaCloud project Josh connected to `hmpsn/stores-consulting-site` and its GitHub App permissions.
2. Add `TINA_PUBLIC_CLIENT_ID` and `TINA_TOKEN` to Vercel. Keep the token server/build-only.
3. Configure the production editor to read/save `main`. Give the TinaCloud App permission to commit there. Invite the intended editors.
4. Enable production deployments for Tina commits to `main`. Saving publishes after the build succeeds; no Josh approval step. Code changes continue through development branches and merges.
5. Test a Tina save → GitHub commit → production deployment, then a code merge → Tina refresh, verifying that both changes survive. Verify actual team-authored commits are deployable under the Vercel project permissions.

The configuration chooses `TINA_BRANCH` first, then the deployment's Git branch, then `main`. Avoid a blanket `TINA_BRANCH=main` on Preview deployments if they must edit an isolated preview branch.

[Tina pricing](https://tina.io/pricing), checked 2026-09-08: Free includes two total users and unlimited documents. Count any Josh/admin login within those two. Team includes three users at $29/month or $290/year. Confirm login count before choosing a paid plan.

[Vercel project transfer](https://vercel.com/docs/projects/transferring-projects) supports moving the site later; reconnect/review integrations during transfer.

## Git synchronization and recovery

TinaCloud saves Git commits and indexes GitHub updates through webhooks. Developers fetch and merge/rebase current production changes before merging code work. Never force-push production or replace content from a stale checkout. Concurrent edits to the same content can require conflict resolution.

To undo a published content change, revert its Git commit and deploy the resulting commit. A failed deployment leaves the previous successful version live. Do not restore an old deployment and then assume its content has also been restored in Git.

The WordPress migration scripts are historical import tools. Do not rerun them over edited content as a publishing step.

## Images

Tina manages `public/assets/editorial/`. Legacy assets remain at their original `/wp-content/uploads/...` URLs and are not exposed in the upload library.

Use descriptive filenames and optimized images. Structured page/service images include alternative text, width, height and crop position. For newly uploaded blog featured images, provide alternative text and dimensions; for new client logos, provide dimensions. Portraits use a square display crop. Existing imagery is retained unless the team chooses to replace it.

The contact email shown on the page is editable content; actual form delivery uses the server's `CONTACT_TO_EMAIL`. Production is intended to deliver to `contact@storesconsulting.com`. Changing the visible email does not silently reroute submissions.

## Developer validation

- Tina schemas: `tina/config.ts`, `tina/extended-schema.ts`
- Astro schemas: `src/content.config.ts`, `src/lib/marketing-schema.ts`
- Editable components and island registry: `src/components/editable/`, `src/lib/tina-islands.ts`
- Data queries: `src/lib/tina-data.ts`, `src/lib/tina-extended-data.ts`

When adding fields, update both schemas and the relevant render component. Keep the existing appearance and claims. Generated `tina/tina-lock.json` belongs in the review batch.

Run `npm run tina:audit`, `npm run validate`, `npm run test:e2e`, and `npm run test:editing` sequentially. See [the developer guide](DEVELOPMENT.md) for architecture and change recipes. Stop the local Tina dev server before running the audit/build commands to avoid port conflicts. `npm run build` also checks route collisions, taxonomy references and required managed-image metadata before publishing.

TinaCloud is connected; a hosted homepage save reached GitHub, and production editor access/search have been verified. PR #7 editor tests cover local save/restore/reset and production preview rendering was checked read-only. Team-account acceptance and real email delivery remain pending; a production rollback was not exercised.

## Search and blog formats

Set `TINA_SEARCH_TOKEN` to a **Search token** from TinaCloud → Tokens in Vercel Production and Preview. This is separate from the read-only content token. Never commit it or prefix it with `TINA_PUBLIC_`. The build uploads a branch-specific search index after the site compiles; title and body content are searchable. The local editor uses local search. See https://tina.io/docs/reference/search/overview.

Choose Written article, Video, or PDF report in Post format. Report posts use the PDF report title/URL fields and show an embedded preview plus an Open report link; video bodies preserve their existing video embed markup. Keep Draft on while preparing a post; turn it off and save to publish after a successful build. Published empty/placeholder posts are rejected by validation.

The 9/9 source audit retained 22 complete articles, four videos and one PDF report. Removed WordPress starter/slider tests and three password-protected internal-page stubs; their URLs now return 404 and are absent from public archives and the editor.

Legacy image fields use absolute URLs on the stable `stores-consulting-site-dusky.vercel.app` asset host, preventing Tina's `assets/editorial` media root from being prepended on save. Original files remain in place. Newly uploaded images continue to use the editorial media library. Retain that Vercel alias when moving domains or migrate these legacy URLs deliberately.

## Five-minute editor walkthrough

1. Open https://stores-consulting-site-dusky.vercel.app/admin/index.html and sign in with your invited account.
2. Use the navigation menu to choose a page or Blog posts. Search by title or topic. Click the preview text or open its named field to edit.
3. For a new post, choose Add File. Set title, excerpt, date, author and categories using the pickers. Keep Draft enabled while writing. Choose its format; PDF reports also need the report title and PDF URL. Select related services for the reader's next step.
4. For a case study, open its Client profile → Case study. Add the challenge, work and approved results, then choose related services. Enable Publish approved case study only when the claims and client identification have approval. An unpublished case study does not replace the existing profile.
5. Save, then check the deployment at https://vercel.com/josh-hampsons-projects/stores-consulting-site/deployments. A saved Git commit is not confirmation that the website update is live. Wait for Ready, open the public page, and check the change. Failed production deploys create/update a GitHub issue assigned to Josh; editors can watch repository issues for notifications.

For service pages, Related articles, reports & clients lets you choose supporting evidence by name. New choices appear after the previous content save has built successfully; refresh the editor to load the updated options. A post referenced by a service cannot be unpublished until that reference is removed.

### Undo or recover

- Before saving: use Reset to discard unsaved edits.
- After saving: open the changed file's GitHub History, find the last correct version, and restore just that file through a pull request. Avoid reverting a whole repository snapshot, which can remove later edits by other people.
- Developer command from a fresh branch: `git restore --source=<good-commit> -- src/content/<collection>/<file>`, inspect `git diff`, run validation, commit and open a PR. Pull current main before starting. The filename and commit must come from History, not guesswork.
- Failed deploy: the previous successful deployment normally stays live. Open its logs and the publishing alert issue, correct the reported content/configuration error, and save again. Close the issue after confirming Ready and the public result.
- Urgent site-wide incident: Josh can use Vercel's Instant Rollback to the known good deployment, then repair main separately. A hosting rollback does not change Git or Tina content. Don't save through Tina until the Git correction is understood.

### Analytics

Josh confirmed the existing property `G-73E0EDSM19` on 2026-09-09. Public production hosts collect page views, `contact_click`, `report_download`, and `generate_lead` after a confirmed delivery response. Preview hosts, localhost, the styleguide, and embedded Tina previews are excluded. Custom events include no form values or email addresses. Live email delivery is deliberately deferred to the team session; lead event behavior is tested with mocked responses only.

In GA4, verify incoming events and mark `generate_lead` as a key event. Review landing pages alongside inquiries and report downloads. Account access is required to configure GA4 reporting and confirm received data.

Recovery drill completed 2026-09-09 in an isolated temporary Git repository: restored one content file from the prior commit while preserving a later unrelated file. Production rollback was not invoked. Alert issue creation and deduplication were tested with mocked GitHub responses; no false production failure was generated.

Editor routing uses a generated filename-to-public-URL map, so older numeric filenames open the correct article/client preview. Draft posts do not open a public preview. This mapping and the named pickers regenerate during each build.

## Visual editing coverage audit

Collection coverage does not guarantee that every visible element selects its field. See [the editability audit](TINA-EDITABILITY-AUDIT.md) for the historical baseline at `d720cad` and implemented fixes. The coverage follow-up shipped in PR #7 at `68c7826`, with 164 public browser tests and 23 editor tests passing. The supported workflow is described below.

## Editing visible elements

Enable Tina quick editing to select a label, heading, image or body directly in the preview. Disable quick editing to follow links or open the navigation menu normally. The sidebar remains available for invisible/optional fields, image alternative text, URLs and SEO metadata.

- Service titles now drive cards, related links and navigation. Global Navigation has optional short service-label overrides; leave them blank to keep names synchronized.
- Closing CTAs edit their owning page when an override exists; default CTAs edit global settings. Global defaults do not overwrite page-specific closing copy.
- Click a blog title, person name, author/category name or client name to edit that source record. Renaming an author/category affects every use; change a post's association in its Author/Categories controls.
- Shared display labels contain service-card actions, related-section headings, article navigation/report buttons and case-study labels.
- Article blocks add text, images, YouTube/Vimeo videos and links below a post's existing body. Existing Markdown/HTML remains intact; paragraph text can be edited in Body (Markdown). New media should use blocks rather than raw HTML.
- The Case Studies additional page uses structured Directory cards. Titles, images, dates and destinations can be edited independently without special Markdown formatting.
- In quick-edit mode, extra controls expose related links, article blocks, case-study preparation and contact feedback messages. These controls are hidden on the public site. Contact forms inside editor previews never send inquiries. Test email delivery separately at the live team sync.

The approved logo artwork, layout, public route slugs, automatic date/count formatting, 404/system text and backend mechanics remain controlled by code.


## Search schema and social previews

Open **Site settings** for **Business profile (structured data)** and **Default social sharing**. Business description, search logo and verified official profile URLs are editable. Organization name comes from Footer → Organization; email comes from Contact page → Public contact details. Keep these facts consistent with the public site. The search-logo field does not replace browser icons or the header artwork.

Every public page record has **Social sharing** with an optional image and image description. Image priority is page override → article featured image (for posts) → site default. Leave an override blank to inherit the fallback. Use descriptive alt text and a landscape image, ideally 1200 × 630. Existing page title/search-description fields also feed social titles/descriptions.

The site generates Organization, WebSite and WebPage JSON-LD, plus matching breadcrumbs, Service data and BlogPosting data for written articles. PDF reports use DigitalDocument. Video pages retain WebPage/breadcrumb data; no video rich-result claims are generated without complete video-specific metadata. Draft posts have no public page, and noindex/system pages omit structured data. Layout and raw schema templates stay code-owned; editors update normal fields rather than JSON.

SEO head tags, schema and the web manifest update after Save and a successful deployment. They are not an unsaved visual-preview panel. Check the public page's source or a structured-data validator after publication. Correct markup does not guarantee a search feature.

Favicons and home-screen icons use the approved white background in every size. Browser links have a version suffix; pinned/home-screen shortcuts may need to be removed and added again because devices cache their icons independently.
