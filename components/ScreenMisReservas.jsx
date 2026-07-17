// POLEBOX — Mis reservas: agenda de sesiones con acceso a llave y cancelación.
// Política (la misma que documenta la FAQ): gratis con >4 h de antelación;
// con menos, cargo del 50% (o consumo del acceso si se pagó con bono).

const ScreenMisReservas = ({ bookings, onBack, onOpenKey, onCancel, onNueva }) => {
  const [confirmId, setConfirmId] = React.useState(null);

  const upcoming = (bookings || []).filter(b => b.state === 'upcoming')
    .sort((a, b) => (a.dateISO + String(a.startMin).padStart(4, '0')).localeCompare(b.dateISO + String(b.startMin).padStart(4, '0')));
  const past = (bookings || []).filter(b => b.state !== 'upcoming');

  const hoursTo = (bk) => {
    const start = new Date(`${bk.dateISO}T00:00:00`);
    start.setMinutes(bk.startMin);
    return (start - new Date()) / 3600000;
  };

  const confirmBk = (bookings || []).find(b => b.id === confirmId);

  return (
    <>
      <StatusBar/>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 110 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px 8px' }}>
          <button onClick={onBack} aria-label="Volver" style={{ width: 40, height: 40, borderRadius: 12, border: `1px solid ${PB.line}`, background: PB.surface, display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
            <Icon name="back" size={18}/>
          </button>
          <h3 style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 20, letterSpacing: '-0.01em', margin: 0, flex: 1 }}>Mis reservas</h3>
          <button onClick={onNueva} style={{ padding: '8px 14px', borderRadius: 999, border: 0, background: PB.morado, color: '#fff', fontFamily: PB.font, fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="plus" size={14} color="#fff"/> Nueva
          </button>
        </div>

        {/* Estado vacío */}
        {upcoming.length === 0 && (
          <div style={{ padding: '40px 24px', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 999, background: PB.surface2, display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
              <Icon name="calendar" size={28} color={PB.ink4}/>
            </div>
            <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 16, color: PB.ink, marginBottom: 8 }}>No tienes sesiones programadas</div>
            <div style={{ fontSize: 13, color: PB.ink3, marginBottom: 20 }}>Reserva tu box y entrena cuando quieras, 24/7.</div>
            <Button onClick={onNueva} icon="plus" style={{ padding: '14px 28px' }}>Reservar ahora</Button>
          </div>
        )}

        {/* Próximas */}
        {upcoming.length > 0 && (
          <div style={{ padding: '8px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: PB.ink3, padding: '0 4px' }}>Próximas</div>
            {upcoming.map(bk => {
              const h = hoursTo(bk);
              const freeCancel = h >= 4;
              return (
                <div key={bk.id} style={{ borderRadius: 18, overflow: 'hidden', border: `1.5px solid ${PB.morado}`, boxShadow: '0 6px 20px rgba(72,35,128,.12)' }}>
                  <div style={{ background: PB.morado, color: '#fff', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.14em', opacity: .75, textTransform: 'uppercase' }}>{bk.venueName}</div>
                      <div style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 17, marginTop: 2 }}>{bk.boxLabel}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: PB.mono, fontWeight: 800, fontSize: 16 }}>{bk.startStr}–{bk.endStr}h</div>
                      <div style={{ fontSize: 11, opacity: .8, marginTop: 1 }}>{bk.dayLabel} · {bk.duration} min</div>
                    </div>
                  </div>
                  <div style={{ background: PB.surface, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, color: PB.ink3, flex: 1 }}>
                      {bk.method === 'bono' ? '✨ Pagada con bono' : `${PBU.fmtEUR(bk.price)} · ${bk.methodLabel || 'tarjeta'}`}
                      {bk.weekly && ' · 🔁 semanal'}
                    </span>
                    <button onClick={() => setConfirmId(bk.id)} style={{ padding: '9px 12px', borderRadius: 10, border: `1px solid ${PB.line}`, background: PB.surface, color: PB.danger, fontFamily: PB.font, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                      Cancelar
                    </button>
                    <button onClick={() => onOpenKey(bk)} style={{ padding: '9px 14px', borderRadius: 10, border: 0, background: PB.menta, color: PB.moradoInk, fontFamily: PB.font, fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Icon name="key" size={13}/> Llave
                    </button>
                  </div>
                  {!freeCancel && (
                    <div style={{ background: PB.warnBg, color: PB.warn, fontSize: 11, fontWeight: 600, padding: '7px 14px' }}>
                      Quedan menos de 4 h: la cancelación tiene cargo del 50%{bk.method === 'bono' ? ' (el acceso se consume)' : ''}.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Historial breve */}
        {past.length > 0 && (
          <div style={{ padding: '18px 16px 0' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: PB.ink3, padding: '0 4px 8px' }}>Anteriores</div>
            <div style={{ background: PB.surface, border: `1px solid ${PB.line}`, borderRadius: 16, overflow: 'hidden' }}>
              {past.slice(0, 6).map((bk, i) => (
                <div key={bk.id} style={{ padding: '12px 16px', borderTop: i ? `1px solid ${PB.line}` : 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: .65 }}>
                  <div>
                    <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 13, color: PB.ink }}>{bk.boxLabel} · {bk.dayLabel}</div>
                    <div style={{ fontSize: 11, color: PB.ink3 }}>{bk.venueName} · {bk.startStr}h</div>
                  </div>
                  <span style={{ padding: '3px 8px', borderRadius: 999, background: bk.state === 'cancelled' ? PB.dangerBg : PB.surface2, color: bk.state === 'cancelled' ? PB.danger : PB.ink3, fontSize: 10, fontWeight: 700 }}>
                    {bk.state === 'cancelled' ? 'Cancelada' : 'Completada'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Política */}
        <div style={{ margin: '16px 20px 0', fontSize: 11, color: PB.ink4, lineHeight: 1.6 }}>
          Cancelación gratuita hasta 4 h antes de tu sesión. Con menos antelación se aplica un cargo del 50%
          (si pagaste con bono, el acceso se consume). Si pagaste con bono y cancelas a tiempo, el acceso vuelve a tu bono.
        </div>
      </div>
      <TabBar active="reservas"/>

      {/* Sheet de confirmación de cancelación */}
      {confirmBk && (
        <div onClick={() => setConfirmId(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(20,13,62,.5)', zIndex: 100, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', backdropFilter: 'blur(4px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: PB.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: '12px 20px 28px' }}>
            <div style={{ width: 44, height: 4, borderRadius: 999, background: PB.line, margin: '4px auto 16px' }}/>
            <h3 style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 20, margin: '0 0 6px', textAlign: 'center' }}>¿Cancelar esta reserva?</h3>
            <p style={{ fontSize: 13, color: PB.ink3, textAlign: 'center', margin: '0 0 16px', lineHeight: 1.5 }}>
              {confirmBk.boxLabel} · {confirmBk.dayLabel} · {confirmBk.startStr}h<br/>
              {hoursTo(confirmBk) >= 4
                ? (confirmBk.method === 'bono' ? 'El acceso volverá a tu bono.' : 'Reembolso completo, sin cargos.')
                : (confirmBk.method === 'bono' ? 'Menos de 4 h: el acceso se consumirá.' : 'Menos de 4 h: se aplicará un cargo del 50%.')}
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <Button variant="secondary" onClick={() => setConfirmId(null)} style={{ flex: 1 }}>Mantener</Button>
              <Button variant="danger" onClick={() => { onCancel(confirmBk.id); setConfirmId(null); }} style={{ flex: 1 }}>Sí, cancelar</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

window.ScreenMisReservas = ScreenMisReservas;
