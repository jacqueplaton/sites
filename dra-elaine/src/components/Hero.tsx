import PhotoFrame from "./PhotoFrame";
import { photos } from "@/data/photos";
import { siteData } from "@/data/site";
import { whatsappUrl } from "@/lib/whatsapp";

export default function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-tinta">
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
        <div className="grid items-stretch gap-10 py-14 lg:grid-cols-12 lg:gap-0 lg:py-14">
          {/* Coluna editorial */}
          <div className="flex flex-col justify-center lg:col-span-6 lg:pr-16 xl:pr-24">
            <p
              className="eyebrow text-latao"
              data-reveal
              style={{ ["--reveal-delay" as string]: "0ms" }}
            >
              Saúde <span aria-hidden="true" className="text-latao/50">•</span> Estética{" "}
              <span aria-hidden="true" className="text-latao/50">•</span> Cuidado integrativo
            </p>

            <h1
              className="mt-7 font-display text-[2.75rem] leading-[0.98] font-light text-creme text-balance sm:text-[3.75rem] lg:text-[4.25rem] xl:text-[5rem]"
              data-reveal
              style={{ ["--reveal-delay" as string]: "90ms" }}
            >
              Cuidar da saúde é compreender a sua história{" "}
              <span className="italic">por inteiro.</span>
            </h1>

            <p
              className="mt-8 max-w-[38ch] text-[1rem] leading-relaxed text-blush/80 text-pretty sm:text-[1.0625rem]"
              data-reveal
              style={{ ["--reveal-delay" as string]: "180ms" }}
            >
              Um atendimento individualizado que considera seus objetivos, sua
              rotina e cada etapa da sua jornada de mudança.
            </p>

            <div
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
              data-reveal
              style={{ ["--reveal-delay" as string]: "270ms" }}
            >
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-latao px-7 py-4 text-center text-[0.75rem] font-semibold tracking-[0.08em] text-tinta uppercase transition-colors hover:bg-creme"
              >
                Agendar uma avaliação
              </a>
              <a
                href="#tratamentos"
                className="border rule px-7 py-4 text-center text-[0.75rem] font-semibold tracking-[0.08em] text-creme uppercase transition-colors hover:border-vinho"
              >
                Conhecer os tratamentos
              </a>
            </div>

            <div
              className="mt-12 flex items-start gap-4 border-t rule pt-6"
              data-reveal
              style={{ ["--reveal-delay" as string]: "360ms" }}
            >
              <span aria-hidden="true" className="mt-2 h-px w-8 bg-latao" />
              <p className="text-[0.8125rem] leading-relaxed text-blush/75">
                {siteData.city} — {siteData.state} · Atendimento presencial,
                on-line e domiciliar.
              </p>
            </div>
          </div>

          {/* Retrato dominante */}
          <div className="relative lg:col-span-6">
            <div className="relative lg:-mr-8 xl:-mr-16">
              <span
                aria-hidden="true"
                className="absolute -top-4 -left-4 hidden h-24 w-24 border-t border-l rule lg:block"
              />
              <PhotoFrame
                src={photos.heroPortrait}
                alt="Retrato da Dra. Elaine Fernandes em seu consultório."
                caption="Retrato de abertura"
                ratioLabel="Vertical 4:5"
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="aspect-4/5 w-full lg:aspect-auto lg:h-[min(78vh,50rem)]"
                imageClassName="object-top"
              />
              <span
                aria-hidden="true"
                className="absolute -right-4 -bottom-4 hidden h-24 w-24 border-r border-b rule lg:block"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
