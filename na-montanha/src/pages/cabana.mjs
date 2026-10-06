// Página de cada cabana (/cabanas/<slug>/).
import { site } from '../data/site.mjs';
import { cabinHero, film, cabinGallery, cabinFacts, otherCabins, reserve } from '../templates/components.mjs';
import { graph, lodgingNode, websiteNode, webPageNode, breadcrumbNode, cabinNode, ids } from '../templates/schema.mjs';
import { imageUrl, img } from '../templates/helpers.mjs';

export default function cabana(c) {
  const path = `/cabanas/${c.slug}/`;
  const trail = [['Início', '/'], ['Cabanas', '/cabanas/'], [c.name, path]];
  const ext = img(c.exterior);
  return {
    path,
    title: c.metaTitle,
    description: c.metaDescription,
    headerTone: 'over-media',
    navCurrent: '/cabanas/',
    bodyClass: `page-cabin page-cabin--${c.key}`,
    ogImage: imageUrl(c.exterior),
    ogImageWidth: ext.width,
    ogImageHeight: ext.height,
    ogImageAlt: ext.alt,
    schema: graph([
      websiteNode(),
      lodgingNode(),
      cabinNode(c),
      webPageNode({ path, title: c.metaTitle, description: c.metaDescription, about: ids.cabin(c), image: imageUrl(c.exterior), breadcrumb: true }),
      breadcrumbNode(path, trail),
    ]),
    main: [
      cabinHero(c, trail),
      c.hasVideo ? film({ id: 'video', withLink: false }) : '',
      cabinGallery(c),
      cabinFacts(c),
      reserve({ first: c.key }),
      otherCabins(c.key),
    ].join('\n'),
    viewCabin: c.key,
    sitemap: { priority: '0.9', images: [c.exterior, ...c.interiors] },
  };
}
