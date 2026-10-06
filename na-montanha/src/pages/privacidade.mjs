import { site } from '../data/site.mjs';
import { pageHeader } from '../templates/components.mjs';
import { graph, websiteNode, webPageNode, breadcrumbNode, lodgingNode } from '../templates/schema.mjs';
import { ctx, waLink } from '../templates/helpers.mjs';
import { generalMessage } from '../data/site.mjs';

// Texto-base. CONFIRMAR com a Na Montanha (e, se possível, com quem cuida
// da parte jurídica): razão social/CNPJ e e-mail de contato para privacidade.
export default function privacidade() {
  const path = '/politica-de-privacidade/';
  const title = 'Política de Privacidade | Na Montanha Eco Space';
  const description = 'Como o site da Na Montanha Eco Space trata dados de visitantes, conforme a LGPD.';
  const trail = [['Início', '/'], ['Política de Privacidade', path]];
  return {
    path,
    title,
    description,
    robots: 'noindex, follow',
    schema: graph([websiteNode(), lodgingNode(), webPageNode({ path, title, description, breadcrumb: true }), breadcrumbNode(path, trail)]),
    main: [
      pageHeader({ label: 'Transparência', title: 'Política de <em>Privacidade.</em>', trail }),
      `<section class="legal wrap prose" aria-label="Texto da política">
  <p><strong>Última atualização:</strong> ${ctx.buildDate.split('-').reverse().join('/')}.</p>
  <h2>Quem somos</h2>
  <p>Este é o site oficial da ${site.name}, hospedagem em cabanas em ${site.address.city} - ${site.address.state}. Para qualquer assunto sobre seus dados, fale com a gente pelo ${waLink({ message: generalMessage, label: `WhatsApp ${site.phone.display}` })}.</p>
  <h2>Quais dados o site coleta</h2>
  <p>O site não tem formulário de cadastro nem área de login. Os botões de reserva abrem o WhatsApp com uma mensagem pronta; a conversa acontece no aplicativo, e as datas que você informar no site só vão na mensagem se você enviá-la.</p>
  <p>Se a medição de audiência estiver ativa (Google Analytics, Google Tag Manager ou Meta Pixel), ela só começa depois que você aceitar no aviso de cookies. Essas ferramentas registram dados de navegação, como páginas vistas, cliques e tipo de dispositivo, de forma agregada.</p>
  <h2>Serviços de terceiros</h2>
  <p>O mapa da página é do Google Maps, e os links levam a WhatsApp, Instagram, Google, Airbnb, Booking e Expedia. Ao usá-los, valem também as políticas de privacidade de cada serviço.</p>
  <h2>Seus direitos</h2>
  <p>Pela Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você pode pedir acesso, correção ou exclusão dos seus dados e revogar o consentimento a qualquer momento. Basta chamar pelo WhatsApp.</p>
  <h2>Alterações</h2>
  <p>Esta política pode ser atualizada. A data no início desta página indica a versão em vigor.</p>
</section>`,
    ].join('\n'),
    sitemap: false,
  };
}
