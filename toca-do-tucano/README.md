# Glamping Toca do Tucano — site oficial

Site de página única, responsivo, em HTML, CSS e JavaScript puro. Sem framework,
sem `npm install`. O vídeo abre o site; a reserva termina no WhatsApp do Daniel.

---

## Estrutura

```
index.html              a página inteira (conteúdo, SEO, dados estruturados)
404.html                página de "não encontrado"
css/style.css           todo o visual
js/main.js              comportamento + CONFIG (WhatsApp e IDs de medição)
fonts/                  Newsreader e Schibsted Grotesk, recortadas para português
media/video/            vídeo do topo: vertical (celular) e horizontal (desktop),
                        cada um em AV1 e H.264, sem áudio
media/img/              as 5 fotos reais em AVIF, WebP e JPG, em vários tamanhos
media/og-toca-do-tucano.jpg   imagem de compartilhamento (WhatsApp, Facebook)
media/icons/            ícones do navegador e do celular
media/curvas-de-nivel.svg     desenho do mapa antes de carregar o Google Maps
robots.txt, sitemap.xml, site.webmanifest
build.sh                monta a pasta dist/ e ajusta as URLs de SEO
netlify.toml, vercel.json     configuração de publicação
```

---

## Tarefas do dia a dia

### Mudar o WhatsApp ou a mensagem automática
`js/main.js`, no topo, em `CONFIG`. Os links `wa.me` do HTML também levam o número
(procure por `5512992141763` e troque em todos).

### Atualizar a nota do Google
Procure por `4,9` e `35 avaliações` no `index.html` (seção `#avaliacoes`).

### Ligar Google Analytics 4, Tag Manager ou Meta Pixel
`js/main.js` → `CONFIG.analytics`. Preencha só o que existir; nada carrega com o
campo vazio. Se usar o Tag Manager, deixe `ga4` vazio e configure o GA4 dentro dele.

Eventos já disparados (vão para o `dataLayer`, para o GA4 e para o Pixel):

| Evento | Quando |
|---|---|
| `video_hero_view` | o vídeo do topo começa a tocar (uma vez) |
| `view_accommodation` | a seção dos chalés aparece na tela (uma vez) — no Pixel vira `ViewContent` |
| `check_availability` | a pessoa começa a preencher as datas (`step: form_start`) e envia (`step: submit`) |
| `direct_booking_lead` | o formulário de reserva direta é enviado — no Pixel vira `Lead` |
| `click_whatsapp` | qualquer clique para o WhatsApp — no Pixel vira `Contact` |
| `instagram_click` | clique no Instagram |
| `airbnb_click` | clique em um dos anúncios do Airbnb (`listing` diz qual) |
| `google_reviews_click`, `directions_click`, `map_load` | avaliações, rota e mapa |

**Google Search Console:** depois de publicar, verifique o domínio pelo DNS (ou pelo
GA4/GTM, se já estiverem instalados) e envie `sitemap.xml`.

**LGPD:** ao ligar GA4 ou Pixel, adicione um aviso/consentimento de cookies.

---

## Publicar

O build troca o endereço provisório `https://toca-do-tucano.netlify.app` pelo
endereço real em canonical, Open Graph, JSON-LD, `robots.txt` e `sitemap.xml`.

### Netlify
1. **Add new site → Import an existing project → GitHub** → repositório `jacqueplaton/sites`.
2. **Base directory:** `toca-do-tucano`. Build e pasta de publicação vêm do `netlify.toml`.
3. Deploy. (Sem Git: rode `bash build.sh` e arraste a pasta `dist/` em app.netlify.com/drop —
   nesse caso as URLs de SEO ficam com o endereço provisório até você definir `SITE_URL`.)

### Vercel
1. **Add New → Project** → repositório `jacqueplaton/sites`.
2. **Root Directory:** `toca-do-tucano`. Framework: *Other*. O resto vem do `vercel.json`.

### Domínio próprio
Defina a variável de ambiente `SITE_URL` (ex.: `https://www.seudominio.com.br`) no painel
da Netlify/Vercel e publique de novo. Depois, cadastre o domínio no Search Console e
**coloque o endereço do site no Perfil da Empresa no Google** — é o que mais ajuda o site
a aparecer nas buscas locais.

### Rodar no computador
```bash
cd toca-do-tucano
python3 -m http.server 8000     # ou: npx serve .
```

---

## O que foi verificado (pesquisa pública, out/2026)

Acesso direto a Airbnb, Instagram, Google e Linktree estava bloqueado no ambiente de
produção; os dados abaixo vieram dos trechos indexados dessas páginas pelos buscadores,
cruzados entre si. **Vale o Daniel conferir os itens marcados.**

| Informação | Fonte | Uso no site |
|---|---|---|
| Nome "Glamping Toca do Tucano Paraibuna", bio: "Glamping romântico e relaxante no alto da montanha. Dentro da Reserva Altos das Laranjeiras Paraibuna. Segurança e privacidade." | Instagram oficial | citado na seção Instagram |
| Dois anúncios: "Toca do Tucano Mountain Glamping" e "GlampingToca do Tucano Montanha" | Airbnb | links na seção Avaliações |
| Mais de 30 mil m² em meio à Mata Atlântica, apenas 2 chalés, privacidade e segurança | Airbnb (descrição) | intro, chalés, FAQ |
| Ofurô no deck, vista para o vale, som dos pássaros, fogueira noturna para ver estrelas, telescópio, bikes de montanha, rede de contemplação, churrasqueira ao ar livre de frente para o vale, lareira ecológica | Airbnb (descrição) + fotos | experiência, chalés, FAQ, JSON-LD |
| Reserva Altos das Laranjeiras: 50 anos de pioneirismo e preservação da Mata Atlântica, mais de 700 mil m² de matas recuperadas | Linktree da Reserva | seção A Reserva (com crédito) |
| Paraibuna: alto Vale do Paraíba, pé da Serra do Mar, Rodovia dos Tamoios, município no domínio da Mata Atlântica | UNIVAP (Observatório RMVale), Alesp | localização, FAQ |

## Pendências — o que NÃO entrou por falta de confirmação

| Item | Situação |
|---|---|
| **Nota 4,9 / 35 avaliações no Google** | informada por vocês; não consegui abrir o Google para reconferir. **Conferir antes de divulgar.** Não foi para o JSON-LD (avaliações próprias não geram estrelas no Google e podem ser vistas como spam). |
| Nomes individuais dos 2 chalés | não encontrados; o site fala em "dois chalés em A". O formulário pergunta "um chalé / os dois chalés". |
| 42 m², cama queen, Smart TV, Wi-Fi, ar quente/frio, cozinha completa, piscina compartilhada | aparecem em um ou dois resumos de busca, sem confirmação; não usados |
| Ofurô aquecido / hidromassagem | não confirmado; o site diz só "ofurô no deck" |
| Capacidade, preços, horários de check-in/out, pets, café da manhã, estacionamento | não encontrados; o site e o FAQ remetem ao WhatsApp |
| Distâncias ("1 h de SP", "20 min do Mogi Shopping", "40 min de São José dos Campos") | aparecem em um resumo, mas são inconsistentes com a geografia; não usadas |
| Nota e nº de avaliações no Airbnb (4,98 com 100+; 5,0 com 56) | variam entre fontes; não usados |
| Coordenadas exatas | não confirmadas; mapa e JSON-LD usam nome + endereço. Pegue latitude/longitude no Perfil do Google e adicione `geo` ao JSON-LD. |
| Bairro | vocês informaram "Bairro das Laranjeiras"; um anúncio de eventos da Fazenda Laranjeiras (mesma estrada, km 2) cita "Bairro Morro Azul". Mantido o informado por vocês — confirmar. |
| Vídeo | o arquivo se chama "Create_real_estate_walkthrough…", indicando vídeo gerado a partir das fotos. Em alguns quadros o ofurô aparece mais próximo da cama do que nas fotos. Vale o Daniel assistir e aprovar. |
| Domínio | ainda não existe; ver "Domínio próprio". |

## Créditos técnicos
- Tipografia: [Newsreader](https://fonts.google.com/specimen/Newsreader) e
  [Schibsted Grotesk](https://fonts.google.com/specimen/Schibsted+Grotesk), SIL Open Font
  License 1.1 (licenças em `fonts/`), hospedadas no próprio site.
- Fotos e vídeo: material enviado pela Toca do Tucano, reprocessado para web.
