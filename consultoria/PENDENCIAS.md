# Pendências antes de publicar

Documento interno. Não faz parte do site: só a pasta `site/` vai ao ar.

A página pública não afirma nenhum dos itens abaixo. Onde há texto sugerido,
ele só deve entrar na página depois da sua confirmação.

## 1. Bloqueiam a publicação

| Item | Situação na página hoje | O que fazer |
|---|---|---|
| WhatsApp | Botões não abrem conversa; aparece um aviso na chamada final | Preencher `CONFIG.whatsapp` no final de `site/index.html` (só dígitos, com 55 e DDD). O aviso some sozinho |
| Foto | Espaço tracejado "Substituir" na seção Sobre | Salvar em `site/media/jacque.jpg` (vertical, 4:5) e preencher `CONFIG.foto` |
| Domínio | Não definido | Depois de definido, acrescentar `<link rel="canonical">`, `og:url`, imagem de compartilhamento, `robots.txt` e `sitemap.xml` |
| Repositório próprio | O projeto está na pasta `consultoria/` do repositório do restaurante | Criar um repositório vazio e mover o conteúdo desta pasta para a raiz dele (ver README) |
| Política de privacidade | Rascunho em `site/privacidade.html`, marcado como `noindex` | Revisar (item 7) e remover o `noindex` |

## 2. Conversa inicial gratuita (proposta, aguardando confirmação)

A página fala em "conversa inicial" sem dizer que é gratuita.

Se confirmar, trocar em `site/index.html`:

- Etapa 1 do processo: "Em uma conversa inicial gratuita, entendo o que a empresa vende..."
- Chamada final: "A partir da conversa inicial, gratuita e sem compromisso, você recebe o escopo e o valor..."

Sugestão de formato: 30 a 40 minutos por vídeo, com um roteiro fixo de perguntas
(o que vende, ticket, região, como atende hoje, o que já existe de site, perfil,
anúncios e CRM). O orçamento segue por escrito depois.

## 3. Prazo e encontros (sugestão, não publicada)

A página diz apenas que o prazo "vem definido no orçamento".

Sugestão compatível com o escopo:

- **Prazo:** 20 a 30 dias corridos, contados do recebimento dos materiais e acessos
  (textos, fotos, logotipo, login do domínio, dados da empresa). Sem os materiais, o prazo não corre.
- **Encontros online (5 no total):**
  1. Conversa inicial e diagnóstico
  2. Alinhamento do escopo e coleta de materiais
  3. Apresentação do site e ajustes
  4. Treinamento 1: site, Perfil da Empresa no Google e Google Ads
  5. Treinamento 2: CRM, rotina comercial e entrega dos acessos
- Gravar os treinamentos e entregar as gravações reduz dúvidas depois da entrega.

Pontos fora do seu controle que convém registrar no orçamento: verificação do
Perfil pelo Google e aprovação de anúncios podem atrasar sem culpa de ninguém.

## 4. Suporte após a entrega (período a definir)

A página diz: "por um período limitado, informado no orçamento, para dúvidas
sobre o treinamento e correções do que foi implementado".

Sugestão: 30 dias corridos a partir da entrega, por WhatsApp, em horário comercial.

- Cobre: dúvidas sobre o que foi ensinado e correção de erros na implementação.
- Não cobre: gestão ou otimização de campanhas, novas páginas ou funcionalidades,
  mudanças de escopo, problemas causados por alterações feitas por terceiros.

## 5. Pagamento (a confirmar)

A página diz apenas "contratação única". Falta definir: formas aceitas (Pix,
cartão, boleto), se há parcelamento, se há entrada e saldo na entrega, e se
emite nota fiscal. Nada disso foi escrito na página.

## 6. Limites do escopo (publicados, confira se concorda)

Estes limites estão na página, na seção Entregas, porque você pediu limites claros:

- Um site de página única, um Perfil, uma campanha de Pesquisa, um funil em um CRM.
- Textos a partir das informações do cliente; imagens do cliente.
- Fora: loja virtual, blog, área de cliente, integrações sob medida, marca e
  logotipo, fotos e vídeos, conteúdo e SEO contínuos, gestão mensal, novas
  funcionalidades, suporte por tempo indeterminado.

Sugestões para o orçamento (não publicadas): até 7 seções no site, até 2 rodadas
de ajustes, até 3 grupos de anúncios na campanha, importação de uma planilha de
contatos, até 3 pessoas no treinamento. Unidades e serviços adicionais sobem o
valor dentro da faixa.

Decisão técnica em aberto: onde os sites dos clientes serão construídos. Site
estático em hospedagem gratuita mantém o custo do cliente perto de zero, mas
exige que ele saiba (ou aprenda) a editar. Um construtor visual facilita a
edição e costuma ter mensalidade. A página promete ensinar a "atualizar textos,
imagens e contatos", então a plataforma precisa permitir isso.

## 7. Política de privacidade: o que revisar

O rascunho descreve o site como ele está: sem formulário, sem cookies de
rastreamento, sem Analytics, sem pixel, fontes hospedadas no próprio site.
Os únicos fluxos de dados são os registros do provedor de hospedagem e a
conversa no WhatsApp.

Falta, e não está escrito na página:

- Razão social, CNPJ e endereço (também para o rodapé).
- E-mail de contato para assuntos de privacidade (hoje aponta para o WhatsApp).
- Nome do provedor de hospedagem.
- Prazo de retenção das conversas.
- Data da última atualização.
- Se instalar Google Analytics, Tag do Google Ads, pixel ou formulário, a
  política precisa ser reescrita e o site passa a precisar de aviso de cookies.
  Vale lembrar: anunciar esta própria página no Google Ads com medição de
  conversão exige essa mudança.
- Revisão por advogado é recomendável; o texto é um rascunho técnico.

## 8. CRM: recomendação (não publicada)

A página diz que a ferramenta é escolhida no diagnóstico e não cita nenhuma.

**Recomendação para o público e o orçamento: RD Station CRM, plano Free.**
É brasileiro, em português, com suporte e cobrança em reais, e o funil visual é
simples de ensinar em um encontro.

Valores encontrados em fontes de terceiros, **não confirmados na página oficial**
(o acesso ao site da RD Station estava bloqueado nesta sessão):

| Ferramenta | Custo citado | Limitações relevantes |
|---|---|---|
| RD Station CRM | Free para até 4 usuários; Basic citado a R$ 58 e Pro a R$ 85 por usuário/mês (artigo de dez/2025) | Plano gratuito com recursos restritos; automações e integrações mais completas ficam nos planos pagos |
| HubSpot CRM | Gratuito para até 2 usuários; Starter citado entre US$ 15 e US$ 20 por usuário/mês | Cobrança em dólar; automação só a partir do Starter; fica caro ao crescer |
| Kommo | Sem plano gratuito; plano Básico a US$ 20 por usuário/mês desde 1º/09/2026, segundo o blog da própria Kommo | Cobrança em dólar; faz sentido quando o WhatsApp é o centro do atendimento |
| Agendor | Tem plano gratuito | Limites e preços não confirmados |

Antes de recomendar a um cliente, confira os planos atuais em
rdstation.com/planos/crm, hubspot.com/pt-br/pricing e agendor.com.br/planos-precos.

Limitação que vale dizer ao cliente em qualquer opção: a integração oficial com
WhatsApp normalmente é paga e tem custo próprio. No escopo base, o registro do
contato no CRM é manual.

## 9. Sobre Jacque

A seção tem só o nome e a forma de trabalho. Não há formação, tempo de atuação,
certificações nem casos. Envie o que for real e confirmado para eu incluir.

## 10. Medição

Não há nenhuma ferramenta de medição instalada. Decida se quer medir cliques no
WhatsApp (ver item 7 sobre o impacto na política de privacidade).
