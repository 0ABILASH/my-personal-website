import L from 'leaflet'

export const SHEETS_URL = import.meta.env.VITE_SHEETS_URL || 'https://script.google.com/macros/s/AKfycbwcFe2sB0xmbOPtZDbcXj77RGgdFNRGXWq_BbaCW_7uWPv86VPj1qBl52lCxyqW4mJBxA/exec'

export const FALLBACK_PLACES = [
  { city: 'Bangalore', country: 'India', lat: 12.9716, lng: 77.5946, emoji: '\u{1F3D9}\u{FE0F}', date: 'Home Base' },
  { city: 'Chennai', country: 'India', lat: 13.0827, lng: 80.2707, emoji: '\u{1F30A}', date: 'Visited' },
  { city: 'Kanyakumari', country: 'India', lat: 8.0883, lng: 77.5385, emoji: '\u{1F305}', date: 'Visited' },
  { city: 'Madurai', country: 'India', lat: 9.9252, lng: 78.1198, emoji: '\u{1F6D5}', date: 'Visited' },
  { city: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, emoji: '\u{1F5FC}', date: 'Mar 2024' },
  { city: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, emoji: '\u{1F3DB}\u{FE0F}', date: 'Jun 2024' },
  { city: 'New York', country: 'USA', lat: 40.7128, lng: -74.006, emoji: '\u{1F5FD}', date: 'Sep 2024' },
  { city: 'Reykjavik', country: 'Iceland', lat: 64.1466, lng: -21.9426, emoji: '\u{1F30B}', date: 'Jan 2025' },
  { city: 'Bali', country: 'Indonesia', lat: -8.3405, lng: 115.092, emoji: '\u{1F334}', date: 'Apr 2025' },
  { city: 'Kyoto', country: 'Japan', lat: 35.0116, lng: 135.7681, emoji: '\u{26E9}\u{FE0F}', date: 'Jun 2025' },
]

export const ROUTE_COLOR = '#ffffff'

export function renderLayers(map, places) {
  map.eachLayer(layer => {
    if (!(layer instanceof L.TileLayer)) map.removeLayer(layer)
  })

  for (let i = 0; i < places.length - 1; i++) {
    L.polyline([[places[i].lat, places[i].lng], [places[i + 1].lat, places[i + 1].lng]], {
      color: ROUTE_COLOR, weight: 2, opacity: 0.8, dashArray: '6, 4',
    }).addTo(map)
  }

  places.forEach((p) => {
    const isFirst = p === places[0]
    const marker = L.circleMarker([p.lat, p.lng], {
      radius: isFirst ? 10 : 4,
      color: ROUTE_COLOR,
      fillColor: ROUTE_COLOR,
      fillOpacity: 1,
      weight: isFirst ? 3 : 1.5,
    }).addTo(map)
    marker.bindPopup(
      `<div style="text-align:center;font-family:Inter,sans-serif;padding:2px 6px"><span style="font-size:1.2rem">${p.emoji}</span><br/><strong style="font-size:0.85rem">${p.city}</strong><br/><span style="font-size:0.7rem;color:#71717a">${p.country} \u00b7 ${p.date}</span></div>`,
      { closeButton: false, offset: [0, -8] }
    )
  })
}
