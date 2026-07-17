// POLEBOX — Mis bonos activos

const ScreenMisBonos = ({ onBack, onComprar, onReservar, onRenovar, userBonos }) => {
  const bonos = userBonos || [];
  const activos  = bonos.filter(b => b.state === 'active');
  const inactivos = bonos.filter(b => b.state !== 'active');
  const totalAccesos = activos.reduce((s, b) => s + (b.accesos - b.usados), 0);

  const urgencyColor = d => d <= 7 ? PB.danger : d <= 14 ? PB.warn : PB.success;
  const urgencyBg    = d => d <= 7 ? PB.dangerBg : d <= 14 ? PB.warnBg : PB.successBg;

  const ProgressBar = ({ used, total }) => {
    const pct = (used / total) * 100;
    return (
      <div style={{ height: 6, background: PB.surface2, borderRadius: 999, overflow: 'hidden', margin: '8px 0 4px' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: pct >= 80 ? PB.warn : PB.morado, borderRadius: 999, transition: 'width 500ms cubic-bezier(.2,.7,.2,1)' }}/>
      </div>
    );
  };

  return (
    <>
      <StatusBar/>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 110 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px 8px' }}>
          <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: 12, border: `1px solid ${PB.line}`, background: PB.surface, display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
            <Icon name="back" size={18}/>
          </button>
          <h3 style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 20, letterSpacing: '-0.01em', margin: 0, flex: 1 }}>Mis bonos</h3>
          <button onClick={onComprar} style={{ padding: '8px 14px', borderRadius: 999, border: 0, background: PB.morado, color: '#fff', fontFamily: PB.font, fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="plus" size={14} color="#fff"/> Comprar
          </button>
        </div>

        {/* Stats */}
        {activos.length > 0 && (
          <div style={{ margin: '4px 16px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { k: 'Bonos activos',       v: activos.length.toString() },
              { k: 'Accesos disponibles', v: totalAccesos.toString() },
            ].map(s => (
              <div key={s.k} style={{ padding: '12px 14px', borderRadius: 14, background: PB.surface, border: `1px solid ${PB.line}` }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: PB.ink3 }}>{s.k}</div>
                <div style={{ fontFamily: PB.mono, fontWeight: 800, fontSize: 24, color: PB.morado, marginTop: 4 }}>{s.v}</div>
              </div>
            ))}
          </div>
        )}

        {/* Sin bonos */}
        {activos.length === 0 && (
          <div style={{ padding: '40px 24px', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 999, background: PB.surface2, display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
              <Icon name="key" size={28} color={PB.ink4}/>
            </div>
            <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 16, color: PB.ink, marginBottom: 8 }}>Sin bonos activos</div>
            <div style={{ fontSize: 13, color: PB.ink3, marginBottom: 20 }}>Compra un bono y ahorra hasta un 33% en tus sesiones.</div>
            <button onClick={onComprar} style={{ padding: '14px 28px', borderRadius: 14, border: 0, background: PB.morado, color: '#fff', fontFamily: PB.font, fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 6px 18px rgba(72,35,128,.3)' }}>
              Ver bonos disponibles
            </button>
          </div>
        )}

        {/* Bonos activos */}
        {activos.length > 0 && (
          <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {activos.map(b => {
              const restantes = b.accesos - b.usados;
              return (
                <div key={b.id} style={{ borderRadius: 20, overflow: 'hidden', border: `1.5px solid ${PB.morado}`, boxShadow: '0 6px 20px rgba(72,35,128,.14)' }}>
                  {/* Header morado */}
                  <div style={{ background: PB.morado, padding: '14px 18px 12px', color: '#fff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.14em', opacity: .75 }}>{b.accesos} ACCESOS · {b.min} MIN</div>
                        <div style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 18, marginTop: 3 }}>{b.name}</div>
                      </div>
                      <div style={{ fontFamily: PB.mono, fontWeight: 700, fontSize: 10, background: 'rgba(255,255,255,.15)', padding: '4px 8px', borderRadius: 6 }}>{b.id}</div>
                    </div>
                  </div>
                  {/* Body */}
                  <div style={{ background: PB.surface, padding: '14px 18px 16px' }}>
                    {/* Accesos */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, color: PB.ink2 }}>Accesos usados</span>
                      <span style={{ fontFamily: PB.mono, fontWeight: 700, fontSize: 14, color: PB.ink }}>{b.usados}/{b.accesos}</span>
                    </div>
                    <ProgressBar used={b.usados} total={b.accesos}/>
                    <div style={{ fontSize: 11, color: PB.ink3 }}>{restantes} acceso{restantes !== 1 ? 's' : ''} disponible{restantes !== 1 ? 's' : ''}</div>

                    {/* Caducidad / renovación */}
                    {b.type === 'subscription' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, padding: '8px 12px', borderRadius: 10, background: PB.infoBg }}>
                        <Icon name="refresh" size={14} color={PB.morado}/>
                        <span style={{ fontSize: 12, fontWeight: 700, color: PB.morado }}>Suscripción activa</span>
                        <span style={{ fontSize: 12, color: PB.ink3, marginLeft: 'auto' }}>Se renueva el {b.expiryDate}</span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, padding: '8px 12px', borderRadius: 10, background: urgencyBg(b.daysLeft) }}>
                        <Icon name="history" size={14} color={urgencyColor(b.daysLeft)}/>
                        <span style={{ fontSize: 12, fontWeight: 700, color: urgencyColor(b.daysLeft) }}>
                          {b.daysLeft <= 7 ? `¡Solo ${b.daysLeft} días!` : `${b.daysLeft} días restantes`}
                        </span>
                        <span style={{ fontSize: 12, color: PB.ink3, marginLeft: 'auto' }}>Vence {b.expiryDate}</span>
                      </div>
                    )}

                    {/* Recompra proactiva: bono casi agotado o por caducar (no aplica a suscripción) */}
                    {b.type !== 'subscription' && (restantes <= 2 || b.daysLeft <= 14) && (
                      <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: 12, background: PB.infoBg, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ flex: 1, fontSize: 12, color: PB.moradoInk, lineHeight: 1.4 }}>
                          {restantes <= 2
                            ? <span><strong>Te quedan {restantes} acceso{restantes !== 1 ? 's' : ''}.</strong> Renueva ahora y sigue ahorrando.</span>
                            : <span><strong>Caduca pronto.</strong> Renueva y no pierdas tu ritmo.</span>}
                        </div>
                        <button onClick={() => onRenovar && onRenovar(b)} style={{ flexShrink: 0, padding: '9px 14px', borderRadius: 10, border: 0, background: PB.morado, color: '#fff', fontFamily: PB.font, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                          Renovar
                        </button>
                      </div>
                    )}

                    {/* CTA */}
                    <button onClick={() => onReservar(b)} style={{
                      marginTop: 14, width: '100%', padding: '14px', borderRadius: 14, border: 0,
                      background: PB.morado, color: '#fff',
                      fontFamily: PB.font, fontWeight: 700, fontSize: 15, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      boxShadow: '0 6px 16px rgba(72,35,128,.3)',
                    }}>
                      <Icon name="calendar" size={18} color="#fff"/> Reservar con este bono
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bonos caducados/agotados */}
        {inactivos.length > 0 && (
          <div style={{ padding: '16px 16px 0' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: PB.ink3, padding: '0 4px 8px' }}>Anteriores</div>
            <div style={{ background: PB.surface, border: `1px solid ${PB.line}`, borderRadius: 16, overflow: 'hidden' }}>
              {inactivos.map((b, i) => (
                <div key={b.id} style={{ padding: '12px 16px', borderTop: i ? `1px solid ${PB.line}` : 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: .6 }}>
                  <div>
                    <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 13, color: PB.ink }}>{b.name}</div>
                    <div style={{ fontSize: 11, color: PB.ink3 }}>{b.usados}/{b.accesos} accesos · {b.min} min</div>
                  </div>
                  <span style={{ padding: '3px 8px', borderRadius: 999, background: PB.surface2, color: PB.ink3, fontSize: 10, fontWeight: 700 }}>
                    {b.state === 'exhausted' ? 'Agotado' : 'Caducado'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comprar más */}
        {activos.length > 0 && (
          <div style={{ padding: '16px 16px 0' }}>
            <button onClick={onComprar} style={{ width: '100%', padding: '15px', borderRadius: 14, border: `1.5px dashed ${PB.lineStrong}`, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: PB.font, fontWeight: 700, fontSize: 14, color: PB.morado, cursor: 'pointer' }}>
              <Icon name="plus" size={18} color={PB.morado}/> Comprar otro bono
            </button>
          </div>
        )}
      </div>
      <TabBar active="perfil"/>
    </>
  );
};

window.ScreenMisBonos = ScreenMisBonos;
