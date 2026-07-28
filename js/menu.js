/* ==========================================================================
   CARDÁPIO DO DIA
   --------------------------------------------------------------------------
   COMO ATUALIZAR (leva 2 minutos, todo dia):

   1. Troque `updated` para a data de hoje: 'AAAA-MM-DD'.
   2. Edite a lista `items` abaixo.
   3. Salve o arquivo e publique. Pronto.

   REGRAS DOS CAMPOS
   - price: número (ex: 14.5) ou null. Se for null, o preço não aparece.
            Nunca coloque um preço que você não tenha confirmado.
   - available: true (aparece normal) ou false (aparece como "esgotou").
   - image: caminho da foto, ou null para usar só o texto.
   - pt / en: nome e descrição nos dois idiomas.

   IMPORTANTE — `status`
   'placeholder' = mostra um aviso de que o cardápio é ilustrativo.
   'live'        = cardápio real, sem aviso.
   Troque para 'live' depois de colocar os pratos de verdade.
   ========================================================================== */

const MENU = {
  status: 'placeholder',
  updated: '2026-07-28',

  items: [
    {
      id: 'feijoada',
      image: 'media/gallery/cat-feijoada.jpg',
      price: null,
      available: true,
      pt: {
        name: 'Feijoada completa',
        desc: 'Com arroz, couve, farofa e laranja.'
      },
      en: {
        name: 'Full feijoada',
        desc: 'With rice, collard greens, farofa and orange.'
      }
    },
    {
      id: 'marmita',
      image: 'media/gallery/cat-marmitas.jpg',
      price: null,
      available: true,
      pt: {
        name: 'Marmita do dia',
        desc: 'Arroz, feijão, carne e acompanhamentos para levar.'
      },
      en: {
        name: 'Plate of the day',
        desc: 'Rice, beans, meat and sides, packed to go.'
      }
    },
    {
      id: 'costela',
      image: 'media/gallery/cat-costela.jpg',
      price: null,
      available: true,
      pt: {
        name: 'Costela na panela',
        desc: 'Cozida devagar, com arroz, couve e farofa.'
      },
      en: {
        name: 'Slow-cooked ribs',
        desc: 'With rice, collard greens and farofa.'
      }
    },
    {
      id: 'peixe',
      image: 'media/gallery/cat-peixes.jpg',
      price: null,
      available: true,
      pt: {
        name: 'Peixe grelhado',
        desc: 'Com arroz e salada fresca.'
      },
      en: {
        name: 'Grilled fish',
        desc: 'With rice and a fresh salad.'
      }
    },
    {
      id: 'caldo',
      image: 'media/gallery/cat-caldos.jpg',
      price: null,
      available: true,
      pt: {
        name: 'Caldo do dia',
        desc: 'Servido quentinho, na tigela.'
      },
      en: {
        name: 'Soup of the day',
        desc: 'Served hot, in a bowl.'
      }
    },
    {
      id: 'pudim',
      image: 'media/gallery/cat-sobremesas.jpg',
      price: null,
      available: true,
      pt: {
        name: 'Pudim de leite',
        desc: 'Para fechar a refeição.'
      },
      en: {
        name: 'Pudim de leite',
        desc: 'To finish the meal.'
      }
    }
  ]
};
