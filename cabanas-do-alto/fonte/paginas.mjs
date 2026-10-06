// Páginas do site. Cada função recebe a versão dos arquivos (cache) e devolve o HTML completo.
import { site, cabanas, fotos, experiencias, arredores, perguntas, mensagens, linkWhatsApp, emTodas } from './dados.mjs';
import {
  esc, icone, imagem, cabeca, topo, whatsappFixo, secaoReserva, rodape,
  escolha, listaCabanas, tabelaComparativa,
} from './componentes.mjs';

const ID_HOSPEDAGEM = () => `${site.urlBase}/#hospedagem`;
const ID_SITE = () => `${site.urlBase}/#site`;

// --------------------------------------------------------------------------
// JSON-LD
// --------------------------------------------------------------------------
function ldEndereco() {
  return {
    '@type': 'PostalAddress',
    streetAddress: site.endereco.linha,
    addressLocality: site.endereco.cidade,
    addressRegion: site.endereco.uf,
    postalCode: site.endereco.cep,
    addressCountry: site.endereco.pais,
  };
}

function ldAcomodacao(c) {
  // A cama já vai em `bed`; o resto vira amenityFeature.
  const comodidades = Object.entries(c.comodidades).filter(([g]) => g !== 'Dormir').flatMap(([, v]) => v);
  return {
    '@type': 'Accommodation',
    '@id': `${site.urlBase}/cabanas/${c.slug}/#cabana`,
    name: `Cabana ${c.nome}`,
    url: `${site.urlBase}/cabanas/${c.slug}/`,
    description: c.seo.description,
    occupancy: { '@type': 'QuantitativeValue', maxValue: c.hospedes, unitText: 'hóspedes' },
    numberOfBedrooms: c.quartos === '2' ? 2 : 1,
    bed: c.camas,
    petsAllowed: true,
    amenityFeature: comodidades.concat(emTodas).map((n) => ({ '@type': 'LocationFeatureSpecification', name: n, value: true })),
    containedInPlace: { '@id': ID_HOSPEDAGEM() },
  };
}

function ldHospedagem() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    '@id': ID_HOSPEDAGEM(),
    name: site.nome,
    description:
      'Seis cabanas em estilo A-frame na Estrada Cunha–Paraty (SP-171), km 55, em Cunha (SP), construídas na parte mais alta do terreno, com vista para a Serra da Mantiqueira. Ficam a 10 km do centro de Cunha, ao lado do Lavandário.',
    url: `${site.urlBase}/`,
    image: `${site.urlBase}/assets/img/og-cabanas-do-alto.jpg`,
    telephone: site.telefoneSchema,
    address: ldEndereco(),
    hasMap: site.mapa,
    sameAs: [site.instagram, ...cabanas.map((c) => c.airbnb)],
    checkinTime: site.checkin,
    checkoutTime: site.checkout,
    petsAllowed: true,
    numberOfRooms: cabanas.length,
    amenityFeature: emTodas.map((n) => ({ '@type': 'LocationFeatureSpecification', name: n, value: true })),
    containsPlace: cabanas.map(ldAcomodacao),
  };
}

function ldSite() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': ID_SITE(),
    url: `${site.urlBase}/`,
    name: site.nome,
    inLanguage: 'pt-BR',
    publisher: { '@id': ID_HOSPEDAGEM() },
  };
}

function ldPerguntas() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: perguntas.map((q) => ({
      '@type': 'Question',
      name: q.p,
      acceptedAnswer: { '@type': 'Answer', text: q.r },
    })),
  };
}

function ldTrilha(itens) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: itens.map(([nome, caminho], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: nome,
      item: `${site.urlBase}/${caminho}`,
    })),
  };
}

// --------------------------------------------------------------------------
// Blocos da home
// --------------------------------------------------------------------------
function hero() {
  const p = 'assets/video/';
  const movel = '(max-width: 767px) and (orientation: portrait)';
  return `<section class="hero" aria-labelledby="hero-titulo" data-hero>
  <div class="hero__midia">
    <picture class="hero__poster">
      <source media="${movel}" type="image/avif" srcset="${p}poster-704.avif">
      <source media="${movel}" type="image/webp" srcset="${p}poster-704.webp">
      <source media="${movel}" srcset="${p}poster-704.jpg">
      <source type="image/avif" srcset="${p}poster-1280.avif">
      <source type="image/webp" srcset="${p}poster-1280.webp">
      <img src="${p}poster-1280.jpg" alt="" width="1280" height="672" fetchpriority="high" decoding="async">
    </picture>
    <video class="hero__video" muted playsinline loop preload="none" disablepictureinpicture aria-hidden="true" tabindex="-1"
      data-video data-src-movel="${p}hero-704.mp4" data-src-desktop="${p}hero-1280.mp4"></video>
  </div>
  <div class="hero__conteudo contem">
    <h1 class="hero__titulo" id="hero-titulo">
      <span class="hero__sobre">Cabanas do Alto <span aria-hidden="true">·</span> Cunha, SP</span>
      <span class="hero__frase">Do alto da Bocaina, <em>de frente para a Mantiqueira.</em></span>
    </h1>
    <p class="hero__texto">Seis cabanas A-frame no ponto mais alto do terreno, na estrada entre Cunha e Paraty, ao lado do Lavandário.</p>
    <div class="hero__acoes">
      <a class="botao botao--claro" href="#reserva" data-evento="cta_hero">Consultar disponibilidade</a>
      <a class="link-seta link-seta--claro" href="#cabanas">Conhecer as 6 cabanas ${icone.seta}</a>
    </div>
  </div>
  <div class="hero__rodape contem">
    <p class="hero__local">Estrada Cunha–Paraty <span aria-hidden="true">·</span> km 55</p>
    <button class="hero__pausa" type="button" data-pausa hidden>
      <span class="hero__pausa-icone" data-pausa-icone>${icone.pausa}</span><span data-pausa-texto>Pausar vídeo</span>
    </button>
  </div>
</section>`;
}

// Linha de cumeada estilizada: Mantiqueira vista de Cunha, olhando para o norte
// (oeste → leste: Marins, Itaguaré, Serra Fina).
function panorama() {
  const picos = [
    ['24.8%', 'Pico dos Marins', '2.420 m'],
    ['52.6%', 'Pico Itaguaré', '2.308 m'],
    ['79%', 'Serra Fina', 'Pedra da Mina, 2.798 m'],
  ];
  return `<figure class="panorama" data-revelar>
  <div class="panorama__desenho">
    <ul class="panorama__nomes">
      ${picos.map(([x, n, a]) => `<li style="--x:${x}"><strong>${n}</strong>${a}</li>`).join('\n      ')}
    </ul>
    <svg viewBox="0 0 1000 190" aria-hidden="true" focusable="false">
      <path class="panorama__fundo" d="M0 168 C60 160 110 150 150 142 C185 135 205 108 232 74 C246 58 258 62 268 84 C290 122 330 128 372 124 C420 119 452 104 488 88 C505 80 512 66 522 60 C531 56 538 66 548 84 C570 116 610 112 650 100 C690 88 724 66 758 50 C786 38 812 40 836 54 C866 72 900 100 940 118 C962 128 982 134 1000 138" />
      <path class="panorama__frente" d="M0 186 C80 178 160 170 240 172 C330 175 400 160 480 162 C560 164 640 150 720 156 C800 162 880 150 1000 158" />
      <g class="panorama__marcas"><line x1="248" y1="58" x2="248" y2="4"/><line x1="526" y1="54" x2="526" y2="4"/><line x1="790" y1="38" x2="790" y2="4"/></g>
    </svg>
  </div>
  <figcaption class="panorama__legenda">Do alto, a vista alcança pontos da Serra da Mantiqueira, do outro lado do vale do Paraíba: o Pico dos Marins, o Pico Itaguaré e a Serra Fina.</figcaption>
</figure>`;
}

function secaoLugar() {
  return `<section class="lugar secao" id="o-lugar" aria-labelledby="lugar-titulo">
  <div class="contem">
    <p class="rotulo" data-revelar><span>01</span>O lugar</p>
    <h2 class="titulo-2 lugar__titulo" id="lugar-titulo" data-revelar>O nome é literal: as cabanas ficam na parte mais alta do terreno.</h2>
    <div class="lugar__grade">
      <div class="lugar__texto" data-revelar>
        <p class="lede">As Cabanas do Alto ficam num condomínio de chácaras na estrada que liga Cunha a Paraty, a 10 km do centro e ao lado do Lavandário.</p>
        <p>Daqui de cima, a paisagem é um mar de morros que termina na Serra da Mantiqueira. São seis cabanas em estilo A-frame, todas com cozinha, e cada uma ocupa a paisagem de um jeito: uma tem hidromassagem de frente para a serra, outra recebe quatro pessoas, outra tem uma rede suspensa olhando para a Serra do Mar.</p>
        <p>Por isso, aqui, a primeira pergunta é: qual delas é a sua?</p>
        <a class="link-seta" href="#cabanas">Ver as seis cabanas ${icone.seta}</a>
      </div>
      <figure class="lugar__foto" data-revelar>
        ${imagem('', 'vista-aerea', { sizes: '(min-width: 900px) 56vw, 100vw' })}
        <figcaption>${fotos['vista-aerea'].legenda}</figcaption>
      </figure>
    </div>
    ${panorama()}
    <dl class="ficha" data-revelar>
      <div><dt>Onde</dt><dd>${site.endereco.linha}, Cunha, SP</dd></div>
      <div><dt>Cabanas</dt><dd>Seis, em estilo A-frame</dd></div>
      <div><dt>Hóspedes</dt><dd>De 2 a 4 por cabana</dd></div>
      <div><dt>Distâncias</dt><dd>10 km do centro de Cunha · 40 km de Paraty · 230 km de São Paulo</dd></div>
      <div><dt>Vizinho</dt><dd>Lavandário de Cunha</dd></div>
    </dl>
  </div>
</section>`;
}

function secaoCabanas() {
  return `<section class="secao secao--cabanas" id="cabanas" aria-labelledby="cabanas-titulo">
  <div class="contem">
    <div class="cabecalho-secao">
      <p class="rotulo" data-revelar><span>02</span>As seis cabanas</p>
      <h2 class="titulo-2" id="cabanas-titulo" data-revelar>Seis A-frames.<br><em>Nenhuma igual à outra.</em></h2>
      <p class="lede cabecalho-secao__lede" data-revelar>Todas ficam no alto e têm cozinha, deck e Wi-Fi. O que muda é quantas pessoas recebem e o que espera por você lá fora: hidromassagem, lareira, rede suspensa, o pôr do sol.</p>
    </div>
    ${escolha()}
    ${listaCabanas('')}
    ${tabelaComparativa('')}
  </div>
</section>`;
}

function destaque() {
  return `<section class="destaque" aria-labelledby="destaque-frase">
  <figure class="destaque__foto">
    ${imagem('', 'deck-cadeiras', { sizes: '100vw' })}
  </figure>
  <div class="destaque__texto contem">
    <p class="destaque__frase" id="destaque-frase" data-revelar>Quando o sol baixa sobre o mar de morros, ninguém quer sair do deck.</p>
    <p class="destaque__legenda">${fotos['deck-cadeiras'].legenda}</p>
  </div>
</section>`;
}

function secaoExperiencias() {
  return `<section class="secao experiencias" id="experiencias" aria-labelledby="exp-titulo">
  <div class="contem experiencias__grade">
    <div class="experiencias__cabeca">
      <p class="rotulo" data-revelar><span>03</span>Experiências</p>
      <h2 class="titulo-2" id="exp-titulo" data-revelar>Para a viagem virar ocasião.</h2>
      <p class="lede" data-revelar>Extras que a hospedagem organiza com parceiros da região. São contratados à parte, depois da reserva, e dependem de disponibilidade.</p>
      <a class="botao botao--fino" href="${linkWhatsApp(mensagens.experiencias)}" target="_blank" rel="noopener" data-evento="whatsapp_experiencias">${icone.whatsapp}<span>Perguntar sobre experiências</span></a>
    </div>
    <ol class="experiencias__lista">
      ${experiencias
        .map(
          (e, i) => `<li class="experiencia" data-revelar>
        <span class="experiencia__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
        <h3 class="experiencia__titulo">${e.titulo}${e.confirmada ? '' : ' <span class="experiencia__selo">sob consulta</span>'}</h3>
        <p>${e.texto}</p>
      </li>`,
        )
        .join('\n      ')}
    </ol>
  </div>
</section>`;
}

function secaoAvaliacoes() {
  const total = cabanas.reduce((s, c) => s + (c.avaliacoes ? c.avaliacoes.minimo : 0), 0);
  const centena = Math.floor(total / 100) * 100;
  return `<section class="secao secao--noite avaliacoes" id="avaliacoes" aria-labelledby="aval-titulo">
  <div class="contem">
    <p class="rotulo" data-revelar><span>04</span>Quem já foi</p>
    <h2 class="titulo-2 avaliacoes__titulo" id="aval-titulo" data-revelar>Mais de ${centena} avaliações de hóspedes no Airbnb.</h2>
    <div class="avaliacoes__grade">
      <div class="avaliacoes__temas" data-revelar>
        <h3 class="titulo-3">O que os hóspedes destacam</h3>
        <ol class="temas">
          <li><span><strong>A vista,</strong> e o fato de ela ser exatamente a das fotos.</span></li>
          <li><span><strong>O pôr do sol,</strong> visto do deck.</span></li>
          <li><span><strong>Limpeza e organização,</strong> com atenção aos detalhes.</span></li>
          <li><span><strong>As anfitriãs,</strong> atenciosas e rápidas para responder.</span></li>
        </ol>
      </div>
      <div class="avaliacoes__cabanas" data-revelar>
        <h3 class="titulo-3">Por cabana</h3>
        <ul class="notas">
          ${cabanas
            .map(
              (c) => `<li>
            <a class="notas__nome" href="cabanas/${c.slug}/">${c.nome}</a>
            <span class="notas__dado">${c.avaliacoes ? `Mais de ${c.avaliacoes.minimo} avaliações · nota acima de ${c.avaliacoes.nota}` : 'Avaliações no anúncio'}</span>
            <a class="notas__link" href="${c.airbnb}" target="_blank" rel="noopener">Ler no Airbnb ${icone.externo}<span class="sr"> (avaliações da Cabana ${c.nome})</span></a>
          </li>`,
            )
            .join('\n          ')}
        </ul>
        <p class="nota">Os números completos e atualizados estão em cada anúncio. <a href="${site.avaliacoesGoogle}" target="_blank" rel="noopener">Ver também no Google ${icone.externo}</a></p>
      </div>
    </div>
  </div>
</section>`;
}

function estrada() {
  return `<ol class="estrada" data-revelar>
  ${arredores
    .map(
      (a) => `<li class="estrada__parada${a.aqui ? ' estrada__parada--aqui' : ''}"${a.aqui ? ' aria-current="location"' : ''}>
    <span class="estrada__ponto" aria-hidden="true"></span>
    <span class="estrada__marca">${a.marca}</span>
    <strong class="estrada__nome">${a.aqui ? 'Você está aqui' : a.nome}</strong>
    ${a.texto ? `<span class="estrada__texto">${a.texto}</span>` : '<span class="estrada__texto">As seis cabanas, no alto do terreno.</span>'}
  </li>`,
    )
    .join('\n  ')}
</ol>`;
}

function secaoCunha() {
  return `<section class="secao cunha" id="cunha" aria-labelledby="cunha-titulo">
  <div class="contem">
    <div class="cabecalho-secao cabecalho-secao--lado">
      <p class="rotulo" data-revelar><span>05</span>Viver Cunha</p>
      <h2 class="titulo-2" id="cunha-titulo" data-revelar>Entre Cunha e Paraty, <em>no km 55.</em></h2>
      <p class="lede cabecalho-secao__lede" data-revelar>Cunha é estância climática, a cerca de 950 metros de altitude, conhecida pela cerâmica de alta temperatura e pelas noites frias de inverno. As cabanas ficam na estrada que desce a serra até Paraty, o que deixa boa parte da região a poucos quilômetros.</p>
    </div>
    <p class="estrada__titulo" aria-hidden="true"><span>← Cunha</span><span>SP-171 · Estrada Cunha–Paraty</span><span>Paraty →</span></p>
    ${estrada()}
    <div class="chegar" data-revelar>
      <h3 class="titulo-3">Como chegar</h3>
      <dl class="chegar__lista">
        <div><dt>De São Paulo</dt><dd>Cerca de 230 km, de 2h30 a 3h, pela Via Dutra até Guaratinguetá e depois pela SP-171.</dd></div>
        <div><dt>Do Rio de Janeiro</dt><dd>Cerca de 3h30, pela Via Dutra até Guaratinguetá e depois pela SP-171.</dd></div>
        <div><dt>Acesso</dt><dd>Todo pavimentado, segundo a hospedagem: dá para ir com qualquer carro ou moto.</dd></div>
      </dl>
      <a class="link-seta" href="${site.mapa}" target="_blank" rel="noopener">Abrir no Google Maps ${icone.externo}</a>
    </div>
  </div>
</section>`;
}

function secaoGaleria() {
  const ordem = ['vista-aerea', 'cabana-noite', 'deck-cadeiras', 'via-lactea', 'banheira-deck', 'cabana-dia'];
  return `<section class="secao galeria" id="galeria" aria-labelledby="galeria-titulo">
  <div class="contem">
    <div class="cabecalho-secao cabecalho-secao--linha">
      <p class="rotulo" data-revelar><span>06</span>Imagens</p>
      <h2 class="titulo-2" id="galeria-titulo" data-revelar>Do sol da manhã <em>à Via Láctea.</em></h2>
    </div>
    <ul class="galeria__grade" data-galeria>
      ${ordem
        .map(
          (n, i) => `<li class="galeria__item galeria__item--${i + 1}" data-revelar>
        <button type="button" class="galeria__botao" data-ampliar="${n}" data-largura="${fotos[n].larguras.at(-1)}" aria-label="Ampliar: ${esc(fotos[n].legenda)}">
          ${imagem('', n, { sizes: i === 0 ? '(min-width: 900px) 60vw, 100vw' : '(min-width: 900px) 30vw, 50vw' })}
        </button>
      </li>`,
        )
        .join('\n      ')}
      <li class="galeria__nota" aria-hidden="true"><p>Fotos das Cabanas do Alto, em Cunha.<br>Toque numa imagem para ampliar.</p></li>
    </ul>
  </div>
  <dialog class="ampliada" data-ampliada aria-label="Imagem ampliada">
    <button type="button" class="ampliada__fechar" data-fechar aria-label="Fechar">${icone.fechar}</button>
    <figure data-ampliada-figura><figcaption data-ampliada-legenda></figcaption></figure>
  </dialog>
</section>`;
}

function secaoPerguntas(lista = perguntas, numero = '09', titulo = 'Antes de reservar.') {
  return `<section class="secao perguntas" id="perguntas" aria-labelledby="perguntas-titulo">
  <div class="contem perguntas__grade">
    <div class="perguntas__cabeca">
      <p class="rotulo" data-revelar>${numero ? `<span>${numero}</span>` : ''}Perguntas</p>
      <h2 class="titulo-2" id="perguntas-titulo" data-revelar>${titulo}</h2>
      <p class="perguntas__mais">Não achou a sua? <a href="${linkWhatsApp(mensagens.geral)}" target="_blank" rel="noopener" data-evento="whatsapp_faq">Pergunte no WhatsApp</a>.</p>
    </div>
    <div class="perguntas__lista">
      ${lista
        .map(
          (q) => `<details class="pergunta">
        <summary><span>${q.p}</span><span class="pergunta__sinal" aria-hidden="true"></span></summary>
        <div class="pergunta__resposta"><p>${q.r}</p></div>
      </details>`,
        )
        .join('\n      ')}
    </div>
  </div>
</section>`;
}

function chamadaFinal(raiz, mensagem = mensagens.geral) {
  return `<section class="final secao--noite" aria-labelledby="final-frase">
  <div class="contem final__conteudo">
    <span class="final__simbolo" aria-hidden="true">${icone.marca}</span>
    <p class="final__frase" id="final-frase" data-revelar>A serra fica a cerca de três horas de São Paulo. <em>A sua cabana, a uma mensagem.</em></p>
    <div class="final__acoes">
      <a class="botao botao--claro" href="#reserva" data-evento="cta_final">Consultar disponibilidade</a>
      <a class="link-seta link-seta--claro" href="${linkWhatsApp(mensagem)}" target="_blank" rel="noopener" data-evento="whatsapp_final">Falar no WhatsApp ${icone.seta}</a>
    </div>
  </div>
</section>`;
}

// --------------------------------------------------------------------------
// PÁGINA: início
// --------------------------------------------------------------------------
export function paginaInicial(versao) {
  return `${cabeca({
    raiz: '',
    titulo: 'Cabanas do Alto | Cabanas A-frame em Cunha-SP, na Serra da Bocaina',
    descricao:
      'Seis cabanas A-frame em Cunha-SP, na estrada para Paraty, ao lado do Lavandário e de frente para a Mantiqueira. De 2 a 4 hóspedes. Consulte datas direto pelo WhatsApp.',
    caminho: '',
    versao,
    jsonld: [ldSite(), ldHospedagem(), ldPerguntas()],
  })}
<body class="pagina-inicial" data-whatsapp="${site.whatsapp}">
${topo({ raiz: '', home: true })}
<main id="conteudo">
${hero()}
${secaoLugar()}
${secaoCabanas()}
${destaque()}
${secaoExperiencias()}
${secaoAvaliacoes()}
${secaoCunha()}
${secaoGaleria()}
${secaoReserva({ numero: '07' })}
${secaoPerguntas(perguntas, '08')}
${chamadaFinal('')}
</main>
${rodape({ raiz: '' })}
${whatsappFixo(mensagens.geral)}
</body>
</html>
`;
}

// --------------------------------------------------------------------------
// PÁGINA: cada cabana
// --------------------------------------------------------------------------
export function paginaCabana(c, versao) {
  const raiz = '../../';
  const i = cabanas.indexOf(c);
  const outras = cabanas.filter((x) => x !== c);
  const msg = mensagens.cabana(c.nome);
  const perguntasCabana = perguntas.filter((q) =>
    /check-in|pets|cozinha|acesso|estacionamento|experiências|frio/i.test(q.p),
  );
  const ficha = [
    ['Hóspedes', c.hospedes === 2 ? '2' : `Até ${c.hospedes}`],
    ['Quartos', c.quartos],
    ['Camas', c.camas],
    ['Banheira', c.tabela.banheira === '—' ? 'Não' : c.tabela.banheira],
    ['Aquecimento', c.tabela.aquecimento + (c.filtros.ar ? ' e ar-condicionado' : '')],
    ['Vista', c.tabela.vista],
  ].filter(([, v]) => v !== 'Não');

  return `${cabeca({
    raiz,
    titulo: c.seo.title,
    descricao: c.seo.description,
    caminho: `cabanas/${c.slug}/`,
    versao,
    jsonld: [
      { '@context': 'https://schema.org', ...ldAcomodacao(c), containedInPlace: { '@type': 'LodgingBusiness', '@id': ID_HOSPEDAGEM(), name: site.nome, address: ldEndereco(), telephone: site.telefoneSchema } },
      ldTrilha([[site.nome, ''], ['Cabanas', 'cabanas/'], [`Cabana ${c.nome}`, `cabanas/${c.slug}/`]]),
    ],
  })}
<body class="pagina-cabana" data-whatsapp="${site.whatsapp}">
${topo({ raiz, home: false, solido: true })}
<main id="conteudo">
<nav class="trilha contem" aria-label="Você está em">
  <ol><li><a href="${raiz}">Início</a></li><li><a href="${raiz}cabanas/">Cabanas</a></li><li aria-current="page">${c.nome}</li></ol>
</nav>

<section class="cab-hero contem" aria-labelledby="cab-titulo">
  <div class="cab-hero__titulo">
    <p class="rotulo"><span>${c.numero}</span>Cabana ${i + 1} de ${cabanas.length} · Cunha, SP</p>
    <h1 class="cab-hero__nome" id="cab-titulo"><span class="sr">Cabana </span>${c.nome}</h1>
    <p class="cab-hero__tese">${c.tese}</p>
    <div class="cab-hero__acoes">
      <a class="botao botao--cheio" href="#reserva" data-evento="cta_cabana_topo">Consultar disponibilidade</a>
      <a class="link-seta" href="${linkWhatsApp(msg)}" target="_blank" rel="noopener" data-evento="whatsapp_cabana_topo">${icone.whatsapp} Falar sobre a ${c.nome}</a>
    </div>
  </div>
  <dl class="cab-ficha">
    ${ficha.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('\n    ')}
  </dl>
</section>

<section class="secao cab-porque" aria-labelledby="porque-titulo">
  <div class="contem cab-porque__grade">
    <h2 class="titulo-2" id="porque-titulo" data-revelar>Por que a <em>${c.nome}</em></h2>
    <div class="cab-porque__texto" data-revelar>
      ${c.intro.map((p, k) => `<p${k === 0 ? ' class="lede"' : ''}>${p}</p>`).join('\n      ')}
      <h3 class="titulo-3">Combina com</h3>
      <ul class="ideal">${c.idealPara.map((x) => `<li>${x}</li>`).join('')}</ul>
    </div>
  </div>
</section>

<section class="secao cab-tem" aria-labelledby="tem-titulo">
  <div class="contem">
    <h2 class="titulo-2" id="tem-titulo" data-revelar>O que tem na ${c.nome}</h2>
    <div class="cab-tem__grade">
      ${Object.entries(c.comodidades)
        .map(
          ([g, itens]) => `<div class="cab-tem__grupo" data-revelar>
        <h3 class="cab-tem__rotulo">${g}</h3>
        <ul>${itens.map((x) => `<li>${x}</li>`).join('')}</ul>
      </div>`,
        )
        .join('\n      ')}
    </div>
    <p class="cab-tem__todas"><strong>Em todas as cabanas:</strong> ${emTodas.join(', ').toLowerCase().replace('wi-fi', 'Wi-Fi')}.</p>
  </div>
</section>

<figure class="cab-foto" data-revelar>
  ${imagem(raiz, c.foto, { sizes: '100vw' })}
  <figcaption class="contem">Cabanas do Alto, em Cunha. ${fotos[c.foto].legenda}</figcaption>
</figure>

<section class="secao cab-aval" aria-labelledby="aval-titulo">
  <div class="contem cab-aval__grade">
    <h2 class="titulo-2" id="aval-titulo" data-revelar>${c.avaliacoes ? `Mais de ${c.avaliacoes.minimo} avaliações, <em>nota acima de ${c.avaliacoes.nota}.</em>` : 'O que dizem os hóspedes'}</h2>
    <div data-revelar>
      <p>${c.avaliacoes ? `É o que a ${c.nome} soma no Airbnb. Nas Cabanas do Alto, os hóspedes costumam destacar a vista, o pôr do sol, a limpeza e a atenção das anfitriãs.` : `As avaliações da ${c.nome} estão no anúncio do Airbnb. Nas Cabanas do Alto, os hóspedes costumam destacar a vista, o pôr do sol, a limpeza e a atenção das anfitriãs.`}</p>
      <a class="link-seta" href="${c.airbnb}" target="_blank" rel="noopener">Ler as avaliações da ${c.nome} no Airbnb ${icone.externo}</a>
    </div>
  </div>
</section>

${secaoReserva({ numero: '', selecionada: c.slug, nomeCabana: c.nome })}

${secaoPerguntas(perguntasCabana, '', 'Bom saber.')}

<section class="secao outras" aria-labelledby="outras-titulo">
  <div class="contem">
    <h2 class="titulo-2" id="outras-titulo" data-revelar>As outras cinco</h2>
    <ul class="outras__lista">
      ${outras
        .map(
          (o) => `<li data-revelar><a href="${raiz}cabanas/${o.slug}/">
        <span class="outras__nome">${o.nome}</span>
        <span class="outras__tese">${o.tese}</span>
        <span class="outras__dado">${o.hospedes === 2 ? '2 hóspedes' : `até ${o.hospedes} hóspedes`}</span>
      </a></li>`,
        )
        .join('\n      ')}
    </ul>
    <a class="link-seta" href="${raiz}cabanas/">Comparar as seis lado a lado ${icone.seta}</a>
  </div>
</section>

${chamadaFinal(raiz, msg)}
</main>
${rodape({ raiz })}
${whatsappFixo(msg, `Conversar sobre a Cabana ${c.nome} no WhatsApp`)}
</body>
</html>
`;
}

// --------------------------------------------------------------------------
// PÁGINA: /cabanas/ (comparar as seis)
// --------------------------------------------------------------------------
export function paginaCabanas(versao) {
  const raiz = '../';
  return `${cabeca({
    raiz,
    titulo: 'As seis cabanas: compare capacidade, banheira e lareira | Cabanas do Alto',
    descricao:
      'Biguá, Pitanguá, Indaiá, Tuim, Curió e Tauá: compare as seis cabanas A-frame das Cabanas do Alto em Cunha-SP. Hóspedes, camas, banheira, lareira, ar-condicionado e vista.',
    caminho: 'cabanas/',
    versao,
    jsonld: [
      ldTrilha([[site.nome, ''], ['Cabanas', 'cabanas/']]),
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'As seis cabanas das Cabanas do Alto',
        itemListElement: cabanas.map((c, i) => ({ '@type': 'ListItem', position: i + 1, url: `${site.urlBase}/cabanas/${c.slug}/`, name: `Cabana ${c.nome}` })),
      },
    ],
  })}
<body class="pagina-cabanas" data-whatsapp="${site.whatsapp}">
${topo({ raiz, home: false, solido: true })}
<main id="conteudo">
<nav class="trilha contem" aria-label="Você está em">
  <ol><li><a href="${raiz}">Início</a></li><li aria-current="page">Cabanas</li></ol>
</nav>
<section class="secao secao--cabanas secao--sem-topo" id="cabanas" aria-labelledby="cabanas-titulo">
  <div class="contem">
    <div class="cabecalho-secao">
      <p class="rotulo">Cabanas A-frame em Cunha, SP</p>
      <h1 class="titulo-1" id="cabanas-titulo">As seis cabanas, <em>lado a lado.</em></h1>
      <p class="lede cabecalho-secao__lede">Biguá, Curió e Tauá recebem duas pessoas; Pitanguá e Indaiá, até três; a Tuim, até quatro. Todas têm cozinha, deck, Wi-Fi e estacionamento, e ficam na parte mais alta do terreno, a 10 km do centro de Cunha.</p>
    </div>
    ${tabelaComparativa(raiz, 2)}
    ${escolha()}
    ${listaCabanas(raiz, { comFotos: false, nivelTitulo: 2 })}
  </div>
</section>
${secaoReserva({ numero: '' })}
${chamadaFinal(raiz)}
</main>
${rodape({ raiz })}
${whatsappFixo(mensagens.geral)}
</body>
</html>
`;
}

// --------------------------------------------------------------------------
// PÁGINA: 404 (caminhos absolutos, porque pode ser servida em qualquer URL)
// --------------------------------------------------------------------------
export function pagina404(versao) {
  const base = new URL(site.urlBase + '/').pathname;
  return `${cabeca({
    raiz: base,
    titulo: 'Página não encontrada | Cabanas do Alto',
    descricao: 'Esta página não existe. Conheça as seis cabanas das Cabanas do Alto, em Cunha-SP.',
    caminho: '404.html',
    versao,
  }).replace(/<meta name="robots"[^>]*>/, '<meta name="robots" content="noindex">')}
<body class="pagina-404" data-whatsapp="${site.whatsapp}">
${topo({ raiz: base, home: false, solido: true })}
<main id="conteudo" class="contem erro">
  <p class="rotulo"><span>404</span>Página não encontrada</p>
  <h1 class="titulo-1">Esta trilha não leva a nenhuma cabana.</h1>
  <p class="lede">O endereço pode ter mudado. As seis cabanas continuam no mesmo lugar.</p>
  <div class="erro__acoes">
    <a class="botao botao--cheio" href="${base}">Ir para o início</a>
    <a class="link-seta" href="${base}cabanas/">Ver as cabanas ${icone.seta}</a>
  </div>
</main>
${rodape({ raiz: base })}
${whatsappFixo(mensagens.geral)}
</body>
</html>
`;
}
