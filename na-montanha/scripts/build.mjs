// ==========================================================================
// Build do site — gera a pasta dist/ pronta para publicar.
// --------------------------------------------------------------------------
// Uso:   npm run build          (Node 18+; não precisa de npm install)
//
// Endereço usado em canonical, Open Graph, schema e sitemap, nesta ordem:
//   1. variável SITE_URL (ex.: SITE_URL=https://www.dominio.com.br npm run build)
//   2. site.url em src/data/site.mjs (domínio oficial, quando existir)
//   3. URL de produção da Netlify ($URL) ou da Vercel ($VERCEL_PROJECT_PRODUCTION_URL)
//   4. http://localhost:8080 (prévia local)
// ==========================================================================
import { mkdirSync, rmSync, readFileSync, writeFileSync, readdirSync, statSync, copyFileSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, 'dist');

const { site, cabins, faq } = await import('../src/data/site.mjs');
const helpers = await import('../src/templates/helpers.mjs');
const { ctx } = helpers;

const fromHost =
  process.env.URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '');
ctx.siteUrl = (process.env.SITE_URL || site.url || fromHost || 'http://localhost:8080').replace(/\/$/, '');
ctx.buildDate = new Date().toISOString().slice(0, 10);
ctx.year = new Date().getFullYear();

console.log(`==> Endereço do site: ${ctx.siteUrl}`);
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

// ------------------------------------------------------------- arquivos ---
const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const copy = (from, to) => {
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
};

const hash = (buf) => createHash('sha256').update(buf).digest('hex').slice(0, 10);

// CSS e JS ganham um hash no nome: podem ficar em cache por um ano e, quando
// mudam, o nome muda junto — o visitante nunca vê uma versão velha.
function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .join('\n')
    .replace(/\s*([{};])\s*/g, '$1')
    .replace(/;}/g, '}');
}
for (const [rel, transform] of [['css/site.css', minifyCss], ['js/site.js', (s) => s]]) {
  const raw = readFileSync(join(SRC, 'assets', rel), 'utf8');
  const out = transform(raw);
  const named = rel.replace(/\.(css|js)$/, `.${hash(out)}.$1`);
  ctx.assets[rel] = named;
  mkdirSync(dirname(join(DIST, 'assets', named)), { recursive: true });
  writeFileSync(join(DIST, 'assets', named), out);
}

for (const f of walk(join(SRC, 'assets'))) {
  const rel = relative(join(SRC, 'assets'), f);
  if (rel.startsWith('css/') || rel.startsWith('js/') || rel.endsWith('manifest.json')) continue;
  if (['favicon.svg', 'favicon-32.png', 'apple-touch-icon.png'].includes(rel)) {
    copy(f, join(DIST, rel));
    continue;
  }
  copy(f, join(DIST, 'assets', rel));
}

// ------------------------------------------------------------- páginas ---
const { render } = await import('../src/templates/layout.mjs');
const pages = [(await import('../src/pages/home.mjs')).default(), (await import('../src/pages/cabanas.mjs')).default()];
const cabana = (await import('../src/pages/cabana.mjs')).default;
pages.push(...cabins.map((c) => cabana(c)));
for (const mod of ['experiencias', 'localizacao', 'contato', 'privacidade', 'notfound']) {
  pages.push((await import(`../src/pages/${mod}.mjs`)).default());
}

const problems = [];
for (const page of pages) {
  const html = render(page);
  const file = page.file ? join(DIST, page.file) : join(DIST, page.path, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);

  // Conferências automáticas: nada de dado faltando ou H1 duplicado.
  const label = page.path;
  for (const bad of ['undefined', 'NaN', '[object Object]', 'null</']) {
    if (html.includes(bad)) problems.push(`${label}: contém "${bad}"`);
  }
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) problems.push(`${label}: ${h1} elementos <h1> (esperado 1)`);
  const title = html.match(/<title>([^<]*)<\/title>/)[1];
  if (title.length > 66) problems.push(`${label}: title com ${title.length} caracteres`);
  const desc = html.match(/<meta name="description" content="([^"]*)"/)[1];
  if (desc.length > 165) problems.push(`${label}: description com ${desc.length} caracteres`);
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch (e) { problems.push(`${label}: JSON-LD inválido (${e.message})`); }
  }
  console.log(`    ${label.padEnd(36)} ${String(title.length).padStart(2)} · ${desc.length} car.  ${title}`);
}

// Links internos e arquivos referenciados precisam existir.
for (const f of walk(DIST).filter((f) => f.endsWith('.html'))) {
  const html = readFileSync(f, 'utf8');
  const refs = [...html.matchAll(/(?:href|src)="(\/[^"#?]*)/g), ...html.matchAll(/srcset="([^"]+)"/g)]
    .flatMap((m) => (m[0].startsWith('srcset') ? m[1].split(',').map((s) => s.trim().split(' ')[0]) : [m[1]]));
  for (const r of new Set(refs)) {
    if (!r.startsWith('/')) continue;
    const target = r.endsWith('/') ? join(DIST, r, 'index.html') : join(DIST, r);
    if (!existsSync(target)) problems.push(`${relative(DIST, f)}: link quebrado ${r}`);
  }
}

// -------------------------------------------------------------- sitemap ---
const { img, abs, asset } = helpers;
const { photos } = await import('../src/data/site.mjs');
const imageTags = (keys = []) =>
  [...new Set(keys)]
    .map((k) => {
      const p = img(k);
      return `\n    <image:image><image:loc>${abs(asset(`img/${p.id}-${p.widths[p.widths.length - 1]}.jpg`))}</image:loc></image:image>`;
    })
    .join('');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages
  .filter((p) => p.sitemap !== false)
  .map((p) => `  <url>\n    <loc>${abs(p.path)}</loc>\n    <lastmod>${ctx.buildDate}</lastmod>${imageTags(p.sitemap?.images)}\n  </url>`)
  .join('\n')}
</urlset>
`;
writeFileSync(join(DIST, 'sitemap.xml'), sitemap);

// --------------------------------------------------------------- robots ---
writeFileSync(
  join(DIST, 'robots.txt'),
  `# ${site.name} — todo o conteúdo do site é público.
# Buscadores (Google, Bing) e buscas por IA (ChatGPT, Perplexity, Claude,
# Gemini) podem ler e citar as páginas. Não há área privada neste site.
User-agent: *
Allow: /

User-agent: Googlebot
User-agent: Bingbot
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: PerplexityBot
User-agent: Claude-SearchBot
User-agent: Claude-User
Allow: /

Sitemap: ${abs('/sitemap.xml')}
`
);

// ------------------------------------------------------------- llms.txt ---
// Resumo em texto simples para assistentes de IA (proposta llmstxt.org).
const a = site.address;
writeFileSync(
  join(DIST, 'llms.txt'),
  `# ${site.name}

> ${site.description}

- Localização: ${a.reference}, ${a.street} - ${a.district}, ${a.locality}, ${a.city} - ${a.state}, CEP ${a.postalCode}, Brasil.
- Região: ${site.region}. Fica perto de ${site.nearby}, mas não em ${site.nearby}: a cidade é ${a.city} (RS).
- Hospedagem: três cabanas — ${cabins.map((c) => c.name).join(', ')}.
- Reserva direta: WhatsApp ${site.phone.display} (https://wa.me/${site.whatsapp}).
- Avaliação: nota ${site.rating.value} no Google, com ${site.rating.count} avaliações (informada pela empresa).
- Instagram: ${site.links.instagram}

## Páginas

- [Página inicial](${abs('/')}): visão geral, cabanas, vídeo da Cabana dos Sonhos, localização e reserva.
- [Cabanas](${abs('/cabanas/')}): as três cabanas da Na Montanha Eco Space.
${cabins.map((c) => `- [${c.name}](${abs(`/cabanas/${c.slug}/`)}): ${c.pageIntro}`).join('\n')}
- [Experiência](${abs('/experiencias/')}): hospedagem em meio à natureza na Serra Gaúcha.
- [Localização](${abs('/localizacao/')}): endereço, mapa e rota até Igrejinha (RS).
- [Contato](${abs('/contato/')}): reserva direta pelo WhatsApp.

## Perguntas frequentes

${faq.map((f) => `### ${f.q}\n${f.a}`).join('\n\n')}
`
);

// ------------------------------------------------------------ resultado ---
const size = walk(DIST).reduce((s, f) => s + statSync(f).size, 0);
console.log(`==> ${walk(DIST).length} arquivos, ${(size / 1024 / 1024).toFixed(1)} MB em dist/`);
if (problems.length) {
  console.error('\n!! Problemas encontrados:\n' + problems.map((p) => '   - ' + p).join('\n'));
  process.exit(1);
}
console.log('==> Pronto, sem problemas.');
