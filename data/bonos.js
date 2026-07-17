// POLEBOX — catálogo de bonos de acceso y condiciones de uso.
// perAcceso y saving se calculan a partir del precio (antes iban precalculados
// a mano y el Bono Inicio llevaba un −21% que en realidad era −23%).

// Precio suelto de referencia por duración de sesión
const BONO_BASE_PRICES = { 60: 18, 90: 22 };

const BONO_CATALOG = [
  { id: 'b5-60',   name: 'Bono Inicio',      accesos: 5,  min: 60, price: 69,  caducidadDias: 60 },
  { id: 'b5-90',   name: 'Bono Inicio Pro',  accesos: 5,  min: 90, price: 89,  caducidadDias: 60 },
  { id: 'b10-60',  name: 'Bono Mensual',     accesos: 10, min: 60, price: 120, caducidadDias: 90, popular: true },
  { id: 'b10-90',  name: 'Bono Mensual Pro', accesos: 10, min: 90, price: 149, caducidadDias: 90 },
  { id: 'b10-90m', name: 'Bono Mañanas',     accesos: 10, min: 90, price: 132, caducidadDias: 90,
    morning: true, schedule: { days: 'Lun–Vie', from: '09:00', to: '14:00', lastEntry: '12:30' } },
].map(b => ({
  ...b,
  perAcceso: Math.round((b.price / b.accesos) * 100) / 100,
  saving: Math.round((1 - b.price / (b.accesos * BONO_BASE_PRICES[b.min])) * 100),
}));

// Membresía recurrente (evolución del prepago): se muestra en el mismo
// catálogo pero con mecánica de renovación mensual.
const SUBSCRIPTION_TIER = {
  id: 'sub-unlimited', name: 'POLEBOX Unlimited', type: 'subscription',
  accesos: 12, min: 90, price: 159, priceLabel: '159 €/mes', caducidadDias: 30,
  perks: ['12 accesos/mes · rollover de 2', 'Prioridad de reserva 48 h antes', '−10% en tienda', 'Cursos online incluidos'],
  perAcceso: Math.round((159 / 12) * 100) / 100,
  saving: Math.round((1 - 159 / (12 * BONO_BASE_PRICES[90])) * 100),
};

const CARD_THEMES = {
  'b5-60':  {
    bg: 'linear-gradient(140deg, #1b4a42 0%, #0d2e28 45%, #163d36 100%)',
    accent: '#4ecdc4',
    glow: 'rgba(78,205,196,.35)',
    shimmer: 'rgba(78,205,196,.18)',
  },
  'b5-90':  {
    bg: 'linear-gradient(140deg, #22204e 0%, #131130 45%, #1e1c44 100%)',
    accent: '#9b8ffc',
    glow: 'rgba(155,143,252,.32)',
    shimmer: 'rgba(155,143,252,.2)',
  },
  'b10-60': {
    bg: 'linear-gradient(140deg, #3e1478 0%, #1f0844 45%, #310f62 100%)',
    accent: '#c9a8ff',
    glow: 'rgba(72,35,128,.5)',
    shimmer: 'rgba(201,168,255,.22)',
  },
  'b10-90': {
    bg: 'linear-gradient(140deg, #201608 0%, #100c04 45%, #281c0a 100%)',
    accent: '#ffd166',
    glow: 'rgba(255,209,102,.28)',
    shimmer: 'rgba(255,209,102,.2)',
  },
  'b10-90m': {
    bg: 'linear-gradient(140deg, #2e1600 0%, #1c0e00 45%, #361a00 100%)',
    accent: '#ff9f43',
    glow: 'rgba(255,159,67,.35)',
    shimmer: 'rgba(255,159,67,.2)',
  },
  'sub-unlimited': {
    bg: 'linear-gradient(140deg, #0e2a3f 0%, #071722 45%, #123246 100%)',
    accent: '#7fd8ff',
    glow: 'rgba(127,216,255,.32)',
    shimmer: 'rgba(127,216,255,.2)',
  },
};

const BASE_CONDITIONS = [
  'Personal e intransferible. Solo puede usarlo la titular de la cuenta.',
  'La caducidad comienza en la fecha de compra, no de primer uso.',
  'Los accesos no utilizados al vencer el plazo no se reembolsan.',
  'Cancelación con más de 24 h de antelación: el acceso se reintegra al bono.',
  'Cancelación con menos de 24 h: el acceso se consume sin posibilidad de recuperación.',
  'No acumulable con otras promociones, descuentos o códigos.',
  'Válido en todas las sedes de POLEBOX.',
  'POLEBOX se reserva el derecho a cancelar sesiones por causas de fuerza mayor, reintegrando el acceso al bono.',
];
const getConditions = (bono) => bono.schedule
  ? [`Uso exclusivo de mañanas: válido de ${bono.schedule.days} de ${bono.schedule.from} a ${bono.schedule.to}. Última entrada a las ${bono.schedule.lastEntry}.`, ...BASE_CONDITIONS]
  : BASE_CONDITIONS;

Object.assign(window, { BONO_CATALOG, BONO_BASE_PRICES, SUBSCRIPTION_TIER, CARD_THEMES, BASE_CONDITIONS, getConditions });
