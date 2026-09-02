# Decisões

Registro do que foi decidido e por quê. Só entra aqui o que outra pessoa
questionaria ao ler o código.

---

## D1 — Reaproveitar o app existente em vez de recomeçar

**Contexto.** A especificação do LEAD AGENCY OS chegou depois de já existir um
app funcionando (banco, CRUD, import CSV, dedupe, detector de site, score,
dashboard, CRM e coleta no OpenStreetMap) com 97 testes passando.

**Decisão.** Renomear o projeto para `LEAD-AGENCY/`, reorganizar os módulos na
estrutura pedida e reconciliar as diferenças, em vez de escrever tudo de novo.

**Por quê.** Recomeçar jogaria fora código testado para reproduzir o mesmo
comportamento. O que a especificação pedia de diferente era estrutura, funil e
pesos — tudo reconciliável.

---

## D2 — Funil: união dos dois conjuntos da especificação

**Contexto.** O Módulo 2 lista `SITE_CRIADO` e não lista `REUNIAO`. O Kanban do
Módulo 9 lista `REUNIÃO` e `DEMO PRONTA`, e não lista `NEGOCIACAO`.

**Decisão.** Vale a união: `NOVO`, `QUALIFICADO`, `SITE_CRIADO`, `ABORDAR`,
`ABORDADO`, `RESPONDEU`, `INTERESSADO`, `REUNIAO`, `PROPOSTA`, `NEGOCIACAO`,
`FECHADO`, `PERDIDO`, `NAO_INTERESSADO`. `SITE_CRIADO` é a "DEMO PRONTA".
`NAO_INTERESSADO` vem da especificação anterior e foi mantido: é diferente de
`PERDIDO` (perdi a venda) e a distinção importa no follow-up.

**Por quê.** É o único conjunto que representa as duas telas sem perder etapa.

---

## D3 — Nomes de campo do modelo

**Contexto.** A especificação lista `nome` e `numero_avaliacoes`; o modelo usa
`nome_empresa` e `qtd_avaliacoes`.

**Decisão.** Manter os nomes do modelo. O importador de CSV aceita as duas
grafias (e mais uma dúzia de variações), então a planilha do cliente entra
igual.

**Por quê.** Renomear coluna de banco atravessaria todos os módulos e todos os
testes para ganhar nada — o ponto de contato com o mundo externo é o CSV, e ele
já traduz. `nome_empresa` também evita ambiguidade com nome de pessoa.

---

## D4 — Pesos do score

**Decisão.** Os pesos do Módulo 4 são os padrões: sem site +30, mais de 50
avaliações +15, nota ≥ 4,5 +10, telefone +10, Instagram +10, alto ticket +10,
presença digital fraca +10, empresa ativa +5; penalidades −30 (site
profissional), −20 (inativo) e −10 (pouca informação). Os positivos somam
exatamente 100, e existe teste que quebra se alguém desequilibrar isso.

**Critérios explícitos** para os termos qualitativos, todos configuráveis em
`data/config.json` pela tela de Configurações:

| Termo | Critério adotado |
|---|---|
| presença digital fraca | no máximo 1 canal ativo entre site confirmado, Instagram e Facebook |
| empresa aparentemente ativa | tem avaliação de cliente **ou** horário publicado |
| negócio aparentemente inativo | nenhuma avaliação, nenhuma nota e nenhum horário |
| pouca informação | menos de 3 campos preenchidos entre telefone, endereço, horário, redes, site, nota e avaliações |

**Por quê.** "Presença fraca" não é executável; um número é. Deixar o número
visível e editável é melhor que escondê-lo no código.

---

## D5 — `SEM_SITE` exige verificação, sempre

**Decisão.** `detect_missing_website()` só devolve `SEM_SITE` quando testou de
fato. Campo vazio na fonte vira `SITE_NAO_CONFIRMADO` / `NAO_VERIFICADO`. A
coleta nunca conclui nada sobre site; quem conclui é a qualificação.

**Por quê.** É a diferença entre uma abordagem com fato ("vi que vocês não têm
site") e uma com chute — que queima o lead na primeira frase.

---

## D6 — Pastas `core/` e `routers/` fora da árvore original

**Decisão.** A árvore da especificação não previa lugar para configuração,
banco e cliente HTTP (que são de todo mundo) nem para a camada HTTP. Ficaram em
`app/core/` e `app/routers/`.

---

## D7 — `leads/` espelha o funil; o banco manda

**Decisão.** `scripts/prospect` e `scripts/qualificar` gravam um JSON por lead
em `leads/<etapa>/`, e o arquivo muda de pasta quando o lead muda de etapa.
Esses arquivos são derivados: a fonte da verdade é `data/leads.db`. Por isso
estão no `.gitignore`.

---

## D8 — Comandos que não podem cumprir o que prometem recusam

**Decisão.** `./create-site` existe, encontra o lead, e então diz que o gerador
é a Fase 4 e não vai criar pasta pela metade. `./run-prospecting` executa
coleta, dedupe, score e seleção, e para antes da auditoria/site/copy.

**Por quê.** Comando que cria diretório vazio ou arquivo genérico dá a impressão
de que a etapa existe. Recusar com o motivo é mais útil.

---

## D9 — Fontes de coleta

**Decisão (revista em D13).** OpenStreetMap (Nominatim + Overpass) está ligado,
é gratuito e não pede chave. A Google Places API foi integrada e fica
disponível assim que houver `GOOGLE_MAPS_API_KEY` no `.env`. Raspagem do Google
Maps segue fora, por violar os termos de uso.

**Consequência aceita.** O OSM não traz nota nem número de avaliações, então
quatro regras do score não disparam e o app **não consegue qualificar por poder
de compra** com essa fonte. Isso está dito na tela da busca, não escondido.

---

## D10 — "Não informado" não é "zero"

**Contexto.** Rodando `./prospect` de ponta a ponta contra um servidor local
que imita as APIs do OSM, todos os leads coletados caíram em score 0–35. A
causa: `qtd_avaliacoes` vinha `None` (o OSM não tem esse campo) e o score
tratava `None` como zero, disparando a penalidade de −20 por "negócio
aparentemente inativo".

**Decisão.** `None` e `0` passam a ser coisas diferentes. A penalidade só
dispara quando sabemos que há zero avaliações; quando a fonte não informou, a
regra não aplica e o motivo registrado diz exatamente isso.

**Por quê.** É o mesmo princípio do detector de site (D5): ausência de dado não
é evidência de ausência. Punir o lead pela limitação da fonte é errar duas
vezes — o número fica errado e a explicação na auditoria fica mentirosa.

**Como apareceu.** Executando o fluxo real, não escrevendo teste. Vale como
lembrete: o Módulo 15 pede rodar o fluxo inteiro justamente por isso.

---

## D11 — Teto de score por fonte, e o `--buscar-dominio`

**Medido** com os pesos atuais: OSM sem verificar site chega a **40** (COLD);
OSM com `--buscar-dominio` chega a **70** (WARM); com nota e nº de avaliações
chega a **95** (HOT).

**Decisão.** `scripts/qualificar` ganhou `--buscar-dominio`, desligado por
padrão. Ligado, o detector testa domínios derivados do nome
(`empresa.com.br`, `empresa.com`) e pode concluir `SEM_SITE` — o único caminho
para os +30. Fica opcional e explícito porque adivinhar domínio é palpite
verificado, não dado de fonte: o app pede confirmação e registra a evidência.

**Consequência aceita.** Com OSM, lead HOT não existe. Quem precisa de HOT
precisa da Places API.

---

## D12 — Falha nossa não é evidência sobre o destino

**Contexto.** Rodando `scripts/qualificar --buscar-dominio` com a saída de rede
bloqueada, o lead "Academia Corpo em Movimento" saiu de
`SITE_NAO_CONFIRMADO / NAO_VERIFICADO` para **`SEM_SITE / NAO_ENCONTRADO`**, com
a evidência *"domínios candidatos testados sem resposta"*. Nenhum domínio foi
testado: o proxy recusou toda conexão. O lead ganhou os +30 do "sem site" e
subiu de COLD para HOT — apoiado em evidência inventada.

**Decisão.** O cliente HTTP passa a classificar a falha em `"dns"` (o domínio
não resolve — isso fala do destino) ou `"rede"` (proxy, timeout, conexão
recusada, sem rota — isso fala de nós), e o detector age diferente em cada uma:

| Situação | Antes | Agora |
|---|---|---|
| Candidatos não resolvem | `SEM_SITE` | `SEM_SITE` (correto: foi testado) |
| Não conseguimos sair | `SEM_SITE` ❌ | `SITE_NAO_CONFIRMADO / NAO_VERIFICADO` |
| Site informado, domínio não resolve | `INVALIDO` | `INVALIDO` |
| Site informado, rede fora | `INVALIDO` ❌ | `NAO_VERIFICADO` |

`scripts/qualificar` também avisa quando **todas** as verificações de uma rodada
falharam por rede, para score baixo por falta de conexão não passar por score
baixo do lead.

**Por quê.** É a regra D5 levada até o fim. Antes, o detector não concluía
"sem site" por campo vazio, mas concluía por erro de conexão — o mesmo chute,
por outra porta. E era o pior tipo de erro: silencioso, com aparência de
evidência, empurrando o lead errado para o topo da fila de abordagem.

**Como apareceu.** Executando o comando de qualificação de verdade, num
ambiente sem rede. Nenhum teste pegava isso porque as fixtures devolviam um
erro genérico, sem distinguir os dois casos — foram corrigidas para serem
explícitas.

---

## D13 — Google Places API integrada; ela é a fonte recomendada

**Contexto.** Faltava decidir a fonte paga. Ao testar a conectividade host a
host, apareceu um fato que mudava a conta: neste ambiente
`places.googleapis.com` **é alcançável**, enquanto os servidores do
OpenStreetMap são bloqueados. Ou seja, a fonte paga é a que funciona aqui — e o
que faltava para ela era só a chave.

**Decisão.** Implementar a fonte `google_places` (`places:searchText` da Places
API New), sob a mesma interface `FonteDeLeads`. Ela passa a ser a fonte
recomendada, porque é a única que traz site, telefone, nota e nº de avaliações
na mesma resposta — os quatro campos que faltavam para o score separar lead com
poder de compra (D11).

**Contenções de custo, já que a cobrança é por requisição:**

- sem chave, **nenhuma requisição sai** — a fonte recusa antes de tentar;
- o *field mask* pede exatamente os campos que o score e a abordagem consomem,
  nada "por via das dúvidas" (campo a mais pode subir a faixa de cobrança);
- no máximo 3 páginas por busca, respeitando o teto de 60 resultados da própria
  API, e parando assim que a quantidade pedida for atingida;
- cache de POST chaveado por URL **e** corpo: repetir a mesma busca por engano
  não é cobrado duas vezes;
- `./prospect` avisa que a fonte é paga e pede confirmação antes de sair;
- o resultado informa quantas requisições foram feitas.

**Sem `--source`, a fonte é escolhida sozinha:** Places quando há chave,
OpenStreetMap quando não há. Configurar uma chave paga já é a escolha da fonte.

**O que este código não faz:** estimar preço. A tabela e a calculadora oficiais
são a referência, e os campos que pedimos ficam em faixas acima do Essentials.

**Estado da verificação.** A requisição real foi executada contra
`places.googleapis.com` deste ambiente: com chave vazia, a fonte recusa sem
tentar; com chave inválida, o Google responde *"API key not valid"* e a
mensagem dele é repassada literalmente. Ou seja, endpoint, cabeçalhos e corpo
chegam ao Google e passam pela validação de formato — falta apenas uma chave
válida para ver os dados. A conversão, os filtros, a paginação e os erros estão
cobertos por 15 testes com fixtures no formato documentado.
