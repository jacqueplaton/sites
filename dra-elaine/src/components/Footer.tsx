import Link from "next/link";
import { navigation, siteData } from "@/data/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { InstagramIcon, WhatsAppIcon } from "./Icons";

export default function Footer() {
  const year = new Date().getFullYear();
  const credentials = [
    siteData.crm ? `CRM ${siteData.crm}` : null,
    siteData.rqe ? `RQE ${siteData.rqe}` : null,
  ].filter(Boolean) as string[];

  return (
    <footer className="bg-grafite on-dark pb-[5.5rem] text-marfim lg:pb-0">
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
        <div className="grid gap-12 py-16 lg:grid-cols-12 lg:gap-8 lg:py-20">
          <div className="lg:col-span-5">
            <p className="font-display text-[1.75rem] leading-none">
              Dra. Elaine <span className="italic font-light">Fernandes</span>
            </p>
            <p className="mt-5 max-w-[34ch] text-[0.875rem] leading-relaxed text-marfim/55">
              Saúde, estética e cuidado integrativo com atendimento
              individualizado.
            </p>
            <p className="mt-6 text-[0.8125rem] text-marfim/55">
              {siteData.locationDisplay}
            </p>
            {siteData.fullAddress && (
              <p className="mt-1 text-[0.8125rem] text-marfim/55">
                {siteData.fullAddress}
              </p>
            )}
            {credentials.length > 0 && (
              <p className="mt-1 text-[0.8125rem] text-marfim/55">
                {credentials.join(" · ")}
              </p>
            )}
          </div>

          <nav aria-label="Navegação do rodapé" className="lg:col-span-3">
            <h2 className="eyebrow text-marfim/55">Navegação</h2>
            <ul className="mt-5 space-y-3">
              {navigation.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="link-underline text-[0.875rem] text-marfim/75"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <h2 className="eyebrow text-marfim/55">Contato</h2>
            <ul className="mt-5 space-y-4">
              <li>
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-[0.875rem] text-marfim/75"
                >
                  <WhatsAppIcon className="h-4 w-4 text-dourado" />
                  <span className="link-underline">
                    {siteData.whatsappDisplay}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={siteData.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-[0.875rem] text-marfim/75"
                >
                  <InstagramIcon className="h-4 w-4 text-dourado" />
                  <span className="link-underline">
                    {siteData.instagramHandle}
                  </span>
                </a>
              </li>
              {siteData.email && (
                <li>
                  <a
                    href={`mailto:${siteData.email}`}
                    className="link-underline text-[0.875rem] text-marfim/75"
                  >
                    {siteData.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-6 border-t border-marfim/12 py-8 lg:flex-row lg:items-start lg:justify-between">
          <p className="max-w-[62ch] text-[0.75rem] leading-relaxed text-marfim/55">
            O conteúdo deste site tem caráter informativo e não substitui a
            avaliação de um profissional de saúde. A indicação de qualquer
            procedimento depende de avaliação individual.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.75rem] text-marfim/55">
            <Link
              href="/politica-de-privacidade"
              className="link-underline text-marfim/60"
            >
              Política de Privacidade
            </Link>
            <span>© {year} {siteData.displayName}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
