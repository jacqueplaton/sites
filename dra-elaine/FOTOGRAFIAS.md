# Fotografias do site

O site referencia **9 arquivos**. Eles ainda não estão neste repositório e
precisam ser adicionados exatamente com estes nomes e nestes caminhos.

Enquanto os arquivos não existirem, cada moldura exibe o slot identificado
(nome da foto e proporção) e o layout permanece correto: a proporção final
já está reservada, então nada se desloca quando a foto entrar.

A verificação é feita no build. Salve o arquivo com o nome esperado e rode
`npm run build`: a foto substitui o slot automaticamente, sem mexer em
código.

Este arquivo fica fora de `public/` de propósito: assim ele não vai junto
para o site publicado.

## Retratos — proporção vertical 4:5 (ex.: 1200 × 1500 px)

| Arquivo | Onde aparece |
|---|---|
| `dra-elaine-hero.png` | Abertura do site e imagem de compartilhamento (Open Graph) |
| `dra-elaine-sobre.png` | Seção "Sobre a Dra. Elaine" |
| `dra-elaine-profissional.png` | Seção "Uma abordagem que começa pela escuta" |

`dra-elaine-hero.png` é o retrato mais fiel ao rosto real e ocupa a abertura.

## Procedimentos — proporção horizontal 4:3 (ex.: 1600 × 1200 px)

Todos em `public/images/tratamentos/`:

| Arquivo |
|---|
| `preenchimento-labial.png` |
| `enzimas-emagrecedoras.png` |
| `skinbooster.png` |
| `microagulhamento.png` |
| `botox.png` |
| `criofrequencia.png` |

## Regras

- Não inserir texto dentro das imagens.
- Não aplicar filtros frios, rosados ou exagerados.
- Não alterar o rosto da Dra. Elaine.
- Evitar cortes no queixo, olhos, mãos ou instrumentos.
- Os textos alternativos (`alt`) já estão definidos em
  `src/data/treatments.ts` e nos componentes dos retratos. Se uma foto for
  trocada por outra cena, ajuste o `alt` correspondente.

---

## Como as fotos atuais foram geradas

Os originais estavam em armazenamento externo e o ambiente de
desenvolvimento não alcança aquele host. O pacote publicado foi montado
baixando os originais, convertendo para WebP e buildando:

```bash
# retratos  -> 1122 px de largura
# procedimentos -> 1200 px de largura
convert original.png -strip -resize 1122x -quality 82 \
  -define webp:method=6 public/images/dra-elaine-hero.webp
```

Resultado: as nove imagens somam **512 KB** (os PNGs originais somavam
cerca de 17 MB). O site referencia `.webp`.

## Conferir o que é cada foto

Os originais foram medidos: **3 retratos 1122×1402** e **6 procedimentos
1448×1086**, o que bate com o que o site pede. A orientação está correta,
mas qual retrato vai em qual seção — e qual procedimento é qual — ainda
precisa de conferência visual.

Para trocar, renomeie os arquivos em `public/images/`. Nenhum componente
muda.
