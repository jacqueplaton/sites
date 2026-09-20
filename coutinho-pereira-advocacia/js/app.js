/* ==========================================================================
   COUTINHO PEREIRA ADVOCACIA — comportamento do site
   --------------------------------------------------------------------------
   Este arquivo raramente precisa ser editado. Ele apenas:
     1. preenche a página com os dados de js/config.js;
     2. monta a lista de horários e calcula "aberto agora" no fuso de Natal;
     3. carrega o mapa só quando ele chega perto da tela;
     4. cuida do menu no celular e das animações de entrada.

   Se o JavaScript não carregar, a página continua completa e legível: os
   valores escritos no HTML são os mesmos que estão em js/config.js.
   ========================================================================== */
(function () {
  'use strict';

  var dados = typeof ESCRITORIO !== 'undefined' ? ESCRITORIO : null;
  if (!dados) return;

  var DIAS = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
              'Quinta-feira', 'Sexta-feira', 'Sábado'];
  var DIAS_CURTOS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

  function $(sel, raiz) { return (raiz || document).querySelector(sel); }
  function $$(sel, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(sel)); }

  /* ---- 1. Dados na página ------------------------------------------ */

  // Campos derivados, usados só na exibição.
  var derivados = {
    enderecoCurto: dados.rua + ' — ' + dados.bairro,
    enderecoLinhaCurta: dados.rua + ', ' + dados.complemento.toLowerCase(),
    enderecoBairroCidade: dados.bairro + ', ' + dados.cidade + ' - ' + dados.estado + ', ' + dados.cep
  };

  function valor(chave) {
    if (chave in derivados) return derivados[chave];
    var v = dados[chave];
    return typeof v === 'string' ? v : null;
  }

  $$('[data-dado]').forEach(function (el) {
    var v = valor(el.getAttribute('data-dado'));
    if (v) el.textContent = v;
  });

  $$('[data-href]').forEach(function (el) {
    var v = valor(el.getAttribute('data-href'));
    if (v) el.setAttribute('href', v);
  });

  // E-mail: o bloco só aparece quando o endereço for preenchido no config.
  if (dados.email) {
    var blocoEmail = $('#bloco-email');
    var linkEmail = $('#link-email');
    if (blocoEmail && linkEmail) {
      linkEmail.href = 'mailto:' + dados.email;
      linkEmail.textContent = dados.email;
      blocoEmail.hidden = false;
    }
  }

  // Nota do Google: some por completo se mostrarNota for false ou nota for null.
  var blocoNota = $('#bloco-nota');
  if (blocoNota && dados.mostrarNota && typeof dados.nota === 'number') {
    var valorNota = $('#nota-valor');
    if (valorNota) valorNota.textContent = dados.nota.toFixed(1).replace('.', ',');
    var qtd = $('#nota-quantidade');
    if (qtd && typeof dados.avaliacoes === 'number') {
      qtd.textContent = dados.avaliacoes + (dados.avaliacoes === 1 ? ' avaliação' : ' avaliações');
    }
    blocoNota.hidden = false;
  }

  var ano = $('#ano');
  if (ano) ano.textContent = String(new Date().getFullYear());

  /* ---- 2. Horário e situação (no fuso do escritório) ---------------- */

  // Devolve { dia: 0-6, minutos: minutos desde a meia-noite } em Natal.
  function agoraNoEscritorio() {
    var fmt;
    try {
      fmt = new Intl.DateTimeFormat('en-US', {
        timeZone: dados.fuso, weekday: 'short', hour: '2-digit',
        minute: '2-digit', hour12: false
      });
    } catch (e) {
      fmt = null;                       // fuso desconhecido: usa a hora local
    }
    if (!fmt) {
      var local = new Date();
      return { dia: local.getDay(), minutos: local.getHours() * 60 + local.getMinutes() };
    }
    var partes = {};
    fmt.formatToParts(new Date()).forEach(function (p) { partes[p.type] = p.value; });
    var mapa = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    var hora = parseInt(partes.hour, 10) % 24;      // "24:10" vira 0:10
    return {
      dia: mapa[partes.weekday],
      minutos: hora * 60 + parseInt(partes.minute, 10)
    };
  }

  function faixaDoDia(dia) {
    for (var i = 0; i < dados.horario.length; i++) {
      if (dados.horario[i].dias.indexOf(dia) !== -1) return dados.horario[i];
    }
    return null;
  }

  function paraMinutos(hhmm) {
    var p = hhmm.split(':');
    return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
  }

  // "08:00" → "8h", "18:30" → "18h30"
  function humano(hhmm) {
    var p = hhmm.split(':');
    var h = parseInt(p[0], 10);
    return p[1] === '00' ? h + 'h' : h + 'h' + p[1];
  }

  function textoDaFaixa(faixa) {
    return faixa && faixa.abre ? humano(faixa.abre) + ' às ' + humano(faixa.fecha) : 'Fechado';
  }

  // Lista de horários, com o dia de hoje destacado.
  function montarHorario(hoje) {
    var lista = $('#horario');
    if (!lista) return;
    var ordem = [1, 2, 3, 4, 5, 6, 0];          // começa na segunda-feira
    lista.innerHTML = '';
    ordem.forEach(function (dia) {
      var faixa = faixaDoDia(dia);
      var li = document.createElement('li');
      if (dia === hoje) li.setAttribute('data-hoje', 'sim');
      var nome = document.createElement('span');
      nome.className = 'horario__dia';
      nome.textContent = DIAS[dia];
      var hora = document.createElement('span');
      hora.className = 'horario__hora';
      hora.textContent = textoDaFaixa(faixa);
      li.appendChild(nome);
      li.appendChild(hora);
      lista.appendChild(li);
    });
  }

  // Selo "aberto agora" / "fechado".
  function montarSituacao(agora) {
    var selo = $('#situacao');
    var texto = $('#situacao-texto');
    if (!selo || !texto) return;

    var faixa = faixaDoDia(agora.dia);
    var aberto = false;
    var frase;

    if (faixa && faixa.abre) {
      var abre = paraMinutos(faixa.abre);
      var fecha = paraMinutos(faixa.fecha);
      if (agora.minutos >= abre && agora.minutos < fecha) {
        aberto = true;
        frase = 'Aberto agora · fecha às ' + humano(faixa.fecha);
      } else if (agora.minutos < abre) {
        frase = 'Fechado · abre hoje às ' + humano(faixa.abre);
      }
    }

    if (!frase) {
      // Procura o próximo dia com atendimento (no máximo uma volta completa).
      for (var i = 1; i <= 7; i++) {
        var dia = (agora.dia + i) % 7;
        var prox = faixaDoDia(dia);
        if (prox && prox.abre) {
          frase = 'Fechado · abre ' + (i === 1 ? 'amanhã' : DIAS_CURTOS[dia]) +
                  ' às ' + humano(prox.abre);
          break;
        }
      }
    }

    texto.textContent = frase || 'Consulte o horário de atendimento';
    selo.setAttribute('data-aberto', aberto ? 'sim' : 'nao');
    selo.hidden = false;
  }

  if (Array.isArray(dados.horario) && dados.horario.length) {
    var agora = agoraNoEscritorio();
    montarHorario(agora.dia);
    montarSituacao(agora);
    // Reavalia de minuto em minuto: uma aba aberta o dia todo não mente.
    setInterval(function () { montarSituacao(agoraNoEscritorio()); }, 60000);
  }

  /* ---- 3. Mapa sob demanda ------------------------------------------ */
  var mapa = $('[data-mapa]');
  if (mapa) {
    var carregarMapa = function () {
      if (mapa.getAttribute('src') === dados.mapsEmbed) return;
      mapa.setAttribute('src', dados.mapsEmbed);
    };
    if ('IntersectionObserver' in window) {
      var obsMapa = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          if (e.isIntersecting) { carregarMapa(); obsMapa.disconnect(); }
        });
      }, { rootMargin: '400px' });
      obsMapa.observe(mapa);
    } else {
      carregarMapa();
    }
  }

  /* ---- 4. Cabeçalho, menu e rolagem --------------------------------- */
  var topo = $('#topo');
  var alternaTopo = function () {
    if (topo) topo.classList.toggle('topo--preso', window.scrollY > 40);
  };
  alternaTopo();
  window.addEventListener('scroll', alternaTopo, { passive: true });

  var botao = $('#abrir-menu');
  var menu = $('#menu');
  if (botao && menu) {
    var fechar = function () {
      menu.removeAttribute('data-aberto');
      botao.setAttribute('aria-expanded', 'false');
      botao.textContent = 'Menu';
    };
    botao.addEventListener('click', function () {
      var aberto = menu.getAttribute('data-aberto') === 'sim';
      if (aberto) { fechar(); return; }
      menu.setAttribute('data-aberto', 'sim');
      botao.setAttribute('aria-expanded', 'true');
      botao.textContent = 'Fechar';
    });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', fechar); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') fechar();
    });
  }

  /* ---- 5. Animações de entrada -------------------------------------- */
  var alvos = $$('.revelar');
  var semMovimento = window.matchMedia &&
                     window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!alvos.length) return;
  if (semMovimento || !('IntersectionObserver' in window)) {
    alvos.forEach(function (el) { el.classList.add('aparece'); });
    return;
  }

  var obs = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('aparece');
      obs.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  alvos.forEach(function (el) { obs.observe(el); });
})();
