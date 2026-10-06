// ==========================================================================
// DADOS DO SITE — Cabanas do Alto
// --------------------------------------------------------------------------
// Tudo o que o site afirma sai deste arquivo. Cada informação foi checada
// (ver ../PESQUISA.md). Ao mudar algo aqui, rode `node fonte/gerar.mjs`
// para regenerar as páginas.
//
// Regra da casa: se não estiver confirmado, não entra.
// ==========================================================================

// --------------------------------------------------------------------------
// Endereço público do site. Usado só nas URLs absolutas (canonical, Open
// Graph, sitemap, JSON-LD). Na Netlify o build preenche sozinho.
// --------------------------------------------------------------------------
function urlDoAmbiente() {
  const e = process.env;
  if (e.URL_SITE) return e.URL_SITE;
  if (e.NETLIFY) return e.CONTEXT === 'production' ? e.URL : (e.DEPLOY_PRIME_URL || e.URL);
  return 'https://jacqueplaton.github.io/sites/cabanas-do-alto';
}

export const site = {
  nome: 'Cabanas do Alto',
  urlBase: urlDoAmbiente().replace(/\/$/, ''),

  // false = páginas saem com <meta name="robots" content="noindex">.
  // Mude para true só quando o site estiver no domínio oficial.
  indexar: process.env.INDEXAR === 'true' || false,

  // WhatsApp de reservas. Validado em 06/10/2026 (ver PESQUISA.md, seção 1).
  // Formato: 55 + DDD + número, só dígitos.
  whatsapp: '5512991022087',
  telefoneExibicao: '(12) 99102-2087',
  telefoneSchema: '+55-12-99102-2087',

  instagram: 'https://www.instagram.com/cabanasdoalto/',
  instagramUsuario: '@cabanasdoalto',

  endereco: {
    linha: 'Estrada Cunha–Paraty (SP-171), km 55',
    cidade: 'Cunha',
    uf: 'SP',
    cep: '12530-000',
    pais: 'BR',
  },
  mapa: 'https://www.google.com/maps/search/?api=1&query=Cabanas%20do%20Alto%20Cunha%20SP',
  avaliacoesGoogle: 'https://www.google.com/maps/search/?api=1&query=Cabanas%20do%20Alto%20Cunha%20SP',

  checkin: '14:00',
  checkout: '12:00',
  ano: 2026,
};

// --------------------------------------------------------------------------
// Mensagens de WhatsApp
// --------------------------------------------------------------------------
export const mensagens = {
  geral: 'Olá! Conheci as Cabanas do Alto pelo site e gostaria de consultar disponibilidade.',
  cabana: (nome) =>
    `Olá! Conheci a Cabana ${nome} pelo site das Cabanas do Alto e gostaria de consultar disponibilidade e valores.`,
  experiencias:
    'Olá! Conheci as Cabanas do Alto pelo site e gostaria de saber mais sobre as experiências (flores, massagem, cesta de café da manhã, terapias ou oficina de cerâmica).',
};

export function linkWhatsApp(texto) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(texto)}`;
}

// --------------------------------------------------------------------------
// AS SEIS CABANAS
// --------------------------------------------------------------------------
// filtros: usados no "qual cabana combina com você" e na tabela.
// comodidades: só o que consta nos anúncios. Grupo vazio = não aparece.
// avaliacoes.minimo: menor número de avaliações visto no Airbnb (só cresce).
// --------------------------------------------------------------------------
export const cabanas = [
  {
    slug: 'bigua',
    nome: 'Biguá',
    numero: '01',
    airbnb: 'https://www.airbnb.com.br/rooms/650784957881748335',
    hospedes: 2,
    quartos: '1',
    camas: 'Cama king',
    tese: 'A mais avaliada da casa.',
    resumo: 'Ar-condicionado e aquecedor, banheira para dois e um deck aberto para as estrelas.',
    paraQuem: 'Para dois',
    filtros: { banheira: true, lareira: false, ar: true, rede: true },
    tabela: {
      camas: 'King',
      banheira: 'Para dois',
      aquecimento: 'Aquecedor',
      ar: 'Sim',
      rede: 'Sim',
      fogo: 'Sim',
      churrasqueira: '—',
      vista: 'Mantiqueira',
    },
    seo: {
      title: 'Cabana Biguá: A-frame para casal em Cunha-SP | Cabanas do Alto',
      description:
        'A cabana mais avaliada das Cabanas do Alto: cama king, ar-condicionado, banheira para dois e deck de frente para a Mantiqueira. Para 2 hóspedes, em Cunha-SP.',
    },
    intro: [
      'A Biguá é a cabana com mais avaliações das Cabanas do Alto: são mais de cem no Airbnb, com nota acima de 4,9. É uma A-frame para dois, com quarto de cama king e uma poltrona voltada para a vista.',
      'É também a mais preparada para qualquer estação. Tem ar-condicionado para os dias quentes e aquecedor para as noites de inverno, que em Cunha chegam perto de zero. Lá fora ficam a rede, o fogo de chão e um deck de madeira aberto para a serra e, à noite, para as estrelas.',
    ],
    idealPara: [
      'Casais que querem conforto térmico em qualquer época do ano',
      'Quem prefere a cabana mais testada pelos hóspedes',
      'Noites de céu limpo, no deck',
    ],
    comodidades: {
      Dormir: ['Quarto com cama king', 'Poltrona voltada para a vista'],
      Banho: ['Banheira para dois', 'Banheiro privativo'],
      Cozinha: ['Cozinha equipada com utensílios'],
      Clima: ['Ar-condicionado', 'Aquecedor na sala'],
      'Lá fora': ['Deck de madeira', 'Rede', 'Fogo de chão'],
    },
    avaliacoes: { minimo: 100, nota: '4,9' },
    foto: 'vista-aerea',
  },
  {
    slug: 'pitangua',
    nome: 'Pitanguá',
    numero: '02',
    airbnb: 'https://www.airbnb.com.br/rooms/670478574861939656',
    hospedes: 3,
    quartos: '1',
    camas: 'Cama king e sofá-cama',
    tese: 'O mar de morros, com o Lavandário ao lado.',
    resumo: 'Cama king e sofá-cama, rede, fogo de chão e um canto para trabalhar.',
    paraQuem: 'Até três',
    filtros: { banheira: false, lareira: false, ar: false, rede: true },
    tabela: {
      camas: 'King + sofá-cama',
      banheira: '—',
      aquecimento: 'Aquecedor',
      ar: '—',
      rede: 'Sim',
      fogo: 'Sim',
      churrasqueira: '—',
      vista: 'Vale e Mantiqueira',
    },
    seo: {
      title: 'Cabana Pitanguá, ao lado do Lavandário em Cunha-SP | Cabanas do Alto',
      description:
        'A-frame para até 3 hóspedes, ao lado do Lavandário, com vista para o mar de morros e a Mantiqueira. Cama king, sofá-cama, rede e fogo de chão. Cunha-SP.',
    },
    intro: [
      'A Pitanguá olha para o vale: um mar de morros que se estende até a Serra da Mantiqueira. É uma A-frame de quarto único, com cama king, e um sofá-cama na sala que permite receber até três pessoas.',
      'Do lado de fora, rede e fogo de chão. Bem ao lado fica o Lavandário de Cunha, com campos de lavanda, destilaria, café e loja. A cabana tem ainda um espaço de trabalho, para quem precisa abrir o computador de vez em quando.',
    ],
    idealPara: [
      'Casais, ou casal com mais uma pessoa',
      'Quem quer o Lavandário logo ao lado',
      'Estadias mais longas, com um dia ou outro de trabalho',
    ],
    comodidades: {
      Dormir: ['Quarto com cama king', 'Sofá-cama na sala'],
      Banho: ['Banheiro privativo'],
      Cozinha: ['Cozinha equipada', 'Mesa de jantar'],
      Clima: ['Aquecedor'],
      'Lá fora': ['Rede', 'Fogo de chão'],
      Trabalho: ['Espaço de trabalho'],
    },
    avaliacoes: { minimo: 80, nota: '4,8' },
    foto: 'deck-cadeiras',
  },
  {
    slug: 'indaia',
    nome: 'Indaiá',
    numero: '03',
    airbnb: 'https://www.airbnb.com.br/rooms/667929421079667935',
    hospedes: 3,
    quartos: '1, no mezanino',
    camas: 'Cama king e sofá-cama',
    tese: 'Hidromassagem ao ar livre, de frente para a Mantiqueira.',
    resumo: 'Lareira, mezanino com cama king, cozinha completa e churrasqueira.',
    paraQuem: 'Até três',
    filtros: { banheira: true, lareira: true, ar: false, rede: true },
    tabela: {
      camas: 'King + sofá-cama',
      banheira: 'Hidromassagem externa',
      aquecimento: 'Lareira',
      ar: '—',
      rede: 'Sim',
      fogo: 'Sim',
      churrasqueira: 'Sim',
      vista: 'Mantiqueira',
    },
    seo: {
      title: 'Cabana Indaiá, com hidromassagem e lareira em Cunha-SP | Cabanas do Alto',
      description:
        'Hidromassagem ao ar livre de frente para a Mantiqueira, lareira, mezanino com cama king e cozinha completa. A-frame para até 3 hóspedes em Cunha-SP.',
    },
    intro: [
      'A Indaiá é a cabana de quem quer tudo à mão. Embaixo, um sofá-cama e uma poltrona diante da lareira; no mezanino, a cama king e uma smart TV. A cozinha é completa, com geladeira, cooktop de indução e forno elétrico.',
      'O deck é amplo, com mesa para comer ao ar livre, churrasqueira, fogo de chão e redes. A hidromassagem fica ali fora, voltada para a Serra da Mantiqueira.',
    ],
    idealPara: [
      'Casais que querem banheira ao ar livre e lareira na mesma viagem',
      'Até três pessoas',
      'Quem gosta de cozinhar durante a viagem',
    ],
    comodidades: {
      Dormir: ['Cama king no mezanino', 'Sofá-cama na sala', 'Roupões'],
      Banho: ['Hidromassagem externa, com vista para a serra', 'Banheiro completo'],
      Cozinha: ['Geladeira, cooktop de indução e forno elétrico', 'Churrasqueira'],
      Clima: ['Lareira'],
      'Lá fora': ['Deck amplo com mesa', 'Redes', 'Fogo de chão'],
      Sala: ['Smart TV no mezanino'],
    },
    avaliacoes: { minimo: 70, nota: '4,9' },
    foto: 'banheira-deck',
  },
  {
    slug: 'tuim',
    nome: 'Tuim',
    numero: '04',
    airbnb: 'https://www.airbnb.com.br/rooms/908089552075176127',
    hospedes: 4,
    quartos: '2',
    camas: 'Cama king e duas de solteiro',
    tese: 'A única para quatro, com o pôr do sol visto da banheira.',
    resumo: 'Dois quartos, lareira e um deck grande com redes, churrasqueira e fogo de chão.',
    paraQuem: 'Até quatro',
    filtros: { banheira: true, lareira: true, ar: false, rede: true },
    tabela: {
      camas: 'King + 2 de solteiro',
      banheira: 'Com vista para o pôr do sol',
      aquecimento: 'Lareira',
      ar: '—',
      rede: 'Sim',
      fogo: 'Sim',
      churrasqueira: 'Sim',
      vista: 'Mar de morros e pôr do sol',
    },
    seo: {
      title: 'Cabana Tuim: dois quartos, até 4 pessoas, em Cunha-SP | Cabanas do Alto',
      description:
        'A única cabana para quatro: dois quartos, lareira, banheira com vista para o pôr do sol e deck com redes, churrasqueira e fogo de chão. Cunha-SP.',
    },
    intro: [
      'A Tuim é a cabana para viajar em família ou com amigos. São dois ambientes de dormir: um quarto no térreo com duas camas de solteiro e o mezanino com cama king.',
      'Na sala, sofá, poltrona, smart TV e lareira. A cozinha tem cooktop, forno elétrico e frigobar. Lá fora, um deck grande com mesa, espreguiçadeiras, redes, churrasqueira e fogo de chão. No fim da tarde, o pôr do sol sobre o mar de morros, visto de dentro da banheira.',
    ],
    idealPara: [
      'Famílias com crianças',
      'Amigos viajando juntos',
      'Casais que querem mais espaço',
    ],
    comodidades: {
      Dormir: ['Dois quartos', 'Cama king no mezanino', 'Duas camas de solteiro no térreo', 'Roupões'],
      Banho: ['Banheira com vista para o pôr do sol'],
      Cozinha: ['Cooktop, forno elétrico e frigobar', 'Churrasqueira'],
      Clima: ['Lareira'],
      'Lá fora': ['Deck amplo com mesa e espreguiçadeiras', 'Redes', 'Fogo de chão'],
      Sala: ['Sofá, poltrona e smart TV'],
    },
    avaliacoes: { minimo: 35, nota: '4,9' },
    foto: 'vista-aerea',
  },
  {
    slug: 'curio',
    nome: 'Curió',
    numero: '05',
    airbnb: 'https://www.airbnb.com.br/rooms/1052099586429492234',
    hospedes: 2,
    quartos: '1',
    camas: 'Cama king',
    tese: 'Lareira dentro, hidromassagem lá fora.',
    resumo: 'Uma cabana para dois, com a área externa cercada de natureza e privacidade.',
    paraQuem: 'Para dois',
    filtros: { banheira: true, lareira: true, ar: false, rede: false },
    tabela: {
      camas: 'King',
      banheira: 'Hidromassagem externa',
      aquecimento: 'Lareira',
      ar: '—',
      rede: '—',
      fogo: '—',
      churrasqueira: '—',
      vista: 'Mantiqueira e pôr do sol',
    },
    seo: {
      title: 'Cabana Curió: hidromassagem e lareira para dois em Cunha-SP | Cabanas do Alto',
      description:
        'Para dois: lareira diante do sofá, cama king e hidromassagem na área externa, cercada de natureza. Vista para a Serra da Mantiqueira, em Cunha-SP.',
    },
    intro: [
      'A Curió foi pensada para dois. Dentro, a lareira fica de frente para o sofá e o quarto tem cama king. Fora, a hidromassagem fica na área externa, cercada de natureza e com privacidade.',
      'A vista é a que dá nome à casa: a Serra da Mantiqueira, com a Serra Fina, o Pico dos Marins e o Itaguaré ao fundo. Nas avaliações, os hóspedes destacam o pôr do sol visto da cabana.',
    ],
    idealPara: [
      'Casais',
      'Aniversários, pedidos e datas especiais',
      'Viagens de inverno, com lareira',
    ],
    comodidades: {
      Dormir: ['Quarto com cama king'],
      Banho: ['Hidromassagem na área externa', 'Banheiro privativo'],
      Cozinha: ['Cozinha'],
      Clima: ['Lareira diante do sofá'],
      'Lá fora': ['Área externa cercada de natureza'],
    },
    avaliacoes: { minimo: 45, nota: '4,9' },
    foto: 'deck-cadeiras',
  },
  {
    slug: 'taua',
    nome: 'Tauá',
    numero: '06',
    airbnb: 'https://www.airbnb.com.br/rooms/1371154919037285997',
    hospedes: 2,
    quartos: '1',
    camas: 'Cama king',
    tese: 'Rede suspensa sobre o deck, olhando para a Serra do Mar.',
    resumo: 'Banheira de imersão ao ar livre, lareira, ar-condicionado e cortina blackout.',
    paraQuem: 'Para dois',
    filtros: { banheira: true, lareira: true, ar: true, rede: true },
    tabela: {
      camas: 'King',
      banheira: 'Imersão, no deck',
      aquecimento: 'Lareira',
      ar: 'Sim',
      rede: 'Suspensa e de balanço',
      fogo: 'Sim',
      churrasqueira: 'Sim',
      vista: 'Serra do Mar e Bocaina',
    },
    seo: {
      title: 'Cabana Tauá: rede suspensa e vista para a Serra do Mar | Cabanas do Alto',
      description:
        'Rede suspensa sobre o deck, banheira de imersão ao ar livre, lareira e ar-condicionado, com vista para a Serra do Mar e a Bocaina. Para dois, em Cunha-SP.',
    },
    intro: [
      'A Tauá tem a vista voltada para o Parque Estadual da Serra do Mar e para a Serra da Bocaina, o lado da serra que desce para Paraty.',
      'O deck é o centro da casa: rede suspensa, rede de balanço, churrasqueira, fogo de chão e uma banheira de imersão ao ar livre. Dentro, poltronas diante da lareira, cozinha compacta com geladeira, cooktop, forno e cafeteira, e um quarto com cama king, ar-condicionado e cortina blackout.',
    ],
    idealPara: [
      'Casais',
      'Quem quer passar o dia no deck',
      'Quem dorme melhor no escuro total',
    ],
    comodidades: {
      Dormir: ['Cama king', 'Cortina blackout', 'Smart TV no quarto'],
      Banho: ['Banheira de imersão no deck', 'Chuveiro quente e secador'],
      Cozinha: ['Geladeira, cooktop, forno elétrico e cafeteira', 'Churrasqueira'],
      Clima: ['Lareira', 'Ar-condicionado'],
      'Lá fora': ['Rede suspensa', 'Rede de balanço', 'Fogo de chão', 'Deck amplo'],
    },
    avaliacoes: null,
    foto: 'banheira-deck',
  },
];

// Comum a todas as cabanas (confirmado no conjunto dos anúncios).
export const emTodas = ['Cozinha', 'Roupa de cama', 'Wi-Fi', 'Estacionamento', 'Self check-in'];

// --------------------------------------------------------------------------
// Fotos reais recebidas. Nenhuma está atribuída a uma cabana específica:
// as legendas descrevem a cena, não o nome da cabana.
// --------------------------------------------------------------------------
export const fotos = {
  'vista-aerea': {
    larguras: [480, 800, 1200], w: 1200, h: 800,
    alt: 'Vista aérea de uma cabana A-frame das Cabanas do Alto, com deck, banheira ao ar livre, fogo de chão e rede, na encosta entre árvores em Cunha',
    legenda: 'Uma das cabanas, vista de cima: deck, banheira ao ar livre, fogo de chão e rede.',
  },
  'banheira-deck': {
    larguras: [480, 800, 1200], w: 1200, h: 800,
    alt: 'Banheira de imersão branca sobre o deck de madeira, diante de uma cabana A-frame com porta de vidro, ao fim da tarde',
    legenda: 'Banheira de imersão no deck, ao ar livre.',
  },
  'deck-cadeiras': {
    larguras: [480, 800, 1200], w: 1200, h: 900,
    alt: 'Fachada triangular de madeira de uma cabana A-frame, com duas cadeiras de corda laranja e um braseiro no deck, sob céu azul',
    legenda: 'O deck no fim da tarde, com braseiro e cadeiras.',
  },
  'cabana-dia': {
    larguras: [512], w: 512, h: 512,
    alt: 'Cabana A-frame com fachada envidraçada e deck com cadeiras de madeira, sob céu azul com nuvens',
    legenda: 'Manhã de céu aberto.',
  },
  'cabana-noite': {
    larguras: [512], w: 512, h: 512,
    alt: 'Cabana A-frame iluminada por dentro à noite, com sala, escada para o mezanino e fachada de vidro',
    legenda: 'A cabana acesa, à noite.',
  },
  'via-lactea': {
    larguras: [512], w: 512, h: 512,
    alt: 'Cabana A-frame sob a Via Láctea, com deck iluminado, garrafa de vinho e taça sobre a mesa',
    legenda: 'A Via Láctea sobre o deck.',
  },
};

// --------------------------------------------------------------------------
// EXPERIÊNCIAS — contratadas à parte, depois da reserva.
// confirmada: false = informada pela hospedagem, sem fonte pública.
// --------------------------------------------------------------------------
export const experiencias = [
  {
    titulo: 'Flores na cabana',
    texto: 'Uma florista parceira decora a cabana conforme a ocasião: aniversário, pedido de casamento, lua de mel ou só a vontade de chegar e encontrar flores.',
    confirmada: true,
  },
  {
    titulo: 'Massagem',
    texto: 'A hospedagem indica massoterapeutas da região para uma sessão durante a estadia.',
    confirmada: true,
  },
  {
    titulo: 'Cesta de café da manhã',
    texto: 'O café não está incluído na diária, mas pode ser encomendado com antecedência para começar o dia sem sair da cabana.',
    confirmada: true,
  },
  {
    titulo: 'Terapias',
    texto: 'Sessões com terapeutas parceiros da região, durante a estadia.',
    confirmada: false,
  },
  {
    titulo: 'Oficina de cerâmica',
    texto: 'Cunha é conhecida pela cerâmica de alta temperatura. Pergunte pela possibilidade de uma oficina durante a viagem.',
    confirmada: false,
  },
];

// --------------------------------------------------------------------------
// ARREDORES — distâncias a partir do km 55 da SP-171.
// km: posição na estrada (para o mapa linear). null = fora da SP-171.
// --------------------------------------------------------------------------
export const arredores = [
  {
    km: 47, marca: '~10 km', nome: 'Centro de Cunha',
    texto: 'O centro da cidade e os ateliês de cerâmica de alta temperatura, que deram fama a Cunha.',
  },
  {
    km: 54.7, marca: 'Vizinho', nome: 'Lavandário de Cunha',
    texto: 'Campos de lavanda, destilaria própria, café e loja. Abre em dias definidos no calendário de visitação.',
  },
  { km: 55, marca: 'km 55', nome: 'Cabanas do Alto', aqui: true, texto: '' },
  {
    km: 56.5, marca: 'km 56,5', nome: 'Parque Estadual da Serra do Mar — Núcleo Cunha',
    texto: 'Trilhas e cachoeiras em mata de neblina. O acesso tem cerca de 20 km de estrada de terra, e a visita é com agendamento.',
  },
  {
    km: 65, marca: '~10 km', nome: 'Pedra da Macela',
    texto: 'A 1.840 m, o ponto mais alto da região, famoso pelo nascer do sol com vista para Paraty e a Ilha Grande. Estrada de terra e cerca de 2 km de subida a pé.',
  },
  {
    km: null, marca: '~40 km', nome: 'Paraty',
    texto: 'O centro histórico, descendo a serra pela estrada que continua do lado fluminense.',
  },
];

// --------------------------------------------------------------------------
// PERGUNTAS FREQUENTES — a mesma lista vira o bloco FAQPage do JSON-LD.
// --------------------------------------------------------------------------
export const perguntas = [
  {
    p: 'Onde ficam as Cabanas do Alto?',
    r: 'Na Estrada Cunha–Paraty (SP-171), km 55, em Cunha (SP), dentro de um condomínio de chácaras. Ficam a cerca de 10 km do centro de Cunha, ao lado do Lavandário, e a cerca de 40 km de Paraty.',
  },
  {
    p: 'Quantas cabanas são e quantas pessoas cada uma recebe?',
    r: 'São seis cabanas em estilo A-frame. Biguá, Curió e Tauá recebem 2 hóspedes; Pitanguá e Indaiá, até 3; a Tuim, com dois quartos, recebe até 4.',
  },
  {
    p: 'Quais cabanas têm banheira ou hidromassagem?',
    r: 'Indaiá e Curió têm hidromassagem na área externa; a Tauá tem banheira de imersão no deck; a Tuim tem banheira com vista para o pôr do sol; e a Biguá tem banheira para dois.',
  },
  {
    p: 'Qual é a melhor cabana para casal?',
    r: 'Biguá, Curió e Tauá são feitas para dois. A Biguá tem ar-condicionado e é a mais avaliada; a Curió combina lareira e hidromassagem externa; a Tauá tem rede suspensa e vista para a Serra do Mar. Indaiá e Pitanguá também funcionam bem para casais.',
  },
  {
    p: 'As cabanas têm cozinha? O café da manhã está incluído?',
    r: 'Todas as cabanas têm cozinha. O café da manhã não está incluído na diária, mas é possível encomendar uma cesta de café como serviço adicional.',
  },
  {
    p: 'Faz frio? As cabanas têm aquecimento?',
    r: 'Cunha é estância climática, a cerca de 950 m de altitude, e as noites de inverno podem chegar perto de 0 °C. Indaiá, Tuim, Curió e Tauá têm lareira; Biguá e Pitanguá têm aquecedor. Biguá e Tauá também têm ar-condicionado.',
  },
  {
    p: 'Aceitam pets?',
    r: 'Sim, pets são aceitos mediante consulta prévia, e pode haver taxa adicional. Avise ao consultar as datas.',
  },
  {
    p: 'Como funciona o check-in?',
    r: 'O check-in é autônomo, com senha, a partir das 14h; o check-out é até as 12h. Os detalhes de acesso são enviados depois da reserva.',
  },
  {
    p: 'Tem estacionamento e Wi-Fi?',
    r: 'Sim. Há estacionamento junto às cabanas, sem custo adicional, e Wi-Fi.',
  },
  {
    p: 'Como é o acesso? Precisa de carro 4x4?',
    r: 'Não. Segundo a hospedagem, o acesso é todo pavimentado e pode ser feito com qualquer carro ou moto.',
  },
  {
    p: 'Há restaurantes perto?',
    r: 'Há restaurantes e cafés na região, inclusive o café do Lavandário, ao lado. Como as cabanas têm cozinha, a recomendação é chegar no horário de funcionamento dos restaurantes ou levar mantimentos.',
  },
  {
    p: 'Quais experiências posso contratar?',
    r: 'Decoração com flores, massagem e cesta de café da manhã, além de terapias e oficina de cerâmica sob consulta. Todas são contratadas à parte, depois da reserva, e dependem de disponibilidade.',
  },
  {
    p: 'Como consultar disponibilidade e reservar direto?',
    r: 'Escolha a cabana e as datas no formulário de reserva deste site: ele abre o WhatsApp da hospedagem com a mensagem pronta. A equipe responde com disponibilidade e valores para as suas datas, e a reserva é feita diretamente com as Cabanas do Alto.',
  },
  {
    p: 'Qual a distância de São Paulo e do Rio?',
    r: 'De São Paulo são cerca de 230 km, de 2h30 a 3h, pela Via Dutra até Guaratinguetá e depois pela SP-171. Do Rio de Janeiro, cerca de 3h30 pelo mesmo caminho.',
  },
];
