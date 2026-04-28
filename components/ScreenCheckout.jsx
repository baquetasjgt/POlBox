// POLEBOX — Checkout: resumen de reserva + método de pago

const ScreenCheckout = ({ booking, onBack, onPay }) => {
  const [method, setMethod] = React.useState('card');
  const b = booking || { dayLabel: 'Jue 15', startStr: '18:00', endStr: '19:30', duration: 90, boxIdx: 0, price: 20 };

  const methods = [
    { id: 'apple',  label: 'Apple Pay',  sub: 'Touch ID o Face ID', cta: 'Pagar con Apple Pay' },
    { id: 'card',   label: 'Tarjeta',    sub: 'Visa · Mastercard · Amex', cta: 'Pagar con tarjeta' },
    { id: 'gpay',   label: 'Google Pay', sub: 'Pago rápido', cta: 'Pagar con Google Pay' },
    { id: 'bizum',  label: 'Bizum',      sub: 'Desde tu móvil', cta: 'Pagar con Bizum' },
  ];
  const sel = methods.find(m => m.id === method);

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

        {/* Resumen de la compra */}
        <div style={{ margin: '8px 16px 12px', padding: 18, borderRadius: 22, background: PB.surface, border: `1px solid ${PB.line}` }}>
          <Eyebrow>Tu reserva</Eyebrow>
          <h3 style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 22, letterSpacing: '-0.015em', margin: '8px 0 4px' }}>
            BOX {b.boxIdx + 1} · {b.boxIdx === 0 ? 'Industrial' : 'Neón'}
          </h3>
          <div style={{ color: PB.ink3, fontSize: 13 }}>POLEBOX Madrid · Salamanca</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
            <Cell k="Día"      v={b.dayLabel}/>
            <Cell k="Duración" v={`${b.duration} min`}/>
            <Cell k="Inicio"   v={b.startStr + 'h'} mono/>
            <Cell k="Fin"      v={b.endStr + 'h'} mono/>
          </div>
        </div>

        {/* Desglose */}
        <div style={{ margin: '0 16px 12px', padding: '14px 18px', borderRadius: 18, background: PB.surface, border: `1px solid ${PB.line}` }}>
          <Line k={`Box · ${b.duration} min`}     v={`${b.price},00 €`}/>
          <Line k="IVA (21%) incluido"            v="" muted/>
          <div style={{ height: 1, background: PB.line, margin: '10px 0' }}/>
          <Line k={<strong style={{ fontWeight: 800, fontSize: 15 }}>Total</strong>}
                v={<span style={{ fontFamily: PB.mono, fontWeight: 800, fontSize: 22 }}>{b.price},00 €</span>}/>
        </div>

        {/* Método de pago */}
        <div style={{ padding: '4px 20px 4px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: PB.ink3, marginBottom: 8 }}>Método de pago</div>
        </div>
        <div style={{ margin: '0 16px', padding: 6, borderRadius: 18, background: PB.surface, border: `1px solid ${PB.line}` }}>
          {methods.map((m, i) => {
            const on = method === m.id;
            return (
              <button key={m.id} onClick={() => setMethod(m.id)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 12px', borderRadius: 12, border: 0, cursor: 'pointer',
                background: on ? PB.mentaSoft : 'transparent', textAlign: 'left',
                borderTop: i > 0 ? `1px solid ${on ? 'transparent' : PB.line}` : 0,
              }}>
                <div style={{ width: 40, height: 32, borderRadius: 8, background: '#fff', border: `1px solid ${PB.line}`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <Logo id={m.id}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 14, color: PB.ink }}>{m.label}</div>
                  <div style={{ fontSize: 11, color: PB.ink3, marginTop: 1 }}>{m.sub}</div>
                </div>
                <div style={{
                  width: 22, height: 22, borderRadius: 999,
                  border: `2px solid ${on ? PB.morado : PB.lineStrong}`,
                  background: on ? PB.morado : 'transparent',
                  display: 'grid', placeItems: 'center', flexShrink: 0,
                }}>
                  {on && <Icon name="check" size={12} color="#fff"/>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Aviso Stripe */}
        <div style={{ margin: '14px 20px 0', display: 'flex', alignItems: 'center', gap: 8, color: PB.ink3, fontSize: 11 }}>
          <Icon name="shield" size={13}/> Pago seguro procesado por <strong style={{ color: PB.ink2, fontWeight: 700 }}>Stripe</strong>.
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 16px 26px',
        borderTopLeftRadius: 28, borderTopRightRadius: 28, background: PB.surface,
        boxShadow: '0 -12px 30px rgba(20,19,24,.1)', borderTop: `1px solid ${PB.line}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: PB.ink3 }}>Total a pagar</div>
            <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 13, marginTop: 2, color: PB.ink3 }}>vía {sel.label}</div>
          </div>
          <div style={{ fontFamily: PB.mono, fontWeight: 800, fontSize: 26, color: PB.ink }}>{b.price},00&nbsp;€</div>
        </div>
        <Button onClick={() => onPay({ ...b, method: sel.id, methodLabel: sel.label })} full style={{ padding: '18px', fontSize: 16 }}>
          {sel.id === 'apple' && <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.2 13.4c0-1.8 1.5-2.7 1.6-2.7-.9-1.3-2.2-1.5-2.7-1.5-1.1-.1-2.2.7-2.8.7s-1.5-.7-2.4-.7c-1.3 0-2.4.7-3 1.9-1.3 2.3-.3 5.6.9 7.5.6.9 1.3 1.9 2.3 1.9s1.3-.6 2.4-.6 1.4.6 2.4.6 1.7-.9 2.3-1.8c.7-1 1-2.1 1-2.1s-2-.7-2-3.2zm-2-5.7c.5-.6.8-1.4.7-2.3-.7 0-1.5.4-2 1-.4.5-.8 1.3-.7 2.1.8 0 1.5-.4 2-.8z"/></svg>}
          {sel.cta} {b.price},00 €
        </Button>
      </div>
    </>
  );
};

const Cell = ({ k, v, mono }) => (
  <div style={{ padding: '10px 12px', borderRadius: 12, background: PB.surface2 }}>
    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: PB.ink3 }}>{k}</div>
    <div style={{ marginTop: 2, fontFamily: mono ? PB.mono : PB.font, fontWeight: 700, fontSize: 15, color: PB.ink }}>{v}</div>
  </div>
);
const Line = ({ k, v, muted }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', color: muted ? PB.ink3 : PB.ink2, fontSize: 13 }}>
    <span>{k}</span><span style={{ fontFamily: PB.mono, fontWeight: 700 }}>{v}</span>
  </div>
);

window.ScreenCheckout = ScreenCheckout;
