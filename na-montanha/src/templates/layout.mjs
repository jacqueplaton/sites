// Estrutura comum a todas as páginas: <head>, cabeçalho, menu, rodapé.
import { site, cabins, generalMessage } from '../data/site.mjs';
import { ctx, esc, abs, asset, waLink, maybeLink, fullAddressLines, imageUrl, arrow, external } from './helpers.mjs';

export const NAV = [
  { label: 'Início', href: '/' },
  { label: 'Cabanas', href: '/cabanas/' },
  { label: 'Experiência', href: '/experiencias/' },
  { label: 'Localização', href: '/localizacao/' },
  { label: 'Avaliações', href: '/#avaliacoes' },
  { label: 'Contato', href: '/contato/' },
];

const hasAnalytics = () => Boolean(site.analytics.gtm || site.analytics.ga4 || site.analytics.metaPixel);

// ------------------------------------------------------------ medição ---
// Nada disso é gerado enquanto os IDs em site.mjs estiverem vazios.
function analyticsHead() {
  const { gtm, ga4, metaPixel } = site.analytics;
  if (!hasAnalytics()) return '';
  let out = `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}` +
    `gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});` +
    `try{if(localStorage.getItem('nm-consent')==='granted')gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'})}catch(e){}</script>`;
  if (gtm) {
    out += `<script>window.__nmGtm=1;(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f)})(window,document,'script','dataLayer','${esc(gtm)}');</script>`;
  } else if (ga4) {
    out += `<script async src="https://www.googletagmanager.com/gtag/js?id=${esc(ga4)}"></script><script>gtag('js',new Date());gtag('config','${esc(ga4)}');</script>`;
  }
  if (metaPixel) {
    out += `<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');` +
      `try{if(localStorage.getItem('nm-consent')!=='granted')fbq('consent','revoke')}catch(e){fbq('consent','revoke')}fbq('init','${esc(metaPixel)}');fbq('track','PageView');</script>`;
  }
  return out;
}

function consentBar() {
  if (!hasAnalytics()) return '';
  return `<div class="consent" data-consent hidden role="region" aria-label="Aviso de cookies">
  <p>Usamos cookies de medição para entender as visitas e melhorar o site. <a href="/politica-de-privacidade/">Política de Privacidade</a></p>
  <div class="consent__actions"><button type="button" class="btn btn--solid" data-consent-accept>Aceitar</button><button type="button" class="btn btn--line" data-consent-decline>Recusar</button></div>
</div>`;
}

// ---------------------------------------------------------------- head ---
function head(page) {
  const title = page.title;
  const desc = page.description;
  const url = abs(page.path);
  const ogImage = page.ogImage || abs(asset('img/og-na-montanha.jpg'));
  const v = site.analytics;
  return `<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="${page.robots || 'index, follow, max-image-preview:large'}">
<meta name="theme-color" content="#121310">
<meta name="format-detection" content="telephone=no">
${v.googleSiteVerification ? `<meta name="google-site-verification" content="${esc(v.googleSiteVerification)}">` : ''}
${v.bingSiteVerification ? `<meta name="msvalidate.01" content="${esc(v.bingSiteVerification)}">` : ''}
<meta property="og:type" content="website">
<meta property="og:locale" content="${site.locale}">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(page.ogTitle || title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="${page.ogImage ? page.ogImageWidth || 800 : 1200}">
<meta property="og:image:height" content="${page.ogImage ? page.ogImageHeight || 1000 : 630}">
<meta property="og:image:alt" content="${esc(page.ogImageAlt || 'Cabanas da Na Montanha Eco Space de dia, ao entardecer e à noite, em Igrejinha, na Serra Gaúcha.')}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(page.ogTitle || title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${ogImage}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preload" href="${asset('fonts/newsreader-roman.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${asset('fonts/instrument-sans.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${asset('css/site.css')}">
<script>document.documentElement.classList.add('js')</script>
${analyticsHead()}
${page.schema || ''}
</head>`;
}

// ------------------------------------------------------------- header ---
function header(page) {
  const current = (href) => (href === page.navCurrent ? ' aria-current="page"' : '');
  return `<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
<header class="site-header" data-tone="${page.headerTone || 'solid'}" data-header>
  <div class="site-header__bar">
    <a class="wordmark" href="/" aria-label="${esc(site.name)}: página inicial">
      <span class="wordmark__name">Na Montanha</span><span class="wordmark__sub">Eco Space</span>
    </a>
    <nav class="site-nav" aria-label="Principal">
      <ul>${NAV.map((n) => `<li><a href="${n.href}"${current(n.href)}>${n.label}</a></li>`).join('')}</ul>
    </nav>
    <div class="site-header__actions">
      <a class="btn btn--header" href="#reservar" data-track="check_availability">Reservar</a>
      <a class="menu-toggle" href="#rodape" aria-haspopup="dialog" aria-controls="menu" data-menu-open>Menu</a>
    </div>
  </div>
</header>
<dialog class="menu" id="menu" aria-label="Menu">
  <div class="menu__top">
    <span class="wordmark wordmark--menu" aria-hidden="true"><span class="wordmark__name">Na Montanha</span><span class="wordmark__sub">Eco Space</span></span>
    <button class="menu__close" type="button" data-menu-close>Fechar</button>
  </div>
  <nav aria-label="Menu">
    <ol class="menu__list">${NAV.map((n) => `<li><a href="${n.href}"${current(n.href)}>${n.label}</a></li>`).join('')}</ol>
  </nav>
  <div class="menu__foot">
    <a class="btn btn--solid" href="#reservar" data-track="check_availability" data-menu-link>Consultar disponibilidade</a>
    ${waLink({ message: generalMessage, label: `WhatsApp ${site.phone.display}`, className: 'menu__wa' })}
  </div>
</dialog>`;
}

// ------------------------------------------------------------- footer ---
function footer() {
  const l = site.links;
  return `<footer class="site-footer" id="rodape">
  <div class="site-footer__inner">
    <p class="site-footer__mark" aria-hidden="true">Na Montanha</p>
    <div class="site-footer__grid">
      <div class="site-footer__col site-footer__col--nap">
        <p class="label">${esc(site.name)}</p>
        <address>
          ${fullAddressLines().map(esc).join('<br>')}<br>
          <span class="site-footer__region">${site.region} · perto de ${site.nearby}</span>
        </address>
      </div>
      <div class="site-footer__col">
        <p class="label">Contato</p>
        <ul>
          <li>${waLink({ message: generalMessage, label: `WhatsApp ${site.phone.display}` })}</li>
          <li><a href="${l.instagram}" target="_blank" rel="noopener">Instagram ${site.links.instagramHandle}</a></li>
          <li><a href="/contato/">Contato e reservas</a></li>
        </ul>
      </div>
      <nav class="site-footer__col" aria-label="Rodapé">
        <p class="label">No site</p>
        <ul>
          <li><a href="/cabanas/">Cabanas</a></li>
          ${cabins.map((c) => `<li><a href="/cabanas/${c.slug}/">${c.name}</a></li>`).join('')}
          <li><a href="/experiencias/">Experiência</a></li>
          <li><a href="/localizacao/">Localização</a></li>
        </ul>
      </nav>
      <div class="site-footer__col">
        <p class="label">Também estamos em</p>
        <ul>
          <li>${maybeLink(l.google || l.googleReviews, 'Google')}</li>
          <li>${maybeLink(l.airbnb, 'Airbnb')}</li>
          <li>${maybeLink(l.booking, 'Booking')}</li>
          <li>${maybeLink(l.expedia, 'Expedia')}</li>
        </ul>
      </div>
    </div>
    <div class="site-footer__legal">
      <p>© ${ctx.year} ${esc(site.name)} · ${site.address.city} - ${site.address.state} · ${site.region}</p>
      <p><a href="/politica-de-privacidade/">Política de Privacidade</a></p>
    </div>
  </div>
</footer>`;
}

export function render(page) {
  return `<!doctype html>
<html lang="${site.lang}">
${head(page)}
<body class="${page.bodyClass || ''}">
${header(page)}
<main id="conteudo" tabindex="-1">
${page.main}
</main>
${footer()}
${consentBar()}
<script src="${asset('js/site.js')}" defer></script>
</body>
</html>
`;
}

export { hasAnalytics, imageUrl, arrow, external };
