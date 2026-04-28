// POLEBOX — Carrito + elección de método de entrega

const ScreenStoreCart = ({ onBack, cart, setCart, onDelivery }) => {
  const [method, setMethod] = React.useState(null); // 'locker' | 'home'

  const add    = (id) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const remove = (id) => setCart(c => { const n = { ...c }; if (n[id] > 1) n[id]--; else delete n[id]; return n; });

  const subtotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = STORE_PRODUCTS.find(p => p.id === parseInt(id));
    return sum + (p ? p.price * qty : 0);
  }, 0);
  const shipping = method === 'home' ? 4.99 : 0;
  const total    = subtotal + shipping;
  const fmt      = (n) => n.toFixed(2).replace('.', ',') + ' €';
  const items    = Object.entries(cart).filter(([, q]) => q > 0);

  const methods = [
    {
      id: 'locker',
      icon: 'bolt',
      title: 'Recogida en locker',
      sub: 'Gratis · disponible al llegar a tu sede',
      badge: 'Gratis',
      badgeColor: PB.success,
      badgeBg: PB.successBg,
    },
    {
      id: 'home',
      icon: 'refresh',
      title: 'Envío a domicilio',
      sub: '4,99 € · 3–5 días hábiles · Correos Express',
      badge: '4,99 €',
      badgeColor: PB.warn,
      badgeBg: PB.warnBg,
    },
  ];

  return (
    <>
      <StatusBar/>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: method ? 200 : 110 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px 16px' }}>
          <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: 12, border: `1px solid ${PB.line}`, background: PB.surface, display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
            <Icon name="back" size={18}/>
          </button>
          <h3 style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 20, letterSpacing: '-0.01em', margin: 0, flex: 1 }}>Tu carrito</h3>
          <span style={{ fontFamily: PB.mono, fontWeight: 700, fontSize: 13, color: PB.ink3 }}>{items.length} producto{items.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Artículos */}
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map(([id, qty]) => {
            const p = STORE_PRODUCTS.find(p => p.id === parseInt(id));
            if (!p) return null;
            return (
              <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, background: PB.surface, border: `1px solid ${PB.line}` }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: p.color, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <Icon name={p.icon} size={20} color={PB.morado}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 14, color: PB.ink }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: PB.ink3 }}>{p.sub}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button onClick={() => remove(p.id)} style={{ width: 26, height: 26, borderRadius: 999, border: `1px solid ${PB.line}`, background: PB.surface2, display: 'grid', placeItems: 'center', cursor: 'pointer', fontWeight: 800, fontSize: 15, color: PB.ink }}>−</button>
                    <span style={{ fontFamily: PB.mono, fontWeight: 700, fontSize: 14, color: PB.morado, minWidth: 14, textAlign: 'center' }}>{qty}</span>
                    <button onClick={() => add(p.id)} style={{ width: 26, height: 26, borderRadius: 999, border: 0, background: PB.morado, display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
                      <Icon name="plus" size={13} color="#fff"/>
                    </button>
                  </div>
                  <div style={{ fontFamily: PB.mono, fontWeight: 700, fontSize: 14, color: PB.ink, minWidth: 50, textAlign: 'right' }}>{fmt(p.price * qty)}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Método de entrega */}
        <div style={{ padding: '22px 16px 8px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: PB.ink3, marginBottom: 10 }}>¿Cómo lo recibes?</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {methods.map(m => {
              const sel = method === m.id;
              return (
                <button key={m.id} onClick={() => setMethod(m.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px', borderRadius: 18, cursor: 'pointer', textAlign: 'left',
                  border: `2px solid ${sel ? PB.morado : PB.line}`,
                  background: sel ? 'rgba(72,35,128,.04)' : PB.surface,
                  boxShadow: sel ? '0 6px 18px rgba(72,35,128,.12)' : 'none',
                  transition: 'all 220ms cubic-bezier(.2,.7,.2,1)',
                }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: sel ? PB.morado : PB.surface2, display: 'grid', placeItems: 'center', flexShrink: 0, transition: 'background 220ms' }}>
                    <Icon name={m.icon} size={20} color={sel ? '#fff' : PB.morado}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 15, color: PB.ink }}>{m.title}</div>
                    <div style={{ fontSize: 11, color: PB.ink3, marginTop: 2 }}>{m.sub}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                    <span style={{ padding: '3px 8px', borderRadius: 999, background: m.badgeBg, color: m.badgeColor, fontSize: 10, fontWeight: 800 }}>{m.badge}</span>
                    <div style={{ width: 20, height: 20, borderRadius: 999, border: `2px solid ${sel ? PB.morado : PB.lineStrong}`, background: sel ? PB.morado : 'transparent', display: 'grid', placeItems: 'center' }}>
                      {sel && <Icon name="check" size={11} color="#fff"/>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Desglose precios */}
        <div style={{ margin: '16px 16px 0', padding: '14px 16px', borderRadius: 16, background: PB.surface, border: `1px solid ${PB.line}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: PB.ink2, marginBottom: 6 }}>
            <span>Subtotal</span><span style={{ fontFamily: PB.mono, fontWeight: 600 }}>{fmt(subtotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: PB.ink2, marginBottom: 8 }}>
            <span>Envío</span><span style={{ fontFamily: PB.mono, fontWeight: 600, color: shipping === 0 ? PB.success : PB.ink2 }}>{shipping === 0 ? 'Gratis' : fmt(shipping)}</span>
          </div>
          <div style={{ height: 1, background: PB.line, marginBottom: 8 }}/>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 15 }}>Total</span>
            <span style={{ fontFamily: PB.mono, fontWeight: 800, fontSize: 20, color: PB.ink }}>{fmt(total)}</span>
          </div>
        </div>
      </div>

      {/* CTA continuar */}
      {method && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 16px 26px', background: PB.surface, boxShadow: '0 -12px 30px rgba(20,19,24,.1)', borderTop: `1px solid ${PB.line}`, borderTopLeftRadius: 28, borderTopRightRadius: 28 }}>
          <Button onClick={() => onDelivery(method)} full icon="arrow" style={{ padding: '18px', fontSize: 16 }}>
            {method === 'locker' ? 'Elegir sede y locker' : 'Introducir dirección'}
          </Button>
        </div>
      )}

    </>
  );
};

window.ScreenStoreCart = ScreenStoreCart;
