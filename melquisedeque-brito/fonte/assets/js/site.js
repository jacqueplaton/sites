/* Comportamentos do site. Tudo aqui é aprimoramento: sem JavaScript, o
   conteúdo, o menu (aberto), o sumário e os links continuam funcionando. */
(function () {
  "use strict";
  var d = document;
  var raiz = d.documentElement;
  var reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Menu no celular ------------------------------------------------------ */
  var botao = d.querySelector(".menu-botao");
  var menu = d.getElementById("menu");
  if (botao && menu) {
    botao.hidden = false;
    raiz.classList.add("menu-pronto");
    var alternar = function (abrir) {
      botao.setAttribute("aria-expanded", String(abrir));
      raiz.classList.toggle("menu-aberto", abrir);
    };
    botao.addEventListener("click", function () {
      var abrir = botao.getAttribute("aria-expanded") !== "true";
      alternar(abrir);
      if (abrir) { var primeiro = menu.querySelector("a"); if (primeiro) primeiro.focus(); }
    });
    d.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && raiz.classList.contains("menu-aberto")) { alternar(false); botao.focus(); }
    });
  }

  /* Entrada única ao rolar (índice) e filete das seções de leitura -------- */
  var alvos = d.querySelectorAll(".revela, .bloco");
  if ("IntersectionObserver" in window && !reduz) {
    var io = new IntersectionObserver(function (itens) {
      itens.forEach(function (item) {
        if (item.isIntersecting) { item.target.classList.add("is-in"); io.unobserve(item.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    alvos.forEach(function (alvo) { io.observe(alvo); });
  } else {
    alvos.forEach(function (alvo) { alvo.classList.add("is-in"); });
  }

  /* Retrato acompanha o cursor (até 2 px por eixo) ----------------------- */
  var foto = d.querySelector("[data-paralaxe]");
  if (foto && !reduz && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var img = foto.querySelector("img");
    foto.addEventListener("pointermove", function (e) {
      var r = foto.getBoundingClientRect();
      var x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      var y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      img.style.setProperty("--px", (Math.max(-1, Math.min(1, x)) * 2).toFixed(2) + "px");
      img.style.setProperty("--py", (Math.max(-1, Math.min(1, y)) * 2).toFixed(2) + "px");
    });
    foto.addEventListener("pointerleave", function () {
      img.style.setProperty("--px", "0px");
      img.style.setProperty("--py", "0px");
    });
  }

  /* Sumário lateral: fixo no desktop, recolhido no celular --------------- */
  var sumario = d.querySelector(".sumario");
  if (sumario) {
    var largo = window.matchMedia("(min-width: 60rem)");
    var resumo = sumario.querySelector("summary");
    var ajustar = function () {
      sumario.open = largo.matches;
      sumario.classList.toggle("fixo", largo.matches);
      if (largo.matches) resumo.setAttribute("tabindex", "-1"); else resumo.removeAttribute("tabindex");
    };
    ajustar();
    if (largo.addEventListener) largo.addEventListener("change", ajustar);
    resumo.addEventListener("click", function (e) { if (largo.matches) e.preventDefault(); });
    sumario.addEventListener("click", function (e) {
      if (e.target.closest("a") && !largo.matches) sumario.open = false;
    });

    var links = Array.prototype.slice.call(sumario.querySelectorAll('a[href^="#"]'));
    if ("IntersectionObserver" in window && links.length) {
      var marcar = function (id) {
        links.forEach(function (a) { a.classList.toggle("atual", a.getAttribute("href") === "#" + id); });
      };
      var vigia = new IntersectionObserver(function (itens) {
        itens.forEach(function (item) { if (item.isIntersecting) marcar(item.target.id); });
      }, { rootMargin: "-20% 0px -70% 0px" });
      links.forEach(function (a) {
        var alvo = d.getElementById(a.getAttribute("href").slice(1));
        if (alvo) vigia.observe(alvo);
      });
    }
  }

  /* Medição do WhatsApp (somente com GA4/GTM autorizado) -----------------
     Envia apenas a posição genérica do botão. Nunca nome, mensagem,
     número de processo ou detalhes do caso. */
  d.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[data-wa]");
    if (!a) return;
    var dados = { posicao_botao: a.getAttribute("data-wa") };
    if (typeof window.gtag === "function") {
      window.gtag("event", "click_whatsapp", dados);
    } else if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: "click_whatsapp", posicao_botao: dados.posicao_botao });
    }
  });
})();
