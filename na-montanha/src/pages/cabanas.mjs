import { cabins } from '../data/site.mjs';
import { pageHeader, cabinsSection, reserve, faqSection } from '../templates/components.mjs';
import { graph, lodgingNode, websiteNode, webPageNode, breadcrumbNode, cabinNode } from '../templates/schema.mjs';
import { faq } from '../data/site.mjs';

export default function cabanas() {
  const path = '/cabanas/';
  const title = 'Cabanas em Igrejinha, na Serra Gaúcha | Na Montanha Eco Space';
  const description =
    'Cabana dos Sonhos, Cabana do Amor e Cabana da Pedra: as três cabanas da Na Montanha Eco Space em Igrejinha (RS), perto de Gramado. Consulte disponibilidade.';
  const trail = [['Início', '/'], ['Cabanas', path]];
  return {
    path,
    title,
    description,
    navCurrent: '/cabanas/',
    schema: graph([websiteNode(), lodgingNode(), ...cabins.map(cabinNode), webPageNode({ path, title, description, breadcrumb: true }), breadcrumbNode(path, trail)]),
    main: [
      pageHeader({
        label: 'Na Montanha Eco Space',
        title: 'Cabanas em Igrejinha, <em>na Serra Gaúcha.</em>',
        intro:
          'A Na Montanha Eco Space tem três cabanas no Alto da Pedra, na Serra Grande de Igrejinha, perto de Gramado: a Cabana dos Sonhos, a Cabana do Amor e a Cabana da Pedra. Todas podem ser reservadas diretamente, pelo WhatsApp.',
        trail,
      }),
      cabinsSection({ withHeader: false, headingLevel: 'h2' }),
      reserve(),
      faqSection({ items: faq.filter((f) => /cabanas fazem parte|consultar|diretamente/.test(f.q)) }),
    ].join('\n'),
    sitemap: { priority: '0.9', images: cabins.map((c) => c.photo) },
  };
}
