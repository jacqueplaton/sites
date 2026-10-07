/* ==========================================================================
   CABANA DO BARÃO — comportamento
   --------------------------------------------------------------------------
   Depende de js/config.js (CABANA). Sem bibliotecas, sem build.
   O conteúdo e os botões funcionam mesmo se este arquivo falhar: os links
   de consulta já apontam para o WhatsApp no próprio HTML.
   ========================================================================== */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var html = document.documentElement;
  var reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');
  var cfg = window.CABANA || {};
  var whats = cfg.whatsapp || {};
  var whatsAtivo = !!(whats.validado && /^\d{12,13}$/.test(String(whats.numero || '')));

  /* ======================================================================
     WHATSAPP / CTAs
     Com o número validado em config.js, os CTAs e o botão flutuante abrem
     o WhatsApp com a mensagem padrão.
     ====================================================================== */
  function linkWhatsApp(texto) {
    return 'https://wa.me/' + whats.numero + '?text=' + encodeURIComponent(texto);
  }

  function ligarCanal() {
    if (!whatsAtivo) return;

    var padrao = linkWhatsApp(whats.mensagem);
    $$('[data-cta]').forEach(function (a) {
      a.href = padrao;
      a.target = '_blank';
      a.rel = 'noopener';
    });

    var flutuante = $('[data-whats]');
    if (flutuante) {
      flutuante.href = padrao;
      flutuante.target = '_blank';
      flutuante.rel = 'noopener';
      flutuante.hidden = false;
    }
  }

  /* ======================================================================
     CABEÇALHO: fundo sólido depois do vídeo; menu do celular
     ====================================================================== */
  function iniciarTopo() {
    var topo = $('[data-topo]');
    var palco = $('.hero__palco');
    if (!topo) return;

    var pendente = false;
    function atualizar() {
      pendente = false;
      var limite = palco ? palco.offsetHeight - topo.offsetHeight : 40;
      topo.classList.toggle('is-solido', window.scrollY > limite);
    }
    window.addEventListener('scroll', function () {
      if (!pendente) { pendente = true; window.requestAnimationFrame(atualizar); }
    }, { passive: true });
    window.addEventListener('resize', atualizar);
    atualizar();

    // Menu do celular
    var botao = $('[data-menu-botao]');
    var nav = $('[data-nav]');
    var rotulo = $('[data-menu-texto]');
    var desktop = window.matchMedia('(min-width: 960px)');

    function abrir() {
      topo.classList.add('is-aberto');
      html.classList.add('menu-aberto');
      botao.setAttribute('aria-expanded', 'true');
      if (rotulo) rotulo.textContent = 'Fechar';
      var primeiro = $('a', nav);
      if (primeiro) primeiro.focus();
    }
    function fechar(devolverFoco) {
      if (!topo.classList.contains('is-aberto')) return;
      topo.classList.remove('is-aberto');
      html.classList.remove('menu-aberto');
      botao.setAttribute('aria-expanded', 'false');
      if (rotulo) rotulo.textContent = 'Menu';
      if (devolverFoco) botao.focus();
    }

    if (botao && nav) {
      botao.addEventListener('click', function () {
        if (topo.classList.contains('is-aberto')) fechar(true); else abrir();
      });
      nav.addEventListener('click', function (e) {
        if (e.target.closest('a')) fechar(false);
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') fechar(true);
      });
      // Mantém o foco dentro do menu aberto (Tab no último volta ao botão)
      topo.addEventListener('keydown', function (e) {
        if (e.key !== 'Tab' || !topo.classList.contains('is-aberto')) return;
        var focaveis = [botao].concat($$('a', nav));
        var i = focaveis.indexOf(document.activeElement);
        if (e.shiftKey && i === 0) { e.preventDefault(); focaveis[focaveis.length - 1].focus(); }
        else if (!e.shiftKey && i === focaveis.length - 1) { e.preventDefault(); focaveis[0].focus(); }
      });
      var aoMudar = function () { if (desktop.matches) fechar(false); };
      if (desktop.addEventListener) desktop.addEventListener('change', aoMudar);
    }

    // Marca no menu a seção visível
    if (!('IntersectionObserver' in window)) return;
    var links = {};
    $$('.nav__lista a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        var a = links[en.target.id];
        if (!a) return;
        if (en.isIntersecting) {
          $$('.nav__lista a').forEach(function (x) { x.removeAttribute('aria-current'); });
          a.setAttribute('aria-current', 'true');
        } else if (a.getAttribute('aria-current')) {
          a.removeAttribute('aria-current');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(links).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) observador.observe(s);
    });
  }

  /* ======================================================================
     VÍDEO DO TOPO
     Toca mudo e em loop. Não toca sozinho com "reduzir movimento" ou com
     economia de dados; nesses casos fica o poster e o botão "Reproduzir".
     Pausa quando sai da tela. Se o navegador bloquear, fica o poster.
     ====================================================================== */
  function iniciarVideo() {
    var v = $('[data-video]');
    var botao = $('[data-video-controle]');
    var rotulo = $('[data-video-rotulo]');
    var vcfg = cfg.video || {};
    if (!v || !botao || !vcfg.ativo) return;

    var mobile = window.matchMedia('(max-width: ' + (vcfg.larguraMobile || 959) + 'px)').matches;
    var mp4 = mobile ? vcfg.mobile : vcfg.desktop;
    var webm = mobile ? vcfg.mobileWebm : vcfg.desktopWebm;
    var tocaMp4 = !!v.canPlayType('video/mp4; codecs="avc1.640028"');
    var tocaWebm = !!v.canPlayType('video/webm; codecs="vp9"');
    var src = (mp4 && tocaMp4) ? mp4 : (webm && tocaWebm) ? webm : null;
    if (!src) return;   // nenhum formato suportado: fica o poster

    var conexao = navigator.connection || {};
    var economia = !!conexao.saveData || /(^|-)2g$/.test(conexao.effectiveType || '');
    var carregado = false;
    var pausadoPeloUsuario = false;
    var pausadoPelaRolagem = false;

    function estado(tocando) {
      botao.setAttribute('data-estado', tocando ? 'tocando' : 'pausado');
      rotulo.textContent = tocando ? 'Pausar vídeo' : 'Reproduzir vídeo';
    }

    function carregar() {
      if (carregado) return;
      v.src = src;
      carregado = true;
    }

    function tocar() {
      carregar();
      var p = v.play();
      if (p && typeof p.catch === 'function') {
        p.catch(function () { estado(false); });
      }
    }

    v.addEventListener('playing', function () {
      v.classList.add('is-tocando');
      estado(true);
    });
    v.addEventListener('pause', function () { estado(false); });
    v.addEventListener('error', function () {
      v.classList.remove('is-tocando');
      botao.hidden = true;
    });

    botao.addEventListener('click', function () {
      if (v.paused) { pausadoPeloUsuario = false; tocar(); }
      else { pausadoPeloUsuario = true; v.pause(); }
    });

    botao.hidden = false;
    estado(false);

    var autoplay = !reduzirMovimento.matches && !economia;
    if (autoplay) {
      // Espera a página carregar para não disputar banda com o poster e as fontes.
      var iniciar = function () { window.setTimeout(tocar, 250); };
      if (document.readyState === 'complete') iniciar();
      else window.addEventListener('load', iniciar, { once: true });
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entradas) {
        var visivel = entradas[0].isIntersecting;
        if (!visivel && !v.paused) { pausadoPelaRolagem = true; v.pause(); }
        else if (visivel && pausadoPelaRolagem && !pausadoPeloUsuario) { pausadoPelaRolagem = false; tocar(); }
      }, { threshold: 0.15 }).observe(v);
    }
  }

  /* ======================================================================
     GALERIA + LIGHTBOX
     Teclado: ← → navegam, Esc fecha, Tab fica dentro do diálogo.
     Ao fechar, o foco volta para a foto que abriu a lightbox.
     ====================================================================== */
  function iniciarGaleria() {
    var figuras = $$('.galeria .g');
    var dialogo = $('[data-lightbox]');
    if (!figuras.length || !dialogo) return;

    var img = $('[data-lb-img]', dialogo);
    var legenda = $('[data-lb-legenda]', dialogo);
    var atual = $('[data-lb-atual]', dialogo);
    var total = $('[data-lb-total]', dialogo);
    var anuncio = $('[data-lb-anuncio]', dialogo);
    var figura = $('[data-lb-figura]', dialogo);

    var fotos = figuras.map(function (f) {
      var mini = $('img', f);
      return {
        src: f.getAttribute('data-full'),
        legenda: f.getAttribute('data-legenda') || '',
        alt: mini ? mini.alt : '',
        largura: mini ? mini.getAttribute('width') : null,
        altura: mini ? mini.getAttribute('height') : null
      };
    });
    var indice = 0;
    var gatilho = null;
    var suportaDialogo = typeof dialogo.showModal === 'function';
    var dois = function (n) { return (n < 10 ? '0' : '') + n; };

    total.textContent = dois(fotos.length);

    function mostrar(i) {
      indice = (i + fotos.length) % fotos.length;
      var f = fotos[indice];
      img.removeAttribute('src');
      if (f.largura) { img.width = f.largura; img.height = f.altura; }
      img.src = f.src;
      img.alt = f.alt;
      legenda.textContent = f.legenda;
      atual.textContent = dois(indice + 1);
      anuncio.textContent = 'Foto ' + (indice + 1) + ' de ' + fotos.length + '. ' + f.legenda;
      // pré-carrega as vizinhas
      [indice + 1, indice - 1].forEach(function (j) {
        var viz = fotos[(j + fotos.length) % fotos.length];
        var pre = new Image(); pre.src = viz.src;
      });
    }

    function abrir(i, origem) {
      if (!suportaDialogo) { window.open(fotos[i].src, '_blank', 'noopener'); return; }
      gatilho = origem || document.activeElement;
      mostrar(i);
      dialogo.showModal();
      html.classList.add('lightbox-aberta');
      $('[data-lb-fechar]', dialogo).focus();
    }

    function fechar() {
      if (dialogo.open) dialogo.close();
    }

    dialogo.addEventListener('close', function () {
      html.classList.remove('lightbox-aberta');
      if (gatilho && typeof gatilho.focus === 'function') gatilho.focus();
      gatilho = null;
    });

    figuras.forEach(function (f, i) {
      var b = $('.g__abrir', f);
      if (!b) return;
      var s = $('.sr', b);
      if (s) s.textContent = 'Ampliar foto ' + (i + 1) + ' de ' + fotos.length;
      b.addEventListener('click', function () { abrir(i, b); });
    });

    $('[data-lb-fechar]', dialogo).addEventListener('click', fechar);
    $('[data-lb-ant]', dialogo).addEventListener('click', function () { mostrar(indice - 1); });
    $('[data-lb-prox]', dialogo).addEventListener('click', function () { mostrar(indice + 1); });

    dialogo.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); mostrar(indice - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); mostrar(indice + 1); }
    });

    // Clique fora da foto (no fundo) fecha
    figura.addEventListener('click', function (e) {
      if (e.target === figura) fechar();
    });

    // Deslizar no toque
    var x0 = null, y0 = null;
    figura.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse') return;
      x0 = e.clientX; y0 = e.clientY;
    });
    figura.addEventListener('pointerup', function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0, dy = e.clientY - y0;
      x0 = y0 = null;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) mostrar(indice + (dx < 0 ? 1 : -1));
    });
    figura.addEventListener('pointercancel', function () { x0 = y0 = null; });
  }

  /* ======================================================================
     CONSULTA
     Datas opcionais; se as duas forem preenchidas, a saída precisa ser
     depois da entrada. Nunca confirma reserva.
     ====================================================================== */
  function iniciarConsulta() {
    var form = $('[data-form]');
    if (!form) return;

    var entrada = $('#entrada', form);
    var saida = $('#saida', form);
    var erro = $('[data-erro]', form);
    var previa = $('[data-previa]');
    var mensagemEl = $('[data-mensagem]');
    var copiar = $('[data-copiar]');
    var status = $('[data-copiar-status]');
    var ultimaMensagem = '';

    function hojeISO() {
      var d = new Date();
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      return d.toISOString().slice(0, 10);
    }
    function formatar(iso) {
      var p = iso.split('-');
      return p[2] + '/' + p[1] + '/' + p[0];
    }
    function valida(iso) { return /^\d{4}-\d{2}-\d{2}$/.test(iso); }

    var hoje = hojeISO();
    entrada.min = hoje;
    saida.min = hoje;
    entrada.addEventListener('change', function () {
      saida.min = entrada.value && valida(entrada.value) ? entrada.value : hoje;
      limparErro();
    });
    saida.addEventListener('change', limparErro);

    function limparErro() {
      erro.textContent = '';
      entrada.removeAttribute('aria-invalid');
      saida.removeAttribute('aria-invalid');
    }
    function mostrarErro(campo, texto) {
      erro.textContent = texto;
      campo.setAttribute('aria-invalid', 'true');
      campo.focus();
    }

    function montarMensagem(ent, sai) {
      var linhas = [whats.mensagem || 'Olá! Vim pelo site da Cabana do Barão e gostaria de consultar disponibilidade e valores para uma reserva.'];
      if (ent) linhas.push('Entrada: ' + formatar(ent));
      if (sai) linhas.push('Saída: ' + formatar(sai));
      return linhas.join('\n');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      limparErro();
      var ent = entrada.value, sai = saida.value;

      if (ent && !valida(ent)) return mostrarErro(entrada, 'Confira a data de entrada.');
      if (sai && !valida(sai)) return mostrarErro(saida, 'Confira a data de saída.');
      if (ent && ent < hoje) return mostrarErro(entrada, 'A data de entrada já passou. Escolha outra data.');
      if (ent && sai && sai <= ent) return mostrarErro(saida, 'A saída precisa ser depois da entrada.');

      ultimaMensagem = montarMensagem(ent, sai);

      if (whatsAtivo) {
        window.open(linkWhatsApp(ultimaMensagem), '_blank', 'noopener');
        return;
      }

      // Sem canal validado: mostra a mensagem pronta e o caminho pelo Instagram.
      mensagemEl.textContent = ultimaMensagem;
      status.textContent = '';
      previa.hidden = false;
      previa.focus();
    });

    if (copiar) {
      copiar.addEventListener('click', function () {
        function ok() { status.textContent = 'Mensagem copiada. Cole no direct do Instagram.'; }
        function falha() {
          var r = document.createRange();
          r.selectNodeContents(mensagemEl);
          var sel = window.getSelection();
          sel.removeAllRanges(); sel.addRange(r);
          status.textContent = 'Texto selecionado. Use o comando de copiar do seu aparelho.';
        }
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(ultimaMensagem).then(ok, falha);
        } else {
          falha();
        }
      });
    }
  }

  /* ======================================================================
     REVELAÇÃO AO ROLAR
     ====================================================================== */
  function iniciarRevelacao() {
    var itens = $$('[data-revelar]');
    if (reduzirMovimento.matches || !('IntersectionObserver' in window)) {
      itens.forEach(function (el) { el.classList.add('is-visivel'); });
      return;
    }
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-visivel');
          obs.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    itens.forEach(function (el) { obs.observe(el); });
  }

  /* ====================================================================== */
  ligarCanal();
  iniciarTopo();
  iniciarVideo();
  iniciarGaleria();
  iniciarConsulta();
  iniciarRevelacao();
})();
