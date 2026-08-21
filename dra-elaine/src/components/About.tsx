import Image from "next/image";
import { siteData } from "@/data/site";

export default function About() {
  const credentials = [
    siteData.crm ? `CRM ${siteData.crm}` : null,
    siteData.rqe ? `RQE ${siteData.rqe}` : null,
  ].filter(Boolean) as string[];

  return (
    <section id="sobre" className="bg-marfim py-20 lg:py-32">
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-4" data-reveal>
              <span className="eyebrow text-dourado-escuro">04</span>
              <span aria-hidden="true" className="h-px w-10 bg-areia" />
              <span className="eyebrow text-grafite/65">
                Sobre a Dra. Elaine
              </span>
            </div>

            <h2
              className="mt-8 max-w-[18ch] font-display text-[2.25rem] leading-[1.02] font-light text-vinho text-balance sm:text-[3rem] lg:text-[3.5rem]"
              data-reveal
              style={{ ["--reveal-delay" as string]: "80ms" }}
            >
              Cuidado técnico com uma visão profundamente{" "}
              <span className="italic">humana.</span>
            </h2>

            <p
              className="mt-8 max-w-[52ch] text-[1rem] leading-relaxed text-grafite/70 text-pretty"
              data-reveal
              style={{ ["--reveal-delay" as string]: "150ms" }}
            >
              Elaine Fernandes atua com uma abordagem que integra saúde,
              estética, estilo de vida e cuidado individual. Sua prioridade é
              compreender cada pessoa além de uma queixa isolada, oferecendo uma
              orientação compatível com sua história e seus objetivos.
            </p>

            <dl
              className="mt-10 grid gap-6 border-t rule pt-8 sm:grid-cols-2"
              data-reveal
              style={{ ["--reveal-delay" as string]: "220ms" }}
            >
              <div>
                <dt className="eyebrow text-grafite/65">Atuação</dt>
                <dd className="mt-2 text-[0.9375rem] leading-relaxed text-grafite/75">
                  Emagrecimento anabólico, dermatologia integrativa e
                  ultrassonografia.
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-grafite/65">Localização</dt>
                <dd className="mt-2 text-[0.9375rem] leading-relaxed text-grafite/75">
                  {siteData.locationDisplay}
                </dd>
              </div>
              {credentials.length > 0 && (
                <div>
                  <dt className="eyebrow text-grafite/65">Registro</dt>
                  <dd className="mt-2 text-[0.9375rem] leading-relaxed text-grafite/75">
                    {credentials.join(" · ")}
                  </dd>
                </div>
              )}
            </dl>

            <p
              className="mt-8 text-[0.8125rem] text-grafite/65 italic"
              data-reveal
            >
              Cristã e mãe de Heitor e Eduardo.
            </p>
          </div>

          <div className="lg:col-span-5 lg:col-start-8" data-reveal>
            <div className="relative aspect-4/5 w-full overflow-hidden bg-areia/35">
              <Image
                src="/images/dra-elaine-sobre.png"
                alt="Retrato da Dra. Elaine Fernandes."
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
