/**
 * Fotografias do site, hospedadas fora do repositório.
 *
 * A ordem abaixo segue a ordem de envio dos arquivos. Para trocar qual foto
 * aparece em cada lugar, basta reordenar estas URLs — nada mais muda.
 */
const CDN =
  "https://d2ol7oe51mr4n9.cloudfront.net/user_34W2ntKlqjdZj31Hcj30UjZ5SOh";

export const photos = {
  heroPortrait: `${CDN}/afcd370c-4952-48d7-9a42-0cfc1de63b1c.png`,
  aboutPortrait: `${CDN}/e68c6eec-8312-4f06-aa1b-4f7641ee27c0.png`,
  approachPortrait: `${CDN}/1e581528-9084-48b6-a18e-bc7b572fb2bc.png`,
  treatments: {
    "preenchimento-labial": `${CDN}/5c9c6c7a-5b16-40d6-ba59-8afa9235015c.png`,
    "enzimas-emagrecedoras": `${CDN}/ba6cab8c-5501-47d4-acc4-91b862308fea.png`,
    skinbooster: `${CDN}/b73aa2fa-d4fa-4584-b8e3-1c80e0e3bff4.png`,
    microagulhamento: `${CDN}/e135c21d-3f12-43c5-b158-6f2ac80c6638.png`,
    botox: `${CDN}/d55de4c7-c50a-4860-8ac5-a9287b13323d.png`,
    criofrequencia: `${CDN}/1272cce5-fdc4-404c-bf3e-1629764d19c0.png`,
  },
} as const;
