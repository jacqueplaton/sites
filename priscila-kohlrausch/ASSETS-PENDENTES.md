# Pendências antes de publicar

## 1. Dados que faltam (aparecem no site entre colchetes)

| Campo | Onde aparece | Situação |
| --- | --- | --- |
| Cidade e UF | rótulo do hero, contato, rodapé, title/description, JSON-LD | `[CIDADE/UF]` |
| Número da OAB | seção de contato e política de privacidade | `[OAB/UF 000000]` |
| Endereço | seção de contato | `[ENDEREÇO]` — mapa só depois de confirmado |
| Horário de atendimento | seção de contato | `[HORÁRIO DE ATENDIMENTO]` |
| Domínio | canonical, Open Graph, JSON-LD, robots, sitemap | `dominio-a-definir.com.br` |
| Atendimento on-line/presencial | ainda não citado no texto | confirmar antes de escrever |
| Threads | não incluído | confirmar se entra no rodapé e no `sameAs` |

Confirmados e já no ar: WhatsApp +55 45 99862-2011 (com mensagem pronta),
e-mail adv.priscila16@gmail.com, Instagram @adv.priscilakohlrausch.

## 2. Textos que dependem de aprovação

- A frase **"Advogada, consultora jurídica e mãe de duas meninas."** está na
  seção Sobre e só pode ir ao ar com autorização expressa. Para retirar, apague
  o parágrafo com a classe `about__note` no `index.html`.
- As **listas de assuntos** das três áreas (quatro itens em cada) precisam ser
  validadas: só devem ficar as demandas que a advogada realmente atende.
  Estão marcadas com `TODO(cliente)` no `index.html`.

## 3. Mídias

| Arquivo | Situação | Observação |
| --- | --- | --- |
| `video/hero-priscila.mp4` + `.webm` | **instalado, provisório** | Usado no hero **e** na seção Sobre. A pessoa em cena **não é a Dra. Priscila** — é filmagem gerada. Como o hero representa a advogada, este é o arquivo mais urgente a substituir por gravação real dela. O vídeo é espelhado pelo CSS para ela ficar à direita. |
| seção Sobre | **usa o mesmo arquivo do hero** | Sem espelho e começando em outro ponto do vídeo, com a advogada à esquerda e o texto à direita. Trocando o vídeo do hero, esta cena troca junto. O retrato vertical anterior foi retirado do projeto. |
| `video/direito-bancario.mp4` + `.webm` | instalado | Cena de objetos (balança, banco, cartão, moedas). Sem pessoas: pode ficar. |
| `video/familia-sucessoes.mp4` + `.webm` | instalado | Cena de objetos (árvore, chave, casa, família em bronze). Sem pessoas: pode ficar. |
| `video/contratual-consumidor.mp4` + `.webm` | instalado | Cena de objetos (aperto de mãos, contrato com lupa, escudo, sacola e cartão). Sem pessoas: pode ficar. |
| `img/*.webp` e `.jpg` | prontos | Pôsteres extraídos dos vídeos; regerar junto com qualquer troca de filmagem. |
| `assets/logo/priscila-kohlrausch.svg` | **provisório** | Monograma PK desenhado aqui; trocar pelo logotipo oficial quando existir. |
| `assets/img/og-image.jpg` | pronto (1200×630) | Regerar se o logotipo mudar; fonte em `assets/img/og-image.svg`. |

Para ligar uma mídia nova, escreva o caminho no bloco `MIDIA`, no topo de
`js/app.js`. Enquanto o campo estiver vazio, a cena em SVG continua no lugar.

## 4. Antes de subir

- [x] WhatsApp confirmado: +55 45 99862-2011, com mensagem pré-preenchida.
- [ ] Confirmar cidade, UF e regiões atendidas.
- [ ] Confirmar OAB, endereço e horário.
- [ ] Confirmar atendimento on-line e presencial.
- [ ] Aprovar as listas de assuntos de cada área.
- [ ] Aprovar (ou retirar) a frase sobre ser mãe de duas meninas.
- [ ] Substituir os dois vídeos com pessoa (hero e Sobre) por gravação da própria advogada.
- [ ] Trocar o domínio provisório em todo o projeto.
- [ ] Revisar a Política de Privacidade e, se entrar analytics, tratar consentimento.
- [ ] Revisão ética final conforme o Provimento 205/2021 do CFOAB e a seccional.
- [ ] Testar WhatsApp, e-mail e Instagram no celular real.
