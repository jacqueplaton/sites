#!/usr/bin/env node
// ==========================================================================
// SUTILY MAIS — renderiza o filme de três cenas (media/filme-sutily-*.mp4)
// --------------------------------------------------------------------------
// Precisa de: Node com Playwright (Chromium) e FFmpeg no PATH.
// Uso:  1) na pasta sutily-mais:   python3 -m http.server 8765
//       2) node _build/filme.cjs            (gera 16x9 e 9x16)
// Fotografa a composição _build/filme.html quadro a quadro e monta o MP4.
// ==========================================================================
const { chromium } = require('playwright');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const BASE = process.env.SUTILY_URL || 'http://localhost:8765';
const MEDIA = path.resolve(__dirname, '..', 'media');
const FPS = 30, DUR = 15, POSTER_T = 3.2;
const formatos = [
  { nome: '16x9', w: 1280, h: 720, q: '' },
  { nome: '9x16', w: 720, h: 1280, q: '&f=v' },
];

(async () => {
  const b = await chromium.launch();
  for (const f of formatos) {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `sutily-filme-${f.nome}-`));
    const p = await b.newPage({ viewport: { width: f.w, height: f.h }, deviceScaleFactor: 1 });
    await p.goto(`${BASE}/_build/filme.html?render=1${f.q}`);
    await p.evaluate(() => window.pronto);
    for (let i = 0; i < FPS * DUR; i++) {
      await p.evaluate((t) => window.seek(t), i / FPS);
      await p.screenshot({ path: path.join(tmp, `q${String(i).padStart(4, '0')}.png`) });
    }
    await p.evaluate((t) => window.seek(t), POSTER_T);
    await p.screenshot({ path: path.join(MEDIA, `filme-poster-${f.nome}.jpg`), type: 'jpeg', quality: 82 });
    await p.close();
    const saida = path.join(MEDIA, `filme-sutily-${f.nome}.mp4`);
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(tmp, 'q%04d.png'),
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '25', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart', '-an', saida]);
    fs.rmSync(tmp, { recursive: true, force: true });
    console.log(`✓ ${path.basename(saida)}  ${(fs.statSync(saida).size / 1024).toFixed(0)} KB`);
  }
  await b.close();
})();
