# Coutinho Pereira Advocacia — site

Site institucional do escritório, em português, responsivo e sem dependências
externas: nada é carregado do Google, de CDN ou de qualquer outro servidor
(as fontes estão hospedadas aqui mesmo). A única exceção é o mapa, que é um
quadro do Google Maps e só carrega quando o visitante chega perto dele.

**Tecnologia:** HTML, CSS e JavaScript puros. Sem framework, sem build, sem
`npm install`. Copie os arquivos para qualquer hospedagem e o site funciona.

---

## Estrutura dos arquivos

```
index.html            a página inteira (todas as seções)
favicon.svg           ícone da aba do navegador
robots.txt            instruções para o Google
sitemap.xml           mapa do site para o Google

css/
  style.css           todo o visual: cores, tipografia, layout, animações
  fonts.css           declarações das fontes locais (não precisa mexer)

fonts/                Instrument Serif e Archivo em .woff2 (licença OFL)

js/
  config.js    ←      DADOS DO ESCRITÓRIO (telefone, endereço, horário, nota)
  app.js              lógica do site (raramente precisa mexer)

media/
  og-image.png        imagem que aparece quando o link é compartilhado
```

O arquivo marcado com ← é o único que se abre no dia a dia.

---

## Tarefas do dia a dia

### Mudar telefone, endereço ou horário

Abra **`js/config.js`**. Está tudo em um lugar só, com um comentário
explicando cada campo. O que for alterado ali muda o site inteiro: cabeçalho,
capa, rodapé, lista de horários, mapa e botões.

O horário fica assim (0 = domingo, 1 = segunda … 6 = sábado, hora em 24 h):

```js
horario: [
  { dias: [1, 2, 3, 4, 5], abre: '08:00', fecha: '18:00' },
  { dias: [6],             abre: null,    fecha: null    },  // sábado
  { dias: [0],             abre: null,    fecha: null    }   // domingo
],
```

O site destaca o dia de hoje na lista e mostra sozinho um selo
**“Aberto agora”** ou **“Fechado · abre amanhã às 8h”**, sempre calculado no
fuso de Natal — mesmo que o visitante esteja em outro estado ou país.

> Ao mudar o horário, atualize também o bloco `openingHoursSpecification`
> dentro de `index.html` (procure por `application/ld+json`). É esse bloco que
> o Google lê para mostrar o horário na busca.

### Acrescentar WhatsApp ou e-mail

Em `js/config.js`, os campos `whatsapp` e `email` estão como `null` porque não
constavam na ficha do Google. Basta preencher:

```js
email: 'contato@exemplo.adv.br',
whatsapp: 'https://wa.me/5584999999999',
```

O bloco de e-mail aparece sozinho na seção de atendimento assim que for
preenchido.

### Editar as áreas de atuação

Estão escritas direto no `index.html`, na seção `02 — Áreas de atuação`. Cada
área é um bloco curto:

```html
<article class="area">
  <span class="area__num">01</span>
  <h3>Direito Civil</h3>
  <p>Contratos, responsabilidade civil, indenizações, família e sucessões.</p>
</article>
```

Copie um bloco para acrescentar uma área, apague o bloco inteiro para remover,
e mantenha a numeração em ordem.

**Importante:** logo abaixo da lista existe um aviso dizendo que ela é
provisória. Quando o escritório confirmar as áreas, apague esse aviso — ele
está marcado no arquivo com o comentário `APAGUE ESTE AVISO`.

### Esconder ou ajustar a nota do Google

Em `js/config.js`:

```js
mostrarNota: true,   // false esconde o selo por completo
nota: 5.0,
avaliacoes: null,    // troque por um número para mostrar a quantidade
```

---

## O que veio da ficha do Google e o que ainda falta confirmar

Tudo que está publicado foi tirado da ficha do escritório no Google Maps.
Três pontos merecem conferência antes de divulgar o site:

| Item | Situação |
| --- | --- |
| Nome, telefone, endereço, salas, CEP e horário | Conforme a ficha do Google |
| Quantidade de avaliações | **Ambígua na ficha** (“5.026 avaliações” pode ser 26 avaliações com a nota 5,0 grudada na frente). Por isso o site mostra só a nota 5,0, sem quantidade |
| Áreas de atuação | **A confirmar.** A ficha traz apenas a categoria “Advogado”; as seis áreas publicadas são uma sugestão inicial, com aviso visível na página |
| Textos institucionais | Escritos para o site. Valem uma leitura do escritório antes de publicar |
| E-mail e WhatsApp | Não constam na ficha; ficaram de fora até serem confirmados |

## Publicidade da advocacia

O rodapé traz o aviso de que o site é meramente informativo, nos termos do
Código de Ética e Disciplina da OAB e do **Provimento nº 205/2021** do Conselho
Federal da OAB. Seguindo essas regras, o site **não** traz depoimentos de
clientes, menção a resultados obtidos, valores de honorários nem promessa de
êxito. A nota do Google é exibida por ser informação pública da própria ficha
do escritório — se preferir não exibi-la, use `mostrarNota: false`.

Vale registrar o número de inscrição do escritório na OAB/RN no rodapé assim
que ele for informado: é a prática recomendada em sites de advocacia.

---

## Publicar

O site é um conjunto de arquivos estáticos — funciona em qualquer lugar.

- **GitHub Pages:** a pasta já entra na publicação do repositório
  (`.github/workflows/deploy.yml`), no endereço
  `.../sites/coutinho-pereira-advocacia/`.
- **Netlify:** o `netlify-build.sh` da raiz também copia esta pasta e ajusta
  os endereços de SEO sozinho.
- **Domínio próprio:** ao publicar em um domínio do escritório, troque o
  endereço `https://jacqueplaton.github.io/sites/coutinho-pereira-advocacia/`
  nos arquivos `index.html` (canonical, Open Graph e JSON-LD), `robots.txt` e
  `sitemap.xml`.

## Testar no computador

```bash
cd coutinho-pereira-advocacia
python3 -m http.server 8000
# abra http://localhost:8000
```
