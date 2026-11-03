#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Conteúdo de todas as páginas do site Jacque Platon.

Este é o arquivo que você edita para mudar texto. Depois de editar, rode:

    python3 ferramentas/gerar.py
    python3 ferramentas/verificar.py

Regras que valem para todo o conteúdo deste arquivo:

* Nada de cliente, depoimento, resultado, número de vendas, posição no Google,
  certificação ou vínculo empregatício que não tenha sido confirmado.
* "Aproximadamente 12 anos de atuação" e "experiência com soluções Google desde
  2019" são declarações do profissional e aparecem sempre identificadas assim.
* WhatsApp não aparece em nenhuma página: o número +55 84 98627-5720 ainda não
  foi confirmado como comercial. Quando for, ele entra no formulário e no
  JSON-LD da organização.
* Fotografia: o retrato é um espaço reservado até a foto original chegar.
"""

from gerar import (DOMINIO, INSTAGRAM, PUBLICADO, ATUALIZADO, bloco_assinatura,
                   bloco_faq, data_legivel)

PITBULL = "https://www.pitbullboxrn.com.br/"
VISUAL = "https://www.visualbonespersonalizados.com.br/"

# Marcadores que podem ser usados em qualquer texto deste arquivo. O gerador
# troca todos no fim da renderização de cada página.
SUBSTITUICOES = {
    "__PITBULL__": PITBULL,
    "__VISUAL__": VISUAL,
    "__INSTAGRAM__": INSTAGRAM,
}

# ---------------------------------------------------------------------------
# Fontes reutilizadas (item 14). Somente documentação primária.
# ---------------------------------------------------------------------------
F_ROBOTS = ("Google Search Central — Introdução ao robots.txt",
            "https://developers.google.com/search/docs/crawling-indexing/robots/intro",
            "Como os robôs do Google leem o arquivo robots.txt.")
F_CRAWLERS = ("Google Search Central — Visão geral dos rastreadores do Google",
              "https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers",
              "Lista oficial dos robôs do Google, incluindo o Google-Extended.")
F_SITEMAP = ("Google Search Central — Como criar um sitemap",
             "https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap",
             "Formato aceito e limites do arquivo de mapa do site.")
F_SITEMAPS_ORG = ("sitemaps.org — Protocolo de sitemap 0.9",
                  "https://www.sitemaps.org/protocol.html",
                  "Especificação do formato XML usada por este site.")
F_SD = ("Google Search Central — Introdução aos dados estruturados",
        "https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data",
        "Como e por que marcar o conteúdo com dados estruturados.")
F_SCHEMA = ("Schema.org", "https://schema.org/",
            "Vocabulário usado no JSON-LD deste site.")
F_CONTEUDO = ("Google Search Central — Como criar conteúdo útil e confiável",
              "https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
              "Orientação do Google sobre conteúdo, autoria e experiência.")
F_GSC = ("Google Search Console", "https://search.google.com/search-console/about",
         "Ferramenta gratuita para acompanhar indexação e desempenho na busca.")
F_BING = ("Bing Webmaster Tools", "https://www.bing.com/webmasters/about",
          "Equivalente do Bing, que também alimenta parte das respostas de IA.")
F_OPENAI = ("OpenAI — Robôs e rastreadores",
            "https://platform.openai.com/docs/bots",
            "Nomes e comportamento do GPTBot, OAI-SearchBot e ChatGPT-User.")
F_GBP = ("Ajuda do Perfil da Empresa no Google",
         "https://support.google.com/business/",
         "Documentação oficial para criar e manter o perfil do negócio.")
F_VITALS = ("web.dev — Core Web Vitals", "https://web.dev/articles/vitals",
            "Métricas públicas de experiência de carregamento e interação.")

# ---------------------------------------------------------------------------
# Página inicial
# ---------------------------------------------------------------------------
HOME_CORPO = """
<section class="hero wrap" id="inicio">
<div class="hero-copy"><p class="eyebrow"><span class="dot"></span> SITES · GOOGLE · INTELIGÊNCIA ARTIFICIAL</p>
<h1>Seu negócio<br>precisa ser<br>encontrado.<br><span>E escolhido.</span></h1>
<p class="hero-description">Criação de <a href="/criacao-de-sites-profissionais/">sites profissionais e landing pages</a>, <a href="/criacao-de-sites-natal-rn/">presença no Google</a> e <a href="/sites-com-inteligencia-artificial/">inteligência artificial aplicada</a>, para negócios de Natal, do Rio Grande do Norte e de todo o Brasil.</p>
<div class="actions"><a href="#contato" class="button primary">Solicitar uma prévia <span>↗</span></a><a href="#projetos" class="text-link">Conhecer meus projetos <span>↓</span></a></div>
<p class="hero-signature">Estratégia humana. Tecnologia a favor do seu negócio.</p>
</div>
<div class="portrait-reserve" role="img" aria-label="Espaço reservado para fotografia profissional original de Jacque Platon">
<div class="reserve-top"><span>JACQUE PLATON</span><span>ESTRATÉGIA / DIGITAL</span></div>
<div class="giant-mark"><img src="/assets/jp.svg" alt="" width="320" height="320"></div>
<div class="portrait-note"><span class="cross">+</span><span>RETRATO PROFISSIONAL<br><small>Fotografia original a enviar</small></span></div>
<div class="reserve-footer"><span>Presença digital<br><strong>que gera negócios.</strong></span><span class="diagonal">↗</span></div>
</div>
</section>
<div class="expertise"><div class="wrap"><span>SITES COM ESTRATÉGIA</span><i>✳</i><span>PRESENÇA NO GOOGLE</span><i>✳</i><span>IA APLICADA AO NEGÓCIO</span><i>✳</i></div></div>

<section class="section wrap about" id="sobre"><div><p class="eyebrow">01 / QUEM ESTÁ POR TRÁS</p><h2>Prazer, sou<br>Jacque Platon<span class="accent">.</span></h2><p class="intro-line">Experiência para entender.<br>Tecnologia para construir.</p></div><div class="about-copy"><p>Atuo com marketing e presença digital, combinando experiência em Google, desenvolvimento de sites e novas tecnologias para ajudar empresas a se posicionarem melhor na internet.</p><p>Meu trabalho começa entendendo o negócio e termina com uma solução pensada para apresentar seus serviços, facilitar o contato e gerar oportunidades comerciais.</p><div class="experience"><div><strong>≈12 anos</strong><span>de atuação em marketing</span></div><div><strong>Desde 2019</strong><span>experiência com soluções Google</span></div><div><strong>2 sites</strong><span>publicados em domínio próprio</span></div></div><p class="footnote">Tempo de atuação e experiência com soluções Google são declarações do profissional, não certificação nem vínculo com o Google. <a href="/sobre/">Veja a página sobre o autor</a>.</p></div></section>

<section class="services section" id="servicos"><div class="wrap"><div class="section-heading"><div><p class="eyebrow">02 / SOLUÇÕES DIGITAIS</p><h2>O próximo passo<br>do seu negócio.</h2></div><p>Uma presença bem construída conecta<br>o que você oferece a quem procura.</p></div>
<div class="service-grid">
<article class="service featured"><span class="service-no">01 / WEB</span><span class="service-icon">↗</span><h3><a href="/criacao-de-sites-profissionais/">Sites profissionais<br>e landing pages.</a></h3><p>Apresente seus diferenciais e conduza o visitante até uma conversa comercial. Design, conteúdo e navegação com um objetivo claro.</p><a href="/criacao-de-sites-profissionais/">Ver como funciona <span>↗</span></a></article>
<article class="service"><span class="service-no">02 / BUSCA</span><span class="service-icon">⌕</span><h3><a href="/criacao-de-sites-natal-rn/">SEO e presença<br>no Google.</a></h3><p>Organize as páginas e o conteúdo para facilitar a compreensão do seu negócio por pessoas, por mecanismos de pesquisa e por assistentes de IA.</p><a href="/criacao-de-sites-natal-rn/">Ver como funciona <span>↗</span></a></article>
<article class="service"><span class="service-no">03 / LOCAL</span><span class="service-icon">◎</span><h3><a href="/google-meu-negocio/">Perfil da Empresa<br>no Google.</a></h3><p>Apresente serviços, fotos e informações consistentes para quem pesquisa por negócios na sua região.</p><a href="/google-meu-negocio/">Ver como funciona <span>↗</span></a></article>
<article class="service"><span class="service-no">04 / HOSPITALIDADE</span><span class="service-icon">↗</span><h3><a href="/sites-para-pousadas-e-hoteis/">Um canal próprio<br>para reservas.</a></h3><p>Mostre sua hospedagem e receba consultas com datas e número de hóspedes, sem depender só de plataformas de terceiros.</p><a href="/sites-para-pousadas-e-hoteis/">Ver como funciona <span>↗</span></a></article>
<article class="service"><span class="service-no">05 / ACADEMIAS</span><span class="service-icon">◈</span><h3><a href="/sites-para-academias/">Sites para academias<br>e estúdios.</a></h3><p>Modalidades, horários, prova visual dos treinos e consulta de aula experimental em uma página só.</p><a href="/sites-para-academias/">Ver como funciona <span>↗</span></a></article>
<article class="service"><span class="service-no">06 / INTELIGÊNCIA ARTIFICIAL</span><span class="service-icon">✳</span><h3><a href="/sites-com-inteligencia-artificial/">IA com direção<br>e propósito.</a></h3><p>Produção digital e soluções com inteligência artificial, orientadas por estratégia, curadoria e revisão profissional.</p><a href="/sites-com-inteligencia-artificial/">Ver como funciona <span>↗</span></a></article>
<div class="service-note"><span>O ponto de partida<br>é o seu negócio.</span><a class="text-link" href="#contato">Vamos entender o seu projeto <span>↗</span></a></div>
</div></div></section>

<section class="section wrap" id="projetos"><div class="section-heading"><div><p class="eyebrow">03 / TRABALHOS SELECIONADOS</p><h2>Estratégia que<br>ganha forma<span class="accent">.</span></h2></div><p>Dois negócios. Duas identidades.<br>Projetos publicados em domínio próprio.</p></div>
<article class="project"><div class="project-stage pitbull-stage"><div class="project-stamp">01 / PITBULL BOX RN</div><div class="laptop"><div class="laptop-camera"></div><img src="/assets/pitbull-desktop-20261103.webp" width="1348" height="926" loading="lazy" alt="Captura real do site da Pitbull Box RN no desktop, com identidade preta e vermelha"><div class="laptop-base"></div></div><div class="phone"><img src="/assets/pitbull-mobile-20261103.webp" width="390" height="844" loading="lazy" alt="Captura real da Pitbull Box em viewport mobile de 390 pixels"></div><span class="stage-label">DESIGN / CONTEÚDO / CONTATO</span></div><div class="project-details"><div><p class="eyebrow">SITE PROFISSIONAL / NEGÓCIOS LOCAIS</p><h3>Pitbull Box RN</h3><p>Site institucional para academia e artes marciais. <a href="/sites-para-academias/">Veja o que monto para academias</a>.</p></div><div class="project-actions"><a class="button outline" href="__PITBULL__" target="_blank" rel="noopener noreferrer">Visualizar projeto <span>↗</span></a><a class="text-link" href="#contato" data-project="Pitbull Box RN">Solicitar projeto semelhante <span>↗</span></a></div></div><details class="case"><summary>Explore a solução <span>+</span></summary><div><p><strong>Apresentação:</strong> Boxe, Muay Thai, Jiu-Jitsu, No-Gi, Jiu-Jitsu Kids e Cross Training organizados em uma página com fotografias e vídeos dos treinos.</p><p><strong>Caminho comercial:</strong> chamadas para aula experimental, consulta de modalidade e formulário com dia e período de preferência. A equipe confirma a disponibilidade pelo WhatsApp.</p><p><strong>No celular:</strong> menu compacto, conteúdo em coluna e chamada fixa para agendar.</p><p><strong>Limite declarado:</strong> recursos observados em <time datetime="2026-11-03">3 de novembro de 2026</time>; sem resultados de conversão aferidos. <a href="/pesquisa/">Leia a análise completa e o método</a>.</p></div></details></article>
<article class="project"><div class="project-stage visual-stage"><div class="project-stamp">02 / VISUAL BONÉS PERSONALIZADOS</div><div class="laptop"><div class="laptop-camera"></div><img src="/assets/visual-bones-desktop-20261103.webp" width="1348" height="926" loading="lazy" alt="Captura real do site Visual Bonés, com vitrine de produto e identidade azul, vermelha e branca"><div class="laptop-base"></div></div><div class="phone"><img src="/assets/visual-bones-mobile-20261103.webp" width="390" height="844" loading="lazy" alt="Captura real da Visual Bonés em viewport mobile de 390 pixels"></div><span class="stage-label">IDENTIDADE / PRODUTOS / ORÇAMENTO</span></div><div class="project-details"><div><p class="eyebrow">SITE COMERCIAL / PRODUTOS PERSONALIZADOS</p><h3>Visual Bonés Personalizados</h3><p>Presença digital para negócio de produtos personalizados, com vitrine e pedido de orçamento.</p></div><div class="project-actions"><a class="button outline" href="__VISUAL__" target="_blank" rel="noopener noreferrer">Visualizar projeto <span>↗</span></a><a class="text-link" href="#contato" data-project="Visual Bonés Personalizados">Solicitar projeto semelhante <span>↗</span></a></div></div><details class="case"><summary>Explore a solução <span>+</span></summary><div><p><strong>Apresentação:</strong> fotografias de bonés, exemplos de personalização e aplicações para empresas, eventos e grupos.</p><p><strong>Caminho comercial:</strong> formulário com nome, WhatsApp, finalidade, quantidade e mensagem. Links de orçamento, perguntas frequentes e botão flutuante de contato.</p><p><strong>No celular:</strong> leitura em coluna única, menu compacto e chamada de orçamento legível.</p><p><strong>Limite declarado:</strong> recursos observados em <time datetime="2026-11-03">3 de novembro de 2026</time>; sem números de vendas ou de tráfego aferidos. É vitrine com pedido de orçamento, não loja virtual com checkout.</p></div></details></article>
<p class="footnote">Imagens capturadas dos sites publicados em <time datetime="2026-11-03">3 de novembro de 2026</time>. As molduras de dispositivos são ilustrativas. <a href="/pesquisa/">Método e limites da análise</a>.</p></section>

<section class="method section" id="metodo"><div class="wrap"><div class="section-heading"><div><p class="eyebrow">04 / COMO EU TRABALHO</p><h2>Clareza em cada etapa.<br>Intenção em cada detalhe.</h2></div></div><ol class="steps"><li><span>01</span><h3>Diagnóstico<br>do negócio.</h3><p>Entender seu público, sua oferta e o que precisa melhorar na presença digital.</p></li><li><span>02</span><h3>Planejamento da<br>presença digital.</h3><p>Definir conteúdo, estrutura e caminhos para o cliente chegar até você.</p></li><li><span>03</span><h3>Criação e<br>desenvolvimento.</h3><p>Transformar o planejamento em uma experiência própria para sua marca.</p></li><li><span>04</span><h3>Revisão, otimização<br>e publicação.</h3><p>Conferir conteúdo, navegação, contato e leitura por buscadores antes de colocar o projeto no ar.</p></li></ol></div></section>

<section class="section wrap home-faq">__FAQ__
<p class="faq-mais"><a class="text-link" href="/perguntas-frequentes/">Ver todas as perguntas frequentes <span>↗</span></a></p></section>

<section class="section wrap contact" id="contato"><div><p class="eyebrow">05 / SEU PRÓXIMO PROJETO</p><h2>Vamos construir<br>uma presença digital<br>à altura do<br><span class="accent">seu negócio?</span></h2><p>Conte o que você faz e o que quer alcançar.<br>O primeiro passo é uma boa conversa.</p><p class="contato-canal">Canal de contato aberto: <a href="__INSTAGRAM__" rel="me noopener noreferrer" target="_blank">@jacqueplatonmkt no Instagram <span>↗</span></a></p><p class="footnote">O envio por WhatsApp será ativado quando o número comercial for confirmado. Até então, o formulário abaixo monta a mensagem na tela para você revisar e copiar.</p></div><form id="contact-form"><div class="form-title"><span>CONTE SOBRE SEU NEGÓCIO</span><span>↗</span></div><div class="fields"><label>Nome *<input name="nome" autocomplete="name" required minlength="2" maxlength="100" placeholder="Como posso chamar você?"></label><label>Empresa *<input name="empresa" autocomplete="organization" required minlength="2" maxlength="120" placeholder="Nome do seu negócio"></label><label>Segmento *<input name="segmento" required maxlength="100" placeholder="Ex.: academia, pousada, serviços"></label><label>Serviço desejado *<select name="servico" id="servico" required><option value="">Selecione uma solução</option><option>Sites profissionais e landing pages</option><option>SEO e presença no Google</option><option>Perfil da Empresa no Google</option><option>Sites para academias e estúdios</option><option>Reservas diretas para hospedagens</option><option>Soluções com inteligência artificial</option></select></label><label class="full">Site atual <span>(opcional)</span><input name="site" type="url" placeholder="https://" maxlength="250"></label><label class="full">Mensagem *<textarea name="mensagem" required minlength="10" maxlength="2000" rows="3" placeholder="O que você precisa para o seu negócio?"></textarea></label></div><button class="button primary submit" type="submit">Preparar minha solicitação <span>↗</span></button><p class="form-help">O formulário monta a mensagem aqui na página. Nenhum dado é enviado para servidor, salvo em cookie ou compartilhado.</p><div id="form-result" hidden aria-live="polite"><strong>Sua mensagem está pronta para revisão.</strong><pre id="message-preview"></pre><span>Nenhuma mensagem foi enviada. Copie o texto e mande pelo Instagram.</span></div></form></section>
"""

HOME_FAQ = [
    ("Quanto custa um site profissional?",
     "<p>O preço é definido depois do diagnóstico, porque depende do número de páginas, "
     "do conteúdo que já existe e dos recursos pedidos. Não trabalho com tabela fixa "
     "publicada. Na primeira conversa eu digo o escopo e o valor por escrito, antes de "
     "qualquer trabalho começar.</p>"),
    ("Em quanto tempo o site fica pronto?",
     "<p>O prazo é combinado no início de cada projeto e depende principalmente de quando "
     "o material chega: textos, fotos, logotipo e informações de contato. A parte que "
     "está sob meu controle eu comprometo por escrito; a espera por material não entra "
     "como prazo meu.</p>"),
    ("Você garante primeira posição no Google?",
     "<p>Não, e ninguém pode garantir. A posição depende do algoritmo do Google, da "
     "concorrência e do comportamento de quem pesquisa. O que eu faço é deixar o site "
     "tecnicamente apto a ser rastreado, indexado e citado: robots liberados, sitemap, "
     "dados estruturados, títulos claros e conteúdo que responde o que as pessoas "
     "perguntam. <a href=\"/criacao-de-sites-natal-rn/\">Veja o que isso significa na "
     "prática</a>.</p>"),
    ("O meu site vai aparecer nas respostas do ChatGPT e de outras IAs?",
     "<p>Aparecer é possível, mas não é garantido por ninguém. O que dá para fazer é "
     "remover os obstáculos: liberar os robôs de IA no robots.txt, entregar o conteúdo "
     "em HTML já renderizado, marcar os dados com Schema.org e escrever respostas "
     "diretas às perguntas reais do seu público. "
     "<a href=\"/sites-com-inteligencia-artificial/\">Explico o método aqui</a>.</p>"),
    ("Você atende fora de Natal e do Rio Grande do Norte?",
     "<p>Sim. O trabalho é feito a distância, por mensagem e chamada, e isso não muda a "
     "entrega. Os dois projetos publicados são de negócios do Rio Grande do Norte, "
     "e a página sobre <a href=\"/criacao-de-sites-natal-rn/\">criação de sites em "
     "Natal</a> trata do que muda quando o cliente procura por região.</p>"),
    ("Quem escreve o conteúdo e o que a IA faz?",
     "<p>A direção, a curadoria e a revisão final são minhas. A inteligência artificial "
     "entra como ferramenta de produção, em rascunho, variação e organização, sempre "
     "sob revisão humana antes de publicar. Não publico texto gerado sem leitura, "
     "nem invento depoimento, avaliação ou resultado. "
     "<a href=\"/sites-com-inteligencia-artificial/\">Como a IA entra no processo</a>.</p>"),
]

HOME = {
    "slug": "",
    "titulo": "Jacque Platon — Criação de sites, Google e IA | Natal, RN",
    "og_titulo": "Jacque Platon — presença digital que gera negócios",
    "descricao": ("Criação de sites profissionais, presença no Google e inteligência "
                  "artificial aplicada a negócios. Dois sites publicados, método "
                  "aberto e sem promessa de posição."),
    "h1_texto": "Seu negócio precisa ser encontrado. E escolhido.",
    "trilha": [],
    "faq": HOME_FAQ,
    "faq_schema": False,
    "changefreq": "weekly",
    "priority": "1.0",
    "palavras": ("criação de sites, landing page, SEO, presença no Google, "
                 "Perfil da Empresa no Google, inteligência artificial, Natal, "
                 "Rio Grande do Norte"),
    "corpo_bruto": (HOME_CORPO
                    .replace("__PITBULL__", PITBULL)
                    .replace("__VISUAL__", VISUAL)
                    .replace("__INSTAGRAM__", INSTAGRAM)
                    .replace("__FAQ__", bloco_faq(
                        HOME_FAQ, "Perguntas que eu mais recebo"))),
    "schema_extra": [
        {"@type": "CreativeWork",
         "@id": DOMINIO + "/#projeto-pitbull-box-rn",
         "name": "Site da Pitbull Box RN",
         "url": PITBULL,
         "creator": {"@id": DOMINIO + "/#jacque-platon"},
         "about": "Academia de boxe, muay thai, jiu-jitsu e cross training",
         "inLanguage": "pt-BR",
         "genre": "Site institucional para negócio local",
         "image": {"@type": "ImageObject",
                   "url": DOMINIO + "/assets/pitbull-desktop-20261103.jpg",
                   "width": 1348, "height": 926,
                   "datePublished": "2026-11-03",
                   "caption": "Captura do site da Pitbull Box RN em 3 de novembro de 2026"}},
        {"@type": "CreativeWork",
         "@id": DOMINIO + "/#projeto-visual-bones",
         "name": "Site da Visual Bonés Personalizados",
         "url": VISUAL,
         "creator": {"@id": DOMINIO + "/#jacque-platon"},
         "about": "Bonés e produtos personalizados para empresas, eventos e grupos",
         "inLanguage": "pt-BR",
         "genre": "Site comercial com vitrine e pedido de orçamento",
         "image": {"@type": "ImageObject",
                   "url": DOMINIO + "/assets/visual-bones-desktop-20261103.jpg",
                   "width": 1348, "height": 926,
                   "datePublished": "2026-11-03",
                   "caption": "Captura do site Visual Bonés em 3 de novembro de 2026"}},
    ],
}


# ---------------------------------------------------------------------------
# Auxiliares de marcação
# ---------------------------------------------------------------------------
def secao(id_, titulo, corpo_html):
    return ('<section id="%s" aria-labelledby="%s-t"><h2 id="%s-t">%s</h2>%s</section>'
            % (id_, id_, id_, titulo, corpo_html))


def lista(itens):
    return "<ul>%s</ul>" % "".join("<li>%s</li>" % i for i in itens)


def passos(itens):
    return "<ol class=\"lista-passos\">%s</ol>" % "".join(
        "<li><strong>%s</strong> %s</li>" % (t, d) for t, d in itens)


def no_servico(slug, nome, tipo, descricao):
    base = DOMINIO + "/" + slug + "/"
    return {
        "@type": "Service",
        "@id": base + "#servico",
        "name": nome,
        "serviceType": tipo,
        "description": descricao,
        "url": base,
        "provider": {"@id": DOMINIO + "/#organizacao"},
        "brand": {"@id": DOMINIO + "/#organizacao"},
        "mainEntityOfPage": {"@id": base + "#webpage"},
        "inLanguage": "pt-BR",
        "areaServed": [
            {"@type": "City", "name": "Natal"},
            {"@type": "State", "name": "Rio Grande do Norte"},
            {"@type": "Country", "name": "Brasil"},
        ],
        "availableChannel": {
            "@type": "ServiceChannel",
            "serviceUrl": DOMINIO + "/#contato",
            "availableLanguage": {"@type": "Language", "name": "Português",
                                  "alternateName": "pt-BR"},
        },
    }


def trilha_de(slug, nome):
    """Trilha de navegação: Início > página atual."""
    return [("/", "Início"), ("/" + slug + "/", nome)]


# ===========================================================================
# /criacao-de-sites-profissionais/
# ===========================================================================
SITES_PRO = {
    "slug": "criacao-de-sites-profissionais",
    "trilha": trilha_de("criacao-de-sites-profissionais",
                        "Criação de sites profissionais"),
    "titulo": "Criação de sites profissionais e landing pages | Jacque Platon",
    "descricao": ("Como funciona a criação de um site profissional ou landing page: "
                  "as quatro etapas, o que está incluído, o que você envia e o que "
                  "não é prometido."),
    "eyebrow": "SOLUÇÃO 01 / SITES E LANDING PAGES",
    "h1": "Criação de sites profissionais<br>e landing pages<span class=\"accent\">.</span>",
    "h1_texto": "Criação de sites profissionais e landing pages",
    "lead": ("Uma página que apresenta o que você faz, responde o que o cliente pergunta "
             "antes de comprar e leva a conversa até um canal de contato."),
    "mainEntity": "#servico",
    "palavras": "criação de sites, site profissional, landing page, site institucional",
    "resposta_rapida": (
        "<p><strong>Site profissional</strong> é a página própria do seu negócio, em "
        "domínio seu, feita para apresentar serviços e gerar contato. "
        "<strong>Landing page</strong> é uma página única com um objetivo só, usada em "
        "campanha ou divulgação.</p>"
        "<p>O trabalho tem quatro etapas: diagnóstico, planejamento de conteúdo, "
        "criação e revisão antes de publicar. Preço e prazo são definidos no "
        "diagnóstico, por escrito, antes de começar. Não há tabela fixa publicada "
        "e não há promessa de posição no Google.</p>"),
    "secoes": "".join([
        secao("incluso", "O que está incluído", lista([
            "<strong>Estrutura da página:</strong> ordem das seções pensada para quem "
            "chega sem conhecer o seu negócio, da apresentação até o contato.",
            "<strong>Conteúdo revisado:</strong> títulos, descrições de serviço e "
            "respostas às dúvidas que aparecem antes da compra.",
            "<strong>Leitura em celular:</strong> layout em coluna, menu compacto e "
            "chamada de contato alcançável com o polegar.",
            "<strong>Base técnica de busca:</strong> título e descrição próprios por "
            "página, tag canônica, <a href=\"/sites-com-inteligencia-artificial/#robots\">"
            "robots liberados</a>, sitemap XML e dados estruturados Schema.org.",
            "<strong>Caminho de contato:</strong> formulário com os campos que você "
            "realmente usa para atender, e não um formulário genérico.",
            "<strong>Imagens tratadas:</strong> arquivos redimensionados, em WebP "
            "quando couber, com texto alternativo escrito.",
        ])),
        secao("processo", "Como é o processo, etapa por etapa", passos([
            ("Diagnóstico.", "Conversamos sobre o que você vende, quem procura, o que "
             "o cliente pergunta antes de fechar e o que hoje atrapalha. Saio daqui "
             "com escopo, prazo e valor por escrito."),
            ("Planejamento do conteúdo.", "Defino as seções, o que cada uma precisa "
             "dizer e quais perguntas a página responde. Você aprova antes de existir "
             "design."),
            ("Criação e desenvolvimento.", "Monto a página com o conteúdo aprovado, a "
             "identidade do negócio e a estrutura técnica de busca."),
            ("Revisão e publicação.", "Confiro leitura em celular e desktop, links, "
             "formulário, imagens, títulos, descrições e se os buscadores conseguem "
             "ler a página. Só então vai ao ar."),
        ])),
        secao("enviar", "O que você precisa me enviar", "".join([
            "<p>O prazo depende mais disso do que do desenvolvimento. Quanto mais "
            "completo o material, mais rápido:</p>",
            lista([
                "Logotipo em arquivo vetorial ou imagem em boa resolução.",
                "Fotografias dos seus produtos, serviços, equipe ou espaço. "
                "Fotos originais valem mais que banco de imagens.",
                "Lista de serviços com o nome que você usa no dia a dia.",
                "Endereço, horário de funcionamento e canais de atendimento.",
                "As cinco perguntas que mais chegam antes de o cliente fechar.",
                "Acesso ao domínio, se já existir, ou a decisão de qual registrar.",
            ]),
        ])),
        secao("nao-prometo", "O que eu não prometo", "".join([
            "<p>Isto está aqui porque é a parte que mais gera frustração no mercado:</p>",
            lista([
                "Não prometo primeira posição no Google, nem em quanto tempo o site "
                "aparece. Isso depende do algoritmo e da concorrência.",
                "Não prometo citação em ChatGPT, Gemini, Perplexity ou Claude. "
                "Dá para liberar e preparar o site para isso; garantir, não.",
                "Não prometo número de contatos, vendas ou faturamento.",
                "Não escrevo depoimento, avaliação ou caso de sucesso que não aconteceu.",
                "Não apresento certificação ou parceria que eu não tenha.",
            ]),
        ])),
        secao("medir", "Como saber se o site está funcionando",
              "<p>Antes de publicar, conecto o site ao Google Search Console e ao Bing "
              "Webmaster Tools. São ferramentas gratuitas e dos próprios buscadores: "
              "mostram quais páginas foram indexadas, quais consultas trouxeram "
              "visitantes e quais erros de leitura apareceram. Dado de ferramenta "
              "oficial, não estimativa.</p>"
              "<p>Do lado comercial, o que importa é mais simples: quantas pessoas "
              "chegaram ao contato e quantas viraram conversa. Isso você mede no seu "
              "atendimento, e eu deixo o caminho até lá sem obstáculo.</p>"
              "<p>Para a experiência de carregamento, a referência pública são as "
              "Core Web Vitals, descritas na fonte citada no fim desta página.</p>"),
    ]),
    "faq": [
        ("Qual a diferença entre site institucional e landing page?",
         "<p>O site institucional apresenta o negócio inteiro, com várias seções ou "
         "páginas, e serve como endereço permanente da marca. A landing page tem um "
         "objetivo único, como inscrição em uma aula ou pedido de orçamento, e "
         "costuma ser usada junto com uma campanha. Muitos negócios precisam dos "
         "dois, em momentos diferentes.</p>"),
        ("Preciso ter domínio próprio?",
         "<p>Sim, é o que recomendo em todos os casos. O domínio próprio é o endereço "
         "que fica seu: se você trocar de hospedagem, de ferramenta ou de "
         "profissional, o endereço continua. Um subdomínio de plataforma gratuita "
         "funciona para testar, mas o histórico de busca construído nele não se "
         "transfere inteiro quando você sai.</p>"),
        ("Você usa WordPress, construtor ou código?",
         "<p>Depende do que o site precisa fazer depois de publicado. Quando você "
         "mesmo vai atualizar conteúdo com frequência, um gerenciador faz sentido. "
         "Quando a página é estável e a prioridade é velocidade e leitura por "
         "buscadores, uma página em HTML, CSS e JavaScript entrega mais com menos "
         "manutenção. A escolha sai no diagnóstico, e eu explico o motivo.</p>"),
        ("O site já vem preparado para aparecer na busca?",
         "<p>Sim, a base técnica vem incluída: título e descrição próprios por página, "
         "tag canônica, HTML semântico, dados estruturados, sitemap XML e robots.txt "
         "liberando buscadores e assistentes de IA. Isso é o que torna o site "
         "legível. Posição depende de concorrência e de conteúdo ao longo do tempo, "
         "não de configuração.</p>"),
        ("Depois de publicar, quem atualiza?",
         "<p>Você pode atualizar, se o projeto for montado para isso, ou pedir a "
         "atualização a mim. O que eu recomendo em qualquer caso é uma revisão a cada "
         "seis meses: preço desatualizado, serviço que você não oferece mais e "
         "telefone antigo prejudicam mais que design velho.</p>"),
        ("Dá para aproveitar o site que eu já tenho?",
         "<p>Em muitos casos sim. Começo lendo o que existe: estrutura, conteúdo, "
         "velocidade, leitura em celular e situação de indexação. Se a base serve, "
         "reorganizar custa menos que refazer. Se não serve, eu digo com o motivo, "
         "em vez de recomeçar por padrão.</p>"),
    ],
    "fontes": [F_CONTEUDO, F_SD, F_GSC, F_VITALS],
    "relacionados": [
        ("/criacao-de-sites-natal-rn/", "Criação de sites em Natal, RN",
         "O que muda quando o cliente pesquisa por região."),
        ("/sites-com-inteligencia-artificial/", "Sites com inteligência artificial",
         "Como libero e preparo o site para ser lido e citado por IA."),
        ("/pesquisa/", "Pesquisa própria de presença digital",
         "Análise de primeira mão de dois sites publicados, com método e limites."),
        ("/perguntas-frequentes/", "Perguntas frequentes",
         "Preço, prazo, domínio, Google e IA em um lugar só."),
    ],
    "cta": ("Conte o que o seu negócio faz e o que você quer que a página resolva. "
            "O diagnóstico vem antes de qualquer proposta."),
    "schema_extra": [no_servico(
        "criacao-de-sites-profissionais",
        "Criação de sites profissionais e landing pages",
        "Desenvolvimento de sites e landing pages",
        "Site institucional ou landing page com estrutura, conteúdo revisado, leitura "
        "em celular, base técnica de busca e caminho de contato definido.")],
}


# ===========================================================================
# /criacao-de-sites-natal-rn/
# ===========================================================================
NATAL = {
    "slug": "criacao-de-sites-natal-rn",
    "trilha": trilha_de("criacao-de-sites-natal-rn", "Criação de sites em Natal, RN"),
    "titulo": "Criação de sites em Natal, RN e busca local | Jacque Platon",
    "descricao": ("Site e busca local para negócios de Natal e do Rio Grande do Norte: "
                  "dados consistentes, Perfil da Empresa no Google e páginas para "
                  "quem pesquisa por região."),
    "eyebrow": "SOLUÇÃO 02 / BUSCA E PRESENÇA LOCAL",
    "h1": "Criação de sites em Natal<br>e busca local no RN<span class=\"accent\">.</span>",
    "h1_texto": "Criação de sites em Natal, RN, e presença na busca local",
    "lead": ("Quem procura um serviço perto de casa pesquisa diferente de quem compra a "
             "distância. Esta página trata do que muda na estrutura do site quando o "
             "cliente é da sua cidade."),
    "mainEntity": "#servico",
    "palavras": ("criação de sites Natal, sites Natal RN, SEO local, busca local, "
                 "Rio Grande do Norte"),
    "resposta_rapida": (
        "<p>Atendo negócios de <strong>Natal e do Rio Grande do Norte</strong>, e também "
        "de outras cidades, com trabalho feito a distância. Os dois sites publicados no "
        "meu portfólio são de negócios do RN.</p>"
        "<p>Para busca local, três coisas pesam mais que design: "
        "<strong>informação de contato consistente</strong> no site, no "
        "<a href=\"/google-meu-negocio/\">Perfil da Empresa no Google</a> e nas redes; "
        "<strong>páginas que dizem onde você atende</strong> com texto, não só com "
        "mapa; e <strong>resposta às perguntas de quem está perto de decidir</strong>, "
        "como horário, forma de pagamento e como chegar.</p>"),
    "secoes": "".join([
        secao("muda", "O que muda num site para busca local", "".join([
            "<p>Busca local é quando a pessoa pesquisa um serviço com a intenção de "
            "resolver perto de onde está. O buscador passa a considerar a localização "
            "de quem pesquisa, e a página precisa deixar claro, em texto legível, "
            "onde o negócio atende.</p>",
            lista([
                "<strong>O endereço em texto, não só em imagem ou iframe.</strong> "
                "Robô não lê endereço que está dentro de uma figura.",
                "<strong>Horário de funcionamento escrito na página.</strong> É uma "
                "das informações mais pedidas antes de alguém sair de casa.",
                "<strong>Os mesmos dados em todo lugar.</strong> Nome, endereço e "
                "telefone iguais no site, no perfil do Google e nas redes. Versões "
                "diferentes do mesmo dado confundem.",
                "<strong>Referências reais de localização.</strong> Bairro e pontos de "
                "referência que você de fato atende, sem encher a página com lista de "
                "cidades onde você nunca trabalhou.",
                "<strong>Dados estruturados de organização e serviço.</strong> Marcar "
                "a área atendida no Schema.org ajuda a máquina a entender o alcance.",
            ]),
            "<p class=\"nota\">Aviso honesto: encher a página de nomes de bairros e "
            "cidades sem ter atendimento ali é prática antiga, já desvalorizada, e "
            "atrapalha a confiança de quem lê.</p>",
        ])),
        secao("perfil", "Site e Perfil da Empresa no Google trabalham juntos",
              "<p>Para muita busca local, o primeiro resultado que a pessoa vê não é o "
              "seu site: é o painel do Google com nome, nota, fotos, horário e botão "
              "de rota. O site aparece depois, quando a pessoa quer entender melhor "
              "o que você faz.</p>"
              "<p>Por isso os dois precisam combinar. O perfil resolve a decisão "
              "rápida; o site resolve a dúvida que vem depois: o que está incluído, "
              "como funciona, quanto custa, quem já atendeu. Se o perfil diz uma "
              "coisa e o site diz outra, a pessoa desconfia das duas. "
              "<a href=\"/google-meu-negocio/\">Como preencho o perfil</a>.</p>"),
        secao("avaliacoes", "Avaliações: o que faço e o que não faço",
              "<p>Avaliação pesa na decisão de quem pesquisa negócio local. O que eu "
              "faço é organizar o pedido: deixar claro no site e no atendimento onde "
              "o cliente avalia, e responder as avaliações existentes.</p>"
              "<p>O que eu não faço: comprar avaliação, escrever avaliação em nome de "
              "cliente, criar perfil falso ou esconder avaliação negativa. Além de "
              "ser contra as regras do Google, dá para perceber de fora, e isso "
              "custa mais caro que a nota baixa.</p>"),
        secao("atendimento", "Como é o atendimento a distância", "".join([
            "<p>O trabalho acontece por mensagem e por chamada de vídeo, em etapas "
            "combinadas. Na prática:</p>",
            passos([
                ("Diagnóstico por chamada.", "Uma conversa sobre o negócio, o público "
                 "da região e o que o cliente pergunta antes de fechar."),
                ("Material por mensagem.", "Você envia logotipo, fotos, lista de "
                 "serviços, endereço e horário."),
                ("Aprovações por link.", "Você recebe um endereço para ver a página "
                 "em andamento e comentar, do seu celular ou computador."),
                ("Publicação acompanhada.", "A página vai ao ar, é enviada ao Search "
                 "Console e eu confiro a leitura pelos buscadores."),
            ]),
            "<p>Nenhuma etapa exige presença física. Quando faz diferença ter foto do "
            "espaço ou da equipe, isso é combinado à parte, porque fotografia "
            "original vale mais que imagem de banco.</p>",
        ])),
    ]),
    "faq": [
        ("Você é de Natal e atende presencialmente?",
         "<p>O atendimento é a distância, por mensagem e chamada, e isso cobre todas "
         "as etapas do projeto. Os dois sites publicados no portfólio são de negócios "
         "do Rio Grande do Norte. Visita presencial não faz parte do pacote padrão; "
         "se o seu caso precisar de fotografia no local, isso entra como combinado "
         "separado.</p>"),
        ("Quanto tempo leva para o site aparecer nas buscas de Natal?",
         "<p>Não há prazo garantido, e desconfie de quem der um. O que eu controlo é a "
         "parte técnica: enviar o site ao Google Search Console e ao Bing Webmaster "
         "Tools no dia da publicação, com sitemap e robots liberados, para que a "
         "descoberta não dependa de sorte. Quando a página entra no índice e em que "
         "posição ela fica são decisões do buscador.</p>"),
        ("Preciso do Perfil da Empresa no Google mesmo tendo site?",
         "<p>Para negócio que atende por região, sim, e os dois somados funcionam "
         "melhor que cada um sozinho. O perfil aparece no painel lateral e no mapa, "
         "com horário, fotos e rota. O site é onde a pessoa entende o serviço inteiro. "
         "Um não substitui o outro.</p>"),
        ("Dá para aparecer em cidades onde eu não tenho endereço?",
         "<p>Para busca local pura, é difícil e não deve ser forçado: o Google "
         "prioriza proximidade real. O que funciona de forma honesta é deixar claro "
         "que você atende a distância e criar páginas sobre o serviço, não sobre "
         "cidades onde você não está. Página de cidade sem atendimento real é "
         "desperdício e enfraquece o site.</p>"),
        ("Meu negócio é novo. Faz diferença?",
         "<p>Faz, e é bom saber disso antes. Um negócio recém-aberto não tem histórico, "
         "menções nem avaliações, e isso pesa na busca local. A resposta não é "
         "truque: é começar com os dados certos desde o primeiro dia, perfil "
         "preenchido, site publicado e informação consistente, para que o histórico "
         "comece a ser construído em vez de precisar ser corrigido depois.</p>"),
    ],
    "fontes": [F_GBP, F_CONTEUDO, F_GSC, F_BING],
    "relacionados": [
        ("/google-meu-negocio/", "Perfil da Empresa no Google",
         "O que preencher, o que revisar e o que não fazer."),
        ("/criacao-de-sites-profissionais/", "Criação de sites profissionais",
         "Etapas, o que está incluído e o que não é prometido."),
        ("/sites-para-academias/", "Sites para academias",
         "Um caso concreto de negócio local, com análise do site publicado."),
        ("/pesquisa/", "Pesquisa própria de presença digital",
         "Como dois negócios do RN apresentam seus serviços na web."),
    ],
    "cta": ("Diga em que cidade o seu cliente está e o que ele pesquisa para te achar. "
            "O resto parte disso."),
    "schema_extra": [no_servico(
        "criacao-de-sites-natal-rn",
        "Criação de sites e presença na busca local em Natal, RN",
        "Otimização para busca local e desenvolvimento de sites",
        "Site e presença na busca para negócios de Natal e do Rio Grande do Norte, com "
        "dados de contato consistentes, Perfil da Empresa no Google e páginas que "
        "respondem a quem pesquisa por região.")],
}


# ===========================================================================
# /sites-para-academias/
# ===========================================================================
ACADEMIAS = {
    "slug": "sites-para-academias",
    "trilha": trilha_de("sites-para-academias", "Sites para academias"),
    "titulo": "Sites para academias e estúdios de luta | Jacque Platon",
    "descricao": ("O que a página de uma academia precisa ter: modalidades, horários, "
                  "prova visual do treino e aula experimental. Com análise do site "
                  "publicado da Pitbull Box RN."),
    "eyebrow": "SOLUÇÃO 03 / ACADEMIAS E ESTÚDIOS",
    "h1": "Sites para academias,<br>estúdios e artes marciais<span class=\"accent\">.</span>",
    "h1_texto": "Sites para academias, estúdios e artes marciais",
    "lead": ("Quem procura academia quer saber três coisas antes de entrar: qual "
             "modalidade, que horário e como é o ambiente. A página precisa responder "
             "isso sem exigir uma mensagem."),
    "mainEntity": "#servico",
    "palavras": ("site para academia, site para box, site de jiu-jitsu, muay thai, "
                 "aula experimental"),
    "resposta_rapida": (
        "<p>A página de uma academia funciona quando mostra, sem intermediário: "
        "<strong>as modalidades com o nome que o aluno usa</strong>, "
        "<strong>os horários</strong>, <strong>fotos e vídeos reais do treino</strong> e "
        "<strong>um caminho curto para marcar a aula experimental</strong>.</p>"
        "<p>Projeto publicado neste segmento: "
        "<a href=\"__PITBULL__\" rel=\"noopener noreferrer\" target=\"_blank\">Pitbull "
        "Box RN</a>, academia de boxe, muay thai, jiu-jitsu, no-gi, jiu-jitsu kids e "
        "cross training. A análise do que está na página, com data e limites, está na "
        "<a href=\"/pesquisa/#pitbull\">minha pesquisa</a>.</p>"),
    "secoes": "".join([
        secao("precisa", "O que a página precisa ter", lista([
            "<strong>Uma seção por modalidade.</strong> Quem busca jiu-jitsu não quer "
            "ler sobre musculação. Cada modalidade com descrição própria também "
            "melhora a chance de ser encontrada por aquele nome.",
            "<strong>Horário por modalidade e por dia.</strong> É a pergunta número um "
            "e a mais mal resolvida nos sites de academia.",
            "<strong>Prova visual do treino.</strong> Foto e vídeo da turma real, não "
            "banco de imagens. Quem nunca treinou quer ver o nível do ambiente antes "
            "de aparecer de shorts.",
            "<strong>Aula experimental com atrito mínimo.</strong> Formulário curto, "
            "com modalidade, dia e período de preferência, e a confirmação feita pela "
            "equipe depois.",
            "<strong>Localização e como chegar.</strong> Endereço em texto, "
            "estacionamento, ponto de referência.",
            "<strong>Turma infantil separada.</strong> Quem decide é o responsável, e "
            "as perguntas dele são outras: idade mínima, segurança, acompanhamento.",
        ])),
        secao("pitbull", "Caso publicado: Pitbull Box RN", "".join([
            "<p>Site institucional para academia e artes marciais, publicado em domínio "
            "próprio. O que está na página, observado em "
            "<time datetime=\"2026-11-03\">3 de novembro de 2026</time>:</p>",
            lista([
                "Identidade visual em preto, vermelho e branco, com títulos de grande "
                "impacto.",
                "Modalidades apresentadas: boxe, muay thai, jiu-jitsu, no-gi, "
                "jiu-jitsu kids e cross training.",
                "Galerias de treino com fotografias e vídeos.",
                "Seção de estrutura do espaço e consulta de horários.",
                "Chamadas para aula experimental, com botão por modalidade.",
                "Formulário com nome, WhatsApp opcional, modalidade, dia, período e "
                "experiência anterior, com a interface explicando que o atendimento "
                "confirma a disponibilidade.",
                "Em largura de 390 pixels: menu compacto, conteúdo em coluna única e "
                "chamada de aula experimental sempre alcançável.",
            ]),
            "<p class=\"nota\"><strong>Limite declarado:</strong> esta é a observação "
            "pública dos recursos e da interface. Não foi enviado um agendamento, nem "
            "aferida a entrega da mensagem, a disponibilidade das turmas, o desempenho "
            "comercial, a velocidade em aparelho físico ou a posição em buscas. "
            "<a href=\"/pesquisa/\">Método completo</a>.</p>",
        ])),
        secao("buscas", "Como a academia é procurada",
              "<p>Busca por academia é quase sempre local e quase sempre por nome de "
              "modalidade: a pessoa pesquisa a luta que quer fazer e a região onde "
              "mora. Isso tem duas consequências diretas na estrutura da página.</p>"
              "<p>Primeira: cada modalidade merece texto próprio, com o nome popular "
              "incluído. No-gi, jiu-jitsu sem kimono e grappling podem ser a mesma "
              "aula para você, mas são buscas diferentes.</p>"
              "<p>Segunda: o <a href=\"/google-meu-negocio/\">Perfil da Empresa no "
              "Google</a> costuma aparecer antes do site, com horário, fotos e rota. "
              "Os dois precisam dizer a mesma coisa. "
              "<a href=\"/criacao-de-sites-natal-rn/\">Mais sobre busca local</a>.</p>"),
    ]).replace("__PITBULL__", PITBULL),
    "faq": [
        ("A academia precisa de site se já tem Instagram?",
         "<p>O Instagram resolve a vitrine do dia a dia; o site resolve a dúvida de "
         "quem está decidindo. Horário por modalidade, valor do plano, idade mínima da "
         "turma infantil e como marcar a experimental são informações que ninguém "
         "encontra rolando o feed. Além disso, o perfil pertence à plataforma; o site "
         "em domínio próprio é seu.</p>"),
        ("Dá para colocar os horários das turmas no site?",
         "<p>Sim, e recomendo que sejam escritos em texto na página, não em imagem de "
         "cartaz. Horário em imagem não é lido por buscador, não é lido por leitor de "
         "tela e não dá para copiar. O cartaz pode continuar existindo; o texto "
         "precisa existir junto.</p>"),
        ("Como funciona o agendamento da aula experimental?",
         "<p>No modelo que uso, o formulário recolhe modalidade, dia e período de "
         "preferência, e a equipe confirma a disponibilidade no contato. É de "
         "propósito: agenda de academia muda, e prometer vaga automática gera aluno "
         "chegando em turma cheia. A página deixa claro que a confirmação vem depois.</p>"),
        ("Precisa de fotos e vídeos profissionais?",
         "<p>Ajuda muito, mas foto de celular bem feita da turma real vale mais que "
         "banco de imagens. Quem procura academia quer ver aquele espaço, aquele "
         "tatame, aquele nível de turma. Imagem genérica de modelo em academia "
         "americana tem efeito contrário.</p>"),
        ("Vocês fazem site para estúdio de pilates, crossfit ou dança?",
         "<p>Sim. A estrutura é a mesma: modalidade com nome próprio, horário, prova "
         "visual do ambiente e consulta de aula experimental. O que muda é o "
         "vocabulário e a dúvida principal do público, que sai no diagnóstico.</p>"),
    ],
    "fontes": [F_CONTEUDO, F_GBP, F_SD],
    "relacionados": [
        ("/pesquisa/", "Pesquisa própria de presença digital",
         "A análise completa do site da Pitbull Box, com método e limites."),
        ("/criacao-de-sites-natal-rn/", "Busca local em Natal e no RN",
         "Como quem procura serviço perto de casa pesquisa."),
        ("/criacao-de-sites-profissionais/", "Criação de sites profissionais",
         "Etapas, material necessário e o que não é prometido."),
        ("/google-meu-negocio/", "Perfil da Empresa no Google",
         "O painel que aparece antes do seu site."),
    ],
    "cta": ("Me diga as modalidades, os horários e quem decide a matrícula. "
            "Monto a página em volta disso."),
    "schema_extra": [no_servico(
        "sites-para-academias",
        "Sites para academias, estúdios e artes marciais",
        "Desenvolvimento de sites para academias",
        "Página de academia com modalidades descritas uma a uma, horários em texto, "
        "galeria real de treino e consulta de aula experimental.")],
}


# ===========================================================================
# /sites-para-pousadas-e-hoteis/
# ===========================================================================
POUSADAS = {
    "slug": "sites-para-pousadas-e-hoteis",
    "trilha": trilha_de("sites-para-pousadas-e-hoteis", "Sites para pousadas e hotéis"),
    "titulo": "Sites para pousadas e hotéis: canal próprio de reservas",
    "descricao": ("Canal próprio de consulta de reservas para pousadas e hotéis, com "
                  "página por acomodação, regras escritas e datas, sem depender só "
                  "de plataformas."),
    "eyebrow": "SOLUÇÃO 04 / HOSPEDAGEM",
    "h1": "Sites para pousadas e hotéis<br>com canal próprio de reservas<span class=\"accent\">.</span>",
    "h1_texto": "Sites para pousadas e hotéis com canal próprio de reservas",
    "lead": ("Plataforma de intermediação traz hóspede e cobra comissão por isso. O site "
             "próprio não substitui a plataforma: ele recebe quem já decidiu e pesquisou "
             "o nome da sua pousada."),
    "mainEntity": "#servico",
    "palavras": ("site para pousada, site para hotel, reserva direta, "
                 "canal próprio de reservas, hospedagem"),
    "resposta_rapida": (
        "<p>Um canal próprio de reservas é a página onde o hóspede consulta "
        "<strong>datas, número de pessoas e acomodação</strong> direto com você, sem "
        "passar por intermediário. Ele serve principalmente para quem já ouviu falar da "
        "sua pousada e pesquisou o nome dela.</p>"
        "<p class=\"nota\"><strong>Transparência sobre o portfólio:</strong> ainda não "
        "tenho projeto de hospedagem publicado em domínio próprio. Os dois sites no "
        "<a href=\"/#projetos\">meu portfólio</a> são de outros segmentos. O que está "
        "descrito aqui é o escopo que eu monto, não um caso entregue.</p>"),
    "secoes": "".join([
        secao("plataformas", "O que o site faz e o que a plataforma faz",
              "<p>As duas coisas convivem, e tratar o site como substituto da plataforma "
              "é o erro mais comum. A plataforma é vitrine de descoberta: ela apresenta "
              "sua pousada a quem ainda não sabe que ela existe, e cobra comissão por "
              "esse serviço.</p>"
              "<p>O site próprio atende outro momento: o hóspede que viu você numa "
              "plataforma, numa indicação ou numa rede social e foi pesquisar o nome. "
              "Nesse momento, se existir um canal direto claro, a reserva pode ser "
              "feita sem comissão. Se não existir, ele volta para a plataforma.</p>"
              "<p>Por isso a conta não é «site ou plataforma». É quanto da sua reserva "
              "hoje vem de gente que já conhecia o nome e não tinha para onde ir.</p>"),
        secao("estrutura", "A estrutura que eu monto", lista([
            "<strong>Uma página por tipo de acomodação.</strong> Capacidade, cama, "
            "banheiro, ar, vista, varanda, o que está incluído. Em texto, não só na "
            "legenda da foto.",
            "<strong>Fotografia honesta do quarto real.</strong> Foto com grande "
            "angular exagerada gera avaliação ruim na chegada.",
            "<strong>Consulta com data de entrada, saída e número de hóspedes.</strong> "
            "Com a página deixando claro que a confirmação de disponibilidade vem no "
            "atendimento.",
            "<strong>Regras escritas.</strong> Horário de check-in e check-out, política "
            "de cancelamento, animais, crianças, formas de pagamento. É o que mais "
            "gera mensagem repetida.",
            "<strong>O que tem em volta.</strong> Distância até a praia, até o "
            "aeroporto, até o centro. Em quilômetros ou minutos, não em adjetivo.",
            "<strong>Café da manhã e serviços.</strong> Incluído ou não, horário, "
            "opções para restrição alimentar.",
        ])),
        secao("reserva", "Consulta de reserva, não motor de reservas",
              "<p>Há uma diferença importante de escopo, e ela precisa ficar dita antes "
              "de qualquer proposta. Um <strong>motor de reservas</strong> integra "
              "calendário, disponibilidade em tempo real e pagamento online: é um "
              "sistema, normalmente contratado de um fornecedor especializado, com "
              "mensalidade própria.</p>"
              "<p>O que eu monto é a <strong>consulta de reserva</strong>: o hóspede "
              "informa datas e número de pessoas, a mensagem chega organizada ao seu "
              "atendimento e você confirma. É mais simples, custa menos e funciona bem "
              "para pousada pequena. Para quem precisa de disponibilidade automática e "
              "pagamento na hora, o caminho é integrar um motor, e eu digo isso em vez "
              "de improvisar.</p>"),
        secao("busca-hospedagem", "Como pousada é encontrada",
              "<p>Boa parte da busca por hospedagem acontece dentro das plataformas, e "
              "nenhum site muda isso. Fora delas, três buscas valem a atenção: o nome "
              "da pousada, a região com o tipo de hospedagem e a pergunta prática de "
              "quem já escolheu o destino.</p>"
              "<p>A primeira é a mais valiosa e a mais fácil de perder: se alguém "
              "pesquisa o nome da sua pousada e encontra só perfis de terceiros, você "
              "paga comissão por um hóspede que já era seu. "
              "<a href=\"/google-meu-negocio/\">O Perfil da Empresa no Google</a> e o "
              "site resolvem essa busca juntos.</p>"),
    ]),
    "faq": [
        ("Vale a pena ter site se eu já estou nas plataformas?",
         "<p>Vale quando existe gente pesquisando o nome da sua pousada. Essa é a "
         "reserva que você já conquistou e ainda paga comissão para receber. Se "
         "praticamente todo o seu hóspede chega por descoberta dentro da plataforma, "
         "o ganho é menor, e eu digo isso no diagnóstico em vez de vender o projeto.</p>"),
        ("O site mostra disponibilidade em tempo real?",
         "<p>Não no escopo que eu entrego. O que a página faz é receber a consulta com "
         "datas e número de hóspedes, de forma organizada, e você confirma no "
         "atendimento. Disponibilidade automática e pagamento online exigem um motor "
         "de reservas contratado à parte, que pode ser integrado depois.</p>"),
        ("Posso oferecer preço melhor no meu site que na plataforma?",
         "<p>Isso depende do contrato que você assinou com cada plataforma, e várias "
         "têm cláusula de paridade de preço. Não é uma questão de site, é de contrato: "
         "confira com a plataforma ou com quem cuida do seu jurídico antes de "
         "anunciar preço menor. Eu monto a página do jeito que você decidir operar.</p>"),
        ("Vocês já fizeram site de pousada?",
         "<p>Não há projeto de hospedagem publicado no meu portfólio hoje, e prefiro "
         "dizer isso do que mostrar um caso que não é meu. O que existe são dois sites "
         "publicados em outros segmentos, uma academia e um negócio de produtos "
         "personalizados, e o escopo de hospedagem descrito nesta página.</p>"),
        ("Quantas fotos eu preciso enviar?",
         "<p>Pelo menos uma sequência boa por tipo de acomodação, mais área comum, "
         "café da manhã e fachada. Fotos horizontais e com luz natural rendem mais. "
         "Se você só tem fotos das plataformas, dá para começar com elas, mas vale "
         "programar uma sessão própria: é o item que mais muda a decisão do hóspede.</p>"),
    ],
    "fontes": [F_CONTEUDO, F_GBP, F_SD],
    "relacionados": [
        ("/criacao-de-sites-profissionais/", "Criação de sites profissionais",
         "Etapas do projeto e o que você precisa enviar."),
        ("/google-meu-negocio/", "Perfil da Empresa no Google",
         "Quem pesquisa o nome da pousada vê isso primeiro."),
        ("/criacao-de-sites-natal-rn/", "Busca local em Natal e no RN",
         "Dados consistentes para quem pesquisa por região."),
        ("/perguntas-frequentes/", "Perguntas frequentes",
         "Preço, prazo, escopo e o que não é prometido."),
    ],
    "cta": ("Conte quantas acomodações você tem e de onde vem a sua reserva hoje. "
            "A resposta muda o escopo."),
    "schema_extra": [no_servico(
        "sites-para-pousadas-e-hoteis",
        "Sites para pousadas e hotéis com canal próprio de reservas",
        "Desenvolvimento de sites para hospedagem",
        "Site de hospedagem com página por acomodação, regras escritas, informações do "
        "entorno e consulta direta de datas e número de hóspedes.")],
}


# ===========================================================================
# /google-meu-negocio/
# ===========================================================================
GBP = {
    "slug": "google-meu-negocio",
    "trilha": trilha_de("google-meu-negocio", "Perfil da Empresa no Google"),
    "titulo": "Perfil da Empresa no Google: o que preencher e revisar",
    "descricao": ("Como preencher e manter o Perfil da Empresa no Google, antigo Google "
                  "Meu Negócio: categoria, serviços, horário, fotos, avaliações e os "
                  "erros mais comuns."),
    "eyebrow": "SOLUÇÃO 05 / PRESENÇA LOCAL NO GOOGLE",
    "h1": "Perfil da Empresa no Google,<br>preenchido e mantido<span class=\"accent\">.</span>",
    "h1_texto": "Perfil da Empresa no Google: o que preencher e o que revisar",
    "lead": ("É o painel que aparece com nome, nota, horário, fotos e botão de rota, "
             "muitas vezes antes do seu site. Preenchê-lo pela metade é jogar fora o "
             "primeiro contato."),
    "mainEntity": "#servico",
    "palavras": ("Perfil da Empresa no Google, Google Meu Negócio, ficha do Google, "
                 "presença local"),
    "resposta_rapida": (
        "<p>O <strong>Perfil da Empresa no Google</strong> é o cadastro gratuito que "
        "coloca o seu negócio no painel de resultados e no mapa. O nome antigo era "
        "Google Meu Negócio.</p>"
        "<p>O que mais pesa, na ordem: <strong>categoria principal correta</strong>, "
        "<strong>nome exatamente como no site</strong>, <strong>horário atualizado "
        "inclusive em feriado</strong>, <strong>serviços listados um a um</strong>, "
        "<strong>fotos reais e recentes</strong> e <strong>resposta a todas as "
        "avaliações</strong>. Criar o perfil e abandonar é o erro mais comum.</p>"),
    "secoes": "".join([
        secao("preencher", "O que preencher, item por item", lista([
            "<strong>Nome do negócio.</strong> O nome real, igual ao do site e da "
            "fachada. Acrescentar palavra-chave ao nome é contra as regras do Google e "
            "pode suspender o perfil.",
            "<strong>Categoria principal.</strong> A que melhor descreve a atividade "
            "central. É o campo que mais influencia em quais buscas você aparece. "
            "Categorias secundárias entram depois, para o que você também faz.",
            "<strong>Serviços.</strong> Cada serviço com o nome que o cliente usa, com "
            "descrição própria. Lista vaga rende pouco.",
            "<strong>Horário.</strong> Inclusive horário especial de feriado. Perfil "
            "que diz «aberto» com a porta fechada gera avaliação de uma estrela.",
            "<strong>Área de atendimento.</strong> Para quem vai até o cliente, as "
            "regiões reais, sem inflar a lista.",
            "<strong>Fotos.</strong> Fachada, interior, equipe, produto e serviço "
            "sendo prestado. Foto recente e própria, não banco de imagens.",
            "<strong>Link do site.</strong> Apontando para a página mais útil, que "
            "muitas vezes é a página do serviço e não a inicial.",
            "<strong>Perguntas e respostas.</strong> Você pode publicar e responder as "
            "dúvidas comuns no próprio perfil, antes que alguém pergunte errado.",
        ])),
        secao("manter", "Manter é mais importante que criar",
              "<p>Perfil é conteúdo vivo. O que eu recomendo como rotina mínima: "
              "revisar horário antes de feriado, publicar novidade ou foto com alguma "
              "regularidade, responder avaliação nova em poucos dias e conferir uma vez "
              "por mês se alguém sugeriu alteração nos seus dados, porque o Google "
              "aceita sugestão de terceiros.</p>"
              "<p>Essa última é a que pega mais gente de surpresa: o horário ou o "
              "endereço do seu perfil podem mudar sem você mexer. Quem não olha "
              "descobre pelo cliente que foi à loja fechada.</p>"),
        secao("consistencia", "Os mesmos dados em todo lugar",
              "<p>Nome, endereço e telefone precisam estar idênticos no perfil, no site, "
              "nas redes e em qualquer diretório onde o negócio apareça. Não é "
              "superstição de SEO: é o que permite que a mesma empresa seja reconhecida "
              "como uma empresa só, em vez de três cadastros parecidos.</p>"
              "<p>No site, esses dados também vão marcados em dados estruturados, para "
              "que a máquina leia o endereço como endereço e o horário como horário. "
              "<a href=\"/criacao-de-sites-natal-rn/\">Mais sobre busca local</a>.</p>"),
        secao("avaliacoes-gbp", "Avaliações, sem atalho",
              "<p>O que funciona: pedir avaliação a quem foi bem atendido, no momento em "
              "que ele está satisfeito, com o link direto na mão; e responder todas, "
              "inclusive as ruins, de forma curta e sem discussão.</p>"
              "<p>O que eu não faço, em nenhuma hipótese: comprar avaliação, escrever "
              "avaliação em nome de cliente, criar conta falsa, oferecer desconto em "
              "troca de nota ou tentar remover crítica legítima. É contra as diretrizes "
              "do Google, coloca o perfil em risco e é perceptível para quem lê.</p>"),
        secao("erros-gbp", "Erros que eu encontro com mais frequência", lista([
            "Categoria principal genérica demais, escolhida no cadastro e nunca revista.",
            "Horário desatualizado, principalmente em feriado.",
            "Nenhuma foto nova há mais de um ano.",
            "Avaliações sem resposta, inclusive elogios.",
            "Link do site apontando para uma página que não existe mais.",
            "Nome do negócio com palavra-chave colada, em risco de suspensão.",
            "Dois perfis da mesma empresa, criados em momentos diferentes, dividindo "
            "avaliações e confundindo quem pesquisa.",
        ])),
    ]),
    "faq": [
        ("Google Meu Negócio e Perfil da Empresa no Google são a mesma coisa?",
         "<p>Sim. É o mesmo produto, com nome novo. O Google renomeou Google Meu "
         "Negócio para Perfil da Empresa no Google, e hoje a gestão acontece "
         "principalmente dentro da própria busca e do mapa, quando você está logado na "
         "conta que administra o perfil.</p>"),
        ("É gratuito?",
         "<p>Criar e manter o perfil é gratuito. Não existe taxa do Google para "
         "aparecer no mapa ou no painel. Se alguém ligar cobrando para «ativar» ou "
         "«verificar» o seu perfil em nome do Google, desconfie. O que é pago são os "
         "anúncios, que são outro produto.</p>"),
        ("Posso ter perfil sem endereço físico?",
         "<p>Sim, se você atende no endereço do cliente ou a distância. Nesse caso o "
         "perfil é cadastrado como negócio com área de atendimento, e o endereço não "
         "fica público. Negócio totalmente on-line, sem atendimento presencial em "
         "nenhum lugar, normalmente não se qualifica.</p>"),
        ("Por que meu perfil não aparece quando eu pesquiso?",
         "<p>As causas mais comuns são verificação pendente, perfil suspenso, categoria "
         "incompatível com o que você pesquisou, ou simplesmente proximidade: o painel "
         "local considera onde está quem pesquisa. Vale também lembrar que você, "
         "logado na sua conta, vê um resultado diferente do de um desconhecido.</p>"),
        ("O perfil substitui o site?",
         "<p>Não. O perfil resolve a decisão rápida: onde fica, está aberto, tem nota "
         "boa. O site resolve a dúvida seguinte: o que está incluído, como funciona, "
         "quanto custa, por que você. Além disso, o perfil é uma página do Google, com "
         "as regras do Google; o site em domínio próprio é seu. "
         "<a href=\"/criacao-de-sites-profissionais/\">Como monto o site</a>.</p>"),
    ],
    "fontes": [F_GBP, F_CONTEUDO, F_SD],
    "relacionados": [
        ("/criacao-de-sites-natal-rn/", "Busca local em Natal e no RN",
         "Como o site e o perfil trabalham juntos."),
        ("/sites-para-academias/", "Sites para academias",
         "Um segmento em que o perfil aparece antes do site."),
        ("/sites-para-pousadas-e-hoteis/", "Sites para pousadas e hotéis",
         "Quem pesquisa o nome da pousada precisa te achar."),
        ("/perguntas-frequentes/", "Perguntas frequentes",
         "As dúvidas que mais chegam, reunidas."),
    ],
    "cta": ("Me mande o link do seu perfil atual. A revisão começa pelo que já existe."),
    "schema_extra": [no_servico(
        "google-meu-negocio",
        "Preenchimento e manutenção do Perfil da Empresa no Google",
        "Gestão de presença local no Google",
        "Revisão de categoria, serviços, horário, fotos, perguntas e avaliações do "
        "Perfil da Empresa no Google, com os mesmos dados do site.")],
}


# ===========================================================================
# /sites-com-inteligencia-artificial/
# ===========================================================================
IA = {
    "slug": "sites-com-inteligencia-artificial",
    "trilha": trilha_de("sites-com-inteligencia-artificial",
                        "Sites com inteligência artificial"),
    "titulo": "Sites com IA: aparecer em respostas de ChatGPT e Gemini",
    "descricao": ("Como preparar um site para ser lido e citado por ChatGPT, Gemini, "
                  "Perplexity e Claude: robôs liberados, HTML renderizado, dados "
                  "estruturados e respostas diretas."),
    "eyebrow": "SOLUÇÃO 06 / INTELIGÊNCIA ARTIFICIAL",
    "h1": "Sites preparados para IA,<br>com direção humana<span class=\"accent\">.</span>",
    "h1_texto": "Sites com inteligência artificial: ser lido, ser citado e ser revisado",
    "lead": ("Duas coisas diferentes com o mesmo nome. Uma é deixar o site legível para "
             "assistentes de IA. A outra é usar IA para produzir, com curadoria e "
             "revisão. Esta página trata das duas, separadas."),
    "mainEntity": "#servico",
    "palavras": ("site para IA, aparecer no ChatGPT, GPTBot, robots.txt IA, "
                 "dados estruturados, inteligência artificial"),
    "resposta_rapida": (
        "<p>Para um site ter chance de ser citado por um assistente de IA, cinco coisas "
        "precisam estar resolvidas: <strong>os robôs de IA liberados no "
        "robots.txt</strong>, <strong>o conteúdo já presente no HTML servido</strong> "
        "sem depender de JavaScript, <strong>dados estruturados Schema.org</strong>, "
        "<strong>respostas diretas às perguntas reais</strong> e "
        "<strong>autoria e data visíveis</strong>.</p>"
        "<p class=\"nota\">Nenhuma dessas medidas garante citação. Elas removem os "
        "obstáculos. Quem promete aparecer no ChatGPT está vendendo o que não "
        "controla.</p>"),
    "secoes": "".join([
        secao("robots", "Parte 1: liberar os robôs de IA",
              "<p>Assistentes de IA chegam ao seu site por robôs com nome próprio, e "
              "cada um lê o arquivo <code>robots.txt</code> antes de entrar. Se o "
              "arquivo não citar aquele nome, alguns robôs aplicam a regra geral, "
              "outros param. Por isso eu libero nominalmente, um bloco por robô.</p>"
              "<p>Os nomes que importam hoje incluem <code>GPTBot</code>, "
              "<code>OAI-SearchBot</code> e <code>ChatGPT-User</code>, da OpenAI; "
              "<code>ClaudeBot</code>, <code>Claude-SearchBot</code> e "
              "<code>Claude-User</code>, da Anthropic; <code>PerplexityBot</code> e "
              "<code>Perplexity-User</code>; <code>Google-Extended</code>, que "
              "controla o uso do conteúdo nas respostas de IA do Google; "
              "<code>Applebot-Extended</code>; <code>meta-externalagent</code>; e "
              "<code>CCBot</code>, do Common Crawl, base usada por vários modelos.</p>"
              "<p>Há uma distinção que vale entender antes de decidir: robôs de "
              "<em>indexação</em> coletam conteúdo para treinar ou indexar; robôs de "
              "<em>visita a pedido</em>, como <code>ChatGPT-User</code>, entram porque "
              "uma pessoa pediu aquele link naquele momento. Bloquear o segundo grupo "
              "significa que a sua página não abre nem quando alguém a pede "
              "diretamente.</p>"
              "<p>Neste site, <a href=\"/robots.txt\">o robots.txt está aberto</a> para "
              "todos os grupos, de propósito. Não há nada privado aqui, e a decisão de "
              "liberar ou bloquear é do dono de cada site, não minha.</p>"),
        secao("html", "Parte 2: o conteúdo precisa estar no HTML",
              "<p>Este é o problema técnico que mais derruba site bonito. Quando o texto "
              "só aparece depois que o JavaScript roda, boa parte dos robôs de IA não "
              "vê nada: eles leem o HTML que o servidor entregou e vão embora.</p>"
              "<p>Buscadores tradicionais aprenderam a executar JavaScript em muitos "
              "casos, com atraso. Vários robôs de IA não executam. Resultado prático: "
              "um site feito em framework sem renderização no servidor pode estar "
              "perfeito para o visitante e vazio para o assistente.</p>"
              "<p>A verificação é simples e não precisa de ferramenta paga: abra o "
              "código-fonte da página, aquele que o servidor mandou, e procure uma "
              "frase do seu texto. Se não estiver lá, o robô também não vê. "
              "<a href=\"/pesquisa/#metodo\">Uso essa checagem no meu método</a>.</p>"),
        secao("estruturados", "Parte 3: dados estruturados e resposta direta",
              "<p>Dados estruturados são a tradução do conteúdo para um formato que a "
              "máquina lê sem adivinhar. Em vez de supor que aquele trecho é o nome do "
              "autor, ela recebe o campo dizendo que é. Uso o vocabulário Schema.org "
              "em JSON-LD, com os tipos que correspondem ao que a página realmente é: "
              "pessoa, organização, serviço, página de perguntas, relatório.</p>"
              "<p>Do lado do texto, o que mais ajuda é a forma: a pergunta como título "
              "e a resposta na primeira frase, antes do contexto. Assistentes extraem "
              "trecho curto. Um parágrafo que só chega à conclusão no fim entrega mal.</p>"
              "<p>Autoria e data também contam. Quem escreveu, quando publicou e quando "
              "revisou aparecem visíveis na página e marcados nos dados estruturados "
              "de todas as páginas deste site.</p>"),
        secao("producao", "Parte 4: onde a IA entra na produção, e onde não entra",
              "<p>A IA é ferramenta de produção aqui, não autora. Ela ajuda a destravar "
              "rascunho, gerar variação de título, organizar lista, revisar "
              "consistência de termo e acelerar tarefa repetitiva.</p>"
              "<p>O que permanece humano, sempre: a decisão do que a página precisa "
              "dizer, a checagem de cada afirmação factual, a definição do que é "
              "verdade sobre o seu negócio, e a leitura final linha por linha antes de "
              "publicar.</p>"
              "<p>O que eu não faço com IA: inventar depoimento, avaliação, número ou "
              "caso de sucesso; gerar fotografia que se passe por foto real do seu "
              "espaço ou da sua equipe; publicar texto que ninguém leu; nem produzir "
              "página em volume para preencher o site. Conteúdo gerado sem revisão "
              "costuma ser reconhecível, e o custo cai sobre a credibilidade do "
              "negócio, não da ferramenta.</p>"),
        secao("medir-ia", "Como checar se está funcionando",
              "<p>Não existe Search Console para assistente de IA, e por isso a "
              "checagem é mais artesanal. O que dá para fazer, em ordem:</p>"
              + passos([
                  ("Confirmar o acesso.", "O robots.txt está publicado no endereço "
                   "certo e libera os nomes que interessam."),
                  ("Confirmar o HTML.", "O código-fonte servido já contém o texto."),
                  ("Confirmar a marcação.", "O JSON-LD é válido e descreve a página "
                   "de verdade."),
                  ("Perguntar.", "Fazer ao ChatGPT, ao Gemini, ao Claude e à "
                   "Perplexity as perguntas que o seu cliente faria, e registrar se o "
                   "seu site aparece, com data."),
                  ("Repetir com intervalo.", "A resposta de um assistente varia com a "
                   "conversa e com o momento. Um teste isolado não é medição.")])
              + "<p class=\"nota\">Isso é acompanhamento, não garantia. Nenhum "
                "profissional controla o que um modelo responde.</p>"),
    ]),
    "faq": [
        ("Como faço meu site aparecer nas respostas do ChatGPT?",
         "<p>Não há caminho garantido, mas há obstáculos removíveis. Libere "
         "<code>GPTBot</code> e <code>OAI-SearchBot</code> no robots.txt, garanta que "
         "o texto esteja no HTML servido e não apenas depois do JavaScript, marque a "
         "página com dados estruturados, escreva a resposta na primeira frase de cada "
         "bloco e deixe autor e data visíveis. Depois disso, aparecer depende do "
         "modelo e da pergunta.</p>"),
        ("Bloquear os robôs de IA protege meu conteúdo?",
         "<p>Bloquear impede a coleta por quem respeita o robots.txt, e os principais "
         "respeitam. Em troca, você sai das respostas desses assistentes, inclusive "
         "quando alguém pede a sua página de propósito. Para site comercial que quer "
         "ser encontrado, o bloqueio costuma custar mais que entregar. Para conteúdo "
         "pago ou de acesso restrito, a conta é outra. É uma decisão do dono do site, "
         "e eu explico as duas consequências antes.</p>"),
        ("Dados estruturados fazem o site subir no Google?",
         "<p>Não diretamente. Dados estruturados não são fator de posição: eles "
         "ajudam a máquina a entender o conteúdo e habilitam apresentações especiais "
         "no resultado, quando o Google decide usá-las. O ganho real é de "
         "compreensão, e isso vale tanto para busca quanto para assistentes de IA.</p>"),
        ("Você usa IA para escrever o conteúdo do meu site?",
         "<p>Uso como ferramenta de rascunho e organização, com curadoria e revisão "
         "minha linha por linha, e sempre partindo de informação que veio de você. "
         "Nada é publicado sem leitura humana. E não invento depoimento, número, "
         "avaliação nem caso de sucesso, com IA ou sem.</p>"),
        ("Meu site é feito em React ou Next. Isso é problema para IA?",
         "<p>Pode ser, e depende de como foi construído. Se a página é renderizada no "
         "servidor ou gerada estaticamente, o HTML chega pronto e não há problema. Se "
         "o conteúdo só aparece depois do JavaScript no navegador, vários robôs de IA "
         "não veem o texto. A checagem é abrir o código-fonte servido e procurar uma "
         "frase sua.</p>"),
        ("Existe SEO para IA? É diferente de SEO?",
         "<p>Em grande parte é a mesma coisa com ênfase diferente. O que vale para "
         "busca continua valendo: conteúdo útil, estrutura clara, site rastreável. O "
         "que ganha peso é a forma da resposta, porque o assistente extrai trecho "
         "curto, e a liberação explícita dos robôs de IA, que não existia na lista "
         "de tarefas de SEO alguns anos atrás.</p>"),
    ],
    "fontes": [F_OPENAI, F_CRAWLERS, F_ROBOTS, F_SD, F_SCHEMA, F_CONTEUDO],
    "relacionados": [
        ("/pesquisa/", "Pesquisa própria de presença digital",
         "O método de checagem aplicado a dois sites reais."),
        ("/criacao-de-sites-profissionais/", "Criação de sites profissionais",
         "A base técnica que vem incluída em cada projeto."),
        ("/perguntas-frequentes/", "Perguntas frequentes",
         "Tudo reunido, de preço a indexação."),
        ("/sobre/", "Sobre Jacque Platon",
         "Quem assina o conteúdo e o que é declaração, não comprovação."),
    ],
    "cta": ("Quer saber se o seu site hoje é legível por assistentes de IA? "
            "Me manda o endereço."),
    "schema_extra": [no_servico(
        "sites-com-inteligencia-artificial",
        "Preparação de sites para busca com inteligência artificial e produção com IA",
        "Consultoria e desenvolvimento para visibilidade em assistentes de IA",
        "Liberação de robôs de IA, entrega de conteúdo em HTML renderizado, dados "
        "estruturados Schema.org, respostas diretas, autoria e datas, além de produção "
        "digital com IA sob curadoria e revisão humana.")],
}


# ===========================================================================
# /sobre/  — informações do autor (item 15)
# ===========================================================================
SOBRE = {
    "slug": "sobre",
    "trilha": trilha_de("sobre", "Sobre Jacque Platon"),
    "titulo": "Sobre Jacque Platon, estrategista digital | Natal, RN",
    "descricao": ("Quem é Jacque Platon: atuação em marketing e presença digital, sites "
                  "publicados, o que é declaração e o que é verificável por você "
                  "mesmo."),
    "eyebrow": "SOBRE O AUTOR",
    "h1": "Jacque Platon<span class=\"accent\">.</span><br>Estrategista digital.",
    "h1_texto": "Sobre Jacque Platon, estrategista digital",
    "lead": ("Trabalho com marketing e presença digital: sites, organização de páginas "
             "para busca e inteligência artificial aplicada com revisão humana. Esta "
             "página existe para você saber quem assina o que está escrito aqui."),
    "tipo_schema": "ProfilePage",
    "sobre_org": False,
    "palavras": "Jacque Platon, estrategista digital, Natal RN, criação de sites",
    "resposta_rapida": (
        "<p><strong>Jacque Platon</strong> atua com marketing e presença digital, "
        "criando sites profissionais, organizando páginas para o Google e aplicando "
        "inteligência artificial com curadoria e revisão humana. Atendimento a "
        "distância, com dois sites publicados em domínio próprio para negócios do Rio "
        "Grande do Norte.</p>"
        "<p>Perfil público: <a href=\"__INSTAGRAM__\" rel=\"me noopener noreferrer\" "
        "target=\"_blank\">@jacqueplatonmkt</a>, identificador que aparece nos créditos "
        "dos dois sites publicados.</p>"),
    "secoes": "".join([
        secao("trajetoria", "Trajetória", "".join([
            "<p>Atuo com marketing e presença digital, combinando experiência em "
            "soluções Google, desenvolvimento de sites e tecnologias novas para "
            "ajudar empresas a se posicionarem melhor na internet. O trabalho começa "
            "entendendo o negócio e termina em uma solução que apresenta os serviços, "
            "facilita o contato e abre oportunidade comercial.</p>",
            lista([
                "<strong>Aproximadamente 12 anos</strong> de atuação em marketing.",
                "<strong>Desde 2019</strong>, experiência com soluções Google.",
                "<strong>Dois sites publicados</strong> em domínio próprio, para "
                "negócios do Rio Grande do Norte.",
            ]),
            "<p class=\"nota\"><strong>Importante, e dito de propósito:</strong> o tempo "
            "de atuação e a experiência com soluções Google são declarações minhas. "
            "Não são certificação, parceria oficial, nem vínculo empregatício com o "
            "Google. Qualquer pessoa que apresente «especialista Google» como se fosse "
            "credencial emitida pela empresa está confundindo as coisas, e eu prefiro "
            "não confundir.</p>",
        ])),
        secao("verificavel", "O que é verificável por você mesmo",
              "<p>Prefiro que você confira em vez de acreditar. O que está publicado e "
              "aberto a conferência:</p>"
              + lista([
                  "<a href=\"__PITBULL__\" rel=\"noopener noreferrer\" "
                  "target=\"_blank\">pitbullboxrn.com.br</a> — site de academia e artes "
                  "marciais, com crédito de desenvolvimento no rodapé apontando para "
                  "@jacqueplatonmkt.",
                  "<a href=\"__VISUAL__\" rel=\"noopener noreferrer\" "
                  "target=\"_blank\">visualbonespersonalizados.com.br</a> — site "
                  "comercial de produtos personalizados, com o mesmo crédito no rodapé.",
                  "<a href=\"__INSTAGRAM__\" rel=\"me noopener noreferrer\" "
                  "target=\"_blank\">@jacqueplatonmkt</a> — perfil público, o mesmo "
                  "identificador dos créditos.",
              ])
              + "<p>E o que <strong>não</strong> está aqui, porque não foi comprovado: "
                "número de clientes, faturamento, posição alcançada no Google, "
                "depoimento, prêmio, certificação e selo. Se não aparece, é porque não "
                "tem comprovação, não porque foi esquecido.</p>"),
        secao("criterios", "Critérios do conteúdo deste site", lista([
            "<strong>Toda página tem autor e data.</strong> Publicação e última revisão "
            "aparecem visíveis, em texto e nos dados estruturados.",
            "<strong>Afirmação factual leva fonte.</strong> Quando cito como um buscador "
            "ou um robô funciona, o link vai para a documentação oficial de quem o "
            "mantém, não para blog de terceiros.",
            "<strong>Limite declarado junto com o resultado.</strong> Quando eu observo "
            "algo, digo quando observei e o que não foi medido.",
            "<strong>Sem promessa de posição.</strong> Nem no Google, nem em assistente "
            "de IA. Dá para preparar; garantir, não.",
            "<strong>IA sob revisão.</strong> Uso IA como ferramenta de produção, com "
            "curadoria e leitura humana antes de publicar.",
            "<strong>Revisão a cada seis meses, no mínimo.</strong> Conteúdo "
            "desatualizado é corrigido ou removido, e a data de revisão muda junto.",
        ])),
        secao("contato-autor", "Como falar comigo",
              "<p>O canal aberto hoje é o Instagram "
              "<a href=\"__INSTAGRAM__\" rel=\"me noopener noreferrer\" "
              "target=\"_blank\">@jacqueplatonmkt</a>, e o "
              "<a href=\"/#contato\">formulário da página inicial</a>, que monta a "
              "mensagem na tela para você revisar e enviar.</p>"
              "<p class=\"nota\">O envio automático por WhatsApp ainda não está "
              "ativo neste site: o número comercial está em confirmação. Preferi "
              "deixar o canal de fora a publicar um número que pode estar errado.</p>"),
    ]).replace("__PITBULL__", PITBULL).replace("__VISUAL__", VISUAL)
      .replace("__INSTAGRAM__", INSTAGRAM),
    "faq": [
        ("Você é funcionário ou parceiro oficial do Google?",
         "<p>Não. Tenho experiência com soluções Google desde 2019, por declaração "
         "própria, e isso não é vínculo empregatício, certificação nem parceria "
         "oficial. Qualquer menção a Google neste site se refere a produtos que eu "
         "uso e configuro, como a busca e o Perfil da Empresa.</p>"),
        ("Você trabalha sozinho?",
         "<p>Sim, o atendimento e a execução são meus, com inteligência artificial "
         "como ferramenta de produção e revisão humana em tudo que é publicado. "
         "Quando um projeto exige especialidade que não é minha, como fotografia "
         "profissional ou um motor de reservas, eu digo e indico contratar à parte, "
         "em vez de improvisar.</p>"),
        ("Por que o site não mostra sua foto?",
         "<p>Porque a fotografia original ainda não entrou. Prefiro o espaço reservado "
         "com o monograma a uma imagem de banco ou gerada por IA passando por retrato "
         "real. Quando a foto chegar, ela substitui o espaço.</p>"),
        ("Posso usar o conteúdo deste site?",
         "<p>Pode citar e compartilhar, com crédito e link para a página de origem. Os "
         "robôs de busca e de IA estão liberados de propósito no "
         "<a href=\"/robots.txt\">robots.txt</a>: se um assistente usar este conteúdo "
         "para responder alguém, está cumprindo a função. Republicar a página inteira "
         "como se fosse de outro autor, não.</p>"),
    ],
    "faq_titulo": "Perguntas sobre o autor",
    "fontes": [F_CONTEUDO],
    "relacionados": [
        ("/pesquisa/", "Pesquisa própria de presença digital",
         "O trabalho de análise que eu assino, com método aberto."),
        ("/sites-com-inteligencia-artificial/", "Sites com inteligência artificial",
         "Onde a IA entra e onde ela não entra."),
        ("/#projetos", "Projetos publicados",
         "Os dois sites, com capturas e limites declarados."),
        ("/perguntas-frequentes/", "Perguntas frequentes",
         "Preço, prazo, Google, IA e indexação."),
    ],
    "cta": "Se fizer sentido conversar, o primeiro passo é me contar o que o seu negócio faz.",
    "changefreq": "yearly",
    "priority": "0.6",
}


# ===========================================================================
# /pesquisa/  — pesquisa original (item 19)
# ===========================================================================
PESQUISA_TABELA = """
<div class="tabela-rolagem"><table>
<caption>Recursos observados nos dois sites em 3 de novembro de 2026. «Sim» significa
presente na página pública; não significa testado nem medido.</caption>
<thead><tr><th scope="col">Recurso</th><th scope="col">Pitbull Box RN</th>
<th scope="col">Visual Bonés</th></tr></thead>
<tbody>
<tr><th scope="row">Domínio próprio</th><td>Sim</td><td>Sim</td></tr>
<tr><th scope="row">Serviços ou produtos descritos um a um</th><td>Sim, seis modalidades</td><td>Sim, por tipo de personalização</td></tr>
<tr><th scope="row">Fotografia própria do negócio</th><td>Sim, com vídeos de treino</td><td>Sim, fotos de produto</td></tr>
<tr><th scope="row">Formulário de contato na página</th><td>Sim</td><td>Sim</td></tr>
<tr><th scope="row">Campos pensados para o atendimento</th><td>Modalidade, dia, período, experiência</td><td>Finalidade, quantidade, mensagem</td></tr>
<tr><th scope="row">Perguntas frequentes na página</th><td>Não observado</td><td>Sim</td></tr>
<tr><th scope="row">Contato flutuante em celular</th><td>Sim</td><td>Sim</td></tr>
<tr><th scope="row">Leitura em 390 px sem rolagem lateral</th><td>Sim</td><td>Sim</td></tr>
<tr><th scope="row">Menu compacto em celular</th><td>Sim</td><td>Sim</td></tr>
<tr><th scope="row">Crédito de desenvolvimento no rodapé</th><td>Sim, @jacqueplatonmkt</td><td>Sim, @jacqueplatonmkt</td></tr>
<tr><th scope="row">Checkout ou pagamento on-line</th><td>Não se aplica</td><td>Não observado</td></tr>
</tbody></table></div>
"""

PESQUISA = {
    "slug": "pesquisa",
    "trilha": trilha_de("pesquisa", "Pesquisa de presença digital"),
    "titulo": "Como dois negócios do RN apresentam serviços na web",
    "descricao": ("Análise de primeira mão de dois sites do Rio Grande do Norte, em 3 "
                  "de novembro de 2026: método, recursos observados, renderização em "
                  "390 px e o que não foi medido."),
    "eyebrow": "PESQUISA PRÓPRIA / 03 NOV 2026",
    "h1": "Como dois negócios do RN<br>apresentam seus serviços na web<span class=\"accent\">.</span>",
    "h1_texto": ("Como dois negócios do Rio Grande do Norte apresentam seus serviços na "
                 "web: análise de primeira mão"),
    "lead": ("Levantamento direto de dois sites publicados em domínio próprio, com "
             "método descrito, data de observação e limites declarados. Nenhum número "
             "de tráfego, venda ou posição foi usado, porque nenhum foi medido."),
    "tipo_schema": "WebPage",
    "mainEntity": "#relatorio",
    "og_tipo": "article",
    "palavras": ("pesquisa de presença digital, análise de sites, Rio Grande do Norte, "
                 "renderização mobile, método"),
    "resposta_rapida": (
        "<p><strong>O que foi feito:</strong> inspeção direta das páginas públicas de "
        "dois sites do RN, em desktop e em um frame de 390 × 844 px, com registro em "
        "captura de tela, em <time datetime=\"2026-11-03\">3 de novembro de 2026</time>.</p>"
        "<p><strong>Principal achado:</strong> os dois sites resolvem bem a parte que "
        "mais costuma faltar em negócio pequeno, que é descrever o serviço um a um e "
        "oferecer um caminho de contato com os campos que o atendimento realmente usa. "
        "Os dois também mantêm a leitura em coluna única a 390 px sem rolagem lateral.</p>"
        "<p><strong>O que não foi medido:</strong> tráfego, conversão, posição em "
        "buscas, velocidade em aparelho físico, entrega de mensagem e desempenho "
        "comercial. Nenhuma dessas informações aparece neste site.</p>"),
    "secoes": "".join([
        secao("metodo", "Método", "".join([
            "<p>O levantamento é de observação pública. Qualquer pessoa pode repetir com "
            "um navegador, e é essa a intenção de publicar o método.</p>",
            passos([
                ("Acesso direto às páginas.", "Consulta aos dois endereços finais, com "
                 "navegação por todas as seções da página pública."),
                ("Registro em desktop.", "Captura em 1348 × 926 px, sem recorte "
                 "editorial do conteúdo."),
                ("Registro em celular.", "Os mesmos sites carregados em frame de "
                 "390 × 844 px, que é renderização responsiva real, não fotografia de "
                 "aparelho, emulação completa de dispositivo nem imagem gerada."),
                ("Inventário de recursos.", "Anotação do que está presente na página: "
                 "seções, campos de formulário, canais de contato, provas visuais."),
                ("Verificação de crédito.", "Leitura do rodapé para confirmar o "
                 "identificador de quem desenvolveu."),
                ("Checagem de busca.", "Seis expressões pesquisadas na web para "
                 "verificar o que aparece publicamente sobre a marca."),
            ]),
            "<p>A pesquisa <strong>não</strong> acessou Analytics, Search Console, "
            "painel do Google, conta privada nem lista de seguidores. Não equivale a "
            "um levantamento completo da página de resultados do Google, nem a uma "
            "medição de posição localizada em Natal.</p>",
        ])),
        secao("resultados", "Recursos observados", PESQUISA_TABELA),
        secao("pitbull", "Site 1: academia e artes marciais",
              "<p>Site institucional em domínio próprio, identidade visual em preto, "
              "vermelho e branco, com títulos de grande impacto.</p>"
              "<p>A página organiza seis modalidades, boxe, muay thai, jiu-jitsu, "
              "no-gi, jiu-jitsu kids e cross training, com galerias de treino em foto "
              "e vídeo, seção de estrutura do espaço e consulta de horários. O caminho "
              "comercial é a aula experimental, com botão por modalidade e formulário "
              "que recolhe nome, WhatsApp opcional, modalidade, dia, período e "
              "experiência anterior. A própria interface explica que o atendimento "
              "confirma a disponibilidade, em vez de prometer vaga automática.</p>"
              "<p>A 390 px, o menu vira compacto, o conteúdo passa a coluna única e a "
              "chamada de aula experimental permanece alcançável, junto com o contato "
              "flutuante.</p>"
              "<p class=\"nota\"><strong>Não verificado:</strong> nenhum agendamento "
              "foi enviado. Entrega da mensagem, disponibilidade real das turmas, "
              "desempenho comercial, velocidade em aparelho físico e posição em buscas "
              "ficaram fora do escopo. "
              "<a href=\"/sites-para-academias/\">O que isso ensina sobre site de "
              "academia</a>.</p>"),
        secao("visual", "Site 2: produtos personalizados",
              "<p>Site comercial em domínio próprio, com identidade em branco, vermelho "
              "e azul escuro de tonalidade arroxeada, fotografia de produto e títulos "
              "de grande escala.</p>"
              "<p>O conteúdo apresenta personalização para empresas, eventos e grupos, "
              "com exemplos de aba curva, modelo trucker em tela, aplicação de marca e "
              "bordado. O caminho comercial é o orçamento: vitrine com fotografias, "
              "chamadas de orçamento, perguntas frequentes na própria página e "
              "formulário com nome, WhatsApp, finalidade, quantidade estimada e "
              "mensagem. A interface informa que a mensagem é preparada para envio.</p>"
              "<p>A 390 px, o conteúdo fica em coluna única, com menu compacto e "
              "chamada de orçamento legível; a fotografia de destaque aparece abaixo da "
              "apresentação em texto.</p>"
              "<p class=\"nota\"><strong>Não verificado:</strong> não há comprovação de "
              "checkout, pagamento, estoque ou compra concluída. O site funciona como "
              "vitrine com pedido de orçamento, e é assim que deve ser apresentado, "
              "não como loja virtual completa.</p>"),
        secao("busca-marca", "O que a busca pública mostrou sobre a marca",
              "<p>Seis expressões foram pesquisadas: o nome completo, o nome com "
              "«sites», com «Google», com «marketing», com «inteligência artificial», e "
              "o identificador «jacqueplatonmkt».</p>"
              "<p>O resultado mais sólido foi a confirmação do identificador nos rodapés "
              "dos dois sites, que é a evidência pública mais direta ligando o "
              "profissional aos trabalhos. Houve menções nominais em agregadores de "
              "avaliação, mas sem ligação suficiente ao identificador oficial para "
              "confirmar identidade, e por isso elas não foram adotadas como "
              "credencial, relação comercial ou histórico profissional.</p>"
              "<p class=\"nota\">Uma amostra limitada de busca não permite concluir que "
              "a marca não esteja indexada, nem prometer ganho de alcance. "
              "<a href=\"/sobre/\">O que é declaração e o que é verificável</a>.</p>"),
        secao("conclusao", "O que eu tirei disso para o meu próprio trabalho",
              "<p>Três conclusões práticas, que viraram método e estão aplicadas neste "
              "site:</p>"
              + lista([
                  "<strong>Descrever serviço um a um resolve mais que design.</strong> "
                  "Nos dois casos, o que torna a página útil é cada modalidade ou cada "
                  "tipo de personalização ter texto próprio.",
                  "<strong>O formulário precisa ter os campos do atendimento.</strong> "
                  "Dia e período na academia, finalidade e quantidade no produto "
                  "personalizado. Formulário genérico obriga uma segunda rodada de "
                  "perguntas.",
                  "<strong>Dizer o que não está garantido aumenta a confiança.</strong> "
                  "Os dois sites informam que a confirmação vem no atendimento, em vez "
                  "de prometer automação que não existe.",
              ])),
        secao("historico", "Histórico de revisões desta página",
              "<p>Esta página é atualizada quando os sites analisados mudam ou quando "
              "uma nova observação é feita. O registro fica aqui, aberto:</p>"
              + lista([
                  "<time datetime=\"2026-11-03\">3 de novembro de 2026</time> — "
                  "primeira publicação, com a observação dos dois sites em desktop e "
                  "em 390 px, inventário de recursos e checagem de busca da marca.",
              ])
              + "<p>Próxima revisão prevista: até seis meses após a última data acima. "
                "Se os sites mudarem antes, a observação é refeita e a data de revisão "
                "muda junto.</p>"),
    ]),
    "faq": [
        ("Esta pesquisa mediu resultados de vendas ou tráfego?",
         "<p>Não. É uma análise do que está publicado nas páginas, observada em uma "
         "data específica. Tráfego, conversão, vendas e posição em buscas não foram "
         "medidos, e por isso nenhum número desse tipo aparece em nenhuma página "
         "deste site.</p>"),
        ("Por que a captura de celular não é foto de um aparelho?",
         "<p>Porque o que interessa é como o site se comporta na largura de um "
         "celular, e isso é verificável carregando o site em um frame de 390 × 844 px. "
         "Foto de aparelho acrescenta moldura, reflexo e recorte, sem acrescentar "
         "informação. As molduras que aparecem no portfólio são ilustrativas, "
         "aplicadas por cima da captura real.</p>"),
        ("Dá para repetir esta análise em outro site?",
         "<p>Dá, e é o objetivo de publicar o método. Com um navegador você acessa a "
         "página, lista o que está presente, reduz a janela para 390 px de largura e "
         "confere se há rolagem lateral, e abre o código-fonte para ver se o texto "
         "chega pronto do servidor. É assim que eu começo todo diagnóstico.</p>"),
    ],
    "faq_titulo": "Perguntas sobre esta pesquisa",
    "fontes": [F_VITALS, F_CONTEUDO, F_GSC],
    "relacionados": [
        ("/sites-para-academias/", "Sites para academias",
         "O que o caso da academia ensina sobre estrutura de página."),
        ("/sites-com-inteligencia-artificial/", "Sites com inteligência artificial",
         "A checagem de HTML renderizado que uso no diagnóstico."),
        ("/sobre/", "Sobre Jacque Platon",
         "Quem assina a pesquisa e quais são os critérios."),
        ("/criacao-de-sites-profissionais/", "Criação de sites profissionais",
         "Como o método virou processo de projeto."),
    ],
    "cta": ("Quer esse mesmo olhar no seu site? Me manda o endereço e eu devolvo o que "
            "encontrei, com data e limites."),
    "changefreq": "monthly",
    "priority": "0.8",
    "schema_extra": [{
        "@type": "Report",
        "@id": DOMINIO + "/pesquisa/#relatorio",
        "name": ("Como dois negócios do Rio Grande do Norte apresentam seus serviços "
                 "na web"),
        "headline": ("Análise de primeira mão de dois sites publicados no Rio Grande do "
                     "Norte"),
        "url": DOMINIO + "/pesquisa/",
        "author": {"@id": DOMINIO + "/#jacque-platon"},
        "publisher": {"@id": DOMINIO + "/#organizacao"},
        "datePublished": "2026-11-03",
        "dateModified": ATUALIZADO,
        "inLanguage": "pt-BR",
        "abstract": ("Inspeção direta das páginas públicas de dois sites do Rio Grande "
                     "do Norte, em desktop e em frame de 390 × 844 px, com inventário "
                     "de recursos, verificação de crédito de desenvolvimento e checagem "
                     "de busca da marca. Sem medição de tráfego, conversão ou posição."),
        "mainEntityOfPage": {"@id": DOMINIO + "/pesquisa/#webpage"},
        "isBasedOn": [PITBULL, VISUAL],
        "about": [
            {"@type": "Thing", "name": "Presença digital de negócios locais"},
            {"@type": "Thing", "name": "Renderização responsiva em 390 pixels"},
        ],
        "keywords": ("análise de sites, presença digital, Rio Grande do Norte, "
                     "renderização mobile"),
    }],
}


# ===========================================================================
# /perguntas-frequentes/  (itens 12 e 13)
# ===========================================================================
FAQ_PAGINA = [
    ("Como funciona o primeiro contato?",
     "<p>Você conta o que o negócio faz e o que precisa resolver, por mensagem ou em "
     "uma chamada. Dessa conversa sai um diagnóstico com escopo, prazo e valor por "
     "escrito. Só depois disso começa qualquer trabalho. O diagnóstico inicial não "
     "obriga você a fechar.</p>"),
    ("Quanto custa e por que o preço não está no site?",
     "<p>O preço sai no diagnóstico, porque depende do número de páginas, do conteúdo "
     "que já existe, das fotos disponíveis e dos recursos pedidos. Publicar «a partir "
     "de X» ajudaria a aparecer na busca e atrapalharia você: o valor de uma landing "
     "page e de um site com seis páginas de serviço não têm relação. Prefiro dizer o "
     "número certo depois de entender, e por escrito.</p>"),
    ("Qual o prazo de entrega?",
     "<p>O prazo é combinado por projeto e depende sobretudo de quando o material "
     "chega: logotipo, fotos, lista de serviços e informações de contato. A parte sob "
     "meu controle entra no combinado por escrito; a espera por material não conta "
     "como prazo meu, e eu digo isso no começo para não haver surpresa.</p>"),
    ("Você garante a primeira página do Google?",
     "<p>Não, e nenhum profissional honesto garante. Posição depende do algoritmo do "
     "Google, da concorrência no seu termo e do comportamento de quem pesquisa, três "
     "coisas que ninguém controla. O que eu garanto é a parte técnica: site "
     "rastreável, robots liberados, sitemap enviado, títulos e descrições próprios, "
     "dados estruturados e conteúdo que responde o que o seu cliente pergunta. "
     "<a href=\"/criacao-de-sites-natal-rn/\">Como isso funciona na busca local</a>.</p>"),
    ("Meu site pode aparecer nas respostas do ChatGPT, do Gemini ou da Perplexity?",
     "<p>Pode, e não há garantia. O que dá para fazer é remover obstáculos: liberar os "
     "robôs de IA nominalmente no robots.txt, entregar o conteúdo já pronto no HTML, "
     "marcar a página com Schema.org, responder na primeira frase de cada bloco e "
     "deixar autor e data visíveis. "
     "<a href=\"/sites-com-inteligencia-artificial/\">Explico cada passo aqui</a>.</p>"),
    ("Preciso registrar um domínio? Quem paga?",
     "<p>Recomendo domínio próprio em todos os casos, porque é o endereço que fica seu "
     "se você trocar de hospedagem ou de profissional. O registro é anual e pago "
     "direto ao registrador, no seu nome e no seu cartão. Eu não registro domínio no "
     "meu nome: isso deixa você dependente de mim, e não é assim que deve ser.</p>"),
    ("Quanto custa manter o site no ar?",
     "<p>Há dois custos recorrentes, e os dois são pagos por você direto ao fornecedor: "
     "o registro do domínio, anual, e a hospedagem, que para site estático pode ser de "
     "custo muito baixo ou gratuita em plataformas como Vercel e Netlify. Não cobro "
     "mensalidade obrigatória de manutenção; se você quiser revisão periódica, isso é "
     "combinado à parte.</p>"),
    ("O site funciona bem no celular?",
     "<p>É onde a maior parte dos visitantes chega, então é por onde eu reviso. Na "
     "prática isso significa leitura em coluna única, menu compacto, chamada de "
     "contato alcançável com o polegar e nenhuma rolagem lateral em largura de "
     "390 px. Essa checagem está documentada na "
     "<a href=\"/pesquisa/#metodo\">minha pesquisa</a>.</p>"),
    ("Vocês cuidam de texto e foto ou eu preciso enviar?",
     "<p>O texto eu escrevo e reviso, partindo das informações que vêm de você: não "
     "invento serviço, preço nem diferencial. Fotografia é diferente: foto original "
     "do seu espaço, produto ou equipe vale muito mais que banco de imagens, e isso "
     "só você tem. Quando não há foto nenhuma, eu digo que vale contratar uma sessão "
     "em vez de preencher a página com imagem genérica.</p>"),
    ("Você usa inteligência artificial no trabalho? Em quê?",
     "<p>Uso como ferramenta de produção: rascunho, variação de título, organização de "
     "lista, revisão de consistência. A direção, a checagem dos fatos e a leitura "
     "final são minhas, linha por linha. Não publico texto que ninguém leu, não gero "
     "foto que se passe por real e não invento depoimento, avaliação ou número.</p>"),
    ("Eu já tenho um site. Vale refazer ou dá para ajustar?",
     "<p>Depende do que existe, e a resposta vem de uma leitura antes de qualquer "
     "proposta: estrutura, conteúdo, leitura em celular, velocidade e situação de "
     "indexação. Se a base serve, reorganizar custa menos que refazer, e eu digo isso "
     "mesmo sendo o orçamento menor. Se não serve, explico o motivo em vez de "
     "recomeçar por padrão.</p>"),
    ("Você atende fora do Rio Grande do Norte?",
     "<p>Sim. Todas as etapas funcionam a distância, por mensagem e chamada: "
     "diagnóstico, envio de material, aprovação por link e publicação acompanhada. Os "
     "dois sites publicados no portfólio são de negócios do RN, e isso não limita o "
     "atendimento.</p>"),
    ("Você tem certificação do Google?",
     "<p>Não apresento certificação, parceria oficial nem vínculo com o Google. Tenho "
     "experiência com soluções Google desde 2019, por declaração própria, e faço "
     "questão de deixar a diferença clara. "
     "<a href=\"/sobre/\">O que é declaração e o que é verificável</a>.</p>"),
    ("Posso ver clientes anteriores e resultados?",
     "<p>Pode ver os dois sites publicados, com o crédito de desenvolvimento no "
     "rodapé de cada um, nos <a href=\"/#projetos\">projetos</a>. O que você não vai "
     "encontrar aqui é número de vendas, de visitas ou de posição alcançada: nada "
     "disso foi medido, e preferi não publicar estimativa como se fosse resultado. "
     "<a href=\"/pesquisa/\">A análise que eu fiz dos dois sites está aberta</a>, com "
     "método e limites.</p>"),
    ("Por que não tem WhatsApp no site?",
     "<p>Porque o número comercial ainda está em confirmação, e publicar um número "
     "errado é pior que não publicar nenhum. O canal aberto hoje é o Instagram "
     "<a href=\"__INSTAGRAM__\" rel=\"me noopener noreferrer\" target=\"_blank\">"
     "@jacqueplatonmkt</a> e o formulário da página inicial, que monta a mensagem na "
     "tela para você revisar e enviar.</p>"),
    ("Como eu sei se o trabalho funcionou?",
     "<p>Pelos dados de quem é dono da informação: o Google Search Console e o Bing "
     "Webmaster Tools mostram quais páginas foram indexadas e quais consultas trouxeram "
     "visitantes, de graça e sem intermediário. Do lado comercial, a medida é quantas "
     "conversas chegaram ao seu atendimento. Eu conecto as ferramentas e explico como "
     "ler; os números são seus, não meus.</p>"),
]

PERGUNTAS = {
    "slug": "perguntas-frequentes",
    "trilha": trilha_de("perguntas-frequentes", "Perguntas frequentes"),
    "titulo": "Perguntas frequentes sobre sites, Google e IA | Jacque Platon",
    "descricao": ("Preço, prazo, domínio, hospedagem, posição no Google, citação por "
                  "assistentes de IA e o que não é prometido. Respostas diretas, "
                  "sem rodeio."),
    "eyebrow": "PERGUNTAS FREQUENTES",
    "h1": "Perguntas frequentes<span class=\"accent\">.</span>",
    "h1_texto": "Perguntas frequentes sobre criação de sites, Google e inteligência artificial",
    "lead": ("As dúvidas que mais chegam antes de um projeto começar, respondidas na "
             "primeira frase. Quando a resposta completa está em outra página, o link "
             "está no fim dela."),
    "tipo_schema": "FAQPage",
    "mainEntity": "#faq",
    "palavras": ("perguntas frequentes, quanto custa um site, prazo, domínio, "
                 "posição no Google, ChatGPT"),
    "resposta_rapida": (
        "<p>Resumo do que você provavelmente veio procurar: <strong>preço e prazo saem "
        "no diagnóstico, por escrito, antes de começar</strong>; <strong>o domínio é "
        "registrado no seu nome</strong>; <strong>não há promessa de posição no Google "
        "nem de citação por IA</strong>; e <strong>inteligência artificial é usada "
        "como ferramenta de produção, com revisão humana em tudo que é publicado</strong>.</p>"),
    "secoes": "",
    "faq": [(p, r.replace("__INSTAGRAM__", INSTAGRAM)) for p, r in FAQ_PAGINA],
    "faq_titulo": "Todas as perguntas",
    "fontes": [F_GSC, F_BING, F_CONTEUDO, F_OPENAI],
    "relacionados": [
        ("/criacao-de-sites-profissionais/", "Criação de sites profissionais",
         "Etapas, o que está incluído e o que não é prometido."),
        ("/sites-com-inteligencia-artificial/", "Sites com inteligência artificial",
         "Como preparar o site para ser lido e citado por IA."),
        ("/google-meu-negocio/", "Perfil da Empresa no Google",
         "O que preencher e o que revisar no perfil."),
        ("/sobre/", "Sobre Jacque Platon",
         "Quem responde, e quais são os critérios do conteúdo."),
    ],
    "cta": ("Ficou uma pergunta que não está aqui? Manda que eu respondo, e se for "
            "comum ela entra nesta página."),
    "changefreq": "monthly",
    "priority": "0.9",
}


# ===========================================================================
# 404
# ===========================================================================
PAGINA_404 = {
    "slug": "404",
    "url_absoluta": DOMINIO + "/404.html",
    "sem_canonical": True,
    "trilha": [],
    "titulo": "Página não encontrada | Jacque Platon",
    "descricao": ("Esta página não existe ou mudou de endereço. Abaixo está o mapa "
                  "completo do site, com todas as páginas disponíveis."),
    "robots": "noindex,follow",
    "eyebrow": "ERRO 404",
    "h1": "Esta página não existe<span class=\"accent\">.</span>",
    "h1_texto": "Página não encontrada",
    "lead": ("O endereço pode ter mudado ou ter sido digitado com um caractere a mais. "
             "Abaixo estão todas as páginas do site."),
    "sobre_org": False,
    "secoes": secao("mapa-404", "Para onde ir", lista([
        "<a href=\"/\">Página inicial</a> — marca, soluções, projetos e contato.",
        "<a href=\"/criacao-de-sites-profissionais/\">Criação de sites profissionais</a>",
        "<a href=\"/criacao-de-sites-natal-rn/\">Criação de sites em Natal, RN</a>",
        "<a href=\"/sites-para-academias/\">Sites para academias</a>",
        "<a href=\"/sites-para-pousadas-e-hoteis/\">Sites para pousadas e hotéis</a>",
        "<a href=\"/google-meu-negocio/\">Perfil da Empresa no Google</a>",
        "<a href=\"/sites-com-inteligencia-artificial/\">Sites com inteligência artificial</a>",
        "<a href=\"/perguntas-frequentes/\">Perguntas frequentes</a>",
        "<a href=\"/pesquisa/\">Pesquisa própria de presença digital</a>",
        "<a href=\"/sobre/\">Sobre Jacque Platon</a>",
    ])),
    "cta": "Se você chegou aqui por um link meu que está quebrado, me avise.",
}


# ---------------------------------------------------------------------------
# Ordem das páginas no sitemap e no site
# ---------------------------------------------------------------------------
PAGINAS = [HOME, SITES_PRO, NATAL, ACADEMIAS, POUSADAS, GBP, IA,
           PERGUNTAS, PESQUISA, SOBRE]
