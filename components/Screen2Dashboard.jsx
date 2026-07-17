// POLEBOX — Screen 2: Dashboard (logged-in)
// El héroe refleja la próxima reserva REAL (antes era una sesión ficticia
// hardcodeada a las 18:00 que no cambiaba nunca).

const Screen2Dashboard = ({ onNewReservation, onOpenKey, onStore, userBonos, onReservarConBono, onMisBonos, onComprarBono, gameData, onGamificacion, userCurso, onCursos, nextBooking, onMisReservas, notifs, onNotifs }) => {
  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // Countdown hasta la próxima reserva real
  const next = React.useMemo(() => {
    if (!nextBooking) return null;
    const start = new Date(`${nextBooking.dateISO}T00:00:00`);
    start.setMinutes(nextBooking.startMin);
    return { ...nextBooking, startDate: start };
  }, [nextBooking]);
  const secsTo = next ? Math.floor((next.startDate.getTime() - now) / 1000) : 0;
  const inProgress = next && secsTo <= 0 && secsTo > -next.duration * 60;
  const hh = String(Math.max(0, Math.floor(secsTo / 3600))).padStart(2, '0');
  const mm = String(Math.max(0, Math.floor((secsTo % 3600) / 60))).padStart(2, '0');
  const ss = String(Math.max(0, secsTo % 60)).padStart(2, '0');

  const unread = (notifs || []).filter(n => !n.read).length;

  const activeBonos = (userBonos || []).filter(b => b.state === 'active');
  const bono = activeBonos[0] || null;
  const extras = activeBonos.length - 1;

  return (
    <>
      <StatusBar/>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 110 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px 12px' }}>
          <div>
            <div style={{ fontSize: 13, color: PB.ink3 }}>Hola,</div>
            <div style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 22, letterSpacing: '-0.01em' }}>Laura 👋</div>
            {gameData && (() => {
              const lvl = (window.getLevelFor || (() => ({ name: 'Poler', emoji: '⚡', color: '#42A5F5' })))(gameData.xp);
              return (
                <div onClick={onGamificacion} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 6, padding: '4px 10px', borderRadius: 999, background: `${lvl.color}18`, border: `1px solid ${lvl.color}40`, cursor: 'pointer' }}>
                  <span style={{ fontSize: 13 }}>{lvl.emoji}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: lvl.color }}>{lvl.name}</span>
                  <span style={{ fontSize: 10, color: PB.ink4, fontWeight: 600 }}>·</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#FF6B35' }}>🔥 {gameData.streakWeeks}sem</span>
                </div>
              );
            })()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={onNotifs} aria-label={`Notificaciones${unread ? ` (${unread} sin leer)` : ''}`} style={{ position: 'relative', width: 42, height: 42, borderRadius: 999, border: `1px solid ${PB.line}`, background: PB.surface, display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
              <Icon name="bell" size={19} color={PB.ink2}/>
              {unread > 0 && (
                <span style={{ position: 'absolute', top: 4, right: 5, minWidth: 15, height: 15, borderRadius: 999, background: PB.danger, color: '#fff', fontSize: 9, fontWeight: 800, display: 'grid', placeItems: 'center', padding: '0 3px' }}>{unread}</span>
              )}
            </button>
            <div style={{ width: 44, height: 44, borderRadius: 999, background: `linear-gradient(135deg, ${PB.menta}, ${PB.mentaDeep})`, border: `2px solid ${PB.morado}`, display: 'grid', placeItems: 'center', color: PB.moradoInk, fontFamily: PB.font, fontWeight: 800, fontSize: 16 }}>
              LG
            </div>
          </div>
        </div>

        {/* Hero: próxima reserva real (o estado vacío) */}
        {next ? (
          <div style={{ margin: '4px 16px 16px', borderRadius: 24, padding: 20, position: 'relative',
            background: `linear-gradient(160deg, #fff 0%, #fff 60%, ${PB.mentaSoft} 140%)`,
            border: `1px solid ${PB.line}`, boxShadow: '0 18px 40px rgba(72,35,128,.14), 0 2px 6px rgba(20,19,24,.04)',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: PB.morado }}/>
            <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: 999, background: 'rgba(128,227,183,.25)', filter: 'blur(20px)' }}/>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, background: 'rgba(72,35,128,.1)', color: PB.morado }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: PB.morado }}/>
              <Eyebrow color={PB.morado}>{inProgress ? 'En curso' : next.dayLabel}</Eyebrow>
            </div>
            <h3 style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 26, letterSpacing: '-0.015em', margin: '10px 0 2px' }}>Sesión en {next.boxLabel.split(' · ')[0]}</h3>
            <div style={{ color: PB.ink3, fontSize: 14 }}>{next.startStr}h – {next.endStr}h · {next.venueName}</div>
            {!inProgress && secsTo > 0 && (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: PB.ink3 }}>Comienza en</span>
                <span style={{ fontFamily: PB.mono, fontWeight: 700, fontSize: 32, color: PB.morado, letterSpacing: '-0.02em' }}>{hh}:{mm}:{ss}</span>
              </div>
            )}
            {inProgress && (
              <div style={{ marginTop: 14, padding: '8px 12px', borderRadius: 10, background: PB.successBg, color: PB.success, fontSize: 13, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 7, height: 7, borderRadius: 999, background: PB.success }}/> Tu sesión está en curso
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, marginTop: 16, position: 'relative' }}>
              <Button onClick={onMisReservas} variant="secondary" icon="calendar" style={{ padding: '12px 14px', fontSize: 13, flex: 1 }}>Mis reservas</Button>
              <Button onClick={onOpenKey} variant="mint" icon="key" style={{ padding: '12px 14px', fontSize: 13, flex: 1 }}>Abrir llave</Button>
            </div>
          </div>
        ) : (
          <div style={{ margin: '4px 16px 16px', borderRadius: 24, padding: '26px 20px', position: 'relative',
            background: PB.surface, border: `1.5px dashed ${PB.lineStrong}`, textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: 999, background: PB.surface2, display: 'grid', placeItems: 'center', margin: '0 auto 12px' }}>
              <Icon name="calendar" size={24} color={PB.ink4}/>
            </div>
            <div style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 18, color: PB.ink }}>No tienes sesiones programadas</div>
            <div style={{ fontSize: 13, color: PB.ink3, marginTop: 4, marginBottom: 14 }}>Tu box te espera — abierto 24/7.</div>
            <Button onClick={onNewReservation} icon="plus" style={{ padding: '13px 26px', fontSize: 14 }}>Reservar ahora</Button>
          </div>
        )}

        {/* Full-width CTA */}
        <div style={{ padding: '0 16px 16px' }}>
          <Button onClick={onNewReservation} full icon="plus" style={{ padding: '18px', fontSize: 16 }}>Nueva reserva</Button>
        </div>

        {/* Bono activo widget */}
        {bono && (() => {
          const th = (window.CARD_THEMES || {})[bono.catalogId] || { bg: `linear-gradient(135deg,${PB.morado},#6a3fb8)`, accent: PB.menta };
          const remaining = bono.accesos - bono.usados;
          const pct = Math.round((bono.usados / bono.accesos) * 100);
          const urgency = bono.daysLeft <= 14 ? '#E57373' : bono.daysLeft <= 30 ? '#FFA726' : PB.success;
          return (
            <div style={{ margin: '0 16px 16px', borderRadius: 20, overflow: 'hidden', border: `1px solid ${PB.line}`, boxShadow: '0 6px 20px rgba(72,35,128,.12)' }}>
              {/* Gradient header */}
              <div style={{ background: th.bg, padding: '14px 18px 16px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', border: `1px solid ${th.accent}30`, pointerEvents: 'none' }}/>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.16em', color: `${th.accent}cc`, textTransform: 'uppercase', marginBottom: 4 }}>Bono activo</div>
                    <div style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 17, color: '#fff', letterSpacing: '.01em' }}>{bono.name}</div>
                    <div style={{ fontSize: 11, color: th.accent, marginTop: 3, fontWeight: 700, letterSpacing: '.06em' }}>{bono.min} MIN POR SESIÓN</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: PB.mono, fontWeight: 800, fontSize: 28, color: '#fff', lineHeight: 1 }}>{remaining}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,.6)', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', marginTop: 2 }}>accesos</div>
                  </div>
                </div>
                {/* Progress bar */}
                <div style={{ marginTop: 12, height: 5, borderRadius: 999, background: 'rgba(255,255,255,.15)' }}>
                  <div style={{ height: '100%', borderRadius: 999, width: `${pct}%`, background: th.accent, transition: 'width .4s' }}/>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,.5)' }}>{bono.usados} usados</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,.5)' }}>{bono.accesos} total</div>
                </div>
              </div>

              {/* White footer */}
              <div style={{ background: PB.surface, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="calendar" size={14} color={urgency}/>
                  <span style={{ fontSize: 12, color: urgency, fontWeight: 700 }}>Caduca en {bono.daysLeft} días</span>
                  {extras > 0 && (
                    <button onClick={onMisBonos} style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', fontSize: 12, color: PB.morado, fontWeight: 700, marginLeft: 6 }}>
                      +{extras} más →
                    </button>
                  )}
                </div>
                <button onClick={() => onReservarConBono && onReservarConBono(bono)} style={{
                  padding: '9px 16px', borderRadius: 12, border: 0,
                  background: PB.morado, color: '#fff',
                  fontFamily: PB.font, fontWeight: 700, fontSize: 13, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                  boxShadow: '0 4px 12px rgba(72,35,128,.28)',
                }}>
                  <Icon name="key" size={13} color="#fff"/> Reservar con bono
                </button>
              </div>
            </div>
          );
        })()}

        {/* Course progress widget */}
        {userCurso && window.COURSE_CATALOG && (() => {
          const course = window.COURSE_CATALOG.find(c => c.id === userCurso.courseId);
          if (!course) return null;
          const doneSet = new Set(userCurso.completedLessons || []);
          const nextLesson = course.lessons.find(l => !doneSet.has(l.n)) || null;
          const pct = Math.round((doneSet.size / course.classes) * 100);
          return (
            <div style={{ margin: '0 16px 16px', borderRadius: 20, overflow: 'hidden',
              border: `1px solid ${PB.line}`, boxShadow: '0 6px 20px rgba(20,19,24,.06)' }}>
              <div style={{ background: course.bg, padding: '14px 18px 16px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '5%', right: '14%', bottom: '5%', width: 4,
                  background: 'rgba(255,255,255,.28)', borderRadius: 2,
                  boxShadow: `0 0 18px ${course.accent}` }}/>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.16em',
                      color: `${course.accent}bb`, textTransform: 'uppercase', marginBottom: 3 }}>Tu curso online</div>
                    <div style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 16, color: '#fff' }}>{course.name}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontFamily: PB.mono, fontWeight: 800, fontSize: 26, color: '#fff', lineHeight: 1 }}>{doneSet.size}</span>
                    <span style={{ fontFamily: PB.mono, fontWeight: 700, fontSize: 14, color: 'rgba(255,255,255,.4)' }}>/{course.classes}</span>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,.45)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em' }}>clases</div>
                  </div>
                </div>
                <div style={{ marginTop: 12, height: 4, borderRadius: 999, background: 'rgba(255,255,255,.15)' }}>
                  <div style={{ height: '100%', width: `${pct}%`, borderRadius: 999, background: course.accent, transition: 'width .4s' }}/>
                </div>
              </div>
              {nextLesson && (
                <div style={{ background: PB.surface, padding: '12px 16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, color: PB.ink3, fontWeight: 600 }}>Siguiente clase</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: PB.ink, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {nextLesson.n}. {nextLesson.title}
                    </div>
                  </div>
                  <button onClick={onCursos} style={{
                    flexShrink: 0, padding: '9px 14px', borderRadius: 12, border: 0,
                    background: PB.morado, color: '#fff',
                    fontFamily: PB.font, fontWeight: 700, fontSize: 12, cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(72,35,128,.28)',
                  }}>Ver clase →</button>
                </div>
              )}
              {!nextLesson && (
                <div style={{ background: PB.successBg, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon name="check" size={16} color={PB.success}/>
                  <span style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 13, color: PB.success }}>¡Curso completado! Repasa cuando quieras.</span>
                </div>
              )}
            </div>
          );
        })()}

        {/* Sin bono: CTA al catálogo */}
        {!bono && (
          <div onClick={onComprarBono} style={{ margin: '0 16px 16px', padding: '16px 18px', borderRadius: 18, cursor: 'pointer',
            background: 'linear-gradient(140deg, #3e1478 0%, #1f0844 100%)', color: '#fff',
            display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 10px 26px rgba(72,35,128,.3)' }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(201,168,255,.2)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <Icon name="sparkle" size={22} color="#c9a8ff"/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 15 }}>Ahorra hasta un 40% con un bono</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.7)', marginTop: 2 }}>Desde 12 €/sesión · válido en todas las sedes</div>
            </div>
            <Icon name="chevron" size={18} color="#c9a8ff"/>
          </div>
        )}

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
              <button onClick={onNewReservation} aria-label={`Volver a reservar ${r.n}`} style={{ width: 40, height: 40, borderRadius: 999, border: 0, background: PB.morado, color: '#fff', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
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
          <button onClick={onStore} style={{ background: PB.menta, color: PB.moradoInk, border: 0, borderRadius: 999, padding: '8px 14px', fontFamily: PB.font, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>Tienda</button>
        </div>
      </div>
      <TabBar active="home"/>
    </>
  );
};

window.Screen2Dashboard = Screen2Dashboard;
