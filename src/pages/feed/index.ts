import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: { site: URL }) {
  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort((a, b) => b.data.publishedDate.valueOf() - a.data.publishedDate.valueOf());
  return rss({
    title: 'tSCG Insights',
    description: 'Retail operations insights from the Stores Consulting Group.',
    site: context.site,
    items: posts.map((post) => ({ title: post.data.title, description: post.data.excerpt, pubDate: post.data.publishedDate, link: post.data.route })),
  });
}
