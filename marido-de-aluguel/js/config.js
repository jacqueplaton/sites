/* ==========================================================================
   MARIDO DE ALUGUEL — Natal/RN
   DADOS DO NEGÓCIO
   --------------------------------------------------------------------------
   Este é o arquivo que você abre quando um dado mudar: telefone, horário,
   endereço ou a nota do Google. O site inteiro lê daqui.

   Campos com valor `null` somem da página em vez de mostrar um valor
   inventado. Veja o README.md.
   ========================================================================== */

const SITE = {
  /* ---- Identidade -------------------------------------------------- */
  nome: 'Marido de aluguel',
  chamada: 'Reparos residenciais em Natal',

  /* ---- Telefone e WhatsApp (INFORMADO pelo cliente) -----------------
     `numeroInternacional` é o número no formato que o WhatsApp exige:
     55 (Brasil) + 84 (DDD) + número, sem espaços, traços ou parênteses.
     ------------------------------------------------------------------ */
  telefoneExibicao: '(84) 99978-4287',
  numeroInternacional: '5584999784287',
  get telefoneHref() {
    return 'tel:+' + this.numeroInternacional;
  },

  /* Mensagem que já vem escrita quando o visitante abre o WhatsApp pelo
     botão principal. Os cards de serviço usam a mensagem de baixo. */
  mensagemPadrao:
    'Olá! Vi o site e gostaria de solicitar um orçamento para um serviço em Natal.',
  mensagemPorServico(servico) {
    return `Olá! Vi o site e gostaria de um orçamento para ${servico} em Natal.`;
  },

  /* Monta o link do WhatsApp já com o texto codificado. */
  whatsapp(mensagem) {
    const texto = mensagem || this.mensagemPadrao;
    return `https://wa.me/${this.numeroInternacional}?text=${encodeURIComponent(texto)}`;
  },

  /* ---- Endereço (INFORMADO pelo cliente) ----------------------------
     O número da avenida não foi informado e não deve ser inventado.
     Este endereço é a referência de atendimento — o site não afirma que
     existe loja aberta ao público.
     ------------------------------------------------------------------ */
  rua: 'Av. Rui Barbosa',
  bairro: 'Lagoa Nova',
  cidade: 'Natal',
  estado: 'RN',
  cep: '59073-070',
  get enderecoCompleto() {
    return `${this.rua} — ${this.bairro}, ${this.cidade}/${this.estado}, CEP ${this.cep}`;
  },

  /* ---- Horário (INFORMADO pelo cliente) ----------------------------- */
  horario: 'Segunda a sexta, das 8h às 22h',
  horarioFimDeSemana: 'Sábado e domingo: fechado',

  /* ---- Avaliação do Google ------------------------------------------
     Números confirmados pelo cliente para esta apresentação.
     Quando a nota mudar no Google, atualize aqui — o selo do site lê daqui.
     Para esconder o selo de avaliação, troque `nota` por null.
     ------------------------------------------------------------------ */
  nota: 4.8,
  qtdAvaliacoes: 43
};
