// POLEBOX — main prototype router with guest flow + auth wall

function useScreen(key, init) {
  const [v, _set] = React.useState(() => {
    try { return localStorage.getItem(key) || init; } catch { return init; }
  });
  const set = (x) => { _set(x); try { localStorage.setItem(key, x); } catch {} };
  return [v, set];
}

function App() {
  const [screen, setScreen] = useScreen('pb_screen', 'home-public');
  const [authed, setAuthed] = useScreen('pb_authed', 'no'); // 'yes' | 'no'
  const [venueId, setVenueId] = useScreen('pb_venue', 'mad-salamanca');
  const [authWall, setAuthWall] = React.useState(null); // null | 'login' | 'register'
  const [booking, setBooking] = React.useState(null);

  const isAuthed = authed === 'yes';

  const onTab = (id) => {
    if (!isAuthed) { setAuthWall('login'); return; }
    if (id === 'home') setScreen('dashboard');
    else if (id === 'reservas') setScreen('book');
    else if (id === 'llave') setScreen('key');
    else if (id === 'perfil') setScreen('profile');
  };

  // Intercept TabBar clicks from legacy screens via global onTab override: we pass through per-screen.
  const renderScreen = () => {
    switch (screen) {
      case 'home-public':
        return <Screen1Home
          onLogin={() => setAuthWall('login')}
          onRegister={() => setAuthWall('register')}
          onPickVenue={(id) => { setVenueId(id); setScreen('venue'); }}
        />;
      case 'venue':
        return <ScreenVenue
          venueId={venueId}
          onBack={() => setScreen(isAuthed ? 'dashboard' : 'home-public')}
          onBook={() => setScreen('book')}
        />;
      case 'dashboard':
        return <Screen2Dashboard
          onNewReservation={() => setScreen('book')}
          onOpenKey={() => setScreen('key')}
          onStore={() => setScreen('store')}
        />;
      case 'store':
        return <ScreenStore onBack={() => setScreen('dashboard')}/>;
      case 'book':
        return <Screen3Book
          onBack={() => setScreen(isAuthed ? 'dashboard' : 'venue')}
          onPay={(b) => {
            setBooking(b);
            if (!isAuthed) setAuthWall('register');
            else setScreen('checkout');
          }}
        />;
      case 'checkout':
        return <ScreenCheckout
          booking={booking}
          onBack={() => setScreen('book')}
          onPay={(b) => { setBooking(b); setScreen('stripe'); }}
        />;
      case 'stripe':
        return <ScreenStripe
          booking={booking}
          onBack={() => setScreen('checkout')}
          onSuccess={() => setScreen('key')}
        />;
      case 'key':
        return <Screen4Key onBack={() => setScreen('dashboard')}/>;
      case 'profile':
        return <Screen5Profile
          onBack={() => setScreen('dashboard')}
          onLogout={() => { setAuthed('no'); setScreen('home-public'); }}
          onNav={(s) => setScreen(s)}
        />;
      case 'payment-methods':
        return <ScreenPaymentMethods onBack={() => setScreen('profile')} onAdd={() => setScreen('payment-add')}/>;
      case 'payment-add':
        return <ScreenAddPayment onBack={() => setScreen('payment-methods')} onSaved={() => setScreen('payment-methods')}/>;
      case 'history':
        return <ScreenHistory onBack={() => setScreen('profile')}/>;
      case 'contract':
        return <ScreenContract onBack={() => setScreen('profile')}/>;
      case 'kyc':
        return <ScreenKYC onBack={() => setScreen('profile')}/>;
      case 'support':
        return <ScreenSupport onBack={() => setScreen('profile')}/>;
      case 'faq':
        return <ScreenFAQ onBack={() => setScreen('profile')}/>;
      default:
        return null;
    }
  };

  const labels = {
    'home-public': '01 Home público',
    'venue':       '02 Sede',
    'dashboard':   '03 Dashboard',
    'book':        '04 Reserva',
    'checkout':    '05 Resumen',
    'stripe':      '06 Stripe',
    'key':         '07 Llave',
    'profile':     '08 Perfil',
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#EDEBE3',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '24px 16px 40px', gap: 16,
      fontFamily: 'Archivo, system-ui, sans-serif',
    }}>
      <Toolbar screen={screen} setScreen={setScreen} authed={isAuthed} setAuthed={setAuthed}/>
      <div data-screen-label={labels[screen]}>
        <Phone>
          {renderScreen()}
          {authWall && (
            <AuthWall
              mode={authWall}
              onClose={() => setAuthWall(null)}
              onSwitchMode={() => setAuthWall(authWall === 'login' ? 'register' : 'login')}
              onAuthed={() => {
                setAuthed('yes');
                setAuthWall(null);
                if (screen === 'book') setScreen('checkout');
                else if (screen === 'home-public') setScreen('dashboard');
              }}
            />
          )}
        </Phone>
      </div>
      <Footer/>
    </div>
  );
}

function Toolbar({ screen, setScreen, authed, setAuthed }) {
  const items = [
    { id: 'home-public', label: '01 · Home' },
    { id: 'venue',       label: '02 · Sede' },
    { id: 'dashboard',   label: '03 · Dashboard' },
    { id: 'book',        label: '04 · Reserva' },
    { id: 'checkout',    label: '05 · Resumen' },
    { id: 'stripe',      label: '06 · Stripe' },
    { id: 'key',         label: '07 · Llave' },
    { id: 'profile',     label: '08 · Perfil' },
    { id: 'store',       label: '09 · Tienda' },
    { id: 'payment-add', label: '+ Añadir tarjeta' },
  ];
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
      <div style={{
        display: 'flex', gap: 6, padding: 6, borderRadius: 999,
        background: '#fff', border: '1px solid #E2E0D8',
        boxShadow: '0 4px 14px rgba(20,19,24,.06)',
        flexWrap: 'wrap', justifyContent: 'center', maxWidth: 760,
      }}>
        {items.map(it => {
          const on = screen === it.id;
          return (
            <button key={it.id} onClick={() => setScreen(it.id)} style={{
              border: 0, padding: '10px 14px', borderRadius: 999, cursor: 'pointer',
              background: on ? '#482380' : 'transparent',
              color: on ? '#fff' : '#3A3742',
              fontFamily: 'Archivo, system-ui, sans-serif',
              fontWeight: 700, fontSize: 12, letterSpacing: '-.005em', lineHeight: 1.2,
              transition: 'all 220ms cubic-bezier(.2,.7,.2,1)', whiteSpace: 'nowrap',
            }}>
              {it.label}
            </button>
          );
        })}
      </div>
      <button onClick={() => setAuthed(authed ? 'no' : 'yes')} style={{
        border: `1px solid ${authed ? '#238F5B' : '#C9C6BC'}`,
        background: authed ? '#E4F6EC' : '#fff',
        color: authed ? '#238F5B' : '#3A3742',
        padding: '8px 14px', borderRadius: 999,
        fontFamily: 'Archivo, system-ui, sans-serif', fontWeight: 700, fontSize: 11,
        letterSpacing: '.08em', textTransform: 'uppercase', cursor: 'pointer',
      }}>
        {authed ? '● Logueada' : 'Invitada'}
      </button>
    </div>
  );
}

function Footer() {
  return (
    <div style={{
      fontFamily: 'Archivo, system-ui, sans-serif', fontSize: 11,
      color: '#6B6776', letterSpacing: '.14em', textTransform: 'uppercase',
      fontWeight: 700, marginTop: 4, textAlign: 'center', maxWidth: 380,
    }}>
      POLEBOX · prototipo interactivo
      <div style={{ marginTop: 6, letterSpacing: 0, textTransform: 'none', fontWeight: 500, color: '#A19DAB' }}>
        Explora como invitada → pulsa "Pagar" y aparece el muro de registro. Toggle arriba para simular sesión.
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
