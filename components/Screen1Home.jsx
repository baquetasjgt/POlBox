// POLEBOX — Screen 1: Home (público) — rediseño para conversión.
// Hero de valor + mapa multisede + sedes cercanas + cómo funciona + prueba social + FAQ.
// Exploración en modo invitado; el muro de auth aparece SOLO al pagar.

const Screen1Home = ({ onLogin, onRegister, onPickVenue }) => {
  const [faqOpen, setFaqOpen] = React.useState(0);
  const [pinSel, setPinSel] = React.useState(0);

  // Sedes POLEBOX (mockup, coordenadas relativas al viewBox del mapa)
  const venues = [
    { id: 'mad-salamanca', city: 'Madrid', name: 'Salamanca', dist: '0,8 km', boxes: 3, from: 15, x: 170, y: 210, open: true },
    { id: 'mad-chamberi',  city: 'Madrid', name: 'Chamberí',  dist: '2,1 km', boxes: 2, from: 15, x: 130, y: 170, open: true },
    { id: 'mad-malasana',  city: 'Madrid', name: 'Malasaña',  dist: '3,4 km', boxes: 2, from: 18, x: 150, y: 240, open: false },
    { id: 'bcn-gracia',    city: 'Barcelona', name: 'Gràcia', dist: '612 km', boxes: 3, from: 15, x: 250, y: 150, open: true },
  ];

  const faqs = [
    { q: '¿Hay cámaras en los boxes?', a: 'Sí, en los pasillos y entrada por seguridad. Dentro del box NO hay cámaras — tu privacidad es total.' },
    { q: '¿Puedo grabar contenido?', a: 'Claro, el box es tuyo durante tu hora. Ilumina con los LED del modo "Grabación" y usa el altavoz pro.' },
    { q: '¿Qué pasa si llego tarde?', a: 'Tu hora corre desde el minuto que reservaste. Puedes salir antes, pero el tiempo perdido no se recupera.' },
    { q: '¿Necesito experiencia previa?', a: 'No somos una escuela. POLEBOX es un espacio para quien ya practica pole o quiere entrenar en privado.' },
    { q: '¿Y si la cerradura falla?', a: 'Tenemos un botón SOS dentro de la app conectado 24/7 con soporte humano. Respuesta en <2 min.' },
  ];

  return (
    <>
      <StatusBar/>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 110 }}>
        {/* ─── Header ─────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px 8px' }}>
          <Wordmark color={PB.morado}/>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={onLogin} style={{ background: 'transparent', border: 0, color: PB.ink2, fontFamily: PB.font, fontWeight: 600, fontSize: 13, cursor: 'pointer', padding: '8px 4px' }}>
              Entrar
            </button>
            <button onClick={onRegister} style={{ background: PB.ink, color: '#fff', border: 0, borderRadius: 999, padding: '8px 14px', fontFamily: PB.font, fontWeight: 700, fontSize: 12, cursor: 'pointer', letterSpacing: '.02em' }}>
              Registrarse
            </button>
          </div>
        </div>

        {/* ─── Hero ──────────────────────────────── */}
        <div style={{ margin: '10px 16px 20px', borderRadius: 28, overflow: 'hidden', position: 'relative',
          background: `radial-gradient(120% 80% at 30% 10%, #6A3FB8 0%, ${PB.morado} 40%, ${PB.moradoInk} 100%)`,
          boxShadow: '0 18px 40px rgba(72,35,128,.28)',
        }}>
          <img src="assets/isotipo-polebox.jpg" alt="" style={{
            position: 'absolute', right: -40, top: -20, width: 240, height: 240,
            filter: 'invert(1) brightness(1.8) contrast(1.1)', opacity: .14, mixBlendMode: 'screen',
          }}/>
          <div style={{ position: 'absolute', top: 40, left: 28, width: 10, height: 10, borderRadius: 999, background: PB.menta, boxShadow: `0 0 24px ${PB.menta}` }}/>
          <div style={{ padding: '26px 22px 24px', position: 'relative' }}>
            <Eyebrow color={PB.menta}>24/7 · Sin personal · Sin juicios</Eyebrow>
            <h2 style={{ color: '#fff', fontFamily: PB.font, fontWeight: 900, fontSize: 36, lineHeight: 1.02, letterSpacing: '-0.025em', margin: '10px 0 8px' }}>
              Tu box privado<br/>de pole, <span style={{ color: PB.menta }}>24/7.</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,.8)', fontFamily: PB.font, fontSize: 14, lineHeight: 1.45, margin: '0 0 18px', maxWidth: 300 }}>
              Estudios privados con barras X-Pole, LED, altavoz pro y espejos. Reserva, entra con el móvil y entrena a tu ritmo.
            </p>
            <Button onClick={() => onPickVenue(venues[0].id)} full icon="arrow" style={{ background: PB.menta, color: PB.moradoInk, fontSize: 16, padding: '16px 20px' }}>
              Buscar box cerca de ti
            </Button>
            {/* Mini oferta sticky */}
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 999,
              background: 'rgba(255,255,255,.1)', color: '#fff', fontSize: 12, fontWeight: 600, width: 'fit-content' }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: PB.menta, boxShadow: `0 0 8px ${PB.menta}` }}/>
              Primera sesión <strong style={{ fontWeight: 800 }}>&nbsp;–50%</strong>
            </div>
          </div>
        </div>

        {/* ─── Trust bar ──────────────────────────── */}
        <div style={{ padding: '0 20px 16px', display: 'flex', gap: 16, justifyContent: 'space-between' }}>
          {[
            { n: '+1.200', l: 'atletas' },
            { n: '4,9', l: '★ en reseñas' },
            { n: '24/7', l: 'soporte' },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 20, letterSpacing: '-.01em', color: PB.ink }}>{s.n}</div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: PB.ink3, marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* ─── Mapa + selector de sede ──────────────────── */}
        <div style={{ padding: '6px 20px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <h3 style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 22, letterSpacing: '-0.01em', margin: 0 }}>Elige tu sede</h3>
          <button style={{ background: 'transparent', border: 0, color: PB.morado, fontFamily: PB.font, fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Icon name="bolt" size={12}/> Usar mi ubicación
          </button>
        </div>

        {/* Mapa estilizado */}
        <div style={{ margin: '12px 16px 10px', borderRadius: 20, overflow: 'hidden', border: `1px solid ${PB.line}`, background: '#F0EEE6', position: 'relative', height: 220 }}>
          <svg viewBox="0 0 360 240" width="100%" height="100%" style={{ display: 'block' }}>
            {/* textura de calles */}
            <defs>
              <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#E2E0D8" strokeWidth="0.6"/>
              </pattern>
              <pattern id="grid2" width="72" height="72" patternUnits="userSpaceOnUse">
                <path d="M 72 0 L 0 0 0 72" fill="none" stroke="#D6D3C8" strokeWidth="0.8"/>
              </pattern>
            </defs>
            <rect width="360" height="240" fill="url(#grid)"/>
            <rect width="360" height="240" fill="url(#grid2)"/>
            {/* river / avenida */}
            <path d="M -20 180 Q 80 140 180 170 T 400 130" fill="none" stroke="#C6E3D3" strokeWidth="10" opacity=".7"/>
            {/* park */}
            <circle cx="80" cy="90" r="36" fill="#D5E7D9" opacity=".8"/>
            <circle cx="270" cy="200" r="28" fill="#D5E7D9" opacity=".8"/>

            {/* pins */}
            {venues.slice(0, 3).map((v, i) => {
              const on = i === pinSel;
              return (
                <g key={v.id} onClick={() => { setPinSel(i); }} style={{ cursor: 'pointer' }}>
                  {on && <circle cx={v.x} cy={v.y} r="22" fill={PB.morado} opacity=".15"/>}
                  <circle cx={v.x} cy={v.y} r={on ? 14 : 10} fill={on ? PB.morado : '#fff'} stroke={PB.morado} strokeWidth={on ? 0 : 2}/>
                  <circle cx={v.x} cy={v.y} r={on ? 5 : 4} fill={on ? PB.menta : PB.morado}/>
                  {on && (
                    <g transform={`translate(${v.x},${v.y - 30})`}>
                      <rect x="-44" y="-16" width="88" height="22" rx="11" fill={PB.ink}/>
                      <text x="0" y="-1" textAnchor="middle" fontFamily={PB.font} fontWeight="700" fontSize="10" fill="#fff" letterSpacing="0.4">{v.name.toUpperCase()}</text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* "tú estás aquí" */}
            <g transform="translate(190, 240)">
              <circle r="10" fill={PB.menta} opacity=".35"/>
              <circle r="5" fill={PB.menta} stroke="#fff" strokeWidth="2"/>
            </g>
          </svg>
          {/* Chips de ciudad */}
          <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 }}>
            {['Madrid', 'Barcelona', 'Valencia'].map((c, i) => (
              <button key={c} style={{
                padding: '6px 12px', borderRadius: 999, border: 0,
                background: i === 0 ? PB.ink : 'rgba(255,255,255,.85)',
                color: i === 0 ? '#fff' : PB.ink,
                fontFamily: PB.font, fontWeight: 700, fontSize: 11, cursor: 'pointer',
                backdropFilter: 'blur(8px)',
              }}>{c}</button>
            ))}
          </div>
        </div>

        {/* Lista de sedes cercanas */}
        <div style={{ padding: '4px 16px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {venues.slice(0, 3).map((v, i) => {
            const on = i === pinSel;
            return (
              <button key={v.id} onClick={() => onPickVenue(v.id)} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: 14, borderRadius: 16, cursor: 'pointer', textAlign: 'left',
                background: on ? '#fff' : PB.surface,
                border: `1.5px solid ${on ? PB.morado : PB.line}`,
                boxShadow: on ? '0 10px 22px rgba(72,35,128,.12)' : 'none',
                transition: 'all 220ms cubic-bezier(.2,.7,.2,1)',
              }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: on ? PB.morado : PB.surface2,
                  display: 'grid', placeItems: 'center', color: on ? '#fff' : PB.morado, flexShrink: 0 }}>
                  <Icon name="shield" size={20}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 15, color: PB.ink }}>POLEBOX {v.name}</span>
                    {v.open && <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: PB.success, padding: '2px 6px', background: PB.successBg, borderRadius: 999 }}>Abierto</span>}
                  </div>
                  <div style={{ fontSize: 12, color: PB.ink3, marginTop: 2 }}>
                    {v.city} · a {v.dist} · {v.boxes} boxes
                  </div>
                </div>
                <Icon name="chevron" size={18} color={PB.ink4}/>
              </button>
            );
          })}
        </div>

        {/* ─── Cómo funciona ────────────────────── */}
        <div style={{ padding: '28px 20px 8px' }}>
          <h3 style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 22, letterSpacing: '-0.01em', margin: '0 0 4px' }}>Autogestión total</h3>
          <p style={{ color: PB.ink3, fontSize: 13, margin: '0 0 18px' }}>en 3 pasos</p>
          {[
            { n: '01', icon: 'calendar', title: 'Reserva', text: 'Elige sede, box, día y duración desde la app.' },
            { n: '02', icon: 'key',      title: 'Llave digital', text: 'Recibe acceso temporal al llegar a la puerta.' },
            { n: '03', icon: 'music',    title: 'Entrena', text: 'Abre con el móvil. Tu música, tus luces, tu ritmo.' },
          ].map(s => (
            <div key={s.n} style={{ display: 'flex', gap: 14, padding: '14px 0', borderTop: `1px solid ${PB.line}` }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: PB.morado, color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <Icon name={s.icon} size={22} color="#fff"/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <Eyebrow>{s.n}</Eyebrow>
                  <span style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 15 }}>{s.title}</span>
                </div>
                <p style={{ color: PB.ink3, fontSize: 13, margin: '4px 0 0', lineHeight: 1.4 }}>{s.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ─── Prueba social ──────────────────── */}
        <div style={{ margin: '24px 16px 8px', padding: '20px 18px', borderRadius: 20, background: PB.mentaSoft, color: PB.moradoInk }}>
          <div style={{ display: 'flex', gap: 2, marginBottom: 10 }}>
            {[0,1,2,3,4].map(i => (
              <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={PB.morado}><path d="M12 2l3 7h7l-5.5 4.5 2 7L12 16l-6.5 4.5 2-7L2 9h7z"/></svg>
            ))}
            <span style={{ marginLeft: 6, fontFamily: PB.mono, fontWeight: 700, fontSize: 13 }}>4,9 · 312 reseñas</span>
          </div>
          <p style={{ fontFamily: PB.font, fontWeight: 600, fontSize: 15, lineHeight: 1.4, margin: 0, letterSpacing: '-.005em' }}>
            "Llevaba años buscando un sitio donde entrenar pole sin que nadie me mire. POLEBOX es exactamente eso."
          </p>
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 999, background: `linear-gradient(135deg, ${PB.morado}, ${PB.moradoInk})`, color: '#fff', display: 'grid', placeItems: 'center', fontFamily: PB.font, fontWeight: 800, fontSize: 11 }}>AM</div>
            <div style={{ fontSize: 12 }}>
              <strong style={{ fontWeight: 700 }}>Ana M.</strong> · atleta amateur · Madrid
            </div>
          </div>
        </div>

        {/* ─── FAQ ────────────────────────────── */}
        <div style={{ padding: '22px 16px 0' }}>
          <h3 style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 22, letterSpacing: '-0.01em', margin: '0 0 12px', padding: '0 4px' }}>Preguntas frecuentes</h3>
          {faqs.map((f, i) => {
            const open = faqOpen === i;
            return (
              <div key={i} style={{ borderTop: i === 0 ? `1px solid ${PB.line}` : 0, borderBottom: `1px solid ${PB.line}` }}>
                <button onClick={() => setFaqOpen(open ? -1 : i)} style={{
                  width: '100%', background: 'transparent', border: 0, padding: '14px 4px',
                  display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left', cursor: 'pointer',
                  fontFamily: PB.font, fontWeight: 700, fontSize: 14, color: PB.ink,
                }}>
                  <span style={{ flex: 1 }}>{f.q}</span>
                  <span style={{ width: 24, height: 24, borderRadius: 999, background: PB.surface2,
                    display: 'grid', placeItems: 'center', color: PB.morado,
                    transform: open ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 220ms' }}>
                    <Icon name="plus" size={14}/>
                  </span>
                </button>
                {open && (
                  <p style={{ padding: '0 4px 16px', margin: 0, color: PB.ink3, fontSize: 13, lineHeight: 1.5 }}>{f.a}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* ─── Confianza final ────────────────── */}
        <div style={{ padding: '24px 20px 8px', display: 'flex', gap: 14, justifyContent: 'space-between', fontSize: 11, color: PB.ink3 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="shield" size={13}/> Pago seguro</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="history" size={13}/> Cancela 24h antes</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="chat" size={13}/> Soporte 24/7</span>
        </div>

        {/* Registro final (sticky-ish, al final del scroll) */}
        <div style={{ margin: '18px 16px 0', padding: 18, borderRadius: 20, background: PB.ink, color: '#fff', textAlign: 'center' }}>
          <div style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 18, letterSpacing: '-.01em' }}>¿Listx para tu primera sesión?</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', margin: '6px 0 14px' }}>
            Regístrate en 30 s. Sin letra pequeña.
          </div>
          <Button onClick={onRegister} full icon="arrow" style={{ background: PB.menta, color: PB.moradoInk, padding: '14px', fontSize: 15 }}>
            Crear cuenta gratis
          </Button>
        </div>
      </div>
      <TabBar active="home" locked={{ reservas: true, tienda: true, perfil: true }}/>
    </>
  );
};

window.Screen1Home = Screen1Home;
