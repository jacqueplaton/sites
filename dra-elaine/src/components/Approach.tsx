import PhotoFrame from "./PhotoFrame";
import { photos } from "@/data/photos";

export default function Approach() {
  return (
    <section id="abordagem" className="bg-tinta py-20 lg:py-32">
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Retrato deslocado do eixo do texto */}
          <div className="lg:col-span-5 lg:pt-16" data-reveal>
            <PhotoFrame
              src={photos.approachPortrait}
              alt="Dra. Elaine Fernandes durante atendimento, em ambiente de consultório."
              caption="Retrato — abordagem"
              ratioLabel="Vertical 4:5"
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="aspect-4/5 w-full"
              imageClassName="object-top"
            />
            <p className="mt-4 max-w-[34ch] text-[0.75rem] leading-relaxed text-blush/75">
              Um cuidado que começa muito antes de qualquer procedimento.
            </p>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <div className="flex items-center gap-4" data-reveal>
              <span aria-hidden="true" className="h-px w-8 bg-latao" />
              <span className="eyebrow text-blush/75">
                Uma abordagem que começa pela escuta
              </span>
            </div>

            <h2
              className="mt-8 max-w-[20ch] font-display text-[2.25rem] leading-[1.02] font-light text-creme text-balance sm:text-[3rem] lg:text-[3.5rem]"
              data-reveal
              style={{ ["--reveal-delay" as string]: "80ms" }}
            >
              Antes de qualquer orientação, existe uma história que precisa ser{" "}
              <span className="italic">ouvida.</span>
            </h2>

            <p
              className="mt-8 max-w-[52ch] text-[1rem] leading-relaxed text-blush/80 text-pretty"
              data-reveal
              style={{ ["--reveal-delay" as string]: "150ms" }}
            >
              Nosso cuidado começa pelas pessoas: suas histórias, emoções,
              sentimentos, objetivos e sonhos. Cada atendimento busca compreender
              o momento vivido por cada paciente para orientar mudanças possíveis
              de mente, corpo, hábitos e saúde.
            </p>

            <figure
              className="mt-12 border-t rule pt-8"
              data-reveal
              style={{ ["--reveal-delay" as string]: "220ms" }}
            >
              <blockquote>
                <p className="font-display text-[1.75rem] leading-[1.15] font-light text-rosa italic sm:text-[2.25rem]">
                  “Mudança de mente, corpo e saúde.”
                </p>
              </blockquote>
              <figcaption className="mt-4 text-[0.75rem] text-blush/75">
                A equipe está pronta para acompanhar cada etapa desse processo.
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
