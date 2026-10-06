// ==========================================================================
// Gera as versões web das fotos e do vídeo a partir dos originais.
// --------------------------------------------------------------------------
// Uso:  npm install   (uma vez, instala o sharp)
//       npm run media
//
// Fotos:  media-src/*.jpg|webp  →  src/assets/img/<nome>-<largura>.avif|webp|jpg
// Vídeo:  caminho em VIDEO_SRC (ou media-src/cabana-dos-sonhos.mp4)
//         →  src/assets/video/cabana-dos-sonhos-{720,1080}.mp4 (+ AV1)
//         →  pôster real (primeiro quadro) em src/assets/img/
//
// Nunca amplia uma imagem além do tamanho original: larguras maiores que a
// foto são ignoradas. Para ter mais nitidez, envie fotos maiores.
// O vídeo exige ffmpeg instalado.
// ==========================================================================
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, statSync, writeFileSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'media-src');
const IMG = join(ROOT, 'src/assets/img');
const VID = join(ROOT, 'src/assets/video');
mkdirSync(IMG, { recursive: true });
mkdirSync(VID, { recursive: true });

// Fotos reais enviadas pela Na Montanha. "widths" são as larguras desejadas;
// o script descarta as que passam do original.
const PHOTOS = [
  { file: 'cabana-dos-sonhos-entardecer.webp', name: 'cabana-dos-sonhos-entardecer', widths: [480, 640, 800] },
  { file: 'cabana-dia-deck.webp',              name: 'cabana-dia-deck',              widths: [480, 640, 750] },
  { file: 'cabana-noite.jpg',                  name: 'cabana-noite',                 widths: [400, 576] },
  { file: 'sala-lareira.jpg',                  name: 'sala-lareira',                 widths: [480, 800, 1082] },
  { file: 'quarto-banheira.jpg',               name: 'quarto-banheira',              widths: [480, 660] },
  // Recorte vertical para o topo da página no celular: mostra exatamente a
  // faixa central que já aparece na tela, com bem menos bytes.
  { file: 'cabana-dos-sonhos-entardecer.webp', name: 'cabana-dos-sonhos-entardecer-retrato', crop: { left: 0.19, width: 0.62 }, widths: [400, 496] },
];

const kb = (p) => `${Math.round(statSync(p).size / 1024)} KB`;

async function encode(input, name, widths, crop) {
  if (crop) {
    const m = await sharp(input).metadata();
    input = await sharp(input)
      .extract({ left: Math.round(m.width * crop.left), top: 0, width: Math.round(m.width * crop.width), height: m.height })
      .toBuffer();
  }
  const meta = await sharp(input).metadata();
  const usable = widths.filter((w) => w <= meta.width);
  if (!usable.includes(meta.width) && widths.some((w) => w > meta.width)) usable.push(meta.width);
  const out = [];
  for (const w of [...new Set(usable)].sort((a, b) => a - b)) {
    const base = sharp(input).rotate().resize({ width: w, withoutEnlargement: true });
    const avif = join(IMG, `${name}-${w}.avif`);
    const webp = join(IMG, `${name}-${w}.webp`);
    const jpg = join(IMG, `${name}-${w}.jpg`);
    await base.clone().avif({ quality: 54, effort: 6, chromaSubsampling: '4:2:0' }).toFile(avif);
    await base.clone().webp({ quality: 76, effort: 6 }).toFile(webp);
    await base.clone().jpeg({ quality: 78, mozjpeg: true, progressive: true }).toFile(jpg);
    out.push(`${w}w  avif ${kb(avif)} · webp ${kb(webp)} · jpg ${kb(jpg)}`);
  }
  const h = Math.round((meta.height / meta.width) * 1000) / 1000;
  console.log(`\n${name}  (${meta.width}×${meta.height}, proporção altura/largura ${h})`);
  out.forEach((l) => console.log('  ' + l));
  return { name, width: meta.width, height: meta.height, widths: [...new Set(usable)].sort((a, b) => a - b) };
}

const ONLY = process.env.ONLY || ''; // 'images' pula o vídeo (que demora alguns minutos)
const manifest = {};
for (const p of PHOTOS) {
  const input = join(SRC, p.file);
  if (!existsSync(input)) { console.warn(`! faltando ${p.file}`); continue; }
  manifest[p.name] = await encode(input, p.name, p.widths, p.crop);
}

// ---------------------------------------------------------------- vídeo ---
const VIDEO_SRC = process.env.VIDEO_SRC || join(SRC, 'cabana-dos-sonhos.mp4');
if (ONLY !== 'images' && existsSync(VIDEO_SRC)) {
  const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: 'inherit' });
  const common = ['-an', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-r', '24'];

  // Um leve filtro de ruído (hqdn3d) remove o granulado do vídeo gerado no
  // Flow e reduz bastante o peso, sem mudar nada do que aparece na imagem.
  const vf = (w) => `hqdn3d=1.2:1.2:5:5,scale=${w}:-2:flags=lanczos`;
  const h264 = (w, crf, out) => ff(['-i', VIDEO_SRC, '-vf', vf(w), '-c:v', 'libx264', '-preset', 'veryslow',
    '-crf', String(crf), '-profile:v', 'high', '-tune', 'film', '-g', '48', ...common, join(VID, out)]);
  const av1 = (w, crf, out) => ff(['-i', VIDEO_SRC, '-vf', vf(w), '-c:v', 'libsvtav1', '-preset', '4',
    '-crf', String(crf), '-g', '48', ...common, join(VID, out)]);

  // H.264: toca em qualquer navegador. AV1: mesmo visual, bem mais leve,
  // usado automaticamente por quem suporta. 1080p para telas grandes,
  // 720p para celular. Sem áudio (o vídeo toca mudo, em loop).
  const files = [
    ['cabana-dos-sonhos-1080.mp4', () => h264(1920, 28, 'cabana-dos-sonhos-1080.mp4')],
    ['cabana-dos-sonhos-720.mp4', () => h264(1280, 28, 'cabana-dos-sonhos-720.mp4')],
    ['cabana-dos-sonhos-1080-av1.mp4', () => av1(1920, 42, 'cabana-dos-sonhos-1080-av1.mp4')],
    ['cabana-dos-sonhos-720-av1.mp4', () => av1(1280, 40, 'cabana-dos-sonhos-720-av1.mp4')],
  ];
  for (const [f, run] of files) { run(); console.log(`\n${f}  ${kb(join(VID, f))}`); }

  // Pôster: o primeiro quadro real do vídeo, para o loop recomeçar sem salto.
  const frame = join(ROOT, 'media-src', '.poster-frame.png');
  ff(['-i', VIDEO_SRC, '-frames:v', '1', '-update', '1', frame]);
  manifest['cabana-dos-sonhos-video'] = await encode(frame, 'cabana-dos-sonhos-video', [640, 1280, 1920]);
} else if (ONLY !== 'images') {
  console.warn(`\n! vídeo não encontrado em ${VIDEO_SRC} — mantendo os arquivos atuais de src/assets/video`);
}

// ---------------------------------------------- imagem de compartilhamento ---
// 1200×630: as três fachadas lado a lado (dia, entardecer, noite), sem
// ampliar nenhuma foto além do original.
{
  const W = 1200, H = 630, gap = 4, col = Math.floor((W - gap * 2) / 3);
  const crop = (f) => sharp(join(SRC, f)).resize({ width: col, height: H, fit: 'cover', position: 'centre' }).toBuffer();
  const [a, b, c] = await Promise.all([
    crop('cabana-dia-deck.webp'), crop('cabana-dos-sonhos-entardecer.webp'), crop('cabana-noite.jpg'),
  ]);
  const shade = Buffer.from(
    `<svg width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.45" stop-color="#12130f" stop-opacity="0"/><stop offset="1" stop-color="#12130f" stop-opacity="0.82"/>
    </linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/>
    <text x="48" y="${H - 92}" font-family="Instrument Sans" font-size="20" letter-spacing="4" fill="#efe8dc">IGREJINHA · SERRA GAÚCHA · RS</text>
    <text x="44" y="${H - 40}" font-family="Newsreader 16pt" font-size="60" font-weight="300" fill="#f5efe6">Na Montanha Eco Space</text></svg>`
  );
  const og = join(ROOT, 'src/assets/img/og-na-montanha.jpg');
  await sharp({ create: { width: W, height: H, channels: 3, background: '#12130f' } })
    .composite([
      { input: a, left: 0, top: 0 },
      { input: b, left: col + gap, top: 0 },
      { input: c, left: (col + gap) * 2, top: 0 },
      { input: shade, left: 0, top: 0 },
    ])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(og);
  console.log(`\nog-na-montanha.jpg  ${kb(og)}`);
}

// ------------------------------------------------------------- ícones ---
{
  const svg = readFileSync(join(ROOT, 'src/assets/favicon.svg'));
  await sharp(svg, { density: 600 }).resize(180, 180).png().toFile(join(ROOT, 'src/assets/apple-touch-icon.png'));
  await sharp(svg, { density: 300 }).resize(32, 32).png().toFile(join(ROOT, 'src/assets/favicon-32.png'));
}

// As dimensões reais ficam registradas para o build gravar width/height
// corretos em cada <img> (evita salto de layout).
const prev = existsSync(join(IMG, 'manifest.json')) ? JSON.parse(readFileSync(join(IMG, 'manifest.json'), 'utf8')) : {};
writeFileSync(join(IMG, 'manifest.json'), JSON.stringify({ ...prev, ...manifest }, null, 2) + '\n');
console.log('\nmanifest.json atualizado');
