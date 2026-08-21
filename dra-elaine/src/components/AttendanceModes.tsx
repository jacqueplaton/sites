import { attendanceModes } from "@/data/site";

export default function AttendanceModes() {
  return (
    <section
      aria-labelledby="modalidades-titulo"
      className="border-t rule bg-branco py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
        <div className="flex items-center gap-4" data-reveal>
          <span className="eyebrow text-dourado-escuro">05</span>
          <span aria-hidden="true" className="h-px w-10 bg-areia" />
          <span className="eyebrow text-grafite/65">
            Modalidades de atendimento
          </span>
        </div>

        <h2
          id="modalidades-titulo"
          className="mt-8 max-w-[22ch] font-display text-[2rem] leading-[1.05] font-light text-vinho text-balance sm:text-[2.75rem]"
          data-reveal
          style={{ ["--reveal-delay" as string]: "80ms" }}
        >
          Três formas de receber o mesmo{" "}
          <span className="italic">cuidado.</span>
        </h2>

        <ul className="mt-14 grid gap-x-10 gap-y-10 md:grid-cols-3">
          {attendanceModes.map((mode, i) => (
            <li
              key={mode.index}
              className="border-t rule pt-6"
              data-reveal
              style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}
            >
              <span className="eyebrow text-dourado-escuro">{mode.index}</span>
              <h3 className="mt-4 font-display text-[1.75rem] leading-tight font-light text-vinho">
                {mode.title}
              </h3>
              <p className="mt-3 max-w-[40ch] text-[0.875rem] leading-relaxed text-grafite/65">
                {mode.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
