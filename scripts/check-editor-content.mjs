import { readdir, readFile, access } from 'node:fs/promises';
import { parse } from 'yaml';

const groups = ['posts','clients','people','authors','categories','legacy-pages'];
const documents = {};
for (const group of groups) {
 documents[group] = await Promise.all((await readdir(`src/content/${group}`)).filter(f=>/\.(md|yaml)$/.test(f)).map(async file=>{
  const raw=await readFile(`src/content/${group}/${file}`,'utf8');
  return {file,body:file.endsWith('.md')?raw.split(/^---\s*$/m).slice(2).join('---').trim():'',data:parse(file.endsWith('.md')?raw.split(/^---\s*$/m)[1]:raw)};
 }));
}
const errors=[];
// Check image references in all structured content, including legacy assets
// hosted on the stable Vercel alias to avoid Tina media-root rewriting.
async function checkImages(value, file) {
 if (!value || typeof value !== 'object') return;
 for (const [key,item] of Object.entries(value)) {
  if (['src','image','featuredMedia','logo','avatar'].includes(key) && typeof item === 'string') {
   let path = item;
   if (path.startsWith('https://stores-consulting-site-dusky.vercel.app/')) path = new URL(path).pathname;
   if (path.startsWith('/')) {try{await access('public'+decodeURIComponent(path));}catch{errors.push(`${file}: missing image ${path}`);}}
  } else if (item && typeof item === 'object') await checkImages(item,file);
 }
}
for (const group of [...groups,'site-pages','services','marketing','settings']) {
 for (const file of await readdir(`src/content/${group}`)) {
  if (!/\.(md|yaml)$/.test(file)) continue;
  const raw=await readFile(`src/content/${group}/${file}`,'utf8');
  await checkImages(parse(file.endsWith('.md')?raw.split(/^---\s*$/m)[1]:raw),file);
 }
}

const servicePaths = new Set((await readdir('src/content/services')).filter(f=>f.endsWith('.yaml')).map(f=>'/services/'+f.replace('.yaml','')+'/'));
for (const {file,data} of documents.clients) {
 const c=data.caseStudy;
 if(c?.published && (!c.challenge?.trim()||!c.work?.trim()||!c.results?.trim()||!c.services?.length)) errors.push(`${file}: published case study requires challenge, work, results and services`);
 for(const path of c?.services||[]) if(!servicePaths.has(path))errors.push(`${file}: unknown case-study service ${path}`);
}
for (const {file,data} of documents.posts) for(const path of data.relatedServices||[]) if(!servicePaths.has(path))errors.push(`${file}: unknown related service ${path}`);
const publicContent = new Set([...documents.posts.filter(x=>!x.data.draft),...documents.clients].map(x=>x.data.route));
for(const file of await readdir('src/content/services')) {
 if(!file.endsWith('.yaml'))continue;
 const data=parse(await readFile('src/content/services/'+file,'utf8'));
 for(const path of data.relatedContent||[]) if(!publicContent.has(path))errors.push(`${file}: related content is missing or a draft: ${path}`);
}
const routes=new Map();
const explicit=new Set(['/','/about/','/approach/','/results/','/clients/','/services/','/contact-us/','/tscg-blog/','/styleguide/','/404/','/admin/','/feed/','/robots.txt','/api/contact']);
for(const file of await readdir('src/content/services')) { const data = parse(await readFile('src/content/services/'+file,'utf8')); explicit.add(`/services/${data.slug}/`); }
for(const group of ['posts','clients','authors','categories','legacy-pages'])for(const {file,data} of documents[group]) {
 if(group==='legacy-pages'&&explicit.has(data.route))continue;
 if(group==='posts'&&data.draft)continue;
 if(routes.has(data.route)) errors.push(`Duplicate public route ${data.route}: ${routes.get(data.route)} and ${file}`);
 if(group!=='legacy-pages'&&explicit.has(data.route))errors.push(`${file} overwrites a primary page`);
 routes.set(data.route,file);
}
const authors=new Set(documents.authors.map(d=>d.data.slug));
const categories=new Set(documents.categories.map(d=>d.data.slug));
for(const {file,data,body} of documents.posts){
 if(!data.draft && ((!body && !data.contentBlocks?.length) || /No additional narrative content|Welcome to WordPress|^## Password Protected/.test(body)))errors.push(`${file}: published post has no usable content`);
 if(data.contentType==='report' && !data.resource?.url)errors.push(`${file}: report posts require a PDF resource`);
 if(data.resource?.url){
  const url=new URL(data.resource.url,'https://storesconsulting.com');
  if(url.protocol!=='https:' || !url.pathname.toLowerCase().endsWith('.pdf'))errors.push(`${file}: report URL must point to a PDF over HTTPS or a local path`);
  if(data.resource.url.startsWith('/')){try{await access('public'+decodeURIComponent(url.pathname));}catch{errors.push(`${file}: PDF file is missing`);}}
 }

 if(!authors.has(data.author))errors.push(`${file}: unknown author ${data.author}`);
 for(const category of data.categories||[])if(!categories.has(category))errors.push(`${file}: unknown category ${category}`);
 if(data.featuredMedia?.startsWith('/assets/editorial/')&&(!data.featuredAlt||!data.featuredWidth||!data.featuredHeight))errors.push(`${file}: new featured images require alternative text, width and height`);
}
for(const {file,data} of documents.clients)if(data.logo?.startsWith('/assets/editorial/')&&(!data.logoWidth||!data.logoHeight))errors.push(`${file}: new logos require width and height`);
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`Validated editorial routes, taxonomy references and managed-image metadata (${routes.size} public records).`);
