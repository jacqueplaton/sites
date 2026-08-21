import type { Metadata } from "next";
import Link from "next/link";
import { siteData } from "@/data/site";
import { whatsappUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como as informações enviadas pelo site da Dra. Elaine Fernandes são utilizadas.",
  alternates: { canonical: "/politica-de-privacidade" },
  robots: { index: true, follow: true },
};

const sections = [
  {
    title: "Informações que este site trata",
    body: [
      "Este site é uma página de apresentação. Ele não possui cadastro, área restrita, carrinho ou processamento de pagamento.",
      "O formulário da seção de contato funciona apenas como um montador de mensagem: os campos preenchidos são usados para compor um texto que é aberto no WhatsApp, no seu próprio aparelho. Nenhuma informação é enviada para um servidor deste site nem armazenada em banco de dados.",
    ],
  },
  {
    title: "Comunicação por WhatsApp",
    body: [
      "Ao enviar a mensagem, a conversa passa a acontecer no WhatsApp e fica sujeita aos termos e à política de privacidade do próprio aplicativo.",
      "As informações que você compartilhar nessa conversa são utilizadas exclusivamente para responder à sua solicitação e organizar o agendamento.",
    ],
  },
  {
    title: "Dados de saúde",
    body: [
      "Evite enviar informações sensíveis de saúde por mensagem antes da consulta. Esses assuntos são tratados no atendimento, em ambiente adequado.",
    ],
  },
  {
    title: "Cookies e medição",
    body: [
      "Este site não utiliza cookies de publicidade nem ferramentas de rastreamento para formação de perfil.",
    ],
  },
  {
    title: "Seus direitos",
    body: [
      "Nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você pode solicitar confirmação de tratamento, acesso, correção ou eliminação das informações compartilhadas, além de revogar o consentimento a qualquer momento.",
      "Para exercer esses direitos, entre em contato pelo WhatsApp informado abaixo.",
    ],
  },
  {
    title: "Links externos",
    body: [
      "O site contém links para WhatsApp e Instagram. Ao acessá-los, você passa a navegar em plataformas de terceiros, com políticas próprias.",
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <main id="conteudo" className="flex-1 bg-marfim">
      <div className="mx-auto max-w-[52rem] px-5 py-16 sm:px-8 lg:py-24">
        <Link
          href="/"
          className="link-underline eyebrow text-grafite/65"
        >
          ← Voltar ao início
        </Link>

        <h1 className="mt-10 font-display text-[2.5rem] leading-[1.02] font-light text-vinho sm:text-[3.25rem]">
          Política de <span className="italic">Privacidade</span>
        </h1>

        <p className="mt-6 max-w-[60ch] text-[1rem] leading-relaxed text-grafite/70">
          Esta página explica como as informações enviadas por meio do site da{" "}
          {siteData.displayName} são utilizadas.
        </p>

        <div className="mt-14">
          {sections.map((section, index) => (
            <section key={section.title} className="border-t rule py-9">
              <div className="flex items-baseline gap-4">
                <span className="eyebrow text-dourado-escuro">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="font-display text-[1.625rem] leading-tight font-light text-vinho">
                  {section.title}
                </h2>
              </div>
              <div className="mt-4 space-y-4 sm:pl-11">
                {section.body.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="max-w-[62ch] text-[0.9375rem] leading-relaxed text-grafite/70 text-pretty"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}

          <section className="border-t border-b rule py-9">
            <div className="flex items-baseline gap-4">
              <span className="eyebrow text-dourado-escuro">
                {String(sections.length + 1).padStart(2, "0")}
              </span>
              <h2 className="font-display text-[1.625rem] leading-tight font-light text-vinho">
                Contato
              </h2>
            </div>
            <div className="mt-4 sm:pl-11">
              <p className="text-[0.9375rem] leading-relaxed text-grafite/70">
                Dúvidas sobre esta política podem ser enviadas pelo WhatsApp{" "}
                <a
                  href={whatsappUrl(
                    "Olá, Dra. Elaine! Vim pelo site e tenho uma dúvida sobre a política de privacidade.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-vinho"
                >
                  {siteData.whatsappDisplay}
                </a>
                .
              </p>
              {siteData.email && (
                <p className="mt-2 text-[0.9375rem] text-grafite/70">
                  E-mail:{" "}
                  <a
                    href={`mailto:${siteData.email}`}
                    className="link-underline text-vinho"
                  >
                    {siteData.email}
                  </a>
                </p>
              )}
            </div>
          </section>
        </div>

        <p className="mt-10 text-[0.75rem] leading-relaxed text-grafite/65">
          O conteúdo deste site tem caráter informativo e não substitui a
          avaliação de um profissional de saúde.
        </p>
      </div>
    </main>
  );
}
