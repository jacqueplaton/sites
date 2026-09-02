# Tarefas

Ordem de execução. Quem pegar o projeto começa pelo primeiro item aberto.

## Agora

- [ ] **Validar a coleta contra a rede real.** Rodar
      `./prospect --city Natal --state RN --niche dentista --limit 20` numa
      máquina com saída para a internet e conferir o retorno do Nominatim e da
      Overpass. O fluxo inteiro já foi exercitado contra um servidor local que
      imita as duas APIs (coleta → dedupe → score → dossiê → dashboard); o que
      falta validar é só a viagem HTTP até os servidores públicos.
- [ ] **Escolher o corte da qualificação** sabendo do teto por fonte (D11):
      com OSM e `--buscar-dominio`, o máximo é 70; sem a opção, 40. O corte
      padrão de 60 não promove ninguém vindo do OSM sem `--buscar-dominio`.
- [ ] **Criar a chave da Places API e colocar em `.env`.** A fonte já está
      integrada (D13) e o caminho até o Google já foi exercitado deste ambiente;
      falta só a chave. No Google Cloud: criar projeto, habilitar a Places API,
      ativar faturamento, gerar a chave e **restringi-la** à Places API. Confira
      a tabela de preços antes de rodar em volume — os campos que pedimos ficam
      em faixas acima do Essentials.
- [ ] **Rodar a primeira coleta de verdade** com a chave e conferir se a
      resposta bate com as fixtures dos testes; ajustar o parser se algum campo
      vier diferente.

## Fase 3 — auditoria e IA

- [ ] `auditoria.md` por lead HOT, em `sites/clientes/<empresa>/`, com as 10
      perguntas do Módulo 5 e separação explícita entre **DADOS CONFIRMADOS** e
      **HIPÓTESES**.
- [ ] `analyze_lead()` — saída JSON `{score_ia, prioridade, problemas[],
      oportunidades[], argumento_comercial, abordagem, cta}`; sem evidência,
      `"não identificado"`.
- [ ] `generate_outreach()` — `outreach.md` com mensagem inicial, follow-up 1,
      follow-up 2 e mensagem final, cada uma citando um fato real do negócio.
- [ ] Botão **COPIAR MENSAGEM** na auditoria.
- [ ] Guardar o custo de cada chamada de IA por lead.

## Fase 4 — gerador de sites

- [ ] Template base de agência (tipografia, hierarquia, espaçamento, CTA,
      mobile-first, SEO básico, acessibilidade) em `sites/templates/`.
- [ ] `./create-site LEAD_ID`: lê lead + auditoria, gera copy, escolhe template,
      cria `sites/clientes/<empresa>/{site,imagens,dados.json,auditoria.md,
      copy.md,proposta.md}`, roda testes e gera preview.
- [ ] Seções: home, serviços, sobre, benefícios, localização, contato,
      WhatsApp. Depoimento **só se existir**. Placeholder identificado quando
      faltar informação.
- [ ] Verificação visual do site gerado antes de considerar pronto.
- [ ] Mudar o lead para `SITE_CRIADO` ao final.

## Fase 6 — pipeline completo

- [ ] Ligar as etapas 7 a 11 no `./run-prospecting` conforme as Fases 3 e 4
      forem ficando prontas.
- [ ] Follow-up D0/D2/D5/D10 com rascunho aguardando aprovação.

## CRM (completar a Fase 1)

- [ ] Arrastar cartão entre colunas.
- [ ] Registro de contato com data, observação, valor e próxima ação (as
      colunas já existem no banco).

## Dívidas conhecidas

- [ ] Quebra de métricas por **fonte** no dashboard (só com 2+ fontes).
- [ ] `web/` não tem teste de interface automatizado; a verificação é manual.
- [ ] `app/seeds.py` ficou fora dos pacotes novos — decidir onde mora.
