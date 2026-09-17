# Marido de aluguel — Natal/RN

Landing page para apresentação ao proprietário. HTML, CSS e JavaScript puro:
sem framework, sem build, sem `npm install`. É só subir a pasta em qualquer
hospedagem que o site funciona.

---

## Como ver a página

A pasta precisa ser servida por um endereço `http://`, não aberta com dois
cliques no arquivo (as fontes e o `config.js` não carregam de outro jeito).

Dentro desta pasta, rode um destes comandos e abra <http://localhost:8000>:

```
python3 -m http.server 8000
```
```
npx serve .
```

---

## Estrutura dos arquivos

```
index.html            a página inteira (todas as seções e todos os textos)
favicon.svg           ícone da aba do navegador
robots.txt            instruções para o Google
sitemap.xml           mapa do site para o Google
netlify.toml          configuração da publicação (veja "Publicar no Netlify")
netlify-build.sh      script que monta a pasta publicada

css/
  style.css           todo o visual: cores, tipografia, layout, animações
  fonts.css           declarações das fontes locais (não precisa mexer)

fonts/                Archivo e Karla em .woff2, servidas do próprio site

js/
  config.js    ←      DADOS DO NEGÓCIO (telefone, horário, endereço, nota)
  app.js              lógica do site (raramente precisa mexer)

media/                as quatro imagens dos serviços
```

O arquivo marcado com ← é o que você abre no dia a dia.

---

## Trocar telefone, horário, endereço ou a nota do Google

Abra **`js/config.js`**. Todos os links de WhatsApp, os telefones clicáveis e
os horários do site saem daí — muda em um lugar, muda na página inteira.

```js
telefoneExibicao: '(84) 99978-4287',      // como aparece escrito
numeroInternacional: '5584999784287',     // 55 + DDD + número, sem símbolos
horario: 'Segunda a sexta, das 8h às 22h',
nota: 4.8,
qtdAvaliacoes: 43,
```

**Regras importantes**

- `numeroInternacional` não leva espaço, traço nem parênteses. É esse número
  que o WhatsApp usa.
- `nota: null` esconde o selo de avaliação em vez de mostrar um número errado.
  Faça isso se a nota do Google mudar e você ainda não tiver conferido.
- A nota 4,8 e as 43 avaliações foram confirmadas pelo cliente. Quando mudarem
  no Google, atualize aqui.
- O endereço não tem número de rua porque o número não foi informado. O site
  trata a Av. Rui Barbosa como referência de atendimento e em nenhum momento
  afirma que existe loja aberta ao público.

**Atenção:** o telefone e o horário aparecem em mais um lugar — o bloco
`application/ld+json` no fim do `index.html`, que é o que o Google lê. Se mudar
um deles no `config.js`, mude também lá. São duas linhas, estão comentadas.

---

## As fotos

O site já aponta para os arquivos finais. **Não precisa mexer em código:** é só
salvar as quatro fotos dentro de `media/` com estes nomes exatos.

| Foto                                  | Nome do arquivo        |
|---------------------------------------|------------------------|
| Profissional montando o móvel na sala | `montagem-moveis.jpg`  |
| Manutenção de tomada na parede        | `eletrica.jpg`         |
| Reparo do sifão sob a pia             | `hidraulica.jpg`       |
| Pintura de parede com rolo            | `pintura.jpg`          |

Enquanto um desses arquivos não estiver na pasta, aquele quadro mostra um
espaço reservado azul escrito "FOTO 01", "FOTO 02"… — nunca o ícone de imagem
quebrada. No instante em que o `.jpg` entra, a foto aparece sozinha.

**As quatro fotos ocupam seis pontos da página**, porque duas aparecem duas
vezes, em tratamentos diferentes para não parecer repetição:

| Onde | Foto |
|---|---|
| Capa | montagem de móveis |
| Card de elétrica | elétrica |
| Card de hidráulica | hidráulica |
| Card de pintura | pintura |
| Faixa larga antes do "Como funciona" | pintura |
| Coluna direita do "Sobre o serviço" | hidráulica |

Nas duas repetições o `alt` está vazio de propósito: é foto decorativa, e o
leitor de tela não deve ler a mesma descrição duas vezes.

Para conferir o que já está no lugar, rode dentro desta pasta:

```
ls media/
```

Depois que as quatro fotos estiverem lá, pode apagar os arquivos
`media/placeholder-*.svg` — e, se quiser deixar limpo, as quatro linhas
`--reserva:url(...)` no `index.html`.

**Sobre o recorte:** as fotos são 3 por 2, a mesma proporção dos quadros do
site, então entram inteiras, sem corte. A única exceção é a foto principal no
celular, que fica um pouco mais quadrada — se quiser mudar a parte visível,
ajuste `object-position` em `.capa__foto img` no `css/style.css`.

**As imagens são ilustrativas, geradas por IA.** O site diz isso em dois
lugares (selo sobre a foto principal e rodapé). Elas não representam equipe,
portfólio nem obra concluída — se um dia entrarem fotos reais dos serviços,
vale tirar esses dois avisos.

---

## O que o site propositalmente não diz

Esta página só afirma o que foi informado. Não há — e não deve ser acrescentado
sem confirmação do proprietário:

- prazo, cobertura ou condições da garantia;
- promessa de orçamento grátis, visita grátis ou atendimento imediato;
- tempo de experiência, número de atendimentos ou certificações;
- depoimentos, nomes de clientes ou fotos de obras entregues.

Não existe formulário na página: todo pedido vai direto para o WhatsApp, e nada
é enviado automaticamente — o visitante escreve e envia a mensagem dele.

---

## Antes de publicar

- [ ] Colocar as quatro fotos em `media/` (veja "As fotos" acima).
- [ ] Testar os botões de WhatsApp num celular com o app instalado.
- [ ] O endereço do site (`canonical`, Open Graph, sitemap) é ajustado sozinho
      na publicação pelo Netlify — só precisa de atenção se você publicar em
      outro lugar.
- [ ] Decidir se entra o número da Av. Rui Barbosa (hoje o site não mostra
      número nenhum).

---

## Publicar no Netlify

Este repositório tem **dois sites**: o do restaurante, na raiz, e este, na pasta
`marido-de-aluguel/`. Por isso tem um passo que não dá para pular.

### Pelo GitHub (recomendado — cada `git push` republica sozinho)

1. No Netlify: **Add new site → Import an existing project → GitHub** e escolha
   o repositório `jacqueplaton/sites`.
2. Na tela de configuração, escolha a **branch** que quer publicar.
3. **Abra "Configure" / "Advanced" e preencha o campo `Base directory` com:**

   ```
   marido-de-aluguel
   ```

   **Esse é o passo obrigatório.** Sem ele, o Netlify lê o `netlify.toml` da
   raiz e publica o site do restaurante no lugar deste.
4. Não preencha mais nada. Com o base directory definido, o Netlify acha o
   comando de build (`bash netlify-build.sh`) e a pasta de publicação (`_site`)
   sozinho, lendo o `netlify.toml` desta pasta.
5. **Deploy site.** Em um minuto sai um endereço tipo
   `https://nome-sorteado.netlify.app`, que dá para renomear em
   *Site configuration → Change site name*.

### Por arrastar e soltar (mais rápido para mostrar ao cliente)

Sem GitHub, sem conta conectada:

```
bash netlify-build.sh
```

Isso cria a pasta `_site`. Arraste ela para <https://app.netlify.com/drop> e o
site entra no ar na hora. Para atualizar depois, rode o comando de novo e
arraste outra vez.

### O que o build faz

O `netlify-build.sh` separa em `_site` só o que vai para o ar — o `README.md` e
o próprio script ficam de fora — e **troca o endereço provisório
`https://exemplo.com.br` pelo endereço real do deploy** no `canonical`, no Open
Graph, no `robots.txt` e no `sitemap.xml`. Ou seja: não precisa editar o
canonical na mão, aquilo sai resolvido sozinho.

Se alguma das quatro fotos ainda não estiver em `media/`, o build avisa no log
e publica assim mesmo, com o espaço reservado no lugar. Não quebra o deploy.

**Quando o site ganhar domínio próprio:** aponte o domínio no Netlify e troque
`https://exemplo.com.br` nos três arquivos onde ele aparece — `index.html`,
`sitemap.xml` e `robots.txt` — mais a linha `PROVISORIO=` do `netlify-build.sh`.

---

## Publicar em outro lugar

O site é HTML puro, então qualquer hospedagem de arquivo estático serve —
Vercel, GitHub Pages, ou a hospedagem que o cliente já tiver. Rode
`bash netlify-build.sh` e envie o conteúdo da pasta `_site` (com o
`index.html` na raiz do site).

Fora do Netlify o script não sabe qual é o endereço final, então o
`https://exemplo.com.br` continua escrito no `canonical`, no Open Graph, no
`sitemap.xml` e no `robots.txt` — troque nesses quatro lugares antes de subir.
