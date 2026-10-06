import { site } from '../data/site.mjs';
import { pageHeader, reserve, social, place } from '../templates/components.mjs';
import { graph, lodgingNode, websiteNode, webPageNode, breadcrumbNode } from '../templates/schema.mjs';

export default function contato() {
  const path = '/contato/';
  const title = 'Contato e reserva direta pelo WhatsApp | Na Montanha Eco Space';
  const description =
    'Fale com a Na Montanha Eco Space pelo WhatsApp (51) 99909-7337 e consulte disponibilidade da Cabana dos Sonhos, do Amor ou da Pedra. Reserva direta.';
  const trail = [['Início', '/'], ['Contato', path]];
  return {
    path,
    title,
    description,
    navCurrent: '/contato/',
    schema: graph([websiteNode(), lodgingNode(), { ...webPageNode({ path, title, description, breadcrumb: true }), '@type': 'ContactPage' }, breadcrumbNode(path, trail)]),
    main: [
      pageHeader({
        label: 'Contato',
        title: 'Contato e <em>reserva direta.</em>',
        intro: `A forma mais rápida de falar com a Na Montanha Eco Space é pelo WhatsApp ${site.phone.display}. Escolha a cabana abaixo e a mensagem já vai pronta.`,
        trail,
      }),
      reserve(),
      place(),
      social(),
    ].join('\n'),
    sitemap: { priority: '0.8' },
  };
}
