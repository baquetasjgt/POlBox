// POLEBOX — Screen 4: Digital Key (live access + domotics)

const Screen4Key = ({ onBack }) => {
  const [streetUnlocked, setStreetUnlocked] = React.useState(false);
  const [boxUnlocked, setBoxUnlocked] = React.useState(false);
  const [light, setLight] = React.useState('neon');
  const [remaining, setRemaining] = React.useState(45 * 60 + 20);
  React.useEffect(() => {
    const t = setInterval(() => setRemaining(r => Math.max(0, r - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');

  // progress for circular: 45:20 out of 60:00
  const total = 60 * 60;
  const pct = remaining / total;
  const R = 88, C = 2 * Math.PI * R;

  const Slider = ({ label, unlocked, onUnlock }) => {
    const [dx, setDx] = React.useState(0);
    const trackRef = React.useRef(null);
    const [dragging, setDragging] = React.useState(false);
    const startRef = React.useRef(0);
    const onStart = (clientX) => {
      if (unlocked) return;
      setDragging(true); startRef.current = clientX - dx;
    };
    const onMove = (clientX) => {
      if (!dragging) return;
      const w = trackRef.current?.offsetWidth || 300;
      const max = w - 62;
      const nx = Math.max(0, Math.min(max, clientX - startRef.current));
      setDx(nx);
      if (nx >= max - 4) { onUnlock(); setDragging(false); }
    };
    const onEnd = () => { if (dragging && dx < (trackRef.current?.offsetWidth || 300) - 66) setDx(0); setDragging(false); };
    return (
      <div
        ref={trackRef}
        onMouseDown={(e) => onStart(e.clientX)}
        onMouseMove={(e) => onMove(e.clientX)}
        onMouseUp={onEnd}
        onMouseLeave={onEnd}
        onTouchStart={(e) => onStart(e.touches[0].clientX)}
        onTouchMove={(e) => onMove(e.touches[0].clientX)}
        onTouchEnd={onEnd}
        style={{
          position: 'relative', height: 62, borderRadius: 999,
          background: unlocked ? PB.successBg : PB.surface,
          border: `1px solid ${unlocked ? PB.success : PB.line}`,
          overflow: 'hidden', userSelect: 'none', touchAction: 'none',
        }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: PB.font, fontWeight: 700, fontSize: 13, letterSpacing: '.1em', textTransform: 'uppercase',
          color: unlocked ? PB.success : PB.ink3, pointerEvents: 'none',
        }}>
          {unlocked ? <><Icon name="check" size={18}/>&nbsp; Puerta abierta</> : label}
        </div>
        {/* Knob */}
        {!unlocked && (
          <div style={{
            position: 'absolute', top: 5, left: 5 + dx, width: 52, height: 52, borderRadius: 999,
            background: PB.morado, display: 'grid', placeItems: 'center', color: '#fff',
            boxShadow: '0 6px 16px rgba(72,35,128,.35)', cursor: 'grab',
            transition: dragging ? 'none' : 'left 220ms cubic-bezier(.2,.7,.2,1)',
          }}>
            <Icon name="arrow" size={20} color="#fff"/>
          </div>
        )}
      </div>
    );
  };

  const lights = [
    { id: 'neon',  label: 'Neón',      color: '#E9A0E3' },
    { id: 'warm',  label: 'Cálido',    color: '#F0B867' },
    { id: 'rec',   label: 'Grabación', color: '#F5F2E6' },
  ];

  return (
    <>
      <StatusBar/>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 110 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px 8px' }}>
          <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: 12, border: `1px solid ${PB.line}`, background: PB.surface, display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
            <Icon name="back" size={18}/>
          </button>
          <h3 style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 18, letterSpacing: '-0.01em', margin: 0 }}>Tu llave digital</h3>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 999, background: PB.successBg, color: PB.success, fontSize: 11, fontWeight: 700, letterSpacing: '.06em' }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: PB.success }}/>
            <Icon name="wifi" size={12}/>
          </div>
        </div>

        {/* Countdown ring */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0 8px' }}>
          <svg width="220" height="220" viewBox="0 0 220 220">
            <circle cx="110" cy="110" r={R} fill="none" stroke={PB.surface2} strokeWidth="10"/>
            <circle cx="110" cy="110" r={R} fill="none" stroke={PB.morado} strokeWidth="10" strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={C * (1 - pct)}
              transform="rotate(-90 110 110)" style={{ transition: 'stroke-dashoffset 600ms' }}/>
            <text x="110" y="98" textAnchor="middle" fontFamily={PB.font} fontSize="11" fontWeight="700" letterSpacing="2" fill={PB.ink3}>TE QUEDAN</text>
            <text x="110" y="134" textAnchor="middle" fontFamily={PB.mono} fontSize="40" fontWeight="700" fill={PB.ink}>{mm}:{ss}</text>
          </svg>
          <div style={{ fontSize: 13, color: PB.ink3, marginTop: -6 }}>
            <strong style={{ color: PB.ink2, fontWeight: 700 }}>BOX 1</strong> · terminando a las 19:00h
          </div>
        </div>

        {/* Sliders */}
        <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Slider label="Desliza · puerta calle" unlocked={streetUnlocked} onUnlock={() => setStreetUnlocked(true)}/>
          <Slider label="Desliza · puerta BOX 1" unlocked={boxUnlocked} onUnlock={() => setBoxUnlocked(true)}/>
        </div>

        {/* Ambient lights */}
        <div style={{ padding: '10px 20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <h3 style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 15, letterSpacing: '-0.01em', margin: 0 }}>Ambiente del box</h3>
            <Eyebrow>LED</Eyebrow>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {lights.map(l => {
              const on = light === l.id;
              return (
                <button key={l.id} onClick={() => setLight(l.id)} style={{
                  flex: 1, padding: '14px 6px', borderRadius: 16, border: `1px solid ${on ? PB.morado : PB.line}`,
                  background: on ? PB.surface : PB.surface, cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  boxShadow: on ? '0 4px 14px rgba(72,35,128,.15)' : 'none',
                }}>
                  <div style={{ width: 32, height: 32, borderRadius: 999, background: l.color, boxShadow: `0 0 18px ${l.color}` }}/>
                  <span style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 12, color: PB.ink }}>{l.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SOS */}
        <div style={{ padding: '18px 16px 8px' }}>
          <Button variant="danger" full icon="phone" style={{ padding: '14px', fontSize: 14 }}>
            Emergencia · Contactar soporte
          </Button>
        </div>
      </div>
      <TabBar active="home"/>
    </>
  );
};

window.Screen4Key = Screen4Key;
