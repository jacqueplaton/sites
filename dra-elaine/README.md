# Site — Dra. Elaine Fernandes

Site de apresentação e captação de pacientes. A conversão principal é o
agendamento de uma avaliação pelo WhatsApp. Não há carrinho, checkout ou
pagamento.

## Tecnologia

Next.js (App Router) · TypeScript · Tailwind CSS v4. Sem dependências além
das do framework — os ícones são SVG inline.

## Rodar

```bash
npm install
npm run dev     # desenvolvimento
npm run build   # build de produção
npm run start   # servir o build
```

## Onde editar o conteúdo

Todo o conteúdo comercial está separado do layout:

| Arquivo | O que controla |
|---|---|
| `src/data/site.ts` | Nome, WhatsApp, Instagram, cidade, navegação e modalidades |
| `src/data/treatments.ts` | Os seis tratamentos: nome, preços, imagem e texto alternativo |
| `src/data/faq.ts` | Perguntas e respostas |
| `src/lib/whatsapp.ts` | Mensagens enviadas ao WhatsApp |

### Preços

Ficam apenas em `src/data/treatments.ts`. Nenhum valor está escrito dentro
de componente.

### Campos que aparecem só quando preenchidos

Em `src/data/site.ts`, os campos `crm`, `rqe`, `email` e `fullAddress` estão
vazios de propósito. Enquanto vazios, os blocos correspondentes não são
renderizados — não existe espaço em branco nem rótulo órfão no site. Basta
preencher para que apareçam automaticamente no rodapé e na seção "Sobre".

### Endereço do site

`siteUrl`, em `src/data/site.ts`, alimenta o canonical, o Open Graph, o
`sitemap.xml` e o `robots.txt`. Ajuste para o domínio real antes de publicar.

## Fotografias

Os 9 arquivos usados pelo site estão descritos em
[`public/images/LEIA-ME.md`](public/images/LEIA-ME.md), com nomes, caminhos
e proporções.

Enquanto uma fotografia não é entregue, o componente `PhotoFrame` exibe o
slot identificado (nome da foto e proporção) em vez de um espaço vazio. A
verificação acontece **durante o build**: se o arquivo não existe, nenhuma
requisição de imagem é feita, então não há erro de console nem imagem
substituta no lugar.

Para colocar uma foto no ar, basta salvar o arquivo com o nome esperado em
`public/images/` e rodar `npm run build` de novo. Ela entra na mesma
moldura, na mesma proporção, sem deslocar o layout e sem nenhuma alteração
de código.

## Acessibilidade

- Contraste verificado: todo texto atinge no mínimo 4.5:1 sobre o seu fundo.
  O dourado `#B39A70` só é usado sobre fundos escuros; sobre fundos claros o
  site usa a variante `--color-dourado-escuro` (`#7F6438`).
- Menu do celular com `role="dialog"`, fechamento por `Escape`, foco preso
  enquanto aberto e devolvido ao botão ao fechar.
- Link "Ir para o conteúdo", foco visível e `prefers-reduced-motion`
  respeitado em todas as animações.

## Privacidade

O formulário de contato não tem backend: ele apenas monta uma mensagem e
abre o WhatsApp. Nenhum dado é armazenado.
