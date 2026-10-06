import { pageHeader, place, reserve, faqSection } from '../templates/components.mjs';
import { graph, lodgingNode, websiteNode, webPageNode, breadcrumbNode } from '../templates/schema.mjs';
import { faq } from '../data/site.mjs';

export default function localizacao() {
  const path = '/localizacao/';
  const title = 'Como chegar à Na Montanha Eco Space, em Igrejinha (RS)';
  const description =
    'Endereço, mapa e rota até a Na Montanha Eco Space: Alto da Pedra, Serra Grande, Igrejinha (RS), na Serra Gaúcha, perto de Gramado.';
  const trail = [['Início', '/'], ['Localização', path]];
  return {
    path,
    title,
    description,
    navCurrent: '/localizacao/',
    schema: graph([websiteNode(), lodgingNode(), webPageNode({ path, title, description, breadcrumb: true }), breadcrumbNode(path, trail)]),
    main: [
      pageHeader({
        label: 'Localização',
        title: 'Como chegar à <em>Na Montanha Eco Space.</em>',
        intro:
          'A Na Montanha fica em Igrejinha, no Rio Grande do Sul, na Serra Gaúcha — na região próxima de Gramado, mas não dentro de Gramado. O endereço é no Alto da Pedra, na Serra Grande, junto à subida do parque.',
        trail,
      }),
      place(),
      faqSection({ items: faq.filter((f) => /Onde fica|perto de Gramado|WhatsApp\?/.test(f.q)) }),
      reserve(),
    ].join('\n'),
    sitemap: { priority: '0.8' },
  };
}
