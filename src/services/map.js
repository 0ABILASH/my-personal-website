import L from 'leaflet'

export const SHEETS_URL = import.meta.env.VITE_SHEETS_URL || 'https://script.google.com/macros/s/AKfycbwcFe2sB0xmbOPtZDbcXj77RGgdFNRGXWq_BbaCW_7uWPv86VPj1qBl52lCxyqW4mJBxA/exec'

export const FALLBACK_PLACES = [
  { city: '', country: 'India', lat: 12.9716, lng: 77.5946, emoji: '\u{1F3D9}\u{FE0F}', date: 'Home Base' },
]

export const ROUTE_COLOR = '#7c6aff'

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
