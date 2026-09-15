import {businessFields,sharingFields} from './seo-fields';
import {contentBlocks} from './content-blocks';
import {sharedLabelFields} from './shared-labels';
import editorOptions from './editor-options.json';
import type { Collection, TinaField } from 'tinacms';

export const marketingCollections: Collection[] = [
  {
    "name": "aboutPage",
    "label": "About page",
    "path": "src/content/marketing",
    "format": "yaml",
    "match": {
      "include": "about"
    },
    "yamlMaxLineWidth": -1,
    "ui": {
      "allowedActions": {
        "create": false,
        "delete": false
      },
      "filename": {
        "readonly": true
      }
    },
    "fields": [
      {
        "name": "copy",
        "label": "Page copy",
        "type": "object",
        "required": true,
        "fields": [
          {
            "name": "title1",
            "label": "Search title",
            "type": "string",
            "required": true
          },
          {
            "name": "description2",
            "label": "Search description",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          },
          {
            "name": "title3",
            "label": "Page heading",
            "type": "string",
            "required": true
          },
          {
            "name": "description4",
            "label": "Page introduction",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          },
          {
            "name": "title5",
            "label": "Closing heading",
            "type": "string",
            "required": true
          },
          {
            "name": "description6",
            "label": "Closing description",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          }
        ]
      },
      {
        "name": "groups",
        "label": "Groups",
        "type": "object",
        "required": true,
        "list": true,
        "fields": [
          {
            "name": "tier",
            "label": "Tier",
            "type": "string",
            "required": true,
            "ui": {
              "component": null
            }
          },
          {
            "name": "title",
            "label": "Title",
            "type": "string",
            "required": true
          }
        ]
      }
    ]
  },
  {
    "name": "approachPage",
    "label": "Approach page",
    "path": "src/content/marketing",
    "format": "yaml",
    "match": {
      "include": "approach"
    },
    "yamlMaxLineWidth": -1,
    "ui": {
      "allowedActions": {
        "create": false,
        "delete": false
      },
      "filename": {
        "readonly": true
      }
    },
    "fields": [
      {
        "name": "copy",
        "label": "Page copy",
        "type": "object",
        "required": true,
        "fields": [
          {
            "name": "title1",
            "label": "Search title",
            "type": "string",
            "required": true
          },
          {
            "name": "description2",
            "label": "Search description",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          },
          {
            "name": "title3",
            "label": "Page heading",
            "type": "string",
            "required": true
          },
          {
            "name": "description4",
            "label": "Page introduction",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          },
          {
            "name": "title5",
            "label": "Closing heading",
            "type": "string",
            "required": true
          },
          {
            "name": "description6",
            "label": "Closing description",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          },
          {
            "name": "text7",
            "label": "Diagnostic card label",
            "type": "string",
            "required": true
          },
          {
            "name": "text8",
            "label": "Diagnostic card heading",
            "type": "string",
            "required": true
          },
          {
            "name": "text9",
            "label": "Diagnostic card description",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          },
          {
            "name": "text10",
            "label": "Foundations card label",
            "type": "string",
            "required": true
          },
          {
            "name": "text11",
            "label": "Foundations card heading",
            "type": "string",
            "required": true
          },
          {
            "name": "text12",
            "label": "Foundations card description",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          },
          {
            "name": "text13",
            "label": "Diagnostic section label",
            "type": "string",
            "required": true
          },
          {
            "name": "text14",
            "label": "Diagnostic section heading",
            "type": "string",
            "required": true
          },
          {
            "name": "text15",
            "label": "Diagnostic introduction",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          },
          {
            "name": "text16",
            "label": "Diagnostic detail",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          },
          {
            "name": "text17",
            "label": "Principles section label",
            "type": "string",
            "required": true
          },
          {
            "name": "text18",
            "label": "Principles section heading",
            "type": "string",
            "required": true
          },
          {
            "name": "text19",
            "label": "Principle 1 heading",
            "type": "string",
            "required": true
          },
          {
            "name": "text20",
            "label": "Principle 1 description",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          },
          {
            "name": "text21",
            "label": "Principle 2 heading",
            "type": "string",
            "required": true
          },
          {
            "name": "text22",
            "label": "Principle 2 description",
            "type": "string",
            "required": true
          },
          {
            "name": "text23",
            "label": "Principle 3 heading",
            "type": "string",
            "required": true
          },
          {
            "name": "text24",
            "label": "Principle 3 description",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          },
          {
            "name": "text25",
            "label": "Principle 4 heading",
            "type": "string",
            "required": true
          },
          {
            "name": "text26",
            "label": "Principle 4 description",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          },
          {
            "name": "text27",
            "label": "Foundations section label",
            "type": "string",
            "required": true
          },
          {
            "name": "text28",
            "label": "Foundations section heading",
            "type": "string",
            "required": true
          },
          {
            "name": "text29",
            "label": "Foundations introduction",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          },
          {
            "name": "text30",
            "label": "Foundations detail",
            "type": "string",
            "required": true
          }
        ]
      },
      {
        "name": "lighthouse",
        "label": "Lighthouse",
        "type": "object",
        "required": true,
        "list": true,
        "fields": [
          {
            "name": "title",
            "label": "Title",
            "type": "string",
            "required": true
          },
          {
            "name": "description",
            "label": "Description",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          }
        ]
      },
      {
        "name": "foundations",
        "label": "Foundations",
        "type": "object",
        "required": true,
        "list": true,
        "fields": [
          {
            "name": "title",
            "label": "Title",
            "type": "string",
            "required": true
          },
          {
            "name": "description",
            "label": "Description",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          }
        ]
      }
    ]
  },
  {
    "name": "resultsPage",
    "label": "Results page",
    "path": "src/content/marketing",
    "format": "yaml",
    "match": {
      "include": "results"
    },
    "yamlMaxLineWidth": -1,
    "ui": {
      "allowedActions": {
        "create": false,
        "delete": false
      },
      "filename": {
        "readonly": true
      }
    },
    "fields": [
      {
        "name": "copy",
        "label": "Page copy",
        "type": "object",
        "required": true,
        "fields": [
          {
            "name": "title1",
            "label": "Search title",
            "type": "string",
            "required": true
          },
          {
            "name": "description2",
            "label": "Search description",
            "type": "string",
            "required": true
          },
          {
            "name": "eyebrow3",
            "label": "Proof, Not Promises",
            "type": "string",
            "required": true
          },
          {
            "name": "title4",
            "label": "We measure results the way your finance team would.",
            "type": "string",
            "required": true
          },
          {
            "name": "description5",
            "label": "Every range on this page reflects what's actually been del",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          },
          {
            "name": "title6",
            "label": "Closing heading",
            "type": "string",
            "required": true
          },
          {
            "name": "description7",
            "label": "Closing description",
            "type": "string",
            "required": true
          },
          {
            "name": "text8",
            "label": "Results section label",
            "type": "string",
            "required": true
          },
          {
            "name": "text9",
            "label": "Results section heading",
            "type": "string",
            "required": true
          },
          {
            "name": "text10",
            "label": "Results section introduction",
            "type": "string",
            "required": true
          },
          {
            "name": "text11",
            "label": "Principles section label",
            "type": "string",
            "required": true
          },
          {
            "name": "text12",
            "label": "First principle heading",
            "type": "string",
            "required": true
          },
          {
            "name": "text13",
            "label": "First principle description",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          },
          {
            "name": "text14",
            "label": "Second principle heading",
            "type": "string",
            "required": true
          },
          {
            "name": "text15",
            "label": "Second principle description",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          }
        ]
      },
      {
        "name": "resultGroups",
        "label": "Result Groups",
        "type": "object",
        "required": true,
        "list": true,
        "fields": [
          {
            "name": "title",
            "label": "Title",
            "type": "string",
            "required": true
          },
          {
            "name": "items",
            "label": "Items",
            "type": "string",
            "required": true,
            "list": true
          }
        ]
      }
    ]
  },
  {
    "name": "clientsPage",
    "label": "Clients page",
    "path": "src/content/marketing",
    "format": "yaml",
    "match": {
      "include": "clients"
    },
    "yamlMaxLineWidth": -1,
    "ui": {
      "allowedActions": {
        "create": false,
        "delete": false
      },
      "filename": {
        "readonly": true
      }
    },
    "fields": [
      {
        "name": "copy",
        "label": "Page copy",
        "type": "object",
        "required": true,
        "fields": [
          {
            "name": "title1",
            "label": "Search title",
            "type": "string",
            "required": true
          },
          {
            "name": "description2",
            "label": "Search description",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          },
          {
            "name": "title3",
            "label": "Page heading",
            "type": "string",
            "required": true
          },
          {
            "name": "description4",
            "label": "Page introduction",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          },
          {
            "name": "title5",
            "label": "Closing heading",
            "type": "string",
            "required": true
          },
          {
            "name": "description6",
            "label": "Closing description",
            "type": "string",
            "required": true
          },
          {
            "name": "text7",
            "label": "Client logo note",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          },
          {
            "name": "text8",
            "label": "Client profiles section label",
            "type": "string",
            "required": true
          },
          {
            "name": "text9",
            "label": "Client profiles heading",
            "type": "string",
            "required": true
          },
          {
            "name": "text10",
            "label": "Client profiles introduction",
            "type": "string",
            "required": true
          }
        ]
      },
      {
        "name": "logos",
        "label": "Logos",
        "type": "object",
        "required": true,
        "list": true,
        "fields": [
          {
            "name": "name",
            "label": "Name",
            "type": "string",
            "required": true
          },
          {
            "name": "href",
            "label": "Button destination",
            "type": "string",
            "required": true
          },
          {
            "name": "image",
            "label": "Image",
            "type": "object",
            "required": true,
            "fields": [
              {
                "name": "src",
                "label": "Src",
                "type": "image",
                "required": true
              },
              {
                "name": "alt",
                "label": "Alt",
                "type": "string",
                "required": true
              },
              {
                "name": "width",
                "label": "Width",
                "type": "number",
                "required": true
              },
              {
                "name": "height",
                "label": "Height",
                "type": "number",
                "required": true
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "name": "blogPage",
    "label": "Blog index",
    "path": "src/content/marketing",
    "format": "yaml",
    "match": {
      "include": "blog"
    },
    "yamlMaxLineWidth": -1,
    "ui": {
      "allowedActions": {
        "create": false,
        "delete": false
      },
      "filename": {
        "readonly": true
      }
    },
    "fields": [
      {
        "name": "copy",
        "label": "Page copy",
        "type": "object",
        "required": true,
        "fields": [
          {
            "name": "title1",
            "label": "Search title",
            "type": "string",
            "required": true
          },
          {
            "name": "description2",
            "label": "Search description",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          },
          {
            "name": "title3",
            "label": "Page heading",
            "type": "string",
            "required": true
          },
          {
            "name": "description4",
            "label": "Page introduction",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          }
        ]
      }
    ]
  }
];

marketingCollections.forEach((collection) => { const name = collection.name.replace(/Page$/, ''); collection.ui!.router = () => '/' + (name === 'blog' ? 'tscg-blog' : name) + '/'; });

const hidden = (name: string, type: 'string' | 'number' = 'string'): TinaField => (type === 'number' ? {name,type:'number',searchable:false,ui:{component:null}} : {name,type:'string',searchable:false,ui:{component:null}});
const text = (name: string, label: string, required = true) => ({name, label, type: 'string' as const, required, ui:{validate:(value:unknown)=>required&&!String(value||'').trim()?`${label} is required.`:undefined}});
const body: TinaField = {name: 'body', label: 'Body (Markdown)', type: 'string', isBody: true, ui: {component: 'textarea'}, description: 'Edit text and Markdown links. Preserve existing image and video markup; use the image fields for new featured images.'};
const slugify = (value: unknown) => String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const existing = {allowedActions: {create: false, delete: false}, filename: {readonly: true}};
const newRecord = (kind: 'post' | 'client' | 'person'): NonNullable<Collection['ui']> => ({
 allowedActions: {create: true, delete: false},
 filename: {readonly: true, slugify: (values) => slugify(values.title || values.name)},
 beforeSubmit: async ({values: rawValues, form}) => {
   const values = rawValues as Record<string, any>;
   // Existing routes always win; derive new routes once from the generated filename.
   const filename = String(form.relativePath || '').split('/').pop()?.replace(/\.md$/, '');
   const slug = values.slug || filename || slugify(values.title || values.name);
   if (!slug) throw new Error('A title or name is required.');
   if (kind === 'post' && !values.draft) {
     if (!String(values.body || '').trim() && !values.contentBlocks?.length) throw new Error('Add post content before publishing, or leave Draft enabled.');
     if (!values.categories?.length) throw new Error('Choose at least one category.');
     if (values.contentType === 'report' && (!values.resource?.title || !/^(https:\/\/|\/).*\.pdf(?:[?#].*)?$/i.test(values.resource?.url || ''))) throw new Error('Add a report title and valid PDF URL before publishing.');
   }
   if (kind === 'client' && values.caseStudy?.published && (!values.caseStudy.challenge?.trim() || !values.caseStudy.work?.trim() || !values.caseStudy.results?.trim() || !values.caseStudy.services?.length)) throw new Error('Complete the challenge, work, approved results, and related service before publishing the case study.');
   if (kind === 'person') return {...values, order: values.order || Date.now()};
   return {...values, slug, route: values.route || (kind === 'post' ? `/${slug}/` : `/project/${slug}/`), updatedDate: new Date().toISOString(), ...(kind === 'post' ? {canonicalUrl: values.canonicalUrl || `https://storesconsulting.com/${slug}/`} : {})};
 },
});
export const editorialCollections: Collection[] = [
 {name:'person',label:'People & bios',path:'src/content/people',format:'md',ui:{...newRecord('person'),router:()=>'/about/'},defaultItem:{tier:'senior-consultant',order:999,image:null,alt:''},fields:[
 {...text('name','Name'),isTitle:true},text('role','Role'),{name:'tier',label:'Team group',type:'string',required:true,options:['leadership','director','managing-consultant','senior-consultant']},hidden('order','number'),{name:'image',type:'image',label:'Portrait'},text('alt','Portrait alternative text',false),{...text('linkedin','LinkedIn URL',false),ui:{validate:(value:unknown)=>value&&!/^https:\/\/(www\.)?linkedin\.com\//.test(String(value))?'Enter a full linkedin.com profile URL.':undefined}},body,
 ]},
 {name:'post',label:'Blog posts',path:'src/content/posts',format:'md',ui:{...newRecord('post'),router:({document}:any)=>(document.draft || (editorOptions.drafts as string[]).includes(document._sys.filename)) ? undefined : document.route || (editorOptions.routes.post as Record<string,string>)[document._sys.filename] || `/${document._sys.filename}/`},defaultItem:()=>({draft:true,contentType:'article',author:'admin',categories:['uncategorized'],publishedDate:new Date().toISOString(),updatedDate:new Date().toISOString()}),fields:[
 {...text('title','Title'),isTitle:true},hidden('slug'),hidden('route'),{...text('excerpt','Excerpt'),ui:{component:'textarea'}},{name:'publishedDate',type:'datetime',label:'Published date',required:true},{name:'updatedDate',type:'datetime',ui:{component:null}},{...text('author','Author'),options:editorOptions.authors},{name:'categories',label:'Categories',type:'string',list:true,required:true,options:editorOptions.categories},{name:'featuredMedia',type:'image',label:'Featured image'},text('featuredAlt','Featured image alternative text',false),{name:'featuredWidth',label:'Image width',type:'number'},{name:'featuredHeight',label:'Image height',type:'number'},hidden('canonicalUrl'),{name:'draft',label:'Draft (not public)',description:'Leave on while preparing a post. Turn off and Save to publish after the build succeeds.',type:'boolean',required:true},hidden('sourceId','number'),
 {name:'contentType',label:'Post format',type:'string',options:[{value:'article',label:'Written article'},{value:'video',label:'Video'},{value:'report',label:'PDF report'}]},
 {name:'relatedServices',label:'Related services',type:'string',list:true,options:editorOptions.services,description:'Choose the services readers should explore next.'},
 {name:'resource',label:'PDF report',type:'object',description:'For report posts, provide the PDF file URL and its display title.',fields:[text('title','Report title'),text('url','PDF file URL')]},body,contentBlocks,
 ]},
 {name:'clientProfile',label:'Client profiles',path:'src/content/clients',format:'md',ui:{...newRecord('client'),router:({document}:any)=>document.route || (editorOptions.routes.clientProfile as Record<string,string>)[document._sys.filename] || `/project/${document._sys.filename}/`},defaultItem:()=>({category:'clients',tier:'unspecified',updatedDate:new Date().toISOString()}),fields:[
 {...text('name','Name'),isTitle:true},hidden('slug'),hidden('route'),hidden('category'),{name:'tier',label:'Tier',type:'string',options:['national','regional','unspecified'],required:true},{name:'logo',type:'image',label:'Logo'},{name:'logoWidth',label:'Logo width',type:'number'},{name:'logoHeight',label:'Logo height',type:'number'},hidden('legacyUrl'),{name:'updatedDate',type:'datetime',ui:{component:null}},hidden('sourceId','number'),
 {name:'caseStudy',label:'Case study',type:'object',description:'Prepare approved engagement details here. Existing profile content stays visible until you publish this case study.',fields:[
 {name:'published',label:'Publish approved case study',type:'boolean',description:'Enable only after the client name and results are approved for public use.'},
 {...text('challenge','The challenge',false),ui:{component:'textarea'}},{...text('work','What we did',false),ui:{component:'textarea'}},{...text('results','Approved results',false),ui:{component:'textarea'}},
 {name:'services',label:'Related services',type:'string',list:true,options:editorOptions.services}
 ]},body,
 ]},
 {name:'legacyPage',label:'Additional pages',match:{exclude:'{11-about,13-contact-us,159-services,26774-homepage-1,27300-clients,28431-tscg-blog}'},path:'src/content/legacy-pages',format:'md',ui:{...existing,router:({document}:any)=>document.route || (editorOptions.routes.legacyPage as Record<string,string>)[document._sys.filename]},fields:[
 {...text('title','Title'),isTitle:true},hidden('slug'),hidden('route'),{...text('description','Description'),ui:{component:'textarea'}},hidden('originalUrl'),{name:'updatedDate',type:'datetime',ui:{component:null}},hidden('sourceId','number'),hidden('overlapStrategy'),{name:'directoryEntries',label:'Directory cards',description:'Structured cards for the case-studies directory.',type:'object',list:true,ui:{itemProps:(item)=>({label:item?.title||'Directory card'})},fields:[text('title','Card title'),text('date','Display date'),{...text('url','Profile URL'),ui:{validate:(value:unknown)=>typeof value==='string'&&/^\/(?!\/)/.test(value)?undefined:'Use an existing site path beginning with /.'}},{name:'image',type:'image',label:'Card image'},text('alt','Image alternative text'),{name:'width',type:'number',label:'Image width'},{name:'height',type:'number',label:'Image height'}]},body,
 ]},
 {name:'category',label:'Blog categories',path:'src/content/categories',format:'yaml',ui:{...existing,router:({document}:any)=>document.route || (editorOptions.routes.category as Record<string,string>)[document._sys.filename]},fields:[{...text('name','Name'),isTitle:true},hidden('slug'),hidden('route'),{...text('description','Description',false),ui:{component:'textarea'}},hidden('count','number'),hidden('sourceId','number')]},
 {name:'author',label:'Blog authors',path:'src/content/authors',format:'yaml',ui:{...existing,router:({document}:any)=>document.route || (editorOptions.routes.author as Record<string,string>)[document._sys.filename]},fields:[{...text('name','Name'),isTitle:true},hidden('slug'),hidden('route'),{...text('description','Description',false),ui:{component:'textarea'}},{name:'avatar',label:'Avatar',type:'image'},hidden('sourceId','number')]},
];

export const globalCollection: Collection = {
  "name": "globalSettings",
  "label": "Site settings",
  "path": "src/content/settings",
  "format": "yaml",
  "match": {
    "include": "global"
  },
  "yamlMaxLineWidth": -1,
  "ui": {
    "allowedActions": {
      "create": false,
      "delete": false
    },
    "filename": {
      "readonly": true
    }
  },
  "fields": [
    {name:"business",label:"Business profile (structured data)",type:"object",required:true,fields:businessFields},
    {name:"sharing",label:"Default social sharing",type:"object",fields:sharingFields},
    {name:"labels", label:"Shared display labels", type:"object", required:true, fields:sharedLabelFields},
    {
      "name": "navigation",
      "label": "Navigation",
      "type": "object",
      "required": true,
      "fields": [
        {
          "name": "services",
          "label": "Services",
          "type": "string",
          "required": true
        },
        {
          "name": "servicesOverview",
          "label": "Services Overview",
          "type": "string",
          "required": true
        },
        {
          "name": "shrink",
          "label": "Shrink",
          "type": "string",
          "required": false, "description": "Optional short navigation label. Leave blank to use the service title everywhere."
        },
        {
          "name": "fresh",
          "label": "Fresh",
          "type": "string",
          "required": false, "description": "Optional short navigation label. Leave blank to use the service title everywhere."
        },
        {
          "name": "workforce",
          "label": "Workforce",
          "type": "string",
          "required": false, "description": "Optional short navigation label. Leave blank to use the service title everywhere."
        },
        {
          "name": "technology",
          "label": "Technology",
          "type": "string",
          "required": false, "description": "Optional short navigation label. Leave blank to use the service title everywhere."
        },
        {
          "name": "approach",
          "label": "Approach",
          "type": "string",
          "required": true
        },
        {
          "name": "results",
          "label": "Results",
          "type": "string",
          "required": true
        },
        {
          "name": "about",
          "label": "About",
          "type": "string",
          "required": true
        },
        {
          "name": "clients",
          "label": "Clients",
          "type": "string",
          "required": true
        },
        {
          "name": "blog",
          "label": "Blog",
          "type": "string",
          "required": true
        },
        {
          "name": "contact",
          "label": "Contact",
          "type": "string",
          "required": true
        },
        {
          "name": "contactAction",
          "label": "Contact Action",
          "type": "string",
          "required": true
        },
        {
          "name": "menu",
          "label": "Menu",
          "type": "string",
          "required": true
        }
      ]
    },
    {
      "name": "footer",
      "label": "Footer",
      "type": "object",
      "required": true,
      "fields": [
        {
          "name": "services",
          "label": "Services",
          "type": "string",
          "required": true
        },
        {
          "name": "company",
          "label": "Company",
          "type": "string",
          "required": true
        },
        {
          "name": "explore",
          "label": "Explore",
          "type": "string",
          "required": true
        },
        {
          "name": "organization",
          "label": "Organization",
          "type": "string",
          "required": true
        },
        {
          "name": "location",
          "label": "Location",
          "type": "string",
          "required": true
        }
      ]
    },
    {
      "name": "cta",
      "label": "Default closing call to action",
      "type": "object",
      "required": true,
      "fields": [
        {
          "name": "title",
          "label": "Title",
          "type": "string",
          "required": true
        },
        {
          "name": "description",
          "label": "Description",
          "type": "string",
          "required": true
        },
        {
          "name": "href",
          "label": "Button destination",
          "type": "string",
          "required": true
        },
        {
          "name": "label",
          "label": "Label",
          "type": "string",
          "required": true
        }
      ]
    }
  ]
};

function improveListLabels(fields: TinaField[]) {
 for (const field of fields) {
  if (field.type !== 'object' || !field.fields) continue;
  if (field.list) field.ui = {...field.ui, itemProps:(item)=>({label:item?.name || item?.title || 'Item'})};
  if (field.name === 'groups') field.ui = {...field.ui, validate:(value: unknown)=>Array.isArray(value) && value.length===4 ? undefined : 'Keep the four existing team groups.'};
  improveListLabels(field.fields);
 }
}
marketingCollections.forEach(collection=>{if(collection.fields)improveListLabels(collection.fields)});
