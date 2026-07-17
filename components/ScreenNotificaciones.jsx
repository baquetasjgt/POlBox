// POLEBOX — Centro de notificaciones (demo-only: sin PWA/push no hay canal
// real de entrega; ver README). Combina avisos almacenados (eventos) con
// avisos derivados del estado actual (bono por caducar, racha en peligro…).

const ScreenNotificaciones = ({ notifs, bonos, nextBooking, lastOrder, gameData, onBack, onMarkRead }) => {
  React.useEffect(() => { onMarkRead && onMarkRead(); }, []);

  // Derivadas del estado (siempre al día, no dependen de eventos pasados)
  const derived = [];
  (bonos || []).filter(b => b.state === 'active').forEach(b => {
    const left = b.accesos - b.usados;
    if (b.daysLeft <= 14) derived.push({ icon: 'history', tone: 'warn', title: `Tu ${b.name} caduca en ${b.daysLeft} días`, sub: `Te quedan ${left} accesos — úsalos o renuévalo con descuento` });
    else if (left <= 2) derived.push({ icon: 'sparkle', tone: 'warn', title: `Solo ${left} acceso${left === 1 ? '' : 's'} en tu ${b.name}`, sub: 'Renueva ahora y no pierdas el ritmo' });
  });
  if (nextBooking) derived.push({ icon: 'calendar', tone: 'ok', title: `Próxima sesión: ${nextBooking.dayLabel} ${nextBooking.startStr}h`, sub: `${nextBooking.boxLabel} · ${nextBooking.venueName}` });
  if (lastOrder?.lockerCode) derived.push({ icon: 'key', tone: 'ok', title: `Pedido en locker · código ${lastOrder.lockerCode}`, sub: `Locker ${lastOrder.pickup?.lockerId} · ${lastOrder.pickup?.venueName} · válido 48 h` });
  if (gameData && gameData.streakDays === 0) derived.push({ icon: 'bolt', tone: 'warn', title: 'Tu racha está en peligro', sub: `${gameData.streakWeeks} semanas seguidas — entrena esta semana para mantenerla` });

  const toneBg = (t) => t === 'warn' ? PB.warnBg : PB.mentaSoft;
  const toneFg = (t) => t === 'warn' ? PB.warn : PB.success;

  const fmtWhen = (iso) => {
    const d = new Date(iso);
    const mins = Math.round((new Date() - d) / 60000);
    if (mins < 1) return 'ahora';
    if (mins < 60) return `hace ${mins} min`;
    if (mins < 1440) return `hace ${Math.round(mins / 60)} h`;
    return PBU.fmtFechaCorta(d);
  };

  return (
    <>
      <StatusBar/>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 110 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px 8px' }}>
          <button onClick={onBack} aria-label="Volver" style={{ width: 40, height: 40, borderRadius: 12, border: `1px solid ${PB.line}`, background: PB.surface, display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
            <Icon name="back" size={18}/>
          </button>
          <h3 style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 20, letterSpacing: '-0.01em', margin: 0 }}>Notificaciones</h3>
        </div>

        {/* Para ti (derivadas del estado) */}
        {derived.length > 0 && (
          <div style={{ padding: '8px 16px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: PB.ink3, padding: '0 4px' }}>Para ti</div>
            {derived.map((n, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '13px 14px', borderRadius: 16, background: PB.surface, border: `1px solid ${PB.line}` }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: toneBg(n.tone), display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <Icon name={n.icon} size={17} color={toneFg(n.tone)}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 13, color: PB.ink, lineHeight: 1.35 }}>{n.title}</div>
                  <div style={{ fontSize: 12, color: PB.ink3, marginTop: 2, lineHeight: 1.4 }}>{n.sub}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Historial de eventos */}
        <div style={{ padding: '18px 16px 0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: PB.ink3, padding: '0 4px 8px' }}>Actividad</div>
          {(notifs || []).length === 0 ? (
            <div style={{ padding: '28px 16px', textAlign: 'center', color: PB.ink3, fontSize: 13, background: PB.surface, borderRadius: 16, border: `1px solid ${PB.line}` }}>
              Aún no hay actividad. Tus reservas, pedidos y logros aparecerán aquí.
            </div>
          ) : (
            <div style={{ background: PB.surface, border: `1px solid ${PB.line}`, borderRadius: 16, overflow: 'hidden' }}>
              {(notifs || []).map((n, i) => (
                <div key={n.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 14px', borderTop: i ? `1px solid ${PB.line}` : 0 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: PB.surface2, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    <Icon name={n.icon || 'bell'} size={15} color={PB.morado}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 13, color: PB.ink }}>{n.title}</div>
                    <div style={{ fontSize: 12, color: PB.ink3, marginTop: 1, lineHeight: 1.4 }}>{n.sub}</div>
                  </div>
                  <span style={{ fontSize: 10, color: PB.ink4, flexShrink: 0, marginTop: 2 }}>{fmtWhen(n.t)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ margin: '14px 20px 0', fontSize: 11, color: PB.ink4, lineHeight: 1.5 }}>
          En la app real estas alertas llegarían como notificaciones push (recordatorio 1 h antes,
          código de locker, bono por caducar, racha en peligro).
        </div>
      </div>
      <TabBar active="home"/>
    </>
  );
};

window.ScreenNotificaciones = ScreenNotificaciones;
