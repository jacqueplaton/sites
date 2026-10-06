/* ==========================================================================
   Na Montanha Eco Space — comportamento
   --------------------------------------------------------------------------
   Pequeno de propósito. O site funciona sem JavaScript; isto acrescenta:
   menu no celular, cabeçalho que muda ao rolar, vídeo que só carrega e toca
   quando aparece, datas na mensagem do WhatsApp e eventos de medição.
   ========================================================================== */
(function () {
  'use strict';

  var d = document;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------------------------------------------------------- medição --- */
  // Eventos vão para o dataLayer (GTM/GA4) e, se existir, para o Meta Pixel.
  // Sem IDs configurados, ficam só no dataLayer local — nada é enviado.
  window.dataLayer = window.dataLayer || [];
  function track(event, params) {
    params = params || {};
    window.dataLayer.push(Object.assign({ event: event }, params));
    if (typeof window.gtag === 'function' && !window.__nmGtm) window.gtag('event', event, params);
    if (typeof window.fbq === 'function') {
      if (event === 'direct_booking_lead') window.fbq('track', 'Lead', params);
      if (event === 'click_whatsapp') window.fbq('track', 'Contact', params);
      window.fbq('trackCustom', event, params);
    }
  }
  window.nmTrack = track;

  d.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.href;
    var holder = a.closest('[data-cabin]');
    var section = a.closest('section[id], header, footer, dialog');
    var params = {
      cabin: a.getAttribute('data-cabin') || (holder && holder.getAttribute('data-cabin')) || '',
      link_location: section ? section.id || section.tagName.toLowerCase() : '',
      link_text: (a.textContent || '').trim().slice(0, 80)
    };
    if (/wa\.me|whatsapp\.com/.test(href)) track('click_whatsapp', params);
    if (/instagram\.com/.test(href)) track('instagram_click', params);
    if (/airbnb\./.test(href)) track('airbnb_click', params);
    if (/booking\.com/.test(href)) track('booking_click', params);
    if (/expedia\./.test(href)) track('expedia_click', params);
    (a.getAttribute('data-track') || '').split(/\s+/).forEach(function (ev) {
      if (ev) track(ev, params);
    });
  });

  // view_cabin + view_cabana_<nome>: uma vez por página, quando a cabana
  // aparece de fato na tela.
  var seen = {};
  if ('IntersectionObserver' in window) {
    var cabinObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var key = entry.target.getAttribute('data-view-cabin');
        cabinObserver.unobserve(entry.target);
        if (seen[key]) return;
        seen[key] = true;
        track('view_cabin', { cabin: key });
        track('view_cabana_' + key, { cabin: key });
      });
    }, { threshold: 0.4 });
    d.querySelectorAll('[data-view-cabin]').forEach(function (el) { cabinObserver.observe(el); });
  }

  /* --------------------------------------------------------- cabeçalho --- */
  var header = d.querySelector('[data-header]');
  var overMedia = d.querySelector('[data-over-media]');
  if (header && overMedia && header.getAttribute('data-tone') === 'over-media' && 'IntersectionObserver' in window) {
    var h = header.offsetHeight;
    new IntersectionObserver(function (entries) {
      header.classList.toggle('is-solid', !entries[0].isIntersecting);
    }, { rootMargin: '-' + h + 'px 0px 0px 0px', threshold: 0 }).observe(overMedia);
  }

  /* -------------------------------------------------------------- menu --- */
  var menu = d.getElementById('menu');
  var openers = d.querySelectorAll('[data-menu-open]');
  if (menu && typeof menu.showModal === 'function') {
    openers.forEach(function (btn) {
      btn.setAttribute('role', 'button');
      btn.setAttribute('aria-expanded', 'false');
      btn.addEventListener('keydown', function (e) {
        if (e.key === ' ') { e.preventDefault(); btn.click(); }
      });
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        menu.showModal();
        btn.setAttribute('aria-expanded', 'true');
      });
    });
    menu.addEventListener('close', function () {
      openers.forEach(function (btn) { btn.setAttribute('aria-expanded', 'false'); });
    });
    menu.addEventListener('click', function (e) {
      if (e.target === menu || e.target.closest('[data-menu-close]') || e.target.closest('a[href]')) menu.close();
    });
  }

  /* ------------------------------------------------------------- vídeo --- */
  d.querySelectorAll('[data-film]').forEach(function (film) {
    var video = film.querySelector('video');
    var toggle = film.querySelector('[data-film-toggle]');
    if (!video || !toggle) return;
    var label = toggle.querySelector('.film__toggle-label');
    var conn = navigator.connection || {};
    var lightData = conn.saveData || /(^|-)2g$/.test(conn.effectiveType || '');
    // Com "reduzir movimento" ou economia de dados, o vídeo não toca
    // sozinho: fica o pôster e o botão para tocar.
    var userPaused = reduceMotion.matches || lightData;
    var visible = false;

    video.controls = false;
    video.removeAttribute('controls');
    toggle.hidden = false;

    function sync() {
      var playing = !video.paused;
      toggle.setAttribute('aria-pressed', playing ? 'false' : 'true');
      label.textContent = playing ? 'Pausar vídeo' : 'Reproduzir vídeo';
    }
    function play() {
      var p = video.play();
      if (p && p.catch) p.catch(function () { userPaused = true; sync(); });
    }

    toggle.addEventListener('click', function () {
      if (video.paused) { userPaused = false; play(); } else { userPaused = true; video.pause(); }
    });
    video.addEventListener('play', sync);
    video.addEventListener('pause', sync);
    video.addEventListener('playing', function () { film.classList.add('is-playing'); });
    video.addEventListener('timeupdate', function () {
      var dur = video.duration || 0;
      film.classList.toggle('is-looping', dur > 0 && video.currentTime > dur - 0.7);
    });
    sync();

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible && !userPaused) play();
        else if (!visible && !video.paused) video.pause();
      }, { threshold: 0.3 }).observe(film);
    }
    d.addEventListener('visibilitychange', function () {
      if (d.hidden) video.pause();
      else if (visible && !userPaused) play();
    });
  });

  /* ------------------------------------------- datas na mensagem do WhatsApp --- */
  var dates = d.querySelector('[data-dates]');
  if (dates) {
    var checkin = dates.querySelector('[name="checkin"]');
    var checkout = dates.querySelector('[name="checkout"]');
    var iso = function (dt) {
      return dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0');
    };
    var br = function (v) { return v.split('-').reverse().join('/'); };
    checkin.min = iso(new Date());
    var datesTracked = false;

    var update = function () {
      if (checkin.value) {
        var next = new Date(checkin.value + 'T12:00:00');
        next.setDate(next.getDate() + 1);
        checkout.min = iso(next);
        if (checkout.value && checkout.value <= checkin.value) checkout.value = '';
      }
      var extra = '';
      if (checkin.value && checkout.value) extra = ' Datas: chegada em ' + br(checkin.value) + ' e saída em ' + br(checkout.value) + '.';
      else if (checkin.value) extra = ' Chegada em ' + br(checkin.value) + '.';
      else if (checkout.value) extra = ' Saída em ' + br(checkout.value) + '.';
      d.querySelectorAll('[data-wa-base]').forEach(function (a) {
        var url = new URL(a.href);
        a.href = url.origin + url.pathname + '?text=' + encodeURIComponent(a.getAttribute('data-wa-base') + extra);
      });
      if (checkin.value && checkout.value && !datesTracked) {
        datesTracked = true;
        track('select_dates', { has_checkin: true, has_checkout: true });
      }
    };
    checkin.addEventListener('change', update);
    checkout.addEventListener('change', update);
  }

  /* -------------------------------------------------- aviso de cookies --- */
  // Só existe na página quando algum ID de medição está configurado.
  var consent = d.querySelector('[data-consent]');
  if (consent) {
    var stored = null;
    try { stored = localStorage.getItem('nm-consent'); } catch (e) {}
    if (!stored) consent.hidden = false;
    var decide = function (granted) {
      try { localStorage.setItem('nm-consent', granted ? 'granted' : 'denied'); } catch (e) {}
      if (granted) {
        if (typeof window.gtag === 'function') {
          window.gtag('consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted' });
        }
        if (typeof window.fbq === 'function') window.fbq('consent', 'grant');
      }
      consent.hidden = true;
    };
    consent.querySelector('[data-consent-accept]').addEventListener('click', function () { decide(true); });
    consent.querySelector('[data-consent-decline]').addEventListener('click', function () { decide(false); });
  }
})();
