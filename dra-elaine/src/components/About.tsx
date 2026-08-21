import PhotoFrame from "./PhotoFrame";
import { photos } from "@/data/photos";
import { siteData } from "@/data/site";

export default function About() {
  const credentials = [
    siteData.crm ? `CRM ${siteData.crm}` : null,
    siteData.rqe ? `RQE ${siteData.rqe}` : null,
  ].filter(Boolean) as string[];

  return (
    <section id="sobre" className="bg-tinta py-20 lg:py-32">
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-4" data-reveal>
              <span aria-hidden="true" className="h-px w-8 bg-latao" />
              <span className="eyebrow text-blush/75">
                Sobre a Dra. Elaine
              </span>
            </div>

            <h2
              className="mt-8 max-w-[18ch] font-display text-[2.25rem] leading-[1.02] font-light text-creme text-balance sm:text-[3rem] lg:text-[3.5rem]"
              data-reveal
              style={{ ["--reveal-delay" as string]: "80ms" }}
            >
              Cuidado técnico com uma visão profundamente{" "}
              <span className="italic">humana.</span>
            </h2>

            <p
              className="mt-8 max-w-[52ch] text-[1rem] leading-relaxed text-blush/80 text-pretty"
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
                <dt className="eyebrow text-blush/75">Atuação</dt>
                <dd className="mt-2 text-[0.9375rem] leading-relaxed text-blush/85">
                  Emagrecimento anabólico, dermatologia integrativa e
                  ultrassonografia.
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-blush/75">Localização</dt>
                <dd className="mt-2 text-[0.9375rem] leading-relaxed text-blush/85">
                  {siteData.locationDisplay}
                </dd>
              </div>
              {credentials.length > 0 && (
                <div>
                  <dt className="eyebrow text-blush/75">Registro</dt>
                  <dd className="mt-2 text-[0.9375rem] leading-relaxed text-blush/85">
                    {credentials.join(" · ")}
                  </dd>
                </div>
              )}
            </dl>

            <p
              className="mt-8 text-[0.8125rem] text-blush/75 italic"
              data-reveal
            >
              Cristã e mãe de Heitor e Eduardo.
            </p>
          </div>

          <div className="lg:col-span-5 lg:col-start-8" data-reveal>
            <PhotoFrame
              src={photos.aboutPortrait}
              alt="Retrato da Dra. Elaine Fernandes."
              caption="Retrato — sobre"
              ratioLabel="Vertical 4:5"
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="aspect-4/5 w-full"
              imageClassName="object-top"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
