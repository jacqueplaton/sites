# Na Montanha Eco Space — site oficial

Cabanas em Igrejinha (RS), na Serra Gaúcha, perto de Gramado.
Cabana dos Sonhos · Cabana do Amor · Cabana da Pedra · reserva direta pelo WhatsApp.

Site estático, sem framework. HTML gerado por um script Node de um arquivo só,
CSS e JS próprios, fontes e mídia hospedadas no próprio site. Nenhum script de
terceiros carrega até que você configure Analytics/Pixel.

---

## O que fazer no dia a dia

Quase tudo está em **`src/data/site.mjs`**: nome, endereço, telefone, links,
cabanas, mensagens do WhatsApp, frases, perguntas frequentes e IDs de medição.
Alterar ali muda todas as páginas, o schema (JSON-LD), o sitemap e o `llms.txt`
de uma vez — é isso que mantém o NAP (nome, endereço, telefone) idêntico em todo
o site.

Depois de editar:

```bash
npm run build      # gera a pasta dist/ (não precisa de npm install)
npm run serve      # abre em http://localhost:8080
```

Na Netlify e na Vercel o build roda sozinho a cada push.

Procure por **`CONFIRMAR`** no código para ver tudo o que ainda depende da Na Montanha.

---

## Estrutura

```
na-montanha/
  src/
    data/site.mjs          ← DADOS DO SITE (o arquivo que se edita)
    templates/
      layout.mjs           cabeçalho, menu, rodapé, <head>, medição
      components.mjs       seções (hero, cabanas, vídeo, reserva, FAQ…)
      schema.mjs           dados estruturados JSON-LD
      helpers.mjs          imagens responsivas, links de WhatsApp
    pages/                 uma função por página
    assets/
      css/site.css         todo o visual
      js/site.js           menu, vídeo, datas no WhatsApp, eventos (≈ 9 KB)
      fonts/               Newsreader + Instrument Sans (woff2, só latim)
      img/                 fotos em AVIF, WebP e JPEG (geradas)
      video/               vídeo da Cabana dos Sonhos (gerado)
  media-src/               fotos originais recebidas
  scripts/
    build.mjs              gera dist/ + sitemap.xml + robots.txt + llms.txt
    media.mjs              gera as versões web das fotos e do vídeo
  netlify.toml             configuração da Netlify
  vercel.json              configuração da Vercel
```

### Páginas

| URL | Conteúdo |
|---|---|
| `/` | Página inicial completa (prioridade desta versão) |
| `/cabanas/` | As três cabanas |
| `/cabanas/cabana-dos-sonhos/` | Página da cabana, com o vídeo |
| `/cabanas/cabana-do-amor/` | Página da cabana |
| `/cabanas/cabana-da-pedra/` | Página da cabana |
| `/experiencias/` | Natureza, arquitetura e silêncio (todas as fotos) |
| `/localizacao/` | Endereço, mapa e rota |
| `/contato/` | Reserva direta e contatos |
| `/politica-de-privacidade/` | LGPD (`noindex`) |
| `/404.html` | Página de erro |

As páginas internas já estão no ar, com título, descrição, schema e links
próprios, mas foram mantidas enxutas até a aprovação da página inicial.

---

## Publicar

O site fica na pasta `na-montanha/` deste repositório. A raiz do repositório é
outro projeto, então **é preciso apontar a pasta** ao conectar.

### Netlify — conectando o repositório (recomendado)

1. **Add new site → Import an existing project → GitHub** → `jacqueplaton/sites`.
2. Branch: a branch deste trabalho.
3. **Base directory: `na-montanha`** (é o único campo a preencher).
4. Deploy. O `netlify.toml` já define comando (`node scripts/build.mjs`) e pasta (`dist`).

A Netlify informa o endereço do site ao build, e canonical, Open Graph, schema,
`robots.txt` e `sitemap.xml` passam a apontar para ele automaticamente.
Pré-visualizações de branch recebem `noindex` da própria Netlify.

### Netlify Drop — arrastar e soltar

Arraste a pasta `dist/` (ou o `.zip` gerado) em https://app.netlify.com/drop.
Nesse modo não há build, então as URLs de SEO saem com o endereço usado ao gerar
o pacote. Gere com o endereço certo:

```bash
SITE_URL=https://namontanhaecospace.netlify.app npm run build
```

### Vercel

1. **Add New → Project** → importe `jacqueplaton/sites`.
2. **Root Directory: `na-montanha`**. Framework: *Other*.
3. Deploy. O `vercel.json` define build, pasta e cabeçalhos.

### Domínio próprio

Quando houver domínio (ex.: `namontanhaecospace.com.br`):

1. Configure o domínio na Netlify/Vercel (elas mostram os registros de DNS).
2. Em `src/data/site.mjs`, preencha `url: 'https://www.seudominio.com.br'`.
3. Cadastre o domínio no **Google Search Console**, envie `/sitemap.xml`
   e coloque o endereço do site no **Perfil da Empresa no Google**, no Instagram,
   no Airbnb, no Booking e na Expedia.

---

## SEO local, GEO e dados estruturados

**Entidade:** `LodgingBusiness` "Na Montanha Eco Space", com endereço em
Igrejinha/RS, telefone, imagens, `hasMap`, `sameAs` (perfis oficiais),
`ContactPoint` de reservas e `ReserveAction` apontando para o WhatsApp.

**Cabanas:** cada uma é um `Accommodation` com página própria, ligado à
hospedagem por `containsPlace` / `containedInPlace`.

**Página inicial:** também `FAQPage` (as mesmas perguntas visíveis na página).
**Internas:** `BreadcrumbList`.

**De propósito, ficou de fora:**

- `aggregateRating` / `review` — o Google não aceita nota da própria empresa
  marcada no próprio site (autoavaliação). A nota 5,0 aparece no texto da página.
- `VacationRental` — o formato do Google exige coordenadas, capacidade e ao
  menos 8 fotos por unidade; ainda não há esses dados confirmados.
- preço, capacidade, comodidades, horários, coordenadas — não confirmados.
- `<meta name="keywords">` — ignorada pelos buscadores.

**Gramado:** sempre como proximidade ("perto de Gramado", "região próxima de
Gramado"). A FAQ e o `llms.txt` dizem explicitamente que a hospedagem fica em
Igrejinha, não em Gramado.

**Robôs:** `robots.txt` libera tudo, com grupo explícito para Googlebot, Bingbot,
OAI-SearchBot, ChatGPT-User, PerplexityBot e robôs de busca do Claude. Não há
área privada. Para bloquear robôs de *treinamento* de IA (ex.: `GPTBot`,
`CCBot`), acrescente um grupo `Disallow: /` para eles em `scripts/build.mjs`.

**`/llms.txt`:** resumo em texto simples da marca, localização, cabanas, reserva
e FAQ, para assistentes de IA.

### Termos trabalhados (sem repetição forçada)

| Grupo | Onde aparece |
|---|---|
| Na Montanha Eco Space (marca) | title, H1, schema, todas as páginas |
| cabanas em Igrejinha / hospedagem em Igrejinha RS | title da home, `/cabanas/`, H1 de `/cabanas/`, texto |
| cabanas perto de Gramado | title e descrição da home, hero, FAQ, localização |
| cabanas na Serra Gaúcha | H1 de `/cabanas/`, descrição, textos, schema |
| hospedagem em meio à natureza | hero, H1 de `/experiencias/` |
| Cabana dos Sonhos / do Amor / da Pedra | páginas próprias, H1, URLs, alt, schema |
| reserva direta pelo WhatsApp | seção Reservar, `/contato/`, FAQ, schema |

Não há volume de busca inventado neste documento. Para priorizar, use o
Search Console (consultas reais) depois de algumas semanas no ar.

---

## Medição (preparada, desligada)

Preencha em `site.analytics` (arquivo `src/data/site.mjs`):

- `gtm` — Google Tag Manager (recomendado; configure GA4 e Pixel dentro dele)
- `ga4` — Google Analytics 4 direto (use só se não usar o GTM)
- `metaPixel` — Meta Pixel
- `googleSiteVerification` / `bingSiteVerification` — verificação por meta tag

Com qualquer ID preenchido, aparece um aviso de cookies (LGPD) e a medição
começa só depois do "Aceitar" (Consent Mode v2 do Google e `fbq('consent')`).

Eventos já enviados ao `dataLayer` (e ao Pixel, quando houver):

| Evento | Quando |
|---|---|
| `click_whatsapp` | qualquer link do WhatsApp (com `cabin` e `link_location`) |
| `check_availability` | botões "Consultar disponibilidade" e "Reservar" |
| `direct_booking_lead` | escolha de cabana na seção Reservar / "Falar com a Na Montanha" (Pixel: `Lead`) |
| `view_cabin` + `view_cabana_sonhos` / `_amor` / `_pedra` | a cabana aparece na tela (1× por página) |
| `select_dates` | visitante informou chegada e saída |
| `instagram_click`, `airbnb_click`, `booking_click`, `expedia_click` | links externos |
| `google_reviews_click`, `directions_click` | avaliações e rota no Google |

---

## Fotos e vídeo

Originais em `media-src/`. Para trocar ou acrescentar fotos:

1. coloque o arquivo em `media-src/`;
2. registre em `PHOTOS` (`scripts/media.mjs`) e em `photos` (`src/data/site.mjs`), com um `alt` que descreva exatamente a foto;
3. `npm install` (uma vez) e `npm run media`.

O script nunca amplia uma foto além do original. As fotos recebidas têm entre
576 e 1082 px de largura; **fotos maiores (2000 px ou mais) deixam o site mais
nítido em telas grandes** — vale pedir os originais da câmera/celular.

**Vídeo da Cabana dos Sonhos:** o arquivo real enviado, sem áudio (toca mudo, em
loop), com um leve filtro de ruído para reduzir o peso. Versões: AV1 e H.264,
1080p (desktop, 1,7 MB / 2,6 MB) e 720p (celular, 1,0 MB / 1,2 MB). Só carrega
quando a seção se aproxima da tela; com "reduzir movimento" ou economia de dados
ligada, fica parado no pôster até o visitante tocar. O pôster é o primeiro quadro
do próprio vídeo. Para regenerar:

```bash
VIDEO_SRC=/caminho/do/video.mp4 npm run media
```

---

## Desempenho e acessibilidade (Lighthouse, celular em 4G simulado)

| | Celular | Desktop |
|---|---|---|
| Performance | 98 | 100 |
| Acessibilidade | 100 | — |
| Boas práticas | 100 | — |
| SEO | 100 | — |
| LCP | 2,5 s | 0,6 s |
| CLS | 0 | 0 |

Primeira carga da home: ~260 KB. Navegação por teclado, foco visível, link
"pular para o conteúdo", menu em `<dialog>` nativo (Esc fecha), botão para pausar
o vídeo, `prefers-reduced-motion` respeitado, alvos de toque ≥ 44 px nos botões.

---

## Pendências — dados a confirmar com a Na Montanha

| # | Item | Situação |
|---|---|---|
| 1 | **Qual foto é de qual cabana** | Cabana dos Sonhos confirmada (placa "SONHOS" na foto e vídeo). Foto noturna atribuída **provisoriamente** à Cabana do Amor e foto diurna (telhado cor de terra) à Cabana da Pedra. Corrigir em `cabins` se estiver trocado. |
| 2 | Fotos separadas de cada cabana, externas, natureza, vistas, detalhes | Recebidas 5 fotos + vídeo. O layout já está pronto para receber mais; hoje algumas fotos aparecem duas vezes. |
| 3 | Links oficiais: Google, Airbnb, Booking, Expedia | Expedia e Airbnb encontrados em pesquisa pública (marcados `CONFIRMAR`). Booking não encontrado. |
| 4 | Endereço divergente na Expedia/Hotels.com | Esses anúncios mostram "Rua Ivo Koetz, 500". O site usa o endereço informado (Rua Edgar Willy Wolff). Vale alinhar os perfis — NAP diferente prejudica o SEO local. |
| 5 | Coordenadas exatas | Não usadas. Preencher `geo` com o valor do Perfil da Empresa no Google. |
| 6 | Link de avaliações do Google e mapa incorporado | Hoje por busca do nome. Trocar pelo link curto de avaliações e pelo código "Incorporar um mapa" do perfil. |
| 7 | Depoimentos de hóspedes | Nenhum inventado. Colar em `testimonials` (texto e nome exatamente como no Google). |
| 8 | Comodidades, capacidade, café da manhã, pets, check-in/out, políticas | Não publicados. Os anúncios do Airbnb/Expedia citam alguns itens — confirmar antes de colocar no site. |
| 9 | Logotipo oficial | Não recebido. O site usa a marca em tipografia; o ícone da aba é provisório. |
| 10 | Domínio próprio | Não informado. Ver "Domínio próprio". |
| 11 | Razão social/CNPJ e contato de privacidade | Opcional na Política de Privacidade. |
| 12 | IDs de GA4/GTM/Pixel/Search Console | Preparados, vazios. |
| 13 | Vídeo gerado no Flow | Usado como enviado. Por ser uma interpretação feita a partir das fotos, alguns detalhes diferem das fotos reais (formato da janela do quarto, luminária, cerca viva do jardim). Vale confirmar com a proprietária se está tudo bem mostrar assim ou se prefere uma legenda discreta como "vídeo ilustrativo" — evita expectativa diferente na chegada. |
