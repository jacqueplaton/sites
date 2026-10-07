# Cabana do Barão — prévia do site

Prévia funcional do site da Cabana do Barão (São Bento do Sapucaí/SP, bairro
Paiol Grande, região da Pedra do Baú). Página única em HTML, CSS e JavaScript
puro: sem framework, sem `npm install`, sem rastreamento.

**Status:** prévia com `noindex`. Reserva direta pelo WhatsApp **ativa** no
número oficial +55 12 98825-2042 (informado pelo cliente em 07/10/2026).

Conceito: **"A montanha em cena. Vocês no próprio tempo."** A linguagem visual
vem da arquitetura das fotos: fachada preta (carvão), porta de madeira
amarelada (o botão principal é a "porta"), madeira por dentro, pedra do
terraço e o verde da serra.

---

## Estrutura

```
index.html          a página inteira (9 capítulos)
favicon.svg         ícone provisório (triângulo da fachada + porta)
robots.txt          não bloqueia nada; a prévia usa noindex na página
build.sh            monta a pasta _site e ajusta SEO para o domínio final
netlify.toml        publicação no Netlify (Base directory = cabana-do-barao)

css/style.css       todo o visual
css/fonts.css       Libre Caslon Display e Manrope, servidas localmente
fonts/              arquivos .woff2 (licença SIL OFL 1.1)

js/config.js   ←    WhatsApp, Instagram e vídeo (o arquivo do dia a dia)
js/app.js           comportamento (menu, vídeo, galeria, consulta)

media/fotos/        12 fotos em WebP, cada uma em 480, 800 e 1200 px
media/video/        filme do topo: 1280×720 e 720×720, em MP4 e WebM, mudos
media/og/           imagem de compartilhamento (1200×630, foto real)

_originais/         arquivos recebidos, intactos (não vão para o ar)
```

Capítulos da página: 1. Topo com vídeo · 2. A vista · 3. A cabana (ficha e
comodidades) · 4. Fotos (lightbox) · 5. Momentos · 6. Destino · 7. Hóspedes
(avaliações) · 8. Localização e perguntas frequentes · 9. Consulta.

Navegação: A cabana · Fotos · Localização · Disponibilidade.

---

## Rodar no computador

Precisa ser servido por HTTP (abrir o arquivo com dois cliques impede o vídeo):

```bash
cd cabana-do-barao
npx serve .            # ou: python3 -m http.server 8000
```

---

## Pendências — antes de divulgar

Nada abaixo foi inventado; tudo o que não estava confirmado ficou de fora ou
aparece com a fonte ao lado.

| # | Item | Situação | O que fazer |
|---|---|---|---|
| 1 | **WhatsApp** | **Resolvido em 07/10/2026:** número oficial +55 12 98825-2042 informado pelo cliente. Botões de consulta, formulário e botão flutuante abrem o WhatsApp. | — |
| 2 | **Notas e totais de avaliação** | Airbnb 4,98/5 (118) e Booking 9,8/10 (13), consultados em 06/10/2026. Não consegui reconferir: o acesso a Airbnb, Booking, pousadastop e site da prefeitura é bloqueado no ambiente onde a prévia foi feita. | Conferir nas plataformas e atualizar no `index.html` (bloco "7. AVALIAÇÕES"), com a nova data. |
| 3 | **Vídeo do topo** | O filme recebido mostra ambientes que não aparecem nas 12 fotos (cozinha com ilha branca, mesa de jantar) e diferenças em relação a elas (sofá cinza no vídeo, verde ou preto nas fotos). Também mostra meias de Natal, balões de coração e pétalas. | Pedir ao anfitrião para confirmar que o vídeo representa a cabana como está hoje. O site informa, discretamente, que o filme foi "feito a partir de fotografias da cabana" e que enfeites não fazem parte da descrição da hospedagem. |
| 4 | **Entrada 15h / saída 11h** | Indicado pela Booking. | Confirmar para a reserva direta. Os horários estão na ficha e no FAQ com a ressalva "confirme na consulta"; não estão no JSON-LD. |
| 5 | **Regras comerciais** | Crianças, pets, refeições, cancelamento: não confirmados. | O FAQ diz para perguntar na consulta. Ao confirmar, escrever as regras no FAQ. |
| 6 | **Área de 126 m²** | Publicada pela Booking, composição não esclarecida. | Aparece como "área anunciada · informada pela Booking". Não foi tratada como área interna nem colocada no JSON-LD. |
| 7 | **Fotos que faltam** | Não recebi fotos de: cozinha, banheiro, área externa com fogo (churrasqueira/fire pit), fachada à noite com luz quente. | Enviar, se houver. Uma foto horizontal da cabana vista do alto apareceu na conversa como imagem, mas não chegou como arquivo; se quiser usá-la, envie o arquivo. |
| 8 | **Domínio final** | Não definido. Por isso não há canonical, `og:url` nem sitemap. | Rodar o build com `SITE_URL` e `INDEXAR=sim` (veja "Publicar"). |
| 9 | **Localização exata** | Sem pino ou coordenadas confirmados. | A página não tem mapa; pede o endereço na consulta. Se quiser mapa, pegar as coordenadas com o anfitrião. |
| 10 | **Depoimentos** | Só há um trecho literal verificado (Michel, Booking). | Para usar outros, copiar o texto exato da plataforma, sem inventar data. |
| 11 | **Marca** | Não há logotipo oficial. | A página usa só o nome em tipografia. O favicon é um pictograma provisório; troque pelo oficial se existir. |
| 12 | **Medição** | Nenhuma ferramenta de análise está ativa. | Se for configurar, separar os eventos: clique em consulta, conversa iniciada e reserva confirmada. Um clique no WhatsApp não é uma reserva. |

---

## WhatsApp (reserva direta)

Ativo desde 07/10/2026 com o número oficial **+55 12 98825-2042**. Configuração
em **`js/config.js`** (`validado: true`) e link fixo nos botões do `index.html`
(procure por `wa.me`), para funcionar mesmo antes do JavaScript carregar.

- Os 4 botões "Consultar disponibilidade" e o botão flutuante abrem
  `https://wa.me/5512988252042` com a mensagem
  *"Olá! Vim pelo site da Cabana do Barão e gostaria de consultar disponibilidade e valores para uma reserva."*
- O formulário do fim da página usa a mesma mensagem e acrescenta só as datas
  preenchidas (`Entrada: 20/12/2026`, `Saída: 23/12/2026`).
- O botão flutuante (56 px, canto inferior direito, em todas as telas) some
  enquanto a galeria ou o menu do celular estão abertos.

Para trocar o número: edite `numero` em `js/config.js` **e** os links `wa.me`
do `index.html` (são 5).

---

## Trocar o vídeo

1. Coloque o novo arquivo em `_originais/video/`.
2. Gere as versões web (sem áudio), na pasta `cabana-do-barao`:

```bash
IN=_originais/video/NOVO.mp4
# desktop 16:9
ffmpeg -i $IN -an -vf scale=1280:-2 -c:v libx264 -preset slower -crf 28 -pix_fmt yuv420p -movflags +faststart media/video/filme-1280x720.mp4
ffmpeg -i $IN -an -vf scale=1280:-2 -c:v libvpx-vp9 -b:v 0 -crf 38 -row-mt 1 media/video/filme-1280x720.webm
# celular: recorte quadrado do centro (ajuste o crop se o vídeo não for 1280×720)
ffmpeg -i $IN -an -vf "crop=720:720:280:0" -c:v libx264 -preset slower -crf 29 -pix_fmt yuv420p -movflags +faststart media/video/filme-720x720.mp4
ffmpeg -i $IN -an -vf "crop=720:720:280:0" -c:v libvpx-vp9 -b:v 0 -crf 39 -row-mt 1 media/video/filme-720x720.webm
# posters = primeiro quadro de cada versão
ffmpeg -i media/video/filme-1280x720.mp4 -frames:v 1 -c:v libwebp -quality 80 media/video/poster-1280x720.webp
ffmpeg -i media/video/filme-720x720.mp4  -frames:v 1 -c:v libwebp -quality 80 media/video/poster-720x720.webp
```

Mantendo os nomes, não é preciso mexer em mais nada. Se mudar os nomes,
atualize `js/config.js` (vídeos) e o bloco `<picture class="hero__poster">` no
`index.html` (posters), além das duas linhas `preload` do `<head>`. Atualize
também o texto alternativo do poster.

Como o vídeo se comporta:

- mudo, em loop, `playsinline`, com botão Pausar/Reproduzir;
- só começa depois que a página carrega, e pausa quando sai da tela;
- com "reduzir movimento" ou economia de dados ligados, fica o poster e a
  pessoa escolhe se quer tocar;
- se o vídeo falhar ou o navegador bloquear, fica o poster; título e botão de
  consulta nunca dependem do vídeo.

Para desligar o vídeo e ficar só com o poster: `video.ativo: false` em `js/config.js`.

---

## Atualizar informações

| O quê | Onde |
|---|---|
| Ficha (hóspedes, quarto, área, altitude, horários, anfitrião) | `index.html`, bloco "3. A CABANA", `<dl class="ficha__lista">` |
| Comodidades | `index.html`, `<ul class="comodidades__lista">` (e `amenityFeature` no JSON-LD) |
| Notas e totais das plataformas | `index.html`, bloco "7. AVALIAÇÕES" e a data em `.avaliacoes__data` |
| Perguntas frequentes | `index.html`, bloco "8. LOCALIZAÇÃO" |
| Textos de legenda e descrição das fotos | atributos `alt` e `data-legenda` em cada foto da galeria |

Os dados ficam no HTML (e não em JavaScript) para os buscadores e as
ferramentas de IA lerem o conteúdo diretamente.

---

## Fotos — de onde veio cada uma

Os originais estão em `_originais/fotos/`, intactos, só renomeados pela função.

| Arquivo recebido | Nome no site | Função | Onde aparece |
|---|---|---|---|
| `3.webp` | `fachada` | fachada | A cabana, Fotos, Open Graph |
| `1.webp` | `varanda-neblina` | terraço com vista | A vista (principal), Fotos |
| `2.webp` | `terraco-mesa-serra` | área externa / terraço | Destino, Fotos |
| `4.webp` | `sala-janela-paredao` | sala e janela | A cabana, Fotos |
| `5.webp` | `cadeira-suspensa-janela` | detalhe de arquitetura, luz quente | Momentos (Luz), Fotos |
| `b9547df4-….avif` | `cama-janela-neblina` | cama com vista | A vista (detalhe), Fotos |
| `04daa438-….avif` | `quarto-sotao` | quarto | A cabana, Fotos |
| `9ed0c5e7-….avif` | `escada-caracol` | detalhe de arquitetura | Fotos |
| `f016e9a3-….avif` | `banheira-vista-serra` | banheira | Momentos (Banheira), Fotos |
| `b7c4b17c-….avif` | `banheira-janela-mata` | banheira | Fotos |
| `cef3623b-….avif` | `calefator-banheira` | fogo (calefator aceso) | Momentos (Fogo), Fotos |
| `a1b080b4-….avif` | `banheira-sala` | banheira e sala | Fotos |

Todas as fotos recebidas são verticais (3:4). Nenhuma foi esticada nem teve
laterais geradas. Na galeria, algumas aparecem recortadas na horizontal só na
miniatura (céu e piso, nunca a arquitetura); a foto inteira abre na lightbox.

O vídeo `filme-apresentacao-original.mp4` (1280×720, 10 s, tinha áudio) está
em `_originais/video/`; as versões do site não têm áudio.

---

## Publicar

### Netlify (recomendado)

1. **Add new site → Import an existing project →** este repositório.
2. **Base directory:** `cabana-do-barao` (o Netlify lê o `netlify.toml` dessa pasta).
3. Publicar. A prévia sai com `noindex` (na página e no cabeçalho HTTP).

Quando o domínio final estiver pronto para divulgação, em **Site configuration
→ Environment variables**, crie `SITE_URL=https://seu-dominio` e `INDEXAR=sim`
e publique de novo. O build então retira o `noindex` e cria canonical,
`og:url`, `url` no JSON-LD, `sitemap.xml` e a linha `Sitemap:` do robots.txt.

### Qualquer outra hospedagem

```bash
bash build.sh                                          # prévia
SITE_URL=https://seu-dominio INDEXAR=sim bash build.sh # versão final
```

Envie o conteúdo da pasta `_site/`.

---

## SEO e descoberta

- Title: "Cabana do Barão em São Bento do Sapucaí | Pedra do Baú". Meta description conforme o briefing.
- Um único H1 (o conceito), com nome e localização logo acima.
- Texto escrito para as buscas reais (marca, cabana em São Bento do Sapucaí,
  região da Pedra do Baú, cabana com banheira, viagem a dois na Mantiqueira),
  sem repetição forçada.
- Dados estruturados `VacationRental` + `Accommodation` (2 hóspedes, 1 quarto,
  1 banheiro, cama queen, comodidades). **Sem** telefone, coordenadas, preço,
  horários, área ou avaliações externas.
- O `VacationRental` sozinho não coloca a cabana no Google Hotels nem garante
  resultado enriquecido: isso exige integração própria e coordenadas. Nada
  aqui promete posição, destaque ou recomendação por IA.
- Os nomes das comodidades no JSON-LD (`hotTub`, `fireplace`, `outdoorGrill`,
  `kitchen`, `balcony`, `ac`, `wifi`) seguem a lista da documentação do Google;
  confira a versão vigente se for buscar o resultado enriquecido.

---

## O que foi testado

Em Chromium (Playwright), nas larguras 360, 390, 768 e 1440 px:

- sem rolagem horizontal; botão "Consultar disponibilidade" visível na primeira tela em todas;
- teclado: link "Pular para o conteúdo", anel de foco visível, menu do celular
  (abre, Esc fecha e devolve o foco, links fecham o menu);
- galeria: abre pelo teclado, contador, ← →, volta ao início/fim, Tab preso no
  diálogo, Esc fecha e devolve o foco à foto, deslizar no celular;
- consulta: saída antes da entrada e data passada geram erro; sem datas manda
  só a mensagem padrão; com WhatsApp simulado como validado, todos os botões e
  o formulário montam o link certo;
- "reduzir movimento": sem autoplay e sem animação; vídeo bloqueado: poster e
  botões continuam; sem JavaScript: conteúdo visível e botões levam à consulta;
- nenhum erro de console e nenhum arquivo ausente.

Medição de laboratório (servidor local, rede e CPU limitadas no Chromium):
LCP ≈ 0,65 s no celular e ≈ 1,2 s no desktop, CLS ≈ 0. São números de
diagnóstico, **não** dados de campo: as metas de Core Web Vitals (LCP ≤ 2,5 s,
INP ≤ 200 ms, CLS ≤ 0,1) só podem ser afirmadas com dados reais depois de
publicado.

O H.264 não roda no Chromium de testes; por isso o site também tem o vídeo em
WebM (VP9) e escolhe o formato que o navegador suporta.

---

## Fontes consultadas

- Briefing de produção com pesquisa de 06/10/2026: Airbnb (anúncio 936206576082205713),
  Booking, Instagram @cabanasdobarao, pousadastop.com.br.
- Pedra do Baú: Decreto estadual nº 56.613, de 28/12/2010 (cria o Monumento
  Natural Estadual da Pedra do Baú, cerca de 3,1 mil ha); Assembleia
  Legislativa de SP (complexo Pedra do Baú, Bauzinho e Ana Chata; até cerca de 1.950 m).

## Créditos técnicos

- Tipografia: [Libre Caslon Display](https://fonts.google.com/specimen/Libre+Caslon+Display)
  e [Manrope](https://fonts.google.com/specimen/Manrope), SIL Open Font License 1.1, hospedadas no próprio site.
- Fotos e vídeo: material enviado para a produção, reprocessado para web.
