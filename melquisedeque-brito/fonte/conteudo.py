"""Textos das páginas de atuação, guias, Parnamirim e páginas de revisão.

Convenções usadas dentro do HTML destes textos:
  href="@/rota/"   link interno; o gerador converte para o caminho relativo certo
  href="@wa"       link do WhatsApp definido em config.json (data-wa = posição)
  Links https://   recebem target="_blank" automaticamente

Todo o conteúdo jurídico deve ser revisado pelo advogado antes da publicação
definitiva. As perguntas (ruminas) são entradas editoriais: não são falas de
clientes.
"""

# Fontes oficiais usadas em mais de uma página
CPP = ("Código de Processo Penal", "https://www.planalto.gov.br/ccivil_03/decreto-lei/del3689compilado.htm")
CP = ("Código Penal", "https://www.planalto.gov.br/ccivil_03/decreto-lei/del2848compilado.htm")
LEP = ("Lei de Execução Penal", "https://www.planalto.gov.br/ccivil_03/leis/l7210.htm")
CF = ("Constituição Federal, art. 5º", "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm")
CNJ_CUSTODIA = ("CNJ: perguntas frequentes sobre audiência de custódia", "https://www.cnj.jus.br/sistema-carcerario/audiencia-de-custodia/perguntas-frequentes/")
EOAB = ("Estatuto da Advocacia (Lei 8.906/1994), art. 7º", "https://www.planalto.gov.br/ccivil_03/leis/l8906.htm")
TJRN = ("TJRN: unidades judiciárias", "https://www.tjrn.jus.br/unidades/")
BCB = ("Banco Central: devolução de dinheiro com Pix", "https://www.bcb.gov.br/meubc/faqs/p/devolucao-de-dinheiro-com-pix")
CTB = ("Código de Trânsito Brasileiro", "https://www.planalto.gov.br/ccivil_03/leis/l9503compilado.htm")
LMP = ("Lei Maria da Penha (Lei 11.340/2006)", "https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2006/lei/l11340.htm")
CC = ("Código Civil", "https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm")
JEC = ("Lei dos Juizados Especiais (Lei 9.099/1995)", "https://www.planalto.gov.br/ccivil_03/leis/l9099.htm")


# ---------------------------------------------------------------------------
# Sete frentes de atuação criminal (rotas públicas)
# ---------------------------------------------------------------------------

FRENTES = [
    # 1 ---------------------------------------------------------------------
    {
        "rota": "atuacao/intimacao-e-inquerito/",
        "grupo": "investigacao",
        "nome": "Intimação e inquérito policial",
        "rumina": "Fui chamado à delegacia. Sou acusado?",
        "titulo_busca": "Intimação policial em Natal: fui chamado à delegacia | Melquisedeque Brito",
        "descricao": "Recebeu uma intimação da polícia em Natal ou região? Veja onde conferir órgão emissor, motivo, data e condição indicada, e como preparar a conversa sobre o depoimento.",
        "kicker": "Intimação e inquérito policial",
        "h1": "Fui chamado à delegacia. Sou acusado?",
        "lead": "Não necessariamente. A intimação policial convoca alguém para prestar informações, e isso acontece com testemunhas, vítimas e pessoas investigadas. O próprio documento costuma indicar em que condição você foi chamado, e é por ele que a conversa com o advogado começa.",
        "termo": "A investigação conduzida pela polícia se chama <strong>inquérito policial</strong>. Ele reúne informações. Quem decide se haverá acusação é o Ministério Público, e quem decide se a acusação segue adiante é o juiz.",
        "secoes": [
            {
                "id": "leia-o-documento",
                "titulo": "Onde conferir cada informação",
                "html": """
<p>Separe o papel ou a mensagem que você recebeu e procure quatro informações. Elas aparecem em lugares diferentes conforme a delegacia, mas costumam estar todas lá.</p>
<figure class="documento" aria-label="Exemplo ilustrativo de intimação policial com quatro pontos destacados">
  <div class="documento-folha" aria-hidden="true">
    <p class="doc-topo">Polícia Civil do Estado do Rio Grande do Norte</p>
    <p class="doc-marca" data-n="1">Delegacia de Polícia · Natal/RN</p>
    <p class="doc-titulo">Intimação</p>
    <p class="doc-linha" data-n="2">Ref.: Inquérito Policial nº 0000/2026</p>
    <p class="doc-linha curta"></p>
    <p class="doc-linha" data-n="3">Fica V. Sª intimado(a) a comparecer, <em>na condição de ________</em>,</p>
    <p class="doc-linha" data-n="4">no dia __/__/2026, às __h, nesta unidade policial,</p>
    <p class="doc-linha curta">a fim de prestar esclarecimentos.</p>
    <p class="doc-assinatura">Autoridade policial</p>
  </div>
  <ol class="documento-legenda">
    <li><strong>Órgão emissor.</strong> Qual delegacia ou unidade expediu o documento e onde ela fica.</li>
    <li><strong>Motivo ou referência.</strong> Número do inquérito, do boletim de ocorrência ou do procedimento. Às vezes há um resumo do fato.</li>
    <li><strong>Condição indicada.</strong> Palavras como <em>testemunha</em>, <em>vítima</em>, <em>investigado</em> ou <em>para prestar esclarecimentos</em>. Se o papel não disser, leve a dúvida para a conversa.</li>
    <li><strong>Data, hora e local.</strong> Quando e onde comparecer. Se houver impedimento, converse com o advogado antes da data.</li>
  </ol>
  <figcaption>Exemplo ilustrativo. O modelo muda de uma delegacia para outra.</figcaption>
</figure>
""",
            },
            {
                "id": "por-que-importa",
                "titulo": "Por que a condição muda a preparação",
                "html": """
<p>Testemunha, vítima e investigado têm posições diferentes no depoimento. A testemunha tem o dever de dizer a verdade sobre o que sabe. A pessoa investigada tem o direito de permanecer em silêncio e de ser acompanhada por advogado durante o depoimento.</p>
<p>O advogado também pode examinar o que já foi documentado no inquérito, nos limites que a lei e o Supremo Tribunal Federal estabelecem. Por isso a preparação começa pelo documento: ele mostra de onde partir.</p>
""",
            },
            {
                "id": "o-que-separar",
                "titulo": "O que separar para a primeira conversa",
                "html": """
<ul class="lista-marcada">
  <li>A intimação, original ou foto legível, frente e verso.</li>
  <li>Outros papéis ligados ao mesmo assunto, como boletim de ocorrência ou notificações anteriores.</li>
  <li>As datas de que você se lembra e os nomes das pessoas envolvidas.</li>
  <li>Suas perguntas, anotadas. Não é preciso descrever o caso na primeira mensagem.</li>
</ul>
""",
            },
            {
                "id": "citacao",
                "titulo": "Recebeu uma citação, e não uma intimação?",
                "html": """
<p>A citação vem do Judiciário e avisa que já existe um processo criminal. O passo seguinte é outro, e tem prazo. A página sobre <a href="@/atuacao/defesa-em-processo-criminal/">defesa em processo criminal</a> explica como ler esse documento.</p>
""",
            },
        ],
        "faq": [
            ("Posso ir sozinho à delegacia?",
             "<p>Pode. A presença de advogado não é obrigatória para comparecer. A pessoa investigada, porém, tem direito de ser acompanhada, e conversar antes ajuda a entender em que condição você foi chamado e como exercer esses direitos.</p>"),
            ("E se eu não puder comparecer na data?",
             "<p>A ausência sem justificativa pode ter consequências, que variam conforme a condição. Para testemunhas, a lei prevê medidas como a condução. Para pessoas investigadas, o Supremo Tribunal Federal entende que não cabe condução forçada para interrogatório. Em qualquer caso, avalie com o advogado, antes da data, como comunicar o impedimento.</p>"),
            ("A intimação chegou por WhatsApp. Ela vale?",
             "<p>Intimações por telefone ou aplicativo acontecem. Antes de responder ou enviar dados, confirme a origem ligando para o telefone oficial da delegacia, encontrado em um canal público e não na própria mensagem.</p>"),
        ],
        "fontes": [CPP, EOAB, CF],
        "seguinte": "atuacao/defesa-em-processo-criminal/",
        "servico": "Acompanhamento em intimação e inquérito policial",
    },
    # 2 ---------------------------------------------------------------------
    {
        "rota": "atuacao/prisao-em-flagrante/",
        "grupo": "investigacao",
        "nome": "Prisão em flagrante",
        "rumina": "Meu familiar foi preso. Ainda não sei em qual unidade ele está.",
        "titulo_busca": "Prisão em flagrante em Natal: o que a família pode fazer | Melquisedeque Brito",
        "descricao": "Um familiar foi preso em flagrante em Natal ou região? Organize as primeiras informações, diferencie notícia de terceiro de comunicação oficial e entenda o que vem depois.",
        "kicker": "Prisão em flagrante",
        "h1": "Meu familiar foi preso. Ainda não sei em qual unidade ele está.",
        "lead": "Comece pelo que você já sabe e por quem contou cada coisa. Nas primeiras horas, a notícia chega por vizinhos, amigos ou mensagens. A comunicação oficial vem da delegacia ou do próprio familiar, e é ela que diz onde a pessoa está. A Constituição determina que a prisão e o local sejam comunicados à família ou a uma pessoa indicada pelo preso.",
        "termo": "<strong>Flagrante</strong> é a prisão feita no momento do fato ou logo depois dele. Ela é formalizada em um <strong>auto de prisão em flagrante</strong>, lavrado na delegacia, e em até 24 horas a pessoa deve ser apresentada a um juiz na audiência de custódia.",
        "secoes": [
            {
                "id": "o-que-voce-tem",
                "titulo": "O que a família já tem em mãos",
                "html": """
<p>Antes de qualquer ligação, separe as informações pela origem. Isso evita deslocamentos desnecessários e ajuda a reconhecer pedidos suspeitos.</p>
<div class="origens">
  <section class="origem" aria-labelledby="origem-terceiro">
    <h3 id="origem-terceiro">Notícia de terceiro</h3>
    <p class="origem-nota">Ajuda a começar. Precisa ser confirmada.</p>
    <ul>
      <li>Mensagem de amigo, vizinho ou colega de trabalho</li>
      <li>Vídeo ou publicação em rede social</li>
      <li>Relato de quem estava no local</li>
      <li>Ligação de número desconhecido, sobretudo se pedir dinheiro</li>
    </ul>
  </section>
  <section class="origem origem-oficial" aria-labelledby="origem-oficial">
    <h3 id="origem-oficial">Comunicação oficial</h3>
    <p class="origem-nota">Diz onde a pessoa está e o que foi registrado.</p>
    <ul>
      <li>Contato feito pela delegacia ou pelo próprio familiar a partir dela</li>
      <li>Informação dada no balcão da unidade policial</li>
      <li>Documentos do caso: auto de prisão, nota de culpa, ata da audiência de custódia</li>
    </ul>
  </section>
</div>
""",
            },
            {
                "id": "ficha",
                "titulo": "Uma ficha para a primeira conversa",
                "html": """
<p>Anote o que já sabe, mesmo que esteja incompleto. Na conversa com o advogado, os espaços em branco mostram o que falta confirmar.</p>
<div class="ficha" role="list">
  <div class="ficha-linha" role="listitem"><span>Nome completo e data de nascimento</span></div>
  <div class="ficha-linha" role="listitem"><span>Cidade e bairro onde aconteceu</span></div>
  <div class="ficha-linha" role="listitem"><span>Dia e horário aproximado</span></div>
  <div class="ficha-linha" role="listitem"><span>Delegacia mencionada, se alguém citou</span></div>
  <div class="ficha-linha" role="listitem"><span>Quem deu a notícia, e quando</span></div>
  <div class="ficha-linha" role="listitem"><span>Se já houve contato oficial</span></div>
</div>
""",
            },
            {
                "id": "pedidos-de-dinheiro",
                "titulo": "Atenção a pedidos de dinheiro",
                "html": """
<p>Golpistas se aproveitam da aflição das famílias. Desconfie de quem liga pedindo depósito para “liberar” alguém. Quando há fiança, ela é fixada pela autoridade e recolhida por guia oficial, nunca paga a intermediários.</p>
""",
            },
            {
                "id": "depois-da-delegacia",
                "titulo": "Depois da delegacia vem a audiência de custódia",
                "html": """
<p>Em até 24 horas, a pessoa presa é apresentada a um juiz. Nessa audiência se decide se ela continua presa ou responde em liberdade, e não se é culpada. A página seguinte explica o que acontece antes, durante e depois do ato.</p>
""",
            },
        ],
        "faq": [
            ("O que é fiança?",
             "<p>É um valor fixado para que a pessoa responda em liberdade em certos casos. O delegado pode arbitrá-la quando a pena máxima do crime não passa de quatro anos. Nos demais casos, a decisão é do juiz. O pagamento é feito por guia oficial.</p>"),
            ("Qual é a diferença entre flagrante e prisão preventiva?",
             "<p>O flagrante acontece no momento do fato. A preventiva é decretada por um juiz, em decisão fundamentada. Na audiência de custódia, o juiz pode, entre outras possibilidades, converter o flagrante em preventiva ou conceder liberdade provisória.</p>"),
            ("A família pode visitar logo depois da prisão?",
             "<p>Nas primeiras horas, a pessoa costuma passar pela delegacia e pela audiência de custódia. Se a prisão for mantida, as visitas seguem as regras da unidade onde ela ficar, que devem ser consultadas no canal oficial da administração penitenciária.</p>"),
        ],
        "fontes": [CPP, CF],
        "seguinte": "atuacao/audiencia-de-custodia/",
        "servico": "Acompanhamento em prisão em flagrante",
    },
    # 3 ---------------------------------------------------------------------
    {
        "rota": "atuacao/audiencia-de-custodia/",
        "grupo": "investigacao",
        "nome": "Audiência de custódia",
        "rumina": "A audiência de hoje já decide se ele é culpado?",
        "titulo_busca": "Audiência de custódia em Natal: o que o juiz decide | Melquisedeque Brito",
        "descricao": "Audiência de custódia em Natal e região: o que o juiz examina, o que não está em julgamento e qual documento mostra a decisão. Leitura em três momentos: antes, durante e depois.",
        "kicker": "Audiência de custódia",
        "h1": "A audiência de hoje já decide se ele é culpado?",
        "lead": "Não. A audiência de custódia não julga se a pessoa cometeu o crime. Nela, o juiz verifica como a prisão foi feita, pergunta se houve maus-tratos e decide se a pessoa continua presa ou responde em liberdade enquanto o caso segue.",
        "termo": "O ato está previsto no <strong>art. 310 do Código de Processo Penal</strong>: em até 24 horas depois da prisão, a pessoa é apresentada a um juiz, com a participação do Ministério Público e da defesa.",
        "secoes": [
            {
                "id": "sequencia",
                "titulo": "Antes, durante e depois",
                "html": """
<ol class="etapas">
  <li class="etapa">
    <p class="etapa-nome">Antes</p>
    <div class="etapa-texto">
      <p>A prisão é registrada na delegacia e o auto segue para o Judiciário. A pessoa é levada à audiência, em geral no mesmo dia ou no seguinte, e pode conversar reservadamente com a defesa antes do ato.</p>
      <p>A família pode reunir documentos que mostrem endereço, trabalho e vínculos. Eles costumam ser úteis para a defesa.</p>
    </div>
  </li>
  <li class="etapa">
    <p class="etapa-nome">Durante</p>
    <div class="etapa-texto">
      <p>O juiz ouve a pessoa sobre as circunstâncias da prisão e sobre o tratamento recebido. Perguntas sobre os fatos que levaram à prisão ficam para outro momento. O Ministério Público e a defesa se manifestam.</p>
    </div>
  </li>
  <li class="etapa">
    <p class="etapa-nome">Depois</p>
    <div class="etapa-texto">
      <p>O juiz decide entre três caminhos:</p>
      <ul class="lista-marcada">
        <li>relaxar a prisão, se ela foi ilegal;</li>
        <li>conceder liberdade provisória, com ou sem medidas cautelares, como comparecimento periódico ou monitoramento;</li>
        <li>converter o flagrante em prisão preventiva.</li>
      </ul>
    </div>
  </li>
</ol>
""",
            },
            {
                "id": "qual-documento",
                "titulo": "O documento que mostra a decisão",
                "html": """
<p>A decisão fica registrada na <strong>ata</strong> ou no <strong>termo da audiência</strong>. Peça à defesa uma cópia e procure nela:</p>
<ul class="lista-marcada">
  <li>o resultado, ou seja, liberdade provisória, preventiva ou relaxamento;</li>
  <li>as medidas cautelares impostas, se houver, e como cumpri-las;</li>
  <li>o número do processo e o juízo que acompanhará o caso daqui em diante.</li>
</ul>
""",
            },
            {
                "id": "o-que-nao-decide",
                "titulo": "Culpa e inocência ficam para o processo",
                "html": """
<p>Se o Ministério Público oferecer denúncia e o juiz a receber, começa o processo criminal. É nele que se produzem as provas e se discute o fato. Veja como funciona a <a href="@/atuacao/defesa-em-processo-criminal/">defesa em processo criminal</a>.</p>
""",
            },
        ],
        "faq": [
            ("Se ele for solto, o caso acabou?",
             "<p>Não. A liberdade provisória permite responder em liberdade, em geral com condições. A investigação e um eventual processo continuam.</p>"),
            ("E se houver relato de agressão na prisão?",
             "<p>A audiência é o momento previsto para isso. O juiz deve perguntar sobre o tratamento recebido e pode determinar exame e apuração.</p>"),
            ("A família pode assistir à audiência?",
             "<p>Depende da organização de cada unidade judiciária. Muitas audiências acontecem em sala reservada ou por videoconferência. Pergunte à defesa como acompanhar.</p>"),
        ],
        "fontes": [CNJ_CUSTODIA, CPP],
        "seguinte": "atuacao/direitos-da-pessoa-presa/",
        "servico": "Atuação em audiência de custódia",
    },
    # 4 ---------------------------------------------------------------------
    {
        "rota": "atuacao/defesa-em-processo-criminal/",
        "grupo": "processo",
        "nome": "Defesa em processo criminal",
        "rumina": "Recebi uma citação. Qual é o próximo passo?",
        "titulo_busca": "Defesa em processo criminal em Natal: recebi uma citação | Melquisedeque Brito",
        "descricao": "Recebeu uma citação em processo criminal em Natal ou região? Entenda a diferença entre citação e intimação, onde ler juízo, número e datas, e o que levar à primeira conversa.",
        "kicker": "Defesa em processo criminal",
        "h1": "Recebi uma citação. Qual é o próximo passo?",
        "lead": "O próximo passo é a resposta à acusação, uma manifestação escrita que, em regra, deve ser apresentada em 10 dias contados da citação. A citação informa que o juiz recebeu uma denúncia e que agora existe um processo criminal. Leve o documento à conversa com o advogado logo, porque o prazo já está correndo.",
        "termo": "<strong>Citação</strong> e <strong>intimação</strong> têm funções diferentes. A citação chama a pessoa para se defender em um processo. A intimação comunica um ato ou convoca para algo determinado, como uma audiência.",
        "secoes": [
            {
                "id": "citacao-ou-intimacao",
                "titulo": "Citação ou intimação?",
                "html": """
<table class="comparativo">
  <caption class="sr-only">Diferenças entre citação e intimação</caption>
  <thead><tr><th scope="col"></th><th scope="col">Citação</th><th scope="col">Intimação</th></tr></thead>
  <tbody>
    <tr><th scope="row">O que faz</th><td>Chama a pessoa para se defender</td><td>Comunica um ato ou convoca para algo</td></tr>
    <tr><th scope="row">Quando aparece</th><td>No início do processo, depois que a denúncia é recebida</td><td>Ao longo da investigação e do processo</td></tr>
    <tr><th scope="row">Quem envia</th><td>O juízo, em regra por oficial de justiça</td><td>A delegacia ou o juízo</td></tr>
    <tr><th scope="row">O que vem a seguir</th><td>Resposta à acusação, com prazo</td><td>Depende do que foi comunicado</td></tr>
  </tbody>
</table>
""",
            },
            {
                "id": "onde-ler",
                "titulo": "Onde ler o juízo, o número e as datas",
                "html": """
<p>O cabeçalho do mandado indica a <strong>comarca</strong> e a <strong>vara</strong>, que formam o juízo responsável. O número do processo segue um padrão nacional, e cada parte dele significa alguma coisa:</p>
<figure class="numero-processo">
  <p class="np-numero" aria-label="0801234-56.2026.8.20.0001">
    <span class="np-parte"><span class="np-digitos">0801234</span><span class="np-rotulo">sequência</span></span><span class="np-sep">-</span><span class="np-parte"><span class="np-digitos">56</span><span class="np-rotulo">dígito</span></span><span class="np-sep">.</span><span class="np-parte"><span class="np-digitos">2026</span><span class="np-rotulo">ano</span></span><span class="np-sep">.</span><span class="np-parte np-destaque"><span class="np-digitos">8</span><span class="np-rotulo">estadual</span></span><span class="np-sep">.</span><span class="np-parte np-destaque"><span class="np-digitos">20</span><span class="np-rotulo">TJRN</span></span><span class="np-sep">.</span><span class="np-parte"><span class="np-digitos">0001</span><span class="np-rotulo">origem</span></span>
  </p>
  <figcaption>Número fictício. O <strong>8</strong> indica a Justiça estadual e o <strong>20</strong>, o Tribunal de Justiça do RN. Nos processos do TJRN, o trecho <strong>8.20</strong> se repete; os quatro últimos dígitos indicam a unidade de origem.</figcaption>
</figure>
<p>Anote também a <strong>data em que você recebeu a citação</strong>. É a partir dela que se conta o prazo, e não da data impressa no documento.</p>
""",
            },
            {
                "id": "perguntas",
                "titulo": "Perguntas para levar à primeira conversa",
                "html": """
<ul class="perguntas">
  <li>Qual é exatamente a acusação descrita na denúncia?</li>
  <li>Até que dia a resposta precisa ser apresentada?</li>
  <li>Já existe alguma audiência marcada?</li>
  <li>Há alguma condição que eu precise cumprir enquanto o processo corre?</li>
  <li>Que documentos ou testemunhas podem ser úteis para a defesa?</li>
</ul>
""",
            },
        ],
        "faq": [
            ("A citação quer dizer que fui condenado?",
             "<p>Não. Ela abre a fase em que a defesa atua. A condenação só pode vir de uma sentença, depois da produção das provas, e só se torna definitiva quando não cabe mais recurso.</p>"),
            ("Nunca fui ouvido na delegacia. Mesmo assim pode haver processo?",
             "<p>Sim. A pessoa investigada nem sempre é ouvida no inquérito. O processo pode começar assim mesmo, e é nele que a defesa apresenta sua versão e suas provas.</p>"),
            ("E se a resposta não for apresentada no prazo?",
             "<p>A lei determina que o juiz nomeie um defensor para apresentá-la. A pessoa pode constituir um advogado de sua escolha a qualquer momento.</p>"),
        ],
        "fontes": [("Código de Processo Penal, arts. 396 e 396-A", CPP[1])],
        "seguinte": "orientacoes/reu-primario-e-reincidencia/",
        "servico": "Defesa em processo criminal",
    },
    # 5 ---------------------------------------------------------------------
    {
        "rota": "atuacao/execucao-penal/",
        "grupo": "pena",
        "nome": "Execução penal",
        "rumina": "Apareceu uma movimentação. O que aconteceu no processo?",
        "titulo_busca": "Advogado de execução penal em Natal: entender movimentações | Melquisedeque Brito",
        "descricao": "Execução penal em Natal e no RN: como identificar o processo de execução e distinguir pedido, andamento e decisão nas movimentações.",
        "kicker": "Execução penal",
        "h1": "Apareceu uma movimentação. O que aconteceu no processo?",
        "lead": "Primeiro, confirme se você está olhando o processo certo. Depois da condenação, o cumprimento da pena corre em um processo próprio, o de execução, com número diferente do processo que julgou o caso. Nele, cada movimentação é um pedido, um andamento ou uma decisão. Somente a decisão resolve o que foi pedido.",
        "termo": "<strong>Execução penal</strong> é a fase que acompanha o cumprimento da pena. Ela segue a Lei de Execução Penal (Lei 7.210/1984) e é conduzida pelo juízo da execução.",
        "secoes": [
            {
                "id": "identificar",
                "titulo": "Como reconhecer o processo de execução",
                "html": """
<p>O processo de execução começa com a <strong>guia de execução</strong>, expedida depois da condenação. Ele tem número próprio e reúne a pena, os cálculos, as decisões sobre benefícios e os pedidos da defesa. Em boa parte dos tribunais brasileiros, ele tramita no SEEU, o sistema eletrônico de execução mantido pelo CNJ.</p>
<p>Se a movimentação que você viu está no processo que julgou o caso, ela provavelmente trata de outra coisa, como um recurso ou o arquivamento.</p>
""",
            },
            {
                "id": "legenda",
                "titulo": "Pedido, andamento ou decisão",
                "html": """
<figure class="movimentos">
  <ol class="movimentos-lista">
    <li><span class="mov-data">03/03</span><span class="mov-texto">Juntada de petição</span><span class="mov-tipo tipo-pedido">Pedido</span></li>
    <li><span class="mov-data">04/03</span><span class="mov-texto">Vista ao Ministério Público</span><span class="mov-tipo tipo-andamento">Andamento</span></li>
    <li><span class="mov-data">17/03</span><span class="mov-texto">Juntada de manifestação</span><span class="mov-tipo tipo-andamento">Andamento</span></li>
    <li><span class="mov-data">18/03</span><span class="mov-texto">Conclusos para decisão</span><span class="mov-tipo tipo-andamento">Andamento</span></li>
    <li><span class="mov-data">02/04</span><span class="mov-texto">Decisão</span><span class="mov-tipo tipo-decisao">Decisão</span></li>
  </ol>
  <figcaption>Sequência ilustrativa. Os nomes exatos variam conforme o sistema.</figcaption>
</figure>
<dl class="definicoes">
  <dt>Pedido</dt><dd>Alguém pediu algo, como a defesa, o Ministério Público ou a unidade prisional. Ainda não há resposta.</dd>
  <dt>Andamento</dt><dd>O processo passou de um setor para outro, recebeu um documento ou foi enviado ao juiz. <em>Conclusos para decisão</em> quer dizer que o juiz vai decidir, e não que já decidiu.</dd>
  <dt>Decisão</dt><dd>Resolve o que foi pedido. O resultado está na parte final do texto, onde aparecem palavras como <em>defiro</em>, <em>indefiro</em> ou <em>determino</em>. Um <em>despacho</em> apenas ordena o próximo passo.</dd>
</dl>
""",
            },
            {
                "id": "mudanca-de-regime",
                "titulo": "A dúvida é sobre mudança de regime?",
                "html": """
<p>A página sobre <a href="@/atuacao/progressao-de-regime/">progressão de regime</a> mostra quais registros a defesa examina e onde encontrar a decisão mais recente.</p>
""",
            },
        ],
        "faq": [
            ("“Conclusos para decisão” quer dizer que já foi decidido?",
             "<p>Não. Quer dizer que o processo foi enviado ao juiz para decidir. A decisão aparece em uma movimentação própria.</p>"),
            ("Por que o processo de execução tem outro número?",
             "<p>Porque é outro processo. Ele começa com a guia de execução, depois da condenação, e reúne tudo o que diz respeito ao cumprimento da pena.</p>"),
            ("A família pode acompanhar o processo?",
             "<p>As partes e os advogados habilitados têm acesso completo. Em geral, a família acompanha por meio da defesa, que explica o que cada movimentação significa.</p>"),
        ],
        "fontes": [LEP],
        "seguinte": "atuacao/progressao-de-regime/",
        "servico": "Acompanhamento em execução penal",
    },
    # 6 ---------------------------------------------------------------------
    {
        "rota": "atuacao/progressao-de-regime/",
        "grupo": "pena",
        "nome": "Progressão de regime",
        "rumina": "O pedido de mudança de regime já foi decidido?",
        "titulo_busca": "Progressão de regime no RN: o pedido já foi decidido? | Melquisedeque Brito",
        "descricao": "Progressão de regime no Rio Grande do Norte: quais registros a defesa examina, onde encontrar a decisão mais recente e por que cada cálculo exige análise do processo.",
        "kicker": "Progressão de regime",
        "h1": "O pedido de mudança de regime já foi decidido?",
        "lead": "A resposta está na decisão mais recente do processo de execução, e não no pedido nem nas movimentações de andamento. Enquanto não houver uma decisão sobre a progressão, o pedido segue em análise. Para saber em que ponto ele está, a defesa examina os registros do processo.",
        "termo": "<strong>Progressão de regime</strong> é a passagem para um regime menos rigoroso, do fechado para o semiaberto ou do semiaberto para o aberto. O art. 112 da Lei de Execução Penal combina um tempo mínimo de pena cumprida, que varia conforme o crime e a reincidência, com a boa conduta carcerária.",
        "secoes": [
            {
                "id": "registros",
                "titulo": "Os registros que a defesa examina",
                "html": """
<table class="registros">
  <caption class="sr-only">Registros do processo de execução e o que cada um mostra</caption>
  <thead><tr><th scope="col">Registro</th><th scope="col">O que mostra</th></tr></thead>
  <tbody>
    <tr><th scope="row">Guia de execução</th><td>Os dados da condenação: pena, regime inicial e datas.</td></tr>
    <tr><th scope="row">Cálculo de pena</th><td>Quanto já foi cumprido e as datas projetadas para cada requisito de tempo.</td></tr>
    <tr><th scope="row">Atestado de conduta</th><td>A informação da unidade prisional sobre o comportamento.</td></tr>
    <tr><th scope="row">Faltas e remição</th><td>Eventos que alteram datas. Uma falta grave reinicia a contagem para a progressão, e trabalho ou estudo podem abater dias de pena.</td></tr>
    <tr><th scope="row">Manifestações e decisão</th><td>O Ministério Público e a defesa se manifestam, e o juiz decide.</td></tr>
  </tbody>
</table>
""",
            },
            {
                "id": "decisao-recente",
                "titulo": "Onde está a decisão mais recente",
                "html": """
<ol class="passos">
  <li>Na lista de movimentações do processo de execução, procure a última entrada do tipo <em>decisão</em>.</li>
  <li>Abra o texto e confira se ele trata da progressão. Uma decisão sobre outro assunto, como remição, não responde a esse pedido.</li>
  <li>Leia a parte final, onde estão as palavras <em>defiro</em> ou <em>indefiro</em>.</li>
</ol>
<p>Mesmo depois do deferimento, a mudança efetiva depende de providências administrativas, como a transferência.</p>
""",
            },
            {
                "id": "requisitos",
                "titulo": "Requisitos, de modo geral",
                "html": """
<p>A lei exige um percentual mínimo de pena cumprida, que muda conforme o tipo de crime, o uso de violência e a reincidência, além de boa conduta carcerária. Datas individuais mudam com detração, remição, faltas e unificação de penas. Por isso cada cálculo depende da análise do processo, e esta página não substitui essa conta.</p>
""",
            },
        ],
        "faq": [
            ("A data que aparece no cálculo garante a progressão?",
             "<p>Não. Ela indica quando o requisito de tempo pode ser atingido. A progressão depende também dos demais requisitos e de decisão judicial.</p>"),
            ("Quem faz o pedido?",
             "<p>A Lei de Execução Penal permite que o procedimento comece por iniciativa do juiz, a pedido do Ministério Público, do próprio interessado ou da defesa. Acompanhar as datas e pedir a análise no momento certo faz parte do trabalho da defesa.</p>"),
        ],
        "fontes": [("Lei de Execução Penal, arts. 112 e 195", LEP[1])],
        "seguinte": "atuacao/direitos-da-pessoa-presa/",
        "servico": "Pedidos de progressão de regime",
    },
    # 7 ---------------------------------------------------------------------
    {
        "rota": "atuacao/direitos-da-pessoa-presa/",
        "grupo": "pena",
        "nome": "Direitos da pessoa presa e orientação à família",
        "rumina": "Minha dúvida é sobre a unidade prisional ou sobre o processo?",
        "titulo_busca": "Orientação à família de pessoa presa no RN | Melquisedeque Brito",
        "descricao": "Orientação à família de pessoa presa no RN: como separar uma questão administrativa da unidade prisional de uma questão judicial da execução, e por onde conferir cada uma.",
        "kicker": "Direitos da pessoa presa e orientação à família",
        "h1": "Minha dúvida é sobre a unidade prisional ou sobre o processo?",
        "lead": "Separe as duas coisas primeiro. Questões do dia a dia na unidade, como visita, entrega de itens e atendimento de saúde, são administrativas e passam pela direção da unidade e pela administração penitenciária. Questões sobre a pena, como regime, remição e cálculo, são judiciais e passam pelo juízo da execução.",
        "termo": "Os <strong>direitos da pessoa presa</strong> estão listados principalmente nos arts. 40 e 41 da Lei de Execução Penal. Entre eles estão assistência material, à saúde e jurídica e a visita do cônjuge, da companheira, de parentes e de amigos.",
        "secoes": [
            {
                "id": "duas-portas",
                "titulo": "Duas portas diferentes",
                "html": """
<div class="portas">
  <section class="porta" aria-labelledby="porta-adm">
    <p class="porta-tipo">Administrativa</p>
    <h3 id="porta-adm">A visita foi suspensa e ninguém explicou o motivo.</h3>
    <p>Assunto da rotina da unidade. Confira primeiro com a direção da unidade e com a administração penitenciária do estado, pelos canais oficiais.</p>
  </section>
  <section class="porta" aria-labelledby="porta-jud">
    <p class="porta-tipo">Judicial</p>
    <h3 id="porta-jud">Os dias de estudo ainda não foram descontados da pena.</h3>
    <p>Assunto do processo de execução. Confira com a defesa, no processo, e o pedido é dirigido ao juízo da execução.</p>
  </section>
</div>
<p>As duas portas às vezes se encontram. Uma falta disciplinar é apurada pela unidade, mas os efeitos dela na pena são decididos pelo juiz.</p>
""",
            },
            {
                "id": "visitas",
                "titulo": "Regras de visita",
                "html": """
<p>Dias, cadastro e itens permitidos mudam de uma unidade para outra e de um período para outro. Consulte o canal oficial atual da administração penitenciária do Rio Grande do Norte antes de se deslocar. Este site não reproduz essas regras, para não divulgar uma versão desatualizada.</p>
""",
            },
            {
                "id": "organizar",
                "titulo": "O que a família pode organizar",
                "html": """
<ul class="lista-marcada">
  <li>Nome completo da pessoa, unidade onde está e data de entrada.</li>
  <li>Número do processo de execução, que é diferente do número do processo que julgou o caso.</li>
  <li>Um registro simples dos contatos feitos, com data, órgão e resposta recebida.</li>
</ul>
""",
            },
        ],
        "faq": [
            ("Quem fiscaliza as condições da unidade?",
             "<p>A Lei de Execução Penal atribui essa função a vários órgãos da execução, entre eles o juiz da execução, o Ministério Público, a Defensoria Pública e o Conselho da Comunidade.</p>"),
            ("A família pode fazer um pedido diretamente ao juiz?",
             "<p>Pedidos no processo de execução normalmente são apresentados pela defesa, seja ela advogado ou Defensoria Pública. A família ajuda reunindo documentos e informações.</p>"),
        ],
        "fontes": [("Lei de Execução Penal, arts. 40, 41 e 61", LEP[1])],
        "seguinte": "atuacao/execucao-penal/",
        "servico": "Orientação sobre direitos da pessoa presa",
    },
]


GRUPOS = [
    ("investigacao", "Investigação e prisão"),
    ("processo", "Processo criminal"),
    ("pena", "Cumprimento da pena"),
]


# ---------------------------------------------------------------------------
# Guias do caderno criminal (URLs preservadas)
# ---------------------------------------------------------------------------

GUIAS = [
    {
        "rota": "orientacoes/pix-recebido-por-engano/",
        "assunto": "Dinheiro e transferências",
        "nome": "Pix recebido por engano",
        "rumina": "Recebi um Pix por engano. Posso ficar com o dinheiro?",
        "titulo_busca": "Pix recebido por engano: ficar com o dinheiro é crime? | Melquisedeque Brito",
        "descricao": "Receber um Pix por engano não é crime. Ficar com o valor, sabendo que não é seu, pode ser. Veja a diferença, como devolver pelo aplicativo e como evitar o golpe do Pix errado.",
        "h1": "Recebi um Pix por engano. Posso ficar com o dinheiro?",
        "lead": "Não. Receber não é crime, porque o erro foi de quem enviou. O problema começa quando a pessoa percebe que o dinheiro não é dela e decide ficar com ele. O Código Penal trata essa conduta como <strong>apropriação de coisa havida por erro</strong> (art. 169), com pena de detenção de um mês a um ano, ou multa.",
        "secoes": [
            {
                "id": "receber-ou-apropriar",
                "titulo": "Receber é uma coisa, apropriar-se é outra",
                "html": """
<div class="contraponto">
  <div>
    <p class="contraponto-rotulo">Receber</p>
    <p>O dinheiro entrou na sua conta sem que você fizesse nada. Não há crime.</p>
  </div>
  <div>
    <p class="contraponto-rotulo">Apropriar-se</p>
    <p>Você sabe que o valor não é seu e gasta, transfere ou se recusa a devolver. Aqui pode haver crime.</p>
  </div>
</div>
""",
            },
            {
                "id": "como-devolver",
                "titulo": "Como devolver",
                "html": """
<p>Use a função de devolução do próprio aplicativo, a partir da transação recebida. Assim, o dinheiro volta para a mesma conta de origem, sem que você precise saber de quem ela é. Guarde o comprovante.</p>
""",
            },
            {
                "id": "golpe",
                "titulo": "Cuidado com o golpe do Pix errado",
                "html": """
<p>Um golpe comum funciona assim: alguém faz um Pix para você e, em seguida, liga pedindo que o valor seja enviado para <em>outra</em> chave. Não transfira para uma chave diferente. Devolva apenas pela própria transação e, se tiver dúvida, fale com o seu banco pelos canais oficiais.</p>
""",
            },
            {
                "id": "se-ja-usou",
                "titulo": "Se o valor já foi usado",
                "html": """
<p>Procure devolver assim que possível e guarde os comprovantes. O Código Penal considera a reparação feita de forma voluntária antes do recebimento da denúncia (art. 16). Se você já recebeu uma intimação por esse fato, veja <a href="@/atuacao/intimacao-e-inquerito/">como ler a intimação</a>.</p>
""",
            },
        ],
        "faq": [
            ("E se eu não souber de quem é o dinheiro?",
             "<p>A devolução pela própria transação resolve isso, porque o aplicativo já conhece a conta de origem.</p>"),
            ("O banco pode retirar o valor da minha conta?",
             "<p>Quando há suspeita de fraude, existe o Mecanismo Especial de Devolução, que permite bloquear e devolver valores. Em um engano comum, o caminho é a devolução feita por quem recebeu.</p>"),
        ],
        "fontes": [("Código Penal, arts. 16 e 169", CP[1]), BCB],
        "seguinte": "atuacao/intimacao-e-inquerito/",
    },
    {
        "rota": "orientacoes/reu-primario-e-reincidencia/",
        "assunto": "Antecedentes",
        "nome": "Réu primário e reincidência",
        "rumina": "Ser investigado ou processado tira a primariedade?",
        "titulo_busca": "Réu primário e reincidência: o que muda e quando | Melquisedeque Brito",
        "descricao": "Ser investigado ou processado não tira a primariedade. Entenda quando há reincidência, o que é o prazo de cinco anos e a diferença entre primariedade e antecedentes.",
        "h1": "Ser investigado ou processado tira a primariedade?",
        "lead": "Não. A pessoa deixa de ser primária quando se torna <strong>reincidente</strong>, ou seja, quando comete um novo crime depois de já ter sido condenada definitivamente por outro. Inquérito em andamento, processo sem sentença ou condenação ainda sujeita a recurso não tiram essa condição.",
        "secoes": [
            {
                "id": "linha-do-tempo",
                "titulo": "Em que momento a situação muda",
                "html": """
<ol class="linha-tempo">
  <li><span class="lt-fase">Investigação</span><span class="lt-efeito">Continua primário</span></li>
  <li><span class="lt-fase">Processo em curso</span><span class="lt-efeito">Continua primário</span></li>
  <li><span class="lt-fase">Sentença com recurso pendente</span><span class="lt-efeito">Continua primário</span></li>
  <li class="lt-marco"><span class="lt-fase">Condenação definitiva</span><span class="lt-efeito">Daqui em diante, um novo crime gera reincidência</span></li>
  <li><span class="lt-fase">Cinco anos após cumprir ou extinguir a pena</span><span class="lt-efeito">A condenação deixa de gerar reincidência</span></li>
</ol>
""",
            },
            {
                "id": "antecedentes",
                "titulo": "Primariedade e antecedentes não são a mesma coisa",
                "html": """
<p>Mesmo depois dos cinco anos, uma condenação anterior pode ser considerada como mau antecedente na fixação da pena, segundo entendimento do Supremo Tribunal Federal. Já inquéritos e processos em andamento não podem ser usados para aumentar a pena-base, conforme a Súmula 444 do Superior Tribunal de Justiça.</p>
""",
            },
            {
                "id": "por-que-importa",
                "titulo": "Por que essa condição importa",
                "html": """
<p>Ela pesa em vários pontos: na fixação da pena, no regime inicial, na substituição por penas alternativas e nos acordos previstos em lei. Por isso convém saber exatamente o que consta antes de qualquer decisão no processo.</p>
""",
            },
        ],
        "faq": [
            ("Fiz transação penal ou acordo de não persecução. Perco a primariedade?",
             "<p>Não. A transação penal do Juizado Especial não gera reincidência, e o acordo de não persecução penal não consta da certidão de antecedentes. Ambos ficam registrados apenas para impedir o mesmo benefício dentro de cinco anos.</p>"),
            ("A certidão de antecedentes saiu positiva. Isso é reincidência?",
             "<p>Não necessariamente. A certidão pode mostrar processos em andamento, que não geram reincidência. É preciso ler o que consta em cada registro.</p>"),
        ],
        "fontes": [("Código Penal, arts. 63 e 64", CP[1]), ("Lei 9.099/1995, art. 76, § 4º", JEC[1])],
        "seguinte": "atuacao/defesa-em-processo-criminal/",
    },
]


# ---------------------------------------------------------------------------
# Atendimento em Parnamirim
# ---------------------------------------------------------------------------

PARNAMIRIM = {
    "rota": "atendimento/parnamirim/",
    "nome": "Atendimento em Parnamirim",
    "rumina": "Moro em Parnamirim e o documento veio de Natal. Aonde vou?",
    "titulo_busca": "Mora em Parnamirim e o documento criminal veio de Natal? | Melquisedeque Brito",
    "descricao": "Mora em Parnamirim e recebeu uma intimação ou citação de Natal? Saiba como identificar no documento a comarca e a unidade, e onde conferir o endereço oficial no TJRN.",
    "kicker": "Atendimento em Parnamirim",
    "h1": "Moro em Parnamirim e o documento veio de Natal. Aonde vou?",
    "lead": "Ao endereço que o documento indica, que nem sempre fica na cidade onde você mora. Em matéria criminal, o caso costuma correr na comarca do lugar onde o fato aconteceu. Por isso quem mora em Parnamirim pode ser chamado por uma delegacia ou por uma vara de Natal, e o contrário também acontece.",
    "secoes": [
        {
            "id": "cabecalho",
            "titulo": "O cabeçalho diz quem chamou",
            "html": """
<figure class="cabecalho-doc" aria-label="Exemplo ilustrativo de cabeçalho de documento judicial">
  <div class="cabecalho-folha" aria-hidden="true">
    <p class="cd-linha cd-orgao">Poder Judiciário do Estado do Rio Grande do Norte</p>
    <p class="cd-linha cd-comarca"><mark>Comarca de Natal</mark></p>
    <p class="cd-linha cd-unidade"><mark>__ª Vara Criminal</mark></p>
    <p class="cd-linha cd-processo">Processo nº 0000000-00.2026.8.20.0001</p>
  </div>
  <dl class="cabecalho-legenda">
    <dt>Comarca</dt><dd>A cidade-sede do juízo. É ela que diz onde o caso tramita.</dd>
    <dt>Unidade</dt><dd>A vara ou o juizado responsável. O endereço está no diretório oficial do TJRN.</dd>
    <dt>Se o papel veio da polícia</dt><dd>O cabeçalho mostra a Polícia Civil e a delegacia, com endereço próprio.</dd>
  </dl>
  <figcaption>Exemplo ilustrativo.</figcaption>
</figure>
""",
        },
        {
            "id": "conferir",
            "titulo": "Três conferências antes de sair de casa",
            "html": """
<ol class="passos">
  <li>Veja quem expediu o documento: a polícia ou o Judiciário.</li>
  <li>Leia a comarca e a unidade, ou o nome da delegacia.</li>
  <li>Confira o endereço e o contato no <a href="https://www.tjrn.jus.br/unidades/">diretório de unidades do TJRN</a> ou no canal oficial da Polícia Civil. Algumas audiências acontecem por videoconferência, e o próprio documento informa o formato.</li>
</ol>
""",
        },
        {
            "id": "proxima-leitura",
            "titulo": "Que documento você recebeu?",
            "html": """
<ul class="atalhos">
  <li><a href="@/atuacao/intimacao-e-inquerito/"><span>Uma intimação da delegacia</span><span class="atalho-nome">Intimação e inquérito policial</span></a></li>
  <li><a href="@/atuacao/defesa-em-processo-criminal/"><span>Uma citação da Justiça</span><span class="atalho-nome">Defesa em processo criminal</span></a></li>
  <li><a href="@/atuacao/prisao-em-flagrante/"><span>A notícia de que um familiar foi preso</span><span class="atalho-nome">Prisão em flagrante</span></a></li>
</ul>
""",
        },
    ],
    "faq": [
        ("Preciso de um advogado de Parnamirim para um caso que corre em Natal?",
         "<p>Não necessariamente. O advogado inscrito na OAB do Rio Grande do Norte atua nas comarcas do estado. O que importa é acompanhar o caso onde ele tramita.</p>"),
        ("O fato aconteceu em Parnamirim, mas fui chamado em Natal. Pode?",
         "<p>Pode, por exemplo quando a investigação está a cargo de uma delegacia especializada sediada em Natal. O documento indica o órgão responsável. Leve-o à conversa para conferir.</p>"),
    ],
    "fontes": [TJRN, ("Código de Processo Penal, art. 70", CPP[1])],
    "seguinte": "atuacao/",
}


# ---------------------------------------------------------------------------
# Páginas adicionais em revisão (fora do ZIP público)
# ---------------------------------------------------------------------------

REVISAO = [
    {
        "rota": "atuacao/crimes-de-transito/",
        "nome": "Crimes de trânsito",
        "rumina": "Fui abordado por suspeita de embriaguez ao volante. O que recebi?",
        "titulo_busca": "Embriaguez ao volante em Natal: o que você recebeu | Melquisedeque Brito",
        "descricao": "Abordagem por suspeita de embriaguez ao volante: como diferenciar o auto de infração, que é administrativo, do registro criminal.",
        "kicker": "Crimes de trânsito",
        "h1": "Fui abordado por suspeita de embriaguez ao volante. O que recebi?",
        "lead": "Provavelmente, papéis de duas frentes diferentes. O <strong>auto de infração</strong> trata da parte administrativa, que inclui multa, suspensão do direito de dirigir e recolhimento da habilitação, e é discutido perante o órgão de trânsito. Se a autoridade entendeu que houve crime, existe também um <strong>registro policial</strong>, que pode levar a um processo criminal.",
        "confirmar": [
            "O escritório atende a frente penal (art. 306 do CTB), a administrativa (defesa perante o Detran e a JARI) ou as duas?",
            "Há atendimento em casos com acidente e vítima?",
        ],
        "secoes": [
            {
                "id": "duas-frentes",
                "titulo": "Duas frentes, dois caminhos",
                "html": """
<div class="contraponto">
  <div>
    <p class="contraponto-rotulo">Administrativa</p>
    <p>Arts. 165 e 165-A do CTB. Multa, suspensão do direito de dirigir por 12 meses e recolhimento do documento. A recusa ao teste também gera infração administrativa. A defesa é apresentada ao órgão de trânsito, dentro dos prazos da notificação.</p>
  </div>
  <div>
    <p class="contraponto-rotulo">Penal</p>
    <p>Art. 306 do CTB. Exige concentração de álcool acima do limite legal ou sinais que indiquem alteração da capacidade. Pode haver prisão em flagrante e fiança na delegacia, seguidas de inquérito e eventual processo.</p>
  </div>
</div>
""",
            },
            {
                "id": "o-que-conferir",
                "titulo": "O que conferir nos papéis",
                "html": """
<ul class="lista-marcada">
  <li>Auto de infração: número, artigo indicado e prazo para defesa.</li>
  <li>Resultado do etilômetro, se houve teste, ou termo de constatação de sinais.</li>
  <li>Boletim ou auto de prisão, e comprovante de fiança, se houver.</li>
</ul>
""",
            },
        ],
        "faq": [
            ("Ganhar o recurso no Detran encerra o caso criminal?",
             "<p>Não. São esferas independentes. O resultado de uma não decide automaticamente a outra.</p>"),
        ],
        "fontes": [CTB],
    },
    {
        "rota": "atuacao/medidas-protetivas/",
        "nome": "Medidas protetivas e Lei Maria da Penha",
        "rumina": "Recebi uma decisão sobre medida protetiva. O que ela determina?",
        "titulo_busca": "Medida protetiva em Natal: o que a decisão determina | Melquisedeque Brito",
        "descricao": "Decisão sobre medida protetiva da Lei Maria da Penha: onde ler o que foi determinado, por quanto tempo vale e quais são os caminhos de quem foi protegido e de quem foi intimado.",
        "kicker": "Medidas protetivas e Lei Maria da Penha",
        "h1": "Recebi uma decisão sobre medida protetiva. O que ela determina?",
        "lead": "O que está escrito na parte final da decisão. Cada medida aparece em um item, com uma proibição ou uma obrigação, por exemplo manter distância mínima, não fazer contato por nenhum meio ou deixar a casa. As medidas valem a partir da ciência e até nova decisão, e descumpri-las é crime previsto no art. 24-A da Lei Maria da Penha.",
        "confirmar": [
            "O escritório atende a pessoa protegida, a pessoa intimada a cumprir as medidas ou as duas?",
            "Se atender os dois públicos, manter os dois percursos abaixo e revisar a linguagem de cada um. Se atender apenas um, retirar o outro percurso.",
        ],
        "secoes": [
            {
                "id": "dois-percursos",
                "titulo": "Dois percursos diferentes",
                "html": """
<div class="portas">
  <section class="porta" aria-labelledby="mp-protegida">
    <p class="porta-tipo">Para quem foi protegida pela decisão</p>
    <h3 id="mp-protegida">Guarde a decisão e registre qualquer descumprimento.</h3>
    <p>Em perigo imediato, ligue 190. A Central de Atendimento à Mulher atende pelo 180. Anote datas, horários e mensagens recebidas, e comunique o descumprimento à polícia ou ao juízo.</p>
  </section>
  <section class="porta" aria-labelledby="mp-intimado">
    <p class="porta-tipo">Para quem foi intimado a cumprir</p>
    <h3 id="mp-intimado">Cumpra cada item desde já, inclusive por mensagens e redes sociais.</h3>
    <p>Discordar da decisão não autoriza descumpri-la. O caminho para contestar é no processo, com a defesa, a partir do número e do juízo indicados no documento.</p>
  </section>
</div>
""",
            },
        ],
        "faq": [
            ("A medida perde a validade se as partes voltarem a conversar?",
             "<p>Não. Ela vale até que o juízo decida de outra forma. Uma mudança precisa ser pedida no processo.</p>"),
        ],
        "fontes": [LMP],
    },
    {
        "rota": "atuacao/divorcio/",
        "nome": "Divórcio",
        "rumina": "Como organizar a primeira conversa sobre o divórcio?",
        "titulo_busca": "Divórcio em Natal: como organizar a primeira conversa | Melquisedeque Brito",
        "descricao": "Vai conversar sobre divórcio? Organize três grupos de informação: o casamento, o patrimônio e o que precisa ser combinado sobre os filhos.",
        "kicker": "Direito de Família · Divórcio",
        "h1": "Como organizar a primeira conversa sobre o divórcio?",
        "lead": "Reúna três grupos de informação: a situação do casamento, o que há para dividir e o que precisa ser combinado sobre os filhos. Com isso, a primeira conversa já indica se o caminho é consensual ou litigioso, em cartório ou na Justiça.",
        "confirmar": [
            "Quais modalidades o escritório atende: consensual, litigioso, extrajudicial em cartório?",
            "Partilha de bens, guarda, convivência e pensão estão incluídas?",
            "Confirmar se o Direito de Família entra na apresentação pública de um escritório de advocacia criminal.",
        ],
        "secoes": [
            {
                "id": "tres-grupos",
                "titulo": "Os três grupos de informação",
                "html": """
<dl class="definicoes">
  <dt>O casamento</dt><dd>Certidão de casamento, data, regime de bens e se houve pacto antenupcial.</dd>
  <dt>O patrimônio</dt><dd>Imóveis, veículos, contas, investimentos e dívidas, com documentos ou ao menos uma lista.</dd>
  <dt>Os filhos</dt><dd>Idades, rotina atual e o que já foi conversado sobre guarda, convivência e pensão.</dd>
</dl>
""",
            },
            {
                "id": "caminhos",
                "titulo": "Consensual ou litigioso",
                "html": """
<p>Quando há acordo e os requisitos legais estão cumpridos, o divórcio pode ser feito em cartório, sempre com advogado. Sem acordo, ou quando a lei exige, ele é feito na Justiça. A decisão sobre o caminho vem depois de conhecer esses três grupos de informação.</p>
""",
            },
        ],
        "faq": [
            ("É preciso que os dois concordem com o divórcio?",
             "<p>Não. O divórcio pode ser pedido por um só dos cônjuges. O acordo influencia o caminho e o tempo, não o direito de se divorciar.</p>"),
        ],
        "fontes": [CC],
    },
    {
        "rota": "atuacao/acidente-de-transito/",
        "nome": "Acidente de trânsito",
        "rumina": "Bateram no meu carro. Quais registros devo guardar?",
        "titulo_busca": "Acidente de trânsito em Natal: quais registros guardar | Melquisedeque Brito",
        "descricao": "Bateram no seu carro? Veja quais registros guardar para um pedido de indenização e quando o acidente também pode ter um lado criminal.",
        "kicker": "Acidente de trânsito",
        "h1": "Bateram no meu carro. Quais registros devo guardar?",
        "lead": "Tudo o que mostra como foi, onde foi e quanto custou: fotos do local e dos veículos, boletim de ocorrência, dados do outro condutor e do seguro, contatos de testemunhas, orçamentos e notas do conserto. Esses registros sustentam um pedido de indenização na esfera civil. Se alguém se feriu, pode haver também uma apuração criminal.",
        "confirmar": [
            "O escritório atende pedidos de indenização (responsabilidade civil)?",
            "Ou atende apenas a defesa criminal do condutor em acidente com vítima?",
        ],
        "secoes": [
            {
                "id": "registros",
                "titulo": "Lista de registros",
                "html": """
<div class="ficha" role="list">
  <div class="ficha-linha" role="listitem"><span>Fotos do local, dos veículos e das placas</span></div>
  <div class="ficha-linha" role="listitem"><span>Boletim de ocorrência</span></div>
  <div class="ficha-linha" role="listitem"><span>Nome, documento e seguro do outro condutor</span></div>
  <div class="ficha-linha" role="listitem"><span>Contatos de testemunhas</span></div>
  <div class="ficha-linha" role="listitem"><span>Orçamentos, notas e recibos</span></div>
  <div class="ficha-linha" role="listitem"><span>Atestados e despesas médicas, se houver</span></div>
</div>
""",
            },
            {
                "id": "civil-ou-criminal",
                "titulo": "Civil ou criminal",
                "html": """
<div class="contraponto">
  <div>
    <p class="contraponto-rotulo">Responsabilidade civil</p>
    <p>Discute quem paga o prejuízo. Causas de menor valor podem tramitar no Juizado Especial Cível. A pretensão de reparação civil prescreve, em regra, em três anos.</p>
  </div>
  <div>
    <p class="contraponto-rotulo">Questão criminal</p>
    <p>Surge quando há lesão corporal ou morte, ou outra conduta prevista como crime no Código de Trânsito. Corre em separado.</p>
  </div>
</div>
""",
            },
        ],
        "faq": [
            ("Preciso fazer boletim de ocorrência se ninguém se feriu?",
             "<p>O boletim é um registro útil para a seguradora e para um eventual pedido de indenização. Ele pode ser feito pela delegacia virtual, quando disponível para o tipo de ocorrência.</p>"),
        ],
        "fontes": [("Código Civil, arts. 186, 927 e 206", CC[1]), CTB],
    },
    {
        "rota": "atuacao/correspondencia-juridica/",
        "nome": "Correspondência jurídica",
        "rumina": "Seu escritório precisa de apoio no Rio Grande do Norte?",
        "titulo_busca": "Correspondente jurídico em Natal e no RN | Melquisedeque Brito",
        "descricao": "Correspondência jurídica no Rio Grande do Norte para escritórios de outras cidades: como informar cidade, tipo de ato e prazo no primeiro contato.",
        "kicker": "Correspondência jurídica",
        "h1": "Seu escritório precisa de apoio no Rio Grande do Norte?",
        "lead": "Informe três dados no primeiro contato: a cidade (comarca), o tipo de ato e o prazo. Com isso o escritório confirma disponibilidade e condições antes de qualquer envio de documentos.",
        "confirmar": [
            "Quais atos são realizados: audiências, diligências, protocolos, cópias, despachos?",
            "Em quais comarcas?",
            "Somente matéria criminal ou também outras áreas?",
        ],
        "secoes": [
            {
                "id": "pedido",
                "titulo": "Como montar o pedido",
                "html": """
<div class="ficha" role="list">
  <div class="ficha-linha" role="listitem"><span>Cidade ou comarca</span></div>
  <div class="ficha-linha" role="listitem"><span>Tipo de ato: audiência, diligência, cópia ou protocolo</span></div>
  <div class="ficha-linha" role="listitem"><span>Data do ato ou prazo final</span></div>
  <div class="ficha-linha" role="listitem"><span>Sistema e tribunal, por exemplo PJe do TJRN</span></div>
</div>
<p>O número do processo e as peças são enviados depois da confirmação, pelo canal combinado entre os escritórios.</p>
""",
            },
        ],
        "faq": [
            ("Posso mandar o pedido pelo WhatsApp?",
             "<p>Sim, para o primeiro contato. Informe cidade, tipo de ato e prazo. Os documentos seguem depois, pelo canal combinado.</p>"),
        ],
        "fontes": [],
    },
]
