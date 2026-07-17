// POLEBOX — Selector de sede: mapa + lista + detalle

// Dataset canónico de sedes en data/venues.js
// (window.ALL_VENUES, window.CITIES, window.CITY_CFG)

// ── Corazón SVG ───────────────────────────────────────────────────────────────
const Heart = ({ filled }) => (
  <svg width="20" height="20" viewBox="0 0 24 24"
    fill={filled ? '#E57373' : 'none'}
    stroke={filled ? '#E57373' : '#A19DAB'}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

// ── Mapa con pins ─────────────────────────────────────────────────────────────
const MapView = ({ city, venues, activeId, onPin }) => {
  const cfg = CITY_CFG[city] || CITY_CFG.Madrid;
  const px = (lon) => ((lon - cfg.west) / cfg.dLon * 100).toFixed(1);
  const py = (lat) => ((cfg.north - lat) / cfg.dLat * 100).toFixed(1);

  return (
    <div style={{ position: 'relative', height: 210, margin: '0 16px 4px',
      borderRadius: 16, overflow: 'hidden', border: `1px solid ${PB.line}`,
      boxShadow: '0 4px 16px rgba(20,19,24,.08)' }}>

      {/* OSM iframe — pointer-events none so pins are clickable */}
      <iframe
        key={city}
        src={cfg.osm}
        title={`Mapa ${city}`}
        loading="lazy"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
          border: 'none', pointerEvents: 'none' }}
      />

      {/* Pins overlay */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {venues.map(v => {
          const x = px(v.lon);
          const y = py(v.lat);
          const active = v.id === activeId;
          return (
            <button key={v.id} onClick={() => onPin(v)} style={{
              position: 'absolute',
              left: `${x}%`, top: `${y}%`,
              transform: 'translate(-50%, -100%)',
              pointerEvents: 'all',
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              zIndex: active ? 10 : 5,
            }}>
              <div style={{
                padding: '4px 9px', borderRadius: 999,
                background: active ? PB.menta : PB.morado,
                color: active ? PB.moradoInk : '#fff',
                fontFamily: PB.font, fontWeight: 800, fontSize: 10,
                boxShadow: active
                  ? `0 4px 14px rgba(128,227,183,.55), 0 2px 6px rgba(0,0,0,.25)`
                  : '0 2px 8px rgba(0,0,0,.35)',
                whiteSpace: 'nowrap',
                border: active ? `1.5px solid ${PB.morado}` : '1.5px solid transparent',
                transition: 'all 200ms',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <span style={{ fontSize: 9 }}>📍</span> {v.name}
              </div>
              {/* Pin tail */}
              <div style={{
                width: 0, height: 0,
                borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
                borderTop: `7px solid ${active ? PB.menta : PB.morado}`,
                margin: '0 auto',
              }}/>
            </button>
          );
        })}
        {/* User position dot */}
        <div style={{
          position: 'absolute', left: '50%', top: '58%',
          transform: 'translate(-50%,-50%)',
          width: 14, height: 14, borderRadius: 999,
          background: '#1976D2', border: '3px solid #fff',
          boxShadow: '0 0 0 5px rgba(25,118,210,.25)',
          pointerEvents: 'none',
        }}/>
      </div>

      {/* Attribution badge */}
      <div style={{
        position: 'absolute', bottom: 6, right: 8,
        fontSize: 9, color: 'rgba(0,0,0,.4)', fontWeight: 500,
        background: 'rgba(255,255,255,.7)', padding: '2px 6px', borderRadius: 4,
        pointerEvents: 'none',
      }}>© OpenStreetMap</div>
    </div>
  );
};

// ── Detalle de sede ───────────────────────────────────────────────────────────
const VenueDetail = ({ venue: v, onBack, onBook, isFav, onToggleFav }) => {
  const [photoIdx, setPhotoIdx] = React.useState(0);

  const Photo = ({ g }) => (
    <div style={{
      width: '100%', height: '100%',
      background: `linear-gradient(150deg, ${g.hue} 0%, ${PB.moradoInk} 100%)`,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: '22%', left: '42%', width: 4, height: '60%',
        background: 'rgba(255,255,255,.38)', borderRadius: 2,
        boxShadow: `0 0 28px ${g.accent}` }}/>
      <div style={{ position: 'absolute', top: '12%', right: '14%', width: 64, height: 64,
        borderRadius: 999, background: g.accent, opacity: .28, filter: 'blur(18px)' }}/>
      <div style={{ position: 'absolute', inset: 0,
        background: 'radial-gradient(120% 80% at 30% 90%, transparent 40%, rgba(0,0,0,.45) 100%)' }}/>
      <div style={{ position: 'absolute', bottom: 10, left: 12, padding: '4px 10px',
        borderRadius: 999, background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(8px)',
        color: '#fff', fontFamily: PB.font, fontSize: 10, fontWeight: 800, letterSpacing: '.1em' }}>
        {g.label}
      </div>
    </div>
  );

  return (
    <>
      <StatusBar/>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 120 }}>

        {/* Galería */}
        <div style={{ position: 'relative', height: 270, overflow: 'hidden' }}>
          <Photo g={v.gallery[photoIdx]}/>

          {/* Controles: atrás + favorita */}
          <div style={{ position: 'absolute', top: 12, left: 12, right: 12,
            display: 'flex', justifyContent: 'space-between', zIndex: 5 }}>
            <button onClick={onBack} style={{
              width: 40, height: 40, borderRadius: 999, border: 0,
              background: 'rgba(255,255,255,.92)', display: 'grid',
              placeItems: 'center', cursor: 'pointer', backdropFilter: 'blur(8px)',
            }}>
              <Icon name="back" size={18}/>
            </button>
            <button onClick={() => onToggleFav && onToggleFav(v.id)} style={{
              width: 40, height: 40, borderRadius: 999, border: 0,
              background: 'rgba(255,255,255,.92)', display: 'grid',
              placeItems: 'center', cursor: 'pointer', backdropFilter: 'blur(8px)',
            }}>
              <Heart filled={isFav}/>
            </button>
          </div>

          {/* Título superpuesto */}
          <div style={{ position: 'absolute', bottom: 50, left: 18, right: 18, color: '#fff', zIndex: 4 }}>
            <Eyebrow color={PB.menta}>{v.city}</Eyebrow>
            <div style={{ fontFamily: PB.font, fontWeight: 900, fontSize: 28,
              letterSpacing: '-.02em', lineHeight: 1, marginTop: 4 }}>
              POLEBOX {v.name}
            </div>
            <div style={{ fontSize: 12, opacity: .85, marginTop: 5 }}>
              {v.addr} · {v.zip}
            </div>
          </div>

          {/* Miniaturas */}
          <div style={{ position: 'absolute', bottom: 10, left: 12, right: 12,
            display: 'flex', gap: 6, zIndex: 5 }}>
            {v.gallery.map((g, i) => (
              <button key={i} onClick={() => setPhotoIdx(i)} style={{
                flex: 1, height: 32, borderRadius: 8, padding: 0, overflow: 'hidden',
                cursor: 'pointer', background: 'transparent',
                border: i === photoIdx ? `2px solid ${PB.menta}` : '2px solid rgba(255,255,255,.3)',
              }}>
                <Photo g={g}/>
              </button>
            ))}
          </div>
        </div>

        {/* Chips: horario, rating, boxes */}
        <div style={{ padding: '12px 16px 4px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ padding: '5px 12px', borderRadius: 999, background: PB.successBg,
            color: PB.success, fontSize: 11, fontWeight: 700 }}>● {v.hours}</span>
          <span style={{ padding: '5px 12px', borderRadius: 999, background: PB.surface2,
            color: PB.ink2, fontSize: 11, fontWeight: 700 }}>★ {v.rating} · {v.reviews} reseñas</span>
          <span style={{ padding: '5px 12px', borderRadius: 999, background: PB.surface2,
            color: PB.ink2, fontSize: 11, fontWeight: 700 }}>{v.boxes} boxes privados</span>
        </div>

        {/* Cómo llegar */}
        <div style={{ margin: '12px 16px', padding: '14px 16px',
          background: PB.surface, border: `1px solid ${PB.line}`, borderRadius: 16 }}>
          <div style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 13,
            color: PB.ink, marginBottom: 10, letterSpacing: '-.005em' }}>Cómo llegar</div>
          {[
            { icon: 'home',     text: `${v.addr}, ${v.zip}` },
            { icon: 'calendar', text: v.metro },
            { icon: 'sparkle',  text: v.parking },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10,
              paddingTop: i === 0 ? 0 : 8, marginTop: i === 0 ? 0 : 8,
              borderTop: i === 0 ? 'none' : `1px solid ${PB.line}` }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: PB.surface2,
                display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <Icon name={r.icon} size={13} color={PB.morado}/>
              </div>
              <span style={{ fontSize: 13, color: PB.ink2, paddingTop: 4, lineHeight: 1.4 }}>{r.text}</span>
            </div>
          ))}
        </div>

        {/* Equipamiento */}
        <div style={{ margin: '0 16px 16px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em',
            textTransform: 'uppercase', color: PB.ink3, marginBottom: 10 }}>
            Equipamiento
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {v.equipment.map(e => (
              <div key={e.title} style={{ padding: '13px 14px',
                borderRadius: 14, background: PB.surface, border: `1px solid ${PB.line}` }}>
                <div style={{ width: 30, height: 30, borderRadius: 10, background: PB.surface2,
                  display: 'grid', placeItems: 'center', marginBottom: 8 }}>
                  <Icon name={e.icon} size={15} color={PB.morado}/>
                </div>
                <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 13, color: PB.ink }}>
                  {e.title}
                </div>
                <div style={{ fontSize: 11, color: PB.ink3, marginTop: 2 }}>{e.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA sticky */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '14px 16px 26px',
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        background: PB.surface, borderTop: `1px solid ${PB.line}`,
        boxShadow: '0 -12px 30px rgba(20,19,24,.1)',
      }}>
        <Button onClick={onBook} full icon="arrow" style={{ padding: 16, fontSize: 15 }}>
          Reservar en {v.name}
        </Button>
      </div>
    </>
  );
};

// ── Pantalla principal ────────────────────────────────────────────────────────
const ScreenSelectSede = ({ onBack, onSelect, favs = [], onToggleFav }) => {
  const [tab, setTab]           = React.useState('cerca');
  const [geoPhase, setGeoPhase] = React.useState('loading');
  const [city, setCity]         = React.useState('Madrid');
  const [detail, setDetail]     = React.useState(null);
  const [activePin, setActivePin] = React.useState(null);

  React.useEffect(() => {
    if (tab === 'cerca') {
      setGeoPhase('loading');
      const t = setTimeout(() => setGeoPhase('done'), 1600);
      return () => clearTimeout(t);
    }
  }, [tab]);

  const nearby   = ALL_VENUES.filter(v => v.dist < 2).sort((a, b) => a.dist - b.dist);
  const cityList = ALL_VENUES.filter(v => v.city === city);
  const favList  = ALL_VENUES.filter(v => favs.includes(v.id));

  // Detalle de sede
  if (detail) return (
    <VenueDetail
      venue={detail}
      onBack={() => setDetail(null)}
      onBook={() => onSelect(detail)}
      isFav={favs.includes(detail.id)}
      onToggleFav={onToggleFav}
    />
  );

  const VenueCard = ({ v, showDist }) => {
    const isFav    = favs.includes(v.id);
    const isActive = v.id === activePin;
    return (
      <div style={{
        background: PB.surface, borderRadius: 18, overflow: 'hidden', marginBottom: 10,
        border: `1.5px solid ${isActive ? PB.morado : PB.line}`,
        boxShadow: isActive ? `0 0 0 1px ${PB.morado}, 0 6px 20px rgba(72,35,128,.14)` : 'none',
        transition: 'all 250ms',
      }}>
        <div style={{ height: 3, background: `linear-gradient(90deg, ${PB.morado}, ${PB.mentaDeep})` }}/>
        <div style={{ padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 16, color: PB.ink,
                letterSpacing: '-.005em' }}>{v.fullName}</div>
              <div style={{ fontSize: 12, color: PB.ink3, marginTop: 2 }}>{v.addr}</div>
            </div>
            <button onClick={e => { e.stopPropagation(); onToggleFav && onToggleFav(v.id); }}
              style={{ background: 'none', border: 0, padding: 4, cursor: 'pointer', flexShrink: 0, marginTop: -2 }}>
              <Heart filled={isFav}/>
            </button>
          </div>

          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            <span style={{ padding: '3px 9px', borderRadius: 999, background: PB.surface2,
              fontSize: 11, fontWeight: 600, color: PB.ink2 }}>{v.boxes} boxes</span>
            <span style={{ padding: '3px 9px', borderRadius: 999, background: PB.successBg,
              fontSize: 11, fontWeight: 600, color: PB.success }}>● {v.hours}</span>
            {showDist && (
              <span style={{ padding: '3px 9px', borderRadius: 999, background: PB.mentaSoft,
                fontSize: 11, fontWeight: 700, color: PB.morado }}>📍 {v.dist} km</span>
            )}
            <span style={{ padding: '3px 9px', borderRadius: 999, background: PB.surface2,
              fontSize: 11, fontWeight: 600, color: PB.ink2 }}>★ {v.rating}</span>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={() => setDetail(v)} style={{
              flex: 1, padding: '11px', borderRadius: 12,
              border: `1.5px solid ${PB.morado}`, background: 'transparent',
              color: PB.morado, fontFamily: PB.font, fontWeight: 700, fontSize: 13, cursor: 'pointer',
            }}>Ver sede →</button>
            <button onClick={() => onSelect(v)} style={{
              flex: 1, padding: '11px', borderRadius: 12, border: 0,
              background: PB.morado, color: '#fff',
              fontFamily: PB.font, fontWeight: 700, fontSize: 13, cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(72,35,128,.3)',
            }}>Reservar aquí</button>
          </div>
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '10px 16px', position: 'relative' }}>
          <button onClick={onBack} style={{
            position: 'absolute', left: 16, width: 40, height: 40,
            borderRadius: 12, border: `1px solid ${PB.line}`, background: PB.surface,
            display: 'grid', placeItems: 'center', cursor: 'pointer',
          }}>
            <Icon name="back" size={18}/>
          </button>
          <h3 style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 18,
            letterSpacing: '-0.01em', margin: 0 }}>Elige tu sede</h3>
        </div>

        {/* Tabs */}
        <div style={{ padding: '0 16px 14px' }}>
          <div style={{ display: 'flex', gap: 4, padding: 4, background: PB.surface2, borderRadius: 14 }}>
            {[{ id: 'cerca', label: '📍 Cerca de ti' }, { id: 'ciudad', label: '🏙 Por ciudad' }].map(t => (
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

        {/* Favoritas fijadas arriba */}
        {favList.length > 0 && (
          <div style={{ margin: '0 16px 14px', padding: '12px 16px',
            borderRadius: 18, background: PB.surface, border: `1px solid ${PB.line}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em',
              textTransform: 'uppercase', color: '#E57373', marginBottom: 10,
              display: 'flex', alignItems: 'center', gap: 6 }}>
              <Heart filled/> Mis favoritas
            </div>
            {favList.map((v, i) => (
              <div key={v.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 0',
                borderTop: i === 0 ? 'none' : `1px solid ${PB.line}`,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 14,
                    color: PB.ink }}>{v.fullName}</div>
                  <div style={{ fontSize: 11, color: PB.ink3 }}>{v.addr}</div>
                </div>
                <button onClick={() => setDetail(v)} style={{
                  padding: '7px 12px', borderRadius: 10,
                  border: `1px solid ${PB.line}`, background: 'transparent',
                  fontFamily: PB.font, fontWeight: 700, fontSize: 12,
                  color: PB.ink, cursor: 'pointer', flexShrink: 0,
                }}>Ver</button>
                <button onClick={() => onSelect(v)} style={{
                  padding: '7px 12px', borderRadius: 10, border: 0,
                  background: PB.morado, color: '#fff',
                  fontFamily: PB.font, fontWeight: 700, fontSize: 12,
                  cursor: 'pointer', flexShrink: 0,
                }}>Reservar →</button>
              </div>
            ))}
          </div>
        )}

        {/* ── Tab: Cerca de ti ── */}
        {tab === 'cerca' && (
          geoPhase === 'loading' ? (
            <div style={{ padding: '52px 0', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: 999,
                border: `3px solid ${PB.line}`, borderTopColor: PB.morado,
                animation: 'pb-sede-spin 800ms linear infinite' }}/>
              <div style={{ fontFamily: PB.font, fontWeight: 600, fontSize: 14, color: PB.ink3 }}>
                Determinando tu ubicación…
              </div>
              <div style={{ fontSize: 12, color: PB.ink4 }}>Usando GPS del dispositivo</div>
            </div>
          ) : (
            <div>
              <MapView city="Madrid" venues={nearby} activeId={activePin}
                onPin={v => { setActivePin(v.id); setDetail(v); }}/>
              <div style={{ padding: '12px 16px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14,
                  padding: '8px 12px', borderRadius: 12,
                  background: PB.mentaSoft, border: `1px solid ${PB.mentaDeep}` }}>
                  <Icon name="check" size={14} color={PB.success}/>
                  <span style={{ fontSize: 12, color: PB.moradoInk, fontWeight: 600 }}>
                    Ubicación detectada · Madrid
                  </span>
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em',
                  textTransform: 'uppercase', color: PB.ink3, marginBottom: 12 }}>
                  {nearby.length} sedes más cercanas
                </div>
                {nearby.map(v => <VenueCard key={v.id} v={v} showDist/>)}
              </div>
            </div>
          )
        )}

        {/* ── Tab: Por ciudad ── */}
        {tab === 'ciudad' && (
          <div>
            {/* City pills */}
            <div style={{ padding: '0 16px 14px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CITIES.map(c => (
                <button key={c} onClick={() => { setCity(c); setActivePin(null); }} style={{
                  padding: '8px 18px', borderRadius: 999, cursor: 'pointer',
                  border: `1.5px solid ${city === c ? PB.morado : PB.line}`,
                  background: city === c ? PB.morado : PB.surface,
                  color: city === c ? '#fff' : PB.ink,
                  fontFamily: PB.font, fontWeight: 700, fontSize: 13,
                  boxShadow: city === c ? '0 4px 12px rgba(72,35,128,.25)' : 'none',
                }}>{c}</button>
              ))}
            </div>

            <MapView city={city} venues={cityList} activeId={activePin}
              onPin={v => { setActivePin(v.id); setDetail(v); }}/>

            <div style={{ padding: '12px 16px 0' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em',
                textTransform: 'uppercase', color: PB.ink3, marginBottom: 12 }}>
                {cityList.length} {cityList.length === 1 ? 'sede' : 'sedes'} en {city}
              </div>
              {cityList.map(v => <VenueCard key={v.id} v={v}/>)}
            </div>
          </div>
        )}

      </div>
    </>
  );
};

window.ScreenSelectSede = ScreenSelectSede;
