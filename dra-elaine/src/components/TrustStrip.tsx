const items = [
  {
    index: "01",
    title: "Primeira consulta com aproximadamente 2 horas",
    detail: "Tempo suficiente para ouvir, avaliar e orientar sem pressa.",
  },
  {
    index: "02",
    title: "Atendimento individualizado",
    detail: "Cada orientação parte da história e do momento de cada pessoa.",
  },
  {
    index: "03",
    title: "Presencial, on-line e domiciliar no RJ",
    detail: "Modalidades que se adaptam à sua rotina e à sua necessidade.",
  },
];

export default function TrustStrip() {
  return (
    <section aria-label="Diferenciais do atendimento" className="bg-vinho on-dark text-marfim">
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
        <ul className="grid divide-y divide-marfim/12 md:grid-cols-3 md:divide-x md:divide-y-0">
          {items.map((item, i) => (
            <li
              key={item.index}
              className="py-9 md:px-8 md:first:pl-0 md:last:pr-0"
              data-reveal
              style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}
            >
              <span className="eyebrow text-dourado">{item.index}</span>
              <h2 className="mt-4 font-display text-[1.5rem] leading-tight font-light text-marfim">
                {item.title}
              </h2>
              <p className="mt-3 text-[0.8125rem] leading-relaxed text-marfim/60">
                {item.detail}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
