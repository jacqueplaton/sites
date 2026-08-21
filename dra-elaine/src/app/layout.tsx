import type { Metadata } from "next";
import { Bodoni_Moda, Archivo } from "next/font/google";
import { siteData, siteUrl } from "@/data/site";
import "./globals.css";

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const title = `${siteData.displayName} | Saúde, Estética e Cuidado Integrativo em ${siteData.city}`;
const description = `Atendimento individualizado em ${siteData.city}, on-line e domiciliar no Rio de Janeiro. Conheça a abordagem e os tratamentos da ${siteData.displayName}.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s | ${siteData.displayName}`,
  },
  description,
  applicationName: siteData.displayName,
  authors: [{ name: siteData.displayName }],
  keywords: [
    "Dra. Elaine Fernandes",
    "emagrecimento anabólico",
    "dermatologia integrativa",
    "ultrassonografia",
    "atendimento domiciliar Rio de Janeiro",
    "Nova Iguaçu",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: siteData.displayName,
    title,
    description,
    images: [
      {
        url: "/images/dra-elaine-hero.png",
        width: 1200,
        height: 1500,
        alt: `Retrato da ${siteData.displayName}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/dra-elaine-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${bodoni.variable} ${archivo.variable} h-full antialiased`}
    >
      <body className="grain min-h-full flex flex-col bg-tinta text-creme">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100] focus:bg-latao focus:px-4 focus:py-2 focus:text-tinta eyebrow"
        >
          Ir para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
