import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import { Point, LineString } from 'ol/geom';
import { Style, Stroke, Fill, Circle as CircleStyle, Text } from 'ol/style';
import Overlay from 'ol/Overlay';
import 'ol/ol.css';
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

const startStyle = new Style({
  image: new CircleStyle({ radius: 9, fill: new Fill({ color: ROUTE_COLOR }), stroke: new Stroke({ color: 'white', width: 3 }) }),
});
const pointStyle = new Style({
  image: new CircleStyle({ radius: 5, fill: new Fill({ color: ROUTE_COLOR }), stroke: new Stroke({ color: 'white', width: 2 }) }),
});
const lineGlowStyle = new Style({ stroke: new Stroke({ color: ROUTE_COLOR, width: 8, opacity: 0.2 }) });
const lineStyle = new Style({ stroke: new Stroke({ color: ROUTE_COLOR, width: 3, lineDash: [8, 6] }) });

function buildFeatures(places) {
  const features = [];
  if (places.length >= 2) {
    const coords = places.map(p => fromLonLat([p.lng, p.lat]));
    features.push(new Feature({ geometry: new LineString(coords), type: 'line' }));
  }
  places.forEach((p, i) => {
    features.push(new Feature({
      geometry: new Point(fromLonLat([p.lng, p.lat])),
      type: 'point',
      city: p.city,
      country: p.country,
      emoji: p.emoji,
      date: p.date,
      isStart: i === 0,
    }));
  });
  return features;
}

export default function Travel() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [sheetData, setSheetData] = useState(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const popupRef = useRef(null);

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

    const timer = setTimeout(() => {
      if (!mapRef.current || mapInstance.current) return;

      const source = new VectorSource({ features: buildFeatures(places) });

      const map = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new XYZ({ url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', attributions: '© OpenStreetMap', maxZoom: 19 }),
          }),
          new VectorLayer({ source, style: (feature) => {
            const t = feature.get('type');
            if (t === 'line') return [lineGlowStyle, lineStyle];
            return feature.get('isStart') ? startStyle : pointStyle;
          }}),
        ],
        view: new View({ center: fromLonLat([78.5, 11.5]), zoom: 5.5 }),
      });

      const popupEl = popupRef.current;
      const overlay = new Overlay({ element: popupEl, positioning: 'bottom-center', offset: [0, -14] });
      map.addOverlay(overlay);

      map.on('pointermove', (e) => {
        const feat = map.forEachFeatureAtPixel(e.pixel, f => f);
        if (feat && feat.get('type') === 'point') {
          map.getTargetElement().style.cursor = 'pointer';
          popupEl.innerHTML = `<div style="text-align:center;font-family:Nunito,sans-serif;padding:4px 8px"><span style="font-size:1.3rem">${feat.get('emoji')}</span><br/><strong style="font-size:0.9rem">${feat.get('city')}</strong><br/><span style="font-size:0.75rem;color:#6b7280">${feat.get('country')} · ${feat.get('date')}</span></div>`;
          overlay.setPosition(feat.getGeometry().getCoordinates());
        } else {
          map.getTargetElement().style.cursor = '';
          overlay.setPosition(undefined);
        }
      });

      mapInstance.current = map;
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (mapInstance.current) { mapInstance.current.setTarget(undefined); mapInstance.current = null; }
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
          <div ref={popupRef} className="ol-popup" style={{ position:'absolute', background:'white', borderRadius:10, padding:'6px 10px', boxShadow:'0 2px 12px rgba(0,0,0,0.15)', fontSize:'0.8rem', pointerEvents:'none', zIndex:10 }} />
        </div>
      </div>

      <div className="hp-bottom">
        <button className="hp-back-btn" onClick={() => navigate('/')}>← Back to home</button>
      </div>
    </div>
  );
}
