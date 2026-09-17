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
- [ ] Trocar a linha `<link rel="canonical" href="https://exemplo.com.br/">` no
      `index.html` pelo endereço real do site.
- [ ] Decidir se entra o número da Av. Rui Barbosa (hoje o site não mostra
      número nenhum).

---

## Publicar

Como não tem build, qualquer hospedagem de arquivo estático serve: Netlify,
Vercel, GitHub Pages, ou a hospedagem que o cliente já tiver. Basta enviar o
conteúdo desta pasta (`index.html` na raiz do site).
