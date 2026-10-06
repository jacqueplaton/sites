import { pageHeader } from '../templates/components.mjs';
import { cabins } from '../data/site.mjs';

export default function notFound() {
  return {
    path: '/404.html',
    file: '404.html',
    title: 'Página não encontrada | Na Montanha Eco Space',
    description: 'Esta página não existe. Veja as cabanas da Na Montanha Eco Space, em Igrejinha, na Serra Gaúcha.',
    robots: 'noindex, follow',
    main: [
      pageHeader({
        label: 'Erro 404',
        title: 'Este caminho <em>não leva a lugar nenhum.</em>',
        intro: 'A página que você procurou não existe ou mudou de endereço. A montanha continua no mesmo lugar:',
        trail: [['Início', '/'], ['Página não encontrada', '/404.html']],
      }),
      `<nav class="lost wrap" aria-label="Sugestões"><ul class="lost__list">
        <li><a class="link-arrow" href="/">Página inicial →</a></li>
        ${cabins.map((c) => `<li><a class="link-arrow" href="/cabanas/${c.slug}/">${c.name} →</a></li>`).join('')}
        <li><a class="link-arrow" href="/contato/">Contato e reservas →</a></li>
      </ul></nav>`,
    ].join('\n'),
    sitemap: false,
  };
}
