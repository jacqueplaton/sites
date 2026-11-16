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

- **Netlify** — já configurado; duas formas, veja abaixo.
- **GitHub Pages** — já configurado; falta um clique, veja mais adiante.
- **Vercel / Cloudflare Pages** — funcionam igual, é o mesmo site estático.
- **Hospedagem comum (cPanel, Hostinger, etc.)** — envie os arquivos por FTP
  para a pasta `public_html`.

---

## Publicar na Netlify

O repositório já tem `netlify.toml` e `netlify-build.sh`, então a Netlify
publica sem você precisar preencher nada na interface. O build separa só os
arquivos do site (deixa `.claude`, `.github` e este README de fora) e **troca
sozinho as URLs de SEO** pelo endereço que a Netlify atribuir.

### Opção 1 — conectar o repositório (recomendado)

É a melhor para portfólio: cada `push` republica sozinho, e as URLs de
canonical, Open Graph, `hreflang`, JSON-LD, `robots.txt` e `sitemap.xml`
passam a apontar para o endereço certo automaticamente.

1. Entre em **https://app.netlify.com** com a sua conta.
2. **Add new site → Import an existing project → GitHub**.
3. Autorize a Netlify e escolha o repositório **`jacqueplaton/sites`**.
4. Em **Branch to deploy**, escolha **`claude/session-x6jjir`**.
5. Não preencha comando de build nem pasta — o `netlify.toml` já define.
6. **Deploy site**.

Em cerca de um minuto o site fica no ar. Para trocar o endereço padrão, vá em
**Site configuration → Change site name**.

### Opção 2 — arrastar o pacote (mais rápido, sem Git)

1. Entre em **https://app.netlify.com/drop**
2. Arraste o arquivo `deliciasbrasil-netlify.zip` para a área indicada.

Fica no ar em segundos. Só uma ressalva: nesse modo as URLs absolutas de SEO
continuam apontando para o endereço do GitHub Pages, porque no momento de
arrastar ainda não existe endereço definido. Para portfólio isso não atrapalha
a aparência, mas se for indexar no Google prefira a Opção 1, ou ajuste depois
conforme a seção "Ao registrar um domínio próprio".

### Domínio próprio na Netlify

**Domain management → Add a domain**, e a própria Netlify mostra os registros
de DNS para configurar no registrador. O certificado HTTPS é automático.

---

## Publicar no GitHub Pages

### Endereço do site

**https://jacqueplaton.github.io/sites/**

O GitHub Pages é gratuito, não expira e já suporta domínio próprio depois.
Está tudo configurado, mas **falta um clique que só o dono da conta pode dar**:
o GitHub não deixa nenhum robô ligar o Pages pela primeira vez.

#### O passo que falta (uma vez só, ~15 segundos)

1. Abra **https://github.com/jacqueplaton/sites/settings/pages**
2. Em **Source**, escolha **GitHub Actions**
3. Pronto. Abra a aba **Actions**, clique em "Publicar site no GitHub Pages"
   e depois em **Run workflow**.

Em cerca de um minuto o site está no ar no endereço acima. Daí em diante é
automático: todo `push` nesta branch republica sozinho.

#### Alternativa, se preferir sem Actions

Em **Settings → Pages → Source**, escolha **Deploy from a branch**, selecione a
branch `claude/session-x6jjir` e a pasta `/ (root)`. Funciona igual — o site já
está na raiz do repositório e o arquivo `.nojekyll` está no lugar. Nesse caso
você pode apagar `.github/workflows/deploy.yml`, que deixa de ser necessário.

#### Por que o robô não conseguiu terminar

Criar um site do Pages exige permissão de administrador do repositório. Nem o
token desta sessão nem o `GITHUB_TOKEN` do Actions têm essa permissão — a
tentativa automática falha com *"Resource not accessible by integration"*.
Depois que o Pages existe, o workflow publica sozinho para sempre.

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
| 7 | **Publicar** | Falta você escolher | Netlify (veja "Publicar na Netlify") ou GitHub Pages. Os dois estão configurados; qualquer um exige um passo na sua conta, que nenhum robô pode dar. |
| 7b | **Ligar o GitHub Pages** | Falta 1 clique | Settings → Pages → Source → "GitHub Actions". Só o dono da conta pode fazer. Veja "O passo que falta". |
| 8 | **Domínio próprio** | Não registrado | Depois de publicado, siga "Ao registrar um domínio próprio". |
| 9 | **Coordenadas do mapa** | Não confirmadas | O JSON-LD usa só o endereço, sem latitude/longitude, para não arriscar apontar o pino no lugar errado. Pegue as coordenadas exatas no perfil do Google Business e adicione um bloco `geo` se quiser. |

---

## Créditos técnicos

- Tipografia: [Fraunces](https://fonts.google.com/specimen/Fraunces) (títulos) e
  [Karla](https://fonts.google.com/specimen/Karla) (texto), ambas sob licença
  SIL Open Font License 1.1, hospedadas no próprio site.
- Vídeos e fotos: material enviado pelo cliente, reprocessado para web.
