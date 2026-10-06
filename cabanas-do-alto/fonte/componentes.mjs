// Peças reutilizadas pelas páginas. Cada função devolve uma string de HTML.
import { site, cabanas, fotos, mensagens, linkWhatsApp } from './dados.mjs';

// Escapa texto para HTML.
export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// --------------------------------------------------------------------------
// Ícones (SVG inline, sem dependências)
// --------------------------------------------------------------------------
export const icone = {
  marca: `<svg class="marca__simbolo" viewBox="0 0 34 30" aria-hidden="true" focusable="false"><path d="M17 1.8 32.2 28.2H1.8Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M17 11.5 24.6 25H9.4Z" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round"/><path d="M17 11.5V25" stroke="currentColor" stroke-width="1.1"/></svg>`,
  whatsapp: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.59-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.42.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35m-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.41Z"/></svg>`,
  seta: `<svg class="seta" viewBox="0 0 20 10" aria-hidden="true" focusable="false"><path d="M0 5h18.5M14 .8 18.5 5 14 9.2" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>`,
  externo: `<svg class="externo" viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M3 9 9.5 2.5M4.5 2.5h5v5" fill="none" stroke="currentColor" stroke-width="1.1"/></svg>`,
  pausa: `<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M5 3v10M11 3v10" stroke="currentColor" stroke-width="1.6"/></svg>`,
  play: `<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M5 3l8 5-8 5z" fill="currentColor"/></svg>`,
  fechar: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 5l14 14M19 5 5 19" stroke="currentColor" stroke-width="1.4"/></svg>`,
};

// --------------------------------------------------------------------------
// Imagem responsiva (AVIF → WebP → JPEG)
// --------------------------------------------------------------------------
export function imagem(raiz, nome, { sizes = '100vw', lazy = true, classe = '', alt } = {}) {
  const f = fotos[nome];
  const src = (ext) => f.larguras.map((w) => `${raiz}assets/img/${nome}-${w}.${ext} ${w}w`).join(', ');
  const maior = f.larguras[f.larguras.length - 1];
  return `<picture${classe ? ` class="${classe}"` : ''}>
  <source type="image/avif" srcset="${src('avif')}" sizes="${sizes}">
  <source type="image/webp" srcset="${src('webp')}" sizes="${sizes}">
  <img src="${raiz}assets/img/${nome}-${maior}.jpg" srcset="${src('jpg')}" sizes="${sizes}" alt="${esc(alt ?? f.alt)}" width="${f.w}" height="${f.h}"${lazy ? ' loading="lazy"' : ' fetchpriority="high"'} decoding="async">
</picture>`;
}

// --------------------------------------------------------------------------
// <head>
// --------------------------------------------------------------------------
export function cabeca({ raiz, titulo, descricao, caminho, jsonld = [], versao, imagemOg }) {
  const url = `${site.urlBase}/${caminho}`;
  const og = `${site.urlBase}/assets/img/${imagemOg || 'og-cabanas-do-alto.jpg'}`;
  const ld = jsonld.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n');
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descricao)}">
<link rel="canonical" href="${url}">
${site.indexar ? '<meta name="robots" content="index, follow, max-image-preview:large">' : '<meta name="robots" content="noindex, follow">'}
<meta name="theme-color" content="#12161d">
<meta name="format-detection" content="telephone=no">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="${site.nome}">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(descricao)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Vista aérea de uma das cabanas A-frame das Cabanas do Alto, em Cunha (SP)">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(titulo)}">
<meta name="twitter:description" content="${esc(descricao)}">
<meta name="twitter:image" content="${og}">
<meta name="twitter:image:alt" content="Vista aérea de uma das cabanas A-frame das Cabanas do Alto, em Cunha (SP)">
<link rel="icon" href="${raiz}favicon.svg" type="image/svg+xml">
<link rel="preload" href="${raiz}assets/fonts/instrument-serif-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${raiz}assets/fonts/jost-variavel.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${raiz}assets/css/site.css?v=${versao.css}">
<script>document.documentElement.classList.add('js')</script>
<script src="${raiz}assets/js/site.js?v=${versao.js}" defer></script>
${ld}
</head>`;
}

// --------------------------------------------------------------------------
// Cabeçalho
// --------------------------------------------------------------------------
export function topo({ raiz, home, solido = false }) {
  const ancora = (id) => (home ? `#${id}` : `${raiz}#${id}`);
  const reserva = home ? '#reserva' : '#reserva';
  const links = [
    ['Cabanas', home ? '#cabanas' : `${raiz}cabanas/`],
    ['Experiências', ancora('experiencias')],
    ['Cunha', ancora('cunha')],
    ['Perguntas', ancora('perguntas')],
  ];
  return `<a class="pular" href="#conteudo">Pular para o conteúdo</a>
<header class="topo${solido ? ' topo--solido' : ''}" data-topo>
  <div class="topo__barra">
    <a class="marca" href="${raiz || './'}" aria-label="Cabanas do Alto, página inicial">${icone.marca}<span class="marca__nome">Cabanas do Alto</span></a>
    <nav class="topo__nav" aria-label="Principal">
      <ul>${links.map(([t, h]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul>
    </nav>
    <a class="botao botao--fino topo__cta" href="${reserva}"><span class="topo__cta-longo">Consultar datas</span><span class="topo__cta-curto">Reservar</span></a>
    <button class="topo__menu" type="button" aria-expanded="false" aria-controls="menu-movel" data-menu-abrir>
      <span class="topo__menu-linhas" aria-hidden="true"></span><span class="sr">Abrir menu</span>
    </button>
  </div>
  <div class="menu-movel" id="menu-movel" data-menu hidden>
    <nav aria-label="Menu">
      <ul class="menu-movel__lista">
        ${links.map(([t, h]) => `<li><a href="${h}" data-menu-link>${t}</a></li>`).join('')}
        <li><a href="${reserva}" data-menu-link>Reserva direta</a></li>
      </ul>
    </nav>
    <div class="menu-movel__rodape">
      <a href="${linkWhatsApp(mensagens.geral)}" target="_blank" rel="noopener" data-evento="whatsapp_menu">WhatsApp ${site.telefoneExibicao}</a>
      <a href="${site.instagram}" target="_blank" rel="noopener">Instagram ${site.instagramUsuario}</a>
    </div>
  </div>
</header>`;
}

// --------------------------------------------------------------------------
// Botão fixo de WhatsApp
// --------------------------------------------------------------------------
export function whatsappFixo(mensagem, rotulo = 'Conversar com as Cabanas do Alto no WhatsApp') {
  return `<aside class="wa-aside" aria-label="Atendimento por WhatsApp"><a class="wa-fixo" href="${linkWhatsApp(mensagem)}" target="_blank" rel="noopener" aria-label="${esc(rotulo)}" title="WhatsApp" data-wa-fixo data-evento="whatsapp_fixo">${icone.whatsapp}</a></aside>`;
}

// --------------------------------------------------------------------------
// Formulário de pré-consulta → WhatsApp
// --------------------------------------------------------------------------
export function formReserva({ selecionada = '', idPrefixo = 'f' } = {}) {
  const op = cabanas
    .map(
      (c) =>
        `<option value="${c.nome}" data-max="${c.hospedes}"${c.slug === selecionada ? ' selected' : ''}>${c.nome} · até ${c.hospedes} ${c.hospedes === 1 ? 'hóspede' : 'hóspedes'}</option>`,
    )
    .join('');
  const p = idPrefixo;
  return `<form class="form" action="https://wa.me/${site.whatsapp}" method="get" target="_blank" data-form-reserva novalidate>
  <input type="hidden" name="text" value="${esc(mensagens.geral)}" data-texto-padrao>
  <div class="campo">
    <label for="${p}-cabana">Cabana</label>
    <select id="${p}-cabana" name="cabana" data-campo-cabana>
      <option value=""${selecionada ? '' : ' selected'}>Ainda não escolhi</option>
      ${op}
    </select>
  </div>
  <div class="campo-duplo">
    <div class="campo">
      <label for="${p}-entrada">Check-in</label>
      <input type="date" id="${p}-entrada" name="entrada" required data-campo-entrada>
    </div>
    <div class="campo">
      <label for="${p}-saida">Check-out</label>
      <input type="date" id="${p}-saida" name="saida" required data-campo-saida>
    </div>
  </div>
  <div class="campo">
    <label for="${p}-hospedes">Hóspedes</label>
    <select id="${p}-hospedes" name="hospedes" data-campo-hospedes>
      <option value="1">1 hóspede</option>
      <option value="2" selected>2 hóspedes</option>
      <option value="3">3 hóspedes</option>
      <option value="4">4 hóspedes</option>
    </select>
  </div>
  <label class="check"><input type="checkbox" name="pet" value="sim" data-campo-pet><span>Vou levar pet</span></label>
  <p class="form__aviso" data-aviso hidden></p>
  <p class="form__resumo" aria-live="polite" data-resumo></p>
  <button class="botao botao--cheio form__enviar" type="submit" data-evento="whatsapp_formulario">
    ${icone.whatsapp}<span>Consultar disponibilidade</span>
  </button>
  <p class="form__nota">Abre o WhatsApp da hospedagem com a mensagem pronta. Nada é cobrado nesta etapa.</p>
</form>`;
}

// --------------------------------------------------------------------------
// Seção de reserva (texto + formulário)
// --------------------------------------------------------------------------
export function secaoReserva({ numero = '08', selecionada = '', nomeCabana = '' }) {
  const titulo = nomeCabana
    ? `Consulte as datas da ${nomeCabana} direto com a hospedagem.`
    : 'Consulte suas datas direto com a hospedagem.';
  const msg = nomeCabana ? mensagens.cabana(nomeCabana) : mensagens.geral;
  return `<section class="reserva secao secao--noite" id="reserva" aria-labelledby="reserva-titulo">
  <div class="contem reserva__grade">
    <div class="reserva__texto">
      <p class="rotulo">${numero ? `<span>${numero}</span>` : ''}Reserva direta</p>
      <h2 class="titulo-2" id="reserva-titulo">${titulo}</h2>
      <ol class="passos">
        <li><span><strong>Escolha</strong> a cabana, as datas e quantas pessoas vão.</span></li>
        <li><span><strong>Envie</strong> pelo WhatsApp: a mensagem já sai pronta.</span></li>
        <li><span><strong>Receba</strong> a disponibilidade e os valores do seu período e feche a reserva com a própria equipe das Cabanas do Alto.</span></li>
      </ol>
      <p class="reserva__nota">Os valores mudam conforme a cabana, o dia da semana e os feriados, por isso a consulta é feita para as suas datas.</p>
      <p class="reserva__direto">Prefere conversar antes? <a href="${linkWhatsApp(msg)}" target="_blank" rel="noopener" data-evento="whatsapp_reserva">WhatsApp ${site.telefoneExibicao}</a></p>
    </div>
    <div class="reserva__form">${formReserva({ selecionada })}</div>
  </div>
</section>`;
}

// --------------------------------------------------------------------------
// Rodapé
// --------------------------------------------------------------------------
export function rodape({ raiz }) {
  return `<footer class="rodape">
  <div class="contem rodape__grade">
    <div class="rodape__marca">
      <a class="marca marca--rodape" href="${raiz || './'}">${icone.marca}<span class="marca__nome">Cabanas do Alto</span></a>
      <p>Seis cabanas A-frame em Cunha, SP, na Serra da Bocaina, de frente para a Mantiqueira.</p>
    </div>
    <div>
      <h2 class="rodape__titulo">Contato</h2>
      <ul class="rodape__lista">
        <li><a href="${linkWhatsApp(mensagens.geral)}" target="_blank" rel="noopener" data-evento="whatsapp_rodape">WhatsApp ${site.telefoneExibicao}</a></li>
        <li><a href="${site.instagram}" target="_blank" rel="noopener">Instagram ${site.instagramUsuario}</a></li>
      </ul>
    </div>
    <div>
      <h2 class="rodape__titulo">Endereço</h2>
      <address>${site.endereco.linha}<br>${site.endereco.cidade}, ${site.endereco.uf} · ${site.endereco.cep}</address>
      <a class="rodape__mapa" href="${site.mapa}" target="_blank" rel="noopener">Como chegar ${icone.externo}</a>
    </div>
    <div>
      <h2 class="rodape__titulo">Cabanas</h2>
      <ul class="rodape__lista rodape__lista--cabanas">
        ${cabanas.map((c) => `<li><a href="${raiz}cabanas/${c.slug}/">${c.nome}</a></li>`).join('')}
      </ul>
    </div>
  </div>
  <div class="contem rodape__base">
    <p>© ${site.ano} Cabanas do Alto · Cunha, SP</p>
    <p>Check-in a partir das 14h · Check-out até 12h</p>
  </div>
</footer>`;
}

// --------------------------------------------------------------------------
// Lista editorial das cabanas + "qual combina com você" + tabela
// --------------------------------------------------------------------------
export function escolha() {
  return `<div class="escolha" data-escolha>
  <div class="escolha__grupo" role="group" aria-labelledby="escolha-quantos">
    <span class="escolha__rotulo" id="escolha-quantos">Quantos vão?</span>
    <div class="escolha__opcoes">
      ${[2, 3, 4].map((n) => `<button type="button" class="opcao" data-filtro="hospedes" data-valor="${n}" aria-pressed="false">${n}</button>`).join('')}
    </div>
  </div>
  <div class="escolha__grupo" role="group" aria-labelledby="escolha-faltar">
    <span class="escolha__rotulo" id="escolha-faltar">Não pode faltar</span>
    <div class="escolha__opcoes">
      <button type="button" class="opcao" data-filtro="banheira" aria-pressed="false">Banheira</button>
      <button type="button" class="opcao" data-filtro="lareira" aria-pressed="false">Lareira</button>
      <button type="button" class="opcao" data-filtro="ar" aria-pressed="false">Ar-condicionado</button>
      <button type="button" class="opcao" data-filtro="rede" aria-pressed="false">Rede</button>
    </div>
  </div>
  <p class="escolha__resultado" aria-live="polite" data-resultado>Escolha acima e as cabanas que combinam ficam em destaque.</p>
  <button type="button" class="escolha__limpar" data-limpar hidden>Limpar</button>
</div>`;
}

export function listaCabanas(raiz, { comFotos = true, nivelTitulo = 3 } = {}) {
  const h = `h${nivelTitulo}`;
  const itens = cabanas.map((c, i) => {
    const artigo = `<article class="cabana${i % 2 ? ' cabana--par' : ''}" id="cabana-${c.slug}" data-cabana="${c.slug}" data-hospedes="${c.hospedes}" data-banheira="${+c.filtros.banheira}" data-lareira="${+c.filtros.lareira}" data-ar="${+c.filtros.ar}" data-rede="${+c.filtros.rede}" data-revelar>
  <p class="cabana__num" aria-hidden="true">${c.numero}</p>
  <${h} class="cabana__nome"><a href="${raiz}cabanas/${c.slug}/">${c.nome}</a></${h}>
  <div class="cabana__corpo">
    <p class="cabana__tese">${c.tese}</p>
    <p class="cabana__resumo">${c.resumo}</p>
    <ul class="cabana__dados">
      <li>${c.paraQuem === 'Para dois' ? '2 hóspedes' : `Até ${c.hospedes} hóspedes`}</li>
      <li>${c.quartos === '2' ? '2 quartos' : 'Quarto ' + (c.quartos.includes('mezanino') ? 'no mezanino' : 'único')}</li>
      <li>${c.camas}</li>
    </ul>
    <div class="cabana__acoes">
      <a class="link-seta" href="${raiz}cabanas/${c.slug}/">Conhecer a ${c.nome} ${icone.seta}</a>
      <a class="link-sutil" href="#reserva" data-escolher="${c.nome}">Consultar datas</a>
    </div>
  </div>
</article>`;
    let pausa = '';
    if (comFotos && i === 1) {
      pausa = `<figure class="cabanas__pausa cabanas__pausa--direita" data-revelar>
  ${imagem(raiz, 'banheira-deck', { sizes: '(min-width: 900px) 46vw, 100vw' })}
  <figcaption>${fotos['banheira-deck'].legenda}</figcaption>
</figure>`;
    }
    if (comFotos && i === 3) {
      pausa = `<div class="cabanas__pausa cabanas__pausa--dupla" data-revelar>
  <figure>${imagem(raiz, 'cabana-noite', { sizes: '(min-width: 900px) 24vw, 50vw' })}<figcaption>${fotos['cabana-noite'].legenda}</figcaption></figure>
  <figure>${imagem(raiz, 'via-lactea', { sizes: '(min-width: 900px) 24vw, 50vw' })}<figcaption>${fotos['via-lactea'].legenda}</figcaption></figure>
</div>`;
    }
    return artigo + pausa;
  });
  return `<div class="cabanas" data-lista-cabanas>${itens.join('\n')}</div>`;
}

export function tabelaComparativa(raiz, nivel = 3) {
  const linhas = [
    ['Hóspedes', (c) => (c.hospedes === 2 ? '2' : `até ${c.hospedes}`)],
    ['Quartos', (c) => c.quartos],
    ['Camas', (c) => c.tabela.camas],
    ['Banheira', (c) => c.tabela.banheira],
    ['Aquecimento', (c) => c.tabela.aquecimento],
    ['Ar-condicionado', (c) => c.tabela.ar],
    ['Rede', (c) => c.tabela.rede],
    ['Fogo de chão', (c) => c.tabela.fogo],
    ['Churrasqueira', (c) => c.tabela.churrasqueira],
    ['Vista', (c) => c.tabela.vista],
  ];
  const cel = (v) => (v === '—' ? '<td class="vazio"><span aria-hidden="true">—</span><span class="sr">Não consta</span></td>' : `<td>${v}</td>`);
  return `<div class="comparar" data-revelar>
  <div class="comparar__topo">
    <h${nivel} class="titulo-3">Lado a lado</h${nivel}>
    <p class="comparar__dica" aria-hidden="true">Deslize para comparar ${icone.seta}</p>
  </div>
  <div class="comparar__rolagem" tabindex="0" role="region" aria-label="Tabela comparativa das seis cabanas">
    <table class="tabela">
      <caption class="sr">Comparação das seis cabanas: hóspedes, quartos, camas, banheira, aquecimento, ar-condicionado, rede, fogo de chão, churrasqueira e vista</caption>
      <thead><tr><th scope="col"><span class="sr">Item</span></th>${cabanas.map((c) => `<th scope="col"><a href="${raiz}cabanas/${c.slug}/">${c.nome}</a></th>`).join('')}</tr></thead>
      <tbody>
        ${linhas.map(([t, f]) => `<tr><th scope="row">${t}</th>${cabanas.map((c) => cel(f(c))).join('')}</tr>`).join('\n        ')}
      </tbody>
    </table>
  </div>
  <p class="nota"><span aria-hidden="true">—</span> não consta no anúncio da cabana. Na dúvida, pergunte pelo WhatsApp.</p>
</div>`;
}
