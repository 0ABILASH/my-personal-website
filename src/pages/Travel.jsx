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

const ROUTE_COLOR = '#ffffff';

function renderLayers(map, places) {
  map.eachLayer(layer => {
    if (!(layer instanceof L.TileLayer)) map.removeLayer(layer);
  });

  for (let i = 0; i < places.length - 1; i++) {
    L.polyline([[places[i].lat, places[i].lng], [places[i + 1].lat, places[i + 1].lng]], {
      color: ROUTE_COLOR, weight: 2, opacity: 0.8, dashArray: '6, 4',
    }).addTo(map);
  }

  places.forEach((p, i) => {
    const radius = i === 0 ? 10 : 4;
    const weight = i === 0 ? 3 : 1.5;
    const marker = L.circleMarker([p.lat, p.lng], {
      radius, color: ROUTE_COLOR, fillColor: ROUTE_COLOR, fillOpacity: 1, weight,
    }).addTo(map);
    marker.bindPopup(
      `<div style="text-align:center;font-family:Nunito,sans-serif;padding:2px 6px"><span style="font-size:1.2rem">${p.emoji}</span><br/><strong style="font-size:0.85rem">${p.city}</strong><br/><span style="font-size:0.7rem;color:#6b7280">${p.country} · ${p.date}</span></div>`,
      { closeButton: false, offset: [0, -8] }
    );
  });
}

export default function Travel() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [sheetData, setSheetData] = useState(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const mapReady = useRef(false);

  const places = sheetData
    ? (sheetData.places || []).filter(p => p.lat && p.lng)
    : FALLBACK_PLACES;

  useEffect(() => { const t = setTimeout(() => setReady(true), 100); return () => clearTimeout(t); }, []);

  useEffect(() => {
    if (!SHEETS_URL) return;
    fetch(`${SHEETS_URL}?action=travel`)
      .then(r => r.json())
      .then(data => setSheetData(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, { scrollWheelZoom: true, zoomControl: true }).setView([11.5, 78.5], 5.5);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    mapInstance.current = map;
    mapReady.current = true;

    return () => {
      if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null; mapReady.current = false; }
    };
  }, []);

  useEffect(() => {
    if (!mapReady.current || !mapInstance.current) return;
    renderLayers(mapInstance.current, places);
  }, [places]);

  useEffect(() => {
    if (!mapReady.current || !mapInstance.current || places.length === 0) return;
    const timer = setTimeout(() => {
      mapInstance.current.flyTo([places[0].lat, places[0].lng], 8, { duration: 2 });
    }, 500);
    return () => clearTimeout(timer);
  }, [sheetData]);

  const uniqueCountries = new Set(places.map(p => p.country)).size;
  const uniqueCities = new Set(places.map(p => p.city)).size;

  const stats = [
    { label:'Countries', value:String(uniqueCountries), bar: uniqueCountries * 20 },
    { label:'Cities', value:String(uniqueCities), bar: uniqueCities * 10 },
    { label:'Destinations', value:String(places.length), bar: places.length * 8 },
  ];

  return (
    <div className="cy-wrap">
      <nav className="cy-nav">
        <button className="cy-nav-back" onClick={() => navigate('/')}>← Back</button>
        <span className="cy-nav-tag">Travel</span>
      </nav>

      <div className={`cy-hero ${ready?'cy-show':''}`}>
        <div className="cy-scanlines" />
        <div className="cy-hero-inner">
          <div className="cy-hero-left">
            <span className="cy-tag">HOBBY</span>
            <h1 className="cy-hero-title">Travel Tracker</h1>
            <p className="cy-hero-desc">Places I've been — click a destination to fly there on the map.</p>
          </div>
          <div className="cy-hero-right">
            <div className="cy-hero-icon-box">
              <span className="cy-hero-emoji">🗺️</span>
              <div className="cy-hero-ring" />
            </div>
          </div>
        </div>
      </div>

      <div className={`cy-stats ${ready?'cy-show':''}`}>
        {stats.map((s,i) => (
          <div key={i} className="cy-stat">
            <div className="cy-stat-top">
              <span className="cy-stat-label">{s.label}</span>
              <span className="cy-stat-value">{s.value}</span>
            </div>
            <div className="cy-stat-bar">
              <div className="cy-stat-fill" style={{width: Math.min(s.bar, 100) + '%'}} />
            </div>
          </div>
        ))}
      </div>

      <div className={`cy-panel ${ready?'cy-show':''}`} style={{width:'100%',margin:'1.5rem 0 0',padding:0}}>
        <div className="cy-panel-header">
          <h2>Route Map</h2>
          <span className="cy-panel-count">{places.length} places</span>
        </div>
        <div className="cy-map-wrap">
          <div ref={mapRef} className="cy-map" />
        </div>
      </div>

      <div className="cy-bottom">
        <button className="cy-back-btn" onClick={() => navigate('/')}>← Back to home</button>
      </div>
    </div>
  );
}
