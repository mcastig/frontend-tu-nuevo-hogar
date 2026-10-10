// Demo content: names, prices, phone numbers and addresses are fictional.

export type ProjectId = 'bugambilia' | 'jacaranda' | 'cempasuchil' | 'tulipan'
type ProjectStatus = 'available' | 'last-units'
export type FacadeVariant = 'two-story' | 'balcony' | 'one-story' | 'residence'

export type Project = {
  id: ProjectId
  name: string
  summary: string
  status: ProjectStatus
  statusLabel: string
  price: number
  bedrooms: string
  bathrooms: string
  builtArea: number
  lotArea: number
  parking: string
  delivery: string
  amenities: string[]
  facade: FacadeVariant
  colors: { wall: string; band: string; door: string }
}

export const projects: Project[] = [
  {
    id: 'tulipan',
    name: 'Tulipán',
    summary:
      'Nuestra casa más amplia y mejor equipada, con roof garden y acabados de piedra y madera.',
    status: 'available',
    statusLabel: 'Preventa',
    price: 2_650_000,
    bedrooms: '4 recámaras',
    bathrooms: '3½ baños',
    builtArea: 162,
    lotArea: 180,
    parking: '2 autos, techado',
    delivery: 'Junio de 2027',
    amenities: [
      'Casa club con alberca',
      'Gimnasio',
      'Roof garden privado',
      'Acceso con tarjeta y vigilancia las 24 horas',
    ],
    facade: 'residence',
    colors: { wall: '#E4502B', band: '#B93A1B', door: '#1B2559' },
  },
  {
    id: 'bugambilia',
    name: 'Bugambilia',
    summary: 'Casas de dos niveles frente al parque central del condominio.',
    status: 'available',
    statusLabel: 'Disponible',
    price: 1_480_000,
    bedrooms: '3 recámaras',
    bathrooms: '2½ baños',
    builtArea: 98,
    lotArea: 105,
    parking: '2 autos',
    delivery: 'Inmediata',
    amenities: [
      'Parque central con juegos',
      'Caseta con vigilancia las 24 horas',
      'Ciclopista interior',
      'Salón de usos múltiples',
    ],
    facade: 'two-story',
    colors: { wall: '#D42A72', band: '#A81D58', door: '#F5B82E' },
  },
  {
    id: 'jacaranda',
    name: 'Jacaranda',
    summary: 'Casas con balcón en una privada de 64 viviendas.',
    status: 'last-units',
    statusLabel: 'Últimas 12 casas',
    price: 1_190_000,
    bedrooms: '2 recámaras',
    bathrooms: '1½ baños',
    builtArea: 72,
    lotArea: 90,
    parking: '1 auto',
    delivery: 'Marzo de 2027',
    amenities: [
      'Área de asadores',
      'Cancha de usos múltiples',
      'Acceso controlado',
      'Huerto comunitario',
    ],
    facade: 'balcony',
    colors: { wall: '#7B5EA7', band: '#5E4585', door: '#F8F6F1' },
  },
  {
    id: 'cempasuchil',
    name: 'Cempasúchil',
    summary: 'Casas de una planta con terraza en la azotea. La opción de menor precio.',
    status: 'available',
    statusLabel: 'Disponible',
    price: 980_000,
    bedrooms: '2 recámaras',
    bathrooms: '1 baño',
    builtArea: 58,
    lotArea: 90,
    parking: '1 auto',
    delivery: 'Inmediata',
    amenities: ['Jardín vecinal', 'Acceso controlado', 'Terraza en azotea'],
    facade: 'one-story',
    colors: { wall: '#F5B82E', band: '#D99A12', door: '#1B2559' },
  },
]

type Promotion = {
  id: string
  appliesTo: string
  title: string
  detail: string
  validity: string
}

export const promotions: Promotion[] = [
  {
    id: 'roof-garden',
    appliesTo: 'Tulipán',
    title: 'Roof garden equipado',
    detail:
      'Las primeras 10 casas de la preventa se entregan con pérgola, asador y jardineras ya instalados en la azotea.',
    validity: 'Vigente hasta el 15 de diciembre de 2026 o hasta agotar las 10 casas',
  },
  {
    id: 'deed-costs',
    appliesTo: 'Bugambilia',
    title: 'Escrituración sin costo',
    detail:
      'Cubrimos los gastos notariales de tu casa si firmas tu contrato de compraventa este otoño.',
    validity: 'Vigente hasta el 30 de noviembre de 2026',
  },
  {
    id: 'kitchen',
    appliesTo: 'Jacaranda',
    title: 'Cocina integral incluida',
    detail:
      'Las últimas 12 casas se entregan con cocina integral, tarja y parrilla de cuatro quemadores ya instaladas.',
    validity: 'Hasta agotar existencias',
  },
  {
    id: 'deposit',
    appliesTo: 'Bugambilia y Jacaranda',
    title: 'Aparta con $5,000',
    detail:
      'Congelamos el precio de lista durante 30 días mientras se autoriza tu crédito. Si no se autoriza, te lo devolvemos.',
    validity: 'Vigente hasta el 31 de octubre de 2026',
  },
]

export type CreditId = 'infonavit' | 'fovissste' | 'bank' | 'cofinavit'

type CreditType = {
  id: CreditId
  name: string
  forWhom: string
  detail: string
  /** Reference annual rate for the simulator. Not an offer. */
  referenceRate: number
}

export const creditTypes: CreditType[] = [
  {
    id: 'infonavit',
    name: 'Infonavit',
    forWhom: 'Si cotizas en el IMSS',
    detail:
      'Puedes sumar tu crédito al de tu pareja, un familiar o un amigo para alcanzar una casa más grande.',
    referenceRate: 8.5,
  },
  {
    id: 'fovissste',
    name: 'Fovissste',
    forWhom: 'Si trabajas para el gobierno y cotizas en el ISSSTE',
    detail: 'Revisamos tu puntaje y armamos el expediente contigo, sin costo.',
    referenceRate: 6,
  },
  {
    id: 'bank',
    name: 'Bancario',
    forWhom: 'Si trabajas por tu cuenta o buscas un monto mayor',
    detail: 'Comparamos la oferta de varios bancos y te decimos cuál te conviene.',
    referenceRate: 11,
  },
  {
    id: 'cofinavit',
    name: 'Cofinavit',
    forWhom: 'Si tu crédito Infonavit no alcanza por sí solo',
    detail: 'Infonavit pone una parte y un banco la otra, en un solo trámite.',
    referenceRate: 10.5,
  },
]

export const loanTerms = [10, 15, 20, 30]

export type HairStyle = 'long' | 'bob' | 'bun' | 'short' | 'curly' | 'buzz'

export type Avatar = {
  skin: string
  hair: string
  hairStyle: HairStyle
  shirt: string
  glasses?: boolean
  beard?: boolean
  earrings?: boolean
}

type TeamMember = {
  name: string
  avatar: Avatar
  role: string
  askAbout: string
  color: 'pink' | 'purple' | 'yellow' | 'indigo'
}

export const team: TeamMember[] = [
  {
    name: 'Mariana Robles Ortega',
    avatar: { skin: '#D9A074', hair: '#2B1B14', hairStyle: 'long', shirt: '#F8F6F1', earrings: true },
    role: 'Directora comercial',
    askAbout: 'Precios, disponibilidad y fechas de entrega.',
    color: 'pink',
  },
  {
    name: 'Héctor Villaseñor Paz',
    avatar: { skin: '#C98D62', hair: '#B9BCC8', hairStyle: 'short', shirt: '#F5B82E', glasses: true },
    role: 'Asesor de crédito',
    askAbout: 'Tu precalificación Infonavit o Fovissste.',
    color: 'indigo',
  },
  {
    name: 'Daniela Cruz Montiel',
    avatar: { skin: '#EFC39E', hair: '#2B1B14', hairStyle: 'bun', shirt: '#1B2559', earrings: true },
    role: 'Asesora de ventas, Bugambilia',
    askAbout: 'Recorridos por la casa muestra de tres recámaras.',
    color: 'yellow',
  },
  {
    name: 'Iván Sandoval Rey',
    avatar: { skin: '#A66B45', hair: '#1E1512', hairStyle: 'curly', shirt: '#F8F6F1', beard: true },
    role: 'Asesor de ventas, Jacaranda',
    askAbout: 'Las 12 casas que quedan y su ubicación en la privada.',
    color: 'purple',
  },
  {
    name: 'Paola Guerrero Luna',
    avatar: { skin: '#E3B089', hair: '#A8552B', hairStyle: 'bob', shirt: '#D42A72', glasses: true },
    role: 'Titulación y escrituras',
    askAbout: 'Notaría, avalúo y firma de tus escrituras.',
    color: 'indigo',
  },
  {
    name: 'Ernesto Maldonado Ríos',
    avatar: { skin: '#BF8459', hair: '#2B1B14', hairStyle: 'buzz', shirt: '#1B2559' },
    role: 'Atención posventa',
    askAbout: 'Garantías y detalles después de la entrega.',
    color: 'pink',
  },
]

type Testimonial = { family: string; project: string; quote: string }

export const testimonials: Testimonial[] = [
  {
    family: 'Familia Ortiz Bañuelos',
    project: 'Bugambilia',
    quote:
      'Pagamos renta nueve años. Hoy la mensualidad es casi la misma y la casa es nuestra.',
  },
  {
    family: 'Familia Peña Salgado',
    project: 'Cempasúchil',
    quote:
      'Héctor juntó nuestros dos créditos Infonavit. Solos no habríamos sabido que se podía.',
  },
  {
    family: 'Familia Lara Quintero',
    project: 'Jacaranda',
    quote:
      'Mis hijos salen en bici dentro del condominio. Eso era justo lo que buscábamos.',
  },
  {
    family: 'Familia Hernández Solís',
    project: 'Bugambilia',
    quote:
      'Nos entregaron la casa en la fecha que decía el contrato. Con dos niños, eso valía oro.',
  },
  {
    family: 'Rocío Medina Tapia',
    project: 'Cempasúchil',
    quote:
      'Compré sola, con mi crédito Infonavit. Paola me explicó cada papel antes de firmar.',
  },
  {
    family: 'Familia Ríos Camacho',
    project: 'Jacaranda',
    quote: 'El huerto comunitario lo cuidamos entre vecinos. Ya cosechamos jitomate y chile.',
  },
  {
    family: 'Familia Aguilar Nava',
    project: 'Bugambilia',
    quote:
      'Tenemos el parque enfrente. Mi mamá sale a caminar cada mañana sin cruzar una sola calle.',
  },
  {
    family: 'Jorge y Lucía Cabrera',
    project: 'Cempasúchil',
    quote:
      'Convertimos la azotea en terraza. Ahí festejamos el primer cumpleaños de nuestra hija.',
  },
  {
    family: 'Familia Domínguez Vera',
    project: 'Jacaranda',
    quote:
      'Salió una gotera con la primera lluvia. Ernesto mandó a repararla esa misma semana.',
  },
  {
    family: 'Familia Zamora Pineda',
    project: 'Bugambilia',
    quote: 'Trabajo desde casa y la tercera recámara es mi oficina. Ya no pago un coworking.',
  },
]

// Number of the WhatsApp chat bot and the message the chat opens with.
const WHATSAPP_NUMBER = '5217121006312'
const WHATSAPP_GREETING = 'Hola, me gustaría agendar una visita'

export const contact = {
  address: ['Av. de los Fresnos 120, Col. El Mirador', '42400 Huichapan, Hidalgo'],
  hours: [
    { days: 'Lunes a viernes', time: '10:00 a 19:00 h' },
    { days: 'Sábados', time: '10:00 a 14:00 h' },
    { days: 'Domingos', time: 'Cerrado' },
  ],
  phone: '55 5550 0142',
  phoneHref: 'tel:+525555500142',
  email: 'hola@tunuevohogar.com',
  whatsapp: '+52 1 712 100 6312',
  whatsappHref: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_GREETING)}`,
  // Marker at the centre of Huichapan: the address is fictional, so the position is approximate.
  map: {
    embedUrl:
      'https://www.openstreetmap.org/export/embed.html?bbox=-99.672%2C20.362%2C-99.632%2C20.389&layer=mapnik&marker=20.3756%2C-99.6519',
    linkUrl: 'https://www.openstreetmap.org/?mlat=20.3756&mlon=-99.6519#map=15/20.3756/-99.6519',
  },
}

// Sample draft: a real notice needs legal review before it is published.
export const privacyNotice = {
  updated: '4 de octubre de 2026',
  sections: [
    {
      title: 'Quién es responsable de tus datos',
      body: `Tu Nuevo Hogar, con domicilio en ${contact.address.join(', ')}.`,
    },
    {
      title: 'Qué datos te pedimos',
      body: 'Tu nombre, tu teléfono, el condominio que te interesa, el medio por el que prefieres que te contactemos y el comentario que quieras dejar.',
    },
    {
      title: 'Para qué los usamos',
      body: 'Para contactarte, agendar tu visita y darte información de las casas y de tu crédito. No los usamos para nada más sin pedírtelo antes.',
    },
    {
      title: 'Con quién los compartimos',
      body: 'Con nadie fuera de Tu Nuevo Hogar, salvo que una autoridad lo exija conforme a la ley.',
    },
    {
      title: 'Tus derechos',
      body: `Puedes pedir acceso a tus datos, corregirlos, cancelarlos u oponerte a su uso (derechos ARCO), y retirar tu consentimiento, escribiendo a ${contact.email}.`,
    },
    {
      title: 'Cambios a este aviso',
      body: 'Si este aviso cambia, publicaremos la nueva versión en esta misma página con su fecha de actualización.',
    },
  ],
}

export function isProjectId(value: string): value is ProjectId {
  return projects.some((project) => project.id === value)
}

type Faq = { question: string; answer: string }

const deliveryByProject = projects
  .map((project) => `${project.name}, ${project.delivery.toLowerCase()}`)
  .join('; ')

export const faqs: Faq[] = [
  {
    question: '¿Necesito cita para ver las casas muestra?',
    answer:
      'No es obligatoria, pero con cita un asesor te espera a la hora que elijas. El recorrido dura unos 40 minutos y se hace dentro del horario del centro de ventas.',
  },
  {
    question: '¿Qué documentos necesito para empezar?',
    answer:
      'Para la primera visita, ninguno. Para precalificar tu crédito te pediremos identificación oficial, CURP, número de seguridad social y un comprobante de domicilio.',
  },
  {
    question: '¿Cuándo me entregan la casa?',
    answer: `Depende del condominio. ${deliveryByProject}. La fecha queda escrita en tu contrato.`,
  },
  {
    question: '¿Cuánto tengo que dar de enganche?',
    answer:
      'Depende de tu crédito y de la casa. En el simulador de esta página puedes probar desde 5 % y ver cómo cambia la mensualidad; el monto definitivo lo confirma la institución que te presta.',
  },
  {
    question: '¿Puedo juntar mi crédito con el de otra persona?',
    answer:
      'Sí. Infonavit permite sumar tu crédito al de tu pareja, un familiar o un amigo. Nuestro asesor de crédito revisa los dos casos y te dice cuánto alcanzan juntos.',
  },
  {
    question: '¿Qué gastos hay además del precio de la casa?',
    answer:
      'Los de escrituración: honorarios del notario, impuestos, derechos de registro y avalúo. Cambian según la casa y el crédito, así que te entregamos el cálculo por escrito antes de que firmes.',
  },
  {
    question: '¿Puedo pagar de contado?',
    answer:
      'Sí. Además de Infonavit, Fovissste, Cofinavit y crédito bancario, aceptamos pago de contado.',
  },
  {
    question: '¿Las casas tienen garantía?',
    answer:
      'Sí. Cubre estructura, instalaciones e impermeabilización, con los plazos que marca tu contrato. Los reportes los recibe nuestra área de atención posventa.',
  },
]

export const navLinks = [
  { href: '/proyectos', label: 'Proyectos' },
  { href: '/promociones', label: 'Promociones' },
  { href: '/creditos', label: 'Créditos' },
  { href: '/equipo', label: 'Equipo' },
  { href: '/ubicacion', label: 'Ubicación' },
]

const currency = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 0,
})

export function formatMXN(amount: number) {
  return currency.format(amount)
}

export function formatMillions(amount: number) {
  if (amount < 1_000_000) return `$${Math.round(amount / 1000)} mil`
  return `$${(amount / 1_000_000).toFixed(2)} M`
}
