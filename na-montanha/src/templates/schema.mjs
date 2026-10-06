// Dados estruturados (JSON-LD). Só entra o que está verificado em
// src/data/site.mjs. Fora de propósito:
//   • aggregateRating/review — o Google trata nota da própria empresa
//     marcada no próprio site como autoavaliação e não a aceita;
//   • preço, capacidade, comodidades, horários e coordenadas — ainda não
//     confirmados pela Na Montanha.
import { site, cabins, faq, availabilityMessage } from '../data/site.mjs';
import { abs, imageUrl, waUrl, ctx } from './helpers.mjs';

export const ids = {
  website: () => abs('/#website'),
  lodging: () => abs('/#lodging'),
  cabin: (c) => abs(`/cabanas/${c.slug}/#accommodation`),
};

const sameAs = () =>
  [site.links.instagram, site.links.google, site.links.airbnb, site.links.booking, site.links.expedia].filter(Boolean);

function postalAddress() {
  const a = site.address;
  return {
    '@type': 'PostalAddress',
    streetAddress: `${a.street} - ${a.district}, ${a.locality} (${a.reference.toLowerCase()})`,
    addressLocality: a.city,
    addressRegion: a.state,
    postalCode: a.postalCode,
    addressCountry: a.country,
  };
}

export function lodgingNode() {
  const node = {
    '@type': 'LodgingBusiness',
    '@id': ids.lodging(),
    name: site.name,
    alternateName: site.shortName,
    slogan: site.slogan,
    description: site.description,
    url: abs('/'),
    telephone: site.phone.schema,
    address: postalAddress(),
    image: [imageUrl('sonhosEntardecer'), imageUrl('cabanaDia'), imageUrl('cabanaNoite'), imageUrl('salaLareira'), imageUrl('quartoBanheira')],
    hasMap: site.links.googleMaps,
    // Localização em camadas: cidade → estado → país. A proximidade com
    // Gramado vai em texto (description e páginas), nunca como endereço.
    containedInPlace: {
      '@type': 'City',
      name: site.address.city,
      containedInPlace: { '@type': 'State', name: site.address.stateName, containedInPlace: { '@type': 'Country', name: 'Brasil' } },
    },
    containsPlace: cabins.map((c) => ({ '@id': ids.cabin(c) })),
    sameAs: sameAs(),
    knowsLanguage: 'pt-BR',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'reservations',
      telephone: site.phone.schema,
      url: waUrl(availabilityMessage),
      availableLanguage: ['Portuguese'],
    },
    potentialAction: {
      '@type': 'ReserveAction',
      name: 'Consultar disponibilidade pelo WhatsApp',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: waUrl(availabilityMessage),
        actionPlatform: ['https://schema.org/DesktopWebPlatform', 'https://schema.org/MobileWebPlatform'],
      },
      result: { '@type': 'LodgingReservation', name: 'Reserva direta com a Na Montanha Eco Space' },
    },
  };
  if (site.geo) {
    node.geo = { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng };
  }
  return node;
}

export function cabinNode(c) {
  return {
    '@type': 'Accommodation',
    '@id': ids.cabin(c),
    name: c.name,
    description: c.pageIntro,
    url: abs(`/cabanas/${c.slug}/`),
    image: [c.exterior, ...c.interiors].filter((v, i, a) => a.indexOf(v) === i).map(imageUrl),
    containedInPlace: { '@id': ids.lodging() },
    address: postalAddress(),
    potentialAction: {
      '@type': 'ReserveAction',
      name: `Consultar disponibilidade da ${c.name} pelo WhatsApp`,
      target: { '@type': 'EntryPoint', urlTemplate: waUrl(c.message) },
    },
    ...(Object.values(c.listings).some(Boolean) ? { sameAs: Object.values(c.listings).filter(Boolean) } : {}),
  };
}

export function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': ids.website(),
    url: abs('/'),
    name: site.name,
    inLanguage: site.lang,
    publisher: { '@id': ids.lodging() },
  };
}

export function webPageNode({ path, title, description, about, image, breadcrumb }) {
  return {
    '@type': 'WebPage',
    '@id': abs(path) + '#webpage',
    url: abs(path),
    name: title,
    description,
    inLanguage: site.lang,
    isPartOf: { '@id': ids.website() },
    about: { '@id': about || ids.lodging() },
    ...(image ? { primaryImageOfPage: { '@type': 'ImageObject', url: image } } : {}),
    ...(breadcrumb ? { breadcrumb: { '@id': abs(path) + '#breadcrumb' } } : {}),
    dateModified: ctx.buildDate,
  };
}

export function breadcrumbNode(path, trail) {
  return {
    '@type': 'BreadcrumbList',
    '@id': abs(path) + '#breadcrumb',
    itemListElement: trail.map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(p) })),
  };
}

export function faqNode(path) {
  return {
    '@type': 'FAQPage',
    '@id': abs(path) + '#faq',
    mainEntity: faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };
}

export const graph = (nodes) =>
  `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(/</g, '\\u003c')}</script>`;
