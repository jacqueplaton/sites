#!/usr/bin/env python3
"""Recorta as fotografias recebidas e gera os WebP usados no site.

Uso:  python3 fonte/preparar_imagens.py

Origem:  referencias/fotos-recebidas/
Destino: fonte/assets/img/

Os prints chegaram com bordas de captura de tela (faixas brancas, pretas e
desfocadas). Os recortes abaixo removem só essas bordas e preservam a área
fotográfica, incluindo a assinatura MB do print 04.

As versões @2x são ampliações Lanczos com nitidez leve: evitam o borrão do
navegador em telas de alta densidade, mas não acrescentam detalhe. Quando o
escritório enviar os arquivos originais da sessão de fotos, substitua os
arquivos em referencias/fotos-recebidas/ e rode este script de novo.
"""
from pathlib import Path

from PIL import Image, ImageFilter

RAIZ = Path(__file__).resolve().parent.parent
ORIGEM = RAIZ / "referencias" / "fotos-recebidas"
DESTINO = RAIZ / "fonte" / "assets" / "img"

# nome de saída: (arquivo de origem, caixa de recorte (esq, topo, dir, base))
FOTOS = {
    # Print 07: sentado à mesa, paletó escuro, gravata vinho. Retrato da capa.
    "retrato-mesa": ("print-07-mesa-gravata-vinho.png", (131, 12, 575, 571)),
    # Print 04: sorrindo, parede de mármore, assinatura MB. Biografia.
    "retrato-sorriso": ("print-04-sorriso-assinatura.webp", (5, 2, 597, 586)),
    # Print 05: junto à janela. Área fotográfica estreita: detalhe vertical.
    "detalhe-janela": ("print-05-janela.png", (130, 2, 332, 594)),
}


def salvar(img: Image.Image, nome: str, qualidade: int = 82) -> None:
    caminho = DESTINO / f"{nome}.webp"
    img.save(caminho, "WEBP", quality=qualidade, method=6)
    print(f"  {caminho.relative_to(RAIZ)}  {img.size[0]}x{img.size[1]}")


def main() -> None:
    DESTINO.mkdir(parents=True, exist_ok=True)
    for nome, (arquivo, caixa) in FOTOS.items():
        foto = Image.open(ORIGEM / arquivo).convert("RGB").crop(caixa)
        salvar(foto, nome)
        dobro = foto.resize((foto.width * 2, foto.height * 2), Image.LANCZOS)
        dobro = dobro.filter(ImageFilter.UnsharpMask(radius=1.6, percent=60, threshold=2))
        salvar(dobro, f"{nome}@2x", qualidade=78)


if __name__ == "__main__":
    main()
