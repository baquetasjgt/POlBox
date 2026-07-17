// POLEBOX — Gamificación: progresión, logros y ranking

const LEVELS = [
  { name: 'Principiante', min: 0,    max: 199,  color: '#9E9E9E', emoji: '🌱', cardBg: 'linear-gradient(140deg,#2a2a2a,#141414)' },
  { name: 'Poler',        min: 200,  max: 499,  color: '#42A5F5', emoji: '⚡', cardBg: 'linear-gradient(140deg,#0d2a4a,#071828)' },
  { name: 'Power Poler',  min: 500,  max: 999,  color: '#c9a8ff', emoji: '💜', cardBg: 'linear-gradient(140deg,#3e1478,#1f0844)' },
  { name: 'POLEBOX Pro',  min: 1000, max: 2499, color: '#FF9800', emoji: '🔥', cardBg: 'linear-gradient(140deg,#6B3A00,#3D2100)', gift: 'Camiseta POLEBOX + grip exclusivo' },
  { name: 'Legend',       min: 2500, max: 99999,color: '#E8B800', emoji: '👑', cardBg: 'linear-gradient(140deg,#3D2E00,#201800)', gift: 'Pack Legend: equipación completa + acceso VIP' },
];
const getLevelFor = (xp) => LEVELS.slice().reverse().find(l => xp >= l.min) || LEVELS[0];
window.LEVELS = LEVELS;
window.getLevelFor = getLevelFor;

window.BADGES = null; // se asigna tras la declaración
const BADGES = [
  { id: 'primera-sesion', name: 'Primera sesión',   emoji: '🎯', xp: 50,  desc: 'Completaste tu primera sesión' },
  { id: 'semana-1',       name: 'Racha 1 semana',   emoji: '🔥', xp: 30,  desc: 'Mantuviste 1 semana de racha' },
  { id: 'semana-3',       name: 'Racha 3 semanas',  emoji: '🔥', xp: 75,  desc: '3 semanas seguidas entrenando' },
  { id: 'semana-6',       name: 'Racha 6 semanas',  emoji: '⚡', xp: 150, desc: '6 semanas seguidas entrenando' },
  { id: 'semana-12',      name: 'Racha 12 semanas', emoji: '💥', xp: 300, desc: '3 meses de racha seguidos' },
  { id: '10-sesiones',    name: '10 sesiones',      emoji: '💪', xp: 100, desc: '10 sesiones completadas' },
  { id: '25-sesiones',    name: '25 sesiones',      emoji: '🏆', xp: 200, desc: '25 sesiones completadas' },
  { id: '50-sesiones',    name: '50 sesiones',      emoji: '⭐', xp: 400, desc: '50 sesiones completadas' },
  { id: '100-sesiones',   name: 'Centenaria',       emoji: '💎', xp: 800, desc: '100 sesiones completadas' },
  { id: 'madrugadora',    name: 'Madrugadora',      emoji: '🌅', xp: 50,  desc: 'Reservaste una sesión de mañanas' },
  { id: 'primer-bono',    name: 'Primer bono',      emoji: '🎁', xp: 75,  desc: 'Compraste tu primer bono de acceso' },
  { id: 'referida-1',     name: 'Embajadora',       emoji: '👥', xp: 100, desc: 'Invitaste a tu primera amiga' },
  { id: 'referida-5',     name: 'Influencer',       emoji: '🌟', xp: 300, desc: 'Invitaste a 5 amigas a POLEBOX' },
  { id: '3-sedes',        name: 'Viajera',          emoji: '🗺️', xp: 150, desc: 'Entrenaste en 3 sedes distintas' },
  { id: 'top-20',         name: 'Top 20',           emoji: '🎪', xp: 500, desc: 'Alcanzaste el top 20 del ranking' },
  { id: 'sesion-libre',   name: 'Primera libre',    emoji: '🎉', xp: 100, desc: 'Ganaste tu primera sesión gratis' },
];

window.BADGES = BADGES;

const RANKING = [
  { rank:  1, name: 'Ana Martínez',     initials: 'AM', xp: 4820, levelName: 'Legend' },
  { rank:  2, name: 'Sara López',       initials: 'SL', xp: 4210, levelName: 'Legend' },
  { rank:  3, name: 'María García',     initials: 'MG', xp: 3980, levelName: 'Legend' },
  { rank:  4, name: 'Lucía Fernández',  initials: 'LF', xp: 3450, levelName: 'Legend' },
  { rank:  5, name: 'Elena Ruiz',       initials: 'ER', xp: 3120, levelName: 'Legend' },
  { rank:  6, name: 'Marta Sánchez',    initials: 'MS', xp: 2880, levelName: 'Legend' },
  { rank:  7, name: 'Laura Gómez',      initials: 'LG', xp: 1250, levelName: 'POLEBOX Pro', isMe: true },
  { rank:  8, name: 'Carmen Díaz',      initials: 'CD', xp: 1180, levelName: 'POLEBOX Pro' },
  { rank:  9, name: 'Isabel Torres',    initials: 'IT', xp: 1050, levelName: 'POLEBOX Pro' },
  { rank: 10, name: 'Patricia Vega',    initials: 'PV', xp:  980, levelName: 'Power Poler' },
  { rank: 11, name: 'Raquel Moreno',    initials: 'RM', xp:  920, levelName: 'Power Poler' },
  { rank: 12, name: 'Cristina Gil',     initials: 'CG', xp:  870, levelName: 'Power Poler' },
  { rank: 13, name: 'Beatriz Jiménez',  initials: 'BJ', xp:  810, levelName: 'Power Poler' },
  { rank: 14, name: 'Paula Romero',     initials: 'PR', xp:  760, levelName: 'Power Poler' },
  { rank: 15, name: 'Silvia Herrero',   initials: 'SH', xp:  710, levelName: 'Power Poler' },
  { rank: 16, name: 'Nuria Molina',     initials: 'NM', xp:  680, levelName: 'Power Poler' },
  { rank: 17, name: 'Alicia Cano',      initials: 'AC', xp:  630, levelName: 'Power Poler' },
  { rank: 18, name: 'Rosa Campos',      initials: 'RC', xp:  590, levelName: 'Power Poler' },
  { rank: 19, name: 'Victoria Rubio',   initials: 'VR', xp:  550, levelName: 'Power Poler' },
  { rank: 20, name: 'Andrea Castro',    initials: 'AC', xp:  510, levelName: 'Power Poler' },
  { rank: 21, name: 'Noelia Ramos',     initials: 'NR', xp:  480, levelName: 'Poler' },
  { rank: 22, name: 'Pilar Ortega',     initials: 'PO', xp:  450, levelName: 'Poler' },
  { rank: 23, name: 'Irene Vargas',     initials: 'IV', xp:  420, levelName: 'Poler' },
  { rank: 24, name: 'Claudia Reyes',    initials: 'CR', xp:  390, levelName: 'Poler' },
  { rank: 25, name: 'Laura Blanco',     initials: 'LB', xp:  360, levelName: 'Poler' },
];

const ScreenGamificacion = ({ onBack, gameData }) => {
  const [tab, setTab] = React.useState('progreso');

  const g = gameData || {
    xp: 1250, totalSessions: 17, streakWeeks: 4, streakDays: 3,
    unlockedBadges: ['primera-sesion','semana-1','semana-3','10-sesiones','madrugadora','primer-bono','referida-1'],
    referrals: 2, rank: 7,
  };

  const level    = getLevelFor(g.xp);
  const levelIdx = LEVELS.indexOf(level);
  const nextLvl  = LEVELS[levelIdx + 1];
  const xpInLvl  = g.xp - level.min;
  const xpRange  = nextLvl ? nextLvl.min - level.min : 1;
  const pct      = nextLvl ? Math.min((xpInLvl / xpRange) * 100, 100) : 100;

  const FREE_MILESTONE = 20;
  const freePct      = ((g.totalSessions % FREE_MILESTONE) / FREE_MILESTONE) * 100;
  const freeEarned   = Math.floor(g.totalSessions / FREE_MILESTONE);
  const freeToNext   = FREE_MILESTONE - (g.totalSessions % FREE_MILESTONE);

  return (
    <>
      <StatusBar/>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 30 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 16px', position: 'relative' }}>
          <button onClick={onBack} style={{ position: 'absolute', left: 16, width: 40, height: 40, borderRadius: 12, border: `1px solid ${PB.line}`, background: PB.surface, display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
            <Icon name="back" size={18}/>
          </button>
          <h3 style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 18, letterSpacing: '-0.01em', margin: 0 }}>Mi progresión</h3>
        </div>

        {/* Tabs */}
        <div style={{ padding: '4px 16px 16px' }}>
          <div style={{ display: 'flex', gap: 4, padding: 4, background: PB.surface2, borderRadius: 14 }}>
            {[{ id: 'progreso', label: '⚡ Progreso' }, { id: 'logros', label: '🏆 Logros' }, { id: 'ranking', label: '🏅 Ranking' }].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                flex: 1, padding: '10px 4px', borderRadius: 10, border: 0, cursor: 'pointer',
                background: tab === t.id ? PB.surface : 'transparent',
                boxShadow: tab === t.id ? '0 1px 3px rgba(20,19,24,.08)' : 'none',
                color: tab === t.id ? PB.ink : PB.ink3,
                fontFamily: PB.font, fontWeight: 700, fontSize: 12,
              }}>{t.label}</button>
            ))}
          </div>
        </div>

        {/* ─── PROGRESO ─── */}
        {tab === 'progreso' && (
          <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Level hero card */}
            <div style={{ borderRadius: 20, overflow: 'hidden', background: level.cardBg, boxShadow: `0 16px 40px ${level.color}30, 0 4px 12px rgba(0,0,0,.35)`, position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-30%', left: '40%', right: '-10%', bottom: '-30%', background: `radial-gradient(ellipse, ${level.color}15, transparent 70%)`, pointerEvents: 'none' }}/>
              <div style={{ padding: '20px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.18em', color: `${level.color}bb`, textTransform: 'uppercase', marginBottom: 6 }}>Nivel actual</div>
                    <div style={{ fontSize: 40, lineHeight: 1, marginBottom: 4 }}>{level.emoji}</div>
                    <div style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 22, color: '#fff', letterSpacing: '-.01em' }}>{level.name}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: PB.mono, fontWeight: 800, fontSize: 36, color: '#fff', letterSpacing: '-.02em', lineHeight: 1 }}>{g.xp.toLocaleString('es-ES')}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,.5)', fontWeight: 700, marginTop: 3, letterSpacing: '.1em' }}>XP TOTAL</div>
                  </div>
                </div>
                {nextLvl ? (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,.15)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 999, width: `${pct}%`, background: level.color }}/>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10, color: 'rgba(255,255,255,.45)', fontWeight: 600 }}>
                      <span>{g.xp.toLocaleString('es-ES')} XP</span>
                      <span>{nextLvl.min.toLocaleString('es-ES')} XP → {nextLvl.name}</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ marginTop: 12, padding: '6px 12px', borderRadius: 10, background: 'rgba(255,255,255,.1)', fontSize: 11, color: level.color, fontWeight: 700, textAlign: 'center' }}>
                    👑 Has alcanzado el nivel máximo
                  </div>
                )}
              </div>
              {level.gift && (
                <div style={{ margin: '0 16px 16px', padding: '10px 14px', borderRadius: 14, background: 'rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 22 }}>🎁</span>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 800, color: level.color, letterSpacing: '.1em', textTransform: 'uppercase' }}>Regalo desbloqueado</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,.8)', marginTop: 2 }}>{level.gift}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Racha */}
            <div style={{ background: PB.surface, border: `1px solid ${PB.line}`, borderRadius: 18, padding: '16px 18px' }}>
              <Eyebrow>Racha de entrenamiento</Eyebrow>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', margin: '10px 0 14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontFamily: PB.mono, fontWeight: 800, fontSize: 36, color: '#FF6B35', lineHeight: 1 }}>{g.streakWeeks}</span>
                    <span style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 14, color: PB.ink3 }}>semanas</span>
                  </div>
                  <div style={{ fontSize: 12, color: PB.ink3, marginTop: 2 }}>{g.streakDays} días esta semana</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: PB.ink4, fontWeight: 600, marginBottom: 6, textAlign: 'right' }}>Esta semana</div>
                  <div style={{ display: 'flex', gap: 5 }}>
                    {['L','M','X','J','V','S','D'].map((d, i) => {
                      const done = i < g.streakDays;
                      return (
                        <div key={d} style={{ width: 26, height: 26, borderRadius: 8, background: done ? '#FF6B35' : PB.surface2, border: `1px solid ${done ? '#FF6B35' : PB.line}`, display: 'grid', placeItems: 'center', fontSize: done ? 12 : 9, color: done ? '#fff' : PB.ink4, fontWeight: 700 }}>
                          {done ? '🔥' : d}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div style={{ padding: '8px 12px', borderRadius: 12, background: '#FFF5F0', fontSize: 12, color: '#C45200', fontWeight: 600 }}>
                🔥 ¡{g.streakWeeks} semanas seguidas! Entrena esta semana para mantener la racha.
              </div>
            </div>

            {/* Sesión libre cada 20 */}
            <div style={{ background: PB.surface, border: `1px solid ${PB.line}`, borderRadius: 18, padding: '16px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <Eyebrow>Sesión gratis</Eyebrow>
                <span style={{ fontFamily: PB.mono, fontWeight: 800, fontSize: 13, color: PB.ink }}>{g.totalSessions % FREE_MILESTONE} <span style={{ color: PB.ink3, fontWeight: 600 }}>/ {FREE_MILESTONE}</span></span>
              </div>
              <div style={{ height: 8, borderRadius: 999, background: PB.surface2, overflow: 'hidden', marginBottom: 8 }}>
                <div style={{ height: '100%', width: `${freePct}%`, borderRadius: 999, background: `linear-gradient(90deg, ${PB.morado}, ${PB.mentaDeep})` }}/>
              </div>
              <div style={{ fontSize: 12, color: PB.ink3, lineHeight: 1.5 }}>
                {freeEarned > 0
                  ? <><strong style={{ color: PB.success }}>🎉 {freeEarned} sesión{freeEarned > 1 ? 'es' : ''} gratis ganada{freeEarned > 1 ? 's' : ''}</strong> · Te faltan {freeToNext} para la siguiente.</>
                  : <>Te faltan <strong style={{ color: PB.ink }}>{freeToNext} sesiones</strong> para tu primera sesión gratis.</>}
              </div>
            </div>

            {/* Referidos */}
            <div style={{ background: PB.surface, border: `1px solid ${PB.line}`, borderRadius: 18, padding: '16px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <Eyebrow>Invita y gana</Eyebrow>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginTop: 4 }}>
                    <span style={{ fontFamily: PB.mono, fontWeight: 800, fontSize: 28, color: PB.ink }}>{g.referrals}</span>
                    <span style={{ fontFamily: PB.font, fontWeight: 600, fontSize: 13, color: PB.ink3 }}>de 5 amigas</span>
                  </div>
                </div>
                <div style={{ padding: '5px 12px', borderRadius: 10, background: PB.surface2, border: `1px solid ${PB.line}`, fontFamily: PB.mono, fontWeight: 700, fontSize: 11, color: PB.ink2, letterSpacing: '.06em' }}>
                  PB-LAURA-042
                </div>
              </div>

              <div style={{ height: 6, borderRadius: 999, background: PB.surface2, overflow: 'hidden', marginBottom: 12 }}>
                <div style={{ height: '100%', width: `${(g.referrals / 5) * 100}%`, borderRadius: 999, background: PB.morado }}/>
              </div>

              {[
                { label: 'Por cada amiga que se une', reward: '+1 acceso + 100 XP', done: g.referrals >= 1 },
                { label: '5 amigas referidas',        reward: '🎁 Regalo de tienda',  done: g.referrals >= 5 },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderTop: `1px solid ${PB.line}` }}>
                  <div style={{ width: 28, height: 28, borderRadius: 999, background: s.done ? PB.successBg : PB.surface2, border: `1px solid ${s.done ? PB.success : PB.line}`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    {s.done ? <Icon name="check" size={13} color={PB.success}/> : <span style={{ fontFamily: PB.mono, fontWeight: 800, fontSize: 10, color: PB.ink3 }}>{i + 1}</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: PB.ink }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: s.done ? PB.success : PB.ink3, fontWeight: 600, marginTop: 1 }}>{s.reward}</div>
                  </div>
                </div>
              ))}

              <button style={{ marginTop: 12, width: '100%', padding: '12px', borderRadius: 12, border: `1.5px solid ${PB.morado}`, background: 'transparent', fontFamily: PB.font, fontWeight: 700, fontSize: 13, color: PB.morado, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Icon name="profile" size={15} color={PB.morado}/> Compartir código de invitación
              </button>
            </div>
          </div>
        )}

        {/* ─── LOGROS ─── */}
        {tab === 'logros' && (
          <div style={{ padding: '0 16px' }}>
            <div style={{ fontSize: 12, color: PB.ink3, marginBottom: 14, fontWeight: 600 }}>
              {g.unlockedBadges.length} de {BADGES.length} logros desbloqueados
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
              {BADGES.map(b => {
                const unlocked = g.unlockedBadges.includes(b.id);
                return (
                  <div key={b.id} style={{ background: PB.surface, border: `1px solid ${PB.line}`, borderRadius: 16, padding: '14px 10px', textAlign: 'center', opacity: unlocked ? 1 : 0.4, position: 'relative' }}>
                    {unlocked && (
                      <div style={{ position: 'absolute', top: -5, right: -5, width: 16, height: 16, borderRadius: 999, background: PB.success, display: 'grid', placeItems: 'center' }}>
                        <Icon name="check" size={9} color="#fff"/>
                      </div>
                    )}
                    <div style={{ fontSize: 26, marginBottom: 6 }}>{b.emoji}</div>
                    <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 11, color: PB.ink, lineHeight: 1.3 }}>{b.name}</div>
                    <div style={{ fontFamily: PB.mono, fontWeight: 700, fontSize: 10, color: unlocked ? PB.success : PB.ink4, marginTop: 5 }}>
                      +{b.xp} XP
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── RANKING ─── */}
        {tab === 'ranking' && (
          <div style={{ padding: '0 16px' }}>

            {/* Exhibition banner */}
            <div style={{ marginBottom: 14, borderRadius: 18, overflow: 'hidden', background: 'linear-gradient(135deg,#1d0840,#3e1478)', padding: '18px 18px 16px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', border: '1px solid rgba(255,255,255,.1)', pointerEvents: 'none' }}/>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🎪</div>
              <div style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 16, color: '#fff', marginBottom: 6 }}>Evento anual de exhibición</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.75)', lineHeight: 1.6, marginBottom: 12 }}>
                Las <strong style={{ color: PB.menta }}>20 primeras del ranking</strong> tienen plaza reservada en el evento anual de exhibición de pole dance organizado por POLEBOX.
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 999, background: PB.successBg, fontSize: 11, color: PB.success, fontWeight: 700 }}>
                <Icon name="check" size={12} color={PB.success}/> Estás en el puesto #{g.rank} — ¡dentro del top 20!
              </div>
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {RANKING.map(u => {
                const medal  = ['🥇','🥈','🥉'][u.rank - 1];
                const rColor = [null,'#FFD700','#C0C0C0','#CD7F32'][u.rank] || null;
                const lvl    = LEVELS.find(l => l.name === u.levelName) || LEVELS[0];
                const inTop20 = u.rank <= 20;
                return (
                  <div key={u.rank} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                    borderRadius: 14,
                    border: `1px solid ${u.isMe ? PB.morado : PB.line}`,
                    background: u.isMe ? 'rgba(72,35,128,.06)' : PB.surface,
                    boxShadow: u.isMe ? `0 0 0 1px ${PB.morado}` : 'none',
                  }}>
                    <div style={{ width: 26, textAlign: 'center', fontFamily: PB.mono, fontWeight: 800, fontSize: medal ? 16 : 12, color: rColor || (inTop20 ? PB.ink2 : PB.ink4), flexShrink: 0 }}>
                      {medal || u.rank}
                    </div>
                    <div style={{ width: 36, height: 36, borderRadius: 999, background: `${lvl.color}25`, border: `2px solid ${lvl.color}`, display: 'grid', placeItems: 'center', fontFamily: PB.font, fontWeight: 800, fontSize: 12, color: lvl.color, flexShrink: 0 }}>
                      {u.initials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: PB.font, fontWeight: u.isMe ? 800 : 600, fontSize: 13, color: PB.ink, display: 'flex', alignItems: 'center', gap: 6 }}>
                        {u.name}
                        {u.isMe && <span style={{ fontSize: 9, fontWeight: 800, color: PB.morado, background: 'rgba(72,35,128,.1)', padding: '2px 6px', borderRadius: 999, letterSpacing: '.08em' }}>TÚ</span>}
                      </div>
                      <div style={{ fontSize: 10, color: lvl.color, fontWeight: 700, marginTop: 2 }}>{u.levelName}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontFamily: PB.mono, fontWeight: 700, fontSize: 12, color: PB.ink }}>{u.xp.toLocaleString('es-ES')} XP</div>
                      {!inTop20 && <div style={{ fontSize: 9, color: PB.ink4, marginTop: 1 }}>fuera del top 20</div>}
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

window.ScreenGamificacion = ScreenGamificacion;
