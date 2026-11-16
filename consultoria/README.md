# Implantação Comercial Digital — página de vendas

Página de vendas da consultoria de Jacque Platon. Projeto independente do site
do restaurante: nada aqui depende de arquivos fora desta pasta.

HTML, CSS e JavaScript puros. Sem build e sem dependências externas.

## Estrutura

```
site/               tudo o que vai ao ar
  index.html        página de vendas (o bloco CONFIG fica no final)
  privacidade.html  política de privacidade (rascunho, noindex)
  css/style.css     visual
  fonts/            Newsreader e Schibsted Grotesk, hospedadas no próprio site
  media/            coloque aqui a foto (jacque.jpg)
  favicon.svg
netlify.toml        publica só a pasta site/
PENDENCIAS.md       lista interna do que falta confirmar (não vai ao ar)
```

## Configurar

No final de `site/index.html`:

```js
var CONFIG = {
  whatsapp: '',   // só dígitos, com DDI e DDD. Ex.: '5511999998888'
  mensagem: '...',
  foto: ''        // Ex.: 'media/jacque.jpg'
};
```

Com `whatsapp` vazio, os botões não abrem conversa e a chamada final mostra um aviso.

## Mover para um repositório próprio

1. Crie um repositório vazio no GitHub.
2. Copie o conteúdo desta pasta para a raiz dele.
3. Na hospedagem, publique a pasta `site/` (o `netlify.toml` já faz isso no Netlify).

## Antes de publicar

Veja `PENDENCIAS.md`.
