// POLEBOX — dataset canónico de sedes.
// Única fuente de verdad: antes existían 3 copias divergentes (Screen1Home,
// ScreenVenue, ScreenSelectSede) más una cuarta lista propia de la tienda.

const ALL_VENUES = [
  {
    id: 'mad-salamanca', city: 'Madrid', name: 'Salamanca', fullName: 'Madrid · Salamanca',
    addr: 'C/ Jorge Juan, 24', zip: '28001 Madrid',
    metro: 'Metro Velázquez (L4)', parking: 'Parking disponible en la calle',
    boxes: 2, lockers: 4, hours: 'Abierto 24/7', dist: 0.4, rating: 4.9, reviews: 128,
    lat: 40.4255, lon: -3.6836,
    gallery: [
      { hue: '#2b1550', accent: '#80E3B7', label: 'BOX 1' },
      { hue: '#3a1b6a', accent: '#E9A0E3', label: 'BOX 2' },
      { hue: '#241344', accent: '#F0B867', label: 'Recepción' },
    ],
    equipment: [
      { icon: 'bolt',   title: 'X-Pole 45 mm',  sub: 'Estática + giratoria' },
      { icon: 'music',  title: 'JBL Pro Mk3',   sub: 'Bluetooth + AUX' },
      { icon: 'light',  title: 'LED ambiente',  sub: '3 modos RGB' },
      { icon: 'users',  title: 'Vestuario',     sub: 'Ducha + taquilla' },
    ],
  },
  {
    id: 'mad-malasana', city: 'Madrid', name: 'Malasaña', fullName: 'Madrid · Malasaña',
    addr: 'C/ del Pez, 18', zip: '28004 Madrid',
    metro: 'Metro Noviciado (L2)', parking: 'SER zona azul',
    boxes: 3, lockers: 3, hours: 'Abierto 24/7', dist: 1.2, rating: 4.8, reviews: 76,
    lat: 40.4226, lon: -3.7044,
    gallery: [
      { hue: '#1f0d3a', accent: '#c9a8ff', label: 'BOX 1' },
      { hue: '#2e1a58', accent: '#80E3B7', label: 'BOX 2' },
      { hue: '#3a1b6a', accent: '#E9A0E3', label: 'BOX 3' },
    ],
    equipment: [
      { icon: 'bolt',   title: 'X-Pole 45 mm',  sub: 'Estática + giratoria' },
      { icon: 'music',  title: 'Pioneer DJ',    sub: 'Bluetooth + USB' },
      { icon: 'light',  title: 'Neón retro',    sub: 'Ambiente único' },
      { icon: 'camera', title: 'Ring light',    sub: 'Para grabación' },
    ],
  },
  {
    id: 'mad-retiro', city: 'Madrid', name: 'Retiro', fullName: 'Madrid · Retiro',
    addr: 'C/ Alcalá, 155', zip: '28009 Madrid',
    metro: 'Metro Goya (L4)', parking: 'Parking Goya',
    boxes: 2, lockers: 2, hours: 'Abierto 24/7', dist: 3.1, rating: 4.7, reviews: 54,
    lat: 40.4195, lon: -3.6731,
    gallery: [
      { hue: '#1a2b50', accent: '#80E3B7', label: 'BOX 1' },
      { hue: '#0d1f3c', accent: '#F0B867', label: 'BOX 2' },
      { hue: '#241344', accent: '#E9A0E3', label: 'Pasillo' },
    ],
    equipment: [
      { icon: 'bolt',   title: 'X-Pole 50 mm',  sub: 'Estática + giratoria' },
      { icon: 'music',  title: 'Bose SoundLink', sub: 'Bluetooth + AUX' },
      { icon: 'light',  title: 'LED ambiente',   sub: '5 modos' },
      { icon: 'shield', title: 'Insonorizado',   sub: 'Entrena de noche' },
    ],
  },
  {
    id: 'bcn-gracia', city: 'Barcelona', name: 'Gràcia', fullName: 'Barcelona · Gràcia',
    addr: 'C/ Verdi, 52', zip: '08012 Barcelona',
    metro: 'Metro Fontana (L3)', parking: 'Parking Lesseps',
    boxes: 2, lockers: 5, hours: 'Abierto 24/7', dist: 382, rating: 4.9, reviews: 210,
    lat: 41.4050, lon: 2.1580,
    gallery: [
      { hue: '#2b1550', accent: '#80E3B7', label: 'BOX 1' },
      { hue: '#3a1b6a', accent: '#c9a8ff', label: 'BOX 2' },
      { hue: '#1f1040', accent: '#F0B867', label: 'Terraza' },
    ],
    equipment: [
      { icon: 'bolt',   title: 'X-Pole 45 mm',  sub: 'Estática + giratoria' },
      { icon: 'music',  title: 'JBL Xtreme 3',  sub: 'Bluetooth + AUX' },
      { icon: 'light',  title: 'LED ambiente',   sub: '3 modos RGB' },
      { icon: 'users',  title: 'Vestuario',      sub: 'Ducha + taquilla' },
    ],
  },
  {
    id: 'bcn-eixample', city: 'Barcelona', name: 'Eixample', fullName: 'Barcelona · Eixample',
    addr: 'C/ Mallorca, 215', zip: '08008 Barcelona',
    metro: 'Metro Diagonal (L3/L5)', parking: 'Parking Diagonal',
    boxes: 3, lockers: 3, hours: 'Abierto 24/7', dist: 383, rating: 4.8, reviews: 167,
    lat: 41.3952, lon: 2.1672,
    gallery: [
      { hue: '#1d0840', accent: '#c9a8ff', label: 'BOX 1' },
      { hue: '#3e1478', accent: '#80E3B7', label: 'BOX 2' },
      { hue: '#2b0d5a', accent: '#E9A0E3', label: 'BOX 3' },
    ],
    equipment: [
      { icon: 'bolt',   title: 'X-Pole 45 mm',   sub: 'Estática + giratoria' },
      { icon: 'music',  title: 'Sonos Era 300',   sub: 'WiFi + AUX' },
      { icon: 'light',  title: 'LED RGBW',        sub: 'App controlled' },
      { icon: 'camera', title: 'Set grabación',   sub: 'Trípode + ring light' },
    ],
  },
  {
    id: 'vlc-ruzafa', city: 'Valencia', name: 'Ruzafa', fullName: 'Valencia · Ruzafa',
    addr: 'C/ Cádiz, 30', zip: '46006 Valencia',
    metro: 'Xàtia (L3, L5, L7, L9)', parking: 'Parking Ruzafa',
    boxes: 2, lockers: 2, hours: 'Abierto 24/7', dist: 351, rating: 4.8, reviews: 89,
    lat: 39.4625, lon: -0.3753,
    gallery: [
      { hue: '#2b1550', accent: '#F0B867', label: 'BOX 1' },
      { hue: '#1d2b4a', accent: '#80E3B7', label: 'BOX 2' },
      { hue: '#241344', accent: '#E9A0E3', label: 'Acceso' },
    ],
    equipment: [
      { icon: 'bolt',   title: 'X-Pole 45 mm',    sub: 'Estática + giratoria' },
      { icon: 'music',  title: 'Marshall Woburn',  sub: 'Bluetooth + AUX' },
      { icon: 'light',  title: 'LED ambiente',     sub: '3 modos' },
      { icon: 'users',  title: 'Vestuario',        sub: 'Ducha + taquilla' },
    ],
  },
];

const CITIES = ['Madrid', 'Barcelona', 'Valencia'];

// Bounding boxes + origen para posicionar pins (% sobre el iframe OSM)
const CITY_CFG = {
  Madrid:    { west: -3.720, north: 40.437, dLon: 0.062, dLat: 0.028,
               osm: 'https://www.openstreetmap.org/export/embed.html?bbox=-3.720%2C40.409%2C-3.658%2C40.437&layer=mapnik' },
  Barcelona: { west: 2.138,  north: 41.418, dLon: 0.052, dLat: 0.034,
               osm: 'https://www.openstreetmap.org/export/embed.html?bbox=2.138%2C41.384%2C2.190%2C41.418&layer=mapnik' },
  Valencia:  { west: -0.408, north: 39.482, dLon: 0.070, dLat: 0.034,
               osm: 'https://www.openstreetmap.org/export/embed.html?bbox=-0.408%2C39.448%2C-0.338%2C39.482&layer=mapnik' },
};

const fmtKm = (n) => (n < 10 ? String(n).replace('.', ',') : String(Math.round(n))) + ' km';

// Vista derivada para la recogida en locker de la tienda (antes era una
// cuarta lista divergente con sedes inexistentes).
const STORE_VENUES = ALL_VENUES.map(v => ({
  id: v.id, name: v.name, city: v.city,
  addr: `${v.addr} · ${v.zip}`,
  lockers: v.lockers,
  dist: fmtKm(v.dist),
}));

const getVenue = (id) => ALL_VENUES.find(v => v.id === id) || null;

Object.assign(window, { ALL_VENUES, CITIES, CITY_CFG, STORE_VENUES, getVenue });
