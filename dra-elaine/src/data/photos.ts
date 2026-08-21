/**
 * Fotografias do site.
 *
 * Os arquivos vivem em `public/images/`. A distribuição abaixo respeita a
 * orientação de cada original: retratos 1122×1402 (4:5) e procedimentos
 * 1448×1086 (4:3). Para trocar qual foto aparece onde, troque os arquivos
 * de nome — nenhum componente precisa mudar.
 */
export const photos = {
  heroPortrait: "/images/dra-elaine-hero.webp",
  aboutPortrait: "/images/dra-elaine-sobre.webp",
  approachPortrait: "/images/dra-elaine-profissional.webp",
  treatments: {
    "preenchimento-labial": "/images/tratamentos/preenchimento-labial.webp",
    "enzimas-emagrecedoras": "/images/tratamentos/enzimas-emagrecedoras.webp",
    skinbooster: "/images/tratamentos/skinbooster.webp",
    microagulhamento: "/images/tratamentos/microagulhamento.webp",
    botox: "/images/tratamentos/botox.webp",
    criofrequencia: "/images/tratamentos/criofrequencia.webp",
  },
} as const;
