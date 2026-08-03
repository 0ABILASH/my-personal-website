import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Globe, RefreshCw, ArrowUpRight, MapPin } from "lucide-react";
import { FALLBACK_PLACES, renderLayers, fetchAllRoutes, DARK_TILES, TILE_OPTIONS, addLegend, markerType } from "../services/map";

var TYPE_META = {
  current: { label: "Current Location", color: "#3bf66a", soft: "rgba(59,246,106,0.10)" },
  visited: { label: "Visited", color: "#3b82f6", soft: "rgba(59,130,246,0.10)" },
  small: { label: "Stop", color: "#ff0505f5", soft: "rgba(255,5,5,0.10)" },
};

export default function Space() {
  const [places, setPlaces] = useState(FALLBACK_PLACES);
  const [activePlace, setActivePlace] = useState(null);
  const [routes, setRoutes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState(false);
  const [showVisited, setShowVisited] = useState(false);
  const [showSmall, setShowSmall] = useState(false);
  const [fetchStatus, setFetchStatus] = useState("loading");
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
          if (filtered.length > 0) {
            setPlaces(filtered);
            setFetchStatus("ok");
            return;
          }
        }
        setFetchStatus("fallback");
      })
      .catch(function () {
        setFetchStatus("error");
      });
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

  // Fetch road routes in background — markers show immediately
  const loadRoutes = useCallback(async function () {
    if (places.length < 2) {
      setRoutes({});
      return;
    }
    setLoading(true);
    setProgress({ done: 0, total: places.length - 1 });
    try {
      var r = await fetchAllRoutes(places, function (done, total) {
        setProgress({ done: done, total: total });
      });
      setRoutes(r);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [places]);

  useEffect(() => {
    loadRoutes();
  }, [loadRoutes]);

  // Render layers — markers show immediately, routes update as they arrive
  var animDone = useRef(false)
  useEffect(() => {
    if (!mapReady.current || !mapInstance.current) return;
    var shouldAnimate = routes !== null && !animDone.current
    renderLayers(mapInstance.current, places, routes, shouldAnimate, showVisited, showSmall)
    if (shouldAnimate) animDone.current = true
  }, [places, routes, showVisited, showSmall]);

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

  var visible = places.filter(function (p, i) {
    var t = markerType(p, i);
    if (!t) return false;
    if (t === 'visited' && !showVisited) return false;
    if (t === 'small' && !showSmall) return false;
    return true;
  });

  var renderPanel = function () {
    return (
      <>
        <div className="flex items-center gap-2.5 px-4 h-12 border-b border-border shrink-0">
          <MapPin size={13} className="text-accent" />
          <span className="text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono">
            Destinations
          </span>
          <div className="flex-1 h-px bg-border" />
          <span
            className="w-2 h-2 rounded-full cursor-help"
            title={
              fetchStatus === "ok"
                ? "Travel data loaded successfully"
                : fetchStatus === "fallback"
                  ? "API empty — showing offline data"
                  : fetchStatus === "error"
                    ? "Failed to load travel data"
                    : "Loading travel data..."
            }
            style={{
              background:
                fetchStatus === "ok"
                  ? "#34d399"
                  : fetchStatus === "fallback"
                    ? "#fbbf24"
                    : fetchStatus === "error"
                      ? "#f87171"
                      : "#a1a1aa",
              boxShadow:
                fetchStatus === "ok"
                  ? "0 0 6px rgba(52,211,153,0.6)"
                  : fetchStatus === "fallback"
                    ? "0 0 6px rgba(251,191,36,0.5)"
                    : fetchStatus === "error"
                      ? "0 0 6px rgba(248,113,113,0.5)"
                      : "none",
            }}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 px-4 py-2 border-b border-border shrink-0">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-[9px] font-mono font-semibold text-blue-300">
            <span className="w-1 h-1 rounded-full bg-blue-400 shadow-[0_0_4px_rgba(59,130,246,0.9)]" />
            Visited
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/25 text-[9px] font-mono font-semibold text-red-300">
            <span className="w-1 h-1 rounded-full bg-red-400 shadow-[0_0_4px_rgba(255,5,5,0.8)]" />
            Stops
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[9px] font-mono font-semibold text-emerald-300">
            <span className="w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_4px_rgba(59,246,106,0.8)]" />
            Current Location
          </span>
        </div>
        <div className="cards-scroll flex-1 overflow-y-auto p-2.5 flex flex-col gap-2 min-h-0">
          {visible.map(function (p, i) {
            var t = markerType(p, i);
            var meta = TYPE_META[t] || TYPE_META.visited;
            var active = activePlace === p;
            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.04, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                onClick={function () { flyTo(p) }}
                className={
                  "group relative flex items-center gap-3 px-3 h-[54px] shrink-0 rounded-xl bg-bg border text-left cursor-pointer overflow-hidden transition-all duration-300 " +
                  (active
                    ? "border-accent/40 bg-accent-soft"
                    : "border-border hover:border-border-hover hover:bg-surface")
                }
                style={active ? { boxShadow: '0 0 0 1px ' + meta.color + '55, 0 4px 16px -8px ' + meta.color } : {}}
              >
                <span
                  className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full transition-all duration-300"
                  style={{ background: meta.color, opacity: active ? 1 : 0.35, boxShadow: active ? '0 0 8px ' + meta.color : 'none' }}
                />
                <span className="flex-shrink-0 text-[9px] font-mono text-text-quaternary w-3.5 text-right">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 border transition-all duration-300"
                  style={{
                    background: meta.soft,
                    borderColor: meta.color + '33',
                    boxShadow: active ? '0 0 10px ' + meta.color + '44' : 'none',
                  }}
                >
                  {p.emoji || <MapPin size={13} style={{ color: meta.color }} />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-semibold truncate leading-tight">
                    {p.city}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 min-w-0">
                    <span
                      className="inline-flex items-center gap-1 text-[9px] font-mono font-semibold uppercase tracking-wider shrink-0 whitespace-nowrap"
                      style={{ color: meta.color }}
                    >
                      <span className="w-1 h-1 rounded-full" style={{ background: meta.color, boxShadow: '0 0 4px ' + meta.color + 'aa' }} />
                      {meta.label}
                    </span>
                    <span className="text-[9px] text-text-quaternary truncate font-mono min-w-0">
                      {p.country}{p.date ? ' · ' + p.date : ''}
                    </span>
                  </div>
                </div>
                <span
                  className="w-4 h-4 rounded-md border items-center justify-center shrink-0 hidden group-hover:flex -translate-x-1 group-hover:translate-x-0 transition-all duration-300"
                  style={{ borderColor: meta.color + '44', color: meta.color, background: meta.soft }}
                >
                  <ArrowUpRight size={9} />
                </span>
              </motion.button>
            );
          })}
          {visible.length === 0 && (
            <div className="flex flex-col items-center justify-center flex-1 py-12 gap-2 text-center">
              <MapPin size={20} className="text-text-quaternary" />
              <p className="text-[12px] text-text-tertiary">No destinations match the current filters.</p>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-6 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-3">
            <Globe size={16} className="text-accent" />
            <span className="text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono">
              Travel Log
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-1">
            Travel Log
          </h1>
          <p className="text-[13px] text-text-secondary max-w-lg leading-relaxed">
            Destinations I&apos;ve visited, roads I&apos;ve traveled, and the moments that made each journey unforgettable.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {["Passionate", "Traveler", "Motorcyclist","5000+ Km ",].map(function (tag, i) {
              return (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-bg border border-border text-[10px] font-semibold text-text-tertiary font-mono"
                >
                  {tag}
                </span>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="relative rounded-2xl border border-border overflow-hidden shadow-2xl shadow-black/40 ring-1 ring-white/5"
        >
          <div ref={mapRef} className="w-full h-[420px] sm:h-[500px] lg:h-[560px] bg-bg" />
          <div className="absolute inset-0 pointer-events-none rounded-2xl shadow-[inset_0_0_80px_rgba(0,0,0,0.4)]" />

          {/* Toggle pills — top center */}
          {!loading && !error && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-1 p-1 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/50">
              <button
                onClick={function () { setShowVisited(function (v) { return !v }) }}
                className={
                  "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wide transition-all duration-300 cursor-pointer " +
                  (showVisited
                    ? "bg-blue-500/25 text-blue-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_12px_rgba(59,130,246,0.35)]"
                    : "text-text-tertiary hover:text-text-secondary hover:bg-white/5")
                }
              >
                <span
                  className={
                    "w-1.5 h-1.5 rounded-full transition-all duration-300 " +
                    (showVisited ? "bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,1)]" : "bg-text-quaternary")
                  }
                />
                Visited
              </button>
              <button
                onClick={function () { setShowSmall(function (v) { return !v }) }}
                className={
                  "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wide transition-all duration-300 cursor-pointer " +
                  (showSmall
                    ? "bg-purple-500/25 text-purple-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_12px_rgba(139,92,246,0.35)]"
                    : "text-text-tertiary hover:text-text-secondary hover:bg-white/5")
                }
              >
                <span
                  className={
                    "w-1.5 h-1.5 rounded-full transition-all duration-300 " +
                    (showSmall ? "bg-purple-400 shadow-[0_0_8px_rgba(139,92,246,1)]" : "bg-text-quaternary")
                  }
                />
                Stops
              </button>
            </div>
          )}

          {/* Loading — small top bar, map stays interactive */}
          {loading && (
            <div className="absolute top-0 left-0 right-0 z-[100]">
              <div className="h-0.5 bg-border overflow-hidden rounded-t-2xl">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-300"
                  style={{ width: progressPct + '%' }}
                />
              </div>
            </div>
          )}

          {/* Error overlay */}
          {error && (
            <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-bg/80 backdrop-blur-sm gap-3">
              <p className="text-[12px] text-text-secondary font-medium">Route calculation failed</p>
              <button
                onClick={loadRoutes}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border hover:border-border-hover text-[11px] font-medium text-text-secondary hover:text-text transition-all cursor-pointer"
              >
                <RefreshCw size={11} />
                Retry
              </button>
            </div>
          )}

          {/* Floating glass destination panel — desktop */}
          <div className="absolute top-3 right-3 w-[314px] xl:w-[333px] hidden lg:flex flex-col rounded-2xl bg-surface/10 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden max-h-[calc(100%-1.5rem)]">
            {renderPanel()}
          </div>
        </motion.div>

        {/* Destination section — mobile & tablet (fully responsive) */}
        <div className="lg:hidden mt-8">
          <div className="flex items-center gap-2.5 mb-4">
            <MapPin size={14} className="text-accent" />
            <span className="text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono">
              Destinations
            </span>
            <div className="flex-1 h-px bg-border" />
            <span
              className="w-2 h-2 rounded-full shrink-0"
              title={
                fetchStatus === "ok"
                  ? "Travel data loaded successfully"
                  : fetchStatus === "fallback"
                    ? "API empty — showing offline data"
                    : fetchStatus === "error"
                      ? "Failed to load travel data"
                      : "Loading travel data..."
              }
              style={{
                background:
                  fetchStatus === "ok"
                    ? "#34d399"
                    : fetchStatus === "fallback"
                      ? "#fbbf24"
                      : fetchStatus === "error"
                        ? "#f87171"
                        : "#a1a1aa",
                boxShadow:
                  fetchStatus === "ok"
                    ? "0 0 8px rgba(52,211,153,0.7)"
                    : fetchStatus === "fallback"
                      ? "0 0 8px rgba(251,191,36,0.6)"
                      : fetchStatus === "error"
                        ? "0 0 8px rgba(248,113,113,0.6)"
                        : "none",
              }}
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-[10px] font-mono font-semibold text-blue-300">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_5px_rgba(59,130,246,0.9)]" />
              Visited
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-red-500/10 border border-red-500/25 text-[10px] font-mono font-semibold text-red-300">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_5px_rgba(255,5,5,0.8)]" />
              Stops
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-mono font-semibold text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(59,246,106,0.8)]" />
              Current Location
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {visible.map(function (p, i) {
              var t = markerType(p, i);
              var meta = TYPE_META[t] || TYPE_META.visited;
              var active = activePlace === p;
              return (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.04, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  onClick={function () { flyTo(p) }}
                  className={
                    "group relative flex items-center gap-2.5 sm:gap-3 px-3 sm:px-3.5 py-3 sm:py-3.5 rounded-2xl bg-bg border text-left cursor-pointer overflow-hidden transition-all duration-300 active:scale-[0.98] " +
                    (active
                      ? "border-accent/40 bg-accent-soft"
                      : "border-border hover:border-border-hover")
                  }
                  style={active ? { boxShadow: '0 0 0 1px ' + meta.color + '55, 0 8px 24px -10px ' + meta.color } : {}}
                >
                  <span
                    className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full"
                    style={{ background: meta.color, opacity: active ? 1 : 0.35, boxShadow: active ? '0 0 8px ' + meta.color : 'none' }}
                  />
                  <span
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center text-base sm:text-lg shrink-0 border"
                    style={{
                      background: meta.soft,
                      borderColor: meta.color + '33',
                      boxShadow: active ? '0 0 12px ' + meta.color + '44' : 'none',
                    }}
                  >
                    {p.emoji || <MapPin size={15} style={{ color: meta.color }} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-1.5 min-w-0">
                      <span className="text-[9px] font-mono text-text-quaternary shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[14px] sm:text-[15px] font-semibold truncate leading-tight">
                        {p.city}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 min-w-0">
                      <span
                        className="inline-flex items-center gap-1 text-[9px] font-mono font-semibold uppercase tracking-wider shrink-0 whitespace-nowrap"
                        style={{ color: meta.color }}
                      >
                        <span className="w-1 h-1 rounded-full" style={{ background: meta.color, boxShadow: '0 0 4px ' + meta.color + 'aa' }} />
                        {meta.label}
                      </span>
                      <span className="text-[10px] text-text-quaternary truncate font-mono min-w-0">
                        {p.country}{p.date ? ' · ' + p.date : ''}
                      </span>
                    </div>
                  </div>
                  <span
                    className="w-6 h-6 rounded-lg border flex items-center justify-center shrink-0"
                    style={{ borderColor: meta.color + '44', color: meta.color, background: meta.soft }}
                  >
                    <ArrowUpRight size={11} />
                  </span>
                </motion.button>
              );
            })}
            {visible.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 gap-2 text-center rounded-2xl border border-border bg-bg sm:col-span-2">
                <MapPin size={20} className="text-text-quaternary" />
                <p className="text-[12px] text-text-tertiary">No destinations match the current filters.</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
