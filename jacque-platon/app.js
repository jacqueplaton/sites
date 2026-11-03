/* ==========================================================================
   app.js — comportamento do site Jacque Platon
   --------------------------------------------------------------------------
   Regra importante: NENHUM texto do site é criado por este arquivo. Todo o
   conteúdo já vem no HTML entregue pelo servidor, porque vários robôs de
   busca e de inteligência artificial não executam JavaScript. Aqui só existe
   interação: abrir menu, preencher o formulário e montar a mensagem.

   Cada bloco verifica se o elemento existe antes de usar, porque as páginas
   internas não têm formulário.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- menu */
  var menuButton = document.querySelector('.menu-button');
  var navigation = document.getElementById('navigation');

  if (menuButton && navigation) {
    var closeMenu = function () {
      navigation.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    };

    menuButton.addEventListener('click', function () {
      var open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      navigation.classList.toggle('open', open);
    });

    navigation.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navigation.classList.contains('open')) {
        closeMenu();
        menuButton.focus();
      }
    });
  }

  /* ------------------------------------------- atalhos para o formulário */
  var campoServico = document.getElementById('servico');
  var campoMensagem = document.querySelector('[name="mensagem"]');

  if (campoServico) {
    document.querySelectorAll('[data-service]').forEach(function (a) {
      a.addEventListener('click', function () {
        campoServico.value = a.dataset.service;
      });
    });

    document.querySelectorAll('[data-project]').forEach(function (a) {
      a.addEventListener('click', function () {
        campoServico.value = 'Sites profissionais e landing pages';
        if (campoMensagem) {
          campoMensagem.value = 'Gostaria de conversar sobre um projeto semelhante ao '
            + a.dataset.project + '.';
        }
      });
    });
  }

  /* ----------------------------------------------------------- formulário
     Monta a mensagem na própria página. Nada é enviado para servidor, salvo
     em cookie ou compartilhado. O envio por WhatsApp entra aqui quando o
     número comercial for confirmado.                                      */
  var form = document.getElementById('contact-form');

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      form.querySelectorAll('[required]').forEach(function (input) {
        input.value = input.value.trim();
        input.setCustomValidity(input.value ? '' : 'Preencha este campo.');
      });

      if (!form.reportValidity()) return;

      var data = new FormData(form);
      var texto = 'Olá, Jacque! Gostaria de solicitar uma prévia.\n\n'
        + 'Nome: ' + data.get('nome') + '\n'
        + 'Empresa: ' + data.get('empresa') + '\n'
        + 'Segmento: ' + data.get('segmento') + '\n'
        + 'Serviço: ' + data.get('servico') + '\n'
        + 'Site atual: ' + (data.get('site') || 'Não informado') + '\n\n'
        + 'Mensagem: ' + data.get('mensagem');

      document.getElementById('message-preview').textContent = texto;

      var result = document.getElementById('form-result');
      result.hidden = false;
      result.scrollIntoView({
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant' : 'smooth',
        block: 'nearest'
      });
    });

    form.querySelectorAll('[required]').forEach(function (input) {
      input.addEventListener('input', function () {
        input.setCustomValidity('');
      });
    });
  }
}());
