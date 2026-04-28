// POLEBOX — Pago de la tienda

const ScreenStorePayment = ({ onBack, total, onSuccess }) => {
  const [method, setMethod] = React.useState('card');
  const [phase, setPhase]   = React.useState('form'); // form | processing | done
  const fmt = (n) => n.toFixed(2).replace('.', ',') + ' €';

  const methods = [
    { id: 'apple',  label: 'Apple Pay',  sub: 'Touch ID / Face ID' },
    { id: 'card',   label: 'Tarjeta',    sub: 'Visa · Mastercard · Amex' },
    { id: 'gpay',   label: 'Google Pay', sub: 'Pago rápido' },
    { id: 'bizum',  label: 'Bizum',      sub: 'Desde tu móvil' },
  ];

  React.useEffect(() => {
    if (phase === 'processing') {
      const t1 = setTimeout(() => setPhase('done'), 1400);
      const t2 = setTimeout(() => onSuccess && onSuccess(), 2600);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [phase]);

  return (
    <>
      <StatusBar/>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 180 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px 16px' }}>
          <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: 12, border: `1px solid ${PB.line}`, background: PB.surface, display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
            <Icon name="back" size={18}/>
          </button>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: PB.ink3 }}>Paso 3 de 3</div>
            <h3 style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 18, letterSpacing: '-0.01em', margin: '2px 0 0' }}>Método de pago</h3>
          </div>
        </div>

        {/* Progreso */}
        <div style={{ padding: '0 16px 20px', display: 'flex', gap: 6 }}>
          {[1,2,3].map(i => <div key={i} style={{ flex: 1, height: 4, borderRadius: 999, background: PB.morado }}/>)}
        </div>

        {phase === 'done' ? (
          <div style={{ padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16 }}>
            <div style={{ width: 72, height: 72, borderRadius: 999, background: PB.successBg, display: 'grid', placeItems: 'center' }}>
              <Icon name="check" size={36} color={PB.success}/>
            </div>
            <div style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 22, color: PB.ink }}>Pago confirmado</div>
            <div style={{ fontSize: 13, color: PB.ink3 }}>Preparando tu pedido…</div>
          </div>
        ) : (
          <>
            {/* Métodos */}
            <div style={{ margin: '0 16px', borderRadius: 18, background: PB.surface, border: `1px solid ${PB.line}`, overflow: 'hidden', padding: 6 }}>
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
                      <Icon name="card" size={18} color={PB.ink2}/>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 14, color: PB.ink }}>{m.label}</div>
                      <div style={{ fontSize: 11, color: PB.ink3 }}>{m.sub}</div>
                    </div>
                    <div style={{ width: 22, height: 22, borderRadius: 999, border: `2px solid ${on ? PB.morado : PB.lineStrong}`, background: on ? PB.morado : 'transparent', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                      {on && <Icon name="check" size={12} color="#fff"/>}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Tarjeta guardada */}
            {method === 'card' && (
              <div style={{ margin: '14px 16px 0', padding: '14px 16px', borderRadius: 16, background: PB.surface, border: `1px solid ${PB.line}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 30, borderRadius: 6, background: PB.morado, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="card" size={16} color="#fff"/>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 13, color: PB.ink }}>Mastercard ····&nbsp;4242</div>
                  <div style={{ fontSize: 11, color: PB.ink3 }}>Caduca 12/28</div>
                </div>
                <span style={{ padding: '3px 8px', borderRadius: 999, background: PB.successBg, color: PB.success, fontSize: 10, fontWeight: 800 }}>Predeterminada</span>
              </div>
            )}

            <div style={{ margin: '14px 20px 0', display: 'flex', alignItems: 'center', gap: 8, color: PB.ink3, fontSize: 11 }}>
              <Icon name="shield" size={13}/> Pago seguro procesado por <strong style={{ color: PB.ink2 }}>Stripe</strong>
            </div>
          </>
        )}
      </div>

      {phase !== 'done' && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 16px 26px', background: PB.surface, boxShadow: '0 -12px 30px rgba(20,19,24,.1)', borderTop: `1px solid ${PB.line}`, borderTopLeftRadius: 28, borderTopRightRadius: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: PB.ink3 }}>Total</span>
            <span style={{ fontFamily: PB.mono, fontWeight: 800, fontSize: 22, color: PB.ink }}>{fmt(total || 0)}</span>
          </div>
          <button onClick={() => setPhase('processing')} disabled={phase === 'processing'} style={{
            width: '100%', padding: '18px', borderRadius: 16, border: 0, cursor: 'pointer',
            background: PB.morado, color: '#fff', fontFamily: PB.font, fontWeight: 700, fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            boxShadow: '0 8px 22px rgba(72,35,128,.35)', opacity: phase === 'processing' ? .8 : 1,
          }}>
            {phase === 'processing' ? (
              <><div style={{ width: 18, height: 18, borderRadius: 999, border: '2.5px solid rgba(255,255,255,.4)', borderTopColor: '#fff', animation: 'spin 700ms linear infinite' }}/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>Procesando…</>
            ) : (
              <><Icon name="card" size={18} color="#fff"/> Pagar {fmt(total || 0)}</>
            )}
          </button>
        </div>
      )}

    </>
  );
};

window.ScreenStorePayment = ScreenStorePayment;
