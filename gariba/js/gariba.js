/* ==========================================================================
   GARIBA — comportamento da prévia
   Tudo aqui é progressivo: sem JavaScript, a página continua completa
   (poster no lugar do vídeo, links e menu de âncoras funcionando).
   ========================================================================== */
(function () {
  'use strict';

  var doc = document;
  var mqDesktop = window.matchMedia('(min-width: 768px)');
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var hasIO = 'IntersectionObserver' in window;

  function onChange(mq, fn) {
    if (mq.addEventListener) mq.addEventListener('change', fn);
    else if (mq.addListener) mq.addListener(fn);
  }

  /* ------------------------------------------------------------------
     Medição de intenção. Empurra eventos para window.dataLayer, onde um
     Google Tag Manager (ou similar) pode lê-los depois. Clique em
     "Ver disponibilidade" é intenção, nunca reserva concluída.
     ------------------------------------------------------------------ */
  window.dataLayer = window.dataLayer || [];
  function track(event, data) {
    var payload = { event: event };
    for (var k in data) if (Object.prototype.hasOwnProperty.call(data, k)) payload[k] = data[k];
    window.dataLayer.push(payload);
  }
  doc.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-track]');
    if (!el) return;
    track('gariba_click', { action: el.getAttribute('data-track'), origin: el.getAttribute('data-origin') || '' });
  });

  /* ------------------------------------------------------------------
     Cabeçalho: transparente sobre o hero, sólido depois dele.
     ------------------------------------------------------------------ */
  var header = doc.querySelector('[data-header]');
  var hero = doc.querySelector('[data-hero]');
  var state = { heroVisible: true, finalVisible: false, menuOpen: false };

  /* ------------------------------------------------------------------
     Menu do celular: abre/fecha por toque e teclado, Esc fecha,
     foco volta ao botão, Tab circula dentro do menu aberto.
     ------------------------------------------------------------------ */
  var menuBtn = doc.querySelector('[data-menu-toggle]');
  var menu = doc.getElementById('menu-mobile');

  function menuFocusables() {
    return [menuBtn].concat(Array.prototype.slice.call(menu.querySelectorAll('a[href], button')));
  }
  function openMenu() {
    menu.hidden = false;
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.querySelector('.menu-toggle-label').textContent = 'Fechar';
    header.classList.add('is-menu-open');
    state.menuOpen = true;
    updateBookBar();
    var first = menu.querySelector('a[href]');
    if (first) first.focus();
  }
  function closeMenu(returnFocus) {
    if (!state.menuOpen) return;
    menu.hidden = true;
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.querySelector('.menu-toggle-label').textContent = 'Menu';
    header.classList.remove('is-menu-open');
    state.menuOpen = false;
    updateBookBar();
    if (returnFocus) menuBtn.focus();
  }
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () {
      state.menuOpen ? closeMenu(true) : openMenu();
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu(false);
    });
    doc.addEventListener('keydown', function (e) {
      if (!state.menuOpen) return;
      if (e.key === 'Escape') { e.preventDefault(); closeMenu(true); return; }
      if (e.key === 'Tab') {
        var items = menuFocusables();
        var first = items[0], last = items[items.length - 1];
        if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    doc.addEventListener('click', function (e) {
      if (state.menuOpen && !header.contains(e.target)) closeMenu(false);
    });
    onChange(mqDesktop, function () { if (mqDesktop.matches) closeMenu(false); });
  }

  /* ------------------------------------------------------------------
     Vídeo do hero
     - poster (<picture>) aparece imediatamente; o filme só é baixado
       depois, na variante do dispositivo (16:9 ou quadrada)
     - movimento reduzido ou economia de dados: fica no poster até a
       pessoa pedir para reproduzir
     - pausa fora da tela; respeita a pausa manual
     - se falhar, o poster permanece e o controle some
     ------------------------------------------------------------------ */
  var video = doc.querySelector('[data-hero-video]');
  var vBtn = doc.querySelector('[data-video-toggle]');
  var vLabel = vBtn && vBtn.querySelector('.video-toggle-label');
  var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  var saveData = !!(conn && conn.saveData);
  var autoplayAllowed = !(mqReduce.matches || saveData);
  var userPaused = false;
  var loadedSrc = '';
  var heroInView = true;

  // WebM (VP9) quando o navegador garante suporte; MP4 (H.264) nos demais,
  // como o Safari em versões antigas do iOS.
  var ext = video && video.canPlayType && video.canPlayType('video/webm; codecs="vp9"') === 'probably' ? '.webm' : '.mp4';
  function pickSrc() {
    return (mqDesktop.matches ? video.getAttribute('data-src-wide') : video.getAttribute('data-src-square')) + ext;
  }
  function setPausedUI(paused) {
    if (!vBtn) return;
    vBtn.classList.toggle('is-paused', paused);
    vLabel.textContent = paused ? 'Reproduzir vídeo' : 'Pausar vídeo';
  }
  function ensureSrc() {
    var src = pickSrc();
    if (loadedSrc === src) return;
    loadedSrc = src;
    video.src = src;
  }
  function playVideo() {
    ensureSrc();
    var p = video.play();
    if (p && typeof p.catch === 'function') {
      p.catch(function () { setPausedUI(true); });   // autoplay bloqueado: fica no poster
    }
  }

  if (video && vBtn && typeof video.play === 'function') {
    vBtn.hidden = false;
    setPausedUI(true);

    video.addEventListener('playing', function () {
      video.classList.add('is-playing');
      setPausedUI(false);
    });
    video.addEventListener('pause', function () { setPausedUI(true); });
    video.addEventListener('error', function () {
      video.classList.remove('is-playing');
      video.removeAttribute('src');
      vBtn.hidden = true;
    });

    vBtn.addEventListener('click', function () {
      if (video.paused) {
        userPaused = false;
        autoplayAllowed = true;
        playVideo();
      } else {
        userPaused = true;
        video.pause();
      }
    });

    onChange(mqDesktop, function () {
      if (!loadedSrc) return;
      var wasPlaying = !video.paused;
      ensureSrc();
      if (wasPlaying) playVideo();
    });

    onChange(mqReduce, function () {
      if (mqReduce.matches && !video.paused) { userPaused = true; video.pause(); }
    });

    if (autoplayAllowed) playVideo();
  }

  /* ------------------------------------------------------------------
     Barra de disponibilidade no celular: aparece depois do hero e some
     quando o bloco final de reserva (ou o rodapé) está na tela.
     ------------------------------------------------------------------ */
  var bar = doc.querySelector('[data-book-bar]');
  var barLink = bar && bar.querySelector('a');
  function updateBookBar() {
    if (!bar) return;
    var show = !mqDesktop.matches && !state.heroVisible && !state.finalVisible && !state.menuOpen;
    bar.classList.toggle('is-visible', show);
    bar.setAttribute('aria-hidden', show ? 'false' : 'true');
    if (barLink) barLink.setAttribute('tabindex', show ? '0' : '-1');
    doc.body.classList.toggle('has-book-bar', show);
  }
  onChange(mqDesktop, updateBookBar);

  /* ------------------------------------------------------------------
     Observadores
     ------------------------------------------------------------------ */
  if (hasIO) {
    // Hero: estado do cabeçalho, da barra e do vídeo
    if (hero) {
      new IntersectionObserver(function (entries) {
        var e = entries[0];
        state.heroVisible = e.isIntersecting;
        heroInView = e.isIntersecting;
        header.classList.toggle('is-solid', !e.isIntersecting);
        updateBookBar();
        if (video && loadedSrc) {
          if (!heroInView && !video.paused) video.pause();
          else if (heroInView && video.paused && !userPaused && autoplayAllowed) playVideo();
        }
      }, { rootMargin: '-64px 0px 0px 0px', threshold: 0 }).observe(hero);
    }

    // Bloco final + rodapé: esconder a barra
    var finals = doc.querySelectorAll('[data-book-final], .site-footer');
    var finalSeen = new Map();
    var finalIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { finalSeen.set(e.target, e.isIntersecting); });
      state.finalVisible = Array.from(finalSeen.values()).some(Boolean);
      updateBookBar();
    }, { threshold: 0 });
    finals.forEach(function (el) { finalIO.observe(el); });

    // WhatsApp: mensagem menciona a cabana que está no centro da tela
    var wa = doc.querySelector('[data-wa-float]');
    var WA_BASE = 'https://wa.me/5551980649606?text=';
    var MSG = 'Olá! Estou no site da Gariba e gostaria de tirar uma dúvida';
    function setWa(unit) {
      if (!wa) return;
      var text = unit ? MSG + ' sobre a ' + unit + '.' : MSG + '.';
      wa.href = WA_BASE + encodeURIComponent(text);
    }
    var unitSeen = new Map();
    var unitIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { unitSeen.set(e.target, e.isIntersecting); });
      var current = null;
      unitSeen.forEach(function (visible, el) { if (visible) current = el.getAttribute('data-wa-unit'); });
      setWa(current);
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    doc.querySelectorAll('[data-wa-unit]').forEach(function (el) { unitIO.observe(el); });

    // Visualização das cabanas (uma vez por seção)
    var viewIO = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        track('gariba_view', { section: e.target.getAttribute('data-view') });
        obs.unobserve(e.target);
      });
    }, { threshold: 0.35 });
    doc.querySelectorAll('[data-view]').forEach(function (el) { viewIO.observe(el); });

    // Entradas suaves, uma vez por elemento
    if (!mqReduce.matches) {
      var revealIO = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-in');
          obs.unobserve(e.target);
        });
      }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });
      doc.querySelectorAll('.reveal').forEach(function (el) { revealIO.observe(el); });
    } else {
      doc.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-in'); });
    }
  } else {
    doc.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-in'); });
    if (header) header.classList.add('is-solid');
  }
})();
