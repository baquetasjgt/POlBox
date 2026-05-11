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
  const [authed, setAuthed] = useScreen('pb_authed', 'no');
  const [venueId, setVenueId] = useScreen('pb_venue', 'mad-salamanca');
  const [authWall, setAuthWall] = React.useState(null);
  const [booking, setBooking] = React.useState(null);

  // Bonos state
  const [userBonos, setUserBonos] = React.useState([{
    id: 'PB-BON-00012', catalogId: 'b10-60', name: 'Bono Mensual',
    accesos: 10, min: 60, usados: 3,
    purchaseDate: '1 nov 2025', expiryDate: '30 ene 2026', daysLeft: 91, state: 'active',
  }]);
  const [selectedBono, setSelectedBono] = React.useState(null);
  const [pendingBono, setPendingBono] = React.useState(null);

  // Gamificación state
  const [gameData] = React.useState({
    xp: 1250, totalSessions: 17, streakWeeks: 4, streakDays: 3,
    unlockedBadges: ['primera-sesion','semana-1','semana-3','10-sesiones','madrugadora','primer-bono','referida-1'],
    referrals: 2, rank: 7,
  });

  // Cursos state
  const [userCurso, setUserCurso] = React.useState({ courseId: 'curso-basico', completedLessons: [1, 2, 3, 4] });
  const [pendingCurso, setPendingCurso] = React.useState(null);

  // Sede state
  const [selectedVenue, setSelectedVenue] = React.useState(null);
  const [favVenues, setFavVenues] = React.useState(['mad-salamanca']);
  const toggleFav = (id) => setFavVenues(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);

  // Store state
  const [storeCart, setStoreCart] = React.useState({});
  const [storeDelivery, setStoreDelivery] = React.useState(null);
  const [storeAddress, setStoreAddress] = React.useState({});
  const [storePickup, setStorePickup] = React.useState(null);
  const [storeTotal, setStoreTotal] = React.useState(0);

  const isAuthed = authed === 'yes';

  // Tab bar global nav — todas las pantallas lo usan via window.__pbTabNav
  window.__pbTabNav = (id) => {
    if      (id === 'tienda')   setScreen('store');
    else if (id === 'home')     setScreen(isAuthed ? 'dashboard' : 'home-public');
    else if (id === 'reservas') setScreen(isAuthed ? 'select-sede' : 'home-public');
    else if (id === 'perfil')   setScreen(isAuthed ? 'profile' : 'home-public');
  };

  const renderScreen = () => {
    switch (screen) {
      case 'home-public':
        return <Screen1Home
          onLogin={() => setAuthWall('login')}
          onRegister={() => setAuthWall('register')}
          onPickVenue={() => setScreen('select-sede')}
          onCursos={() => setScreen('cursos')}
        />;
      case 'dashboard':
        return <Screen2Dashboard
          onNewReservation={() => setScreen('select-sede')}
          onOpenKey={() => setScreen('key')}
          onStore={() => setScreen('store')}
          userBonos={userBonos}
          onReservarConBono={(bono) => { setSelectedBono(bono); setScreen('select-sede'); }}
          onMisBonos={() => setScreen('mis-bonos')}
          gameData={gameData}
          onGamificacion={() => setScreen('gamificacion')}
          userCurso={userCurso}
          onCursos={() => setScreen('cursos')}
        />;
      case 'select-sede':
        return <ScreenSelectSede
          favs={favVenues}
          onToggleFav={toggleFav}
          onBack={() => { setSelectedBono(null); setScreen(isAuthed ? 'dashboard' : 'home-public'); }}
          onSelect={(venue) => { setSelectedVenue(venue); setScreen('book'); }}
        />;
      case 'book':
        return <Screen3Book
          selectedBono={selectedBono}
          userCurso={userCurso}
          onBack={() => { setSelectedBono(null); setScreen(isAuthed ? 'dashboard' : 'select-sede'); }}
          onPay={(b) => { setBooking(b); setScreen('checkout'); }}
        />;
      case 'checkout':
        return <ScreenCheckout
          booking={booking}
          userBonos={userBonos}
          onBack={() => setScreen('book')}
          onPay={(b) => {
            setBooking(b);
            if (!isAuthed) setAuthWall('checkout-register');
            else setScreen('stripe');
          }}
        />;
      case 'stripe':
        return <ScreenStripe
          booking={booking}
          onBack={() => setScreen('checkout')}
          onSuccess={() => setScreen('key')}
        />;
      case 'key':
        return <Screen4Key onBack={() => setScreen('dashboard')} userCurso={userCurso} onCursos={() => setScreen('cursos')}/>;
      case 'gamificacion':
        return <ScreenGamificacion
          gameData={gameData}
          onBack={() => setScreen('profile')}
        />;
      case 'cursos':
        return <ScreenCursos
          userCurso={userCurso}
          onBuy={(c) => {
            setPendingCurso(c);
            if (!isAuthed) setAuthWall('register');
            else setScreen('curso-payment');
          }}
          onBack={() => setScreen(isAuthed ? 'profile' : 'home-public')}
        />;
      case 'curso-payment':
        return <ScreenStorePayment
          total={pendingCurso?.price ?? 0}
          onBack={() => setScreen('cursos')}
          onSuccess={() => setScreen('curso-stripe')}
        />;
      case 'curso-stripe':
        return <ScreenStripe
          booking={{ price: pendingCurso?.price ?? 0, label: `${pendingCurso?.name} · 10 clases online` }}
          onBack={() => setScreen('curso-payment')}
          onSuccess={() => {
            setUserCurso({ courseId: pendingCurso?.id, completedLessons: [] });
            setPendingCurso(null);
            setScreen('cursos');
          }}
        />;
      case 'profile':
        return <Screen5Profile
          onBack={() => setScreen('dashboard')}
          onLogout={() => { setAuthed('no'); setScreen('home-public'); }}
          onNav={(s) => setScreen(s)}
          onGamificacion={() => setScreen('gamificacion')}
          userCurso={userCurso}
          onCursos={() => setScreen('cursos')}
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
      case 'order-history':
        return <ScreenOrderHistory onBack={() => setScreen('profile')}/>;
      case 'edit-profile':
        return <ScreenEditProfile onBack={() => setScreen('profile')}/>;
      case 'addresses':
        return <ScreenAddresses onBack={() => setScreen('profile')}/>;
      case 'mis-bonos':
        return <ScreenMisBonos
          userBonos={userBonos}
          onBack={() => setScreen('profile')}
          onComprar={() => setScreen('bonos')}
          onReservar={(bono) => { setSelectedBono(bono); setScreen('book'); }}
        />;
      case 'bonos':
        return <ScreenBonos
          onBack={() => setScreen('mis-bonos')}
          onSelect={(catalog) => { setPendingBono(catalog); setScreen('bono-resumen'); }}
        />;
      case 'bono-resumen':
        return <ScreenBonoResumen
          bono={pendingBono}
          onBack={() => setScreen('bonos')}
          onPay={() => setScreen('bono-payment')}
        />;
      case 'bono-payment':
        return <ScreenStorePayment
          total={pendingBono?.price ?? 0}
          onBack={() => setScreen('bonos')}
          onSuccess={() => setScreen('bono-stripe')}
        />;
      case 'bono-stripe':
        return <ScreenStripe
          booking={{ price: pendingBono?.price ?? 0, label: `${pendingBono?.name} · ${pendingBono?.accesos} accesos · ${pendingBono?.min} min` }}
          onBack={() => setScreen('bono-payment')}
          onSuccess={() => {
            const now = new Date();
            const expiry = new Date(now);
            expiry.setDate(expiry.getDate() + (pendingBono?.caducidadDias ?? 60));
            const fd = d => `${d.getDate()} ${['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'][d.getMonth()]} ${d.getFullYear()}`;
            setUserBonos(prev => [...prev, {
              id: `PB-BON-${String(Math.floor(Math.random()*90000+10000))}`,
              catalogId: pendingBono?.id,
              name: pendingBono?.name,
              accesos: pendingBono?.accesos,
              min: pendingBono?.min,
              usados: 0,
              purchaseDate: fd(now),
              expiryDate: fd(expiry),
              daysLeft: pendingBono?.caducidadDias,
              state: 'active',
            }]);
            setPendingBono(null);
            setScreen('mis-bonos');
          }}
        />;

      // ── Tienda ────────────────────────────────────────────
      case 'store':
        return <ScreenStore
          cart={storeCart} setCart={setStoreCart}
          onBack={() => setScreen('dashboard')}
          onCart={() => setScreen('store-cart')}
        />;
      case 'store-cart':
        return <ScreenStoreCart
          cart={storeCart} setCart={setStoreCart}
          onBack={() => setScreen('store')}
          onDelivery={(method) => {
            setStoreDelivery(method);
            setScreen(method === 'locker' ? 'store-pickup' : 'store-address');
          }}
        />;
      case 'store-address':
        return <ScreenStoreAddress
          onBack={() => setScreen('store-cart')}
          onConfirm={(addr) => { setStoreAddress(addr); setScreen('store-order'); }}
        />;
      case 'store-pickup':
        return <ScreenStorePickup
          onBack={() => setScreen('store-cart')}
          onConfirm={(p) => { setStorePickup(p); setScreen('store-order'); }}
        />;
      case 'store-order':
        return <ScreenStoreOrder
          cart={storeCart}
          delivery={storeDelivery}
          address={storeAddress}
          pickup={storePickup}
          onBack={() => setScreen(storeDelivery === 'locker' ? 'store-pickup' : 'store-address')}
          onPay={(t) => { setStoreTotal(t); setScreen('store-payment'); }}
        />;
      case 'store-payment':
        return <ScreenStorePayment
          total={storeTotal}
          onBack={() => setScreen('store-order')}
          onSuccess={() => setScreen('store-confirm')}
        />;
      case 'store-confirm':
        return <ScreenStoreConfirm
          cart={storeCart}
          delivery={storeDelivery}
          address={storeAddress}
          pickup={storePickup}
          onDone={() => { setStoreCart({}); setScreen('dashboard'); }}
        />;

      default:
        return null;
    }
  };

  const toolbarItems = [
    { id: 'home-public',    label: '01 · Home' },
    { id: 'select-sede',    label: '02 · Sede' },
    { id: 'dashboard',      label: '03 · Dashboard' },
    { id: 'book',           label: '04 · Reserva' },
    { id: 'checkout',       label: '05 · Resumen' },
    { id: 'stripe',         label: '06 · Stripe' },
    { id: 'key',            label: '07 · Llave' },
    { id: 'profile',        label: '08 · Perfil' },
    { id: 'store',          label: '09 · Tienda' },
    { id: 'store-cart',     label: '10 · Carrito' },
    { id: 'store-address',  label: '11 · Dirección' },
    { id: 'store-pickup',   label: '11 · Locker' },
    { id: 'store-order',    label: '12 · Pedido' },
    { id: 'store-payment',  label: '13 · Pago' },
    { id: 'store-confirm',  label: '14 · Confirmado' },
    { id: 'payment-add',    label: '+ Añadir tarjeta' },
    { id: 'order-history',  label: '+ Pedidos' },
    { id: 'edit-profile',   label: '+ Mi cuenta' },
    { id: 'addresses',      label: '+ Direcciones' },
    { id: 'mis-bonos',      label: '+ Mis bonos' },
    { id: 'bonos',          label: '+ Catálogo bonos' },
    { id: 'bono-resumen',   label: '+ Resumen bono' },
    { id: 'bono-payment',   label: '+ Pago bono' },
    { id: 'bono-stripe',    label: '+ Stripe bono' },
    { id: 'gamificacion',   label: '+ Progresión' },
    { id: 'cursos',         label: '+ Cursos' },
    { id: 'curso-payment',  label: '+ Pago curso' },
    { id: 'curso-stripe',   label: '+ Stripe curso' },
  ];

  return (
    <div style={{
      minHeight: '100vh', background: '#EDEBE3',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '24px 16px 40px', gap: 16,
      fontFamily: 'Archivo, system-ui, sans-serif',
    }}>
      <Toolbar screen={screen} setScreen={setScreen} authed={isAuthed} setAuthed={setAuthed} items={toolbarItems}/>
      <div data-screen-label={screen}>
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
                if (screen === 'checkout') setScreen('stripe');
                else if (screen === 'cursos' && pendingCurso) setScreen('curso-payment');
                else setScreen('dashboard');
              }}
            />
          )}
        </Phone>
      </div>
      <Footer/>
    </div>
  );
}

function Toolbar({ screen, setScreen, authed, setAuthed, items }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
      <div style={{
        display: 'flex', gap: 6, padding: 6, borderRadius: 999,
        background: '#fff', border: '1px solid #E2E0D8',
        boxShadow: '0 4px 14px rgba(20,19,24,.06)',
        flexWrap: 'wrap', justifyContent: 'center', maxWidth: 860,
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
      fontWeight: 700, marginTop: 4, textAlign: 'center', maxWidth: 480,
    }}>
      POLEBOX · prototipo interactivo
      <div style={{ marginTop: 6, letterSpacing: 0, textTransform: 'none', fontWeight: 500, color: '#A19DAB' }}>
        Flujo tienda: 09 Tienda → añade productos → Ver carrito → elige Locker o Domicilio → completa el pedido.
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
