// POLEBOX — Valoración post-sesión (+ canal de incidencias).
// Aparece al terminar la sesión desde la llave digital. Las incidencias son un
// canal separado de la reseña: una barra floja es un aviso a mantenimiento,
// no una estrella menos.

const ScreenValoracion = ({ booking, onClose, onSubmit }) => {
  const [stars, setStars] = React.useState(0);
  const [tags, setTags] = React.useState([]);
  const [comment, setComment] = React.useState('');
  const [issue, setIssue] = React.useState(null);

  const TAGS = ['Limpieza impecable', 'Barra perfecta', 'Buen sonido', 'Luz ambiente top', 'Fácil acceso'];
  const ISSUES = ['Barra floja', 'Limpieza', 'Sonido', 'Luces', 'Cerradura', 'Otro'];

  const toggleTag = (t) => setTags(x => x.includes(t) ? x.filter(y => y !== t) : [...x, t]);

  return (
    <>
      <StatusBar/>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 130 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 16px', position: 'relative' }}>
          <button onClick={onClose} aria-label="Cerrar" style={{ position: 'absolute', left: 16, width: 40, height: 40, borderRadius: 12, border: `1px solid ${PB.line}`, background: PB.surface, display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
            <Icon name="back" size={18}/>
          </button>
          <h3 style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 18, margin: 0 }}>¿Qué tal tu sesión?</h3>
        </div>

        <div style={{ textAlign: 'center', padding: '8px 20px 4px' }}>
          <div style={{ fontSize: 13, color: PB.ink3 }}>
            {booking ? `${booking.boxLabel} · ${booking.venueName}` : 'Tu sesión de hoy'}
          </div>
        </div>

        {/* Estrellas */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '16px 0 6px' }}>
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} onClick={() => setStars(n)} aria-label={`${n} estrellas`} style={{ background: 'transparent', border: 0, cursor: 'pointer', fontSize: 34, lineHeight: 1, filter: n <= stars ? 'none' : 'grayscale(1) opacity(.35)', transition: 'filter 150ms' }}>
              ⭐
            </button>
          ))}
        </div>
        <div style={{ textAlign: 'center', fontSize: 12, color: PB.ink3, minHeight: 18 }}>
          {stars === 0 ? 'Toca para valorar' : ['', 'Uf…', 'Mejorable', 'Bien', 'Muy bien', '¡Perfecta!'][stars]}
        </div>

        {/* Qué destacas */}
        <div style={{ padding: '18px 16px 0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: PB.ink3, marginBottom: 10 }}>¿Qué destacas?</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {TAGS.map(t => {
              const on = tags.includes(t);
              return (
                <button key={t} onClick={() => toggleTag(t)} style={{
                  padding: '9px 14px', borderRadius: 999, cursor: 'pointer',
                  border: `1.5px solid ${on ? PB.morado : PB.line}`,
                  background: on ? 'rgba(72,35,128,.06)' : PB.surface,
                  color: on ? PB.morado : PB.ink2, fontFamily: PB.font, fontWeight: 700, fontSize: 12,
                }}>{t}</button>
              );
            })}
          </div>
        </div>

        {/* Comentario */}
        <div style={{ padding: '16px 16px 0' }}>
          <textarea
            value={comment} onChange={e => setComment(e.target.value)}
            placeholder="Comentario opcional…"
            rows={3}
            style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 14, border: `1px solid ${PB.line}`, background: PB.surface2, fontFamily: PB.font, fontSize: 14, color: PB.ink, outline: 'none', resize: 'none' }}
          />
        </div>

        {/* Incidencias — canal separado */}
        <div style={{ margin: '16px 16px 0', padding: '14px 16px', borderRadius: 16, background: PB.warnBg, border: `1px solid ${PB.warn}40` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <Icon name="shield" size={15} color={PB.warn}/>
            <span style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 13, color: PB.warn }}>¿Algo no estaba bien?</span>
          </div>
          <div style={{ fontSize: 11, color: '#7a5200', marginBottom: 10, lineHeight: 1.45 }}>
            Esto avisa directamente a mantenimiento (no afecta a tu valoración). Una barra floja es un riesgo: repórtala siempre.
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {ISSUES.map(t => {
              const on = issue === t;
              return (
                <button key={t} onClick={() => setIssue(on ? null : t)} style={{
                  padding: '7px 12px', borderRadius: 999, cursor: 'pointer',
                  border: `1.5px solid ${on ? PB.warn : 'rgba(182,122,18,.3)'}`,
                  background: on ? PB.warn : 'transparent',
                  color: on ? '#fff' : PB.warn, fontFamily: PB.font, fontWeight: 700, fontSize: 11,
                }}>{t}</button>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 16px 26px', background: PB.surface, boxShadow: '0 -12px 30px rgba(20,19,24,.1)', borderTop: `1px solid ${PB.line}`, borderTopLeftRadius: 28, borderTopRightRadius: 28 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" onClick={onClose} style={{ flex: 1 }}>Ahora no</Button>
          <Button
            disabled={stars === 0 && !issue}
            onClick={() => onSubmit({ stars, tags, comment, issue, bookingId: booking?.id })}
            style={{ flex: 2 }}
          >
            Enviar · +20 XP
          </Button>
        </div>
      </div>
    </>
  );
};

window.ScreenValoracion = ScreenValoracion;
