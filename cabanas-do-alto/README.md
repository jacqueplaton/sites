# Cabanas do Alto — site

Site de reserva direta das Cabanas do Alto (Cunha, SP): home com vídeo, as seis
cabanas comparadas, uma página para cada cabana e pré-consulta que abre o
WhatsApp com a mensagem pronta.

**Tecnologia:** HTML, CSS e JavaScript puro, sem framework e sem dependências.
Um gerador em Node (`fonte/gerar.mjs`) monta as páginas a partir de um único
arquivo de dados. As páginas geradas já estão no Git, então a pasta `site/`
funciona em qualquer hospedagem estática.

Toda informação publicada vem de [`PESQUISA.md`](PESQUISA.md), que lista as
fontes, o grau de confiança e o que ainda falta conferir.

---

## Estrutura

```
cabanas-do-alto/
  PESQUISA.md            dossiê: fontes, matriz das 6 cabanas, pendências
  netlify.toml           publicação na Netlify (base directory = cabanas-do-alto)
  fonte/
    dados.mjs     ←      TUDO o que o site afirma: WhatsApp, endereço, cabanas, FAQ
    componentes.mjs      cabeçalho, rodapé, formulário, lista e tabela das cabanas
    paginas.mjs          home, /cabanas/, /cabanas/<nome>/, 404 e JSON-LD
    gerar.mjs            gera as páginas em site/
  site/                  ← o que vai para o ar
    index.html
    cabanas/index.html               comparar as seis
    cabanas/bigua/ … cabanas/taua/   uma página por cabana
    404.html  robots.txt  sitemap.xml  favicon.svg
    assets/css/site.css
    assets/js/site.js
    assets/fonts/   Instrument Serif + Jost (OFL), hospedadas no site
    assets/img/     fotos em AVIF, WebP e JPEG, em 3 larguras
    assets/video/   vídeo do topo (MP4 + WebM, desktop e celular) e posters
```

## Editar

1. Abra `fonte/dados.mjs` e altere o que precisar (telefone, textos das cabanas,
   FAQ, experiências).
2. Gere as páginas:

   ```bash
   node cabanas-do-alto/fonte/gerar.mjs
   ```

3. Confira localmente e publique:

   ```bash
   cd cabanas-do-alto/site && python3 -m http.server 8000
   # http://localhost:8000
   ```

O WhatsApp fica em um só lugar: `site.whatsapp` em `dados.mjs`. O formulário lê
o número do próprio HTML gerado.

## Publicar

### Netlify (recomendado)

1. **Add new site → Import an existing project →** este repositório.
2. **Base directory:** `cabanas-do-alto`. O resto vem do `netlify.toml`.
3. O build roda `node fonte/gerar.mjs` com o endereço que a Netlify atribuir,
   então canonical, Open Graph, sitemap e JSON-LD saem com a URL certa.

### GitHub Pages

O workflow `.github/workflows/deploy.yml` já copia `cabanas-do-alto/site` para
`/cabanas-do-alto/` no artefato do Pages. O endereço fica
`https://jacqueplaton.github.io/sites/cabanas-do-alto/`, que é o padrão do
gerador.

### Domínio oficial

Gere com o domínio e com a indexação ligada:

```bash
URL_SITE=https://www.dominio-oficial.com.br INDEXAR=true node cabanas-do-alto/fonte/gerar.mjs
```

Na Netlify, defina as variáveis `URL_SITE` e `INDEXAR=true` em
*Site configuration → Environment variables*.

**Enquanto estiver fora do domínio oficial, o site sai com
`<meta name="robots" content="noindex">`.** Assim, uma versão ainda não
aprovada pela hospedagem não concorre no Google com os canais oficiais
(Instagram, Airbnb, Google Business). O `robots.txt` e o `sitemap.xml` já estão
prontos para quando a indexação for ligada.

---

## O que o site faz

| Recurso | Como funciona |
|---|---|
| Vídeo no topo | Carrega depois da página; versão recortada para celular em pé (515 KB) e versão desktop (1,3 MB); WebM como reserva; pausa fora da tela; botão de pausar; não toca com "reduzir movimento" nem em economia de dados |
| WhatsApp fixo | Ícone no canto inferior direito, com área segura do iPhone. Some na seção de reserva (o formulário já leva ao WhatsApp) e com o menu aberto. Na página de cada cabana, a mensagem cita a cabana |
| Pré-consulta | Cabana + check-in + check-out + hóspedes (+ pet). Valida a capacidade de cada cabana e sugere alternativas. Abre o WhatsApp no formato combinado |
| Qual cabana combina | Filtro por número de pessoas e "não pode faltar" (banheira, lareira, ar-condicionado, rede); destaca as cabanas que atendem |
| Tabela comparativa | As seis lado a lado; no celular, desliza com a primeira coluna fixa |
| SEO / GEO | Title e description por página, canonical, Open Graph, Twitter, URLs `/cabanas/<nome>/`, breadcrumb, sitemap, robots |
| Dados estruturados | `LodgingBusiness` (com as 6 `Accommodation`), `FAQPage`, `BreadcrumbList`, `ItemList`, `WebSite`. Sem `AggregateRating`, `Review`, preço ou disponibilidade |
| Medição | Se houver Google Tag Manager, os cliques vão para o `dataLayer`: `whatsapp_fixo`, `whatsapp_formulario` (com cabana, noites e hóspedes), `cta_hero`, `filtro_cabanas` etc. |

Mensagem do formulário:

```
Olá! Gostaria de consultar uma estadia nas Cabanas do Alto.
Cabana: Curió
Check-in: 26/10/2026
Check-out: 29/10/2026
Hóspedes: 2
Pet: sim
Conheci vocês pelo site.
```

## Auditoria feita

- **HTML:** 9 páginas válidas no html-validate.
- **Links:** nenhum link interno quebrado. Os externos apontam só para o WhatsApp
  validado, os 6 anúncios oficiais do Airbnb, o Instagram e o Google Maps.
- **Acessibilidade:** axe-core sem violações (WCAG 2.2 AA) na home, na página
  /cabanas/ e numa página de cabana, no desktop e no celular.
- **Lighthouse (perfil celular):**
  - Desempenho: 96 na home e 99 nas cabanas.
  - Acessibilidade: 100.
  - Boas práticas: 100.
  - SEO: 100 com a indexação ligada; com o `noindex` padrão, a nota cai, como esperado.
  - Métricas: LCP 2,0 s, CLS 0.
- **Testes de comportamento:** 26 verificações automáticas:
  - filtro das cabanas;
  - formulário e mensagem do WhatsApp;
  - aviso de capacidade;
  - menu;
  - galeria;
  - vídeo com "reduzir movimento";
  - funcionamento sem JavaScript;
  - ausência de rolagem lateral no celular.

---

## Pendências — conferir antes de publicar no domínio oficial

A lista completa, com fontes, está na seção 6 de `PESQUISA.md`.

1. **WhatsApp (12) 99102-2087.** É o número mais recente encontrado. O antigo,
   (12) 99771-8065, só aparece em um blog antigo. A conferência final no Google
   Business, no Instagram e no Linktree não pôde ser feita daqui, porque a
   rede do ambiente bloqueou esses sites. Confirme antes de divulgar.
2. **Vídeo do topo.** Foi gerado por IA e mostra elementos que não aparecem nas
   fotos reais: ofurô de borda escura com degraus, cadeiras-casulo suspensas e
   chaminé larga de madeira. Para o site oficial, troque por uma filmagem real
   com os mesmos nomes de arquivo, ou use uma das fotos no lugar.
3. **Fotos por cabana.** As seis fotos recebidas não dizem de qual cabana são.
   Por isso nenhuma foto foi associada a uma cabana específica, e as legendas
   descrevem a cena. Com as fotos de cada cabana, basta trocar o campo `foto`
   de cada uma em `dados.mjs`.
4. **Tarifário 2026 e políticas.** O tinyurl não pôde ser aberto. O site não
   publica preço e direciona para "consultar valores para suas datas".
5. **Terapias e oficina de cerâmica.** Aparecem como "sob consulta", conforme
   informado pela hospedagem; não foram achadas em fonte pública.
6. **Notas do Airbnb.** O site usa só números mínimos, que continuam
   verdadeiros com o tempo ("mais de 100 avaliações, nota acima de 4,9"). A Tauá
   aparece sem número porque a nota dela não pôde ser confirmada.
7. **Check-in aos fins de semana.** A Holmy diz que não há check-in aos sábados
   e domingos. O site não publica isso.
8. **Logotipo.** O site usa um logotipo tipográfico provisório. Troque pelo
   oficial quando houver.
9. **Coordenadas.** Faltam as coordenadas exatas para o bloco `geo` do
   JSON-LD.
