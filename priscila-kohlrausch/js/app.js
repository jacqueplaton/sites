/* ==========================================================================
   Priscila P. Kohlrausch — comportamento do site
   Rolagem suave (Lenis), coreografia de entrada (GSAP + ScrollTrigger),
   menu, FAQ e troca de mídias.
   Nada aqui depende de internet: as bibliotecas ficam em assets/vendor.
   ========================================================================== */

/* --------------------------------------------------------------------------
   MÍDIAS — o único bloco que precisa ser editado ao receber fotos e vídeos.
   Coloque o arquivo dentro de assets/ e escreva o caminho aqui.
   Deixar em branco ('') mantém a cena desenhada em SVG, que já é elegante.
   -------------------------------------------------------------------------- */
const MIDIA = {
  'hero-video':  '',                                   // ex.: 'assets/video/hero-priscila.mp4'
  'hero-foto':   '',                                   // ex.: 'assets/img/hero-priscila.jpg'
  'sobre-video': 'assets/video/sobre-escritorio.mp4',  // cena provisória de escritório
  'bancario':    '',                                   // ex.: 'assets/img/direito-bancario.jpg'
  'contratos':   '',                                   // ex.: 'assets/img/contratual-consumidor.jpg'
  'familia':     ''                                    // ex.: 'assets/img/familia-sucessoes.jpg'
};

(function () {
  'use strict';

  const doc = document.documentElement;
  const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const temGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const anima = temGSAP && !reduzido;

  if (anima) {
    gsap.registerPlugin(ScrollTrigger);
    doc.classList.add('js-anim');   // só então os elementos partem invisíveis
  }

  /* ── Ano no rodapé ──────────────────────────────────────────────────── */
  const ano = document.getElementById('ano');
  if (ano) ano.textContent = String(new Date().getFullYear());

  /* ── Loader ─────────────────────────────────────────────────────────── */
  const loader = document.getElementById('loader');
  const barra  = document.getElementById('loader-bar');
  const pct    = document.getElementById('loader-pct');
  let progresso = 0;
  let carregado = false;

  const passo = setInterval(function () {
    progresso = Math.min(progresso + Math.random() * 14 + 6, carregado ? 100 : 92);
    if (barra) barra.style.width = progresso + '%';
    if (pct) pct.textContent = Math.round(progresso) + '%';
    if (progresso >= 100) { clearInterval(passo); encerrarLoader(); }
  }, 130);

  function encerrarLoader() {
    if (!loader || loader.classList.contains('is-done')) return;
    loader.classList.add('is-done');
    setTimeout(function () { loader.setAttribute('hidden', ''); }, 900);
    entradaDoHero();
  }

  window.addEventListener('load', function () { carregado = true; });
  // trava de segurança: o site nunca fica preso no loader
  setTimeout(function () { carregado = true; }, 2600);
  setTimeout(function () { clearInterval(passo); encerrarLoader(); }, 5000);

  /* ── Mídias opcionais (fotos e vídeos das cenas) ────────────────────── */
  document.querySelectorAll('[data-media]').forEach(function (el) {
    const caminho = MIDIA[el.dataset.media];
    if (!caminho) { el.remove(); return; }

    if (el.tagName === 'VIDEO') {
      el.src = caminho;
      el.preload = 'metadata';
      el.addEventListener('loadeddata', function () { el.classList.add('is-live'); }, { once: true });
      el.addEventListener('error', function () { el.remove(); }, { once: true });
      // só toca quando estiver à vista, para poupar bateria e dados
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entradas) {
          entradas.forEach(function (e) {
            if (e.isIntersecting) { const p = el.play(); if (p) p.catch(function () {}); }
            else el.pause();
          });
        }, { threshold: 0.2 }).observe(el);
      } else {
        const p = el.play(); if (p) p.catch(function () {});
      }
    } else {
      el.addEventListener('load', function () { el.classList.add('is-live'); }, { once: true });
      el.addEventListener('error', function () { el.remove(); }, { once: true });
      el.src = caminho;
    }
  });

  /* ── Rolagem suave ──────────────────────────────────────────────────── */
  let lenis = null;
  if (!reduzido && typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.9, touchMultiplier: 1.4 });
    if (temGSAP) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  function irPara(alvo) {
    const topo = window.matchMedia('(max-width: 1024px)').matches ? 72 : 84;
    if (lenis) lenis.scrollTo(alvo, { offset: -topo, duration: 1.3 });
    else window.scrollTo({ top: alvo.getBoundingClientRect().top + window.pageYOffset - topo, behavior: reduzido ? 'auto' : 'smooth' });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (ev) {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const alvo = document.querySelector(id);
      if (!alvo) return;
      ev.preventDefault();
      fecharMenu();
      irPara(alvo);
    });
  });

  /* ── Cabeçalho, menu e botão flutuante ──────────────────────────────── */
  const header = document.getElementById('header');
  const burger = document.getElementById('burger');
  const menu   = document.getElementById('menu');
  const flutuante = document.getElementById('wa-float');

  let rodapeAVista = false;
  function estadoDaRolagem() {
    const y = window.pageYOffset;
    if (header) header.classList.toggle('is-solid', y > 40);
    if (flutuante) flutuante.classList.toggle('is-visible', y > window.innerHeight * 0.85 && !rodapeAVista);
  }
  const rodape = document.querySelector('.footer');
  if (rodape && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      rodapeAVista = e[0].isIntersecting;
      estadoDaRolagem();
    }, { threshold: 0.08 }).observe(rodape);
  }
  estadoDaRolagem();
  window.addEventListener('scroll', estadoDaRolagem, { passive: true });

  function abrirMenu() {
    if (!menu || !burger) return;
    menu.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Fechar menu');
    document.body.classList.add('is-locked');
    if (lenis) lenis.stop();
    const primeiro = menu.querySelector('a');
    if (primeiro) primeiro.focus({ preventScroll: true });
  }
  function fecharMenu() {
    if (!menu || !burger || !menu.classList.contains('is-open')) return;
    menu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menu');
    document.body.classList.remove('is-locked');
    if (lenis) lenis.start();
  }
  if (burger) {
    burger.addEventListener('click', function () {
      menu.classList.contains('is-open') ? fecharMenu() : abrirMenu();
    });
  }
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && menu && menu.classList.contains('is-open')) { fecharMenu(); burger.focus(); }
  });

  /* ── Enquadramento das cenas em telas estreitas ─────────────────────── */
  const estreito = window.matchMedia('(max-width: 900px)');
  function enquadrarCenas() {
    document.querySelectorAll('.area').forEach(function (area) {
      const arte = area.querySelector('.area__art');
      if (!arte) return;
      if (estreito.matches) {
        arte.setAttribute('preserveAspectRatio', area.classList.contains('area--right') ? 'xMinYMid slice' : 'xMaxYMid slice');
      } else {
        arte.setAttribute('preserveAspectRatio', 'xMidYMid slice');
      }
    });
  }
  enquadrarCenas();
  if (estreito.addEventListener) estreito.addEventListener('change', enquadrarCenas);

  /* ── Link ativo na navegação ────────────────────────────────────────── */
  const links = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
  if (links.length && 'IntersectionObserver' in window) {
    const alvos = links.map(function (l) { return document.querySelector(l.getAttribute('href')); }).filter(Boolean);
    const obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    alvos.forEach(function (a) { obs.observe(a); });
  }

  /* ── FAQ ────────────────────────────────────────────────────────────── */
  document.querySelectorAll('.faq__q').forEach(function (botao) {
    const painel = document.getElementById(botao.getAttribute('aria-controls'));
    if (!painel) return;
    botao.addEventListener('click', function () {
      const aberto = botao.getAttribute('aria-expanded') === 'true';
      botao.setAttribute('aria-expanded', String(!aberto));
      if (anima) {
        gsap.to(painel, {
          height: aberto ? 0 : 'auto',
          duration: 0.55,
          ease: 'power3.inOut',
          onComplete: function () { ScrollTrigger.refresh(); }
        });
      } else {
        painel.style.height = aberto ? '0px' : 'auto';
      }
    });
  });

  /* ── Coreografia ────────────────────────────────────────────────────── */
  function entradaDoHero() {
    if (!anima) return;
    const alvos = document.querySelectorAll('.hero [data-anim]');
    gsap.to(alvos, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.11 });
    gsap.from(alvos, { y: 44, duration: 1.1, ease: 'power3.out', stagger: 0.11 });
    gsap.from('.hero__art, .hero__photo, .hero__video', { scale: 1.08, duration: 2.2, ease: 'power2.out' });
    gsap.from('.scroll-cue', { opacity: 0, duration: 1, delay: .8 });
  }

  if (anima) {
    // 1. entradas por seção — cada bloco tem um tipo diferente de entrada
    const entradas = {
      up:    { from: { opacity: 0, y: 46 },                    to: { opacity: 1, y: 0 } },
      clip:  { from: { opacity: 0, clipPath: 'inset(0 0 0 100%)' }, to: { opacity: 1, clipPath: 'inset(0 0 0 0%)' } },
      right: { from: { opacity: 0, x: 72 },                    to: { opacity: 1, x: 0 } },
      scale: { from: { opacity: 0, scale: .92, transformOrigin: 'left center' }, to: { opacity: 1, scale: 1 } },
      step:  { from: { opacity: 0, y: 34, filter: 'blur(6px)' }, to: { opacity: 1, y: 0, filter: 'blur(0px)' } },
      fade:  { from: { opacity: 0, y: 22 },                    to: { opacity: 1, y: 0 } },
      line:  { from: { opacity: 0, x: -26 },                   to: { opacity: 1, x: 0 } }
    };

    const grupos = new Map();
    document.querySelectorAll('[data-anim]').forEach(function (el) {
      if (el.closest('.hero')) return;                 // o hero entra no carregamento
      const chave = el.closest('section') || document.body;
      const tipo = el.dataset.anim;
      const id = chave.id + '::' + tipo;
      if (!grupos.has(id)) grupos.set(id, { secao: chave, tipo: tipo, itens: [] });
      grupos.get(id).itens.push(el);
    });

    grupos.forEach(function (g) {
      const receita = entradas[g.tipo] || entradas.up;
      gsap.fromTo(g.itens, receita.from, {
        ...receita.to,
        duration: 1.05,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: g.itens[0], start: 'top 86%', once: true }
      });
    });

    // 2. transição circular do hero para a seção "Sobre"
    gsap.to('#wipe', {
      clipPath: 'circle(155% at 50% 0%)',
      ease: 'none',
      scrollTrigger: { trigger: '#wipe', start: 'top bottom', end: 'top 25%', scrub: 0.6 }
    });

    // 3. parallax do hero
    gsap.to('.hero__stage', {
      yPercent: 14, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    // 4. retrato em vídeo: revelação de baixo para cima
    gsap.to('#portrait', {
      clipPath: 'inset(0 0 0% 0)',
      duration: 1.4,
      ease: 'power3.inOut',
      scrollTrigger: { trigger: '#portrait', start: 'top 82%', once: true }
    });
    gsap.fromTo('.portrait__media',
      { scale: 1.16, yPercent: -3 },
      { scale: 1.02, yPercent: 3, ease: 'none',
        scrollTrigger: { trigger: '#portrait', start: 'top bottom', end: 'bottom top', scrub: true } });

    // 5. marquee horizontal
    gsap.to('#marquee', {
      xPercent: -50, ease: 'none',
      scrollTrigger: { trigger: '.marquee', start: 'top bottom', end: 'bottom top', scrub: 0.5 }
    });

    // 6. cenas das áreas: parallax da arte e dos ícones
    document.querySelectorAll('.area').forEach(function (area) {
      const cena = area.querySelector('.area__scene');
      if (cena) {
        gsap.fromTo(cena.children,
          { scale: 1.12, yPercent: -4 },
          { scale: 1, yPercent: 5, ease: 'none',
            scrollTrigger: { trigger: area, start: 'top bottom', end: 'bottom top', scrub: true } });
      }
      const icones = area.querySelectorAll('[data-icon]');
      icones.forEach(function (ic, i) {
        gsap.fromTo(ic,
          { yPercent: 5 + i * 2.5, opacity: .72 },
          { yPercent: -6 - i * 3, opacity: 1, ease: 'none',
            scrollTrigger: { trigger: area, start: 'top bottom', end: 'bottom top', scrub: 1 + i * .2 } });
        gsap.to(ic, { y: '+=7', duration: 4.5 + i * .8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      });
      const numero = area.querySelector('.area__index');
      if (numero) {
        gsap.fromTo(numero, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: area, start: 'top 60%', once: true }
        });
      }
    });

    // 7. ícones do hero em parallax leve
    document.querySelectorAll('.hero [data-icon]').forEach(function (ic, i) {
      gsap.to(ic, {
        yPercent: -8 - i * 4, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 + i * .3 }
      });
    });

    // 8. contador — apenas o número de áreas de atuação (dado verdadeiro)
    document.querySelectorAll('[data-count]').forEach(function (el) {
      const alvo = parseInt(el.dataset.count, 10) || 0;
      const obj = { v: 0 };
      gsap.to(obj, {
        v: alvo, duration: 1.6, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        onUpdate: function () { el.textContent = String(Math.round(obj.v)).padStart(2, '0'); }
      });
    });

    ScrollTrigger.refresh();
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  } else {
    // Sem GSAP ou com movimento reduzido: tudo visível, contador no valor final
    document.querySelectorAll('[data-count]').forEach(function (el) {
      el.textContent = String(parseInt(el.dataset.count, 10) || 0).padStart(2, '0');
    });
  }
})();
