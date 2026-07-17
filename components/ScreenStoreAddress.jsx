// POLEBOX — Dirección de envío a domicilio

// Extraído a nivel de módulo: definido dentro del render, React creaba un tipo
// nuevo por pulsación y el input se remontaba perdiendo el foco al teclear.
const AddressField = ({ label, value, onChange, type = 'text', placeholder }) => (
  <div style={{ marginBottom: 12 }}>
    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: PB.ink3, marginBottom: 6 }}>{label}</label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', boxSizing: 'border-box',
        padding: '13px 14px', borderRadius: 12, border: `1px solid ${PB.line}`,
        background: PB.surface2, fontFamily: PB.font, fontSize: 14, color: PB.ink,
        outline: 'none', transition: 'border-color 180ms',
      }}
      onFocus={e => e.target.style.borderColor = PB.morado}
      onBlur={e => e.target.style.borderColor = PB.line}
    />
  </div>
);

const ScreenStoreAddress = ({ onBack, onConfirm }) => {
  const [form, setForm] = React.useState({
    nombre: 'Laura Gómez',
    telefono: '+34 612 345 678',
    calle: 'C/ Velázquez 42, 3ºB',
    ciudad: 'Madrid',
    cp: '28001',
    provincia: 'Madrid',
    guardar: true,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const valid = form.nombre && form.telefono && form.calle && form.ciudad && form.cp;

  return (
    <>
      <StatusBar/>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 140 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px 16px' }}>
          <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: 12, border: `1px solid ${PB.line}`, background: PB.surface, display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
            <Icon name="back" size={18}/>
          </button>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: PB.ink3 }}>Paso 1 de 3</div>
            <h3 style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 18, letterSpacing: '-0.01em', margin: '2px 0 0' }}>Dirección de envío</h3>
          </div>
        </div>

        {/* Progreso */}
        <div style={{ padding: '0 16px 20px', display: 'flex', gap: 6 }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 999, background: i <= 1 ? PB.morado : PB.surface3 }}/>
          ))}
        </div>

        <div style={{ padding: '0 16px' }}>
          <AddressField label="Nombre completo" value={form.nombre} onChange={v => set('nombre', v)} placeholder="Tu nombre"/>
          <AddressField label="Teléfono" value={form.telefono} onChange={v => set('telefono', v)} type="tel" placeholder="+34 600 000 000"/>
          <AddressField label="Calle y número" value={form.calle} onChange={v => set('calle', v)} placeholder="C/ Mayor 1, 2ºA"/>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: PB.ink3, marginBottom: 6 }}>Ciudad</label>
              <input value={form.ciudad} onChange={e => set('ciudad', e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '13px 14px', borderRadius: 12, border: `1px solid ${PB.line}`, background: PB.surface2, fontFamily: PB.font, fontSize: 14, color: PB.ink, outline: 'none' }}/>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: PB.ink3, marginBottom: 6 }}>Código postal</label>
              <input value={form.cp} onChange={e => set('cp', e.target.value)} maxLength={5} style={{ width: '100%', boxSizing: 'border-box', padding: '13px 14px', borderRadius: 12, border: `1px solid ${PB.line}`, background: PB.surface2, fontFamily: PB.font, fontSize: 14, color: PB.ink, outline: 'none' }}/>
            </div>
          </div>
          <AddressField label="Provincia" value={form.provincia} onChange={v => set('provincia', v)} placeholder="Provincia"/>

          {/* Guardar */}
          <button onClick={() => set('guardar', !form.guardar)} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'transparent', border: 0, padding: '12px 0', cursor: 'pointer', width: '100%' }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${form.guardar ? PB.morado : PB.lineStrong}`, background: form.guardar ? PB.morado : 'transparent', display: 'grid', placeItems: 'center', transition: 'all 180ms', flexShrink: 0 }}>
              {form.guardar && <Icon name="check" size={13} color="#fff"/>}
            </div>
            <span style={{ fontFamily: PB.font, fontWeight: 600, fontSize: 13, color: PB.ink2 }}>Guardar como dirección habitual</span>
          </button>

          {/* Info envío */}
          <div style={{ marginTop: 8, padding: '12px 14px', borderRadius: 14, background: PB.surface2, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Icon name="refresh" size={16} color={PB.ink3}/>
            <div style={{ fontSize: 12, color: PB.ink3, lineHeight: 1.5 }}>
              Envío por <strong style={{ color: PB.ink2 }}>Correos Express</strong> · 3–5 días hábiles · recibirás el número de seguimiento por email.
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 16px 26px', background: PB.surface, boxShadow: '0 -12px 30px rgba(20,19,24,.1)', borderTop: `1px solid ${PB.line}`, borderTopLeftRadius: 28, borderTopRightRadius: 28 }}>
        <Button onClick={valid ? () => onConfirm(form) : undefined} full icon="arrow" style={{ padding: '18px', fontSize: 16, opacity: valid ? 1 : .45, cursor: valid ? 'pointer' : 'not-allowed' }}>
          Confirmar dirección
        </Button>
      </div>

    </>
  );
};

window.ScreenStoreAddress = ScreenStoreAddress;
