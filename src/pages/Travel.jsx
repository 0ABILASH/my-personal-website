import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../App.css';

const SHEETS_URL = import.meta.env.VITE_SHEETS_URL || 'https://script.google.com/macros/s/AKfycbwcFe2sB0xmbOPtZDbcXj77RGgdFNRGXWq_BbaCW_7uWPv86VPj1qBl52lCxyqW4mJBxA/exec';

const FALLBACK_PLACES = [
  { city:'Bangalore', country:'India', lat:12.9716, lng:77.5946, emoji:'🏙️', date:'Home Base' },
  { city:'Chennai', country:'India', lat:13.0827, lng:80.2707, emoji:'🌊', date:'Visited' },
  { city:'Kanyakumari', country:'India', lat:8.0883, lng:77.5385, emoji:'🌅', date:'Visited' },
  { city:'Madurai', country:'India', lat:9.9252, lng:78.1198, emoji:'🛕', date:'Visited' },
  { city:'Tokyo', country:'Japan', lat:35.6762, lng:139.6503, emoji:'🗼', date:'Mar 2024' },
  { city:'Paris', country:'France', lat:48.8566, lng:2.3522, emoji:'🏛️', date:'Jun 2024' },
  { city:'New York', country:'USA', lat:40.7128, lng:-74.006, emoji:'🗽', date:'Sep 2024' },
  { city:'Reykjavik', country:'Iceland', lat:64.1466, lng:-21.9426, emoji:'🌋', date:'Jan 2025' },
  { city:'Bali', country:'Indonesia', lat:-8.3405, lng:115.092, emoji:'🌴', date:'Apr 2025' },
  { city:'Kyoto', country:'Japan', lat:35.0116, lng:135.7681, emoji:'⛩️', date:'Jun 2025' },
];

const ROUTE_COLOR = '#3b82f6';

function buildRoutesFromPlaces(places) {
  if (places.length < 2) return [];
  const points = places.map(p => [p.lat, p.lng]);
  return [{
    name: places[0].city + ' → ' + places[places.length - 1].city,
    color: ROUTE_COLOR,
    points,
  }];
}

function drawRoutes(map, routes) {
  routes.forEach(route => {
    if (!route.points || route.points.length < 2) return;

    L.polyline(route.points, {
      color: route.color,
      weight: 20,
      opacity: 0.1,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);

    L.polyline(route.points, {
      color: route.color,
      weight: 6,
      opacity: 0.5,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);

    const pts = route.points;
    for (let i = 0; i < pts.length - 1; i++) {
      const [lat1, lng1] = pts[i];
      const [lat2, lng2] = pts[i + 1];
      const segs = 12;
      for (let j = 1; j < segs; j++) {
        const t = j / segs;
        const lat = lat1 + (lat2 - lat1) * t;
        const lng = lng1 + (lng2 - lng1) * t;
        L.circleMarker([lat, lng], {
          radius: 1.5,
          fillColor: '#93c5fd',
          fillOpacity: 0.8,
          color: 'transparent',
          weight: 0,
        }).addTo(map);
      }
    }

    const startIcon = L.divIcon({
      html: `<div style="
        width:20px;height:20px;border-radius:50%;
        background:${route.color};border:3px solid white;
        box-shadow:0 0 0 2px ${route.color},0 0 16px ${route.color}80,0 2px 8px rgba(0,0,0,0.3);
      "></div>`,
      className: '',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    const endIcon = L.divIcon({
      html: `<div style="
        width:28px;height:28px;border-radius:50%;
        background:#ec4899;border:3px solid white;
        box-shadow:0 0 0 2px #ec4899,0 0 20px #ec489980,0 0 32px #ec489940,0 2px 8px rgba(0,0,0,0.3);
        display:flex;align-items:center;justify-content:center;
      ">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      </div>`,
      className: '',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    L.marker(pts[0], { icon: startIcon })
      .addTo(map)
      .bindPopup(`<div style="text-align:center;font-family:Nunito,sans-serif"><strong style="font-size:1rem">${route.name.split(' → ')[0]}</strong><br/><span style="font-size:0.78rem;color:#6b7280">Start</span></div>`);

    L.marker(pts[pts.length - 1], { icon: endIcon })
      .addTo(map)
      .bindPopup(`<div style="text-align:center;font-family:Nunito,sans-serif"><strong style="font-size:1rem">${route.name.split(' → ')[1]}</strong><br/><span style="font-size:0.78rem;color:#6b7280">End</span></div>`);
  });
}

export default function Travel() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [places, setPlaces] = useState(FALLBACK_PLACES);
  const [dataReady, setDataReady] = useState(!SHEETS_URL);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => { const t = setTimeout(() => setReady(true), 100); return () => clearTimeout(t); }, []);

  useEffect(() => {
    if (!SHEETS_URL) return;
    fetch(`${SHEETS_URL}?action=travel`)
      .then(r => r.json())
      .then(data => {
        if (data.places && data.places.length) {
          const valid = data.places.filter(p => p.lat && p.lng);
          if (valid.length) setPlaces(valid);
        }
      })
      .catch(() => {})
      .finally(() => setDataReady(true));
  }, []);

  useEffect(() => {
    if (!dataReady || !mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [11.5, 78.5],
      zoom: 6,
      scrollWheelZoom: true,
      zoomControl: false,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    const routes = buildRoutesFromPlaces(places);
    drawRoutes(map, routes);

    mapInstance.current = map;
    setTimeout(() => map.invalidateSize(), 300);

    return () => { map.remove(); mapInstance.current = null; };
  }, [dataReady]);

  const uniqueCountries = new Set(places.map(p => p.country)).size;
  const uniqueCities = new Set(places.map(p => p.city)).size;

  return (
    <div className="hp-wrap">
      <nav className="hp-nav"><button onClick={() => navigate('/')}>← Back</button><span>Travel</span></nav>

      <div className={`hp-hero hp-hero-travel ${ready?'hp-show':''}`}>
        <div className="hp-hero-content">
          <span className="hp-badge hp-badge-travel">Hobby</span>
          <h1>Travel Tracker</h1>
          <p>Places I've been — click a destination to fly there on the map.</p>
        </div>
        <div className="hp-hero-icon">🗺️</div>
      </div>

      <div className="hp-body">
        <div className={`hp-stats hp-stagger ${ready?'hp-show':''}`}>
          <div className="hp-stat"><span className="hp-stat-num hp-color-travel">{uniqueCountries}</span><span className="hp-stat-label">Countries</span></div>
          <div className="hp-stat"><span className="hp-stat-num hp-color-travel">{uniqueCities}</span><span className="hp-stat-label">Cities</span></div>
          <div className="hp-stat"><span className="hp-stat-num hp-color-travel">{places.length}</span><span className="hp-stat-label">Destinations</span></div>
        </div>

        <div className="travel-map-wrap">
          <div ref={mapRef} className="travel-map" />
        </div>
      </div>

      <div className="hp-bottom">
        <button className="hp-back-btn" onClick={() => navigate('/')}>← Back to home</button>
      </div>
    </div>
  );
}
