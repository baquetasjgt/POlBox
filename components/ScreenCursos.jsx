// POLEBOX — Cursos online de pole dance

const COURSE_CATALOG = [
  {
    id: 'curso-basico',
    name: 'Pole Dance Básico',
    level: 'Básico',
    desc: 'Aprende desde cero: agarre, giros, transiciones y tu primera coreografía. Ideal si nunca has entrenado en barra.',
    classes: 10, totalMin: 480,
    price: 49,
    accent: '#80E3B7',
    bg: 'linear-gradient(140deg, #1a4a35, #0a2018)',
    lessons: [
      { n:  1, title: 'Introducción y seguridad en la barra', min: 30 },
      { n:  2, title: 'Agarre básico: el gancho',            min: 45 },
      { n:  3, title: 'Giro básico de frente',               min: 45 },
      { n:  4, title: 'Giro básico de espalda',              min: 45 },
      { n:  5, title: 'Bajada en serpiente',                 min: 50 },
      { n:  6, title: 'Sentada en la barra',                 min: 45 },
      { n:  7, title: 'Caminata y transiciones',             min: 45 },
      { n:  8, title: 'Combinación básica',                  min: 60 },
      { n:  9, title: 'Trucos de suelo',                     min: 50 },
      { n: 10, title: 'Coreografía final básica',            min: 65 },
    ],
  },
  {
    id: 'curso-intermedio',
    name: 'Pole Dance Intermedio',
    level: 'Intermedio',
    desc: 'Inversiones, ayesha, firefly, drops y coreografía de nivel medio. Requiere haber completado el curso básico.',
    classes: 10, totalMin: 590,
    price: 69,
    accent: '#c9a8ff',
    bg: 'linear-gradient(140deg, #3e1478, #1f0844)',
    lessons: [
      { n:  1, title: 'Revisión y extensión del básico',  min: 45 },
      { n:  2, title: 'Inversa básica: preparación',      min: 50 },
      { n:  3, title: 'Pole sit y Chopper',               min: 60 },
      { n:  4, title: 'Ganchos de rodilla',               min: 55 },
      { n:  5, title: 'Ayesha: introducción',             min: 60 },
      { n:  6, title: 'Spins encadenados',                min: 55 },
      { n:  7, title: 'Firefly y Superman',               min: 60 },
      { n:  8, title: 'Drops intermedios',                min: 65 },
      { n:  9, title: 'Combinaciones en barra',           min: 60 },
      { n: 10, title: 'Coreografía final intermedia',     min: 80 },
    ],
  },
];
window.COURSE_CATALOG = COURSE_CATALOG;

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

// ── Pantalla principal ────────────────────────────────────────────────────────
const ScreenCursos = ({ onBack, userCurso, onBuy }) => {
  const [tab,     setTab]     = React.useState(userCurso ? 'mi-curso' : 'catalogo');
  const [playing, setPlaying] = React.useState(null);
  const [casting, setCasting] = React.useState(null);

  const course    = userCurso ? COURSE_CATALOG.find(c => c.id === userCurso.courseId) : null;
  const doneSet   = new Set(userCurso?.completedLessons || []);
  const nextLesson= course?.lessons.find(l => !doneSet.has(l.n)) || null;

  // ── Reproductor ───────────────────────────────────────────────────────────
  if (playing && course) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0a0a0f' }}>
        {/* Pantalla falsa */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden',
          background: `linear-gradient(160deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Barra vertical (polo) */}
          <div style={{ position: 'absolute', top: '8%', bottom: '8%', left: '50%',
            width: 7, transform: 'translateX(-50%)', borderRadius: 4,
            background: 'linear-gradient(180deg, rgba(255,255,255,.6), rgba(255,255,255,.2))',
            boxShadow: `0 0 40px ${course.accent}80` }}/>
          <div style={{ position: 'absolute', top: '25%', right: '20%', width: 160, height: 160,
            borderRadius: 999, background: `${course.accent}18`, filter: 'blur(50px)' }}/>
          {/* Badge de cast */}
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
          {/* Botón play central */}
          <div style={{ width: 80, height: 80, borderRadius: 999,
            background: 'rgba(255,255,255,.12)', border: '2px solid rgba(255,255,255,.3)',
            backdropFilter: 'blur(8px)', display: 'grid', placeItems: 'center' }}>
            <Icon name="play" size={34} color="#fff"/>
          </div>
          {/* Info overlay abajo */}
          <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
            <div style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 16, color: '#fff',
              textShadow: '0 1px 8px rgba(0,0,0,.8)' }}>
              Clase {playing.n} · {playing.title}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', marginTop: 2 }}>{playing.min} min</div>
          </div>
        </div>

        {/* Controles */}
        <div style={{ background: '#111827', padding: '16px 18px 28px' }}>
          {/* Timeline */}
          <div style={{ height: 4, borderRadius: 999, background: 'rgba(255,255,255,.12)',
            marginBottom: 16, overflow: 'hidden' }}>
            <div style={{ width: '34%', height: '100%', borderRadius: 999, background: course.accent }}/>
          </div>
          {/* Cast */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            {[
              { type: 'chromecast', label: 'Chromecast', Icon: IconChromecast },
              { type: 'airplay',    label: 'AirPlay',    Icon: IconAirplay },
            ].map(({ type, label, Icon: CIcon }) => {
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

  // ── Fila de clase ─────────────────────────────────────────────────────────
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

            {/* Hero progreso */}
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

            {/* Siguiente clase */}
            {nextLesson && (
              <div style={{ marginBottom: 14, padding: 16, borderRadius: 18,
                background: PB.surface, border: `1px solid ${PB.line}`,
                boxShadow: '0 4px 14px rgba(20,19,24,.06)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em',
                  textTransform: 'uppercase', color: PB.ink3, marginBottom: 10 }}>Siguiente clase</div>
                {/* Thumbnail */}
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
                {/* Cast */}
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

            {/* Lista completa */}
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
                  <div key={c.id} style={{ borderRadius: 20, overflow: 'hidden',
                    background: PB.surface, border: `1px solid ${PB.line}`,
                    boxShadow: '0 6px 20px rgba(20,19,24,.06)' }}>
                    {/* Cabecera */}
                    <div style={{ height: 120, background: c.bg, position: 'relative', overflow: 'hidden' }}>
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
                      {owned ? (
                        <button onClick={() => setTab('mi-curso')} style={{
                          width: '100%', padding: '13px', borderRadius: 12,
                          border: `1.5px solid ${PB.morado}`, background: 'transparent',
                          color: PB.morado, fontFamily: PB.font, fontWeight: 700,
                          fontSize: 14, cursor: 'pointer',
                        }}>Ver mi curso →</button>
                      ) : (
                        <button onClick={() => onBuy(c)} style={{
                          width: '100%', padding: '13px', borderRadius: 12, border: 0,
                          background: PB.morado, color: '#fff',
                          fontFamily: PB.font, fontWeight: 700, fontSize: 15, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                          boxShadow: '0 6px 18px rgba(72,35,128,.3)',
                        }}>
                          Comprar · {c.price} €
                        </button>
                      )}
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
