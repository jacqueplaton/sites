type SiteData = {
  name: string;
  displayName: string;
  whatsapp: string;
  whatsappDisplay: string;
  whatsappUrl: string;
  instagram: string;
  instagramHandle: string;
  city: string;
  state: string;
  country: string;
  locationDisplay: string;
  /** Campos abaixo aparecem no site somente quando preenchidos. */
  fullAddress: string;
  crm: string;
  rqe: string;
  email: string;
};

export const siteData: SiteData = {
  name: "Elaine Fernandes",
  displayName: "Dra. Elaine Fernandes",
  whatsapp: "5521988810277",
  whatsappDisplay: "+55 21 98881-0277",
  whatsappUrl: "https://wa.me/5521988810277",
  instagram: "https://www.instagram.com/draelainefernandes/",
  instagramHandle: "@draelainefernandes",
  city: "Nova Iguaçu",
  state: "RJ",
  country: "Brasil",
  locationDisplay: "Nova Iguaçu, RJ, Brasil",
  // Campos ainda não confirmados. Preencher aqui libera a exibição automática
  // nos pontos correspondentes do site (rodapé e seção "Sobre").
  fullAddress: "",
  crm: "",
  rqe: "",
  email: "",
};

export const siteUrl = "https://draelainefernandes.com.br";

export const navigation = [
  { label: "Início", href: "#inicio" },
  { label: "Abordagem", href: "#abordagem" },
  { label: "Tratamentos", href: "#tratamentos" },
  { label: "Primeira consulta", href: "#primeira-consulta" },
  { label: "Sobre", href: "#sobre" },
  { label: "Contato", href: "#contato" },
] as const;

export const attendanceModes = [
  {
    index: "01",
    title: "Presencial",
    description:
      "Atendimento presencial em Nova Iguaçu, com tempo dedicado à escuta e à avaliação individual.",
  },
  {
    index: "02",
    title: "On-line",
    description:
      "Consulta a distância para quem prefere ou precisa de acompanhamento sem deslocamento.",
  },
  {
    index: "03",
    title: "Domiciliar",
    description:
      "Atendimento domiciliar no Rio de Janeiro, para situações em que o cuidado precisa ir até você.",
  },
] as const;
