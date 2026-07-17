// POLEBOX — Selector de sede y locker para recogida
// Sedes derivadas del dataset canónico en data/venues.js (window.STORE_VENUES)

const ScreenStorePickup = ({ onBack, onConfirm }) => {
  const [venueId, setVenueId] = React.useState(null);
  const [lockerId, setLockerId] = React.useState(null);
  const venue = STORE_VENUES.find(v => v.id === venueId);

  // Lockers simulados para la sede seleccionada
  const lockers = venue ? Array.from({ length: venue.lockers }, (_, i) => ({
    id: `L${i + 1}`,
    label: `Locker ${i + 1}`,
    size: ['S', 'M', 'M', 'L', 'L'][i] || 'M',
    free: i !== 1, // locker 2 siempre ocupado (demo)
  })) : [];

  return (
    <>
      <StatusBar/>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: lockerId ? 140 : 110 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px 16px' }}>
          <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: 12, border: `1px solid ${PB.line}`, background: PB.surface, display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
            <Icon name="back" size={18}/>
          </button>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: PB.ink3 }}>Paso 1 de 3</div>
            <h3 style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 18, letterSpacing: '-0.01em', margin: '2px 0 0' }}>Elige sede y locker</h3>
          </div>
        </div>

        {/* Progreso */}
        <div style={{ padding: '0 16px 20px', display: 'flex', gap: 6 }}>
          {[1,2,3].map(i => <div key={i} style={{ flex: 1, height: 4, borderRadius: 999, background: i <= 1 ? PB.morado : PB.surface3 }}/>)}
        </div>

        {/* Sedes */}
        <div style={{ padding: '0 20px 4px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: PB.ink3, marginBottom: 10 }}>1 · Selecciona sede</div>
        </div>
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {STORE_VENUES.map(v => {
            const sel = v.id === venueId;
            return (
              <button key={v.id} onClick={() => { setVenueId(v.id); setLockerId(null); }} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px', borderRadius: 16, cursor: 'pointer', textAlign: 'left',
                border: `2px solid ${sel ? PB.morado : PB.line}`,
                background: sel ? 'rgba(72,35,128,.04)' : PB.surface,
                boxShadow: sel ? '0 6px 18px rgba(72,35,128,.1)' : 'none',
                transition: 'all 220ms cubic-bezier(.2,.7,.2,1)',
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: sel ? PB.morado : PB.surface2, display: 'grid', placeItems: 'center', flexShrink: 0, transition: 'background 220ms' }}>
                  <Icon name="bolt" size={18} color={sel ? '#fff' : PB.morado}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 14, color: PB.ink }}>POLEBOX {v.name}</div>
                  <div style={{ fontSize: 11, color: PB.ink3, marginTop: 2 }}>{v.city} · {v.addr}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: PB.success }}>{v.lockers} libres</div>
                  <div style={{ fontSize: 10, color: PB.ink4, marginTop: 2 }}>{v.dist}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Lockers */}
        {venue && (
          <>
            <div style={{ padding: '22px 20px 8px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: PB.ink3, marginBottom: 10 }}>2 · Elige locker en {venue.name}</div>
            </div>
            <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {lockers.map(l => {
                const sel = l.id === lockerId;
                return (
                  <button key={l.id} onClick={() => l.free && setLockerId(l.id)} style={{
                    padding: '14px 8px', borderRadius: 16, cursor: l.free ? 'pointer' : 'not-allowed',
                    border: `2px solid ${sel ? PB.morado : (l.free ? PB.line : PB.surface3)}`,
                    background: sel ? PB.morado : (l.free ? PB.surface : PB.surface2),
                    opacity: l.free ? 1 : .45,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    transition: 'all 220ms',
                  }}>
                    <div style={{ fontSize: 24 }}>🔒</div>
                    <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 12, color: sel ? '#fff' : PB.ink }}>{l.label}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: sel ? 'rgba(255,255,255,.7)' : (l.free ? PB.success : PB.danger) }}>
                      Talla {l.size} · {l.free ? 'Libre' : 'Ocupado'}
                    </div>
                  </button>
                );
              })}
            </div>
            <div style={{ padding: '12px 20px 0', fontSize: 11, color: PB.ink4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="bolt" size={12}/> El locker queda reservado a tu nombre hasta tu próxima visita.
            </div>
          </>
        )}
      </div>

      {lockerId && venue && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 16px 26px', background: PB.surface, boxShadow: '0 -12px 30px rgba(20,19,24,.1)', borderTop: `1px solid ${PB.line}`, borderTopLeftRadius: 28, borderTopRightRadius: 28 }}>
          <Button onClick={() => onConfirm({ venueId: venue.id, venueName: venue.name, venueAddr: venue.addr, lockerId })} full icon="arrow" style={{ padding: '18px', fontSize: 16 }}>
            Reservar {lockerId} en {venue.name}
          </Button>
        </div>
      )}

    </>
  );
};

window.ScreenStorePickup = ScreenStorePickup;
