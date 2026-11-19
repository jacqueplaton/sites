# Dossiê do projeto

## Identificação

- Marca: **Melquisedeque Brito**. Identificação profissional: **Melquisedeque de Brito Trindade · OAB/RN 23.477**.
- A OAB/RN lista o nome na Comissão da Advocacia Criminal (https://www.oabrn.org.br/comissoes). A referência fica guardada aqui e só deve ser publicada com o aval do advogado.
- Instagram profissional: @advmelquisedeque. O perfil pessoal @melquisedequedebrito é apenas referência dos materiais.

## Pendências com o escritório

| Item | Situação | Onde mudar |
|---|---|---|
| WhatsApp +55 84 8849-4456 | Exibido como no print 08. Confirmar se `wa.me/558488494456` abre a conta certa. Celulares brasileiros costumam ter o 9 inicial (84 9 8849-4456). | `fonte/config.json` → `whatsapp` |
| Especialização em Direito Penal e Criminologia pela PUC/RS | Oculta até confirmar título e grafia | `formacao.confirmada: true` |
| Endereço, horário, plantão | Não publicados | `endereco` |
| Ficha no Google | Nenhuma ficha pública identificável no levantamento de 19/11/2026. Sem mapa, estrelas ou avaliações. | Depois de criada e verificada |
| Domínio definitivo | Não informado. A prévia é `noindex`. | `gerar.py --dominio` |
| GA4/GTM | Somente com integração autorizada | `analytics` |
| Escopo das 5 páginas em revisão | Ver `revisao/index.html` | `fonte/conteudo.py` |
| Habeas corpus, recursos, Tribunal do Júri | Abrir uma URL por serviço, se confirmados | `FRENTES` |
| Revisão jurídica | Todo o conteúdo antes da publicação definitiva | — |
| Fotos originais | Os retratos vieram de capturas de baixa resolução | `referencias/fotos-recebidas/` |

## Ruminas (entradas editoriais)

Perguntas escritas na linguagem de quem busca. Não são falas de clientes.

| Rota | Rumina | Busca provável (hipótese) |
|---|---|---|
| intimacao-e-inquerito | Fui chamado à delegacia. Sou acusado? | intimação policial em Natal |
| prisao-em-flagrante | Meu familiar foi preso. Ainda não sei em qual unidade ele está. | prisão em flagrante em Natal |
| audiencia-de-custodia | A audiência de hoje já decide se ele é culpado? | audiência de custódia em Natal |
| defesa-em-processo-criminal | Recebi uma citação. Qual é o próximo passo? | defesa em processo criminal em Natal |
| execucao-penal | Apareceu uma movimentação. O que aconteceu no processo? | advogado de execução penal em Natal |
| progressao-de-regime | O pedido de mudança de regime já foi decidido? | progressão de regime no RN |
| direitos-da-pessoa-presa | Minha dúvida é sobre a unidade prisional ou sobre o processo? | orientação à família de pessoa presa no RN |
| atendimento/parnamirim | Moro em Parnamirim e o documento veio de Natal. Aonde vou? | advogado criminal Parnamirim |
| início | — | advogado criminalista em Natal |

## Referências de mercado observadas (sem copiar texto ou composição)

- Tiago Neres (https://advtiagoneres.com/): contato em destaque e as fases de delegacia e custódia.
- Gabriel Bulhões (https://gabrielbulhoes.com.br/advogado-criminalista-em-natal/): página dedicada a Natal.
- Anderson Barros (https://www.andersonbarros.com/): perguntas próximas da linguagem da família.

Síntese aplicada: o contato está sempre a um toque (cabeçalho, topo de cada página e bloco final), e cada situação tem uma resposta concreta no primeiro parágrafo.

## Fontes oficiais citadas no site

Código de Processo Penal, Código Penal, Lei de Execução Penal, Constituição Federal (art. 5º), Estatuto da Advocacia (art. 7º), CNJ (perguntas frequentes sobre audiência de custódia), TJRN (unidades), Banco Central (devolução de Pix), CTB, Lei Maria da Penha, Código Civil e Lei 9.099/1995, todos em endereços oficiais (planalto.gov.br, cnj.jus.br, tjrn.jus.br, bcb.gov.br). Nesta sessão os links não puderam ser abertos, porque a rede estava restrita. Confira-os uma vez antes da publicação.

## Decisões de direção de arte

- A paleta vem do retrato à mesa: grafite do paletó no cabeçalho, vinho da gravata no botão principal e no itálico de “criminal”, bronze nos filetes e no monograma, papel claro na leitura.
- A capa traz o título e a introdução à esquerda e o retrato à direita, com a OAB numa faixa vertical e um bloco grafite atrás da foto, como o paletó contra a madeira.
- O retrato 07 aparece só na capa e o 04 só em `/o-advogado/`. O detalhe da janela (05) entra só no perfil da capa. As páginas internas não têm foto, porque a composição parte do assunto: documento anotado (intimação), origem da notícia e ficha (flagrante), etapas (custódia), número decodificado (citação), log de movimentações (execução), tabela de registros (progressão), duas portas (direitos), cabeçalho de documento (Parnamirim) e linha do tempo (primariedade).
- Movimento: máscara lateral de 600 ms no retrato, paralaxe de até 2 px em ponteiro preciso, entrada única de 8 px no índice, filete bronze que se desenha nos títulos, dissolução de 230 ms entre páginas (View Transitions). Com `prefers-reduced-motion`, tudo fica estático.
