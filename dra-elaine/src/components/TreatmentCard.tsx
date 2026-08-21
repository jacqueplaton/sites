import PhotoFrame from "./PhotoFrame";
import type { Treatment } from "@/data/treatments";
import { TREATMENT_NOTE } from "@/data/treatments";
import { treatmentWhatsappUrl } from "@/lib/whatsapp";

type Props = {
  treatment: Treatment;
};

export default function TreatmentCard({ treatment }: Props) {
  return (
    <article className="group flex flex-col border-t rule pt-6" data-reveal>
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="h-px w-6 bg-latao" />
        <span className="eyebrow text-blush/75">Tratamento</span>
      </div>

      <PhotoFrame
        src={treatment.image}
        alt={treatment.alt}
        caption={treatment.name}
        ratioLabel="Horizontal 4:3"
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="mt-6 aspect-4/3 w-full"
        imageClassName="transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
      />

      <h3 className="mt-7 font-display text-[1.75rem] leading-tight font-light text-creme">
        {treatment.name}
      </h3>

      <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-[1.25rem] font-semibold tracking-tight text-creme">
          {treatment.price}
          {treatment.priceNote ? (
            <span className="ml-1 text-[0.8125rem] font-normal text-blush/75">
              {treatment.priceNote}
            </span>
          ) : null}
        </span>
        <span className="text-[0.875rem] text-blush/75">
          <span className="sr-only">Valor anterior: </span>
          <s>{treatment.previousPrice}</s>
        </span>
      </p>

      <p className="mt-3 text-[0.8125rem] leading-relaxed text-blush/75">
        {TREATMENT_NOTE}
      </p>

      <a
        href={treatmentWhatsappUrl(treatment.name)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2 self-start text-[0.75rem] font-semibold tracking-[0.08em] text-creme uppercase"
      >
        <span className="link-underline">Quero saber mais</span>
        <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
          →
        </span>
        <span className="sr-only">sobre {treatment.name}, pelo WhatsApp</span>
      </a>
    </article>
  );
}
