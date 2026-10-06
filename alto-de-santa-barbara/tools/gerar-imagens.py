#!/usr/bin/env python3
"""
Gera as versões web das fotografias reais listadas em fotos/fotos.json.

Para cada foto encontrada em fotos/ cria, em img/:
  <id>-<largura>.avif   (formato principal)
  <id>-<largura>.webp   (alternativa)
  <id>.jpg              (último recurso, uma largura só)

Nunca amplia: larguras maiores que o arquivo original são ignoradas.
Também gera img/og-01-hero.jpg (1200 x 630) para compartilhamento.

Uso (na pasta alto-de-santa-barbara/):
    python3 tools/gerar-imagens.py

Requer Pillow 11+ com suporte a AVIF (pip install pillow).
"""
import json
import sys
from pathlib import Path

from PIL import Image, ImageOps, features

RAIZ = Path(__file__).resolve().parent.parent
FOTOS = RAIZ / "fotos"
SAIDA = RAIZ / "img"
EXTENSOES = (".webp", ".png", ".jpg", ".jpeg")

QUALIDADE_AVIF = 52
QUALIDADE_WEBP = 74
QUALIDADE_JPG = 78

# Recorte social da foto 01: faixa que mantém a borda do ofurô e a serra.
# Valores em fração da altura original (0 = topo). Revisado visualmente.
OG_TOPO = 0.12


def achar_fonte(nome):
    """Aceita o nome do manifesto ou o mesmo nome com outra extensão."""
    caminho = FOTOS / nome
    if caminho.exists():
        return caminho
    base = Path(nome).stem
    for ext in EXTENSOES:
        alternativa = FOTOS / (base + ext)
        if alternativa.exists():
            return alternativa
    return None


def abrir(caminho):
    imagem = Image.open(caminho)
    imagem = ImageOps.exif_transpose(imagem)
    return imagem.convert("RGB")


def salvar_variantes(foto, imagem):
    largura_original, altura_original = imagem.size
    larguras = [w for w in foto["larguras"] if w <= largura_original]
    if not larguras:
        larguras = [largura_original]
    gerados = []
    for largura in larguras:
        altura = round(altura_original * largura / largura_original)
        reduzida = imagem if largura == largura_original else imagem.resize(
            (largura, altura), Image.LANCZOS)
        avif = SAIDA / f"{foto['id']}-{largura}.avif"
        webp = SAIDA / f"{foto['id']}-{largura}.webp"
        reduzida.save(avif, "AVIF", quality=QUALIDADE_AVIF, speed=4)
        reduzida.save(webp, "WEBP", quality=QUALIDADE_WEBP, method=6)
        gerados.append({"largura": largura, "altura": altura,
                        "avif": avif.stat().st_size, "webp": webp.stat().st_size})

    # JPEG de último recurso: segunda largura da lista (ou a única).
    largura_jpg = larguras[1] if len(larguras) > 1 else larguras[0]
    altura_jpg = round(altura_original * largura_jpg / largura_original)
    jpg = SAIDA / f"{foto['id']}.jpg"
    imagem.resize((largura_jpg, altura_jpg), Image.LANCZOS).save(
        jpg, "JPEG", quality=QUALIDADE_JPG, optimize=True, progressive=True)
    return {"largura_original": largura_original, "altura_original": altura_original,
            "jpg": {"largura": largura_jpg, "altura": altura_jpg, "bytes": jpg.stat().st_size},
            "variantes": gerados}


def salvar_og(imagem):
    largura, altura = imagem.size
    altura_recorte = round(largura * 630 / 1200)
    topo = min(round(altura * OG_TOPO), altura - altura_recorte)
    recorte = imagem.crop((0, topo, largura, topo + altura_recorte))
    destino = SAIDA / "og-01-hero.jpg"
    recorte.resize((1200, 630), Image.LANCZOS).save(
        destino, "JPEG", quality=82, optimize=True, progressive=True)
    return destino


def main():
    if not features.check("avif"):
        sys.exit("Pillow sem suporte a AVIF. Atualize: pip install -U pillow")

    SAIDA.mkdir(exist_ok=True)
    manifesto = json.loads((FOTOS / "fotos.json").read_text(encoding="utf-8"))
    relatorio, faltando = {}, []

    for foto in manifesto["fotos"]:
        fonte = achar_fonte(foto["arquivo"])
        if fonte is None:
            faltando.append(foto["arquivo"])
            continue
        imagem = abrir(fonte)
        relatorio[foto["id"]] = salvar_variantes(foto, imagem)
        if foto["id"] == "01-hero":
            salvar_og(imagem)
        info = relatorio[foto["id"]]
        tamanhos = ", ".join(f"{v['largura']}px {v['avif'] // 1024} KB"
                             for v in info["variantes"])
        print(f"ok  {foto['id']:<12} {info['largura_original']}x{info['altura_original']}  avif: {tamanhos}")

    (SAIDA / "relatorio.json").write_text(
        json.dumps(relatorio, indent=2, ensure_ascii=False), encoding="utf-8")

    if faltando:
        print("\nFaltam arquivos-fonte em fotos/:")
        for nome in faltando:
            print("   ", nome)
        sys.exit(1)


if __name__ == "__main__":
    main()
