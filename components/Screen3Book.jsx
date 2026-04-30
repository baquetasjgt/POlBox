// POLEBOX — Screen 3: Calendar / Book (duration-first funnel, anti-gap slots)

const Screen3Book = ({ onBack, onPay, selectedBono }) => {
  const [dayIdx, setDayIdx] = React.useState(0);
  const [boxIdx, setBoxIdx] = React.useState(0);
  const [duration, setDuration] = React.useState(selectedBono?.min ?? 90);
  const [startMin, setStartMin] = React.useState(null);

  // 10 días a partir de hoy
  const days = React.useMemo(() => {
    const dowShort = ['DOM','LUN','MAR','MIÉ','JUE','VIE','SÁB'];
    const today = new Date();
    return Array.from({ length: 10 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return { d: dowShort[d.getDay()], n: d.getDate(), isToday: i === 0 };
    });
  }, []);

  // Bloques de duración
  const allDurations = [
    { min: 45,  price: 12, label: '45 min', tag: 'Repaso rápido' },
    { min: 60,  price: 15, label: '60 min', tag: 'Sesión estándar' },
    { min: 90,  price: 20, label: '90 min', tag: 'Recomendado', featured: true },
    { min: 120, price: 25, label: '120 min', tag: 'Modo máster' },
  ];
  const durations = selectedBono ? allDurations.filter(d => d.min === selectedBono.min) : allDurations;
  const current = allDurations.find(d => d.min === duration);

  // Reservas existentes del día (min from 00:00) — por box
  // Box 0: 10:00–11:00, 12:00–13:30, 17:00–18:00
  // Box 1: 11:00–12:30, 15:00–16:00, 19:00–20:30
  const existingByBox = [
    [ {s: 600,  e: 660}, {s: 720,  e: 810},  {s: 1020, e: 1080} ],
    [ {s: 660,  e: 750}, {s: 900,  e: 960},  {s: 1140, e: 1230} ],
  ];
  const existing = existingByBox[boxIdx];

  // Ventana operativa: 10:00 a 23:00
  const OPEN = 600, CLOSE = 1380;

  // ─── Anti-gap slot generator ─────────────────────────────
  // Candidato válido de arranque si:
  //  a) pegado a una reserva anterior (= end de otra) o al OPEN,
  //  b) su fin está pegado a una reserva posterior (= start de otra) o al CLOSE,
  //  c) cae en :00 o :30 (ritmo del grid),
  // y no pisa ninguna reserva.
  const candidates = React.useMemo(() => {
    const starts = new Set();
    // Anclas "pegadas": inicios pegados a algo → no genera hueco previo
    starts.add(OPEN);
    existing.forEach(r => starts.add(r.e));
    // Extra: cada :00 y :30 entre OPEN y CLOSE (se filtra abajo si crea huecos)
    for (let t = OPEN; t <= CLOSE - duration; t += 30) starts.add(t);

    const list = [];
    [...starts].sort((a,b) => a-b).forEach(s => {
      const e = s + duration;
      if (s < OPEN || e > CLOSE) return;
      // no solapa con existentes
      if (existing.some(r => !(e <= r.s || s >= r.e))) return;
      // gap-previo: o empieza en OPEN, o en end de alguna reserva, o en una ancla :00/:30 permitida (sin crear gap <30 min contra reserva previa)
      const prev = existing.filter(r => r.e <= s).sort((a,b) => b.e - a.e)[0];
      const prevEnd = prev ? prev.e : OPEN;
      const gapBefore = s - prevEnd;
      if (gapBefore > 0 && gapBefore < 30) return; // hueco muerto <30 min ⇒ oculto
      // gap-posterior
      const next = existing.filter(r => r.s >= e).sort((a,b) => a.s - b.s)[0];
      const nextStart = next ? next.s : CLOSE;
      const gapAfter = nextStart - e;
      if (gapAfter > 0 && gapAfter < 30) return;
      list.push(s);
    });
    return list;
  }, [duration, boxIdx]);

  // Si cambia la duración/box y el slot ya no es válido → reset
  React.useEffect(() => {
    if (startMin != null && !candidates.includes(startMin)) setStartMin(null);
    if (startMin == null && candidates.length) {
      // Preferimos 18:00 si está, si no el primero por la tarde (≥16:00)
      const tarde = candidates.find(s => s === 1080) ?? candidates.find(s => s >= 960) ?? candidates[0];
      setStartMin(tarde);
    }
  }, [candidates]); // eslint-disable-line

  const fmt = (m) => `${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;
  const endMin = startMin != null ? startMin + duration : null;

  return (
    <>
      <StatusBar/>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 230 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px 12px' }}>
          <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: 12, border: `1px solid ${PB.line}`, background: PB.surface, display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
            <Icon name="back" size={18}/>
          </button>
          <h3 style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 20, letterSpacing: '-0.01em', margin: 0 }}>Nueva reserva</h3>
        </div>

        {/* Banner bono activo */}
        {selectedBono && (
          <div style={{ margin: '0 16px 12px', padding: '11px 14px', borderRadius: 14, background: PB.mentaSoft, border: `1px solid ${PB.mentaDeep}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="sparkle" size={16} color={PB.morado}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 13, color: PB.moradoInk }}>Reservando con {selectedBono.name}</div>
              <div style={{ fontSize: 11, color: PB.morado, marginTop: 1 }}>{selectedBono.accesos - selectedBono.usados} accesos disponibles · {selectedBono.min} min</div>
            </div>
          </div>
        )}

        {/* Day strip */}
        <div style={{ padding: '2px 16px 12px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: PB.ink3, marginBottom: 8 }}>1 · Día</div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {days.map((d, i) => {
              const active = i === dayIdx;
              return (
                <button key={i} onClick={() => setDayIdx(i)} style={{
                  flexShrink: 0, width: 58, padding: '12px 0', borderRadius: 16,
                  border: `1px solid ${active ? PB.morado : PB.line}`,
                  background: active ? PB.morado : PB.surface, color: active ? '#fff' : PB.ink,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer',
                  boxShadow: active ? '0 6px 16px rgba(72,35,128,.25)' : 'none',
                  position: 'relative',
                }}>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', opacity: active ? .8 : .7 }}>{d.isToday ? 'HOY' : d.d}</span>
                  <span style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 18 }}>{d.n}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Box tabs */}
        <div style={{ padding: '4px 16px 14px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: PB.ink3, marginBottom: 8 }}>2 · Box</div>
          <div style={{ display: 'flex', gap: 6, padding: 4, background: PB.surface2, borderRadius: 14 }}>
            {['BOX 1 · Industrial', 'BOX 2 · Neón'].map((b, i) => (
              <button key={i} onClick={() => setBoxIdx(i)} style={{
                flex: 1, padding: '10px 12px', borderRadius: 10, border: 0,
                background: boxIdx === i ? PB.surface : 'transparent',
                boxShadow: boxIdx === i ? '0 1px 3px rgba(20,19,24,.08)' : 'none',
                color: boxIdx === i ? PB.ink : PB.ink3, fontFamily: PB.font, fontWeight: 700, fontSize: 13, cursor: 'pointer',
              }}>{b}</button>
            ))}
          </div>
        </div>

        {/* Duración */}
        <div style={{ padding: '4px 16px 8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: PB.ink3 }}>
            3 · {selectedBono ? `Duración del bono · ${selectedBono.min} min` : '¿Cuánto vas a entrenar?'}
          </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {durations.map(d => {
              const on = d.min === duration;
              const feat = d.featured;
              return (
                <button key={d.min} onClick={() => setDuration(d.min)} style={{
                  position: 'relative', textAlign: 'left', cursor: 'pointer',
                  padding: '14px 14px 14px 16px', borderRadius: 18,
                  border: `1.5px solid ${on ? PB.morado : (feat ? 'rgba(72,35,128,.28)' : PB.line)}`,
                  background: on ? PB.morado : (feat ? 'rgba(72,35,128,.04)' : PB.surface),
                  color: on ? '#fff' : PB.ink,
                  boxShadow: on ? '0 10px 22px rgba(72,35,128,.22)' : 'none',
                  transition: 'all 220ms cubic-bezier(.2,.7,.2,1)',
                }}>
                  {feat && !on && (
                    <span style={{ position: 'absolute', top: -9, left: 14, padding: '3px 8px', borderRadius: 999,
                      background: PB.menta, color: PB.moradoInk, fontSize: 10, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase' }}>
                      Recomendado
                    </span>
                  )}
                  {feat && on && (
                    <span style={{ position: 'absolute', top: -9, left: 14, padding: '3px 8px', borderRadius: 999,
                      background: PB.menta, color: PB.moradoInk, fontSize: 10, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase' }}>
                      Recomendado
                    </span>
                  )}
                  <div style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 22, letterSpacing: '-0.01em' }}>{d.label}</div>
                  <div style={{ fontSize: 12, marginTop: 2, opacity: on ? .85 : .7, color: on ? '#fff' : PB.ink3 }}>{d.tag}</div>
                  <div style={{ marginTop: 10, fontFamily: PB.mono, fontWeight: 700, fontSize: 16,
                    color: on ? '#fff' : PB.morado }}>{d.price},00 €</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Horas de inicio — anti-gap */}
        <div style={{ padding: '18px 16px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: PB.ink3 }}>4 · Elige tu hora de inicio</div>
          <Eyebrow>{candidates.length} libres</Eyebrow>
        </div>
        <div style={{ padding: '4px 16px 0', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {candidates.map(s => {
            const sel = s === startMin;
            return (
              <button key={s} onClick={() => setStartMin(s)} style={{
                padding: '14px 0', borderRadius: 12,
                border: `1px solid ${sel ? PB.morado : 'transparent'}`,
                background: sel ? PB.morado : PB.surface,
                color: sel ? '#fff' : PB.ink,
                fontFamily: PB.mono, fontWeight: 700, fontSize: 15,
                cursor: 'pointer',
                boxShadow: sel ? '0 4px 14px rgba(72,35,128,.3)' : `inset 0 0 0 1px ${PB.line}`,
              }}>{fmt(s)}</button>
            );
          })}
        </div>
        <div style={{ padding: '10px 18px 0', fontSize: 11, color: PB.ink4, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="bolt" size={12}/> Solo mostramos horas que no dejan huecos muertos en el box.
        </div>
      </div>

      {/* Sticky payment sheet */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 16px 26px',
        borderTopLeftRadius: 28, borderTopRightRadius: 28, background: PB.surface,
        boxShadow: '0 -12px 30px rgba(20,19,24,.1)', borderTop: `1px solid ${PB.line}`,
      }}>
        {/* Flex tariff info */}
        <div style={{
          display: 'flex', gap: 10, alignItems: 'flex-start',
          padding: '10px 12px', borderRadius: 12,
          background: PB.mentaSoft, color: PB.moradoInk, marginBottom: 12,
        }}>
          <div style={{ width: 24, height: 24, borderRadius: 999, background: PB.menta, color: PB.moradoInk,
            display: 'grid', placeItems: 'center', flexShrink: 0, fontWeight: 800, fontSize: 13 }}>i</div>
          <div style={{ fontSize: 11.5, lineHeight: 1.4 }}>
            <strong style={{ fontWeight: 800 }}>Si estás en racha, sigue.</strong> A partir de las <span style={{ fontFamily: PB.mono, fontWeight: 700 }}>{endMin != null ? fmt(endMin) : '—'}h</span> se aplica la tarifa <strong>Flex</strong> <span style={{ fontFamily: PB.mono, fontWeight: 700 }}>0,20 €/min</span>. Solo si la sala sigue libre y hasta que salgas.
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: PB.ink3 }}>Tu reserva</div>
            <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 14, marginTop: 2 }}>
              {days[dayIdx].isToday ? 'Hoy' : days[dayIdx].d} {days[dayIdx].n} · {startMin != null ? `${fmt(startMin)} – ${fmt(endMin)}h` : '— selecciona hora'}
            </div>
          </div>
          <div style={{ fontFamily: PB.mono, fontWeight: 700, fontSize: 22, color: PB.ink }}>{current.price},00&nbsp;€</div>
        </div>
        <Button onClick={startMin != null ? () => onPay({
          dayLabel: (days[dayIdx].isToday ? 'Hoy' : days[dayIdx].d) + ' ' + days[dayIdx].n,
          startMin, endMin, duration, boxIdx, price: current.price,
          startStr: fmt(startMin), endStr: fmt(endMin),
        }) : undefined} full icon="arrow" style={{
          padding: '18px', fontSize: 16,
          opacity: startMin != null ? 1 : .45,
          cursor: startMin != null ? 'pointer' : 'not-allowed',
        }}>
          Reservar ahora
        </Button>
      </div>
    </>
  );
};

window.Screen3Book = Screen3Book;
