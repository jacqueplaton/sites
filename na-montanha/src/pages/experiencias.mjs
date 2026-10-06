import { pageHeader, essay, film, reserve } from '../templates/components.mjs';
import { graph, lodgingNode, websiteNode, webPageNode, breadcrumbNode } from '../templates/schema.mjs';
import { experience } from '../data/site.mjs';

export default function experiencias() {
  const path = '/experiencias/';
  const title = 'Hospedagem na natureza, Serra Gaúcha | Na Montanha Eco Space';
  const description =
    'Natureza, arquitetura em A e silêncio: como é a hospedagem da Na Montanha Eco Space, em Igrejinha, na Serra Gaúcha, perto de Gramado. Reserve direto.';
  const trail = [['Início', '/'], ['Experiência', path]];
  return {
    path,
    title,
    description,
    navCurrent: '/experiencias/',
    schema: graph([websiteNode(), lodgingNode(), webPageNode({ path, title, description, breadcrumb: true }), breadcrumbNode(path, trail)]),
    main: [
      pageHeader({
        label: 'A experiência',
        title: 'Hospedagem em meio à natureza, <em>na Serra Gaúcha.</em>',
        intro:
          'Em Igrejinha, a experiência da Na Montanha Eco Space é a própria montanha: cabanas em A cercadas de mata, madeira por dentro, vidro voltado para a paisagem e tempo para não fazer nada. Gramado fica perto, para quando der vontade.',
        trail,
      }),
      essay({ all: true }),
      film(),
      reserve(),
    ].join('\n'),
    sitemap: { priority: '0.7', images: experience.map((e) => e.photo) },
  };
}
