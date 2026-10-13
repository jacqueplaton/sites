# Como colocar as fotos reais no site

O site já está pronto para receber as fotografias do Espaço Gariba.
Enquanto um arquivo não existir, o lugar dele aparece como uma **moldura
verde escura com o nome do arquivo que falta** — de propósito.

> **Por que não tem foto nenhuma ainda?**
> Porque nenhuma foto foi inventada. Não há imagem de banco de imagens nem
> imagem gerada por computador fingindo ser o lugar. As fotos do Instagram
> e da página de reservas são do Espaço Gariba e só podem ser publicadas
> por quem é dono delas — por isso a entrega vem com os lugares reservados,
> prontos para os arquivos originais.

---

## O jeito rápido

1. Pegue as fotos originais (as do Instagram **@garibacabanas**, as da
   página do Cloudbeds, ou as fotos em alta que o fotógrafo entregou).
2. Renomeie cada uma com **exatamente** um dos nomes da lista abaixo.
3. Jogue nas pastas `media/cabanas/` e `media/galeria/`.
4. Recarregue a página. Pronto — a moldura some e a foto aparece.

Não precisa mexer em código nenhum. Nome certo, pasta certa, acabou.

---

## Os nomes dos arquivos

### `media/cabanas/` — as fotos grandes de cada cabana

| Arquivo | O que deve mostrar |
|---|---|
| `mata-01.jpg` | **Foto principal da Cabana da Mata** (a maior do bloco, horizontal) |
| `mata-02.jpg` | Um detalhe interno — cama no mezanino, claraboia, lareira |
| `mata-03.jpg` | A banheira de vidro ou a área externa |
| `mata-04.jpg` | Opcional (fica guardada; aparece se trocar a ordem no config) |
| `pordosol-01.jpg` | **Foto principal da Cabana Pôr do Sol** (horizontal — o deck com a vista) |
| `pordosol-02.jpg` | Um detalhe interno |
| `pordosol-03.jpg` | A rede no deck, o fire pit ou a banheira |
| `pordosol-04.jpg` | Opcional |

### `media/galeria/` — a galeria com lightbox

```
g01-cabana-mata-externa.jpg    fachada da Cabana da Mata entre as árvores
g02-banheira-vidro.jpg         banheira de hidromassagem cercada de vidro
g03-deck-por-do-sol.jpg        deck com vista para o vale
g04-claraboia-cama.jpg         cama no mezanino sob a claraboia
g05-lareira-acesa.jpg          lareira a lenha acesa
g06-fire-pit-noite.jpg         fire pit ao cair da noite
g07-cafe-da-manha.jpg          a cesta do café da manhã na porta
g08-lago.jpg                   o lago e a área verde
g09-interior-sala.jpg          a sala da cabana
g10-vista-vale.jpg             a vista do vale
g11-rede-deck.jpg              a rede armada no deck
g12-mata-nativa.jpg            a mata nativa em volta
```

Pode entregar menos de 12: as que faltarem continuam como moldura, e o
lightbox só navega entre as que existem de verdade. Para **tirar** um quadro
da galeria, apague a linha correspondente em `js/config.js`, na lista `GALERIA`.

---

## Tamanho e peso das imagens

Para o site continuar rápido no celular:

| Uso | Largura ideal | Peso alvo |
|---|---|---|
| Foto principal das cabanas (`*-01.jpg`) | 1800 px | até 300 KB |
| Demais fotos das cabanas | 1200 px | até 200 KB |
| Galeria | 1200 px | até 200 KB |

Se tiver o ImageMagick instalado, isto resolve tudo de uma vez:

```bash
# redimensiona e comprime todas as fotos de uma pasta
mogrify -resize 1200x1200\> -quality 82 -strip -interlace Plane media/galeria/*.jpg
mogrify -resize 1800x1800\> -quality 82 -strip -interlace Plane media/cabanas/*-01.jpg
mogrify -resize 1200x1200\> -quality 82 -strip -interlace Plane media/cabanas/*-0[234].jpg
```

Sem ImageMagick, o [Squoosh](https://squoosh.app) faz o mesmo pelo navegador.

**Formato:** `.jpg` para fotografia. Se preferir `.webp` (arquivos menores),
troque também a extensão nos nomes dentro de `js/config.js`.

---

## O hero (a primeira tela)

Hoje o hero é uma **paisagem desenhada em vetor**, em camadas, com parallax —
não é uma fotografia artificial do lugar. Ela segura o site com elegância até
chegar a mídia real.

Para trocar por uma **foto** do Espaço Gariba:

1. Salve a foto como `media/hero/hero.jpg` (2000 px de largura, até 400 KB).
2. Em `css/style.css`, procure por `.hero {` e acrescente:

```css
.hero {
  background-image: linear-gradient(
      to top, rgba(13,20,12,.92) 0%, rgba(13,20,12,.45) 40%, transparent 70%),
    url('../media/hero/hero.jpg');
  background-size: cover;
  background-position: center;
}
```

3. Em `index.html`, apague o bloco `<div class="hero-cena">…</div>`
   (está marcado com um comentário).

Para trocar por um **vídeo**, use o mesmo lugar com:

```html
<video class="hero-video" autoplay muted loop playsinline
       poster="media/hero/hero.jpg">
  <source src="media/hero/hero.mp4" type="video/mp4">
</video>
```

e em `css/style.css`:

```css
.hero-video {
  position: absolute; inset: 0; z-index: -2;
  width: 100%; height: 100%; object-fit: cover;
}
```

Vídeo de hero: no máximo 10 segundos, sem áudio, até 3 MB.

---

## A imagem de compartilhamento

`media/og-gariba.jpg` é a imagem que aparece quando o link do site é colado
no WhatsApp, no Instagram ou no Facebook. Hoje é a mesma paisagem desenhada,
com o nome do lugar.

Quando tiver uma boa foto horizontal do Gariba, troque esse arquivo por ela —
**exatamente 1200 × 630 px**, até 300 KB, mesmo nome. Nada mais precisa mudar.
