// POLEBOX — Cursos online de pole dance
// Catálogo en data/courses.js (window.COURSE_CATALOG)


// Iconos de cast — disponibles globalmente para Screen4Key y Screen5Profile
const IconChromecast = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/>
    <path d="M2 17v1a2 2 0 0 0 2 2M22 17v1a2 2 0 0 1-2 2"/>
    <path d="M2 14c3.3 0 6 2.7 6 6M2 10c3.8 0 7.3 1.6 9.8 4.2A13.9 13.9 0 0 1 14 20"/>
    <path d="M2 6a18 18 0 0 1 18 18"/>
  </svg>
);
const IconAirplay = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2"/>
    <polygon points="12 15 17 21 7 21" fill={color} stroke="none"/>
  </svg>
);
window.IconChromecast = IconChromecast;
window.IconAirplay    = IconAirplay;

// ── Detalle de curso (pantalla de ventas) ─────────────────────────────────────
const CourseDetail = ({ c, owned, onBack, onBuy, onMyCourse }) => {
  const h = Math.floor(c.totalMin / 60);
  const m = c.totalMin % 60;
  return (
    <>
      <StatusBar/>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 96 }}>

        {/* Hero */}
        <div style={{ background: c.bg, position: 'relative', overflow: 'hidden' }}>
          {/* Barra de pole decorativa */}
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 6,
            transform: 'translateX(-50%)', background: 'rgba(255,255,255,.22)',
            boxShadow: `0 0 40px ${c.accent}` }}/>
          <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220,
            borderRadius: 999, background: `${c.accent}10`, filter: 'blur(60px)' }}/>

          {/* Cabecera nav */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '10px 16px 0', position: 'relative' }}>
            <button onClick={onBack} style={{
              width: 40, height: 40, borderRadius: 12, border: '1px solid rgba(255,255,255,.2)',
              background: 'rgba(255,255,255,.1)', display: 'grid', placeItems: 'center', cursor: 'pointer',
            }}>
              <Icon name="back" size={18} color="#fff"/>
            </button>
          </div>

          {/* Contenido hero */}
          <div style={{ padding: '16px 20px 28px', position: 'relative' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px',
              borderRadius: 999, background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(6px)',
              marginBottom: 12 }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: c.accent, letterSpacing: '.1em', textTransform: 'uppercase' }}>{c.level}</span>
              {owned && <><span style={{ color: 'rgba(255,255,255,.4)', fontSize: 10 }}>·</span>
              <Icon name="check" size={10} color={c.accent}/>
              <span style={{ fontSize: 10, fontWeight: 700, color: c.accent }}>Activo</span></>}
            </div>
            <h2 style={{ color: '#fff', fontFamily: PB.font, fontWeight: 900, fontSize: 28,
              lineHeight: 1.05, letterSpacing: '-.02em', margin: '0 0 10px' }}>{c.name}</h2>
            <p style={{ color: 'rgba(255,255,255,.65)', fontSize: 13, lineHeight: 1.5,
              margin: '0 0 20px', maxWidth: 320 }}>{c.longDesc}</p>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { icon: 'calendar', label: `${c.classes} clases` },
                { icon: 'history',  label: `${h}h ${m > 0 ? m + 'min' : ''}` },
                { icon: 'sparkle',  label: 'Acceso de por vida' },
              ].map(({ icon, label }) => (
                <div key={label} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 10px',
                  borderRadius: 999, background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(6px)',
                }}>
                  <Icon name={icon} size={12} color={c.accent}/>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Incluye */}
        <div style={{ margin: '16px 16px 0', padding: '14px 16px', borderRadius: 18,
          background: PB.surface, border: `1px solid ${PB.line}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase',
            color: PB.ink3, marginBottom: 10 }}>Este curso incluye</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {c.includes.map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 20, height: 20, borderRadius: 999, background: `${c.accent}30`,
                  display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <Icon name="check" size={10} color={c.accent === '#80E3B7' ? PB.success : PB.morado}/>
                </div>
                <span style={{ fontSize: 13, color: PB.ink, fontWeight: 500 }}>{item}</span>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 20, height: 20, borderRadius: 999, background: `${c.accent}30`,
                display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <IconChromecast size={10} color={c.accent === '#80E3B7' ? PB.success : PB.morado}/>
              </div>
              <span style={{ fontSize: 13, color: PB.ink, fontWeight: 500 }}>Sincroniza con la TV del box</span>
            </div>
          </div>
        </div>

        {/* Programa completo */}
        <div style={{ padding: '20px 16px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
            <h3 style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 17, letterSpacing: '-.01em', margin: 0 }}>
              Programa completo
            </h3>
            <Eyebrow>{c.classes} clases</Eyebrow>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, borderRadius: 18, overflow: 'hidden',
            border: `1px solid ${PB.line}` }}>
            {c.lessons.map((l, i) => (
              <div key={l.n} style={{
                display: 'flex', gap: 14, padding: '14px 16px',
                background: i % 2 === 0 ? PB.surface : PB.surface2 === PB.surface ? PB.surface : PB.surface,
                borderBottom: i < c.lessons.length - 1 ? `1px solid ${PB.line}` : 0,
              }}>
                {/* Número */}
                <div style={{ width: 30, height: 30, borderRadius: 999, flexShrink: 0,
                  background: `${c.accent}22`, border: `1.5px solid ${c.accent}60`,
                  display: 'grid', placeItems: 'center' }}>
                  <span style={{ fontFamily: PB.mono, fontWeight: 800, fontSize: 11,
                    color: c.accent === '#80E3B7' ? PB.success : PB.morado }}>{l.n}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                    <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 13,
                      color: PB.ink, lineHeight: 1.3 }}>{l.title}</div>
                    <div style={{ fontSize: 11, color: PB.ink4, fontWeight: 600,
                      flexShrink: 0 }}>{l.min} min</div>
                  </div>
                  <div style={{ fontSize: 12, color: PB.ink3, marginTop: 3, lineHeight: 1.4 }}>{l.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Garantía */}
        <div style={{ margin: '16px 16px 0', padding: '12px 16px', borderRadius: 16,
          background: PB.mentaSoft, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <Icon name="shield" size={18} color={PB.success}/>
          <div style={{ fontSize: 12, color: PB.moradoInk, lineHeight: 1.45 }}>
            <strong style={{ fontWeight: 800 }}>Garantía 14 días.</strong> Si el curso no es para ti, te devolvemos el importe completo sin preguntas.
          </div>
        </div>

      </div>

      {/* Sticky CTA */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '12px 16px 24px',
        background: PB.surface, borderTop: `1px solid ${PB.line}`,
        boxShadow: '0 -8px 24px rgba(20,19,24,.08)',
      }}>
        {owned ? (
          <button onClick={onMyCourse} style={{
            width: '100%', padding: '16px', borderRadius: 14, border: `1.5px solid ${PB.morado}`,
            background: 'transparent', color: PB.morado,
            fontFamily: PB.font, fontWeight: 800, fontSize: 16, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>
            <Icon name="play" size={18} color={PB.morado}/>
            Ir a mi curso
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{ fontFamily: PB.mono, fontWeight: 800, fontSize: 26, color: PB.ink, lineHeight: 1 }}>{c.price} €</div>
              <div style={{ fontSize: 10, color: PB.ink4, fontWeight: 600, marginTop: 1 }}>pago único</div>
            </div>
            <button onClick={() => onBuy(c)} style={{
              flex: 1, padding: '16px', borderRadius: 14, border: 0,
              background: PB.morado, color: '#fff',
              fontFamily: PB.font, fontWeight: 800, fontSize: 16, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              boxShadow: '0 8px 22px rgba(72,35,128,.35)',
            }}>
              Comprar curso
              <Icon name="arrow" size={18} color="#fff"/>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

// ── Pantalla principal ────────────────────────────────────────────────────────
const ScreenCursos = ({ onBack, userCurso, onBuy }) => {
  const [tab,         setTab]         = React.useState(userCurso ? 'mi-curso' : 'catalogo');
  const [playing,     setPlaying]     = React.useState(null);
  const [casting,     setCasting]     = React.useState(null);
  const [detailCurso, setDetailCurso] = React.useState(null);

  const course    = userCurso ? COURSE_CATALOG.find(c => c.id === userCurso.courseId) : null;
  const doneSet   = new Set(userCurso?.completedLessons || []);
  const nextLesson= course?.lessons.find(l => !doneSet.has(l.n)) || null;

  // ── Detalle de curso ──────────────────────────────────────────────────────
  if (detailCurso) {
    const owned = userCurso?.courseId === detailCurso.id;
    return (
      <CourseDetail
        c={detailCurso}
        owned={owned}
        onBack={() => setDetailCurso(null)}
        onBuy={(c) => { setDetailCurso(null); onBuy(c); }}
        onMyCourse={() => { setDetailCurso(null); setTab('mi-curso'); }}
      />
    );
  }

  // ── Reproductor ───────────────────────────────────────────────────────────
  if (playing && course) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0a0a0f' }}>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden',
          background: `linear-gradient(160deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', top: '8%', bottom: '8%', left: '50%',
            width: 7, transform: 'translateX(-50%)', borderRadius: 4,
            background: 'linear-gradient(180deg, rgba(255,255,255,.6), rgba(255,255,255,.2))',
            boxShadow: `0 0 40px ${course.accent}80` }}/>
          <div style={{ position: 'absolute', top: '25%', right: '20%', width: 160, height: 160,
            borderRadius: 999, background: `${course.accent}18`, filter: 'blur(50px)' }}/>
          {casting && (
            <div style={{ position: 'absolute', top: 16, right: 16,
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
              borderRadius: 999, background: 'rgba(0,0,0,.65)', backdropFilter: 'blur(8px)' }}>
              {casting === 'chromecast'
                ? <IconChromecast size={13} color={PB.menta}/>
                : <IconAirplay    size={13} color={PB.menta}/>}
              <span style={{ fontSize: 11, color: PB.menta, fontWeight: 700 }}>
                {casting === 'chromecast' ? 'Chromecast · en TV' : 'AirPlay · en TV'}
              </span>
            </div>
          )}
          <div style={{ width: 80, height: 80, borderRadius: 999,
            background: 'rgba(255,255,255,.12)', border: '2px solid rgba(255,255,255,.3)',
            backdropFilter: 'blur(8px)', display: 'grid', placeItems: 'center' }}>
            <Icon name="play" size={34} color="#fff"/>
          </div>
          <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
            <div style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 16, color: '#fff',
              textShadow: '0 1px 8px rgba(0,0,0,.8)' }}>
              Clase {playing.n} · {playing.title}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', marginTop: 2 }}>{playing.min} min</div>
          </div>
        </div>
        <div style={{ background: '#111827', padding: '16px 18px 28px' }}>
          <div style={{ height: 4, borderRadius: 999, background: 'rgba(255,255,255,.12)',
            marginBottom: 16, overflow: 'hidden' }}>
            <div style={{ width: '34%', height: '100%', borderRadius: 999, background: course.accent }}/>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            {[
              { type: 'chromecast', label: 'Chromecast', CIcon: IconChromecast },
              { type: 'airplay',    label: 'AirPlay',    CIcon: IconAirplay },
            ].map(({ type, label, CIcon }) => {
              const active = casting === type;
              return (
                <button key={type} onClick={() => setCasting(active ? null : type)} style={{
                  flex: 1, padding: '11px 8px', borderRadius: 12, cursor: 'pointer',
                  border: `1.5px solid ${active ? PB.menta : 'rgba(255,255,255,.18)'}`,
                  background: active ? 'rgba(128,227,183,.15)' : 'rgba(255,255,255,.05)',
                  color: active ? PB.menta : 'rgba(255,255,255,.55)',
                  fontFamily: PB.font, fontWeight: 700, fontSize: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}>
                  <CIcon size={15} color={active ? PB.menta : 'rgba(255,255,255,.55)'}/>
                  {label}
                  {active && <span style={{ fontSize: 9 }}>●</span>}
                </button>
              );
            })}
          </div>
          <button onClick={() => setPlaying(null)} style={{
            width: '100%', padding: '14px', borderRadius: 12, border: 0,
            background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.7)',
            fontFamily: PB.font, fontWeight: 700, fontSize: 14, cursor: 'pointer',
          }}>Cerrar clase</button>
        </div>
      </div>
    );
  }

  // ── Fila de clase (Mi curso) ──────────────────────────────────────────────
  const LessonRow = ({ l }) => {
    if (!course) return null;
    const done    = doneSet.has(l.n);
    const isCurr  = nextLesson && l.n === nextLesson.n;
    const locked  = !done && !isCurr;
    return (
      <div onClick={() => !locked && setPlaying(l)} style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
        borderRadius: 14, marginBottom: 8,
        background: isCurr ? `${course.accent}18` : PB.surface,
        border: `1.5px solid ${isCurr ? course.accent : PB.line}`,
        cursor: locked ? 'default' : 'pointer', opacity: locked ? .45 : 1,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 999, flexShrink: 0,
          background: done ? PB.successBg : isCurr ? course.accent : PB.surface2,
          border: `2px solid ${done ? PB.success : isCurr ? course.accent : PB.line}`,
          display: 'grid', placeItems: 'center',
        }}>
          {done
            ? <Icon name="check" size={14} color={PB.success}/>
            : <span style={{ fontFamily: PB.mono, fontWeight: 800, fontSize: 11,
                color: isCurr ? PB.moradoInk : PB.ink4 }}>{l.n}</span>}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: PB.font, fontWeight: isCurr ? 800 : 600, fontSize: 13,
            color: PB.ink, lineHeight: 1.3 }}>{l.title}</div>
          <div style={{ fontSize: 11, color: PB.ink3, marginTop: 2 }}>{l.min} min</div>
        </div>
        {locked
          ? <Icon name="lock" size={15} color={PB.ink4}/>
          : <div style={{ width: 32, height: 32, borderRadius: 999, flexShrink: 0,
              background: isCurr ? course.accent : PB.surface2, display: 'grid', placeItems: 'center' }}>
              <Icon name="play" size={14} color={isCurr ? PB.moradoInk : PB.ink3}/>
            </div>}
      </div>
    );
  };

  return (
    <>
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
          <h3 style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 18, margin: 0 }}>Cursos online</h3>
        </div>

        {/* Tabs */}
        {userCurso && (
          <div style={{ padding: '0 16px 14px' }}>
            <div style={{ display: 'flex', gap: 4, padding: 4, background: PB.surface2, borderRadius: 14 }}>
              {[{ id: 'mi-curso', label: '📚 Mi curso' }, { id: 'catalogo', label: '🛍 Catálogo' }].map(t => (
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
        )}

        {/* ── Mi curso ── */}
        {tab === 'mi-curso' && course && (
          <div style={{ padding: '0 16px' }}>
            <div style={{ borderRadius: 20, overflow: 'hidden', background: course.bg,
              marginBottom: 14, boxShadow: `0 14px 36px ${course.accent}22` }}>
              <div style={{ padding: '18px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.16em',
                      color: `${course.accent}bb`, textTransform: 'uppercase', marginBottom: 4 }}>Tu curso</div>
                    <div style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 18,
                      color: '#fff' }}>{course.name}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: PB.mono, fontWeight: 800, fontSize: 30,
                      color: '#fff', lineHeight: 1 }}>{doneSet.size}</div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,.5)', fontWeight: 700,
                      letterSpacing: '.1em', textTransform: 'uppercase', marginTop: 2 }}>de {course.classes}</div>
                  </div>
                </div>
                <div style={{ marginTop: 14, height: 5, borderRadius: 999, background: 'rgba(255,255,255,.15)' }}>
                  <div style={{ height: '100%', width: `${(doneSet.size / course.classes) * 100}%`,
                    borderRadius: 999, background: course.accent }}/>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6,
                  fontSize: 10, color: 'rgba(255,255,255,.45)' }}>
                  <span>{doneSet.size} completadas</span>
                  <span>{course.classes - doneSet.size} restantes</span>
                </div>
              </div>
            </div>

            {nextLesson && (
              <div style={{ marginBottom: 14, padding: 16, borderRadius: 18,
                background: PB.surface, border: `1px solid ${PB.line}`,
                boxShadow: '0 4px 14px rgba(20,19,24,.06)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em',
                  textTransform: 'uppercase', color: PB.ink3, marginBottom: 10 }}>Siguiente clase</div>
                <div onClick={() => setPlaying(nextLesson)} style={{
                  height: 116, borderRadius: 14, background: course.bg,
                  marginBottom: 12, position: 'relative', overflow: 'hidden', cursor: 'pointer',
                }}>
                  <div style={{ position: 'absolute', top: '10%', left: '50%', bottom: '8%',
                    width: 5, transform: 'translateX(-50%)', background: 'rgba(255,255,255,.35)',
                    borderRadius: 2, boxShadow: `0 0 20px ${course.accent}` }}/>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex',
                    alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 52, height: 52, borderRadius: 999,
                      background: 'rgba(255,255,255,.18)', display: 'grid', placeItems: 'center',
                      backdropFilter: 'blur(4px)', border: '1.5px solid rgba(255,255,255,.3)' }}>
                      <Icon name="play" size={24} color="#fff"/>
                    </div>
                  </div>
                  <div style={{ position: 'absolute', bottom: 10, left: 12,
                    padding: '3px 8px', borderRadius: 6, background: 'rgba(0,0,0,.5)',
                    color: '#fff', fontSize: 10, fontWeight: 700 }}>
                    Clase {nextLesson.n} · {nextLesson.min} min
                  </div>
                </div>
                <div style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 15,
                  color: PB.ink, marginBottom: 12 }}>{nextLesson.title}</div>
                <div style={{ display: 'flex', gap: 8, marginBottom: casting ? 10 : 12 }}>
                  {[
                    { type: 'chromecast', label: 'Chromecast', CIcon: IconChromecast },
                    { type: 'airplay',    label: 'AirPlay',    CIcon: IconAirplay },
                  ].map(({ type, label, CIcon }) => {
                    const active = casting === type;
                    return (
                      <button key={type} onClick={() => setCasting(active ? null : type)} style={{
                        flex: 1, padding: '10px', borderRadius: 12, cursor: 'pointer',
                        border: `1.5px solid ${active ? PB.mentaDeep : PB.line}`,
                        background: active ? PB.mentaSoft : PB.surface2,
                        color: active ? PB.success : PB.ink3,
                        fontFamily: PB.font, fontWeight: 700, fontSize: 12,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      }}>
                        <CIcon size={15} color={active ? PB.success : PB.ink3}/>
                        {label}
                      </button>
                    );
                  })}
                </div>
                {casting && (
                  <div style={{ marginBottom: 12, padding: '8px 12px', borderRadius: 12,
                    background: PB.mentaSoft, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon name="check" size={14} color={PB.success}/>
                    <span style={{ fontSize: 12, color: PB.moradoInk, fontWeight: 700 }}>
                      Conectado via {casting === 'chromecast' ? 'Chromecast' : 'AirPlay'} · la TV del box mostrará la clase
                    </span>
                  </div>
                )}
                <button onClick={() => setPlaying(nextLesson)} style={{
                  width: '100%', padding: '14px', borderRadius: 12, border: 0,
                  background: PB.morado, color: '#fff',
                  fontFamily: PB.font, fontWeight: 700, fontSize: 14, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: '0 6px 18px rgba(72,35,128,.3)',
                }}>
                  <Icon name="play" size={16} color="#fff"/>
                  Reproducir clase {nextLesson.n}
                </button>
              </div>
            )}

            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em',
              textTransform: 'uppercase', color: PB.ink3, marginBottom: 12 }}>
              Todas las clases
            </div>
            {course.lessons.map(l => <LessonRow key={l.n} l={l}/>)}
          </div>
        )}

        {/* ── Catálogo ── */}
        {tab === 'catalogo' && (
          <div style={{ padding: '0 16px' }}>
            <div style={{ fontSize: 13, color: PB.ink3, lineHeight: 1.55, marginBottom: 16, padding: '0 2px' }}>
              Complementa cada sesión en el box con vídeos de técnica, corrección y coreografías.
              Sincroniza con la TV de tu box via Chromecast o AirPlay.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {COURSE_CATALOG.map(c => {
                const owned = userCurso?.courseId === c.id;
                return (
                  <div key={c.id} onClick={() => setDetailCurso(c)} style={{ borderRadius: 20, overflow: 'hidden',
                    background: PB.surface, border: `1px solid ${PB.line}`,
                    boxShadow: '0 6px 20px rgba(20,19,24,.06)', cursor: 'pointer' }}>
                    <div style={{ height: 130, background: c.bg, position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: '10%', left: '50%', bottom: '5%', width: 5,
                        transform: 'translateX(-50%)', background: 'rgba(255,255,255,.35)', borderRadius: 2,
                        boxShadow: `0 0 24px ${c.accent}` }}/>
                      <div style={{ position: 'absolute', top: 12, left: 14,
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '4px 10px', borderRadius: 999,
                        background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(8px)' }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: c.accent,
                          letterSpacing: '.08em', textTransform: 'uppercase' }}>{c.level}</span>
                      </div>
                      {owned && (
                        <div style={{ position: 'absolute', top: 12, right: 14,
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          padding: '4px 10px', borderRadius: 999, background: PB.successBg }}>
                          <Icon name="check" size={10} color={PB.success}/>
                          <span style={{ fontSize: 10, fontWeight: 800, color: PB.success }}>Activo</span>
                        </div>
                      )}
                      {/* "Ver más" hint */}
                      <div style={{ position: 'absolute', bottom: 10, right: 14,
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        padding: '3px 8px', borderRadius: 999,
                        background: 'rgba(0,0,0,.4)', backdropFilter: 'blur(6px)' }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.8)' }}>Ver programa →</span>
                      </div>
                    </div>
                    <div style={{ padding: '16px 18px' }}>
                      <div style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 17,
                        color: PB.ink, marginBottom: 6 }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: PB.ink3, lineHeight: 1.5,
                        marginBottom: 12 }}>{c.desc}</div>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
                        {[
                          `${c.classes} clases`,
                          `${Math.floor(c.totalMin / 60)}h ${c.totalMin % 60}min`,
                          'Acceso de por vida',
                          'Chromecast · AirPlay',
                        ].map(tag => (
                          <span key={tag} style={{ padding: '3px 9px', borderRadius: 999,
                            background: PB.surface2, fontSize: 11, fontWeight: 600, color: PB.ink2 }}>{tag}</span>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <button onClick={(e) => { e.stopPropagation(); setDetailCurso(c); }} style={{
                          flex: 1, padding: '12px', borderRadius: 12,
                          border: `1.5px solid ${PB.line}`, background: PB.surface2,
                          color: PB.ink2, fontFamily: PB.font, fontWeight: 700,
                          fontSize: 13, cursor: 'pointer',
                        }}>Ver programa</button>
                        {owned ? (
                          <button onClick={(e) => { e.stopPropagation(); setTab('mi-curso'); }} style={{
                            flex: 1, padding: '12px', borderRadius: 12,
                            border: `1.5px solid ${PB.morado}`, background: 'transparent',
                            color: PB.morado, fontFamily: PB.font, fontWeight: 700,
                            fontSize: 13, cursor: 'pointer',
                          }}>Mi curso →</button>
                        ) : (
                          <button onClick={(e) => { e.stopPropagation(); onBuy(c); }} style={{
                            flex: 1, padding: '12px', borderRadius: 12, border: 0,
                            background: PB.morado, color: '#fff',
                            fontFamily: PB.font, fontWeight: 700, fontSize: 13, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                            boxShadow: '0 4px 14px rgba(72,35,128,.3)',
                          }}>
                            Comprar · {c.price} €
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

window.ScreenCursos = ScreenCursos;
