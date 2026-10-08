import {test,expect,type Page} from '@playwright/test';
import fs from 'node:fs';
import {parse} from 'yaml';
async function openEditor(page:Page,path:string){
 // CMS controls are local; external images/video players are covered by public-page checks.
 await page.route('https://**/*',route=>route.abort());
 await page.goto('/admin/index.html#/~/'+path.replace(/^\//,''));
 await page.getByRole('button',{name:'Enter Edit Mode',exact:true}).click();
 await expect(page.locator('#tina-iframe')).toBeVisible();
 await expect(page.frameLocator('#tina-iframe').locator('main')).toBeVisible();
 await page.waitForLoadState('networkidle');
}
async function quickEdit(page:Page){
 await page.evaluate(()=>{const frame=document.querySelector<HTMLIFrameElement>('#tina-iframe');frame?.contentWindow?.postMessage({type:'quickEditEnabled',value:true},location.origin);});
 await expect(page.frameLocator('#tina-iframe').locator('body')).toHaveClass(/__tina-quick-editing-enabled/);
}
test('service cards select their record and live edits update shared navigation',async({page})=>{
 await openEditor(page,'services/');
 const frame=page.frameLocator('#tina-iframe');
 const card=frame.locator('.service-card').first().locator('h2');
 await expect(card).toHaveAttribute('data-tina-field',/serviceConnection.*title/);
 await page.waitForLoadState('networkidle');
 await quickEdit(page);
 await card.click();
 await expect(page.getByText('Closing heading',{exact:true})).toBeVisible();
 const title=page.locator('input[name="title"]');
 const file='src/content/services/shrink-profit-recovery.yaml';
 const original=fs.readFileSync(file,'utf8');
 const originalData=parse(original);
 const changed='Editing verification title';
 try {
  await title.fill(changed);
  await expect(card).toHaveText(changed);
  await expect(frame.locator('footer a[href="/services/shrink-profit-recovery/"]')).toHaveText(changed);
  expect(parse(fs.readFileSync(file,'utf8')).title).toBe(originalData.title);
  await page.getByRole('button',{name:'Save',exact:true}).click();
  await expect.poll(()=>parse(fs.readFileSync(file,'utf8')).title).toBe(changed);
  await expect(page.getByRole('button',{name:'Save',exact:true})).toBeDisabled();
  await title.fill(originalData.title);
  await page.getByRole('button',{name:'Save',exact:true}).click();
  await expect.poll(()=>parse(fs.readFileSync(file,'utf8')).title).toBe(originalData.title);
  await expect(page.getByRole('button',{name:'Save',exact:true})).toBeDisabled();
 } finally {
  const current=parse(fs.readFileSync(file,'utf8'));
  // Restore only our title edit/serialization; never overwrite unrelated changes.
  expect({...current,title:originalData.title}).toEqual(originalData);
  // An in-place write can let Tina's watcher index an empty/truncated YAML file.
  // Rename a complete temporary file so subsequent previews see a full record.
  if(fs.readFileSync(file,'utf8')!==original){
   const temporary=file+'.restore-tmp';
   fs.writeFileSync(temporary,original);
   fs.renameSync(temporary,file);
  }
 }

});

const surfaces:[string,string,string][]=[
 ['', '.service-card h3', 'serviceConnection.*title'],
 ['services/','.service-card h2','serviceConnection.*title'],
 ...['shrink-profit-recovery','fresh-inventory-operations','workforce-store-execution','technology-adoption-change-management'].map(slug=>['services/'+slug+'/', '.cta-band h2', 'service.ctaTitle'] as [string,string,string]),
 ['about/','.person-card__role','personConnection.*role'],
 ['approach/','.workstream-grid h3','approachPage.lighthouse.*title'],
 ['results/','.path-card h3','resultsPage.resultGroups.*title'],
 ['clients/','.client-logo-card span','clientsPage.logos.*name'],
 ['insights/','.blog-list h2 a','postConnection.*title'],
 ['big-data-big-deal/','.blog-meta time','post.publishedDate'],
 ['improving-loss-prevention-strategies/','.report-resource h2','post.resource.title'],
 ['video-series-rich-van-patten-labor-part-2/','.prose > div[data-tina-field]','post.body'],
 ['project/whole-foods/','.project-logo','clientProfile.logo'],
 ['author/scott/','main h1','author.name'],
 ['category/loss-prevention/','main h1','category.name'],
 ['case-studies/','.legacy-case-grid h2','legacyPage.directoryEntries.*title'],
 ['contact-us/','label[for="email"]','contactPage.form.email'],
];
for(const [path,selector,field] of surfaces)test('correct editing owner: /'+path,async({page})=>{
 await openEditor(page,path);
 const frame=page.frameLocator('#tina-iframe');
 await expect(frame.locator(selector).first()).toHaveAttribute('data-tina-field',new RegExp(field+'$'));
 await expect(frame.locator('footer .site-footer__legal span').first()).toHaveAttribute('data-tina-field',/globalSettings.footer.organization$/);
});
test('service CTA selects the override and reset leaves shared defaults intact',async({page})=>{
 await openEditor(page,'services/shrink-profit-recovery/');await quickEdit(page);
 const frame=page.frameLocator('#tina-iframe');
 await frame.locator('.cta-band h2').click();
 const title=page.locator('input[name="ctaTitle"]');
 const original=await title.inputValue();
 await title.fill('Unsaved closing title');
 await expect(frame.locator('.cta-band h2')).toHaveText('Unsaved closing title');
 await page.getByRole('button',{name:'Reset',exact:true}).click();
 // Tina may present a reset confirmation modal; confirm the explicit reset.
 await page.locator('#modal-root').getByRole('button',{name:'Reset',exact:true}).click();
 await expect(frame.locator('.cta-band h2')).toHaveText(original);
});
test('contact preview exposes feedback text and never submits an inquiry',async({page})=>{
 let sends=0;await page.route('**/api/contact',route=>{sends++;return route.abort();});
 await openEditor(page,'contact-us/');
 const frame=page.frameLocator('#tina-iframe');
 await frame.locator('#name').fill('Local verification');await frame.locator('#email').fill('test@example.com');await frame.locator('#message').fill('Do not send');
 await frame.getByRole('button',{name:'Send Message',exact:true}).click();
 expect(sends).toBe(0);
 await quickEdit(page);
 await expect(frame.locator('[data-editor-controls]')).toBeVisible();
 await expect(frame.locator('[data-tina-field$="form.rateLimited"]')).toContainText('Too many attempts');
});
test('article blocks expose structured editing controls',async({page})=>{
 await openEditor(page,'big-data-big-deal/');await quickEdit(page);
 await page.frameLocator('#tina-iframe').getByRole('button',{name:'Edit article blocks',exact:true}).click();
 await page.locator('[data-test="add-item-contentBlocks"]').click();
 await page.getByText('Text',{exact:true}).click();
 await page.getByText('Text',{exact:true}).click();
 await page.locator('textarea[name="contentBlocks.0.text"]').fill('## Unsaved structured block');
 const frame=page.frameLocator('#tina-iframe');
 await expect(frame.getByRole('heading',{name:'Unsaved structured block',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Reset',exact:true}).click();
 await page.locator('#modal-root').getByRole('button',{name:'Reset',exact:true}).click();
 await expect(frame.getByRole('heading',{name:'Unsaved structured block',exact:true})).toHaveCount(0);

});

test('business profile fields are available from the shared settings record',async({page})=>{
 await openEditor(page,'services/');await quickEdit(page);
 await page.frameLocator('#tina-iframe').locator('footer .site-footer__group h2').first().click();
 await page.getByRole('button',{name:'Back to Site settings',exact:true}).click();
 await page.getByText('Business profile (structured data)',{exact:true}).click();
 const description=page.locator('textarea[name="business.description"]');
 await expect(description).toBeVisible();
 await expect(description).not.toHaveValue('');
 await description.fill('Unsaved business description');
 await page.getByRole('button',{name:'Reset',exact:true}).click();
 await page.locator('#modal-root').getByRole('button',{name:'Reset',exact:true}).click();
 await expect(description).not.toHaveValue('Unsaved business description');
});
test('service sharing override fields can be edited and reset',async({page})=>{
 await openEditor(page,'services/');await quickEdit(page);
 await page.frameLocator('#tina-iframe').locator('.service-card h2').first().click();
 await page.getByText('Social sharing',{exact:true}).click();
 const alt=page.locator('input[name="seo.alt"]');
 await expect(alt).toBeVisible();await alt.fill('Unsaved sharing description');
 await page.getByRole('button',{name:'Reset',exact:true}).click();
 await page.locator('#modal-root').getByRole('button',{name:'Reset',exact:true}).click();
 await expect(alt).not.toHaveValue('Unsaved sharing description');
});
