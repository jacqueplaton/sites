# Progresso

Atualizado em 02/09/2026 · 135 testes passando (`.venv/bin/python -m pytest`)

## Fase 1 — estrutura, banco, CRM, importação CSV, score ✅

| Entrega | Estado | Onde |
|---|---|---|
| Banco SQLite + modelo Lead (todos os campos do Módulo 2) | pronto | `app/crm/models.py` |
| Funil com 13 status (união das duas listas da especificação) | pronto | `app/crm/models.py` |
| CRUD + filtros + paginação + ordenação | pronto | `app/crm/crud.py` |
| Importador de CSV tolerante a cabeçalho, com relatório | pronto | `app/prospecting/importer.py` |
| Deduplicação bloqueante por chave composta | pronto | `app/lead_scoring/dedupe.py` |
| `detect_missing_website()` com evidência e confiança | pronto | `app/lead_scoring/website_detector.py` |
| Falha de rede separada de domínio inexistente (D12) | pronto | `app/core/http_client.py` |
| Score 0–100 configurável, com justificativa por regra | pronto | `app/lead_scoring/scoring.py` |
| Dashboard web + dashboard de terminal | pronto | `app/dashboard/metrics.py`, `app/cli.py` |
| CRM Kanban (leitura + troca de status) | parcial | `web/templates/crm.html` |
| Export CSV/XLSX com filtros | pronto | `app/dashboard/exporter.py` |
| Configurações (pesos, limiares, faixas, nichos) | pronto | `web/templates/configuracoes.html` |
| Seeds fictícios (18 leads) | pronto | `app/seeds.py` |

## Fase 2 — coleta permitida, deduplicação, qualificação ✅ (parcial)

| Entrega | Estado | Onde |
|---|---|---|
| Interface de fontes (para a Places API entrar como plugin) | pronto | `app/prospecting/fontes.py` |
| Fonte OpenStreetMap (Nominatim + Overpass) | pronto | `app/prospecting/overpass.py` |
| Rota `POST /api/busca` + tela Buscar Leads | pronto | `app/routers/busca.py` |
| `scripts/prospect` e `scripts/qualificar` | pronto | `app/cli.py` |
| Fonte Google Places (`places:searchText`) | **integrada** | falta só a chave em `.env` (D13) |

**Places API — estado da verificação.** A requisição real foi executada contra
`places.googleapis.com`: sem chave a fonte recusa sem tentar; com chave
inválida o Google responde *"API key not valid"*, e a mensagem dele é repassada
literalmente. Endpoint, cabeçalhos e corpo chegam ao Google e passam pela
validação de formato — falta apenas uma chave válida para ver os dados.

**OpenStreetMap — ressalva de verificação:** a chamada HTTP aos servidores públicos do
OpenStreetMap nunca foi executada — o ambiente de desenvolvimento bloqueia
saída externa. O fluxo completo (`./prospect` → dedupe → score → dossiê em
`leads/` → `scripts/qualificar` → `scripts/dashboard`) **foi** exercitado contra
um servidor local que devolve as respostas no formato documentado das duas
APIs, e foi assim que apareceu o defeito corrigido em D10. Falta apenas a
viagem HTTP até `nominatim.openstreetmap.org` e `overpass-api.de`.

Os endereços das duas APIs agora saem de `LM_NOMINATIM_URL` e `LM_OVERPASS_URL`
— dá para trocar de espelho da Overpass ou apontar para instância própria sem
tocar no código.

## Fase 3 — auditoria, IA, copy 🟡 em parte

- auditoria **por regras** pronta (presença digital, oportunidades, "por que
  esse lead é interessante", "o que vender"), em `app/lead_scoring/audit.py`;
- auditoria em **arquivo `auditoria.md`** por lead HOT: falta;
- `analyze_lead()` e `generate_outreach()` com IA: falta. Sem chave em `.env`,
  o app informa que está indisponível e não gera texto nenhum;
- modelos de prompt já escritos em `prompts/`.

## Fase 4 — gerador de sites ⬜ não iniciada

`app/site_generator/` está vazio de propósito. `./create-site` encontra o lead e
recusa a execução explicando (D8).

## Fase 5 — dashboard ✅

Web e terminal. Falta a quebra por **fonte**, que só faz sentido com uma segunda
fonte de coleta.

## Fase 6 — pipeline ⬜ parcial

`./run-prospecting` faz coleta → dedupe → score → seleção e para antes de
auditoria, site e copy, que dependem das Fases 3 e 4.

## O que está testado

135 testes, ~5 s, **sem nenhuma requisição de rede**: dedupe (11), detector de
site (11), score (11), API de leads (11), filtros (11), import/export (9),
CRM e dashboard (8), configuração e robustez do cliente HTTP (11), coleta na
fonte (16). Seeds fictícios permitem rodar o fluxo inteiro offline.

Verificado além dos testes: as seis telas abrem sem erro de JavaScript, o
dashboard fecha as contas, os quatro comandos de terminal rodam, e os dossiês
em `leads/` mudam de pasta quando o lead muda de etapa.
