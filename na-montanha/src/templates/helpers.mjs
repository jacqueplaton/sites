// Funções pequenas usadas por todas as páginas.
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { site, photos } from '../data/site.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const IMG_MANIFEST = JSON.parse(readFileSync(join(HERE, '../assets/img/manifest.json'), 'utf8'));

// O build preenche estes valores antes de renderizar.
export const ctx = { siteUrl: '', assets: {}, year: new Date().getFullYear(), buildDate: '' };

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Une pedaços de HTML ignorando vazios/false.
export const join_ = (...parts) => parts.flat(Infinity).filter(Boolean).join('');

export const abs = (path = '/') => ctx.siteUrl.replace(/\/$/, '') + path;
export const asset = (path) => '/assets/' + (ctx.assets[path] || path);

export const waUrl = (message) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;

// Link de WhatsApp. data-wa-base guarda a mensagem original para o JS
// acrescentar as datas escolhidas na seção de reserva.
export function waLink({ message, label, className = '', cabin = '', track = '', extra = '' }) {
  return `<a class="${className}" href="${esc(waUrl(message))}" data-wa-base="${esc(message)}"${
    cabin ? ` data-cabin="${cabin}"` : ''
  }${track ? ` data-track="${track}"` : ''} target="_blank" rel="noopener"${extra}>${label}</a>`;
}

// Link externo opcional: sem URL vira texto simples (a presença continua
// citada, mas sem link quebrado).
export const maybeLink = (url, label, className = '') =>
  url ? `<a class="${className}" href="${esc(url)}" target="_blank" rel="noopener">${label}</a>` : `<span class="${className}">${label}</span>`;

export function img(key) {
  const p = photos[key];
  if (!p) throw new Error(`Foto desconhecida: ${key}`);
  const m = IMG_MANIFEST[p.id];
  if (!m) throw new Error(`Foto sem versão web: ${p.id} — rode "npm run media"`);
  return { ...p, ...m };
}

// <picture> com AVIF, WebP e JPEG, várias larguras e dimensões reais
// (width/height evitam salto de layout).
// "art": outra foto (ou recorte) para telas menores, ex.:
//   { key: 'sonhosRetrato', media: '(max-width: 55.99em)', sizes: '100vw' }
export function picture(key, { sizes = '100vw', loading = 'lazy', priority = false, className = '', alt, imgClass = '', art } = {}) {
  const p = img(key);
  const setOf = (q, ext) => q.widths.map((w) => `${asset(`img/${q.id}-${w}.${ext}`)} ${w}w`).join(', ');
  const set = (ext) => setOf(p, ext);
  const artSources = art
    ? ['avif', 'webp'].map((ext) => `<source media="${art.media}" type="image/${ext}" srcset="${setOf(img(art.key), ext)}" sizes="${art.sizes || '100vw'}">`).join('')
    : '';
  const fallbackW = p.widths.find((w) => w >= 640) || p.widths[p.widths.length - 1];
  const altText = alt ?? p.alt;
  return `<picture${className ? ` class="${className}"` : ''}>` + artSources +
    `<source type="image/avif" srcset="${set('avif')}" sizes="${sizes}">` +
    `<source type="image/webp" srcset="${set('webp')}" sizes="${sizes}">` +
    `<img${imgClass ? ` class="${imgClass}"` : ''} src="${asset(`img/${p.id}-${fallbackW}.jpg`)}" srcset="${set('jpg')}" sizes="${sizes}" width="${p.width}" height="${p.height}" alt="${esc(altText)}" ${
      priority ? 'fetchpriority="high" loading="eager"' : `loading="${loading}"`
    } decoding="${priority ? 'sync' : 'async'}">` +
    `</picture>`;
}

// URL absoluta da maior versão JPEG (para schema e Open Graph).
export function imageUrl(key) {
  const p = img(key);
  return abs(asset(`img/${p.id}-${p.widths[p.widths.length - 1]}.jpg`));
}

export const fullAddressLines = () => {
  const a = site.address;
  return [a.reference, `${a.street} - ${a.district}`, a.locality, `${a.city} - ${a.state}`, a.postalCode];
};

export const fullAddressText = () => {
  const a = site.address;
  return `${a.reference}, ${a.street} - ${a.district}, ${a.locality}, ${a.city} - ${a.state}, ${a.postalCode}`;
};

// Seta usada nos links de texto. Decorativa.
export const arrow = '<span class="arrow" aria-hidden="true">→</span>';
export const external = '<span class="arrow" aria-hidden="true">↗</span>';
