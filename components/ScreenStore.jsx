// POLEBOX — Tienda: catálogo de productos
// Catálogo en data/products.js (window.STORE_PRODUCTS)

const ScreenStore = ({ onBack, onCart, cart, setCart }) => {
  const [cat, setCat] = React.useState('todo');

  const categories = [
    { id: 'todo', label: 'Todo' },
    { id: 'grip', label: 'Grip' },
    { id: 'accesorios', label: 'Accesorios' },
    { id: 'ropa', label: 'Ropa' },
  ];

  const filtered = cat === 'todo' ? STORE_PRODUCTS : STORE_PRODUCTS.filter(p => p.cat === cat);
  const add    = (id) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const remove = (id) => setCart(c => { const n = { ...c }; if (n[id] > 1) n[id]--; else delete n[id]; return n; });

  const totalItems = PBU.cartCount(cart);
  const totalPrice = PBU.cartSubtotal(cart);
  const fmt = PBU.fmtEUR;

  return (
    <>
      <StatusBar/>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: totalItems > 0 ? 100 : 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px 12px' }}>
          <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: 12, border: `1px solid ${PB.line}`, background: PB.surface, display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
            <Icon name="back" size={18}/>
          </button>
          <h3 style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 20, letterSpacing: '-0.01em', margin: 0, flex: 1 }}>Tienda</h3>
        </div>

        {/* Métodos de entrega */}
        <div style={{ margin: '0 16px 16px', display: 'flex', gap: 8 }}>
          {[
            { icon: 'bolt',    label: 'Locker en sede',    sub: 'Gratis', bg: PB.mentaSoft },
            { icon: 'refresh', label: 'Envío a domicilio', sub: `desde ${PBU.fmtEUR(PBU.SHIPPING_COST)}`, bg: PB.surface2 },
          ].map(m => (
            <div key={m.label} style={{ flex: 1, padding: '10px 12px', borderRadius: 14, background: m.bg, border: `1px solid ${PB.line}`, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name={m.icon} size={16} color={PB.morado}/>
              <div>
                <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 11, color: PB.ink }}>{m.label}</div>
                <div style={{ fontSize: 10, color: PB.success, fontWeight: 700 }}>{m.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Categorías */}
        <div style={{ padding: '0 16px 14px' }}>
          <div style={{ display: 'flex', gap: 6, padding: 4, background: PB.surface2, borderRadius: 14 }}>
            {categories.map(c => (
              <button key={c.id} onClick={() => setCat(c.id)} style={{
                flex: 1, padding: '10px 6px', borderRadius: 10, border: 0,
                background: cat === c.id ? PB.surface : 'transparent',
                boxShadow: cat === c.id ? '0 1px 3px rgba(20,19,24,.08)' : 'none',
                color: cat === c.id ? PB.ink : PB.ink3,
                fontFamily: PB.font, fontWeight: 700, fontSize: 12, cursor: 'pointer',
              }}>{c.label}</button>
            ))}
          </div>
        </div>

        {/* Grid productos */}
        <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {filtered.map(p => {
            const qty = cart[p.id] || 0;
            return (
              <div key={p.id} style={{
                borderRadius: 18, overflow: 'hidden', background: PB.surface,
                border: `1.5px solid ${qty > 0 ? PB.morado : PB.line}`,
                boxShadow: qty > 0 ? '0 6px 18px rgba(72,35,128,.15)' : '0 2px 8px rgba(20,19,24,.04)',
                transition: 'all 220ms cubic-bezier(.2,.7,.2,1)',
              }}>
                <div style={{ height: 110, background: p.color, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 54, height: 54, borderRadius: 16, background: '#fff', display: 'grid', placeItems: 'center', boxShadow: '0 4px 14px rgba(20,19,24,.1)' }}>
                    <Icon name={p.icon} size={26} color={PB.morado}/>
                  </div>
                  {p.badge && <div style={{ position: 'absolute', top: 8, left: 8, padding: '3px 8px', borderRadius: 999, background: PB.morado, color: '#fff', fontSize: 9, fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase' }}>{p.badge}</div>}
                  {qty > 0 && <div style={{ position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: 999, background: PB.morado, color: '#fff', display: 'grid', placeItems: 'center', fontFamily: PB.mono, fontWeight: 700, fontSize: 12 }}>{qty}</div>}
                </div>
                <div style={{ padding: '10px 10px 12px' }}>
                  <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 13, color: PB.ink, lineHeight: 1.3 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: PB.ink3, marginTop: 2 }}>{p.sub}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                    <span style={{ fontFamily: PB.mono, fontWeight: 700, fontSize: 15, color: PB.ink }}>{fmt(p.price)}</span>
                    {qty === 0 ? (
                      <button onClick={() => add(p.id)} style={{ width: 32, height: 32, borderRadius: 999, border: 0, background: PB.morado, color: '#fff', display: 'grid', placeItems: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(72,35,128,.3)' }}>
                        <Icon name="plus" size={16} color="#fff"/>
                      </button>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button onClick={() => remove(p.id)} style={{ width: 28, height: 28, borderRadius: 999, border: `1px solid ${PB.line}`, background: PB.surface2, display: 'grid', placeItems: 'center', cursor: 'pointer', fontFamily: PB.font, fontWeight: 800, fontSize: 16, color: PB.ink }}>−</button>
                        <span style={{ fontFamily: PB.mono, fontWeight: 700, fontSize: 14, color: PB.morado, minWidth: 14, textAlign: 'center' }}>{qty}</span>
                        <button onClick={() => add(p.id)} style={{ width: 28, height: 28, borderRadius: 999, border: 0, background: PB.morado, color: '#fff', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
                          <Icon name="plus" size={14} color="#fff"/>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {totalItems > 0 && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 16px 26px', background: 'rgba(250,250,247,.95)', backdropFilter: 'blur(12px)', borderTop: `1px solid ${PB.line}` }}>
          <button onClick={onCart} style={{
            width: '100%', padding: '16px 20px', borderRadius: 16, border: 0, cursor: 'pointer',
            background: PB.morado, color: '#fff', fontFamily: PB.font, fontWeight: 700, fontSize: 15,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            boxShadow: '0 8px 22px rgba(72,35,128,.35)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 26, height: 26, borderRadius: 999, background: 'rgba(255,255,255,.25)', display: 'grid', placeItems: 'center', fontFamily: PB.mono, fontWeight: 800, fontSize: 13 }}>{totalItems}</div>
              Ver carrito
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontFamily: PB.mono, fontWeight: 700, fontSize: 15 }}>{fmt(totalPrice)}</span>
              <Icon name="chevron" size={18} color="#fff"/>
            </div>
          </button>
        </div>
      )}

    </>
  );
};

window.ScreenStore = ScreenStore;
