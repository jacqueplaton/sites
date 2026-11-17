// ==========================================================================
// SUTILY MAIS — DADOS DA CLÍNICA
// --------------------------------------------------------------------------
// Este é o ÚNICO arquivo que precisa ser editado para trocar telefone,
// endereço, horários, links do Google e códigos de rastreamento.
// Depois de editar, rode:   node sutily-mais/_build/build.mjs
//
// REGRA: campo vazio ('') = informação ainda não confirmada.
// O site nunca inventa um dado: o que está vazio simplesmente não aparece
// (ou aparece como "a confirmar" enquanto `previa` estiver ligado).
// ==========================================================================

export const site = {
  // true  = versão de aprovação: não é indexada pelo Google (noindex) e mostra
  //         os espaços "a preencher" da biografia e do rodapé.
  // false = versão publicada: indexável, sem nenhum espaço vazio visível.
  previa: true,

  // Endereço final do site, sem barra no fim. Trocar quando o domínio próprio
  // for registrado (ex.: 'https://www.sutilymais.com.br').
  url: 'https://jacqueplaton.github.io/sites/sutily-mais',

  nome: 'Sutily Mais',
  assinatura: 'Clínica Integrada',
  nomeCompleto: 'Sutily Mais — Clínica Integrada',

  // ---------- CONTATO (NAP) — deve ser IDÊNTICO ao Perfil da Empresa no Google
  // WhatsApp só com números, com 55 + DDD. Ex.: '5584999990000'
  whatsapp: '5584981032154',
  // Telefone como aparece no Google. Ex.: '(84) 99999-0000'
  telefone: '',
  email: '',
  endereco: {
    rua: '',              // Ex.: 'Av. Exemplo'  — A CONFIRMAR
    numero: '2874',       // visível na fachada
    complemento: '',
    bairro: 'Nova Parnamirim',
    cidade: 'Parnamirim',
    uf: 'RN',
    cep: '',              // Ex.: '59150-000' — A CONFIRMAR
  },
  // Coordenadas do pino no Google Maps (opcional, melhora o SEO local).
  geo: { lat: null, lng: null },

  // Horários. Deixe a lista vazia enquanto não confirmar.
  // Ex.: { dias: 'Segunda a sexta', horas: '8h às 18h',
  //        schema: { dias: ['Monday','Tuesday','Wednesday','Thursday','Friday'], abre: '08:00', fecha: '18:00' } }
  horarios: [],

  // ---------- GOOGLE
  google: {
    // Link "Compartilhar" do Perfil da Empresa. Ex.: 'https://maps.app.goo.gl/XXXX'
    perfil: '',
    // Link direto para LER as avaliações.
    avaliacoes: '',
    // Link "Pedir avaliações" do Perfil. Ex.: 'https://g.page/r/XXXX/review'
    avaliar: '',
    // Usado só enquanto os links acima estiverem vazios (busca no Maps).
    busca: 'Sutily Clínica Integrada, Nova Parnamirim, Parnamirim - RN',
  },
  instagram: '',          // Ex.: 'https://www.instagram.com/usuario'

  // ---------- PROFISSIONAL RESPONSÁVEL
  // O Código de Ética Odontológica exige nome e número de inscrição no CRO
  // em toda comunicação da clínica. Preencher ANTES de publicar.
  responsavel: {
    nome: 'Joycce Gomes',
    titulo: 'Cirurgiã-dentista',
    cro: '',              // Ex.: 'CRO-RN 0000'
    croClinica: '',       // inscrição da clínica (EPAO), se houver
    formacao: '',         // Formação acadêmica
    experiencia: '',      // Tempo de experiência
    motivo: '',           // Por que criou a clínica
    filosofia: '',        // Filosofia pessoal de atendimento
    marcos: [],           // Ex.: [{ ano: '2015', texto: 'Graduação em Odontologia' }]
  },
  razaoSocial: '',        // para a Política de Privacidade
  cnpj: '',

  // ---------- RASTREAMENTO — nada carrega enquanto o campo estiver vazio
  // e nada carrega antes de o visitante aceitar os cookies.
  rastreamento: {
    gtm: '',                    // 'GTM-XXXXXXX'  (recomendado: GA4, Ads e Pixel dentro do GTM)
    ga4: '',                    // 'G-XXXXXXXXXX' (só se NÃO usar GTM)
    googleAds: '',              // 'AW-XXXXXXXXXX' (só se NÃO usar GTM)
    googleAdsRotuloWhatsapp: '',// rótulo da conversão "clique no WhatsApp"
    metaPixel: '',              // '0000000000000000' (só se NÃO usar GTM)
  },
};
