/* ==========================================================================
   ESPAÇO GARIBA — dados da hospedagem
   --------------------------------------------------------------------------
   ESTE É O ÚNICO ARQUIVO QUE VOCÊ PRECISA EDITAR NO DIA A DIA.
   Tudo no site (textos, links, botões, WhatsApp, SEO) lê daqui.

   REGRA DE OURO DO PROJETO:
   Campo com valor `null` = informação NÃO CONFIRMADA.
   O site esconde o dado em vez de inventar um valor. Isso é de propósito.
   Nada de preço, nota ou disponibilidade no ar sem confirmação do dono.
   ========================================================================== */

const SITE = {

  /* ---- Identidade -------------------------------------------------- */
  nome:       'Espaço Gariba',
  nomeCurto:  'Gariba',
  assinatura: 'Cabanas em Encantado · RS',

  /* ---- Contato (CONFIRMADO — fontes oficiais) ----------------------- */
  whatsappNumero: '5551980649606',          // só dígitos, com 55
  whatsappExibir: '(51) 98064-9606',
  email:          'cabanasgariba@hotmail.com',
  instagram:      'https://www.instagram.com/garibacabanas/',

  /* ---- Reserva direta (canal já existente — manter sempre) ---------- */
  cloudbeds: 'https://hotels.cloudbeds.com/pt-br/reservas/nfiaO8',

  /* ---- Endereço (CONFIRMADO — Prefeitura de Encantado) -------------- */
  rua:     'Linha Garibaldi, 954',
  bairro:  'Interior',
  cidade:  'Encantado',
  estado:  'RS',
  cep:     '95960-000',
  pais:    'BR',
  get enderecoCompleto() {
    return `${this.rua} — ${this.cidade}/${this.estado}, CEP ${this.cep}`;
  },

  /* ---- Coordenadas ------------------------------------------------------
     NÃO CONFIRMADAS. Enquanto forem null, o site usa busca por endereço
     no Google Maps (funciona bem) e omite geo do JSON-LD.
     Para preencher: abra o Google Maps, clique com o botão direito no
     local exato e copie os dois números.
     -------------------------------------------------------------------- */
  lat: null,
  lng: null,

  /* ---- Horários (informados por canais de reserva — CONFIRMAR) ------ */
  checkin:  '15h',
  checkout: '12h',

  /* ---- Capacidade (CONFIRMADO) -------------------------------------- */
  hospedesMax: 4,
  minNoites:   null,   // null = não exibe exigência de mínimo de noites

  /* ---- Preços -----------------------------------------------------------
     INTENCIONALMENTE AUSENTES. Não há preço no site.
     Fontes de terceiros divergem e o valor muda por data e temporada.
     O site conduz o visitante ao WhatsApp e ao Cloudbeds, onde o valor
     é sempre o atual. NÃO preencha isto sem ordem do dono.
     -------------------------------------------------------------------- */
  diaria: null,

  /* ---- Avaliações -------------------------------------------------------
     INTENCIONALMENTE AUSENTES. Nenhuma nota ou depoimento foi inventado.
     Quando quiser exibir, use só avaliações reais, com nome e origem.
     -------------------------------------------------------------------- */
  avaliacoes: null,

  /* ---- Políticas (CONFIRMADO — Prefeitura de Encantado) ------------- */
  pets: 'Aceita animais de pequeno porte, sob consulta',

  /* ---- SEO ------------------------------------------------------------
     Troque `dominio` pelo endereço final assim que o site for publicado.
     O netlify-build.sh ajusta isso sozinho em deploy automático.
     -------------------------------------------------------------------- */
  dominio: 'https://espacogariba.netlify.app'
};


/* ==========================================================================
   AS DUAS CABANAS
   --------------------------------------------------------------------------
   `fotos` é a lista de arquivos de cada cabana, na ordem de exibição.
   Enquanto o arquivo não existir na pasta media/, o site mostra uma
   moldura elegante com o nome da foto — não quebra, não mostra ícone de
   imagem rompida e não usa foto de banco de imagens.
   Para publicar as fotos reais: jogue os arquivos em media/cabanas/
   com exatamente estes nomes. Mais detalhes em media/LEIA-ME-FOTOS.md
   ========================================================================== */

const CABANAS = [
  {
    id: 'mata',
    nome: 'Cabana da Mata',
    tagline: 'Dormir dentro do verde',
    texto:
      'Cercada pela mata nativa, é a cabana do silêncio. ' +
      'A claraboia de vidro sobre a cama troca o teto pelas copas das ' +
      'árvores de dia e pelo céu aberto de noite. A lareira a lenha ' +
      'acende o fim da tarde; a banheira de hidromassagem, cercada de ' +
      'vidro ao ar livre, devolve o corpo ao ritmo do lugar.',
    itens: [
      'Mezanino com cama queen',
      'Sofá-cama na sala',
      'Claraboia de vidro sobre a cama',
      'Lareira a lenha',
      'Banheira de hidromassagem ao ar livre, cercada de vidro',
      'Fire pit privativo',
      'Cozinha equipada',
      'Ar-condicionado',
      'Wi-Fi',
      'Café da manhã entregue na porta'
    ],
    fotos: [
      'media/cabanas/mata-01.jpg',
      'media/cabanas/mata-02.jpg',
      'media/cabanas/mata-03.jpg',
      'media/cabanas/mata-04.jpg'
    ]
  },
  {
    id: 'pordosol',
    nome: 'Cabana Pôr do Sol',
    tagline: 'O vale inteiro à sua frente',
    texto:
      'O deck panorâmico é o coração desta cabana: rede armada, vista ' +
      'aberta sobre o vale e a hora exata em que o sol desce atrás dos ' +
      'morros. Dentro, o mesmo repertório — mezanino, claraboia sobre a ' +
      'cama, lareira acesa e a banheira de vidro esperando do lado de fora.',
    itens: [
      'Deck com vista panorâmica',
      'Rede no deck',
      'Mezanino com cama queen',
      'Sofá-cama na sala',
      'Claraboia de vidro sobre a cama',
      'Lareira a lenha',
      'Banheira de hidromassagem ao ar livre, cercada de vidro',
      'Fire pit privativo',
      'Cozinha equipada',
      'Ar-condicionado',
      'Wi-Fi',
      'Café da manhã entregue na porta'
    ],
    fotos: [
      'media/cabanas/pordosol-01.jpg',
      'media/cabanas/pordosol-02.jpg',
      'media/cabanas/pordosol-03.jpg',
      'media/cabanas/pordosol-04.jpg'
    ]
  }
];


/* ==========================================================================
   EXPERIÊNCIAS — o que existe no Espaço Gariba
   Só itens confirmados em fontes oficiais. Não acrescente nada que o
   hóspede não vá encontrar lá.
   ========================================================================== */

const EXPERIENCIAS = [
  {
    icone: 'banheira',
    titulo: 'Banheira de vidro na natureza',
    texto: 'Hidromassagem ao ar livre, cercada de vidro, de frente para a mata.'
  },
  {
    icone: 'lareira',
    titulo: 'Lareira a lenha',
    texto: 'O fim de tarde começa quando a primeira acha pega fogo.'
  },
  {
    icone: 'fogo',
    titulo: 'Fire pit',
    texto: 'Fogo ao relento, cadeira puxada para perto, o vale escurecendo.'
  },
  {
    icone: 'estrela',
    titulo: 'Claraboia sobre a cama',
    texto: 'Vidro no lugar do teto: as copas de dia, as estrelas de noite.'
  },
  {
    icone: 'cafe',
    titulo: 'Café da manhã na porta',
    texto: 'A cesta chega à porta da cabana. Ninguém precisa sair do roupão.'
  },
  {
    icone: 'lago',
    titulo: 'Lago e mata nativa',
    texto: 'Área verde preservada, lago e a fauna que vem junto com ela.'
  }
];


/* ==========================================================================
   ARREDORES — Encantado e o Vale do Taquari
   Atrações públicas da região. Horários e ingressos mudam: o site não
   promete valor nenhum, só indica o que existe por perto.
   ========================================================================== */

const ARREDORES = [
  {
    titulo: 'Cristo Protetor',
    texto: 'A estátua de Encantado, no Morro das Antenas, com elevador interno, Capela Scalabrini e mirantes. O Gariba fica nas suas proximidades.'
  },
  {
    titulo: 'Lagoa da Garibaldi',
    texto: 'Na Estrada do Cristo, a mesma linha onde ficam as cabanas.'
  },
  {
    titulo: 'Roteiro Delícias da Colônia',
    texto: 'Queijos, vinhos e salames da colonização italiana do vale.'
  },
  {
    titulo: 'Memorial do Imigrante',
    texto: 'A história da imigração italiana que formou Encantado.'
  },
  {
    titulo: 'Igreja Matriz São Pedro',
    texto: 'No centro da cidade, a poucos minutos de carro.'
  },
  {
    titulo: 'Serra Gaúcha a um passo',
    texto: 'Bento Gonçalves e Caxias do Sul ficam no raio de um bom passeio de dia.'
  }
];


/* ==========================================================================
   GALERIA
   Mesma regra das cabanas: enquanto o arquivo não existir, aparece a
   moldura com o nome. Jogue as fotos reais em media/galeria/.
   ========================================================================== */

const GALERIA = [
  { src: 'media/galeria/g01-cabana-mata-externa.jpg',  alt: 'Fachada da Cabana da Mata entre as árvores' },
  { src: 'media/galeria/g02-banheira-vidro.jpg',       alt: 'Banheira de hidromassagem cercada de vidro ao ar livre' },
  { src: 'media/galeria/g03-deck-por-do-sol.jpg',      alt: 'Deck da Cabana Pôr do Sol com vista para o vale' },
  { src: 'media/galeria/g04-claraboia-cama.jpg',       alt: 'Cama no mezanino sob a claraboia de vidro' },
  { src: 'media/galeria/g05-lareira-acesa.jpg',        alt: 'Lareira a lenha acesa dentro da cabana' },
  { src: 'media/galeria/g06-fire-pit-noite.jpg',       alt: 'Fire pit aceso ao cair da noite' },
  { src: 'media/galeria/g07-cafe-da-manha.jpg',        alt: 'Cesta de café da manhã entregue na porta da cabana' },
  { src: 'media/galeria/g08-lago.jpg',                 alt: 'Lago e área verde do Espaço Gariba' },
  { src: 'media/galeria/g09-interior-sala.jpg',        alt: 'Sala da cabana com sofá e vista para a mata' },
  { src: 'media/galeria/g10-vista-vale.jpg',           alt: 'Vista do vale a partir do Espaço Gariba' },
  { src: 'media/galeria/g11-rede-deck.jpg',            alt: 'Rede armada no deck da Cabana Pôr do Sol' },
  { src: 'media/galeria/g12-mata-nativa.jpg',          alt: 'Mata nativa no entorno das cabanas' }
];
