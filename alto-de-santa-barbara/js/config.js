/* ==========================================================================
   Configuração do atendimento
   --------------------------------------------------------------------------
   O formulário de consulta usa estes valores para montar a mensagem.
   Os links fixos do index.html (botões "Quero este chalé", hero, rodapé e
   botão flutuante) usam o mesmo número e as mesmas mensagens já codificados,
   para funcionar mesmo sem JavaScript. Ao trocar o número, faça "localizar
   e substituir" de 5512992204141 no index.html também.
   Rode `node tools/verificar.mjs` depois de qualquer mudança: ele confere se
   os links do HTML batem com este arquivo.
   ========================================================================== */
window.ALTO_CONFIG = {
  // Formato internacional, só dígitos: 55 (Brasil) + 12 (DDD) + número.
  // Não repita o 55: o link publicado no diretório D1 tinha "555512..." e
  // não funciona.
  whatsapp: '5512992204141',

  mensagens: {
    geral: 'Olá! Conheci o Alto de Santa Bárbara pelo site e gostaria de consultar disponibilidade para uma hospedagem.',
    chale1: 'Olá! Conheci o Chalé 1 pelo site do Alto de Santa Bárbara e gostaria de consultar disponibilidade.',
    chale2: 'Olá! Conheci o Chalé 2 pelo site do Alto de Santa Bárbara e gostaria de consultar disponibilidade.'
  }
};
