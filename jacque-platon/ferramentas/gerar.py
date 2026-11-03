#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gerador das páginas estáticas do site Jacque Platon.

Por que existe: o site tem 10 páginas que compartilham cabeçalho, menu, rodapé
e estrutura de <head>. Escrever isso dez vezes à mão garante que uma hora as
páginas fiquem diferentes entre si. Aqui o conteúdo de cada página fica em um
só lugar (conteudo.py) e o HTML é gerado igual para todas.

O HTML gerado é commitado no repositório. A hospedagem NÃO precisa rodar nada:
são arquivos estáticos. Este script só é necessário quando você for mudar
conteúdo, menu ou rodapé.

Uso:
    python3 ferramentas/gerar.py

Depois de rodar, confira com:
    python3 ferramentas/verificar.py
"""

import json
import os
import sys
from datetime import date

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# ---------------------------------------------------------------------------
# Domínio. Está em UM lugar só. Para trocar, rode ferramentas/trocar-dominio.sh
# ---------------------------------------------------------------------------
DOMINIO = "https://jacquepatonmkt.com.br"

INSTAGRAM = "https://www.instagram.com/jacqueplatonmkt/"
AUTOR = "Jacque Platon"

# Datas de publicação e de última revisão do site.
# Atualize PUBLICADO somente na primeira publicação real.
PUBLICADO = "2026-11-03"
ATUALIZADO = "2026-11-03"

MESES = ["", "janeiro", "fevereiro", "março", "abril", "maio", "junho",
         "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"]


def data_legivel(iso):
    """2026-11-03 -> 3 de novembro de 2026"""
    a, m, d = (int(x) for x in iso.split("-"))
    return "%d de %s de %d" % (d, MESES[m], a)


def url(slug):
    """'' -> https://dominio/   |  'sobre' -> https://dominio/sobre/"""
    return DOMINIO + "/" if slug == "" else DOMINIO + "/" + slug + "/"


def caminho(slug):
    """Caminho relativo da raiz do site, usado nos links internos."""
    return "/" if slug == "" else "/" + slug + "/"


def esc(t):
    return (t.replace("&", "&amp;").replace("<", "&lt;")
             .replace(">", "&gt;").replace('"', "&quot;"))


# ---------------------------------------------------------------------------
# Menu principal — um só, igual em todas as páginas (item 18, links internos)
# ---------------------------------------------------------------------------
MENU = [
    ("/sobre/", "Sobre"),
    ("/#servicos", "Soluções"),
    ("/#projetos", "Projetos"),
    ("/pesquisa/", "Pesquisa"),
    ("/perguntas-frequentes/", "Perguntas"),
]

# Rodapé: mapa do site visível, para pessoas e para robôs (itens 5 e 18)
RODAPE_MAPA = [
    ("Soluções", [
        ("/criacao-de-sites-profissionais/", "Criação de sites profissionais"),
        ("/criacao-de-sites-natal-rn/", "Criação de sites em Natal, RN"),
        ("/sites-para-academias/", "Sites para academias"),
        ("/sites-para-pousadas-e-hoteis/", "Sites para pousadas e hotéis"),
        ("/google-meu-negocio/", "Perfil da Empresa no Google"),
        ("/sites-com-inteligencia-artificial/", "Sites com inteligência artificial"),
    ]),
    ("Conteúdo", [
        ("/perguntas-frequentes/", "Perguntas frequentes"),
        ("/pesquisa/", "Pesquisa própria de presença digital"),
        ("/sobre/", "Sobre Jacque Platon"),
        ("/#projetos", "Projetos publicados"),
        ("/#contato", "Falar sobre um projeto"),
    ]),
]


# ---------------------------------------------------------------------------
# Blocos reutilizáveis
# ---------------------------------------------------------------------------
def bloco_menu(slug):
    atual = caminho(slug)
    itens = []
    for href, texto in MENU:
        aria = ' aria-current="page"' if href == atual else ""
        itens.append('<a href="%s"%s>%s</a>' % (href, aria, texto))
    itens.append('<a class="nav-contact" href="/#contato">Vamos conversar <span>↗</span></a>')
    return "".join(itens)


def bloco_cabecalho(slug):
    marca_href = "/#inicio" if slug == "" else "/"
    return (
        '<header class="header wrap">\n'
        '<a class="brand" href="%s" aria-label="Jacque Platon, início">'
        '<img src="/assets/jp.svg" width="42" height="42" alt="">'
        '<span>JACQUE<br>PLATON<span class="brand-dot">.</span></span></a>\n'
        '<button class="menu-button" aria-expanded="false" aria-controls="navigation">'
        'Menu <span>☰</span></button>\n'
        '<nav id="navigation" aria-label="Principal">%s</nav>\n'
        '</header>' % (marca_href, bloco_menu(slug))
    )


def bloco_migalhas(trilha):
    """trilha: lista de (href, nome). A última é a página atual."""
    if not trilha:
        return ""
    partes = []
    for i, (href, nome) in enumerate(trilha):
        if i == len(trilha) - 1:
            partes.append('<li><span aria-current="page">%s</span></li>' % esc(nome))
        else:
            partes.append('<li><a href="%s">%s</a></li>' % (href, esc(nome)))
    return ('<nav class="migalhas wrap" aria-label="Trilha de navegação">'
            '<ol>%s</ol></nav>' % "".join(partes))


def bloco_assinatura(publicado, atualizado):
    """Item 15 (autor) e item 16 (datas), visíveis no HTML."""
    return (
        '<p class="assinatura">'
        '<span class="assinatura-autor">'
        '<span class="assinatura-nome">Por <a rel="author" href="/sobre/">%s</a></span>'
        '<span class="assinatura-papel">estrategista digital · sites, Google e IA</span></span>'
        '<span class="assinatura-datas">'
        'Publicado em <time datetime="%s">%s</time> · '
        'Última revisão em <time datetime="%s">%s</time>'
        '</span></p>' % (AUTOR, publicado, data_legivel(publicado),
                         atualizado, data_legivel(atualizado))
    )


def bloco_faq(perguntas, titulo="Perguntas frequentes"):
    """Item 12 e 13. A resposta começa com a frase que responde direto."""
    if not perguntas:
        return ""
    itens = []
    for p, r in perguntas:
        itens.append(
            '<div class="faq-item">'
            '<h3>%s</h3>'
            '<div class="faq-resposta">%s</div>'
            '</div>' % (esc(p), r)
        )
    return ('<section class="faq" id="perguntas" aria-labelledby="faq-titulo">'
            '<h2 id="faq-titulo">%s</h2><div class="faq-lista">%s</div>'
            '</section>' % (esc(titulo), "".join(itens)))


def bloco_fontes(fontes):
    """Item 14. Só fontes primárias e verificáveis."""
    if not fontes:
        return ""
    itens = []
    for titulo, href, nota in fontes:
        itens.append(
            '<li><a href="%s" rel="nofollow noopener noreferrer" target="_blank">%s</a>'
            '<span>%s</span></li>' % (href, esc(titulo), esc(nota))
        )
    return ('<section class="fontes" aria-labelledby="fontes-titulo">'
            '<h2 id="fontes-titulo">Fontes consultadas</h2>'
            '<p class="fontes-nota">Documentação pública dos próprios mecanismos de busca '
            'e dos responsáveis pelos robôs citados nesta página.</p>'
            '<ul>%s</ul></section>' % "".join(itens))


def bloco_relacionados(links):
    """Item 18, links internos contextuais."""
    if not links:
        return ""
    itens = ['<li><a href="%s"><strong>%s</strong><span>%s</span></a></li>'
             % (href, esc(titulo), esc(nota)) for href, titulo, nota in links]
    return ('<section class="relacionados" aria-labelledby="rel-titulo">'
            '<h2 id="rel-titulo">Continue por aqui</h2><ul>%s</ul></section>'
            % "".join(itens))


def bloco_cta(texto, rotulo="Falar sobre o meu projeto"):
    return ('<section class="cta-bloco"><div><p>%s</p>'
            '<a class="button primary" href="/#contato">%s <span>↗</span></a></div></section>'
            % (texto, esc(rotulo)))


def bloco_rodape():
    colunas = []
    for titulo, links in RODAPE_MAPA:
        itens = "".join('<li><a href="%s">%s</a></li>' % (h, esc(t)) for h, t in links)
        colunas.append('<div><h2>%s</h2><ul>%s</ul></div>' % (esc(titulo), itens))
    return (
        '<footer><div class="wrap">\n'
        '<nav class="footer-mapa" aria-label="Mapa do site">%s</nav>\n'
        '<div class="footer-main">'
        '<a class="brand" href="/"><img src="/assets/jp.svg" width="45" height="45" alt="">'
        '<span>JACQUE<br>PLATON<span class="brand-dot">.</span></span></a>'
        '<div>Sites • Google • Inteligência Artificial<br>'
        '<span>Presença digital que gera negócios.</span></div>'
        '<a href="%s" rel="me noopener noreferrer" target="_blank">Instagram ↗</a></div>\n'
        '<div class="footer-bottom">'
        '<span>© 2026 Jacque Platon. Todos os direitos reservados.</span>'
        '<span>Site revisado em <time datetime="%s">%s</time></span>'
        '<a href="/">Início ↑</a></div>\n'
        '</div></footer>' % ("".join(colunas), INSTAGRAM, ATUALIZADO, data_legivel(ATUALIZADO))
    )


# ---------------------------------------------------------------------------
# Dados estruturados (item 4). Tudo em um @graph, com @id reaproveitado.
# Regra: nenhum dado inventado. Sem endereço, sem telefone, sem nota de
# avaliação, sem certificação, sem vínculo com o Google.
# ---------------------------------------------------------------------------
ID_PESSOA = DOMINIO + "/#jacque-platon"
ID_ORG = DOMINIO + "/#organizacao"
ID_SITE = DOMINIO + "/#site"

SOBRE_O_QUE = [
    "Criação de sites", "Landing pages", "Otimização para mecanismos de busca",
    "Perfil da Empresa no Google", "Marketing digital",
    "Inteligência artificial aplicada a negócios", "Presença digital local",
]

CATALOGO = [
    ("Criação de sites profissionais e landing pages",
     "/criacao-de-sites-profissionais/",
     "Site institucional ou landing page com estrutura, conteúdo e caminho de contato definidos."),
    ("SEO e presença no Google",
     "/criacao-de-sites-natal-rn/",
     "Organização técnica e editorial das páginas para busca tradicional e para respostas geradas por IA."),
    ("Perfil da Empresa no Google",
     "/google-meu-negocio/",
     "Preenchimento e revisão do perfil para quem pesquisa negócios por região."),
    ("Sites para academias e estúdios",
     "/sites-para-academias/",
     "Modalidades, horários, prova visual dos treinos e consulta de aula experimental."),
    ("Canal próprio de reservas para pousadas e hotéis",
     "/sites-para-pousadas-e-hoteis/",
     "Acomodações, diferenciais e consulta direta de datas e número de hóspedes."),
    ("Sites e conteúdo com inteligência artificial",
     "/sites-com-inteligencia-artificial/",
     "Produção digital com IA sob curadoria, direção e revisão profissional."),
]


def no_pessoa():
    return {
        "@type": "Person",
        "@id": ID_PESSOA,
        "name": AUTOR,
        "url": url("sobre"),
        "mainEntityOfPage": {"@id": url("sobre") + "#webpage"},
        "jobTitle": "Estrategista digital",
        "description": ("Profissional de marketing e presença digital. Cria sites, "
                        "organiza páginas para o Google e aplica inteligência artificial "
                        "com curadoria e revisão humana. Atende negócios de Natal, Rio "
                        "Grande do Norte, e de outras cidades do Brasil a distância."),
        "knowsAbout": SOBRE_O_QUE,
        "knowsLanguage": [{"@type": "Language", "name": "Português", "alternateName": "pt-BR"}],
        "sameAs": [INSTAGRAM],
        "worksFor": {"@id": ID_ORG},
    }


def no_organizacao():
    return {
        "@type": "Organization",
        "@id": ID_ORG,
        "name": "Jacque Platon — Sites, Google e Inteligência Artificial",
        "alternateName": "Jacque Platon",
        "url": DOMINIO + "/",
        "logo": {
            "@type": "ImageObject",
            "@id": DOMINIO + "/#logo",
            "url": DOMINIO + "/assets/logo-jacque-platon.svg",
            "contentUrl": DOMINIO + "/assets/logo-jacque-platon.svg",
            "caption": "Logotipo Jacque Platon",
        },
        "image": {"@id": DOMINIO + "/#logo"},
        "founder": {"@id": ID_PESSOA},
        "employee": {"@id": ID_PESSOA},
        "description": ("Criação de sites profissionais e landing pages, organização de "
                        "páginas para busca, Perfil da Empresa no Google e aplicação de "
                        "inteligência artificial com revisão humana."),
        "areaServed": [
            {"@type": "City", "name": "Natal", "containedInPlace":
                {"@type": "State", "name": "Rio Grande do Norte"}},
            {"@type": "State", "name": "Rio Grande do Norte"},
            {"@type": "Country", "name": "Brasil"},
        ],
        "availableLanguage": [{"@type": "Language", "name": "Português", "alternateName": "pt-BR"}],
        "sameAs": [INSTAGRAM],
        "knowsAbout": SOBRE_O_QUE,
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Soluções de presença digital",
            "itemListElement": [
                {"@type": "Offer",
                 "itemOffered": {"@type": "Service", "name": n,
                                 "url": DOMINIO + c, "description": d}}
                for n, c, d in CATALOGO
            ],
        },
    }


def no_site():
    return {
        "@type": "WebSite",
        "@id": ID_SITE,
        "url": DOMINIO + "/",
        "name": "Jacque Platon",
        "alternateName": "Jacque Platon — presença digital que gera negócios",
        "description": ("Site de Jacque Platon: criação de sites profissionais, presença "
                        "no Google e inteligência artificial aplicada a negócios."),
        "inLanguage": "pt-BR",
        "publisher": {"@id": ID_ORG},
        "copyrightHolder": {"@id": ID_ORG},
        "copyrightYear": 2026,
        "datePublished": PUBLICADO,
        "dateModified": ATUALIZADO,
    }


def no_imagem_og():
    return {
        "@type": "ImageObject",
        "@id": DOMINIO + "/#imagem-social",
        "url": DOMINIO + "/assets/og-jacque-platon.png",
        "contentUrl": DOMINIO + "/assets/og-jacque-platon.png",
        "width": 1200,
        "height": 630,
        "caption": "Jacque Platon — sites, Google e inteligência artificial",
    }


def no_migalhas(pagina_url, trilha):
    itens = []
    for i, (href, nome) in enumerate(trilha, start=1):
        alvo = DOMINIO + "/" if href == "/" else (
            DOMINIO + href if href.startswith("/") else href)
        itens.append({"@type": "ListItem", "position": i, "name": nome, "item": alvo})
    return {
        "@type": "BreadcrumbList",
        "@id": pagina_url + "#migalhas",
        "itemListElement": itens,
    }


def no_webpage(p, pagina_url):
    no = {
        "@type": p.get("tipo_schema", "WebPage"),
        "@id": pagina_url + "#webpage",
        "url": pagina_url,
        "name": p["titulo"],
        "headline": p["h1_texto"],
        "description": p["descricao"],
        "isPartOf": {"@id": ID_SITE},
        "inLanguage": "pt-BR",
        "datePublished": p.get("publicado", PUBLICADO),
        "dateModified": p.get("atualizado", ATUALIZADO),
        "author": {"@id": ID_PESSOA},
        "creator": {"@id": ID_PESSOA},
        "publisher": {"@id": ID_ORG},
        "primaryImageOfPage": {"@id": DOMINIO + "/#imagem-social"},
    }
    if p["trilha"]:
        no["breadcrumb"] = {"@id": pagina_url + "#migalhas"}
    if p.get("sobre_org", True):
        no["about"] = {"@id": ID_ORG}
    if p.get("mainEntity"):
        no["mainEntity"] = {"@id": pagina_url + p["mainEntity"]}
    if p.get("palavras"):
        no["keywords"] = p["palavras"]
    return no


def no_faq(pagina_url, perguntas):
    return {
        "@type": "FAQPage",
        "@id": pagina_url + "#faq",
        "mainEntityOfPage": {"@id": pagina_url + "#webpage"},
        "inLanguage": "pt-BR",
        "mainEntity": [
            {"@type": "Question",
             "name": pergunta,
             "acceptedAnswer": {"@type": "Answer", "text": texto_puro(resposta)}}
            for pergunta, resposta in perguntas
        ],
    }


def texto_puro(html):
    """Remove tags para usar a resposta dentro do JSON-LD."""
    saida, dentro = [], False
    for ch in html:
        if ch == "<":
            dentro = True
        elif ch == ">":
            dentro = False
            saida.append(" ")
        elif not dentro:
            saida.append(ch)
    texto = "".join(saida)
    texto = (texto.replace("&nbsp;", " ").replace("&amp;", "&")
                  .replace("&lt;", "<").replace("&gt;", ">").replace("&quot;", '"'))
    return " ".join(texto.split())


def endereco(p):
    """Endereço público da página. A 404 é servida em /404.html, não em /404/."""
    return p.get("url_absoluta") or url(p["slug"])


def grafo(p):
    pagina_url = endereco(p)
    nos = [no_pessoa(), no_organizacao(), no_site(), no_imagem_og(), no_webpage(p, pagina_url)]
    if p["trilha"]:
        nos.append(no_migalhas(pagina_url, p["trilha"]))
    if p.get("faq") and p.get("faq_schema", True):
        nos.append(no_faq(pagina_url, p["faq"]))
    nos.extend(p.get("schema_extra", []))
    return {"@context": "https://schema.org", "@graph": nos}


# ---------------------------------------------------------------------------
# Montagem do HTML
# ---------------------------------------------------------------------------
CABECA = """<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>__TITULO__</title>
<meta name="description" content="__DESCRICAO__">
<meta name="robots" content="__ROBOTS__">
<link rel="canonical" href="__CANONICAL__">
<meta name="author" content="Jacque Platon">
<link rel="author" href="__DOMINIO__/sobre/">
<meta name="theme-color" content="#0b0b0d">
<meta property="og:type" content="__OGTIPO__">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="Jacque Platon">
<meta property="og:title" content="__OGTITULO__">
<meta property="og:description" content="__DESCRICAO__">
<meta property="og:url" content="__CANONICAL__">
<meta property="og:image" content="__DOMINIO__/assets/og-jacque-platon.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Jacque Platon — sites, Google e inteligência artificial">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="__OGTITULO__">
<meta name="twitter:description" content="__DESCRICAO__">
<meta name="twitter:image" content="__DOMINIO__/assets/og-jacque-platon.png">
<link rel="icon" href="/assets/jp.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500;600;700&family=Montserrat:wght@500;600;650;700;750;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/style.css">
<script type="application/ld+json">
__JSONLD__
</script>
</head>
<body>
<a class="skip" href="#principal">Pular para o conteúdo</a>
__CABECALHO__
__MIGALHAS__
<main id="principal">
__CORPO__
</main>
__RODAPE__
<script src="/app.js" defer></script>
</body>
</html>
"""


def monta_corpo_interno(p):
    partes = []
    partes.append(
        '<article class="pagina">\n'
        '<header class="pagina-topo wrap">'
        '<p class="eyebrow"><span class="dot"></span> %s</p>'
        '<h1>%s</h1>'
        '<p class="lead">%s</p>'
        '%s'
        '</header>' % (esc(p["eyebrow"]), p["h1"], p["lead"],
                       bloco_assinatura(p.get("publicado", PUBLICADO),
                                        p.get("atualizado", ATUALIZADO)))
    )
    corpo = []
    if p.get("resposta_rapida"):
        corpo.append(
            '<aside class="resposta-rapida" aria-labelledby="resp-titulo">'
            '<h2 id="resp-titulo">Resposta curta</h2>%s</aside>' % p["resposta_rapida"]
        )
    corpo.append(p.get("secoes", ""))
    corpo.append(bloco_faq(p["faq"], p.get("faq_titulo", "Perguntas frequentes"))
                 if p.get("faq") else "")
    corpo.append(bloco_fontes(p.get("fontes", [])))
    corpo.append(bloco_relacionados(p.get("relacionados", [])))
    partes.append('<div class="pagina-corpo wrap">%s</div>' % "".join(corpo))
    if p.get("cta"):
        partes.append(bloco_cta(p["cta"], p.get("cta_rotulo", "Falar sobre o meu projeto")))
    partes.append('</article>')
    return "\n".join(partes)


def renderiza(p):
    pagina_url = endereco(p)
    corpo = p["corpo_bruto"] if p.get("corpo_bruto") else monta_corpo_interno(p)
    html = CABECA
    subs = [
        ("__JSONLD__", json.dumps(grafo(p), ensure_ascii=False, indent=2)),
        ("__TITULO__", esc(p["titulo"])),
        ("__OGTITULO__", esc(p.get("og_titulo", p["titulo"]))),
        ("__DESCRICAO__", esc(p["descricao"])),
        ("__ROBOTS__", p.get("robots",
            "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1")),
        ("__CANONICAL__", pagina_url),
        ("__OGTIPO__", p.get("og_tipo", "website")),
        ("__CABECALHO__", bloco_cabecalho(p["slug"])),
        ("__MIGALHAS__", bloco_migalhas(p["trilha"])),
        ("__CORPO__", corpo),
        ("__RODAPE__", bloco_rodape()),
        ("__DOMINIO__", DOMINIO),
    ]
    for chave, valor in subs:
        html = html.replace(chave, valor)

    if p.get("sem_canonical"):
        # Página de erro não tem endereço canônico próprio: ela responde em
        # qualquer URL inexistente. O noindex já basta.
        html = html.replace('<link rel="canonical" href="%s">\n' % pagina_url, "")
        html = html.replace(
            '<meta property="og:url" content="%s">\n' % pagina_url, "")

    # Marcadores usados dentro do conteúdo (__PITBULL__, __INSTAGRAM__ etc.).
    # Ficam aqui, no fim, para valerem em qualquer campo da página.
    import conteudo
    for chave, valor in conteudo.SUBSTITUICOES.items():
        html = html.replace(chave, valor)
    return html


# ---------------------------------------------------------------------------
# robots.txt (itens 1 e 2) e sitemap.xml (item 3)
# ---------------------------------------------------------------------------
ROBOS_IA = [
    ("Googlebot", "busca do Google"),
    ("Google-Extended", "respostas de IA do Google (Gemini e AI Overviews)"),
    ("Googlebot-Image", "imagens no Google"),
    ("Bingbot", "busca do Bing"),
    ("GPTBot", "indexação da OpenAI"),
    ("OAI-SearchBot", "busca do ChatGPT"),
    ("ChatGPT-User", "visita feita a pedido de quem usa o ChatGPT"),
    ("ClaudeBot", "indexação da Anthropic"),
    ("Claude-SearchBot", "busca do Claude"),
    ("Claude-User", "visita feita a pedido de quem usa o Claude"),
    ("PerplexityBot", "indexação da Perplexity"),
    ("Perplexity-User", "visita feita a pedido de quem usa a Perplexity"),
    ("Applebot", "busca e Siri da Apple"),
    ("Applebot-Extended", "treinamento e respostas de IA da Apple"),
    ("Amazonbot", "Alexa e busca da Amazon"),
    ("meta-externalagent", "IA da Meta"),
    ("DuckAssistBot", "respostas do DuckDuckGo"),
    ("YandexBot", "busca do Yandex"),
    ("CCBot", "Common Crawl, base usada por vários modelos"),
    ("cohere-ai", "Cohere"),
    ("MistralAI-User", "visita feita a pedido de quem usa o Mistral"),
    ("YouBot", "You.com"),
    ("Bytespider", "IA da ByteDance"),
    ("Diffbot", "extração estruturada"),
    ("Timpibot", "Timpi"),
]


def gera_robots():
    linhas = [
        "# robots.txt — Jacque Platon",
        "# Decisão: TODOS os robôs de busca e de inteligência artificial estão",
        "# liberados para ler e citar este site. Nada aqui é privado.",
        "# Revisado em " + ATUALIZADO,
        "",
        "# ---------------------------------------------------------------",
        "# Regra geral: qualquer robô, qualquer página.",
        "# ---------------------------------------------------------------",
        "User-agent: *",
        "Allow: /",
        "",
        "# ---------------------------------------------------------------",
        "# Liberação nominal. Redundante com a regra acima de propósito:",
        "# alguns robôs só obedecem o bloco que traz o próprio nome.",
        "# ---------------------------------------------------------------",
    ]
    for nome, para_que in ROBOS_IA:
        linhas.append("")
        linhas.append("# %s — %s" % (nome, para_que))
        linhas.append("User-agent: %s" % nome)
        linhas.append("Allow: /")
    linhas += [
        "",
        "# ---------------------------------------------------------------",
        "# Mapa do site",
        "# ---------------------------------------------------------------",
        "Sitemap: %s/sitemap.xml" % DOMINIO,
        "",
    ]
    return "\n".join(linhas)


def gera_sitemap(paginas):
    linhas = ['<?xml version="1.0" encoding="UTF-8"?>',
              '<!-- Gerado por ferramentas/gerar.py. Não edite à mão. -->',
              '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for p in paginas:
        if p.get("robots", "").startswith("noindex"):
            continue
        linhas += [
            "  <url>",
            "    <loc>%s</loc>" % url(p["slug"]),
            "    <lastmod>%s</lastmod>" % p.get("atualizado", ATUALIZADO),
            "    <changefreq>%s</changefreq>" % p.get("changefreq", "monthly"),
            "    <priority>%s</priority>" % p.get("priority", "0.7"),
            "  </url>",
        ]
    linhas.append("</urlset>")
    linhas.append("")
    return "\n".join(linhas)


def main():
    import conteudo
    paginas = conteudo.PAGINAS
    escritos = []
    for p in paginas:
        destino = os.path.join(RAIZ, "index.html") if p["slug"] == "" \
            else os.path.join(RAIZ, p["slug"], "index.html")
        os.makedirs(os.path.dirname(destino), exist_ok=True)
        with open(destino, "w", encoding="utf-8") as f:
            f.write(renderiza(p))
        escritos.append(os.path.relpath(destino, RAIZ))

    with open(os.path.join(RAIZ, "404.html"), "w", encoding="utf-8") as f:
        f.write(renderiza(conteudo.PAGINA_404))
    escritos.append("404.html")

    with open(os.path.join(RAIZ, "robots.txt"), "w", encoding="utf-8") as f:
        f.write(gera_robots())
    escritos.append("robots.txt")

    with open(os.path.join(RAIZ, "sitemap.xml"), "w", encoding="utf-8") as f:
        f.write(gera_sitemap(paginas))
    escritos.append("sitemap.xml")

    print("Domínio: %s" % DOMINIO)
    print("Última revisão: %s" % ATUALIZADO)
    for nome in escritos:
        print("  gerado  %s" % nome)
    print("\n%d arquivos. Agora rode: python3 ferramentas/verificar.py" % len(escritos))


if __name__ == "__main__":
    main()
