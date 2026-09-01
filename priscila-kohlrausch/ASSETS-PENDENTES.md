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
| `assets/video/sobre-escritorio.mp4` | **provisório** | Cena institucional genérica (não é a Dra. Priscila). Substituir pelo vídeo da própria advogada antes de publicar. O texto e a legenda não afirmam que a pessoa em cena é ela. |
| `assets/img/sobre-escritorio.webp` / `.jpg` | pôster do vídeo acima | regerar junto com o vídeo novo |
| `assets/video/hero-priscila.mp4` | **falta** | vídeo do hero: câmera lateral suave, ela assina um documento e levanta o olhar, sem áudio, 8–12 s |
| `assets/img/hero-priscila.jpg` | **falta** | primeiro quadro do vídeo do hero (1600×900 ou maior) |
| `assets/img/direito-bancario.jpg` | opcional | cena da área; sem ela, fica a arte em SVG |
| `assets/img/contratual-consumidor.jpg` | opcional | idem |
| `assets/img/familia-sucessoes.jpg` | opcional | idem |
| `assets/logo/priscila-kohlrausch.svg` | **provisório** | monograma PK desenhado aqui; trocar pelo logotipo oficial quando existir |
| `assets/img/og-image.jpg` | pronto (1200×630) | regerar se o logotipo mudar; fonte em `assets/img/og-image.svg` |

Para ligar uma mídia nova, escreva o caminho no bloco `MIDIA`, no topo de
`js/app.js`. Enquanto o campo estiver vazio, a cena em SVG continua no lugar.

## 4. Antes de subir

- [x] WhatsApp confirmado: +55 45 99862-2011, com mensagem pré-preenchida.
- [ ] Confirmar cidade, UF e regiões atendidas.
- [ ] Confirmar OAB, endereço e horário.
- [ ] Confirmar atendimento on-line e presencial.
- [ ] Aprovar as listas de assuntos de cada área.
- [ ] Aprovar (ou retirar) a frase sobre ser mãe de duas meninas.
- [ ] Substituir o vídeo provisório pelo material da própria advogada.
- [ ] Trocar o domínio provisório em todo o projeto.
- [ ] Revisar a Política de Privacidade e, se entrar analytics, tratar consentimento.
- [ ] Revisão ética final conforme o Provimento 205/2021 do CFOAB e a seccional.
- [ ] Testar WhatsApp, e-mail e Instagram no celular real.
