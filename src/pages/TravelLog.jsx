import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Globe, Loader2, RefreshCw } from "lucide-react";
import { FALLBACK_PLACES, renderLayers, fetchAllRoutes, DARK_TILES, TILE_OPTIONS, addLegend, markerType } from "../services/map";

export default function Space() {
  const [places, setPlaces] = useState(FALLBACK_PLACES);
  const [activePlace, setActivePlace] = useState(null);
  const [routes, setRoutes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState(false);
  const [showMajor, setShowMajor] = useState(false);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const mapReady = useRef(false);

  // Fetch places from API
  useEffect(() => {
    fetch("/api/travel")
      .then(function (r) { return r.json() })
      .then(function (data) {
        if (data.places && data.places.length > 0) {
          var filtered = data.places.filter(function (p) { return p.lat && p.lng });
          if (filtered.length > 0) setPlaces(filtered);
        }
      })
      .catch(function () {});
  }, []);

  // Init Leaflet map with Carto Dark Matter tiles
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
    L.tileLayer(DARK_TILES, TILE_OPTIONS).addTo(map);
    mapInstance.current = map;
    mapReady.current = true;
    addLegend(map);
    return function () {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        mapReady.current = false;
      }
    };
  }, []);

  // Fetch road routes and render
  const loadRoutes = useCallback(async function () {
    if (places.length < 2) {
      setRoutes({});
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(false);
    setProgress({ done: 0, total: places.length - 1 });
    try {
      var r = await fetchAllRoutes(places, function (done, total) {
        setProgress({ done: done, total: total });
      });
      setRoutes(r);
      setLoading(false);
    } catch {
      setError(true);
      setLoading(false);
    }
  }, [places]);

  useEffect(() => {
    loadRoutes();
  }, [loadRoutes]);

  // Render layers — animate on first render after routes load
  var animDone = useRef(false)
  useEffect(() => {
    if (!mapReady.current || !mapInstance.current) return;
    var shouldAnimate = routes !== null && !animDone.current
    renderLayers(mapInstance.current, places, routes, shouldAnimate, showMajor)
    if (shouldAnimate) animDone.current = true
  }, [places, routes, showMajor]);

  // Fly to first place (current location from sheet)
  useEffect(() => {
    if (!mapReady.current || !mapInstance.current || places.length === 0) return;
    mapInstance.current.flyTo([places[0].lat, places[0].lng], 8, { duration: 2 });
  }, [places]);

  var flyTo = function (place) {
    if (!mapInstance.current) return;
    setActivePlace(place);
    mapInstance.current.flyTo([place.lat, place.lng], 8, { duration: 1.5 });
  };

  var progressPct = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-6 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green to-accent flex items-center justify-center shadow-[0_0_24px_rgba(34,197,94,0.15)]">
              <Globe size={20} className="text-white" />
            </div>
            <div className="absolute -inset-1 rounded-[14px] border border-green/10 animate-glow" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-1">
              Travel Log
            </h1>
            <p className="text-[13px] text-text-secondary max-w-lg leading-relaxed">
              Destinations I&apos;ve visited, roads I&apos;ve traveled, and the moments that made each journey unforgettable.
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="rounded-2xl overflow-hidden border border-border mb-4 relative"
        >
          <div ref={mapRef} className="w-full h-[380px] sm:h-[480px] bg-bg" />

          {/* Major destinations toggle */}
          {!loading && !error && (
            <button
              onClick={function () { setShowMajor(function (v) { return !v }) }}
              className={
                "absolute top-3 right-3 z-[1000] px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all cursor-pointer " +
                (showMajor
                  ? "bg-amber-soft border-amber/30 text-amber"
                  : "bg-bg/85 backdrop-blur-md border-border text-text-tertiary hover:text-text-secondary")
              }
            >
              {showMajor ? '★ Major On' : '★ Major Off'}
            </button>
          )}

          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 z-[1000] flex flex-col items-center justify-center bg-bg/80 backdrop-blur-sm gap-3">
              <Loader2 size={20} className="text-accent animate-spin" />
              <p className="text-[12px] text-text-secondary font-medium">
                Calculating road routes... {progress.done}/{progress.total}
              </p>
              <div className="w-40 h-1 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-300"
                  style={{ width: progressPct + '%' }}
                />
              </div>
            </div>
          )}

          {/* Error overlay */}
          {error && (
            <div className="absolute inset-0 z-[1000] flex flex-col items-center justify-center bg-bg/80 backdrop-blur-sm gap-3">
              <p className="text-[12px] text-red font-medium">Route calculation failed</p>
              <button
                onClick={loadRoutes}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border hover:border-border-hover text-[11px] font-medium text-text-secondary hover:text-text transition-all cursor-pointer"
              >
                <RefreshCw size={11} />
                Retry
              </button>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {places.filter(function (p, i) {
            if (!showMajor && markerType(p, i) === 'major') return false;
            return true;
          }).map(function (p, i) {
            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 + i * 0.02, duration: 0.2 }}
                onClick={function () { flyTo(p) }}
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
