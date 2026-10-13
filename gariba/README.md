# Espaço Gariba — site

Prévia comercial do **Espaço Gariba**, duas cabanas em Encantado/RS
(Cabana da Mata e Cabana Pôr do Sol).

**Tecnologia:** HTML, CSS e JavaScript puro. Sem framework, sem build, sem
`npm install`. Sobe em qualquer hospedagem e funciona — inclusive arrastando
o ZIP no Netlify.

---

## Estrutura dos arquivos

```
index.html              a página inteira (todas as seções)
favicon.svg             ícone da aba do navegador
robots.txt              instruções para o Google
sitemap.xml             mapa do site para o Google
netlify.toml            configuração de deploy (cache e segurança)
netlify-build.sh        ajusta as URLs de SEO no deploy automático

css/
  style.css             todo o visual: cores, tipografia, layout, animações
  fonts.css             declarações das fontes locais (não precisa mexer)

fonts/                  Fraunces e Karla em .woff2, hospedadas aqui mesmo

js/
  config.js      ←      TODOS OS DADOS (contato, cabanas, galeria, textos)
  app.js                a lógica do site (raramente precisa mexer)

media/
  og-gariba.jpg         imagem que aparece ao compartilhar o link
  LEIA-ME-FOTOS.md ←    COMO COLOCAR AS FOTOS REAIS
  cabanas/              fotos das duas cabanas (ainda vazia)
  galeria/              fotos da galeria (ainda vazia)
  hero/                 foto ou vídeo da primeira tela (opcional)
```

Os dois arquivos marcados com ← são os únicos que você precisa abrir.

---

## O que está pendente (e por quê)

### 1. As fotografias

**O site não tem nenhuma foto ainda — e isso é de propósito.**

Nenhuma imagem foi inventada: não há foto de banco de imagens nem imagem
gerada por computador fingindo ser o Espaço Gariba. As fotos reais estão no
Instagram **@garibacabanas** e na página de reservas do Cloudbeds, e pertencem
ao Gariba — só quem é dono delas pode publicá-las.

Por isso o site foi construído **pronto para recebê-las**: cada foto tem seu
lugar reservado, com uma moldura verde escura que diz qual arquivo falta.
Basta jogar os arquivos nas pastas com os nomes certos e as fotos entram
sozinhas, sem mexer em código.

👉 **O passo a passo está em [`media/LEIA-ME-FOTOS.md`](media/LEIA-ME-FOTOS.md).**

Enquanto isso, a primeira tela usa uma **paisagem desenhada em vetor**, em
camadas, com movimento de parallax — um desenho assumido, não uma fotografia
artificial. Ela segura o site com elegância até a mídia real chegar.

### 2. Preços, avaliações e disponibilidade

**Não há preço nenhum no site, nem nota, nem depoimento.** Fontes de terceiros
divergem sobre os valores e eles mudam por data e temporada. O site conduz o
visitante ao WhatsApp e ao Cloudbeds, onde o valor é sempre o atual.

Para exibir preço no futuro, preencha `diaria` em `js/config.js` — mas só com
o valor confirmado pelo dono.

### 3. Confirmar com o Gariba

Estes dados vieram de fontes públicas (página oficial da Prefeitura de
Encantado, canais de reserva). Vale uma conferida antes de publicar:

- [ ] Check-in às **15h** e check-out às **12h**
- [ ] Capacidade de **4 pessoas por cabana**
- [ ] Política de pets (**pequeno porte, sob consulta**)
- [ ] Endereço: **Linha Garibaldi, 954** — alguns anúncios usam
      "Estrada Lagoa da Garibaldi" para o mesmo CEP
- [ ] Se há **mínimo de noites** (se houver, preencha `minNoites` no config)
- [ ] As coordenadas do mapa (`lat` e `lng` no config, hoje em branco)

Tudo isso está em `js/config.js`, com comentário explicando cada campo.

---

## Tarefas do dia a dia

### Trocar um texto, telefone ou item de uma cabana

Abra **`js/config.js`**. É o arquivo mais usado. Está dividido em blocos:

| Bloco | O que controla |
|---|---|
| `SITE` | nome, WhatsApp, e-mail, endereço, horários, link do Cloudbeds |
| `CABANAS` | as duas cabanas: nome, texto, lista de itens, fotos |
| `EXPERIENCIAS` | os seis cartões da seção "O que a estadia inclui" |
| `ARREDORES` | o que há para fazer em Encantado |
| `GALERIA` | as fotos da galeria e suas legendas |

Salvou, recarregou a página, está no ar.

### A regra do `null`

Campo com valor `null` quer dizer **"não confirmado"**. O site **esconde** a
informação em vez de inventar um valor. É assim de propósito — não troque
`null` por um palpite.

### Adicionar uma terceira cabana

Copie um bloco inteiro dentro de `CABANAS`, em `js/config.js`, troque os
dados e os nomes das fotos. O site monta a seção e o seletor do formulário
sozinho — não precisa tocar no HTML.

---

## Como o formulário de reserva funciona

O formulário **não processa pagamento e não fecha reserva**. Ele:

1. recebe check-in, check-out, número de hóspedes e a cabana desejada;
2. confere as datas (não deixa escolher data passada nem saída antes da entrada);
3. monta uma mensagem pronta;
4. abre o **WhatsApp oficial do Gariba** com tudo escrito.

A mensagem sai assim:

```
Olá! Vim pelo site do Espaço Gariba e gostaria de consultar disponibilidade.

Check-in: sex, 20/11/2026
Check-out: dom, 22/11/2026
Noites: 2
Hóspedes: 2
Cabana: Cabana Pôr do Sol
Nome: Marina
```

Ao lado, o botão **Reservar pelo Cloudbeds** leva ao canal de reservas que já
existe — ele continua funcionando normalmente, em paralelo.

---

## Publicar

### Opção A — arrastar o ZIP (mais rápido)

1. Abra [app.netlify.com/drop](https://app.netlify.com/drop).
2. Arraste o ZIP (ou a pasta) para a área indicada.
3. Pronto: o Netlify devolve um endereço `.netlify.app` na hora.

### Opção B — conectar o repositório (atualiza sozinho)

No Netlify: **Add new site → Import an existing project**, escolha o
repositório e aponte a pasta base para `gariba/`. Ele lê o `netlify.toml` e
publica sozinho — não precisa preencher comando de build nem pasta.

A vantagem: o `netlify-build.sh` troca as URLs de SEO pelo endereço real do
site a cada deploy, inclusive em domínio próprio.

### Domínio

As URLs de SEO (canonical, Open Graph, sitemap) apontam hoje para
`https://espacogariba.netlify.app`.

- **Deploy conectado ao repositório:** nada a fazer, o build ajusta sozinho.
- **Deploy pelo ZIP e endereço diferente:** troque o endereço em
  `index.html` (canonical, `og:url`, `twitter:url` e o JSON-LD),
  `sitemap.xml` e `robots.txt`. É um localizar-e-substituir só.

---

## O que foi feito de SEO

- Título e descrição voltados para a busca regional (Encantado, Vale do
  Taquari, Cristo Protetor, Serra Gaúcha).
- `canonical`, Open Graph e Twitter Card completos, com imagem 1200 × 630.
- `geo.region` e `geo.placename` apontando para Encantado/RS.
- **Dados estruturados** (JSON-LD) com `LodgingBusiness`, as duas cabanas como
  `Accommodation` (com capacidade e comodidades), `WebSite` e `FAQPage` com as
  sete perguntas frequentes da página.
- `sitemap.xml` e `robots.txt`.
- Fontes hospedadas no próprio site: uma requisição externa a menos e nada de
  rastreamento de terceiros.
- Imagens com `loading="lazy"`, exceto a primeira (que carrega com prioridade).

**Uma ressalva honesta:** nada disso garante posição nenhuma no Google.
SEO bem feito melhora as chances de ser encontrado por quem busca
"cabana em Encantado" — ninguém pode prometer primeira página.

---

## Acessibilidade e desempenho

- Navegação completa por teclado, com link "pular para o conteúdo".
- Contraste de texto dentro do recomendado em todas as seções.
- `prefers-reduced-motion`: quem pede menos animação no sistema recebe o site
  praticamente estático.
- Sem JavaScript, o conteúdo continua legível (só as animações somem).
- Zero dependências externas: nada de jQuery, de CDN ou de fonte do Google.
- Testado em 1440 px e em 390 px (iPhone), sem rolagem horizontal.
