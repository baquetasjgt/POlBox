// POLEBOX — Sub-pantallas del Perfil
// Header reutilizable + 6 vistas: payment-methods, history, contract, kyc, support, faq

const ProfileHeader = ({ title, onBack, right }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 16px 8px', position: 'relative' }}>
    <button onClick={onBack} style={{ position: 'absolute', left: 16, width: 40, height: 40, borderRadius: 12, border: `1px solid ${PB.line}`, background: PB.surface, display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
      <Icon name="back" size={18}/>
    </button>
    <h3 style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 17, letterSpacing: '-0.01em', margin: 0 }}>{title}</h3>
    {right && <div style={{ position: 'absolute', right: 16 }}>{right}</div>}
  </div>
);

// ─── Métodos de pago ─────────────────────────────────────────
const ScreenPaymentMethods = ({ onBack, onAdd }) => {
  const [defId, setDefId] = React.useState('mc');
  const cards = [
    { id: 'mc', brand: 'Mastercard', last: '4242', exp: '12/28', color: '#1A1F36' },
    { id: 'visa', brand: 'Visa',     last: '0119', exp: '08/27', color: '#1A1F71' },
  ];
  const Brand = ({ b }) => b === 'Mastercard'
    ? <div style={{ display: 'flex' }}><div style={{ width: 18, height: 18, borderRadius: 999, background: '#EB001B' }}/><div style={{ width: 18, height: 18, borderRadius: 999, background: '#F79E1B', marginLeft: -8, mixBlendMode: 'multiply' }}/></div>
    : <div style={{ fontFamily: 'system-ui', fontWeight: 900, fontSize: 14, color: '#fff', letterSpacing: '.04em', fontStyle: 'italic' }}>VISA</div>;
  return (
    <>
      <StatusBar/>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 110 }}>
        <ProfileHeader title="Métodos de pago" onBack={onBack}/>
        <div style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {cards.map(c => (
            <div key={c.id} style={{ borderRadius: 18, padding: 18, background: `linear-gradient(135deg, ${c.color}, #2c1d6b)`, color: '#fff', position: 'relative', boxShadow: '0 10px 24px rgba(20,19,24,.18)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Brand b={c.brand}/>
                {defId === c.id && <span style={{ padding: '3px 9px', borderRadius: 999, background: PB.menta, color: PB.moradoInk, fontSize: 10, fontWeight: 800, letterSpacing: '.08em' }}>POR DEFECTO</span>}
              </div>
              <div style={{ marginTop: 28, fontFamily: PB.mono, fontWeight: 700, fontSize: 18, letterSpacing: '.16em' }}>•••• •••• •••• {c.last}</div>
              <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, opacity: .85 }}>
                <span>Caduca {c.exp}</span>
                <button onClick={() => setDefId(c.id)} style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,.3)', borderRadius: 999, padding: '5px 10px', fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', cursor: 'pointer' }}>{defId === c.id ? 'Editar' : 'Por defecto'}</button>
              </div>
            </div>
          ))}
          <button onClick={onAdd} style={{ marginTop: 4, padding: '16px', borderRadius: 16, border: `1.5px dashed ${PB.lineStrong}`, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: PB.font, fontWeight: 700, fontSize: 14, color: PB.morado, cursor: 'pointer' }}>
            <Icon name="plus" size={18}/> Añadir método de pago
          </button>
          <div style={{ marginTop: 12, padding: 14, borderRadius: 14, background: PB.surface2, fontSize: 12, color: PB.ink3, display: 'flex', gap: 10 }}>
            <Icon name="shield" size={16} color={PB.morado}/>
            <span>Tus datos se guardan cifrados en <strong style={{ color: PB.ink2, fontWeight: 700 }}>Stripe</strong>. POLEBOX nunca ve tu número completo.</span>
          </div>
        </div>
      </div>
      <TabBar active="perfil"/>
    </>
  );
};

// ─── Historial de reservas ───────────────────────────────────
const ScreenHistory = ({ onBack }) => {
  const [open, setOpen] = React.useState(null); // selected booking
  const items = [
    { id: 'PB-2025-12-018', d: 'JUE', n: 18, m: 'DIC', dateLong: 'Jueves, 18 dic 2025',  hours: '18:00 – 19:30', box: 'BOX 1 · Industrial', sede: 'Madrid · Salamanca', dur: '90 min', price: '20,00 €', subtotal: '16,53 €', tax: '3,47 €', total: '20,00 €', method: 'Mastercard ••4242', state: 'upcoming' },
    { id: 'PB-2025-12-009', d: 'MAR', n: 9,  m: 'DIC', dateLong: 'Martes, 9 dic 2025',   hours: '19:00 – 20:00', box: 'BOX 2 · Neón',       sede: 'Madrid · Salamanca', dur: '60 min', price: '15,00 €', subtotal: '12,40 €', tax: '2,60 €', total: '15,00 €', method: 'Mastercard ••4242', state: 'done' },
    { id: 'PB-2025-12-006', d: 'SÁB', n: 6,  m: 'DIC', dateLong: 'Sábado, 6 dic 2025',   hours: '11:00 – 13:00', box: 'BOX 1 · Industrial', sede: 'Madrid · Chamberí',  dur: '120 min', price: '25,00 €', subtotal: '20,66 €', tax: '4,34 €', total: '25,00 €', method: 'Visa ••0119',       state: 'done' },
    { id: 'PB-2025-11-028', d: 'JUE', n: 28, m: 'NOV', dateLong: 'Jueves, 28 nov 2025', hours: '20:00 – 21:00', box: 'BOX 3 · Espejo',     sede: 'Madrid · Salamanca', dur: '60 min',  price: '15,00 €', subtotal: '12,40 €', tax: '2,60 €', total: '15,00 €', method: 'Mastercard ••4242', state: 'done' },
    { id: 'PB-2025-11-018', d: 'LUN', n: 18, m: 'NOV', dateLong: 'Lunes, 18 nov 2025',  hours: '17:00 – 18:30', box: 'BOX 1 · Industrial', sede: 'Madrid · Salamanca', dur: '90 min',  price: '20,00 €', subtotal: '16,53 €', tax: '3,47 €', total: '20,00 €', method: 'Mastercard ••4242', state: 'cancelled' },
    { id: 'PB-2025-11-014', d: 'JUE', n: 14, m: 'NOV', dateLong: 'Jueves, 14 nov 2025', hours: '18:00 – 19:00', box: 'BOX 2 · Neón',       sede: 'Madrid · Chamberí',  dur: '60 min',  price: '15,00 €', subtotal: '12,40 €', tax: '2,60 €', total: '15,00 €', method: 'Visa ••0119',       state: 'done' },
  ];
  const tone = (s) => s === 'upcoming' ? { bg: PB.successBg, fg: PB.success, label: 'Próxima' }
                    : s === 'cancelled' ? { bg: PB.dangerBg, fg: PB.danger, label: 'Cancelada' }
                    : { bg: PB.surface2, fg: PB.ink3, label: 'Completada' };
  return (
    <>
      <StatusBar/>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 110 }}>
        <ProfileHeader title="Historial de reservas" onBack={onBack}/>
        <div style={{ padding: '4px 16px 12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { k: 'Sesiones', v: '14' }, { k: 'Horas totales', v: '18,5' },
            ].map(s => (
              <div key={s.k} style={{ padding: 12, borderRadius: 14, background: PB.surface, border: `1px solid ${PB.line}` }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: PB.ink3 }}>{s.k}</div>
                <div style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 18, marginTop: 2 }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map((it, i) => {
            const t = tone(it.state);
            return (
              <button key={i} onClick={() => setOpen(it)} style={{
                display: 'flex', gap: 12, padding: 12, borderRadius: 14, background: PB.surface,
                border: `1px solid ${PB.line}`, textAlign: 'left', alignItems: 'center',
                cursor: 'pointer', fontFamily: PB.font,
              }}>
                <div style={{ width: 52, padding: '8px 0', borderRadius: 12, background: PB.morado, color: '#fff', textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.1em', opacity: .8 }}>{it.d}</div>
                  <div style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 18, lineHeight: 1 }}>{it.n}</div>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.1em', opacity: .8, marginTop: 2 }}>{it.m}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 14 }}>{it.box}</div>
                  <div style={{ fontSize: 12, color: PB.ink3 }}>{it.sede}</div>
                  <div style={{ fontSize: 12, color: PB.ink3, marginTop: 1 }}>{it.dur} · <span style={{ fontFamily: PB.mono, fontWeight: 700 }}>{it.price}</span></div>
                  <span style={{ display: 'inline-block', marginTop: 6, padding: '2px 8px', borderRadius: 999, background: t.bg, color: t.fg, fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>{t.label}</span>
                </div>
                <Icon name="chevron" size={16} color={PB.ink4}/>
              </button>
            );
          })}
        </div>
      </div>
      <TabBar active="perfil"/>
      {open && <BookingTicket booking={open} onClose={() => setOpen(null)}/>}
    </>
  );
};

// ─── Booking ticket modal ────────────────────────────────────
const BookingTicket = ({ booking, onClose }) => {
  const [downloading, setDownloading] = React.useState(false);
  const [downloaded, setDownloaded] = React.useState(false);
  const b = booking;
  const stateTone = b.state === 'upcoming' ? { bg: PB.successBg, fg: PB.success, label: 'Próxima · pagada' }
                  : b.state === 'cancelled' ? { bg: PB.dangerBg, fg: PB.danger, label: 'Cancelada · reembolsada' }
                  : { bg: PB.mentaSoft, fg: PB.moradoInk, label: 'Completada' };

  const handleDownload = () => {
    if (downloading || downloaded) return;
    setDownloading(true);
    setTimeout(() => { setDownloading(false); setDownloaded(true); }, 1400);
    setTimeout(() => setDownloaded(false), 2400);
  };

  // QR pseudo-grid (deterministic from id)
  const qrCells = React.useMemo(() => {
    const seed = b.id.split('').reduce((a,c) => a + c.charCodeAt(0), 0);
    const N = 21;
    const out = [];
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      // finder squares (corners)
      const inFinder = (x,y) => (x < 7 && y < 7) || (x > N-8 && y < 7) || (x < 7 && y > N-8);
      if (inFinder(x,y)) {
        const fx = x < 7 ? x : N-1-x;
        const fy = y < 7 ? y : N-1-y;
        const ring = (fx === 0 || fx === 6 || fy === 0 || fy === 6);
        const inner = (fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4);
        out.push(ring || inner ? 1 : 0);
      } else {
        out.push(((x*7 + y*13 + seed) % 11) % 3 === 0 ? 1 : 0);
      }
    }
    return out;
  }, [b.id]);

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 80,
      background: 'rgba(20,19,24,.55)', backdropFilter: 'blur(4px)',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      animation: 'pb-fade 220ms ease-out',
    }}>
      <style>{`
        @keyframes pb-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pb-slideup { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes pb-spin { to { transform: rotate(360deg); } }
      `}</style>
      <div onClick={onClose} style={{ flex: 1, cursor: 'pointer' }}/>
      <div style={{
        position: 'relative', maxHeight: '92%', overflowY: 'auto',
        padding: '0 14px 14px', animation: 'pb-slideup 320ms cubic-bezier(.2,.7,.2,1)',
      }}>
        {/* Close handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
          <div style={{ width: 44, height: 5, borderRadius: 999, background: 'rgba(255,255,255,.6)' }}/>
        </div>

        {/* Ticket */}
        <div style={{ position: 'relative', filter: 'drop-shadow(0 18px 30px rgba(20,19,24,.25))' }}>
          <TicketShape>
            {/* Ticket header — morado strip */}
            <div style={{
              padding: '20px 22px 16px', background: PB.morado, color: '#fff',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.16em', opacity: .75 }}>RECIBO</div>
                <div style={{ marginTop: 4 }}><Wordmark color="#fff" height={24}/></div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.14em', opacity: .75 }}>Nº RESERVA</div>
                <div style={{ fontFamily: PB.mono, fontWeight: 700, fontSize: 13, marginTop: 4 }}>{b.id}</div>
              </div>
            </div>

            {/* Estado */}
            <div style={{ padding: '14px 22px 4px' }}>
              <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 999, background: stateTone.bg, color: stateTone.fg, fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>{stateTone.label}</span>
            </div>

            {/* Detalle */}
            <div style={{ padding: '12px 22px 18px' }}>
              <h3 style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 22, letterSpacing: '-.01em', margin: '0 0 4px' }}>{b.box}</h3>
              <div style={{ fontSize: 13, color: PB.ink3 }}>{b.sede}</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 16 }}>
                <Detail label="Fecha" value={b.dateLong}/>
                <Detail label="Horario" value={b.hours} mono/>
                <Detail label="Duración" value={b.dur}/>
                <Detail label="Aforo" value="2 personas"/>
              </div>
            </div>

            {/* Perforación */}
            <Perforation/>

            {/* Línea de items */}
            <div style={{ padding: '16px 22px 8px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: PB.ink3, marginBottom: 10 }}>Concepto</div>
              <Line label={`${b.box}`} sub={`${b.dur} · ${b.hours}`} value={b.price}/>
              <Line label="Subtotal" value={b.subtotal} dim/>
              <Line label="IVA (21 %)" value={b.tax} dim/>
              <div style={{ height: 1, background: PB.line, margin: '10px 0' }}/>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 16 }}>Total</span>
                <span style={{ fontFamily: PB.mono, fontWeight: 700, fontSize: 22, color: PB.ink, letterSpacing: '-.01em' }}>{b.total}</span>
              </div>
              <div style={{ marginTop: 10, fontSize: 12, color: PB.ink3, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="card" size={14} color={PB.ink3}/> Pagado con {b.method}
              </div>
            </div>

            {/* Perforación */}
            <Perforation/>

            {/* QR */}
            <div style={{ padding: '18px 22px 22px', display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{
                width: 96, height: 96, padding: 6, background: '#fff', borderRadius: 10,
                border: `1px solid ${PB.line}`,
                display: 'grid', gridTemplateColumns: 'repeat(21, 1fr)', gridTemplateRows: 'repeat(21, 1fr)', gap: 0,
              }}>
                {qrCells.map((c, i) => (
                  <div key={i} style={{ background: c ? PB.ink : 'transparent' }}/>
                ))}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: PB.ink3 }}>Verificación</div>
                <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 13, marginTop: 4, color: PB.ink2 }}>Muestra este QR si el equipo de soporte te lo pide.</div>
                <div style={{ fontFamily: PB.mono, fontSize: 10, color: PB.ink3, marginTop: 6, wordBreak: 'break-all' }}>{b.id}-{b.n}-{b.m}</div>
              </div>
            </div>
          </TicketShape>
        </div>

        {/* Acciones */}
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={handleDownload} disabled={downloading} style={{
            width: '100%', padding: '16px', borderRadius: 14, border: 0,
            background: downloaded ? PB.success : PB.ink, color: '#fff',
            fontFamily: PB.font, fontWeight: 700, fontSize: 15, letterSpacing: '-.005em',
            cursor: downloading ? 'wait' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            transition: 'all 220ms cubic-bezier(.2,.7,.2,1)',
            boxShadow: '0 6px 18px rgba(20,19,24,.25)',
          }}>
            {downloading ? (<>
              <span style={{ width: 16, height: 16, borderRadius: 999, border: '2px solid rgba(255,255,255,.35)', borderTopColor: '#fff', animation: 'pb-spin 700ms linear infinite' }}/>
              Generando PDF…
            </>) : downloaded ? (<>
              <Icon name="check" size={18} color="#fff"/>
              Factura guardada
            </>) : (<>
              <Icon name="doc" size={18} color="#fff"/>
              Descargar factura
            </>)}
          </button>
          {b.state === 'upcoming' && (
            <button style={{
              width: '100%', padding: '14px', borderRadius: 14, border: `1px solid ${PB.line}`,
              background: PB.surface, color: PB.danger,
              fontFamily: PB.font, fontWeight: 700, fontSize: 14, cursor: 'pointer',
            }}>Cancelar reserva</button>
          )}
          <button onClick={onClose} style={{
            width: '100%', padding: '12px', borderRadius: 14, border: 0,
            background: 'transparent', color: '#fff',
            fontFamily: PB.font, fontWeight: 700, fontSize: 14, cursor: 'pointer',
          }}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

// Ticket shape: white card with scalloped notches (perforations are inside as <Perforation/>)
const TicketShape = ({ children }) => (
  <div style={{
    position: 'relative', background: PB.surface, borderRadius: 18, overflow: 'hidden',
    boxShadow: '0 1px 0 rgba(0,0,0,.04)',
  }}>{children}</div>
);

// Perforation row: dashed line + small notches at edges
const Perforation = () => (
  <div style={{ position: 'relative', height: 14 }}>
    <div style={{
      position: 'absolute', left: -10, top: '50%', transform: 'translateY(-50%)',
      width: 20, height: 20, borderRadius: 999, background: '#39283e',
    }}/>
    <div style={{
      position: 'absolute', right: -10, top: '50%', transform: 'translateY(-50%)',
      width: 20, height: 20, borderRadius: 999, background: '#39283e',
    }}/>
    <div style={{
      position: 'absolute', left: 16, right: 16, top: '50%',
      borderTop: `2px dashed ${PB.line}`,
    }}/>
  </div>
);

const Detail = ({ label, value, mono }) => (
  <div>
    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: PB.ink3 }}>{label}</div>
    <div style={{ fontFamily: mono ? PB.mono : PB.font, fontWeight: 700, fontSize: 14, color: PB.ink, marginTop: 3 }}>{value}</div>
  </div>
);

const Line = ({ label, sub, value, dim }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '4px 0' }}>
    <div style={{ minWidth: 0, paddingRight: 10 }}>
      <div style={{ fontFamily: PB.font, fontWeight: dim ? 500 : 700, fontSize: 13, color: dim ? PB.ink3 : PB.ink }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: PB.ink3, marginTop: 1 }}>{sub}</div>}
    </div>
    <div style={{ fontFamily: PB.mono, fontWeight: 700, fontSize: 14, color: dim ? PB.ink3 : PB.ink, whiteSpace: 'nowrap' }}>{value}</div>
  </div>
);

// ─── Mi contrato y normativa ─────────────────────────────────
const ScreenContract = ({ onBack }) => {
  const sections = [
    {
      emoji: '🛑',
      title: 'Protege la barra',
      subtitle: 'Es tu compañera de baile',
      tone: PB.danger, toneBg: PB.dangerBg,
      rules: [
        { t: 'Sin anillos, pulseras, relojes ni piercings corporales', s: 'Pueden rayar el metal — una barra rayada es peligrosa y causa cortes.' },
        { t: 'Prohibida la resina (pega) y las ceras', s: 'Solo magnesio líquido o grips específicos de pole (Dry Hands, Monkey Hands…).' },
        { t: 'Limpia la barra al terminar', s: 'Usa el bote de alcohol y la bayeta de microfibra de tu box.' },
      ],
    },
    {
      emoji: '🧴',
      title: 'Preparación y calzado',
      tone: PB.morado, toneBg: PB.info_bg || 'rgba(72,35,128,.08)',
      rules: [
        { t: 'Cero cremas corporales o aceites el día de tu entrenamiento', s: 'Hacen que la barra resbale y comprometen tu seguridad y la de la siguiente persona.' },
        { t: 'Calzado: descalza, calcetines o tacones específicos de pole (tipo Pleasers)', s: 'Prohibido el calzado de calle en la zona de baile y colchonetas.' },
      ],
    },
    {
      emoji: '⏱️',
      title: 'Tu tiempo es tuyo',
      subtitle: 'Pero el del siguiente también',
      tone: PB.warn, toneBg: PB.warnBg,
      rules: [
        { t: 'Tu código de acceso expira al finalizar tu hora', s: 'Recibirás un aviso 10 minutos antes en la app.' },
        { t: 'Tarifa Flex: 0,20 €/min extra', s: 'Si nadie espera y decides alargar, se aplica automáticamente hasta que abras la puerta para salir.' },
        { t: 'Reserva 5 minutos del final para limpiar y recoger', s: 'Limpia la barra, recoge tus cosas y cámbiate antes de salir.' },
      ],
    },
    {
      emoji: '🧹',
      title: 'Higiene y respeto',
      tone: PB.menta_deep || PB.success, toneBg: PB.successBg,
      rules: [
        { t: 'No dejes botellas, pañuelos ni restos de magnesio en el suelo', s: 'Usa la papelera del box.' },
        { t: 'Apaga luces, aire acondicionado y altavoz Bluetooth antes de salir', s: 'Desde la app o los interruptores del box.' },
      ],
    },
    {
      emoji: '🔒',
      title: 'Seguridad',
      subtitle: 'Tolerancia cero',
      tone: PB.danger, toneBg: PB.dangerBg,
      rules: [
        { t: 'Acceso personal e intransferible', s: 'Tu llave digital es solo tuya. Permitir acceso a personas no registradas conlleva expulsión inmediata y bloqueo de la cuenta.' },
        { t: 'Sin cámaras dentro de los boxes privados', s: 'Por tu privacidad. El pasillo y el acceso principal sí están videovigilados 24/7.' },
        { t: 'Botón rojo de S.O.S. en la app', s: 'Si hay un accidente o la puerta no abre, púlsalo y conectamos contigo en menos de 60 segundos.' },
      ],
    },
  ];
  return (
    <>
      <StatusBar/>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 110 }}>
        <ProfileHeader title="Mi contrato y normativa" onBack={onBack}
          right={<button style={{ background: 'transparent', border: 0, color: PB.morado, fontFamily: PB.font, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>PDF</button>}/>
        <div style={{ margin: '6px 16px 16px', padding: 16, borderRadius: 18, background: `linear-gradient(160deg, ${PB.surface} 0%, ${PB.mentaSoft} 200%)`, border: `1px solid ${PB.line}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 999, background: PB.successBg, color: PB.success, display: 'grid', placeItems: 'center' }}>
              <Icon name="check" size={20}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 16 }}>Descargo firmado</div>
              <div style={{ fontSize: 12, color: PB.ink3 }}>14 oct 2025 · 10:42h · IP 81.34.•••.••</div>
            </div>
          </div>
        </div>

        {sections.map((sec, si) => (
          <div key={si} style={{ margin: '0 16px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 4px 8px' }}>
              <div style={{
                width: 30, height: 30, borderRadius: 10, background: sec.toneBg,
                display: 'grid', placeItems: 'center', fontSize: 16, lineHeight: 1,
              }}>{sec.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 15, letterSpacing: '-.005em', color: PB.ink }}>
                  <span style={{ color: PB.ink3, fontWeight: 700, marginRight: 6 }}>{si + 1}.</span>{sec.title}
                </div>
                {sec.subtitle && (
                  <div style={{ fontSize: 11, color: PB.ink3, fontStyle: 'italic', marginTop: 1 }}>{sec.subtitle}</div>
                )}
              </div>
            </div>
            <div style={{ borderRadius: 18, background: PB.surface, border: `1px solid ${PB.line}`, overflow: 'hidden' }}>
              {sec.rules.map((r, ri) => (
                <div key={ri} style={{ display: 'flex', gap: 12, padding: '14px', borderTop: ri ? `1px solid ${PB.line}` : 0 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 999, background: sec.toneBg, color: sec.tone,
                    display: 'grid', placeItems: 'center', flexShrink: 0, marginTop: 1,
                  }}>
                    <Icon name="check" size={13} color={sec.tone}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 13.5, color: PB.ink, lineHeight: 1.35 }}>{r.t}</div>
                    <div style={{ fontSize: 12, color: PB.ink3, marginTop: 3, lineHeight: 1.45 }}>{r.s}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ padding: '4px 20px 0', fontSize: 11, color: PB.ink3, lineHeight: 1.5 }}>
          La normativa completa y el contrato están disponibles en PDF. Última actualización: 1 oct 2025.
        </div>
      </div>
      <TabBar active="perfil"/>
    </>
  );
};

// ─── Actualizar DNI / selfie ─────────────────────────────────
const ScreenKYC = ({ onBack }) => {
  const Step = ({ n, icon, title, sub, state }) => {
    const isOk = state === 'ok', isPend = state === 'pending';
    return (
      <div style={{ display: 'flex', gap: 14, padding: 14, borderRadius: 16, background: PB.surface, border: `1px solid ${isOk ? PB.success : PB.line}`, alignItems: 'center' }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: isOk ? PB.successBg : PB.surface2, color: isOk ? PB.success : PB.morado, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <Icon name={isOk ? 'check' : icon} size={20} color={isOk ? PB.success : PB.morado}/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: PB.ink3 }}>Paso {n}</div>
          <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 14 }}>{title}</div>
          <div style={{ fontSize: 12, color: isOk ? PB.success : PB.ink3, marginTop: 2 }}>{sub}</div>
        </div>
        {isPend && <Icon name="chevron" size={18} color={PB.ink4}/>}
      </div>
    );
  };
  return (
    <>
      <StatusBar/>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 130 }}>
        <ProfileHeader title="Verificación de identidad" onBack={onBack}/>
        <div style={{ margin: '6px 16px 14px', padding: 16, borderRadius: 18, background: PB.morado, color: '#fff', position: 'relative', overflow: 'hidden' }}>
          <Eyebrow color={PB.menta}>Por qué te lo pedimos</Eyebrow>
          <div style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 17, marginTop: 8, lineHeight: 1.3 }}>
            Para entrar sola al local con tu llave digital, tu identidad debe estar verificada.
          </div>
          <div style={{ fontSize: 12, opacity: .8, marginTop: 8 }}>El proceso es manual y se revisa en menos de 24h.</div>
        </div>
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Step n="1" icon="card"    title="Foto del DNI · anverso"  sub="Subido el 14 oct 2025" state="ok"/>
          <Step n="2" icon="card"    title="Foto del DNI · reverso"  sub="Subido el 14 oct 2025" state="ok"/>
          <Step n="3" icon="profile" title="Selfie con DNI en mano"  sub="Pendiente · sube una nueva si tu DNI ha caducado" state="pending"/>
        </div>
        <div style={{ padding: '14px 16px 0' }}>
          <Button full icon="camera" style={{ padding: '16px', fontSize: 15 }}>
            Hacer selfie ahora
          </Button>
          <button style={{ marginTop: 8, width: '100%', padding: '12px', borderRadius: 14, border: `1px solid ${PB.line}`, background: PB.surface, fontFamily: PB.font, fontWeight: 700, fontSize: 14, color: PB.ink2, cursor: 'pointer' }}>
            Subir desde galería
          </button>
        </div>
        <div style={{ margin: '14px 16px 0', padding: 12, borderRadius: 12, background: PB.surface2, fontSize: 11.5, color: PB.ink3, lineHeight: 1.45, display: 'flex', gap: 10 }}>
          <Icon name="shield" size={14} color={PB.morado}/>
          Tus documentos se cifran y se borran automáticamente a los 6 meses tras la baja.
        </div>
      </div>
      <TabBar active="perfil"/>
    </>
  );
};

// ─── Ayuda y soporte técnico ─────────────────────────────────
const ScreenSupport = ({ onBack }) => {
  const channels = [
    { icon: 'chat',  title: 'Chat en directo',   sub: 'Lun–Dom · 9–22h · Tiempo medio 4 min', cta: 'Abrir chat', primary: true },
    { icon: 'phone', title: 'Llamada de emergencia', sub: 'Solo si estás dentro del box ahora mismo', cta: '+34 900 000 000', emergency: true },
    { icon: 'help',  title: 'Email',              sub: 'hola@polebox.es · respuesta <24h', cta: 'Escribir' },
  ];
  const tickets = [
    { id: '#3201', t: 'No se abrió la puerta del BOX 1', state: 'Resuelto', when: 'Ayer' },
    { id: '#3144', t: 'Cobro duplicado en reserva',       state: 'Reembolsado', when: '12 nov' },
  ];
  return (
    <>
      <StatusBar/>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 110 }}>
        <ProfileHeader title="Ayuda y soporte" onBack={onBack}/>
        <div style={{ padding: '4px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {channels.map((c, i) => (
            <button key={i} style={{
              display: 'flex', gap: 14, alignItems: 'center', padding: 14, borderRadius: 16,
              border: `1px solid ${c.emergency ? PB.danger : (c.primary ? PB.morado : PB.line)}`,
              background: c.emergency ? PB.dangerBg : (c.primary ? PB.morado : PB.surface),
              color: c.emergency ? PB.danger : (c.primary ? '#fff' : PB.ink),
              cursor: 'pointer', textAlign: 'left',
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 14,
                background: c.primary ? 'rgba(255,255,255,.15)' : (c.emergency ? '#fff' : PB.surface2),
                display: 'grid', placeItems: 'center', flexShrink: 0,
              }}>
                <Icon name={c.icon} size={20} color={c.emergency ? PB.danger : (c.primary ? '#fff' : PB.morado)}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 15 }}>{c.title}</div>
                <div style={{ fontSize: 12, opacity: c.primary ? .85 : 1, color: c.primary ? 'rgba(255,255,255,.85)' : (c.emergency ? PB.danger : PB.ink3), marginTop: 2 }}>{c.sub}</div>
              </div>
              <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 12, padding: '6px 10px', borderRadius: 999,
                background: c.primary ? 'rgba(255,255,255,.18)' : (c.emergency ? '#fff' : PB.morado),
                color: c.primary ? '#fff' : (c.emergency ? PB.danger : '#fff'),
              }}>{c.cta}</div>
            </button>
          ))}
        </div>
        <div style={{ padding: '20px 20px 6px', fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: PB.ink3 }}>Tus tickets</div>
        <div style={{ margin: '0 16px', borderRadius: 16, background: PB.surface, border: `1px solid ${PB.line}`, overflow: 'hidden' }}>
          {tickets.map((t, i) => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 14px', borderTop: i ? `1px solid ${PB.line}` : 0 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: PB.successBg, color: PB.success, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <Icon name="check" size={16}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 13.5 }}>{t.t}</div>
                <div style={{ fontSize: 11, color: PB.ink3, marginTop: 2 }}><span style={{ fontFamily: PB.mono, fontWeight: 700 }}>{t.id}</span> · {t.state} · {t.when}</div>
              </div>
              <Icon name="chevron" size={16} color={PB.ink4}/>
            </div>
          ))}
        </div>
      </div>
      <TabBar active="perfil"/>
    </>
  );
};

// ─── Preguntas frecuentes ────────────────────────────────────
const ScreenFAQ = ({ onBack }) => {
  const [open, setOpen] = React.useState(0);
  const cats = ['Reservas', 'Acceso al box', 'Pagos', 'Normativa'];
  const [cat, setCat] = React.useState(0);
  const data = [
    [
      { q: '¿Puedo cancelar una reserva?', a: 'Sí, hasta 4 horas antes del inicio sin coste. Después se cobra el 50%.' },
      { q: '¿Cuánto dura una sesión?', a: 'Eliges entre 45, 60, 90 o 120 minutos. Si la sala sigue libre al terminar, puedes activar la tarifa Flex (0,20 €/min) y seguir entrenando.' },
      { q: '¿Puedo reservar para alguien más?', a: 'Solo el titular de la cuenta puede entrar al box. Si vais dos, cada una debe tener cuenta verificada.' },
    ],
    [
      { q: '¿Qué pasa si llego antes de mi hora?', a: 'La llave digital se activa 5 minutos antes del inicio. Antes de ese momento la puerta no se abrirá.' },
      { q: 'Mi móvil se ha quedado sin batería', a: 'Llama al teléfono de emergencia desde otro móvil; soporte te abre remotamente.' },
      { q: '¿Puedo cambiar de box una vez dentro?', a: 'No. La llave solo abre el box reservado. Si está roto algo, contacta soporte y te reubicamos sin coste.' },
    ],
    [
      { q: '¿Qué métodos de pago aceptáis?', a: 'Apple Pay, Google Pay, tarjeta (Visa/Mastercard/Amex) y Bizum. Todo procesado por Stripe.' },
      { q: '¿Cuándo se cobra la reserva?', a: 'En el momento de confirmarla. Si cancelas a tiempo, se devuelve íntegra en 3-5 días.' },
      { q: '¿Hay bonos de varias sesiones?', a: 'Próximamente — bonos de 5 y 10 sesiones con descuento del 10-15%.' },
    ],
    [
      { q: '¿Hay aforo máximo?', a: 'Sí, 2 personas por box (excepto BOX 3 Espejo, máx. 1).' },
      { q: '¿Puedo grabar?', a: 'Solo a ti misma. Está prohibido grabar a otras personas sin su consentimiento.' },
      { q: '¿Aceites o magnesio?', a: 'Magnesio sí — lo vendemos en máquina expendedora del pasillo. Aceites y cremas: prohibidos, dañan la barra.' },
    ],
  ];
  const list = data[cat];
  return (
    <>
      <StatusBar/>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 110 }}>
        <ProfileHeader title="Preguntas frecuentes" onBack={onBack}/>
        <div style={{ padding: '4px 16px 4px' }}>
          <div style={{ position: 'relative' }}>
            <input placeholder="Busca una pregunta…" style={{
              width: '100%', boxSizing: 'border-box', padding: '12px 14px 12px 40px',
              borderRadius: 14, border: `1px solid ${PB.line}`, background: PB.surface,
              fontFamily: PB.font, fontSize: 14, outline: 'none',
            }}/>
            <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}>
              <Icon name="help" size={16} color={PB.ink3}/>
            </div>
          </div>
        </div>
        <div style={{ padding: '12px 16px 4px', display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {cats.map((c, i) => {
            const on = i === cat;
            return (
              <button key={c} onClick={() => { setCat(i); setOpen(0); }} style={{
                flexShrink: 0, padding: '8px 14px', borderRadius: 999, border: `1px solid ${on ? PB.morado : PB.line}`,
                background: on ? PB.morado : PB.surface, color: on ? '#fff' : PB.ink2,
                fontFamily: PB.font, fontWeight: 700, fontSize: 12.5, cursor: 'pointer',
              }}>{c}</button>
            );
          })}
        </div>
        <div style={{ margin: '10px 16px', borderRadius: 18, background: PB.surface, border: `1px solid ${PB.line}`, overflow: 'hidden' }}>
          {list.map((it, i) => {
            const isOpen = i === open;
            return (
              <div key={i} style={{ borderTop: i ? `1px solid ${PB.line}` : 0 }}>
                <button onClick={() => setOpen(isOpen ? -1 : i)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                  padding: '14px 14px', background: 'transparent', border: 0, cursor: 'pointer', textAlign: 'left',
                }}>
                  <span style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 14, color: PB.ink }}>{it.q}</span>
                  <div style={{ width: 28, height: 28, borderRadius: 999, background: isOpen ? PB.morado : PB.surface2, color: isOpen ? '#fff' : PB.ink2, display: 'grid', placeItems: 'center', flexShrink: 0, transition: 'all 220ms' }}>
                    <Icon name={isOpen ? 'check' : 'plus'} size={14} color={isOpen ? '#fff' : PB.ink2}/>
                  </div>
                </button>
                {isOpen && (
                  <div style={{ padding: '0 14px 16px', fontSize: 13, color: PB.ink2, lineHeight: 1.5 }}>{it.a}</div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ padding: '8px 20px 0', fontSize: 12, color: PB.ink3, textAlign: 'center' }}>
          ¿No encuentras tu respuesta? <span style={{ color: PB.morado, fontWeight: 700, cursor: 'pointer' }}>Habla con soporte</span>
        </div>
      </div>
      <TabBar active="perfil"/>
    </>
  );
};

Object.assign(window, {
  ScreenPaymentMethods, ScreenHistory, ScreenContract, ScreenKYC, ScreenSupport, ScreenFAQ,
});

// ─── Historial de pedidos (tienda) ──────────────────────────
const ScreenOrderHistory = ({ onBack }) => {
  const [open, setOpen] = React.useState(null);

  const orders = [
    { id: 'PB-ORD-00042', date: '12 dic 2025', delivery: 'locker', venueName: 'Salamanca', lockerId: 'L2', lockerCode: '7483', items: [{name:'Magnesio líquido',qty:2,price:8.50},{name:'Dry Hands',qty:1,price:12.00}], shipping: 0, state: 'entregado', method: 'Mastercard ••4242' },
    { id: 'PB-ORD-00038', date: '4 dic 2025',  delivery: 'home',   addr: 'C/ Velázquez 42, Madrid', items: [{name:'Shorts pole',qty:1,price:28.00},{name:'Calcetines grip',qty:2,price:9.00}], shipping: 4.99, state: 'enviado', tracking: 'CE123456789ES', method: 'Apple Pay',
      trackingEvents: [
        { label: 'Pedido confirmado',      detail: 'Pago procesado. Tu pedido está confirmado.',                  time: '4 dic · 09:14', done: true  },
        { label: 'En preparación',         detail: 'POLEBOX Salamanca está preparando tu pedido.',                time: '4 dic · 11:02', done: true  },
        { label: 'Recogido por mensajero', detail: 'Correos Express ha recogido el paquete. Ref. CE123456789ES.', time: '5 dic · 08:47', done: true  },
        { label: 'En reparto',             detail: 'Tu paquete está en reparto en tu zona de entrega.',           time: '5 dic · 14:22', active: true },
        { label: 'Entregado',              detail: 'Previsto hoy antes de las 21:00.',                            time: null,            done: false  },
      ],
    },
    { id: 'PB-ORD-00031', date: '21 nov 2025', delivery: 'locker', venueName: 'Chamberí',   lockerId: 'L1', lockerCode: '3921', items: [{name:'Tiza en polvo',qty:3,price:5.00},{name:'Rodilleras pole',qty:1,price:18.00}], shipping: 0, state: 'entregado', method: 'Mastercard ••4242' },
    { id: 'PB-ORD-00024', date: '8 nov 2025',  delivery: 'home',   addr: 'C/ Velázquez 42, Madrid', items: [{name:'Top sin tirantes',qty:1,price:24.00}], shipping: 4.99, state: 'entregado', method: 'Visa ••0119' },
    { id: 'PB-ORD-00019', date: '28 oct 2025', delivery: 'locker', venueName: 'Salamanca',  lockerId: 'L3', lockerCode: '5512', items: [{name:'Magnesio líquido',qty:1,price:8.50},{name:'Toalla microfibra',qty:1,price:12.00}], shipping: 0, state: 'entregado', method: 'Google Pay' },
  ];

  const fmt   = (n) => n.toFixed(2).replace('.', ',') + ' €';
  const total = (o) => o.items.reduce((s, i) => s + i.price * i.qty, 0) + o.shipping;

  const tone = (s) => ({
    entregado: { bg: PB.successBg, fg: PB.success, label: 'Entregado' },
    enviado:   { bg: PB.warnBg,    fg: PB.warn,    label: 'En camino' },
    pendiente: { bg: PB.surface2,  fg: PB.ink3,    label: 'Pendiente' },
  }[s] || { bg: PB.surface2, fg: PB.ink3, label: s });

  const totalGastado = orders.reduce((s, o) => s + total(o), 0);

  return (
    <>
      <StatusBar/>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 110 }}>
        <ProfileHeader title="Historial de pedidos" onBack={onBack}/>

        {/* Stats */}
        <div style={{ padding: '4px 16px 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { k: 'Pedidos',       v: orders.length.toString() },
              { k: 'Total gastado', v: fmt(totalGastado) },
            ].map(s => (
              <div key={s.k} style={{ padding: 12, borderRadius: 14, background: PB.surface, border: `1px solid ${PB.line}` }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: PB.ink3 }}>{s.k}</div>
                <div style={{ fontFamily: s.k === 'Total gastado' ? PB.mono : PB.font, fontWeight: 800, fontSize: 18, marginTop: 2 }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Lista */}
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {orders.map((o) => {
            const t = tone(o.state);
            return (
              <button key={o.id} onClick={() => setOpen(o)} style={{
                display: 'flex', gap: 12, padding: 14, borderRadius: 16, background: PB.surface,
                border: `1px solid ${PB.line}`, textAlign: 'left', alignItems: 'center',
                cursor: 'pointer', fontFamily: PB.font, width: '100%',
              }}>
                {/* Icono entrega */}
                <div style={{ width: 44, height: 44, borderRadius: 13, flexShrink: 0, display: 'grid', placeItems: 'center',
                  background: o.delivery === 'locker' ? PB.mentaSoft : PB.surface2 }}>
                  <Icon name={o.delivery === 'locker' ? 'bolt' : 'refresh'} size={20} color={PB.morado}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <span style={{ fontFamily: PB.mono, fontWeight: 700, fontSize: 12, color: PB.morado }}>{o.id}</span>
                    <span style={{ padding: '2px 7px', borderRadius: 999, background: t.bg, color: t.fg, fontSize: 9, fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase' }}>{t.label}</span>
                  </div>
                  <div style={{ fontSize: 12, color: PB.ink3 }}>{o.date} · {o.delivery === 'locker' ? `Locker ${o.lockerId} · ${o.venueName}` : 'Envío a domicilio'}</div>
                  <div style={{ fontSize: 12, color: PB.ink3, marginTop: 1 }}>
                    {o.items.length} artículo{o.items.length !== 1 ? 's' : ''} · <span style={{ fontFamily: PB.mono, fontWeight: 700 }}>{fmt(total(o))}</span>
                  </div>
                </div>
                <Icon name="chevron" size={16} color={PB.ink4}/>
              </button>
            );
          })}
        </div>
      </div>
      <TabBar active="perfil"/>
      {open && <OrderTicket order={open} onClose={() => setOpen(null)} fmt={fmt} total={total} tone={tone}/>}
    </>
  );
};

// ─── Shipping tracker (solo para pedidos en camino) ──────────
const ShippingTracker = ({ events, tracking }) => (
  <div style={{ padding: '18px 22px 22px' }}>
    <style>{`
      @keyframes pb-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(182,122,18,.45)} 50%{box-shadow:0 0 0 7px rgba(182,122,18,0)} }
    `}</style>
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: PB.ink3 }}>Seguimiento del envío</div>
    <div style={{ fontFamily: PB.mono, fontSize: 11, color: PB.ink3, marginTop: 3, marginBottom: 18 }}>{tracking} · Correos Express</div>
    {events.map((ev, i) => {
      const isLast = i === events.length - 1;
      const lineColor = ev.done
        ? (!isLast && (events[i+1].done || events[i+1].active) ? PB.success : `linear-gradient(${PB.success}, ${PB.warn})`)
        : PB.line;
      return (
        <div key={i} style={{ display: 'flex', gap: 14 }}>
          {/* Columna visual */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 28, flexShrink: 0 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 999, flexShrink: 0,
              background: ev.done ? PB.success : ev.active ? PB.warn : PB.surface2,
              border: ev.done || ev.active ? 'none' : `2px solid ${PB.line}`,
              display: 'grid', placeItems: 'center',
              animation: ev.active ? 'pb-pulse 1.6s ease-in-out infinite' : 'none',
            }}>
              {ev.done   && <Icon name="check"   size={13} color="#fff"/>}
              {ev.active && <Icon name="refresh" size={12} color="#fff"/>}
            </div>
            {!isLast && (
              <div style={{ width: 2, flex: 1, minHeight: 22, background: lineColor, margin: '3px 0' }}/>
            )}
          </div>
          {/* Contenido */}
          <div style={{ flex: 1, paddingBottom: isLast ? 0 : 20, paddingTop: 5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{
                fontFamily: PB.font, fontWeight: ev.active ? 800 : 700, fontSize: 13,
                color: ev.done ? PB.ink : ev.active ? PB.ink : PB.ink4,
              }}>{ev.label}</span>
              {ev.active && (
                <span style={{ padding: '2px 7px', borderRadius: 999, background: PB.warnBg, color: PB.warn, fontSize: 9, fontWeight: 800, letterSpacing: '.08em' }}>AHORA</span>
              )}
            </div>
            <div style={{ fontSize: 11, color: PB.ink3, marginTop: 2, lineHeight: 1.4 }}>{ev.detail}</div>
            {ev.time && (
              <div style={{ fontFamily: PB.mono, fontSize: 10, fontWeight: 600, marginTop: 3, color: ev.done ? PB.success : PB.warn }}>{ev.time}</div>
            )}
          </div>
        </div>
      );
    })}
  </div>
);

// ─── Modal detalle de pedido (ticket receipt style) ──────────
const OrderTicket = ({ order, onClose, fmt, total, tone }) => {
  const [downloading, setDownloading] = React.useState(false);
  const [downloaded, setDownloaded] = React.useState(false);
  const o = order;
  const t = tone(o.state);

  const handleDownload = () => {
    if (downloading || downloaded) return;
    setDownloading(true);
    setTimeout(() => { setDownloading(false); setDownloaded(true); }, 1400);
    setTimeout(() => setDownloaded(false), 2400);
  };

  // Precio bruto de artículos
  const itemsTotal = o.items.reduce((s, it) => s + it.price * it.qty, 0);
  const gross = itemsTotal + o.shipping;
  const subtotalExVat = gross / 1.21;
  const vat = gross - subtotalExVat;

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 80,
      background: 'rgba(20,19,24,.55)', backdropFilter: 'blur(4px)',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      animation: 'pb-fade 220ms ease-out',
    }}>
      <div onClick={onClose} style={{ flex: 1, cursor: 'pointer' }}/>
      <div style={{
        position: 'relative', maxHeight: '92%', overflowY: 'auto',
        padding: '0 14px 14px', animation: 'pb-slideup 320ms cubic-bezier(.2,.7,.2,1)',
      }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
          <div style={{ width: 44, height: 5, borderRadius: 999, background: 'rgba(255,255,255,.6)' }}/>
        </div>

        {/* Ticket */}
        <div style={{ position: 'relative', filter: 'drop-shadow(0 18px 30px rgba(20,19,24,.25))' }}>
          <TicketShape>
            {/* Header morado */}
            <div style={{
              padding: '20px 22px 16px', background: PB.morado, color: '#fff',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.16em', opacity: .75 }}>RECIBO</div>
                <div style={{ marginTop: 4 }}><Wordmark color="#fff" height={24}/></div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.14em', opacity: .75 }}>Nº PEDIDO</div>
                <div style={{ fontFamily: PB.mono, fontWeight: 700, fontSize: 13, marginTop: 4 }}>{o.id}</div>
              </div>
            </div>

            {/* Estado */}
            <div style={{ padding: '14px 22px 4px' }}>
              <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 999, background: t.bg, color: t.fg, fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>{t.label}</span>
            </div>

            {/* Detalle de entrega */}
            <div style={{ padding: '12px 22px 18px' }}>
              <h3 style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 20, letterSpacing: '-.01em', margin: '0 0 4px' }}>
                {o.delivery === 'locker' ? `Locker ${o.lockerId}` : 'Envío a domicilio'}
              </h3>
              <div style={{ fontSize: 13, color: PB.ink3 }}>
                {o.delivery === 'locker' ? `POLEBOX ${o.venueName}` : o.addr}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 16 }}>
                <Detail label="Fecha" value={o.date}/>
                <Detail label="Artículos" value={`${o.items.length} producto${o.items.length !== 1 ? 's' : ''}`}/>
                <Detail label="Entrega" value={o.delivery === 'locker' ? 'Locker sede' : 'A domicilio'}/>
                <Detail label="Pago" value={o.method}/>
              </div>
            </div>

            <Perforation/>

            {/* Concepto — items + desglose */}
            <div style={{ padding: '16px 22px 8px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: PB.ink3, marginBottom: 10 }}>Concepto</div>
              {o.items.map((it, i) => (
                <Line key={i} label={it.name} sub={`×${it.qty}`} value={fmt(it.price * it.qty)}/>
              ))}
              {o.shipping > 0 && <Line label="Envío" value={fmt(o.shipping)} dim/>}
              <Line label="Subtotal (sin IVA)" value={fmt(subtotalExVat)} dim/>
              <Line label="IVA (21 %)" value={fmt(vat)} dim/>
              <div style={{ height: 1, background: PB.line, margin: '10px 0' }}/>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 16 }}>Total</span>
                <span style={{ fontFamily: PB.mono, fontWeight: 700, fontSize: 22, color: PB.ink, letterSpacing: '-.01em' }}>{fmt(total(o))}</span>
              </div>
              <div style={{ marginTop: 10, fontSize: 12, color: PB.ink3, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="card" size={14} color={PB.ink3}/> Pagado con {o.method}
              </div>
            </div>

            <Perforation/>

            {/* Sección inferior: locker code, tracker o tracking simple */}
            {o.delivery === 'locker' ? (
              <div style={{ padding: '18px 22px 22px', display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: 14, background: PB.mentaSoft, border: `1px solid ${PB.line}`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <Icon name="bolt" size={30} color={PB.morado}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: PB.ink3 }}>Código de apertura</div>
                  <div style={{ fontFamily: PB.mono, fontWeight: 800, fontSize: 28, color: PB.morado, letterSpacing: '.18em', marginTop: 4 }}>{o.lockerCode}</div>
                  <div style={{ fontFamily: PB.mono, fontSize: 10, color: PB.ink3, marginTop: 4 }}>Válido 48 h · {o.id}</div>
                </div>
              </div>
            ) : o.trackingEvents ? (
              <ShippingTracker events={o.trackingEvents} tracking={o.tracking}/>
            ) : (
              <div style={{ padding: '18px 22px 22px', display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: 14, background: PB.surface2, border: `1px solid ${PB.line}`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <Icon name="refresh" size={30} color={PB.morado}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: PB.ink3 }}>Nº de seguimiento</div>
                  <div style={{ fontFamily: PB.mono, fontWeight: 700, fontSize: 15, color: PB.morado, letterSpacing: '.06em', marginTop: 4, wordBreak: 'break-all' }}>{o.tracking}</div>
                  <div style={{ fontSize: 11, color: PB.ink3, marginTop: 4 }}>Correos Express · {o.id}</div>
                </div>
              </div>
            )}
          </TicketShape>
        </div>

        {/* Acciones */}
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={handleDownload} disabled={downloading} style={{
            width: '100%', padding: '16px', borderRadius: 14, border: 0,
            background: downloaded ? PB.success : PB.ink, color: '#fff',
            fontFamily: PB.font, fontWeight: 700, fontSize: 15, letterSpacing: '-.005em',
            cursor: downloading ? 'wait' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            transition: 'all 220ms cubic-bezier(.2,.7,.2,1)',
            boxShadow: '0 6px 18px rgba(20,19,24,.25)',
          }}>
            {downloading ? (<>
              <span style={{ width: 16, height: 16, borderRadius: 999, border: '2px solid rgba(255,255,255,.35)', borderTopColor: '#fff', animation: 'pb-spin 700ms linear infinite' }}/>
              Generando PDF…
            </>) : downloaded ? (<>
              <Icon name="check" size={18} color="#fff"/>
              Factura guardada
            </>) : (<>
              <Icon name="doc" size={18} color="#fff"/>
              Descargar factura
            </>)}
          </button>
          <button onClick={onClose} style={{
            width: '100%', padding: '12px', borderRadius: 14, border: 0,
            background: 'transparent', color: '#fff',
            fontFamily: PB.font, fontWeight: 700, fontSize: 14, cursor: 'pointer',
          }}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { ScreenOrderHistory });

// ─── Gestor de direcciones de entrega ────────────────────────
const ScreenAddresses = ({ onBack }) => {
  const blank = { alias: 'Casa', nombre: 'Laura Gómez', calle: '', numero: '', piso: '', cp: '', ciudad: 'Madrid' };
  const [addrs, setAddrs] = React.useState([
    { id: 1, alias: 'Casa',    nombre: 'Laura Gómez', calle: 'C/ Velázquez',  numero: '42', piso: '3º B', cp: '28001', ciudad: 'Madrid', isDefault: true  },
    { id: 2, alias: 'Trabajo', nombre: 'Laura Gómez', calle: 'Calle Gran Vía', numero: '30', piso: '2ª',  cp: '28013', ciudad: 'Madrid', isDefault: false },
  ]);
  const [modal, setModal] = React.useState(null);  // null | 'new' | addr.id
  const [form,  setForm]  = React.useState(blank);
  const [saving, setSaving] = React.useState(false);
  const [saved,  setSaved]  = React.useState(false);
  const [aliasCustom, setAliasCustom] = React.useState('');

  const ALIAS_CHIPS = ['Casa', 'Trabajo', 'Gym', 'Otro'];
  const aliasIcon = { Casa: 'home', Trabajo: 'doc', Gym: 'shield', Otro: 'profile' };

  const openAdd  = () => { setForm(blank); setAliasCustom(''); setModal('new'); setSaved(false); };
  const openEdit = a  => { setForm({ ...a }); setAliasCustom(ALIAS_CHIPS.includes(a.alias) ? '' : a.alias); setModal(a.id); setSaved(false); };
  const closeModal   = () => { setModal(null); setSaving(false); setSaved(false); };
  const setDefault   = id => setAddrs(a => a.map(x => ({ ...x, isDefault: x.id === id })));
  const deleteAddr   = id => setAddrs(a => {
    const next = a.filter(x => x.id !== id);
    if (next.length && !next.some(x => x.isDefault)) next[0].isDefault = true;
    return next;
  });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = () => {
    if (saving || saved) return;
    const finalAlias = form.alias === 'Otro' ? (aliasCustom || 'Otro') : form.alias;
    setSaving(true);
    setTimeout(() => {
      if (modal === 'new') {
        const newId = Date.now();
        setAddrs(a => [...a, { ...form, alias: finalAlias, id: newId, isDefault: a.length === 0 }]);
      } else {
        setAddrs(a => a.map(x => x.id === modal ? { ...form, alias: finalAlias, id: modal, isDefault: x.isDefault } : x));
      }
      setSaving(false); setSaved(true);
    }, 1100);
    setTimeout(() => closeModal(), 2300);
  };

  const FInput = ({ label, value, onChange, placeholder }) => (
    <div className="pb-ef" style={{ padding: '10px 20px 0' }}>
      <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: PB.ink3, marginBottom: 5, transition: 'color 150ms', pointerEvents: 'none' }}>{label}</label>
      <input value={value} onChange={onChange} placeholder={placeholder || ''}
        style={{ width: '100%', border: 0, borderBottom: `1.5px solid ${PB.line}`, outline: 0, padding: '2px 0 10px', background: 'transparent', fontFamily: PB.font, fontWeight: 600, fontSize: 15, color: PB.ink, boxSizing: 'border-box', transition: 'border-color 150ms' }}
      />
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes pb-spin{to{transform:rotate(360deg)}}
        @keyframes pb-fade{from{opacity:0}to{opacity:1}}
        @keyframes pb-slideup{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}}
        .pb-ef:focus-within label{color:${PB.morado}!important}
        .pb-ef:focus-within input{border-bottom-color:${PB.morado}!important}
        .pb-ef:focus-within{background:rgba(72,35,128,.025)}
      `}</style>
      <StatusBar/>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 110 }}>
        <ProfileHeader title="Mis direcciones" onBack={onBack}/>

        <div style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {addrs.length === 0 && (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: PB.ink3, fontSize: 14 }}>
              Aún no tienes direcciones guardadas.
            </div>
          )}

          {addrs.map(a => (
            <div key={a.id} style={{
              background: PB.surface, borderRadius: 18, overflow: 'hidden',
              border: `1.5px solid ${a.isDefault ? PB.morado : PB.line}`,
              boxShadow: a.isDefault ? '0 4px 16px rgba(72,35,128,.12)' : '0 2px 6px rgba(20,19,24,.04)',
              transition: 'all 220ms cubic-bezier(.2,.7,.2,1)',
            }}>
              <div style={{ padding: '14px 16px 12px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: a.isDefault ? 'rgba(72,35,128,.1)' : PB.surface2, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <Icon name={aliasIcon[a.alias] || 'home'} size={20} color={a.isDefault ? PB.morado : PB.ink3}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                    <span style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 15, color: PB.ink }}>{a.alias}</span>
                    {a.isDefault && <span style={{ padding: '2px 8px', borderRadius: 999, background: PB.morado, color: '#fff', fontSize: 9, fontWeight: 800, letterSpacing: '.08em' }}>POR DEFECTO</span>}
                  </div>
                  <div style={{ fontSize: 13, color: PB.ink2 }}>{a.nombre}</div>
                  <div style={{ fontSize: 13, color: PB.ink2 }}>{a.calle} {a.numero}{a.piso ? `, ${a.piso}` : ''}</div>
                  <div style={{ fontSize: 12, color: PB.ink3, marginTop: 2 }}>{a.cp} {a.ciudad}</div>
                </div>
              </div>
              <div style={{ borderTop: `1px solid ${PB.line}`, display: 'flex' }}>
                {!a.isDefault && (
                  <button onClick={() => setDefault(a.id)} style={{ flex: 1, padding: '11px 4px', border: 0, borderRight: `1px solid ${PB.line}`, background: 'transparent', color: PB.morado, fontFamily: PB.font, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                    Por defecto
                  </button>
                )}
                <button onClick={() => openEdit(a)} style={{ flex: 1, padding: '11px 4px', border: 0, borderRight: `1px solid ${PB.line}`, background: 'transparent', color: PB.ink2, fontFamily: PB.font, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                  Editar
                </button>
                <button onClick={() => deleteAddr(a.id)} style={{ flex: 1, padding: '11px 4px', border: 0, background: 'transparent', color: PB.danger, fontFamily: PB.font, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}

          <button onClick={openAdd} style={{ padding: '16px', borderRadius: 16, border: `1.5px dashed ${PB.lineStrong}`, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: PB.font, fontWeight: 700, fontSize: 14, color: PB.morado, cursor: 'pointer' }}>
            <Icon name="plus" size={18} color={PB.morado}/> Nueva dirección
          </button>

          <div style={{ padding: '2px 4px', fontSize: 12, color: PB.ink3, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <Icon name="shield" size={14} color={PB.ink4}/>
            <span>Tus direcciones solo se usan para envíos de la tienda POLEBOX y nunca se comparten con terceros.</span>
          </div>
        </div>
      </div>
      <TabBar active="perfil"/>

      {/* ── Modal añadir / editar ── */}
      {modal !== null && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 80, background: 'rgba(20,19,24,.55)', backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', animation: 'pb-fade 220ms ease-out' }}>
          <div onClick={closeModal} style={{ flex: 1, cursor: 'pointer' }}/>
          <div style={{ background: PB.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '90%', overflowY: 'auto', animation: 'pb-slideup 320ms cubic-bezier(.2,.7,.2,1)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 0' }}>
              <div style={{ width: 44, height: 5, borderRadius: 999, background: PB.line }}/>
            </div>
            <div style={{ padding: '14px 20px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 18, letterSpacing: '-.01em' }}>
                {modal === 'new' ? 'Nueva dirección' : 'Editar dirección'}
              </div>
              <button onClick={handleSave} disabled={saving} style={{
                padding: '9px 18px', borderRadius: 999, border: 0,
                background: saved ? PB.success : PB.morado, color: '#fff',
                fontFamily: PB.font, fontWeight: 700, fontSize: 13, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
                transition: 'background 220ms', boxShadow: '0 4px 12px rgba(72,35,128,.3)',
              }}>
                {saving && <span style={{ width: 12, height: 12, borderRadius: 999, border: '2px solid rgba(255,255,255,.4)', borderTopColor: '#fff', animation: 'pb-spin 700ms linear infinite', display: 'inline-block' }}/>}
                {saved   && <Icon name="check" size={14} color="#fff"/>}
                {saving ? 'Guardando…' : saved ? 'Guardado' : 'Guardar'}
              </button>
            </div>

            {/* Alias chips */}
            <div style={{ padding: '4px 20px 14px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: PB.ink3, marginBottom: 8 }}>Alias</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {ALIAS_CHIPS.map(chip => (
                  <button key={chip} onClick={() => setForm(f => ({ ...f, alias: chip }))} style={{
                    padding: '8px 16px', borderRadius: 999, border: `1px solid ${form.alias === chip ? PB.morado : PB.line}`,
                    background: form.alias === chip ? PB.morado : PB.surface,
                    color: form.alias === chip ? '#fff' : PB.ink2,
                    fontFamily: PB.font, fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 180ms',
                  }}>{chip}</button>
                ))}
              </div>
              {form.alias === 'Otro' && (
                <input value={aliasCustom} onChange={e => setAliasCustom(e.target.value)} placeholder="Nombre personalizado"
                  style={{ marginTop: 10, width: '100%', border: 0, borderBottom: `1.5px solid ${PB.morado}`, outline: 0, padding: '4px 0 8px', background: 'transparent', fontFamily: PB.font, fontSize: 15, color: PB.ink, boxSizing: 'border-box' }}
                />
              )}
            </div>

            {/* Campos */}
            <div style={{ borderTop: `1px solid ${PB.line}` }}>
              <FInput label="Nombre del destinatario" value={form.nombre} onChange={set('nombre')}/>
              <div style={{ display: 'flex' }}>
                <div style={{ flex: 2 }}><FInput label="Calle / Avenida" value={form.calle} onChange={set('calle')} placeholder="C/ Velázquez"/></div>
                <div style={{ flex: 1 }}><FInput label="Número" value={form.numero} onChange={set('numero')} placeholder="42"/></div>
              </div>
              <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}><FInput label="Piso / Puerta" value={form.piso} onChange={set('piso')} placeholder="3º B (opcional)"/></div>
                <div style={{ flex: 1 }}><FInput label="Código postal" value={form.cp} onChange={set('cp')} placeholder="28001"/></div>
              </div>
              <FInput label="Ciudad" value={form.ciudad} onChange={set('ciudad')} placeholder="Madrid"/>
            </div>
            <div style={{ height: 36 }}/>
          </div>
        </div>
      )}
    </>
  );
};

// ─── Editar perfil / gestión de cuenta ───────────────────────
const ScreenEditProfile = ({ onBack }) => {
  const [saving, setSaving]       = React.useState(false);
  const [saved, setSaved]         = React.useState(false);
  const [showPwd, setShowPwd]     = React.useState(false);
  const [avatarIdx, setAvatarIdx] = React.useState(0);
  const [form, setForm] = React.useState({
    nombre: 'Laura', apellidos: 'Gómez',
    telefono: '+34 612 345 678', email: 'laura.gomez@correo.com',
    pwdActual: '', pwdNueva: '', pwdConfirm: '',
  });

  const avatarGrads = [
    `linear-gradient(135deg, ${PB.menta}, ${PB.mentaDeep})`,
    `linear-gradient(135deg, #C6AEFF, #7C3AED)`,
    `linear-gradient(135deg, #FCA5A5, #DC2626)`,
    `linear-gradient(135deg, #93C5FD, #2563EB)`,
    `linear-gradient(135deg, #FCD34D, #D97706)`,
  ];

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = () => {
    if (saving || saved) return;
    setSaving(true);
    setTimeout(() => { setSaving(false); setSaved(true); }, 1300);
    setTimeout(() => setSaved(false), 2500);
  };

  const pwdStrength = (() => {
    const p = form.pwdNueva;
    if (!p) return null;
    const score = p.length < 8 ? 0 : p.length < 12 ? 1 : /[A-Z]/.test(p) && /[0-9!@#$%]/.test(p) ? 3 : 2;
    return {
      score,
      label: ['Muy corta', 'Débil', 'Aceptable', 'Fuerte'][score],
      color: [PB.danger, PB.warn, PB.morado, PB.success][score],
    };
  })();

  const Field = ({ label, value, onChange, type = 'text', badge }) => (
    <div className="pb-ef" style={{ padding: '10px 16px 0', borderTop: `1px solid ${PB.line}` }}>
      <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: PB.ink3, marginBottom: 5, transition: 'color 150ms', pointerEvents: 'none' }}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 10 }}>
        <input
          type={type} value={value} onChange={onChange}
          style={{
            flex: 1, border: 0, borderBottom: `1.5px solid ${PB.line}`, outline: 0,
            padding: '2px 0 8px', background: 'transparent',
            fontFamily: PB.font, fontWeight: 600, fontSize: 15, color: PB.ink,
            letterSpacing: type === 'password' && value ? '.15em' : 0,
            transition: 'border-color 150ms',
          }}
        />
        {badge}
      </div>
    </div>
  );

  const SectionLabel = ({ title }) => (
    <div style={{ padding: '0 4px 8px', fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: PB.ink3 }}>{title}</div>
  );
  const Card = ({ children, style }) => (
    <div style={{ background: PB.surface, border: `1px solid ${PB.line}`, borderRadius: 18, overflow: 'hidden', ...style }}>{children}</div>
  );

  return (
    <>
      <style>{`
        @keyframes pb-spin{to{transform:rotate(360deg)}}
        .pb-ef:focus-within label{color:${PB.morado}!important}
        .pb-ef:focus-within input{border-bottom-color:${PB.morado}!important}
        .pb-ef:focus-within{background:rgba(72,35,128,.025)}
      `}</style>
      <StatusBar/>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 110 }}>
        <ProfileHeader
          title="Mi cuenta"
          onBack={onBack}
          right={
            <button onClick={handleSave} disabled={saving} style={{
              padding: '8px 18px', borderRadius: 999, border: 0,
              background: saved ? PB.success : PB.morado, color: '#fff',
              fontFamily: PB.font, fontWeight: 700, fontSize: 13,
              cursor: saving ? 'wait' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'background 220ms cubic-bezier(.2,.7,.2,1)',
              boxShadow: '0 4px 12px rgba(72,35,128,.3)',
            }}>
              {saving && <span style={{ width: 12, height: 12, borderRadius: 999, border: '2px solid rgba(255,255,255,.4)', borderTopColor: '#fff', animation: 'pb-spin 700ms linear infinite', display: 'inline-block' }}/>}
              {saved && <Icon name="check" size={14} color="#fff"/>}
              {saving ? 'Guardando…' : saved ? 'Guardado' : 'Guardar'}
            </button>
          }
        />

        {/* ── Avatar ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 16px 20px', gap: 10 }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 96, height: 96, borderRadius: 999,
              background: avatarGrads[avatarIdx],
              border: `3px solid ${PB.morado}`,
              display: 'grid', placeItems: 'center',
              color: PB.moradoInk, fontFamily: PB.font, fontWeight: 800, fontSize: 30,
              boxShadow: '0 8px 24px rgba(72,35,128,.22)',
              transition: 'background 350ms cubic-bezier(.2,.7,.2,1)',
            }}>LG</div>
            <button
              onClick={() => setAvatarIdx(i => (i + 1) % avatarGrads.length)}
              style={{
                position: 'absolute', bottom: 2, right: 2,
                width: 32, height: 32, borderRadius: 999,
                background: PB.morado, border: '2.5px solid #fff',
                display: 'grid', placeItems: 'center', cursor: 'pointer',
                boxShadow: '0 3px 10px rgba(72,35,128,.4)',
              }}>
              <Icon name="camera" size={14} color="#fff"/>
            </button>
          </div>
          {/* Color swatches */}
          <div style={{ display: 'flex', gap: 8 }}>
            {avatarGrads.map((g, i) => (
              <button key={i} onClick={() => setAvatarIdx(i)} style={{
                width: 24, height: 24, borderRadius: 999, background: g, border: 0,
                cursor: 'pointer',
                outline: i === avatarIdx ? `2px solid ${PB.morado}` : '2px solid transparent',
                outlineOffset: 2,
                transition: 'outline 180ms',
              }}/>
            ))}
          </div>
          <div style={{ fontSize: 12, color: PB.ink3 }}>Foto de perfil · elige un color o sube imagen</div>
        </div>

        {/* ── Datos personales ── */}
        <div style={{ margin: '0 16px' }}>
          <SectionLabel title="Datos personales"/>
          <Card>
            <Field label="Nombre"    value={form.nombre}    onChange={set('nombre')}/>
            <Field label="Apellidos" value={form.apellidos} onChange={set('apellidos')}/>
            <Field label="Teléfono"  value={form.telefono}  onChange={set('telefono')} type="tel"/>
          </Card>
        </div>

        {/* ── Acceso ── */}
        <div style={{ margin: '16px 16px 0' }}>
          <SectionLabel title="Acceso"/>
          <Card>
            <Field
              label="Correo electrónico" value={form.email} onChange={set('email')} type="email"
              badge={
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 999, background: PB.successBg, color: PB.success, fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
                  <Icon name="check" size={11}/> Verificado
                </span>
              }
            />
            {/* Contraseña */}
            <div style={{ padding: '12px 16px', borderTop: `1px solid ${PB.line}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: PB.ink3, marginBottom: 4 }}>Contraseña</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'monospace', fontSize: 18, letterSpacing: '.2em', color: PB.ink3 }}>••••••••</span>
                <button onClick={() => setShowPwd(v => !v)} style={{
                  padding: '7px 16px', borderRadius: 999, border: 0,
                  background: showPwd ? PB.surface2 : PB.morado,
                  color: showPwd ? PB.ink2 : '#fff',
                  fontFamily: PB.font, fontWeight: 700, fontSize: 12, cursor: 'pointer',
                  transition: 'all 200ms',
                }}>{showPwd ? 'Cancelar' : 'Cambiar'}</button>
              </div>
            </div>
            {/* Formulario de contraseña */}
            {showPwd && (<>
              <Field label="Contraseña actual"  value={form.pwdActual}  onChange={set('pwdActual')}  type="password"/>
              <Field label="Nueva contraseña"   value={form.pwdNueva}   onChange={set('pwdNueva')}   type="password"/>
              {pwdStrength && (
                <div style={{ padding: '0 16px 12px' }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
                    {[0,1,2,3].map(i => (
                      <div key={i} style={{ flex: 1, height: 3, borderRadius: 999, background: i <= pwdStrength.score ? pwdStrength.color : PB.line, transition: 'background 300ms' }}/>
                    ))}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: pwdStrength.color }}>{pwdStrength.label}</span>
                </div>
              )}
              <Field
                label="Confirmar nueva contraseña" value={form.pwdConfirm} onChange={set('pwdConfirm')} type="password"
                badge={form.pwdConfirm && form.pwdNueva && (
                  form.pwdConfirm === form.pwdNueva
                    ? <Icon name="check" size={16} color={PB.success}/>
                    : <span style={{ fontSize: 11, color: PB.danger, fontWeight: 700, whiteSpace: 'nowrap' }}>No coincide</span>
                )}
              />
            </>)}
          </Card>
        </div>

        {/* ── Zona de peligro ── */}
        <div style={{ margin: '24px 16px 4px' }}>
          <SectionLabel title="Zona de peligro"/>
          <Card>
            <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 14, color: PB.ink }}>Eliminar mi cuenta</div>
                <div style={{ fontSize: 12, color: PB.ink3, marginTop: 2 }}>Acción permanente e irreversible</div>
              </div>
              <button style={{
                padding: '8px 14px', borderRadius: 10, border: `1px solid ${PB.dangerBg}`,
                background: PB.dangerBg, color: PB.danger,
                fontFamily: PB.font, fontWeight: 700, fontSize: 12, cursor: 'pointer',
              }}>Eliminar</button>
            </div>
          </Card>
        </div>
      </div>
      <TabBar active="perfil"/>
    </>
  );
};

Object.assign(window, { ScreenAddresses, ScreenEditProfile });
