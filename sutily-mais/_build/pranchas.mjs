// ==========================================================================
// PRANCHAS — ilustrações autorais em traço fino, uma por especialidade.
// Desenhadas em código (SVG), sem imagens de banco e sem IA.
// Tela 400 × 500. Traço = currentColor · detalhe = var(--pr-acento)
// ==========================================================================

const n = (v) => +v.toFixed(1);
const DENTE = 'M140,160C140,125 170,115 200,130C230,115 260,125 260,160C260,195 250,210 246,240C242,275 240,335 224,340C210,344 212,270 200,270C188,270 190,344 176,340C160,335 158,275 154,240C150,210 140,195 140,160Z';
const mais = (x, y, s = 7) => `<path class="ac" d="M${x - s},${y}H${x + s}M${x},${y - s}V${y + s}"/>`;
const estrela = (x, y, s = 10) => `<path class="ac" d="M${x},${y - s}Q${x},${y} ${x + s},${y}Q${x},${y} ${x},${y + s}Q${x},${y} ${x - s},${y}Q${x},${y} ${x},${y - s}Z"/>`;

// arcada vista de frente: dentes distribuídos sobre um arco suave
function sorriso({ cy = 250, braquetes = false } = {}) {
  const larg = [30, 34, 40, 46, 46, 40, 34, 30];
  const alt = [46, 54, 62, 74, 74, 62, 54, 46];
  let x = 200 - larg.reduce((a, b) => a + b + 4, -4) / 2;
  let out = '', fio = [];
  larg.forEach((w, i) => {
    const cx = x + w / 2;
    const y = cy + Math.pow((cx - 200) / 150, 2) * -34;
    out += `<rect x="${n(x)}" y="${n(y)}" width="${w}" height="${alt[i]}" rx="${n(w * 0.34)}"/>`;
    if (braquetes) {
      out += `<rect class="ac" x="${n(cx - 6)}" y="${n(y + alt[i] * 0.42 - 6)}" width="12" height="12" rx="2"/>`;
      fio.push([n(cx), n(y + alt[i] * 0.42)]);
    }
    x += w + 4;
  });
  if (braquetes) out += `<path class="ac" d="M${fio.map((p) => p.join(',')).join('L')}"/>`;
  return out;
}

const P = {
  // espelho clínico
  'clinico-geral': () => `
    <g transform="rotate(-24 200 250)">
      <circle cx="200" cy="170" r="62"/><circle class="ac" cx="200" cy="170" r="50"/>
      <path d="M194,232V236L190,246V392a10,10 0 0 0 20,0V246L206,236V232"/>
      <path d="M190,286H210M190,292H210M190,298H210"/>
    </g>${mais(306, 118)}`,

  // linha de sutura
  'cirurgia-oral': () => {
    let p = '';
    for (let i = 0; i < 7; i++) {
      const x = 104 + i * 32, y = 262 - Math.sin((i / 6) * Math.PI) * 26;
      p += `<path class="ac" d="M${x - 9},${n(y - 16)}L${x + 9},${n(y + 16)}"/>`;
    }
    return `<path d="M72,262C140,222 260,222 328,262"/>${p}
      <path d="M306,214A78,78 0 0 0 182,134"/><path d="M182,134l12,-2M182,134l4,11"/>
      <path d="M306,214C330,250 300,300 330,340" stroke-dasharray="2 6"/>`;
  },

  // restauração: parte do dente preenchida
  dentistica: () => `
    <defs><clipPath id="cp-dent"><path d="${DENTE}"/></clipPath></defs>
    <g clip-path="url(#cp-dent)"><circle class="pr-fill" cx="248" cy="138" r="52"/>
    <circle class="ac" cx="248" cy="138" r="52"/></g>
    <path d="${DENTE}"/>
    <path d="M300,110H336M300,110l-8,6" /><circle class="ac" cx="342" cy="110" r="3"/>`,

  // canais radiculares
  endodontia: () => `
    <path d="${DENTE}"/>
    <path class="ac" d="M176,176C176,158 190,156 200,162C210,156 224,158 224,176C224,196 216,204 216,226C216,262 222,300 222,324"/>
    <path class="ac" d="M176,176C176,196 184,204 184,226C184,262 178,300 178,324"/>
    <path d="M200,60V112" stroke-dasharray="2 6"/><circle class="ac" cx="200" cy="52" r="5"/>`,

  // faceta: lâmina fina à frente do dente
  estetica: () => `
    <path d="M150,150Q150,128 172,128H228Q250,128 250,150V300Q250,352 200,352Q150,352 150,300Z"/>
    <path class="ac" d="M172,172Q172,150 194,150H250Q272,150 272,172V322Q272,374 222,374Q172,374 172,322Z"/>
    ${estrela(300, 120, 16)}${estrela(118, 330, 9)}`,

  // proporções da face
  'harmonizacao-orofacial': () => `
    <ellipse cx="200" cy="246" rx="92" ry="126"/>
    <path d="M200,96V396" stroke-dasharray="2 6"/>
    <path class="ac" d="M96,204H304M96,288H304"/>
    <path d="M168,330Q200,348 232,330"/>
    <circle class="pr-dot" cx="200" cy="204" r="3.5"/><circle class="pr-dot" cx="200" cy="288" r="3.5"/>
    <circle cx="200" cy="246" r="150" stroke-dasharray="1 9"/>`,

  // implante: coroa, pilar e rosca
  'implante-dentario': () => {
    let r = '';
    for (let i = 0; i < 7; i++) {
      const y = 262 + i * 16, w = 30 - i * 2.4;
      r += `<path class="ac" d="M${n(200 - w)},${y}L${n(200 + w)},${y + 8}"/>`;
    }
    return `<path d="M148,150C148,112 176,104 200,118C224,104 252,112 252,150C252,176 244,192 238,206H162C156,192 148,176 148,150Z"/>
      <path d="M176,206L182,236H218L224,206"/>
      <path d="M170,236H230V250L212,380Q200,392 188,380L170,250Z"/>${r}`;
  },

  // dente de leite e o permanente que virá
  odontopediatria: () => `
    <path d="${DENTE}" stroke-dasharray="3 7"/>
    <g transform="translate(200 268) scale(.5) translate(-200 -230)"><path class="ac" style="stroke-width:2.4" d="${DENTE}"/></g>
    ${estrela(296, 128, 15)}${estrela(110, 186, 8)}${mais(300, 350, 6)}`,

  ortodontia: () => `${sorriso({ cy: 218, braquetes: true })}
    <path d="M70,340C140,372 260,372 330,340" stroke-dasharray="2 6"/>`,

  // linha da gengiva
  periodontia: () => {
    let d = '';
    [118, 200, 282].forEach((cx) => {
      d += `<path d="M${cx - 34},246V196Q${cx - 34},150 ${cx},150Q${cx + 34},150 ${cx + 34},196V246"/>
        <path d="M${cx - 24},262Q${cx - 20},350 ${cx},360Q${cx + 20},350 ${cx + 24},262" stroke-dasharray="2 6"/>`;
    });
    return `${d}<path class="ac" style="stroke-width:1.8" d="M60,262Q77,230 118,236T159,262Q177,230 200,236T241,262Q259,230 282,236T340,262"/>`;
  },

  // arcada vista de cima, um dente reabilitado
  'protese-dentaria': () => {
    let d = '';
    const N = 12;
    for (let i = 0; i < N; i++) {
      const a = Math.PI * (0.06 + (0.88 * i) / (N - 1));
      const x = 200 - Math.cos(a) * 108, y = 316 - Math.sin(a) * 176;
      const rot = (a * 180) / Math.PI - 90;
      const big = i < 3 || i > 8;
      d += `<ellipse ${i === 8 ? 'class="ac pr-fill"' : ''} cx="${n(x)}" cy="${n(y)}" rx="${big ? 19 : 14}" ry="${big ? 16 : 11}" transform="rotate(${n(rot)} ${n(x)} ${n(y)})"/>`;
    }
    return d + `<path d="M130,330Q200,300 270,330" stroke-dasharray="2 6"/>`;
  },

  // relógio: tempo de resposta
  'urgencia-odontologica': () => {
    let t = '';
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2, r1 = i % 3 ? 98 : 90;
      t += `<path d="M${n(200 + Math.sin(a) * r1)},${n(250 - Math.cos(a) * r1)}L${n(200 + Math.sin(a) * 106)},${n(250 - Math.cos(a) * 106)}"/>`;
    }
    return `<circle cx="200" cy="250" r="118"/>${t}
      <path class="ac" style="stroke-width:1.8" d="M200,250L158,204M200,250L252,214"/>
      <circle class="pr-dot" cx="200" cy="250" r="4"/>
      <path class="ac" style="stroke-width:2.2" d="M306,104H334M320,90V118"/>`;
  },
};

export function prancha(slug, { titulo = '' } = {}) {
  const corpo = (P[slug] || P['clinico-geral'])();
  return `<svg class="prancha-svg" viewBox="0 0 400 500" role="img" aria-label="${titulo}" preserveAspectRatio="xMidYMid meet"><g fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${corpo.replace(/\s+/g, ' ')}</g></svg>`;
}
