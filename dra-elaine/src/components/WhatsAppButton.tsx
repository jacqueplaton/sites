"use client";

import { useEffect, useState } from "react";
import { whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./Icons";

/**
 * Aparece apenas após parte da rolagem. No desktop é um botão discreto;
 * no celular, uma barra inferior fina que não cobre o conteúdo (o rodapé
 * reserva o espaço correspondente).
 */
export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Desktop */}
      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-hidden={!visible}
        tabIndex={visible ? 0 : -1}
        className={`fixed right-6 bottom-6 z-40 hidden items-center gap-3 bg-latao px-5 py-4 text-creme shadow-[0_2px_18px_rgba(84,38,51,0.22)] transition-all duration-500 hover:bg-creme lg:flex ${
          visible
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <WhatsAppIcon className="h-5 w-5" />
        <span className="text-[0.75rem] font-semibold tracking-[0.08em] uppercase">
          Agendar
        </span>
      </a>

      {/* Celular */}
      <div
        aria-hidden={!visible}
        className={`fixed inset-x-0 bottom-0 z-40 border-t rule bg-vinho transition-transform duration-500 lg:hidden ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={visible ? 0 : -1}
          className="flex items-center justify-center gap-3 px-5 py-4 text-creme"
        >
          <WhatsAppIcon className="h-5 w-5" />
          <span className="text-[0.75rem] font-semibold tracking-[0.08em] uppercase">
            Agendar avaliação
          </span>
        </a>
      </div>
    </>
  );
}
