// POLEBOX — Confirmación de pedido

const ScreenStoreConfirm = ({ onDone, delivery, address, pickup, cart }) => {
  const orderNum = React.useMemo(() => 'PB-' + Math.random().toString(36).slice(2,7).toUpperCase(), []);
  const lockerCode = React.useMemo(() => Math.floor(1000 + Math.random() * 9000).toString(), []);

  const items = Object.entries(cart || {}).filter(([, q]) => q > 0);
  const fmt   = (n) => n.toFixed(2).replace('.', ',') + ' €';
  const total = items.reduce((sum, [id, qty]) => {
    const p = STORE_PRODUCTS.find(p => p.id === parseInt(id));
    return sum + (p ? p.price * qty : 0);
  }, 0) + (delivery === 'home' ? 4.99 : 0);

  return (
    <>
      <StatusBar/>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 120 }}>

        {/* Hero confirmación */}
        <div style={{ margin: '20px 16px 0', padding: '28px 20px', borderRadius: 28, background: `linear-gradient(150deg, ${PB.morado} 0%, ${PB.moradoInk} 100%)`, color: '#fff', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: 999, background: 'rgba(128,227,183,.15)' }}/>
          <div style={{ width: 64, height: 64, borderRadius: 999, background: PB.menta, display: 'grid', placeItems: 'center', margin: '0 auto 14px' }}>
            <Icon name="check" size={34} color={PB.moradoInk}/>
          </div>
          <Eyebrow color={PB.menta}>Pedido confirmado</Eyebrow>
          <h2 style={{ fontFamily: PB.font, fontWeight: 900, fontSize: 26, letterSpacing: '-0.02em', margin: '8px 0 4px', color: '#fff' }}>¡Listo! 🎉</h2>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.75)', margin: '0 0 16px' }}>
            Pedido <span style={{ fontFamily: PB.mono, fontWeight: 700, color: PB.menta }}>{orderNum}</span>
          </div>
          <div style={{ fontFamily: PB.mono, fontWeight: 800, fontSize: 28, letterSpacing: '-0.01em' }}>{fmt(total)}</div>
        </div>

        {/* Instrucciones de recogida / envío */}
        {delivery === 'locker' ? (
          <div style={{ margin: '16px 16px 0', padding: '20px', borderRadius: 22, background: PB.surface, border: `1px solid ${PB.line}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: PB.mentaSoft, display: 'grid', placeItems: 'center' }}>
                <Icon name="bolt" size={22} color={PB.morado}/>
              </div>
              <div>
                <div style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 16, color: PB.ink }}>Recogida en locker</div>
                <div style={{ fontSize: 12, color: PB.ink3 }}>POLEBOX {pickup?.venueName}</div>
              </div>
            </div>

            {/* Código */}
            <div style={{ padding: '16px', borderRadius: 16, background: PB.morado, textAlign: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)', marginBottom: 8 }}>Código de apertura</div>
              <div style={{ fontFamily: PB.mono, fontWeight: 800, fontSize: 44, letterSpacing: '.12em', color: PB.menta }}>{lockerCode}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', marginTop: 6 }}>Locker {pickup?.lockerId} · válido 48 h</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { icon: 'bolt',   text: 'Llega a POLEBOX ' + pickup?.venueName },
                { icon: 'key',    text: 'Introduce el código en el locker ' + pickup?.lockerId },
                { icon: 'check',  text: 'Recoge tu pedido y cierra el locker' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 999, background: PB.surface2, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    <Icon name={s.icon} size={14} color={PB.morado}/>
                  </div>
                  <span style={{ fontSize: 13, color: PB.ink2 }}>{s.text}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 14, padding: '10px 12px', borderRadius: 12, background: PB.warnBg, color: PB.warn, fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="bell" size={14} color={PB.warn}/> El código expira en 48 h. Guárdalo en un lugar seguro.
            </div>
          </div>
        ) : (
          <div style={{ margin: '16px 16px 0', padding: '20px', borderRadius: 22, background: PB.surface, border: `1px solid ${PB.line}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: PB.warnBg, display: 'grid', placeItems: 'center' }}>
                <Icon name="refresh" size={22} color={PB.warn}/>
              </div>
              <div>
                <div style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 16, color: PB.ink }}>Envío a domicilio</div>
                <div style={{ fontSize: 12, color: PB.ink3 }}>Correos Express · 3–5 días hábiles</div>
              </div>
            </div>

            <div style={{ padding: '12px 14px', borderRadius: 14, background: PB.surface2, marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: PB.ink3, marginBottom: 4 }}>Dirección de entrega</div>
              <div style={{ fontFamily: PB.font, fontWeight: 600, fontSize: 13, color: PB.ink }}>{address?.nombre}</div>
              <div style={{ fontSize: 12, color: PB.ink3 }}>{address?.calle}</div>
              <div style={{ fontSize: 12, color: PB.ink3 }}>{address?.cp} {address?.ciudad}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { icon: 'check',   text: 'Pedido recibido y en preparación' },
                { icon: 'refresh', text: 'Envío en 24–48 h laborables' },
                { icon: 'bell',    text: 'Recibirás el nº de seguimiento por email' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 999, background: PB.surface2, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    <Icon name={s.icon} size={14} color={PB.morado}/>
                  </div>
                  <span style={{ fontSize: 13, color: PB.ink2 }}>{s.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Artículos del pedido */}
        <div style={{ margin: '14px 16px 0', padding: '14px 16px', borderRadius: 16, background: PB.surface, border: `1px solid ${PB.line}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: PB.ink3, marginBottom: 10 }}>Artículos</div>
          {items.map(([id, qty]) => {
            const p = STORE_PRODUCTS.find(p => p.id === parseInt(id));
            if (!p) return null;
            return (
              <div key={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderTop: `1px solid ${PB.line}` }}>
                <span style={{ fontSize: 13, color: PB.ink2 }}>{p.name} ×{qty}</span>
                <span style={{ fontFamily: PB.mono, fontWeight: 600, fontSize: 13 }}>{fmt(p.price * qty)}</span>
              </div>
            );
          })}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0 0', borderTop: `1px solid ${PB.line}` }}>
            <span style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 14 }}>Total pagado</span>
            <span style={{ fontFamily: PB.mono, fontWeight: 800, fontSize: 16, color: PB.ink }}>{fmt(total)}</span>
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 16px 26px', background: 'rgba(250,250,247,.95)', backdropFilter: 'blur(12px)', borderTop: `1px solid ${PB.line}` }}>
        <Button onClick={onDone} full variant="secondary" style={{ padding: '16px', fontSize: 15 }}>
          Volver al inicio
        </Button>
      </div>
      <TabBar active="home"/>
    </>
  );
};

window.ScreenStoreConfirm = ScreenStoreConfirm;
