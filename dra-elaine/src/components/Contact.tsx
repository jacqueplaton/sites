"use client";

import { useId, useState, type FormEvent } from "react";
import { siteData } from "@/data/site";
import { treatments } from "@/data/treatments";
import { whatsappUrl } from "@/lib/whatsapp";

const modes = ["Presencial", "On-line", "Domiciliar"];

export default function Contact() {
  const uid = useId();
  const [consent, setConsent] = useState(false);

  /** Monta a mensagem e abre o WhatsApp. Nada é armazenado. */
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const name = String(data.get("nome") ?? "").trim();
    const phone = String(data.get("telefone") ?? "").trim();
    const treatment = String(data.get("tratamento") ?? "").trim();
    const mode = String(data.get("modalidade") ?? "").trim();
    const message = String(data.get("mensagem") ?? "").trim();

    const lines = [
      "Olá, Dra. Elaine! Vim pelo site e gostaria de agendar uma avaliação.",
      "",
      name && `Nome: ${name}`,
      phone && `WhatsApp: ${phone}`,
      treatment && `Interesse: ${treatment}`,
      mode && `Modalidade: ${mode}`,
      message && `Mensagem: ${message}`,
    ].filter(Boolean);

    window.open(
      whatsappUrl(lines.join("\n")),
      "_blank",
      "noopener,noreferrer",
    );
  }

  const fieldClass =
    "mt-2 w-full border rule bg-branco px-4 py-3 text-[0.9375rem] text-grafite outline-none transition-colors placeholder:text-grafite/65 focus:border-vinho";
  const labelClass = "eyebrow text-grafite/65";

  return (
    <section id="contato" className="border-t rule bg-marfim py-20 lg:py-32">
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4" data-reveal>
              <span className="eyebrow text-dourado-escuro">07</span>
              <span aria-hidden="true" className="h-px w-10 bg-areia" />
              <span className="eyebrow text-grafite/65">Contato</span>
            </div>

            <h2
              className="mt-8 max-w-[18ch] font-display text-[2.25rem] leading-[1.02] font-light text-vinho text-balance sm:text-[3rem]"
              data-reveal
              style={{ ["--reveal-delay" as string]: "80ms" }}
            >
              Vamos conversar sobre o cuidado mais adequado{" "}
              <span className="italic">para você?</span>
            </h2>

            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-block bg-vinho px-7 py-4 text-[0.75rem] font-semibold tracking-[0.08em] text-marfim uppercase transition-colors hover:bg-bordo"
              data-reveal
            >
              Falar pelo WhatsApp
            </a>

            <dl className="mt-12 border-t rule" data-reveal>
              <div className="flex items-baseline justify-between gap-4 border-b rule py-5">
                <dt className={labelClass}>WhatsApp</dt>
                <dd>
                  <a
                    href={whatsappUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-[0.9375rem] text-grafite"
                  >
                    {siteData.whatsappDisplay}
                  </a>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-b rule py-5">
                <dt className={labelClass}>Instagram</dt>
                <dd>
                  <a
                    href={siteData.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-[0.9375rem] text-grafite"
                  >
                    {siteData.instagramHandle}
                  </a>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-b rule py-5">
                <dt className={labelClass}>Localização</dt>
                <dd className="text-[0.9375rem] text-grafite">
                  {siteData.locationDisplay}
                </dd>
              </div>
            </dl>
          </div>

          {/* Formulário: apenas monta a mensagem e abre o WhatsApp. */}
          <div className="lg:col-span-6 lg:col-start-7" data-reveal>
            <form onSubmit={handleSubmit} noValidate={false}>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor={`${uid}-nome`} className={labelClass}>
                    Nome
                  </label>
                  <input
                    id={`${uid}-nome`}
                    name="nome"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Como podemos te chamar"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor={`${uid}-telefone`} className={labelClass}>
                    WhatsApp
                  </label>
                  <input
                    id={`${uid}-telefone`}
                    name="telefone"
                    type="tel"
                    required
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="(21) 90000-0000"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor={`${uid}-tratamento`} className={labelClass}>
                    Tratamento de interesse
                  </label>
                  <select
                    id={`${uid}-tratamento`}
                    name="tratamento"
                    defaultValue="Ainda não sei"
                    className={fieldClass}
                  >
                    <option>Ainda não sei</option>
                    {treatments.map((treatment) => (
                      <option key={treatment.slug}>{treatment.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor={`${uid}-modalidade`} className={labelClass}>
                    Modalidade desejada
                  </label>
                  <select
                    id={`${uid}-modalidade`}
                    name="modalidade"
                    defaultValue="Presencial"
                    className={fieldClass}
                  >
                    {modes.map((mode) => (
                      <option key={mode}>{mode}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor={`${uid}-mensagem`} className={labelClass}>
                  Mensagem
                </label>
                <textarea
                  id={`${uid}-mensagem`}
                  name="mensagem"
                  rows={4}
                  placeholder="Conte um pouco sobre o que você procura."
                  className={`${fieldClass} resize-y`}
                />
              </div>

              <div className="mt-7 flex items-start gap-3">
                <input
                  id={`${uid}-consentimento`}
                  name="consentimento"
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                  aria-describedby={`${uid}-consentimento-desc`}
                  className="mt-1 h-4 w-4 shrink-0 accent-[#542633]"
                />
                <label
                  htmlFor={`${uid}-consentimento`}
                  id={`${uid}-consentimento-desc`}
                  className="text-[0.8125rem] leading-relaxed text-grafite/65"
                >
                  Autorizo o contato por WhatsApp para tratar do meu
                  agendamento. Os dados preenchidos são usados apenas para
                  montar essa mensagem e não são armazenados por este site.
                </label>
              </div>

              <button
                type="submit"
                className="mt-8 w-full bg-vinho px-7 py-4 text-[0.75rem] font-semibold tracking-[0.08em] text-marfim uppercase transition-colors hover:bg-bordo disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
                disabled={!consent}
              >
                Enviar pelo WhatsApp
              </button>

              <p className="mt-4 text-[0.75rem] leading-relaxed text-grafite/65">
                Ao enviar, o WhatsApp abre em uma nova aba com a mensagem já
                preenchida. Você revisa antes de enviar.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
