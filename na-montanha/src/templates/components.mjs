// Seções reutilizáveis. A página inicial usa todas; as páginas internas
// reaproveitam as mesmas peças.
import { site, cabins, experience, faq, generalMessage, locationMessage } from '../data/site.mjs';
import { esc, picture, waLink, maybeLink, asset, fullAddressLines, arrow, external } from './helpers.mjs';

const cabinBy = (key) => cabins.find((c) => c.key === key);
const cabinUrl = (c) => `/cabanas/${c.slug}/`;

// ------------------------------------------------------------------ hero ---
// Tríptico: as fotos chegaram em retrato e em resolução moderada; lado a
// lado, cada uma ocupa um terço da tela sem ser ampliada além do original.
export function homeHero() {
  return `<section class="hero" id="inicio" aria-labelledby="hero-title" data-over-media>
  <div class="hero__media">
    <figure class="hero__panel hero__panel--side">
      ${picture('cabanaDia', { sizes: '(min-width: 56em) 30vw, 1px', loading: 'lazy' })}
      <figcaption>Dia</figcaption>
    </figure>
    <figure class="hero__panel hero__panel--main">
      ${picture('sonhosEntardecer', { sizes: '(min-width: 56em) 40vw, 100vw', priority: true, art: { key: 'sonhosRetrato', media: '(max-width: 40em)' } })}
      <figcaption>Fim de tarde</figcaption>
    </figure>
    <figure class="hero__panel hero__panel--side">
      ${picture('cabanaNoite', { sizes: '(min-width: 56em) 30vw, 1px', loading: 'lazy' })}
      <figcaption>Noite</figcaption>
    </figure>
  </div>
  <div class="hero__content">
    <h1 class="hero__title" id="hero-title">
      <span class="hero__brand">${esc(site.name)}</span>
      <span class="hero__line">Entre a serra <em>e o silêncio.</em></span>
    </h1>
    <p class="hero__lede">Cabanas em meio à natureza em Igrejinha, na Serra Gaúcha, perto de Gramado.</p>
    <div class="hero__actions">
      <a class="btn btn--solid" href="#reservar" data-track="check_availability">Consultar disponibilidade</a>
      <a class="link-arrow link-arrow--light" href="#cabanas">Conhecer as cabanas ${arrow}</a>
    </div>
  </div>
  <p class="hero__place" aria-hidden="true">Alto da Pedra — Igrejinha, RS</p>
</section>`;
}

// ----------------------------------------------------------------- intro ---
export function intro() {
  return `<section class="intro" id="a-na-montanha" aria-labelledby="intro-title">
  <div class="intro__grid wrap">
    <p class="label intro__label reveal">A Na Montanha</p>
    <h2 class="h2 intro__title reveal" id="intro-title">Um refúgio para <em>desacelerar.</em></h2>
    <figure class="intro__figure reveal">
      ${picture('salaLareira', { sizes: '(min-width: 56em) 38vw, 92vw' })}
      <figcaption>Madeira, vidro e lareira: a sala aberta para o deck.</figcaption>
    </figure>
    <div class="intro__text prose reveal">
      <p class="lede">A Na Montanha Eco Space é um pequeno refúgio de três cabanas no Alto da Pedra, na Serra Grande de Igrejinha. Do lado de fora, mata, morro e céu aberto. Do lado de dentro, madeira, vidro e tempo — justamente o que costuma faltar.</p>
      <p>Igrejinha fica na Serra Gaúcha, na região próxima de Gramado. Dá para aproveitar a cidade quando der vontade e voltar para a calma da montanha no fim do dia. A proposta é simples: chegar, desligar e deixar a serra ditar o ritmo.</p>
    </div>
    <dl class="facts intro__facts reveal">
      <div><dt>Onde</dt><dd>Alto da Pedra, Serra Grande · Igrejinha, RS</dd></div>
      <div><dt>Região</dt><dd>Serra Gaúcha, perto de Gramado</dd></div>
      <div><dt>Cabanas</dt><dd>${cabins.map((c) => `<a href="${cabinUrl(c)}">${c.name}</a>`).join(', ').replace(/, ([^,]*)$/, ' e $1')}</dd></div>
      <div><dt>Reserva</dt><dd>Direto com a Na Montanha, pelo WhatsApp</dd></div>
    </dl>
  </div>
</section>`;
}

// --------------------------------------------------------------- cabanas ---
function cabinActions(c, { primary = 'page' } = {}) {
  const page = `<a class="btn btn--solid" href="${cabinUrl(c)}">Conhecer a ${c.name}</a>`;
  const wa = waLink({
    message: c.message,
    label: `Consultar disponibilidade ${arrow}`,
    className: 'link-arrow',
    cabin: c.key,
    track: 'check_availability',
  });
  return `<div class="cabin__actions">${primary === 'page' ? page + wa : wa + page}</div>`;
}

function cabinArticle(c, i, opts) {
  const sizes = {
    sonhos: '(min-width: 56em) 52vw, 100vw',
    amor: '(min-width: 56em) 42vw, 100vw',
    pedra: '(min-width: 56em) 36vw, 84vw',
  }[c.key] || '(min-width: 56em) 45vw, 100vw';
  const Hn = opts.headingLevel || 'h3';
  return `<article class="cabin cabin--${c.key}" id="${c.slug}" aria-labelledby="t-${c.key}" data-view-cabin="${c.key}">
  <figure class="cabin__media reveal">
    ${picture(c.photo, { sizes })}
  </figure>
  <div class="cabin__body">
    <p class="cabin__num reveal" aria-hidden="true">${c.numeral}</p>
    <${Hn} class="cabin__name reveal" id="t-${c.key}">${c.name}</${Hn}>
    <p class="cabin__tagline reveal">${c.tagline}</p>
    <p class="cabin__lead reveal">${c.lead}</p>
    ${cabinActions(c)}
  </div>
</article>`;
}

export function cabinsSection({ headingTag = 'h2', withHeader = true, headingLevel } = {}) {
  return `<section class="cabins" id="cabanas" aria-labelledby="cabins-title">
  ${withHeader ? `<header class="cabins__head wrap">
    <p class="label reveal">As cabanas</p>
    <${headingTag} class="h2 cabins__title reveal" id="cabins-title">Três cabanas. <em>Três formas de viver a montanha.</em></${headingTag}>
    <p class="cabins__intro reveal">Todas no mesmo pedaço de serra, no Alto da Pedra, cada uma com sua atmosfera. Escolha pela que mais combina com a sua viagem — as datas, a gente confirma com você pelo WhatsApp.</p>
    <nav class="cabins__index reveal" aria-label="Cabanas nesta seção"><ol>
      ${cabins.map((c) => `<li><a href="#${c.slug}"><span aria-hidden="true">${c.numeral}</span> ${c.name}</a></li>`).join('')}
    </ol></nav>
  </header>` : `<h2 class="visually-hidden" id="cabins-title">As três cabanas</h2>`}
  ${cabins.map((c, i) => cabinArticle(c, i, { headingLevel })).join('\n')}
</section>`;
}

// ----------------------------------------------------------------- vídeo ---
// O vídeo real da Cabana dos Sonhos, produzido no Flow. Carrega só quando
// a seção se aproxima da tela; o pôster é o primeiro quadro do vídeo.
export function film({ headingTag = 'h2', id = 'cabana-dos-sonhos-em-video', withLink = true } = {}) {
  const v = (f) => asset(`video/${f}`);
  return `<section class="film" id="${id}" aria-labelledby="${id}-title" data-film data-view-cabin="sonhos">
  <div class="film__frame">
    ${picture('videoPoster', { sizes: '100vw', className: 'film__poster', alt: '' })}
    <video class="film__video" muted loop playsinline preload="none" controls width="1920" height="1080"
      aria-label="Vídeo da Cabana dos Sonhos: a fachada ao entardecer, a sala com lareira e o quarto com banheira junto à janela.">
      <source media="(max-width: 47.99em)" src="${v('cabana-dos-sonhos-720-av1.mp4')}" type='video/mp4; codecs="av01.0.05M.08"'>
      <source media="(max-width: 47.99em)" src="${v('cabana-dos-sonhos-720.mp4')}" type="video/mp4">
      <source src="${v('cabana-dos-sonhos-1080-av1.mp4')}" type='video/mp4; codecs="av01.0.08M.08"'>
      <source src="${v('cabana-dos-sonhos-1080.mp4')}" type="video/mp4">
    </video>
  </div>
  <div class="film__caption">
    <p class="label">Cabana dos Sonhos · em movimento</p>
    <${headingTag} class="h2 film__title" id="${id}-title">Um convite para <em>esquecer o relógio.</em></${headingTag}>
    <p class="film__text">Do jardim à sala, da sala ao quarto: a Cabana dos Sonhos como ela recebe quem chega.</p>
    ${withLink ? `<a class="btn btn--light" href="${cabinUrl(cabinBy('sonhos'))}">Conhecer a Cabana dos Sonhos</a>` : waLink({ message: cabinBy('sonhos').message, label: 'Consultar disponibilidade', className: 'btn btn--light', cabin: 'sonhos', track: 'check_availability' })}
  </div>
  <button class="film__toggle" type="button" data-film-toggle hidden>
    <span class="film__icon" aria-hidden="true"></span><span class="film__toggle-label">Pausar vídeo</span>
  </button>
</section>`;
}

// ------------------------------------------------------------ experiência ---
export function essay({ all = false, headingTag = 'h2' } = {}) {
  const items = experience.filter((e) => all || e.home);
  return `<section class="essay" id="experiencia" aria-labelledby="essay-title">
  <header class="essay__head wrap">
    <p class="label reveal">A experiência</p>
    <${headingTag} class="h2 essay__title reveal" id="essay-title">Natureza, arquitetura <em>e silêncio.</em></${headingTag}>
    <p class="essay__intro reveal">Pouca coisa, bem escolhida: mata em volta, madeira por dentro e tempo de sobra.</p>
  </header>
  <ol class="essay__steps">
    ${items.map((e, i) => `<li class="essay__step">
      <figure class="essay__media">${picture(e.photo, { sizes: '(min-width: 56em) 50vw, 100vw' })}</figure>
      <div class="essay__text">
        <h3 class="essay__label"><span aria-hidden="true">${String(i + 1).padStart(2, '0')} — </span>${e.label}</h3>
        <p class="essay__phrase">${e.text}</p>
      </div>
    </li>`).join('\n    ')}
  </ol>
  ${all ? '' : `<p class="essay__more wrap"><a class="link-arrow" href="/experiencias/">Ver a experiência completa ${arrow}</a></p>`}
</section>`;
}

// ------------------------------------------------------------ avaliações ---
const stars = `<svg class="stars" viewBox="0 0 120 22" aria-hidden="true" focusable="false">${[0, 1, 2, 3, 4]
  .map((i) => `<path transform="translate(${i * 24.5} 0)" d="M11 1.2l2.9 6.4 7 .7-5.3 4.7 1.6 6.9L11 16.3 4.8 19.9l1.6-6.9L1.1 8.3l7-.7z"/>`)
  .join('')}</svg>`;

export function rating() {
  const r = site.rating;
  const quotes = site.testimonials.length
    ? `<div class="rating__quotes">${site.testimonials
        .map((t) => `<blockquote class="rating__quote"><p>“${esc(t.text)}”</p><footer>${esc(t.author)} · avaliação no Google</footer></blockquote>`)
        .join('')}</div>`
    : '';
  return `<section class="rating" id="avaliacoes" aria-labelledby="rating-title">
  <div class="rating__grid wrap">
    <div class="rating__score reveal" aria-hidden="true">
      <span class="rating__number">${r.value}</span>
      ${stars}
    </div>
    <div class="rating__text">
      <p class="label reveal">Avaliações</p>
      <h2 class="rating__title reveal" id="rating-title">Nota ${r.value} no ${r.source}, <em>em ${r.count} avaliações.</em></h2>
      <p class="reveal">Quem já subiu a serra conta melhor do que nós. As avaliações estão abertas no Google, escritas por quem já se hospedou por aqui.</p>
      <a class="btn btn--light reveal" href="${esc(site.links.googleReviews)}" target="_blank" rel="noopener" data-track="google_reviews_click">Ver avaliações no Google ${external}</a>
    </div>
    ${quotes}
  </div>
</section>`;
}

// ---------------------------------------------------------- localização ---
export function place({ headingTag = 'h2' } = {}) {
  const a = site.address;
  return `<section class="place" id="localizacao" aria-labelledby="place-title">
  <div class="place__grid wrap">
    <div class="place__text">
      <p class="label reveal">Localização</p>
      <${headingTag} class="h2 place__title reveal" id="place-title">Na serra. <span>Perto de Gramado.</span> <em>Longe da pressa.</em></${headingTag}>
      <p class="reveal">A Na Montanha Eco Space fica no Alto da Pedra, junto à subida do parque, na Serra Grande de Igrejinha. Igrejinha está na Serra Gaúcha, na região próxima de Gramado: perto o bastante para os passeios, longe o bastante para o silêncio.</p>
      <address class="nap reveal">
        <strong>${esc(site.name)}</strong><br>
        ${fullAddressLines().map(esc).join('<br>')}<br>
        ${waLink({ message: generalMessage, label: `WhatsApp ${site.phone.display}` })}
      </address>
      <div class="place__actions reveal">
        <a class="btn btn--solid" href="${esc(site.links.googleDirections)}" target="_blank" rel="noopener" data-track="directions_click">Abrir rota no Google Maps ${external}</a>
        ${waLink({ message: locationMessage, label: `Pedir a localização exata ${arrow}`, className: 'link-arrow' })}
      </div>
    </div>
    <figure class="place__map reveal">
      <iframe src="${esc(site.links.mapEmbed)}" title="Mapa com a localização da Na Montanha Eco Space em ${a.city}, ${a.state}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
      <figcaption>${a.locality}, ${a.city} - ${a.state} · ${site.region}</figcaption>
    </figure>
  </div>
</section>`;
}

// --------------------------------------------------------------- reserva ---
export function reserve({ first, headingTag = 'h2' } = {}) {
  const list = first ? [cabinBy(first), ...cabins.filter((c) => c.key !== first)] : cabins;
  const l = site.links;
  return `<section class="reserve" id="reservar" aria-labelledby="reserve-title" data-section="reservar">
  <div class="reserve__grid wrap">
    <header class="reserve__head">
      <p class="label">Reserva direta</p>
      <${headingTag} class="h2 reserve__title" id="reserve-title">Escolha sua cabana. <em>O resto pode esperar.</em></${headingTag}>
      <p class="reserve__intro">Toque na cabana e a conversa abre no WhatsApp da Na Montanha, com a mensagem pronta. Já tem datas? Informe abaixo que elas vão junto.</p>
    </header>
    <fieldset class="dates" data-dates>
      <legend class="label">Datas · opcional</legend>
      <label class="dates__field"><span>Chegada</span><input type="date" name="checkin" autocomplete="off"></label>
      <label class="dates__field"><span>Saída</span><input type="date" name="checkout" autocomplete="off"></label>
    </fieldset>
    <ul class="reserve__list">
      ${list.map((c) => `<li>${waLink({
        message: c.message,
        className: 'reserve__row',
        cabin: c.key,
        track: 'check_availability direct_booking_lead',
        label: `<span class="reserve__num" aria-hidden="true">${c.numeral}</span><span class="reserve__name">${c.name}</span><span class="reserve__cta">Consultar disponibilidade <span aria-hidden="true">→</span></span>`,
      })}</li>`).join('\n      ')}
    </ul>
    <div class="reserve__general">
      <p class="reserve__doubt">Em dúvida sobre qual escolher?</p>
      ${waLink({ message: generalMessage, label: 'Falar com a Na Montanha', className: 'btn btn--light', track: 'direct_booking_lead' })}
      <p class="reserve__phone">Telefone e WhatsApp <a href="tel:${site.phone.e164}">${site.phone.display}</a></p>
    </div>
    <p class="reserve__otas">A Na Montanha também está no ${maybeLink(l.airbnb, 'Airbnb')}, no ${maybeLink(l.booking, 'Booking')} e na ${maybeLink(l.expedia, 'Expedia')}. Aqui, você combina direto com quem cuida das cabanas.</p>
  </div>
</section>`;
}

// ------------------------------------------------------------- instagram ---
export function social() {
  return `<section class="social" aria-labelledby="social-title">
  <div class="social__grid wrap">
    <p class="label">Instagram</p>
    <h2 class="social__title" id="social-title">A montanha <em>continua por aqui.</em></h2>
    <a class="social__handle" href="${site.links.instagram}" target="_blank" rel="noopener">${site.links.instagramHandle}</a>
    <a class="link-arrow social__cta" href="${site.links.instagram}" target="_blank" rel="noopener">Acompanhar no Instagram ${external}</a>
  </div>
</section>`;
}

// ------------------------------------------------------------------- FAQ ---
export function faqSection({ items = faq } = {}) {
  return `<section class="faq" id="perguntas" aria-labelledby="faq-title">
  <div class="faq__grid wrap">
    <header class="faq__head">
      <p class="label">Perguntas frequentes</p>
      <h2 class="h2 faq__title" id="faq-title">Antes de <em>subir a serra.</em></h2>
      <p>Não encontrou o que procurava? ${waLink({ message: generalMessage, label: 'Pergunte pelo WhatsApp', className: 'inline-link' })}.</p>
    </header>
    <div class="faq__list">
      ${items.map(({ q, a }) => `<details class="faq__item"><summary><h3>${q}</h3></summary><p>${a}</p></details>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

// ------------------------------------------------- peças das páginas internas ---
export function breadcrumbs(trail) {
  return `<nav class="crumbs" aria-label="Você está em"><ol>${trail
    .map(([name, href], i) => (i === trail.length - 1 ? `<li><span aria-current="page">${name}</span></li>` : `<li><a href="${href}">${name}</a></li>`))
    .join('')}</ol></nav>`;
}

export function pageHeader({ label, title, intro, trail, id = 'page-title' }) {
  return `<header class="page-head">
  <div class="page-head__inner wrap">
    ${breadcrumbs(trail)}
    <p class="label">${label}</p>
    <h1 class="page-head__title" id="${id}">${title}</h1>
    ${intro ? `<p class="page-head__intro">${intro}</p>` : ''}
  </div>
</header>`;
}

export function cabinHero(c, trail) {
  return `<section class="cabin-hero" aria-labelledby="cabin-title" data-over-media data-view-cabin="${c.key}">
  <figure class="cabin-hero__media">
    ${picture(c.exterior, { sizes: '(min-width: 56em) 46vw, 100vw', priority: true })}
  </figure>
  <div class="cabin-hero__text">
    ${breadcrumbs(trail)}
    <p class="label">${c.numeral} · ${esc(site.name)}</p>
    <h1 class="cabin-hero__title" id="cabin-title">${c.name}</h1>
    <p class="cabin-hero__tagline">${c.tagline}</p>
    <p class="cabin-hero__intro">${c.pageIntro}</p>
    <div class="cabin-hero__actions">
      ${waLink({ message: c.message, label: 'Consultar disponibilidade', className: 'btn btn--solid', cabin: c.key, track: 'check_availability' })}
      <a class="link-arrow link-arrow--light" href="#outras-cabanas">Ver as outras cabanas ${arrow}</a>
    </div>
  </div>
</section>`;
}

export function cabinFacts(c) {
  const listing = Object.entries(c.listings).filter(([, u]) => u);
  const names = { airbnb: 'Airbnb', booking: 'Booking', expedia: 'Expedia' };
  return `<section class="cabin-facts" aria-labelledby="facts-title">
  <div class="cabin-facts__grid wrap">
    <h2 class="h2 cabin-facts__title" id="facts-title">${c.name}, <em>em resumo.</em></h2>
    <dl class="facts">
      <div><dt>Hospedagem</dt><dd><a href="/">${esc(site.name)}</a></dd></div>
      <div><dt>Onde</dt><dd>Alto da Pedra, Serra Grande · Igrejinha, RS</dd></div>
      <div><dt>Região</dt><dd>Serra Gaúcha, perto de Gramado</dd></div>
      <div><dt>Reserva</dt><dd>${waLink({ message: c.message, label: 'Direto pelo WhatsApp', cabin: c.key, track: 'check_availability' })}</dd></div>
      ${listing.length ? `<div><dt>Também em</dt><dd>${listing.map(([k, u]) => maybeLink(u, names[k])).join(', ')}</dd></div>` : ''}
    </dl>
  </div>
</section>`;
}

export function cabinGallery(c) {
  if (!c.interiors.length) return '';
  return `<section class="gallery" aria-labelledby="gallery-title">
  <h2 class="visually-hidden" id="gallery-title">Fotos da ${c.name}</h2>
  <div class="gallery__grid wrap">
    ${c.interiors.map((k, i) => `<figure class="gallery__item gallery__item--${i + 1} reveal">${picture(k, { sizes: '(min-width: 56em) 44vw, 100vw' })}</figure>`).join('')}
  </div>
</section>`;
}

export function otherCabins(current) {
  const others = cabins.filter((c) => c.key !== current);
  return `<section class="others" id="outras-cabanas" aria-labelledby="others-title">
  <div class="others__grid wrap">
    <h2 class="h2 others__title" id="others-title">As outras <em>cabanas.</em></h2>
    <ul class="others__list">
      ${others.map((c) => `<li><a class="others__item" href="${cabinUrl(c)}">
        ${picture(c.photo, { sizes: '(min-width: 56em) 18vw, 40vw', className: 'others__img' })}
        <span class="others__num" aria-hidden="true">${c.numeral}</span>
        <span class="others__name">${c.name}</span>
        <span class="others__tag">${c.tagline}</span>
      </a></li>`).join('')}
    </ul>
  </div>
</section>`;
}

export { cabinBy, cabinUrl };
