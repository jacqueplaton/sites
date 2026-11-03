# Site Jacque Platon

Site estático em HTML, CSS e JavaScript, preparado para ser lido, indexado e
citado por mecanismos de busca e por assistentes de inteligência artificial.

**Domínio configurado:** `https://jacquepatonmkt.com.br`

> ⚠️ **Confira o domínio antes de publicar.** O identificador confirmado nos
> rodapés dos dois sites do portfólio é **@jacque*p‑l‑a‑t‑o‑n*mkt**, com `l`.
> O domínio informado para este projeto foi **jacque*p‑a‑t‑o‑n*mkt.com.br**,
> sem o `l`. Se foi digitação, a correção é um comando:
>
> ```bash
> bash ferramentas/trocar-dominio.sh https://jacqueplatonmkt.com.br
> ```
>
> Canonical, sitemap, robots.txt, Open Graph e JSON-LD são atualizados juntos.

---

## Como mexer no site

Três comandos resolvem quase tudo. Precisa só de Python 3, que já vem no macOS
e no Linux.

```bash
python3 ferramentas/gerar.py
```

```bash
python3 ferramentas/verificar.py
```

```bash
bash ferramentas/atualizar-datas.sh
```

O primeiro gera as páginas. O segundo confere se não há erro de indexação. O
terceiro marca o site como revisado hoje.

### Onde fica cada coisa

```
index.html                              página inicial (gerada)
sobre/                                  página do autor (gerada)
criacao-de-sites-profissionais/         (gerada)
criacao-de-sites-natal-rn/              (gerada)
sites-para-academias/                   (gerada)
sites-para-pousadas-e-hoteis/           (gerada)
google-meu-negocio/                     (gerada)
sites-com-inteligencia-artificial/      (gerada)
perguntas-frequentes/                   (gerada)
pesquisa/                               (gerada)
404.html                                (gerada)
robots.txt                              (gerado)
sitemap.xml                             (gerado)

style.css                               visual do site — edite à mão
app.js                                  menu e formulário — edite à mão
assets/                                 logos, capturas e imagem social
marca.html                              proposta de identidade (noindex)
RELATORIO-PESQUISA.md                   pesquisa, fontes e limites do projeto

ferramentas/
  conteudo.py       ←  TODO O TEXTO DAS PÁGINAS. É aqui que você edita.
  gerar.py          ←  domínio, datas, menu, rodapé, robots e sitemap.
  verificar.py         checagem automática de indexação.
  trocar-dominio.sh    troca o domínio em todos os arquivos de uma vez.
  atualizar-datas.sh   marca o site como revisado.
  checar-links.sh      confere se as fontes citadas continuam no ar.
  og-imagem.html       fonte da imagem de compartilhamento.
```

**Tudo que está marcado como "gerada" é reescrito por `gerar.py`.** Se você
editar um `index.html` à mão, a próxima geração desfaz. O texto mora em
`ferramentas/conteudo.py`.

Por que um gerador em vez de dez arquivos soltos: as páginas compartilham
cabeçalho, menu, rodapé e estrutura de `<head>`. Mantidas à mão, uma hora
ficam diferentes entre si — e é exatamente a diferença silenciosa entre
páginas que causa erro de indexação. **A hospedagem não roda nada disso:** o
HTML gerado é commitado e servido como arquivo estático.

---

## Publicar

### Vercel (recomendado)

1. **Add New → Project** e importe este repositório.
2. Framework Preset: **Other**.
3. Build Command: deixe vazio. Output Directory: deixe vazio.
4. **Root Directory: `jacque-platon`** — importante, porque este repositório
   guarda mais de um site.
5. Em Settings → Domains, aponte o domínio próprio.

O arquivo `vercel.json` cuida do resto: barra no fim do endereço, cabeçalhos
de segurança e cache.

### Netlify

Mesma ideia. Em Site settings → Build & deploy, defina **Base directory** como
`jacque-platon`. O `netlify.toml` já traz publish, cabeçalhos e cache.

### Depois de publicar, sempre

1. Abra `https://seu-dominio/robots.txt` e confirme que o arquivo aparece.
2. Abra `https://seu-dominio/sitemap.xml` e confirme que lista 10 endereços.
3. Cadastre o site no [Google Search Console](https://search.google.com/search-console/about)
   e envie o sitemap.
4. Cadastre no [Bing Webmaster Tools](https://www.bing.com/webmasters/about)
   e envie o sitemap. O Bing alimenta parte das respostas de IA, inclusive
   fora da Microsoft.

---

## Os 20 itens, e onde cada um está resolvido

| # | Item | Onde está |
|---|---|---|
| 1 | Robôs de IA liberados | `robots.txt` libera 25 robôs nominalmente, incluindo GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Applebot-Extended, meta-externalagent e CCBot. O `noindex,nofollow` da prévia foi removido e substituído por `index,follow,max-image-preview:large,max-snippet:-1`. |
| 2 | robots.txt | Gerado por `gerar.py`, com regra geral, bloco nominal por robô e linha `Sitemap:`. |
| 3 | Sitemap XML | `sitemap.xml` com as 10 páginas indexáveis, `lastmod`, `changefreq` e `priority`. A 404 fica de fora de propósito. |
| 4 | Dados estruturados | JSON-LD em `@graph` em todas as páginas: `Person`, `Organization`, `WebSite`, `WebPage`, `BreadcrumbList`, `ImageObject`, `Service` nas seis páginas de solução, `FAQPage` onde há perguntas, `ProfilePage` em `/sobre/`, `Report` e `CreativeWork` no portfólio e na pesquisa. Sem endereço, telefone, nota de avaliação ou certificação, porque nada disso está confirmado. |
| 5 | HTML semântico | `header`, `nav`, `main`, `article`, `section`, `aside`, `footer`, `ol`/`ul`, `table` com `caption` e `th scope`, `time datetime`, `details`/`summary`, `aria-labelledby` nas seções e `aria-current` no menu. |
| 6 | Títulos de página claros | Um `<title>` próprio por página, todos diferentes, verificados em tamanho e duplicidade pelo `verificar.py`. |
| 7 | Meta descriptions | Uma por página, única, entre 70 e 165 caracteres, verificada automaticamente. |
| 8 | Tags canônicas | `<link rel="canonical">` próprio em cada página, conferido contra o endereço real pelo verificador, e igual ao `og:url`. |
| 9 | Erros de indexação | `verificar.py` checa canonical errado, título ou description duplicados, `noindex` esquecido, h1 ausente ou repetido, link interno quebrado, âncora inexistente, imagem sem `alt`, JSON-LD inválido, `@id` órfão, página fora do sitemap e marcador de conteúdo não substituído. Há `404.html` com `noindex,follow` e mapa do site. O `<select>` malformado da prévia foi corrigido. |
| 10 | Conteúdo renderizado em HTML | Nenhum texto é criado por JavaScript. O `app.js` só trata menu e formulário, e verifica a existência de cada elemento antes de usar. O verificador reprova qualquer página com menos de 1200 caracteres de texto no HTML servido. |
| 11 | Headings descritivos | Um `h1` por página, `h2` por seção e `h3` por pergunta. O verificador reprova h1 ausente, repetido ou curto demais, e avisa em salto de hierarquia. |
| 12 | Respostas às perguntas comuns | Bloco **Resposta curta** no topo de cada página interna, com a resposta na primeira frase, antes do contexto — que é o formato que assistente de IA extrai. |
| 13 | Páginas de FAQ | `/perguntas-frequentes/` com 16 perguntas e `FAQPage`, mais blocos de perguntas próprias em cada página de solução e na home. |
| 14 | Fontes confiáveis citadas | Seção **Fontes consultadas** com links para a documentação primária: Google Search Central, Schema.org, sitemaps.org, OpenAI, Ajuda do Perfil da Empresa, Search Console, Bing Webmaster Tools e web.dev. Nunca blog de terceiros. |
| 15 | Informações do autor | `/sobre/` como `ProfilePage` com `Person`, mais assinatura visível com `rel="author"` em toda página interna, `meta name="author"`, `link rel="author"` e `rel="me"` para o Instagram. |
| 16 | Datas de publicação | «Publicado em» e «Última revisão em» visíveis em `<time datetime>`, e `datePublished`/`dateModified` no JSON-LD de cada página. |
| 17 | Conteúdos antigos atualizados | Política de revisão escrita (abaixo), `atualizar-datas.sh` para marcar a revisão, e histórico de revisões aberto na página `/pesquisa/`. |
| 18 | Links internos | Menu igual em todas as páginas, trilha de navegação com `BreadcrumbList`, links contextuais dentro do texto, bloco **Continue por aqui** no fim de cada página e mapa do site no rodapé. O verificador reprova link quebrado. |
| 19 | Pesquisa original | `/pesquisa/` — análise de primeira mão de dois sites publicados no RN, com método repetível, tabela de recursos observados, data de observação e o que deliberadamente não foi medido. Marcada como `Report`. |
| 20 | Checagem de visibilidade | `verificar.py` para o que é verificável localmente, e o roteiro abaixo para o que só se vê depois de publicado. |

---

## Checagem de visibilidade nas buscas

O `verificar.py` confere os arquivos. **Visibilidade real só se mede depois de
publicar**, e não se mede com um único teste.

### Semana 1, depois de publicar

1. `https://seu-dominio/robots.txt` abre e mostra o conteúdo esperado.
2. `https://seu-dominio/sitemap.xml` abre e lista 10 endereços.
3. Search Console: propriedade criada, sitemap enviado, sem erro em
   **Páginas → Motivos pelos quais as páginas não são indexadas**.
4. Bing Webmaster Tools: mesma coisa.
5. Teste de resultados avançados do Google na URL de cada página, para
   conferir se o JSON-LD foi lido sem erro.
6. Abra o **código-fonte** de uma página no navegador (não o inspetor, o
   código-fonte mesmo) e procure uma frase do texto. Se estiver lá, o robô
   que não executa JavaScript também vê.

### Mês 1

7. No Google, pesquise `site:seu-dominio` e conte quantas páginas aparecem.
   Menos que o esperado significa que algo não entrou no índice.
8. No Search Console, veja em **Desempenho** quais consultas já trazem
   visitantes. É dado do próprio Google, não estimativa de ferramenta.
9. Pesquise o nome da marca e veja o que aparece antes do site.

### Mês 1 e depois, a cada trimestre

10. Faça, ao ChatGPT, ao Gemini, ao Claude e à Perplexity, as mesmas
    perguntas que um cliente faria — por exemplo «quem faz site para academia
    em Natal». Anote, com data, se o site aparece e como foi descrito.
11. Repita em outro dia e em uma conversa nova. Resposta de modelo varia com
    o contexto e com o momento: um teste isolado não é medição.
12. Registre os resultados em uma planilha simples, com data, pergunta,
    assistente e resposta. A série ao longo do tempo é o que informa; um
    print isolado não é.

**O que nenhum desses passos faz:** garantir posição no Google ou citação por
um assistente de IA. Eles mostram se o site está legível e acompanhável. O
resto é decisão do buscador e do modelo.

---

## Política de revisão do conteúdo

Conteúdo desatualizado prejudica mais que conteúdo antigo. A regra deste site:

* **Revisão a cada seis meses, no mínimo.**
* Conferir, em cada revisão: preço e condições citados, serviços oferecidos,
  canal de contato, links externos ainda no ar e capturas do portfólio.
* **Corrigir ou remover antes de mudar a data.** Mexer na data sem mexer no
  conteúdo não melhora nada e engana quem lê.
* Em `/pesquisa/`, acrescentar a nova observação ao histórico de revisões,
  sem apagar a anterior.
* Conferir os links citados antes de fechar a revisão:

  ```bash
  bash ferramentas/checar-links.sh
  ```

* Depois de revisar: `bash ferramentas/atualizar-datas.sh` e commit.

> Nota: os links externos das seções **Fontes consultadas** não puderam ser
> testados no ambiente em que este site foi montado, porque a saída de rede
> estava restrita. Todos apontam para documentação oficial e estável
> (Google Search Central, Schema.org, sitemaps.org, OpenAI, Search Console,
> Bing Webmaster Tools, web.dev, Ajuda do Perfil da Empresa). Rode
> `checar-links.sh` na primeira revisão, de um computador com internet.

---

## Pendências do projeto

Itens que não dependem de código e seguem em aberto:

1. **Fotografia original.** A seção de retrato ainda usa espaço reservado com
   o monograma. Enviar foto vertical em boa resolução, sem filtro pesado e com
   espaço acima da cabeça.
2. **WhatsApp comercial.** O número **+55 84 98627-5720** não foi confirmado.
   Enquanto isso, nenhuma página exibe WhatsApp: o formulário monta a mensagem
   na tela e o canal publicado é o Instagram. Confirmado o número, ele entra no
   `app.js`, no formulário e no `Organization` do JSON-LD.
3. **Domínio.** Confirmar a grafia (veja o aviso no topo deste arquivo).
4. **Instagram.** Biografia, seguidores e publicações não foram verificados;
   nenhum número foi inventado nem publicado.
5. **Versão Next.js/TypeScript/Tailwind.** O briefing previa essa migração
   para a produção final. O que está aqui é a versão estática, com todo o SEO
   e a estrutura de conteúdo prontos — na migração, as 10 páginas, o JSON-LD,
   o robots.txt e o sitemap são portados como estão.

## O que este site não afirma

Por decisão editorial, e para não precisar desmentir depois: nenhum número de
clientes, de vendas, de visitas ou de posição alcançada; nenhum depoimento;
nenhuma certificação, parceria ou vínculo com o Google; nenhuma promessa de
primeira página ou de citação por assistente de IA. «Aproximadamente 12 anos
de atuação» e «experiência com soluções Google desde 2019» aparecem sempre
identificados como declarações do profissional.
