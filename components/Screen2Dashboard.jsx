// POLEBOX — Screen 2: Dashboard (logged-in, has a reservation today)

const Screen2Dashboard = ({ onNewReservation, onOpenKey }) => {
  const [seconds, setSeconds] = React.useState(2 * 3600 + 15 * 60 + 30);
  React.useEffect(() => {
    const t = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const hh = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <>
      <StatusBar/>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 110 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px 12px' }}>
          <div>
            <div style={{ fontSize: 13, color: PB.ink3 }}>Hola,</div>
            <div style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 22, letterSpacing: '-0.01em' }}>Laura 👋</div>
          </div>
          <div style={{ width: 44, height: 44, borderRadius: 999, background: `linear-gradient(135deg, ${PB.menta}, ${PB.mentaDeep})`, border: `2px solid ${PB.morado}`, display: 'grid', placeItems: 'center', color: PB.moradoInk, fontFamily: PB.font, fontWeight: 800, fontSize: 16 }}>
            LG
          </div>
        </div>

        {/* Hero: today's session */}
        <div style={{ margin: '4px 16px 16px', borderRadius: 24, padding: 20, position: 'relative',
          background: `linear-gradient(160deg, #fff 0%, #fff 60%, ${PB.mentaSoft} 140%)`,
          border: `1px solid ${PB.line}`, boxShadow: '0 18px 40px rgba(72,35,128,.14), 0 2px 6px rgba(20,19,24,.04)',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: PB.morado }}/>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: 999, background: 'rgba(128,227,183,.25)', filter: 'blur(20px)' }}/>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, background: 'rgba(72,35,128,.1)', color: PB.morado }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: PB.morado }}/>
            <Eyebrow color={PB.morado}>Hoy</Eyebrow>
          </div>
          <h3 style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 26, letterSpacing: '-0.015em', margin: '10px 0 2px' }}>Sesión en BOX 1</h3>
          <div style={{ color: PB.ink3, fontSize: 14 }}>18:00h – 19:00h · Industrial</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: PB.ink3 }}>Comienza en</span>
            <span style={{ fontFamily: PB.mono, fontWeight: 700, fontSize: 32, color: PB.morado, letterSpacing: '-0.02em' }}>{hh}:{mm}:{ss}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16, position: 'relative' }}>
            <Button variant="secondary" icon="doc" style={{ padding: '12px 14px', fontSize: 13, flex: 1 }}>Detalles y normativas</Button>
            <Button onClick={onOpenKey} variant="mint" icon="key" style={{ padding: '12px 14px', fontSize: 13, flex: 1 }}>Abrir llave</Button>
          </div>
        </div>

        {/* Full-width CTA */}
        <div style={{ padding: '0 16px 20px' }}>
          <Button onClick={onNewReservation} full icon="plus" style={{ padding: '18px', fontSize: 16 }}>Nueva reserva</Button>
        </div>

        {/* Quick-rebook */}
        <div style={{ padding: '0 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <h3 style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 18, letterSpacing: '-0.01em', margin: 0 }}>Vuelve a tus favoritos</h3>
          <Eyebrow>Rápido</Eyebrow>
        </div>
        <div style={{ padding: '10px 20px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { n: 'BOX 2 — Industrial', when: 'Última vez: Jueves' },
            { n: 'BOX 1 — Neón',       when: 'Última vez: Lunes' },
          ].map(r => (
            <div key={r.n} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: PB.surface, border: `1px solid ${PB.line}`, borderRadius: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: PB.surface2, display: 'grid', placeItems: 'center', color: PB.morado }}>
                <Icon name="calendar" size={18}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 14 }}>{r.n}</div>
                <div style={{ fontSize: 12, color: PB.ink3 }}>{r.when}</div>
              </div>
              <button style={{ width: 40, height: 40, borderRadius: 999, border: 0, background: PB.morado, color: '#fff', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
                <Icon name="refresh" size={18} color="#fff"/>
              </button>
            </div>
          ))}
        </div>

        {/* Marketplace banner */}
        <div style={{ margin: '20px 16px 8px', padding: 16, borderRadius: 18, background: `linear-gradient(100deg, ${PB.moradoInk} 0%, ${PB.morado} 70%, #5a2ea0 100%)`, color: '#fff', display: 'flex', alignItems: 'center', gap: 14, overflow: 'hidden', position: 'relative' }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(128,227,183,.2)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <Icon name="sparkle" size={26} color={PB.menta}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 15 }}>¿Sin grip para hoy?</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.75)', marginTop: 2 }}>Compra magnesio y recógelo en el pasillo.</div>
          </div>
          <button style={{ background: PB.menta, color: PB.moradoInk, border: 0, borderRadius: 999, padding: '8px 14px', fontFamily: PB.font, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>Tienda</button>
        </div>
      </div>
      <TabBar active="home"/>
    </>
  );
};

window.Screen2Dashboard = Screen2Dashboard;
