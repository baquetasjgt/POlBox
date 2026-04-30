// POLEBOX — Screen 5: Profile & settings

const Screen5Profile = ({ onBack, onLogout, onNav, onGamificacion }) => {
  const Row = ({ icon, title, sub, color = PB.morado, to }) => (
    <div onClick={() => to && onNav && onNav(to)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderTop: `1px solid ${PB.line}`, cursor: 'pointer' }}>
      <div style={{ width: 36, height: 36, borderRadius: 12, background: PB.surface2, display: 'grid', placeItems: 'center', color }}>
        <Icon name={icon} size={18} color={color}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: PB.font, fontWeight: 600, fontSize: 15, color: PB.ink }}>{title}</div>
        {sub && <div style={{ fontSize: 12, color: PB.ink3, marginTop: 2 }}>{sub}</div>}
      </div>
      <Icon name="chevron" size={18} color={PB.ink4}/>
    </div>
  );
  const Section = ({ title, children }) => (
    <div style={{ margin: '16px 16px 0' }}>
      <div style={{ padding: '0 4px 8px', fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: PB.ink3 }}>{title}</div>
      <div style={{ background: PB.surface, border: `1px solid ${PB.line}`, borderRadius: 18, overflow: 'hidden' }}>
        {React.Children.map(children, (c, i) => React.cloneElement(c, { key: i, style: i === 0 ? { ...(c.props.style || {}), borderTop: 0 } : c.props.style }))}
      </div>
    </div>
  );

  return (
    <>
      <StatusBar/>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 120 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 16px', position: 'relative' }}>
          <button onClick={onBack} style={{ position: 'absolute', left: 16, width: 40, height: 40, borderRadius: 12, border: `1px solid ${PB.line}`, background: PB.surface, display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
            <Icon name="back" size={18}/>
          </button>
          <h3 style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 18, letterSpacing: '-0.01em', margin: 0 }}>Mi perfil</h3>
        </div>

        {/* User card */}
        <div style={{ margin: '8px 16px 4px', padding: 16, background: PB.surface, border: `1px solid ${PB.line}`, borderRadius: 20, display: 'flex', gap: 14, alignItems: 'center', boxShadow: '0 4px 14px rgba(20,19,24,.05)' }}>
          <div style={{ width: 64, height: 64, borderRadius: 999, background: `linear-gradient(135deg, ${PB.menta}, ${PB.mentaDeep})`, border: `2px solid ${PB.morado}`, display: 'grid', placeItems: 'center', color: PB.moradoInk, fontFamily: PB.font, fontWeight: 800, fontSize: 22 }}>LG</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 18, letterSpacing: '-0.005em' }}>Laura Gómez</div>
            <div style={{ fontSize: 13, color: PB.ink3, marginTop: 1 }}>laura.gomez@correo.com</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, padding: '4px 10px', borderRadius: 999, background: PB.successBg, color: PB.success, fontSize: 11, fontWeight: 700, letterSpacing: '.04em' }}>
              <Icon name="check" size={12}/> Identidad verificada
            </div>
          </div>
        </div>

        <Section title="Mi cuenta">
          <Row icon="profile" title="Datos y contraseña" sub="Laura Gómez · laura.gomez@correo.com" to="edit-profile"/>
          <Row icon="home" title="Direcciones de entrega" sub="2 direcciones guardadas" to="addresses"/>
        </Section>

        <Section title="Cuenta y pagos">
          <Row icon="card" title="Métodos de pago" sub="Mastercard terminada en 4242" to="payment-methods"/>
          <Row icon="sparkle" title="Mis bonos" sub="1 bono activo · 7 accesos disponibles" to="mis-bonos"/>
          <Row icon="history" title="Historial de reservas" sub="14 sesiones · desde oct 2025" to="history"/>
          <Row icon="sparkle" title="Historial de pedidos" sub="5 pedidos · tienda" to="order-history"/>
        </Section>

        <Section title="Mi progresión">
          <div onClick={onGamificacion} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', cursor: 'pointer' }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: 'linear-gradient(140deg,#6B3A00,#3D2100)', display: 'grid', placeItems: 'center', fontSize: 18 }}>🔥</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: PB.font, fontWeight: 600, fontSize: 15, color: PB.ink }}>Puntos, niveles y logros</div>
              <div style={{ fontSize: 12, color: PB.ink3, marginTop: 2 }}>POLEBOX Pro · 1.250 XP · Racha de 4 semanas</div>
            </div>
            <Icon name="chevron" size={18} color={PB.ink4}/>
          </div>
        </Section>

        <Section title="Legal y seguridad">
          <Row icon="doc" title="Mi contrato y normativa" sub="Descargo de responsabilidad firmado" to="contract"/>
          <Row icon="shield" title="Actualizar DNI / selfie" to="kyc"/>
        </Section>

        <Section title="Soporte">
          <Row icon="chat" title="Ayuda y soporte técnico" to="support"/>
          <Row icon="help" title="Preguntas frecuentes" to="faq"/>
        </Section>

        <div style={{ padding: '22px 16px 0', display: 'flex', justifyContent: 'center' }}>
          <button onClick={onLogout} style={{
            background: 'transparent', border: 0, display: 'inline-flex', alignItems: 'center', gap: 8,
            color: '#E57373', fontFamily: PB.font, fontWeight: 700, fontSize: 14, cursor: 'pointer', padding: 10,
          }}>
            <Icon name="logout" size={16}/>
            Cerrar sesión
          </button>
        </div>
      </div>
      <TabBar active="perfil"/>
    </>
  );
};

window.Screen5Profile = Screen5Profile;
