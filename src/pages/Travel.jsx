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
    const pts = route.points;

    for (let i = 0; i < pts.length - 1; i++) {
      L.polyline([pts[i], pts[i + 1]], {
        color: route.color,
        weight: 3,
        opacity: 0.7,
        dashArray: '6 4',
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);
    }

    pts.forEach((coord, i) => {
      if (i === 0) {
        const startIcon = L.divIcon({
          html: `<div style="
            width:18px;height:18px;border-radius:50%;
            background:${route.color};border:3px solid white;
            box-shadow:0 0 0 2px ${route.color},0 0 12px ${route.color}80;
          "></div>`,
          className: '',
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        });
        L.marker(coord, { icon: startIcon })
          .addTo(map)
          .bindPopup(`<div style="text-align:center;font-family:Nunito,sans-serif"><strong style="font-size:1rem">${route.name.split(' → ')[0]}</strong><br/><span style="font-size:0.78rem;color:#6b7280">Start</span></div>`);
      } else {
        L.circleMarker(coord, {
          radius: 4,
          fillColor: route.color,
          fillOpacity: 0.9,
          color: 'white',
          weight: 2,
        }).addTo(map);
      }
    });
  });
}

export default function Travel() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [sheetData, setSheetData] = useState(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  const places = sheetData
    ? (sheetData.places || []).filter(p => p.lat && p.lng)
    : FALLBACK_PLACES;

  useEffect(() => { const t = setTimeout(() => setReady(true), 100); return () => clearTimeout(t); }, []);

  useEffect(() => {
    if (!SHEETS_URL) return;
    fetch(`${SHEETS_URL}?action=travel`)
      .then(r => r.json())
      .then(data => {
        setSheetData(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const timer = setTimeout(() => {
      if (!mapRef.current || mapInstance.current) return;

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
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null; }
    };
  }, [sheetData]);

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
