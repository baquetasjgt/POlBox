// POLEBOX — Catálogo de bonos de acceso

const BONO_CATALOG = [
  { id: 'b5-60',  name: 'Bono Inicio',      accesos: 5,  min: 60, price: 69,  perAcceso: 13.80, saving: 21, caducidadDias: 60 },
  { id: 'b5-90',  name: 'Bono Inicio Pro',  accesos: 5,  min: 90, price: 89,  perAcceso: 17.80, saving: 19, caducidadDias: 60 },
  { id: 'b10-60', name: 'Bono Mensual',     accesos: 10, min: 60, price: 120, perAcceso: 12.00, saving: 33, caducidadDias: 90, popular: true },
  { id: 'b10-90', name: 'Bono Mensual Pro', accesos: 10, min: 90, price: 149, perAcceso: 14.90, saving: 32, caducidadDias: 90 },
];
window.BONO_CATALOG = BONO_CATALOG;

const ScreenBonos = ({ onBack, onPurchased }) => {
  const [confirm, setConfirm] = React.useState(null); // bono a confirmar
  const [buying,  setBuying]  = React.useState(false);
  const [bought,  setBought]  = React.useState(false);
  const fmt = n => n.toFixed(2).replace('.', ',') + ' €';

  const handleBuy = () => {
    if (buying || bought) return;
    setBuying(true);
    setTimeout(() => { setBuying(false); setBought(true); }, 1300);
    setTimeout(() => {
      // Crear bono nuevo y notificar a App
      const now = new Date();
      const expiry = new Date(now);
      expiry.setDate(expiry.getDate() + confirm.caducidadDias);
      const pad = n => String(n).padStart(2, '0');
      const fmtDate = d => `${d.getDate()} ${['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'][d.getMonth()]} ${d.getFullYear()}`;
      const newBono = {
        id: `PB-BON-${String(Math.floor(Math.random()*90000+10000))}`,
        catalogId: confirm.id,
        name: confirm.name,
        accesos: confirm.accesos,
        min: confirm.min,
        usados: 0,
        purchaseDate: fmtDate(now),
        expiryDate: fmtDate(expiry),
        daysLeft: confirm.caducidadDias,
        state: 'active',
      };
      onPurchased(newBono);
    }, 2400);
  };

  return (
    <>
      <style>{`@keyframes pb-spin{to{transform:rotate(360deg)}}@keyframes pb-slideup{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}}@keyframes pb-fade{from{opacity:0}to{opacity:1}}`}</style>
      <StatusBar/>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 30 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px 8px' }}>
          <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: 12, border: `1px solid ${PB.line}`, background: PB.surface, display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
            <Icon name="back" size={18}/>
          </button>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 20, letterSpacing: '-0.01em', margin: 0 }}>Bonos de acceso</h3>
            <div style={{ fontSize: 12, color: PB.ink3, marginTop: 1 }}>Reserva más, paga menos</div>
          </div>
        </div>

        {/* Aviso precios base */}
        <div style={{ margin: '4px 16px 16px', padding: '10px 14px', borderRadius: 12, background: PB.mentaSoft, fontSize: 12, color: PB.moradoInk, display: 'flex', gap: 8, alignItems: 'center' }}>
          <Icon name="sparkle" size={14} color={PB.morado}/>
          <span>Precio habitual: <strong>18 € / sesión 60 min</strong> · <strong>22 € / sesión 90 min</strong></span>
        </div>

        {/* Cards */}
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {BONO_CATALOG.map(b => {
            const is10 = b.accesos === 10;
            const bg = is10 ? `linear-gradient(135deg, ${PB.morado} 0%, #6A3FB8 100%)` : `linear-gradient(135deg, ${PB.mentaDeep} 0%, ${PB.menta} 100%)`;
            const textColor = is10 ? '#fff' : PB.moradoInk;
            const dimColor  = is10 ? 'rgba(255,255,255,.7)' : 'rgba(29,13,62,.6)';
            return (
              <div key={b.id} style={{ borderRadius: 22, overflow: 'hidden', boxShadow: b.popular ? '0 10px 30px rgba(72,35,128,.28)' : '0 4px 14px rgba(20,19,24,.08)', position: 'relative' }}>
                {b.popular && <div style={{ position: 'absolute', top: 14, right: 14, padding: '3px 10px', borderRadius: 999, background: PB.menta, color: PB.moradoInk, fontSize: 9, fontWeight: 800, letterSpacing: '.1em', zIndex: 2 }}>MÁS POPULAR</div>}

                <div style={{ background: bg, padding: '20px 20px 18px' }}>
                  {/* Nombre + accesos */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: dimColor }}>{b.accesos} accesos · {b.min} min</div>
                      <div style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 22, letterSpacing: '-.01em', color: textColor, marginTop: 3 }}>{b.name}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: dimColor, letterSpacing: '.06em' }}>AHORRAS</div>
                      <div style={{ fontFamily: PB.mono, fontWeight: 800, fontSize: 22, color: is10 ? PB.menta : PB.morado }}>{b.saving}%</div>
                    </div>
                  </div>

                  {/* Precio */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span style={{ fontFamily: PB.mono, fontWeight: 800, fontSize: 36, color: textColor, letterSpacing: '-.02em' }}>{b.price} €</span>
                    <span style={{ fontSize: 13, color: dimColor }}>{fmt(b.perAcceso)}/acceso</span>
                  </div>
                </div>

                <div style={{ background: PB.surface, padding: '14px 20px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: PB.ink3 }}>Accesos</div>
                      <div style={{ fontFamily: PB.mono, fontWeight: 700, fontSize: 16, color: PB.ink, marginTop: 2 }}>{b.accesos}×</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: PB.ink3 }}>Duración</div>
                      <div style={{ fontFamily: PB.mono, fontWeight: 700, fontSize: 16, color: PB.ink, marginTop: 2 }}>{b.min} min</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: PB.ink3 }}>Válido</div>
                      <div style={{ fontFamily: PB.mono, fontWeight: 700, fontSize: 16, color: PB.ink, marginTop: 2 }}>{b.caducidadDias} días</div>
                    </div>
                  </div>
                  <button onClick={() => { setConfirm(b); setBought(false); }} style={{
                    padding: '12px 22px', borderRadius: 14, border: 0,
                    background: is10 ? PB.morado : PB.moradoInk, color: '#fff',
                    fontFamily: PB.font, fontWeight: 700, fontSize: 14, cursor: 'pointer',
                    boxShadow: `0 6px 16px rgba(72,35,128,.3)`,
                  }}>Comprar</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Nota legal */}
        <div style={{ margin: '16px 20px 0', fontSize: 11, color: PB.ink4, lineHeight: 1.5 }}>
          Los bonos son personales e intransferibles. El plazo de caducidad comienza en la fecha de compra. Los accesos no utilizados al vencer no se reembolsan.
        </div>
      </div>

      {/* Modal de confirmación de compra */}
      {confirm && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 80, background: 'rgba(20,19,24,.55)', backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', animation: 'pb-fade 200ms' }}>
          <div onClick={() => !buying && !bought && setConfirm(null)} style={{ flex: 1, cursor: 'pointer' }}/>
          <div style={{ background: PB.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: '8px 20px 32px', animation: 'pb-slideup 300ms cubic-bezier(.2,.7,.2,1)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 16px' }}>
              <div style={{ width: 44, height: 5, borderRadius: 999, background: PB.line }}/>
            </div>
            <div style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 20, letterSpacing: '-.01em', marginBottom: 4 }}>{confirm.name}</div>
            <div style={{ fontSize: 13, color: PB.ink3, marginBottom: 20 }}>{confirm.accesos} accesos · {confirm.min} min · válido {confirm.caducidadDias} días</div>

            {/* Desglose */}
            <div style={{ background: PB.surface2, borderRadius: 16, padding: '14px 16px', marginBottom: 20 }}>
              {[
                { k: `Bono ${confirm.accesos}×${confirm.min} min`, v: `${confirm.price},00 €` },
                { k: 'IVA (21%) incluido', v: '' },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13, color: i === 0 ? PB.ink : PB.ink3 }}>
                  <span>{r.k}</span>
                  <span style={{ fontFamily: PB.mono, fontWeight: 700 }}>{r.v}</span>
                </div>
              ))}
              <div style={{ height: 1, background: PB.line, margin: '8px 0' }}/>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 15 }}>Total</span>
                <span style={{ fontFamily: PB.mono, fontWeight: 800, fontSize: 22 }}>{confirm.price},00 €</span>
              </div>
            </div>

            <button onClick={handleBuy} disabled={buying} style={{
              width: '100%', padding: '17px', borderRadius: 16, border: 0,
              background: bought ? PB.success : PB.morado, color: '#fff',
              fontFamily: PB.font, fontWeight: 700, fontSize: 16, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'background 220ms', boxShadow: '0 8px 22px rgba(72,35,128,.35)',
            }}>
              {buying && <span style={{ width: 16, height: 16, borderRadius: 999, border: '2px solid rgba(255,255,255,.35)', borderTopColor: '#fff', animation: 'pb-spin 700ms linear infinite', display: 'inline-block' }}/>}
              {bought && <Icon name="check" size={18} color="#fff"/>}
              {buying ? 'Procesando pago…' : bought ? '¡Bono activado!' : `Confirmar · ${confirm.price},00 €`}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

window.ScreenBonos = ScreenBonos;
