/* ==========================================================================
   DELÍCIAS BRASIL FLORIDA — comportamento do site
   --------------------------------------------------------------------------
   Depende de: config.js (SITE), i18n.js (I18N), menu.js (MENU)
   Sem bibliotecas externas, sem build.
   ========================================================================== */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ======================================================================
     IDIOMA
     ====================================================================== */
  var LANGS = ['pt', 'en'];
  var lang = detectarIdioma();

  function detectarIdioma() {
    var url = new URLSearchParams(window.location.search).get('lang');
    if (LANGS.indexOf(url) > -1) return url;

    var salvo;
    try { salvo = localStorage.getItem('dbf-lang'); } catch (e) { /* modo privado */ }
    if (LANGS.indexOf(salvo) > -1) return salvo;

    var nav = (navigator.language || 'pt').toLowerCase();
    return nav.indexOf('pt') === 0 ? 'pt' : 'en';
  }

  function t(chave) {
    var dic = I18N[lang] || I18N.pt;
    return dic[chave] !== undefined ? dic[chave] : (I18N.pt[chave] || '');
  }

  function aplicarIdioma() {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en-US';

    // Textos
    $$('[data-i18n]').forEach(function (el) {
      var valor = t(el.getAttribute('data-i18n'));
      if (valor) el.textContent = valor;
    });

    // Atributos: data-i18n-attr="alt:chave" ou "aria-label:chave,title:outra"
    $$('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(',').forEach(function (par) {
        var p = par.split(':');
        if (p.length !== 2) return;
        var valor = t(p[1].trim());
        if (valor) el.setAttribute(p[0].trim(), valor);
      });
    });

    // <title> e meta description
    document.title = t('meta.title');
    var desc = $('meta[name="description"]');
    if (desc) desc.setAttribute('content', t('meta.desc'));

    // Estado visual do seletor
    $$('[data-lang-opt]').forEach(function (el) {
      el.classList.toggle('is-on', el.getAttribute('data-lang-opt') === lang);
    });
    var sw = $('#lang-switch');
    if (sw) sw.setAttribute('aria-label', t('nav.langSwitch'));

    // Blocos gerados por JS precisam ser redesenhados
    renderMenu();
    renderGaleria();
    renderHorario();
    renderAvaliacao();

    try { localStorage.setItem('dbf-lang', lang); } catch (e) { /* ignora */ }
  }

  function trocarIdioma() {
    lang = lang === 'pt' ? 'en' : 'pt';
    aplicarIdioma();

    var url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    history.replaceState(null, '', url);
  }

  /* ======================================================================
     LINKS DO NEGÓCIO
     ====================================================================== */
  function ligarLinks() {
    var mapa = {
      '#hero-directions': SITE.mapsDirections,
      '#btn-maps':        SITE.mapsDirections,
      '#cta-maps':        SITE.mapsDirections,
      '#f-maps':          SITE.mapsDirections,
      '#btn-call':        SITE.phoneHref,
      '#phone-link':      SITE.phoneHref,
      '#f-phone':         SITE.phoneHref,
      '#btn-whats':       SITE.whatsapp,
      '#cta-whats':       SITE.whatsapp,
      '#f-whats':         SITE.whatsapp,
      '#header-order':    SITE.whatsapp,
      '#btn-insta':       SITE.instagram,
      '#f-insta':         SITE.instagram,
      '#gallery-instagram': SITE.instagram,
      '#review-link':     SITE.googleSearch
    };
    Object.keys(mapa).forEach(function (sel) {
      var el = $(sel);
      if (el) el.href = mapa[sel];
    });

    var tel = $('#phone-link'); if (tel) tel.textContent = SITE.phone;
    var telF = $('#f-phone');   if (telF) telF.textContent = SITE.phone;
    var end = $('#address-text'); if (end) end.textContent = SITE.addressFull;
    var endF = $('#f-maps');      if (endF) endF.textContent = SITE.addressFull;
    var faixa = $('#menu-price-range'); if (faixa) faixa.textContent = SITE.priceRange;

    var mapaFrame = $('#map-frame');
    if (mapaFrame) mapaFrame.src = SITE.mapsEmbed;

    var ano = $('#year');
    if (ano) ano.textContent = new Date().getFullYear();
  }

  /* ======================================================================
     CARDÁPIO
     ====================================================================== */
  function renderMenu() {
    var board = $('#menu-board');
    if (!board || typeof MENU === 'undefined') return;

    // Aviso de cardápio ilustrativo
    var aviso = $('#menu-notice');
    if (aviso) aviso.hidden = MENU.status !== 'placeholder';

    // Data de atualização, no formato do idioma
    var time = $('#menu-updated');
    if (time && MENU.updated) {
      var partes = MENU.updated.split('-');
      var d = new Date(Date.UTC(+partes[0], +partes[1] - 1, +partes[2]));
      time.dateTime = MENU.updated;
      time.textContent = d.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US',
        { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' });
    }

    board.innerHTML = '';

    MENU.items.forEach(function (item) {
      var texto = item[lang] || item.pt;
      var li = document.createElement('li');
      li.className = 'menu-item' + (item.available === false ? ' is-out' : '');

      if (item.image) {
        var img = document.createElement('img');
        img.className = 'menu-item-img';
        img.src = item.image;
        img.alt = '';
        img.width = 78; img.height = 78;
        img.loading = 'lazy';
        img.decoding = 'async';
        li.appendChild(img);
      }

      var body = document.createElement('div');
      body.className = 'menu-item-body';

      var topo = document.createElement('div');
      topo.className = 'menu-item-top';

      var nome = document.createElement('h3');
      nome.className = 'menu-item-name';
      nome.textContent = texto.name;
      topo.appendChild(nome);

      // Preço só aparece quando existe de verdade
      if (typeof item.price === 'number') {
        var pontos = document.createElement('span');
        pontos.className = 'menu-item-dots';
        pontos.setAttribute('aria-hidden', 'true');
        topo.appendChild(pontos);

        var preco = document.createElement('span');
        preco.className = 'menu-item-price';
        preco.textContent = item.price.toLocaleString(
          lang === 'pt' ? 'pt-BR' : 'en-US',
          { style: 'currency', currency: 'USD' }
        );
        topo.appendChild(preco);
      }
      body.appendChild(topo);

      if (texto.desc) {
        var desc = document.createElement('p');
        desc.className = 'menu-item-desc';
        desc.textContent = texto.desc;
        body.appendChild(desc);
      }

      var tags = document.createElement('div');
      tags.className = 'menu-item-tags';

      if (item.available === false) {
        var esgotou = document.createElement('span');
        esgotou.className = 'tag-soldout';
        esgotou.textContent = t('menu.soldout');
        tags.appendChild(esgotou);
      } else {
        var ask = document.createElement('a');
        ask.className = 'menu-ask';
        ask.href = linkWhatsApp(
          lang === 'pt'
            ? 'Olá! Vi o site e queria saber sobre: ' + texto.name
            : 'Hi! I saw the website and I would like to know about: ' + texto.name
        );
        ask.target = '_blank';
        ask.rel = 'noopener noreferrer';
        ask.textContent = t('menu.ask');
        ask.setAttribute('aria-label', t('menu.askAria').replace('{dish}', texto.name));
        tags.appendChild(ask);
      }
      body.appendChild(tags);

      li.appendChild(body);
      board.appendChild(li);
    });
  }

  function linkWhatsApp(texto) {
    // wa.me/message/<código> não aceita ?text=. Usamos o número direto para
    // mensagens pré-preenchidas e mantemos o link curto como reserva.
    var numero = SITE.phoneHref.replace(/[^0-9]/g, '');
    return 'https://wa.me/' + numero + '?text=' + encodeURIComponent(texto);
  }

  /* ======================================================================
     GALERIA
     ====================================================================== */
  var GALERIA = [
    { src: 'media/gallery/g1-feijoada-servida.jpg', key: 'gallery.g1' },
    { src: 'media/gallery/g3-marmita-prato.jpg',    key: 'gallery.g3' },
    { src: 'media/gallery/g5-pudim.jpg',            key: 'gallery.g5' },
    { src: 'media/gallery/g7-entrega-sorriso.jpg',  key: 'gallery.g7' },
    { src: 'media/gallery/g4-peixe-salada.jpg',     key: 'gallery.g4' },
    { src: 'media/gallery/g2-mesa-completa.jpg',    key: 'gallery.g2' },
    { src: 'media/gallery/g6-cafe-salgados.jpg',    key: 'gallery.g6' },
    { src: 'media/gallery/g8-balcao.jpg',           key: 'gallery.g8' }
  ];

  function renderGaleria() {
    var grid = $('#gallery-grid');
    if (!grid) return;

    grid.innerHTML = '';

    GALERIA.forEach(function (foto, i) {
      var legenda = t(foto.key);

      var li = document.createElement('li');
      li.className = 'gallery-item';
      li.style.setProperty('--i', i);

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gallery-btn';
      btn.setAttribute('aria-label', t('gallery.open') + ': ' + legenda);
      btn.addEventListener('click', function () { abrirLightbox(i); });

      var img = document.createElement('img');
      img.src = foto.src;
      img.alt = legenda;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.width = 1100; img.height = 619;

      btn.appendChild(img);
      li.appendChild(btn);
      grid.appendChild(li);

      observarEntrada(li);
    });
  }

  /* ======================================================================
     LIGHTBOX
     ====================================================================== */
  var lb = { el: null, img: null, cap: null, idx: 0, anterior: null };

  function abrirLightbox(i) {
    lb.el  = lb.el  || $('#lightbox');
    lb.img = lb.img || $('#lb-image');
    lb.cap = lb.cap || $('#lb-caption');
    if (!lb.el) return;

    lb.anterior = document.activeElement;
    lb.idx = i;
    mostrarFoto();

    lb.el.hidden = false;
    document.body.classList.add('is-locked');
    $('#lb-close').focus();
  }

  function mostrarFoto() {
    var foto = GALERIA[lb.idx];
    lb.img.src = foto.src;
    lb.img.alt = t(foto.key);
    lb.cap.textContent = t(foto.key);
  }

  function fecharLightbox() {
    if (!lb.el || lb.el.hidden) return;
    lb.el.hidden = true;
    document.body.classList.remove('is-locked');
    if (lb.anterior && lb.anterior.focus) lb.anterior.focus();
  }

  function navegarLightbox(passo) {
    lb.idx = (lb.idx + passo + GALERIA.length) % GALERIA.length;
    mostrarFoto();
  }

  function ligarLightbox() {
    var el = $('#lightbox');
    if (!el) return;

    $('#lb-close').addEventListener('click', fecharLightbox);
    $('#lb-prev').addEventListener('click', function () { navegarLightbox(-1); });
    $('#lb-next').addEventListener('click', function () { navegarLightbox(1); });

    el.addEventListener('click', function (e) {
      if (e.target === el) fecharLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (el.hidden) return;
      if (e.key === 'Escape')     { fecharLightbox(); }
      if (e.key === 'ArrowLeft')  { navegarLightbox(-1); }
      if (e.key === 'ArrowRight') { navegarLightbox(1); }
      if (e.key === 'Tab') {         // mantém o foco dentro do diálogo
        var focaveis = $$('button', el);
        var primeiro = focaveis[0];
        var ultimo = focaveis[focaveis.length - 1];
        if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
        else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
      }
    });
  }

  /* ======================================================================
     AVALIAÇÃO E HORÁRIO (só aparecem se estiverem preenchidos)
     ====================================================================== */
  function renderAvaliacao() {
    if (typeof SITE.rating !== 'number') return;   // sem nota confirmada: nada aparece

    var nota = SITE.rating.toLocaleString(lang === 'pt' ? 'pt-BR' : 'en-US',
      { minimumFractionDigits: 1, maximumFractionDigits: 1 });

    var selo = $('#rating-stamp');
    if (selo) { selo.hidden = false; $('#stamp-value').textContent = nota; }

    var card = $('#review-card');
    if (card) {
      card.hidden = false;
      $('#review-value').textContent = nota;
      var estrelas = $('#review-stars');
      if (estrelas) {
        var cheias = Math.round(SITE.rating);
        estrelas.textContent = '★★★★★'.slice(0, cheias) + '☆☆☆☆☆'.slice(0, 5 - cheias);
      }
      var qtd = $('#review-count-num');
      if (qtd) {
        if (typeof SITE.ratingCount === 'number') {
          qtd.textContent = SITE.ratingCount;
          qtd.parentElement.hidden = false;
        } else {
          qtd.parentElement.hidden = true;
        }
      }
    }
  }

  function renderHorario() {
    var blocos = [$('#hours-block'), $('#footer-hours')];

    if (!Array.isArray(SITE.hours) || !SITE.hours.length) return; // não confirmado

    var dias = {
      pt: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
      en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    };
    var hoje = new Date().getDay();

    blocos.forEach(function (bloco) {
      if (!bloco) return;
      bloco.innerHTML = '';

      var tabela = document.createElement('div');
      tabela.className = 'hours-table';

      SITE.hours.forEach(function (faixa) {
        var nomes = faixa.days.map(function (d) { return dias[lang][d]; }).join(', ');
        var linha = document.createElement('div');
        linha.className = 'hours-row' + (faixa.days.indexOf(hoje) > -1 ? ' is-today' : '');

        var dia = document.createElement('span');
        dia.className = 'hours-day';
        dia.textContent = nomes;

        var horas = document.createElement('span');
        horas.textContent = faixa.open && faixa.close
          ? faixa.open + ' – ' + faixa.close
          : t('location.closed');

        linha.appendChild(dia);
        linha.appendChild(horas);
        tabela.appendChild(linha);
      });

      bloco.appendChild(tabela);
    });
  }

  /* ======================================================================
     NAVEGAÇÃO
     ====================================================================== */
  function ligarNavegacao() {
    var header = $('.site-header');
    var toggle = $('#nav-toggle');
    var nav = $('#nav-principal');
    var backdrop = null;

    // fundo do cabeçalho ao rolar
    var ultimo = false;
    function aoRolar() {
      var passou = window.scrollY > 40;
      if (passou !== ultimo) {
        ultimo = passou;
        header.classList.toggle('is-scrolled', passou);
      }
    }
    window.addEventListener('scroll', aoRolar, { passive: true });
    aoRolar();

    // menu móvel
    function fecharMenu() {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', t('nav.openMenu'));
      document.body.classList.remove('is-locked');
      if (backdrop) { backdrop.remove(); backdrop = null; }
    }

    function abrirMenu() {
      nav.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', t('nav.closeMenu'));
      document.body.classList.add('is-locked');
      backdrop = document.createElement('div');
      backdrop.className = 'nav-backdrop';
      backdrop.addEventListener('click', fecharMenu);
      document.body.appendChild(backdrop);
    }

    if (toggle) {
      toggle.addEventListener('click', function () {
        nav.classList.contains('is-open') ? fecharMenu() : abrirMenu();
      });
    }

    $$('.nav-list a').forEach(function (a) {
      a.addEventListener('click', fecharMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        fecharMenu();
        toggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 960 && nav.classList.contains('is-open')) fecharMenu();
    });

    // seção ativa
    var secoes = $$('main section[id]');
    if ('IntersectionObserver' in window && secoes.length) {
      var obs = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (en) {
          if (!en.isIntersecting) return;
          marcarAtivo('#' + en.target.id);
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      secoes.forEach(function (s) { obs.observe(s); });

      // No topo (ainda no hero) nenhum item do menu fica marcado
      window.addEventListener('scroll', function () {
        if (window.scrollY < window.innerHeight * 0.5) marcarAtivo(null);
      }, { passive: true });
    }

    function marcarAtivo(href) {
      $$('.nav-list a').forEach(function (a) {
        a.classList.toggle('is-active', href !== null && a.getAttribute('href') === href);
      });
    }
  }

  /* ======================================================================
     ANIMAÇÕES DE ENTRADA
     ====================================================================== */
  var obsReveal = null;

  function iniciarReveal() {
    if (semMovimento.matches || !('IntersectionObserver' in window)) {
      $$('.reveal, .gallery-item').forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    obsReveal = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        obsReveal.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    $$('.reveal').forEach(function (el) { obsReveal.observe(el); });
    $$('.flavors-grid .flavor').forEach(function (el, i) { el.style.setProperty('--i', i); });
  }

  function observarEntrada(el) {
    if (!obsReveal) { el.classList.add('is-in'); return; }
    obsReveal.observe(el);
  }

  /* ======================================================================
     VÍDEOS — só carregam quando entram na tela
     ====================================================================== */
  function ligarVideos() {
    var hero = $('#hero-video');

    if (semMovimento.matches) {
      // Movimento reduzido: nenhum vídeo toca, fica o poster.
      if (hero) { hero.pause(); hero.removeAttribute('autoplay'); }
      $$('.lazy-video').forEach(function (v) { v.removeAttribute('data-src'); });
      return;
    }

    if (hero && hero.paused) {
      var p = hero.play();
      if (p && p.catch) p.catch(function () { /* autoplay bloqueado: fica o poster */ });
    }

    var lazies = $$('.lazy-video');
    if (!lazies.length) return;

    if (!('IntersectionObserver' in window)) {
      lazies.forEach(carregarVideo);
      return;
    }

    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) {
          carregarVideo(v);
          var p = v.play();
          if (p && p.catch) p.catch(function () {});
        } else if (!v.paused) {
          v.pause();
        }
      });
    }, { rootMargin: '200px 0px' });

    lazies.forEach(function (v) { obs.observe(v); });
  }

  function carregarVideo(v) {
    if (v.dataset.src && !v.querySelector('source')) {
      var s = document.createElement('source');
      s.src = v.dataset.src;
      s.type = 'video/mp4';
      v.appendChild(s);
      v.load();
    }
  }

  /* ======================================================================
     FORMULÁRIO → WHATSAPP
     ====================================================================== */
  function ligarFormulario() {
    var form = $('#contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nome = $('#cf-name').value.trim();
      var msg  = $('#cf-message').value.trim();
      var erro = $('#form-error');

      if (!nome || !msg) {
        erro.hidden = false;
        (!nome ? $('#cf-name') : $('#cf-message')).focus();
        return;
      }
      erro.hidden = true;

      var sel = $('#cf-subject');
      var assunto = sel.options[sel.selectedIndex].textContent;

      var texto = lang === 'pt'
        ? 'Olá! Meu nome é ' + nome + '.\nAssunto: ' + assunto + '\n\n' + msg
        : 'Hello! My name is ' + nome + '.\nSubject: ' + assunto + '\n\n' + msg;

      window.open(linkWhatsApp(texto), '_blank', 'noopener');
    });
  }

  /* ======================================================================
     INÍCIO
     ====================================================================== */
  function iniciar() {
    ligarLinks();
    aplicarIdioma();
    ligarNavegacao();
    ligarLightbox();
    ligarFormulario();
    iniciarReveal();
    ligarVideos();

    var sw = $('#lang-switch');
    if (sw) sw.addEventListener('click', trocarIdioma);

    // Se a pessoa mudar a preferência de movimento com o site aberto
    if (semMovimento.addEventListener) {
      semMovimento.addEventListener('change', ligarVideos);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
