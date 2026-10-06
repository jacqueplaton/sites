# GARIBA — prévia editorial

Prévia do site da Gariba (Cabanas em Encantado, RS), construída a partir do
documento *Gariba — Direção criativa, experiência e reserva direta* (06/10/2026).

**Situação:** prévia de apresentação. A página tem `noindex, nofollow` e um aviso
discreto no rodapé. Não é o site oficial da marca e não altera nenhuma conta externa.

**Tecnologia:** HTML, CSS e JavaScript puro, sem build e sem dependências externas.
Fontes, vídeo e fotos ficam nesta pasta.

---

## Estrutura

```
gariba/
  index.html               página inteira (10 seções da direção)
  favicon.svg
  css/gariba.css           tokens, grid, componentes, seções
  js/gariba.js             vídeo, menu, cabeçalho, WhatsApp, barra de reserva, medição
  fonts/                   Newsreader (títulos) + Source Sans 3 (texto), OFL 1.1
  media/
    video/hero-1280.{webm,mp4}   desktop, 16:9
    video/hero-720.{webm,mp4}    celular, 1:1 (recorte próprio)
    poster/hero-{1280,720}.webp  primeiro quadro de cada versão
    photos/*.webp                fotos em 2–3 larguras (srcset)
    og-gariba.jpg                imagem de compartilhamento (1200×630)
```

Rodar localmente (precisa de HTTP, não abra o arquivo direto):

```bash
python3 -m http.server 8000     # na raiz do repositório
# abrir http://localhost:8000/gariba/
```

---

## Skills aplicadas

| Skill | Uso | Observação |
|---|---|---|
| `frontend-design` | Direção estética, escolha tipográfica, composição assimétrica com intenção, recusa a padrões genéricos | A seção “Scroll-Driven” da skill **não** foi aplicada: tipografia gigante, marquee, contadores e pinagem contrariam a direção. |
| `video-to-website` | Só a parte técnica: análise com `ffprobe`, cortes e codificação com `ffmpeg` | O checklist da skill (loader com porcentagem, Lenis, canvas por scroll, circle-wipe, contadores) é proibido pela direção (Partes 3, 5, 10 e 11). A direção prevaleceu. |

---

## Inventário de mídias

| Arquivo recebido | Unidade | Enquadramento | Uso no site | Situação |
|---|---|---|---|---|
| `1.webp` (idêntico a `5.webp`) | Cabana Pôr do Sol: deck elevado e rede suspensa | vertical 2:3 | **Origem**: recorte 800×1000 só do telhado e da empena, **sem pessoa** | Para não sugerir que a pessoa da foto é da família |
| `2.webp` | Cabana da Mata (por eliminação: fachada de vidro no nível do chão, entre troncos altos, como a foto oficial V1) | vertical 2:3 | **Da Mata**: foto principal, cortado o chão (1336×1700) | Identificação a confirmar com a hospedagem (ver pendências) |
| `3.webp` | Cabana Pôr do Sol: deck, rede, escada | horizontal 3:2 | **Pôr do Sol**: 16:9 no desktop; recorte próprio 5:6 no celular preservando deck e escada. Também usada na imagem OG | — |
| `4.webp` | Mezanino com claraboia. **Unidade não identificável** | vertical 2:3 | **Gestos da estadia**, sem nomear cabana | Legenda neutra: “O mezanino, sob a claraboia.” |
| Vídeo Flow (10 s, 1280×720, com áudio) | 4 planos: A e D Pôr do Sol; B Pôr do Sol (alto); C Da Mata (frontal) | 16:9 | **Hero**, reeditado (abaixo) | Áudio removido |

### Edição do vídeo do hero

O filme é gerado por IA a partir das fotos. Planos revisados quadro a quadro contra as fotos reais:

| Plano | Tempo | Fiel às fotos? | Decisão |
|---|---|---|---|
| A: Pôr do Sol, contra-plongée | 0–2,4 s | Sim (deck, rede, banco de madeira, lenha, escada) | **Usado** |
| B: Pôr do Sol, plano alto | 2,6–4,9 s | **Não**: poltronas brancas estofadas, mesa e cozinha com banquetas que não aparecem nas fotos (o deck real tem cadeiras e banco de madeira) | Cortado |
| C: Da Mata, frontal | 4,9–7,4 s | **Não**: mostra uma cama no térreo, ao fundo; a foto real mostra corredor e escada | Cortado |
| D: Pôr do Sol, plano aberto | 7,4–10 s | Sim | **Usado** |

Fundamento: Parte 5 da direção (“A animação deve preservar fachada, proporções,
vegetação e objetos”; “Se não houver material real suficiente das duas unidades,
usar uma só, com a identificação correspondente”). O hero fica, então, só com a
Pôr do Sol, e a legenda informa: *“Cabana Pôr do Sol · filme animado a partir de fotografias”*.

A + D somavam ~5 s. Para um loop mais calmo, os dois planos foram desacelerados para
~60% com interpolação de movimento (sem inventar cenário; conferido quadro a quadro).
O corte entre A e D é seco, sem fusão. Resultado: loop de 8,25 s.

| Arquivo | Tamanho | Alvo da direção |
|---|---|---|
| `hero-1280.webm` / `.mp4` | 2,0 MB / 2,5 MB | desktop 4–6 MB |
| `hero-720.webm` / `.mp4` | 1,2 MB / 1,3 MB | celular 2–4 MB |
| `poster/hero-1280.webp` / `hero-720.webp` | 140 KB / 80 KB | até ~200 KB |

O navegador baixa **só uma** variante: WebM (VP9) onde há suporte garantido, MP4 (H.264) nos demais.

<details>
<summary>Comandos para refazer (ou restaurar planos B/C se a família aprovar)</summary>

```bash
V=filme-original.mp4
# master A+D, desacelerado (A = quadros 0–56; D = quadro 178 em diante)
ffmpeg -i "$V" -an -filter_complex "\
[0:v]trim=start_frame=0:end_frame=57,setpts=PTS-STARTPTS[a];\
[0:v]trim=start_frame=178,setpts=PTS-STARTPTS[d];\
[a][d]concat=n=2:v=1:a=0,minterpolate=fps=40:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1:scd=fdiff:scd_threshold=8,\
setpts=PTS*40/24,fps=24[v]" -map "[v]" -c:v libx264 -crf 16 master.mp4

# desktop
ffmpeg -i master.mp4 -an -c:v libx264 -crf 24 -preset slow -pix_fmt yuv420p -movflags +faststart hero-1280.mp4
ffmpeg -i master.mp4 -an -c:v libvpx-vp9 -b:v 0 -crf 36 -row-mt 1 hero-1280.webm
# celular (recorte quadrado na cabana)
ffmpeg -i master.mp4 -an -vf "crop=720:720:295:0" -c:v libx264 -crf 25 -preset slow -pix_fmt yuv420p -movflags +faststart hero-720.mp4
ffmpeg -i master.mp4 -an -vf "crop=720:720:295:0" -c:v libvpx-vp9 -b:v 0 -crf 37 -row-mt 1 hero-720.webm
# posters
ffmpeg -i hero-1280.mp4 -frames:v 1 -c:v libwebp -quality 78 hero-1280.webp
ffmpeg -i hero-720.mp4  -frames:v 1 -c:v libwebp -quality 78 hero-720.webp
```
</details>

---

## O que foi implementado

1. **Hero**: vídeo sem som, em loop, inline. Poster imediato via `<picture>`.
   Botão “Pausar vídeo” / “Reproduzir vídeo”. Pausa fora da tela e respeita a pausa
   manual. Com movimento reduzido ou economia de dados, fica no poster até a pessoa
   pedir. Se o vídeo falhar, o poster permanece e o botão some. Texto e CTA não
   esperam o filme. No celular, vídeo em cima e texto embaixo, em fundo sólido, para
   não espremer a fachada num recorte vertical.
2. **Origem**: título e texto da direção (~50 palavras), com foto de detalhe sem pessoas.
3. **Cabana da Mata**: fundo mata, composição vertical, foto 7 colunas, texto 4 colunas.
4. **Cabana Pôr do Sol**: fundo papel com filete argila, foto horizontal larga, nome abaixo da imagem.
   No celular, recorte próprio (não o corte automático do desktop).
5. **Comparação**: linhas abertas, mesmas categorias. No celular, cada critério mostra as duas respostas em sequência, sem rolagem lateral.
6. **Gestos da estadia**: versão encurtada (uma foto e três cenas em texto), sem inventar serviço.
7. **Prova**: um trecho, com autoria, data, plataforma e link. Sem nota, sem avatar.
8. **Chegar**: endereço selecionável, contexto regional, rota oficial e perguntas só com respostas confirmadas.
9. **Reserva**: “Agora, escolha os dias.”, botão dominante e explicação do destino.
10. **Rodapé**: “Faz bem te ver aqui.” (uma vez), contatos, Instagram, Tripadvisor e Airbnb.

Também: cabeçalho transparente no hero e sólido depois; menu do celular (Esc fecha,
foco volta ao botão, Tab circula); WhatsApp fixo (52 px, cuja mensagem cita a cabana em
foco); barra “Ver disponibilidade” no celular depois do hero, escondida no bloco final;
entradas de 420 ms / 12 px, uma vez por elemento; JSON-LD `LodgingBusiness` com as duas
`Accommodation`.

### Decisões que ajustam a direção (justificadas)

| Ajuste | Motivo |
|---|---|
| Hero só com a Pôr do Sol | Precisão: planos B e C inventam móveis e cômodos (ver tabela acima) |
| Hero no celular: vídeo 1:1 em cima, texto embaixo | Um recorte 9:16 do 16:9 cortaria a fachada; a direção pede preservar a estrutura |
| Sem foto no bloco de reserva | Não há outra foto real não usada; repetir ou usar quadro de IA como “foto” seria pior |
| Sem imagem do entorno em “Chegar” | Nenhuma foto do entorno recebida |
| Legenda sobre o filme ser animado a partir de fotos | Coerente com “não alterar a expectativa sobre o imóvel” |
| Navegação desktop a partir de 768 px | O conteúdo do cabeçalho cabe; o descritor “Cabanas em Encantado, RS” aparece a partir de 1100 px |

---

## Fatos usados (todos da pesquisa de 06/10/2026)

- Endereço: Linha Garibaldi, 954, Interior, Encantado–RS, 95960-000 [S7, S9]
- WhatsApp +55 51 98064-9606 [S2]; e-mail cabanasgariba@hotmail.com [S1]
- Entrada 15h, saída 12h [S8, S12; o motor oficial aparece com os mesmos horários em resultado de busca]
- Cada cabana: até 4 hóspedes; 1 quarto, 2 camas, 1 banheiro [S4, S5]
- Em comum: hidromassagem com cromoterapia, lareira, fire pit, cozinha equipada, ar-condicionado, enxoval [S1]
- Destaques da ficha: claraboia acima da cama (Da Mata), rede suspensa (Pôr do Sol) [S1]. Rotulados como “destaque”, nunca “exclusivo”.
- Origem: Jeferson e Fernanda, mudança para a natureza, propriedade onde nasceu o pai de Jeferson [S1, S10]; participação do casal na construção e no atendimento [S11]. A filha não é citada (direção: não transformá-la em personagem).
- Depoimento: “Os anfitriões dão atenção a cada detalhe” — Amanda S, Tripadvisor, junho de 2024 [S6]
- Região: Cristo Protetor e Lagoa da Garibaldi, sem distâncias [S4]

## Omitido de propósito (pendências para validar com a hospedagem)

| Item | Por quê | Onde entra depois |
|---|---|---|
| Café da manhã | Formato e inclusão não confirmados | FAQ “Café da manhã, pets…” e seção Gestos |
| Pets | Porte, taxa e restrições não confirmados | Mesma FAQ |
| Crianças / “só casais” | Política conflitante entre canais | FAQ de ocupação |
| Terceira cabana | Mencionada em 2023, sem confirmação atual | Nova seção de cabana |
| Valores, mínimo de noites, cancelamento, taxas | Variam por data; ficam no motor | Nunca no site |
| Distâncias/minutos até atrações | Fontes divergem | Seção Chegar |
| Mapa embutido / coordenadas | Pin do Linktree e do Cloudbeds divergem | Seção Chegar e JSON-LD (`geo`) |
| Condições da estrada | Só fonte complementar (Holmy) | Seção Chegar |
| Facebook | Titularidade não confirmada | Rodapé |
| Nota/quantidade de avaliações | Muda com o tempo; precisa de reconferência datada | Seção Prova |
| **Identificação da foto `2.webp` como Da Mata** | Feita por eliminação, não por fonte | Confirmar antes de publicar |
| **Unidade da foto `4.webp`** | Não identificável | Se confirmada, pode ir para o capítulo da cabana |
| **Autorização de imagem** das pessoas nas fotos | Não informada | Todas as fotos com pessoas |
| Aprovação dos planos B e C do vídeo | Contêm elementos inventados | Hero |
| Logotipo oficial | Não recebido; “GARIBA” é assinatura tipográfica provisória | Cabeçalho, rodapé, favicon |
| Retrato da família | Não recebido | Origem |
| Fotos de mesa, café, fogo, vista do pôr do sol, interiores identificados | Não recebidas | Gestos e capítulos das cabanas |

---

## Links: destinos

Todos os destinos são exatamente os indicados na direção. **Não foi possível abrir
os sites externos neste ambiente** (o proxy de rede bloqueia Cloudbeds, Holmy, Airbnb e
similares). Os links foram conferidos por texto, não por navegação.

| Destino | Onde | Abre em |
|---|---|---|
| `https://hotels.cloudbeds.com/reservas/nfiaO8` | 8 botões “Ver disponibilidade” / “Consultar datas” | mesma aba (direção) |
| `https://wa.me/5551980649606?text=…` | WhatsApp fixo, FAQ, Chegar, Reserva, rodapé | nova aba |
| `https://goo.gl/maps/JWj4PonZgAD16P8q9` | “Como chegar” | nova aba |
| Tripadvisor, Instagram, 2× Airbnb | Prova e rodapé | nova aba |

Sem deep link por cabana no Cloudbeds: os IDs 532519/532520 não comprovam pré-seleção.

## Medição

`js/gariba.js` publica eventos em `window.dataLayer` (prontos para um GTM, que **não**
está instalado):

- `gariba_click` com `action` (`availability`, `whatsapp`, `route`, `reviews`, `instagram`) e `origin` (posição do botão)
- `gariba_view` com `section` (`cabana-da-mata`, `cabana-por-do-sol`), uma vez

Clique em disponibilidade é intenção, não reserva concluída.

---

## Verificação feita

Chromium (Playwright) em 360×640, 390×844, 768×1024 e 1440×900:

- sem rolagem horizontal em nenhuma largura; sem erros no console
- variante de vídeo certa por largura; pausa manual respeitada; pausa fora da tela e retomada
- movimento reduzido: poster, nenhum vídeo baixado, reprodução só por pedido; entradas desligadas
- vídeo bloqueado: poster e CTA continuam; botão de pausa some
- sem JavaScript: conteúdo todo visível, botão de menu sem ação escondido
- menu do celular: foco no primeiro link, Esc fecha e devolve o foco, link navega e fecha
- barra do celular: aparece depois do hero, some no bloco final, WhatsApp acima dela sem sobrepor
- foco visível em fundo claro, escuro e sobre o vídeo; ordem de tabulação lógica
- âncoras internas todas existentes; `target="_blank"` sempre com `rel="noopener"`
- HTML válido (html-validate)
- contraste: tinta/papel 12,8:1; papel/mata 10,9:1; argila/papel 4,57:1 (só rótulos); texto suave 5,4–6,2:1

**Não testado:** Safari/iOS e Firefox em aparelho real, leitor de tela real, zoom de
texto apenas (só zoom de página equivalente), fluxo completo do Cloudbeds no celular.

## Riscos remanescentes

- O vídeo é gerado por IA; mesmo os planos usados devem ser aprovados pela família.
- A atribuição de `2.webp` à Da Mata é inferência.
- O texto de origem se apoia em reportagens de 2023 para o passado; o presente (casal recebendo) se apoia nos anúncios atuais.
- O depoimento não pôde ser reaberto deste ambiente; a fonte é a leitura da pesquisa (06/10/2026).

## Antes de lançar como site oficial

1. Resolver as pendências acima com a hospedagem.
2. Trocar `noindex, nofollow` por indexação, adicionar `<link rel="canonical">` com o domínio final e `url`/`image` absolutos no JSON-LD.
3. Publicar `sitemap.xml` e `robots.txt` do domínio final; cadastrar no Search Console.
4. Ajustar `og:image` para o domínio final (o `netlify-build.sh` já troca o domínio automaticamente).
5. Remover a linha “Prévia de apresentação…” do rodapé.
6. Testar o caminho completo até o motor em iPhone e Android.
7. Prever as páginas próprias `/cabana-da-mata/` e `/cabana-por-do-sol/` (galeria, ficha completa) e só então ligar os links “Detalhes”.
