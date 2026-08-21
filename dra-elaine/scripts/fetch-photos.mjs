/**
 * Baixa as fotografias antes do build, caso ainda não estejam em
 * `public/images/`.
 *
 * Existe porque os originais foram entregues por armazenamento externo e
 * ainda não vivem no repositório. Assim o Netlify monta o site completo
 * sozinho, sem ninguém precisar subir arquivo à mão.
 *
 * Quando as fotos forem commitadas em public/images/, este passo vira
 * no-op e pode ser removido do `build` no package.json.
 */
import { mkdir, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import sharp from "sharp";

const CDN =
  "https://d2ol7oe51mr4n9.cloudfront.net/user_34W2ntKlqjdZj31Hcj30UjZ5SOh";

/**
 * Os originais são PNG de ~2 MB cada. Cada um é convertido para WebP na
 * largura que a moldura realmente usa — as nove passam de ~17 MB para
 * cerca de 500 KB, com a mesma nitidez em tela.
 *
 * Retratos: originais 1122x1402. Procedimentos: originais 1448x1086.
 */
const LARGURA = 1000;

const PHOTOS = {
  "images/dra-elaine-hero.webp": "1272cce5-fdc4-404c-bf3e-1629764d19c0",
  "images/dra-elaine-sobre.webp": "5c9c6c7a-5b16-40d6-ba59-8afa9235015c",
  "images/dra-elaine-profissional.webp": "ba6cab8c-5501-47d4-acc4-91b862308fea",
  "images/tratamentos/preenchimento-labial.webp":
    "afcd370c-4952-48d7-9a42-0cfc1de63b1c",
  "images/tratamentos/enzimas-emagrecedoras.webp":
    "e68c6eec-8312-4f06-aa1b-4f7641ee27c0",
  "images/tratamentos/skinbooster.webp": "1e581528-9084-48b6-a18e-bc7b572fb2bc",
  "images/tratamentos/microagulhamento.webp":
    "b73aa2fa-d4fa-4584-b8e3-1c80e0e3bff4",
  "images/tratamentos/botox.webp": "e135c21d-3f12-43c5-b158-6f2ac80c6638",
  "images/tratamentos/criofrequencia.webp":
    "d55de4c7-c50a-4860-8ac5-a9287b13323d",
};

const exists = async (p) => access(p).then(() => true).catch(() => false);

let baixadas = 0;
let jaExistiam = 0;
let falharam = 0;

for (const [destino, id] of Object.entries(PHOTOS)) {
  const caminho = join("public", destino);
  if (await exists(caminho)) {
    jaExistiam++;
    continue;
  }
  try {
    const resposta = await fetch(`${CDN}/${id}.png`);
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    await mkdir(dirname(caminho), { recursive: true });
    await sharp(Buffer.from(await resposta.arrayBuffer()))
      .resize({ width: LARGURA, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(caminho);
    baixadas++;
  } catch (erro) {
    // O build segue: a moldura mostra o slot identificado no lugar da foto.
    console.warn(`  aviso: ${destino} não pôde ser baixada (${erro.message})`);
    falharam++;
  }
}

console.log(
  `fotos — ${jaExistiam} já no projeto, ${baixadas} baixadas, ${falharam} indisponíveis`,
);
