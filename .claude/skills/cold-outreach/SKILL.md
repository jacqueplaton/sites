---
name: cold-outreach
description: Use when someone asks to write cold outreach, prospecting messages, a first contact or follow-ups to sell a website (or other agency service) to a business — WhatsApp, Instagram DM or e-mail, in Portuguese and English. Triggers: "prospecção", "mensagem fria", "abordagem", "prospectar cliente", "cold outreach", "cold email", "cold DM", "follow-up de prospecção".
argument-hint: [nome do negócio, link (site/Instagram/Google) ou caminho de um CSV]
---

## O que esta skill faz

Gera um **kit de prospecção personalizado** para um negócio (ou uma lista deles):
primeira mensagem por WhatsApp, Instagram DM e e-mail, sequência de follow-ups e
respostas para as objeções mais comuns — sempre em **português e inglês**.

Ela **não envia nada**. Só escreve. Quem envia, um a um e manualmente, é você.

Arquivos de apoio (leia quando o passo pedir):

- [perfil.md](perfil.md) — quem está prospectando: agência, oferta, preço, assinatura e
  **portfólio verificado**. É a única fonte de casos e números que a skill pode citar.
- [referencia.md](referencia.md) — regras de cada canal, estrutura das mensagens,
  exemplos bons e ruins, cadência, objeções e cuidados legais.

---

## Passo a passo

### 1. Carregar o perfil do remetente

Leia `perfil.md`. Se algum campo marcado `[PREENCHER]` for necessário para as
mensagens (nome de quem assina, nome da agência, assinatura de e-mail com endereço
físico), pergunte ao usuário **uma vez**, com AskUserQuestion, e ofereça salvar as
respostas no `perfil.md` para as próximas vezes.

Nunca invente nome de agência, preço, prazo ou caso de portfólio.

### 2. Identificar o(s) prospect(s)

Entrada: `$ARGUMENTS`.

- **Vazio** → pergunte: nome do negócio, cidade, nicho e pelo menos um link
  (site, Instagram ou perfil do Google).
- **Nome ou link** → um prospect.
- **Caminho de `.csv`** → um prospect por linha. Colunas esperadas (aceite variações):
  `negocio, nicho, cidade, site, instagram, google, whatsapp, email, observacao`.
  Processe cada linha pelos passos 3 a 6 e gere também o resumo do passo 7.

### 3. Pesquisar e achar o gancho

O gancho é **uma observação concreta e verdadeira** sobre o negócio, que conecta
com o que você oferece. É o que faz a mensagem não parecer disparo em massa.

1. Se houver site, abra com WebFetch e anote: existe? carrega? é responsivo?
   tem cardápio/serviços, preços, horário, botão de WhatsApp, versão em inglês?
2. Se houver perfil do Google, use WebSearch/WebFetch para ver nota, nº de
   avaliações, se o campo "site" está vazio ou aponta para Instagram/Linktree.
3. Instagram costuma bloquear leitura automática. Se não conseguir abrir,
   **peça ao usuário** o que ele viu (bio, link da bio, último post) — não suponha.
4. Escolha **um** gancho, o mais específico e verificável. Exemplos:
   - "o link do Google leva para o Instagram, não para um site"
   - "o cardápio só existe em foto nos destaques"
   - "o site não abre no celular" / "o site está fora do ar"
   - "muitas avaliações elogiam X, mas não há onde ver o cardápio"
5. Registre a **fonte** do gancho (URL ou "informado pelo usuário").

Se não encontrar nenhum gancho verificável, **diga isso ao usuário** e pergunte o
que ele observou. Não escreva elogio genérico ("adorei o perfil de vocês!").

Use só informação pública **do negócio**. Não colete dados pessoais de funcionários
ou clientes do prospect.

### 4. Decidir idioma e canal

- Idioma: gere **PT e EN** sempre. Marque qual mandar primeiro:
  dono/negócio brasileiro (nome, posts em português, comunidade BR) → PT primeiro;
  caso contrário → EN primeiro.
- Canal principal: o que o negócio mais usa (botão de WhatsApp no perfil →
  WhatsApp; perfil ativo → Instagram; só e-mail público → e-mail).
  Gere os três; destaque o principal.

### 5. Escolher o caso de portfólio e a oferta

Do `perfil.md`, escolha o caso **mais parecido** com o prospect (mesmo nicho,
mesma cidade, mesmo público). Só cite o que está escrito lá. Se o caso estiver com
`link: pendente`, descreva-o sem link e avise o usuário.

Escolha **um** CTA de baixo atrito (veja "CTAs" em `referencia.md`). Preferência:
oferecer um **rascunho/preview grátis** ou um **vídeo curto** mostrando a ideia,
não uma reunião.

### 6. Escrever o kit

Siga as regras de cada canal em `referencia.md`. Limites duros:

| Canal | 1ª mensagem | Link na 1ª? |
|---|---|---|
| WhatsApp | até 60 palavras, 2–4 linhas | Não |
| Instagram DM | até 50 palavras | Não |
| E-mail | assunto até 6 palavras; corpo até 120 palavras | No máximo 1 |
| Follow-up | até 40 palavras cada | Opcional |

Estrutura de toda primeira mensagem: **gancho → por que importa para ele → prova
(1 frase) → CTA em forma de pergunta de sim/não.** Nada de apresentação longa da
agência, lista de serviços ou "espero que esteja bem".

Escreva também:
- 3 follow-ups (D+3, D+7, D+14 — o último é o "encerramento" educado);
- respostas para 4 objeções: "quanto custa?", "já tenho site/Instagram",
  "agora não / sem tempo", "manda uma proposta";
- PT e EN para tudo. O inglês não é tradução literal: reescreva com naturalidade.

Antes de entregar, revise cada mensagem contra o checklist do fim deste arquivo.

### 7. Salvar e entregar

- Um prospect → `prospeccao/AAAA-MM-DD-<slug-do-negocio>.md`
- CSV → um arquivo por prospect + `prospeccao/AAAA-MM-DD-resumo.md` com a tabela:
  negócio | canal principal | idioma | gancho | arquivo.

Use o template abaixo. No chat, mostre só a primeira mensagem do canal principal
(nos dois idiomas) e o caminho do arquivo.

---

## Template de saída

```markdown
# Prospecção — [Negócio] ([cidade])

**Data:** AAAA-MM-DD · **Nicho:** … · **Canal principal:** … · **Mandar primeiro em:** PT | EN
**Contato:** WhatsApp … · Instagram … · E-mail …

## Gancho
[observação concreta] — fonte: [URL ou "informado pelo usuário"]

## Caso usado
[nome do caso do perfil.md] — [link ou "link pendente"]

## 1ª mensagem
### WhatsApp
**PT** …
**EN** …
### Instagram DM
**PT** …
**EN** …
### E-mail
**PT** — Assunto: … / corpo … / assinatura
**EN** — Subject: … / body … / signature

## Follow-ups
### D+3 — PT / EN
### D+7 — PT / EN
### D+14 (encerramento) — PT / EN

## Objeções
### "Quanto custa?" — PT / EN
### "Já tenho site / só uso Instagram" — PT / EN
### "Agora não" — PT / EN
### "Manda uma proposta" — PT / EN

## Antes de enviar
- [ ] Conferi o gancho com meus próprios olhos
- [ ] Troquei [colchetes] restantes
- [ ] E-mail tem endereço físico e opção de sair da lista
- [ ] Vou enviar manualmente, um a um
```

---

## Checklist de revisão (aplique em cada mensagem)

- [ ] O gancho é específico deste negócio e tem fonte? Trocando o nome, a mensagem
      ainda serviria para outro negócio? Se sim, reescreva.
- [ ] Respeita o limite de palavras do canal?
- [ ] Tem **um** CTA só, e ele é uma pergunta fácil de responder com "sim"?
- [ ] Nenhum número, resultado, cliente ou prazo que não esteja no `perfil.md`?
- [ ] Nenhuma frase de urgência falsa ("só hoje", "última vaga") nem elogio vazio?
- [ ] Nenhum termo técnico (SEO, responsivo, CTA, landing page) sem tradução para
      a linguagem do dono? Ex.: "aparecer no Google", "abre bem no celular".
- [ ] O EN soa como alguém nativo escreveria, não como tradução?
- [ ] E-mail: assunto honesto, assinatura com endereço físico, linha de opt-out.

## O que esta skill NÃO faz

- Não envia mensagens, não agenda envios e não integra com ferramentas de disparo.
- Não monta listas em massa nem raspa contatos. Trabalha com prospects que o
  usuário escolheu.
- Não inventa casos, depoimentos, métricas ("aumentamos 300% as vendas"), preços
  ou escassez.
- Não sugere disparo automático por WhatsApp/SMS: pode banir o número e, nos EUA,
  envolve a TCPA. Veja "Cuidados legais" em `referencia.md`.
