/* ==========================================================================
   LUIZ MENDES | CIRURGIÃO-DENTISTA
   --------------------------------------------------------------------------
   Sem dependências. Tudo aqui degrada com elegância: se o JavaScript não
   carregar, a página inteira continua legível — as classes de revelação
   só escondem conteúdo depois que este arquivo confirma que pode animar.

   Blocos:
     1. Preparação (detecção de movimento reduzido)
     2. Cabeçalho compacto + menu móvel
     3. Revelações por scroll (IntersectionObserver)
     4. A linha contínua (progresso de leitura)
     5. Vídeos: carregar só quando visíveis, pausar fora da tela
     6. Seção sticky do tratamento (foco por etapa)
     7. Mapa: iframe injetado só quando a seção aparece
     8. Botão flutuante de WhatsApp
   ========================================================================== */
(function () {
  'use strict';

  var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');
  var suportaObserver = 'IntersectionObserver' in window;

  /* ------------------------------------------------------------------------
     1. Se não dá para animar com segurança, mostra tudo de uma vez.
        As classes .reveal/.linha-conteudo escondem conteúdo via CSS; sem
        observer (ou com movimento reduzido) elas precisam cair na hora.
     ------------------------------------------------------------------------ */
  function mostrarTudo() {
    document.querySelectorAll('.reveal, .linha-conteudo').forEach(function (el) {
      el.classList.add('visivel');
    });
    document.querySelectorAll('.hero, .empatia-grade, section').forEach(function (el) {
      el.classList.add('em-vista');
    });
  }

  /* ------------------------------------------------------------------------
     2. Cabeçalho compacto + menu móvel
     ------------------------------------------------------------------------ */
  var cabecalho = document.getElementById('cabecalho');
  var aoRolarCabecalho = function () {
    cabecalho.classList.toggle('compacto', window.scrollY > 40);
  };
  window.addEventListener('scroll', aoRolarCabecalho, { passive: true });
  aoRolarCabecalho();

  var menuBotao = document.getElementById('menu-botao');
  menuBotao.addEventListener('click', function () {
    var aberto = document.body.classList.toggle('menu-aberto');
    menuBotao.setAttribute('aria-expanded', String(aberto));
    menuBotao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  });
  // fechar o menu ao escolher um destino
  document.querySelectorAll('.nav-lista a').forEach(function (a) {
    a.addEventListener('click', function () {
      document.body.classList.remove('menu-aberto');
      menuBotao.setAttribute('aria-expanded', 'false');
    });
  });
  // Esc fecha o menu
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.body.classList.contains('menu-aberto')) {
      document.body.classList.remove('menu-aberto');
      menuBotao.setAttribute('aria-expanded', 'false');
      menuBotao.focus();
    }
  });

  /* ------------------------------------------------------------------------
     3. Revelações por scroll
     ------------------------------------------------------------------------ */
  if (semMovimento.matches || !suportaObserver) {
    mostrarTudo();
  } else {
    var obsReveal = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('visivel');
        // seções e grades ganham .em-vista para disparar máscaras e zoom
        var pai = entrada.target.closest('section, .hero');
        if (pai) pai.classList.add('em-vista');
        obsReveal.unobserve(entrada.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });

    document.querySelectorAll('.reveal, .linha-mascara').forEach(function (el) {
      obsReveal.observe(el);
    });
    // as máscaras de figura observadas diretamente
    var obsFigura = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        var pai = entrada.target.closest('section, .hero');
        if (pai) pai.classList.add('em-vista');
        obsFigura.unobserve(entrada.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.mascara').forEach(function (el) { obsFigura.observe(el); });
  }

  /* ------------------------------------------------------------------------
     4. A linha contínua — tinta avança com o progresso de leitura
     ------------------------------------------------------------------------ */
  var linha = document.querySelector('.linha-viva');
  if (linha && !semMovimento.matches) {
    var atualizarLinha = function () {
      var total = document.documentElement.scrollHeight - window.innerHeight;
      var p = total > 0 ? window.scrollY / total : 0;
      linha.style.setProperty('--progresso', Math.min(1, Math.max(0, p)).toFixed(4));
    };
    window.addEventListener('scroll', atualizarLinha, { passive: true });
    window.addEventListener('resize', atualizarLinha);
    atualizarLinha();
  }

  /* ------------------------------------------------------------------------
     5. Vídeos — o src só é atribuído quando o vídeo se aproxima da tela.
        Fora da tela, pausa. Com movimento reduzido, nunca carrega: fica o
        poster. Economia real de dados e bateria.
     ------------------------------------------------------------------------ */
  var videos = document.querySelectorAll('video[data-src]');
  if (!semMovimento.matches && suportaObserver && videos.length) {
    var obsVideo = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        var v = entrada.target;
        if (entrada.isIntersecting) {
          if (!v.src) { v.src = v.dataset.src; }
          var tocar = v.play();
          if (tocar && tocar.catch) { tocar.catch(function () { /* autoplay negado: fica o poster */ }); }
        } else if (v.src) {
          v.pause();
        }
      });
    }, { rootMargin: '200px 0px 200px 0px', threshold: 0.1 });
    videos.forEach(function (v) { obsVideo.observe(v); });
  }

  /* ------------------------------------------------------------------------
     6. Tratamento — cada etapa assume o foco ao cruzar o centro da tela.
        No mobile o CSS já mantém todas com opacidade cheia; aqui só
        adicionamos a classe, que lá não tem efeito.
     ------------------------------------------------------------------------ */
  var etapas = document.querySelectorAll('.etapa');
  if (suportaObserver && etapas.length && !semMovimento.matches) {
    var obsEtapa = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        entrada.target.classList.toggle('foco', entrada.isIntersecting);
      });
    }, { rootMargin: '-35% 0px -35% 0px' });
    etapas.forEach(function (e) { obsEtapa.observe(e); });
  } else {
    etapas.forEach(function (e) { e.classList.add('foco'); });
  }

  /* ------------------------------------------------------------------------
     7. Mapa — o iframe do Google só entra quando a seção aparece
     ------------------------------------------------------------------------ */
  var mapa = document.getElementById('mapa');
  if (mapa) {
    var injetarMapa = function () {
      if (mapa.dataset.pronto) return;
      mapa.dataset.pronto = '1';
      var iframe = document.createElement('iframe');
      iframe.src = mapa.dataset.mapa;
      iframe.title = 'Mapa: Tirol Way Office, Avenida Senador Salgado Filho, 1718, Tirol, Natal';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.allowFullscreen = true;
      mapa.replaceChildren(iframe);
    };
    if (suportaObserver) {
      var obsMapa = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) { injetarMapa(); obsMapa.disconnect(); }
        });
      }, { rootMargin: '400px' });
      obsMapa.observe(mapa);
    } else {
      injetarMapa();
    }
  }

  /* ------------------------------------------------------------------------
     8. Botão flutuante — recolhe quando o rodapé está visível (para não
        cobrir os links) e enquanto o menu móvel está aberto
     ------------------------------------------------------------------------ */
  var zap = document.getElementById('zap-flutuante');
  var rodape = document.querySelector('.rodape');
  if (zap && rodape && suportaObserver) {
    var obsZap = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        zap.classList.toggle('recolhido', entrada.isIntersecting);
      });
    }, { threshold: 0.05 });
    obsZap.observe(rodape);
  }
})();
