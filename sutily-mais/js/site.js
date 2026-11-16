/* ==========================================================================
   SUTILY MAIS — comportamento do site (sem bibliotecas externas)
   1. movimento   2. topo e menu   3. filme e mapa   4. consentimento e medição
   Tudo aqui é aprimoramento progressivo: sem JavaScript o site continua
   legível e os botões de agendamento continuam funcionando.
   ========================================================================== */
(function () {
  'use strict';
  var d = document, w = window, raiz = d.documentElement, corpo = d.body;
  var cfg = w.SUTILY || { r: {} };
  w.SUTILY_OK = true;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var poucoMov = w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ponteiroFino = w.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var conexao = navigator.connection || {};
  var redeLenta = !!conexao.saveData || /(^|-)2g$/.test(conexao.effectiveType || '');

  /* ------------------------------------------------------------ 1. MOVIMENTO */
  // revelações ao entrar na tela
  var alvos = $$('[data-rev],[data-pal],[data-mask]');
  if ('IntersectionObserver' in w && !poucoMov) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -9% 0px', threshold: 0.08 });
    alvos.forEach(function (el) { io.observe(el); });
  } else {
    alvos.forEach(function (el) { el.classList.add('in'); });
  }

  // um único laço de rolagem para: zonas de cor, parallax, faixa, linha de progresso, topo
  var zonas = $$('main > [data-zona]');
  var pars = poucoMov ? [] : $$('[data-par]');
  var faixa = poucoMov ? null : $('[data-faixa]');
  var progresso = $('[data-progresso]');
  var topo = $('[data-topo]');
  var barra = $('[data-barra]');
  var hero = $('main > section');
  var final = $('.final');
  var previa = $('[data-indice-previa]');
  var pranchasIndice = previa ? $$('.prancha', previa) : [];
  var linhasIndice = previa ? $$('[data-indice]') : [];
  var mouseNoIndice = false;
  function ativarPrancha(n) { pranchasIndice.forEach(function (p, i) { p.classList.toggle('ativa', i === n); }); }
  var ultimoY = w.scrollY, agendado = false;

  if (!poucoMov && w.CSS && CSS.registerProperty !== undefined) raiz.classList.add('zonas');
  if (faixa) raiz.classList.add('mov');

  function quadro() {
    agendado = false;
    var y = w.scrollY, vh = w.innerHeight, meio = vh * 0.55, i, r;

    // zona de cor: a seção que cruza a linha a 55% da tela define o fundo
    for (i = 0; i < zonas.length; i++) {
      r = zonas[i].getBoundingClientRect();
      if (r.top <= meio && r.bottom > meio) {
        if (corpo.dataset.zona !== zonas[i].dataset.zona) corpo.dataset.zona = zonas[i].dataset.zona;
        break;
      }
    }
    // passou da última seção (rodapé na tela): mantém a cor dela, mesmo após um salto de rolagem
    if (i === zonas.length && zonas.length && zonas[i - 1].getBoundingClientRect().bottom <= meio) corpo.dataset.zona = zonas[i - 1].dataset.zona;
    // parallax discreto nas fotografias
    for (i = 0; i < pars.length; i++) {
      r = pars[i].parentNode.getBoundingClientRect();
      if (r.bottom < -80 || r.top > vh + 80) continue;
      var desloc = ((r.top + r.height / 2) - vh / 2) * -parseFloat(pars[i].dataset.par);
      pars[i].style.transform = 'translate3d(0,' + desloc.toFixed(1) + 'px,0) scale(1.08)';
    }
    if (faixa) {
      r = faixa.parentNode.getBoundingClientRect();
      if (r.bottom > 0 && r.top < vh) faixa.style.transform = 'translate3d(' + (-(y * 0.22) % (faixa.scrollWidth / 2)).toFixed(1) + 'px,0,0)';
    }
    if (progresso) {
      r = progresso.parentNode.getBoundingClientRect();
      var p = Math.max(0, Math.min(1, (vh * 0.85 - r.top) / (vh * 0.6)));
      progresso.style.setProperty('--p', p.toFixed(3));
    }
    // topo: fundo sólido depois do início; some ao descer, volta ao subir
    if (topo) {
      topo.classList.toggle('rolou', y > 40);
      if (!corpo.classList.contains('menu-aberto')) topo.classList.toggle('some', y > ultimoY && y > 420);
    }
    // barra de agendamento (celular): aparece depois do início e sai quando a chamada final entra na tela
    if (barra && hero) barra.classList.toggle('visivel', y > hero.offsetHeight * 0.6 && (!final || final.getBoundingClientRect().top > vh * 0.75));
    // índice: sem mouse, a prancha acompanha a linha mais próxima do centro da tela
    if (linhasIndice.length && !mouseNoIndice) {
      var melhor = 0, dist = 1e9;
      for (i = 0; i < linhasIndice.length; i++) {
        r = linhasIndice[i].getBoundingClientRect();
        var dd = Math.abs(r.top + r.height / 2 - vh * 0.45);
        if (dd < dist) { dist = dd; melhor = i; }
      }
      ativarPrancha(melhor);
    }
    ultimoY = y;
  }
  function pedir() { if (!agendado) { agendado = true; requestAnimationFrame(quadro); } }
  w.addEventListener('scroll', pedir, { passive: true });
  w.addEventListener('resize', pedir, { passive: true });
  quadro();

  // botões magnéticos e cursor "Ver" — só com mouse
  if (ponteiroFino && !poucoMov) {
    $$('[data-magnetico]').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height / 2) * 0.28).toFixed(1) + 'px)';
      });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });

    var cursor = $('[data-cursor]');
    if (cursor) {
      d.addEventListener('pointermove', function (e) {
        cursor.style.setProperty('--x', e.clientX + 'px');
        cursor.style.setProperty('--y', e.clientY + 'px');
        var alvo = e.target.closest && e.target.closest('[data-cursor-alvo]');
        cursor.classList.toggle('ativo', !!alvo);
      }, { passive: true });
      d.addEventListener('pointerleave', function () { cursor.classList.remove('ativo'); });
    }

    // profundidade nos cartões: o desenho acompanha o mouse por poucos pixels
    $$('.tcard a').forEach(function (a) {
      var fig = $('.prancha-svg, .prancha > img', a);
      if (!fig) return;
      a.addEventListener('pointermove', function (e) {
        var r = a.getBoundingClientRect();
        var dx = (e.clientX - r.left) / r.width - 0.5, dy = (e.clientY - r.top) / r.height - 0.5;
        fig.style.transform = 'scale(1.045) translate(' + (dx * -10).toFixed(1) + 'px,' + (dy * -10).toFixed(1) + 'px)';
      });
      a.addEventListener('pointerleave', function () { fig.style.transform = ''; });
    });
  }

  // índice de tratamentos: com mouse ou teclado, a prancha acompanha o item em foco
  linhasIndice.forEach(function (a, n) {
    a.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { mouseNoIndice = true; ativarPrancha(n); } });
    a.addEventListener('focus', function () { ativarPrancha(n); });
  });
  if (previa) $('.indice-lista').addEventListener('pointerleave', function () { mouseNoIndice = false; });

  /* ------------------------------------------------------------ 2. MENU */
  var menu = $('[data-menu]'), btnMenu = $('[data-menu-btn]');
  function fecharMenu(devolverFoco) {
    if (!menu || menu.hidden) return;
    menu.classList.remove('aberto');
    corpo.classList.remove('menu-aberto');
    btnMenu.setAttribute('aria-expanded', 'false');
    $('.menu-btn-tx', btnMenu).textContent = 'Menu';
    setTimeout(function () { menu.hidden = true; }, poucoMov ? 0 : 800);
    if (devolverFoco) btnMenu.focus();
  }
  if (menu && btnMenu) {
    btnMenu.addEventListener('click', function () {
      if (btnMenu.getAttribute('aria-expanded') === 'true') return fecharMenu(true);
      menu.hidden = false;
      void menu.offsetWidth; // força o navegador a aplicar o estado inicial antes de animar
      menu.classList.add('aberto');
      corpo.classList.add('menu-aberto');
      btnMenu.setAttribute('aria-expanded', 'true');
      $('.menu-btn-tx', btnMenu).textContent = 'Fechar';
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) fecharMenu(false); });
    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') return fecharMenu(true);
      if (e.key !== 'Tab' || menu.hidden) return;
      // mantém o foco dentro do menu aberto
      var foco = [btnMenu].concat($$('a,button', menu));
      var prim = foco[0], ult = foco[foco.length - 1];
      if (e.shiftKey && d.activeElement === prim) { e.preventDefault(); ult.focus(); }
      else if (!e.shiftKey && d.activeElement === ult) { e.preventDefault(); prim.focus(); }
    });
    w.matchMedia('(min-width: 1101px)').addEventListener('change', function (m) { if (m.matches) fecharMenu(false); });
  }

  /* ------------------------------------------------------------ 3. FILME E MAPA */
  var palco = $('[data-filme]');
  if (palco) {
    var video = $('video', palco), btnFilme = $('[data-filme-btn]', palco);
    var vertical = w.matchMedia('(max-width: 759px) and (orientation: portrait)').matches;
    var carregado = false, pausadoPelaPessoa = false;
    if (vertical) {
      palco.classList.add('vertical');
      video.width = 720; video.height = 1280;
    }
    // a imagem de capa só é baixada quando o filme se aproxima da tela
    var capa = function () { if (!video.poster) video.poster = vertical ? video.dataset.posterV : video.dataset.posterH; };
    if ('IntersectionObserver' in w) {
      var ioCapa = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { capa(); ioCapa.disconnect(); } }, { rootMargin: '900px 0px' });
      ioCapa.observe(palco);
    } else capa();
    var carregar = function () {
      if (carregado) return;
      carregado = true;
      capa();
      video.src = vertical ? video.dataset.v : video.dataset.h;
    };
    var tocar = function () {
      carregar();
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
    };
    video.addEventListener('play', function () { palco.classList.add('tocando'); btnFilme.setAttribute('aria-label', 'Pausar o filme'); });
    video.addEventListener('pause', function () { palco.classList.remove('tocando'); btnFilme.setAttribute('aria-label', 'Reproduzir o filme'); });
    btnFilme.addEventListener('click', function () {
      if (video.paused) { pausadoPelaPessoa = false; tocar(); evento('filme_play', {}); }
      else { pausadoPelaPessoa = true; video.pause(); }
    });
    // toca sozinho só quando visível, com rede boa e sem preferência por menos movimento
    if ('IntersectionObserver' in w && !poucoMov && !redeLenta) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting && e.intersectionRatio > 0.45) { if (!pausadoPelaPessoa) tocar(); }
          else if (!video.paused) video.pause();
        });
      }, { threshold: [0, 0.45, 0.8] }).observe(palco);
    }
  }

  var mapa = $('[data-mapa]');
  if (mapa) {
    $('[data-mapa-btn]', mapa).addEventListener('click', function () {
      var f = d.createElement('iframe');
      f.src = mapa.dataset.mapa;
      f.title = 'Mapa: localização da Sutily Mais';
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      mapa.innerHTML = '';
      mapa.appendChild(f);
      evento('mapa_carregado', {});
    });
  }

  $$('[data-ano]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ------------------------------------------------------------ 4. CONSENTIMENTO E MEDIÇÃO
     Regras:
     • nada de terceiros é carregado antes do "Aceitar";
     • nenhum dado de saúde vai para pixels ou eventos — os eventos levam só
       o tipo de página e a posição do botão, nunca a especialidade consultada
       nem o texto da mensagem do WhatsApp. */
  var R = cfg.r || {};
  var temRastreio = !!(R.gtm || R.ga4 || R.googleAds || R.metaPixel);
  var CHAVE = 'sutily-cookies';
  var guarda = {
    ler: function (k, s) { try { return (s || localStorage).getItem(k); } catch (e) { return null; } },
    gravar: function (k, v, s) { try { (s || localStorage).setItem(k, v); } catch (e) {} },
  };

  w.dataLayer = w.dataLayer || [];
  function gtag() { w.dataLayer.push(arguments); }
  gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied', wait_for_update: 500 });

  // UTMs: guardadas só durante a visita, para atribuir o clique no WhatsApp à campanha
  var utm = {};
  try {
    var qs = new URLSearchParams(w.location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (k) {
      var v = qs.get(k);
      if (v) utm[k] = v.slice(0, 100);
    });
    if (Object.keys(utm).length) guarda.gravar('sutily-utm', JSON.stringify(utm), sessionStorage);
    else utm = JSON.parse(guarda.ler('sutily-utm', sessionStorage) || '{}');
  } catch (e) { utm = {}; }

  function script(src) { var s = d.createElement('script'); s.async = true; s.src = src; d.head.appendChild(s); }
  var ligado = false;
  function ligarRastreio() {
    if (ligado || !temRastreio) return;
    ligado = true;
    gtag('consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted' });
    if (R.gtm) {
      w.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
      script('https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(R.gtm));
    } else if (R.ga4 || R.googleAds) {
      script('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(R.ga4 || R.googleAds));
      gtag('js', new Date());
      if (R.ga4) gtag('config', R.ga4);
      if (R.googleAds) gtag('config', R.googleAds);
    }
    if (R.metaPixel && !R.gtm) {
      /* Meta Pixel — carregador padrão */
      (function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = true; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = true; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); })(w, d, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      w.fbq('init', R.metaPixel);
      w.fbq('track', 'PageView');
    }
  }

  function evento(nome, dados) {
    var p = { tipo_pagina: cfg.tipo || 'geral' };
    var k;
    for (k in dados) p[k] = dados[k];
    for (k in utm) p[k] = utm[k];
    var dl = { event: nome };
    for (k in p) dl[k] = p[k];
    w.dataLayer.push(dl);                       // para o GTM
    if (!ligado || R.gtm) return;                // com GTM, as tags são disparadas lá
    gtag('event', nome, p);
    if (nome === 'whatsapp_click') {
      if (R.googleAds && R.googleAdsRotuloWhatsapp) gtag('event', 'conversion', { send_to: R.googleAds + '/' + R.googleAdsRotuloWhatsapp });
      if (w.fbq) w.fbq('track', 'Contact');
    }
  }
  d.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-wa],[data-evento]');
    if (!a) return;
    if (a.dataset.wa) evento('whatsapp_click', { posicao: a.dataset.wa });
    else evento(a.dataset.evento + '_click', {});
  });

  // aviso de cookies: só aparece se houver alguma ferramenta de medição configurada
  var aviso = $('[data-cookies]');
  var escolha = guarda.ler(CHAVE);
  if (escolha === 'sim') ligarRastreio();
  if (aviso) {
    var fecharAviso = function (v) { guarda.gravar(CHAVE, v); aviso.hidden = true; if (v === 'sim') ligarRastreio(); };
    $('[data-cookies-sim]', aviso).addEventListener('click', function () { fecharAviso('sim'); });
    $('[data-cookies-nao]', aviso).addEventListener('click', function () {
      var estavaLigado = ligado;
      fecharAviso('nao');
      if (estavaLigado) w.location.reload(); // recarrega sem as ferramentas de medição
    });
    $$('[data-cookies-abrir]').forEach(function (b) { b.addEventListener('click', function () { aviso.hidden = false; $('[data-cookies-sim]', aviso).focus(); }); });
    if (temRastreio && !escolha) setTimeout(function () { aviso.hidden = false; }, 1800);
  }
})();
