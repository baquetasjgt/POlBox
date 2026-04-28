// POLEBOX — Venue detail (public, browse-as-guest)
// Entra tras elegir sede en el home. Muestra galería, boxes, equipamiento, CTA a reservar.

const ScreenVenue = ({ venueId = 'mad-salamanca', onBack, onBook }) => {
  const [tab, setTab] = React.useState('boxes');

  const venues = {
    'mad-salamanca': { name: 'Salamanca', city: 'Madrid', addr: 'C/ Velázquez 42 · 28001', dist: '0,8 km', rating: 4.9, reviews: 128, hours: 'Abierto 24/7' },
    'mad-chamberi':  { name: 'Chamberí',  city: 'Madrid', addr: 'C/ Fuencarral 120 · 28010', dist: '2,1 km', rating: 4.8, reviews: 94, hours: 'Abierto 24/7' },
    'mad-malasana':  { name: 'Malasaña',  city: 'Madrid', addr: 'C/ Espíritu Santo 8 · 28004', dist: '3,4 km', rating: 4.9, reviews: 57, hours: 'Abierto 24/7' },
    'bcn-gracia':    { name: 'Gràcia',    city: 'Barcelona', addr: 'C/ Verdi 60 · 08012', dist: '612 km', rating: 4.9, reviews: 210, hours: 'Abierto 24/7' },
  };
  const v = venues[venueId] || venues['mad-salamanca'];

  const boxes = [
    { id: 1, name: 'BOX 1 — Industrial', desc: 'Hormigón, luz cruda', tags: ['Max 2 pers.', 'Insonorizado'], hue: '#2b1550', accent: PB.menta },
    { id: 2, name: 'BOX 2 — Neón',       desc: 'LED programables',    tags: ['Max 2 pers.', 'Altavoz pro'],   hue: '#3a1b6a', accent: '#E9A0E3' },
    { id: 3, name: 'BOX 3 — Espejo',     desc: 'Pared de espejo',     tags: ['Max 2 pers.', 'Grabación'],     hue: '#1f1040', accent: PB.menta },
  ];

  const equipment = [
    { icon: 'bolt',   title: 'Barra X-Pole 45 mm', sub: 'Estática + giratoria' },
    { icon: 'music',  title: 'Altavoz JBL pro',    sub: 'Bluetooth + AUX' },
    { icon: 'light',  title: 'LED programables',   sub: '3 ambientes' },
    { icon: 'camera', title: 'Zona de grabación',  sub: 'Solo en BOX 3' },
    { icon: 'shield', title: 'Insonorizado',       sub: 'Entrena de noche sin quejas' },
    { icon: 'users',  title: 'Vestuario privado',  sub: 'Con taquilla y ducha' },
  ];

  // Galería de imágenes — placeholders con composición tipo "foto editorial"
  const gallery = [
    { hue: '#2b1550', accent: PB.menta,    label: 'BOX 1' },
    { hue: '#3a1b6a', accent: '#E9A0E3',   label: 'Pasillo' },
    { hue: '#1f1040', accent: PB.menta,    label: 'BOX 2' },
    { hue: '#241344', accent: '#F0B867',   label: 'Vestuario' },
    { hue: '#311961', accent: PB.menta,    label: 'BOX 3' },
  ];
  const [galleryIdx, setGalleryIdx] = React.useState(0);

  const Photo = ({ g, big }) => (
    <div style={{
      width: '100%', height: '100%',
      background: `linear-gradient(150deg, ${g.hue} 0%, ${PB.moradoInk} 100%)`,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* "foto" simulada: stripe de luz + barra vertical + brillos */}
      <div style={{ position: 'absolute', top: '20%', left: '38%', width: 4, height: '70%', background: 'rgba(255,255,255,.35)', borderRadius: 2, boxShadow: `0 0 24px ${g.accent}` }}/>
      <div style={{ position: 'absolute', top: '15%', right: '12%', width: big ? 60 : 38, height: big ? 60 : 38, borderRadius: 999, background: g.accent, opacity: .35, filter: 'blur(14px)' }}/>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(120% 80% at 30% 90%, transparent 40%, rgba(0,0,0,.4) 100%)` }}/>
      <div style={{ position: 'absolute', bottom: 10, left: 12, padding: '4px 9px', borderRadius: 999, background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(8px)', color: '#fff', fontFamily: PB.font, fontSize: 10, fontWeight: 800, letterSpacing: '.1em' }}>{g.label}</div>
    </div>
  );

  return (
    <>
      <StatusBar/>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 130 }}>
        {/* Hero gallery — foto principal grande + thumbs */}
        <div style={{ position: 'relative', height: 280, overflow: 'hidden' }}>
          <Photo g={gallery[galleryIdx]} big/>
          {/* Back + share */}
          <div style={{ position: 'absolute', top: 12, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', zIndex: 5 }}>
            <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: 999, border: 0, background: 'rgba(255,255,255,.92)', display: 'grid', placeItems: 'center', cursor: 'pointer', backdropFilter: 'blur(8px)' }}>
              <Icon name="back" size={18}/>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 999, background: 'rgba(0,0,0,.4)', color: '#fff', fontFamily: PB.mono, fontSize: 11, fontWeight: 700, backdropFilter: 'blur(8px)' }}>
              {galleryIdx + 1} / {gallery.length}
            </div>
          </div>
          {/* Title overlay */}
          <div style={{ position: 'absolute', bottom: 60, left: 18, right: 18, color: '#fff', zIndex: 4 }}>
            <Eyebrow color={PB.menta}>{v.city}</Eyebrow>
            <div style={{ fontFamily: PB.font, fontWeight: 900, fontSize: 32, letterSpacing: '-.02em', lineHeight: 1, marginTop: 4 }}>
              POLEBOX {v.name}
            </div>
            <div style={{ fontSize: 12, opacity: .9, marginTop: 6 }}>{v.addr}</div>
          </div>
          {/* Thumbnails */}
          <div style={{ position: 'absolute', bottom: 10, left: 12, right: 12, display: 'flex', gap: 6, zIndex: 5 }}>
            {gallery.map((g, i) => (
              <button key={i} onClick={() => setGalleryIdx(i)} style={{
                flex: 1, height: 36, borderRadius: 8, border: i === galleryIdx ? `2px solid ${PB.menta}` : '2px solid rgba(255,255,255,.3)',
                padding: 0, overflow: 'hidden', cursor: 'pointer', background: 'transparent',
              }}>
                <Photo g={g}/>
              </button>
            ))}
          </div>
        </div>

        {/* Meta chips */}
        <div style={{ padding: '0 16px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ padding: '6px 12px', borderRadius: 999, background: PB.successBg, color: PB.success, fontSize: 11, fontWeight: 700, letterSpacing: '.06em' }}>● {v.hours}</span>
          <span style={{ padding: '6px 12px', borderRadius: 999, background: PB.surface2, color: PB.ink2, fontSize: 11, fontWeight: 700 }}>★ {v.rating} · {v.reviews} reseñas</span>
          <span style={{ padding: '6px 12px', borderRadius: 999, background: PB.surface2, color: PB.ink2, fontSize: 11, fontWeight: 700 }}>a {v.dist}</span>
        </div>

        {/* Tabs */}
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{ display: 'flex', gap: 6, padding: 4, background: PB.surface2, borderRadius: 14 }}>
            {[['boxes','Boxes'], ['equip','Equipamiento'], ['info','Info']].map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} style={{
                flex: 1, padding: '10px 8px', borderRadius: 10, border: 0,
                background: tab === k ? PB.surface : 'transparent',
                boxShadow: tab === k ? '0 1px 3px rgba(20,19,24,.08)' : 'none',
                color: tab === k ? PB.ink : PB.ink3, fontFamily: PB.font, fontWeight: 700, fontSize: 13, cursor: 'pointer',
              }}>{l}</button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        {tab === 'boxes' && (
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {boxes.map(b => (
              <div key={b.id} style={{ borderRadius: 18, overflow: 'hidden', background: PB.surface, border: `1px solid ${PB.line}`, boxShadow: '0 4px 14px rgba(20,19,24,.05)' }}>
                <div style={{ height: 120, background: `linear-gradient(140deg, ${b.hue}, ${PB.moradoInk})`, position: 'relative' }}>
                  <div style={{ position: 'absolute', bottom: 12, left: 14, width: 6, height: 36, background: b.accent, borderRadius: 3 }}/>
                  <div style={{ position: 'absolute', top: 12, right: 12, padding: '4px 10px', borderRadius: 999, background: 'rgba(255,255,255,.16)', backdropFilter: 'blur(8px)', color: '#fff', fontFamily: PB.font, fontSize: 10, fontWeight: 800, letterSpacing: '.1em' }}>BOX {b.id}</div>
                </div>
                <div style={{ padding: 14 }}>
                  <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 15, color: PB.ink }}>{b.name}</div>
                  <div style={{ fontSize: 12, color: PB.ink3, marginTop: 2 }}>{b.desc}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                    {b.tags.map(t => (
                      <span key={t} style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', padding: '3px 7px', borderRadius: 999, background: PB.mentaSoft, color: PB.moradoInk }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'equip' && (
          <div style={{ padding: '14px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {equipment.map(e => (
              <div key={e.title} style={{ padding: 12, borderRadius: 14, background: PB.surface, border: `1px solid ${PB.line}` }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: PB.surface2, color: PB.morado, display: 'grid', placeItems: 'center', marginBottom: 8 }}>
                  <Icon name={e.icon} size={16}/>
                </div>
                <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 13, color: PB.ink }}>{e.title}</div>
                <div style={{ fontSize: 11, color: PB.ink3, marginTop: 2 }}>{e.sub}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'info' && (
          <div style={{ padding: '14px 20px', color: PB.ink2, fontSize: 13.5, lineHeight: 1.55 }}>
            <h4 style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 15, color: PB.ink, margin: '0 0 6px' }}>Cómo llegar</h4>
            <p style={{ margin: '0 0 14px', color: PB.ink3, fontSize: 13 }}>{v.addr}. Metro Velázquez (L4) a 2 min. Parking en la calle.</p>
            <h4 style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 15, color: PB.ink, margin: '0 0 6px' }}>Reglas básicas</h4>
            <ul style={{ margin: 0, paddingLeft: 18, color: PB.ink3, fontSize: 13 }}>
              <li>Máximo 2 personas por box.</li>
              <li>Deja el box como lo encontraste.</li>
              <li>Música a volumen amable con vecinos.</li>
            </ul>
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 16px 26px',
        borderTopLeftRadius: 24, borderTopRightRadius: 24, background: PB.surface,
        boxShadow: '0 -12px 30px rgba(20,19,24,.1)', borderTop: `1px solid ${PB.line}`,
      }}>
        <Button onClick={onBook} full icon="arrow" style={{ padding: '16px', fontSize: 15 }}>
          Reserva ahora tu box en {v.name}
        </Button>
      </div>
    </>
  );
};

window.ScreenVenue = ScreenVenue;
