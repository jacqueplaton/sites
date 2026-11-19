# Melquisedeque Brito · site de advocacia criminal

Site estático multipágina em português do Brasil para **Melquisedeque de Brito Trindade, OAB/RN 23.477**. Atende Natal, Parnamirim e região. Não usa framework nem `npm install`: o gerador é Python 3 puro.

## Onde está cada coisa

```
fonte/                    ← EDITE AQUI
  config.json             WhatsApp, Instagram, formação, endereço, GA4/GTM
  conteudo.py             textos das 7 frentes, 2 guias, Parnamirim e 5 páginas de revisão
  gerar.py                modelos das páginas únicas (início, atuação, advogado, caderno, contato) e o gerador
  assets/css/site.css     visual
  assets/js/site.js       menu, sumário, entrada ao rolar, paralaxe de 2 px, medição do WhatsApp
  assets/fonts/           Instrument Serif e DM Sans (woff2 locais, licença OFL)
  assets/img/             retratos recortados (gerados) e og.jpg
  preparar_imagens.py     recorta as fotos de referencias/ e gera os WebP
  og.html + gerar_og.js   imagem de compartilhamento 1200×630

site/                     prévia pública gerada (16 rotas; abre com duplo clique em site/index.html)
revisao/                  5 páginas adicionais + índice (revisao/index.html), fora do ZIP
entrega/                  ZIP para o Netlify
previas/                  capturas da capa e de uma página de atuação (desktop e celular)
referencias/              fotos recebidas e índice
planejamento/dossie.md    fontes, decisões, ruminas e pendências
```

Não edite `site/`, `revisao/` nem `dist/` à mão: o gerador apaga e recria essas pastas.

## Gerar

```bash
python3 fonte/gerar.py
```

Atualiza `site/` (links com `index.html`, funciona por `file://`) e `revisao/`. Tudo sai com `noindex,follow`.

```bash
python3 fonte/gerar.py --zip
```

Também monta `dist/`, com URLs limpas (`../atuacao/`), e `entrega/melquisedeque-brito-previa-netlify.zip`, com `index.html` na raiz, `404.html`, `_headers` (cabeçalho `X-Robots-Tag: noindex`) e `robots.txt`.

```bash
python3 fonte/gerar.py --dominio https://www.dominio-definitivo.com.br
```

Use quando o domínio estiver definido e o conteúdo aprovado. Gera `index,follow`, canonicals absolutos, Open Graph com `og.jpg`, `robots.txt` e `sitemap.xml` com as 16 rotas, e BreadcrumbList no JSON-LD. Sai em `entrega/melquisedeque-brito-publicacao.zip`. As páginas de revisão continuam fora.

Fotos novas: troque os arquivos em `referencias/fotos-recebidas/`, ajuste os recortes em `fonte/preparar_imagens.py` e rode `python3 fonte/preparar_imagens.py`. A imagem de compartilhamento se refaz com `node fonte/gerar_og.js` (requer Playwright).

## Publicar no Netlify

Em app.netlify.com → *Add new site* → *Deploy manually*, arraste o ZIP de `entrega/`. Não há build: o Netlify serve os arquivos como estão.

## Rotas

**16 públicas** (as 8 originais continuam no mesmo endereço):

| Rota | Tipo |
|---|---|
| `/` | Início: capa, “O que trouxe você aqui?”, perfil, Parnamirim, caderno |
| `/atuacao/` | Índice por situação em três grupos |
| `/atuacao/intimacao-e-inquerito/` | Frente: documento anotado |
| `/atuacao/prisao-em-flagrante/` | Frente: origem da notícia + ficha da família |
| `/atuacao/audiencia-de-custodia/` | Frente: antes, durante, depois |
| `/atuacao/defesa-em-processo-criminal/` | Frente: citação × intimação, número do processo |
| `/atuacao/execucao-penal/` | Frente: pedido, andamento, decisão |
| `/atuacao/progressao-de-regime/` | Frente: registros que a defesa examina |
| `/atuacao/direitos-da-pessoa-presa/` | Frente: questão administrativa × judicial |
| `/atuacao/flagrante-e-custodia/` | URL antiga preservada, com os dois caminhos |
| `/o-advogado/` | Perfil com o retrato 04 |
| `/atendimento/parnamirim/` | Como ler comarca e unidade |
| `/orientacoes/` | Caderno criminal por assunto |
| `/orientacoes/reu-primario-e-reincidencia/` | Guia (URL preservada) |
| `/orientacoes/pix-recebido-por-engano/` | Guia (URL preservada) |
| `/contato/` | Número, WhatsApp, Instagram, região |

**5 de revisão** em `revisao/`: crimes de trânsito, medidas protetivas, divórcio, acidente de trânsito e correspondência jurídica. Cada uma tem uma caixa amarela com o que confirmar. Quando uma for aprovada, mova o bloco dela de `REVISAO` para `FRENTES` em `fonte/conteudo.py`, remova `confirmar`, acrescente `grupo`, `termo`, `seguinte` e `servico` e gere de novo.

## Medição

Se houver GA4 ou GTM autorizado, preencha `analytics` em `fonte/config.json`. Cada clique em um link de WhatsApp dispara **um** evento `click_whatsapp` com o parâmetro `posicao_botao` (`cabecalho`, `capa`, `topo-da-pagina`, `pagina`, `rodape`, `contato`…). Nenhum dado pessoal ou do caso é enviado.

## Verificado nesta versão

- As 16 rotas responderam com status 200 a partir do ZIP extraído, em 360, 390, 768 e 1440 px, sem rolagem horizontal nem erro de JavaScript.
- Nenhum link interno quebrado em `site/`, `revisao/` e `dist/`. Todos os links de WhatsApp apontam para `wa.me/558488494456` com a mensagem padrão.
- Menu do celular (abre, fecha com Esc, `aria-expanded`), sumário recolhível, FAQ por teclado, foco visível, linha inteira clicável, voltar do navegador.
- Com movimento reduzido, o retrato e o índice ficam estáticos e a paralaxe é desligada.
- Sem JavaScript, conteúdo, menu, sumário e WhatsApp continuam acessíveis.
- A prévia abre por `file://` e a revisão navega até a prévia.
