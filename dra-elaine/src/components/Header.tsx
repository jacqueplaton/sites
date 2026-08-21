"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { navigation, siteData } from "@/data/site";
import { whatsappUrl } from "@/lib/whatsapp";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  // Escape fecha o menu e o foco fica preso dentro do painel enquanto aberto.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close]);

  return (
    <>
      <div className="bg-vinho text-creme on-dark">
        <p className="eyebrow mx-auto max-w-[88rem] px-5 py-2.5 text-center text-[0.5625rem] leading-relaxed tracking-[0.1em] text-creme/85 sm:px-8 sm:text-[0.6875rem] sm:tracking-[0.22em]">
          Atendimento presencial, on-line e domiciliar no RJ
        </p>
      </div>

      <header
        className={`sticky top-0 z-50 border-b transition-colors duration-500 ${
          scrolled
            ? "rule bg-tinta/90 backdrop-blur-md"
            : "border-transparent bg-tinta"
        }`}
      >
        <div className="mx-auto flex max-w-[88rem] items-center justify-between gap-6 px-5 py-4 sm:px-8 lg:py-5">
          <a
            href="#inicio"
            className="font-display text-[1.35rem] leading-none tracking-tight text-creme sm:text-[1.5rem]"
          >
            Dra. Elaine <span className="italic font-light">Fernandes</span>
          </a>

          <nav aria-label="Navegação principal" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {navigation.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="link-underline text-[0.8125rem] font-medium text-blush/85 transition-colors hover:text-creme"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden bg-latao px-5 py-3 text-[0.75rem] font-semibold tracking-[0.08em] text-tinta uppercase transition-colors hover:bg-creme sm:inline-block"
            >
              Agendar avaliação
            </a>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => (open ? close() : setOpen(true))}
              aria-expanded={open}
              aria-controls="menu-mobile"
              className="flex h-11 w-11 items-center justify-center border rule text-creme lg:hidden"
            >
              <span className="sr-only">
                {open ? "Fechar menu" : "Abrir menu"}
              </span>
              <span aria-hidden="true" className="relative block h-3 w-5">
                <span
                  className={`absolute left-0 block h-px w-5 bg-current transition-transform duration-300 ${
                    open ? "top-1.5 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 block h-px w-5 bg-current transition-transform duration-300 ${
                    open ? "top-1.5 -rotate-45" : "top-3"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div
          id="menu-mobile"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
          className="fixed inset-0 z-[60] flex flex-col bg-tinta lg:hidden"
        >
          <div className="flex items-center justify-between border-b rule px-5 py-4">
            <span className="font-display text-[1.35rem] leading-none text-creme">
              Dra. Elaine <span className="italic font-light">Fernandes</span>
            </span>
            <button
              type="button"
              onClick={close}
              className="flex h-11 w-11 items-center justify-center border rule text-creme"
            >
              <span className="sr-only">Fechar menu</span>
              <span aria-hidden="true" className="relative block h-5 w-5">
                <span className="absolute top-1/2 left-0 block h-px w-5 rotate-45 bg-current" />
                <span className="absolute top-1/2 left-0 block h-px w-5 -rotate-45 bg-current" />
              </span>
            </button>
          </div>

          <nav
            aria-label="Navegação principal"
            className="flex-1 overflow-y-auto px-5 py-6"
          >
            <ul className="flex flex-col">
              {navigation.map((item, index) => (
                <li key={item.href} className="border-b rule">
                  <a
                    href={item.href}
                    onClick={close}
                    className="flex items-baseline gap-4 py-4"
                  >
                    <span className="eyebrow text-latao">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-[1.75rem] leading-none text-creme">
                      {item.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t rule px-5 py-5">
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className="block bg-latao px-5 py-4 text-center text-[0.75rem] font-semibold tracking-[0.08em] text-tinta uppercase"
            >
              Agendar avaliação
            </a>
            <p className="mt-3 text-center text-[0.75rem] text-blush/75">
              {siteData.whatsappDisplay} · {siteData.locationDisplay}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
