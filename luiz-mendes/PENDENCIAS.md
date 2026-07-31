# Pendências — site Luiz Mendes

Nada aqui foi inventado. Cada item abaixo está **oculto ou com placeholder**
no site até a informação real chegar.

## Bloqueiam informações no ar

| # | O quê | Onde entra | Como publicar |
|---|---|---|---|
| 1 | **CRO** (número/UF) — obrigatório pelo CFO em publicidade odontológica | Sobre (`data-campo="cro"`) e rodapé (`data-campo="cro-rodape"`) | Escrever o valor no `dd`/`p` e remover a classe `a-confirmar` |
| 2 | **Número da sala** no Tirol Way Office | Localização (`data-campo="sala"`) | Idem |
| 3 | **Dias e horários** de atendimento | Localização (`data-campo="horarios"`) | Idem; depois adicionar `openingHoursSpecification` no schema.org |
| 4 | **Formação / especialização / cursos** | Sobre (`data-campo="formacao"` etc.) | Idem — só com comprovação |

## Fotos que faltam (hoje são placeholders SVG em `media/ph/`)

| Placeholder | Seção | O que fotografar/gerar |
|---|---|---|
| `tratamento.svg` (4:5) | 04 Tratamento | Avaliação com radiografia na tela, ângulo lateral 45°, área limpa à direita |
| `sobre.svg` (4:5) | 06 Sobre | Retrato autoral na entrada do consultório — **usar a foto real do jaleco marinho com zíper dourado** se preferir |
| `dentistas.svg` (16:9) | 07 Para dentistas | Dois profissionais analisando um caso, espaço à esquerda |

Fotos que **devem ser reais** (não gerar por IA): fachada do Tirol Way Office,
interior do consultório, equipamentos anunciados como diferenciais, diplomas.

## Prova social

A seção 08 mostra apenas o espaço reservado. Quando houver avaliações reais do
Perfil da Empresa no Google: no `index.html`, tirar o `hidden` do
`<ul class="avaliacoes">`, esconder o `<p class="prova-reservada">` e duplicar
o `<li>` modelo com nome, texto, nota, data e origem verdadeiros.

## Publicação

1. Netlify → Add new site → Import an existing project → este repositório
2. **Base directory: `luiz-mendes`** (o `netlify.toml` daqui faz o resto)
3. Depois do primeiro deploy, trocar `https://luizmendes.netlify.app/` no
   `index.html` (canonical, og:url, og:image, schema.org) pela URL real —
   ou configurar o domínio próprio e usar esse.

## Decisões de projeto registradas

- Dourado `#B08D57` **nunca** é texto sobre marfim (contraste 2,83:1 — reprova
  WCAG). Sobre marinho `#0B1B30` dá 5,53:1 — por isso a palavra "preservar" em
  dourado só existe na seção escura.
- Vídeos: loops fechados por crossfade (o material original não fechava o
  loop — PSNR ~10 dB entre primeiro e último frame). Duração final 7 s, sem
  áudio, ~0,7–1,1 MB cada.
- `prefers-reduced-motion`: vídeos nunca carregam (fica o poster WebP) e todas
  as animações são desligadas.
- A logo vermelha do jaleco branco (foto das lupas) não entrou: conflita com a
  paleta. Decidir com o Dr. Luiz se será redesenhada.
