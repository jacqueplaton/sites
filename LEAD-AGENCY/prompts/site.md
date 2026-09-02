# Prompt — site-demo (Módulo 6)

Gera o site em `sites/clientes/<empresa>/site/`. É uma demonstração enviada a
um dono de negócio real: tem de parecer trabalho de agência, não template de IA.

## Conteúdo

Seções: HOME, SERVIÇOS, SOBRE, BENEFÍCIOS, LOCALIZAÇÃO, CONTATO, WHATSAPP.
**DEPOIMENTOS só se existirem depoimentos reais no registro do lead.**

Todo texto vem de `copy.md`, que por sua vez vem dos dados do lead. O gerador
não escreve fato novo.

## Design

- tipografia com hierarquia real (escala definida, não tamanhos aleatórios);
- espaçamento consistente, escala de 4 ou 8 px;
- mobile-first, testado em 360 px;
- um CTA claro por seção, sempre alcançável;
- contraste AA, `alt` em toda imagem, ordem de foco correta;
- HTML semântico, `title`, `meta description`, Open Graph, dados estruturados
  `LocalBusiness` apenas com dados confirmados;
- sem framework pesado; carregar rápido em 3G.

## Evitar a cara de template de IA

- nada de gradiente roxo com ícone genérico e três cards iguais;
- nada de "Soluções inovadoras para o seu negócio";
- fotografia: usar a do negócio quando existir; não usar banco de imagem que
  contradiga a realidade (consultório que não é aquele, equipe que não é aquela);
- paleta a partir da identidade do negócio quando houver sinal dela.

## Checagem antes de considerar pronto

1. abrir o site num navegador de verdade;
2. conferir em 360 px e em 1440 px;
3. confirmar que não existe texto inventado;
4. listar os placeholders que sobraram.
