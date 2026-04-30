// POLEBOX — Catálogo de bonos de acceso

const BONO_CATALOG = [
  { id: 'b5-60',   name: 'Bono Inicio',      accesos: 5,  min: 60, price: 69,  perAcceso: 13.80, saving: 21, caducidadDias: 60 },
  { id: 'b5-90',   name: 'Bono Inicio Pro',  accesos: 5,  min: 90, price: 89,  perAcceso: 17.80, saving: 19, caducidadDias: 60 },
  { id: 'b10-60',  name: 'Bono Mensual',     accesos: 10, min: 60, price: 120, perAcceso: 12.00, saving: 33, caducidadDias: 90, popular: true },
  { id: 'b10-90',  name: 'Bono Mensual Pro', accesos: 10, min: 90, price: 149, perAcceso: 14.90, saving: 32, caducidadDias: 90 },
  { id: 'b10-90m', name: 'Bono Mañanas',     accesos: 10, min: 90, price: 132, perAcceso: 13.20, saving: 40, caducidadDias: 90,
    morning: true, schedule: { days: 'Lun–Vie', from: '09:00', to: '14:00', lastEntry: '12:30' } },
];
window.BONO_CATALOG = BONO_CATALOG;

const CARD_THEMES = {
  'b5-60':  {
    bg: 'linear-gradient(140deg, #1b4a42 0%, #0d2e28 45%, #163d36 100%)',
    accent: '#4ecdc4',
    glow: 'rgba(78,205,196,.35)',
    shimmer: 'rgba(78,205,196,.18)',
  },
  'b5-90':  {
    bg: 'linear-gradient(140deg, #22204e 0%, #131130 45%, #1e1c44 100%)',
    accent: '#9b8ffc',
    glow: 'rgba(155,143,252,.32)',
    shimmer: 'rgba(155,143,252,.2)',
  },
  'b10-60': {
    bg: 'linear-gradient(140deg, #3e1478 0%, #1f0844 45%, #310f62 100%)',
    accent: '#c9a8ff',
    glow: 'rgba(72,35,128,.5)',
    shimmer: 'rgba(201,168,255,.22)',
  },
  'b10-90': {
    bg: 'linear-gradient(140deg, #201608 0%, #100c04 45%, #281c0a 100%)',
    accent: '#ffd166',
    glow: 'rgba(255,209,102,.28)',
    shimmer: 'rgba(255,209,102,.2)',
  },
  'b10-90m': {
    bg: 'linear-gradient(140deg, #2e1600 0%, #1c0e00 45%, #361a00 100%)',
    accent: '#ff9f43',
    glow: 'rgba(255,159,67,.35)',
    shimmer: 'rgba(255,159,67,.2)',
  },
};

const BonoCard = ({ b, onClick }) => {
  const th = CARD_THEMES[b.id];

  return (
    <div onClick={onClick} style={{
      position: 'relative', overflow: 'hidden', cursor: 'pointer',
      borderRadius: 20,
      background: th.bg,
      aspectRatio: '1.586 / 1',
      boxShadow: b.popular
        ? `0 22px 55px ${th.glow}, 0 6px 16px rgba(0,0,0,.45)`
        : `0 14px 36px ${th.glow}, 0 4px 12px rgba(0,0,0,.38)`,
      userSelect: 'none',
    }}>
      {/* Holographic colour overlay */}
      <div className="pb-holo" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 'inherit',
        background: `linear-gradient(115deg,
          transparent 10%,
          ${th.accent}28 28%,
          transparent 40%,
          ${th.accent}18 58%,
          rgba(255,255,255,.08) 65%,
          transparent 76%)`,
      }}/>

      {/* Shine sweep */}
      <div className={`pb-shine pb-shine-${b.id}`} style={{
        position: 'absolute', top: '-20%', bottom: '-20%', width: '38%',
        background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,.14) 45%, rgba(255,255,255,.22) 50%, rgba(255,255,255,.14) 55%, transparent 100%)`,
        pointerEvents: 'none',
        transform: 'skewX(-12deg)',
      }}/>

      {/* Decorative circles */}
      <div style={{
        position: 'absolute', top: -50, right: -50, width: 180, height: 180,
        borderRadius: '50%', border: `1px solid ${th.accent}28`, pointerEvents: 'none',
      }}/>
      <div style={{
        position: 'absolute', bottom: -70, left: -30, width: 200, height: 200,
        borderRadius: '50%', border: `1px solid ${th.accent}18`, pointerEvents: 'none',
      }}/>

      {/* Card content */}
      <div style={{ position: 'absolute', inset: 0, padding: '18px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

        {/* Top: wordmark + badges */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 12, letterSpacing: '.18em', color: th.accent, textTransform: 'uppercase' }}>POLEBOX</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
            {b.popular && (
              <div style={{ padding: '3px 9px', borderRadius: 999, background: th.accent, fontSize: 8, fontWeight: 800, color: '#000', letterSpacing: '.1em', textTransform: 'uppercase' }}>MÁS POPULAR</div>
            )}
            {b.morning && (
              <div style={{ padding: '3px 9px', borderRadius: 999, background: th.accent, fontSize: 8, fontWeight: 800, color: '#000', letterSpacing: '.08em', textTransform: 'uppercase' }}>☀ MAÑANAS</div>
            )}
            <div style={{ padding: '3px 9px', borderRadius: 999, background: 'rgba(255,255,255,.12)', fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,.8)', letterSpacing: '.06em' }}>−{b.saving}%</div>
          </div>
        </div>

        {/* Centre: accesos count grande */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontFamily: PB.mono, fontWeight: 800, fontSize: 52, color: '#fff', lineHeight: 1, letterSpacing: '-.02em' }}>{b.accesos}</span>
            <span style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 16, color: 'rgba(255,255,255,.6)', letterSpacing: '.04em', textTransform: 'uppercase', paddingBottom: 6 }}>accesos</span>
          </div>
          <div style={{ fontSize: 13, color: th.accent, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', marginTop: 2 }}>{b.min} min por sesión</div>
          {b.schedule && (
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.55)', fontWeight: 600, marginTop: 4, letterSpacing: '.04em' }}>
              {b.schedule.days} · {b.schedule.from}–{b.schedule.to} · última entrada {b.schedule.lastEntry}
            </div>
          )}
        </div>

        {/* Bottom: nombre + validez */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 15, color: '#fff', letterSpacing: '.02em' }}>{b.name}</div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.12em', color: 'rgba(255,255,255,.45)', textTransform: 'uppercase' }}>Válido</div>
            <div style={{ fontFamily: PB.mono, fontWeight: 700, fontSize: 13, color: 'rgba(255,255,255,.75)', marginTop: 2 }}>{b.caducidadDias} días</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ScreenBonos = ({ onBack, onSelect }) => {
  const fmt = n => n.toFixed(2).replace('.', ',') + ' €';

  const delays = { 'b5-60': '0s', 'b5-90': '1.1s', 'b10-60': '2.0s', 'b10-90': '3.1s' };

  return (
    <>
      <style>{`
        @keyframes pb-spin { to { transform: rotate(360deg); } }
        @keyframes pb-slideup { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes pb-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pb-shine-anim {
          0%,100% { transform: translateX(-160%) skewX(-12deg); opacity: 0; }
          8%       { opacity: 1; }
          30%      { transform: translateX(340%) skewX(-12deg); opacity: 0; }
          31%      { transform: translateX(-160%) skewX(-12deg); }
        }
        @keyframes pb-holo-pulse {
          0%,100% { opacity: .55; }
          50%      { opacity: .85; }
        }
        .pb-shine { animation: pb-shine-anim 4.2s ease-in-out infinite; }
        .pb-shine-b5-60   { animation-delay: 0s; }
        .pb-shine-b5-90   { animation-delay: 1.1s; }
        .pb-shine-b10-60  { animation-delay: 2.0s; }
        .pb-shine-b10-90  { animation-delay: 3.1s; }
        .pb-shine-b10-90m { animation-delay: 0.6s; }
        .pb-holo { animation: pb-holo-pulse 3s ease-in-out infinite; }
      `}</style>

      <StatusBar/>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 30 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px 8px' }}>
          <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: 12, border: `1px solid ${PB.line}`, background: PB.surface, display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
            <Icon name="back" size={18}/>
          </button>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 20, letterSpacing: '-0.01em', margin: 0 }}>Bonos de acceso</h3>
            <div style={{ fontSize: 12, color: PB.ink3, marginTop: 1 }}>Reserva más, paga menos</div>
          </div>
        </div>

        {/* Precio base banner */}
        <div style={{ margin: '4px 16px 20px', padding: '10px 14px', borderRadius: 12, background: PB.mentaSoft, fontSize: 12, color: PB.moradoInk, display: 'flex', gap: 8, alignItems: 'center' }}>
          <Icon name="sparkle" size={14} color={PB.morado}/>
          <span>Precio habitual: <strong>18 €/sesión 60 min</strong> · <strong>22 €/sesión 90 min</strong></span>
        </div>

        {/* Cards */}
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {BONO_CATALOG.map((b) => (
            <div key={b.id}>
              <BonoCard b={b} onClick={() => onSelect(b)}/>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 4px 0' }}>
                <div>
                  <span style={{ fontFamily: PB.mono, fontWeight: 800, fontSize: 24, color: PB.ink, letterSpacing: '-.01em' }}>{b.price} €</span>
                  <span style={{ fontSize: 11, color: PB.ink3, marginLeft: 8 }}>
                    {fmt(b.perAcceso)}/acceso · <span style={{ color: PB.success, fontWeight: 700 }}>−{b.saving}%</span>
                  </span>
                </div>
                <button onClick={() => onSelect(b)} style={{
                  padding: '11px 22px', borderRadius: 14, border: 0,
                  background: PB.morado, color: '#fff',
                  fontFamily: PB.font, fontWeight: 700, fontSize: 14, cursor: 'pointer',
                  boxShadow: `0 6px 18px rgba(72,35,128,.3)`,
                }}>¡Lo quiero!</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ margin: '20px 20px 0', fontSize: 11, color: PB.ink4, lineHeight: 1.6 }}>
          Los bonos son personales e intransferibles. La caducidad empieza en la fecha de compra. Los accesos no utilizados al vencer no se reembolsan.
        </div>
      </div>
    </>
  );
};

const BASE_CONDITIONS = [
  'Personal e intransferible. Solo puede usarlo la titular de la cuenta.',
  'La caducidad comienza en la fecha de compra, no de primer uso.',
  'Los accesos no utilizados al vencer el plazo no se reembolsan.',
  'Cancelación con más de 24 h de antelación: el acceso se reintegra al bono.',
  'Cancelación con menos de 24 h: el acceso se consume sin posibilidad de recuperación.',
  'No acumulable con otras promociones, descuentos o códigos.',
  'Válido en todas las sedes de POLEBOX.',
  'POLEBOX se reserva el derecho a cancelar sesiones por causas de fuerza mayor, reintegrando el acceso al bono.',
];
const getConditions = (bono) => bono.schedule
  ? [`Uso exclusivo de mañanas: válido de ${bono.schedule.days} de ${bono.schedule.from} a ${bono.schedule.to}. Última entrada a las ${bono.schedule.lastEntry}.`, ...BASE_CONDITIONS]
  : BASE_CONDITIONS;

const ScreenBonoResumen = ({ bono, onBack, onPay }) => {
  if (!bono) return null;
  const th = CARD_THEMES[bono.id];

  return (
    <>
      <StatusBar/>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 120 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 16px', position: 'relative' }}>
          <button onClick={onBack} style={{ position: 'absolute', left: 16, width: 40, height: 40, borderRadius: 12, border: `1px solid ${PB.line}`, background: PB.surface, display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
            <Icon name="back" size={18}/>
          </button>
          <h3 style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 18, letterSpacing: '-0.01em', margin: 0 }}>Resumen del bono</h3>
        </div>

        {/* Mini card */}
        <div style={{ padding: '8px 24px 20px' }}>
          <BonoCard b={bono} onClick={() => {}}/>
        </div>

        {/* Horario restringido */}
        {bono.schedule && (
          <div style={{ margin: '0 16px 16px', padding: '14px 16px', borderRadius: 16, background: '#fff4e6', border: '1px solid #f4a830', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 20, lineHeight: 1 }}>☀</span>
            <div>
              <div style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 13, color: '#c47c00', marginBottom: 3 }}>Bono de uso exclusivo mañanas</div>
              <div style={{ fontSize: 12, color: '#7a5200', lineHeight: 1.5 }}>
                Válido <strong>{bono.schedule.days}</strong> de <strong>{bono.schedule.from}</strong> a <strong>{bono.schedule.to}</strong>.<br/>
                Última entrada permitida a las <strong>{bono.schedule.lastEntry}</strong>.
              </div>
            </div>
          </div>
        )}

        {/* Desglose */}
        <div style={{ margin: '0 16px 16px', padding: '16px 18px', borderRadius: 18, background: PB.surface, border: `1px solid ${PB.line}` }}>
          <Eyebrow>Tu compra</Eyebrow>
          <div style={{ marginTop: 10 }}>
            {[
              { k: `${bono.name} · ${bono.accesos}×${bono.min} min`, v: `${bono.price},00 €` },
              { k: 'IVA (21%) incluido', v: '', muted: true },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13, color: r.muted ? PB.ink3 : PB.ink2 }}>
                <span>{r.k}</span>
                <span style={{ fontFamily: PB.mono, fontWeight: 700 }}>{r.v}</span>
              </div>
            ))}
            <div style={{ height: 1, background: PB.line, margin: '10px 0' }}/>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 15 }}>Total</span>
              <span style={{ fontFamily: PB.mono, fontWeight: 800, fontSize: 22 }}>{bono.price},00 €</span>
            </div>
          </div>
        </div>

        {/* Condiciones */}
        <div style={{ margin: '0 16px', padding: '16px 18px', borderRadius: 18, background: PB.surface, border: `1px solid ${PB.line}` }}>
          <Eyebrow>Condiciones de uso</Eyebrow>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {getConditions(bono).map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 18, height: 18, borderRadius: 999, background: PB.surface2, border: `1px solid ${PB.line}`, display: 'grid', placeItems: 'center', flexShrink: 0, marginTop: 1 }}>
                  <div style={{ width: 6, height: 6, borderRadius: 999, background: PB.morado }}/>
                </div>
                <span style={{ fontSize: 12, color: PB.ink2, lineHeight: 1.55 }}>{c}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, padding: '10px 12px', borderRadius: 12, background: PB.mentaSoft, fontSize: 11, color: PB.moradoInk, lineHeight: 1.5 }}>
            Al proceder al pago confirmas que has leído y aceptas las condiciones anteriores y la <strong>política de privacidad</strong> de POLEBOX.
          </div>
        </div>

      </div>

      {/* Sticky CTA */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 16px 26px', borderTopLeftRadius: 28, borderTopRightRadius: 28, background: PB.surface, boxShadow: '0 -12px 30px rgba(20,19,24,.1)', borderTop: `1px solid ${PB.line}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: PB.ink3 }}>Total</div>
          <div style={{ fontFamily: PB.mono, fontWeight: 800, fontSize: 26, color: PB.ink }}>{bono.price},00 €</div>
        </div>
        <Button onClick={onPay} full style={{ padding: '18px', fontSize: 16 }}>
          <Icon name="card" size={18} color="#fff"/> Ir al pago
        </Button>
      </div>
    </>
  );
};

window.ScreenBonos = ScreenBonos;
window.ScreenBonoResumen = ScreenBonoResumen;
window.CARD_THEMES = CARD_THEMES;
