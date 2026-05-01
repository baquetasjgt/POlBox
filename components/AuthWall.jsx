// POLEBOX — AuthWall (muro de login/registro antes de pagar)
// Aparece como bottom-sheet modal cuando el usuario intenta pagar sin estar logueado.

const AuthWall = ({ mode = 'register', onClose, onAuthed, onSwitchMode }) => {
  const [step, setStep] = React.useState('choose'); // 'choose' | 'email'
  const isCheckout = mode === 'checkout-register';
  const isRegister = mode === 'register' || isCheckout;

  const social = (label, bg, color, glyph) => (
    <button onClick={onAuthed} style={{
      width: '100%', padding: '14px', borderRadius: 14, border: `1px solid ${PB.line}`,
      background: bg, color, fontFamily: PB.font, fontWeight: 700, fontSize: 15,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      cursor: 'pointer',
    }}>
      {glyph}
      {label}
    </button>
  );

  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(20,13,62,.5)', zIndex: 100,
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      backdropFilter: 'blur(4px)',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: PB.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28,
        padding: '12px 20px 28px', boxShadow: '0 -20px 60px rgba(20,13,62,.2)',
      }}>
        {/* Drag handle */}
        <div style={{ width: 44, height: 4, borderRadius: 999, background: PB.line, margin: '4px auto 16px' }}/>

        {step === 'choose' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 18 }}>
              <Eyebrow>{isCheckout ? '¡Casi lista!' : 'Un paso más'}</Eyebrow>
              <h3 style={{ fontFamily: PB.font, fontWeight: 900, fontSize: 26, letterSpacing: '-.02em', margin: '8px 0 6px' }}>
                {isCheckout ? 'Confirma y entrena' : isRegister ? 'Crea tu cuenta' : 'Bienvenida de nuevo'}
              </h3>
              <p style={{ fontSize: 13, color: PB.ink3, margin: 0, lineHeight: 1.45 }}>
                {isCheckout
                  ? 'Tu reserva está guardada. Crea una cuenta gratis en 30 segundos para confirmarla y pagar.'
                  : isRegister
                    ? 'Para confirmar tu reserva necesitamos verificar tu identidad. Tarda 30 s.'
                    : 'Inicia sesión para confirmar tu reserva.'}
              </p>
            </div>

            {isCheckout && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 14, background: PB.mentaSoft, border: `1px solid ${PB.mentaDeep}`, marginBottom: 14 }}>
                <Icon name="check" size={16} color={PB.success}/>
                <div>
                  <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 13, color: PB.moradoInk }}>Reserva guardada</div>
                  <div style={{ fontSize: 11, color: PB.moradoInk, opacity: .7, marginTop: 1 }}>Al iniciar sesión continuarás al pago</div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {social('Continuar con Apple', '#000', '#fff',
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.2 13.4c0-1.8 1.5-2.7 1.6-2.7-.9-1.3-2.2-1.5-2.7-1.5-1.1-.1-2.2.7-2.8.7s-1.5-.7-2.4-.7c-1.3 0-2.4.7-3 1.9-1.3 2.3-.3 5.6.9 7.5.6.9 1.3 1.9 2.3 1.9s1.3-.6 2.4-.6 1.4.6 2.4.6 1.7-.9 2.3-1.8c.7-1 1-2.1 1-2.1s-2-.7-2-3.2zm-2-5.7c.5-.6.8-1.4.7-2.3-.7 0-1.5.4-2 1-.4.5-.8 1.3-.7 2.1.8 0 1.5-.4 2-.8z"/></svg>
              )}
              {social('Continuar con Google', '#fff', PB.ink,
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.5 12.25c0-.78-.07-1.54-.2-2.25H12v4.26h5.9c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.24-4.74 3.24-8.07z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.15-4.53H2.17v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC04" d="M5.85 14.12c-.22-.66-.35-1.36-.35-2.12s.13-1.46.35-2.12V7.04H2.17C1.4 8.55 1 10.22 1 12s.4 3.45 1.17 4.96l3.68-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.17 7.04l3.68 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
              )}
              <button onClick={() => setStep('email')} style={{
                width: '100%', padding: '14px', borderRadius: 14, border: `1px solid ${PB.line}`,
                background: PB.surface, color: PB.ink, fontFamily: PB.font, fontWeight: 700, fontSize: 15,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer',
              }}>
                <Icon name="chat" size={18}/>
                Continuar con email
              </button>
            </div>

            <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: PB.ink3 }}>
              {isRegister ? '¿Ya tienes cuenta?' : '¿Nueva aquí?'}{' '}
              <button onClick={onSwitchMode} style={{ background: 'transparent', border: 0, color: PB.morado, fontFamily: PB.font, fontWeight: 700, cursor: 'pointer', fontSize: 13, padding: 0 }}>
                {isRegister ? 'Inicia sesión' : 'Crea una cuenta'}
              </button>
            </div>

            {!isCheckout && (
              <div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: PB.mentaSoft, color: PB.moradoInk, fontSize: 11.5, lineHeight: 1.45 }}>
                <strong style={{ fontWeight: 800 }}>Siguiente paso tras crear cuenta:</strong> verificación rápida con DNI + selfie + firma del descargo. Una sola vez, para toda tu vida en POLEBOX.
              </div>
            )}
          </>
        )}

        {step === 'email' && (
          <>
            <button onClick={() => setStep('choose')} style={{ background: 'transparent', border: 0, display: 'inline-flex', alignItems: 'center', gap: 6, color: PB.ink3, fontFamily: PB.font, fontWeight: 600, fontSize: 13, cursor: 'pointer', padding: 0, marginBottom: 14 }}>
              <Icon name="back" size={14}/> Atrás
            </button>
            <h3 style={{ fontFamily: PB.font, fontWeight: 900, fontSize: 24, letterSpacing: '-.02em', margin: '0 0 14px' }}>
              {isRegister ? 'Tu email' : 'Inicia sesión'}
            </h3>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: PB.ink3, marginBottom: 6 }}>Email</label>
            <input type="email" placeholder="tu@correo.com" style={{
              width: '100%', padding: '14px 16px', borderRadius: 14, border: `1px solid ${PB.line}`,
              background: PB.surface2, fontFamily: PB.font, fontSize: 15, color: PB.ink, boxSizing: 'border-box',
              marginBottom: 10, outline: 'none',
            }}/>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: PB.ink3, marginBottom: 6 }}>Contraseña</label>
            <input type="password" placeholder="••••••••" style={{
              width: '100%', padding: '14px 16px', borderRadius: 14, border: `1px solid ${PB.line}`,
              background: PB.surface2, fontFamily: PB.font, fontSize: 15, color: PB.ink, boxSizing: 'border-box',
              marginBottom: 16, outline: 'none',
            }}/>
            <Button onClick={onAuthed} full style={{ padding: '16px', fontSize: 15 }}>
              {isRegister ? 'Crear cuenta y continuar' : 'Entrar'}
            </Button>
          </>
        )}

        <p style={{ fontSize: 10.5, color: PB.ink4, textAlign: 'center', lineHeight: 1.5, margin: '14px 0 0' }}>
          Al continuar aceptas nuestros <u>Términos</u> y la <u>Política de privacidad</u>.
        </p>
      </div>
    </div>
  );
};

window.AuthWall = AuthWall;
