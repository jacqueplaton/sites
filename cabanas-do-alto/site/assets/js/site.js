/* ==========================================================================
   Cabanas do Alto — comportamento do site
   JavaScript puro, sem dependências. Tudo funciona sem ele; isto só melhora.
   ========================================================================== */
(function () {
  'use strict';

  // O número vem do HTML (gerado a partir de fonte/dados.mjs).
  var WHATSAPP = document.body.getAttribute('data-whatsapp');
  var raiz = document.documentElement;
  var reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function registrar(evento, dados) {
    if (window.dataLayer && typeof window.dataLayer.push === 'function') {
      var d = { event: evento };
      for (var k in dados) d[k] = dados[k];
      window.dataLayer.push(d);
    }
  }

  // ------------------------------------------------------------------------
  // Cabeçalho: fica sólido depois do topo da página
  // ------------------------------------------------------------------------
  var topo = $('[data-topo]');
  var hero = $('[data-hero]');
  if (topo && hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      topo.classList.toggle('is-solido', !e[0].isIntersecting);
    }, { rootMargin: '-80px 0px 0px 0px' }).observe(hero);
  } else if (topo && !topo.classList.contains('topo--solido')) {
    topo.classList.add('is-solido');
  }

  // ------------------------------------------------------------------------
  // Menu móvel
  // ------------------------------------------------------------------------
  var botaoMenu = $('[data-menu-abrir]');
  var menu = $('[data-menu]');
  var fixo = $('[data-wa-fixo]');

  function fecharMenu(devolverFoco) {
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    botaoMenu.setAttribute('aria-expanded', 'false');
    $('.sr', botaoMenu).textContent = 'Abrir menu';
    topo.classList.remove('menu-aberto');
    document.body.style.overflow = '';
    if (fixo) fixo.classList.remove('is-oculto-menu');
    if (devolverFoco) botaoMenu.focus();
  }

  if (botaoMenu && menu) {
    botaoMenu.addEventListener('click', function () {
      if (!menu.hidden) return fecharMenu(false);
      menu.hidden = false;
      botaoMenu.setAttribute('aria-expanded', 'true');
      $('.sr', botaoMenu).textContent = 'Fechar menu';
      topo.classList.add('menu-aberto');
      document.body.style.overflow = 'hidden';
      if (fixo) fixo.classList.add('is-oculto-menu');
      var primeiro = $('a', menu);
      if (primeiro) primeiro.focus();
    });
    $$('[data-menu-link]', menu).forEach(function (a) {
      a.addEventListener('click', function () { fecharMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') fecharMenu(true);
    });
    window.matchMedia('(min-width: 900px)').addEventListener('change', function (m) {
      if (m.matches) fecharMenu(false);
    });
  }

  // ------------------------------------------------------------------------
  // Vídeo do topo: carrega depois da página, respeita "menos movimento",
  // economia de dados e pausa quando sai da tela.
  // ------------------------------------------------------------------------
  var video = $('[data-video]');
  var botaoPausa = $('[data-pausa]');
  if (video) {
    var conexao = navigator.connection || {};
    var economia = conexao.saveData || /(^|-)2g$/.test(conexao.effectiveType || '');
    var pausadoPeloUsuario = false;
    var carregado = false;

    var rotular = function () {
      var tocando = !video.paused;
      $('[data-pausa-texto]', botaoPausa).textContent = tocando ? 'Pausar vídeo' : 'Tocar vídeo';
      $('[data-pausa-icone]', botaoPausa).innerHTML = tocando
        ? '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M5 3v10M11 3v10" stroke="currentColor" stroke-width="1.6"/></svg>'
        : '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M5 3l8 5-8 5z" fill="currentColor"/></svg>';
    };

    var carregar = function () {
      if (carregado) return;
      carregado = true;
      var movel = window.matchMedia('(max-width: 767px) and (orientation: portrait)').matches;
      var src = movel ? video.dataset.srcMovel : video.dataset.srcDesktop;
      // H.264 em quase todos os navegadores; WebM (VP9) onde não houver.
      if (!video.canPlayType('video/mp4; codecs="avc1.640028"') && video.canPlayType('video/webm; codecs="vp9"')) {
        src = src.replace(/\.mp4$/, '.webm');
      }
      video.src = src;
      video.load();
    };

    var tocar = function () {
      carregar();
      var p = video.play();
      if (p && p.catch) p.catch(function () { rotular(); });
    };

    video.addEventListener('playing', function () {
      video.classList.add('is-tocando');
      rotular();
    });
    video.addEventListener('pause', rotular);

    if (botaoPausa) {
      botaoPausa.hidden = false;
      botaoPausa.addEventListener('click', function () {
        if (video.paused) { pausadoPeloUsuario = false; tocar(); }
        else { pausadoPeloUsuario = true; video.pause(); }
      });
    }

    var iniciar = function () {
      if (reduzMovimento.matches || economia) { rotular(); return; }
      tocar();
    };
    if (document.readyState === 'complete') setTimeout(iniciar, 150);
    else window.addEventListener('load', function () { setTimeout(iniciar, 150); });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) {
        if (!carregado || pausadoPeloUsuario) return;
        if (e[0].isIntersecting) { if (video.paused && !reduzMovimento.matches) video.play().catch(function () {}); }
        else if (!video.paused) video.pause();
      }, { threshold: 0.05 }).observe(video);
    }
  }

  // ------------------------------------------------------------------------
  // Revelação suave ao rolar
  // ------------------------------------------------------------------------
  var revelar = $$('[data-revelar]');
  if ('IntersectionObserver' in window && !reduzMovimento.matches) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visivel'); obs.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revelar.forEach(function (el) { obs.observe(el); });
  } else {
    revelar.forEach(function (el) { el.classList.add('is-visivel'); });
  }

  // ------------------------------------------------------------------------
  // "Qual cabana combina com você"
  // ------------------------------------------------------------------------
  $$('[data-escolha]').forEach(function (painel) {
    var secao = painel.closest('section') || document;
    var cartoes = $$('[data-cabana]', secao).filter(function (el) { return el.tagName === 'ARTICLE'; });
    var resultado = $('[data-resultado]', painel);
    var limpar = $('[data-limpar]', painel);
    var textoInicial = resultado.textContent;
    var estado = { hospedes: 0, banheira: false, lareira: false, ar: false, rede: false };

    function nomes(lista) {
      var n = lista.map(function (c) { return $('.cabana__nome', c).textContent.trim(); });
      if (n.length <= 1) return n.join('');
      return n.slice(0, -1).join(', ') + ' e ' + n[n.length - 1];
    }

    function aplicar() {
      var ativo = estado.hospedes || estado.banheira || estado.lareira || estado.ar || estado.rede;
      var combinam = cartoes.filter(function (c) {
        if (estado.hospedes && +c.dataset.hospedes < estado.hospedes) return false;
        if (estado.banheira && c.dataset.banheira !== '1') return false;
        if (estado.lareira && c.dataset.lareira !== '1') return false;
        if (estado.ar && c.dataset.ar !== '1') return false;
        if (estado.rede && c.dataset.rede !== '1') return false;
        return true;
      });
      cartoes.forEach(function (c) { c.classList.toggle('is-apagada', ativo && combinam.indexOf(c) === -1); });
      limpar.hidden = !ativo;
      if (!ativo) resultado.textContent = textoInicial;
      else if (!combinam.length) resultado.innerHTML = 'Nenhuma cabana reúne tudo isso. Tire um item ou <a href="https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent('Olá! Conheci as Cabanas do Alto pelo site e gostaria de ajuda para escolher uma cabana.') + '" target="_blank" rel="noopener">peça ajuda no WhatsApp</a>.';
      else if (combinam.length === cartoes.length) resultado.textContent = 'As seis cabanas combinam.';
      else resultado.innerHTML = (combinam.length === 1 ? 'Combina com você: ' : 'Combinam com você: ') + '<strong>' + nomes(combinam) + '</strong>.';
      registrar('filtro_cabanas', { resultado: combinam.length });
    }

    $$('[data-filtro]', painel).forEach(function (b) {
      b.addEventListener('click', function () {
        var f = b.dataset.filtro;
        if (f === 'hospedes') {
          var v = +b.dataset.valor;
          estado.hospedes = estado.hospedes === v ? 0 : v;
          $$('[data-filtro="hospedes"]', painel).forEach(function (o) {
            o.setAttribute('aria-pressed', String(+o.dataset.valor === estado.hospedes));
          });
        } else {
          estado[f] = !estado[f];
          b.setAttribute('aria-pressed', String(estado[f]));
        }
        aplicar();
      });
    });
    limpar.addEventListener('click', function () {
      estado = { hospedes: 0, banheira: false, lareira: false, ar: false, rede: false };
      $$('[data-filtro]', painel).forEach(function (o) { o.setAttribute('aria-pressed', 'false'); });
      aplicar();
    });
  });

  // ------------------------------------------------------------------------
  // Formulário de pré-consulta → WhatsApp
  // ------------------------------------------------------------------------
  function dataLocal(iso) {
    var p = iso.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function iso(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function br(isoTxt) {
    var p = isoTxt.split('-');
    return p[2] + '/' + p[1] + '/' + p[0];
  }

  var capacidades = {};
  $$('[data-campo-cabana] option[data-max]').forEach(function (o) { capacidades[o.value] = +o.dataset.max; });
  var sugestoes = function (n) {
    var lista = Object.keys(capacidades).filter(function (k) { return capacidades[k] >= n; });
    if (lista.length === 1) return 'a ' + lista[0];
    return lista.slice(0, -1).join(', ') + ' ou ' + lista[lista.length - 1];
  };

  $$('[data-form-reserva]').forEach(function (form) {
    var cabana = $('[data-campo-cabana]', form);
    var entrada = $('[data-campo-entrada]', form);
    var saida = $('[data-campo-saida]', form);
    var hospedes = $('[data-campo-hospedes]', form);
    var pet = $('[data-campo-pet]', form);
    var aviso = $('[data-aviso]', form);
    var resumo = $('[data-resumo]', form);

    var hoje = new Date();
    entrada.min = iso(hoje);
    saida.min = iso(new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1));

    function noites() {
      if (!entrada.value || !saida.value) return 0;
      return Math.round((dataLocal(saida.value) - dataLocal(entrada.value)) / 86400000);
    }

    function verificar(mostrar) {
      var erros = [];
      var max = capacidades[cabana.value];
      var n = +hospedes.value;
      hospedes.removeAttribute('aria-invalid');
      entrada.removeAttribute('aria-invalid');
      saida.removeAttribute('aria-invalid');
      if (max && n > max) {
        erros.push('A ' + cabana.value + ' recebe até ' + max + ' hóspedes. Para ' + n + ', veja ' + sugestoes(n) + '.');
        hospedes.setAttribute('aria-invalid', 'true');
      }
      if (mostrar && !entrada.value) { erros.push('Escolha a data de check-in.'); entrada.setAttribute('aria-invalid', 'true'); }
      if (mostrar && !saida.value) { erros.push('Escolha a data de check-out.'); saida.setAttribute('aria-invalid', 'true'); }
      if (entrada.value && saida.value && noites() < 1) {
        erros.push('O check-out precisa ser depois do check-in.');
        saida.setAttribute('aria-invalid', 'true');
      }
      if (entrada.value && dataLocal(entrada.value) < dataLocal(iso(hoje))) {
        erros.push('O check-in precisa ser a partir de hoje.');
        entrada.setAttribute('aria-invalid', 'true');
      }
      aviso.hidden = !erros.length;
      aviso.textContent = erros.join(' ');
      if (erros.length && mostrar) aviso.setAttribute('role', 'alert'); else aviso.removeAttribute('role');
      return !erros.length;
    }

    function atualizar() {
      if (entrada.value) {
        var minSaida = dataLocal(entrada.value);
        minSaida.setDate(minSaida.getDate() + 1);
        saida.min = iso(minSaida);
        if (saida.value && dataLocal(saida.value) < minSaida) saida.value = '';
      }
      var n = noites();
      var partes = [];
      if (cabana.value) partes.push(cabana.value);
      if (n > 0) partes.push(n + (n === 1 ? ' noite' : ' noites'));
      partes.push(hospedes.value + (hospedes.value === '1' ? ' hóspede' : ' hóspedes'));
      resumo.textContent = (cabana.value || n > 0) ? partes.join(' · ') : '';
      verificar(false);
    }

    [cabana, entrada, saida, hospedes].forEach(function (el) { el.addEventListener('change', atualizar); });
    atualizar();

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!verificar(true)) {
        var invalido = $('[aria-invalid="true"]', form);
        if (invalido) invalido.focus();
        return;
      }
      var linhas = [
        'Olá! Gostaria de consultar uma estadia nas Cabanas do Alto.',
        'Cabana: ' + (cabana.value || 'ainda não escolhi, gostaria de uma indicação'),
        'Check-in: ' + br(entrada.value),
        'Check-out: ' + br(saida.value),
        'Hóspedes: ' + hospedes.value,
      ];
      if (pet.checked) linhas.push('Pet: sim');
      linhas.push('Conheci vocês pelo site.');
      var url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(linhas.join('\n'));
      registrar('whatsapp_formulario', { cabana: cabana.value || 'indefinida', noites: noites(), hospedes: +hospedes.value });
      var janela = window.open(url, '_blank', 'noopener');
      if (!janela) window.location.href = url;
    });
  });

  // Botões "Consultar datas" da lista: já escolhem a cabana no formulário
  $$('[data-escolher]').forEach(function (a) {
    a.addEventListener('click', function () {
      var select = $('#reserva [data-campo-cabana]');
      if (select) {
        select.value = a.dataset.escolher;
        select.dispatchEvent(new Event('change'));
      }
      var entrada = $('#reserva [data-campo-entrada]');
      if (entrada) setTimeout(function () { entrada.focus({ preventScroll: true }); }, reduzMovimento.matches ? 0 : 600);
    });
  });

  // ------------------------------------------------------------------------
  // Botão fixo do WhatsApp: some na área de reserva (o formulário já leva
  // ao WhatsApp) para não cobrir o botão de envio.
  // ------------------------------------------------------------------------
  var reserva = $('#reserva');
  if (fixo && reserva && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      fixo.classList.toggle('is-oculto', e[0].isIntersecting);
    }, { rootMargin: '-25% 0px -25% 0px' }).observe(reserva);
  }

  // Cliques em links de WhatsApp (para medir conversão, se houver dataLayer)
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-evento]');
    if (a) registrar(a.dataset.evento, { destino: a.href.indexOf('wa.me') > -1 ? 'whatsapp' : 'site' });
  });

  // ------------------------------------------------------------------------
  // Galeria ampliada
  // ------------------------------------------------------------------------
  var dialogo = $('[data-ampliada]');
  if (dialogo && typeof dialogo.showModal === 'function') {
    var img = document.createElement('img');
    img.decoding = 'async';
    $('[data-ampliada-figura]', dialogo).insertBefore(img, $('[data-ampliada-legenda]', dialogo));
    var legenda = $('[data-ampliada-legenda]', dialogo);
    var origem = null;
    $$('[data-ampliar]').forEach(function (b) {
      b.addEventListener('click', function () {
        var miniatura = $('img', b);
        var base = miniatura.getAttribute('src').replace(/-\d+\.jpg$/, '');
        var largura = b.dataset.largura;
        var suporta = document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
        img.src = base + '-' + largura + (suporta ? '.webp' : '.jpg');
        img.alt = miniatura.alt;
        legenda.textContent = b.getAttribute('aria-label').replace(/^Ampliar: /, '');
        origem = b;
        dialogo.showModal();
      });
    });
    $('[data-fechar]', dialogo).addEventListener('click', function () { dialogo.close(); });
    dialogo.addEventListener('click', function (e) { if (e.target === dialogo || e.target.tagName === 'FIGURE') dialogo.close(); });
    dialogo.addEventListener('close', function () { if (origem) origem.focus(); });
  } else {
    $$('[data-ampliar]').forEach(function (b) { b.style.cursor = 'default'; });
  }
})();
