// POLEBOX — Selector de sede (geolocalización + ciudad + favoritas)

const ALL_VENUES = [
  { id: 'mad-salamanca', city: 'Madrid',    name: 'Madrid · Salamanca', address: 'C/ Jorge Juan, 24',     boxes: 2, hours: '7:00–23:00', dist: 0.4 },
  { id: 'mad-malasana',  city: 'Madrid',    name: 'Madrid · Malasaña',  address: 'C/ del Pez, 18',        boxes: 3, hours: '8:00–22:00', dist: 1.2 },
  { id: 'mad-retiro',    city: 'Madrid',    name: 'Madrid · Retiro',    address: 'C/ Alcalá, 155',        boxes: 2, hours: '7:00–22:00', dist: 3.1 },
  { id: 'bcn-gracia',    city: 'Barcelona', name: 'Barcelona · Gràcia', address: 'C/ Verdi, 52',          boxes: 2, hours: '7:00–22:00', dist: 382 },
  { id: 'bcn-eixample',  city: 'Barcelona', name: 'Barcelona · Eixample', address: 'C/ Mallorca, 215',    boxes: 3, hours: '8:00–23:00', dist: 383 },
  { id: 'vlc-ruzafa',    city: 'Valencia',  name: 'Valencia · Ruzafa',  address: 'C/ Cádiz, 30',          boxes: 2, hours: '7:00–22:00', dist: 351 },
];
const CITIES = ['Madrid', 'Barcelona', 'Valencia'];

const Heart = ({ filled }) => (
  <svg width="20" height="20" viewBox="0 0 24 24"
    fill={filled ? '#E57373' : 'none'}
    stroke={filled ? '#E57373' : '#A19DAB'}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const ScreenSelectSede = ({ onBack, onSelect, favs = [], onToggleFav }) => {
  const [tab, setTab]           = React.useState('cerca');
  const [geoPhase, setGeoPhase] = React.useState('loading'); // loading | done
  const [city, setCity]         = React.useState('Madrid');

  React.useEffect(() => {
    if (tab === 'cerca') {
      setGeoPhase('loading');
      const t = setTimeout(() => setGeoPhase('done'), 1600);
      return () => clearTimeout(t);
    }
  }, [tab]);

  const nearby    = ALL_VENUES.filter(v => v.dist < 2).sort((a, b) => a.dist - b.dist).slice(0, 2);
  const cityList  = ALL_VENUES.filter(v => v.city === city);
  const favList   = ALL_VENUES.filter(v => favs.includes(v.id));

  const VenueCard = ({ v, showDist }) => {
    const isFav = favs.includes(v.id);
    return (
      <div style={{ background: PB.surface, border: `1px solid ${PB.line}`, borderRadius: 18, overflow: 'hidden', marginBottom: 10 }}>
        <div style={{ height: 3, background: `linear-gradient(90deg, ${PB.morado}, ${PB.mentaDeep})` }}/>
        <div style={{ padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 16, color: PB.ink, letterSpacing: '-.005em' }}>{v.name}</div>
              <div style={{ fontSize: 12, color: PB.ink3, marginTop: 2 }}>{v.address}</div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onToggleFav && onToggleFav(v.id); }}
              style={{ background: 'none', border: 0, padding: '4px', cursor: 'pointer', flexShrink: 0, marginTop: -2 }}>
              <Heart filled={isFav}/>
            </button>
          </div>

          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            <span style={{ padding: '3px 9px', borderRadius: 999, background: PB.surface2, fontSize: 11, fontWeight: 600, color: PB.ink2 }}>
              {v.boxes} boxes
            </span>
            <span style={{ padding: '3px 9px', borderRadius: 999, background: PB.surface2, fontSize: 11, fontWeight: 600, color: PB.ink2 }}>
              {v.hours}
            </span>
            {showDist && (
              <span style={{ padding: '3px 9px', borderRadius: 999, background: PB.mentaSoft, fontSize: 11, fontWeight: 700, color: PB.morado }}>
                📍 {v.dist} km
              </span>
            )}
            {isFav && (
              <span style={{ padding: '3px 9px', borderRadius: 999, background: '#FFF0F0', fontSize: 11, fontWeight: 700, color: '#E57373' }}>
                ♡ Favorita
              </span>
            )}
          </div>

          <button onClick={() => onSelect(v)} style={{
            marginTop: 12, width: '100%', padding: '13px', borderRadius: 12, border: 0,
            background: PB.morado, color: '#fff',
            fontFamily: PB.font, fontWeight: 700, fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 4px 14px rgba(72,35,128,.28)',
          }}>
            Reservar aquí <Icon name="arrow" size={16} color="#fff"/>
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`@keyframes pb-sede-spin { to { transform: rotate(360deg); } }`}</style>
      <StatusBar/>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 30 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 16px', position: 'relative' }}>
          <button onClick={onBack} style={{ position: 'absolute', left: 16, width: 40, height: 40, borderRadius: 12, border: `1px solid ${PB.line}`, background: PB.surface, display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
            <Icon name="back" size={18}/>
          </button>
          <h3 style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 18, letterSpacing: '-0.01em', margin: 0 }}>Elige tu sede</h3>
        </div>

        {/* Favoritas (si hay) */}
        {favList.length > 0 && (
          <div style={{ margin: '4px 16px 16px', padding: '14px 16px', borderRadius: 18, background: PB.surface, border: `1px solid ${PB.line}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#E57373', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Heart filled/> Mis favoritas
            </div>
            {favList.map(v => (
              <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: `1px solid ${PB.line}` }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 14, color: PB.ink }}>{v.name}</div>
                  <div style={{ fontSize: 11, color: PB.ink3 }}>{v.address}</div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleFav && onToggleFav(v.id); }}
                  style={{ background: 'none', border: 0, padding: 4, cursor: 'pointer', flexShrink: 0 }}>
                  <Heart filled/>
                </button>
                <button onClick={() => onSelect(v)} style={{
                  padding: '8px 14px', borderRadius: 10, border: 0,
                  background: PB.morado, color: '#fff',
                  fontFamily: PB.font, fontWeight: 700, fontSize: 12, cursor: 'pointer',
                  flexShrink: 0, boxShadow: '0 3px 10px rgba(72,35,128,.25)',
                }}>Reservar →</button>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ display: 'flex', gap: 6, padding: 4, background: PB.surface2, borderRadius: 14 }}>
            {[{ id: 'cerca', label: '📍  Cerca de ti' }, { id: 'ciudad', label: '🏙  Por ciudad' }].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                flex: 1, padding: '10px 8px', borderRadius: 10, border: 0, cursor: 'pointer',
                background: tab === t.id ? PB.surface : 'transparent',
                boxShadow: tab === t.id ? '0 1px 3px rgba(20,19,24,.08)' : 'none',
                color: tab === t.id ? PB.ink : PB.ink3,
                fontFamily: PB.font, fontWeight: 700, fontSize: 13,
              }}>{t.label}</button>
            ))}
          </div>
        </div>

        {/* ── Cerca de ti ── */}
        {tab === 'cerca' && (
          <div style={{ padding: '0 16px' }}>
            {geoPhase === 'loading' ? (
              <div style={{ padding: '48px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: 999, border: `3px solid ${PB.line}`, borderTopColor: PB.morado, animation: 'pb-sede-spin 800ms linear infinite' }}/>
                <div style={{ fontFamily: PB.font, fontWeight: 600, fontSize: 14, color: PB.ink3 }}>Determinando tu ubicación…</div>
                <div style={{ fontSize: 12, color: PB.ink4 }}>Usando GPS del dispositivo</div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, padding: '8px 12px', borderRadius: 12, background: PB.mentaSoft, border: `1px solid ${PB.mentaDeep}` }}>
                  <Icon name="check" size={14} color={PB.success}/>
                  <span style={{ fontSize: 12, color: PB.moradoInk, fontWeight: 600 }}>Ubicación detectada · Madrid</span>
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: PB.ink3, marginBottom: 12 }}>
                  2 sedes más cercanas
                </div>
                {nearby.map(v => <VenueCard key={v.id} v={v} showDist/>)}
              </>
            )}
          </div>
        )}

        {/* ── Por ciudad ── */}
        {tab === 'ciudad' && (
          <div style={{ padding: '0 16px' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              {CITIES.map(c => (
                <button key={c} onClick={() => setCity(c)} style={{
                  padding: '8px 18px', borderRadius: 999, cursor: 'pointer',
                  border: `1.5px solid ${city === c ? PB.morado : PB.line}`,
                  background: city === c ? PB.morado : PB.surface,
                  color: city === c ? '#fff' : PB.ink,
                  fontFamily: PB.font, fontWeight: 700, fontSize: 13,
                  boxShadow: city === c ? '0 4px 12px rgba(72,35,128,.25)' : 'none',
                }}>{c}</button>
              ))}
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: PB.ink3, marginBottom: 12 }}>
              {cityList.length} {cityList.length === 1 ? 'sede' : 'sedes'} en {city}
            </div>
            {cityList.map(v => <VenueCard key={v.id} v={v}/>)}
          </div>
        )}
      </div>
    </>
  );
};

window.ScreenSelectSede = ScreenSelectSede;
