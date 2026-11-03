#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Verificador de indexação e visibilidade do site Jacque Platon.

É a checagem automática dos itens que dão errado em silêncio: canonical
apontando para o lugar errado, título duplicado, noindex esquecido, link
interno quebrado, imagem sem texto alternativo, JSON-LD inválido, página fora
do sitemap. Roda sem instalar nada: só Python 3.

    python3 ferramentas/verificar.py

Saída: lista de ERROs e AVISOs. Código de saída 1 se houver qualquer ERRO,
para dar para usar em automação.

O que este script NÃO faz: dizer se o site está bem posicionado. Posição não
se verifica localmente. Para isso, veja a seção "Checagem de visibilidade" do
README.md.
"""

import json
import os
import re
import sys
from html.parser import HTMLParser

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from gerar import DOMINIO, url  # noqa: E402
import conteudo  # noqa: E402

erros = []
avisos = []


def erro(arquivo, msg):
    erros.append("ERRO   %-42s %s" % (arquivo, msg))


def aviso(arquivo, msg):
    avisos.append("AVISO  %-42s %s" % (arquivo, msg))


# ---------------------------------------------------------------------------
class Leitor(HTMLParser):
    """Extrai do HTML só o que interessa para a checagem."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.titulo = None
        self._em_titulo = False
        self.lang = None
        self.metas = {}
        self.props = {}
        self.canonical = None
        self.rel_author = None
        self.headings = []          # [(nivel, texto)]
        self._nivel_atual = None
        self._texto_heading = []
        self.jsonld = []
        self._em_jsonld = False
        self._buffer_jsonld = []
        self.links = []             # hrefs
        self.ids = set()
        self.imagens = []           # dicts de atributos
        self.texto = []
        self._ignorar = 0

    # -- tags ---------------------------------------------------------------
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            self.ids.add(a["id"])
        if tag == "html":
            self.lang = a.get("lang")
        elif tag == "title":
            self._em_titulo = True
        elif tag == "meta":
            if a.get("name"):
                self.metas[a["name"].lower()] = a.get("content", "")
            if a.get("property"):
                self.props[a["property"].lower()] = a.get("content", "")
        elif tag == "link":
            rel = (a.get("rel") or "").lower()
            if rel == "canonical":
                self.canonical = a.get("href")
            elif rel == "author":
                self.rel_author = a.get("href")
        elif tag == "script":
            if (a.get("type") or "").lower() == "application/ld+json":
                self._em_jsonld = True
                self._buffer_jsonld = []
            self._ignorar += 1
        elif tag == "style":
            self._ignorar += 1
        elif tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            self._nivel_atual = int(tag[1])
            self._texto_heading = []
        elif tag == "a" and a.get("href"):
            self.links.append(a["href"])
        elif tag == "img":
            self.imagens.append(a)

    def handle_endtag(self, tag):
        if tag == "title":
            self._em_titulo = False
        elif tag == "script":
            if self._em_jsonld:
                self.jsonld.append("".join(self._buffer_jsonld))
                self._em_jsonld = False
            self._ignorar = max(0, self._ignorar - 1)
        elif tag == "style":
            self._ignorar = max(0, self._ignorar - 1)
        elif tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            if self._nivel_atual:
                self.headings.append(
                    (self._nivel_atual, " ".join("".join(self._texto_heading).split())))
            self._nivel_atual = None

    def handle_data(self, data):
        if self._em_jsonld:
            self._buffer_jsonld.append(data)
            return
        if self._em_titulo:
            self.titulo = (self.titulo or "") + data
            return
        if self._nivel_atual:
            self._texto_heading.append(data)
        if not self._ignorar:
            self.texto.append(data)

    def texto_visivel(self):
        return " ".join("".join(self.texto).split())


# ---------------------------------------------------------------------------
def coleta_ids_por_pagina(paginas_html):
    return {caminho: leitor.ids for caminho, leitor in paginas_html.items()}


def arquivo_de_caminho(destino):
    """'/sobre/' -> sobre/index.html ; '/' -> index.html ; '/robots.txt' -> robots.txt"""
    limpo = destino.lstrip("/")
    if limpo == "":
        return "index.html"
    if limpo.endswith("/"):
        return limpo + "index.html"
    return limpo


def main():
    esperadas = {}
    for p in conteudo.PAGINAS:
        rel = "index.html" if p["slug"] == "" else p["slug"] + "/index.html"
        esperadas[rel] = p
    esperadas["404.html"] = conteudo.PAGINA_404

    # ---- leitura de todos os HTML -----------------------------------------
    paginas = {}
    for rel in esperadas:
        caminho = os.path.join(RAIZ, rel)
        if not os.path.isfile(caminho):
            erro(rel, "arquivo não existe. Rode ferramentas/gerar.py.")
            continue
        leitor = Leitor()
        leitor.feed(open(caminho, encoding="utf-8").read())
        paginas[rel] = leitor

    if not paginas:
        print("Nenhuma página encontrada.")
        return 1

    titulos, descricoes = {}, {}

    for rel, L in paginas.items():
        p = esperadas[rel]
        e404 = rel == "404.html"
        pagina_url = p.get("url_absoluta") or url(p["slug"])

        # idioma
        if L.lang != "pt-BR":
            erro(rel, "atributo lang do <html> deveria ser pt-BR, está %r" % L.lang)

        # item 6 — título
        t = (L.titulo or "").strip()
        if not t:
            erro(rel, "sem <title>")
        else:
            if len(t) > 65:
                aviso(rel, "título com %d caracteres; acima de ~65 o Google corta: %r"
                      % (len(t), t))
            if len(t) < 15:
                aviso(rel, "título com só %d caracteres" % len(t))
            if t in titulos:
                erro(rel, "título duplicado, igual ao de %s" % titulos[t])
            titulos[t] = rel

        # item 7 — meta description
        d = L.metas.get("description", "").strip()
        if not d:
            erro(rel, "sem meta description")
        else:
            if not (70 <= len(d) <= 165):
                aviso(rel, "meta description com %d caracteres; o ideal fica entre "
                           "70 e 165" % len(d))
            if d in descricoes:
                erro(rel, "meta description duplicada, igual à de %s" % descricoes[d])
            descricoes[d] = rel

        # itens 1 e 9 — meta robots
        robots = L.metas.get("robots", "").lower()
        if not robots:
            erro(rel, "sem meta robots")
        elif e404:
            if "noindex" not in robots:
                aviso(rel, "a página 404 deveria ter noindex")
        else:
            if "noindex" in robots or "nofollow" in robots:
                erro(rel, "meta robots bloqueia indexação: %r" % robots)
            for exigido in ("max-image-preview:large", "max-snippet:-1"):
                if exigido not in robots:
                    aviso(rel, "meta robots sem %s" % exigido)

        # item 8 — canonical
        if p.get("sem_canonical"):
            if L.canonical:
                erro(rel, "esta página não deveria ter tag canônica")
        elif not L.canonical:
            erro(rel, "sem tag canônica")
        elif L.canonical != pagina_url:
            erro(rel, "canonical aponta para %s, esperado %s"
                 % (L.canonical, pagina_url))

        # item 15 — autoria
        if not L.metas.get("author"):
            aviso(rel, "sem meta author")
        if not L.rel_author:
            aviso(rel, 'sem <link rel="author">')

        # Open Graph
        obrigatorias_og = ["og:title", "og:description", "og:image", "og:type"]
        if not p.get("sem_canonical"):
            obrigatorias_og.append("og:url")
        for prop in obrigatorias_og:
            if not L.props.get(prop):
                aviso(rel, "sem %s" % prop)
        if L.props.get("og:url") and L.canonical and L.props["og:url"] != L.canonical:
            erro(rel, "og:url (%s) diferente do canonical (%s)"
                 % (L.props["og:url"], L.canonical))

        # item 11 — headings
        h1s = [h for h in L.headings if h[0] == 1]
        if len(h1s) == 0:
            erro(rel, "sem h1")
        elif len(h1s) > 1:
            erro(rel, "%d elementos h1; deve haver exatamente um" % len(h1s))
        else:
            if len(h1s[0][1]) < 12:
                aviso(rel, "h1 muito curto para ser descritivo: %r" % h1s[0][1])
        niveis = [n for n, _ in L.headings]
        anterior = None
        for n in niveis:
            if anterior is not None and n > anterior + 1:
                aviso(rel, "salto de h%d para h%d na hierarquia" % (anterior, n))
                break
            anterior = n
        if not any(n == 2 for n in niveis):
            aviso(rel, "nenhum h2 na página")
        for nivel, texto in L.headings:
            if not texto:
                erro(rel, "heading h%d vazio" % nivel)

        # item 4 — dados estruturados
        if not L.jsonld:
            erro(rel, "sem JSON-LD")
        for bruto in L.jsonld:
            try:
                dados = json.loads(bruto)
            except json.JSONDecodeError as exc:
                erro(rel, "JSON-LD inválido: %s" % exc)
                continue
            if "@context" not in dados:
                erro(rel, "JSON-LD sem @context")
            grafo = dados.get("@graph", [])
            if not grafo:
                erro(rel, "JSON-LD sem @graph")
            # @id definidos em qualquer profundidade do grafo, e @id usados
            # apenas como referência ({"@id": "..."} sozinho).
            definidos, referenciados = set(), set()

            def varre(no):
                if isinstance(no, dict):
                    if set(no.keys()) == {"@id"}:
                        referenciados.add(no["@id"])
                    else:
                        if no.get("@id"):
                            definidos.add(no["@id"])
                        for v in no.values():
                            varre(v)
                elif isinstance(no, list):
                    for v in no:
                        varre(v)

            varre(grafo)
            # Referência a um nó de OUTRA página é válida em JSON-LD. Só é erro
            # apontar para um @id desta mesma página que não existe.
            orfaos = set()
            for r in referenciados - definidos:
                if not r.startswith(DOMINIO):
                    continue
                base = r.split("#")[0]
                if base in (pagina_url, pagina_url.rstrip("/")):
                    orfaos.add(r)
            for o in sorted(orfaos):
                erro(rel, "JSON-LD referencia @id inexistente nesta página: %s" % o)
            for no in grafo:
                if not no.get("@type"):
                    erro(rel, "nó de JSON-LD sem @type")

        # item 10 — conteúdo renderizado em HTML, sem depender de JavaScript
        visivel = L.texto_visivel()
        if len(visivel) < 1200:
            erro(rel, "só %d caracteres de texto no HTML servido; conteúdo pode "
                      "estar dependendo de JavaScript" % len(visivel))
        if "PRÉVIA VISUAL" in visivel:
            erro(rel, "ainda contém o aviso de prévia visual")

        # item 5 — imagens
        for img in L.imagens:
            src = img.get("src", "(sem src)")
            if "alt" not in img:
                erro(rel, "imagem sem atributo alt: %s" % src)
            if not img.get("width") or not img.get("height"):
                aviso(rel, "imagem sem width/height (causa deslocamento de "
                           "layout): %s" % src)
            if src.startswith("/"):
                if not os.path.isfile(os.path.join(RAIZ, src.lstrip("/"))):
                    erro(rel, "imagem não encontrada no disco: %s" % src)

        # domínio consistente e marcadores de conteúdo resolvidos
        bruto_pagina = open(os.path.join(RAIZ, rel), encoding="utf-8").read()
        for achado in set(re.findall(r"https?://[\w.-]+", bruto_pagina)):
            if "SEU-DOMINIO" in achado or "example" in achado:
                erro(rel, "placeholder de domínio esquecido: %s" % achado)
        for marcador in sorted(set(re.findall(r"__[A-Z][A-Z0-9_]*__", bruto_pagina))):
            erro(rel, "marcador de conteúdo não substituído: %s" % marcador)

    # ---- item 18 — links internos ----------------------------------------
    ids_por_arquivo = coleta_ids_por_pagina(paginas)
    for rel, L in paginas.items():
        for href in L.links:
            if href.startswith(("http://", "https://", "mailto:", "tel:")):
                continue
            if href.startswith("#"):
                if href[1:] and href[1:] not in L.ids:
                    erro(rel, "âncora #%s não existe nesta página" % href[1:])
                continue
            if not href.startswith("/"):
                aviso(rel, "link relativo %r; prefira caminho absoluto" % href)
                continue
            destino, _, ancora = href.partition("#")
            alvo = arquivo_de_caminho(destino)
            if not os.path.exists(os.path.join(RAIZ, alvo)):
                erro(rel, "link interno quebrado: %s (arquivo %s)" % (href, alvo))
                continue
            if ancora:
                if alvo not in ids_por_arquivo:
                    aviso(rel, "não deu para checar a âncora de %s" % href)
                elif ancora not in ids_por_arquivo[alvo]:
                    erro(rel, "âncora %s não existe em %s" % (href, alvo))

    # ---- itens 2 e 3 — robots.txt e sitemap.xml --------------------------
    caminho_robots = os.path.join(RAIZ, "robots.txt")
    if not os.path.isfile(caminho_robots):
        erro("robots.txt", "arquivo não existe")
    else:
        texto = open(caminho_robots, encoding="utf-8").read()
        if re.search(r"(?mi)^\s*Disallow:\s*/\s*$", texto):
            erro("robots.txt", "existe um 'Disallow: /' bloqueando o site inteiro")
        linha_sitemap = "Sitemap: %s/sitemap.xml" % DOMINIO
        if linha_sitemap not in texto:
            erro("robots.txt", "falta a linha %r" % linha_sitemap)
        obrigatorios = ["Googlebot", "Google-Extended", "GPTBot", "OAI-SearchBot",
                        "ClaudeBot", "PerplexityBot", "Bingbot", "Applebot"]
        for nome in obrigatorios:
            if not re.search(r"(?mi)^\s*User-agent:\s*%s\s*$" % re.escape(nome), texto):
                erro("robots.txt", "robô %s não está liberado nominalmente" % nome)

    caminho_sitemap = os.path.join(RAIZ, "sitemap.xml")
    if not os.path.isfile(caminho_sitemap):
        erro("sitemap.xml", "arquivo não existe")
    else:
        bruto = open(caminho_sitemap, encoding="utf-8").read()
        locs = re.findall(r"<loc>([^<]+)</loc>", bruto)
        lastmods = re.findall(r"<lastmod>([^<]+)</lastmod>", bruto)
        if len(locs) != len(lastmods):
            aviso("sitemap.xml", "número de <loc> e <lastmod> diferente")
        for data in lastmods:
            if not re.match(r"^\d{4}-\d{2}-\d{2}$", data):
                erro("sitemap.xml", "lastmod fora do formato AAAA-MM-DD: %r" % data)
        indexaveis = [p for p in conteudo.PAGINAS
                      if not p.get("robots", "").startswith("noindex")]
        for p in indexaveis:
            if url(p["slug"]) not in locs:
                erro("sitemap.xml", "falta a página %s" % url(p["slug"]))
        for loc in locs:
            if not loc.startswith(DOMINIO):
                erro("sitemap.xml", "URL de outro domínio: %s" % loc)
                continue
            caminho = loc[len(DOMINIO):]
            alvo = arquivo_de_caminho(caminho)
            if not os.path.isfile(os.path.join(RAIZ, alvo)):
                erro("sitemap.xml", "URL no sitemap sem arquivo no disco: %s" % loc)
        canonicos = {L.canonical for L in paginas.values() if L.canonical}
        for loc in locs:
            if loc not in canonicos:
                erro("sitemap.xml", "%s não é a canônica de nenhuma página" % loc)

    # ---- relatório -------------------------------------------------------
    print("Verificação do site Jacque Platon")
    print("Domínio configurado: %s" % DOMINIO)
    print("Páginas conferidas: %d\n" % len(paginas))

    for linha in erros:
        print(linha)
    for linha in avisos:
        print(linha)

    print("\n%d erro(s), %d aviso(s)." % (len(erros), len(avisos)))
    if not erros:
        print("Nenhum erro de indexação encontrado nos arquivos locais.")
        print("A checagem de visibilidade real está no README.md, seção "
              "'Checagem de visibilidade nas buscas'.")
    return 1 if erros else 0


if __name__ == "__main__":
    sys.exit(main())
