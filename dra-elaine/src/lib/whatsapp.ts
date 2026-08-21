import { siteData } from "@/data/site";

export const DEFAULT_WHATSAPP_MESSAGE =
  "Olá, Dra. Elaine! Vim pelo site e gostaria de agendar uma avaliação.";

/** Monta a URL do WhatsApp com a mensagem codificada. */
export function whatsappUrl(message: string = DEFAULT_WHATSAPP_MESSAGE): string {
  return `https://wa.me/${siteData.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Mensagem de interesse em um tratamento específico. */
export function treatmentMessage(treatmentName: string): string {
  return `Olá, Dra. Elaine! Vim pelo site e gostaria de saber mais sobre ${treatmentName}.`;
}

export function treatmentWhatsappUrl(treatmentName: string): string {
  return whatsappUrl(treatmentMessage(treatmentName));
}
