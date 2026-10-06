#!/usr/bin/env node
// ==========================================================================
// Gera as páginas do site em ../site a partir de dados.mjs.
//
//   node fonte/gerar.mjs
//
// Sem dependências: só Node 18+. Os arquivos gerados vão para o Git, então o
// site funciona em qualquer hospedagem estática, sem build.
// ==========================================================================
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { site, cabanas } from './dados.mjs';
import { paginaInicial, paginaCabana, paginaCabanas, pagina404 } from './paginas.mjs';

const SAIDA = join(dirname(fileURLToPath(import.meta.url)), '..', 'site');

const hash = (arquivo) =>
  createHash('sha256').update(readFileSync(join(SAIDA, arquivo))).digest('hex').slice(0, 10);

const versao = { css: hash('assets/css/site.css'), js: hash('assets/js/site.js') };

// "A-frame" nunca quebra no hífen. Só mexe no texto entre tags do <body>,
// nunca em atributos nem no JSON-LD do <head>.
function semQuebra(html) {
  const i = html.indexOf('<body');
  if (i < 0) return html;
  const corpo = html.slice(i).replace(/>([^<]+)</g, (m, t) =>
    '>' + t.replace(/A-frames?/g, (x) => `<span class="sq">${x}</span>`) + '<');
  return html.slice(0, i) + corpo;
}

function gravar(caminho, conteudo) {
  if (caminho.endsWith('.html')) conteudo = semQuebra(conteudo);
  const destino = join(SAIDA, caminho);
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(destino, conteudo);
  console.log('  ' + caminho);
}

console.log(`Gerando para ${site.urlBase} (${site.indexar ? 'indexável' : 'noindex'})`);

gravar('index.html', paginaInicial(versao));
gravar('cabanas/index.html', paginaCabanas(versao));
for (const c of cabanas) gravar(`cabanas/${c.slug}/index.html`, paginaCabana(c, versao));
gravar('404.html', pagina404(versao));

const hoje = new Date().toISOString().slice(0, 10);
const urls = ['', 'cabanas/', ...cabanas.map((c) => `cabanas/${c.slug}/`)];
gravar(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${site.urlBase}/${u}</loc>
    <lastmod>${hoje}</lastmod>
  </url>`,
  )
  .join('\n')}
</urlset>
`,
);

gravar(
  'robots.txt',
  `User-agent: *
Allow: /

Sitemap: ${site.urlBase}/sitemap.xml
`,
);

console.log('Pronto.');
