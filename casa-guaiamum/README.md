# Casa Guaiamum — prévia comercial

Página única, estática, em português, com galeria fotográfica por ambiente e
consulta de reserva direta pelo WhatsApp.

**Tecnologia:** HTML, CSS e JavaScript puro. Sem framework, sem build, sem
`npm install`, sem fonte externa, sem rastreador. A pasta já é o site: basta
publicá-la.

> **Estado: prévia.** A página está com `<meta name="robots" content="noindex, follow">`.
> Retire essa linha só depois da aprovação do proprietário e da definição do
> domínio. Veja “Antes de publicar de verdade”.

---

## Arquivos

```
index.html                 a página inteira
favicon.svg                ícone da aba
robots.txt                 instruções para buscadores
netlify.toml               configuração de publicação

css/style.css              identidade visual completa
js/config.js          ←    NÚMERO DO WHATSAPP (único lugar a editar)
js/app.js                  formulário, validação e galeria ampliada

media/og-image.jpg         imagem de compartilhamento (1200×628)
media/fotos/
  01_exteriores/           piscina, deck, pôr do sol, escada
  02_areas_sociais/        sala, circulação, varanda
  03_quartos/              quatro ambientes de dormir
  04_banheiros/            lavabo e banheiros
```

Cada fotografia tem duas versões: o arquivo grande (`nome.jpg`) e uma reduzida
para celular (`nome-800.jpg`). O navegador escolhe sozinho pelo `srcset`.

---

## Trocar o número do WhatsApp

Abra `js/config.js` e altere **uma linha**:

```js
whatsappNumber: "5521960158360",   // país + DDD + número, só dígitos
```

O valor é aplicado ao botão flutuante, ao link do rodapé e à mensagem gerada
pelo formulário. Se o número deixar de ser confirmado, troque
`whatsappConfirmed` para `false`: o botão flutuante some em vez de apontar
para um destino errado.

Lembre de atualizar também o número escrito no `README` e conferir o rodapé.

### De onde veio o número

`+55 21 96015-8360`, divulgado pela própria hospedagem. A confirmação é uma
fotografia da galeria do anúncio com o texto “21 960158360 / wathsapp”
sobreposto à mesma cena do deck que abre o site — o arquivo está em
`../casa-guaiamum-entrega/evidencia-whatsapp.jpg`. **Nenhuma mensagem de teste
foi enviada**: a confirmação é documental, não um contato realizado.

---

## Como o formulário funciona

Três campos: check-in, check-out e hóspedes. Ao enviar, o site **não** reserva
nem cobra nada — ele monta uma mensagem e abre o WhatsApp para o visitante
revisar e enviar:

> Olá! Gostaria de consultar uma estadia na Casa Guaiamum. Check-in: 24/12/2026.
> Check-out: 02/01/2027. Hóspedes: 6. Poderia informar disponibilidade, valor
> total e condições?

Regras validadas antes de gerar o link:

| Campo     | Regra                                             |
|-----------|---------------------------------------------------|
| Check-in  | obrigatório, data válida, não anterior a hoje     |
| Check-out | obrigatório, data válida, posterior ao check-in   |
| Hóspedes  | número inteiro, de 1 a 12                         |

As datas são tratadas como texto `AAAA-MM-DD` e convertidas para `DD/MM/AAAA`
na mão, sem passar por UTC — senão uma reserva feita à noite no Brasil viraria
o dia anterior. Os erros aparecem ao lado do campo, o campo recebe
`aria-invalid` e o foco volta para o primeiro erro.

O seletor de data é desenhado pelo navegador e aparece no idioma dele (pode
mostrar `mm/dd/yyyy`). Por isso, assim que uma data é escolhida, a página
confirma embaixo do campo: “Chegada em 24/12/2026.”

Nenhum dado é guardado, enviado a servidor ou compartilhado: a consulta existe
só dentro do navegador até o visitante apertar enviar no WhatsApp.

---

## Publicar na Netlify

**A) Deploy manual (mais simples)** — em
`https://app.netlify.com/projects/SEU-PROJETO/deploys`, arraste **a pasta
`casa-guaiamum` inteira** para a área “Drag and drop your project output
folder here”. Cada envio substitui tudo o que estava publicado, então arraste
sempre a pasta completa, nunca só o `index.html`.

**B) Repositório conectado** — em *Site configuration → Build & deploy*:

| Campo            | Valor           |
|------------------|-----------------|
| Base directory   | `casa-guaiamum` |
| Build command    | (vazio)         |
| Publish directory| `casa-guaiamum` |

A Netlify passa a ler o `netlify.toml` desta pasta. Documentação:
<https://docs.netlify.com/deploy/create-deploys/>

> Se já existir uma prévia deste projeto na Netlify, atualize **esse** projeto.
> Não crie um novo: o endereço enviado ao proprietário mudaria.

---

## Antes de publicar de verdade

Hoje o site é uma prévia e não tem domínio definitivo. Por isso, de propósito,
**não** existem `canonical`, `sitemap.xml` nem URLs absolutas inventadas —
apontar para um endereço fictício atrapalharia a indexação depois. Quando o
domínio estiver definido:

1. remova `<meta name="robots" content="noindex, follow">` do `index.html`;
2. acrescente `<link rel="canonical" href="https://SEU-DOMINIO/">`;
3. troque `og:image` e `twitter:image` pela URL absoluta
   (`https://SEU-DOMINIO/media/og-image.jpg`) e acrescente `og:url`;
4. use URLs absolutas no bloco `image` dos dados estruturados;
5. crie o `sitemap.xml` com a URL real e descomente a linha `Sitemap:` do
   `robots.txt`.

---

## Decisões de conteúdo

- **Só fotografia real da casa.** 17 imagens, todas da galeria do anúncio do
  anfitrião. Nenhuma imagem de banco, nenhuma ilustração, nenhum vídeo,
  nenhuma animação e nenhum espaço reservado para mídia futura.
- **Uma foto foi deixada de fora.** `05_jardim_e_agua.jpg` mostra pessoas
  identificáveis, entre elas uma criança pequena. Publicar exigiria
  autorização de uso de imagem. O arquivo está em
  `../casa-guaiamum-entrega/casa-guaiamum-fotos.zip`, em `_nao_publicadas/`.
- **Nada foi inventado.** Comodidades, capacidade, número de quartos, camas e
  banheiros vêm do anúncio, com a data da consulta escrita na página. Não há
  endereço exato, preço, horário, política de cancelamento nem disponibilidade,
  porque nada disso foi confirmado.
- **A nota 4,93/5 em 69 avaliações** aparece atribuída ao Airbnb e datada. Ela
  **não** entra nos dados estruturados: são avaliações do Airbnb, não do site.
- **Barco, bolo e cachorro** aparecem em fotografias, mas não são anunciados
  como serviço, cortesia ou passeio incluído.

---

## Identidade visual

Conceito: **entre a água e o verde**, tirado das próprias fotografias.

| Cor              | Hex       | Uso                                      |
|------------------|-----------|------------------------------------------|
| Verde profundo   | `#173E38` | texto, botões, faixa de dados, rodapé    |
| Off-white        | `#F6F2E9` | fundo                                    |
| Madeira          | `#A36B49` | filetes e marcadores (decorativo)        |
| Madeira escura   | `#7A4B31` | rótulos em versalete (texto)             |
| Azul-água        | `#87B5BD` | tintas e acentos sobre o verde           |

Tipografia: Georgia (ou a serifada disponível no sistema) nos títulos, fonte do
sistema no corpo. Nenhuma fonte é baixada de fora.

Madeira `#A36B49` (3,95:1) e azul-água `#87B5BD` (2,01:1) **reprovam** para
texto sobre o fundo claro — por isso só aparecem como decoração, e o texto de
destaque usa `#7A4B31` (6,53:1). Todos os textos da página foram medidos e
passam no AA da WCAG.

---

## Conferido antes da entrega

Testado em Chromium, a 360 px, 768 px e 1440 px:

- 39 caminhos de arquivo referenciados, **0 quebrados**; nenhuma imagem órfã;
- um único `<h1>`, hierarquia de títulos sem salto, `lang="pt-BR"`;
- todas as imagens com `alt` fiel, `width`, `height` e `srcset`;
- **CLS 0,0000** (nada salta ao carregar) e `DOMContentLoaded` em ~100 ms;
- primeira tela no celular: ~735 KB, quase tudo fotografia; o resto carrega ao
  rolar;
- formulário: campos vazios, data passada, saída ≤ chegada, hóspedes 0, 13,
  2,5 e letras — todos barrados com mensagem no campo certo e foco no primeiro
  erro; virada de ano (24/12 → 02/01) correta;
- mensagem do WhatsApp codificada com `encodeURIComponent` e conferida
  decodificada;
- galeria ampliada: abre, navega com as setas, fecha com `Esc` e devolve o
  foco ao botão de origem;
- sem JavaScript: conteúdo, fotos, formulário e links do WhatsApp continuam no
  HTML;
- sem rolagem horizontal em nenhuma largura; o botão flutuante não cobre o
  botão do formulário nem o rodapé;
- nenhum `<video>`, `<iframe>`, `<canvas>`, `@keyframes` ou `animation:`.

---

## Pendências reais

1. **Domínio definitivo** — necessário para canonical, sitemap e URLs
   absolutas (lista acima). Enquanto não houver, o site fica `noindex`.
2. **Aprovação do proprietário** quanto às fotografias escolhidas, ao texto e
   ao uso da nota do Airbnb.
3. **Cozinha** — consta no anúncio, mas não há fotografia dela no pacote.
   Nenhum outro ambiente foi rotulado como cozinha. Se o proprietário enviar
   uma foto, ela entra em `02_areas_sociais`.
4. **Foto 05** — decisão do proprietário sobre publicar, com autorização de
   uso de imagem, ou manter fora.
5. **Número do WhatsApp** — confirmado por evidência pública, sem mensagem de
   teste. Vale uma confirmação direta com o anfitrião antes da divulgação.
