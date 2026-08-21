import TreatmentCard from "./TreatmentCard";
import { treatments, TREATMENT_DISCLAIMER } from "@/data/treatments";

export default function Treatments() {
  return (
    <section id="tratamentos" className="border-t rule bg-tinta py-20 lg:py-32">
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-4" data-reveal>
              <span aria-hidden="true" className="h-px w-8 bg-latao" />
              <span className="eyebrow text-blush/75">Tratamentos</span>
            </div>
            <h2
              className="mt-8 max-w-[16ch] font-display text-[2.25rem] leading-[1.02] font-light text-creme text-balance sm:text-[3rem] lg:text-[3.5rem]"
              data-reveal
              style={{ ["--reveal-delay" as string]: "80ms" }}
            >
              Tratamentos pensados para necessidades{" "}
              <span className="italic">individuais.</span>
            </h2>
          </div>

          <p
            className="max-w-[46ch] text-[0.9375rem] leading-relaxed text-blush/75 lg:col-span-4 lg:col-start-9"
            data-reveal
            style={{ ["--reveal-delay" as string]: "150ms" }}
          >
            Cada procedimento precisa ser indicado após uma avaliação
            responsável. Conheça alguns dos atendimentos disponíveis.
          </p>
        </div>

        <div className="mt-16 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {treatments.map((treatment) => (
            <TreatmentCard key={treatment.slug} treatment={treatment} />
          ))}
        </div>

        <p
          className="mt-16 max-w-[70ch] border-t rule pt-6 text-[0.8125rem] leading-relaxed text-blush/75"
          data-reveal
        >
          {TREATMENT_DISCLAIMER}
        </p>
      </div>
    </section>
  );
}
