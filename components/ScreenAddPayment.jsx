// POLEBOX — Añadir método de pago
// Formulario tipo Stripe con preview de tarjeta en vivo + detección de marca.

const ScreenAddPayment = ({ onBack, onSaved }) => {
  const [num, setNum] = React.useState('');
  const [name, setName] = React.useState('');
  const [exp, setExp] = React.useState('');
  const [cvc, setCvc] = React.useState('');
  const [makeDefault, setMakeDefault] = React.useState(true);
  const [flipped, setFlipped] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  // ─── Escáner ────────────────────────────────────────────
  const [scan, setScan] = React.useState(null); // null | 'aiming' | 'capturing' | 'reading' | 'done'
  const [scanFlash, setScanFlash] = React.useState(false);
  const fileRef = React.useRef(null);

  // Simula escaneo OCR — rellena campos progresivamente
  const runScan = () => {
    setScan('aiming');
    setTimeout(() => {
      setScanFlash(true);
      setScan('capturing');
      setTimeout(() => setScanFlash(false), 220);
      setTimeout(() => setScan('reading'), 500);
      // OCR progresivo
      const fakeNum = '4242 4242 4242 4242';
      const fakeName = 'LAURA GÓMEZ';
      const fakeExp = '12/28';
      setTimeout(() => setNum(fakeNum.slice(0, 4)),  900);
      setTimeout(() => setNum(fakeNum.slice(0, 9)),  1100);
      setTimeout(() => setNum(fakeNum.slice(0, 14)), 1300);
      setTimeout(() => setNum(fakeNum), 1500);
      setTimeout(() => setName(fakeName), 1750);
      setTimeout(() => setExp(fakeExp), 1950);
      setTimeout(() => { setScan('done'); setTimeout(() => setScan(null), 600); }, 2200);
    }, 900);
  };
  const cancelScan = () => { setScan(null); setScanFlash(false); };

  // ─── Detección de marca ─────────────────────────────────
  const brand = (() => {
    const n = num.replace(/\s/g, '');
    if (/^4/.test(n)) return 'visa';
    if (/^(5[1-5]|2[2-7])/.test(n)) return 'mastercard';
    if (/^3[47]/.test(n)) return 'amex';
    return null;
  })();

  // ─── Formateo input ─────────────────────────────────────
  const formatNum = (v) => {
    const isAmex = /^3[47]/.test(v.replace(/\D/g, ''));
    const digits = v.replace(/\D/g, '').slice(0, isAmex ? 15 : 16);
    const groups = isAmex ? [4, 6, 5] : [4, 4, 4, 4];
    const out = [];
    let i = 0;
    for (const g of groups) {
      if (i >= digits.length) break;
      out.push(digits.slice(i, i + g));
      i += g;
    }
    return out.join(' ');
  };
  const formatExp = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    if (d.length < 3) return d;
    return d.slice(0, 2) + '/' + d.slice(2);
  };

  // ─── Validación ─────────────────────────────────────────
  const numClean = num.replace(/\s/g, '');
  const numOk = brand && (brand === 'amex' ? numClean.length === 15 : numClean.length === 16);
  const nameOk = name.trim().length >= 3;
  const expOk = /^\d{2}\/\d{2}$/.test(exp) && (() => {
    const [m, y] = exp.split('/').map(Number);
    if (m < 1 || m > 12) return false;
    const now = new Date(); const yy = now.getFullYear() % 100; const mm = now.getMonth() + 1;
    return y > yy || (y === yy && m >= mm);
  })();
  const cvcOk = cvc.length === (brand === 'amex' ? 4 : 3);
  const formOk = numOk && nameOk && expOk && cvcOk;

  // ─── Submit ─────────────────────────────────────────────
  const submit = () => {
    if (!formOk || saving) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false); setSaved(true);
      setTimeout(() => onSaved && onSaved({ brand, last4: numClean.slice(-4), exp, makeDefault }), 900);
    }, 1400);
  };

  // ─── Brand mark ─────────────────────────────────────────
  const BrandMark = ({ b, size = 'md' }) => {
    const big = size === 'lg';
    if (b === 'mastercard') return (
      <div style={{ display: 'flex' }}>
        <div style={{ width: big ? 26 : 18, height: big ? 26 : 18, borderRadius: 999, background: '#EB001B' }}/>
        <div style={{ width: big ? 26 : 18, height: big ? 26 : 18, borderRadius: 999, background: '#F79E1B', marginLeft: big ? -10 : -8, mixBlendMode: 'multiply' }}/>
      </div>
    );
    if (b === 'visa') return <div style={{ fontFamily: 'system-ui', fontWeight: 900, fontSize: big ? 22 : 14, color: '#fff', letterSpacing: '.04em', fontStyle: 'italic' }}>VISA</div>;
    if (b === 'amex') return <div style={{ fontFamily: 'system-ui', fontWeight: 800, fontSize: big ? 11 : 9, color: '#fff', letterSpacing: '.05em', padding: '4px 6px', border: '1.5px solid #fff', borderRadius: 4 }}>AMEX</div>;
    return <div style={{ display: 'flex', gap: 3 }}><div style={{ width: big ? 22 : 14, height: big ? 22 : 14, borderRadius: 999, background: 'rgba(255,255,255,.15)' }}/><div style={{ width: big ? 22 : 14, height: big ? 22 : 14, borderRadius: 999, background: 'rgba(255,255,255,.1)' }}/></div>;
  };

  // ─── Input atom ─────────────────────────────────────────
  const Field = ({ label, value, onChange, placeholder, type = 'text', mode, maxLength, valid, onFocus, onBlur, mono = false, autoComplete }) => {
    const showState = value.length > 0;
    return (
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: PB.ink3 }}>{label}</span>
        <div style={{ position: 'relative' }}>
          <input
            type={type} inputMode={mode} value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus} onBlur={onBlur}
            placeholder={placeholder} maxLength={maxLength}
            autoComplete={autoComplete}
            style={{
              width: '100%', boxSizing: 'border-box', padding: '14px 38px 14px 14px',
              borderRadius: 12, border: `1px solid ${showState ? (valid ? PB.success : PB.lineStrong) : PB.line}`,
              background: PB.surface, fontFamily: mono ? PB.mono : PB.font, fontWeight: mono ? 600 : 500,
              fontSize: 15, color: PB.ink, outline: 'none',
              transition: 'border-color 220ms',
            }}
            onFocusCapture={(e) => e.currentTarget.style.borderColor = PB.morado}
            onBlurCapture={(e) => e.currentTarget.style.borderColor = showState ? (valid ? PB.success : PB.lineStrong) : PB.line}
          />
          {showState && valid && (
            <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: PB.success }}>
              <Icon name="check" size={18} color={PB.success}/>
            </div>
          )}
        </div>
      </label>
    );
  };

  // ─── Card preview ───────────────────────────────────────
  const cardBg = brand === 'visa' ? 'linear-gradient(135deg, #1A1F71, #2c2d8e)'
              : brand === 'amex' ? 'linear-gradient(135deg, #006FCF, #00457C)'
              : `linear-gradient(135deg, ${PB.moradoInk}, ${PB.morado})`;

  return (
    <>
      <StatusBar/>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 140 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 16px 8px', position: 'relative' }}>
          <button onClick={onBack} style={{ position: 'absolute', left: 16, width: 40, height: 40, borderRadius: 12, border: `1px solid ${PB.line}`, background: PB.surface, display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
            <Icon name="back" size={18}/>
          </button>
          <h3 style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 17, letterSpacing: '-0.01em', margin: 0 }}>Añadir tarjeta</h3>
        </div>

        {/* Card preview con flip */}
        <div style={{ padding: '8px 16px 18px', perspective: 1200 }}>
          <div style={{
            position: 'relative', width: '100%', aspectRatio: '1.586',
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: 'transform 600ms cubic-bezier(.2,.7,.2,1)',
          }}>
            {/* FRONT */}
            <div style={{
              position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
              borderRadius: 18, padding: 20, color: '#fff',
              background: cardBg,
              boxShadow: '0 14px 30px rgba(20,19,24,.22), 0 2px 6px rgba(20,19,24,.08)',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              overflow: 'hidden',
            }}>
              {/* shine */}
              <div style={{ position: 'absolute', top: -40, right: -60, width: 180, height: 180, borderRadius: 999, background: 'rgba(255,255,255,.08)', filter: 'blur(20px)' }}/>
              <div style={{ position: 'absolute', bottom: -50, left: -50, width: 160, height: 160, borderRadius: 999, background: 'rgba(255,255,255,.05)', filter: 'blur(24px)' }}/>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
                <div style={{ width: 38, height: 28, borderRadius: 5, background: 'linear-gradient(135deg, #E5C870, #B89348)', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.15)' }}/>
                <BrandMark b={brand} size="lg"/>
              </div>
              <div style={{ position: 'relative', fontFamily: PB.mono, fontWeight: 600, fontSize: 18, letterSpacing: '.14em' }}>
                {(num || '•••• •••• •••• ••••').padEnd(19, '•').slice(0, 19)}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative' }}>
                <div>
                  <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '.14em', opacity: .6 }}>TITULAR</div>
                  <div style={{ fontFamily: PB.font, fontWeight: 600, fontSize: 13, marginTop: 2, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                    {name.trim() || 'NOMBRE Y APELLIDOS'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '.14em', opacity: .6 }}>CADUCA</div>
                  <div style={{ fontFamily: PB.mono, fontWeight: 600, fontSize: 13, marginTop: 2 }}>{exp || 'MM/AA'}</div>
                </div>
              </div>
            </div>
            {/* BACK */}
            <div style={{
              position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              borderRadius: 18, color: '#fff', background: cardBg,
              boxShadow: '0 14px 30px rgba(20,19,24,.22), 0 2px 6px rgba(20,19,24,.08)',
              overflow: 'hidden', display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ height: 44, background: '#0a0a18', marginTop: 22 }}/>
              <div style={{ padding: '18px 20px 0' }}>
                <div style={{ background: '#fff', height: 36, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 12px' }}>
                  <span style={{ fontFamily: PB.mono, color: '#1a1a2e', fontWeight: 700, fontSize: 14, letterSpacing: '.12em' }}>
                    {cvc || '•••'}
                  </span>
                </div>
                <div style={{ marginTop: 10, fontSize: 9, opacity: .7, letterSpacing: '.06em' }}>
                  Los 3 dígitos del reverso (4 si es Amex).
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Escáner CTA + opción manual */}
        <div style={{ padding: '0 16px 14px' }}>
          <button onClick={runScan} style={{
            width: '100%', padding: '14px 16px', borderRadius: 14,
            background: PB.morado, color: '#fff', border: 0, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontFamily: PB.font, fontWeight: 700, fontSize: 14,
            boxShadow: '0 6px 16px rgba(72,35,128,.22)',
          }}>
            <Icon name="camera" size={18} color="#fff"/>
            Escanear tarjeta con la cámara
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0 0' }}>
            <div style={{ flex: 1, height: 1, background: PB.line }}/>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: PB.ink3 }}>o introduce los datos</span>
            <div style={{ flex: 1, height: 1, background: PB.line }}/>
          </div>
        </div>

        {/* Form */}
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field
            label="Número de tarjeta"
            value={num}
            onChange={(v) => setNum(formatNum(v))}
            placeholder="1234 5678 9012 3456"
            mode="numeric" mono
            valid={numOk}
            autoComplete="cc-number"
          />
          <Field
            label="Titular de la tarjeta"
            value={name}
            onChange={setName}
            placeholder="Como aparece en la tarjeta"
            valid={nameOk}
            autoComplete="cc-name"
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field
              label="Caducidad"
              value={exp}
              onChange={(v) => setExp(formatExp(v))}
              placeholder="MM/AA"
              mode="numeric" mono maxLength={5}
              valid={expOk}
              autoComplete="cc-exp"
            />
            <Field
              label="CVC"
              value={cvc}
              onChange={(v) => setCvc(v.replace(/\D/g, '').slice(0, 4))}
              placeholder={brand === 'amex' ? '••••' : '•••'}
              mode="numeric" mono maxLength={4}
              valid={cvcOk}
              onFocus={() => setFlipped(true)}
              onBlur={() => setFlipped(false)}
              autoComplete="cc-csc"
            />
          </div>

          {/* Predeterminada toggle */}
          <button
            onClick={() => setMakeDefault(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: 14,
              borderRadius: 14, background: PB.surface, border: `1px solid ${PB.line}`,
              cursor: 'pointer', textAlign: 'left',
            }}>
            <div style={{
              width: 22, height: 22, borderRadius: 7,
              border: `1.5px solid ${makeDefault ? PB.morado : PB.lineStrong}`,
              background: makeDefault ? PB.morado : 'transparent',
              display: 'grid', placeItems: 'center', flexShrink: 0,
              transition: 'all 220ms',
            }}>
              {makeDefault && <Icon name="check" size={14} color="#fff"/>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 14, color: PB.ink }}>Establecer como predeterminada</div>
              <div style={{ fontSize: 12, color: PB.ink3, marginTop: 2 }}>Se usará automáticamente en tus próximas reservas.</div>
            </div>
          </button>

          {/* Stripe trust strip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 4px 0', color: PB.ink3, fontSize: 12 }}>
            <Icon name="lock" size={14} color={PB.ink3}/>
            <span>Cifrado de extremo a extremo. Procesado por <strong style={{ color: PB.ink2, fontWeight: 700 }}>Stripe</strong>.</span>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '14px 16px 26px',
        background: 'linear-gradient(180deg, rgba(250,250,247,0) 0%, rgba(250,250,247,1) 30%)',
      }}>
        <button
          onClick={submit}
          disabled={!formOk || saving || saved}
          style={{
            width: '100%', padding: '17px', borderRadius: 14, border: 0,
            background: saved ? PB.success : (formOk ? PB.morado : PB.surface3),
            color: formOk || saved ? '#fff' : PB.ink4,
            fontFamily: PB.font, fontWeight: 700, fontSize: 16, letterSpacing: '-.005em',
            cursor: formOk && !saving ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            transition: 'all 220ms cubic-bezier(.2,.7,.2,1)',
            boxShadow: formOk ? '0 6px 18px rgba(72,35,128,.3)' : 'none',
          }}>
          {saving ? (
            <>
              <span style={{
                width: 18, height: 18, borderRadius: 999,
                border: '2px solid rgba(255,255,255,.4)', borderTopColor: '#fff',
                animation: 'pb-spin 700ms linear infinite',
              }}/>
              Verificando con Stripe…
            </>
          ) : saved ? (
            <>
              <Icon name="check" size={20} color="#fff"/>
              Tarjeta añadida
            </>
          ) : (
            <>
              <Icon name="lock" size={18} color={formOk ? '#fff' : PB.ink4}/>
              Añadir tarjeta
            </>
          )}
        </button>
      </div>

      <style>{`
        @keyframes pb-spin { to { transform: rotate(360deg); } }
        @keyframes pb-scan-line { 0% { top: 8%; } 50% { top: 86%; } 100% { top: 8%; } }
        @keyframes pb-pulse { 0%,100% { opacity: .35; } 50% { opacity: .9; } }
      `}</style>

      {/* ─── Cámara / escáner overlay ─────────────────────── */}
      {scan && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 90,
          background: '#000', overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          color: '#fff',
        }}>
          {/* Fake camera feed: blurred desk gradient */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(120% 80% at 30% 20%, #2a2433 0%, #0e0a18 60%, #000 100%)',
          }}/>
          {/* dust/specks */}
          <div style={{ position: 'absolute', inset: 0, opacity: .25,
            background: 'radial-gradient(2px 2px at 20% 30%, #fff, transparent 60%), radial-gradient(1.5px 1.5px at 70% 60%, #fff, transparent 60%), radial-gradient(2px 2px at 40% 80%, #fff, transparent 60%)',
          }}/>

          {/* Top bar */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '50px 18px 12px' }}>
            <button onClick={cancelScan} style={{
              width: 38, height: 38, borderRadius: 999,
              background: 'rgba(255,255,255,.14)', border: 0, color: '#fff',
              display: 'grid', placeItems: 'center', cursor: 'pointer',
              backdropFilter: 'blur(8px)',
            }}>
              <Icon name="back" size={18} color="#fff"/>
            </button>
            <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 14 }}>Escanear tarjeta</div>
            <button onClick={() => fileRef.current?.click()} style={{
              padding: '8px 12px', borderRadius: 999, background: 'rgba(255,255,255,.14)',
              border: 0, color: '#fff', fontFamily: PB.font, fontWeight: 700, fontSize: 12,
              cursor: 'pointer', backdropFilter: 'blur(8px)',
            }}>Galería</button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={() => runScan()}/>
          </div>

          {/* Viewfinder con marco de tarjeta */}
          <div style={{ flex: 1, position: 'relative', display: 'grid', placeItems: 'center', padding: '0 24px' }}>
            <div style={{
              position: 'relative', width: '100%', aspectRatio: '1.586', maxWidth: 320,
              borderRadius: 16,
              boxShadow: '0 0 0 9999px rgba(0,0,0,.55)',
            }}>
              {/* Esquinas */}
              {[
                { top: -2, left: -2, br: '16px 0 0 0', bw: '3px 0 0 3px' },
                { top: -2, right: -2, br: '0 16px 0 0', bw: '3px 3px 0 0' },
                { bottom: -2, left: -2, br: '0 0 0 16px', bw: '0 0 3px 3px' },
                { bottom: -2, right: -2, br: '0 0 16px 0', bw: '0 3px 3px 0' },
              ].map((s, i) => (
                <div key={i} style={{
                  position: 'absolute', width: 28, height: 28,
                  borderColor: PB.menta, borderStyle: 'solid',
                  borderRadius: s.br, borderWidth: s.bw,
                  top: s.top, left: s.left, right: s.right, bottom: s.bottom,
                }}/>
              ))}
              {/* Línea de scan */}
              {scan === 'aiming' || scan === 'reading' ? (
                <div style={{
                  position: 'absolute', left: 8, right: 8, height: 2,
                  background: `linear-gradient(90deg, transparent, ${PB.menta}, transparent)`,
                  boxShadow: `0 0 18px ${PB.menta}`,
                  animation: 'pb-scan-line 1.6s ease-in-out infinite',
                  borderRadius: 999,
                }}/>
              ) : null}
              {/* OCR detection chips when reading */}
              {scan === 'reading' && (
                <>
                  {num && <div style={{ position: 'absolute', left: '8%', top: '52%', padding: '4px 8px', borderRadius: 6, background: 'rgba(128,227,183,.22)', border: `1px solid ${PB.menta}`, fontFamily: PB.mono, fontSize: 10, fontWeight: 700, color: PB.menta, letterSpacing: '.1em' }}>{num}</div>}
                  {name && <div style={{ position: 'absolute', left: '8%', bottom: '18%', padding: '4px 8px', borderRadius: 6, background: 'rgba(128,227,183,.22)', border: `1px solid ${PB.menta}`, fontSize: 10, fontWeight: 700, color: PB.menta, letterSpacing: '.06em' }}>{name}</div>}
                  {exp && <div style={{ position: 'absolute', right: '8%', bottom: '18%', padding: '4px 8px', borderRadius: 6, background: 'rgba(128,227,183,.22)', border: `1px solid ${PB.menta}`, fontFamily: PB.mono, fontSize: 10, fontWeight: 700, color: PB.menta }}>{exp}</div>}
                </>
              )}
              {/* Done check */}
              {scan === 'done' && (
                <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(35,143,91,.25)', borderRadius: 16, border: `2px solid ${PB.success}` }}>
                  <div style={{ width: 56, height: 56, borderRadius: 999, background: PB.success, display: 'grid', placeItems: 'center', boxShadow: `0 0 24px ${PB.success}` }}>
                    <Icon name="check" size={28} color="#fff"/>
                  </div>
                </div>
              )}
            </div>
            <div style={{
              position: 'absolute', bottom: 24, left: 24, right: 24, textAlign: 'center',
              fontFamily: PB.font, fontSize: 13, color: 'rgba(255,255,255,.85)',
            }}>
              {scan === 'aiming' && 'Coloca tu tarjeta dentro del marco…'}
              {scan === 'capturing' && 'Capturando…'}
              {scan === 'reading' && (<span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: PB.menta, animation: 'pb-pulse 1s infinite' }}/>
                Leyendo datos…
              </span>)}
              {scan === 'done' && '¡Listo! Datos detectados.'}
            </div>
          </div>

          {/* Flash */}
          {scanFlash && <div style={{ position: 'absolute', inset: 0, background: '#fff', zIndex: 100 }}/>}
        </div>
      )}
    </>
  );
};

window.ScreenAddPayment = ScreenAddPayment;
