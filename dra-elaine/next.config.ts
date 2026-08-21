import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O site é inteiramente estático: não há rota de API, banco ou renderização
  // no servidor. A exportação gera HTML pronto em `out/`, que pode ser
  // publicado em qualquer hospedagem — inclusive arrastando a pasta no
  // Netlify Drop.
  output: "export",
  trailingSlash: true,
  images: {
    // O otimizador de imagens do Next exige servidor. Na exportação estática
    // as fotos são servidas como estão, então devem ser salvas já
    // redimensionadas (ver public/images/LEIA-ME.md).
    unoptimized: true,
  },
};

export default nextConfig;
