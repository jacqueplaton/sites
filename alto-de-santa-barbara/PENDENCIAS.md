# Pendências — uso interno

Nada desta lista aparece para o hóspede. Cada item está marcado como
**NÃO CONFIRMADO — VALIDAR COM O PROPRIETÁRIO** até resposta por escrito.
Onde a informação foi omitida da página, a coluna “Quando confirmar” diz o
que acrescentar.

Fontes de referência: A1/A2 (Airbnb Chalé 1 e 2), D1 (Pousadas Top),
B1 (Booking), P1 (Planet of Hotels), R1 (Tripadvisor). Pesquisa de 06/10/2026.

## Antes de publicar

| # | Item | O que se sabe | Situação na prévia | Quando confirmar |
|---|---|---|---|---|
| 1 | WhatsApp ativo e quem atende | (12) 99220-4141 no briefing e em D1; operação não testada | Usado em todos os botões | Testar uma mensagem real; nomes dos anfitriões (Airbnb cita David; relatos citam Bárbara/Gabriel) |
| 2 | Direito de uso das 10 fotos | Vêm dos anúncios A1/A2 | Usadas na prévia | Autorização por escrito; confirmar o chalé de cada foto (tabela no README) |
| 3 | Endereço, pino e rota | 10101 (Booking/P1) × 10100 (Tripadvisor) | Sem endereço, sem mapa, sem coordenadas | Acrescentar endereço em “Como chegar” e `streetAddress`/`geo` no JSON-LD |
| 4 | Acesso | P1 relata trecho de terra; R1 recomenda chegar de dia | Só “confirme a rota e as condições do acesso” | Extensão da terra, subida, carro baixo, chuva. Deixar **visível** em “Como chegar”, não escondido em pergunta |
| 5 | Altitude | Mirante “acima de 1.650 m” (A1/A2) × “1.700 m” (D1) | Nenhum número | Só citar se confirmado, e atribuído ao mirante, não aos chalés |
| 6 | Entrada e saída | 16h / 14h em D1 e P1 | Omitido | Pergunta no FAQ + `checkinTime`/`checkoutTime` no JSON-LD |
| 7 | Estadia mínima | 2 noites em D1 | Omitido; formulário não trava | Pergunta no FAQ, com exceções de feriado |
| 8 | Crianças | Idade mínima 14 em D1 | Omitido | Pergunta no FAQ |
| 9 | Animais | “Pequeno porte” em D1; P1 aceita sem detalhar | Omitido | Pergunta no FAQ com limites e taxa |
| 10 | Preço, sinal, pagamento, cancelamento | Valores de terceiros variam | Nenhum preço | Explicar as condições no FAQ; nunca prometer “melhor preço” |
| 11 | Café da manhã | Incluído e entregue no chalé (A1/A2) | Publicado | Horário, itens, restrições alimentares. A foto 07 é só uma xícara, não a cesta |
| 12 | Refeições e extras | Diretório cita kit romântico; relatos citam refeições | Omitido | Cardápio, preços, como pedir |
| 13 | Sauna do Chalé 1 | “Sauna seca” em A1 | Publicado | Regras de uso; foto do interior, se houver (a 09 mostra a porta) |
| 14 | Lareira e lenha | Lareira nos dois (A1/A2) | Publicado só “lareira” | Lenha incluída? Regras? |
| 15 | Microcozinha do Chalé 2 | A2 | Publicado | Equipamentos; foto própria, se houver |
| 16 | Trilha e mirante | Trilha interna, cerca de 30 min (anfitrião) | Publicado como estimativa | Dificuldade, calçado, horário, orientação dos anfitriões |
| 17 | Notas do Airbnb | Chalé 1: 4,98 (258); Chalé 2: 4,96 (192), em 06/10/2026 | Publicadas com fonte e data | Revalidar na data da publicação ou remover |
| 18 | Domínio, logo oficial, perfil no Google | Não localizados | Marca só tipográfica; favicon provisório | Trocar `favicon.svg`; `SITE_URL` + `INDEXAR=sim` no build; ligar site ao Perfil da Empresa |
| 19 | Terceiro anúncio parecido com o Chalé 1 | Encontrado na pesquisa | Não tratado como terceiro chalé | Confirmar se A1 e A2 são os anúncios principais |
| 20 | Acessibilidade física, voltagem, limpeza | Não publicados | Omitido | Acrescentar ao FAQ se relevante |

## Notas não usadas de propósito

- Booking: 9,3/10 (64) no resultado indexado × 9,4/10 (67) em P1. Fontes
  divergentes; fora da página.
- D1 tem nota em escala própria; não é nota do Google e não deve ser
  apresentada como tal.
- Tripadvisor: 5/5 com 6 avaliações; amostra pequena.
