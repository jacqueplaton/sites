/* ==========================================================================
   Alto de Santa Bárbara — comportamento da página
   Tudo aqui é melhoria progressiva: sem JavaScript o conteúdo continua
   visível, os links de WhatsApp funcionam e as fotos abrem como arquivo.
   ========================================================================== */
(function () {
  'use strict';

  var raiz = document.documentElement;
  var config = window.ALTO_CONFIG || {};
  var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var temDialog = typeof HTMLDialogElement === 'function' &&
    typeof document.createElement('dialog').showModal === 'function';

  /* ---------------------------------------------------------------------
     Medição opcional. Só registra se a página já tiver um dataLayer
     (ex.: Google Tag Manager instalado depois). Clique não é mensagem
     enviada nem reserva. Nenhum dado pessoal ou texto de mensagem sai daqui.
     --------------------------------------------------------------------- */
  function registrar(evento, dados) {
    if (!Array.isArray(window.dataLayer)) return;
    var item = { event: evento };
    Object.keys(dados || {}).forEach(function (chave) { item[chave] = dados[chave]; });
    window.dataLayer.push(item);
  }

  document.addEventListener('click', function (evento) {
    var link = evento.target.closest && evento.target.closest('a[data-wa]');
    if (link) registrar('whatsapp_clique', { posicao: link.getAttribute('data-wa') });
  });

  /* --- Cabeçalho: linha inferior depois de rolar ----------------------- */
  var topo = document.getElementById('topo');
  function atualizarTopo() {
    topo.classList.toggle('rolou', window.scrollY > 8);
  }
  window.addEventListener('scroll', atualizarTopo, { passive: true });
  atualizarTopo();

  /* --- Botão flutuante: some sobre o formulário, o rodapé e os modais -- */
  var flutuante = document.querySelector('.whatsapp-flutuante');
  var motivosOcultar = {};
  function ocultarFlutuante(motivo, ocultar) {
    if (!flutuante) return;
    if (ocultar) motivosOcultar[motivo] = true;
    else delete motivosOcultar[motivo];
    flutuante.classList.toggle('oculto', Object.keys(motivosOcultar).length > 0);
  }
  if (flutuante && 'IntersectionObserver' in window) {
    var areasSemFlutuante = [document.getElementById('consulta'), document.querySelector('.rodape')];
    var observadorFlutuante = new IntersectionObserver(function (itens) {
      itens.forEach(function (item) {
        ocultarFlutuante('area-' + item.target.className, item.isIntersecting);
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    areasSemFlutuante.forEach(function (area) { if (area) observadorFlutuante.observe(area); });
  }

  /* --- Menu móvel ------------------------------------------------------ */
  var menu = document.getElementById('menu');
  var abrirMenu = document.querySelector('.menu-abrir');
  if (menu && abrirMenu && temDialog) {
    abrirMenu.hidden = false;
    abrirMenu.setAttribute('aria-expanded', 'false');

    abrirMenu.addEventListener('click', function () {
      menu.showModal();
      abrirMenu.setAttribute('aria-expanded', 'true');
      ocultarFlutuante('menu', true);
    });
    menu.querySelector('.menu-fechar').addEventListener('click', function () {
      menu.close();
    });
    // Links internos: fecha o menu e deixa o navegador seguir para a âncora.
    menu.addEventListener('click', function (evento) {
      if (evento.target.closest('a')) menu.close();
    });
    menu.addEventListener('close', function () {
      abrirMenu.setAttribute('aria-expanded', 'false');
      ocultarFlutuante('menu', false);
    });
    // Ao crescer para desktop com o menu aberto, fecha.
    window.matchMedia('(min-width: 1024px)').addEventListener('change', function (mq) {
      if (mq.matches && menu.open) menu.close();
    });
  }

  /* --- Galeria de fotos (dialog) -------------------------------------- */
  var galeria = document.getElementById('galeria');
  if (galeria && temDialog) {
    var grupos = {};
    var area = galeria.querySelector('.galeria-imagem');
    var legenda = galeria.querySelector('.galeria-legenda');
    var contador = galeria.querySelector('.galeria-contador');
    var atual = { grupo: null, indice: 0, origem: null };

    document.querySelectorAll('a[data-galeria]').forEach(function (link) {
      var nome = link.getAttribute('data-galeria');
      (grupos[nome] = grupos[nome] || []).push(link);
      link.addEventListener('click', function (evento) {
        evento.preventDefault();
        abrirGaleria(nome, grupos[nome].indexOf(link), link);
      });
    });

    document.querySelectorAll('[data-abre-galeria]').forEach(function (botao) {
      var nome = botao.getAttribute('data-abre-galeria');
      if (!grupos[nome]) return;
      botao.textContent = 'Ver as ' + grupos[nome].length + ' fotos';
      botao.hidden = false;
      botao.addEventListener('click', function () { abrirGaleria(nome, 0, botao); });
    });

    function textoLegenda(link) {
      var span = link.querySelector('.legenda');
      if (span) return span.textContent.trim();
      var figura = link.closest('figure');
      var cap = figura && figura.querySelector('figcaption');
      return cap ? cap.textContent.trim() : '';
    }

    function mostrar() {
      var itens = grupos[atual.grupo];
      var link = itens[atual.indice];
      var foto = link.querySelector('picture').cloneNode(true);
      var img = foto.querySelector('img');
      var vertical = Number(img.getAttribute('height')) > Number(img.getAttribute('width'));
      // Tamanho exibido na galeria: o navegador escolhe a versão adequada do srcset.
      var tamanho = vertical ? 'min(100vw, 75vh)' : 'min(100vw, 1440px)';
      foto.querySelectorAll('source').forEach(function (fonte) { fonte.setAttribute('sizes', tamanho); });
      img.removeAttribute('loading');
      img.removeAttribute('fetchpriority');
      area.replaceChildren(foto);
      legenda.textContent = textoLegenda(link);
      contador.textContent = (atual.indice + 1) + ' de ' + itens.length;
    }

    function abrirGaleria(nome, indice, origem) {
      atual = { grupo: nome, indice: Math.max(0, indice), origem: origem };
      mostrar();
      galeria.showModal();
      ocultarFlutuante('galeria', true);
    }

    function passar(direcao) {
      var total = grupos[atual.grupo].length;
      atual.indice = (atual.indice + direcao + total) % total;
      mostrar();
    }

    galeria.querySelector('.galeria-fechar').addEventListener('click', function () { galeria.close(); });
    galeria.querySelector('.galeria-anterior').addEventListener('click', function () { passar(-1); });
    galeria.querySelector('.galeria-proxima').addEventListener('click', function () { passar(1); });
    galeria.addEventListener('keydown', function (evento) {
      if (evento.key === 'ArrowLeft') { evento.preventDefault(); passar(-1); }
      if (evento.key === 'ArrowRight') { evento.preventDefault(); passar(1); }
    });
    galeria.addEventListener('close', function () {
      ocultarFlutuante('galeria', false);
      area.replaceChildren();
      if (atual.origem) atual.origem.focus();
    });

    // Deslizar no celular
    var inicioX = null;
    var inicioY = null;
    area.addEventListener('pointerdown', function (evento) {
      inicioX = evento.clientX;
      inicioY = evento.clientY;
    });
    area.addEventListener('pointerup', function (evento) {
      if (inicioX === null) return;
      var dx = evento.clientX - inicioX;
      var dy = evento.clientY - inicioY;
      inicioX = null;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) passar(dx < 0 ? 1 : -1);
    });
  }

  /* --- Consulta de datas ---------------------------------------------- */
  var formulario = document.getElementById('formulario');
  if (formulario && config.whatsapp && config.mensagens) {
    formulario.hidden = false;
    var entrada = formulario.elements.entrada;
    var saida = formulario.elements.saida;
    var hospedes = formulario.elements.hospedes;
    var status = formulario.querySelector('.formulario-status');

    var doisDigitos = function (n) { return (n < 10 ? '0' : '') + n; };
    // Datas sempre no calendário local, nunca via UTC.
    var paraISO = function (d) {
      return d.getFullYear() + '-' + doisDigitos(d.getMonth() + 1) + '-' + doisDigitos(d.getDate());
    };
    var paraBR = function (d) {
      return doisDigitos(d.getDate()) + '/' + doisDigitos(d.getMonth() + 1) + '/' + d.getFullYear();
    };
    var hoje = function () {
      var agora = new Date();
      return new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
    };
    var somarDias = function (d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); };
    var lerData = function (valor) {
      var partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor || '');
      if (!partes) return null;
      var d = new Date(Number(partes[1]), Number(partes[2]) - 1, Number(partes[3]));
      return d.getMonth() === Number(partes[2]) - 1 ? d : null;
    };

    var atualizarLimites = function () {
      entrada.min = paraISO(hoje());
      var dataEntrada = lerData(entrada.value);
      saida.min = paraISO(somarDias(dataEntrada || hoje(), 1));
    };

    var mostrarErro = function (campo, mensagem) {
      var alvo = document.getElementById(campo.id + '-erro');
      alvo.textContent = mensagem;
      alvo.hidden = false;
      campo.setAttribute('aria-invalid', 'true');
    };
    var limparErro = function (campo) {
      var alvo = document.getElementById(campo.id + '-erro');
      alvo.textContent = '';
      alvo.hidden = true;
      campo.removeAttribute('aria-invalid');
    };

    atualizarLimites();
    entrada.addEventListener('focus', atualizarLimites);
    entrada.addEventListener('change', function () { atualizarLimites(); limparErro(entrada); });
    saida.addEventListener('change', function () { limparErro(saida); });

    formulario.addEventListener('submit', function (evento) {
      evento.preventDefault();
      atualizarLimites();
      limparErro(entrada);
      limparErro(saida);
      status.replaceChildren();

      var dataEntrada = lerData(entrada.value);
      var dataSaida = lerData(saida.value);
      var problemas = [];
      var entradaIncompleta = (entrada.validity && entrada.validity.badInput) || (entrada.value && !dataEntrada);
      var saidaIncompleta = (saida.validity && saida.validity.badInput) || (saida.value && !dataSaida);

      if (entradaIncompleta) problemas.push([entrada, 'Confira a data de entrada.']);
      else if (dataEntrada && dataEntrada < hoje()) problemas.push([entrada, 'Escolha uma entrada a partir de hoje.']);
      else if (!dataEntrada && dataSaida) problemas.push([entrada, 'Informe também a data de entrada.']);

      if (saidaIncompleta) problemas.push([saida, 'Confira a data de saída.']);
      else if (dataEntrada && !dataSaida) problemas.push([saida, 'Informe também a data de saída.']);
      else if (dataEntrada && dataSaida && dataSaida <= dataEntrada) problemas.push([saida, 'A saída precisa ser depois da entrada.']);

      if (problemas.length) {
        problemas.forEach(function (p) { mostrarErro(p[0], p[1]); });
        problemas[0][0].focus();
        return;
      }

      var escolhido = formulario.querySelector('input[name="chale"]:checked');
      var chale = escolhido ? escolhido.value : '';
      var texto = chale === '1' ? config.mensagens.chale1
        : chale === '2' ? config.mensagens.chale2
          : config.mensagens.geral;

      var linhas = [];
      if (dataEntrada && dataSaida) {
        var noites = Math.round((dataSaida - dataEntrada) / 86400000);
        linhas.push('Entrada: ' + paraBR(dataEntrada));
        linhas.push('Saída: ' + paraBR(dataSaida) + ' (' + noites + (noites === 1 ? ' noite)' : ' noites)'));
      }
      if (hospedes.value) linhas.push('Hóspedes: ' + hospedes.value);
      if (linhas.length) texto += '\n\n' + linhas.join('\n');

      var url = 'https://wa.me/' + config.whatsapp + '?text=' + encodeURIComponent(texto);

      registrar('consulta_whatsapp', {
        chale: chale || 'nao_decidiu',
        com_datas: Boolean(dataEntrada && dataSaida),
        com_hospedes: Boolean(hospedes.value)
      });

      var janela = window.open(url, '_blank');
      if (janela) {
        try { janela.opener = null; } catch (erro) { /* ignorado */ }
      }

      var link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.setAttribute('data-wa', 'consulta-reabrir');
      link.textContent = 'abra a conversa por aqui';
      status.append('Sua mensagem está pronta no WhatsApp. Se ele não abriu, ', link, '. A disponibilidade e os valores são confirmados na conversa.');
    });
  }

  /* --- Revelação ao rolar (uma vez, 16 px, ~550 ms) -------------------- */
  if (!semMovimento && 'IntersectionObserver' in window) {
    var alvos = Array.prototype.slice.call(document.querySelectorAll('.revela, .revela-foto'));
    var alturaTela = window.innerHeight;

    // O que já está na tela fica visível desde o início, sem piscar.
    alvos.forEach(function (el) {
      var caixa = el.getBoundingClientRect();
      if (caixa.top < alturaTela && caixa.bottom > 0) el.classList.add('visivel');
    });

    // Pequeno escalonamento entre itens do mesmo bloco.
    var porPai = new Map();
    alvos.forEach(function (el) {
      if (el.classList.contains('visivel')) return;
      var n = porPai.get(el.parentNode) || 0;
      el.style.transitionDelay = Math.min(n * 90, 270) + 'ms';
      porPai.set(el.parentNode, n + 1);
    });

    raiz.classList.add('anima');

    var observador = new IntersectionObserver(function (itens) {
      itens.forEach(function (item) {
        if (!item.isIntersecting) return;
        item.target.classList.add('visivel');
        observador.unobserve(item.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });

    alvos.forEach(function (el) {
      if (!el.classList.contains('visivel')) observador.observe(el);
    });
  }
})();
