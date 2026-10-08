#!/usr/bin/env python3
# ==========================================================================
# SINCRONIZAR DIMENSÕES — Recanto do Poente
# --------------------------------------------------------------------------
# Lê o tamanho real de cada arquivo em assets/ e grava esses números no
# `width`/`height` do index.html e na lista FOTOS do js/app.js.
#
# É o que impede o solavanco de layout: o navegador reserva o espaço certo
# antes de a imagem chegar. Rode sempre que trocar uma foto por outra de
# proporção diferente.
#
# Uso:  python3 ferramentas/sincronizar-dimensoes.py
#       python3 ferramentas/sincronizar-dimensoes.py --conferir   (só relata)
# ==========================================================================
import os
import re
import sys

try:
    from PIL import Image
except ImportError:
    sys.exit('Este script precisa do Pillow: pip install Pillow')

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HTML = os.path.join(RAIZ, 'index.html')
JS   = os.path.join(RAIZ, 'js', 'app.js')

SO_CONFERIR = '--conferir' in sys.argv


def medidas():
    """Caminho web -> (largura, altura) de cada arquivo que existe."""
    tabela = {}
    base = os.path.join(RAIZ, 'assets')
    for pasta, _, arquivos in os.walk(base):
        for nome in arquivos:
            if not nome.endswith('.webp'):
                continue
            caminho = os.path.join(pasta, nome)
            web = os.path.relpath(caminho, RAIZ).replace(os.sep, '/')
            with Image.open(caminho) as im:
                tabela[web] = im.size
    return tabela


def ajustar_html(texto, tabela, mudancas):
    """Casa width/height com o src/srcset da mesma tag, em qualquer ordem."""
    def uma_tag(m):
        tag = m.group(0)
        achado = re.search(r'(?:src|srcset)="(assets/[^"]+\.webp)"', tag)
        if not achado or achado.group(1) not in tabela:
            return tag
        largura, altura = tabela[achado.group(1)]

        novo = re.sub(r'width="\d+"',  'width="%d"' % largura, tag)
        novo = re.sub(r'height="\d+"', 'height="%d"' % altura, novo)
        if novo != tag:
            mudancas.append('%s -> %d × %d' % (achado.group(1), largura, altura))
        return novo

    return re.sub(r'<(?:img|source)\b[^>]*>', uma_tag, texto)


def ajustar_js(texto, tabela, mudancas):
    def uma_entrada(m):
        caminho = m.group(1)
        if caminho not in tabela:
            return m.group(0)
        largura, altura = tabela[caminho]
        novo = "{ src: '%s', w: %d, h: %d," % (caminho, largura, altura)
        if novo.split(',')[1:] != m.group(0).split(',')[1:]:
            mudancas.append('%s -> %d × %d' % (caminho, largura, altura))
        return novo

    return re.sub(r"\{ src: '(assets/[^']+\.webp)',\s*w: \d+, h: \d+,", uma_entrada, texto)


if __name__ == '__main__':
    tabela = medidas()
    if not tabela:
        sys.exit('Nenhum .webp encontrado em assets/.')

    mudancas = []
    html = open(HTML, encoding='utf-8').read()
    js   = open(JS, encoding='utf-8').read()

    html_novo = ajustar_html(html, tabela, mudancas)
    js_novo   = ajustar_js(js, tabela, mudancas)

    if SO_CONFERIR:
        print('\n'.join(sorted(set(mudancas))) if mudancas
              else 'index.html e app.js já batem com os arquivos.')
        sys.exit(0)

    if html_novo != html:
        open(HTML, 'w', encoding='utf-8').write(html_novo)
    if js_novo != js:
        open(JS, 'w', encoding='utf-8').write(js_novo)

    for linha in sorted(set(mudancas)):
        print(linha)
    print('\n%d arquivos lidos · %d medidas atualizadas'
          % (len(tabela), len(set(mudancas))))
