import { photos } from "./photos";

export type Treatment = {
  slug: string;
  name: string;
  price: string;
  previousPrice: string;
  priceNote?: string;
  image: string;
  alt: string;
};

/** Observação exibida em todos os itens do catálogo. */
export const TREATMENT_NOTE =
  "Indicação e plano definidos após avaliação individual.";

export const TREATMENT_DISCLAIMER =
  "Valores e condições devem ser confirmados no momento do agendamento. A indicação de qualquer procedimento depende de avaliação individual.";

export const treatments: Treatment[] = [
  {
    slug: "preenchimento-labial",
    name: "Preenchimento labial",
    price: "R$ 850,00",
    previousPrice: "R$ 1.600,00",
    image: photos.treatments["preenchimento-labial"],
    alt: "Profissional de luvas apoiando o queixo de uma paciente enquanto segura uma seringa, durante atendimento em consultório.",
  },
  {
    slug: "enzimas-emagrecedoras",
    name: "Enzimas emagrecedoras",
    price: "R$ 350,00",
    previousPrice: "R$ 500,00",
    image: photos.treatments["enzimas-emagrecedoras"],
    alt: "Profissional de luvas demarcando a região abdominal de uma paciente com lápis branco, com bandeja de materiais ao fundo.",
  },
  {
    slug: "skinbooster",
    name: "Skinbooster",
    price: "R$ 800,00",
    previousPrice: "R$ 1.900,00",
    image: photos.treatments["skinbooster"],
    alt: "Paciente deitada durante aplicação facial realizada por profissional de luvas com seringa, em consultório.",
  },
  {
    slug: "microagulhamento",
    name: "Microagulhamento",
    price: "R$ 580,00",
    previousPrice: "R$ 1.200,00",
    image: photos.treatments["microagulhamento"],
    alt: "Paciente de olhos fechados recebendo aplicação na face com caneta de microagulhamento.",
  },
  {
    slug: "botox",
    name: "Botox",
    price: "R$ 890,00",
    previousPrice: "R$ 1.300,00",
    image: photos.treatments["botox"],
    alt: "Profissional de luvas posicionando a pele da face de uma paciente antes da aplicação com seringa.",
  },
  {
    slug: "criofrequencia",
    name: "Criofrequência",
    price: "R$ 250,00",
    previousPrice: "R$ 300,00",
    priceNote: "por área",
    image: photos.treatments["criofrequencia"],
    alt: "Aplicação de criofrequência em atendimento estético realizado em consultório.",
  },
];
