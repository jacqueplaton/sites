# Alto de Santa Bárbara — prévia do site

Página única para gerar **consultas de reserva direta pelo WhatsApp** dos dois
chalés do Alto de Santa Bárbara, em São Francisco Xavier (SP), na Serra da
Mantiqueira. **Não é um motor de reservas.** Nenhuma disponibilidade, preço ou
confirmação é simulada: o formulário só prepara a mensagem, e quem envia é o
visitante, dentro do WhatsApp.

Feito a partir da direção Astra (`Alto_de_Santa_Barbara_Direcao_Astra.md`) e do
prompt de produção (`Alto_de_Santa_Barbara_Handoff_Claude.txt`), de 06/10/2026.

**Tecnologia:** HTML, CSS e JavaScript puros, sem framework e sem dependências
em produção. Fontes e imagens hospedadas no próprio site.

---

## Estrutura

```
index.html              a página inteira (9 capítulos)
css/site.css            visual: paleta, tipografia, composição, responsivo
js/config.js        ←   número do WhatsApp e as 3 mensagens aprovadas
js/site.js              menu, galeria, formulário, revelação ao rolar
fonts/                  Newsreader e Source Sans 3 (SIL OFL), já reduzidas
fotos/                  fotografias reais originais + fotos.json (manifesto)
img/                    versões web geradas (AVIF, WebP e JPEG de reserva)
tools/gerar-imagens.py  gera img/ a partir de fotos/
tools/verificar.mjs     checagem estática (links, arquivos, alt, ids, JSON-LD)
tools/testar-navegador.mjs  testes de comportamento no Chromium
build.sh                monta _site/ para publicar (URLs, noindex, sitemap)
netlify.toml            configuração do Netlify para esta subpasta
PENDENCIAS.md           o que depende do proprietário antes de publicar
```

---

## Revisar no computador

```bash
cd alto-de-santa-barbara
bash build.sh
python3 -m http.server 8765 --directory _site
# abra http://localhost:8765
```

Para conferir:

```bash
node tools/verificar.mjs                       # checagem estática
node tools/testar-navegador.mjs http://localhost:8765/   # requer playwright
```

---

## Fotografias

São as 10 fotos reais dos anúncios dos chalés (A1 = Airbnb Chalé 1,
A2 = Airbnb Chalé 2). Nenhuma foto gerada, de banco de imagens ou de outra
hospedagem. Origem, cena e texto alternativo de cada uma estão em
`fotos/fotos.json`.

| Arquivo | Chalé (origem) | Onde aparece | Corte no celular | Corte no desktop |
|---|---|---|---|---|
| 01-HERO | Chalé 1 (A1) | Hero; miniatura “Ofurô” do Chalé 1 | 3:2 inteira, título abaixo da foto | coluna da direita até a borda, recorte leve centrado no ofurô e na serra |
| 02-HIDRO | Chalé 2 (A2) | Primeira foto da sequência do Chalé 2 | 3:2 inteira | 3:2 inteira, metade da largura |
| 03-VARANDA-VISTA | Chalé 2 (A2) | Sequência do Chalé 2 | 3:4 inteira, meia largura | 3:4 inteira, mesma altura da 02 |
| 04-SALA | Chalé 2 (A2) | Sequência do Chalé 2 | 3:4 inteira, meia largura | 3:4 inteira, mesma altura da 02 |
| 05-QUARTO | Chalé 1 (A1) | Miniatura “Quarto” | 3:4 | 3:4 |
| 06-BANHEIRO | Chalé 1 (A1) | Miniatura “Banheiro” | 3:4 | 3:4 |
| 07-CAFE-JANTAR | Chalé 2 (A2) | Capítulo da manhã | 3:4 inteira | 3:4 inteira, coluna direita |
| 08-EXTERIOR | Chalé 1 (A1) | Foto dominante do Chalé 1 | 3:4 inteira | 3:4 inteira, metade esquerda |
| 09-SAUNA | Chalé 1 (A1) | Miniatura “Acesso à sauna” (mostra a porta, não o interior) | 3:4 | 3:4 |
| 10-PAISAGEM-MIRANTE | área comum (A2) | Capítulo do mirante | 4:3 inteira | largura total, 16:9 / 2:1, horizonte preservado |

Nas miniaturas, o recorte é 3:4; a foto inteira abre na galeria.

**Trocar ou acrescentar fotos:** coloque o arquivo em `fotos/` com o nome do
manifesto (aceita .webp, .png ou .jpg) e rode:

```bash
python3 tools/gerar-imagens.py     # requer Pillow com AVIF (pip install pillow)
```

O script nunca amplia a imagem: só gera larguras menores ou iguais à original.

---

## WhatsApp

- Número: `5512992204141` (55 + 12 + número). **Não** usar o link do diretório
  D1, que tem o 55 duplicado (`555512…`) e não funciona.
- Mensagens (iguais às da direção):
  - Geral: *Olá! Conheci o Alto de Santa Bárbara pelo site e gostaria de
    consultar disponibilidade para uma hospedagem.*
  - Chalé 1: *Olá! Conheci o Chalé 1 pelo site do Alto de Santa Bárbara e
    gostaria de consultar disponibilidade.*
  - Chalé 2: *Olá! Conheci o Chalé 2 pelo site do Alto de Santa Bárbara e
    gostaria de consultar disponibilidade.*
- O formulário acrescenta, **só quando preenchidos**, entrada e saída no
  formato brasileiro (com o número de noites) e o número de hóspedes.
- Os links fixos (hero, “Quero este chalé”, rodapé, botão flutuante) funcionam
  sem JavaScript. O formulário só aparece com JavaScript, porque sem ele os
  campos não teriam efeito; nesse caso fica o link direto e o número em texto.

**Trocar o número:** edite `js/config.js` e faça “localizar e substituir” de
`5512992204141` no `index.html`. Depois rode `node tools/verificar.mjs`.

---

## Publicar

O site é estático e roda em qualquer hospedagem. O `build.sh` gera `_site/`:

| Comando | Resultado |
|---|---|
| `bash build.sh` | prévia sem URLs absolutas (canonical, OG e JSON-LD são removidos para não publicar domínio inventado) |
| `SITE_URL=https://dominio bash build.sh` | prévia com canonical, Open Graph e JSON-LD apontando para o domínio |
| `SITE_URL=https://dominio INDEXAR=sim bash build.sh` | versão definitiva: `index, follow`, `sitemap.xml` e linha `Sitemap:` no robots |

**Netlify Drop (mais rápido, sem Git):** rode `bash build.sh --zip`, entre em
https://app.netlify.com/drop com a sua conta e arraste o arquivo
`alto-de-santa-barbara-netlify.zip` (ou a pasta `_site`, se preferir). Sem
conta, o Netlify apaga o site em cerca de uma hora. Nesse modo não há endereço
definido no momento do build, então a página sobe sem canonical, Open Graph
absoluto e JSON-LD, e continua `noindex`. Para uma prévia, isso basta.

**Netlify pelo Git:** *Add new site → Import an existing project*, escolha este
repositório e a branch, e em **Base directory** preencha
`alto-de-santa-barbara`. Comando e pasta vêm do `netlify.toml`. O Netlify
preenche o endereço sozinho. Para a versão definitiva, defina `SITE_URL` e
`INDEXAR=sim` nas variáveis de ambiente do site.

A prévia fica com `noindex, follow` na própria página. O `robots.txt` não
bloqueia o rastreamento de propósito: o Google precisa ler o `noindex`.

---

## SEO

- Title: *Alto de Santa Bárbara | Chalés em São Francisco Xavier*
- Description: *Chalés para dois em São Francisco Xavier, com hidro, vista para
  a Mantiqueira e café da manhã. Conheça o Alto de Santa Bárbara e consulte
  datas.*
- Um H1, H2 por capítulo, nomes dos chalés em H3. Todo o conteúdo em HTML.
- JSON-LD: `WebSite` + `LodgingBusiness` com duas `Accommodation`. Só dados
  publicados nos anúncios. Sem endereço de rua, coordenadas, horários,
  `starRating`, preços ou `aggregateRating` importado das OTAs.
- São Francisco Xavier tratado como distrito de São José dos Campos.
- Imagem social: `img/og-01-hero.jpg` (1200 × 630, recorte da foto 01).
- Sem volume de busca, CPC ou ranking: nada disso foi medido.

---

## Medição (opcional)

Nenhuma ferramenta de análise foi instalada. Se um Google Tag Manager for
adicionado depois, a página já envia ao `dataLayer`:

- `whatsapp_clique` com `posicao` (hero, chale-1, chale-2, flutuante, rodape,
  menu, consulta-direto, consulta-reabrir);
- `consulta_whatsapp` com `chale`, `com_datas` e `com_hospedes`.

Nenhum dado pessoal nem texto de mensagem é enviado. Clique não é mensagem
enviada, e mensagem não é reserva: vendas devem vir do registro do atendimento.

---

## Desempenho

- Hero em AVIF: 20 KB (640 px) a 63 KB (1440 px), com pré-carregamento.
- Demais imagens com `loading="lazy"`, `srcset`/`sizes` e dimensões
  reservadas.
- Fontes: 83 KB (Newsreader) + 25 KB (Source Sans 3); itálico de 59 KB só
  carrega onde é usado.
- Metas de campo da direção (LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 no p75)
  **ainda não foram medidas** com usuários reais.

---

## Créditos

- Fotografias: anúncios dos anfitriões no Airbnb. Uso comercial depende de
  autorização do titular (ver `PENDENCIAS.md`).
- [Newsreader](https://fonts.google.com/specimen/Newsreader) e
  [Source Sans 3](https://fonts.google.com/specimen/Source+Sans+3), SIL Open
  Font License 1.1 (licenças em `fonts/`).
