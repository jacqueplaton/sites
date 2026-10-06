# Terra Dourada — prévia do site

Prévia da home da **Terra Dourada · Lago Oeste, Brasília**, feita a partir do
documento *Terra Dourada — Direção de arte e estratégia de reserva direta*
(6 out. 2026).

- **Tecnologia:** HTML, CSS e JavaScript puro, sem framework, sem build e sem
  bibliotecas. As fontes ficam hospedadas no próprio site.
- **Status:** prévia `noindex`, não publicada. O WhatsApp está **desativado**
  (veja abaixo).
- **Conceito:** *O Cerrado em outro ritmo.* · H1 *Deixe a pressa. Entre na água.*

```
terra-dourada/
  index.html        os 11 capítulos (todo o conteúdo está no HTML)
  css/style.css     visual, tokens de cor, layout desktop/celular
  css/fonts.css     Newsreader (títulos) e Public Sans (interface)
  js/config.js  ←   WhatsApp, modo da prévia, mensagens, links, galerias
  js/app.js         comportamento (raramente precisa mexer)
  _headers          noindex e cache (Netlify / Cloudflare Pages)
  empacotar.sh      gera o zip de deploy
  media/video/      abertura: MP4 + WebM, 1280 e 854 px, sem áudio, e pôster
  media/fotos/      fotos em WebP, 3 larguras
  media/og/         imagem de compartilhamento 1200×630
```

Para rodar localmente, sirva por HTTP, de dentro desta pasta:

```bash
python3 -m http.server 8000      # http://localhost:8000
```

---

## Dois modos da prévia

| Modo | Para quem | O que mostra |
|---|---|---|
| `revisao` (padrão) | equipe interna | espaços tracejados de fotos pendentes e notas "Revisão" em cada capítulo |
| `cliente` | apresentação à propriedade | só o conteúdo confirmado; nenhum marcador, número ou dado pendente |

Para trocar o modo:
- **pela URL:** `?modo=cliente` ou `?modo=revisao`;
- **pelo botão** "Ver como cliente", no canto inferior esquerdo;
- **como padrão:** em `js/config.js`, campo `modo`.

Na versão comercial final, apague do HTML todos os elementos com a classe
`rev`, que são as marcações de revisão.

---

## WhatsApp — status: DESATIVADO

O número **+55 61 99158-7093** aparece na ficha pública do Google e num
diretório. **Ainda não foi confirmado** como WhatsApp de reservas, então não
foi ligado.

Comportamento atual:
- Todos os 10 CTAs ("Consultar…") levam ao convite final (`#consultar`), já com
  a acomodação escolhida e a mensagem pronta.
- Ao enviar o formulário, aparece uma explicação e os links dos anúncios
  oficiais no Airbnb.
- O botão flutuante aparece só no modo revisão. No modo cliente ele fica
  escondido até o número ser ligado.

**Para ativar** (depois de confirmar com a propriedade), abra `js/config.js` e
preencha o número:

```js
whatsapp: { numero: '5561991587093', ... }   // só dígitos, com 55 e DDD
```

A partir daí, sem mexer em mais nada:
- todos os botões abrem `wa.me` com a mensagem do contexto (geral, Casa Rosa,
  Kaliandra, conjunta, acesso, dúvida);
- o botão flutuante aparece;
- o número entra no rodapé.

Nada é enviado sozinho: a pessoa revisa o texto no WhatsApp antes de enviar.
Este comportamento foi testado com o número simulado.

**Medição:** cada clique de consulta gera o evento `consulta_clique`, com
`origem`, `unidade` e `canal`, sem dados pessoais. Ele vai para
`window.dataLayer`, se existir, e para o evento DOM
`terradourada:consulta`. Um clique não prova que a mensagem foi enviada:
conferir conversas e reservas com a operação.

---

## Mídias recebidas e onde foram usadas

A atribuição de unidade foi **inferida** a partir da amostra visual descrita
no documento de direção. A Casa Rosa tem arquitetura rosa, cobertura cerâmica e
pavilhão envidraçado sobre a piscina. O Kaliandra tem móveis turquesa e
paisagem aberta. **Confirmar com a propriedade.**

| Original | Unidade / ambiente | Arquivos | Seção · enquadramento |
|---|---|---|---|
| vídeo 8 s, 1280×720 | 5 planos: aéreo → deck → área envidraçada → fachada → terraço | `media/video/chegada-*` | 01 Abertura. Desktop em tela cheia; celular em recorte 4:3 com o texto em faixa abaixo |
| foto 5 (aérea) | Casa Rosa · piscina, pavilhão e casa | `casa-rosa-panorama-*` (12:7), `casa-rosa-aerea-*`, `entardecer-*` (faixa superior), `jardim-*` (recorte inferior esquerdo) | 04 panorama · galeria · 11 convite · 07 o lugar |
| foto 4 (deck) | Casa Rosa · piscina e deck | `piscina-deck-*`, `og/terra-dourada-og.jpg` | 02 a água · galeria · compartilhamento |
| foto 2 (mesa) | Casa Rosa · área envidraçada junto à piscina | `area-gourmet-*` | 04 dupla assimétrica · galeria |
| foto 1 (rede) | Casa Rosa · pavilhão e deck | `pavilhao-rede-*` | 04 dupla · 06 díptico · galeria |
| foto 3 (terraço) | Chalé Kaliandra · terraço e vista | `kaliandra-terraco-*`, `kaliandra-terraco-retrato-*` | 05 Kaliandra · 06 díptico |

O pôster da abertura é o primeiro quadro do vídeo, para a troca pôster → vídeo
não dar salto. O áudio do vídeo original foi removido.

### Fidelidade do vídeo (aprovar com a propriedade)

O vídeo é uma animação gerada a partir das fotos, e o site informa isso numa
legenda. Dois planos divergem das fotografias:
- **1,5–2,8 s, plano do deck:** casas rosas enfileiradas atrás da piscina, que
  não aparecem em nenhuma foto.
- **6–8 s, plano do terraço:** guarda-corpo de cabos (na foto ele é
  ornamental), outra espreguiçadeira e outra paisagem.

O vídeo tem 8 s (a direção pede 12–18 s) e não há versão vertical.

### Como trocar fotos

1. Gere as três larguras (480, 800 e 1200 px; retratos em 480 e 674 px) em
   WebP e salve em `media/fotos/` com o mesmo nome. A página passa a usar os
   arquivos novos sozinha.
2. Para uma foto nova, copie um `<figure>` existente no `index.html` e ajuste
   `src`, `srcset`, `width`/`height`, `alt` (ambiente e unidade, sem empilhar
   palavras-chave) e a legenda `Unidade · ambiente`.
3. Para substituir um espaço de revisão, troque o `<figure class="rev rev-foto …">`
   por um `<figure>` com a foto real.
4. Galerias ("Ver ambientes e detalhes"): edite `galerias` em `js/config.js`.

### Como mudar dados das unidades

Os números ficam no HTML, em `.ficha`, nos capítulos 04 e 05, e na lista do
capítulo 03. As respostas das dúvidas ficam no capítulo 10. Ao confirmar a
capacidade do Kaliandra, atualize também o bloco JSON-LD no `<head>`
(`containsPlace`). As notas das avaliações (capítulo 08) são retratos com data:
atualize a nota, a quantidade e a data juntas.

---

## Pendências

### Bloqueiam publicação comercial
1. WhatsApp de reservas e pessoa/equipe responsável.
2. Capacidade atual do Kaliandra (7 no anúncio individual × 6 no conjunto) e
   capacidade da locação conjunta. Nunca somar.
3. Qual piscina pertence a qual unidade e se o uso é privativo.
4. Alcance da exclusividade ao reservar as duas. O nome "Terra Dourada por
   inteiro" depende disso.
5. Distribuição das camas da Casa Rosa, o quarto acessado por outra suíte e o
   banheiro compartilhado.
6. Regras, preços, pagamento/cancelamento e forma de confirmação da reserva
   direta.
7. Pin, grafia do endereço e instruções seguras de chegada. O botão "Ver rota"
   aparece quando `links.rota` for preenchido.
8. Autorização de uso das imagens, do vídeo e da identidade. Aprovar a
   fidelidade do vídeo.
9. Atribuição das fotos às unidades (inferida).

### Fotos que faltam
Quarto da Casa Rosa · ambiente de convivência interno da Casa Rosa · detalhe
vertical da varanda do Kaliandra · suíte do Kaliandra · piscina do Kaliandra e
caminho de acesso · detalhe do abastecimento da água · foto do acesso/portão ·
fotos das práticas ambientais · logotipo original.

### Omitidos até confirmação
- Área total (20.000 × 40.000 m²) e metragem do chalé (80 × 100 m²).
- Velocidade de internet.
- Tempo de viagem.
- Origem e manejo da água.
- Práticas de sustentabilidade, exceto a irrigação, citada só no modo
  revisão.
- Alimentação, pets, horários, acessibilidade, atividades e ecoturismo.
- Link público da ficha Google: o campo `links.avaliacoesGoogle` está vazio, e
  por isso o link não aparece.

### Não foi possível revalidar nesta etapa
A rede do ambiente de desenvolvimento bloqueou Airbnb, Linktree, Instagram e
Google. Os links e as notas são os da pesquisa de 6 out. 2026. Conferir antes
de publicar.

---

## Validação feita

Feita com Chromium (Playwright), em 1440×900 e 390×844.

- **Estrutura:**
  - os 11 capítulos presentes;
  - um único H1;
  - todas as âncoras internas existem;
  - todas as imagens têm `alt`;
  - nenhuma rolagem horizontal no celular.
- **Modo cliente:**
  - nenhum marcador de revisão;
  - nenhum número não confirmado;
  - nenhuma capacidade, metragem, velocidade ou tempo de viagem pendente.
- **CTAs:**
  - WhatsApp desligado: os 10 levam a `#consultar` com a acomodação escolhida;
  - WhatsApp ligado (número simulado): todos abrem `wa.me` com o texto certo,
    numa nova aba;
  - formulário: datas e pessoas preenchem a mensagem, com plural correto.
- **Teclado:**
  - o primeiro Tab vai para o link "Pular para o conteúdo";
  - o foco aparece com contorno de 3 px;
  - menu e galeria são `dialog` modais: Esc fecha e o foco volta ao botão de
    origem;
  - a galeria tem setas, contador e legenda com a unidade.
- **Toque:** todos os alvos no celular têm pelo menos 44×44 px.
- **Vídeo:**
  - toca mudo, com botão de pausa;
  - pausa quando sai da tela;
  - com "movimento reduzido" ou economia de dados, não carrega nem toca
    sozinho, mas pode ser iniciado pelo botão;
  - se falhar (404), fica o pôster e os controles somem;
  - MP4/H.264 primeiro e WebM/VP9 de reserva.
- **Sem JavaScript:** o conteúdo aparece inteiro e os CTAs ainda levam ao
  convite.
- **Contraste (WCAG):**

  | Combinação | Contraste |
  |---|---|
  | verde sobre branco | 10,5:1 |
  | rosa sobre branco | 5,4:1 |
  | branco sobre rosa | 6,1:1 |
  | água-texto `#3F6A61` sobre branco | 5,4:1 |
  | madeira-texto `#6F4A33` sobre branco | 6,9:1 |
  | rosa-claro `#E8B9C9` sobre verde | 6,9:1 |
  | água-claro `#A9CFC3` sobre verde | 7,0:1 |
  | palha sobre verde | 7,4:1 |

  `#537F75` (água) fica só em detalhes decorativos: sobre o branco dá 4,0:1.
- **Desempenho em laboratório** (Chromium com rede limitada e CPU 4× mais
  lenta; não é dado de campo):

  | Viewport | LCP | CLS | Elemento LCP |
  |---|---|---|---|
  | desktop | 0,95 s | 0 | pôster |
  | celular | 0,82 s | 0 | pôster |

  O vídeo só começa a carregar depois do pôster.

Não testado aqui: Safari/iOS real, navegadores internos do Instagram e do
WhatsApp, e leitores de tela reais.

---

## Pacote de deploy

```bash
./empacotar.sh                 # gera terra-dourada-deploy.zip (abre no modo cliente)
./empacotar.sh revisao         # mesmo pacote, abrindo no modo revisão
```

- O zip traz os arquivos do site na raiz, sem README e sem este script.
- Por padrão abre no **modo cliente**, porque um link publicado tende a ser
  compartilhado. A equipe vê as marcações com `?modo=revisao`.
- As notas de revisão continuam no código-fonte (escondidas por CSS) e
  `js/config.js` guarda o número encontrado na pesquisa como referência.
  Para um link aberto ao público, remova os elementos `rev` antes.
- `_headers` (Netlify e Cloudflare Pages) envia `X-Robots-Tag: noindex` e o
  cache. Outros hosts ignoram esse arquivo; o `noindex` continua no HTML.
- Todos os caminhos são relativos: funciona na raiz do domínio ou numa
  subpasta.

Onde subir:
- **Netlify Drop:** arraste o zip em https://app.netlify.com/drop.
- **Hostinger / cPanel:** envie o zip para `public_html` (ou para uma
  subpasta) e use "Extrair".
- **Cloudflare Pages:** em *Upload assets*, envie a pasta extraída.

## Antes de publicar (não feito nesta etapa)
- Remover `<meta name="robots" content="noindex, nofollow">`.
- Definir o domínio e usar URLs absolutas em `canonical`, `og:image` e nos
  `@id`/`image` do JSON-LD.
- Criar `robots.txt` e `sitemap.xml` só com URLs públicas.
- Páginas próprias das unidades (`/casa-rosa/`, `/chale-kaliandra/`…) só quando
  houver conteúdo e fotos suficientes.
- Não importar notas de plataformas para `aggregateRating`.

## Créditos técnicos
[Newsreader](https://fonts.google.com/specimen/Newsreader) e
[Public Sans](https://fonts.google.com/specimen/Public+Sans), licença SIL Open
Font License 1.1, hospedadas localmente (só o subconjunto latino).
