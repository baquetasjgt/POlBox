// POLEBOX — Panel de operadora (el otro lado del negocio).
// Vista web fuera del marco de teléfono: ocupación por box/franja, revenue,
// mix bono vs suelta. Datos simulados deterministas + actividad real de la demo.

const ScreenOperadora = ({ bookings, orders, onExit }) => {
  const [venueId, setVenueId] = React.useState('mad-salamanca');
  const venue = getVenue(venueId) || ALL_VENUES[0];

  // Generador determinista (misma semilla → misma demo)
  const rand = (seed) => {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    return () => {
      h = (h * 1103515245 + 12345) >>> 0;
      return (h >>> 8) / 16777216;
    };
  };

  const HOURS = Array.from({ length: 13 }, (_, i) => 10 + i); // 10:00–22:00
  const DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  // Ocupación semanal simulada por franja (patrón: valle mañanas, pico 18-21)
  const heat = DAYS.map((d, di) => HOURS.map(h => {
    const r = rand(`${venueId}-${di}-${h}`)();
    const peak = h >= 18 && h <= 21 ? .55 : h >= 14 && h < 18 ? .3 : .12;
    const weekend = di >= 5 ? .1 : 0;
    return Math.min(1, peak + weekend + r * .35);
  }));

  const occAvg = Math.round(heat.flat().reduce((a, b) => a + b, 0) / heat.flat().length * 100);
  const occValle = Math.round(heat.map(row => row.slice(0, 4)).flat().reduce((a, b) => a + b, 0) / (7 * 4) * 100);
  const occPico = Math.round(heat.map(row => row.slice(8, 12)).flat().reduce((a, b) => a + b, 0) / (7 * 4) * 100);

  const weekRevenue = Math.round(heat.flat().reduce((a, b) => a + b, 0) * venue.boxes * 15.5);
  const bonoShare = 62;

  const realUpcoming = (bookings || []).filter(b => b.state === 'upcoming' && b.venueId === venueId);
  const storeRevenue = (orders || []).reduce((s, o) => s + (o.total || 0), 0);

  const heatColor = (v) => {
    if (v < .2) return '#F3F2EE';
    if (v < .4) return '#D6C9EF';
    if (v < .6) return '#A683DB';
    if (v < .8) return '#6a3fb8';
    return '#482380';
  };

  const Stat = ({ k, v, sub, tone }) => (
    <div style={{ flex: 1, minWidth: 150, padding: '16px 18px', borderRadius: 16, background: '#fff', border: `1px solid ${PB.line}` }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: PB.ink3 }}>{k}</div>
      <div style={{ fontFamily: PB.mono, fontWeight: 800, fontSize: 28, color: tone || PB.ink, marginTop: 6 }}>{v}</div>
      {sub && <div style={{ fontSize: 11, color: PB.ink3, marginTop: 4 }}>{sub}</div>}
    </div>
  );

  return (
    <div style={{ width: 'min(960px, 96vw)', fontFamily: PB.font }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <Wordmark height={20}/>
        <span style={{ padding: '4px 10px', borderRadius: 999, background: PB.morado, color: '#fff', fontSize: 10, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase' }}>Panel operadora</span>
        <div style={{ flex: 1 }}/>
        <select value={venueId} onChange={e => setVenueId(e.target.value)} style={{ padding: '9px 12px', borderRadius: 10, border: `1px solid ${PB.lineStrong}`, background: '#fff', fontFamily: PB.font, fontWeight: 700, fontSize: 13, color: PB.ink }}>
          {ALL_VENUES.map(v => <option key={v.id} value={v.id}>{v.fullName} · {v.boxes} boxes</option>)}
        </select>
        <button onClick={onExit} style={{ padding: '9px 14px', borderRadius: 10, border: `1px solid ${PB.lineStrong}`, background: '#fff', fontFamily: PB.font, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>← Volver a la app</button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <Stat k="Ocupación semanal" v={`${occAvg}%`} sub={`Pico (18–22h): ${occPico}% · Valle (10–14h): ${occValle}%`}/>
        <Stat k="Revenue semana (boxes)" v={PBU.fmtEUR(weekRevenue)} sub={`${venue.boxes} boxes · tarifa media 15,50 €`}/>
        <Stat k="Mix de pago" v={`${bonoShare}% bono`} sub={`${100 - bonoShare}% reserva suelta — el bono fideliza`} tone={PB.morado}/>
        <Stat k="Tienda (demo real)" v={PBU.fmtEUR(storeRevenue)} sub={`${(orders || []).length} pedidos en esta sesión de demo`} tone={PB.success}/>
      </div>

      {/* Heatmap */}
      <div style={{ padding: '18px 20px', borderRadius: 18, background: '#fff', border: `1px solid ${PB.line}`, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ fontWeight: 800, fontSize: 16 }}>Mapa de ocupación · {venue.fullName}</div>
          <div style={{ fontSize: 11, color: PB.ink3 }}>
            La oportunidad está en el valle: cada franja vacía es coste hundido. El Bono Mañanas (−40%) y el precio off-peak atacan exactamente esas celdas.
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'separate', borderSpacing: 3, width: '100%' }}>
            <thead>
              <tr>
                <th style={{ fontSize: 10, color: PB.ink3, fontWeight: 700, textAlign: 'left', padding: '0 6px' }}></th>
                {HOURS.map(h => <th key={h} style={{ fontSize: 10, color: PB.ink3, fontWeight: 700, padding: 2 }}>{h}h</th>)}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((d, di) => (
                <tr key={d}>
                  <td style={{ fontSize: 11, fontWeight: 800, color: PB.ink2, padding: '0 6px' }}>{d}</td>
                  {HOURS.map((h, hi) => {
                    const v = heat[di][hi];
                    return (
                      <td key={h} title={`${d} ${h}:00 · ${Math.round(v * 100)}% ocupado`} style={{
                        width: 40, height: 26, borderRadius: 6, background: heatColor(v),
                        textAlign: 'center', fontSize: 9, fontWeight: 700,
                        color: v > .55 ? '#fff' : PB.ink3, cursor: 'default',
                      }}>{Math.round(v * 100)}</td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, fontSize: 10, color: PB.ink3 }}>
          Libre {[.1, .3, .5, .7, .9].map(v => <span key={v} style={{ width: 22, height: 12, borderRadius: 4, background: heatColor(v), display: 'inline-block' }}/>)} Lleno
          <span style={{ marginLeft: 12 }}>· El algoritmo anti-huecos evitó ~{Math.round(weekRevenue * 0.08)} € en franjas muertas esta semana (est.)</span>
        </div>
      </div>

      {/* Reservas reales de la demo */}
      <div style={{ padding: '18px 20px', borderRadius: 18, background: '#fff', border: `1px solid ${PB.line}` }}>
        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 10 }}>Reservas activas de la demo en {venue.name}</div>
        {realUpcoming.length === 0 ? (
          <div style={{ fontSize: 13, color: PB.ink3 }}>No hay reservas en esta sede en la sesión de demo actual. Haz una reserva en la app y aparecerá aquí.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {realUpcoming.map(bk => (
              <div key={bk.id} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '10px 12px', borderRadius: 12, background: PB.bg, border: `1px solid ${PB.line}`, fontSize: 13 }}>
                <strong style={{ fontFamily: PB.mono }}>{bk.dayLabel}</strong>
                <span style={{ fontFamily: PB.mono }}>{bk.startStr}–{bk.endStr}h</span>
                <span>{bk.boxLabel}</span>
                <span style={{ marginLeft: 'auto', padding: '3px 10px', borderRadius: 999, background: bk.method === 'bono' ? PB.infoBg : PB.successBg, color: bk.method === 'bono' ? PB.morado : PB.success, fontSize: 11, fontWeight: 700 }}>
                  {bk.method === 'bono' ? 'Bono' : PBU.fmtEUR(bk.price)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

window.ScreenOperadora = ScreenOperadora;
