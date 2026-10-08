/* =========================================================================
   Casa Guaiamum — comportamento da página
   1. Links do WhatsApp a partir da configuração única
   2. Formulário de consulta (validação + mensagem para o WhatsApp)
   3. Lightbox manual, acessível, sem transições animadas
   ========================================================================= */
(function () {
  "use strict";

  var CFG = window.CASA_GUAIAMUM || {};
  var NUM = String(CFG.whatsappNumber || "").replace(/\D/g, "");
  var OK  = CFG.whatsappConfirmed === true && NUM.length >= 12;
  var MIN = CFG.minHospedes || 1;
  var MAX = CFG.maxHospedes || 12;

  /* ----------------------------------------------------------------- 1. WhatsApp */
  // A configuração é a fonte única: sobrescreve os href estáticos do HTML
  // (que existem apenas para o link funcionar sem JavaScript e ser rastreável).
  var linksWa = document.querySelectorAll("[data-wa]");
  if (OK) {
    Array.prototype.forEach.call(linksWa, function (a) {
      a.setAttribute("href", "https://wa.me/" + NUM);
    });
  } else {
    // Destino não confirmado: remove o botão flutuante em vez de apontar para o vazio.
    Array.prototype.forEach.call(linksWa, function (a) {
      if (a.classList.contains("zap")) { a.remove(); } else { a.removeAttribute("href"); }
    });
  }

  /* ----------------------------------------------------------------- 2. Formulário */
  var form = document.getElementById("form-reserva");

  // Data local no formato AAAA-MM-DD, sem passar por UTC (que mudaria o dia no Brasil).
  function hojeLocal() {
    var d = new Date();
    return [d.getFullYear(),
            String(d.getMonth() + 1).padStart(2, "0"),
            String(d.getDate()).padStart(2, "0")].join("-");
  }

  // "AAAA-MM-DD" -> "DD/MM/AAAA" (comparação feita como texto, que é segura
  // neste formato por ser ordenável, sem criar objetos Date).
  function paraBR(iso) {
    var p = iso.split("-");
    return p[2] + "/" + p[1] + "/" + p[0];
  }

  function dataValida(iso) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
    var p = iso.split("-").map(Number);
    var d = new Date(p[0], p[1] - 1, p[2]);
    return d.getFullYear() === p[0] && d.getMonth() === p[1] - 1 && d.getDate() === p[2];
  }

  function mostraErro(campo, msg) {
    var box = document.getElementById("erro-" + campo.id);
    if (msg) {
      box.textContent = msg;
      box.hidden = false;
      campo.setAttribute("aria-invalid", "true");
    } else {
      box.textContent = "";
      box.hidden = true;
      campo.removeAttribute("aria-invalid");
    }
  }

  if (form) {
    var checkin   = document.getElementById("checkin");
    var checkout  = document.getElementById("checkout");
    var hospedes  = document.getElementById("hospedes");
    var status    = document.getElementById("form-status");

    // Impede, já no seletor do navegador, escolher um dia anterior a hoje.
    checkin.min = hojeLocal();
    checkout.min = hojeLocal();
    checkin.addEventListener("change", function () {
      if (dataValida(checkin.value)) { checkout.min = checkin.value; }
    });

    // O seletor de data é desenhado pelo navegador e segue o idioma dele
    // (pode aparecer como mm/dd/yyyy). Confirmamos a data escolhida em pt-BR.
    function confirmaData(campo, rotulo) {
      var alvo = document.getElementById("fmt-" + campo.id);
      if (campo.value && dataValida(campo.value)) {
        alvo.textContent = rotulo + " em " + paraBR(campo.value) + ".";
        alvo.hidden = false;
      } else {
        alvo.textContent = ""; alvo.hidden = true;
      }
    }
    checkin.addEventListener("change", function () { confirmaData(checkin, "Chegada"); });
    checkout.addEventListener("change", function () { confirmaData(checkout, "Saída"); });

    // Limpa o erro assim que o visitante corrige o campo.
    [checkin, checkout, hospedes].forEach(function (c) {
      c.addEventListener("input", function () {
        if (c.getAttribute("aria-invalid") === "true") { mostraErro(c, ""); }
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.textContent = "";

      var hoje = hojeLocal();
      var erros = [];

      // --- check-in
      if (!checkin.value) {
        mostraErro(checkin, "Informe a data de chegada."); erros.push(checkin);
      } else if (!dataValida(checkin.value)) {
        mostraErro(checkin, "Data de chegada inválida."); erros.push(checkin);
      } else if (checkin.value < hoje) {
        mostraErro(checkin, "A chegada não pode ser anterior a hoje."); erros.push(checkin);
      } else {
        mostraErro(checkin, "");
      }

      // --- check-out
      if (!checkout.value) {
        mostraErro(checkout, "Informe a data de saída."); erros.push(checkout);
      } else if (!dataValida(checkout.value)) {
        mostraErro(checkout, "Data de saída inválida."); erros.push(checkout);
      } else if (checkin.value && dataValida(checkin.value) && checkout.value <= checkin.value) {
        mostraErro(checkout, "A saída precisa ser depois da chegada."); erros.push(checkout);
      } else {
        mostraErro(checkout, "");
      }

      // --- hóspedes (inteiro de 1 a 12)
      var n = hospedes.value.trim();
      if (!n) {
        mostraErro(hospedes, "Informe o número de hóspedes."); erros.push(hospedes);
      } else if (!/^\d+$/.test(n)) {
        mostraErro(hospedes, "Use um número inteiro de hóspedes."); erros.push(hospedes);
      } else if (Number(n) < MIN || Number(n) > MAX) {
        mostraErro(hospedes, "Informe de " + MIN + " a " + MAX + " hóspedes."); erros.push(hospedes);
      } else {
        mostraErro(hospedes, "");
      }

      if (erros.length) {
        status.textContent = erros.length === 1
          ? "Revise o campo destacado."
          : "Revise os " + erros.length + " campos destacados.";
        erros[0].focus();
        return;
      }

      if (!OK) {
        status.textContent = "Contato indisponível no momento.";
        return;
      }

      var msg = "Olá! Gostaria de consultar uma estadia na Casa Guaiamum." +
                " Check-in: " + paraBR(checkin.value) + "." +
                " Check-out: " + paraBR(checkout.value) + "." +
                " Hóspedes: " + Number(n) + "." +
                " Poderia informar disponibilidade, valor total e condições?";

      status.textContent = "Abrindo o WhatsApp com sua consulta. Revise e envie a mensagem.";
      window.open("https://wa.me/" + NUM + "?text=" + encodeURIComponent(msg),
                  "_blank", "noopener");
    });
  }

  /* ----------------------------------------------------------------- 3. Lightbox */
  var dlg = document.getElementById("lightbox");
  var botoes = Array.prototype.slice.call(document.querySelectorAll(".zoom"));

  if (dlg && botoes.length && typeof dlg.showModal === "function") {
    var lbImg  = document.getElementById("lb-img");
    var lbLeg  = document.getElementById("lb-legenda");
    var lbCont = document.getElementById("lb-contador");
    var atual  = 0;
    var origem = null;

    // Cada fotografia é lida da própria página: fonte grande, alt e legenda.
    var fotos = botoes.map(function (b) {
      var img = b.querySelector("img");
      var fig = b.closest("figure");
      var cap = fig ? fig.querySelector("figcaption") : null;
      return {
        src: img.getAttribute("src").replace(/-800\.jpg$/, ".jpg"),
        alt: img.getAttribute("alt") || "",
        legenda: cap ? cap.textContent.trim() : "",
        w: img.getAttribute("width"),
        h: img.getAttribute("height")
      };
    });

    function mostra(i) {
      atual = (i + fotos.length) % fotos.length;
      var f = fotos[atual];
      lbImg.setAttribute("src", f.src);
      lbImg.setAttribute("alt", f.alt);
      lbImg.setAttribute("width", f.w);
      lbImg.setAttribute("height", f.h);
      lbLeg.textContent = f.legenda;
      lbCont.textContent = "Foto " + (atual + 1) + " de " + fotos.length;
    }

    botoes.forEach(function (b, i) {
      b.addEventListener("click", function () {
        origem = b;
        mostra(i);
        dlg.showModal();
      });
    });

    document.getElementById("lb-prox").addEventListener("click", function () { mostra(atual + 1); });
    document.getElementById("lb-ant").addEventListener("click", function () { mostra(atual - 1); });
    document.getElementById("lb-fechar").addEventListener("click", function () { dlg.close(); });

    dlg.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); mostra(atual + 1); }
      if (e.key === "ArrowLeft")  { e.preventDefault(); mostra(atual - 1); }
      // Esc já é tratado nativamente pelo <dialog>.
    });

    // Clicar fora da figura fecha (o <dialog> ocupa a tela inteira).
    dlg.addEventListener("click", function (e) {
      if (e.target === dlg) { dlg.close(); }
    });

    // Devolve o foco ao botão que abriu a fotografia.
    dlg.addEventListener("close", function () {
      lbImg.removeAttribute("src");
      if (origem) { origem.focus(); origem = null; }
    });
  } else if (dlg) {
    // Sem suporte a <dialog>: as fotografias continuam visíveis na página.
    Array.prototype.forEach.call(botoes, function (b) {
      b.style.cursor = "default";
    });
  }
})();
