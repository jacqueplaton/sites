/* ==========================================================================
   COUTINHO PEREIRA ADVOCACIA — dados do escritório
   --------------------------------------------------------------------------
   Este é o único arquivo que precisa ser editado quando um dado mudar
   (telefone, endereço, horário, redes). O site inteiro lê daqui.

   Origem dos dados: ficha do escritório no Google Maps / Google Perfil da
   Empresa. Campos com valor `null` são tratados como NÃO CONFIRMADOS — o
   site esconde a informação em vez de inventar um valor.
   ========================================================================== */

const ESCRITORIO = {
  /* ---- Identidade -------------------------------------------------- */
  nome: 'Coutinho Pereira Advocacia',
  nomeCurto: 'Coutinho Pereira',
  descricao: 'Escritório de advocacia em Natal, Rio Grande do Norte.',

  /* ---- Contato (do Google) ----------------------------------------- */
  telefone: '(84) 2020-2808',
  telefoneHref: 'tel:+558420202808',
  instagram: 'https://www.instagram.com/coutinhopereiraadvocacia/',
  googlePerfil: 'https://www.google.com/search?q=Coutinho+Pereira+Advocacia+Natal',

  /* ---- E-mail ------------------------------------------------------------
     NÃO CONFIRMADO. A ficha do Google não traz e-mail. Ao confirmar, troque
     null pelo endereço — o botão de e-mail aparece sozinho no site.
     Ex.: email: 'contato@coutinhopereira.adv.br'
     -------------------------------------------------------------------- */
  email: null,

  /* ---- WhatsApp ----------------------------------------------------------
     NÃO CONFIRMADO. O número da ficha é fixo, não WhatsApp. Ao confirmar,
     use o formato internacional sem símbolos: 'https://wa.me/5584999999999'.
     -------------------------------------------------------------------- */
  whatsapp: null,

  /* ---- Endereço (do Google) ---------------------------------------- */
  predio: 'Ed. Palatino',
  referencia: 'Torre de Têmis',          // "Localizado em", na ficha do Google
  rua: 'R. Raimundo Chaves, 1570',
  complemento: 'Salas 307 e 308',
  bairro: 'Candelária',
  cidade: 'Natal',
  estado: 'RN',
  cep: '59064-390',
  pais: 'BR',
  get enderecoLinha() {
    return `${this.rua}, ${this.complemento} — ${this.bairro}, ${this.cidade} - ${this.estado}, ${this.cep}`;
  },
  get enderecoBusca() {
    return `${this.predio}, ${this.rua} - ${this.bairro}, ${this.cidade} - ${this.estado}, ${this.cep}`;
  },
  get mapsRota() {
    return 'https://www.google.com/maps/dir/?api=1&destination=' +
      encodeURIComponent(this.enderecoBusca);
  },
  get mapsEmbed() {
    return 'https://www.google.com/maps?q=' +
      encodeURIComponent(this.enderecoBusca) + '&output=embed';
  },

  /* ---- Horário de atendimento (do Google) --------------------------------
     0 = domingo, 1 = segunda ... 6 = sábado. Horas em formato 24 h.
     `abre: null` significa fechado naquele dia.
     O site destaca o dia de hoje e calcula "aberto agora" no fuso de Natal.
     -------------------------------------------------------------------- */
  fuso: 'America/Fortaleza',            // Natal/RN — sem horário de verão
  horario: [
    { dias: [1, 2, 3, 4, 5], abre: '08:00', fecha: '18:00' },
    { dias: [6],             abre: null,    fecha: null    },  // sábado
    { dias: [0],             abre: null,    fecha: null    }   // domingo
  ],

  /* ---- Avaliação no Google -----------------------------------------------
     A nota 5,0 vem da ficha do Google.

     `avaliacoes` (quantidade) ficou como null de propósito: o texto copiado
     da ficha ("5.026 avaliações") é ambíguo — pode ser 26 avaliações com a
     nota 5,0 grudada na frente, ou 5.026 avaliações. Enquanto for null, o
     site mostra só a nota, sem quantidade. Confira em `googlePerfil` e
     preencha com o número (ex.: avaliacoes: 26).

     Para esconder o selo por completo, troque `mostrarNota` por false.
     Publicidade da advocacia é regulada (Provimento nº 205/2021 da OAB):
     exibir a nota é decisão do escritório. Depoimentos de clientes não são
     usados neste site por causa dessa mesma regra.
     -------------------------------------------------------------------- */
  mostrarNota: true,
  nota: 5.0,
  avaliacoes: null
};
