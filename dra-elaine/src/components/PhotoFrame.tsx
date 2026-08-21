import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  /** Nome do slot, exibido enquanto a fotografia final não existe. */
  caption: string;
  ratioLabel: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
};

/**
 * Moldura de fotografia.
 *
 * A existência do arquivo é verificada durante o build: se a fotografia
 * ainda não foi entregue, o slot identificado é renderizado e nenhuma
 * requisição de imagem é disparada — sem erro de console e sem imagem
 * substituta. Basta adicionar o arquivo em `public/` e rebuildar para a
 * foto entrar no lugar, na mesma proporção, sem deslocar o layout.
 */
function photoExists(src: string): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", src));
  } catch {
    return false;
  }
}

export default function PhotoFrame({
  src,
  alt,
  caption,
  ratioLabel,
  sizes,
  priority,
  className = "",
  imageClassName = "",
}: Props) {
  const available = photoExists(src);

  return (
    <div className={`relative overflow-hidden bg-areia/30 ${className}`}>
      {available ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={`object-cover ${imageClassName}`}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="w-full max-w-[15rem] border-y border-vinho/20 py-4 text-center">
            <p className="eyebrow text-dourado-escuro">Fotografia</p>
            <p className="mt-2 font-display text-[1.0625rem] leading-snug text-vinho">
              {caption}
            </p>
            <p className="mt-2 text-[0.625rem] font-semibold tracking-[0.18em] text-grafite/65 uppercase">
              {ratioLabel}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
