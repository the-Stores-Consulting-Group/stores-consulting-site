import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const coreRoutes = [
  '/', '/about/', '/approach/', '/results/', '/clients/', '/services/',
  '/services/shrink-profit-recovery/', '/services/fresh-inventory-operations/',
  '/services/workforce-store-execution/', '/services/technology-adoption-change-management/',
  '/contact-us/', '/insights/', '/styleguide/',
  '/category/blog/', '/author/admin/', '/project/kroger/', '/case-studies/', '/improving-loss-prevention-strategies/',
];

test.describe('production structure', () => {
  for (const route of coreRoutes) {
    test(`${route} renders without overflow`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBe(200);
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('main h1')).toHaveCount(1);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }

  test('navigation uses real history and survives reload', async ({ page }) => {
    test.skip(test.info().project.name === 'chromium-no-js', 'History behavior is covered in JavaScript-enabled browsers.');
    await page.goto('/');
    const mobile = page.locator('.mobile-nav summary');
    if (await mobile.isVisible()) await mobile.click();
    await page.locator('a[href="/approach/"]:visible').first().click();
    await expect(page).toHaveURL(/\/approach\/$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await page.goForward();
    await expect(page).toHaveURL(/\/approach\/$/);
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Two paths in');
  });

  test('desktop service disclosure exposes every service route by keyboard', async ({ page }) => {
    test.skip(test.info().project.name !== 'chromium-1440', 'Desktop disclosure regression runs once.');
    await page.goto('/');
    const disclosure = page.locator('.desktop-nav__disclosure');
    const summary = disclosure.locator('summary');
    const panel = disclosure.locator('.desktop-nav__panel');
    const disclosureControl = await summary.evaluate((element) => {
      const summaryStyle = getComputedStyle(element);
      const iconStyle = getComputedStyle(element, '::after');
      return {
        alignItems: summaryStyle.alignItems,
        iconHeight: Number.parseFloat(iconStyle.height),
        iconTransform: iconStyle.transform,
        iconWidth: Number.parseFloat(iconStyle.width),
      };
    });
    expect(disclosureControl.alignItems).toBe('center');
    expect(Math.abs(disclosureControl.iconWidth - disclosureControl.iconHeight)).toBeLessThanOrEqual(0.5);
    expect(disclosureControl.iconTransform).not.toBe('none');

    await summary.click();
    await expect(panel).toBeVisible();
    await expect(panel.locator('a')).toHaveCount(5);
    await expect(panel.locator('a[href="/services/"]')).toBeVisible();
    await expect(panel.locator('a[href="/services/technology-adoption-change-management/"]')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(panel).not.toBeVisible();
    await expect(summary).toBeFocused();
  });

  test('primary navigation exposes Insights and accurate route-family states', async ({ page }) => {
    test.skip(test.info().project.name !== 'chromium-1440', 'Primary navigation state regression runs once.');
    await page.goto('/');
    await expect(page.locator('.desktop-nav > ul > li > a[href="/insights/"]')).toBeVisible();
    await expect(page.locator('.desktop-nav a[href="/#technology"]')).toHaveCount(0);

    await page.goto('/big-data-big-deal/');
    await expect(page.locator('.desktop-nav > ul > li > a[href="/insights/"]')).toHaveAttribute('aria-current', 'page');
    await page.goto('/category/fresh/');
    await expect(page.locator('.desktop-nav > ul > li > a[href="/insights/"]')).toHaveAttribute('aria-current', 'page');
    await page.goto('/project/kroger/');
    await expect(page.locator('.desktop-nav > ul > li > a[href="/clients/"]')).toHaveAttribute('aria-current', 'page');
    await page.goto('/services/shrink-profit-recovery/');
    await expect(page.locator('.desktop-nav__disclosure summary')).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('.desktop-nav__panel a[aria-current="page"]')).toHaveAttribute('href', '/services/shrink-profit-recovery/');
  });

  test('compact sticky header preserves navigation and anchor offsets', async ({ page }) => {
    test.skip(test.info().project.name !== 'chromium-1440', 'Sticky-header regression runs once.');
    await page.goto('/');
    const header = page.locator('.site-header');
    await expect(header).toHaveCSS('position', 'sticky');
    expect(await header.evaluate((element) => element.getBoundingClientRect().height)).toBeLessThanOrEqual(73);
    await page.evaluate(() => window.scrollTo(0, 1200));
    await expect.poll(() => header.evaluate((element) => Math.abs(element.getBoundingClientRect().top))).toBeLessThanOrEqual(1);

    await page.goto('/#technology');
    await expect.poll(() => page.locator('#technology').evaluate((element) => element.getBoundingClientRect().top)).toBeGreaterThanOrEqual(72);
  });

  test('mobile disclosure is keyboard accessible', async ({ page, viewport }) => {
    test.skip((viewport?.width || 1440) > 1000, 'Mobile navigation is only displayed at compact widths.');
    const isNoJavaScript = test.info().project.name === 'chromium-no-js';
    await page.goto('/');
    const summary = page.locator('.mobile-nav summary');
    const menuControl = await summary.evaluate((element) => {
      const summaryStyle = getComputedStyle(element);
      const iconStyle = getComputedStyle(element, '::after');
      return {
        alignItems: summaryStyle.alignItems,
        display: summaryStyle.display,
        iconHeight: Number.parseFloat(iconStyle.height),
        iconTransform: iconStyle.transform,
        iconWidth: Number.parseFloat(iconStyle.width),
      };
    });
    expect(menuControl.display).toBe('inline-grid');
    expect(menuControl.alignItems).toBe('center');
    expect(Math.abs(menuControl.iconWidth - menuControl.iconHeight)).toBeLessThanOrEqual(0.5);
    expect(menuControl.iconTransform).not.toBe('none');
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.mobile-nav nav')).toBeVisible();
    await expect(page.locator('.mobile-nav a[href="/services/"]')).toBeVisible();
    await expect(page.locator('.mobile-nav__subnav a')).toHaveCount(5);
    await expect(page.locator('.mobile-nav a[href="/insights/"]')).toBeVisible();

    if (isNoJavaScript) return;

    await page.keyboard.press('Escape');
    await expect(page.locator('.mobile-nav nav')).not.toBeVisible();
    await expect(summary).toBeFocused();
  });

  test('320px mobile navigation scrolls independently to every destination', async ({ page }) => {
    test.skip(test.info().project.name !== 'chromium-320', 'Smallest mobile menu regression runs once.');
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/');
    await page.locator('.mobile-nav summary').click();
    const menu = page.locator('.mobile-nav nav');
    await expect(menu).toBeVisible();
    expect(await menu.evaluate((element) => getComputedStyle(element).overflowY)).toBe('auto');
    expect(await menu.evaluate((element) => element.getBoundingClientRect().bottom)).toBeLessThanOrEqual(568);
    const contact = menu.locator('a[href="/contact-us/"]');
    await contact.scrollIntoViewIfNeeded();
    await expect(contact).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);

    await page.locator('.site-header').click({ position: { x: 150, y: 20 } });
    await expect(menu).not.toBeVisible();
  });

  test('detail route families use semantic breadcrumbs and return paths', async ({ page }) => {
    test.skip(test.info().project.name !== 'chromium-1440', 'Breadcrumb coverage runs once.');
    await page.goto('/services/shrink-profit-recovery/');
    await expect(page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'What We Do' })).toHaveAttribute('href', '/services/');
    await expect(page.locator('.breadcrumbs [aria-current="page"]')).toContainText('Shrink & Profit Recovery');

    await page.goto('/project/kroger/');
    await expect(page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'Clients' })).toHaveAttribute('href', '/clients/');
    await page.goto('/big-data-big-deal/');
    await expect(page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'Insights' })).toHaveAttribute('href', '/insights/');
    await page.goto('/category/fresh/');
    await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toBeVisible();
    await page.goto('/author/scott/');
    await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toBeVisible();
    await page.goto('/supply-chain/');
    await expect(page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');

    await page.goto('/about/');
    await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toHaveCount(0);
  });

  test('posts link taxonomy and deterministic chronological neighbors', async ({ page }) => {
    test.skip(test.info().project.name !== 'chromium-1440', 'Article navigation regression runs once.');
    await page.goto('/video-series-rich-van-patten-labor-part-2/');
    await expect(page.locator('.blog-meta a[href^="/author/"]')).toHaveCount(1);
    await expect(page.locator('.blog-meta a[href^="/category/"]').first()).toBeVisible();
    await expect(page.locator('.article-navigation__back')).toHaveAttribute('href', '/insights/');
    await expect(page.getByRole('link', { name: /Newer article:/i })).toHaveAttribute('href', '/improving-loss-prevention-strategies/');
    await expect(page.getByRole('link', { name: /Older article:/i })).toHaveAttribute('href', '/video-series-rich-van-patten-labor/');
  });

  test('footer groups global destinations without promoting legacy pages', async ({ page }) => {
    test.skip(test.info().project.name !== 'chromium-1440', 'Footer hierarchy regression runs once.');
    await page.goto('/');
    await expect(page.locator('.site-footer__group')).toHaveCount(3);
    await expect(page.locator('.site-footer__group h2')).toHaveText(['Services', 'Company', 'Explore']);
    await expect(page.locator('.site-footer a[href="/services/shrink-profit-recovery/"]')).toBeVisible();
    await expect(page.locator('.site-footer a[href="/insights/"]')).toBeVisible();
    await expect(page.locator('.site-footer a[href="/supply-chain/"]')).toHaveCount(0);
  });

  test('core pages have no critical or serious axe violations', async ({ page }) => {
    test.skip(test.info().project.name !== 'chromium-1440', 'Accessibility scan runs once on the desktop project.');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const results = await new AxeBuilder({ page }).exclude('astro-dev-toolbar').analyze();
    const structural = results.violations.filter((violation) => violation.impact === 'critical' || violation.impact === 'serious');
    expect(structural).toEqual([]);
  });

  test('1106px homepage retains approved Field Manual geometry', async ({ page }) => {
    test.skip(test.info().project.name !== 'chromium-1106', 'Targeted layout regression runs at the review viewport.');
    await page.goto('/');
    const proofImageLocator = page.locator('.fm-proof-layout__visual img');
    await proofImageLocator.scrollIntoViewIfNeeded();
    await expect.poll(() => proofImageLocator.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);

    const geometry = await page.evaluate(() => {
      const firstCard = document.querySelector<HTMLElement>('.service-card');
      const philosophy = document.querySelector<HTMLElement>('.philosophy');
      const philosophyHeading = document.querySelector<HTMLElement>('.philosophy h2');
      const philosophyLead = document.querySelector<HTMLElement>('.philosophy > p:not(.eyebrow)');
      const ctaHeading = document.querySelector<HTMLElement>('.cta-band h2');
      const problemLabel = document.querySelector<HTMLElement>('.problem-card__label');
      const problemHeading = document.querySelector<HTMLElement>('.problem-card h3');
      const headerCta = document.querySelector<HTMLElement>('.site-header__cta');
      const header = document.querySelector<HTMLElement>('.site-header');
      const heroCopy = document.querySelector<HTMLElement>('.fm-hero__copy');
      const heroMedia = document.querySelector<HTMLElement>('.fm-hero > .field-image');
      const sectionHeading = document.querySelector<HTMLElement>('.section__heading');
      const proofVisual = document.querySelector<HTMLElement>('.fm-proof-layout__visual');
      const proofImage = proofVisual?.querySelector<HTMLImageElement>('img');
      const evidencePanel = proofVisual?.querySelector<HTMLElement>('.evidence-panel');
      if (!firstCard || !philosophy || !philosophyHeading || !philosophyLead || !ctaHeading || !problemLabel || !problemHeading || !headerCta || !header || !heroCopy || !heroMedia || !sectionHeading || !proofVisual || !proofImage || !evidencePanel) return null;
      const philosophyRect = philosophy.getBoundingClientRect();
      const labelRect = problemLabel.getBoundingClientRect();
      const headingRect = problemHeading.getBoundingClientRect();
      return {
        cardInset: Number.parseFloat(getComputedStyle(firstCard).paddingLeft),
        philosophyLeft: philosophyRect.left,
        philosophyRight: innerWidth - philosophyRect.right,
        philosophyHeadingWidth: philosophyHeading.getBoundingClientRect().width,
        philosophyLeadWidth: philosophyLead.getBoundingClientRect().width,
        ctaWidth: ctaHeading.getBoundingClientRect().width,
        labelFont: Number.parseFloat(getComputedStyle(problemLabel).fontSize),
        labelGap: headingRect.top - labelRect.bottom,
        headerCtaHeight: headerCta.getBoundingClientRect().height,
        headerHeight: header.getBoundingClientRect().height,
        heroCopyWidth: heroCopy.getBoundingClientRect().width,
        heroMediaWidth: heroMedia.getBoundingClientRect().width,
        sectionHeadingWidth: sectionHeading.getBoundingClientRect().width,
        proofImageWidth: proofImage.naturalWidth,
        evidencePosition: getComputedStyle(evidencePanel).position,
      };
    });

    expect(geometry).not.toBeNull();
    expect(geometry!.cardInset).toBeGreaterThanOrEqual(24);
    expect(Math.abs(geometry!.philosophyLeft - geometry!.philosophyRight)).toBeLessThanOrEqual(1);
    expect(geometry!.philosophyHeadingWidth).toBeGreaterThanOrEqual(700);
    expect(geometry!.philosophyLeadWidth).toBeGreaterThanOrEqual(800);
    expect(geometry!.ctaWidth).toBeGreaterThan(500);
    expect(geometry!.labelFont).toBeLessThanOrEqual(12);
    expect(geometry!.labelGap).toBeLessThanOrEqual(18);
    expect(geometry!.headerCtaHeight).toBeLessThanOrEqual(46);
    expect(geometry!.headerHeight).toBeLessThanOrEqual(84);
    expect(geometry!.heroCopyWidth).toBeGreaterThan(geometry!.heroMediaWidth);
    expect(geometry!.sectionHeadingWidth).toBeGreaterThanOrEqual(700);
    expect(geometry!.proofImageWidth).toBeGreaterThan(0);
    expect(geometry!.evidencePosition).toBe('absolute');
  });

  test('1106px shared templates retain the compact spacing system', async ({ page }) => {
    test.skip(test.info().project.name !== 'chromium-1106', 'Shared spacing regressions run at the review viewport.');

    await page.goto('/about/');
    const people = await page.locator('.person-card').evaluateAll((cards) => cards.map((card) => card.getBoundingClientRect().height));
    expect(Math.max(...people)).toBeLessThanOrEqual(340);
    expect(await page.locator('.person-card .prose').first().evaluate((prose) => Number.parseFloat(getComputedStyle(prose).paddingTop))).toBe(0);
    expect(await page.locator('.site-footer').evaluate((footer) => footer.getBoundingClientRect().height)).toBeLessThanOrEqual(360);

    await page.goto('/services/shrink-profit-recovery/');
    const workstreams = await page.locator('.workstream-grid li').evaluateAll((items) => items.map((item) => item.getBoundingClientRect().height));
    expect(Math.max(...workstreams)).toBeLessThanOrEqual(170);
    expect(await page.locator('.cta-band').evaluate((cta) => getComputedStyle(cta).backgroundColor)).not.toBe('rgba(0, 0, 0, 0)');

    await page.goto('/project/kroger/');
    expect(await page.locator('.project-logo img').evaluate((image) => image.getBoundingClientRect().height)).toBeLessThanOrEqual(128);
    expect(await page.locator('.project-content img').evaluate((image) => getComputedStyle(image).display)).toBe('none');

    await page.goto('/case-studies/');
    await expect(page.locator('.legacy-case-grid li')).toHaveCount(39);
    const archiveCards = await page.locator('.legacy-case-grid li').evaluateAll((items) => items.map((item) => item.getBoundingClientRect().height));
    expect(Math.max(...archiveCards)).toBeLessThanOrEqual(320);

    await page.goto('/results/');
    expect(await page.locator('.page-intro h1').evaluate((heading) => heading.getBoundingClientRect().width)).toBeGreaterThanOrEqual(700);
    const resultsHierarchy = await page.evaluate(() => ({
      section: Number.parseFloat(getComputedStyle(document.querySelector<HTMLElement>('.section__heading h2')!).fontSize),
      card: Number.parseFloat(getComputedStyle(document.querySelector<HTMLElement>('.path-card h3')!).fontSize),
    }));
    expect(resultsHierarchy.section - resultsHierarchy.card).toBeGreaterThanOrEqual(8);
    const resultPrinciples = await page.locator('.principle-card').evaluateAll((cards) => cards.map((card) => card.getBoundingClientRect().height));
    expect(Math.max(...resultPrinciples)).toBeLessThanOrEqual(220);

    await page.goto('/approach/');
    const principleGrid = await page.locator('.principle-grid').evaluate((grid) => ({
      columns: getComputedStyle(grid).gridTemplateColumns.split(' ').length,
      rows: new Set(Array.from(grid.children, (card) => (card as HTMLElement).offsetTop)).size,
    }));
    expect(principleGrid).toEqual({ columns: 2, rows: 2 });
  });

  test('1106px typography preserves distinct editorial tiers', async ({ page }) => {
    test.skip(test.info().project.name !== 'chromium-1106', 'Typography regression runs at the review viewport.');

    await page.goto('/');
    const scale = await page.evaluate(() => {
      const size = (selector: string) => Number.parseFloat(getComputedStyle(document.querySelector<HTMLElement>(selector)!).fontSize);
      return {
        body: Number.parseFloat(getComputedStyle(document.body).fontSize),
        lead: size('.section__heading > p:not(.eyebrow)'),
        card: size('.problem-card h3'),
        section: size('.section__heading h2'),
      };
    });
    expect(scale.lead - scale.body).toBeGreaterThanOrEqual(3);
    expect(scale.card - scale.lead).toBeGreaterThanOrEqual(4);
    expect(scale.section - scale.card).toBeGreaterThanOrEqual(12);

    const rhythm = await page.evaluate(() => {
      const ratio = (selector: string) => {
        const style = getComputedStyle(document.querySelector<HTMLElement>(selector)!);
        return Number.parseFloat(style.lineHeight) / Number.parseFloat(style.fontSize);
      };
      return {
        display: ratio('.fm-hero h1'),
        section: ratio('.section__heading h2'),
        card: ratio('.problem-card h3'),
        lead: ratio('.section__heading > p:not(.eyebrow)'),
        body: ratio('.problem-card p:last-child'),
      };
    });
    expect(rhythm.display).toBeGreaterThanOrEqual(0.92);
    expect(rhythm.display).toBeLessThanOrEqual(0.96);
    expect(rhythm.section).toBeGreaterThanOrEqual(0.97);
    expect(rhythm.section).toBeLessThanOrEqual(1.01);
    expect(rhythm.card).toBeGreaterThanOrEqual(1.07);
    expect(rhythm.card).toBeLessThanOrEqual(1.11);
    expect(rhythm.lead).toBeGreaterThanOrEqual(1.44);
    expect(rhythm.lead).toBeLessThanOrEqual(1.48);
    expect(rhythm.body).toBeGreaterThanOrEqual(1.56);
    expect(rhythm.body).toBeLessThanOrEqual(1.6);

    await page.goto('/big-data-big-deal/');
    const articleScale = await page.evaluate(() => ({
      body: Number.parseFloat(getComputedStyle(document.querySelector<HTMLElement>('.prose p')!).fontSize),
      subheading: Number.parseFloat(getComputedStyle(document.querySelector<HTMLElement>('.prose h2')!).fontSize),
    }));
    expect(articleScale.subheading / articleScale.body).toBeGreaterThanOrEqual(1.45);
  });

  test('shared components separate semantic heading level from visual tier', async ({ page }) => {
    test.skip(test.info().project.name !== 'chromium-1440', 'Component-contract regression runs once.');

    await page.goto('/services/');
    await expect(page.locator('.site-header .brand__shelf')).toHaveCount(3);
    await expect(page.locator('.site-header .brand__item')).toHaveCount(1);
    await expect(page.locator('.site-header .brand__descriptor')).toHaveText('Consulting Group');
    await expect(page.locator('.site-header .brand__divider')).toHaveCount(0);
    expect((await page.locator('.site-header .brand__mark').textContent())?.trim()).toBe('');
    const brandBalance = await page.locator('.site-header .brand').evaluate((brand) => {
      const mark = brand.querySelector<HTMLElement>('.brand__mark')!;
      const wordmark = brand.querySelector<HTMLElement>('.brand__wordmark')!;
      const descriptor = brand.querySelector<HTMLElement>('.brand__descriptor')!;
      return {
        nameToMark: wordmark.getBoundingClientRect().width / mark.getBoundingClientRect().width,
        descriptorToName: descriptor.getBoundingClientRect().width / wordmark.getBoundingClientRect().width,
        markToTypeHeight: mark.getBoundingClientRect().height / brand.querySelector<HTMLElement>('.brand__type')!.getBoundingClientRect().height,
      };
    });
    expect(brandBalance.nameToMark).toBeGreaterThanOrEqual(2.75);
    expect(brandBalance.descriptorToName).toBeGreaterThanOrEqual(0.85);
    expect(brandBalance.markToTypeHeight).toBeLessThanOrEqual(0.95);
    await expect(page.locator('.service-card h2.card-title')).toHaveCount(4);
    const serviceTitleSize = await page.locator('.service-card .card-title').first().evaluate((heading) => Number.parseFloat(getComputedStyle(heading).fontSize));
    expect(serviceTitleSize).toBeLessThan(44);

    await page.goto('/styleguide/');
    await expect(page.locator('.logo-option')).toHaveCount(2);
    await expect(page.locator('#logo-option-pure-wordmark .review-wordmark')).toHaveCount(1);
    await expect(page.locator('#logo-option-shelf-register .brand__shelf')).toHaveCount(3);
    await expect(page.locator('#logo-option-shelf-register')).toHaveClass(/logo-option--active/);
    const wordmarkBalance = await page.locator('#logo-option-pure-wordmark .review-wordmark').evaluate((wordmark) => {
      const article = wordmark.closest<HTMLElement>('.logo-option')!;
      const the = wordmark.querySelector<HTMLElement>('.review-wordmark__name span')!;
      const stores = wordmark.querySelector<HTMLElement>('.review-wordmark__name strong')!;
      const descriptor = wordmark.querySelector<HTMLElement>('.review-wordmark__descriptor')!;
      const shelfBrand = article.nextElementSibling!.querySelector<HTMLElement>('.brand')!;
      const shelfMark = shelfBrand.querySelector<HTMLElement>('.brand__mark')!;
      const shelfType = shelfBrand.querySelector<HTMLElement>('.brand__type')!;
      const shelfWordmark = shelfBrand.querySelector<HTMLElement>('.brand__wordmark')!;
      const shelfDescriptor = shelfBrand.querySelector<HTMLElement>('.brand__descriptor')!;
      return {
        theGap: stores.getBoundingClientRect().left - the.getBoundingClientRect().right,
        descriptorSize: Number.parseFloat(getComputedStyle(descriptor).fontSize),
        topDelta: Math.abs(the.getBoundingClientRect().top - stores.getBoundingClientRect().top),
        descriptorGap: descriptor.getBoundingClientRect().top - stores.getBoundingClientRect().bottom,
        descriptorAlignment: Math.abs(descriptor.getBoundingClientRect().left - stores.getBoundingClientRect().left),
        shelfWidth: shelfBrand.getBoundingClientRect().width,
        shelfGap: shelfType.getBoundingClientRect().left - shelfMark.getBoundingClientRect().right,
        shelfDescriptorGap: shelfDescriptor.getBoundingClientRect().top - shelfWordmark.getBoundingClientRect().bottom,
      };
    });
    expect(wordmarkBalance.theGap).toBeLessThanOrEqual(3);
    expect(wordmarkBalance.descriptorSize).toBeGreaterThanOrEqual(12);
    expect(wordmarkBalance.topDelta).toBeLessThanOrEqual(1);
    expect(wordmarkBalance.descriptorGap).toBeLessThanOrEqual(5);
    expect(wordmarkBalance.descriptorAlignment).toBeLessThanOrEqual(1);
    expect(wordmarkBalance.shelfWidth).toBeGreaterThanOrEqual(250);
    expect(wordmarkBalance.shelfGap).toBeLessThanOrEqual(18);
    expect(wordmarkBalance.shelfDescriptorGap).toBeLessThanOrEqual(8);
    await expect(page.locator('.styleguide-component .service-card h4.card-title')).toHaveCount(2);
    await expect(page.locator('.styleguide-component .workstream-grid h4.card-title')).toHaveCount(3);

    await page.goto('/about/');
    await expect(page.locator('.people-group > h2.eyebrow')).toHaveCount(4);
    expect(await page.locator('.person-card h3').count()).toBeGreaterThan(0);

    await page.goto('/results/');
    await expect(page.locator('.section__heading--label-only h2.eyebrow')).toHaveText('How We Guard Against Overstating It');
    const pathTitleSizes = await page.locator('.path-card > :is(h2, h3)').evaluateAll((headings) => headings.map((heading) => Number.parseFloat(getComputedStyle(heading).fontSize)));
    expect(Math.max(...pathTitleSizes) - Math.min(...pathTitleSizes)).toBeLessThanOrEqual(0.1);
  });

  test('content-driven cards and deliberate responsive grids avoid dead space', async ({ page }) => {
    test.skip(test.info().project.name !== 'chromium-1440', 'Responsive system regression runs once.');

    for (const route of ['/results/', '/approach/']) {
      await page.goto(route);
      const minimums = await page.locator('.path-card').evaluateAll((cards) => cards.map((card) => getComputedStyle(card).minHeight));
      expect(new Set(minimums)).toEqual(new Set(['0px']));
    }

    await page.goto('/services/fresh-inventory-operations/');
    expect(await page.locator('.service-hero').evaluate((hero) => getComputedStyle(hero).minHeight)).toBe('0px');
    expect(await page.locator('.service-hero__copy').evaluate((copy) => copy.getBoundingClientRect().width)).toBeGreaterThan(900);

    await page.setViewportSize({ width: 1121, height: 934 });
    await page.goto('/#technology');
    const philosophyBefore = await page.locator('.philosophy h2').evaluate((heading) => heading.getBoundingClientRect().width);
    await page.setViewportSize({ width: 1120, height: 934 });
    const philosophyAfter = await page.locator('.philosophy h2').evaluate((heading) => heading.getBoundingClientRect().width);
    expect(Math.abs(philosophyBefore - philosophyAfter)).toBeLessThanOrEqual(2);

    await page.setViewportSize({ width: 768, height: 934 });
    await page.goto('/');
    expect(await page.locator('.problem-grid').evaluate((grid) => getComputedStyle(grid).gridTemplateColumns.split(' ').length)).toBe(1);
    expect(await page.locator('.ratio-band__grid').evaluate((grid) => getComputedStyle(grid).gridTemplateColumns.split(' ').length)).toBe(1);

    await page.goto('/clients/');
    await expect(page.locator('.client-logo-grid')).toHaveCount(0);
    await expect(page.locator('.field-image img').first()).toBeVisible();
    const archive = page.locator('.link-archive-grid');
    expect(await archive.evaluate((grid) => getComputedStyle(grid).listStyleType)).toBe('none');
    expect(await archive.evaluate((grid) => Number.parseFloat(getComputedStyle(grid).paddingLeft))).toBeLessThanOrEqual(1);

    await page.setViewportSize({ width: 390, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  });

  test('intro measure is explicit and migrated headings are normalized', async ({ page }) => {
    test.skip(test.info().project.name !== 'chromium-1440', 'Intro and migrated-content regression runs once.');

    await page.goto('/results/');
    await expect(page.locator('.page-intro')).toHaveClass(/page-intro--measure-wide/);
    await page.goto('/category/loss-prevention/');
    await expect(page.locator('.page-intro')).toHaveClass(/page-intro--measure-standard/);

    await page.setViewportSize({ width: 768, height: 934 });
    await page.goto('/styleguide/');
    const compactHierarchy = await page.evaluate(() => ({
      h1: Number.parseFloat(getComputedStyle(document.querySelector<HTMLElement>('.page-intro h1')!).fontSize),
      h2: Number.parseFloat(getComputedStyle(document.querySelector<HTMLElement>('.styleguide h2')!).fontSize),
    }));
    expect(compactHierarchy.h1 / compactHierarchy.h2).toBeGreaterThanOrEqual(1.14);

    await page.goto('/about/partners/');
    await expect(page.getByRole('heading', { name: 'Partners', exact: true })).toHaveCount(1);
    await page.goto('/big-data-big-deal/');
    await expect(page.locator('.prose h2').first()).toContainText('Challenge One');
    await expect(page.locator('.prose h3')).toHaveCount(0);
  });

  test('1269px homepage keeps content-driven cards and balanced feature measures', async ({ page }) => {
    test.skip(test.info().project.name !== 'chromium-1106', 'Targeted visual-QA regression runs once.');
    await page.setViewportSize({ width: 1269, height: 934 });
    await page.goto('/');

    const proofImageLocator = page.locator('.fm-proof-layout__visual img');
    await proofImageLocator.scrollIntoViewIfNeeded();
    await expect.poll(() => proofImageLocator.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);

    const layout = await page.evaluate(() => {
      const rect = (selector: string) => document.querySelector<HTMLElement>(selector)!.getBoundingClientRect();
      const style = (selector: string) => getComputedStyle(document.querySelector<HTMLElement>(selector)!);
      const problemCards = [...document.querySelectorAll<HTMLElement>('.problem-card')];
      const serviceCards = [...document.querySelectorAll<HTMLElement>('.service-card')];
      const proofVisual = rect('.fm-proof-layout__visual');
      const proofImage = rect('.fm-proof-layout__visual img');
      const proofPanel = rect('.evidence-panel');
      const technology = style('#technology');
      const philosophy = style('.philosophy');
      const approach = rect('.approach-grid');
      const approachIntro = rect('.approach-grid > div');

      return {
        heroBackground: style('.fm-hero').backgroundColor,
        problemSectionBackground: getComputedStyle(document.querySelector('.fm-problem-grid')!.closest('section')!).backgroundColor,
        problemCardBackground: style('.problem-card').backgroundColor,
        problemCardHeight: Math.max(...problemCards.map((card) => card.getBoundingClientRect().height)),
        ratioBandHeight: rect('.ratio-band').height,
        ratioLabelFont: Number.parseFloat(style('.ratio-band__label').fontSize),
        ratioCopyFont: Number.parseFloat(style('.ratio-band__copy').fontSize),
        ratioQuoteAlignment: style('.ratio-band blockquote').alignItems,
        proofHeightDelta: Math.abs(proofVisual.height - proofImage.height),
        proofPanelBelowImage: proofPanel.bottom - proofImage.bottom,
        servicePaddings: serviceCards.map((card) => Number.parseFloat(getComputedStyle(card).paddingLeft)),
        approachIntroShare: approachIntro.width / approach.width,
        approachFlowPadding: Number.parseFloat(style('.approach-grid > .flow-list').paddingLeft),
        technologyPaddingTop: Number.parseFloat(technology.paddingTop),
        philosophyPaddingTop: Number.parseFloat(philosophy.paddingTop),
        philosophyHeadingWidth: rect('.philosophy h2').width,
        pillFontSize: Number.parseFloat(style('.pill-list li').fontSize),
        ctaHeadingWidth: rect('.cta-band h2').width,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });

    expect(layout.heroBackground).toBe('rgb(255, 255, 255)');
    expect(layout.problemSectionBackground).toBe('rgb(243, 240, 232)');
    expect(layout.problemCardBackground).toBe('rgb(255, 255, 255)');
    expect(layout.problemCardHeight).toBeLessThanOrEqual(360);
    expect(layout.ratioBandHeight).toBeLessThanOrEqual(340);
    expect(layout.ratioLabelFont).toBeGreaterThan(layout.ratioCopyFont);
    expect(layout.ratioQuoteAlignment).toBe('flex-end');
    expect(layout.proofHeightDelta).toBeLessThanOrEqual(1);
    expect(layout.proofPanelBelowImage).toBeGreaterThanOrEqual(100);
    expect(layout.proofPanelBelowImage).toBeLessThanOrEqual(150);
    expect(Math.max(...layout.servicePaddings) - Math.min(...layout.servicePaddings)).toBeLessThanOrEqual(0.1);
    expect(Math.max(...layout.servicePaddings)).toBeLessThanOrEqual(40);
    expect(layout.approachIntroShare).toBeGreaterThanOrEqual(0.59);
    expect(layout.approachIntroShare).toBeLessThanOrEqual(0.61);
    expect(layout.approachFlowPadding).toBe(0);
    expect(layout.technologyPaddingTop).toBeGreaterThan(0);
    expect(layout.philosophyPaddingTop).toBe(0);
    expect(layout.philosophyHeadingWidth).toBeGreaterThanOrEqual(600);
    expect(layout.pillFontSize).toBeGreaterThanOrEqual(15);
    expect(layout.ctaHeadingWidth).toBeGreaterThanOrEqual(800);
    expect(layout.overflow).toBeLessThanOrEqual(1);

    const serviceCard = page.locator('.service-card').last();
    await serviceCard.hover();
    await expect.poll(() => serviceCard.evaluate((card) => getComputedStyle(card).backgroundColor)).toBe('rgb(16, 26, 32)');

    await page.setViewportSize({ width: 768, height: 934 });
    const compactApproach = await page.locator('.approach-grid > *').evaluateAll((items) => items.map((item) => {
      const bounds = item.getBoundingClientRect();
      return { width: bounds.width, top: bounds.top, bottom: bounds.bottom };
    }));
    expect(Math.abs(compactApproach[0].width - compactApproach[1].width)).toBeLessThanOrEqual(1);
    expect(compactApproach[1].top).toBeGreaterThanOrEqual(compactApproach[0].bottom - 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  });

  test('Tina preview keeps replaced sections visible', async ({ page }) => {
    test.skip(test.info().project.name !== 'chromium-1440', 'Editor visibility verification runs once.');
    await page.goto('/');
    // Reproduce the editor's iframe and markup replacement without cloud login.
    await page.setContent('<iframe title="Editor preview" src="/about/"></iframe>');
    const preview = page.frameLocator('iframe');
    await expect(preview.getByRole('heading', { level: 1 })).toContainText('The people');
    await expect(preview.locator('html')).not.toHaveClass(/motion-ready/);
    await preview.locator('.page-intro__copy').evaluate((copy) => {
      const replacement = copy.cloneNode(true) as HTMLElement;
      replacement.classList.remove('is-visible');
      copy.replaceWith(replacement);
    });
    await expect(preview.locator('.page-intro__copy')).toHaveCSS('opacity', '1');
    await expect(preview.locator('.page-intro__copy')).toHaveCSS('transform', 'none');
  });

  test('blog retains real media and removes migration placeholders', async ({ page, request }) => {
    test.skip(test.info().project.name !== 'chromium-1440', 'Blog content audit runs once.');
    await page.goto('/insights/');
    await expect(page.locator('.blog-list article')).toHaveCount(27);
    await expect(page.getByRole('link', { name: 'Read report →', exact: true })).toHaveCount(1);
    await expect(page.getByRole('link', { name: 'Watch video →', exact: true })).toHaveCount(4);
    for (const path of ['/hello-world/', '/testing-slider-123/', '/tscg-team-page/', '/tscg-future-page/', '/tscg-team-communication-page/']) {
      expect((await request.get(path)).status()).toBe(404);
    }
    await page.goto('/improving-loss-prevention-strategies/');
    const report = page.getByRole('link', { name: 'Open report (PDF)' });
    const file = await request.get((await report.getAttribute('href'))!);
    expect(file.status()).toBe(200);
    expect((await file.body()).subarray(0, 5).toString()).toBe('%PDF-');
    await expect(page.locator('.report-resource__preview')).toHaveAttribute('title', 'Deterring Retail Theft with WorkJam and tSCG');
  });

  test('reduced motion leaves content complete and visible', async ({ page }) => {
    test.skip(test.info().project.name !== 'chromium-1440', 'Reduced-motion verification runs once.');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('html')).not.toHaveClass(/motion-ready/);
    await expect(page.locator('[data-reveal]').first()).toBeVisible();
  });

  test('production 404 preserves the global structure without overflow', async ({ page }) => {
    test.skip(test.info().project.name !== 'chromium-1440', '404 verification runs once.');
    const response = await page.goto('/route-that-does-not-exist/');
    expect(response?.status()).toBe(404);
    await expect(page.locator('main h1')).toContainText("That aisle isn't here");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
});

test.describe('contact endpoint safeguards', () => {
  test('rejects cross-origin submissions', async ({ request }) => {
    test.skip(test.info().project.name !== 'chromium-1440', 'Endpoint tests run once.');
    const response = await request.post('/api/contact', { headers: { accept: 'application/json', origin: 'https://malicious.example' }, form: { name: 'Test User', email: 'test@example.com', message: 'A cross-origin test message.' } });
    expect(response.status()).toBe(403);
  });

  test('rejects invalid required fields', async ({ request }) => {
    test.skip(test.info().project.name !== 'chromium-1440', 'Endpoint tests run once.');
    const response = await request.post('/api/contact', { headers: { accept: 'application/json', origin: 'http://127.0.0.1:4321' }, form: { name: '', email: 'bad', message: '' } });
    expect(response.status()).toBe(422);
    await expect(response.json()).resolves.toMatchObject({ ok: false, code: 'invalid' });
  });

  test('silently accepts honeypot submissions', async ({ request }) => {
    test.skip(test.info().project.name !== 'chromium-1440', 'Endpoint tests run once.');
    const response = await request.post('/api/contact', { headers: { accept: 'application/json', origin: 'http://127.0.0.1:4321' }, form: { name: 'Bot', email: 'bot@example.com', message: 'Spam', website: 'https://spam.example' } });
    expect(response.status()).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ ok: true });
  });

  test('requires delivery configuration for a valid submission', async ({ request }) => {
    test.skip(test.info().project.name !== 'chromium-1440', 'Endpoint tests run once.');
    const response = await request.post('/api/contact', { headers: { accept: 'application/json', origin: 'http://127.0.0.1:4321' }, form: { name: 'Test User', email: 'test@example.com', message: 'A legitimate test message.' } });
    expect(response.status()).toBe(503);
    await expect(response.json()).resolves.toMatchObject({ ok: false, code: 'unavailable' });
  });
});
