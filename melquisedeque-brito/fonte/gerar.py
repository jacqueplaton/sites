#!/usr/bin/env python3
"""Gera o site estático de Melquisedeque Brito a partir de fonte/.

Uso
  python3 fonte/gerar.py
      Prévia local em site/ (abre com duplo clique: os links terminam em
      index.html) e páginas de revisão em revisao/. Tudo com noindex.

  python3 fonte/gerar.py --zip
      Também monta dist/ com URLs limpas (../atuacao/) e o ZIP de deploy em
      entrega/. O ZIP leva só as 16 rotas públicas, com noindex.

  python3 fonte/gerar.py --dominio https://www.exemplo.com.br
      Versão para publicação orgânica: index,follow, canonicals absolutos,
      Open Graph, robots.txt e sitemap.xml em dist/ e no ZIP. As páginas de
      revisão continuam fora.

Edite os textos em fonte/conteudo.py e fonte/gerar.py (páginas únicas), os
dados em fonte/config.json e o visual em fonte/assets/.
"""
from __future__ import annotations

import argparse
import hashlib
import html
import json
import re
import shutil
import zipfile
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import quote

import conteudo as C

RAIZ = Path(__file__).resolve().parent.parent
FONTE = RAIZ / "fonte"
CFG = json.loads((FONTE / "config.json").read_text(encoding="utf-8"))

WA_URL = "https://wa.me/{}?text={}".format(CFG["whatsapp"]["digitos"], quote(CFG["whatsapp"]["mensagem"]))
WA_NUM = CFG["whatsapp"]["exibicao"]
IG_URL = CFG["instagram"]["url"]
IG_USER = "@" + CFG["instagram"]["usuario"]

ICONE_WA = ('<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" '
            'stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 19.5l1.2-3.6A8 8 0 1 1 8.4 18.6z"/>'
            '<path d="M9 9.5c.3 2 1.8 3.8 4 4.6"/></svg>')

MENU = [
    ("atuacao/", "Atuação"),
    ("o-advogado/", "O advogado"),
    ("atendimento/parnamirim/", "Parnamirim"),
    ("orientacoes/", "Caderno criminal"),
    ("contato/", "Contato"),
]


@dataclass
class Ctx:
    modo: str              # "local" (links com index.html), "limpo" (../rota/) ou "raiz" (/rota/, só no 404)
    dominio: str | None    # https://... quando houver publicação orgânica
    versao: str            # hash curto dos assets, para o cache


def esc(t: str) -> str:
    return html.escape(t, quote=True)


def texto_puro(t: str) -> str:
    return re.sub(r"<[^>]+>", "", t)


# ---------------------------------------------------------------------------
# Links
# ---------------------------------------------------------------------------

def caminho(rota_destino: str, rota_atual: str, ctx: Ctx, base: str = "") -> str:
    """Caminho relativo de rota_atual até rota_destino.

    base = "../site/" é usado pelas páginas de revisão para apontar para a
    prévia pública, que fica em uma pasta irmã.
    """
    if ctx.modo == "raiz":
        return "/" + rota_destino
    prefixo = "../" * rota_atual.count("/") + base
    if ctx.modo == "local":
        return prefixo + rota_destino + "index.html"
    return (prefixo + rota_destino) or "./"


def resolver(doc: str, rota_atual: str, ctx: Ctx, revisao: bool) -> str:
    base_site = "../site/" if revisao else ""

    def interno(m):
        return 'href="{}"'.format(caminho(m.group(1), rota_atual, ctx, base_site))

    def interno_revisao(m):
        return 'href="{}"'.format(caminho(m.group(1), rota_atual, ctx))

    doc = re.sub(r'href="@/([^"]*)"', interno, doc)
    doc = re.sub(r'href="@r/([^"]*)"', interno_revisao, doc)
    doc = doc.replace('href="@wa"', 'href="{}" target="_blank" rel="noopener"'.format(esc(WA_URL)))
    # links externos abrem em nova aba
    doc = re.sub(r'<a href="(https://[^"]+)"(?![^>]*target=)', r'<a href="\1" target="_blank" rel="noopener"', doc)
    prefixo_assets = "/" if ctx.modo == "raiz" else "../" * rota_atual.count("/") + base_site
    doc = doc.replace("@assets/", prefixo_assets + "assets/")
    return doc


# ---------------------------------------------------------------------------
# Peças compartilhadas
# ---------------------------------------------------------------------------

def botao_wa(posicao: str, rotulo: str = "Falar pelo WhatsApp") -> str:
    return '<a class="botao botao-wa" href="@wa" data-wa="{}">{}<span>{}</span></a>'.format(posicao, ICONE_WA, rotulo)


def cabecalho(rota: str, revisao: bool) -> str:
    itens = []
    for destino, nome in MENU:
        atual = ' aria-current="page"' if (rota == destino or (destino == "atuacao/" and rota.startswith("atuacao/"))) and not revisao else ""
        itens.append('<li><a href="@/{}"{}>{}</a></li>'.format(destino, atual, nome))
    faixa = ""
    if revisao:
        faixa = '<p class="faixa-revisao">Página de revisão, fora do site público. <a href="@r/">Voltar ao índice de revisão</a></p>'
    return """{faixa}<a class="pular" href="#conteudo">Pular para o conteúdo</a>
<header class="topo">
  <div class="envelope topo-interno">
    <a class="marca" href="@/"><span class="monograma" aria-hidden="true">MB</span><span class="marca-texto"><span class="marca-nome">{marca}</span><span class="marca-sub">{atuacao} · {oab}</span></span></a>
    <nav class="menu" id="menu" aria-label="Principal"><ul>{itens}</ul></nav>
    <a class="topo-wa" href="@wa" data-wa="cabecalho">{icone}<span class="rotulo-longo">WhatsApp</span><span class="rotulo-curto">WhatsApp</span></a>
    <button class="menu-botao" type="button" aria-expanded="false" aria-controls="menu" hidden><span aria-hidden="true"></span>Menu</button>
  </div>
</header>""".format(faixa=faixa, marca=CFG["marca"], atuacao=CFG["atuacao_curta"], oab=CFG["oab"],
                     itens="".join(itens), icone=ICONE_WA)


def rodape() -> str:
    paginas = "".join('<li><a href="@/{}">{}</a></li>'.format(r, n) for r, n in [("", "Início")] + MENU[:-1])
    return """<footer class="rodape">
  <div class="envelope">
    <div class="rodape-grade">
      <div class="rodape-marca">
        <span class="monograma" aria-hidden="true">MB</span>
        <div>
          <p class="rodape-nome">{nome}</p>
          <p>{oab}<br>{atuacao} · {regiao}</p>
        </div>
      </div>
      <div>
        <h2>Contato</h2>
        <ul>
          <li><a href="@wa" data-wa="rodape">WhatsApp {num}</a></li>
          <li><a href="{ig}">Instagram {iguser}</a></li>
        </ul>
      </div>
      <nav aria-label="Rodapé">
        <h2>Páginas</h2>
        <ul>{paginas}</ul>
      </nav>
    </div>
    <p class="rodape-nota">Conteúdo informativo, sem promessa de resultado. Cada situação depende da análise do caso concreto. As informações deste site não substituem a orientação de um advogado.</p>
  </div>
</footer>""".format(nome=CFG["nome_completo"], oab=CFG["oab"], atuacao=CFG["atuacao_curta"], regiao=CFG["regiao"],
                     num=WA_NUM, ig=IG_URL, iguser=IG_USER, paginas=paginas)


def bloco_conversa(posicao: str, titulo: str = "Para começar, basta pedir uma conversa.") -> str:
    return """<section class="conversa" aria-labelledby="conversa-{pos}">
  <div class="envelope conversa-interno">
    <div>
      <p class="rotulo">Contato</p>
      <h2 id="conversa-{pos}">{titulo}</h2>
    </div>
    <div>
      <p class="conversa-numero">{num}</p>
      <p>{botao}</p>
      <p class="nota">A primeira mensagem pode ser só um pedido de conversa. Documentos e detalhes ficam para um canal combinado com o escritório.</p>
    </div>
  </div>
</section>""".format(pos=posicao, titulo=titulo, num=WA_NUM, botao=botao_wa(posicao))


def migalhas(itens: list[tuple[str, str | None]]) -> str:
    partes = []
    for nome, rota in itens:
        if rota is None:
            partes.append('<li aria-current="page">{}</li>'.format(nome))
        elif rota.startswith("r:"):
            partes.append('<li><a href="@r/{}">{}</a></li>'.format(rota[2:], nome))
        else:
            partes.append('<li><a href="@/{}">{}</a></li>'.format(rota, nome))
    return '<nav class="migalhas" aria-label="Você está em"><ol>{}</ol></nav>'.format("".join(partes))


def faq_html(faq) -> str:
    return "".join(
        '<details class="faq"><summary>{}</summary><div class="faq-resposta">{}</div></details>'.format(p, r)
        for p, r in faq)


def fontes_html(fontes) -> str:
    if not fontes:
        return ""
    lis = "".join('<li><a href="{}">{}</a></li>'.format(url, nome) for nome, url in fontes)
    return """<section class="bloco bloco-fonte" id="fonte">
  <h2>Fonte oficial</h2>
  <ul class="fontes">{}</ul>
  <p>Texto informativo, revisado pelo advogado. Ele não substitui a análise do seu caso.</p>
</section>""".format(lis)


def seguinte_html(rota: str) -> str:
    alvo = POR_ROTA.get(rota)
    if not alvo:
        return ""
    return """<nav class="seguinte envelope" aria-label="Leitura seguinte">
  <a href="@/{rota}"><span class="rotulo">Leitura seguinte</span><span class="seguinte-rumina">{rumina}</span><span class="seguinte-nome">{nome}</span></a>
</nav>""".format(rota=rota, rumina=alvo["rumina"], nome=alvo["nome"])


def situacao_li(rota: str, pergunta: str, nome: str) -> str:
    return ('<li><a class="situacao" href="@/{}"><span class="situacao-pergunta">{}</span>'
            '<span class="situacao-nome">{}</span><span class="situacao-seta" aria-hidden="true">→</span></a></li>').format(rota, pergunta, nome)


def picture(nome: str, alt: str, largura: int, altura: int, classe: str = "", prioridade: bool = False,
            sizes: str = "100vw") -> str:
    carga = 'fetchpriority="high"' if prioridade else 'loading="lazy"'
    return ('<img{cls} src="@assets/img/{n}.webp" srcset="@assets/img/{n}.webp {w}w, @assets/img/{n}@2x.webp {w2}w" '
            'sizes="{sizes}" width="{w}" height="{h}" alt="{alt}" decoding="async" {carga}>').format(
        cls=f' class="{classe}"' if classe else "", n=nome, w=largura, w2=largura * 2, h=altura,
        alt=esc(alt), carga=carga, sizes=sizes)


# ---------------------------------------------------------------------------
# Página de leitura (frentes, guias, Parnamirim, revisão)
# ---------------------------------------------------------------------------

def pagina_leitura(p: dict, trilha, kicker: str, revisao: bool = False) -> str:
    secoes = p["secoes"]
    sumario = "".join('<li><a href="#{}">{}</a></li>'.format(s["id"], s["titulo"]) for s in secoes)
    if p.get("faq"):
        sumario += '<li><a href="#duvidas">Dúvidas frequentes</a></li>'
    if p.get("fontes"):
        sumario += '<li><a href="#fonte">Fonte oficial</a></li>'

    corpo = "".join('<section class="bloco" id="{id}" aria-labelledby="t-{id}"><h2 id="t-{id}">{titulo}</h2>{html}</section>'.format(**s)
                    for s in secoes)
    if p.get("faq"):
        corpo += '<section class="bloco" id="duvidas" aria-labelledby="t-duvidas"><h2 id="t-duvidas">Dúvidas frequentes</h2>{}</section>'.format(faq_html(p["faq"]))
    corpo += fontes_html(p.get("fontes"))

    termo = ""
    if p.get("termo"):
        termo = '<p class="termo"><span class="termo-rotulo">O termo técnico</span>{}</p>'.format(p["termo"])
    aviso = ""
    if revisao:
        itens = "".join("<li>{}</li>".format(c) for c in p["confirmar"])
        aviso = ('<div class="aviso-revisao" role="note"><p><strong>Página em revisão.</strong> Fora do menu, do sitemap e do ZIP público.</p>'
                 '<p>Confirmar com o escritório:</p><ul>{}</ul></div>').format(itens)

    slug = p["rota"].rstrip("/").split("/")[-1]
    seguinte = seguinte_html(p["seguinte"]) if p.get("seguinte") and not revisao else ""
    return """<main id="conteudo" class="pagina-{slug}">
  <div class="leitura-cabeca">
    <div class="envelope">
      {migalhas}{aviso}
      <div class="leitura-cabeca-grade">
        <div>
          <p class="rotulo">{kicker}</p>
          <h1 class="leitura-titulo">{h1}</h1>
          <div class="resposta"><p class="resposta-rotulo">Resposta curta</p><p class="resposta-texto">{lead}</p></div>
        </div>
        <div class="leitura-lado">
          {termo}
          <p class="leitura-acao">{botao}<span class="numero-wa">{num}</span></p>
        </div>
      </div>
    </div>
  </div>
  <div class="envelope leitura-corpo">
    <details class="sumario" open><summary>Nesta página</summary><ol>{sumario}</ol></details>
    <article class="texto">{corpo}</article>
  </div>
  {seguinte}
</main>
{conversa}""".format(slug=slug, migalhas=migalhas(trilha), aviso=aviso, kicker=kicker, h1=p["h1"], lead=p["lead"],
                       termo=termo, botao=botao_wa("topo-da-pagina", "Conversar pelo WhatsApp"), num=WA_NUM,
                       sumario=sumario, corpo=corpo, seguinte=seguinte,
                       conversa=bloco_conversa("pagina", "Quer conversar sobre isso?"))


# ---------------------------------------------------------------------------
# Páginas únicas
# ---------------------------------------------------------------------------

def pagina_inicio() -> str:
    situacoes = "".join([
        situacao_li("atuacao/intimacao-e-inquerito/", "Recebi uma intimação da delegacia.", "Intimação e inquérito policial"),
        situacao_li("atuacao/prisao-em-flagrante/", "Um familiar foi preso.", "Prisão em flagrante"),
        situacao_li("atuacao/audiencia-de-custodia/", "A audiência de custódia é hoje.", "Audiência de custódia"),
        situacao_li("atuacao/defesa-em-processo-criminal/", "Recebi uma citação da Justiça.", "Defesa em processo criminal"),
    ])
    leituras = "".join(
        '<article class="leitura-item"><p class="rotulo">Caderno criminal · {a}</p><h3><a href="@/{r}">{t}</a></h3><p>{d}</p></article>'.format(
            a=g["assunto"], r=g["rota"], t=g["rumina"], d=g["descricao"].split(". ")[0] + ".")
        for g in C.GUIAS)
    return """<main id="conteudo">
<section class="capa-secao" aria-labelledby="titulo-capa">
  <div class="envelope capa">
    <div class="capa-texto">
      <p class="rotulo">Advocacia criminal · {regiao}</p>
      <h1 id="titulo-capa">Defesa <em>criminal</em> em Natal.</h1>
      <p class="capa-intro">Orientação e defesa para quem recebeu uma intimação, teve um familiar preso ou responde a um processo, e para as famílias que acompanham cada etapa.</p>
      <div class="capa-acoes">
        {botao}
        <a class="link-seta" href="@/atuacao/">Conhecer as áreas de atuação</a>
        <span class="numero-wa">{num}</span>
      </div>
    </div>
    <figure class="capa-foto" data-paralaxe>
      <span class="capa-oab">{oab}</span>
      <div class="moldura">{foto}</div>
      <figcaption><strong>{nome}</strong><span>Advogado</span></figcaption>
    </figure>
  </div>
</section>

<section class="secao" aria-labelledby="titulo-indice">
  <div class="envelope revela">
    <div class="secao-cabeca">
      <h2 class="secao-titulo" id="titulo-indice">O que trouxe você aqui?</h2>
      <p>Escolha a frase mais próxima da sua situação. Cada página começa pela resposta e só depois apresenta o nome técnico.</p>
    </div>
    <ul class="situacoes">{situacoes}</ul>
    <p class="indice-mais"><a class="link-seta" href="@/atuacao/">Ver todas as situações, inclusive cumprimento da pena</a></p>
  </div>
</section>

<section class="faixa-escura" aria-labelledby="titulo-perfil">
  <div class="envelope secao perfil-faixa">
    <figure class="perfil-detalhe">{janela}<figcaption>No escritório</figcaption></figure>
    <div>
      <p class="rotulo">O advogado</p>
      <h2 id="titulo-perfil">{nome}</h2>
      <p class="oab-linha">{oab}</p>
      <p>Advogado com atuação em matéria criminal: investigações, prisões, processos e cumprimento de pena. O trabalho começa por uma conversa em que a pessoa entende o que o documento diz e quais caminhos o caso permite.</p>
      <p><a class="link-seta" href="@/o-advogado/">Sobre o advogado e a primeira conversa</a></p>
    </div>
  </div>
</section>

<section class="secao" aria-labelledby="titulo-local">
  <div class="envelope"><div class="local-faixa">
    <h2 id="titulo-local">Mora em Parnamirim e o documento veio de <em>Natal</em>?</h2>
    <div>
      <p>O endereço da sua casa não define onde o caso corre. O cabeçalho do documento define. Veja como ler a comarca e a unidade e onde conferir o endereço oficial.</p>
      <p><a class="link-seta" href="@/atendimento/parnamirim/">Atendimento em Parnamirim</a></p>
    </div>
  </div></div>
</section>

<section class="secao secao-colada" aria-labelledby="titulo-leituras">
  <div class="envelope">
    <div class="secao-cabeca">
      <h2 class="secao-titulo" id="titulo-leituras">Do caderno criminal</h2>
      <p>Leituras curtas para separar o que parece igual e não é. <a href="@/orientacoes/">Ver o caderno</a></p>
    </div>
    <div class="leituras">{leituras}</div>
  </div>
</section>
</main>
{conversa}""".format(regiao=CFG["regiao"], botao=botao_wa("capa"), num=WA_NUM, oab=CFG["oab"], nome=CFG["nome_completo"],
                       foto=picture("retrato-mesa", "Melquisedeque de Brito Trindade sentado à mesa de madeira, de paletó escuro e gravata vinho", 444, 559,
                                    prioridade=True, sizes="(min-width: 60rem) 34vw, 92vw"),
                       janela=picture("detalhe-janela", "Melquisedeque Brito de pé junto à janela do escritório, com a cidade ao fundo", 202, 592,
                                      sizes="11rem"),
                       situacoes=situacoes, leituras=leituras, conversa=bloco_conversa("inicio"))


def pagina_atuacao() -> str:
    grupos = []
    for chave, titulo in C.GRUPOS:
        linhas = "".join(situacao_li(f["rota"], f["rumina"], f["nome"]) for f in C.FRENTES if f["grupo"] == chave)
        grupos.append('<section class="grupo revela" aria-labelledby="g-{c}"><h2 class="grupo-titulo" id="g-{c}">{t}</h2><ul class="situacoes">{l}</ul></section>'.format(
            c=chave, t=titulo, l=linhas))
    return """<main id="conteudo">
  <header class="envelope indice-cabeca">
    {migalhas}
    <p class="rotulo">Atuação</p>
    <h1>Atuação criminal, a partir da <em>sua dúvida</em>.</h1>
    <p class="lead">Cada linha começa por uma pergunta comum naquela situação e, em seguida, mostra o nome jurídico do assunto. Toque na linha inteira para abrir a página.</p>
  </header>
  <div class="envelope">
    {grupos}
    <p class="aviso-discreto">Tem um link antigo sobre flagrante e custódia? <a href="@/atuacao/flagrante-e-custodia/">Ele continua funcionando</a> e leva às duas páginas.</p>
  </div>
</main>
{conversa}""".format(migalhas=migalhas([("Início", ""), ("Atuação", None)]), grupos="".join(grupos),
                       conversa=bloco_conversa("atuacao"))


def pagina_entrada() -> str:
    fl, cu = POR_ROTA["atuacao/prisao-em-flagrante/"], POR_ROTA["atuacao/audiencia-de-custodia/"]
    caminho_html = """<a class="caminho" href="@/{rota}">
      <span class="rotulo">{momento}</span>
      <span class="caminho-pergunta">{rumina}</span>
      <span class="caminho-rodape"><span class="situacao-nome">{nome}</span><span class="seta" aria-hidden="true">→</span></span>
    </a>"""
    return """<main id="conteudo">
  <header class="envelope indice-cabeca">
    {migalhas}
    <p class="rotulo">Flagrante e audiência de custódia</p>
    <h1>Dois momentos, duas páginas.</h1>
    <p class="lead">Este assunto foi dividido para responder melhor a cada dúvida. A prisão em flagrante trata das primeiras horas. A audiência de custódia trata do que o juiz decide em seguida.</p>
  </header>
  <div class="envelope">
    <div class="caminhos">
      {a}
      {b}
    </div>
  </div>
</main>
{conversa}""".format(migalhas=migalhas([("Início", ""), ("Atuação", "atuacao/"), ("Flagrante e custódia", None)]),
                       a=caminho_html.format(rota=fl["rota"], momento="Nas primeiras horas", rumina=fl["rumina"], nome=fl["nome"]),
                       b=caminho_html.format(rota=cu["rota"], momento="No dia seguinte à prisão", rumina=cu["rumina"], nome=cu["nome"]),
                       conversa=bloco_conversa("flagrante-e-custodia"))


def pagina_advogado() -> str:
    formacao = ""
    if CFG["formacao"]["confirmada"]:
        formacao = "<div><dt>Formação</dt><dd>{}</dd></div>".format(CFG["formacao"]["texto"])
    return """<main id="conteudo">
  <div class="envelope perfil">
    <figure class="perfil-retrato">{foto}<figcaption>Melquisedeque de Brito Trindade, no escritório.</figcaption></figure>
    <div>
      {migalhas}
      <p class="rotulo">O advogado</p>
      <h1>{nome}</h1>
      <dl class="ficha-tecnica">
        <div><dt>Inscrição</dt><dd>{oab}</dd></div>
        <div><dt>Atuação</dt><dd>Advocacia criminal: investigação, prisão, processo e cumprimento da pena</dd></div>
        {formacao}
        <div><dt>Atendimento</dt><dd>{regiao}</dd></div>
        <div><dt>Contato</dt><dd><a href="@wa" data-wa="perfil">WhatsApp {num}</a><br><a href="{ig}">Instagram {iguser}</a></dd></div>
      </dl>
      <p>Melquisedeque de Brito Trindade atua na defesa criminal e na orientação de pessoas investigadas, presas ou processadas, e das famílias que acompanham essas situações. O ponto de partida é sempre o documento: o que ele diz, quem o expediu e o que vem a seguir.</p>
      <p>{botao}</p>
    </div>
  </div>
  <div class="envelope dupla">
    <section class="bloco" aria-labelledby="t-primeira">
      <h2 id="t-primeira">O que levar à primeira conversa</h2>
      <ul class="lista-marcada">
        <li>O documento recebido: intimação, citação, mandado ou ata de audiência.</li>
        <li>O número do processo ou do inquérito, se houver.</li>
        <li>Nomes, datas e lugares de que você se lembra.</li>
        <li>Suas perguntas, anotadas.</li>
      </ul>
      <p>Não é preciso chegar com tudo organizado. Parte da conversa serve justamente para separar o que importa.</p>
    </section>
    <section class="bloco" aria-labelledby="t-como">
      <h2 id="t-como">Como o escritório se comunica</h2>
      <p>Em linguagem clara, sem prometer resultados. Cada caso depende das provas, do andamento e das decisões de outras pessoas, e é isso que a conversa explica.</p>
      <p>O primeiro contato pode ser só um pedido de conversa pelo WhatsApp. Documentos e detalhes pessoais seguem depois, por um canal combinado com o escritório.</p>
    </section>
  </div>
</main>
{conversa}""".format(foto=picture("retrato-sorriso", "Melquisedeque de Brito Trindade sorrindo, sentado diante de uma parede de mármore escuro", 592, 584,
                                  prioridade=True, sizes="(min-width: 60rem) 40vw, 92vw"),
                       migalhas=migalhas([("Início", ""), ("O advogado", None)]), nome=CFG["nome_completo"], oab=CFG["oab"],
                       formacao=formacao, regiao=CFG["regiao"], num=WA_NUM, ig=IG_URL, iguser=IG_USER,
                       botao=botao_wa("perfil-texto"), conversa=bloco_conversa("o-advogado"))


def pagina_caderno() -> str:
    def item(rota, titulo, dek):
        return '<li><a href="@/{}">{}</a><p>{}</p></li>'.format(rota, titulo, dek)

    pix, prim = POR_ROTA["orientacoes/pix-recebido-por-engano/"], POR_ROTA["orientacoes/reu-primario-e-reincidencia/"]
    return """<main id="conteudo">
  <header class="envelope indice-cabeca">
    {migalhas}
    <p class="rotulo">Orientações</p>
    <h1>Caderno criminal</h1>
    <p class="lead">Leituras curtas para separar o que parece igual e não é. Cada texto indica a lei de origem e uma leitura relacionada.</p>
  </header>
  <div class="envelope"><div class="assuntos">
    <section class="assunto revela" aria-labelledby="a-antecedentes"><h2 id="a-antecedentes">Antecedentes</h2><ul class="assunto-lista">{prim}</ul></section>
    <section class="assunto revela" aria-labelledby="a-dinheiro"><h2 id="a-dinheiro">Dinheiro e transferências</h2><ul class="assunto-lista">{pix}</ul></section>
    <section class="assunto revela" aria-labelledby="a-documentos"><h2 id="a-documentos">Documentos recebidos</h2><ul class="assunto-lista">{docs}</ul></section>
    <section class="assunto revela" aria-labelledby="a-pena"><h2 id="a-pena">Cumprimento da pena</h2><ul class="assunto-lista">{pena}</ul></section>
  </div></div>
</main>
{conversa}""".format(
        migalhas=migalhas([("Início", ""), ("Caderno criminal", None)]),
        prim=item(prim["rota"], prim["rumina"], "Quando a reincidência começa, o prazo de cinco anos e a diferença entre primariedade e antecedentes."),
        pix=item(pix["rota"], pix["rumina"], "A diferença entre receber e se apropriar, como devolver pelo aplicativo e o golpe do Pix errado."),
        docs=item("atuacao/intimacao-e-inquerito/", "Intimação policial: o que conferir no papel", "Órgão emissor, motivo, data e condição indicada.")
        + item("atuacao/defesa-em-processo-criminal/", "Citação: como ler o número do processo", "O que cada trecho do número significa e de onde se conta o prazo."),
        pena=item("atuacao/execucao-penal/", "Pedido, andamento ou decisão", "Como ler as movimentações do processo de execução."),
        conversa=bloco_conversa("caderno"))


def pagina_contato() -> str:
    return """<main id="conteudo">
  <div class="envelope contato">
    <div>
      {migalhas}
      <p class="rotulo">Contato</p>
      <h1>Para começar, peça uma conversa.</h1>
      <p class="contato-numero">{num}</p>
      <p>{botao}</p>
      <p>A primeira mensagem pode ser simplesmente esta:</p>
      <p class="mensagem-modelo">“{msg}”</p>
      <p>Não é preciso descrever o caso nem enviar documentos nessa mensagem. Detalhes pessoais e papéis seguem depois, por um canal combinado com o escritório.</p>
    </div>
    <div>
      <dl class="contato-canais">
        <div><dt>WhatsApp</dt><dd><a href="@wa" data-wa="contato-lista">{num}</a></dd></div>
        <div><dt>Instagram</dt><dd><a href="{ig}">{iguser}</a></dd></div>
        <div><dt>Região</dt><dd>{regiao}</dd></div>
        <div><dt>Advogado</dt><dd>{nome}<br>{oab}</dd></div>
        <div><dt>Local e horário</dt><dd>Combinados no agendamento.</dd></div>
      </dl>
    </div>
  </div>
</main>""".format(migalhas=migalhas([("Início", ""), ("Contato", None)]), num=WA_NUM, botao=botao_wa("contato"),
                   msg=CFG["whatsapp"]["mensagem"], ig=IG_URL, iguser=IG_USER, regiao=CFG["regiao"],
                   nome=CFG["nome_completo"], oab=CFG["oab"])


def pagina_404() -> str:
    return """<main id="conteudo" class="envelope nao-encontrada">
  <p class="rotulo">Página não encontrada</p>
  <h1>Este endereço não existe ou mudou de lugar.</h1>
  <p>As situações estão reunidas no índice de atuação.</p>
  <p><a class="link-seta" href="@/atuacao/">Ver as áreas de atuação</a></p>
  <p>{}</p>
</main>""".format(botao_wa("pagina-404"))


def pagina_revisao_indice() -> str:
    itens = []
    for p in C.REVISAO:
        conf = "".join("<li>{}</li>".format(c) for c in p["confirmar"])
        itens.append('<li><p class="rotulo">/{rota}</p><h2><a href="@r/{rota}">{nome}</a></h2><p>{rumina}</p><ul>{conf}</ul></li>'.format(
            rota=p["rota"], nome=p["nome"], rumina=p["rumina"], conf=conf))
    pend = [
        ("WhatsApp", "Confirmar se +55 84 8849-4456 (wa.me/558488494456) abre a conta certa. Celulares brasileiros costumam ter o 9 inicial; o número segue o print 08."),
        ("Formação", "Confirmar título e grafia de “Especialista em Direito Penal e Criminologia pela PUC/RS”. Depois, mudar formacao.confirmada para true em fonte/config.json."),
        ("Comissão OAB/RN", "A OAB/RN lista o nome na Comissão da Advocacia Criminal. Referência guardada no dossiê; publicar somente com aval do advogado."),
        ("Endereço e horários", "Sem endereço, horário ou plantão publicados. Preencher endereco em fonte/config.json quando houver dado verificável."),
        ("Google", "Nenhuma ficha pública identificável em 19/11/2026. Mapa, avaliações e estrelas ficam fora até existirem."),
        ("Domínio", "Informar o domínio definitivo para gerar canonicals, Open Graph, robots.txt e sitemap.xml (gerar.py --dominio)."),
        ("Medição", "GA4 ou GTM somente com integração autorizada. O evento click_whatsapp já está pronto."),
        ("Fotos", "Os retratos vieram de capturas de tela. Arquivos originais da sessão melhoram a nitidez em telas grandes."),
        ("Conteúdo jurídico", "Revisão do advogado em todas as páginas antes da publicação definitiva."),
    ]
    pend_html = "".join("<div><dt>{}</dt><dd>{}</dd></div>".format(a, b) for a, b in pend)
    return """<main id="conteudo">
  <header class="envelope indice-cabeca">
    <p class="rotulo">Revisão interna · noindex</p>
    <h1>Cinco páginas para validar.</h1>
    <p class="lead">Estas páginas usam o mesmo acabamento do site, mas ficam fora do menu, do sitemap e do ZIP público. Abra cada uma, confira o escopo com o advogado e marque o que entra.</p>
    <p><a class="link-seta" href="@/">Abrir a prévia pública</a></p>
  </header>
  <div class="envelope">
    <ul class="revisao-lista">{itens}</ul>
    <h2 class="secao-titulo">Dados que dependem do escritório</h2>
    <dl class="pendencias">{pend}</dl>
  </div>
</main>""".format(itens="".join(itens), pend=pend_html)


# ---------------------------------------------------------------------------
# Documento completo
# ---------------------------------------------------------------------------

def json_ld(pag: dict, ctx: Ctx) -> str:
    dom = ctx.dominio.rstrip("/") + "/" if ctx.dominio else None
    pessoa = {
        "@type": "Person",
        "@id": (dom or "") + "#advogado",
        "name": CFG["nome_completo"],
        "alternateName": CFG["marca"],
        "jobTitle": "Advogado",
        "identifier": {"@type": "PropertyValue", "propertyID": "OAB/RN", "value": "23.477"},
        "knowsAbout": ["Direito Penal", "Processo Penal", "Execução Penal"],
        "areaServed": [{"@type": "City", "name": "Natal"}, {"@type": "City", "name": "Parnamirim"}],
        "telephone": WA_NUM,
        "sameAs": [IG_URL],
    }
    if dom:
        pessoa["url"] = dom + "o-advogado/"
        pessoa["image"] = dom + "assets/img/retrato-sorriso.webp"
    grafo = []
    if pag["rota"] in ("", "o-advogado/"):
        grafo.append(pessoa)
    if pag["rota"] == "":
        site = {"@type": "WebSite", "name": CFG["marca"] + " · Advocacia criminal", "inLanguage": "pt-BR"}
        if dom:
            site["url"] = dom
        grafo.append(site)
    if pag.get("servico"):
        grafo.append({
            "@type": "Service",
            "name": pag["servico"],
            "serviceType": pag["nome"],
            "description": pag["descricao"],
            "areaServed": [{"@type": "City", "name": "Natal"}, {"@type": "City", "name": "Parnamirim"}],
            "provider": {"@id": (dom or "") + "#advogado", "@type": "Person", "name": CFG["nome_completo"]},
        })
    if dom and pag.get("trilha"):
        itens = []
        for i, (nome, rota) in enumerate(pag["trilha"], 1):
            item = {"@type": "ListItem", "position": i, "name": texto_puro(nome)}
            item["item"] = dom + (rota if rota is not None else pag["rota"])
            itens.append(item)
        grafo.append({"@type": "BreadcrumbList", "itemListElement": itens})
    if not grafo:
        return ""
    dados = {"@context": "https://schema.org", "@graph": grafo}
    return '<script type="application/ld+json">{}</script>'.format(json.dumps(dados, ensure_ascii=False))


def analytics() -> str:
    ga, gtm = CFG["analytics"].get("ga4", "").strip(), CFG["analytics"].get("gtm", "").strip()
    if gtm:
        return ("<script>(function(w,d,s,l,i){{w[l]=w[l]||[];w[l].push({{'gtm.start':new Date().getTime(),event:'gtm.js'}});"
                "var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;"
                "f.parentNode.insertBefore(j,f);}})(window,document,'script','dataLayer','{}');</script>").format(esc(gtm))
    if ga:
        return ('<script async src="https://www.googletagmanager.com/gtag/js?id={0}"></script>'
                "<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}"
                "gtag('js',new Date());gtag('config','{0}');</script>").format(esc(ga))
    return ""


PRELOAD = ('<link rel="preload" href="@assets/fonts/instrument-serif-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>\n'
           '<link rel="preload" href="@assets/fonts/dm-sans-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>\n')


def documento(pag: dict, corpo: str, ctx: Ctx, revisao: bool = False) -> str:
    rota = pag["rota"]
    publicar = bool(ctx.dominio) and not revisao
    robots = "index,follow" if publicar else "noindex,follow"
    meta_extra = []
    if ctx.dominio and not revisao:
        url = ctx.dominio.rstrip("/") + "/" + rota
        meta_extra += [
            '<link rel="canonical" href="{}">'.format(url),
            '<meta property="og:url" content="{}">'.format(url),
            '<meta property="og:image" content="{}/assets/img/og.jpg">'.format(ctx.dominio.rstrip("/")),
            '<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">',
            '<meta name="twitter:card" content="summary_large_image">',
        ]
    titulo = pag["titulo_busca"]
    v = ctx.versao
    cabeca = """<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{titulo}</title>
<meta name="description" content="{desc}">
<meta name="robots" content="{robots}">
<meta name="theme-color" content="#1E1E1E">
<meta name="view-transition" content="same-origin">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="{marca}">
<meta property="og:title" content="{titulo}">
<meta property="og:description" content="{desc}">
{extra}
<link rel="icon" href="@assets/img/favicon.svg" type="image/svg+xml">
{preload}<link rel="stylesheet" href="@assets/css/site.css?v={v}">
<script>document.documentElement.classList.add("js")</script>
<script src="@assets/js/site.js?v={v}" defer></script>
{ld}
{analytics}
</head>
<body>
""".format(titulo=esc(titulo), desc=esc(pag["descricao"]), robots=robots, marca=esc(CFG["marca"]),
           extra="\n".join(meta_extra), v=v, preload=PRELOAD if ctx.modo != "local" else "", ld=json_ld(pag, ctx), analytics=analytics())
    doc = cabeca + cabecalho(rota, revisao) + "\n" + corpo + "\n" + rodape() + "\n</body>\n</html>\n"
    return resolver(doc, rota, ctx, revisao)


# ---------------------------------------------------------------------------
# Catálogo de rotas
# ---------------------------------------------------------------------------

POR_ROTA: dict[str, dict] = {}
for _p in C.FRENTES + C.GUIAS + [C.PARNAMIRIM]:
    POR_ROTA[_p["rota"]] = _p
POR_ROTA["atuacao/"] = {"rota": "atuacao/", "rumina": "Todas as situações, da investigação ao cumprimento da pena", "nome": "Áreas de atuação"}


def rotas_publicas() -> list[tuple[dict, str]]:
    """As 16 rotas públicas: (metadados, corpo)."""
    pags = []
    pags.append(({"rota": "", "titulo_busca": "Advogado criminalista em Natal, RN | Melquisedeque Brito",
                  "descricao": "Melquisedeque de Brito Trindade, OAB/RN 23.477. Defesa criminal e orientação a famílias em Natal, Parnamirim e região: intimação, prisão, processo e execução da pena."},
                 pagina_inicio()))
    pags.append(({"rota": "atuacao/", "titulo_busca": "Atuação criminal em Natal: escolha pela sua dúvida | Melquisedeque Brito",
                  "descricao": "Investigação e prisão, processo criminal e cumprimento da pena. Cada situação começa pela pergunta comum e leva à página com a resposta.",
                  "trilha": [("Início", ""), ("Atuação", None)]},
                 pagina_atuacao()))
    for f in C.FRENTES:
        trilha = [("Início", ""), ("Atuação", "atuacao/"), (f["nome"], None)]
        meta = dict(f, trilha=trilha)
        pags.append((meta, pagina_leitura(f, trilha, f["kicker"])))
    pags.append(({"rota": "atuacao/flagrante-e-custodia/", "titulo_busca": "Flagrante e audiência de custódia em Natal | Melquisedeque Brito",
                  "descricao": "Prisão em flagrante e audiência de custódia agora têm páginas próprias. Escolha a que responde à sua dúvida.",
                  "trilha": [("Início", ""), ("Atuação", "atuacao/"), ("Flagrante e custódia", None)]},
                 pagina_entrada()))
    pags.append(({"rota": "o-advogado/", "titulo_busca": "Melquisedeque de Brito Trindade, advogado criminal | OAB/RN 23.477",
                  "descricao": "Melquisedeque de Brito Trindade, advogado inscrito na OAB/RN sob o nº 23.477, com atuação em matéria criminal em Natal, Parnamirim e região.",
                  "trilha": [("Início", ""), ("O advogado", None)]},
                 pagina_advogado()))
    p = C.PARNAMIRIM
    trilha = [("Início", ""), ("Atendimento em Parnamirim", None)]
    pags.append((dict(p, trilha=trilha), pagina_leitura(p, trilha, p["kicker"])))
    pags.append(({"rota": "orientacoes/", "titulo_busca": "Caderno criminal: orientações sobre Direito Penal | Melquisedeque Brito",
                  "descricao": "Leituras curtas sobre primariedade e reincidência, Pix recebido por engano, intimação, citação e execução da pena, com a lei de origem.",
                  "trilha": [("Início", ""), ("Caderno criminal", None)]},
                 pagina_caderno()))
    for g in C.GUIAS:
        trilha = [("Início", ""), ("Caderno criminal", "orientacoes/"), (g["nome"], None)]
        pags.append((dict(g, trilha=trilha), pagina_leitura(g, trilha, "Caderno criminal · " + g["assunto"])))
    pags.append(({"rota": "contato/", "titulo_busca": "Contato | Melquisedeque Brito, advocacia criminal em Natal",
                  "descricao": "Fale com Melquisedeque de Brito Trindade pelo WhatsApp +55 84 8849-4456 ou pelo Instagram @advmelquisedeque. Atendimento em Natal, Parnamirim e região.",
                  "trilha": [("Início", ""), ("Contato", None)]},
                 pagina_contato()))
    return pags


def favicon() -> str:
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#1E1E1E"/>'
            '<rect x="7" y="7" width="50" height="50" fill="none" stroke="#AC8856" stroke-width="2.5"/>'
            '<text x="32" y="42" text-anchor="middle" font-family="Georgia, serif" font-size="26" fill="#AC8856" letter-spacing="-1">MB</text></svg>')


# ---------------------------------------------------------------------------
# Escrita
# ---------------------------------------------------------------------------

def versao_assets() -> str:
    h = hashlib.sha1()
    for arq in sorted((FONTE / "assets").rglob("*")):
        if arq.is_file() and arq.suffix in (".css", ".js"):
            h.update(arq.read_bytes())
    return h.hexdigest()[:8]


def copiar_assets(destino: Path) -> None:
    if destino.exists():
        shutil.rmtree(destino)
    shutil.copytree(FONTE / "assets", destino)
    (destino / "img" / "favicon.svg").write_text(favicon(), encoding="utf-8")


def escrever(pasta: Path, rota: str, conteudo_html: str) -> None:
    alvo = pasta / rota / "index.html"
    alvo.parent.mkdir(parents=True, exist_ok=True)
    alvo.write_text(conteudo_html, encoding="utf-8")


def limpar(pasta: Path) -> None:
    if pasta.exists():
        shutil.rmtree(pasta)
    pasta.mkdir(parents=True)


def gerar_publico(pasta: Path, ctx: Ctx) -> list[str]:
    limpar(pasta)
    copiar_assets(pasta / "assets")
    rotas = []
    for meta, corpo in rotas_publicas():
        escrever(pasta, meta["rota"], documento(meta, corpo, ctx))
        rotas.append(meta["rota"])
    # O Netlify serve 404.html em qualquer profundidade de URL, por isso ele usa caminhos a partir da raiz.
    nf = {"rota": "", "titulo_busca": "Página não encontrada | Melquisedeque Brito", "descricao": "Endereço não encontrado."}
    pagina = documento(nf, pagina_404(), Ctx("raiz", None, ctx.versao))
    (pasta / "404.html").write_text(pagina, encoding="utf-8")
    return rotas


def gerar_revisao(pasta: Path, ctx: Ctx) -> list[str]:
    limpar(pasta)
    rotas = [""]
    indice = {"rota": "", "titulo_busca": "Revisão: páginas adicionais | Melquisedeque Brito",
              "descricao": "Índice interno das páginas adicionais em revisão."}
    escrever(pasta, "", documento(indice, pagina_revisao_indice(), ctx, revisao=True))
    for p in C.REVISAO:
        trilha = [("Revisão", "r:"), (p["nome"], None)]
        corpo = pagina_leitura(p, trilha, p["kicker"], revisao=True)
        escrever(pasta, p["rota"], documento(p, corpo, ctx, revisao=True))
        rotas.append(p["rota"])
    return rotas


def extras_deploy(pasta: Path, ctx: Ctx, rotas: list[str]) -> None:
    cab = ["/*", "  X-Content-Type-Options: nosniff", "  Referrer-Policy: strict-origin-when-cross-origin"]
    if not ctx.dominio:
        cab.append("  X-Robots-Tag: noindex, follow")
    cab += ["/assets/*", "  Cache-Control: public, max-age=604800"]
    (pasta / "_headers").write_text("\n".join(cab) + "\n", encoding="utf-8")
    if ctx.dominio:
        dom = ctx.dominio.rstrip("/")
        (pasta / "robots.txt").write_text("User-agent: *\nAllow: /\n\nSitemap: {}/sitemap.xml\n".format(dom), encoding="utf-8")
        urls = "".join("  <url><loc>{}/{}</loc></url>\n".format(dom, r) for r in rotas)
        (pasta / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{}</urlset>\n'.format(urls), encoding="utf-8")
    else:
        (pasta / "robots.txt").write_text("# Prévia de apresentação: as páginas usam noindex.\nUser-agent: *\nAllow: /\n", encoding="utf-8")


def zipar(pasta: Path, destino: Path) -> None:
    destino.parent.mkdir(parents=True, exist_ok=True)
    if destino.exists():
        destino.unlink()
    with zipfile.ZipFile(destino, "w", zipfile.ZIP_DEFLATED) as z:
        for arq in sorted(pasta.rglob("*")):
            if arq.is_file():
                z.write(arq, arq.relative_to(pasta).as_posix())


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--dominio", help="domínio definitivo, ex.: https://www.exemplo.com.br")
    ap.add_argument("--zip", action="store_true", help="gera dist/ e o ZIP de deploy em entrega/")
    args = ap.parse_args()
    if args.dominio and not re.match(r"^https://[a-z0-9.-]+\.[a-z]{2,}/?$", args.dominio):
        ap.error("use o formato https://www.exemplo.com.br")

    versao = versao_assets()
    local = Ctx("local", None, versao)
    rotas = gerar_publico(RAIZ / "site", local)
    rev = gerar_revisao(RAIZ / "revisao", local)
    print("site/      {} rotas públicas (prévia local, noindex)".format(len(rotas)))
    print("revisao/   índice + {} páginas adicionais".format(len(rev) - 1))

    if args.zip or args.dominio:
        limpo = Ctx("limpo", args.dominio, versao)
        dist = RAIZ / "dist"
        gerar_publico(dist, limpo)
        extras_deploy(dist, limpo, rotas)
        nome = "melquisedeque-brito-{}.zip".format("publicacao" if args.dominio else "previa-netlify")
        zipar(dist, RAIZ / "entrega" / nome)
        print("dist/      URLs limpas para deploy{}".format(" em " + args.dominio if args.dominio else " (noindex)"))
        print("entrega/{}".format(nome))


if __name__ == "__main__":
    main()
