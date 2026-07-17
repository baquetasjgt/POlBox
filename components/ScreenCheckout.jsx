// POLEBOX — Checkout: resumen de reserva + método de pago + promociones

const ScreenCheckout = ({ booking, onBack, onPay, userBonos, isFirstBooking }) => {
  // El guard del router garantiza que booking existe; el fallback solo protege
  // usos fuera del flujo normal.
  const b = booking || { dayLabel: 'Hoy', startStr: '18:00', endStr: '19:30', duration: 90, boxIdx: 0, price: 20 };

  // Detectar bono compatible con la duración seleccionada
  const compatibleBono = (userBonos || []).find(
    bn => bn.state === 'active' && bn.min === b.duration && (bn.accesos - bn.usados) > 0
  );

  const [method, setMethod] = React.useState(compatibleBono ? 'bono' : 'card');

  // ── Promociones ───────────────────────────────────────────
  // -50% primera sesión (la promesa del hero de la home, ahora aplicada de
  // verdad) + código promocional manual.
  const [promoCode, setPromoCode] = React.useState('');
  const [promoState, setPromoState] = React.useState(null); // null | 'ok' | 'error'
  const [showPromoInput, setShowPromoInput] = React.useState(false);
  const PROMO_CODES = { 'POLE10': 0.10, 'AMIGA50': 0.50 };

  const usingBonoPre = method === 'bono';
  const firstOff = isFirstBooking && !usingBonoPre ? PBU.FIRST_BOOKING_DISCOUNT : 0;
  const codeOff = promoState === 'ok' ? (PROMO_CODES[promoCode.trim().toUpperCase()] || 0) : 0;
  // No acumulables: se aplica el mayor descuento
  const discount = Math.max(firstOff, codeOff);
  const discountLabel = discount === 0 ? null
    : (firstOff >= codeOff ? 'Primera sesión −50%' : `Código ${promoCode.trim().toUpperCase()} −${Math.round(codeOff * 100)}%`);
  const finalPrice = Math.round(b.price * (1 - discount) * 100) / 100;

  const applyPromo = () => {
    setPromoState(PROMO_CODES[promoCode.trim().toUpperCase()] ? 'ok' : 'error');
  };

  const payMethods = [
    { id: 'apple',  label: 'Apple Pay',  sub: 'Touch ID o Face ID', cta: 'Pagar con Apple Pay' },
    { id: 'card',   label: 'Tarjeta',    sub: 'Visa · Mastercard · Amex', cta: 'Pagar con tarjeta' },
    { id: 'gpay',   label: 'Google Pay', sub: 'Pago rápido', cta: 'Pagar con Google Pay' },
    { id: 'bizum',  label: 'Bizum',      sub: 'Desde tu móvil', cta: 'Pagar con Bizum' },
  ];
  const sel = payMethods.find(m => m.id === method);
  const usingBono = method === 'bono';

  const Logo = ({ id }) => {
    if (id === 'apple') return <svg width="22" height="22" viewBox="0 0 24 24" fill={PB.ink}><path d="M17.2 13.4c0-1.8 1.5-2.7 1.6-2.7-.9-1.3-2.2-1.5-2.7-1.5-1.1-.1-2.2.7-2.8.7s-1.5-.7-2.4-.7c-1.3 0-2.4.7-3 1.9-1.3 2.3-.3 5.6.9 7.5.6.9 1.3 1.9 2.3 1.9s1.3-.6 2.4-.6 1.4.6 2.4.6 1.7-.9 2.3-1.8c.7-1 1-2.1 1-2.1s-2-.7-2-3.2zm-2-5.7c.5-.6.8-1.4.7-2.3-.7 0-1.5.4-2 1-.4.5-.8 1.3-.7 2.1.8 0 1.5-.4 2-.8z"/></svg>;
    if (id === 'gpay')  return <svg width="26" height="22" viewBox="0 0 26 22"><circle cx="11" cy="11" r="9" fill="#fff" stroke="#dadce0"/><text x="11" y="14" textAnchor="middle" fontSize="9" fontWeight="700" fill="#5f6368" fontFamily="Arial">G</text><text x="20" y="14" fontSize="7" fontWeight="700" fill="#3c4043" fontFamily="Arial">Pay</text></svg>;
    if (id === 'card')  return <Icon name="card" size={22} color={PB.ink2}/>;
    if (id === 'bizum') return <div style={{ width: 30, height: 18, borderRadius: 4, background: '#00CFFF', display: 'grid', placeItems: 'center', fontFamily: 'system-ui', fontWeight: 800, fontSize: 9, color: '#fff', letterSpacing: '.04em' }}>BIZUM</div>;
    return null;
  };

  return (
    <>
      <StatusBar/>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 180 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 16px', position: 'relative' }}>
          <button onClick={onBack} style={{ position: 'absolute', left: 16, width: 40, height: 40, borderRadius: 12, border: `1px solid ${PB.line}`, background: PB.surface, display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
            <Icon name="back" size={18}/>
          </button>
          <h3 style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 18, letterSpacing: '-0.01em', margin: 0 }}>Resumen</h3>
        </div>

        {/* Banner bono compatible */}
        {compatibleBono && (
          <div style={{ margin: '0 16px 12px', padding: '12px 14px', borderRadius: 14, background: PB.mentaSoft, border: `1px solid ${PB.mentaDeep}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="sparkle" size={18} color={PB.morado}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 13, color: PB.moradoInk }}>Tienes un bono compatible</div>
              <div style={{ fontSize: 11, color: PB.morado, marginTop: 1 }}>{compatibleBono.name} · {compatibleBono.accesos - compatibleBono.usados} accesos restantes</div>
            </div>
          </div>
        )}

        {/* Resumen reserva */}
        <div style={{ margin: '0 16px 12px', padding: 18, borderRadius: 22, background: PB.surface, border: `1px solid ${PB.line}` }}>
          <Eyebrow>Tu reserva</Eyebrow>
          <h3 style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 22, letterSpacing: '-0.015em', margin: '8px 0 4px' }}>
            {b.boxLabel || `BOX ${b.boxIdx + 1}`}
          </h3>
          <div style={{ color: PB.ink3, fontSize: 13 }}>POLEBOX {b.venueName || 'Madrid · Salamanca'}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
            <CheckoutCell k="Día"      v={b.dayLabel}/>
            <CheckoutCell k="Duración" v={`${b.duration} min`}/>
            <CheckoutCell k="Inicio"   v={b.startStr + 'h'} mono/>
            <CheckoutCell k="Fin"      v={b.endStr + 'h'} mono/>
          </div>
        </div>

        {/* Desglose */}
        <div style={{ margin: '0 16px 12px', padding: '14px 18px', borderRadius: 18, background: PB.surface, border: `1px solid ${PB.line}` }}>
          {usingBono ? (<>
            <CheckoutLine k={`Box · ${b.duration} min`} v={`${b.price},00 €`} strike/>
            <CheckoutLine k="Descuento bono" v={`−${b.price},00 €`} green/>
            <div style={{ height: 1, background: PB.line, margin: '10px 0' }}/>
            <CheckoutLine k={<strong style={{ fontWeight: 800, fontSize: 15 }}>Total</strong>}
                  v={<span style={{ fontFamily: PB.mono, fontWeight: 800, fontSize: 22, color: PB.success }}>0,00 €</span>}/>
            <div style={{ marginTop: 8, padding: '8px 10px', borderRadius: 10, background: PB.mentaSoft, fontSize: 12, color: PB.moradoInk, fontWeight: 600 }}>
              1 acceso de tu {compatibleBono.name} · quedan {(compatibleBono.accesos - compatibleBono.usados) - 1} tras esta reserva
            </div>
          </>) : (<>
            <CheckoutLine k={`Box · ${b.duration} min${b.valle ? ' · hora valle' : ''}`} v={PBU.fmtEUR(b.price)}/>
            {discount > 0 && <CheckoutLine k={discountLabel} v={`−${PBU.fmtEUR(b.price - finalPrice)}`} green/>}
            <CheckoutLine k="IVA (21%) incluido" v="" muted/>
            <div style={{ height: 1, background: PB.line, margin: '10px 0' }}/>
            <CheckoutLine k={<strong style={{ fontWeight: 800, fontSize: 15 }}>Total</strong>}
                  v={<span style={{ fontFamily: PB.mono, fontWeight: 800, fontSize: 22 }}>{PBU.fmtEUR(finalPrice)}</span>}/>
          </>)}
        </div>

        {/* Código promocional */}
        {!usingBono && (
          <div style={{ margin: '0 16px 12px' }}>
            {!showPromoInput ? (
              <button onClick={() => setShowPromoInput(true)} style={{ background: 'transparent', border: 0, padding: '2px 4px', cursor: 'pointer', fontFamily: PB.font, fontWeight: 700, fontSize: 13, color: PB.morado }}>
                ¿Tienes un código promocional?
              </button>
            ) : (
              <div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    value={promoCode}
                    onChange={e => { setPromoCode(e.target.value); setPromoState(null); }}
                    onKeyDown={e => e.key === 'Enter' && applyPromo()}
                    placeholder="Código (p. ej. POLE10)"
                    style={{ flex: 1, padding: '12px 14px', borderRadius: 12, border: `1.5px solid ${promoState === 'error' ? PB.danger : promoState === 'ok' ? PB.success : PB.line}`, background: PB.surface, fontFamily: PB.mono, fontWeight: 600, fontSize: 13, color: PB.ink, outline: 'none', textTransform: 'uppercase' }}
                  />
                  <button onClick={applyPromo} style={{ padding: '0 18px', borderRadius: 12, border: 0, background: PB.ink, color: '#fff', fontFamily: PB.font, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                    Aplicar
                  </button>
                </div>
                {promoState === 'error' && <div style={{ fontSize: 12, color: PB.danger, fontWeight: 600, marginTop: 6 }}>Ese código no existe o ha caducado.</div>}
                {promoState === 'ok' && <div style={{ fontSize: 12, color: PB.success, fontWeight: 600, marginTop: 6 }}>✓ Código aplicado{firstOff > codeOff ? ' — se mantiene tu descuento de primera sesión, que es mayor' : ''}.</div>}
              </div>
            )}
          </div>
        )}

        {/* Método de pago */}
        <div style={{ padding: '4px 20px 4px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: PB.ink3, marginBottom: 8 }}>Método de pago</div>
        </div>
        <div style={{ margin: '0 16px', padding: 6, borderRadius: 18, background: PB.surface, border: `1px solid ${PB.line}` }}>
          {/* Opción bono (si hay compatible) */}
          {compatibleBono && (() => {
            const on = method === 'bono';
            return (
              <button onClick={() => setMethod('bono')} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 12px', borderRadius: 12, border: 0, cursor: 'pointer',
                background: on ? PB.mentaSoft : 'transparent', textAlign: 'left',
              }}>
                <div style={{ width: 40, height: 32, borderRadius: 8, background: on ? PB.morado : PB.surface2, border: `1px solid ${on ? PB.morado : PB.line}`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <Icon name="sparkle" size={18} color={on ? '#fff' : PB.ink3}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 14, color: PB.ink }}>Bono {compatibleBono.min} min</div>
                  <div style={{ fontSize: 11, color: PB.ink3, marginTop: 1 }}>{compatibleBono.name} · {compatibleBono.accesos - compatibleBono.usados} accesos disponibles</div>
                </div>
                <div style={{ width: 22, height: 22, borderRadius: 999, border: `2px solid ${on ? PB.morado : PB.lineStrong}`, background: on ? PB.morado : 'transparent', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  {on && <Icon name="check" size={12} color="#fff"/>}
                </div>
              </button>
            );
          })()}
          {/* Métodos de pago normales */}
          {payMethods.map((m, i) => {
            const on = method === m.id;
            return (
              <button key={m.id} onClick={() => setMethod(m.id)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 12px', borderRadius: 12, border: 0, cursor: 'pointer',
                background: on ? PB.mentaSoft : 'transparent', textAlign: 'left',
                borderTop: (i > 0 || compatibleBono) ? `1px solid ${on ? 'transparent' : PB.line}` : 0,
              }}>
                <div style={{ width: 40, height: 32, borderRadius: 8, background: '#fff', border: `1px solid ${PB.line}`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <Logo id={m.id}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 14, color: PB.ink }}>{m.label}</div>
                  <div style={{ fontSize: 11, color: PB.ink3, marginTop: 1 }}>{m.sub}</div>
                </div>
                <div style={{ width: 22, height: 22, borderRadius: 999, border: `2px solid ${on ? PB.morado : PB.lineStrong}`, background: on ? PB.morado : 'transparent', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  {on && <Icon name="check" size={12} color="#fff"/>}
                </div>
              </button>
            );
          })}
        </div>

        {!usingBono && (
          <div style={{ margin: '14px 20px 0', display: 'flex', alignItems: 'center', gap: 8, color: PB.ink3, fontSize: 11 }}>
            <Icon name="shield" size={13}/> Pago seguro procesado por <strong style={{ color: PB.ink2, fontWeight: 700 }}>Stripe</strong>.
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 16px 26px',
        borderTopLeftRadius: 28, borderTopRightRadius: 28, background: PB.surface,
        boxShadow: '0 -12px 30px rgba(20,19,24,.1)', borderTop: `1px solid ${PB.line}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: PB.ink3 }}>
              {usingBono ? 'Pagando con' : 'Total a pagar'}
            </div>
            <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 13, marginTop: 2, color: PB.ink3 }}>
              {usingBono ? compatibleBono.name : `vía ${sel.label}`}
            </div>
          </div>
          <div style={{ fontFamily: PB.mono, fontWeight: 800, fontSize: 26, color: usingBono ? PB.success : PB.ink }}>
            {usingBono ? '0,00 €' : PBU.fmtEUR(finalPrice)}
          </div>
        </div>
        <Button
          onClick={() => onPay({
            ...b,
            price: usingBono ? b.price : finalPrice,
            promo: !usingBono && discount > 0 ? { label: discountLabel, off: discount, original: b.price } : null,
            method: usingBono ? 'bono' : sel.id,
            methodLabel: usingBono ? `Bono ${compatibleBono?.id}` : sel.label,
            bonoId: usingBono ? compatibleBono?.id : null,
          })}
          full style={{ padding: '18px', fontSize: 16 }}
        >
          {usingBono ? <><Icon name="sparkle" size={18} color="#fff"/> Confirmar con bono</> : <>
            {sel.id === 'apple' && <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.2 13.4c0-1.8 1.5-2.7 1.6-2.7-.9-1.3-2.2-1.5-2.7-1.5-1.1-.1-2.2.7-2.8.7s-1.5-.7-2.4-.7c-1.3 0-2.4.7-3 1.9-1.3 2.3-.3 5.6.9 7.5.6.9 1.3 1.9 2.3 1.9s1.3-.6 2.4-.6 1.4.6 2.4.6 1.7-.9 2.3-1.8c.7-1 1-2.1 1-2.1s-2-.7-2-3.2zm-2-5.7c.5-.6.8-1.4.7-2.3-.7 0-1.5.4-2 1-.4.5-.8 1.3-.7 2.1.8 0 1.5-.4 2-.8z"/></svg>}
            {sel.cta} {PBU.fmtEUR(finalPrice)}
          </>}
        </Button>
      </div>
    </>
  );
};

// Nombres únicos: los scripts Babel comparten el scope global y ProfileSubScreens
// también declara "Line" — la colisión dejaba el desglose del checkout vacío.
const CheckoutCell = ({ k, v, mono }) => (
  <div style={{ padding: '10px 12px', borderRadius: 12, background: PB.surface2 }}>
    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: PB.ink3 }}>{k}</div>
    <div style={{ marginTop: 2, fontFamily: mono ? PB.mono : PB.font, fontWeight: 700, fontSize: 15, color: PB.ink }}>{v}</div>
  </div>
);
const CheckoutLine = ({ k, v, muted, strike, green }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', color: muted ? PB.ink3 : PB.ink2, fontSize: 13 }}>
    <span style={{ textDecoration: strike ? 'line-through' : 'none', color: strike ? PB.ink3 : undefined }}>{k}</span>
    <span style={{ fontFamily: PB.mono, fontWeight: 700, color: green ? PB.success : undefined }}>{v}</span>
  </div>
);

window.ScreenCheckout = ScreenCheckout;
