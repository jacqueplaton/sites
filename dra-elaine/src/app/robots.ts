import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/site";

// Necessário para gerar o arquivo durante a exportação estática.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
