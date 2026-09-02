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

**Decisão.** OpenStreetMap (Nominatim + Overpass) está ligado, é gratuito e não
pede chave. Google Places API aparece como **indisponível** enquanto não houver
chave própria em `.env`. Raspagem do Google Maps está fora, por violar os termos
de uso.

**Consequência aceita.** O OSM não traz nota nem número de avaliações, então
quatro regras do score não disparam e o app **não consegue qualificar por poder
de compra** com essa fonte. Isso está dito na tela da busca, não escondido.
