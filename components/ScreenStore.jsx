// POLEBOX — Tienda: productos para recoger en el pasillo de la sede

const ScreenStore = ({ onBack }) => {
  const [cat, setCat] = React.useState('todo');
  const [cart, setCart] = React.useState({});

  const categories = [
    { id: 'todo',       label: 'Todo' },
    { id: 'grip',       label: 'Grip' },
    { id: 'accesorios', label: 'Accesorios' },
    { id: 'ropa',       label: 'Ropa' },
  ];

  const products = [
    { id: 1, cat: 'grip',       name: 'Magnesio líquido',  sub: 'Mighty Grip · 50 ml',    price: 8.50,  icon: 'bolt',    color: '#F5F2EC', badge: 'Más vendido' },
    { id: 2, cat: 'grip',       name: 'Tiza en polvo',     sub: 'Chalk Block · 56 g',     price: 5.00,  icon: 'sparkle', color: '#F5F2EC' },
    { id: 3, cat: 'grip',       name: 'Dry Hands',         sub: 'Grip líquido · 45 ml',   price: 12.00, icon: 'bolt',    color: '#F5F2EC' },
    { id: 4, cat: 'accesorios', name: 'Rodilleras pole',   sub: 'ProGrip · el par',       price: 18.00, icon: 'shield',  color: '#ECE4F9', badge: 'Nuevo' },
    { id: 5, cat: 'accesorios', name: 'Calcetines grip',   sub: 'Non-slip · talla única', price: 9.00,  icon: 'users',   color: '#ECE4F9' },
    { id: 6, cat: 'accesorios', name: 'Toalla microfibra', sub: '40×80 cm · POLEBOX',     price: 12.00, icon: 'refresh', color: '#ECE4F9' },
    { id: 7, cat: 'ropa',       name: 'Shorts pole',       sub: 'POLEBOX · XS–XL',        price: 28.00, icon: 'profile', color: '#C6F2DD' },
    { id: 8, cat: 'ropa',       name: 'Top sin tirantes',  sub: 'POLEBOX · XS–XL',        price: 24.00, icon: 'profile', color: '#C6F2DD' },
  ];

  const filtered = cat === 'todo' ? products : products.filter(p => p.cat === cat);

  const add    = (id) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const remove = (id) => setCart(c => {
    const n = { ...c };
    if (n[id] > 1) n[id]--; else delete n[id];
    return n;
  });

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = products.find(p => p.id === parseInt(id));
    return sum + (p ? p.price * qty : 0);
  }, 0);
  const fmtPrice = (n) => n.toFixed(2).replace('.', ',') + ' €';

  return (
    <>
      <StatusBar/>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: totalItems > 0 ? 200 : 110 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px 12px' }}>
          <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: 12, border: `1px solid ${PB.line}`, background: PB.surface, display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
            <Icon name="back" size={18}/>
          </button>
          <h3 style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 20, letterSpacing: '-0.01em', margin: 0, flex: 1 }}>Tienda</h3>
          {totalItems > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 999, background: PB.morado, color: '#fff', fontFamily: PB.font, fontWeight: 700, fontSize: 12 }}>
              <Icon name="card" size={14} color="#fff"/>
              {totalItems} art.
            </div>
          )}
        </div>

        {/* Banner recogida */}
        <div style={{ margin: '0 16px 16px', padding: '10px 14px', borderRadius: 14, background: PB.mentaSoft, color: PB.moradoInk, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: PB.menta, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <Icon name="bolt" size={16} color={PB.moradoInk}/>
          </div>
          <div style={{ fontSize: 12, lineHeight: 1.4 }}>
            <strong style={{ fontWeight: 800 }}>Recogida en pasillo</strong> — Paga aquí y recoge en la entrada de tu sede al llegar.
          </div>
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

        {/* Grid de productos */}
        <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {filtered.map(p => {
            const qty = cart[p.id] || 0;
            return (
              <div key={p.id} style={{
                borderRadius: 18, overflow: 'hidden', background: PB.surface,
                border: `1px solid ${qty > 0 ? PB.morado : PB.line}`,
                boxShadow: qty > 0 ? '0 6px 18px rgba(72,35,128,.15)' : '0 2px 8px rgba(20,19,24,.05)',
                transition: 'all 220ms cubic-bezier(.2,.7,.2,1)',
              }}>
                {/* Imagen placeholder */}
                <div style={{ height: 110, background: p.color, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 54, height: 54, borderRadius: 16, background: '#fff', display: 'grid', placeItems: 'center', boxShadow: '0 4px 14px rgba(20,19,24,.1)', color: PB.morado }}>
                    <Icon name={p.icon} size={26} color={PB.morado}/>
                  </div>
                  {p.badge && (
                    <div style={{ position: 'absolute', top: 8, left: 8, padding: '3px 8px', borderRadius: 999, background: PB.morado, color: '#fff', fontSize: 9, fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase' }}>{p.badge}</div>
                  )}
                  {qty > 0 && (
                    <div style={{ position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: 999, background: PB.morado, color: '#fff', display: 'grid', placeItems: 'center', fontFamily: PB.mono, fontWeight: 700, fontSize: 12 }}>{qty}</div>
                  )}
                </div>

                {/* Info + controles */}
                <div style={{ padding: '10px 10px 12px' }}>
                  <div style={{ fontFamily: PB.font, fontWeight: 700, fontSize: 13, color: PB.ink, lineHeight: 1.3 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: PB.ink3, marginTop: 2 }}>{p.sub}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                    <span style={{ fontFamily: PB.mono, fontWeight: 700, fontSize: 15, color: PB.ink }}>{fmtPrice(p.price)}</span>
                    {qty === 0 ? (
                      <button onClick={() => add(p.id)} style={{
                        width: 32, height: 32, borderRadius: 999, border: 0,
                        background: PB.morado, color: '#fff', display: 'grid', placeItems: 'center',
                        cursor: 'pointer', boxShadow: '0 4px 10px rgba(72,35,128,.3)',
                      }}>
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

      {/* Cesta sticky */}
      {totalItems > 0 && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '16px 16px 26px', borderTopLeftRadius: 28, borderTopRightRadius: 28,
          background: PB.surface, boxShadow: '0 -12px 30px rgba(20,19,24,.1)',
          borderTop: `1px solid ${PB.line}`,
        }}>
          {/* Desglose */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
            {Object.entries(cart).map(([id, qty]) => {
              const p = products.find(p => p.id === parseInt(id));
              if (!p) return null;
              return (
                <div key={id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: PB.ink2 }}>
                  <span>{p.name} ×{qty}</span>
                  <span style={{ fontFamily: PB.mono, fontWeight: 600 }}>{fmtPrice(p.price * qty)}</span>
                </div>
              );
            })}
            <div style={{ height: 1, background: PB.line, margin: '4px 0' }}/>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: PB.font, fontWeight: 800, fontSize: 15 }}>Total</span>
              <span style={{ fontFamily: PB.mono, fontWeight: 800, fontSize: 20, color: PB.ink }}>{fmtPrice(totalPrice)}</span>
            </div>
          </div>
          <Button full icon="arrow" style={{ padding: '16px', fontSize: 15 }}>
            Pagar y reservar recogida
          </Button>
        </div>
      )}

      <TabBar active="home"/>
    </>
  );
};

window.ScreenStore = ScreenStore;
