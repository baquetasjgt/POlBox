// POLEBOX app — shared atoms & icons. Light theme.
// Reads tokens from colors_and_type.css.

const PB = {
  morado: '#482380', moradoDeep: '#35196A', moradoInk: '#1D0D3E',
  menta: '#80E3B7', mentaSoft: '#C6F2DD', mentaDeep: '#4FBE8A',
  bg: '#FAFAF7', surface: '#FFFFFF', surface2: '#F3F2EE', surface3: '#E8E6E0',
  line: '#E2E0D8', lineStrong: '#C9C6BC',
  ink: '#141318', ink2: '#3A3742', ink3: '#6B6776', ink4: '#A19DAB',
  success: '#238F5B', successBg: '#E4F6EC',
  warn: '#B67A12', warnBg: '#FBF0D9',
  danger: '#B23040', dangerBg: '#FBE6E9',
  font: 'Archivo, system-ui, -apple-system, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, Menlo, monospace',
};

// ── Icons (Lucide-style, stroke 1.75) ────────────────────────────
const Icon = ({ name, size = 22, color = 'currentColor', strokeWidth = 1.75 }) => {
  const common = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round',
  };
  const paths = {
    home:     <><path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V11z"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></>,
    key:      <><circle cx="8" cy="16" r="4"/><path d="M10.9 13.1L21 3m-4 4l3 3"/></>,
    profile:  <><circle cx="12" cy="8" r="4"/><path d="M4 21c1-5 5-7 8-7s7 2 8 7"/></>,
    lock:     <><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></>,
    unlock:   <><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.5-2"/></>,
    arrow:    <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    back:     <><path d="M19 12H5M11 18l-6-6 6-6"/></>,
    chevron:  <><path d="M9 6l6 6-6 6"/></>,
    check:    <><path d="M20 6L9 17l-5-5"/></>,
    plus:     <><path d="M12 5v14M5 12h14"/></>,
    refresh:  <><path d="M21 12a9 9 0 1 1-3-6.7M21 4v5h-5"/></>,
    sparkle:  <><path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/></>,
    music:    <><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></>,
    shield:   <><path d="M12 3l8 3v7c0 4-3 7-8 8-5-1-8-4-8-8V6z"/></>,
    card:     <><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M7 15h3"/></>,
    history:  <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    doc:      <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/></>,
    help:     <><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 1-1 1.7M12 17h.01"/></>,
    chat:     <><path d="M21 12a9 9 0 1 1-3.5-7.1L21 3l-1 3.5A9 9 0 0 1 21 12z"/></>,
    logout:   <><path d="M16 17l5-5-5-5M21 12H9M13 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8"/></>,
    wifi:     <><path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r="1"/></>,
    phone:    <><path d="M22 16v3a2 2 0 0 1-2.2 2 19 19 0 0 1-8.6-3.1 18 18 0 0 1-6-6A19 19 0 0 1 2 3.2 2 2 0 0 1 4 1h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L7.9 8.5a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6A2 2 0 0 1 22 16z"/></>,
    sound:    <><path d="M11 5L6 9H3v6h3l5 4V5z"/><path d="M15 9a5 5 0 0 1 0 6M18 6a9 9 0 0 1 0 12"/></>,
    users:    <><circle cx="9" cy="8" r="3.5"/><path d="M3 20c.8-3.2 3.3-5 6-5s5.2 1.8 6 5"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14c2 .3 3.5 1.8 4 4"/></>,
    bell:     <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></>,
    bolt:     <><path d="M13 2L3 14h7l-1 8 10-12h-7z"/></>,
    light:    <><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12c1 1 1 2 1 3h6c0-1 0-2 1-3a7 7 0 0 0-4-12z"/></>,
    camera:   <><path d="M23 7l-7 5 7 5V7zM1 5h15v14H1z"/></>,
    play:     <><path d="M5 3l14 9-14 9V3z"/></>,
  };
  return <svg {...common}>{paths[name] || paths.home}</svg>;
};

// ── Status bar (mocked iOS) ──────────────────────────────────
const StatusBar = ({ dark = false }) => {
  const c = dark ? '#fff' : PB.ink;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '14px 24px 6px', fontFamily: '-apple-system, SF Pro, system-ui',
      fontSize: 15, fontWeight: 600, color: c }}>
      <span>9:41</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="17" height="11" viewBox="0 0 19 12"><rect x="0" y="7.5" width="3.2" height="4.5" rx=".7" fill={c}/><rect x="4.8" y="5" width="3.2" height="7" rx=".7" fill={c}/><rect x="9.6" y="2.5" width="3.2" height="9.5" rx=".7" fill={c}/><rect x="14.4" y="0" width="3.2" height="12" rx=".7" fill={c}/></svg>
        <svg width="15" height="11" viewBox="0 0 17 12"><path d="M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z" fill={c}/><path d="M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z" fill={c}/><circle cx="8.5" cy="10.5" r="1.5" fill={c}/></svg>
        <svg width="24" height="11" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="3.5" stroke={c} strokeOpacity=".45" fill="none"/><rect x="2" y="2" width="20" height="9" rx="2" fill={c}/></svg>
      </div>
    </div>
  );
};

// ── Phone shell ──────────────────────────────────────────────
const Phone = ({ children, bg = PB.bg, label }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
    <div style={{
      width: 390, height: 844, borderRadius: 54, padding: 10,
      background: '#0d0c10', boxShadow: '0 30px 80px rgba(29,13,62,.18), 0 10px 24px rgba(20,19,24,.12)',
      position: 'relative',
    }}>
      <div style={{ width: '100%', height: '100%', borderRadius: 44, overflow: 'hidden',
        background: bg, position: 'relative', display: 'flex', flexDirection: 'column' }}>
        {/* notch */}
        <div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
          width: 120, height: 32, borderRadius: 999, background: '#0d0c10', zIndex: 30 }}/>
        {children}
      </div>
    </div>
    {label && <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: PB.ink3 }}>{label}</div>}
  </div>
);

// ── Bottom tab bar ───────────────────────────────────────────
const TabBar = ({ active = 'home', locked = {}, onTab = () => {} }) => {
  const items = [
    { id: 'home', label: 'Inicio', icon: 'home' },
    { id: 'reservas', label: 'Reservas', icon: 'calendar' },
    { id: 'llave', label: 'Llave', icon: 'key' },
    { id: 'perfil', label: 'Perfil', icon: 'profile' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 14px 26px',
      background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(14px)',
      borderTop: `1px solid ${PB.line}`, display: 'flex', gap: 4,
    }}>
      {items.map(it => {
        const isActive = it.id === active;
        const isLocked = locked[it.id];
        return (
          <button key={it.id} onClick={() => !isLocked && onTab(it.id)} style={{
            flex: 1, background: 'transparent', border: 0, padding: '6px 4px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            color: isActive ? PB.morado : (isLocked ? PB.ink4 : PB.ink3),
            opacity: isLocked ? .55 : 1, cursor: isLocked ? 'not-allowed' : 'pointer',
            fontFamily: PB.font, position: 'relative',
          }}>
            <div style={{
              width: 52, height: 32, borderRadius: 999,
              display: 'grid', placeItems: 'center',
              background: isActive ? PB.morado : 'transparent',
              color: isActive ? '#fff' : 'currentColor',
              transition: 'background 220ms',
            }}>
              <Icon name={it.icon} size={20}/>
              {isLocked && (
                <div style={{ position: 'absolute', top: 2, right: 14, width: 14, height: 14, borderRadius: 999,
                  background: PB.surface3, display: 'grid', placeItems: 'center' }}>
                  <Icon name="lock" size={9} color={PB.ink3}/>
                </div>
              )}
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// ── POLEBOX wordmark (CSS-drawn placeholder; isotipo SVG used where imagery matters) ──
const Wordmark = ({ color = PB.ink }) => (
  <span style={{
    fontFamily: PB.font, fontWeight: 900, fontSize: 20, letterSpacing: '-0.02em',
    color, display: 'inline-flex', alignItems: 'center', gap: 6,
  }}>
    <span style={{ background: PB.morado, color: '#fff', borderRadius: 7, padding: '2px 6px', fontSize: 14, fontWeight: 800 }}>P</span>
    POLEBOX
  </span>
);

// ── Eyebrow / pill ──
const Eyebrow = ({ children, color = PB.morado }) => (
  <span style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 11, letterSpacing: '.16em',
    textTransform: 'uppercase', color }}>{children}</span>
);

// ── Primary button ──
const Button = ({ children, onClick, variant = 'primary', full = false, icon, style = {} }) => {
  const styles = {
    primary:  { background: PB.morado, color: '#fff', border: '0' },
    secondary:{ background: PB.surface, color: PB.ink, border: `1px solid ${PB.lineStrong}` },
    tertiary: { background: 'transparent', color: PB.morado, border: '0' },
    mint:     { background: PB.menta, color: PB.moradoInk, border: '0' },
    danger:   { background: PB.dangerBg, color: PB.danger, border: '0' },
  }[variant];
  return (
    <button onClick={onClick} style={{
      ...styles, padding: '15px 20px', borderRadius: 14, fontFamily: PB.font, fontWeight: 700,
      fontSize: 15, letterSpacing: '-.005em', cursor: 'pointer',
      width: full ? '100%' : 'auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      transition: 'all 220ms cubic-bezier(.2,.7,.2,1)', ...style,
    }}>
      {icon && <Icon name={icon} size={18}/>}
      {children}
    </button>
  );
};

Object.assign(window, { PB, Icon, StatusBar, Phone, TabBar, Wordmark, Eyebrow, Button });
