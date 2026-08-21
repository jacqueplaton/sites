import { faq } from "@/data/faq";

export default function FAQ() {
  return (
    <section
      id="perguntas-frequentes"
      aria-labelledby="faq-titulo"
      className="bg-tinta py-20 lg:py-32"
    >
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-4" data-reveal>
              <span aria-hidden="true" className="h-px w-8 bg-latao" />
              <span className="eyebrow text-blush/75">Dúvidas</span>
            </div>
            <h2
              id="faq-titulo"
              className="mt-8 max-w-[14ch] font-display text-[2.25rem] leading-[1.02] font-light text-creme text-balance sm:text-[3rem]"
              data-reveal
              style={{ ["--reveal-delay" as string]: "80ms" }}
            >
              Perguntas <span className="italic">frequentes.</span>
            </h2>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <dl>
              {faq.map((item, i) => (
                <div key={item.question} className="border-t rule">
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 marker:hidden [&::-webkit-details-marker]:hidden">
                      <dt className="font-display text-[1.375rem] leading-snug font-light text-creme sm:text-[1.5rem]">
                        {item.question}
                      </dt>
                      <span
                        aria-hidden="true"
                        className="relative mt-2 h-3 w-3 shrink-0 text-latao"
                      >
                        <span className="absolute top-1/2 left-0 block h-px w-3 bg-current" />
                        <span className="absolute top-1/2 left-0 block h-px w-3 rotate-90 bg-current transition-transform duration-500 group-open:rotate-0" />
                      </span>
                    </summary>
                    <dd className="max-w-[56ch] pb-7 text-[0.9375rem] leading-relaxed text-blush/80 text-pretty">
                      {item.answer}
                    </dd>
                  </details>
                  {i === faq.length - 1 && (
                    <span aria-hidden="true" className="block border-b rule" />
                  )}
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
