/* ==========================================================================
   TERRA DOURADA — configuração central da prévia
   --------------------------------------------------------------------------
   Este é o único arquivo que precisa ser aberto para:
     • ligar o WhatsApp de reservas;
     • trocar o modo da prévia (revisão interna × apresentação ao cliente);
     • ajustar mensagens, links oficiais e galerias.
   Todo o resto do site lê daqui.
   ========================================================================== */

window.TERRA_DOURADA = {

  /* ------------------------------------------------------------------------
     MODO DA PRÉVIA
     'revisao' → mostra os espaços e notas de revisão (uso interno).
     'cliente' → esconde todas as marcações; mostra só o que está confirmado.
     Também dá para trocar pela URL: ?modo=cliente ou ?modo=revisao
     Na versão comercial final, use 'cliente' e remova as marcações do HTML
     (todas têm a classe "rev").
     ------------------------------------------------------------------------ */
  modo: 'revisao',

  /* ------------------------------------------------------------------------
     WHATSAPP DE RESERVAS — STATUS: DESATIVADO
     O número +55 61 99158-7093 aparece na ficha pública do Google e em um
     diretório, mas NÃO foi confirmado como o WhatsApp de reservas.
     Enquanto "numero" estiver vazio, nenhum botão abre o WhatsApp: todos
     levam ao convite final (#consultar), que explica a situação.

     Para ativar, depois da confirmação com a propriedade:
       numero: '5561991587093'   ← só dígitos, com 55 e DDD
     ------------------------------------------------------------------------ */
  whatsapp: {
    numero: '',
    numeroEncontradoNaPesquisa: '+55 61 99158-7093' // referência; nunca é usado
  },

  /* Mensagens que abrem prontas no WhatsApp. Nada é enviado sozinho:
     a pessoa revisa e envia. Marcadores preenchidos pelo convite final:
       {datas}    → "12/10/2026 a 15/10/2026" ou "___"
       {adultos}  → "2 adultos" ou "___ adultos"
       {criancas} → "1 criança" ou "___ crianças"
       {pessoas}  → "2 adultos e 1 criança" ou "___ pessoas"            */
  mensagens: {
    geral:       'Olá! Conheci a Terra Dourada pelo site e gostaria de consultar disponibilidade. Minhas datas são {datas} e iremos em {adultos} e {criancas}.',
    'casa-rosa': 'Olá! Tenho interesse na Casa Rosa. Poderiam informar disponibilidade e condições para {datas}? Seremos {pessoas}.',
    kaliandra:   'Olá! Gostaria de planejar uma estadia no Chalé Kaliandra. Tenho interesse nas datas {datas} para {pessoas}.',
    conjunta:    'Olá! Gostaria de consultar a locação da Casa Rosa e do Chalé Kaliandra para o mesmo grupo, nas datas {datas}. Quais são a capacidade e as condições?',
    /* mensagens de apoio (não estavam no documento de direção) */
    acesso:      'Olá! Gostaria de tirar uma dúvida sobre o acesso à Terra Dourada.',
    duvida:      'Olá! Tenho uma dúvida sobre a hospedagem na Terra Dourada.'
  },

  /* ------------------------------------------------------------------------
     LINKS OFICIAIS (pesquisa de 6 out. 2026). null = ainda não validado:
     o botão correspondente não aparece para o hóspede.
     ------------------------------------------------------------------------ */
  links: {
    instagram:        'https://www.instagram.com/terradouradabrasilia/',
    airbnbCasaRosa:   'https://www.airbnb.com.br/rooms/803740962310126110',
    airbnbKaliandra:  'https://www.airbnb.com.br/rooms/803738197701849036',
    airbnbConjunto:   'https://www.airbnb.com.br/rooms/1017530888939475423',
    avaliacoesGoogle: null, // ficha encontrada só via Google Travel; validar o link público
    rota:             null  // link do Google Maps SOMENTE depois de validar o pin
  },

  /* ------------------------------------------------------------------------
     GALERIAS ("Ver ambientes e detalhes"). Cada foto precisa de unidade e
     ambiente na legenda. Para adicionar, copie um bloco e troque os dados.
     ------------------------------------------------------------------------ */
  galerias: {
    'casa-rosa': {
      titulo: 'Casa Rosa',
      fotos: [
        { src: 'media/fotos/casa-rosa-aerea-1200.webp', w: 1200, h: 900,
          alt: 'Vista aérea do pavilhão envidraçado com telhado de cerâmica sobre a piscina natural, cercado de mata',
          legenda: 'Casa Rosa · piscina e pavilhão vistos do alto' },
        { src: 'media/fotos/piscina-deck-1200.webp', w: 1200, h: 799,
          alt: 'Piscina de água natural com deck de madeira, mesa com guarda-sol e o pavilhão rosa ao fundo',
          legenda: 'Casa Rosa · piscina e deck' },
        { src: 'media/fotos/area-gourmet-674.webp', w: 674, h: 900,
          alt: 'Área envidraçada com mesa longa de madeira, cadeiras, aparador e parede rosa, aberta para a piscina',
          legenda: 'Casa Rosa · área envidraçada junto à piscina' },
        { src: 'media/fotos/pavilhao-rede-674.webp', w: 674, h: 900,
          alt: 'Pavilhão rosa visto do deck, com rede azul atrás das portas de vidro e vegetação ao redor',
          legenda: 'Casa Rosa · pavilhão e deck' }
      ]
    }
  }
};
