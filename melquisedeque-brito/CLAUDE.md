# Notas para sessões futuras

Site de advocacia criminal de Melquisedeque de Brito Trindade (OAB/RN 23.477), feito para Jacque Platon publicar no Netlify.

- A origem é `fonte/`. `site/`, `revisao/` e `dist/` são geradas por `python3 fonte/gerar.py [--zip] [--dominio URL]` e apagadas a cada execução.
- Links internos nos textos usam `href="@/rota/"`, os da revisão usam `href="@r/rota/"`, o WhatsApp usa `href="@wa"` com `data-wa="posicao"` e as imagens usam `@assets/`. O gerador resolve tudo.
- Paleta: papel `#F4F0E7`, grafite `#1E1E1E`, vinho `#672532`, bronze `#AC8856`. Para texto bronze sobre papel, use `--bronze-texto` (`#7A5E36`), por contraste.
- Tom: informativo e discreto, conforme o Provimento 205/2021 da OAB. Sem promessas de resultado, casos inventados, credenciais não confirmadas ou urgência comercial.
- Cada página de atuação abre com a dúvida (rumina) no H1, a resposta curta logo abaixo e o termo técnico em seguida. As ruminas não são atribuídas a clientes.
- Não publique formação, endereço, avaliações ou mapa sem confirmação. Veja `planejamento/dossie.md`.
- Depois de mudar algo, rode o gerador com `--zip` e confira os links. O README lista o que foi verificado.
