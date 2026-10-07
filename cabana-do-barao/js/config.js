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
     STATUS: NÃO VALIDADO.

     O número abaixo foi publicado por um agregador (pousadastop.com.br) e
     ainda não foi confirmado pelo anfitrião nem por uma fonte primária.
     Enquanto `validado` for false:
       - o botão flutuante de WhatsApp NÃO aparece;
       - os botões "Consultar disponibilidade" levam ao bloco de consulta;
       - o formulário mostra a mensagem pronta e oferece o Instagram.

     Depois que o anfitrião confirmar o número:
       1. confira/edite `numero` (só dígitos, com 55 + DDD);
       2. troque `validado` para true;
       3. anote quem confirmou e quando em `confirmacao`.
     Todos os botões passam a abrir o WhatsApp com a mensagem padrão.
     -------------------------------------------------------------------- */
  whatsapp: {
    numero: '5512988252042',
    validado: false,
    confirmacao: '',   // ex.: 'Confirmado por Moacir em 10/10/2026'
    mensagem: 'Olá! Vi a Cabana do Barão pelo site e gostaria de consultar disponibilidade.'
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
