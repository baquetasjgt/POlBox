// POLEBOX — router principal + estado global persistido + bus de eventos de dominio.
// La lógica de negocio (bonos, reservas, gamificación, pedidos) vive aquí en
// acciones nombradas; las pantallas solo emiten intenciones.

// ── Persistencia ────────────────────────────────────────────
function useScreen(key, init) {
  const [v, _set] = React.useState(() => {
    try { return localStorage.getItem(key) || init; } catch { return init; }
  });
  const set = (x) => { _set(x); try { localStorage.setItem(key, x); } catch {} };
  return [v, set];
}

function usePersisted(key, init) {
  const [v, set] = React.useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw != null) return JSON.parse(raw);
    } catch {}
    return typeof init === 'function' ? init() : init;
  });
  React.useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
  }, [key, v]);
  return [v, set];
}

// ── Analítica de producto (demo): log de eventos en localStorage ──
function track(type, payload = {}) {
  try {
    const log = JSON.parse(localStorage.getItem('pb_analytics') || '[]');
    log.push({ t: new Date().toISOString(), type, ...payload });
    localStorage.setItem('pb_analytics', JSON.stringify(log.slice(-400)));
  } catch {}
}

// ── Toast de recompensa (+XP / badge) ───────────────────────
const PBToast = ({ toast, onDone }) => {
  React.useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [toast]);
  if (!toast) return null;
  return (
    <div style={{
      position: 'absolute', top: 54, left: '50%', transform: 'translateX(-50%)',
      zIndex: 200, display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 18px', borderRadius: 999,
      background: 'rgba(29,13,62,.94)', color: '#fff', backdropFilter: 'blur(8px)',
      boxShadow: '0 12px 30px rgba(29,13,62,.35)',
      fontFamily: PB.font, whiteSpace: 'nowrap',
      animation: 'pb-toast-in 320ms cubic-bezier(.2,.7,.2,1)',
    }}>
      <style>{`@keyframes pb-toast-in{from{opacity:0;transform:translate(-50%,-12px)}to{opacity:1;transform:translate(-50%,0)}}`}</style>
      <span style={{ fontSize: 16 }}>{toast.emoji || '⚡'}</span>
      <div>
        <div style={{ fontWeight: 800, fontSize: 13, color: PB.menta }}>{toast.msg}</div>
        {toast.sub && <div style={{ fontSize: 11, opacity: .8, marginTop: 1 }}>{toast.sub}</div>}
      </div>
    </div>
  );
};

// ── Seeds (fechas relativas a hoy, nunca caducadas de fábrica) ──
const seedBonos = () => {
  const purchase = PBU.addDays(new Date(), -20);
  const expiry = PBU.addDays(purchase, 90);
  return [{
    id: 'PB-BON-00012', catalogId: 'b10-60', name: 'Bono Mensual',
    accesos: 10, min: 60, usados: 3,
    purchaseDate: PBU.fmtFecha(purchase),
    expiryISO: PBU.toISODate(expiry), expiryDate: PBU.fmtFecha(expiry),
    state: 'active',
  }];
};
const seedGame = () => ({
  xp: 1250, totalSessions: 17, streakWeeks: 4, streakDays: 3,
  unlockedBadges: ['primera-sesion', 'semana-1', 'semana-3', '10-sesiones', 'madrugadora', 'primer-bono', 'referida-1'],
  referrals: 2, rank: 7, referralCode: 'PB-LAURA-042', venuesVisited: ['mad-salamanca'],
});
const seedCursos = () => ([{ courseId: 'curso-basico', completedLessons: [1, 2, 3, 4] }]);
const seedCards = () => ([
  { id: 'mc',   brand: 'Mastercard', last: '4242', exp: '12/28', color: '#1A1F36', isDefault: true },
  { id: 'visa', brand: 'Visa',       last: '0119', exp: '08/27', color: '#1A1F71', isDefault: false },
]);

function App() {
  const [screen, setScreen] = useScreen('pb_screen', 'home-public');
  const [authed, setAuthed] = useScreen('pb_authed', 'no');
  const [venueId, setVenueId] = useScreen('pb_venue', 'mad-salamanca');
  const [authWall, setAuthWall] = React.useState(null);
  const [booking, setBooking] = usePersisted('pb_booking', null);
  const [toast, setToast] = React.useState(null);

  // Estado de dominio persistido
  const [userBonos, setUserBonos] = usePersisted('pb_bonos_v2', seedBonos);
  const [selectedBono, setSelectedBono] = React.useState(null);
  const [pendingBono, setPendingBono] = usePersisted('pb_pending_bono', null);
  const [gameData, setGameData] = usePersisted('pb_game_v2', seedGame);
  const [userCursos, setUserCursos] = usePersisted('pb_cursos_v2', seedCursos);
  const [pendingCurso, setPendingCurso] = usePersisted('pb_pending_curso', null);
  const [favVenues, setFavVenues] = usePersisted('pb_favs', ['mad-salamanca']);
  const [userBookings, setUserBookings] = usePersisted('pb_bookings', []);
  const [cards, setCards] = usePersisted('pb_cards', seedCards);
  const [orders, setOrders] = usePersisted('pb_orders', []);
  const [notifs, setNotifs] = usePersisted('pb_notifs', []);
  const [lastOrderId, setLastOrderId] = usePersisted('pb_last_order', null);
  const [activeBookingId, setActiveBookingId] = usePersisted('pb_active_booking', null);

  // Store state (carrito persistido; pasos del wizard son efímeros con guard)
  const [storeCart, setStoreCart] = usePersisted('pb_cart', {});
  const [storeDelivery, setStoreDelivery] = React.useState(null);
  const [storeAddress, setStoreAddress] = React.useState({});
  const [storePickup, setStorePickup] = React.useState(null);
  const [storeTotal, setStoreTotal] = React.useState(0);

  const isAuthed = authed === 'yes';
  const selectedVenue = getVenue(venueId) || ALL_VENUES[0];
  const toggleFav = (id) => setFavVenues(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);

  // ── Vistas derivadas ──────────────────────────────────────
  // daysLeft se calcula contra la fecha real; un bono guardado nunca aparece
  // "activo" ya caducado.
  const bonosView = userBonos.map(b => {
    const daysLeft = b.expiryISO ? Math.max(0, PBU.daysUntil(b.expiryISO)) : (b.daysLeft ?? 0);
    const state = b.state === 'active' && daysLeft <= 0 ? 'expired' : b.state;
    return { ...b, daysLeft, state };
  });
  const userCurso = userCursos.length
    ? (userCursos.find(c => {
        const course = (window.COURSE_CATALOG || []).find(k => k.id === c.courseId);
        return course && (c.completedLessons || []).length < course.lessons.length;
      }) || userCursos[userCursos.length - 1])
    : null;
  const upcomingBookings = userBookings
    .filter(bk => bk.state === 'upcoming')
    .sort((a, b) => (a.dateISO + String(a.startMin).padStart(4, '0')).localeCompare(b.dateISO + String(b.startMin).padStart(4, '0')));
  const activeBooking = userBookings.find(bk => bk.id === activeBookingId && bk.state === 'upcoming') || upcomingBookings[0] || null;
  const lastOrder = orders.find(o => o.id === lastOrderId) || null;
  const isFirstBooking = userBookings.filter(bk => bk.state !== 'cancelled').length === 0;

  // ── Bus de eventos de dominio ─────────────────────────────
  const showToast = (msg, sub, emoji) => setToast({ msg, sub, emoji });

  const awardXp = (amount, reason) => {
    setGameData(g => ({ ...g, xp: g.xp + amount }));
    showToast(`+${amount} XP`, reason);
    track('xp_awarded', { amount, reason });
  };

  const unlockBadge = (id) => {
    const badge = (window.BADGES || []).find(b => b.id === id);
    setGameData(g => {
      if (g.unlockedBadges.includes(id)) return g;
      track('badge_unlocked', { id });
      if (badge) setTimeout(() => setToast({ msg: `Logro: ${badge.name}`, sub: `+${badge.xp} XP`, emoji: badge.emoji }), 0);
      return { ...g, xp: g.xp + (badge?.xp || 0), unlockedBadges: [...g.unlockedBadges, id] };
    });
  };

  const notify = (icon, title, sub) => {
    setNotifs(n => [{ id: PBU.uid('NT'), icon, title, sub, t: new Date().toISOString(), read: false }, ...n].slice(0, 30));
  };

  const registerSession = (bk) => {
    setGameData(g => {
      const total = g.totalSessions + 1;
      const visited = g.venuesVisited?.includes(bk.venueId) ? g.venuesVisited : [...(g.venuesVisited || []), bk.venueId];
      return { ...g, totalSessions: total, streakDays: Math.min(7, g.streakDays + 1), venuesVisited: visited };
    });
    const total = gameData.totalSessions + 1;
    if (total >= 25) unlockBadge('25-sesiones');
    if (total >= 50) unlockBadge('50-sesiones');
    if (bk.startMin < 720) unlockBadge('madrugadora');
    const visitedNow = new Set([...(gameData.venuesVisited || []), bk.venueId]);
    if (visitedNow.size >= 3) unlockBadge('3-sedes');
    if (total % 20 === 0) unlockBadge('sesion-libre');
  };

  const consumeBono = (bonoId) => {
    setUserBonos(prev => prev.map(b => {
      if (b.id !== bonoId && b.catalogId !== bonoId) return b;
      const usados = b.usados + 1;
      return { ...b, usados, state: usados >= b.accesos ? 'exhausted' : b.state };
    }));
  };

  const restoreBonoAccess = (bonoId) => {
    setUserBonos(prev => prev.map(b => {
      if (b.id !== bonoId && b.catalogId !== bonoId) return b;
      const usados = Math.max(0, b.usados - 1);
      return { ...b, usados, state: b.state === 'exhausted' ? 'active' : b.state };
    }));
  };

  // Reserva pagada (con tarjeta/wallet o con bono): registro + gamificación + llave
  const finalizeBooking = (b) => {
    const record = {
      id: PBU.uid('PB-RES'),
      venueId: b.venueId || selectedVenue.id,
      venueName: b.venueName || selectedVenue.fullName,
      boxIdx: b.boxIdx, boxLabel: b.boxLabel || `BOX ${(b.boxIdx ?? 0) + 1}`,
      dayLabel: b.dayLabel, dateISO: b.dateISO || PBU.toISODate(PBU.addDays(new Date(), b.dayIdx ?? 0)),
      startMin: b.startMin, startStr: b.startStr, endStr: b.endStr, duration: b.duration,
      price: b.method === 'bono' ? 0 : b.price,
      method: b.method, methodLabel: b.methodLabel, bonoId: b.bonoId || null,
      promo: b.promo || null, weekly: b.weekly || false,
      state: 'upcoming', createdAt: new Date().toISOString(),
    };
    setUserBookings(prev => [record, ...prev]);
    setActiveBookingId(record.id);
    if (b.method === 'bono' && b.bonoId) consumeBono(b.bonoId);
    registerSession(record);
    awardXp(50, 'Reserva confirmada');
    notify('calendar', 'Reserva confirmada', `${record.boxLabel} · ${record.dayLabel} ${record.startStr}h · ${record.venueName}`);
    track('booking_paid', { method: b.method, price: record.price, venueId: record.venueId });
    setBooking(null);
    setSelectedBono(null);
    setScreen('key');
  };

  // Cancelación con la política de la FAQ: gratis >4h antes; después, 50%.
  const cancelBooking = (id) => {
    const bk = userBookings.find(x => x.id === id);
    if (!bk) return;
    const start = new Date(`${bk.dateISO}T00:00:00`);
    start.setMinutes(bk.startMin);
    const hoursTo = (start - new Date()) / 3600000;
    const free = hoursTo >= 4;
    setUserBookings(prev => prev.map(x => x.id === id ? { ...x, state: 'cancelled', refund: free ? 'total' : 'parcial' } : x));
    if (bk.method === 'bono' && bk.bonoId && free) restoreBonoAccess(bk.bonoId);
    showToast(free ? 'Reserva cancelada' : 'Cancelada con cargo del 50%',
      bk.method === 'bono'
        ? (free ? 'El acceso vuelve a tu bono' : 'El acceso se consume (menos de 4 h)')
        : (free ? 'Reembolso completo' : 'Menos de 4 h de antelación'), '🗓️');
    track('booking_cancelled', { free });
  };

  const completeLesson = (courseId, n) => {
    let finished = false;
    setUserCursos(prev => prev.map(c => {
      if (c.courseId !== courseId || (c.completedLessons || []).includes(n)) return c;
      const done = [...(c.completedLessons || []), n];
      const course = (window.COURSE_CATALOG || []).find(k => k.id === courseId);
      finished = course && done.length === course.lessons.length;
      return { ...c, completedLessons: done };
    }));
    awardXp(30, 'Clase completada');
    if (finished) setTimeout(() => showToast('¡Curso completado!', 'Practica lo aprendido en un box', '🎓'), 2700);
    track('lesson_completed', { courseId, n });
  };

  const redeemReferral = (code) => {
    if (!code) return;
    awardXp(100, `Código ${code.toUpperCase()} aplicado`);
    notify('sparkle', 'Código de invitación aplicado', 'Tu primera sesión tiene un 50% de descuento');
    track('referral_redeemed', { code });
  };

  // ── Guards de precondición: nunca una pantalla con estado vacío ──
  const resolveScreen = (s) => {
    const guards = {
      'dashboard':     () => isAuthed ? null : 'home-public',
      'profile':       () => isAuthed ? null : 'home-public',
      'checkout':      () => booking ? null : 'book',
      'stripe':        () => booking ? null : 'book',
      'bono-resumen':  () => pendingBono ? null : 'bonos',
      'bono-stripe':   () => pendingBono ? null : 'bonos',
      'bono-payment':  () => 'bono-resumen',   // pasarela única: pantalla retirada
      'curso-stripe':  () => pendingCurso ? null : 'cursos',
      'curso-payment': () => 'cursos',          // pasarela única: pantalla retirada
      'store-cart':    () => PBU.cartCount(storeCart) > 0 ? null : 'store',
      'store-address': () => PBU.cartCount(storeCart) > 0 ? null : 'store',
      'store-pickup':  () => PBU.cartCount(storeCart) > 0 ? null : 'store',
      'store-order':   () => (PBU.cartCount(storeCart) > 0 && storeDelivery) ? null : 'store',
      'store-payment': () => (PBU.cartCount(storeCart) > 0 && storeDelivery) ? null : 'store',
      'store-confirm': () => lastOrder ? null : 'store',
    };
    let cur = s, hops = 0;
    while (hops < 4) {
      const redirect = guards[cur] ? guards[cur]() : null;
      if (!redirect) break;
      cur = redirect; hops++;
    }
    return cur;
  };
  const effScreen = resolveScreen(screen);
  React.useEffect(() => {
    if (effScreen !== screen) setScreen(effScreen);
  }, [effScreen, screen]);
  React.useEffect(() => { track('screen_view', { screen: effScreen }); }, [effScreen]);

  // Tab bar global nav — todas las pantallas lo usan via window.__pbTabNav
  window.__pbTabNav = (id) => {
    if      (id === 'tienda')   setScreen('store');
    else if (id === 'home')     setScreen(isAuthed ? 'dashboard' : 'home-public');
    else if (id === 'reservas') setScreen(isAuthed ? 'select-sede' : 'home-public');
    else if (id === 'perfil')   setScreen(isAuthed ? 'profile' : 'home-public');
  };
  // Tab bloqueada (invitada): en vez de ignorar el tap, abre el registro y
  // continúa hacia el destino tras autenticarse.
  window.__pbLockedTab = (id) => {
    setAuthWall({ mode: 'register', next: id });
  };

  const renderScreen = () => {
    switch (effScreen) {
      case 'home-public':
        return <Screen1Home
          onLogin={() => setAuthWall({ mode: 'login' })}
          onRegister={() => setAuthWall({ mode: 'register' })}
          onPickVenue={(id) => { if (id) setVenueId(id); setScreen('select-sede'); }}
          onCursos={() => setScreen('cursos')}
        />;
      case 'dashboard':
        return <Screen2Dashboard
          onNewReservation={() => setScreen('select-sede')}
          onOpenKey={() => setScreen('key')}
          onStore={() => setScreen('store')}
          userBonos={bonosView}
          onReservarConBono={(bono) => { setSelectedBono(bono); setScreen('select-sede'); }}
          onMisBonos={() => setScreen('mis-bonos')}
          onComprarBono={() => setScreen('bonos')}
          gameData={gameData}
          onGamificacion={() => setScreen('gamificacion')}
          userCurso={userCurso}
          onCursos={() => setScreen('cursos')}
          nextBooking={upcomingBookings[0] || null}
          onMisReservas={() => setScreen('mis-reservas')}
          notifs={notifs}
          onNotifs={() => setScreen('notificaciones')}
        />;
      case 'select-sede':
        return <ScreenSelectSede
          favs={favVenues}
          onToggleFav={toggleFav}
          onBack={() => { setSelectedBono(null); setScreen(isAuthed ? 'dashboard' : 'home-public'); }}
          onSelect={(venue) => { setVenueId(venue.id); setScreen('book'); }}
        />;
      case 'book':
        return <Screen3Book
          venue={selectedVenue}
          selectedBono={selectedBono}
          userCurso={userCurso}
          onBack={() => { setSelectedBono(null); setScreen('select-sede'); }}
          onPay={(b) => { setBooking(b); setScreen('checkout'); }}
        />;
      case 'checkout':
        return <ScreenCheckout
          booking={booking}
          userBonos={bonosView}
          isFirstBooking={isFirstBooking}
          onBack={() => setScreen('book')}
          onPay={(b) => {
            setBooking(b);
            if (!isAuthed) setAuthWall({ mode: 'checkout-register' });
            else if (b.method === 'bono') finalizeBooking(b);
            else setScreen('stripe');
          }}
        />;
      case 'stripe':
        return <ScreenStripe
          booking={booking}
          onBack={() => setScreen('checkout')}
          onSuccess={(b) => finalizeBooking(b || booking)}
        />;
      case 'key':
        return <Screen4Key
          onBack={() => setScreen(isAuthed ? 'dashboard' : 'home-public')}
          booking={activeBooking}
          userCurso={userCurso}
          onCursos={() => setScreen('cursos')}
          onSessionEnd={() => setScreen('valoracion')}
        />;
      case 'valoracion':
        return <ScreenValoracion
          booking={activeBooking}
          onClose={() => setScreen('dashboard')}
          onSubmit={(review) => {
            awardXp(20, 'Gracias por tu valoración');
            track('review_submitted', review);
            if (review.issue) notify('shield', 'Incidencia reportada', `${review.issue} · ${activeBooking?.venueName || ''} — mantenimiento avisado`);
            setScreen('dashboard');
          }}
        />;
      case 'mis-reservas':
        return <ScreenMisReservas
          bookings={userBookings}
          onBack={() => setScreen(isAuthed ? 'profile' : 'home-public')}
          onOpenKey={(bk) => { setActiveBookingId(bk.id); setScreen('key'); }}
          onCancel={cancelBooking}
          onNueva={() => setScreen('select-sede')}
        />;
      case 'notificaciones':
        return <ScreenNotificaciones
          notifs={notifs}
          bonos={bonosView}
          nextBooking={upcomingBookings[0] || null}
          lastOrder={lastOrder}
          gameData={gameData}
          onBack={() => setScreen('dashboard')}
          onMarkRead={() => setNotifs(n => n.map(x => ({ ...x, read: true })))}
        />;
      case 'gamificacion':
        return <ScreenGamificacion
          gameData={gameData}
          onBack={() => setScreen(isAuthed ? 'profile' : 'home-public')}
          onShare={() => {
            const text = `Te regalo tu primera sesión en POLEBOX 💜 Usa mi código ${gameData.referralCode} al registrarte`;
            if (navigator.share) navigator.share({ text }).catch(() => {});
            else navigator.clipboard?.writeText(text);
            showToast('Código copiado', 'Compártelo: ambas ganáis +1 acceso y 100 XP', '👥');
            track('referral_shared', {});
          }}
        />;
      case 'cursos':
        return <ScreenCursos
          userCurso={userCurso}
          userCursos={userCursos}
          onCompleteLesson={completeLesson}
          onPracticar={() => setScreen('select-sede')}
          onBuy={(c) => {
            setPendingCurso(c);
            if (!isAuthed) setAuthWall({ mode: 'register' });
            else setScreen('curso-stripe');
          }}
          onBack={() => setScreen(isAuthed ? 'profile' : 'home-public')}
        />;
      case 'curso-stripe':
        return <ScreenStripe
          booking={{ price: pendingCurso?.price ?? 0, label: `${pendingCurso?.name} · 10 clases online` }}
          onBack={() => setScreen('cursos')}
          onSuccess={() => {
            setUserCursos(prev => prev.some(c => c.courseId === pendingCurso?.id)
              ? prev
              : [...prev, { courseId: pendingCurso?.id, completedLessons: [], purchaseDate: PBU.fmtFecha(new Date()) }]);
            awardXp(75, 'Curso desbloqueado');
            track('course_purchased', { id: pendingCurso?.id });
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
          bonos={bonosView}
          bookings={userBookings}
          cards={cards}
          orders={orders}
        />;
      case 'payment-methods':
        return <ScreenPaymentMethods cards={cards} setCards={setCards} onBack={() => setScreen('profile')} onAdd={() => setScreen('payment-add')}/>;
      case 'payment-add':
        return <ScreenAddPayment
          onBack={() => setScreen('payment-methods')}
          onSaved={(card) => {
            setCards(prev => {
              const brandName = { visa: 'Visa', mastercard: 'Mastercard', amex: 'Amex' }[card.brand] || 'Tarjeta';
              const color = { visa: '#1A1F71', mastercard: '#1A1F36', amex: '#006FCF' }[card.brand] || '#1A1F36';
              const next = prev.map(c => card.makeDefault ? { ...c, isDefault: false } : c);
              return [...next, { id: PBU.uid('CARD'), brand: brandName, last: card.last4, exp: card.exp, color, isDefault: !!card.makeDefault }];
            });
            showToast('Tarjeta añadida', `···· ${card.last4}`, '💳');
            setScreen('payment-methods');
          }}
        />;
      case 'history':
        return <ScreenHistory bookings={userBookings} onBack={() => setScreen('profile')}/>;
      case 'contract':
        return <ScreenContract onBack={() => setScreen('profile')}/>;
      case 'kyc':
        return <ScreenKYC onBack={() => setScreen('profile')}/>;
      case 'support':
        return <ScreenSupport onBack={() => setScreen('profile')}/>;
      case 'faq':
        return <ScreenFAQ onBack={() => setScreen('profile')}/>;
      case 'order-history':
        return <ScreenOrderHistory orders={orders} onBack={() => setScreen('profile')}/>;
      case 'edit-profile':
        return <ScreenEditProfile onBack={() => setScreen('profile')}/>;
      case 'addresses':
        return <ScreenAddresses onBack={() => setScreen('profile')}/>;
      case 'mis-bonos':
        return <ScreenMisBonos
          userBonos={bonosView}
          onBack={() => setScreen('profile')}
          onComprar={() => setScreen('bonos')}
          onReservar={(bono) => { setSelectedBono(bono); setScreen('select-sede'); }}
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
          onPay={() => setScreen('bono-stripe')}
        />;
      case 'bono-stripe':
        return <ScreenStripe
          booking={{ price: pendingBono?.price ?? 0, label: `${pendingBono?.name} · ${pendingBono?.accesos} accesos · ${pendingBono?.min} min` }}
          onBack={() => setScreen('bono-resumen')}
          onSuccess={() => {
            const now = new Date();
            const expiry = PBU.addDays(now, pendingBono?.caducidadDias ?? 60);
            setUserBonos(prev => [...prev, {
              id: `PB-BON-${String(Math.floor(Math.random() * 90000 + 10000))}`,
              catalogId: pendingBono?.id,
              name: pendingBono?.name,
              accesos: pendingBono?.accesos,
              min: pendingBono?.min,
              usados: 0,
              type: pendingBono?.type || 'prepago',
              purchaseDate: PBU.fmtFecha(now),
              expiryISO: PBU.toISODate(expiry), expiryDate: PBU.fmtFecha(expiry),
              state: 'active',
            }]);
            unlockBadge('primer-bono');
            awardXp(100, `${pendingBono?.name} activado`);
            notify('sparkle', 'Bono activado', `${pendingBono?.name} · ${pendingBono?.accesos} accesos disponibles`);
            track('bono_purchased', { id: pendingBono?.id, price: pendingBono?.price });
            setPendingBono(null);
            setScreen('mis-bonos');
          }}
        />;

      // ── Tienda ────────────────────────────────────────────
      case 'store':
        return <ScreenStore
          cart={storeCart} setCart={setStoreCart}
          onBack={() => setScreen(isAuthed ? 'dashboard' : 'home-public')}
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
          onSuccess={() => {
            const order = {
              id: PBU.uid('PB'),
              lockerCode: storeDelivery === 'locker' ? PBU.pin4() : null,
              items: PBU.cartItems(storeCart).map(({ product, qty }) => ({ id: product.id, name: product.name, qty, price: product.price })),
              delivery: storeDelivery, address: storeAddress, pickup: storePickup,
              total: storeTotal,
              dateISO: PBU.toISODate(new Date()), dateLabel: PBU.fmtFecha(new Date()),
              state: storeDelivery === 'locker' ? 'En locker' : 'En preparación',
            };
            setOrders(prev => [order, ...prev]);
            setLastOrderId(order.id);
            if (order.lockerCode) notify('key', 'Pedido en locker', `Código ${order.lockerCode} · Locker ${storePickup?.lockerId} · ${storePickup?.venueName} (consultable en Pedidos)`);
            else notify('refresh', 'Pedido en camino', `${order.id} · 3–5 días hábiles`);
            track('order_paid', { total: order.total, delivery: order.delivery });
            setScreen('store-confirm');
          }}
        />;
      case 'store-confirm':
        return <ScreenStoreConfirm
          order={lastOrder}
          cart={storeCart}
          delivery={storeDelivery}
          address={storeAddress}
          pickup={storePickup}
          onDone={() => {
            setStoreCart({}); setStoreDelivery(null); setStoreAddress({}); setStorePickup(null); setStoreTotal(0);
            setScreen(isAuthed ? 'dashboard' : 'home-public');
          }}
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
    { id: 'mis-reservas',   label: '+ Mis reservas' },
    { id: 'mis-bonos',      label: '+ Mis bonos' },
    { id: 'bonos',          label: '+ Catálogo bonos' },
    { id: 'bono-resumen',   label: '+ Resumen bono' },
    { id: 'bono-stripe',    label: '+ Stripe bono' },
    { id: 'gamificacion',   label: '+ Progresión' },
    { id: 'cursos',         label: '+ Cursos' },
    { id: 'curso-stripe',   label: '+ Stripe curso' },
    { id: 'notificaciones', label: '+ Notificaciones' },
    { id: 'operadora',      label: '⚙ Panel operadora' },
  ];

  const resetDemo = () => {
    try {
      Object.keys(localStorage).filter(k => k.startsWith('pb_')).forEach(k => localStorage.removeItem(k));
    } catch {}
    window.location.reload();
  };

  if (effScreen === 'operadora') {
    return (
      <div style={{
        minHeight: '100vh', background: '#EDEBE3',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '24px 16px 40px', gap: 16,
        fontFamily: 'Archivo, system-ui, sans-serif',
      }}>
        <Toolbar screen={effScreen} setScreen={setScreen} authed={isAuthed} setAuthed={setAuthed} items={toolbarItems} onReset={resetDemo}/>
        <ScreenOperadora bookings={userBookings} orders={orders} onExit={() => setScreen('dashboard')}/>
        <Footer/>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#EDEBE3',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '24px 16px 40px', gap: 16,
      fontFamily: 'Archivo, system-ui, sans-serif',
    }}>
      <Toolbar screen={effScreen} setScreen={setScreen} authed={isAuthed} setAuthed={setAuthed} items={toolbarItems} onReset={resetDemo}/>
      <div data-screen-label={effScreen}>
        <Phone>
          {renderScreen()}
          <PBToast toast={toast} onDone={() => setToast(null)}/>
          {authWall && (
            <AuthWall
              mode={authWall.mode || authWall}
              onClose={() => setAuthWall(null)}
              onSwitchMode={() => setAuthWall(w => ({ ...w, mode: (w.mode || w) === 'login' ? 'register' : 'login' }))}
              onAuthed={(payload) => {
                setAuthed('yes');
                const next = authWall.next;
                setAuthWall(null);
                if (payload?.refCode) redeemReferral(payload.refCode);
                track('auth_completed', { mode: authWall.mode });
                if (effScreen === 'checkout' && booking) {
                  if (booking.method === 'bono') finalizeBooking(booking);
                  else setScreen('stripe');
                } else if (effScreen === 'cursos' && pendingCurso) setScreen('curso-stripe');
                else if (next) window.__pbTabNav(next);
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

function Toolbar({ screen, setScreen, authed, setAuthed, items, onReset }) {
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
      <button onClick={onReset} title="Borra el estado de la demo y recarga" style={{
        border: '1px solid #C9C6BC', background: '#fff', color: '#B23040',
        padding: '8px 14px', borderRadius: 999,
        fontFamily: 'Archivo, system-ui, sans-serif', fontWeight: 700, fontSize: 11,
        letterSpacing: '.08em', textTransform: 'uppercase', cursor: 'pointer',
      }}>
        ⟲ Reset demo
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
