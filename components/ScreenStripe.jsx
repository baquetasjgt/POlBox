// POLEBOX — Stripe gateway redirect (mock)

const ScreenStripe = ({ booking, onBack, onSuccess }) => {
  const b = booking || { price: 20, methodLabel: 'tarjeta', method: 'card' };
  const [phase, setPhase] = React.useState('loading'); // loading | form | processing | done
  const [num, setNum] = React.useState('4242 4242 4242 4242');
  const [exp, setExp] = React.useState('12 / 28');
  const [cvc, setCvc] = React.useState('123');

  React.useEffect(() => {
    const t = setTimeout(() => setPhase('form'), 700);
    return () => clearTimeout(t);
  }, []);

  // Encadenado por fase: un solo efecto con deps [phase] limpiaría el timer
  // de onSuccess al pasar a 'done' y el pago nunca navegaría a la llave.
  React.useEffect(() => {
    if (phase === 'processing') {
      const t = setTimeout(() => setPhase('done'), 1600);
      return () => clearTimeout(t);
    }
    if (phase === 'done') {
      const t = setTimeout(() => onSuccess && onSuccess(b), 1100);
      return () => clearTimeout(t);
    }
  }, [phase]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F6F9FC' }}>
      {/* Browser-style chrome */}
      <div style={{ padding: '12px 14px 8px', background: '#fff', borderBottom: '1px solid #E3E8EE' }}>
        <StatusBar/>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 4px 6px' }}>
          <button onClick={onBack} style={{ width: 30, height: 30, borderRadius: 8, border: 0, background: '#F0F3F7', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
            <Icon name="back" size={14} color="#3c4257"/>
          </button>
          <div style={{ flex: 1, padding: '7px 12px', borderRadius: 8, background: '#F0F3F7', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'system-ui', fontSize: 12, color: '#3c4257' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#3c4257" strokeWidth="2.5"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
            <span style={{ fontWeight: 600 }}>checkout.stripe.com</span>
            <span style={{ color: '#697386' }}>/c/pay/cs_live_...</span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 18px 26px' }}>
        {/* Stripe header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <svg width="40" height="17" viewBox="0 0 60 25" fill="#635BFF"><path d="M59.5 14.5c0-3.5-1.7-6.3-5-6.3-3.3 0-5.4 2.8-5.4 6.3 0 4.1 2.3 6.2 5.7 6.2 1.7 0 2.9-.4 3.9-.9V17c-1 .5-2.1.8-3.5.8-1.4 0-2.6-.5-2.8-2.2h7c0-.2.1-1 .1-1.1zm-7.1-1.3c0-1.6 1-2.3 1.9-2.3.9 0 1.8.7 1.8 2.3h-3.7zm-9.1-5c-1.4 0-2.3.7-2.8 1.1l-.2-.9h-3.1v16l3.6-.8v-3.9c.5.4 1.3.9 2.5.9 2.6 0 4.9-2.1 4.9-6.4 0-3.9-2.4-6-4.9-6zM41.5 17.5c-.8 0-1.3-.3-1.7-.6v-5.3c.4-.4.9-.7 1.7-.7 1.3 0 2.2 1.5 2.2 3.3 0 1.8-.9 3.3-2.2 3.3zm-9.5-9.7-3.6.8v3l3.6-.8V7.8zm0 1.4h-3.6v11.3h3.6V9.2zM26 10.6 25.7 9.2h-3.1v11.3h3.6v-7.7c.8-1.1 2.3-.9 2.7-.7V9.2c-.5-.2-2.2-.5-2.9 1.4zm-7.6-4.5L14.9 7l-.1 11.5c0 2.1 1.6 3.7 3.7 3.7 1.2 0 2.1-.2 2.5-.5v-3c-.5.2-3 .9-3-1.3v-4.6h3v-3.1h-3l.4-3.6zm-8.8 7c0-.6.5-.8 1.3-.8 1.1 0 2.6.4 3.7 1V9.9c-1.2-.5-2.5-.7-3.7-.7-3 0-5 1.6-5 4.2 0 4.1 5.6 3.4 5.6 5.2 0 .7-.6.9-1.4.9-1.2 0-2.8-.5-4-1.2v3.5c1.4.6 2.8.8 4 .8 3.1 0 5.2-1.5 5.2-4.2 0-4.4-5.7-3.6-5.7-5.3z"/></svg>
          <span style={{ fontFamily: 'system-ui', fontSize: 12, color: '#697386' }}>·</span>
          <span style={{ fontFamily: 'system-ui', fontSize: 12, color: '#697386' }}>POLEBOX</span>
        </div>

        {/* Resumen */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontFamily: 'system-ui', fontSize: 13, color: '#697386' }}>Pagar a POLEBOX</div>
          <div style={{ fontFamily: 'system-ui', fontWeight: 700, fontSize: 32, color: '#1a1f36', marginTop: 2, letterSpacing: '-0.01em' }}>{b.price},00&nbsp;€</div>
          <div style={{ fontFamily: 'system-ui', fontSize: 12, color: '#697386', marginTop: 4 }}>{b.label ?? `BOX ${(b.boxIdx ?? 0) + 1} · ${b.duration ?? 90} min · ${b.dayLabel ?? 'Hoy'}`}</div>
        </div>

        {phase === 'loading' && (
          <div style={{ padding: '40px 0', display: 'grid', placeItems: 'center', color: '#697386', fontFamily: 'system-ui', fontSize: 13 }}>
            <div style={{ width: 28, height: 28, borderRadius: 999, border: '3px solid #E3E8EE', borderTopColor: '#635BFF', animation: 'spin 800ms linear infinite' }}/>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <div style={{ marginTop: 12 }}>Conectando con Stripe…</div>
          </div>
        )}

        {(phase === 'form' || phase === 'processing') && (
          <>
            <Field label="Información de tarjeta">
              <input value={num} onChange={(e)=>setNum(e.target.value)} placeholder="1234 1234 1234 1234"
                style={inputStyle('top')}/>
              <div style={{ display: 'flex' }}>
                <input value={exp} onChange={(e)=>setExp(e.target.value)} placeholder="MM / AA" style={{ ...inputStyle('bl'), flex: 1, borderRight: 0 }}/>
                <input value={cvc} onChange={(e)=>setCvc(e.target.value)} placeholder="CVC" style={{ ...inputStyle('br'), flex: 1 }}/>
              </div>
            </Field>

            <Field label="Nombre del titular">
              <input defaultValue="Laura Gómez" style={inputStyle('all')}/>
            </Field>

            <Field label="País">
              <input defaultValue="España" style={inputStyle('all')}/>
            </Field>

            <button onClick={() => setPhase('processing')} disabled={phase==='processing'} style={{
              marginTop: 18, width: '100%', padding: '14px', borderRadius: 6, border: 0, cursor: 'pointer',
              background: '#635BFF', color: '#fff',
              fontFamily: 'system-ui', fontWeight: 600, fontSize: 15,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              opacity: phase==='processing' ? .8 : 1,
            }}>
              {phase === 'processing' ? (
                <>
                  <div style={{ width: 16, height: 16, borderRadius: 999, border: '2px solid rgba(255,255,255,.4)', borderTopColor: '#fff', animation: 'spin 700ms linear infinite' }}/>
                  Procesando…
                </>
              ) : (
                <>Pagar {b.price},00 €</>
              )}
            </button>

            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'system-ui', fontSize: 11, color: '#697386' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#697386" strokeWidth="2.5"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
              Pagos protegidos con cifrado de extremo a extremo
            </div>
          </>
        )}

        {phase === 'done' && (
          <div style={{ padding: '30px 0', display: 'grid', placeItems: 'center', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 999, background: '#E4F6EC', display: 'grid', placeItems: 'center' }}>
              <Icon name="check" size={32} color="#238F5B"/>
            </div>
            <div style={{ marginTop: 14, fontFamily: 'system-ui', fontSize: 18, fontWeight: 700, color: '#1a1f36' }}>Pago confirmado</div>
            <div style={{ marginTop: 4, fontFamily: 'system-ui', fontSize: 13, color: '#697386' }}>Generando tu llave digital…</div>
          </div>
        )}
      </div>
    </div>
  );
};

const inputStyle = (pos) => {
  const r = { all: 6, top: '6px 6px 0 0', bl: '0 0 0 6px', br: '0 0 6px 0' }[pos] ?? 6;
  return {
    width: '100%', boxSizing: 'border-box',
    padding: '11px 12px', border: '1px solid #E3E8EE',
    borderRadius: typeof r === 'number' ? r : undefined,
    borderTopLeftRadius:    pos === 'top' || pos === 'all' ? 6 : (pos === 'bl' ? 0 : pos === 'br' ? 0 : 0),
    borderTopRightRadius:   pos === 'top' || pos === 'all' ? 6 : 0,
    borderBottomLeftRadius: pos === 'bl'  || pos === 'all' ? 6 : 0,
    borderBottomRightRadius:pos === 'br'  || pos === 'all' ? 6 : 0,
    borderTop: pos === 'bl' || pos === 'br' ? 0 : '1px solid #E3E8EE',
    fontFamily: 'system-ui', fontSize: 14, color: '#1a1f36',
    background: '#fff', outline: 'none',
  };
};
const Field = ({ label, children }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ fontFamily: 'system-ui', fontSize: 12, fontWeight: 500, color: '#3c4257', marginBottom: 6 }}>{label}</div>
    {children}
  </div>
);

window.ScreenStripe = ScreenStripe;
