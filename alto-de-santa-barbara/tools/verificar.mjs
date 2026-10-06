#!/usr/bin/env node
/*
  Verificação estática da página, sem dependências.
  Uso (na pasta alto-de-santa-barbara/):  node tools/verificar.mjs

  Confere:
  - links de WhatsApp: número igual ao js/config.js, sem "55" duplicado e com
    uma das três mensagens aprovadas;
  - arquivos locais referenciados (src, srcset, href) existem;
  - toda <img> tem alt, width e height;
  - um único <h1>; ids únicos; âncoras e aria-* apontam para ids existentes;
  - JSON-LD válido e marcador de URL só dentro do bloco de SEO.
*/
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(raiz, 'index.html'), 'utf8');
const problemas = [];
const avisos = [];
const ok = (msg) => console.log('ok   ' + msg);

// --- Configuração ----------------------------------------------------------
const sandbox = { window: {} };
vm.runInNewContext(readFileSync(join(raiz, 'js/config.js'), 'utf8'), sandbox);
const config = sandbox.window.ALTO_CONFIG;
const mensagens = Object.values(config.mensagens);

// --- WhatsApp --------------------------------------------------------------
const links = [...html.matchAll(/href="(https:\/\/wa\.me\/[^"]*)"/g)].map((m) => m[1]);
for (const link of links) {
  const m = /^https:\/\/wa\.me\/(\d+)\?text=([^"&]+)$/.exec(link.replace(/&amp;/g, '&'));
  if (!m) { problemas.push(`link de WhatsApp fora do padrão: ${link}`); continue; }
  if (m[1] !== config.whatsapp) problemas.push(`número diferente do config.js: ${m[1]}`);
  if (/^5555/.test(m[1])) problemas.push(`código do país duplicado: ${m[1]}`);
  const texto = decodeURIComponent(m[2]);
  if (!mensagens.includes(texto)) problemas.push(`mensagem não aprovada: "${texto}"`);
}
if (/^55\d{10,11}$/.test(config.whatsapp)) ok(`número ${config.whatsapp} em formato internacional`);
else problemas.push(`número do config.js inválido: ${config.whatsapp}`);
ok(`${links.length} links de WhatsApp conferidos`);

// --- Arquivos locais -------------------------------------------------------
const refs = new Set();
for (const m of html.matchAll(/\s(?:src|href)="([^"]+)"/g)) refs.add(m[1]);
for (const m of html.matchAll(/\s(?:srcset|imagesrcset)="([^"]+)"/g)) {
  m[1].split(',').forEach((parte) => refs.add(parte.trim().split(/\s+/)[0]));
}
const faltando = [...refs].filter((r) =>
  !/^(https?:|#|mailto:|tel:|data:)/.test(r) && !r.includes('__SITE_URL__') && !existsSync(join(raiz, r)));
if (faltando.length) {
  const fotos = [...new Set(faltando.map((f) => (f.match(/img\/(\d\d-[a-z]+)/) || [])[1]).filter(Boolean))];
  problemas.push(`${faltando.length} arquivos referenciados não existem` +
    (fotos.length ? ` (fotos sem versão gerada: ${fotos.join(', ')})` : '') +
    `\n       ${faltando.slice(0, 8).join('\n       ')}${faltando.length > 8 ? '\n       …' : ''}`);
} else ok(`${refs.size} referências locais existem`);

// --- Imagens ---------------------------------------------------------------
const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
for (const tag of imgs) {
  if (!/\salt="/.test(tag)) problemas.push(`img sem alt: ${tag.slice(0, 80)}`);
  if (!/\swidth="\d+"/.test(tag) || !/\sheight="\d+"/.test(tag)) problemas.push(`img sem width/height: ${tag.slice(0, 80)}`);
}
ok(`${imgs.length} imagens com alt e dimensões`);

// --- Estrutura -------------------------------------------------------------
const h1 = (html.match(/<h1\b/g) || []).length;
if (h1 !== 1) problemas.push(`esperado 1 h1, encontrado ${h1}`); else ok('um único h1');

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
const repetidos = ids.filter((id, i) => ids.indexOf(id) !== i);
if (repetidos.length) problemas.push(`ids repetidos: ${repetidos.join(', ')}`);
const alvos = new Set(ids);
const usados = [
  ...[...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]),
  ...[...html.matchAll(/(?:aria-labelledby|aria-describedby|aria-controls)="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/)),
  ...[...html.matchAll(/<use href="#([^"]+)"/g)].map((m) => m[1]),
];
const quebrados = [...new Set(usados.filter((id) => !alvos.has(id)))];
if (quebrados.length) problemas.push(`referências para ids inexistentes: ${quebrados.join(', ')}`);
else ok('âncoras, aria-* e ícones apontam para ids existentes');

// --- SEO ---------------------------------------------------------------------
const inicio = html.indexOf('<!-- seo-url:inicio -->');
const fim = html.indexOf('<!-- seo-url:fim -->');
const foraDoBloco = html.slice(0, inicio) + html.slice(fim);
if (foraDoBloco.includes('__SITE_URL__')) problemas.push('marcador __SITE_URL__ fora do bloco de SEO');
const ld = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(html);
try {
  const dados = JSON.parse(ld[1].replace(/__SITE_URL__/g, 'https://exemplo.test'));
  const tipos = dados['@graph'].map((n) => n['@type']);
  if (JSON.stringify(dados).match(/aggregateRating|starRating|priceRange/)) problemas.push('JSON-LD com nota, estrelas ou preço');
  ok(`JSON-LD válido (${tipos.join(', ')})`);
} catch (erro) {
  problemas.push(`JSON-LD inválido: ${erro.message}`);
}
if (!/<meta name="robots" content="noindex, follow">/.test(html)) avisos.push('meta robots de prévia (noindex, follow) não encontrada');
else ok('prévia marcada como noindex, follow');

// --- Resultado ---------------------------------------------------------------
avisos.forEach((a) => console.log('aviso ' + a));
if (problemas.length) {
  console.log('\nProblemas:');
  problemas.forEach((p) => console.log(' - ' + p));
  process.exit(1);
}
console.log('\nTudo certo.');
