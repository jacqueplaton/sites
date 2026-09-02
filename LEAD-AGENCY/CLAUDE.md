# LEAD AGENCY OS — instruções do agente

Operação de prospecção e criação de sites para negócios locais. O objetivo não
é escrever código: é operar uma máquina de aquisição de clientes.

## Ao iniciar uma sessão

1. leia este arquivo;
2. leia `progress.md` (o que existe e funciona);
3. leia `tasks.md` (o que vem agora);
4. leia `decisions.md` antes de mudar arquitetura, score ou funil;
5. rode `.venv/bin/python -m pytest` para confirmar o estado real;
6. continue de onde parou.

## Postura

Execute. Quando a tarefa puder ser feita por terminal, arquivo ou código,
faça — não descreva como fazer. Leia os arquivos antes de alterá-los.
Mantenha o estado em `progress.md`, `tasks.md` e `decisions.md`.

## Regras invioláveis

1. **Não inventar dado.** Sem evidência no registro, escreva
   `"não identificado"`. Isso vale para auditoria, copy, site e mensagem.
2. **Não inventar API, endpoint, credencial ou preço.** Se a fonte exigir
   autenticação ou for paga, pare e documente: API necessária, custo,
   alternativa gratuita e limitação. Consulte a documentação oficial vigente
   antes de integrar.
3. **Não burlar** CAPTCHA, autenticação ou mecanismo anti-bot. Não raspar o
   que os termos de uso proíbem — Google Maps incluído.
4. **Nunca afirmar que uma empresa não tem site sem evidência.** Campo vazio
   na fonte não é prova: só `detect_missing_website()` com verificação HTTP
   executada pode concluir `SEM_SITE`.
5. **Não enviar mensagem.** Toda copy e toda abordagem são rascunho para
   revisão humana. Não existe integração de envio neste projeto.
6. **Não inventar depoimento, certificação, resultado ou informação médica**
   nos sites-demo. Faltou informação: placeholder identificado.
7. **Chaves só em `.env`** (veja `.env.example`), nunca no frontend.
8. **Confirmar antes de ação externa.** Comando que sai para a rede pergunta
   antes, salvo `--sim`.

## Qualidade — antes de dizer "pronto"

1. testar; 2. verificar erros; 3. rodar o fluxo inteiro; 4. conferir os
arquivos gerados; 5. olhar o site/tela quando houver. Sem esses cinco, a
funcionalidade não está pronta.

Ao terminar uma fase: rodar os testes, corrigir, atualizar `progress.md` e
`tasks.md`, registrar em `decisions.md` toda escolha que outra pessoa
questionaria.

## Mapa do projeto

```
app/core/            configuração, banco, cliente HTTP (timeout/retry/cache)
app/prospecting/     coleta: interface de fontes, OpenStreetMap, import CSV
app/lead_scoring/    dedupe, detector de site, score, nichos, auditoria
app/crm/             modelo Lead, schemas, CRUD e funil
app/dashboard/       métricas e export CSV/XLSX
app/site_generator/  Fase 4 — vazio
app/routers/         camada HTTP (FastAPI)
web/                 interface (Jinja2 + CSS/JS puro, sem build)
scripts/             comandos de terminal
prompts/             modelos de prompt para a camada de IA (Fase 3)
leads/               espelho do funil em arquivo; o banco é a fonte da verdade
sites/clientes/      um diretório por cliente (Fase 4)
```

## Comandos

```bash
./prospect --city Natal --state RN --niche dentista --limit 100
./run-prospecting --city Natal --state RN --niche dentista --limit 50
./create-site LEAD_ID
scripts/qualificar --corte 60
scripts/dashboard
scripts/servidor                # interface web em http://127.0.0.1:8000
.venv/bin/python -m pytest      # a suíte roda offline
```
