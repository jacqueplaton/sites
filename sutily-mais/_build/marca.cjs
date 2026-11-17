#!/usr/bin/env node
// Gera, a partir do logotipo original vetorizado (logo.json):
//   favicon.svg · img/icone-180.png · img/logo-sutily-mais.png · img/og-sutily-mais.jpg
// Uso (com o servidor local ligado na pasta sutily-mais):  node _build/marca.cjs
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const RAIZ = path.resolve(__dirname, '..');
const L = JSON.parse(fs.readFileSync(path.join(__dirname, 'logo.json'), 'utf8'));
const BASE = process.env.SUTILY_URL || 'http://localhost:8765';

// a letra "U" do logotipo (hastes douradas + curva clara) vira o ícone do site
const partes = (d) => d.split(/(?=M)/).filter(Boolean);
const x0 = (p) => parseFloat(p.slice(1));
const noU = (p) => x0(p) > 160 && x0(p) < 275;
const uOuro = partes(L.gold).filter(noU).join('');
const uDet = partes(L.mint).filter(noU).join('');
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#66A583"/><g transform="translate(32 32) scale(.34) translate(-218 -112)"><path fill="#D6C56F" d="${uOuro}"/><path fill="#CFE6D6" d="${uDet}"/></g></svg>`;
fs.writeFileSync(path.join(RAIZ, 'favicon.svg'), favicon);

const logo = (cor1 = '#D6C56F', cor2 = '#CFE6D6') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${L.w} ${L.h}"><path fill="${cor1}" fill-rule="evenodd" d="${L.gold}"/><path fill="${cor2}" fill-rule="evenodd" d="${L.mint}"/></svg>`;
const fontes = `@font-face{font-family:N;src:url(${BASE}/fonts/newsreader-normal.woff2)}@font-face{font-family:N;font-style:italic;src:url(${BASE}/fonts/newsreader-italic.woff2)}@font-face{font-family:J;src:url(${BASE}/fonts/jost.woff2);font-weight:400 500}`;

(async () => {
  const b = await chromium.launch();
  const foto = async (html, w, h, arq, opt = {}) => {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.goto(`${BASE}/robots.txt`); // mesma origem do servidor, para as fontes carregarem
    await p.setContent(`<style>${fontes}*{margin:0;box-sizing:border-box}body{width:${w}px;height:${h}px;overflow:hidden}</style>${html}`, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(RAIZ, arq), ...opt });
    await p.close();
  };
  await foto(`<body style="background:#66A583">${favicon.replace('<svg', '<svg width="180" height="180"').replace('rx="14"', 'rx="0"')}</body>`, 180, 180, 'img/icone-180.png');
  await foto(`<body style="background:#66A583;display:grid;place-items:center"><div style="width:520px">${logo()}<p style="font:500 17px J;letter-spacing:.44em;color:#fff;text-transform:uppercase;margin-top:6px">Clínica Integrada</p></div></body>`, 800, 800, 'img/logo-sutily-mais.png');
  await foto(`<body style="background:#17362A;color:#F2F8F3;font-family:J">
    <div style="position:absolute;left:72px;top:64px;width:190px">${logo()}<p style="font:500 9.5px J;letter-spacing:.4em;color:#A9C4B4;text-transform:uppercase;margin-top:5px">Clínica Integrada</p></div>
    <h1 style="position:absolute;left:72px;top:206px;width:600px;font:400 72px/1 N;letter-spacing:-.02em">Seu sorriso merece um cuidado que vai <i style="color:#D6C56F">além.</i></h1>
    <p style="position:absolute;left:72px;bottom:66px;font:500 17px J;letter-spacing:.24em;text-transform:uppercase;color:#D6C56F">Nova Parnamirim · Parnamirim/RN</p>
    <div style="position:absolute;right:86px;top:58px;width:400px;bottom:0;border:1px solid #D6C56F;opacity:.5;border-radius:999px 999px 0 0;transform:translate(14px,-14px)"></div>
    <div style="position:absolute;right:86px;top:58px;width:400px;bottom:0;border-radius:999px 999px 0 0;overflow:hidden"><img src="${BASE}/img/joycce-retrato-1122.webp" style="width:100%;height:100%;object-fit:cover;object-position:50% 16%"></div>
  </body>`, 1200, 630, 'img/og-sutily-mais.jpg', { type: 'jpeg', quality: 86 });
  await b.close();
  console.log('✓ favicon.svg, icone-180.png, logo-sutily-mais.png, og-sutily-mais.jpg');
})();
