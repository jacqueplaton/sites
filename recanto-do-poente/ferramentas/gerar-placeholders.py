#!/usr/bin/env python3
# ==========================================================================
# PLACEHOLDERS TEMPORÁRIOS — Recanto do Poente
# --------------------------------------------------------------------------
# As 16 fotografias do anúncio NÃO acompanharam esta entrega (o ZIP com
# fotos_originais/, assets/ e assets_manifest.json não chegou junto com o
# comando). Para que o site ficasse funcionando de verdade — e não um
# wireframe — cada slot recebeu um painel neutro na proporção exata da
# fotografia correspondente, com o nome do arquivo impresso.
#
# Os painéis NÃO são fotos: não há imagem gerada por IA nem banco de
# imagens. São superfícies de cor da própria paleta, só para sustentar o
# layout até as fotos reais chegarem.
#
# COMO SUBSTITUIR: copie o WebP real sobre o arquivo de mesmo nome em
# assets/. Nada no HTML ou no CSS precisa mudar.
#
# Depois que as 16 fotos entrarem, esta pasta ferramentas/ pode ser
# apagada. Ela não vai para o ar (veja montar-pacote.sh).
#
# Uso:  python3 ferramentas/gerar-placeholders.py
# ==========================================================================
import os
import sys

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    sys.exit('Este script precisa do Pillow: pip install Pillow')

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

FUNDO  = (237, 230, 218)   # marfim um tom abaixo do fundo da página
LINHA  = (217, 206, 192)   # #D9CEC0 — mesma cor dos divisores do site
TINTA  = (138, 130, 117)   # cinza quente, legível sobre o fundo
ACENTO = (167,  95,  61)   # #A75F3D — terracota, só no traço do canto

FONTE_TITULO = '/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'
FONTE_CORPO  = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'

# arquivo, largura, altura, proporção declarada na curadoria
IMAGENS = [
    ('exterior/01-hero-deck.webp',       2400, 1600, '3:2'),
    ('exterior/02-piscina-vertical.webp', 1200, 1600, '3:4'),
    ('exterior/03-fachada-jardim.webp',   1600, 1200, '4:3'),
    ('agua/04-vista-piscina.webp',        2400, 1600, '3:2'),
    ('paisagem/05-poente-agua.webp',      1080, 1920, '9:16'),
    ('interior/06-loft-integrado.webp',   2400, 1600, '3:2'),
    ('cozinha/07-cozinha-jantar.webp',    1800, 1200, '3:2'),
    ('quarto/08-cama-madeira.webp',       1800, 1200, '3:2'),
    ('banheiro/09-banheiro.webp',         1800, 1200, '3:2'),
    ('banheiro/10-banheiro-vista.webp',   1800, 1200, '3:2'),
    ('detalhes/11-roupoes.webp',          1200, 1800, '2:3'),
    ('exterior/12-fogueira-noite.webp',   1200, 1600, '3:4'),
    ('paisagem/13-horizonte-jardim.webp', 1200, 1600, '3:4'),
    ('exterior/14-chegada-poente.webp',   2400, 1600, '3:2'),
    ('exterior/15-poltronas-deck.webp',   1600, 1280, '5:4'),
    ('agua/16-agua-deck.webp',            1200, 1600, '3:4'),
]


def fonte(caminho, tamanho):
    try:
        return ImageFont.truetype(caminho, tamanho)
    except OSError:
        return ImageFont.load_default()


def centralizar(d, texto, f, y, largura, cor):
    caixa = d.textbbox((0, 0), texto, font=f)
    d.text(((largura - (caixa[2] - caixa[0])) / 2 - caixa[0], y), texto, font=f, fill=cor)
    return caixa[3] - caixa[1]


def gerar(destino, largura, altura, proporcao):
    img = Image.new('RGB', (largura, altura), FUNDO)
    d = ImageDraw.Draw(img)
    menor = min(largura, altura)

    # Hachura diagonal muito discreta: lê como superfície, não como foto.
    passo = max(28, menor // 26)
    for x in range(-altura, largura + altura, passo):
        d.line([(x, 0), (x + altura, altura)], fill=LINHA, width=1)

    # Moldura interna e um traço terracota no canto superior esquerdo.
    margem = max(12, menor // 48)
    d.rectangle([margem, margem, largura - margem - 1, altura - margem - 1],
                outline=LINHA, width=max(1, menor // 400))
    traco = menor // 9
    espessura = max(3, menor // 160)
    d.line([(margem, margem), (margem + traco, margem)], fill=ACENTO, width=espessura)
    d.line([(margem, margem), (margem, margem + traco)], fill=ACENTO, width=espessura)

    # Faixa de leitura atrás do texto, para o rótulo não disputar com a hachura.
    nome = os.path.basename(destino)
    f_nome = fonte(FONTE_TITULO, max(18, menor // 22))
    f_meta = fonte(FONTE_CORPO,  max(13, menor // 38))

    alt_faixa = menor // 4
    d.rectangle([margem + 1, (altura - alt_faixa) // 2,
                 largura - margem - 1, (altura + alt_faixa) // 2], fill=FUNDO)

    y = (altura - alt_faixa) // 2 + alt_faixa // 2 - menor // 16
    y += centralizar(d, 'fotografia pendente', f_meta, y, largura, TINTA) + menor // 30
    y += centralizar(d, nome, f_nome, y, largura, (40, 38, 34)) + menor // 34
    centralizar(d, '%s  ·  %d × %d px' % (proporcao, largura, altura), f_meta, y, largura, TINTA)

    caminho = os.path.join(RAIZ, 'assets', destino)
    os.makedirs(os.path.dirname(caminho), exist_ok=True)
    img.save(caminho, 'WEBP', quality=82, method=6)
    return caminho


if __name__ == '__main__':
    total = 0
    for destino, largura, altura, proporcao in IMAGENS:
        caminho = gerar(destino, largura, altura, proporcao)
        tamanho = os.path.getsize(caminho)
        total += tamanho
        print('%-40s %5d × %-5d %6.1f KB' % (destino, largura, altura, tamanho / 1024))
    print('\n%d arquivos · %.1f KB no total' % (len(IMAGENS), total / 1024))
