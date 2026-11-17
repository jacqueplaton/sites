#!/usr/bin/env node
// ==========================================================================
// SUTILY MAIS — gerador das páginas
// --------------------------------------------------------------------------
// Sem dependências:   node sutily-mais/_build/build.mjs
// Lê config.mjs (dados da clínica) e tratamentos.mjs (conteúdo) e escreve
// todas as páginas HTML, o sitemap e o robots.txt na pasta sutily-mais/.
// ==========================================================================
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { site } from './config.mjs';
import { tratamentos } from './tratamentos.mjs';
import { prancha } from './pranchas.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const SAIDA = path.resolve(AQUI, '..');
const IMG = JSON.parse(fs.readFileSync(path.join(AQUI, 'images.json'), 'utf8'));
const LOGO = JSON.parse(fs.readFileSync(path.join(AQUI, 'logo.json'), 'utf8'));
const V = '1'; // versão dos arquivos css/js (mude para forçar atualização do cache)

// ------------------------------------------------------------------ utilidades
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const dois = (i) => String(i).padStart(2, '0');
const abs = (p = '') => `${site.url}/${p}`;
const E = site.endereco;
const R = site.responsavel;
const local = `${E.bairro}, ${E.cidade}/${E.uf}`;

function enderecoLinhas() {
  const l1 = E.rua ? `${E.rua}, ${E.numero}${E.complemento ? ' · ' + E.complemento : ''}` : `Nº ${E.numero}`;
  const l2 = `${E.bairro} · ${E.cidade}/${E.uf}${E.cep ? ' · CEP ' + E.cep : ''}`;
  return [l1, l2];
}
const enderecoBusca = E.rua ? `${E.rua}, ${E.numero} - ${E.bairro}, ${E.cidade} - ${E.uf}` : site.google.busca;
const q = encodeURIComponent(enderecoBusca);
const linkMapa = site.google.perfil || `https://www.google.com/maps/search/?api=1&query=${q}`;
const linkRota = `https://www.google.com/maps/dir/?api=1&destination=${q}`;
const linkAvaliacoes = site.google.avaliacoes || linkMapa;
const mapaEmbed = `https://www.google.com/maps?q=${q}&output=embed`;

// Sem número confirmado, o link abre o WhatsApp para a pessoa escolher o
// contato — nunca aponta para um número inventado.
const wa = (msg) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(msg)}`;
const MSG = {
  geral: 'Olá! Vim pelo site da Sutily Mais e gostaria de agendar uma consulta.',
  trat: (nome) => `Olá! Vim pelo site da Sutily Mais e gostaria de agendar uma avaliação de ${nome}.`,
  urg: 'Olá! Vim pelo site da Sutily Mais e preciso de um atendimento de urgência.',
};

// ------------------------------------------------------------------ ícones
const ic = {
  seta: '<svg class="ic ic-seta" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>',
  wa: '<svg class="ic ic-wa" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2a8.7 8.7 0 0 0-7.5 13.2L3.4 20.6l4.3-1.1A8.7 8.7 0 1 0 12 3.2Z"/><path d="M9.2 8.2c-.6 1.6.2 3.4 1.8 5s3.3 2.4 4.9 1.9l.5-1.6-1.9-1-.9.8c-.9-.4-1.6-1.1-2-2l.8-.9-1-1.900Z"/></svg>',
  pino: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-5.8-6.5-10.7a6.5 6.5 0 0 1 13 0C18.5 15.2 12 21 12 21Z"/><circle cx="12" cy="10.2" r="2.3"/></svg>',
  play: '<svg class="ic ic-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5Z"/></svg>',
  pausa: '<svg class="ic ic-pausa" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>',
};

// logotipo original, vetorizado a partir do arquivo enviado pela clínica
const logoMolde = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><symbol id="sutily-logo" viewBox="0 0 ${LOGO.w} ${LOGO.h}"><path class="logo-ouro" fill-rule="evenodd" d="${LOGO.gold}"/><path class="logo-detalhe" fill-rule="evenodd" d="${LOGO.mint}"/></symbol></svg>`;
const logo = (cls = '') => `<svg class="logo-svg ${cls}" viewBox="0 0 ${LOGO.w} ${LOGO.h}" role="img" aria-label="Sutily Mais"><use href="#sutily-logo"/></svg>`;
const marca = (raiz) => `<a class="marca" href="${raiz || './'}" aria-label="Sutily Mais — Clínica Integrada, página inicial">${logo()}<span class="marca-ass">${site.assinatura}</span></a>`;

// imagem responsiva (AVIF + WebP)
function foto(nome, { alt, sizes, cls = '', lazy = true, attrs = '' }) {
  const m = IMG[nome];
  const set = (ext) => m.widths.map((w) => `${RAIZ}img/${nome}-${w}.${ext} ${w}w`).join(', ');
  const maior = m.widths[m.widths.length - 1];
  return `<picture><source type="image/avif" srcset="${set('avif')}" sizes="${sizes}"><source type="image/webp" srcset="${set('webp')}" sizes="${sizes}"><img class="${cls}" src="${RAIZ}img/${nome}-${maior}.webp" width="${m.w}" height="${m.h}" alt="${esc(alt)}" ${lazy ? 'loading="lazy" decoding="async"' : 'fetchpriority="high" decoding="sync"'} ${attrs}></picture>`;
}

// título com palavras animadas. *asteriscos* = itálico na cor de destaque
function palavras(txt) {
  let em = false, i = 0;
  return txt.split(/\s+/).filter(Boolean).map((tok) => {
    const dentro = tok.split('*').map((seg, k) => {
      if (k > 0) em = !em;
      return seg ? (em ? `<i class="it">${seg}</i>` : seg) : '';
    }).join('');
    return `<span class="pl"><span style="--i:${i++}">${dentro}</span></span>`;
  }).join(' ');
}
const semMarca = (txt) => txt.replace(/\*/g, '');

let UID = 0;
function figuraTrat(t, { vt = true, cls = '' } = {}) {
  const dentro = t.foto
    ? `<img src="${RAIZ}img/tratamentos/${t.foto}" alt="${esc(t.nome)}" loading="lazy" decoding="async">`
    : prancha(t.slug, { titulo: `Ilustração: ${t.nome}` }).replace(/cp-dent/g, `cp-dent-${UID++}`);
  return `<div class="prancha tom-${t.tom} ${cls}"${vt ? ` style="view-transition-name:t-${t.slug}"` : ''}>${dentro}</div>`;
}

const botaoWa = (msg, rotulo, local_, cls = 'btn-ouro') =>
  `<a class="btn ${cls}" href="${wa(msg)}" target="_blank" rel="noopener" data-wa="${local_}" data-magnetico>${ic.wa}<span>${rotulo}</span></a>`;

// ------------------------------------------------------------------ dados estruturados
const idClinica = abs('#clinica');
function ldClinica() {
  const o = {
    '@type': 'Dentist',
    '@id': idClinica,
    name: site.nomeCompleto,
    alternateName: ['Sutily Mais', 'Sutily Clínica Integrada'],
    url: abs(),
    image: abs('img/og-sutily-mais.jpg'),
    logo: abs('img/logo-sutily-mais.png'),
    address: {
      '@type': 'PostalAddress',
      ...(E.rua && { streetAddress: `${E.rua}, ${E.numero}${E.complemento ? ' - ' + E.complemento : ''} - ${E.bairro}` }),
      addressLocality: E.cidade,
      addressRegion: E.uf,
      ...(E.cep && { postalCode: E.cep }),
      addressCountry: 'BR',
    },
    areaServed: [{ '@type': 'City', name: 'Parnamirim' }, { '@type': 'Place', name: 'Nova Parnamirim' }],
    medicalSpecialty: 'Dentistry',
    availableService: tratamentos.map((t) => ({ '@type': 'MedicalProcedure', name: t.nome, url: abs(`tratamentos/${t.slug}/`) })),
    employee: { '@type': 'Person', name: R.nome, jobTitle: R.titulo, worksFor: { '@id': idClinica } },
  };
  if (site.telefone) o.telephone = site.telefone;
  if (site.email) o.email = site.email;
  if (site.geo.lat && site.geo.lng) o.geo = { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng };
  if (site.google.perfil) o.hasMap = site.google.perfil;
  const mesmo = [site.instagram, site.google.perfil].filter(Boolean);
  if (mesmo.length) o.sameAs = mesmo;
  const h = site.horarios.filter((x) => x.schema).map((x) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: x.schema.dias, opens: x.schema.abre, closes: x.schema.fecha }));
  if (h.length) o.openingHoursSpecification = h;
  return o;
}
const ldFaq = (faq) => ({ '@type': 'FAQPage', mainEntity: faq.map(([p, r]) => ({ '@type': 'Question', name: p, acceptedAnswer: { '@type': 'Answer', text: r } })) });
const ldTrilha = (itens) => ({ '@type': 'BreadcrumbList', itemListElement: itens.map(([nome, url], i) => ({ '@type': 'ListItem', position: i + 1, name: nome, item: url })) });
const ld = (grafo) => `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': grafo })}</script>`;

// ------------------------------------------------------------------ moldura da página
let RAIZ = '';
function pagina({ caminho, title, desc, corpo, grafo = [], classe = '', zona = 'claro', preload = '', tipo = 'geral', ogTipo = 'website', indexar = true }) {
  const noindex = site.previa || !indexar;
  const canon = abs(caminho);
  const nav = [
    ['A clínica', `${RAIZ || './'}#clinica`],
    ['Joycce Gomes', `${RAIZ || './'}#joycce`],
    ['Tratamentos', `${RAIZ}tratamentos/`],
    ['Contato', `${RAIZ || './'}#contato`],
  ];
  const cfg = { r: site.rastreamento, tipo, previa: site.previa };
  const [end1, end2] = enderecoLinhas();
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canon}">
<meta name="robots" content="${noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}">
<meta name="theme-color" content="#17362A">
<meta name="geo.region" content="BR-RN">
<meta name="geo.placename" content="${E.cidade}">
<meta name="format-detection" content="telephone=no">
<meta property="og:locale" content="pt_BR">
<meta property="og:type" content="${ogTipo}">
<meta property="og:site_name" content="${esc(site.nomeCompleto)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canon}">
<meta property="og:image" content="${abs('img/og-sutily-mais.jpg')}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${RAIZ}favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${RAIZ}img/icone-180.png">
<link rel="preload" href="${RAIZ}fonts/newsreader-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${RAIZ}fonts/jost.woff2" as="font" type="font/woff2" crossorigin>
${preload}<link rel="stylesheet" href="${RAIZ}css/site.css?v=${V}">
<script>document.documentElement.className='js';window.SUTILY=${JSON.stringify(cfg)};setTimeout(function(){if(!window.SUTILY_OK)document.documentElement.className=''},4000);</script>
${ld(grafo)}
</head>
<body class="${classe}" data-zona="${zona}">
<a class="pular" href="#conteudo">Pular para o conteúdo</a>
${logoMolde}
${site.previa ? '<p class="previa-aviso" role="note">Prévia para aprovação · dados marcados como “a confirmar” ainda não foram validados</p>' : ''}
<header class="topo" data-topo>
  <div class="topo-in">
    ${marca(RAIZ)}
    <nav class="nav" aria-label="Principal">
      ${nav.map(([n, h]) => `<a class="lk" href="${h}">${n}</a>`).join('\n      ')}
    </nav>
    <a class="btn btn-linha topo-cta" href="${wa(MSG.geral)}" target="_blank" rel="noopener" data-wa="topo">${ic.wa}<span>Agendar</span></a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu" data-menu-btn><span class="menu-btn-tx">Menu</span><span class="menu-btn-ic" aria-hidden="true"></span></button>
  </div>
</header>
<div class="menu" id="menu" data-menu hidden>
  <nav class="menu-nav" aria-label="Menu">
    ${nav.map(([n, h], i) => `<a href="${h}" style="--i:${i}"><span class="menu-n">${dois(i + 1)}</span>${n}</a>`).join('\n    ')}
  </nav>
  <div class="menu-pe">
    <p>${end1}<br>${end2}</p>
    ${botaoWa(MSG.geral, 'Agendar minha consulta', 'menu')}
  </div>
</div>
<main id="conteudo">
${corpo}
</main>
<footer class="rodape" data-zona="escuro">
  <div class="wrap rodape-grid">
    <div class="rodape-marca">
      ${marca(RAIZ)}
      <p>Odontologia integrada, atenção individualizada e cuidado em cada detalhe, em ${E.bairro}.</p>
    </div>
    <nav class="rodape-col" aria-label="Tratamentos">
      <h2 class="rot">Tratamentos</h2>
      <ul class="rodape-trat">${tratamentos.map((t) => `<li><a class="lk" href="${RAIZ}tratamentos/${t.slug}/">${t.nome}</a></li>`).join('')}</ul>
    </nav>
    <div class="rodape-col">
      <h2 class="rot">Onde estamos</h2>
      <address>${end1}<br>${end2}</address>
      ${site.telefone ? `<p><a class="lk" href="tel:${site.telefone.replace(/\D/g, '')}" data-evento="telefone">${site.telefone}</a></p>` : ''}
      <p><a class="lk" href="${linkRota}" target="_blank" rel="noopener" data-evento="rota">Como chegar</a></p>
      ${site.instagram ? `<p><a class="lk" href="${site.instagram}" target="_blank" rel="noopener me">Instagram</a></p>` : ''}
    </div>
  </div>
  <div class="wrap rodape-base">
    <p>© <span data-ano>2026</span> ${site.nomeCompleto}${site.cnpj ? ` · CNPJ ${site.cnpj}` : ''}</p>
    <p>Responsável técnica: ${R.nome} · ${R.cro ? R.cro : site.previa ? '<span class="pendente">CRO a preencher</span>' : R.titulo}${R.croClinica ? ` · ${R.croClinica}` : ''}</p>
    <p><a class="lk" href="${RAIZ}politica-de-privacidade/">Política de privacidade</a> · <button class="lk" type="button" data-cookies-abrir>Preferências de cookies</button></p>
  </div>
</footer>
<a class="barra-cta" href="${wa(MSG.geral)}" target="_blank" rel="noopener" data-wa="barra-mobile" data-barra>${ic.wa}<span>Agendar pelo WhatsApp</span></a>
<div class="cookies" role="dialog" aria-live="polite" aria-label="Aviso de cookies" data-cookies hidden>
  <p>Usamos cookies de medição e de anúncios para entender como o site é usado. Nenhum dado de saúde é coletado. <a class="lk" href="${RAIZ}politica-de-privacidade/">Saiba mais</a></p>
  <div class="cookies-acoes">
    <button class="btn btn-linha btn-p" type="button" data-cookies-nao>Recusar</button>
    <button class="btn btn-ouro btn-p" type="button" data-cookies-sim>Aceitar</button>
  </div>
</div>
<div class="cursor" aria-hidden="true" data-cursor><span>Ver</span></div>
<script src="${RAIZ}js/site.js?v=${V}" defer></script>
</body>
</html>
`;
}

// ------------------------------------------------------------------ blocos compartilhados
function cartao(t, i) {
  return `<li class="tcard" data-rev style="--d:${(i % 3) * 90}ms">
    <a href="${RAIZ}tratamentos/${t.slug}/" data-cursor-alvo>
      <div class="tcard-fig">
        ${figuraTrat(t)}
        <p class="tcard-res"><span>${t.resumo}</span></p>
      </div>
      <div class="tcard-meta"><span class="tcard-n">${dois(i + 1)}</span><h3><span class="mais" aria-hidden="true">+</span> ${t.nome}</h3>${ic.seta}</div>
    </a>
  </li>`;
}

function blocoFaq(faq, titulo = 'Perguntas frequentes') {
  return `<div class="faq">
    <h2 class="t2" data-rev>${titulo}</h2>
    <div class="faq-lista">
      ${faq.map(([p, r]) => `<details class="faq-item" data-rev><summary><span>${p}</span><i aria-hidden="true"></i></summary><div class="faq-r"><p>${r}</p></div></details>`).join('\n      ')}
    </div>
  </div>`;
}

function blocoFinal(titulo, msg, rotulo, local_) {
  return `<section class="final" data-zona="verde">
  <div class="wrap">
    <p class="rot" data-rev>Agendamento</p>
    <h2 class="t1 final-t" data-pal>${palavras(titulo)}</h2>
    <div class="final-acoes" data-rev>
      ${botaoWa(msg, rotulo, local_)}
      <p>${enderecoLinhas().join(' · ')}</p>
    </div>
    <div class="final-marca" aria-hidden="true">${logo()}</div>
  </div>
</section>`;
}

// ------------------------------------------------------------------ INÍCIO
function home() {
  RAIZ = '';
  const faq = [
    ['Como faço para agendar uma consulta?', 'O agendamento é feito pelo WhatsApp. Basta tocar em “Agendar minha consulta”, contar o que você procura e a equipe encontra um horário.'],
    ['Onde fica a Sutily Mais?', `A clínica fica em ${E.bairro}, ${E.cidade}/${E.uf}${E.rua ? `, na ${E.rua}, ${E.numero}` : `, no nº ${E.numero}`}. Na seção “Onde estamos” você encontra o mapa e o botão de rota.`],
    ['Quais especialidades a clínica oferece?', `São doze áreas da odontologia em um só endereço: ${tratamentos.map((t) => t.nome.toLowerCase()).join(', ').replace(/, ([^,]*)$/, ' e $1')}.`],
    ['A clínica atende crianças?', 'Sim. A odontopediatria é uma das especialidades da Sutily Mais, com atendimento voltado a bebês, crianças e adolescentes.'],
    ['Estou com dor. Vocês atendem urgência?', 'Entre em contato pelo WhatsApp e descreva o que está sentindo. A equipe orienta você e verifica a disponibilidade de atendimento dentro do horário de funcionamento.'],
    ['Preciso saber qual especialidade procurar antes de agendar?', 'Não. Na primeira avaliação, sua saúde bucal é examinada por inteiro e, se for o caso, você é encaminhado para a especialidade indicada dentro da própria clínica.'],
  ];
  const slots = [
    ['Formação acadêmica', R.formacao],
    ['Inscrição no CRO', R.cro],
    ['Tempo de experiência', R.experiencia],
    ['Por que a Sutily Mais', R.motivo],
    ['Filosofia de atendimento', R.filosofia],
    ['Marcos da trajetória', R.marcos.map((m) => `${m.ano} — ${m.texto}`).join(' · ')],
  ].filter(([, v]) => v || site.previa);
  const [end1, end2] = enderecoLinhas();

  const corpo = `
<section class="hero" data-zona="escuro">
  <div class="wrap hero-grid">
    <div class="hero-tx">
      <p class="rot hero-rot"><span>${site.assinatura}</span><span>${E.bairro} · ${E.cidade}/${E.uf}</span></p>
      <h1 class="hero-t">${palavras('Seu sorriso merece um cuidado que vai *além.*')}</h1>
      <p class="hero-sub">Odontologia integrada, atenção individualizada e cuidado em cada detalhe, em ${E.bairro}.</p>
      <div class="hero-acoes">
        ${botaoWa(MSG.geral, 'Agendar minha consulta', 'hero')}
        <a class="btn btn-texto" href="#clinica"><span>Conheça a Sutily Mais</span>${ic.seta}</a>
      </div>
    </div>
    <figure class="hero-fig">
      <div class="hero-arco" aria-hidden="true"></div>
      <div class="hero-foto"><div class="par" data-par="0.05">
        ${foto('joycce-retrato', { alt: 'Joycce Gomes, cirurgiã-dentista, sorrindo em seu consultório na Sutily Mais', sizes: '(min-width: 1000px) 40vw, 86vw', lazy: false })}
      </div></div>
      <figcaption class="hero-leg"><strong>${R.nome}</strong><span>${R.titulo}</span></figcaption>
    </figure>
  </div>
  <div class="wrap hero-pe">
    <p><strong>12</strong> especialidades em um só endereço</p>
    <a class="rolar" href="#clinica" aria-label="Rolar para conhecer a clínica"><span>Role</span><i aria-hidden="true"></i></a>
  </div>
</section>

<section class="manifesto" id="clinica" data-zona="claro">
  <div class="wrap">
    <h2 class="rot" data-rev>A clínica</h2>
    <p class="manifesto-t" data-pal>${palavras('Na Sutily Mais, diferentes áreas da odontologia se encontram em um mesmo lugar — para que você seja cuidado *por inteiro*, com tempo, escuta e atenção a cada detalhe.')}</p>
    <div class="manifesto-grid">
      <figure class="manifesto-fig" data-mask>
        <div class="quadro"><div class="par" data-par="0.08">${foto('fachada', { alt: `Fachada da Sutily Mais Clínica Integrada, nº ${E.numero}, em ${E.bairro}`, sizes: '(min-width: 1000px) 30vw, 80vw' })}</div></div>
        <figcaption>Nossa casa em ${E.bairro}, nº ${E.numero}</figcaption>
      </figure>
      <ol class="pilares">
        <li data-rev><span class="pilar-n">01</span><div><h3>Proximidade</h3><p>Um atendimento que começa pela escuta. Antes de qualquer procedimento, queremos entender você, a sua história e o que espera do tratamento.</p></div></li>
        <li data-rev><span class="pilar-n">02</span><div><h3>Atenção individualizada</h3><p>Cada pessoa tem necessidades, ritmo e expectativas próprios. O cuidado é planejado caso a caso, com explicações claras em cada etapa.</p></div></li>
        <li data-rev><span class="pilar-n">03</span><div><h3>Visão integrada</h3><p>Doze áreas da odontologia reunidas em um só endereço, para que prevenção, função e estética sejam pensadas em conjunto.</p></div></li>
      </ol>
    </div>
  </div>
</section>

<div class="faixa" data-zona="claro" aria-hidden="true">
  <div class="faixa-tr" data-faixa>${[0, 1].map(() => tratamentos.map((t) => `<span><i>+</i>${t.nome}</span>`).join('')).join('')}</div>
</div>

<section class="filme" id="filme" data-zona="escuro">
  <div class="wrap">
    <header class="filme-cab">
      <p class="rot" data-rev>Filme · três cenas</p>
      <h2 class="t1" data-pal>${palavras('A Sutily Mais em *movimento.*')}</h2>
    </header>
    <div class="filme-palco" data-mask data-filme>
      <video muted playsinline loop preload="none" data-poster-h="${RAIZ}media/filme-poster-16x9.jpg" data-poster-v="${RAIZ}media/filme-poster-9x16.jpg" data-h="${RAIZ}media/filme-sutily-16x9.mp4" data-v="${RAIZ}media/filme-sutily-9x16.mp4" width="1280" height="720" aria-label="Filme em três cenas: a profissional, o cuidado e a clínica. Sem áudio."></video>
      <noscript><img src="${RAIZ}media/filme-poster-16x9.jpg" width="1280" height="720" alt="Quadro do filme: Joycce Gomes, cirurgiã-dentista à frente da Sutily Mais" loading="lazy"></noscript>
      <button class="filme-btn" type="button" data-filme-btn aria-label="Reproduzir o filme">${ic.play}${ic.pausa}</button>
    </div>
    <ol class="filme-cenas">
      <li data-rev><span class="rot">Cena 1</span><h3>A profissional</h3><p>${R.nome}, ${R.titulo.toLowerCase()} à frente da clínica.</p></li>
      <li data-rev><span class="rot">Cena 2</span><h3>O cuidado</h3><p>Atenção a cada gesto e a cada detalhe do atendimento.</p></li>
      <li data-rev><span class="rot">Cena 3</span><h3>A clínica</h3><p>Nossa casa em ${E.bairro}, de portas abertas para você.</p></li>
    </ol>
    <p class="filme-nota">Filme sem áudio, montado a partir de fotografias reais da clínica.</p>
  </div>
</section>

<section class="historia" id="joycce" data-zona="menta">
  <div class="wrap historia-grid">
    <figure class="historia-fig" data-mask>
      <div class="quadro"><div class="par" data-par="0.07">${foto('joycce-historia', { alt: 'Joycce Gomes em sua mesa de trabalho, com o consultório ao fundo', sizes: '(min-width: 1000px) 38vw, 92vw' })}</div></div>
    </figure>
    <div class="historia-tx">
      <p class="rot" data-rev>Quem cuida</p>
      <h2 class="t1" data-pal>${palavras('Por trás de cada sorriso, existe uma história de *cuidado.*')}</h2>
      <div class="historia-corpo" data-rev>
        <p class="lead">A Sutily Mais tem à sua frente a cirurgiã-dentista Joycce Gomes. Sua proposta de atendimento valoriza a proximidade, a atenção individualizada e uma visão integrada da saúde bucal.</p>
        <p>Na clínica, diferentes áreas da odontologia se encontram em um ambiente pensado para acolher cada paciente com respeito e cuidado.</p>
      </div>
      <p class="assinatura" data-rev><span class="assinatura-n">${R.nome}</span><span>${R.titulo}${R.cro ? ` · ${R.cro}` : ''}</span></p>
      ${slots.length ? `<dl class="trajetoria" data-rev>${slots.map(([k, v]) => `<div class="${v ? '' : 'vazio'}"><dt>${k}</dt><dd>${v ? esc(v) : 'A preencher'}</dd></div>`).join('')}</dl>` : ''}
    </div>
  </div>
</section>

<section class="trats" id="tratamentos" data-zona="claro">
  <div class="wrap">
    <header class="trats-cab">
      <div>
        <p class="rot" data-rev>Especialidades</p>
        <h2 class="t1" data-pal>${palavras('Doze áreas, um só *cuidado.*')}</h2>
      </div>
      <p data-rev>Da primeira consulta à reabilitação completa, tudo o que o seu sorriso precisa acontece no mesmo lugar, com profissionais que conversam entre si.</p>
    </header>
    <ul class="trats-grid">
      ${tratamentos.map(cartao).join('\n      ')}
    </ul>
    <p class="trats-pe" data-rev><a class="btn btn-texto" href="${RAIZ}tratamentos/"><span>Ver todas as especialidades</span>${ic.seta}</a></p>
  </div>
</section>

<section class="visita" data-zona="verde">
  <div class="wrap">
    <header class="visita-cab">
      <p class="rot" data-rev>Primeira consulta</p>
      <h2 class="t1" data-pal>${palavras('Como começa o *seu* cuidado.')}</h2>
    </header>
    <div class="visita-linha" aria-hidden="true"><i data-progresso></i></div>
    <ol class="visita-passos">
      <li data-rev style="--d:0ms"><span class="passo-n">01</span><h3>Você chama no WhatsApp</h3><p>Conte, com as suas palavras, o que você procura. A equipe orienta e encontra um horário.</p></li>
      <li data-rev style="--d:90ms"><span class="passo-n">02</span><h3>Avaliação individual</h3><p>Na consulta, você é ouvido com calma e passa por uma avaliação da sua saúde bucal.</p></li>
      <li data-rev style="--d:180ms"><span class="passo-n">03</span><h3>Plano explicado com clareza</h3><p>Você conhece as possibilidades, as etapas e tira todas as dúvidas antes de decidir.</p></li>
      <li data-rev style="--d:270ms"><span class="passo-n">04</span><h3>Acompanhamento</h3><p>O cuidado continua depois do procedimento, com retornos e orientações para o dia a dia.</p></li>
    </ol>
  </div>
</section>

<section class="voz" data-zona="claro">
  <div class="wrap voz-grid">
    <div class="voz-tx">
      <p class="rot" data-rev>Avaliações</p>
      <h2 class="t1" data-pal>${palavras('A opinião de quem já passou *por aqui.*')}</h2>
      <p data-rev>As avaliações da Sutily Mais são escritas pelos próprios pacientes e publicadas no Google. Preferimos que você leia na fonte, sem cortes e sem edição.</p>
      <div class="voz-acoes" data-rev>
        <a class="btn btn-escuro" href="${linkAvaliacoes}" target="_blank" rel="noopener" data-evento="avaliacoes" data-magnetico><span>Ler avaliações no Google</span>${ic.seta}</a>
        ${site.google.avaliar ? `<a class="btn btn-texto" href="${site.google.avaliar}" target="_blank" rel="noopener" data-evento="avaliar"><span>Deixar minha avaliação</span>${ic.seta}</a>` : ''}
      </div>
    </div>
    ${blocoFaq(faq, 'Dúvidas frequentes')}
  </div>
</section>

<section class="onde" id="contato" data-zona="menta">
  <div class="wrap onde-grid">
    <div class="onde-tx">
      <p class="rot" data-rev>Onde estamos</p>
      <h2 class="t1" data-pal>${palavras(`Em ${E.bairro}, *perto* de você.`)}</h2>
      <dl class="nap" data-rev>
        <div><dt>Endereço</dt><dd><address>${end1}<br>${end2}</address>${!E.rua && site.previa ? '<span class="pendente">Logradouro e CEP a confirmar</span>' : ''}</dd></div>
        ${site.horarios.length ? `<div><dt>Horários</dt><dd>${site.horarios.map((h) => `${h.dias}: ${h.horas}`).join('<br>')}</dd></div>` : site.previa ? '<div><dt>Horários</dt><dd><span class="pendente">A confirmar</span></dd></div>' : ''}
        <div><dt>Agendamento</dt><dd><a class="lk" href="${wa(MSG.geral)}" target="_blank" rel="noopener" data-wa="contato">WhatsApp${site.telefone ? ` · ${site.telefone}` : ''}</a>${!site.whatsapp && site.previa ? '<span class="pendente">Número a confirmar</span>' : ''}</dd></div>
      </dl>
      <div class="onde-acoes" data-rev>
        <a class="btn btn-escuro" href="${linkRota}" target="_blank" rel="noopener" data-evento="rota" data-magnetico>${ic.pino}<span>Traçar rota</span></a>
        <a class="btn btn-texto" href="${linkMapa}" target="_blank" rel="noopener" data-evento="mapa"><span>Abrir no Google Maps</span>${ic.seta}</a>
      </div>
    </div>
    <div class="mapa" data-mask data-mapa="${mapaEmbed}">
      <div class="mapa-capa">
        ${foto('fachada', { alt: '', sizes: '(min-width: 1000px) 44vw, 92vw' })}
        <button class="btn btn-ouro" type="button" data-mapa-btn>${ic.pino}<span>Carregar mapa</span></button>
        <p>O mapa é carregado do Google Maps apenas quando você pedir.</p>
      </div>
    </div>
  </div>
</section>

${blocoFinal('Seu próximo sorriso começa com *uma conversa.*', MSG.geral, 'Agendar minha consulta', 'final')}`;

  const m = IMG['joycce-retrato'];
  const preload = `<link rel="preload" as="image" type="image/avif" imagesrcset="${m.widths.map((w) => `img/joycce-retrato-${w}.avif ${w}w`).join(', ')}" imagesizes="(min-width: 1000px) 40vw, 86vw" fetchpriority="high">\n`;
  return pagina({
    caminho: '',
    title: `Dentista em ${E.bairro} | Sutily Mais — Clínica Integrada`,
    desc: `Clínica odontológica em ${E.bairro}, ${E.cidade}/${E.uf}. Doze especialidades, atenção individualizada e cuidado em cada detalhe. Agende sua consulta pelo WhatsApp.`,
    corpo, preload, classe: 'pg-home', zona: 'escuro', tipo: 'inicio',
    grafo: [
      ldClinica(),
      { '@type': 'WebSite', '@id': abs('#site'), url: abs(), name: site.nomeCompleto, inLanguage: 'pt-BR', publisher: { '@id': idClinica } },
      ldFaq(faq),
    ],
  });
}

// ------------------------------------------------------------------ LISTA DE TRATAMENTOS
function listaTratamentos() {
  RAIZ = '../';
  const corpo = `
<section class="cab-pg" data-zona="menta">
  <div class="wrap">
    <nav class="trilha" aria-label="Você está em"><a class="lk" href="../">Início</a><span aria-hidden="true">/</span><span aria-current="page">Tratamentos</span></nav>
    <h1 class="t0">${palavras(`Tratamentos odontológicos em *${E.bairro}*`)}</h1>
    <p class="cab-lead">Doze especialidades reunidas em um só endereço, para cuidar da sua saúde bucal por inteiro. Escolha uma área para entender quando ela é indicada e como funciona o atendimento.</p>
  </div>
</section>
<section class="indice" data-zona="claro">
  <div class="wrap indice-grid">
    <div class="indice-previa" aria-hidden="true" data-indice-previa>
      ${tratamentos.map((t, i) => figuraTrat(t, { vt: false, cls: i === 0 ? 'ativa' : '' })).join('')}
    </div>
    <ol class="indice-lista">
      ${tratamentos.map((t, i) => `<li data-rev><a href="${t.slug}/" data-indice="${i}"><span class="indice-n">${dois(i + 1)}</span><span class="indice-nome"><span class="mais" aria-hidden="true">+</span> ${t.nome}</span><span class="indice-res">${t.resumo}</span>${ic.seta}</a></li>`).join('\n      ')}
    </ol>
  </div>
</section>
${blocoFinal('Não sabe por onde começar? *Fale com a gente.*', MSG.geral, 'Agendar uma avaliação', 'final-lista')}`;
  return pagina({
    caminho: 'tratamentos/',
    title: `Tratamentos Odontológicos em ${E.bairro} | Sutily Mais`,
    desc: `Conheça as 12 especialidades da Sutily Mais em ${E.bairro}, ${E.cidade}/${E.uf}: clínico geral, ortodontia, implantes, estética, odontopediatria e mais.`,
    corpo, classe: 'pg-lista', zona: 'menta', tipo: 'lista',
    grafo: [
      ldTrilha([['Início', abs()], ['Tratamentos', abs('tratamentos/')]]),
      { '@type': 'CollectionPage', '@id': abs('tratamentos/#pagina'), url: abs('tratamentos/'), name: `Tratamentos odontológicos em ${E.bairro}`, inLanguage: 'pt-BR', isPartOf: { '@id': abs('#site') }, about: { '@id': idClinica } },
      { '@type': 'ItemList', itemListElement: tratamentos.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.nome, url: abs(`tratamentos/${t.slug}/`) })) },
    ],
  });
}

// ------------------------------------------------------------------ PÁGINA DE TRATAMENTO
function paginaTratamento(t, i) {
  RAIZ = '../../';
  const msg = t.slug === 'urgencia-odontologica' ? MSG.urg : MSG.trat(t.nome);
  const rotulo = t.slug === 'urgencia-odontologica' ? 'Falar com a clínica agora' : 'Agendar minha avaliação';
  const ant = tratamentos[(i + tratamentos.length - 1) % tratamentos.length];
  const prox = tratamentos[(i + 1) % tratamentos.length];
  const rel = t.rel.map((s) => tratamentos.find((x) => x.slug === s));
  const url = abs(`tratamentos/${t.slug}/`);
  const real = t.slug === 'cirurgia-oral' ? { n: 'instrumentos', alt: 'Instrumentais odontológicos organizados sobre a bandeja clínica', leg: 'Instrumentais preparados para o atendimento na Sutily Mais.' }
    : t.slug === 'clinico-geral' ? { n: 'cuidado', alt: 'Profissional da Sutily Mais realizando atendimento odontológico', leg: 'Atendimento na Sutily Mais.' } : null;

  const corpo = `
<section class="cab-t" data-zona="menta">
  <div class="wrap cab-t-grid">
    <div class="cab-t-tx">
      <nav class="trilha" aria-label="Você está em"><a class="lk" href="../../">Início</a><span aria-hidden="true">/</span><a class="lk" href="../">Tratamentos</a><span aria-hidden="true">/</span><span aria-current="page">${t.nome}</span></nav>
      <p class="rot">Especialidade ${dois(i + 1)} <span>/ 12</span></p>
      <h1 class="t0">${palavras(t.h1)}</h1>
      <p class="cab-lead">${t.lead}</p>
      <div class="cab-acoes">
        ${botaoWa(msg, rotulo, 'tratamento-topo')}
        <a class="btn btn-texto" href="#duvidas"><span>Dúvidas frequentes</span>${ic.seta}</a>
      </div>
    </div>
    <figure class="cab-t-fig">${figuraTrat(t)}<figcaption>${t.foto ? t.nome : `Prancha ${dois(i + 1)} · ilustração`}</figcaption></figure>
  </div>
</section>

<section class="artigo" data-zona="claro">
  <div class="wrap artigo-grid">
    <article class="artigo-tx">
      <h2 class="t2" data-rev>O que é ${t.nome.toLowerCase().startsWith('urg') ? 'uma urgência odontológica' : 'e do que cuida'}</h2>
      ${t.texto.map((p, k) => `<p ${k === 0 ? 'class="lead" ' : ''}data-rev>${p}</p>`).join('\n      ')}
      ${t.aviso ? `<p class="aviso" role="note" data-rev><strong>Atenção.</strong> ${t.aviso}</p>` : ''}
      ${real ? `<figure class="artigo-fig" data-mask><div class="quadro"><div class="par" data-par="0.05">${foto(real.n, { alt: real.alt, sizes: '(min-width: 1000px) 46vw, 92vw' })}</div></div><figcaption>${real.leg}</figcaption></figure>` : ''}

      <h2 class="t2" data-rev>${t.indicTitulo}</h2>
      <ul class="lista-mais">
        ${t.indic.map((x) => `<li data-rev><span class="mais" aria-hidden="true">+</span>${x}</li>`).join('\n        ')}
      </ul>

      <h2 class="t2" data-rev>Como é o atendimento na Sutily Mais</h2>
      <ol class="etapas">
        ${t.etapas.map(([a, b], k) => `<li data-rev><span class="passo-n">${dois(k + 1)}</span><div><h3>${a}</h3><p>${b}</p></div></li>`).join('\n        ')}
      </ol>
      <p class="nota" data-rev>Conteúdo informativo, que não substitui a consulta. Os procedimentos indicados para o seu caso são definidos somente após avaliação presencial.</p>
    </article>
    <aside class="lateral" aria-label="Agendamento">
      <div class="lateral-cx">
        <p class="rot">${t.nome}</p>
        <p class="lateral-t">Converse com a equipe e agende a sua avaliação.</p>
        ${botaoWa(msg, 'Chamar no WhatsApp', 'tratamento-lateral')}
        <p class="lateral-end">${enderecoLinhas().join('<br>')}</p>
        <a class="lk" href="${linkRota}" target="_blank" rel="noopener" data-evento="rota">Como chegar</a>
      </div>
    </aside>
  </div>
</section>

<section class="duvidas" id="duvidas" data-zona="menta">
  <div class="wrap duvidas-in">${blocoFaq(t.faq, `Dúvidas sobre ${t.nome.toLowerCase()}`)}</div>
</section>

<section class="rel" data-zona="claro">
  <div class="wrap">
    <header class="rel-cab">
      <p class="rot" data-rev>Odontologia integrada</p>
      <h2 class="t1" data-pal>${palavras('Cuidados que se *conectam.*')}</h2>
    </header>
    <ul class="trats-grid rel-grid">
      ${rel.map((r) => cartao(r, tratamentos.indexOf(r))).join('\n      ')}
    </ul>
    <nav class="vizinhos" aria-label="Outras especialidades">
      <a href="../${ant.slug}/" rel="prev"><span class="rot">Anterior</span><strong>${ant.nome}</strong></a>
      <a href="../"><span class="rot">Índice</span><strong>Todas as 12</strong></a>
      <a href="../${prox.slug}/" rel="next"><span class="rot">Próxima</span><strong>${prox.nome}</strong></a>
    </nav>
  </div>
</section>
${blocoFinal(t.slug === 'urgencia-odontologica' ? 'Precisa de ajuda *agora?*' : `Vamos conversar sobre *${t.nome.toLowerCase()}?*`, msg, rotulo, 'tratamento-final')}`;

  return pagina({
    caminho: `tratamentos/${t.slug}/`,
    title: t.title, desc: t.desc, corpo, classe: 'pg-trat', zona: 'menta', tipo: 'tratamento', ogTipo: 'article',
    grafo: [
      ldTrilha([['Início', abs()], ['Tratamentos', abs('tratamentos/')], [t.nome, url]]),
      { '@type': 'MedicalWebPage', '@id': `${url}#pagina`, url, name: semMarca(t.h1), description: t.desc, inLanguage: 'pt-BR', isPartOf: { '@id': abs('#site') }, about: { '@type': 'MedicalProcedure', name: t.nome }, audience: { '@type': 'Patient' }, publisher: { '@id': idClinica } },
      { '@type': 'Dentist', '@id': idClinica, name: site.nomeCompleto, url: abs(), address: { '@type': 'PostalAddress', addressLocality: E.cidade, addressRegion: E.uf, addressCountry: 'BR' } },
      ldFaq(t.faq),
    ],
  });
}

// ------------------------------------------------------------------ PRIVACIDADE e 404
function privacidade() {
  RAIZ = '../';
  const quem = site.razaoSocial || site.nomeCompleto;
  const corpo = `
<section class="cab-pg" data-zona="menta">
  <div class="wrap">
    <nav class="trilha" aria-label="Você está em"><a class="lk" href="../">Início</a><span aria-hidden="true">/</span><span aria-current="page">Política de privacidade</span></nav>
    <h1 class="t0">${palavras('Política de *privacidade*')}</h1>
    <p class="cab-lead">Como este site trata as suas informações, em linguagem simples e de acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).</p>
  </div>
</section>
<section class="legal" data-zona="claro">
  <div class="wrap legal-in">
    <h2 class="t2">Quem é responsável</h2>
    <p>${esc(quem)}${site.cnpj ? `, CNPJ ${site.cnpj}` : ''}, com sede em ${local}, é a controladora dos dados tratados por meio deste site.</p>
    <h2 class="t2">O que este site coleta</h2>
    <p>Este site não possui formulários e não solicita nome, telefone, e-mail ou qualquer informação de saúde. O agendamento acontece pelo WhatsApp: ao tocar em um botão de agendamento, você é levado ao aplicativo e decide o que enviar. A conversa segue as regras de privacidade do próprio WhatsApp e é usada pela clínica apenas para atender você.</p>
    <h2 class="t2">Cookies e medição</h2>
    <p>Com a sua autorização, utilizamos ferramentas de medição e de publicidade (Google Analytics, Google Ads e Meta) para entender de forma agregada como o site é usado e avaliar o resultado das campanhas. Essas ferramentas registram dados como páginas visitadas, cliques nos botões de contato, tipo de dispositivo e origem da visita.</p>
    <p>Nenhuma dessas ferramentas é carregada antes de você aceitar. Não enviamos a elas informações sobre sintomas, tratamentos de interesse ou qualquer dado de saúde. Você pode rever a sua escolha a qualquer momento em <button class="lk" type="button" data-cookies-abrir>Preferências de cookies</button>.</p>
    <h2 class="t2">Mapa</h2>
    <p>O mapa do Google só é carregado quando você toca em “Carregar mapa”. A partir desse momento, aplicam-se as políticas do Google Maps.</p>
    <h2 class="t2">Seus direitos</h2>
    <p>Você pode solicitar a confirmação da existência de tratamento, o acesso, a correção ou a exclusão dos seus dados, além de revogar o consentimento. Para isso, fale com a clínica pelos canais de contato informados neste site.</p>
    <h2 class="t2">Atualizações</h2>
    <p>Esta política pode ser atualizada para refletir mudanças no site ou na legislação. A versão vigente é sempre a publicada nesta página.</p>
  </div>
</section>`;
  return pagina({
    caminho: 'politica-de-privacidade/',
    title: 'Política de Privacidade | Sutily Mais',
    desc: 'Saiba como o site da Sutily Mais trata as suas informações, quais cookies utiliza e como exercer os seus direitos previstos na LGPD.',
    corpo, classe: 'pg-legal', zona: 'menta',
    grafo: [ldTrilha([['Início', abs()], ['Política de privacidade', abs('politica-de-privacidade/')]])],
  });
}

function naoEncontrada() {
  RAIZ = `${new URL(site.url).pathname.replace(/\/$/, '')}/`; // caminhos absolutos: a 404 é servida em qualquer nível
  const corpo = `
<section class="cab-pg erro" data-zona="escuro">
  <div class="wrap">
    <p class="rot">Erro 404</p>
    <h1 class="t0">${palavras('Esta página saiu para *uma consulta.*')}</h1>
    <p class="cab-lead">O endereço que você procurou não existe ou mudou de lugar.</p>
    <div class="cab-acoes"><a class="btn btn-ouro" href="${RAIZ}"><span>Voltar ao início</span>${ic.seta}</a><a class="btn btn-texto" href="${RAIZ}tratamentos/"><span>Ver tratamentos</span>${ic.seta}</a></div>
  </div>
</section>`;
  return pagina({ caminho: '404.html', title: 'Página não encontrada | Sutily Mais', desc: 'Página não encontrada.', corpo, classe: 'pg-erro', zona: 'escuro', indexar: false });
}

// ------------------------------------------------------------------ escrita
function escrever(rel, conteudo) {
  const alvo = path.join(SAIDA, rel);
  fs.mkdirSync(path.dirname(alvo), { recursive: true });
  fs.writeFileSync(alvo, conteudo);
}

const paginas = [['index.html', home(), '', 1.0], ['tratamentos/index.html', listaTratamentos(), 'tratamentos/', 0.9]];
tratamentos.forEach((t, i) => paginas.push([`tratamentos/${t.slug}/index.html`, paginaTratamento(t, i), `tratamentos/${t.slug}/`, 0.8]));
paginas.push(['politica-de-privacidade/index.html', privacidade(), 'politica-de-privacidade/', 0.2]);
paginas.forEach(([arq, html]) => escrever(arq, html));
escrever('404.html', naoEncontrada());

const hoje = new Date().toISOString().slice(0, 10);
escrever('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paginas.map(([, , c, p]) => `  <url><loc>${abs(c)}</loc><lastmod>${hoje}</lastmod><priority>${p.toFixed(1)}</priority></url>`).join('\n')}\n</urlset>\n`);
escrever('robots.txt', site.previa
  ? `# Prévia para aprovação. As páginas levam <meta name="robots" content="noindex">.\nUser-agent: *\nAllow: /\n`
  : `User-agent: *\nAllow: /\n\nSitemap: ${abs('sitemap.xml')}\n`);

// conferência: avisa o que falta confirmar antes de publicar
const faltas = [
  [!site.whatsapp, 'WhatsApp'], [!site.telefone, 'telefone'], [!E.rua, 'logradouro'], [!E.cep, 'CEP'],
  [!site.horarios.length, 'horários'], [!site.google.perfil, 'link do Perfil no Google'], [!site.google.avaliacoes, 'link das avaliações'],
  [!R.cro, 'número do CRO'], [!Object.values(site.rastreamento).some(Boolean), 'códigos de rastreamento'],
].filter(([f]) => f).map(([, n]) => n);
console.log(`✓ ${paginas.length + 1} páginas geradas em ${path.relative(process.cwd(), SAIDA) || '.'}  (prévia: ${site.previa ? 'SIM — noindex' : 'não'})`);
if (faltas.length) console.log(`• A confirmar em config.mjs: ${faltas.join(', ')}`);
