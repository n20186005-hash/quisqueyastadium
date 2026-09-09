/**
 * 单景点 SEO 实体绑定配置
 * 该文件是整站 NAP（Name / Address / Phone）、地理坐标与外部权威链接的唯一事实来源。
 * 所有页面组件、metadata 与 JSON-LD 结构化数据均从此处读取。
 */
export const DOMAIN_NAME = 'quisqueyastadium.com';
export const SITE_URL = `https://${DOMAIN_NAME}`;

export const ATTRACTION = {
  // {{ATTRACTION_FULL_NAME}}：景点官方全称
  fullName: 'Estadio Quisqueya Juan Marichal',
  // {{ATTRACTION_SHORT_NAME}}：景点常用俗称 / 域名含义
  shortName: 'Quisqueya Stadium',
  // {{CITY_NAME}}
  city: 'Santo Domingo',
  // {{STATE_PROVINCE}}
  stateProvince: 'Distrito Nacional',
  // {{COUNTRY_NAME}}
  country: 'Dominican Republic',
  // {{COUNTRY_CODE_2LETTER}}
  countryCode: 'DO',
  // {{POSTAL_CODE}}
  postalCode: '10514',
  // {{LATITUDE}} / {{LONGITUDE}}
  latitude: 18.4881595,
  longitude: -69.9264279,
  // {{MAPS_SHARE_URL}}
  mapsShareUrl: 'https://maps.app.goo.gl/9ysiHzGa9xRznaBj7',
  // {{MAPS_EMBED_SRC}}
  mapsEmbedSrc:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6725.292146009143!2d-69.9264279!3d18.488159500000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf89bf1d7e1c5b%3A0x91ea7c2364cbf64d!2sEstadio%20Quisqueya%20Juan%20Marichal!5e1!3m2!1szh-CN!2s!4v1788943354687!5m2!1szh-CN!2s',
  // {{NEARBY_LANDMARK_1}} / {{NEARBY_LANDMARK_2}}
  nearbyLandmarks: {
    primary: 'Zona Colonial (Colonial City)',
    secondary: 'Parque Mirador del Sur',
  },
  // {{GOVT_TOURISM_URL}}：多米尼加共和国官方旅游局
  govtTourismUrl: 'https://www.godominicanrepublic.com/',
  govtTourismLabel: 'Dominican Republic Official Tourism Portal',
  // NAP 一致性的权威资料
  streetAddress: 'Av. Tiradentes 3456',
  fullAddress:
    'Avenue, corner of, Tiradentes 3456, Santo Domingo 10514, Dominican Republic',
  plusCode: 'F3QF+7C Santo Domingo, Dominican Republic',
  phoneE164: '+18096161224',
  phoneDisplay: '+1 809-616-1224',
  // Google 商户评分（最新）
  rating: '4.5',
  reviewCount: '10,033',
  // 场馆容量
  capacity: '14,465',
  // 主场球队
  homeTeams: 'Tigres del Licey / Leones del Escogido',
  // 主图与图片版权提示
  heroImagePath: '/gallery/estadio-quisqueya-juan-marichal-1.jpg',
  heroImageUrl: `${SITE_URL}/gallery/estadio-quisqueya-juan-marichal-1.jpg`,
  galleryImageUrl: (n: number) =>
    `${SITE_URL}/gallery/estadio-quisqueya-juan-marichal-${n}.jpg`,
} as const;

/** 面包屑层级：Estadio Quisqueya Juan Marichal → Santo Domingo → Distrito Nacional → Dominican Republic */
export const GEO_HIERARCHY = [
  ATTRACTION.fullName,
  ATTRACTION.city,
  ATTRACTION.stateProvince,
  ATTRACTION.country,
] as const;

/** 单一可信实体的 @id 锚点 */
export function attractionId(locale: string) {
  return `${SITE_URL}/${locale}#attraction`;
}

/** 当前语言页面自身的规范网址（localePrefix: always） */
export function canonicalUrl(locale: string) {
  return locale === 'zh' ? `${SITE_URL}/zh` : `${SITE_URL}/${locale}`;
}

/** 场馆结构化数据：StadiumOrArena 比单一 TouristAttraction 更贴近“球场”，
 * 同时保留 TouristAttraction 面向旅游导览；电话、容量等字段取自唯一的 NAP 数据源。 */
export function touristAttractionJsonLd(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': ['TouristAttraction', 'SportsActivityLocation'],
    '@id': attractionId(locale),
    name: ATTRACTION.fullName,
    alternateName: [ATTRACTION.shortName, `${ATTRACTION.city} ${ATTRACTION.fullName}`],
    description: `Comprehensive visitor guide to ${ATTRACTION.fullName} in ${ATTRACTION.city}, ${ATTRACTION.stateProvince}, ${ATTRACTION.country}.`,
    url: canonicalUrl(locale),
    image: [
      ATTRACTION.heroImageUrl,
      ATTRACTION.galleryImageUrl(2),
      ATTRACTION.galleryImageUrl(3),
    ],
    telephone: ATTRACTION.phoneE164,
    // 与页面可见文案/FAQ 中的容量保持一致（单一事实来源）
    maximumAttendeeCapacity: Number(ATTRACTION.capacity.replace(/\D/g, '')),
    address: {
      '@type': 'PostalAddress',
      streetAddress: ATTRACTION.streetAddress,
      addressLocality: ATTRACTION.city,
      addressRegion: ATTRACTION.stateProvince,
      postalCode: ATTRACTION.postalCode,
      addressCountry: ATTRACTION.countryCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: ATTRACTION.latitude,
      longitude: ATTRACTION.longitude,
    },
    hasMap: ATTRACTION.mapsShareUrl,
    sameAs: [
      ATTRACTION.mapsShareUrl,
      ATTRACTION.govtTourismUrl,
      'https://www.lidom.com/',
    ],
  };
}

/** FAQPage JSON-LD 构建（保证与页面可见 FAQ 一一对应） */
export function faqPageJsonLd(items: Array<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}
