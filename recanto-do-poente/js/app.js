/* ==========================================================================
   RECANTO DO POENTE — comportamento do site
   --------------------------------------------------------------------------
   Sem bibliotecas, sem build. Um arquivo só.
   Blocos: 1 fotos · 2 cabeçalho · 3 movimento · 4 galeria ampliada
           5 formulário de consulta · 6 botão flutuante
   ========================================================================== */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var html = document.documentElement;

  /* Número usado no site. Conferir com o responsável antes da versão final. */
  var WHATSAPP = '5562994352659';

  var MSG_FLUTUANTE = 'Olá! Conheci o Recanto do Poente pelo site e gostaria de informações para planejar minha estadia.';

  function linkWhatsApp(mensagem) {
    return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(mensagem);
  }

  function abrirWhatsApp(mensagem) {
    var url = linkWhatsApp(mensagem);
    var janela = window.open(url, '_blank', 'noopener');
    if (!janela) window.location.href = url;   // pop-up bloqueado
  }

  /* Estado do movimento, compartilhado entre a animação das fotos e o
     vídeo da abertura: um só botão de pausa governa os dois. */
  var MOVIMENTO = {
    habilitado: false,
    pausado: false,
    reterControle: false,
    ouvintes: [],

    aoAlternar: function (fn) { this.ouvintes.push(fn); },

    alternar: function (pausado) {
      this.pausado = pausado;
      this.ouvintes.forEach(function (fn) { fn(pausado); });
    },

    /* Enquanto o vídeo roda em laço, o controle de pausa não some. */
    reter: function () {
      this.reterControle = true;
      var controle = document.getElementById('movimento-controle');
      if (controle && this.habilitado) controle.hidden = false;
    }
  };

  /* ======================================================================
     1. FOTOS
     A ordem desta lista é a ordem da galeria ampliada. O atributo
     data-foto das miniaturas no HTML aponta para o índice daqui.
     Textos alternativos e proporções vêm da curadoria das 16 imagens.
     ====================================================================== */
  var FOTOS = [
    { src: 'assets/exterior/01-hero-deck.webp', w: 1920, h: 1280,
      alt: 'Deck de madeira com espreguiçadeira, piscina e fachada envidraçada' },
    { src: 'assets/exterior/02-piscina-vertical.webp', w: 1200, h: 1600,
      alt: 'Espreguiçadeira e mesa junto à piscina com paisagem ao fundo' },
    { src: 'assets/exterior/03-fachada-jardim.webp', w: 1600, h: 1200,
      alt: 'Fachada do Recanto vista do jardim, com piscina e deck' },
    { src: 'assets/agua/04-vista-piscina.webp', w: 1920, h: 1280,
      alt: 'Piscina e deck vistos a partir do interior, com árvores ao fundo' },
    { src: 'assets/paisagem/05-poente-agua.webp', w: 900, h: 1600,
      alt: 'Horizonte alaranjado acima da água azul da piscina' },
    { src: 'assets/interior/06-loft-integrado.webp', w: 2000, h: 1333,
      alt: 'Cama e poltronas em ambiente integrado com madeira e luz natural' },
    { src: 'assets/cozinha/07-cozinha-jantar.webp', w: 2000, h: 1333,
      alt: 'Cozinha com bancada escura, cadeiras e luminárias de fibras' },
    { src: 'assets/quarto/08-cama-madeira.webp', w: 2000, h: 1333,
      alt: 'Cama com roupa branca diante da parede terracota, com armário de madeira ao lado' },
    { src: 'assets/banheiro/09-banheiro.webp', w: 1800, h: 1200,
      alt: 'Bancada de pedra, espelho e box de vidro no banheiro' },
    { src: 'assets/banheiro/10-banheiro-vista.webp', w: 1800, h: 1200,
      alt: 'Do banheiro, pela porta de vidro, o deck, a piscina e o horizonte' },
    { src: 'assets/detalhes/11-roupoes.webp', w: 1200, h: 1800,
      alt: 'Roupões brancos pendurados em armário de madeira iluminado' },
    { src: 'assets/exterior/12-fogueira-noite.webp', w: 1200, h: 1600,
      alt: 'Poltronas alaranjadas junto à fogueira na área externa à noite' },
    { src: 'assets/paisagem/13-horizonte-jardim.webp', w: 1200, h: 1600,
      alt: 'Duas poltronas no jardim diante da paisagem e do céu com nuvens' },
    { src: 'assets/exterior/14-chegada-poente.webp', w: 1800, h: 1200,
      alt: 'Fachada e jardim iluminados pelo sol baixo entre as árvores' },
    { src: 'assets/exterior/15-poltronas-deck.webp', w: 1600, h: 1280,
      alt: 'Duas poltronas alaranjadas sob ombrelone no deck com vista aberta' },
    { src: 'assets/agua/16-agua-deck.webp', w: 1200, h: 1600,
      alt: 'Áreas de água junto ao deck, com ombrelone e poltrona ao fundo' }
  ];

  /* ======================================================================
     2. CABEÇALHO
     ====================================================================== */
  (function cabecalho() {
    var barra  = $('#cabecalho');
    var botao  = $('#menu-botao');
    var menu   = $('#menu');
    if (!barra || !botao || !menu) return;

    window.addEventListener('scroll', function () {
      barra.classList.toggle('is-rolado', window.scrollY > 8);
    }, { passive: true });

    function fechar() {
      menu.classList.remove('is-aberto');
      botao.setAttribute('aria-expanded', 'false');
      $('.sr', botao).textContent = 'Abrir o menu';
    }

    botao.addEventListener('click', function () {
      var aberto = menu.classList.toggle('is-aberto');
      botao.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      $('.sr', botao).textContent = aberto ? 'Fechar o menu' : 'Abrir o menu';
    });

    $$('a', menu).forEach(function (a) { a.addEventListener('click', fechar); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-aberto')) {
        fechar();
        botao.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) fechar();
    });
  })();

  /* ======================================================================
     3. MOVIMENTO DAS FOTOS
     Aproximação de 2% em 12 s, linear, uma única vez por foto. Começa
     quando a foto entra na tela e nunca com duas rodando ao mesmo tempo.
     Quem pede menos movimento não recebe animação nenhuma.
     ====================================================================== */
  (function movimento() {
    var alvos   = $$('[data-movimento]');
    var controle = $('#movimento-controle');
    var rotulo   = $('#movimento-rotulo');
    if (!alvos.length || !controle) return;

    var menos = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (menos.matches) return;          // nada de animação, nada de controle

    MOVIMENTO.habilitado = true;
    html.classList.add('movimento-ativo');
    controle.hidden = false;

    controle.addEventListener('click', function () {
      var pausado = html.classList.toggle('movimento-pausado');
      rotulo.textContent = pausado ? 'Retomar movimento' : 'Pausar movimento';
      MOVIMENTO.alternar(pausado);
    });

    if (!('IntersectionObserver' in window)) {
      alvos[0].classList.add('is-animando');
      return;
    }

    var rodando = false;
    var concluidas = 0;

    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting || rodando) return;
        rodando = true;
        entrada.target.classList.add('is-animando');
        observador.unobserve(entrada.target);

        window.setTimeout(function () {
          rodando = false;
          concluidas += 1;
          // Nada mais se move: o controle sai de cena e libera o rodapé.
          // Com o vídeo da abertura em laço, ele continua necessário.
          if (concluidas === alvos.length && !MOVIMENTO.reterControle) {
            controle.hidden = true;
          }
        }, 12000);
      });
    }, { threshold: 0.35 });

    alvos.forEach(function (alvo) { observador.observe(alvo); });
  })();

  /* ======================================================================
     4. GALERIA AMPLIADA
     ====================================================================== */
  (function galeria() {
    var modal     = $('#modal');
    var foto      = $('#modal-foto');
    var legenda   = $('#modal-legenda');
    var contador  = $('#modal-contador');
    var fechar    = $('#modal-fechar');
    var anterior  = $('#modal-anterior');
    var proxima   = $('#modal-proxima');
    var abrirTudo = $('#abrir-galeria');
    if (!modal || !foto) return;

    var atual = 0;
    var devolverFoco = null;

    function mostrar(indice) {
      atual = (indice + FOTOS.length) % FOTOS.length;
      var f = FOTOS[atual];
      foto.setAttribute('width', f.w);
      foto.setAttribute('height', f.h);
      foto.src = f.src;
      foto.alt = f.alt;
      legenda.textContent = f.alt;
      contador.textContent = (atual + 1) + ' de ' + FOTOS.length;

      // adianta a vizinha, para a navegação não piscar
      [FOTOS[(atual + 1) % FOTOS.length], FOTOS[(atual - 1 + FOTOS.length) % FOTOS.length]]
        .forEach(function (vizinha) { new Image().src = vizinha.src; });
    }

    function abrir(indice) {
      devolverFoco = document.activeElement;
      mostrar(indice);
      modal.hidden = false;
      document.body.classList.add('modal-aberto');
      var zap = $('#zap');
      if (zap) zap.classList.add('is-oculto');
      fechar.focus();
    }

    function sair() {
      modal.hidden = true;
      document.body.classList.remove('modal-aberto');
      var zap = $('#zap');
      if (zap) zap.classList.remove('is-oculto');
      if (devolverFoco && devolverFoco.focus) devolverFoco.focus();
      devolverFoco = null;
    }

    $$('.galeria__item').forEach(function (item) {
      item.addEventListener('click', function () {
        abrir(parseInt(item.getAttribute('data-foto'), 10) || 0);
      });
    });

    if (abrirTudo) abrirTudo.addEventListener('click', function () { abrir(0); });

    fechar.addEventListener('click', sair);
    anterior.addEventListener('click', function () { mostrar(atual - 1); });
    proxima.addEventListener('click', function () { mostrar(atual + 1); });

    // clique no fundo escuro fecha; clique na foto, não
    modal.addEventListener('click', function (e) {
      if (e.target === modal || e.target.classList.contains('modal__palco')) sair();
    });

    document.addEventListener('keydown', function (e) {
      if (modal.hidden) return;

      if (e.key === 'Escape')     { sair(); return; }
      if (e.key === 'ArrowLeft')  { mostrar(atual - 1); return; }
      if (e.key === 'ArrowRight') { mostrar(atual + 1); return; }

      // foco preso dentro da galeria
      if (e.key === 'Tab') {
        var focaveis = [fechar, anterior, proxima];
        var primeiro = focaveis[0];
        var ultimo   = focaveis[focaveis.length - 1];
        if (e.shiftKey && document.activeElement === primeiro) {
          e.preventDefault(); ultimo.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault(); primeiro.focus();
        } else if (focaveis.indexOf(document.activeElement) === -1) {
          e.preventDefault(); primeiro.focus();
        }
      }
    });
  })();

  /* ======================================================================
     5. FORMULÁRIO DE CONSULTA
     Datas em America/Sao_Paulo. Nada de conversão por fuso: as datas são
     tratadas como texto AAAA-MM-DD, que já ordena corretamente.
     O site só prepara a mensagem — quem envia é a pessoa, no WhatsApp.
     ====================================================================== */
  (function consulta() {
    var form     = $('#formulario');
    var entrada  = $('#entrada');
    var saida    = $('#saida');
    var hospedes = $('#hospedes');
    if (!form || !entrada || !saida || !hospedes) return;

    /* Hoje, no fuso de Pirenópolis, em AAAA-MM-DD. */
    function hoje() {
      try {
        var partes = new Intl.DateTimeFormat('en-CA', {
          timeZone: 'America/Sao_Paulo',
          year: 'numeric', month: '2-digit', day: '2-digit'
        }).formatToParts(new Date());
        var m = {};
        partes.forEach(function (p) { m[p.type] = p.value; });
        if (m.year && m.month && m.day) return m.year + '-' + m.month + '-' + m.day;
      } catch (e) { /* navegador sem suporte a fuso nomeado */ }

      var d = new Date();
      return d.getFullYear() + '-' +
             ('0' + (d.getMonth() + 1)).slice(-2) + '-' +
             ('0' + d.getDate()).slice(-2);
    }

    /* Soma dias sem passar por fuso: aritmética em UTC, formatação em UTC. */
    function somarDias(iso, dias) {
      var p = iso.split('-');
      var t = Date.UTC(+p[0], +p[1] - 1, +p[2]) + dias * 86400000;
      var d = new Date(t);
      return d.getUTCFullYear() + '-' +
             ('0' + (d.getUTCMonth() + 1)).slice(-2) + '-' +
             ('0' + d.getUTCDate()).slice(-2);
    }

    function formatarBR(iso) {
      var p = iso.split('-');
      return p[2] + '/' + p[1] + '/' + p[0];
    }

    var MINIMO = hoje();
    entrada.min = MINIMO;
    saida.min   = somarDias(MINIMO, 1);

    function erroDe(campo) { return $('#erro-' + campo.id); }

    function limpar(campo) {
      var caixa = erroDe(campo);
      campo.removeAttribute('aria-invalid');
      campo.removeAttribute('aria-describedby');
      if (caixa) { caixa.hidden = true; caixa.textContent = ''; }
    }

    function marcar(campo, mensagem) {
      var caixa = erroDe(campo);
      campo.setAttribute('aria-invalid', 'true');
      if (caixa) {
        caixa.textContent = mensagem;
        caixa.hidden = false;
        campo.setAttribute('aria-describedby', caixa.id);
      }
      return campo;
    }

    /* Devolve o campo com problema, ou null. */
    function conferirEntrada() {
      limpar(entrada);
      if (!entrada.value) return marcar(entrada, 'Escolha a data de entrada.');
      if (entrada.value < MINIMO) return marcar(entrada, 'A entrada precisa ser hoje ou em uma data futura.');
      return null;
    }

    function conferirSaida() {
      limpar(saida);
      if (!saida.value) return marcar(saida, 'Escolha a data de saída.');
      if (entrada.value && saida.value <= entrada.value) {
        return marcar(saida, 'A saída precisa ser depois da entrada.');
      }
      return null;
    }

    function conferirHospedes() {
      limpar(hospedes);
      if (hospedes.value !== '1' && hospedes.value !== '2') {
        return marcar(hospedes, 'Selecione 1 ou 2 hóspedes.');
      }
      return null;
    }

    /* Mudar a entrada reaproveita a saída: novo mínimo e nova conferência. */
    entrada.addEventListener('change', function () {
      if (entrada.value) {
        saida.min = somarDias(entrada.value, 1);
      } else {
        saida.min = somarDias(MINIMO, 1);
      }
      conferirEntrada();
      if (saida.value) conferirSaida();
    });

    saida.addEventListener('change', function () { if (saida.value) conferirSaida(); });
    hospedes.addEventListener('change', function () { conferirHospedes(); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var problemas = [conferirEntrada(), conferirSaida(), conferirHospedes()]
        .filter(function (campo) { return campo; });

      if (problemas.length) {
        problemas[0].focus();
        return;
      }

      var n = parseInt(hospedes.value, 10);
      abrirWhatsApp(
        'Olá! Conheci o Recanto do Poente pelo site e gostaria de consultar ' +
        'disponibilidade de ' + formatarBR(entrada.value) +
        ' a ' + formatarBR(saida.value) +
        ' para ' + n + (n === 1 ? ' hóspede' : ' hóspedes') + '. ' +
        'Podem me informar os valores e as condições?'
      );
    });
  })();

  /* ======================================================================
     6. BOTÃO FLUTUANTE
     Some enquanto o formulário está à vista, para não cobrir os campos.
     ====================================================================== */
  (function flutuante() {
    var zap = $('#zap');
    if (!zap) return;

    zap.setAttribute('href', linkWhatsApp(MSG_FLUTUANTE));

    var secao = $('#consultar');
    if (!secao || !('IntersectionObserver' in window)) return;

    new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!$('#modal') || $('#modal').hidden) {
          zap.classList.toggle('is-oculto', entrada.isIntersecting);
        }
      });
    }, { threshold: 0.12 }).observe(secao);
  })();

  /* ======================================================================
     7. VÍDEO DA ABERTURA
     A fotografia continua sendo a base: carrega primeiro, serve de pôster
     e permanece embaixo como alternativa. O vídeo entra por cima só quando
     vale a pena, e nunca muda a altura do quadro.

     Não entra quando: não há arquivo configurado, a pessoa pediu menos
     movimento, a tela é de celular (a abertura ali é a foto vertical, que
     o vídeo horizontal não cobre sem cortar a arquitetura), o aparelho
     está em economia de dados ou em conexão lenta.
     ====================================================================== */
  (function videoAbertura() {
    /* Caminho do vídeo da abertura. Vazio = a abertura fica só com a
       fotografia, exatamente como antes. Ver LEIA-ME.md, seção "Vídeo". */
    var ARQUIVO = '';

    if (!ARQUIVO) return;
    if (!MOVIMENTO.habilitado) return;                        // menos movimento
    if (window.matchMedia('(max-width: 720px)').matches) return;

    var rede = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (rede && (rede.saveData || /(^|-)2g$/.test(rede.effectiveType || ''))) return;

    var figura = $('.abertura__figura');
    var foto   = figura && $('img', figura);
    if (!figura || !foto) return;

    var video = document.createElement('video');
    var tipo = /\.webm$/i.test(ARQUIVO) ? 'video/webm' : 'video/mp4';
    if (!video.canPlayType || !video.canPlayType(tipo)) return;

    video.className = 'abertura__video';
    video.muted = true;              // precisa valer antes do play, senão o
    video.defaultMuted = true;       // navegador bloqueia o autoplay
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('disablepictureinpicture', '');
    video.setAttribute('tabindex', '-1');
    video.setAttribute('aria-hidden', 'true');   // a foto embaixo já descreve a cena
    video.poster = foto.currentSrc || foto.src;

    function desistir() {
      if (video.parentNode) video.parentNode.removeChild(video);
      html.classList.remove('hero-video');
    }

    video.addEventListener('error', desistir);

    video.addEventListener('playing', function () {
      video.classList.add('is-visivel');
      html.classList.add('hero-video');   // uma fonte de movimento por vez
      MOVIMENTO.reter();
    }, { once: true });

    function tocar() {
      if (MOVIMENTO.pausado || !video.paused) return;
      var p = video.play();
      /* play() rejeitado — autoplay recusado pelo navegador, ou a promessa
         interrompida por um pause() logo em seguida — não derruba nada: o
         vídeo simplesmente não aparece e a fotografia embaixo continua
         sendo o que se vê. Só o evento 'error' remove o elemento. */
      if (p && p.catch) p.catch(function () {});
    }

    MOVIMENTO.aoAlternar(function (pausado) {
      if (pausado) video.pause(); else tocar();
    });

    /* Só depois que a página terminou de carregar: o vídeo nunca disputa
       banda com a fotografia da abertura, que é o que a pessoa vê antes. */
    function iniciar() {
      video.src = ARQUIVO;
      figura.appendChild(video);
      tocar();

      /* Fora da tela, o vídeo para: economiza bateria e dados. */
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entradas) {
          entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) tocar(); else video.pause();
          });
        }, { threshold: 0.15 }).observe(figura);
      }
    }

    if (document.readyState === 'complete') {
      window.setTimeout(iniciar, 0);
    } else {
      window.addEventListener('load', function () { window.setTimeout(iniciar, 0); });
    }
  })();

})();
