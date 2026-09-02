# LEAD AGENCY OS

App local para encontrar, qualificar e acompanhar negócios locais que precisam
de site, manutenção, SEO local, Google Meu Negócio, Google Ads e automação de
WhatsApp.

Fluxo: **lead → qualificação → auditoria → score → site demo → copy →
abordagem → CRM → follow-up → venda**.

Estado atual: **Fases 1, 2 e 5 prontas**; auditoria por regras pronta e camada
de IA pendente (Fase 3); gerador de sites não iniciado (Fase 4). O detalhe está
em `progress.md`, o que vem a seguir em `tasks.md`, e o porquê de cada escolha
em `decisions.md`.

---

## Regras que o app respeita (por construção, não por promessa)

- **Não envia mensagem.** Não existe integração de envio no código. Todo texto
  gerado é rascunho para revisão humana.
- **Não raspa o que não pode.** Não há scraping de Google Maps nem de nenhuma
  plataforma cujos termos proíbam. A única saída de rede é a verificação do
  site do próprio lead — uma requisição à home, com User-Agent identificável,
  respeitando `robots.txt`, com timeout, retry e intervalo mínimo por host.
- **Não inventa dado.** Sem evidência no registro, a saída é
  `"não identificado"`. O detector nunca conclui "sem site" só porque a fonte
  não trouxe o campo.
- **Chaves só no servidor.** Ficam em `.env` (veja `.env.example`) e nenhuma
  delas é exposta em rota, template ou JavaScript.
- **LGPD.** Os dados tratados são de contato profissional público de pessoa
  jurídica. Cada lead guarda `fonte` e `data_coleta`, e pode ser excluído
  (`DELETE /api/leads/{id}`) para atender a pedido de exclusão.

---

## Como rodar

### Com Python (recomendado no dia a dia)

```bash
cd LEAD-AGENCY
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env               # opcional: os padrões já funcionam

python main.py --seed              # carrega 18 leads fictícios (opcional)
scripts/servidor                   # http://127.0.0.1:8000
```

### Comandos de terminal

```bash
./prospect --city Natal --state RN --niche dentista --limit 100
                                   # coleta na fonte, deduplica e pontua
scripts/qualificar --corte 60      # verifica o site por HTTP, repontua e promove
scripts/dashboard                  # métricas do funil no terminal
./run-prospecting --city Natal --state RN --niche dentista --limit 50
                                   # coleta -> dedupe -> score -> seleção
./create-site LEAD_ID              # Fase 4: recusa e explica (decisions.md, D8)
```

Todo comando que sai para a rede pergunta antes; use `--sim` para não perguntar.

### Com Docker

```bash
cd lead-agency
docker compose up --build          # http://localhost:8000
```

O banco e a configuração ficam em `./data`, fora do contêiner.

### Testes

```bash
.venv/bin/python -m pytest         # 135 testes, ~5 s, nenhuma requisição de rede
```

Os testes usam banco temporário e um cliente HTTP falso: rodam offline, sem
tocar em plataforma externa nenhuma.

---

## Em poucos cliques

1. **Buscar Leads** → cidade + nicho na fonte gratuita (OpenStreetMap), ou **Leads → Importar CSV**
2. **Leads** → filtro *Só sem site (confirmado)* → ordenar por *Maior score*
3. clicar na empresa → **Auditoria**: score explicado, presença digital,
   por que o lead é interessante e o que vender
4. mudar o status ali ou no **CRM**
5. **Exportar CSV/XLSX** com os filtros aplicados

---

## Arquitetura

```
LEAD-AGENCY/
├── CLAUDE.md                instruções do agente e regras invioláveis
├── progress.md              o que existe e funciona
├── tasks.md                 o que vem agora
├── decisions.md             o que foi decidido e por quê
├── prospect · create-site · run-prospecting     atalhos da raiz
├── main.py                  servidor (ou --seed)
├── scripts/                 prospect · buscar_leads · qualificar · criar_site
│                            dashboard · run-prospecting · servidor
├── app/
│   ├── cli.py               os comandos de terminal
│   ├── core/                config (.env + config.json), banco, cliente HTTP
│   ├── prospecting/         fontes (interface + OpenStreetMap) e import CSV
│   ├── lead_scoring/        dedupe · detector de site · score · nichos · auditoria
│   ├── crm/                 modelo Lead, schemas, CRUD e funil
│   ├── dashboard/           métricas e export CSV/XLSX
│   ├── site_generator/      Fase 4 — vazio de propósito
│   ├── routers/             camada HTTP: leads · busca · dashboard · config · páginas
│   └── seeds.py             18 leads fictícios
├── web/                     interface: Jinja2 + CSS/JS puro, sem build
├── prompts/                 auditoria.md · site.md · copy.md · prospeccao.md
├── leads/                   espelho do funil em arquivo (derivado do banco)
│   └── novos · qualificados · abordados · clientes
├── sites/
│   ├── templates/           templates de site da agência (Fase 4)
│   └── clientes/            um diretório por cliente (Fase 4)
├── tests/                   135 testes, todos offline
└── data/                    leads.db e config.json (não versionados)
```

**Stack:** Python 3.11 · FastAPI · SQLAlchemy · SQLite · Jinja2 · HTML/CSS/JS
puro · openpyxl. A similaridade de nomes usa `difflib` da biblioteca padrão,
sem dependência extra.

---

## Modelo de dados

`Lead`: `id`, `nome_empresa`, `categoria`, `subcategoria`, `cidade`, `estado`,
`pais`, `endereco`, `telefone`, `website`, `instagram`, `facebook`,
`google_maps_url`, `avaliacao`, `qtd_avaliacoes`, `horario`, `descricao`,
`fonte`, `data_coleta`, `status`, `score`, `observacoes`.

Campos que o app calcula e guarda com a justificativa: `site_situacao`,
`website_status`, `website_confianca`, `website_url_verificada`,
`website_evidencia`, `website_verificado_em`, `faixa`, `score_detalhe`, além
das chaves normalizadas de deduplicação.

**Status:** `NOVO`, `QUALIFICADO`, `SITE_CRIADO`, `ABORDAR`, `ABORDADO`,
`RESPONDEU`, `INTERESSADO`, `REUNIAO`, `PROPOSTA`, `NEGOCIACAO`, `FECHADO`,
`PERDIDO`, `NAO_INTERESSADO` — a união dos dois funis da especificação (veja
`decisions.md`).

---

## `detect_missing_website()`

Retorna `SEM_SITE` · `TEM_SITE` · `SITE_NAO_CONFIRMADO`, junto com
`website_status` = `CONFIRMADO` · `NAO_ENCONTRADO` · `INVALIDO` ·
`NAO_VERIFICADO`, um nível de confiança de 0 a 1 e a evidência de cada passo.

| Situação encontrada | Resultado | Confiança |
|---|---|---|
| Campo vazio, sem verificação | `SITE_NAO_CONFIRMADO` / `NAO_VERIFICADO` | 0,0 |
| Campo vazio, candidatos testados sem resposta | `SEM_SITE` / `NAO_ENCONTRADO` | 0,6 |
| URL malformada ou link de rede social | `SITE_NAO_CONFIRMADO` / `INVALIDO` | 0,3–0,4 |
| Domínio não resolve, 4xx/5xx, ou página estacionada | `SITE_NAO_CONFIRMADO` / `INVALIDO` | 0,5–0,6 |
| Falha nossa (proxy, timeout, sem rota) | `SITE_NAO_CONFIRMADO` / `NAO_VERIFICADO` | 0,0 |
| `robots.txt` do host proíbe a leitura | `SITE_NAO_CONFIRMADO` / `NAO_VERIFICADO` | 0,2 |
| Responde 2xx com conteúdo real | `TEM_SITE` / `CONFIRMADO` | 0,95–1,0 |
| Domínio adivinhado que responde e cita a empresa | `TEM_SITE` / `CONFIRMADO` | 0,75–0,8 |

Falha de rede **nunca** vira conclusão: se não conseguimos sair, o resultado é
"não verificado", não "sem site" (veja `decisions.md`, D12). `scripts/qualificar`
avisa quando todas as verificações de uma rodada falharam por conexão.

A busca por domínio candidato (`empresa.com.br`, `empresa.com`) é **desligada
por padrão** — ligue em `LM_BUSCAR_DOMINIO_CANDIDATO=true` se quiser que o app
teste domínios derivados do nome. Ela é o único caminho pelo qual `SEM_SITE`
pode ser afirmado: sem teste, não há conclusão.

O import de CSV nunca verifica site na rede; a verificação é sob demanda, pelo
botão **Verificar site agora** da auditoria (`POST /api/leads/{id}/verificar-site`).

---

## Score

| Regra | Peso |
|---|---|
| Sem site, ausência verificada | +30 |
| Mais de 50 avaliações | +15 |
| Nota 4,5 ou mais | +10 |
| Telefone disponível | +10 |
| Instagram disponível | +10 |
| Categoria de alto ticket | +10 |
| Presença digital fraca (≤1 canal ativo) | +10 |
| Empresa aparentemente ativa | +5 |
| Já tem site próprio no ar | −30 |
| Negócio aparentemente inativo | −20 |
| Cadastro com menos de 3 informações | −10 |

Os positivos somam exatamente 100 — a escala foi desenhada assim, e há teste
que quebra se alguém desequilibrar os pesos sem perceber.

Resultado limitado a 0–100. Faixas: **HOT** 80–100 · **WARM** 60–79 ·
**COLD** 40–59 · **LOW** 0–39.

Pesos, limiares, faixas e nichos são editáveis em **Configurações** (gravados
em `data/config.json`); salvar recalcula a base inteira. Toda regra guarda o
motivo — a auditoria mostra por que cada ponto foi dado ou não.

Onde o briefing usa termo qualitativo, o app escolheu um critério explícito e o
deixou configurável: *presença digital fraca* = no máximo 1 canal ativo entre
site confirmado, Instagram e Facebook; *empresa aparentemente ativa* = tem
avaliação de cliente ou horário publicado; *negócio aparentemente inativo* =
nenhuma avaliação, nenhuma nota e nenhum horário; *pouca informação* = menos de
3 campos preenchidos entre telefone, endereço, horário, redes, site, nota e
avaliações.

---

## Deduplicação

Cadastro duplicado é **bloqueado** (HTTP 409, com o motivo e o lead existente).
As regras, da mais forte para a mais fraca:

1. mesma URL do Google Maps;
2. mesmo telefone normalizado (sem DDI, sem zero de operadora);
3. mesmo domínio de site (redes sociais não contam como domínio);
4. nome ≥87% parecido, mesma cidade **e** (endereço ≥80% parecido **ou** mesmo
   telefone);
5. nome ≥95% parecido na mesma cidade quando nenhum dos dois tem endereço ou
   telefone — não há como distinguir, e contato repetido é pior que um lead
   duplicado a menos.

Duas unidades da mesma rede, com endereços diferentes, continuam sendo dois
leads. `POST /api/leads/checar-duplicata` consulta sem gravar.

---

## API

| Método | Rota | O que faz |
|---|---|---|
| `GET` | `/api/leads` | lista com filtros e paginação |
| `POST` | `/api/leads` | cria (409 se for duplicata) |
| `POST` | `/api/leads/checar-duplicata` | consulta duplicidade sem gravar |
| `GET/PUT/DELETE` | `/api/leads/{id}` | detalhe, edição, exclusão |
| `POST` | `/api/leads/{id}/status` | muda o status e registra observação |
| `POST` | `/api/leads/{id}/verificar-site` | roda o detector com acesso HTTP |
| `GET` | `/api/leads/{id}/auditoria` | auditoria comercial |
| `GET` | `/api/dashboard` | métricas (aceita os mesmos filtros) |
| `GET` | `/api/opcoes` | valores para os selects da interface |
| `GET` | `/api/busca/fontes` | fontes de coleta e o que cada uma entrega |
| `POST` | `/api/busca` | coleta na fonte e grava passando por dedupe/detector/score |
| `POST` | `/api/import/csv` | importa (multipart, até 10 MB) |
| `GET` | `/api/export/csv` · `/api/export/xlsx` | exporta com os filtros |
| `GET/PUT` | `/api/config` | pesos, limiares, faixas, nichos |
| `POST` | `/api/config/restaurar` | volta aos padrões |
| `POST` | `/api/seeds` | carrega os leads fictícios |
| `GET` | `/api/saude` | status do serviço |

Documentação interativa em `/docs`.

**Filtros aceitos** (listagem, dashboard e export): `q`, `cidade`, `estado`,
`categoria`, `status`, `faixa`, `site`, `website_status`, `score_min`,
`score_max`, `avaliacao_min`, `avaliacoes_min`, `tem_telefone`,
`tem_instagram`, `tem_website`, `ordenar`.

**Import de CSV** — colunas aceitas em várias grafias (`nome_empresa`, `nome`,
`empresa`, `razão social`, `name`…; `categoria`/`nicho`; `telefone`/`fone`/
`whatsapp`; `avaliacao`/`nota`; `qtd_avaliacoes`/`avaliacoes`/`reviews`…).
Separador `,`, `;` ou tab, detectado pelo cabeçalho. Só `nome_empresa` é
obrigatória. O relatório traz importados, duplicados bloqueados (com o motivo)
e erros por linha. O CSV que o app exporta pode ser reimportado.

---

## Status por fase

**Fase 1 — pronta**

- banco, CRUD e API de leads
- import de CSV com relatório e dedupe
- filtros, ordenação, paginação e export CSV/XLSX
- `detect_missing_website()` com evidência e confiança
- score configurável com justificativa por regra
- dashboard com funil, taxas e quebras por nicho, cidade e abordagem
- auditoria comercial por regras (presença digital, oportunidades, "por que
  esse lead é interessante", "o que vender")
- interface completa: Dashboard · Buscar Leads · Leads · CRM · Auditoria ·
  Configurações
- 135 testes, seeds fictícios, logs, rate limit, retry, timeout e cache

**Fase 2 — coleta: OpenStreetMap ligado, Places API pendente de chave**

A tela **Buscar Leads** funciona: escolhe a fonte, cidade, estado, país, nicho,
quantidade, raio e os toggles, e os resultados entram na base passando pelo
mesmo caminho de sempre (`criar_lead` → dedupe → detector → score). Nenhum lead
entra por fora disso.

| Fonte | Situação | Custo | O que entrega |
|---|---|---|---|
| **Google Places API** (`places:searchText`) | **integrada** — basta `GOOGLE_MAPS_API_KEY` no `.env` | paga, por requisição, com conta de faturamento no Google Cloud | nome, endereço, telefone, **site, nota e nº de avaliações**, horário e URL do Maps. É a única que permite qualificar por reputação |
| OpenStreetMap (Nominatim + Overpass) | ligada | gratuita | nome, endereço, telefone, site quando etiquetado. **Sem nota e sem avaliações** |
| Import de CSV | disponível | zero | depende de você já ter a lista |

Sem `--source`, o app usa a Places quando há chave e o OpenStreetMap quando não
há. Configurar a chave já é a escolha da fonte.

**Custo sob controle** (a cobrança é por requisição): sem chave nenhuma
requisição sai; o *field mask* pede só os campos que o score consome; no máximo
3 páginas por busca (a API devolve até 60 resultados); cache por consulta, para
uma busca repetida por engano não ser cobrada duas vezes; e `./prospect` avisa
que a fonte é paga antes de sair. O app **não estima preço** — confira a tabela
oficial.

Raspagem do Google Maps está fora: viola os termos de uso.

**Consequência prática de usar o OSM em vez da Places:** sem nota e sem nº de avaliações, quatro
regras do score não têm como disparar (`muitas_avaliacoes`, `boa_nota`,
`empresa_estabelecida`, `aparentemente_inativa`). O lead entra com score menor
e os filtros de reputação da busca não se aplicam — a própria tela avisa isso
no resultado. Para qualificar por poder de compra com dado de reputação, a
fonte é a Places API.

Nichos que o OSM etiqueta de forma confiável: dentista, clínica, advocacia,
estética, salão, barbearia, academia, oficina, auto center, imobiliária,
restaurante, contador, arquiteto, fisioterapeuta e nutricionista (rara no
Brasil). Nicho fora dessa lista faz a busca parar com a explicação, em vez de
devolver categoria errada.

> **Aviso de verificação:** a chamada de rede real ao Nominatim e à Overpass
> **não foi executada** no ambiente onde este código foi escrito — a saída
> externa é bloqueada lá. A montagem da consulta, a conversão para Lead, os
> filtros, os avisos e todos os caminhos de erro estão cobertos por testes com
> respostas de fixture no formato documentado de cada API; o que falta validar,
> na sua máquina, é a viagem HTTP de ida e volta. Se algo falhar, a tela mostra
> a causa real (sem rede, cidade desconhecida, Overpass fora do ar).

### Teto de score por fonte

Rodando o fluxo de ponta a ponta, os pesos atuais impõem um teto que depende
da fonte — vale conhecer antes de escolher o corte da qualificação:

| Cenário | Teto alcançável | Faixa |
|---|---|---|
| OSM, qualificando sem verificar site | **40** | COLD |
| OSM + `scripts/qualificar --buscar-dominio` | **70** | WARM |
| Com nota e nº de avaliações (Places API) | **95** | HOT |

Duas consequências práticas:

1. **Sem `--buscar-dominio`, nenhum lead do OSM passa de COLD.** O detector não
   conclui `SEM_SITE` por campo vazio (é a regra D5), então os +30 nunca
   disparam e o corte padrão de 60 não promove ninguém. Ou você usa a opção, ou
   baixa o corte conscientemente.
2. **Lead HOT exige reputação**, que só a Places API traz. Com OSM, o topo é
   WARM. Não é limitação do score: é o dado que não existe na fonte.

**Atribuição obrigatória:** os dados do OpenStreetMap são ODbL. Em qualquer uso
público do que sair dessa coleta, credite “© colaboradores do OpenStreetMap”.

**Fase 3 — camada de IA.** `analyze_lead()` e `generate_outreach()` (versões
curta, consultiva e direta) dependem de chave da Anthropic ou da OpenAI em
`.env`. Sem chave, a auditoria informa que a análise está indisponível e **não
gera texto nenhum** — não há fallback inventado. O que a auditoria já mostra
hoje sai de regra sobre dado real.

**Fase 4 — CRM completo.** Arrastar cartão, registro de contato com data,
próxima ação, valor de proposta, motivo da perda e follow-up D0/D2/D5/D10 com
rascunhos aguardando aprovação. As colunas do banco (`proxima_acao`,
`proxima_acao_em`, `valor_proposta`, `motivo_perda`, `tipo_abordagem`) já
existem e o dashboard já lê valor vendido, ticket médio e conversão por
abordagem — falta a interface.

---

## Variáveis de ambiente

Todas opcionais; os padrões rodam. Veja `.env.example`.

| Variável | Padrão | Para quê |
|---|---|---|
| `LM_DB_PATH` | `data/leads.db` | arquivo SQLite |
| `LM_CONFIG_PATH` | `data/config.json` | pesos, limiares e nichos |
| `LM_HOST` · `LM_PORT` | `127.0.0.1` · `8000` | endereço do servidor |
| `LM_LOG_LEVEL` | `INFO` | nível de log |
| `LM_HTTP_TIMEOUT` | `8` | timeout de cada requisição (s) |
| `LM_HTTP_RETRIES` | `2` | tentativas por URL |
| `LM_HTTP_INTERVALO_HOST` | `1.0` | intervalo mínimo entre chamadas ao mesmo host (s) |
| `LM_HTTP_CACHE_MIN` | `60` | validade do cache de verificação (min) |
| `LM_USER_AGENT` | `LeadAgency/1.0 …` | identificação nas requisições |
| `LM_BUSCAR_DOMINIO_CANDIDATO` | `false` | testar domínios derivados do nome |
| `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` | — | Fase 3, ainda não utilizadas |
