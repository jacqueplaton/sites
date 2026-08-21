/**
 * Fotografias do site.
 *
 * Os arquivos vivem em `public/images/`. A distribuição abaixo respeita a
 * orientação de cada original: retratos 1122×1402 (4:5) e procedimentos
 * 1448×1086 (4:3). Para trocar qual foto aparece onde, troque os arquivos
 * de nome — nenhum componente precisa mudar.
 */
export const photos = {
  heroPortrait: "/images/dra-elaine-hero.png",
  aboutPortrait: "/images/dra-elaine-sobre.png",
  approachPortrait: "/images/dra-elaine-profissional.png",
  treatments: {
    "preenchimento-labial": "/images/tratamentos/preenchimento-labial.png",
    "enzimas-emagrecedoras": "/images/tratamentos/enzimas-emagrecedoras.png",
    skinbooster: "/images/tratamentos/skinbooster.png",
    microagulhamento: "/images/tratamentos/microagulhamento.png",
    botox: "/images/tratamentos/botox.png",
    criofrequencia: "/images/tratamentos/criofrequencia.png",
  },
} as const;
