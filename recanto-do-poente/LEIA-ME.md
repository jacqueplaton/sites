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

**Quatro já foram substituídos por fotografias reais**, enviadas depois:
`06-loft-integrado`, `07-cozinha-jantar`, `08-cama-madeira` e
`10-banheiro-vista`. Os outros doze continuam com painel.

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

A proporção da coluna do meio é a da curadoria, e é ela que o HTML reserva
com `width`/`height` para a página não dar solavanco enquanto carrega. Se um
arquivo vier com proporção diferente, não precisa editar nada à mão:

```bash
python3 ferramentas/sincronizar-dimensoes.py
```

O script lê o tamanho real de cada arquivo em `assets/` e grava esses números
no `index.html` e na lista `FOTOS` do `js/app.js`. Rode sempre depois de
trocar fotos. Com `--conferir` ele só relata, sem escrever.

**O texto alternativo continua sendo manual.** Ele descreve o que a foto
mostra, para quem usa leitor de tela: está no `alt` do `index.html` e no campo
`alt` da lista `FOTOS` em `js/app.js`, nos dois lugares com o mesmo texto.

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

## 6. Movimento e vídeo da abertura

As fotos da abertura, da água e do interior recebem uma aproximação de 2%
que dura 12 segundos, roda uma vez só e nunca com duas ao mesmo tempo.
Quem configurou o sistema para menos movimento não recebe animação nenhuma;
para os demais há um botão **Pausar movimento** no canto inferior esquerdo.

### Ligar o vídeo da abertura

A integração já está pronta e testada. Para ativar, dois passos:

1. Coloque o arquivo em `assets/video/abertura.mp4` (H.264, sem áudio).
2. Em `js/app.js`, no bloco **7. VÍDEO DA ABERTURA**, troque

```js
var ARQUIVO = '';
```

por

```js
var ARQUIVO = 'assets/video/abertura.mp4';
```

Com a linha vazia, a abertura fica exatamente como está hoje: só a
fotografia. Nada mais precisa mudar — nem HTML, nem CSS.

### Como ele se comporta

A **fotografia continua sendo a base**. Ela carrega primeiro, é o pôster do
vídeo e permanece embaixo dele. Quem decide a altura do quadro é ela, então
o vídeo entrar não empurra nada na página.

O vídeo entra por cima, com `autoplay`, `muted`, `loop` e `playsinline`, e
só aparece depois que começa de fato a tocar — surge num esmaecimento de
0,8 s. **Não entra** quando:

- a pessoa pediu menos movimento no sistema;
- a tela é de celular — ali a abertura é a foto vertical, e um vídeo
  horizontal não a cobre sem cortar a arquitetura;
- o aparelho está em economia de dados ou em conexão 2G;
- o navegador não sabe tocar o formato.

Se o arquivo faltar ou não decodificar, o elemento é removido e fica a
fotografia. Se o navegador recusar o autoplay, o vídeo simplesmente não
aparece — e, de novo, fica a fotografia. Ele só começa a carregar depois
que a página terminou de carregar, para não disputar banda com a imagem de
abertura, e **para quando sai da tela**, poupando bateria e dados.

O botão **Pausar movimento** governa o vídeo junto com as animações das
fotos: é um controle só para todo o movimento da página, como pede a regra
de acessibilidade para movimento acima de cinco segundos. Enquanto o vídeo
roda em laço, esse botão não desaparece.

### O que o vídeo precisa ter

- **Proporção 3:2**, a mesma do quadro da abertura. Outra proporção obriga
  a cortar as bordas para preencher — e corte em arquitetura é justamente o
  que a direção original proíbe.
- **Sem áudio** na trilha: o site nunca liga som.
- **H.264 em `.mp4`**, com `faststart`, que é o que todo navegador toca.
- O ideal é por volta de 8 segundos e poucos megabytes.

O pôster sai sozinho da fotografia de abertura (`01-hero-deck.webp`). Como
esse lugar ainda está com painel provisório, **o pôster só será uma
fotografia real depois que a foto da abertura entrar**.

### Os três clipes do Flow

Continuam valendo como opção para as seções da água e do interior. Se forem
aprovados, cada um entra no lugar da foto correspondente com as mesmas
regras acima. Qualquer clipe que mexa em geometria, móveis, água, reflexos
ou paisagem deve ser descartado.

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
- vídeo da abertura, com um clipe de teste descartável: entra no desktop,
  toca mudo e em laço, usa a fotografia como pôster, não entra no celular
  nem com movimento reduzido, obedece ao botão de pausa, para fora da tela,
  e some deixando a fotografia quando o arquivo falha ou o autoplay é
  recusado;
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
