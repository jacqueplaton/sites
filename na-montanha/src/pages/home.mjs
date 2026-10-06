// Página inicial: DESCOBRIR → DESEJAR → ESCOLHER → CONSULTAR → WHATSAPP.
import { site, cabins } from '../data/site.mjs';
import { homeHero, intro, cabinsSection, film, essay, rating, place, reserve, social, faqSection } from '../templates/components.mjs';
import { graph, lodgingNode, websiteNode, webPageNode, faqNode, cabinNode } from '../templates/schema.mjs';
import { abs, asset } from '../templates/helpers.mjs';

export default function home() {
  const path = '/';
  const title = 'Na Montanha Eco Space | Cabanas em Igrejinha, perto de Gramado';
  const description =
    'Três cabanas em meio à natureza em Igrejinha, na Serra Gaúcha, perto de Gramado. Conheça a Na Montanha Eco Space e reserve direto pelo WhatsApp.';
  return {
    path,
    title,
    description,
    headerTone: 'over-media',
    navCurrent: '/',
    bodyClass: 'page-home',
    schema: graph([
      websiteNode(),
      lodgingNode(),
      ...cabins.map(cabinNode),
      webPageNode({ path, title, description, image: abs(asset('img/og-na-montanha.jpg')) }),
      faqNode(path),
    ]),
    main: [homeHero(), intro(), cabinsSection(), film(), essay(), rating(), place(), reserve(), social(), faqSection()].join('\n'),
    sitemap: { priority: '1.0', images: ['sonhosEntardecer', 'cabanaDia', 'cabanaNoite', 'salaLareira', 'quartoBanheira'] },
  };
}
