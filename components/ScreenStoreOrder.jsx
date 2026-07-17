// POLEBOX — Resumen completo del pedido antes de pagar

const ScreenStoreOrder = ({ onBack, cart, delivery, address, pickup, onPay }) => {
  const { subtotal, shipping, total } = PBU.cartTotals(cart, delivery);
  const fmt   = PBU.fmtEUR;
  const items = Object.entries(cart).filter(([, q]) => q > 0);

  return (
    <>
      <StatusBar/>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 180 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px 16px' }}>
          <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: 12, border: `1px solid ${PB.line}`, background: PB.surface, display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
            <Icon name="back" size={18}/>
          </button>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: PB.ink3 }}>Paso 2 de 3</div>
            <h3 style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 18, letterSpacing: '-0.01em', margin: '2px 0 0' }}>Resumen del pedido</h3>
          </div>
        </div>

        {/* Progreso */}
        <div style={{ padding: '0 16px 20px', display: 'flex', gap: 6 }}>
          {[1,2,3].map(i => <div key={i} style={{ flex: 1, height: 4, borderRadius: 999, background: i <= 2 ? PB.morado : PB.surface3 }}/>)}
        </div>

        {/* Artículos */}
        <div style={{ padding: '0 20px 8px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: PB.ink3, marginBottom: 10 }}>Productos</div>
        </div>
        <div style={{ margin: '0 16px', borderRadius: 18, background: PB.surface, border: `1px solid ${PB.line}`, overflow: 'hidden' }}>
          {items.map(([id, qty], i) => {
            const p = STORE_PRODUCTS.find(p => p.id === parseInt(id));
            if (!p) return null;
            return (
              <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderTop: i > 0 ? `1px solid ${PB.line}` : 0 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: p.color, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <Icon name={p.icon} size={16} color={PB.morado}/>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: PB.font, fontWeight: 600, fontSize: 13, color: PB.ink }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: PB.ink3 }}>×{qty}</div>
                </div>
                <div style={{ fontFamily: PB.mono, fontWeight: 700, fontSize: 14, color: PB.ink }}>{fmt(p.price * qty)}</div>
              </div>
            );
          })}
        </div>

        {/* Entrega */}
        <div style={{ padding: '20px 20px 8px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: PB.ink3, marginBottom: 10 }}>Entrega</div>
        </div>
        <div style={{ margin: '0 16px', padding: '14px 16px', borderRadius: 18, background: PB.surface, border: `1px solid ${PB.line}` }}>
          {delivery === 'locker' ? (
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: PB.mentaSoft, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <Icon name="bolt" size={18} color={PB.morado}/>
              </div>
              <div>
                <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 14, color: PB.ink }}>Recogida en locker</div>
                <div style={{ fontSize: 12, color: PB.ink3, marginTop: 2 }}>POLEBOX {pickup.venueName}</div>
                <div style={{ fontSize: 12, color: PB.ink3 }}>{pickup.venueAddr}</div>
                <div style={{ fontSize: 12, color: PB.ink3, marginTop: 4 }}>Locker <strong style={{ color: PB.morado, fontWeight: 700 }}>{pickup.lockerId}</strong> reservado · válido 48 h</div>
                <span style={{ display: 'inline-block', marginTop: 6, padding: '3px 8px', borderRadius: 999, background: PB.successBg, color: PB.success, fontSize: 10, fontWeight: 800 }}>Gratis</span>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: PB.warnBg, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <Icon name="refresh" size={18} color={PB.warn}/>
              </div>
              <div>
                <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 14, color: PB.ink }}>Envío a domicilio</div>
                <div style={{ fontSize: 12, color: PB.ink3, marginTop: 2 }}>{address.nombre}</div>
                <div style={{ fontSize: 12, color: PB.ink3 }}>{address.calle}</div>
                <div style={{ fontSize: 12, color: PB.ink3 }}>{address.cp} {address.ciudad}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                  <span style={{ padding: '3px 8px', borderRadius: 999, background: PB.warnBg, color: PB.warn, fontSize: 10, fontWeight: 800 }}>{PBU.fmtEUR(PBU.SHIPPING_COST)}</span>
                  <span style={{ fontSize: 11, color: PB.ink3 }}>· 3–5 días hábiles · Correos Express</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Desglose */}
        <div style={{ margin: '14px 16px 0', padding: '14px 16px', borderRadius: 16, background: PB.surface, border: `1px solid ${PB.line}` }}>
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

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 16px 26px', background: PB.surface, boxShadow: '0 -12px 30px rgba(20,19,24,.1)', borderTop: `1px solid ${PB.line}`, borderTopLeftRadius: 28, borderTopRightRadius: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: PB.ink3 }}>Total a pagar</div>
          <div style={{ fontFamily: PB.mono, fontWeight: 800, fontSize: 22, color: PB.ink }}>{fmt(total)}</div>
        </div>
        <Button onClick={() => onPay(total)} full icon="arrow" style={{ padding: '18px', fontSize: 16 }}>
          Ir al pago
        </Button>
      </div>

    </>
  );
};

window.ScreenStoreOrder = ScreenStoreOrder;
