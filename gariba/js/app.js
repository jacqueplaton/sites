/* ==========================================================================
   ESPAÇO GARIBA — lógica do site
   --------------------------------------------------------------------------
   JavaScript puro, sem dependência nenhuma. Lê tudo de js/config.js.
   Raramente precisa ser editado: para mudar textos, fotos ou contatos,
   abra js/config.js.

   Ordem do arquivo:
     1. Atalhos               6. Galeria e lightbox
     2. Fotos com reserva     7. Reserva: formulário → WhatsApp
     3. Links e contatos      8. Rodapé e botão flutuante
     4. Navegação             9. Partida
     5. Hero e revelações
   ========================================================================== */

(function () {
  'use strict';

  /* ======================================================================
     1. ATALHOS
     ====================================================================== */

  const $  = (sel, raiz) => (raiz || document).querySelector(sel);
  const $$ = (sel, raiz) => Array.from((raiz || document).querySelectorAll(sel));

  const criar = (tag, props) => Object.assign(document.createElement(tag), props || {});

  /* Esta classe liga as animações. Sem JS, o conteúdo aparece normalmente. */
  document.documentElement.classList.add('js');

  const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Ícones de linha, desenhados aqui para não depender de fonte de ícones. */
  const ICONES = {
    /* banheira de hidromassagem ao ar livre */
    banheira: '<path d="M3 12h18v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3Z"/><path d="M6 12V6a2 2 0 0 1 2-2h1"/><path d="M14 7h4"/><path d="M6 19v2M18 19v2"/>',
    /* lareira: boca em arco, fogo dentro, base de alvenaria */
    lareira:  '<path d="M3 4h18v16"/><path d="M3 4v16"/><path d="M2 20h20"/><path d="M7 20v-5.5a5 5 0 0 1 10 0V20"/><path d="M12 17.5c-1.1 0-1.9-.8-1.9-1.8 0-1.3 1.9-2.3 1.9-3.7.9.9 1.9 2 1.9 3.7 0 1-.8 1.8-1.9 1.8Z"/>',
    /* fire pit: chama sobre as achas cruzadas */
    fogo:     '<path d="M12 2.5c2.6 3.3 1.2 5.6 1.2 5.6s2-.6 2.7 2c.9 3.1-1.6 5.4-3.9 5.4s-4.8-2.3-3.9-5.4c.7-2.6 2.7-2 2.7-2S9.4 5.8 12 2.5Z"/><path d="M3.5 19.5 20.5 16M20.5 19.5 3.5 16"/>',
    /* claraboia: vidro no teto, estrelas atravessando */
    estrela:  '<rect x="3" y="4.5" width="18" height="15" rx="1.5"/><path d="M12 4.5v15M3 12h18"/><path d="M7.4 7.6l.4 1 1 .4-1 .4-.4 1-.4-1-1-.4 1-.4Z"/><path d="M16.4 14.6l.4 1 1 .4-1 .4-.4 1-.4-1-1-.4 1-.4Z"/>',
    /* cesta de cafe da manha na porta */
    cafe:     '<path d="M4 8h12v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Z"/><path d="M16 9h2a2 2 0 0 1 0 4h-2"/><path d="M3 21h14"/><path d="M8 5c0-1 1-1 1-2M12 5c0-1 1-1 1-2"/>',
    /* lago e mata: pinheiro refletido na agua */
    lago:     '<path d="M12 3 8.6 9.3h6.8L12 3Z"/><path d="M12 7.4 7.4 14.5h9.2L12 7.4Z"/><path d="M11.1 14.5h1.8v2.2h-1.8Z"/><path d="M3 19c2-1.4 3.5-1.4 5.5 0s3.5 1.4 5.5 0 3.5-1.4 5.5 0"/><path d="M3 22c2-1.4 3.5-1.4 5.5 0s3.5 1.4 5.5 0 3.5-1.4 5.5 0"/>',
    folha:    '<path d="M4 20C4 11 11 4 20 4c0 9-7 16-16 16Z"/><path d="M4 20 14 10"/>'
  };

  const icone = (nome, tamanho) =>
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' +
    (tamanho ? ' width="' + tamanho + '" height="' + tamanho + '"' : '') + '>' +
    (ICONES[nome] || ICONES.folha) + '</svg>';

  /* ======================================================================
     2. FOTOS COM RESERVA DE LUGAR
     ----------------------------------------------------------------------
     Toda foto do site passa por aqui. Se o arquivo existir na pasta
     media/, ele aparece. Se ainda não existir, o lugar fica reservado
     com uma moldura que diz qual arquivo falta — nada de ícone de imagem
     rompida e nada de foto genérica de banco de imagens no lugar da real.
     ====================================================================== */

  function montarFoto(dados, opcoes) {
    const o = opcoes || {};
    const caixa = criar(o.botao ? 'button' : 'figure', { className: 'foto' });
    if (o.botao) { caixa.type = 'button'; }
    caixa.style.margin = '0';

    const img = criar('img', {
      alt: dados.alt || '',
      loading: o.prioridade ? 'eager' : 'lazy',
      decoding: 'async'
    });
    if (o.prioridade) { img.setAttribute('fetchpriority', 'high'); }
    img.src = dados.src;

    /* O arquivo não está lá (ou não carregou): reserva o lugar. */
    img.addEventListener('error', function () {
      caixa.classList.add('foto--pendente');
      if (o.botao) { caixa.disabled = true; }
      const nomeArquivo = dados.src.split('/').pop();
      caixa.insertAdjacentHTML('beforeend',
        '<figcaption class="pendente-selo">' + icone('folha') +
        '<b>' + (dados.alt || 'Foto do Espaço Gariba') + '</b>' +
        '<small>aguardando ' + nomeArquivo + '</small></figcaption>');
    });

    caixa.appendChild(img);
    return caixa;
  }

  /* ======================================================================
     3. LINKS E CONTATOS — tudo sai do config.js
     ====================================================================== */

  function linkZap(texto) {
    return 'https://wa.me/' + SITE.whatsappNumero +
           (texto ? '?text=' + encodeURIComponent(texto) : '');
  }

  const linkMapa =
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent(SITE.rua + ', ' + SITE.cidade + ' - ' + SITE.estado + ', ' + SITE.cep);

  function ligarContatos() {
    const zapPadrao = linkZap(
      'Olá! Vim pelo site do ' + SITE.nome + ' e gostaria de informações sobre as cabanas.'
    );

    $$('[data-link]').forEach((el) => {
      const destinos = {
        zap:        zapPadrao,
        cloudbeds:  SITE.cloudbeds,
        instagram:  SITE.instagram,
        email:      'mailto:' + SITE.email,
        mapa:       linkMapa
      };
      const url = destinos[el.dataset.link];
      if (!url) { return; }
      el.href = url;
      if (el.dataset.link !== 'email') {
        el.target = '_blank';
        el.rel = 'noopener noreferrer';
      }
    });

    /* Textos simples vindos do config */
    $$('[data-texto]').forEach((el) => {
      const valores = {
        nome:        SITE.nome,
        whatsapp:    SITE.whatsappExibir,
        email:       SITE.email,
        endereco:    SITE.enderecoCompleto,
        cidade:      SITE.cidade + '/' + SITE.estado,
        checkin:     SITE.checkin,
        checkout:    SITE.checkout,
        horarios:    'Entrada a partir das ' + SITE.checkin + ' · saída até ' + SITE.checkout,
        hospedes:    'Até ' + SITE.hospedesMax + ' pessoas por cabana',
        pets:        SITE.pets,
        ano:         String(new Date().getFullYear())
      };
      if (valores[el.dataset.texto] != null) {
        el.textContent = valores[el.dataset.texto];
      }
    });
  }

  /* ======================================================================
     4. NAVEGAÇÃO
     ====================================================================== */

  function ligarNavegacao() {
    const topo = $('.topo');
    const menu = $('.menu');
    const botao = $('.hamburguer');
    if (!topo) { return; }

    /* Véu do topo ao sair do hero */
    let ultimo = -1;
    const aoRolar = () => {
      const y = window.scrollY;
      const rolado = y > 60;
      if (rolado !== (ultimo === 1)) {
        topo.classList.toggle('rolado', rolado);
        ultimo = rolado ? 1 : 0;
      }
      const zap = $('.zap');
      if (zap) { zap.classList.toggle('aparece', y > window.innerHeight * 0.5); }
    };
    window.addEventListener('scroll', aoRolar, { passive: true });
    aoRolar();

    /* Menu no celular */
    if (botao && menu) {
      const fechar = () => {
        menu.classList.remove('aberto');
        botao.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('travado');
      };
      botao.addEventListener('click', () => {
        const aberto = menu.classList.toggle('aberto');
        botao.setAttribute('aria-expanded', String(aberto));
        document.body.classList.toggle('travado', aberto);
      });
      menu.addEventListener('click', (e) => {
        if (e.target.closest('a')) { fechar(); }
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { fechar(); }
      });
    }

    /* Marca no menu a seção que está na tela */
    const secoes = $$('main section[id]');
    const itens = $$('.menu a[href^="#"]');
    if (!secoes.length || !itens.length || !('IntersectionObserver' in window)) { return; }

    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) { return; }
        itens.forEach((a) => {
          a.classList.toggle('ativo', a.getAttribute('href') === '#' + e.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    secoes.forEach((s) => observador.observe(s));
  }

  /* ======================================================================
     5. HERO E REVELAÇÕES
     ====================================================================== */

  /* Parallax: cada camada da paisagem anda numa velocidade diferente.
     Usa requestAnimationFrame para não travar o scroll. */
  function ligarParallax() {
    if (semMovimento) { return; }
    const camadas = $$('.hero-cena .camada');
    const hero = $('.hero');
    if (!camadas.length || !hero) { return; }

    let pedido = false;
    const mover = () => {
      pedido = false;
      const y = window.scrollY;
      if (y > hero.offsetHeight) { return; }     /* fora da tela: nem calcula */
      camadas.forEach((c) => {
        const fator = parseFloat(c.dataset.velocidade || '0');
        c.style.transform = 'translate3d(0,' + (y * fator).toFixed(1) + 'px,0)';
      });
    };
    window.addEventListener('scroll', () => {
      if (!pedido) { pedido = true; requestAnimationFrame(mover); }
    }, { passive: true });
  }

  /* Revelar ao rolar, com entrada em cascata dentro de cada grupo */
  let observadorRevelar = null;

  function iniciarRevelar() {
    if (!('IntersectionObserver' in window)) {
      $$('.revelar').forEach((el) => el.classList.add('visivel'));
      return;
    }
    observadorRevelar = new IntersectionObserver((entradas, obs) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) { return; }
        e.target.classList.add('visivel');
        obs.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    observar();
  }

  function observar() {
    if (!observadorRevelar) { return; }
    $$('.revelar:not(.visivel)').forEach((el) => observadorRevelar.observe(el));
  }

  /* Numera os filhos de um grupo para a entrada em cascata */
  function cascata(pai, seletor) {
    $$(seletor, pai).forEach((el, i) => {
      el.classList.add('revelar');
      el.style.setProperty('--i', String(i));
    });
  }

  /* ======================================================================
     6. SEÇÕES MONTADAS A PARTIR DO CONFIG
     ====================================================================== */

  function renderFatos() {
    const alvo = $('#fatos-lista');
    if (!alvo) { return; }
    const fatos = [
      ['02', 'cabanas independentes'],
      [String(SITE.hospedesMax).padStart(2, '0'), 'hóspedes por cabana'],
      [SITE.checkin + ' / ' + SITE.checkout, 'entrada e saída'],
      ['∞', 'silêncio da mata']
    ];
    alvo.innerHTML = fatos
      .map(([b, s]) => '<li><b>' + b + '</b><span>' + s + '</span></li>')
      .join('');
    cascata(alvo, 'li');
  }

  function renderCabanas() {
    const alvo = $('#cabanas-lista');
    if (!alvo) { return; }

    CABANAS.forEach((cab, indice) => {
      const bloco = criar('article', {
        className: 'cabana revelar' + (indice % 2 ? ' cabana--inverso' : ''),
        id: 'cabana-' + cab.id
      });

      const fotos = criar('div', { className: 'cabana-fotos' });
      cab.fotos.forEach((src, i) => {
        fotos.appendChild(montarFoto(
          { src: src, alt: cab.nome + ' — foto ' + (i + 1) },
          { prioridade: indice === 0 && i === 0 }
        ));
      });

      const corpo = criar('div', { className: 'cabana-corpo' });
      corpo.innerHTML =
        '<p class="sobre-titulo">Cabana ' + String(indice + 1).padStart(2, '0') +
          ' de ' + String(CABANAS.length).padStart(2, '0') + '</p>' +
        '<h3>' + cab.nome + '</h3>' +
        '<p class="cabana-tagline">' + cab.tagline + '</p>' +
        '<p>' + cab.texto + '</p>' +
        '<ul class="cabana-itens">' +
          cab.itens.map((it) => '<li>' + it + '</li>').join('') +
        '</ul>' +
        '<div class="cabana-acoes">' +
          '<a class="btn" href="#reserva" data-cabana="' + cab.nome + '">' +
            'Consultar datas</a>' +
          '<a class="btn btn--contorno" data-link="cloudbeds">Ver no Cloudbeds</a>' +
        '</div>';

      bloco.append(fotos, corpo);
      alvo.appendChild(bloco);
    });

    /* Clicar em "Consultar datas" já escolhe a cabana no formulário */
    alvo.addEventListener('click', (e) => {
      const gatilho = e.target.closest('[data-cabana]');
      if (!gatilho) { return; }
      const sel = $('#f-cabana');
      if (sel) { sel.value = gatilho.dataset.cabana; atualizarResumo(); }
    });
  }

  function renderExperiencias() {
    const alvo = $('#experiencias-lista');
    if (!alvo) { return; }
    alvo.innerHTML = EXPERIENCIAS
      .map((x) =>
        '<li>' + icone(x.icone) +
        '<h3>' + x.titulo + '</h3>' +
        '<p>' + x.texto + '</p></li>')
      .join('');
    cascata(alvo, 'li');
  }

  function renderArredores() {
    const alvo = $('#arredores-lista');
    if (!alvo) { return; }
    alvo.innerHTML = ARREDORES
      .map((x) => '<li><h3>' + x.titulo + '</h3><p>' + x.texto + '</p></li>')
      .join('');
    cascata(alvo, 'li');
  }

  /* ======================================================================
     7. GALERIA E LIGHTBOX
     ====================================================================== */

  let galeriaVisivel = [];   /* só as fotos que realmente carregaram */
  let indiceAtual = 0;

  function renderGaleria() {
    const alvo = $('#galeria-grade');
    if (!alvo) { return; }

    GALERIA.forEach((foto) => {
      const botao = montarFoto(foto, { botao: true });
      botao.addEventListener('click', () => {
        const i = galeriaVisivel.indexOf(foto);
        if (i >= 0) { abrirLightbox(i); }
      });
      /* Entra na lista do lightbox só quando a imagem carrega de verdade */
      const img = $('img', botao);
      img.addEventListener('load', () => {
        if (!galeriaVisivel.includes(foto)) { galeriaVisivel.push(foto); }
      });
      alvo.appendChild(botao);
    });
    cascata(alvo, '.foto');
  }

  function abrirLightbox(i) {
    const lb = $('#lightbox');
    if (!lb || !galeriaVisivel.length) { return; }
    indiceAtual = i;
    mostrarFoto();
    lb.classList.add('aberto');
    lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('travado');
    $('.lb-fechar', lb).focus();
  }

  function mostrarFoto() {
    const foto = galeriaVisivel[indiceAtual];
    if (!foto) { return; }
    const img = $('#lightbox-img');
    img.src = foto.src;
    img.alt = foto.alt;
    $('#lightbox-legenda').textContent = foto.alt;
    const unica = galeriaVisivel.length < 2;
    $('.lb-ant').hidden = unica;
    $('.lb-prox').hidden = unica;
  }

  function fecharLightbox() {
    const lb = $('#lightbox');
    lb.classList.remove('aberto');
    lb.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('travado');
  }

  function navegar(passo) {
    const n = galeriaVisivel.length;
    if (!n) { return; }
    indiceAtual = (indiceAtual + passo + n) % n;
    mostrarFoto();
  }

  function ligarLightbox() {
    const lb = $('#lightbox');
    if (!lb) { return; }
    $('.lb-fechar', lb).addEventListener('click', fecharLightbox);
    $('.lb-ant', lb).addEventListener('click', () => navegar(-1));
    $('.lb-prox', lb).addEventListener('click', () => navegar(1));
    lb.addEventListener('click', (e) => { if (e.target === lb) { fecharLightbox(); } });
    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('aberto')) { return; }
      if (e.key === 'Escape')     { fecharLightbox(); }
      if (e.key === 'ArrowLeft')  { navegar(-1); }
      if (e.key === 'ArrowRight') { navegar(1); }
    });
  }

  /* ======================================================================
     8. RESERVA — formulário que vira mensagem de WhatsApp
     ----------------------------------------------------------------------
     O site não processa reserva nem mostra preço: ele monta a consulta
     com data de entrada, data de saída e número de hóspedes, e entrega
     pronta no WhatsApp oficial. O Cloudbeds segue disponível ao lado.
     ====================================================================== */

  const hojeISO = () => new Date().toISOString().slice(0, 10);

  function diaSeguinte(iso) {
    const d = new Date(iso + 'T12:00:00');
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }

  function formatarData(iso) {
    if (!iso) { return ''; }
    const d = new Date(iso + 'T12:00:00');
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric', weekday: 'short'
    }).replace('.', '');
  }

  function contarNoites(entrada, saida) {
    if (!entrada || !saida) { return 0; }
    const ms = new Date(saida + 'T12:00:00') - new Date(entrada + 'T12:00:00');
    return Math.max(0, Math.round(ms / 86400000));
  }

  function erro(campo, mensagem) {
    const caixa = campo.closest('.campo');
    const alvo = caixa && $('.campo-erro', caixa);
    campo.setAttribute('aria-invalid', mensagem ? 'true' : 'false');
    if (alvo) { alvo.textContent = mensagem || ''; }
    return !mensagem;
  }

  function atualizarResumo() {
    const entrada = $('#f-entrada').value;
    const saida   = $('#f-saida').value;
    const caixa   = $('#form-resumo');
    const noites  = contarNoites(entrada, saida);

    if (!caixa) { return; }
    if (noites > 0) {
      const hospedes = $('#f-hospedes').value;
      caixa.textContent =
        noites + (noites === 1 ? ' noite' : ' noites') +
        ' · ' + hospedes + (hospedes === '1' ? ' hóspede' : ' hóspedes') +
        ' · entrada ' + formatarData(entrada) + ', saída ' + formatarData(saida) +
        '. Valor e disponibilidade são confirmados na conversa.';
    } else {
      caixa.textContent = '';
    }
  }

  function validar() {
    const entrada = $('#f-entrada');
    const saida   = $('#f-saida');
    let ok = true;

    ok = erro(entrada, !entrada.value ? 'Escolha a data de entrada.'
            : entrada.value < hojeISO() ? 'A data de entrada já passou.'
            : '') && ok;

    ok = erro(saida, !saida.value ? 'Escolha a data de saída.'
            : (entrada.value && saida.value <= entrada.value)
              ? 'A saída precisa ser depois da entrada.'
            : '') && ok;

    return ok;
  }

  function ligarFormulario() {
    const form = $('#form-reserva');
    if (!form) { return; }

    const entrada = $('#f-entrada');
    const saida   = $('#f-saida');

    /* Não deixa escolher data passada */
    entrada.min = hojeISO();
    saida.min = diaSeguinte(hojeISO());

    /* Hóspedes: a capacidade vem do config */
    const sel = $('#f-hospedes');
    sel.innerHTML = '';
    for (let n = 1; n <= SITE.hospedesMax; n += 1) {
      sel.appendChild(criar('option', {
        value: String(n),
        textContent: n + (n === 1 ? ' hóspede' : ' hóspedes')
      }));
    }
    sel.value = '2';

    /* Cabanas no seletor, a partir do config */
    const selCab = $('#f-cabana');
    selCab.innerHTML = '<option value="">Tanto faz — me indique</option>' +
      CABANAS.map((c) => '<option value="' + c.nome + '">' + c.nome + '</option>').join('');

    /* A saída nunca pode ser antes da entrada */
    entrada.addEventListener('change', () => {
      if (entrada.value) {
        saida.min = diaSeguinte(entrada.value);
        if (saida.value && saida.value <= entrada.value) {
          saida.value = diaSeguinte(entrada.value);
        }
      }
      validar();
      atualizarResumo();
    });

    [saida, sel, selCab].forEach((c) =>
      c.addEventListener('change', () => { validar(); atualizarResumo(); }));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validar()) {
        const primeiro = $('[aria-invalid="true"]', form);
        if (primeiro) { primeiro.focus(); }
        return;
      }

      const nome     = $('#f-nome').value.trim();
      const cabana   = selCab.value;
      const hospedes = sel.value;
      const pet      = $('#f-pet').checked;
      const obs      = $('#f-obs').value.trim();
      const noites   = contarNoites(entrada.value, saida.value);

      const linhas = [
        'Olá! Vim pelo site do ' + SITE.nome + ' e gostaria de consultar disponibilidade.',
        '',
        'Check-in: ' + formatarData(entrada.value),
        'Check-out: ' + formatarData(saida.value),
        'Noites: ' + noites,
        'Hóspedes: ' + hospedes,
        'Cabana: ' + (cabana || 'sem preferência')
      ];
      if (nome) { linhas.push('Nome: ' + nome); }
      if (pet)  { linhas.push('Levarei um pet de pequeno porte.'); }
      if (obs)  { linhas.push('', 'Observações: ' + obs); }

      window.open(linkZap(linhas.join('\n')), '_blank', 'noopener');
    });
  }

  /* ======================================================================
     9. PARTIDA
     ====================================================================== */

  function iniciar() {
    /* Primeiro monta as seções: elas criam links e textos que o passo
       seguinte precisa preencher. Inverter esta ordem deixa os botões
       das cabanas sem endereço. */
    renderFatos();
    renderCabanas();
    renderExperiencias();
    renderArredores();
    renderGaleria();

    ligarContatos();       /* agora sim: preenche tudo, inclusive o novo */
    ligarLightbox();
    ligarFormulario();
    ligarNavegacao();
    ligarParallax();
    iniciarRevelar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
}());
