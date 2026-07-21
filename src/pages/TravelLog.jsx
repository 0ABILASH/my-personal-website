import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Globe } from "lucide-react";
import { FALLBACK_PLACES, renderLayers } from "../services/map";

export default function Space() {
  const [places, setPlaces] = useState(FALLBACK_PLACES);
  const [activePlace, setActivePlace] = useState(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const mapReady = useRef(false);

  useEffect(() => {
    fetch("/api/travel")
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        if (data.places && data.places.length > 0) {
          var filtered = data.places.filter(function (p) {
            return p.lat && p.lng;
          });
          if (filtered.length > 0) setPlaces(filtered);
        }
      })
      .catch(function () {});
  }, []);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    var map = L.map(mapRef.current, {
      scrollWheelZoom: true,
      zoomControl: true,
      attributionControl: false,
      maxBoundsViscosity: 1.0,
      worldCopyJump: true,
      preferCanvas: true,
    }).setView([11.5, 78.5], 5.5);
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      attribution: '',
      maxZoom: 19,
    }).addTo(map);
    mapInstance.current = map;
    mapReady.current = true;
    return function () {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        mapReady.current = false;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapReady.current || !mapInstance.current) return;
    renderLayers(mapInstance.current, places);
  }, [places]);

  useEffect(() => {
    if (!mapReady.current || !mapInstance.current || places.length === 0)
      return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (pos) {
          mapInstance.current.flyTo(
            [pos.coords.latitude, pos.coords.longitude],
            8,
            { duration: 2 },
          );
        },
        function () {
          mapInstance.current.flyTo([places[0].lat, places[0].lng], 8, {
            duration: 2,
          });
        },
      );
    } else {
      mapInstance.current.flyTo([places[0].lat, places[0].lng], 8, {
        duration: 2,
      });
    }
  }, [places]);

  var flyTo = function (place) {
    if (!mapInstance.current) return;
    setActivePlace(place);
    mapInstance.current.flyTo([place.lat, place.lng], 8, { duration: 1.5 });
  };

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-6 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-green-soft flex items-center justify-center">
            <Globe size={18} className="text-green" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Travel Log
            </h1>
            <p className="text-[12px] text-text-tertiary">
              This travel log captures the destinations I've visited, the roads
              I've traveled, and the moments that made each journey
              unforgettable. Every trip has its own story, and this is where I
              preserve them.
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="rounded-2xl overflow-hidden border border-border mb-8"
        >
          <div ref={mapRef} className="w-full h-[380px] sm:h-[480px] bg-bg" />
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {places.map(function (p, i) {
            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 + i * 0.02, duration: 0.2 }}
                onClick={function () {
                  flyTo(p);
                }}
                className={
                  "flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-surface border transition-all duration-200 text-left cursor-pointer " +
                  (activePlace === p
                    ? "border-accent/40 bg-accent-soft shadow-[0_0_10px_rgba(124,106,255,0.08)]"
                    : "border-border hover:border-border-hover")
                }
              >
                <span className="text-base flex-shrink-0">{p.emoji}</span>
                <div className="min-w-0">
                  <div className="text-[12px] font-semibold truncate leading-tight">
                    {p.city}
                  </div>
                  <div className="text-[10px] text-text-tertiary truncate leading-tight">
                    {p.country} &middot; {p.date}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
