// ==========================================================================
// NA MONTANHA ECO SPACE — dados do site
// --------------------------------------------------------------------------
// Este é o ÚNICO arquivo que precisa ser editado no dia a dia. Nome,
// endereço, telefone, links, cabanas, fotos e IDs de medição saem daqui
// para todas as páginas, para o schema (JSON-LD), o sitemap e o llms.txt.
// Assim o NAP (nome, endereço, telefone) fica idêntico em todo lugar.
//
// Procure por "CONFIRMAR" para ver o que ainda depende da Na Montanha.
// Campo vazio ('' ou null) = não aparece no site. Nada aqui foi inventado.
// ==========================================================================

export const site = {
  name: 'Na Montanha Eco Space',
  shortName: 'Na Montanha',
  slogan: 'Entre a serra e o silêncio.',

  // Endereço oficial do site. CONFIRMAR: quando houver domínio próprio,
  // coloque aqui (ex.: 'https://www.seudominio.com.br'). Enquanto estiver
  // vazio, o build usa o endereço que a Netlify ou a Vercel atribuírem.
  url: '',

  locale: 'pt_BR',
  lang: 'pt-BR',

  // Descrição de referência da marca (usada no schema e no llms.txt).
  description:
    'A Na Montanha Eco Space é uma hospedagem com três cabanas em meio à natureza — Cabana dos Sonhos, Cabana do Amor e Cabana da Pedra — no Alto da Pedra, em Igrejinha (RS), na Serra Gaúcha, perto de Gramado. A reserva pode ser feita diretamente pelo WhatsApp.',

  // ------------------------------------------------------------- NAP ---
  // Formato exatamente como informado pela Na Montanha. Mantenha igual ao
  // Google, Airbnb, Booking e Expedia: diferenças de endereço entre perfis
  // atrapalham o Google a entender que tudo é a mesma empresa.
  address: {
    reference: 'Junto à subida do parque',
    street: 'Rua Edgar Willy Wolff',
    district: 'Serra Grande',
    locality: 'Alto da Pedra',
    city: 'Igrejinha',
    state: 'RS',
    stateName: 'Rio Grande do Sul',
    postalCode: '95650-000',
    country: 'BR',
  },
  region: 'Serra Gaúcha',
  // Gramado é citada sempre como proximidade. A Na Montanha NÃO fica em Gramado.
  nearby: 'Gramado',

  phone: {
    display: '(51) 99909-7337',
    e164: '+5551999097337',
    schema: '+55-51-99909-7337',
  },
  whatsapp: '5551999097337',

  // Coordenadas: CONFIRMAR. Só preencha com o valor exato do perfil do
  // Google (clique no pino → as coordenadas aparecem no topo). Com elas, o
  // schema ganha "geo" e o mapa passa a usar o ponto exato.
  geo: null, // ex.: { lat: -29.xxxxxx, lng: -50.xxxxxx }

  // ---------------------------------------------------------- avaliações ---
  // Exibido na seção de avaliações. Não vai para o schema: o Google não
  // aceita nota da própria empresa marcada no próprio site (autoavaliação).
  rating: { value: '5,0', count: 99, source: 'Google' },

  // Depoimentos reais, copiados do Google com autorização. Deixe vazio até
  // ter os textos — a seção funciona sem eles. Formato:
  // { text: 'Texto exatamente como o hóspede escreveu.', author: 'Nome como aparece no Google', cabin: 'sonhos' }
  testimonials: [],

  // ------------------------------------------------------------- links ---
  links: {
    instagram: 'https://www.instagram.com/namontanhaecospace/',
    instagramHandle: '@namontanhaecospace',

    // Link de avaliações. CONFIRMAR: troque pelo link curto do Perfil da
    // Empresa no Google ("Pedir avaliações" → copiar link, g.page/r/...).
    // Enquanto isso, a busca pelo nome abre o perfil com as avaliações.
    googleReviews: 'https://www.google.com/maps/search/?api=1&query=Na+Montanha+Eco+Space+Igrejinha+RS',
    googleMaps: 'https://www.google.com/maps/search/?api=1&query=Na+Montanha+Eco+Space+Igrejinha+RS',
    googleDirections: 'https://www.google.com/maps/dir/?api=1&destination=Na+Montanha+Eco+Space+Igrejinha+RS',
    // Mapa incorporado. CONFIRMAR: no Google Maps, abra o perfil →
    // Compartilhar → Incorporar um mapa → copie só o endereço do src="...".
    mapEmbed: 'https://maps.google.com/maps?q=Na%20Montanha%20Eco%20Space%2C%20Igrejinha%20-%20RS&z=13&output=embed',

    // Perfis nas plataformas. Só entram no site e no schema (sameAs) quando
    // preenchidos. Encontrados em pesquisa pública — CONFIRMAR antes de publicar.
    airbnb: 'https://www.airbnb.com.br/users/profile/1480486977863207082', // CONFIRMAR: perfil de anfitrião
    booking: '', // CONFIRMAR: link do anúncio no Booking não encontrado
    expedia: 'https://www.expedia.com.br/Igrejinha-Hoteis-Na-Montanha-Eco-Space.h121663085.Informacao-Hotel', // CONFIRMAR
    google: '', // CONFIRMAR: link oficial do Perfil da Empresa (ex.: https://maps.app.goo.gl/...)
  },

  // ------------------------------------------------------------ medição ---
  // Cole os IDs quando existirem. Vazio = nenhum script de terceiros carrega.
  // Com qualquer ID preenchido, aparece um aviso de cookies (LGPD) e a
  // medição só começa depois do "Aceitar".
  analytics: {
    gtm: '',            // Google Tag Manager, ex.: 'GTM-XXXXXXX'
    ga4: '',            // Google Analytics 4, ex.: 'G-XXXXXXXXXX' (use só se não usar o GTM)
    metaPixel: '',      // Meta Pixel, ex.: '123456789012345'
    googleSiteVerification: '', // Search Console (método "tag HTML"): só o valor de content
    bingSiteVerification: '',   // Bing Webmaster Tools: só o valor de content
  },
};

// --------------------------------------------------------------- fotos ---
// Fotos reais enviadas pela Na Montanha (versões web em src/assets/img).
// "alt" descreve exatamente o que aparece na foto.
export const photos = {
  sonhosEntardecer: {
    id: 'cabana-dos-sonhos-entardecer',
    alt: 'Cabana dos Sonhos ao entardecer: fachada em A com vidro do chão ao topo, deck de madeira e jardim com luminárias baixas, em Igrejinha, na Serra Gaúcha.',
  },
  // Mesma foto, recortada na vertical para o topo da página no celular.
  sonhosRetrato: {
    id: 'cabana-dos-sonhos-entardecer-retrato',
    alt: 'Cabana dos Sonhos ao entardecer: fachada em A com vidro do chão ao topo, deck de madeira e jardim com luminárias baixas, em Igrejinha, na Serra Gaúcha.',
  },
  cabanaDia: {
    id: 'cabana-dia-deck',
    alt: 'Cabana em A da Na Montanha Eco Space, com telhado cor de terra, fachada de vidro e deck de madeira sob céu azul, cercada de mata.',
  },
  cabanaNoite: {
    id: 'cabana-noite',
    alt: 'Cabana em A iluminada por dentro à noite, com cortinas claras no mezanino e caminho de pedras no gramado.',
  },
  salaLareira: {
    id: 'sala-lareira',
    alt: 'Sala de cabana com paredes de madeira, sofá cinza com almofadas azuis, lareira preta e porta de vidro aberta para o deck e o jardim.',
  },
  quartoBanheira: {
    id: 'quarto-banheira',
    alt: 'Quarto sob o telhado em A, com cama de casal, banheira junto à janela com cortinas brancas, roupão pendurado e TV na parede de madeira.',
  },
  videoPoster: {
    id: 'cabana-dos-sonhos-video',
    alt: 'Cabana dos Sonhos ao entardecer, primeiro quadro do vídeo de apresentação.',
  },
};

// ------------------------------------------------------------ cabanas ---
// Mensagens de WhatsApp exatamente como pedidas pela Na Montanha.
//
// ATENÇÃO — CONFIRMAR QUAL FOTO É DE QUAL CABANA:
//   • Cabana dos Sonhos: confirmada. A placa "SONHOS" aparece na foto do
//     entardecer, e o vídeo do Flow foi feito com a sala e o quarto
//     (por isso "interiores" foi atribuído a ela).
//   • Cabana do Amor e Cabana da Pedra: as fotos recebidas não vieram
//     identificadas. A foto noturna foi atribuída provisoriamente ao Amor e a
//     foto diurna (telhado cor de terra) à Pedra. Troque o campo "photo" se
//     estiver invertido — o texto "lead" descreve a foto, então troque junto.
export const cabins = [
  {
    key: 'sonhos',
    name: 'Cabana dos Sonhos',
    slug: 'cabana-dos-sonhos',
    numeral: 'I',
    photo: 'quartoBanheira',
    exterior: 'sonhosEntardecer',
    interiors: ['salaLareira', 'quartoBanheira'],
    photoConfirmed: true,
    hasVideo: true,
    tagline: 'Para dormir sob o telhado em A.',
    lead: 'Quarto no alto da cabana, banheira junto à janela e a mata do outro lado do vidro. É a cabana do vídeo logo abaixo.',
    pageIntro:
      'A Cabana dos Sonhos é uma das três cabanas da Na Montanha Eco Space, no Alto da Pedra, em Igrejinha, na Serra Gaúcha, perto de Gramado. Fachada em A, vidro do chão ao topo e um quarto sob o telhado, com banheira junto à janela.',
    message: 'Olá! Conheci a Cabana dos Sonhos pelo site da Na Montanha Eco Space e gostaria de consultar disponibilidade.',
    metaTitle: 'Cabana dos Sonhos | Na Montanha Eco Space, Igrejinha (RS)',
    metaDescription:
      'Cabana dos Sonhos: cabana em A com fachada de vidro e banheira junto à janela, em Igrejinha, na Serra Gaúcha, perto de Gramado. Consulte datas pelo WhatsApp.',
    // Links de anúncio desta cabana (CONFIRMAR). Vazio = não aparece.
    listings: { airbnb: '', booking: '', expedia: '' },
  },
  {
    key: 'amor',
    name: 'Cabana do Amor',
    slug: 'cabana-do-amor',
    numeral: 'II',
    photo: 'cabanaNoite',
    exterior: 'cabanaNoite',
    interiors: [],
    photoConfirmed: false, // CONFIRMAR foto
    hasVideo: false,
    tagline: 'O nome já diz quase tudo.',
    lead: 'Quando a noite cai, a luz acende por dentro do A-frame e a cabana vira o centro da paisagem. Para chegar sem pressa e ir embora querendo voltar.',
    pageIntro:
      'A Cabana do Amor é uma das três cabanas da Na Montanha Eco Space, no Alto da Pedra, em Igrejinha, na Serra Gaúcha, perto de Gramado. Uma cabana em A cercada de verde, para dias sem relógio.',
    message: 'Olá! Conheci a Cabana do Amor pelo site da Na Montanha Eco Space e gostaria de consultar disponibilidade.',
    metaTitle: 'Cabana do Amor | Na Montanha Eco Space, Igrejinha (RS)',
    metaDescription:
      'Cabana do Amor: cabana em A em meio à natureza, em Igrejinha, na Serra Gaúcha, perto de Gramado. Conheça e consulte disponibilidade direto pelo WhatsApp.',
    listings: { airbnb: 'https://www.airbnb.com.br/h/cabanadoamor-ao-lado-de-gramado-rs', booking: '', expedia: '' }, // CONFIRMAR
  },
  {
    key: 'pedra',
    name: 'Cabana da Pedra',
    slug: 'cabana-da-pedra',
    numeral: 'III',
    photo: 'cabanaDia',
    exterior: 'cabanaDia',
    interiors: [],
    photoConfirmed: false, // CONFIRMAR foto
    hasVideo: false,
    tagline: 'Deck de madeira, vidro e a serra ao fundo.',
    lead: 'Telhado cor de terra, deck aberto para o verde e uma fachada de vidro que deixa a paisagem entrar. Para quem gosta de acordar e olhar longe.',
    pageIntro:
      'A Cabana da Pedra é uma das três cabanas da Na Montanha Eco Space, no Alto da Pedra, em Igrejinha, na Serra Gaúcha, perto de Gramado. Telhado cor de terra, deck de madeira e fachada de vidro.',
    message: 'Olá! Conheci a Cabana da Pedra pelo site da Na Montanha Eco Space e gostaria de consultar disponibilidade.',
    metaTitle: 'Cabana da Pedra | Na Montanha Eco Space, Igrejinha (RS)',
    metaDescription:
      'Cabana da Pedra: cabana em A com deck de madeira e fachada de vidro, em Igrejinha, na Serra Gaúcha, perto de Gramado. Consulte disponibilidade pelo WhatsApp.',
    listings: { airbnb: 'https://www.airbnb.com.br/rooms/1202508571088553357', booking: '', expedia: '' }, // CONFIRMAR
  },
];

export const generalMessage =
  'Olá! Conheci a Na Montanha Eco Space pelo site e gostaria de mais informações sobre as cabanas.';
export const locationMessage =
  'Olá! Gostaria de receber a localização exata da Na Montanha Eco Space.';
export const availabilityMessage =
  'Olá! Conheci a Na Montanha Eco Space pelo site e gostaria de consultar disponibilidade.';

// ---------------------------------------------------------- experiência ---
// Frases curtas ligadas a fotos reais. Só descrevem o que a foto mostra.
// home: true = aparece também na página inicial (as demais ficam em
// /experiencias/, para não repetir demais as poucas fotos recebidas).
export const experience = [
  {
    label: 'Arquitetura',
    photo: 'sonhosEntardecer',
    home: true,
    text: 'Telhado em A e vidro do chão ao topo. A paisagem entra pela frente da cabana.',
  },
  {
    label: 'Conforto',
    photo: 'salaLareira',
    home: true,
    text: 'Madeira por dentro, mata do lado de fora e uma lareira para as noites frias da serra.',
  },
  {
    label: 'Detalhes',
    photo: 'quartoBanheira',
    home: true,
    text: 'Uma banheira diante da janela, sob o telhado em A. O roupão já está esperando.',
  },
  {
    label: 'Natureza',
    photo: 'cabanaDia',
    home: false,
    text: 'De dia, o verde em volta, o deck de madeira e a serra ao fundo.',
  },
  {
    label: 'Noite',
    photo: 'cabanaNoite',
    home: false,
    text: 'Quando escurece, a cabana acende por dentro e o resto do mundo fica do lado de fora.',
  },
];

// ---------------------------------------------------------------- FAQ ---
// Respostas factuais. Também viram schema FAQPage na página inicial.
export const faq = [
  {
    q: 'Onde fica a Na Montanha Eco Space?',
    a: 'Em Igrejinha, no Rio Grande do Sul, na Serra Gaúcha. O endereço é Rua Edgar Willy Wolff, Serra Grande, Alto da Pedra — junto à subida do parque —, Igrejinha - RS, CEP 95650-000.',
  },
  {
    q: 'A Na Montanha Eco Space fica perto de Gramado?',
    a: 'Sim. A Na Montanha fica em Igrejinha, na região próxima de Gramado — não dentro de Gramado. É uma boa base para quem quer natureza e silêncio com Gramado por perto.',
  },
  {
    q: 'Quais cabanas fazem parte da Na Montanha Eco Space?',
    a: 'São três: a Cabana dos Sonhos, a Cabana do Amor e a Cabana da Pedra. Cada uma tem uma página própria aqui no site.',
  },
  {
    q: 'Como consultar disponibilidade?',
    a: 'Pelo WhatsApp (51) 99909-7337. Na seção “Reservar”, toque na cabana desejada: a conversa abre com a mensagem pronta e, se você informar as datas, elas vão junto.',
  },
  {
    q: 'Posso fazer uma reserva diretamente?',
    a: 'Sim. A reserva pode ser combinada diretamente com a Na Montanha Eco Space, pelo WhatsApp, sem intermediários. A Na Montanha também está no Airbnb, no Booking e na Expedia, para quem preferir.',
  },
  {
    q: 'Como entrar em contato pelo WhatsApp?',
    a: 'Toque em qualquer botão “Consultar disponibilidade” ou chame no (51) 99909-7337. O link abre o WhatsApp da Na Montanha com uma mensagem pronta.',
  },
];
