/* ==========================================================================
   Glamping Toca do Tucano — comportamento do site
   --------------------------------------------------------------------------
   Tudo o que costuma mudar está em CONFIG, logo abaixo.
   ========================================================================== */

const CONFIG = {
  // WhatsApp de reservas, só números, com DDI 55 e DDD 12
  whatsapp: '5512992141763',
  mensagem: 'Olá! Conheci a Toca do Tucano pelo site e gostaria de consultar disponibilidade para uma hospedagem.',

  // Medição. Deixe vazio o que ainda não existe: nada é carregado sem ID.
  //   gtm:       'GTM-XXXXXXX'   (se usar o Tag Manager, deixe ga4 vazio e configure o GA4 dentro dele)
  //   ga4:       'G-XXXXXXXXXX'
  //   metaPixel: '123456789012345'
  analytics: {
    gtm: '',
    ga4: '',
    metaPixel: ''
  }
};

(() => {
  'use strict';

  const doc = document.documentElement;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ------------------------------------------------------------------------
     Medição: GA4, GTM e Meta Pixel (carregados só se houver ID)
     ------------------------------------------------------------------------ */
  window.dataLayer = window.dataLayer || [];
  const { gtm, ga4, metaPixel } = CONFIG.analytics;

  const loadScript = (src) => {
    const s = document.createElement('script');
    s.async = true;
    s.src = src;
    document.head.appendChild(s);
  };

  if (gtm) {
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    loadScript('https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(gtm));
  } else if (ga4) {
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', ga4);
    loadScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ga4));
  }

  if (metaPixel) {
    /* eslint-disable */
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s) }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', metaPixel);
    window.fbq('track', 'PageView');
  }

  // Eventos do Pixel com equivalente padrão da Meta
  const PIXEL_PADRAO = { click_whatsapp: 'Contact', direct_booking_lead: 'Lead', view_accommodation: 'ViewContent' };

  const track = (name, params = {}) => {
    window.dataLayer.push({ event: name, ...params });
    if (!gtm && ga4 && window.gtag) window.gtag('event', name, params);
    if (metaPixel && window.fbq) {
      if (PIXEL_PADRAO[name]) window.fbq('track', PIXEL_PADRAO[name], params);
      else window.fbq('trackCustom', name, params);
    }
  };
  window.tocaTrack = track;

  /* ------------------------------------------------------------------------
     WhatsApp
     ------------------------------------------------------------------------ */
  const waUrl = (text) => 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(text);

  $$('[data-wa]').forEach((link) => {
    const custom = link.getAttribute('data-wa');
    link.href = waUrl(custom || CONFIG.mensagem);
    link.addEventListener('click', () => {
      const where = link.closest('.dock') ? 'barra_fixa' : link.closest('footer') ? 'rodape' : (link.closest('section[id]')?.id || 'site');
      track('click_whatsapp', { link_location: where });
    });
  });

  $$('[data-track]').forEach((link) => {
    link.addEventListener('click', () => {
      const params = { link_url: link.href };
      if (link.dataset.trackLabel) params.listing = link.dataset.trackLabel;
      track(link.dataset.track, params);
    });
  });

  /* ------------------------------------------------------------------------
     Cabeçalho: fica sólido depois do vídeo
     ------------------------------------------------------------------------ */
  const masthead = $('[data-masthead]');
  const hero = $('[data-hero]');
  const dock = $('[data-dock]');
  const booking = $('[data-booking]');
  let heroVisible = true;
  let bookingVisible = false;

  const syncDock = () => {
    if (!dock) return;
    dock.classList.toggle('is-visible', !heroVisible && !bookingVisible);
  };

  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      masthead.classList.toggle('is-solid', !heroVisible);
      syncDock();
    }, { rootMargin: '-72px 0px 0px 0px' }).observe(hero);
  } else if (masthead) {
    masthead.classList.add('is-solid');
  }

  if (dock) {
    dock.hidden = false;
    if (booking && 'IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        bookingVisible = entry.isIntersecting;
        syncDock();
      }, { threshold: 0.15 }).observe(booking);
    }
  }

  /* ------------------------------------------------------------------------
     Menu no celular
     ------------------------------------------------------------------------ */
  const toggle = $('[data-menu-toggle]');
  const menu = $('[data-menu]');
  const setMenu = (open) => {
    doc.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.menu-toggle__label').textContent = open ? 'Fechar' : 'Menu';
    document.body.style.overflow = open ? 'hidden' : '';
  };
  if (toggle && menu) {
    toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && doc.classList.contains('menu-open')) {
        setMenu(false);
        toggle.focus();
      }
    });
    window.matchMedia('(min-width: 64em)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
  }

  /* ------------------------------------------------------------------------
     Vídeo do topo
     - a foto (poster) aparece primeiro e é o maior elemento da página;
     - o vídeo só começa a baixar depois que a página carregou;
     - celular em pé recebe o corte vertical; telas largas, o horizontal;
     - AV1 quando o aparelho decodifica, H.264 nos demais;
     - não toca com "reduzir movimento" ou economia de dados: fica a foto e
       um botão para ver o vídeo.
     ------------------------------------------------------------------------ */
  const video = $('[data-hero-video]');
  const videoToggle = $('[data-video-toggle]');

  if (video && hero) {
    const conn = navigator.connection || {};
    const economia = conn.saveData === true || /(^|-)2g$/.test(conn.effectiveType || '');
    const portrait = window.matchMedia('(max-aspect-ratio: 1/1)');
    let userPaused = false;
    let loadedFor = null;
    let viewed = false;

    const pickSource = () => {
      const kind = portrait.matches ? 'portrait' : 'landscape';
      const av1 = portrait.matches ? 'video/mp4; codecs="av01.0.04M.08"' : 'video/mp4; codecs="av01.0.08M.08"';
      const useAv1 = video.canPlayType(av1) === 'probably';
      return { kind, src: video.dataset[kind + (useAv1 ? 'Av1' : 'H264')] };
    };

    const setToggle = (playing) => {
      videoToggle.hidden = false;
      videoToggle.setAttribute('aria-pressed', String(!playing));
      videoToggle.querySelector('span').textContent = playing ? 'Pausar vídeo' : 'Ver vídeo';
      videoToggle.querySelector('use').setAttribute('href', playing ? '#i-pause' : '#i-play');
    };

    const play = () => {
      const p = video.play();
      if (p && p.catch) p.catch(() => setToggle(false));
    };

    const load = () => {
      const { kind, src } = pickSource();
      if (loadedFor === kind) return;
      loadedFor = kind;
      video.src = src;
      video.load();
      play();
    };

    video.addEventListener('playing', () => {
      hero.classList.add('is-playing');
      setToggle(true);
      if (!viewed) {
        viewed = true;
        track('video_hero_view', { video_variant: loadedFor });
      }
    });
    video.addEventListener('pause', () => setToggle(false));

    videoToggle.addEventListener('click', () => {
      if (!loadedFor) { userPaused = false; load(); return; }
      if (video.paused) { userPaused = false; play(); } else { userPaused = true; video.pause(); }
    });

    // pausa fora da tela para não gastar bateria; volta quando reaparece
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        if (!loadedFor) return;
        if (entry.isIntersecting && !userPaused) play();
        else if (!entry.isIntersecting && !video.paused) video.pause();
      }).observe(hero);
    }

    portrait.addEventListener('change', () => {
      if (loadedFor && !userPaused) { hero.classList.remove('is-playing'); load(); }
    });

    if (reduceMotion.matches || economia) {
      setToggle(false);
    } else {
      const start = () => ('requestIdleCallback' in window ? requestIdleCallback(load, { timeout: 1500 }) : setTimeout(load, 200));
      if (document.readyState === 'complete') start();
      else window.addEventListener('load', start, { once: true });
    }
  }

  /* ------------------------------------------------------------------------
     Revelações ao rolar
     ------------------------------------------------------------------------ */
  const reveals = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  /* ------------------------------------------------------------------------
     Visualização dos chalés (uma vez)
     ------------------------------------------------------------------------ */
  const chalets = $('[data-accommodation]');
  if (chalets && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        track('view_accommodation', { content_name: 'Chalés em A — Toca do Tucano' });
        io.disconnect();
      }
    }, { threshold: 0.35 });
    io.observe(chalets);
  }

  /* ------------------------------------------------------------------------
     Mapa: só carrega o Google Maps quando a pessoa pede
     ------------------------------------------------------------------------ */
  const map = $('[data-map]');
  const mapBtn = $('[data-map-load]');
  if (map && mapBtn) {
    mapBtn.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.google.com/maps?q=' + encodeURIComponent('Glamping Toca do Tucano, Estrada das Laranjeiras km 2, Paraibuna - SP') + '&output=embed';
      iframe.title = 'Mapa: Glamping Toca do Tucano, Paraibuna — SP';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.allowFullscreen = true;
      map.appendChild(iframe);
      $('.map__placeholder', map).remove();
      track('map_load');
    });
  }

  /* ------------------------------------------------------------------------
     Reserva direta → WhatsApp
     ------------------------------------------------------------------------ */
  const form = $('[data-booking-form]');
  if (form) {
    const inChegada = $('#chegada', form);
    const inSaida = $('#saida', form);
    const selAcomod = $('#acomodacao', form);
    const errorBox = $('[data-form-error]', form);

    const iso = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    const parse = (v) => { const [y, m, d] = v.split('-').map(Number); return new Date(y, m - 1, d); };
    const br = (v) => v.split('-').reverse().join('/');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    inChegada.min = iso(today);
    inSaida.min = iso(new Date(today.getTime() + 86400000));

    let started = false;
    const markStart = () => {
      if (started) return;
      started = true;
      track('check_availability', { step: 'form_start' });
    };
    [inChegada, inSaida, selAcomod].forEach((el) => el.addEventListener('change', markStart));

    inChegada.addEventListener('change', () => {
      if (!inChegada.value) return;
      const next = new Date(parse(inChegada.value).getTime() + 86400000);
      inSaida.min = iso(next);
      if (inSaida.value && parse(inSaida.value) <= parse(inChegada.value)) inSaida.value = iso(next);
    });

    const fail = (msg, field) => {
      errorBox.textContent = msg;
      if (field) { field.setAttribute('aria-invalid', 'true'); field.focus(); }
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      errorBox.textContent = '';
      [inChegada, inSaida].forEach((f) => f.removeAttribute('aria-invalid'));

      const c = inChegada.value;
      const s = inSaida.value;
      let text = CONFIG.mensagem;
      let nights = 0;

      if (c && s) {
        if (parse(c) < today) return fail('A data de chegada já passou. Escolha outra data.', inChegada);
        nights = Math.round((parse(s) - parse(c)) / 86400000);
        if (nights < 1) return fail('A saída precisa ser depois da chegada.', inSaida);
        text += '\n\nChegada: ' + br(c) + '\nSaída: ' + br(s) + ' (' + nights + (nights === 1 ? ' noite)' : ' noites)');
      } else if (c || s) {
        if (c && parse(c) < today) return fail('A data de chegada já passou. Escolha outra data.', inChegada);
        text += c ? '\n\nChegada: ' + br(c) + ' (saída a definir)' : '\n\nSaída: ' + br(s) + ' (chegada a definir)';
      } else {
        text += '\n\nAinda não tenho as datas definidas.';
      }
      if (selAcomod.value) text += '\nAcomodação: ' + selAcomod.value;

      const url = waUrl(text);
      const params = { checkin: c || null, checkout: s || null, nights: nights || null, accommodation: selAcomod.value || 'qualquer' };
      track('check_availability', { step: 'submit', ...params });
      track('direct_booking_lead', params);
      track('click_whatsapp', { link_location: 'formulario_reserva' });

      const win = window.open(url, '_blank');
      if (win) win.opener = null;
      else window.location.href = url;
    });
  }

  /* ------------------------------------------------------------------------
     Ano no rodapé
     ------------------------------------------------------------------------ */
  const year = $('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();
