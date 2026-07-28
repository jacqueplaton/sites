# Delícias Brasil Florida — site

Site institucional do restaurante, bilíngue (português / inglês), responsivo e
sem dependências externas.

**Tecnologia:** HTML, CSS e JavaScript puro. Sem framework, sem build, sem
`npm install`. Basta subir os arquivos em qualquer hospedagem — o site funciona.

---

## Estrutura dos arquivos

```
index.html            página inteira (todas as seções)
favicon.svg           ícone da aba do navegador
robots.txt            instruções para o Google
sitemap.xml           mapa do site para o Google

css/
  style.css           todo o visual: cores, tipografia, layout, animações
  fonts.css           declarações das fontes locais (não precisa mexer)

fonts/                Fraunces e Karla em .woff2 (hospedadas aqui, não no Google)

js/
  config.js    ←      DADOS DO RESTAURANTE (telefone, endereço, horário, nota)
  menu.js      ←      CARDÁPIO DO DIA
  i18n.js      ←      TODOS OS TEXTOS, em português e inglês
  app.js              lógica do site (raramente precisa mexer)

media/
  logo.svg            logotipo (provisório — veja "Pendências")
  og-image.jpg        imagem que aparece ao compartilhar o link
  video/              5 vídeos otimizados para web
  poster/             primeira imagem de cada vídeo
  gallery/            fotos da galeria e das categorias
```

Os quatro arquivos marcados com ← são os únicos que você precisa abrir no dia a dia.

---

## Tarefas do dia a dia

### Atualizar o cardápio de hoje

Abra **`js/menu.js`**. É o arquivo mais usado.

1. Mude a data no topo: `updated: '2026-07-28'` → data de hoje, no formato `AAAA-MM-DD`.
2. Edite a lista `items`. Cada prato é um bloco assim:

```js
{
  id: 'feijoada',
  image: 'media/gallery/cat-feijoada.jpg',
  price: 16.50,          // número, ou null se não quiser mostrar preço
  available: true,       // false = mostra "Esgotou hoje"
  pt: { name: 'Feijoada completa', desc: 'Com arroz, couve, farofa e laranja.' },
  en: { name: 'Full feijoada',     desc: 'With rice, collard greens, farofa and orange.' }
}
```

3. Salve e publique.

**Regras importantes**

- `price: null` esconde o preço. Nunca coloque preço que você não confirmou.
- `available: false` deixa o prato cinza com o selo "Esgotou hoje" — útil no fim
  do dia, sem precisar apagar o item.
- Para tirar um prato da lista, apague o bloco inteiro (das chaves `{` até `},`).
- Para adicionar um prato, copie um bloco existente e mude o conteúdo.

**Ao colocar o cardápio de verdade**, mude no topo do arquivo:

```js
status: 'placeholder'   →   status: 'live'
```

Isso remove a tarja laranja "Cardápio ilustrativo" que aparece hoje na página.

### Mudar telefone, endereço ou nota do Google

Abra **`js/config.js`**. Está tudo em um lugar só, com comentário explicando
cada campo. Alterar ali muda o site inteiro — cabeçalho, botões, rodapé e mapa.

### Preencher o horário de funcionamento

Hoje o site mostra *"Consulte o horário de hoje pelo WhatsApp"* porque o horário
ainda não foi confirmado. Para colocar o horário real, edite **dois lugares**:

**1. `js/config.js`** — troque `hours: null` por:

```js
hours: [
  { days: [1,2,3,4,5], open: '10:00', close: '20:00' },
  { days: [6],         open: '10:00', close: '18:00' },
  { days: [0],         open: null,    close: null    }   // domingo fechado
],
```

`0` = domingo, `1` = segunda … `6` = sábado. Use horário de 24 h.
O dia de hoje aparece destacado em laranja automaticamente.

**2. `index.html`** — procure por `HORÁRIO` no comentário grande do topo do
arquivo e descomente o bloco `openingHoursSpecification`, preenchendo com os
mesmos horários. Isso é o que faz o horário aparecer no Google.

### Trocar fotos e vídeos

Substitua os arquivos dentro de `media/`, mantendo os mesmos nomes — o site pega
automaticamente. Se quiser usar nomes diferentes:

- fotos da galeria: lista `GALERIA` no início de `js/app.js`
- fotos das categorias: atributo `src` das imagens na seção `#sabores` do `index.html`
- vídeos: atributo `data-src` (ou `<source src>`, no vídeo do topo) no `index.html`

Recomendações: fotos com no máximo 1100 px de largura e vídeos com no máximo
1280 px, sem áudio e abaixo de 1,5 MB. Os arquivos atuais seguem esse padrão
(os 5 vídeos originais somavam 47 MB e foram para 4,8 MB).

### Mudar qualquer texto do site

Todos os textos ficam em **`js/i18n.js`**, organizados por seção. Cada texto
aparece duas vezes: uma em `pt:` e outra em `en:`. **Mude sempre os dois** — se
esquecer o inglês, o site mostra o texto em português para quem escolheu inglês.

---

## Rodar no seu computador

O site precisa ser servido por HTTP. Abrir o `index.html` com dois cliques faz
os vídeos e o cardápio falharem.

```bash
npx serve .
# ou
python3 -m http.server 8000
```

Depois acesse `http://localhost:3000` (ou `:8000`).

---

## Publicar

Todo o site é estático, então serve em qualquer lugar:

- **GitHub Pages** — já está configurado e no ar (veja abaixo).
- **Netlify / Vercel / Cloudflare Pages** — arraste a pasta na interface deles.
- **Hospedagem comum (cPanel, Hostinger, etc.)** — envie os arquivos por FTP
  para a pasta `public_html`.

### Endereço atual

O site está publicado no GitHub Pages, de graça e sem prazo de validade:

**https://jacqueplaton.github.io/sites/**

A publicação é automática: todo `push` nesta branch dispara o workflow
`.github/workflows/deploy.yml`, que reconstrói e republica em cerca de um
minuto. Também dá para publicar na mão pelo botão "Run workflow", na aba
**Actions** do repositório.

### Ao registrar um domínio próprio

Quando o restaurante tiver o domínio (algo como `deliciasbrasilflorida.com`):

1. No repositório, vá em **Settings → Pages → Custom domain**, digite o domínio
   e salve. O GitHub cria um arquivo `CNAME` e emite o certificado HTTPS.
2. No painel do registrador do domínio, aponte o DNS para o GitHub:
   - registro `A` de `@` para `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153` e `185.199.111.153`
   - registro `CNAME` de `www` para `jacqueplaton.github.io`
3. Troque as URLs absolutas pelo novo domínio nos três arquivos abaixo.

| Arquivo | Onde |
|---|---|
| `index.html` | `canonical`, os três `hreflang`, `og:url`, `og:image`, `twitter:image` e o bloco JSON-LD (`url`, `@id`, `image`) |
| `robots.txt` | linha `Sitemap:` |
| `sitemap.xml` | as tags `<loc>` e `<xhtml:link href>` |

Um "localizar e substituir" de `https://jacqueplaton.github.io/sites/` pelo novo
endereço resolve os três de uma vez.

### Depois de publicar: Google

1. Cadastre o site no [Google Search Console](https://search.google.com/search-console)
   e envie o `sitemap.xml`.
2. Adicione o endereço do site no perfil do Google Business do restaurante — é o
   que mais ajuda a aparecer em "Brazilian food near me".

---

## O que já está pronto

- Português e inglês com seletor no cabeçalho. O idioma é detectado pelo
  navegador, fica salvo e também funciona por link direto (`?lang=en`).
- Botões de telefone, WhatsApp, Instagram e Google Maps funcionando.
- Formulário de contato que monta a mensagem e abre o WhatsApp — sem servidor.
- Menu móvel, galeria com ampliação de foto (teclado e Esc funcionam).
- Vídeos carregam só quando entram na tela; o do topo já vem com imagem de
  espera para não atrasar o carregamento.
- Acessibilidade: navegação por teclado, textos alternativos, contraste acima do
  mínimo da WCAG AA, link "pular para o conteúdo" e respeito ao
  `prefers-reduced-motion` (quem tem essa preferência ligada não vê animação e os
  vídeos não tocam).
- SEO: título e descrição focados em busca local, Open Graph, `hreflang` e dados
  estruturados `Restaurant`.

---

## Pendências — informações a confirmar

Nada aqui foi inventado. Estes pontos ficaram propositalmente em aberto:

| # | Item | Situação | O que fazer |
|---|---|---|---|
| 1 | **Horário de funcionamento** | Não informado | O site mostra "consulte pelo WhatsApp". Preencha conforme a seção acima. |
| 2 | **Cardápio real e preços** | Não informado | Os 6 pratos em `js/menu.js` são exemplos, montados só com as categorias que você citou, e **sem nenhum preço**. Substitua e mude `status` para `'live'`. |
| 3 | **Nota e nº de avaliações no Google** | Informado, não verificado | Estão em `js/config.js` como 5,0 e 11. Confira no Google antes de divulgar. O bloco `aggregateRating` do JSON-LD está comentado de propósito: publicar nota desatualizada pode gerar penalização nos resultados do Google. |
| 4 | **Logotipo oficial** | Não recebido | `media/logo.svg` é um desenho provisório feito com as cores do briefing (fruta dourada + folha verde). Substitua pelo arquivo oficial mantendo o nome. |
| 5 | **Fotos reais do restaurante** | Não recebidas | Todas as imagens foram extraídas dos 5 vídeos enviados. Se houver fotos do salão, da fachada ou da equipe, elas ajudam bastante na seção Galeria. |
| 6 | **Depoimentos de clientes** | Não recebidos | Nenhum foi inventado. Há um bloco pronto e comentado na seção Avaliações do `index.html` para colar textos reais quando tiver, com autorização de quem escreveu. |
| 7 | **Domínio próprio** | Não registrado | O site está no ar em `jacqueplaton.github.io/sites/`. Ao registrar o domínio do restaurante, siga "Ao registrar um domínio próprio". |
| 8 | **Coordenadas do mapa** | Não confirmadas | O JSON-LD usa só o endereço, sem latitude/longitude, para não arriscar apontar o pino no lugar errado. Pegue as coordenadas exatas no perfil do Google Business e adicione um bloco `geo` se quiser. |

---

## Créditos técnicos

- Tipografia: [Fraunces](https://fonts.google.com/specimen/Fraunces) (títulos) e
  [Karla](https://fonts.google.com/specimen/Karla) (texto), ambas sob licença
  SIL Open Font License 1.1, hospedadas no próprio site.
- Vídeos e fotos: material enviado pelo cliente, reprocessado para web.
