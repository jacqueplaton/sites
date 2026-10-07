/* ==========================================================================
   CABANA DO BARÃO — configuração do site
   --------------------------------------------------------------------------
   Este é o arquivo para trocar canal de atendimento e vídeo sem mexer no
   resto do site. Textos, ficha e avaliações ficam direto no index.html
   (para os buscadores lerem sem depender de JavaScript); cada bloco lá tem
   um comentário dizendo o que atualizar.
   ========================================================================== */

var CABANA = {
  nome: 'Cabana do Barão',

  /* ---- WhatsApp ---------------------------------------------------------
     STATUS: VALIDADO — número oficial da Cabana do Barão informado pelo
     cliente em 07/10/2026: +55 12 98825-2042.

     Com `validado: true`:
       - aparece o botão flutuante de WhatsApp;
       - todos os botões "Consultar disponibilidade" abrem o WhatsApp com a
         mensagem abaixo;
       - o formulário de consulta abre o WhatsApp com a mesma mensagem e
         acrescenta só as datas preenchidas.

     Para trocar o número: edite `numero` (só dígitos, 55 + DDD + número)
     e também o link fixo nos botões do index.html (procure por wa.me).
     -------------------------------------------------------------------- */
  whatsapp: {
    numero: '5512988252042',
    validado: true,
    confirmacao: 'Número oficial informado pelo cliente em 07/10/2026',
    mensagem: 'Olá! Vim pelo site da Cabana do Barão e gostaria de consultar disponibilidade e valores para uma reserva.'
  },

  /* ---- Instagram (perfil identificado na pesquisa) ---------------------- */
  instagram: {
    usuario: 'cabanasdobarao',
    url: 'https://www.instagram.com/cabanasdobarao/'
  },

  /* ---- Vídeo do topo ----------------------------------------------------
     Para trocar o vídeo, substitua os arquivos mantendo os nomes, ou
     aponte para os novos aqui. Os posters (primeiro quadro de cada vídeo)
     ficam no index.html, no bloco <picture class="hero__poster">.

       desktop: horizontal 16:9 (hoje 1280×720, ~2 MB)
       mobile:  recorte quadrado 1:1 (hoje 720×720, ~1 MB)

     Cada um existe em MP4 (H.264, usado pela maioria dos navegadores) e em
     WebM (VP9, reserva para navegadores sem H.264). Se só tiver o MP4,
     apague as linhas *Webm: o site usa o que existir.

     Os dois vídeos são mudos. Com "reduzir movimento" ou economia de dados
     ligados no aparelho, o site mostra só o poster e um botão para tocar.
     Para desligar o vídeo e ficar só com a foto, troque `ativo` para false.
     -------------------------------------------------------------------- */
  video: {
    ativo: true,
    desktop: 'media/video/filme-1280x720.mp4',
    desktopWebm: 'media/video/filme-1280x720.webm',
    mobile: 'media/video/filme-720x720.mp4',
    mobileWebm: 'media/video/filme-720x720.webm',
    larguraMobile: 959   // até esta largura (px) usa o vídeo mobile
  }
};
