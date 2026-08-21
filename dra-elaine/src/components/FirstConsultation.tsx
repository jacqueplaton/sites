import { whatsappUrl } from "@/lib/whatsapp";

const steps = [
  {
    index: "01",
    title: "Escuta e compreensão do caso",
    detail:
      "A conversa inicial abre espaço para a sua história, o seu momento e aquilo que motivou a busca por atendimento.",
  },
  {
    index: "02",
    title: "Avaliação individual",
    detail:
      "A avaliação considera o conjunto — não apenas uma queixa isolada — para orientar com responsabilidade.",
  },
  {
    index: "03",
    title: "Orientações e próximos passos",
    detail:
      "Ao final, você recebe orientações compatíveis com a sua rotina e um caminho definido para as próximas etapas.",
  },
];

const CONSULTATION_MESSAGE =
  "Olá, Dra. Elaine! Vim pelo site e gostaria de agendar minha primeira consulta.";

export default function FirstConsultation() {
  return (
    <section
      id="primeira-consulta"
      className="bg-vinho on-dark py-20 text-marfim lg:py-32"
    >
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
            <div className="flex items-center gap-4" data-reveal>
              <span className="eyebrow text-dourado">03</span>
              <span aria-hidden="true" className="h-px w-10 bg-marfim/25" />
              <span className="eyebrow text-marfim/60">Primeira consulta</span>
            </div>

            {/* Número editorial de forte presença visual */}
            <p
              className="mt-10 font-display text-[5.5rem] leading-[0.82] font-light text-marfim sm:text-[7rem] lg:text-[8.5rem]"
              data-reveal
              style={{ ["--reveal-delay" as string]: "80ms" }}
            >
              <span aria-hidden="true" className="text-dourado">
                ≈
              </span>{" "}
              <span className="sr-only">Aproximadamente </span>2
              <span className="mt-2 block font-body text-[0.8125rem] font-semibold tracking-[0.22em] text-marfim/60 uppercase">
                horas de atendimento
              </span>
            </p>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <h2
              className="max-w-[16ch] font-display text-[2.25rem] leading-[1.02] font-light text-balance sm:text-[3rem] lg:text-[3.5rem]"
              data-reveal
            >
              Uma primeira consulta <span className="italic">sem pressa.</span>
            </h2>

            <p
              className="mt-8 max-w-[52ch] text-[1rem] leading-relaxed text-marfim/70 text-pretty"
              data-reveal
              style={{ ["--reveal-delay" as string]: "80ms" }}
            >
              A primeira consulta dura, em média, duas horas. Esse tempo permite
              conhecer sua história, compreender seus objetivos e orientar os
              próximos passos de maneira individualizada.
            </p>

            <ol className="mt-12">
              {steps.map((step, i) => (
                <li
                  key={step.index}
                  className="grid gap-2 border-t border-marfim/12 py-7 sm:grid-cols-[auto_1fr] sm:gap-8"
                  data-reveal
                  style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}
                >
                  <span className="eyebrow pt-1 text-dourado">{step.index}</span>
                  <div>
                    <h3 className="font-display text-[1.5rem] leading-tight font-light">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-[52ch] text-[0.875rem] leading-relaxed text-marfim/60">
                      {step.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <a
              href={whatsappUrl(CONSULTATION_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-block bg-marfim px-7 py-4 text-[0.75rem] font-semibold tracking-[0.08em] text-vinho uppercase transition-colors hover:bg-dourado hover:text-grafite"
              data-reveal
            >
              Quero agendar minha primeira consulta
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
