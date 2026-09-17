/* ==========================================================================
   MARIDO DE ALUGUEL — comportamento da página
   --------------------------------------------------------------------------
   Este arquivo raramente precisa ser editado. Ele faz três coisas:
     1. escreve na página os dados que estão em js/config.js;
     2. abre e fecha o menu no celular;
     3. revela as seções conforme a pessoa rola a página.
   Nada aqui envia mensagem sozinho: os botões apenas abrem o WhatsApp.
   ========================================================================== */
(function () {
  'use strict';

  var $  = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };

  /* ------------------------------------------------------------------
     1. DADOS DO NEGÓCIO → PÁGINA
     ------------------------------------------------------------------ */
  function aplicarDados() {
    if (typeof SITE === 'undefined') return;

    /* Links do WhatsApp. Cada link diz qual mensagem quer:
       data-servico="..."  → mensagem daquele serviço
       data-mensagem="padrao" → mensagem geral                       */
    $$('.js-zap').forEach(function (a) {
      var servico = a.getAttribute('data-servico');
      a.href = servico
        ? SITE.whatsapp(SITE.mensagemPorServico(servico))
        : SITE.whatsapp();
      a.target = '_blank';
      a.rel = 'noopener';
    });

    /* Telefone: link e texto visível */
    $$('.js-tel').forEach(function (a) {
      a.href = SITE.telefoneHref;
      a.textContent = SITE.telefoneExibicao;
    });

    $$('.js-horario').forEach(function (el) { el.textContent = SITE.horario; });
    $$('.js-horario-fds').forEach(function (el) { el.textContent = SITE.horarioFimDeSemana; });
    $$('.js-endereco').forEach(function (el) { el.textContent = SITE.enderecoCompleto; });

    /* Nota do Google. Se `nota` for null em config.js, o selo não aparece. */
    var selo = $('.js-nota');
    if (selo && SITE.nota != null) {
      var texto = String(SITE.nota).replace('.', ',') + '/5';
      if (SITE.qtdAvaliacoes != null) {
        texto += ' — ' + SITE.qtdAvaliacoes + ' avaliações no Google';
      }
      $('.js-nota-texto', selo).textContent = texto;
      selo.hidden = false;
    }
  }

  /* ------------------------------------------------------------------
     2. MENU NO CELULAR
     ------------------------------------------------------------------ */
  function menu() {
    var btn = $('#menu-btn');
    var nav = $('#menu');
    if (!btn || !nav) return;

    function fechar() {
      nav.classList.remove('aberto');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Abrir o menu');
    }

    btn.addEventListener('click', function () {
      var aberto = nav.classList.toggle('aberto');
      btn.setAttribute('aria-expanded', String(aberto));
      btn.setAttribute('aria-label', aberto ? 'Fechar o menu' : 'Abrir o menu');
    });

    /* Tocar num link fecha o menu e deixa a âncora rolar */
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) fechar();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('aberto')) {
        fechar();
        btn.focus();
      }
    });

    /* Ao girar o celular ou voltar para o desktop, o menu não fica preso */
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) fechar();
    });
  }

  /* ------------------------------------------------------------------
     3. FOTO QUE AINDA NÃO ESTÁ NA PASTA
     ------------------------------------------------------------------
     Se o arquivo .jpg não existir em media/, a imagem some e o espaço
     reservado (o endereço está no data-reserva da própria imagem) entra
     como fundo do quadro — em vez do ícone de imagem quebrada.

     O reservado só é pintado quando a foto falha de verdade. Se ele
     ficasse sempre no fundo, apareceria por trás de cada foto enquanto
     ela carrega, e numa rede lenta o visitante veria o retângulo azul
     piscar antes da imagem.
     ------------------------------------------------------------------ */
  function fotosPendentes() {
    $$('img[data-reserva]').forEach(function (img) {
      function marcar() {
        var quadro = img.parentElement;
        if (quadro) quadro.style.backgroundImage = 'url(' + img.dataset.reserva + ')';
        img.classList.add('sem-foto');
      }
      if (img.complete && img.naturalWidth === 0) marcar();
      img.addEventListener('error', marcar);
    });
  }

  /* ------------------------------------------------------------------
     4. REVELAR AS SEÇÕES AO ROLAR
     ------------------------------------------------------------------ */
  function revelar() {
    var alvos = $$('.r-sobe');
    if (!alvos.length) return;

    var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (semMovimento || !('IntersectionObserver' in window)) {
      alvos.forEach(function (el) { el.classList.add('visivel'); });
      return;
    }

    /* Itens irmãos entram em cascata curta, um depois do outro */
    var contador = new Map();
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        var el = entrada.target;
        var pai = el.parentElement;
        var n = contador.get(pai) || 0;
        el.style.setProperty('--atraso', Math.min(n, 5) * 90 + 'ms');
        contador.set(pai, n + 1);
        el.classList.add('visivel');
        obs.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    alvos.forEach(function (el) { obs.observe(el); });
  }

  /* ------------------------------------------------------------------ */
  function iniciar() {
    aplicarDados();
    fotosPendentes();
    menu();
    revelar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
