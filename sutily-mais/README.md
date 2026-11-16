# Sutily Mais — Clínica Integrada · site

Site institucional da clínica, com página inicial, índice de tratamentos, **12 páginas
de especialidade**, política de privacidade e página 404.

**Tecnologia:** HTML, CSS e JavaScript puros. Sem framework e sem biblioteca externa
(nem GSAP: as animações usam CSS, `IntersectionObserver` e *View Transitions*, o que
mantém a página leve). Fontes e imagens ficam hospedadas aqui; nada é carregado de
terceiros antes do consentimento do visitante.

> **Estado atual: PRÉVIA PARA APROVAÇÃO.** As páginas saem com `noindex` e mostram os
> campos “a confirmar”. Veja [Antes de publicar](#antes-de-publicar).

---

## Estrutura

```
index.html                      página inicial
tratamentos/index.html          índice das 12 especialidades
tratamentos/<slug>/index.html   uma página por especialidade
politica-de-privacidade/        LGPD e cookies
404.html · sitemap.xml · robots.txt · favicon.svg

css/site.css     todo o visual
js/site.js       movimento, menu, filme, mapa, consentimento e eventos
fonts/           Newsreader (títulos) e Jost (textos), só os caracteres do português
img/             fotos reais em AVIF + WebP, logotipo e imagem de compartilhamento
media/           filme em três cenas (16:9 e 9:16) e suas capas

_build/          ← o que você edita
  config.mjs       DADOS DA CLÍNICA (telefone, endereço, horários, Google, pixels)
  tratamentos.mjs  TEXTOS das 12 especialidades
  build.mjs        gera todas as páginas
  pranchas.mjs     ilustrações das especialidades
  filme.html/.cjs  composição e renderização do filme
  marca.cjs        favicon, ícone e imagem de compartilhamento
```

**As páginas HTML são geradas.** Não edite os `.html` à mão: altere `config.mjs` ou
`tratamentos.mjs` e rode

```bash
node sutily-mais/_build/build.mjs
```

O comando não precisa de `npm install` e, ao terminar, lista o que ainda falta confirmar.

Para ver o site no computador:

```bash
cd sutily-mais && python3 -m http.server 8765
```

e abra `http://localhost:8765`.

---

## Antes de publicar

Tudo abaixo fica em `_build/config.mjs`. Campo vazio nunca vira informação inventada:
simplesmente não aparece no site publicado.

| O que falta | Onde | Por quê |
|---|---|---|
| WhatsApp e telefone | `whatsapp`, `telefone` | Sem o número, os botões abrem o WhatsApp sem destinatário. |
| Logradouro e CEP | `endereco.rua`, `endereco.cep` | Só o nº 2874 e o bairro estão confirmados (fachada). Deve ficar **idêntico** ao Perfil da Empresa no Google. |
| Horários | `horarios` | Aparecem na seção “Onde estamos” e nos dados estruturados. |
| Links do Google | `google.perfil`, `.avaliacoes`, `.avaliar` | Hoje os botões fazem uma busca no Maps pelo nome da clínica. |
| Número do CRO | `responsavel.cro` | O Código de Ética Odontológica exige nome e inscrição do responsável na comunicação da clínica. |
| Biografia | `responsavel.formacao`, `.experiencia`, `.motivo`, `.filosofia`, `.marcos` | Espaços já desenhados na seção “Quem cuida”. |
| Rastreamento | `rastreamento.*` | GTM (recomendado) ou GA4 / Google Ads / Meta Pixel diretos. |
| Domínio | `url` | Canonical, sitemap, Open Graph e dados estruturados usam este endereço. |

Depois de preencher: mude `previa: true` para `previa: false` e rode o build. Isso
remove o `noindex`, a tarja de prévia e qualquer espaço vazio.

**Aprovações que dependem da profissional**

- O texto institucional da seção “Por trás de cada sorriso…” é uma proposta.
- Os textos das 12 especialidades são informativos, sem promessa de resultado e sem
  preços, mas descrevem as áreas de forma geral. Confirmar se correspondem ao que a
  clínica realmente oferece (ex.: tipos de aparelho, procedimentos de harmonização).
- A foto de atendimento mostra um paciente. Usar apenas com autorização de imagem.

---

## Imagens dos tratamentos

Hoje cada especialidade usa uma **prancha ilustrada** (desenho em traço, feito em
código). Para trocar por fotografia real:

1. salve a foto em `img/tratamentos/` (proporção 4:5, cerca de 1200 × 1500 px);
2. em `tratamentos.mjs`, escreva o nome do arquivo no campo `foto` daquela especialidade;
3. rode o build.

Não use fotos de banco apresentadas como se fossem da clínica, nem imagens de “antes e
depois” sem observar as regras do Conselho Federal de Odontologia.

---

## Filme em três cenas

`media/filme-sutily-16x9.mp4` e `media/filme-sutily-9x16.mp4` (15 s, sem áudio, cerca
de 700 KB cada). É uma montagem das **fotografias reais** com movimento lento de
câmera; nenhum rosto ou ambiente foi alterado ou gerado por IA. A versão vertical
também serve para Reels, Stories e Perfil da Empresa no Google.

No site o filme só é baixado quando se aproxima da tela, toca mudo, tem botão de pausa
e fica parado (apenas a capa) para quem usa economia de dados, conexão lenta ou
“reduzir movimento”.

Para refazer (trocar uma foto ou um texto em `_build/filme.html`), com o servidor
local ligado:

```bash
node _build/filme.cjs
```

Requer Playwright (Chromium) e FFmpeg.

---

## Medição e privacidade

- **Consentimento:** Consent Mode v2 começa negado. GTM, GA4, Google Ads e Meta Pixel
  só são carregados depois do “Aceitar”. Sem nenhum código configurado, o aviso de
  cookies nem aparece.
- **Eventos** (enviados ao `dataLayer`): `whatsapp_click` (com `posicao`: hero, topo,
  barra-mobile, tratamento-topo…), `telefone_click`, `rota_click`, `mapa_click`,
  `avaliacoes_click`, `avaliar_click`, `filme_play`, `mapa_carregado`.
- **UTMs:** `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` e `utm_term` são
  guardadas durante a visita e acompanham os eventos.
- **Dados sensíveis:** os eventos levam apenas o tipo da página e a posição do botão.
  Nunca a especialidade consultada, nem o texto da mensagem do WhatsApp.
- **Conversões:** com GTM, crie as tags de conversão (Google Ads) e o evento `Contact`
  (Meta) acionados por `whatsapp_click`. Sem GTM, preencha
  `googleAdsRotuloWhatsapp` e o site dispara a conversão sozinho.
- **Mapa:** o Google Maps só é carregado quando o visitante toca em “Carregar mapa”.

---

## SEO

- Título, descrição, `h1` e conteúdo exclusivos em cada página; URL canônica; Open
  Graph; `sitemap.xml`.
- Dados estruturados: `Dentist` (com endereço, serviços e profissional), `WebSite`,
  `BreadcrumbList`, `MedicalWebPage` e `FAQPage`. Telefone, horários e coordenadas
  entram sozinhos quando preenchidos no `config.mjs`.
- Links internos: cada especialidade aponta para três áreas relacionadas, para a
  anterior, a próxima e o índice.
- Para campanhas, use as páginas de especialidade como destino, com UTMs:
  `…/tratamentos/implante-dentario/?utm_source=google&utm_medium=cpc&utm_campaign=implante`

---

## Publicação

A pasta funciona em qualquer hospedagem de arquivos estáticos: basta enviar o
conteúdo dela, **sem** `_build/` e sem este `README.md`.

Os scripts de publicação que já existem na raiz do repositório
(`.github/workflows/deploy.yml` e `netlify-build.sh`) publicam apenas o site do
restaurante e **não foram alterados**. Para a prévia sair junto, em
`…/sites/sutily-mais/`, acrescente a cada um, logo depois do `cp -r` existente:

```bash
cp -r sutily-mais _site/
rm -r _site/sutily-mais/_build _site/sutily-mais/README.md
```

Ao mudar para domínio próprio, publique o conteúdo desta pasta na raiz do domínio e
atualize `url` no `config.mjs`. A página `404.html` usa caminhos absolutos calculados
a partir desse endereço.

---

## Créditos

- Fontes: Newsreader (Production Type) e Jost (Owen Earnshaw), licença SIL Open Font 1.1.
- Logotipo: vetorizado a partir do arquivo original da clínica, sem redesenho.
