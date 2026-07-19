import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
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

function buildRouteGeoJSON(places) {
  const coords = places.map(p => [p.lng, p.lat]);
  return {
    type: 'FeatureCollection',
    features: coords.length >= 2 ? [{
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: coords },
    }] : [],
  };
}

function buildPointsGeoJSON(places) {
  return {
    type: 'FeatureCollection',
    features: places.map((p, i) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
      properties: { city: p.city, country: p.country, emoji: p.emoji, date: p.date, index: i },
    })),
  };
}

export default function Travel() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [sheetData, setSheetData] = useState(null);
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

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
    if (!mapContainer.current || mapInstance.current) return;

    const timer = setTimeout(() => {
      if (!mapContainer.current || mapInstance.current) return;

      const routeGeoJSON = buildRouteGeoJSON(places);
      const pointsGeoJSON = buildPointsGeoJSON(places);

      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://tiles.openfreemap.org/styles/liberty',
        center: [78.5, 11.5],
        zoom: 5.5,
        scrollZoom: true,
      });

      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

      map.on('load', () => {
        map.addSource('route', { type: 'geojson', data: routeGeoJSON });
        map.addSource('points', { type: 'geojson', data: pointsGeoJSON });

        map.addLayer({
          id: 'route-glow',
          type: 'line',
          source: 'route',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: { 'line-color': ROUTE_COLOR, 'line-width': 8, 'line-opacity': 0.2 },
        });

        map.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: { 'line-color': ROUTE_COLOR, 'line-width': 3, 'line-opacity': 0.8, 'line-dasharray': [2, 1.5] },
        });

        map.addLayer({
          id: 'points-layer',
          type: 'circle',
          source: 'points',
          paint: {
            'circle-radius': 5,
            'circle-color': ROUTE_COLOR,
            'circle-stroke-color': 'white',
            'circle-stroke-width': 2,
          },
        });

        map.addLayer({
          id: 'start-point',
          type: 'circle',
          source: 'points',
          filter: ['==', 'index', 0],
          paint: {
            'circle-radius': 9,
            'circle-color': ROUTE_COLOR,
            'circle-stroke-color': 'white',
            'circle-stroke-width': 3,
            'circle-translate': [0, 0],
          },
        });

        const popup = new maplibregl.Popup({ closeButton: false, offset: 12 });

        map.on('mouseenter', 'points-layer', (e) => {
          map.getCanvas().style.cursor = 'pointer';
          const props = e.features[0].properties;
          popup
            .setLngLat(e.lngLat)
            .setHTML(`<div style="text-align:center;font-family:Nunito,sans-serif;padding:4px 8px"><span style="font-size:1.3rem">${props.emoji}</span><br/><strong style="font-size:0.9rem">${props.city}</strong><br/><span style="font-size:0.75rem;color:#6b7280">${props.country} · ${props.date}</span></div>`)
            .addTo(map);
        });

        map.on('mouseleave', 'points-layer', () => {
          map.getCanvas().style.cursor = '';
          popup.remove();
        });

      });

      mapInstance.current = map;
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
          <div ref={mapContainer} className="travel-map" />
        </div>
      </div>

      <div className="hp-bottom">
        <button className="hp-back-btn" onClick={() => navigate('/')}>← Back to home</button>
      </div>
    </div>
  );
}
