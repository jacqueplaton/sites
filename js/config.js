/* ==========================================================================
   DELÍCIAS BRASIL FLORIDA — dados do negócio
   --------------------------------------------------------------------------
   Este é o único arquivo que precisa ser editado quando um dado do
   restaurante mudar (telefone, avaliação, horário). Tudo no site lê daqui.

   Campos com valor `null` são tratados como NÃO CONFIRMADOS: o site esconde
   a informação em vez de inventar um valor. Veja o README.md.
   ========================================================================== */

const SITE = {
  /* ---- Identidade -------------------------------------------------- */
  name: 'Delícias Brasil Florida',

  /* ---- Contato (CONFIRMADO) ---------------------------------------- */
  phone: '+1 954-709-0444',
  phoneHref: 'tel:+19547090444',
  whatsapp: 'https://wa.me/message/GTMFZXJFUWJLM1',
  instagram: 'https://www.instagram.com/deliciasbrasilflorida/',
  googleSearch: 'https://www.google.com/search?q=Delicias+Brasil+Florida',

  /* ---- Endereço (CONFIRMADO) --------------------------------------- */
  street: '5391 N Federal Hwy',
  city: 'Pompano Beach',
  state: 'FL',
  zip: '33064',
  country: 'United States',
  get addressFull() {
    return `${this.street}, ${this.city}, ${this.state} ${this.zip}`;
  },
  mapsDirections:
    'https://www.google.com/maps/dir/?api=1&destination=' +
    encodeURIComponent('5391 N Federal Hwy, Pompano Beach, FL 33064'),
  mapsEmbed:
    'https://www.google.com/maps?q=' +
    encodeURIComponent('5391 N Federal Hwy, Pompano Beach, FL 33064') +
    '&output=embed',

  /* ---- Faixa de preço (INFORMADO pelo cliente) --------------------- */
  priceRange: '$10–20',

  /* ---- Avaliação do Google ----------------------------------------------
     PENDENTE DE VERIFICAÇÃO. Os números abaixo foram informados pelo
     cliente e não puderam ser conferidos automaticamente.
     Confira em: https://www.google.com/search?q=Delicias+Brasil+Florida
     Para esconder o selo de avaliação do site, troque `rating` por null.
     -------------------------------------------------------------------- */
  rating: 5.0,
  ratingCount: 11,

  /* ---- Horário de funcionamento -----------------------------------------
     NÃO CONFIRMADO. Enquanto `hours` for null, o site mostra
     "consulte pelo WhatsApp" no lugar do horário — de propósito.

     Ao confirmar, troque null por uma lista assim (24h, formato "HH:MM"):

       hours: [
         { days: [1,2,3,4,5], open: '10:00', close: '20:00' },
         { days: [6],         open: '10:00', close: '18:00' },
         { days: [0],         open: null,    close: null    }  // fechado
       ],

     0 = domingo, 1 = segunda ... 6 = sábado.
     Depois disso, adicione também o bloco openingHoursSpecification no
     JSON-LD do index.html (está comentado lá, procure por "HORÁRIO").
     -------------------------------------------------------------------- */
  hours: null
};
