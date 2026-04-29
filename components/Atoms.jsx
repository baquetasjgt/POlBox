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

// ── POLEBOX wordmark — logo vectorial oficial ──
const LOGO_PATH = "M 410.67 497.33 C410.30,496.97 410.00,488.47 410.00,478.44 L 410.00 460.22 L 412.37 459.62 C413.68,459.29 416.27,457.51 418.12,455.66 C419.98,453.80 424.88,449.82 429.00,446.80 C440.77,438.20 445.52,432.73 451.02,421.50 C453.71,416.00 456.44,409.32 457.09,406.66 C458.07,402.68 459.58,400.55 465.64,394.59 C473.76,386.60 474.21,385.25 471.05,378.29 C469.99,375.98 468.82,371.93 468.44,369.29 C468.05,366.66 466.91,362.86 465.91,360.86 C463.28,355.64 453.90,347.69 444.77,342.94 C438.33,339.59 436.60,338.17 435.28,335.17 C426.53,315.27 419.62,303.00 417.16,303.00 C416.80,303.00 416.63,311.32 416.79,321.50 L 417.09 340.00 L 420.29 340.07 C423.45,340.13 423.43,340.16 419.32,341.44 C417.01,342.16 413.98,343.04 412.57,343.39 L 410.00 344.04 L 410.00 298.52 C410.00,250.19 409.74,252.96 414.25,252.60 C415.18,252.53 415.63,256.36 416.00,267.50 L 416.50 282.50 L 448.00 283.00 C482.90,283.55 483.25,283.61 490.77,290.41 C492.96,292.39 495.83,296.38 497.13,299.26 L 499.50 304.50 L 499.50 375.50 L 499.50 446.50 L 496.70 452.20 C493.71,458.28 490.25,461.75 483.62,465.30 C479.67,467.41 478.24,467.51 448.25,467.80 L 417.00 468.11 L 417.00 481.47 C417.00,488.82 416.73,495.55 416.39,496.42 C415.79,497.99 411.94,498.61 410.67,497.33 ZM 335.99 467.07 C328.44,464.77 319.32,456.27 316.82,449.22 C315.78,446.28 315.50,430.74 315.50,375.00 L 315.50 304.50 L 318.30 298.79 C321.32,292.65 326.10,288.22 333.15,285.02 C337.20,283.18 339.81,283.04 371.25,283.02 L 405.00 283.00 L 405.00 288.88 C405.00,294.36 404.74,295.03 401.18,298.63 C399.08,300.76 394.35,307.52 390.67,313.66 C386.99,319.79 381.04,328.34 377.45,332.66 C370.84,340.60 364.56,351.48 365.61,353.18 C365.92,353.69 368.37,352.06 371.05,349.55 C374.25,346.56 376.81,345.00 378.52,345.00 C383.35,345.00 385.00,343.35 385.00,338.52 C385.00,334.54 385.40,333.80 389.20,330.81 C391.50,328.99 396.00,324.98 399.20,321.91 L 405.00 316.32 L 405.00 330.96 L 405.00 345.60 L 400.25 347.88 C389.51,353.04 381.33,359.03 374.05,367.07 C365.21,376.82 355.43,384.79 343.34,392.10 C333.28,398.17 323.03,407.43 324.61,409.01 C325.29,409.69 327.64,409.19 331.79,407.51 C335.49,406.01 339.94,405.00 342.89,405.00 C347.80,405.00 347.81,404.99 349.16,400.75 C350.46,396.63 350.87,396.32 362.75,390.42 C372.72,385.47 376.34,383.04 382.25,377.33 C389.99,369.84 394.62,367.50 408.21,364.24 C414.55,362.72 415.33,362.72 419.76,364.31 C425.73,366.45 429.97,366.46 434.44,364.33 C443.97,359.78 449.42,372.80 444.03,387.20 L 441.90 392.89 L 436.70 392.33 C433.84,392.02 430.50,391.14 429.29,390.38 C423.02,386.47 420.23,389.76 420.41,400.85 C420.55,409.14 420.57,409.22 424.26,412.60 C426.30,414.47 428.88,416.00 430.00,416.00 C431.11,416.00 432.86,416.52 433.88,417.16 C436.86,419.02 438.66,417.53 440.94,411.32 C444.30,402.14 444.25,402.24 444.72,404.19 C445.42,407.09 443.09,417.27 440.54,422.51 C437.41,428.91 422.06,446.96 417.79,449.25 C416.00,450.21 413.51,451.00 412.27,451.00 L 410.00 451.00 L 410.00 411.17 C410.00,389.26 409.75,371.08 409.44,370.78 C409.14,370.47 408.01,370.45 406.94,370.73 C405.05,371.22 405.00,372.56 405.00,419.62 L 405.00 468.00 L 371.75 467.91 C353.46,467.87 337.37,467.48 335.99,467.07 ZM 964.37 445.51 C941.60,440.55 921.72,423.95 914.88,404.17 C911.62,394.74 910.84,389.96 910.88,379.50 C910.98,352.67 924.10,331.35 947.50,320.01 C958.49,314.69 965.54,312.97 979.06,312.31 C1010.25,310.78 1035.09,324.28 1047.53,349.50 C1052.60,359.78 1054.39,367.77 1054.37,380.00 C1054.35,399.27 1048.66,413.38 1035.64,426.53 C1026.17,436.09 1016.17,441.56 1002.00,444.95 C991.98,447.35 974.05,447.61 964.37,445.51 ZM 992.20 419.88 C999.71,418.28 1005.77,414.92 1011.19,409.33 C1023.54,396.59 1026.42,377.89 1018.78,360.00 C1016.39,354.38 1008.26,346.16 1001.98,342.99 C993.65,338.78 984.90,337.39 976.00,338.86 C954.03,342.49 940.69,360.01 942.27,383.14 C944.01,408.43 966.86,425.25 992.20,419.88 ZM 177.00 379.50 L 177.00 314.00 L 211.25 314.01 C240.95,314.02 246.72,314.28 254.69,315.92 C279.50,321.04 293.00,336.93 293.00,361.00 C293.00,385.65 279.49,400.89 252.73,406.42 C247.37,407.53 239.54,408.00 226.54,408.00 L 208.00 408.00 L 208.00 426.50 L 208.00 445.00 L 192.50 445.00 L 177.00 445.00 L 177.00 379.50 ZM 252.15 378.46 C254.53,376.79 257.44,373.99 258.62,372.24 C263.78,364.58 262.13,352.06 255.14,345.74 C249.01,340.21 245.70,339.50 226.00,339.50 L 208.50 339.50 L 208.23 360.83 L 207.96 382.15 L 227.90 381.83 L 247.83 381.50 L 252.15 378.46 ZM 527.00 379.47 L 527.00 313.95 L 542.75 314.22 L 558.50 314.50 L 558.50 366.75 C558.50,418.31 558.53,419.00 560.50,419.06 C561.60,419.09 576.56,419.07 593.75,419.00 L 625.00 418.89 L 625.00 431.94 L 625.00 445.00 L 576.00 445.00 L 527.00 445.00 L 527.00 379.47 ZM 643.67 444.33 C643.30,443.97 643.00,414.49 643.00,378.82 L 643.00 313.98 L 694.25 314.24 L 745.50 314.50 L 745.50 326.50 L 745.50 338.50 L 710.25 338.76 L 675.00 339.03 L 675.00 352.51 L 675.00 366.00 L 706.00 366.00 L 737.00 366.00 L 737.00 378.00 L 737.00 390.00 L 706.00 390.00 L 675.00 390.00 L 675.00 405.00 L 675.00 420.00 L 712.00 420.00 L 749.00 420.00 L 749.00 432.50 L 749.00 445.00 L 696.67 445.00 C667.88,445.00 644.03,444.70 643.67,444.33 ZM 772.00 379.57 L 772.00 314.00 L 810.25 314.03 C851.67,314.07 859.44,314.76 869.33,319.30 C876.37,322.52 881.91,327.60 885.56,334.20 C888.21,338.97 888.50,340.40 888.50,348.57 C888.50,356.70 888.18,358.26 885.47,363.57 C883.43,367.57 880.91,370.64 877.73,372.99 L 873.03 376.48 L 877.36 378.68 C883.61,381.86 891.25,390.63 893.31,396.98 C895.53,403.87 895.51,415.12 893.26,421.39 C891.15,427.27 885.33,434.14 879.65,437.45 C877.37,438.78 872.12,440.88 868.00,442.12 C860.82,444.26 858.59,444.38 816.25,444.75 L 772.00 445.15 L 772.00 379.57 ZM 855.74 418.24 C861.27,415.28 863.38,411.92 863.38,406.05 C863.38,399.98 860.64,395.29 855.50,392.60 C851.81,390.66 849.61,390.48 827.25,390.20 L 803.00 389.90 L 803.00 405.53 L 803.00 421.16 L 827.25 420.83 C850.19,420.52 851.73,420.38 855.74,418.24 ZM 849.68 364.21 C855.35,361.25 857.00,358.59 857.00,352.41 C857.00,346.21 854.59,342.63 848.58,339.90 C845.03,338.29 841.78,338.04 823.75,338.02 L 803.00 338.00 L 803.00 351.83 C803.00,359.44 803.34,366.01 803.75,366.43 C804.16,366.86 813.72,367.02 825.00,366.80 C843.69,366.43 845.87,366.20 849.68,364.21 ZM 1059.00 444.51 C1059.00,443.90 1065.55,434.81 1087.11,405.50 C1095.60,393.95 1103.55,383.08 1104.77,381.35 L 1106.99 378.20 L 1101.69 370.85 C1098.78,366.81 1088.81,352.92 1079.54,340.00 C1070.28,327.08 1062.26,315.94 1061.72,315.25 C1060.96,314.26 1064.50,314.00 1078.74,314.00 L 1096.73 314.00 L 1110.12 333.11 C1117.48,343.63 1124.18,353.11 1125.02,354.18 C1126.45,356.03 1127.34,354.99 1141.38,335.07 L 1156.23 314.00 L 1173.68 314.00 L 1191.14 314.00 L 1188.85 317.25 C1187.59,319.04 1180.06,329.50 1172.12,340.50 C1147.19,375.01 1145.81,377.06 1146.39,378.57 C1146.89,379.88 1165.25,405.31 1171.97,414.00 C1175.03,417.96 1192.20,441.84 1193.36,443.75 C1193.96,444.73 1190.20,445.00 1175.81,444.99 L 1157.50 444.99 L 1142.02 422.99 C1133.51,410.88 1126.21,401.10 1125.81,401.24 C1125.40,401.38 1118.36,411.17 1110.16,423.00 L 1095.26 444.50 L 1077.13 444.77 C1067.16,444.92 1059.00,444.81 1059.00,444.51 Z";

const Wordmark = ({ color = PB.ink, height = 26 }) => {
  const w = Math.round(height * (1033 / 250));
  return (
    <svg width={w} height={height} viewBox="167 248 1033 250" fill="none" style={{ display: 'block' }}>
      <path d={LOGO_PATH} fill={color}/>
    </svg>
  );
};

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
