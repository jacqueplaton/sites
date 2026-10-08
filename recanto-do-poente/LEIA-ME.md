# Recanto do Poente — prévia para revisão

Site de uma página, responsivo, para consulta de reservas pelo WhatsApp.
HTML, CSS e JavaScript puro: sem framework, sem `npm install`, sem build.
Abrir o `index.html` por um servidor local já mostra o site funcionando.

**Esta versão é prévia.** Sai com `noindex,nofollow` no HTML, no `robots.txt`
e no cabeçalho do Netlify. Nenhum buscador vai indexá-la.

---

## 1. O que falta: as 16 fotografias

O ZIP com `fotos_originais/`, `assets/` e `assets_manifest.json` **não chegou
junto com o comando** — veio só o documento de direção. Como o pedido era
entregar o site funcionando, cada um dos 16 lugares de foto recebeu um painel
neutro, na proporção exata da fotografia que vai ali, com o nome do arquivo
impresso.

Os painéis **não são fotos**: não há imagem gerada por IA nem banco de
imagens. São superfícies de cor da paleta, só para sustentar o layout.

### Como colocar as fotos de verdade

Copie cada WebP por cima do arquivo de mesmo nome. Nada no HTML ou no CSS
precisa mudar.

```
assets/exterior/01-hero-deck.webp          3:2    abertura (desktop)
assets/exterior/02-piscina-vertical.webp   3:4    abertura (celular)
assets/exterior/03-fachada-jardim.webp     4:3    apresentação
assets/agua/04-vista-piscina.webp          3:2    água
assets/paisagem/05-poente-agua.webp        9:16   interlúdio
assets/interior/06-loft-integrado.webp     3:2    ambientes
assets/cozinha/07-cozinha-jantar.webp      3:2    dupla editorial + galeria
assets/quarto/08-cama-madeira.webp         3:2    dupla editorial
assets/banheiro/09-banheiro.webp           3:2    galeria
assets/banheiro/10-banheiro-vista.webp     3:2    galeria ampliada
assets/detalhes/11-roupoes.webp            2:3    galeria
assets/exterior/12-fogueira-noite.webp     3:4    galeria
assets/paisagem/13-horizonte-jardim.webp   3:4    galeria
assets/exterior/14-chegada-poente.webp     3:2    chegada
assets/exterior/15-poltronas-deck.webp     5:4    interlúdio
assets/agua/16-agua-deck.webp              3:4    água (detalhe)
```

**Mantenha a proporção da coluna do meio.** Ela é a mesma da curadoria, e é
ela que o HTML reserva com `width`/`height` para a página não dar solavanco
enquanto carrega. Se um arquivo vier com proporção diferente, ajuste o par
`width`/`height` daquela imagem no `index.html` e na lista `FOTOS` do
`js/app.js` — os dois usam os mesmos números.

Depois que as fotos entrarem, a pasta `ferramentas/` pode ser apagada: ela só
serve para gerar os painéis provisórios.

---

## 2. Arquivos

```
index.html          a página inteira
css/style.css       todo o visual: paleta, tipografia, layout, movimento
js/app.js           menu, movimento, galeria ampliada, formulário, WhatsApp
assets/             as 16 imagens, nas subpastas da curadoria
favicon.svg         ícone da aba (provisório, só tipográfico)
robots.txt          bloqueado enquanto é prévia
netlify.toml        cache e cabeçalhos do Netlify
montar-pacote.sh    gera o ZIP de publicação
ferramentas/        gerador dos painéis provisórios (temporário)
```

Dois lugares concentram o que muda no dia a dia:

- **Número do WhatsApp** — `js/app.js`, primeira linha de código (`WHATSAPP`),
  mais o link do rodapé e o do botão flutuante no `index.html`. São três
  ocorrências do mesmo número; troque as três.
- **Nota do Airbnb** — `index.html`, seção "PROVA SOCIAL". Estão lá
  `5,0 de 5 no Airbnb · 55 avaliações` e `Consulta realizada em 08/10/2026`.
  **Atualize ou retire os dois antes de publicar de verdade.**

---

## 3. Como o WhatsApp funciona aqui

O site **não envia nada**. Ele monta um link `wa.me` com a mensagem já
escrita; quem aperta "enviar" é a pessoa, dentro do WhatsApp dela. Não há
API paga, chatbot, automação nem servidor.

Botão flutuante:

> Olá! Conheci o Recanto do Poente pelo site e gostaria de informações para
> planejar minha estadia.

Formulário:

> Olá! Conheci o Recanto do Poente pelo site e gostaria de consultar
> disponibilidade de 10/12/2026 a 13/12/2026 para 2 hóspedes. Podem me
> informar os valores e as condições?

As datas obedecem ao fuso de Pirenópolis (`America/Sao_Paulo`): o site não
aceita entrada no passado, exige saída depois da entrada e reconfere a saída
quando a entrada muda. Nenhuma data é apresentada como disponível — só o
atendimento confirma.

---

## 4. Publicar no Netlify

```bash
bash montar-pacote.sh
```

Gera `recanto-do-poente-site.zip` com `index.html` na raiz do pacote.

No Netlify, abra **o projeto do Recanto do Poente** → aba **Deploys** →
arraste o ZIP na área de upload. O endereço atual continua o mesmo; o deploy
anterior fica no histórico, e dá para voltar nele por *Published deploy →
Publish deploy*.

> **Atenção:** este repositório hospeda também o site do Delícias Brasil
> Florida, que fica na raiz e tem o seu próprio `netlify.toml`. São dois
> projetos diferentes no Netlify. Não publique o ZIP do Recanto no projeto do
> restaurante — e vice-versa.

---

## 5. Publicação definitiva (quando o domínio for aprovado)

1. `index.html`: apagar `<meta name="robots" content="noindex,nofollow">`.
2. `index.html`: acrescentar `<link rel="canonical" href="https://DOMINIO/">`
   com o endereço real — absoluto, nunca inventado.
3. `index.html`: preparar o recorte 1200×630 a partir de `01-hero-deck`
   (recorte, sem inventar pixels; confira se o deck sobreviveu ao corte),
   salvar em `assets/og/og-recanto.jpg` e acrescentar `og:image`, `og:url` e
   `twitter:image` com URL absoluta.
4. `index.html`: descomentar o bloco de dados estruturados `LodgingBusiness`
   e preencher `url`, `image` e `telephone` com o que estiver confirmado. Sem
   coordenadas, sem preço, sem `aggregateRating` copiado do Airbnb.
5. `robots.txt`: trocar `Disallow: /` por `Allow: /` e apontar o `Sitemap`.
6. Criar `sitemap.xml` com a única URL do site.
7. `netlify.toml`: apagar o bloco marcado `PRÉVIA` (o `X-Robots-Tag`).
8. Revisar a nota do Airbnb (item 2) e o telefone.

---

## 6. Movimento e vídeos

As fotos da abertura, da água e do interior recebem uma aproximação de 2%
que dura 12 segundos, roda uma vez só e nunca com duas ao mesmo tempo.
Quem configurou o sistema para menos movimento não recebe animação nenhuma;
para os demais há um botão **Pausar movimento** no canto inferior esquerdo,
que some quando as três já rodaram.

Os três clipes do Flow não vêm no pacote e **não são necessários**: a página
está completa sem eles. Se forem aprovados depois, cada um entra no lugar da
foto correspondente como `<video>` com `muted`, `playsinline`,
`preload="metadata"`, pôster na foto real e controle de pausa — e a foto
continua sendo o que aparece se o vídeo falhar. Qualquer clipe que mexa em
geometria, móveis, água, reflexos ou paisagem deve ser descartado.

---

## 7. O que foi conferido

Chromium, nas larguras 1440, 390 e 360:

- nenhum recurso 404, nenhum erro de console, nenhuma rolagem horizontal;
- navegação por teclado com foco visível em todos os controles;
- galeria ampliada: setas, contador, `Esc`, foco preso dentro dela e
  devolvido ao botão de origem; foto inteira, com `object-fit: contain`;
- formulário: data vazia, data no passado, saída anterior à entrada, troca de
  entrada revalidando a saída, foco indo para o primeiro campo com problema,
  erro ligado ao campo por `aria-describedby`;
- os dois links do WhatsApp foram conferidos no texto, **sem enviar mensagem**;
- `prefers-reduced-motion`: sem animação e sem botão de pausa;
- um `<h1>`, `<h2>` em ordem, textos alternativos em todas as imagens, âncoras
  apontando para seções que existem.

Não foi conferido em aparelho físico nem em Safari/iOS — vale um olhar no
celular antes de mostrar ao cliente.

---

## 8. Pendências que não são do site

Ficam com o responsável, e por isso **não aparecem como aviso na página**:
confirmação do telefone, domínio final, regras de hospedagem, condições para
animais, pagamento, cancelamento, tarifas e disponibilidade. Enquanto não
estiverem confirmadas, nada disso deve entrar no texto.
