/* ==========================================================================
   TERRA DOURADA — comportamento da prévia
   Sem bibliotecas. Dados e chaves ficam em js/config.js.
   ========================================================================== */
(function () {
  'use strict';

  var CFG = window.TERRA_DOURADA || {};
  var doc = document.documentElement;
  var reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var numeroWhats = ((CFG.whatsapp && CFG.whatsapp.numero) || '').replace(/\D/g, '');
  var whatsAtivo = numeroWhats.length >= 12;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ------------------------------------------------------------------------
     Modo da prévia (revisão × cliente)
     ------------------------------------------------------------------------ */
  var botaoModo = $('[data-modo-cliente]');
  if (botaoModo) {
    botaoModo.addEventListener('click', function () {
      var url = new URL(location.href);
      url.searchParams.set('modo', 'cliente');
      location.href = url.toString();
    });
  }

  /* ------------------------------------------------------------------------
     Links oficiais centralizados (data-link="chave" → CFG.links[chave]).
     Link nulo = elemento escondido (nunca um link quebrado ou suposto).
     ------------------------------------------------------------------------ */
  $$('[data-link]').forEach(function (a) {
    var url = CFG.links && CFG.links[a.dataset.link];
    if (url) { a.href = url; a.hidden = false; }
    else { a.hidden = true; }
  });

  /* ------------------------------------------------------------------------
     Mensagens e consulta
     ------------------------------------------------------------------------ */
  var LACUNA = '___';

  function plural(n, um, varios) { return n + ' ' + (n === 1 ? um : varios); }

  function formatarData(iso) {
    if (!iso) return '';
    var p = iso.split('-');
    return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : iso;
  }

  function preencher(modelo, dados) {
    dados = dados || {};
    var chegada = formatarData(dados.chegada);
    var saida = formatarData(dados.saida);
    var datas = chegada && saida ? chegada + ' a ' + saida
              : chegada ? 'a partir de ' + chegada
              : saida ? 'até ' + saida
              : LACUNA;

    var ad = parseInt(dados.adultos, 10);
    var cr = parseInt(dados.criancas, 10);
    var temAd = ad > 0;
    var temCr = cr >= 0 && dados.criancas !== '' && dados.criancas != null;

    var adultos = temAd ? plural(ad, 'adulto', 'adultos') : LACUNA + ' adultos';
    var criancas = !temCr ? LACUNA + ' crianças'
                 : cr === 0 ? 'nenhuma criança'
                 : plural(cr, 'criança', 'crianças');

    var pessoas;
    if (temAd && temCr && cr > 0) pessoas = adultos + ' e ' + criancas;
    else if (temAd) pessoas = adultos;
    else pessoas = LACUNA + ' pessoas';

    return modelo
      .replace(/\{datas\}/g, datas)
      .replace(/\{adultos\}/g, adultos)
      .replace(/\{criancas\}/g, criancas)
      .replace(/\{pessoas\}/g, pessoas);
  }

  function mensagem(tipo, dados) {
    var m = (CFG.mensagens && (CFG.mensagens[tipo] || CFG.mensagens.geral)) || '';
    return preencher(m, dados);
  }

  function linkWhats(texto) {
    return 'https://wa.me/' + numeroWhats + '?text=' + encodeURIComponent(texto);
  }

  /* Medição: só origem, unidade e canal — nenhum dado pessoal. */
  function registrar(origem, unidade) {
    var evento = { event: 'consulta_clique', origem: origem || 'desconhecida', unidade: unidade || 'geral', canal: whatsAtivo ? 'whatsapp' : 'formulario' };
    if (Array.isArray(window.dataLayer)) window.dataLayer.push(evento);
    document.dispatchEvent(new CustomEvent('terradourada:consulta', { detail: evento }));
  }

  var form = $('[data-form-consulta]');
  var campoMensagem = form && $('[data-mensagem]', form);
  var statusConsulta = form && $('[data-status]', form);
  var editadoManual = false;

  function dadosForm() {
    if (!form) return {};
    var fd = new FormData(form);
    return {
      unidade: fd.get('unidade') || 'geral',
      chegada: fd.get('chegada'),
      saida: fd.get('saida'),
      adultos: fd.get('adultos'),
      criancas: fd.get('criancas')
    };
  }

  function atualizarMensagem() {
    if (!campoMensagem || editadoManual) return;
    var d = dadosForm();
    campoMensagem.value = mensagem(d.unidade, d);
  }

  function selecionarUnidade(tipo) {
    if (!form) return;
    var valor = ['casa-rosa', 'kaliandra', 'conjunta'].indexOf(tipo) > -1 ? tipo : 'geral';
    var radio = form.querySelector('input[name="unidade"][value="' + valor + '"]');
    if (radio) radio.checked = true;
    if (['acesso', 'duvida'].indexOf(tipo) > -1 && campoMensagem) {
      editadoManual = true;
      campoMensagem.value = mensagem(tipo);
    } else {
      editadoManual = false;
      atualizarMensagem();
    }
  }

  /* Todos os CTAs de consulta. Sem WhatsApp confirmado, levam ao convite
     final (#consultar) com a acomodação já escolhida. */
  $$('[data-consulta]').forEach(function (a) {
    var tipo = a.dataset.consulta;
    if (whatsAtivo) {
      a.href = linkWhats(mensagem(tipo));
      a.target = '_blank';
      a.rel = 'noopener';
    }
    a.addEventListener('click', function () {
      registrar(a.dataset.origem, tipo);
      if (!whatsAtivo) selecionarUnidade(tipo);
      fecharMenu();
    });
  });

  var whats = $('[data-whats]');
  if (whats && !whatsAtivo) {
    whats.classList.add('is-inativo');
    whats.setAttribute('aria-label', 'Consultar disponibilidade (WhatsApp em configuração)');
  }

  var rodapeWhats = $('[data-whatsapp-rodape]');
  if (rodapeWhats && whatsAtivo) {
    var n = numeroWhats;
    $('[data-whatsapp-numero]', rodapeWhats).textContent =
      '+' + n.slice(0, 2) + ' ' + n.slice(2, 4) + ' ' + n.slice(4, n.length - 4) + '-' + n.slice(-4);
    rodapeWhats.hidden = false;
  }

  if (form) {
    atualizarMensagem();
    form.addEventListener('change', function (e) {
      if (e.target.name === 'unidade') editadoManual = false;
      if (e.target.name === 'chegada') {
        var saida = form.elements.saida;
        saida.min = e.target.value || '';
      }
      atualizarMensagem();
    });
    form.addEventListener('input', function (e) {
      if (e.target === campoMensagem) editadoManual = campoMensagem.value.trim() !== '';
      else atualizarMensagem();
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = dadosForm();
      registrar('convite', d.unidade);
      var texto = (campoMensagem && campoMensagem.value.trim()) || mensagem(d.unidade, d);
      if (whatsAtivo) {
        window.open(linkWhats(texto), '_blank', 'noopener');
      } else if (statusConsulta) {
        statusConsulta.hidden = false;
        statusConsulta.focus();
      }
    });
  }

  /* ------------------------------------------------------------------------
     Vídeo de abertura: pôster primeiro; vídeo só sem "movimento reduzido"
     e sem economia de dados. Pausa fora da tela. Falha → fica o pôster.
     ------------------------------------------------------------------------ */
  var chegada = $('[data-chegada]');
  var video = chegada && $('.chegada__video', chegada);
  var botaoVideo = chegada && $('[data-video-botao]', chegada);
  var pausadoPeloUsuario = false;

  function marcarPausado(p) {
    chegada.classList.toggle('is-pausado', p);
    botaoVideo.setAttribute('aria-label', p ? 'Reproduzir vídeo' : 'Pausar vídeo');
  }
  /* H.264 (MP4) primeiro; VP9 (WebM) para navegadores sem H.264. */
  function carregarVideo() {
    if (video.getAttribute('src')) return true;
    var movel = window.matchMedia('(max-width: 719px)').matches;
    var ds = video.dataset;
    if (video.canPlayType('video/mp4; codecs="avc1.640020"')) video.src = movel ? ds.mp4Movel : ds.mp4;
    else if (video.canPlayType('video/webm; codecs="vp9"')) video.src = movel ? ds.webmMovel : ds.webm;
    else { chegada.classList.add('sem-video'); return false; }
    return true;
  }
  function tocar() {
    if (!carregarVideo()) return;
    var p = video.play();
    if (p && p.catch) p.catch(function () { marcarPausado(true); });
  }

  if (video && botaoVideo) {
    var economia = navigator.connection && navigator.connection.saveData;
    video.addEventListener('playing', function () { chegada.classList.add('is-tocando'); marcarPausado(false); });
    video.addEventListener('pause', function () { marcarPausado(true); });
    video.addEventListener('error', function () { chegada.classList.remove('is-tocando'); chegada.classList.add('sem-video'); });

    botaoVideo.addEventListener('click', function () {
      if (video.paused) { pausadoPeloUsuario = false; tocar(); }
      else { pausadoPeloUsuario = true; video.pause(); marcarPausado(true); }
    });

    if (reduzido || economia) {
      marcarPausado(true);
    } else {
      tocar();
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entradas) {
        var visivel = entradas[0].isIntersecting;
        if (!video.getAttribute('src')) return;
        if (!visivel && !video.paused) video.pause();
        else if (visivel && video.paused && !pausadoPeloUsuario && !reduzido && !economia) video.play().catch(function () {});
      }, { threshold: 0.15 }).observe(chegada);
    }
  }

  /* ------------------------------------------------------------------------
     Cabeçalho: fica sólido depois da abertura
     ------------------------------------------------------------------------ */
  var topo = $('[data-topo]');
  function atualizarTopo() {
    if (!topo || !chegada) return;
    var limite = chegada.offsetHeight - topo.offsetHeight - 8;
    topo.classList.toggle('is-solido', window.scrollY > limite);
  }
  var agendado = false;
  window.addEventListener('scroll', function () {
    if (agendado) return;
    agendado = true;
    requestAnimationFrame(function () { agendado = false; atualizarTopo(); });
  }, { passive: true });
  window.addEventListener('resize', atualizarTopo);
  atualizarTopo();

  /* ------------------------------------------------------------------------
     Menu móvel (dialog modal: foco contido, Esc fecha, foco volta ao botão)
     ------------------------------------------------------------------------ */
  var menu = $('#menu');
  var abrirMenu = $('[data-abrir-menu]');
  function fecharMenu() { if (menu && menu.open) menu.close(); }
  if (menu && abrirMenu && typeof menu.showModal === 'function') {
    abrirMenu.addEventListener('click', function () {
      menu.showModal();
      abrirMenu.setAttribute('aria-expanded', 'true');
    });
    $('[data-fechar-menu]', menu).addEventListener('click', fecharMenu);
    menu.addEventListener('close', function () {
      abrirMenu.setAttribute('aria-expanded', 'false');
      abrirMenu.focus();
    });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', fecharMenu); });
    abrirMenu.setAttribute('aria-expanded', 'false');
  } else if (abrirMenu) {
    abrirMenu.hidden = true;
  }

  /* ------------------------------------------------------------------------
     Galeria: anterior/próxima, contador, legenda com unidade; sem autoplay
     ------------------------------------------------------------------------ */
  var galeria = $('[data-galeria-dialog]');
  var gImg = document.createElement('img');
  if (galeria) {
    gImg.decoding = 'async';
    var gFigura = $('[data-galeria-figura]', galeria);
    gFigura.insertBefore(gImg, gFigura.firstChild);
  }
  var gLegenda = galeria && $('[data-galeria-legenda]', galeria);
  var gContador = galeria && $('[data-galeria-contador]', galeria);
  var gTitulo = galeria && $('#galeria-titulo', galeria);
  var gAtual = { fotos: [], i: 0, origem: null };

  function mostrarFoto(i) {
    var n = gAtual.fotos.length;
    gAtual.i = (i + n) % n;
    var f = gAtual.fotos[gAtual.i];
    gImg.src = f.src;
    gImg.alt = f.alt;
    gImg.width = f.w;
    gImg.height = f.h;
    gLegenda.textContent = f.legenda;
    gContador.textContent = (gAtual.i + 1) + ' / ' + n;
  }

  $$('[data-galeria]').forEach(function (btn) {
    var dados = CFG.galerias && CFG.galerias[btn.dataset.galeria];
    if (!galeria || !dados || !dados.fotos || !dados.fotos.length || typeof galeria.showModal !== 'function') {
      btn.hidden = true;
      return;
    }
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.addEventListener('click', function () {
      gAtual = { fotos: dados.fotos, i: 0, origem: btn };
      gTitulo.textContent = dados.titulo;
      mostrarFoto(0);
      galeria.showModal();
    });
  });

  if (galeria) {
    $('[data-galeria-anterior]', galeria).addEventListener('click', function () { mostrarFoto(gAtual.i - 1); });
    $('[data-galeria-proxima]', galeria).addEventListener('click', function () { mostrarFoto(gAtual.i + 1); });
    $('[data-galeria-fechar]', galeria).addEventListener('click', function () { galeria.close(); });
    galeria.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); mostrarFoto(gAtual.i - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); mostrarFoto(gAtual.i + 1); }
    });
    galeria.addEventListener('close', function () { if (gAtual.origem) gAtual.origem.focus(); });

    var x0 = null;
    galeria.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
    galeria.addEventListener('pointerup', function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 50) mostrarFoto(gAtual.i + (dx < 0 ? 1 : -1));
    });
  }

  /* ------------------------------------------------------------------------
     Dúvidas: link "Entenda a experiência" abre a pergunta das piscinas
     ------------------------------------------------------------------------ */
  function abrirFaqDoHash() {
    var alvo = location.hash && document.getElementById(location.hash.slice(1));
    if (alvo && alvo.tagName === 'DETAILS') alvo.open = true;
  }
  $$('[data-abrir-faq]').forEach(function (a) {
    a.addEventListener('click', function () {
      var alvo = document.getElementById(a.getAttribute('href').slice(1));
      if (alvo) alvo.open = true;
    });
  });
  window.addEventListener('hashchange', abrirFaqDoHash);
  abrirFaqDoHash();

  /* ------------------------------------------------------------------------
     Entradas: opacidade + 14 px, uma única vez. Nada com movimento reduzido.
     ------------------------------------------------------------------------ */
  if (!reduzido && 'IntersectionObserver' in window) {
    doc.classList.add('motion');
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visivel'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    $$('.revela').forEach(function (el) { io.observe(el); });
  }
})();
