// POLEBOX — utilidades compartidas de dominio.
// Cargado antes de /components: expone window.PBU (formato, carrito, fechas, ids).
// Sustituye a los helpers duplicados que vivían copiados en cada pantalla
// (fmt de moneda ×5, subtotal de carrito ×4, coste de envío ×3, fechas en App.jsx).

const PBU = {
  // ── Constantes de negocio ─────────────────────────────────
  SHIPPING_COST: 4.99,          // envío a domicilio (Correos Express)
  IVA_RATE: 0.21,
  FIRST_BOOKING_DISCOUNT: 0.5,  // promo "-50% tu primera sesión" del home

  // ── Moneda ────────────────────────────────────────────────
  // Mantiene el formato visual ya establecido en todo el prototipo: "12,00 €".
  fmtEUR(n) {
    return (Math.round(n * 100) / 100).toFixed(2).replace('.', ',') + ' €';
  },

  // ── Fechas ────────────────────────────────────────────────
  MESES: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  DIAS: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
  fmtFecha(d) {
    return `${d.getDate()} ${PBU.MESES[d.getMonth()]} ${d.getFullYear()}`;
  },
  fmtFechaCorta(d) {
    return `${PBU.DIAS[d.getDay()]} ${d.getDate()} ${PBU.MESES[d.getMonth()]}`;
  },
  addDays(d, n) {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
  },
  daysUntil(dateStr) {
    // días naturales desde hoy hasta una fecha ISO (yyyy-mm-dd); negativo si pasó
    const target = new Date(dateStr + 'T23:59:59');
    return Math.ceil((target - new Date()) / 86400000);
  },
  toISODate(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },

  // ── Carrito de tienda ─────────────────────────────────────
  // cart: { [productId]: qty } · catálogo en window.STORE_PRODUCTS
  cartItems(cart) {
    return Object.entries(cart || {})
      .filter(([, q]) => q > 0)
      .map(([id, qty]) => ({ product: window.STORE_PRODUCTS.find(p => p.id === parseInt(id)), qty }))
      .filter(it => it.product);
  },
  cartCount(cart) {
    return Object.values(cart || {}).reduce((a, b) => a + b, 0);
  },
  cartSubtotal(cart) {
    return PBU.cartItems(cart).reduce((sum, it) => sum + it.product.price * it.qty, 0);
  },
  cartTotals(cart, deliveryMethod) {
    const subtotal = PBU.cartSubtotal(cart);
    const shipping = deliveryMethod === 'home' ? PBU.SHIPPING_COST : 0;
    return { subtotal, shipping, total: subtotal + shipping };
  },

  // ── Identificadores legibles de demo ──────────────────────
  uid(prefix) {
    return `${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  },
  pin4() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  },
};

window.PBU = PBU;
