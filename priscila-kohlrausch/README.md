# Priscila P. Kohlrausch — Advocacia e Consultoria Jurídica

Site institucional de página única, em português, com rolagem cinematográfica.
HTML, CSS e JavaScript puros: **sem framework, sem build, sem `npm install`**.
Basta subir os arquivos em qualquer hospedagem.

Referência de ritmo editorial: <https://www.lidianefloresadv.com.br/> — usada
apenas como inspiração de cadência, numeração de seções e hierarquia. Nenhum
código, texto, imagem ou composição foi copiado.

---

## Estrutura dos arquivos

```
index.html                     página inteira (todas as seções)
politica-de-privacidade.html   página legal ligada no rodapé
favicon.svg                    ícone da aba do navegador
robots.txt / sitemap.xml       instruções para o Google

css/
  styles.css     ←  todo o visual: cores, tipografia, layout, responsivo
  fonts.css         declarações das fontes locais (não precisa mexer)

js/
  app.js         ←  bloco MIDIA no topo + rolagem, menu, FAQ e animações

assets/
  fonts/            Cormorant Garamond e Manrope em .woff2 (hospedadas aqui)
  vendor/           GSAP, ScrollTrigger e Lenis (locais, sem CDN)
  video/            vídeos das cenas
  img/              pôsteres, fotos e imagem de compartilhamento
  logo/             logotipo em SVG
```

Os dois arquivos marcados com ← são os únicos abertos no dia a dia.

---

## Tarefas do dia a dia

### Trocar ou acrescentar um vídeo/foto de cena

Abra **`js/app.js`**. Logo no começo existe este bloco:

```js
const MIDIA = {
  'hero-video':  { webm: '...', mp4: '...', poster: '...' },   // primeira dobra
  'hero-foto':   '',
  'sobre-video': { webm: '...', mp4: '...', poster: '...' },   // cena da seção Sobre
  'bancario':    { webm: '...', mp4: '...', poster: '...' },   // cena do Direito Bancário
  'contratos':   { webm: '...', mp4: '...', poster: '...' },   // Contratos e Consumidor
  'familia':     { webm: '...', mp4: '...', poster: '...' }    // cena de Família e Sucessões
};
```

Coloque o arquivo dentro de `assets/` e escreva o caminho entre as aspas.
Deixando em branco (`''`), a cena desenhada em SVG continua no ar — o site
nunca fica com buraco.

- **Foto:** `.jpg` ou `.webp`, um caminho só.
- **Vídeo:** `.mp4` (H.264, sem áudio) resolve em todos os navegadores. Dando
  os dois formatos, como no exemplo acima, o navegador escolhe: o `.webm`
  (VP9) pesa cerca de metade e o `.mp4` cobre Safari e iPhone.
- **`poster`:** imagem que aparece antes do vídeo abrir. Em telas de até 768px
  as três cenas de área mostram só o pôster — o celular não baixa vídeo de
  fundo. O hero e o retrato continuam em movimento também no celular.

Para gerar os dois a partir de um vídeo original:

```bash
ffmpeg -i original.mp4 -an -c:v libx264 -crf 25 -preset slow -movflags +faststart cena.mp4
ffmpeg -i original.mp4 -an -c:v libvpx-vp9 -crf 36 -b:v 0 -row-mt 1 cena.webm
ffmpeg -ss 1.2 -i original.mp4 -frames:v 1 cena.webp     # pôster
```

### Preencher os dados que faltam

Procure por `TODO(cliente)` no `index.html` e por `[COLCHETES]` no texto.
Os campos pendentes estão listados em `ASSETS-PENDENTES.md`.

### Definir o domínio

Depois de contratar o domínio, rode uma vez na pasta do site:

```bash
grep -rl dominio-a-definir . | xargs sed -i 's#https://dominio-a-definir.com.br#https://SEUDOMINIO#g'
```

Isso ajusta canonical, Open Graph, JSON-LD, `robots.txt` e `sitemap.xml`.

---

## Rodar no computador

Sempre por HTTP — abrir o `index.html` com dois cliques quebra o vídeo:

```bash
npx serve .        # ou: python3 -m http.server 8000
```

## Publicar

- **Netlify / Vercel:** _base directory_ `priscila-kohlrausch`, sem comando de
  build, pasta publicada `.` (a própria pasta).
- **Hospedagem comum:** envie o conteúdo da pasta por FTP para a raiz do site.

Nada precisa de Node no servidor: é um site estático.

---

## Decisões técnicas

- **Fontes locais.** Cormorant Garamond e Manrope ficam em `assets/fonts`.
  Nada é buscado no Google, o que evita dependência externa e questões de LGPD.
- **Bibliotecas locais.** GSAP + ScrollTrigger (coreografia) e Lenis (rolagem
  suave) ficam em `assets/vendor`. Sem CDN: o site funciona mesmo offline.
- **Cenas em SVG.** Cada área tem uma composição própria de ícones dourados,
  desenhada à mão em SVG. Quando existe filmagem, ela entra por cima e o SVG
  sai por dissolvência; hoje isso acontece em Bancário e Família e Sucessões,
  enquanto Contratos e Consumidor segue na arte vetorial.
- **Hero e Sobre usam a mesma filmagem.** No hero ela é espelhada
  (`transform: scaleX(-1)`) e fica à direita, com o texto à esquerda; na seção
  Sobre entra sem espelho, à esquerda, com o texto à direita — e começando em
  outro ponto do vídeo (`data-inicio` no `index.html`), para as duas cenas não
  ficarem sincronizadas. Como é o mesmo arquivo, a segunda cena não custa
  download nenhum: vem do cache. Ao trocar a filmagem, confira se o
  espelhamento do hero ainda ajuda.
- **Movimento reduzido.** Quem liga "reduzir movimento" no sistema recebe o
  site inteiro sem parallax, sem pin e sem scrub — com todo o conteúdo visível.
- **Acessibilidade.** Skip link, navegação por teclado, foco visível, menu com
  `aria-expanded`, FAQ com `aria-controls`, contraste conferido.

## Publicidade e ética profissional

O conteúdo segue o tom informativo exigido pelo Provimento 205/2021 do CFOAB:
sem promessa de resultado, sem "consulta grátis", sem urgência artificial, sem
números de processos, clientes ou êxito, sem depoimentos e sem símbolos oficiais
da OAB. O único número exibido — `03 áreas de atuação` — é verdadeiro.
Antes de publicar, faça a revisão ética final com a advogada.
