"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const createDotIcon = (color: string, isCore: boolean, size: number = 10) => {
  return new L.DivIcon({
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        <span style="
          background: ${color};
          width: ${isCore ? "18px" : size + "px"};
          height: ${isCore ? "18px" : size + "px"};
          border-radius: 50%;
          display: inline-block;
          border: 2px solid white;
          box-shadow: 0 0 10px ${color}88, 0 0 20px ${color}44;
          ${isCore ? "animation: pulse-mitra 2s infinite;" : ""}
        "></span>
      </div>
    `,
    className: "custom-marker-icon",
    iconSize: isCore ? [18, 18] : [size, size],
    iconAnchor: isCore ? [9, 9] : [size / 2, size / 2],
  });
};

const createFloatingCardIcon = (title: string, subtitle: string, color: string, dotColor: string, link?: string, imageUrl?: string, coverImageUrl?: string) => {
  return new L.DivIcon({
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: flex-end; width: 200px; height: ${coverImageUrl ? "260px" : "200px"}; pointer-events: auto;">
        <div style="
          background: linear-gradient(135deg, ${color}22, ${color}44);
          backdrop-filter: blur(12px);
          border: 1px solid ${color}66;
          border-radius: 14px;
          padding: 10px 16px;
          min-width: 160px;
          max-width: 190px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${color}33;
          text-align: center;
        ">
          ${imageUrl ? `<img src="${imageUrl}" alt="${title}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; margin: -34px auto 4px; border: 2px solid ${color}; box-shadow: 0 2px 12px rgba(0,0,0,0.3); display: block;" />` : ""}
          <h4 style="margin: 0; font-size: 12px; font-weight: 800; color: white; letter-spacing: 0.3px;">${title}</h4>
          ${subtitle ? `<p style="margin: 3px 0 0; font-size: 9px; color: ${color}; font-weight: 600;">${subtitle}</p>` : ""}
          ${coverImageUrl ? `<img src="${coverImageUrl}" alt="" style="width: 100%; height: 80px; object-fit: cover; display: block; border-radius: 8px; margin-top: 6px;" />` : ""}
          ${link ? `<a href="${link}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 4px; margin-top: 6px; padding: 4px 10px; font-size: 9px; font-weight: 700; color: white; background: ${color}; border-radius: 20px; text-decoration: none; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            Buka Google Maps
          </a>` : ""}
        </div>
        <div style="width: 2px; height: 10px; background: ${color}; flex-shrink: 0;"></div>
        <span style="
          width: 14px; height: 14px; border-radius: 50%;
          background: ${dotColor};
          border: 2.5px solid white;
          box-shadow: 0 0 12px ${dotColor}aa, 0 0 24px ${dotColor}55;
          animation: pulse-mitra 2s infinite;
          display: inline-block;
          flex-shrink: 0;
        "></span>
      </div>
    `,
    className: "custom-marker-icon",
    iconSize: [200, 200],
    iconAnchor: [100, 200],
  });
};

const pulseKeyframes = `
  @keyframes pulse-mitra {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(244, 196, 107, 0.7); }
    50% { transform: scale(1.15); box-shadow: 0 0 0 14px rgba(244, 196, 107, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(244, 196, 107, 0); }
  }
`;

const lineFlowKeyframes = `
  @keyframes line-flow {
    0% { stroke-dashoffset: 0; }
    100% { stroke-dashoffset: -40; }
  }
  .mitra-line path {
    stroke-dasharray: 8 6;
    animation: line-flow 1.5s linear infinite;
  }
`;

const omahNalar: [number, number] = [-7.9253349, 112.6250432];

const daftarMitra: {
  name: string;
  coords: [number, number];
  info: string;
  mapsUrl: string;
}[] = [
  { name: "MI Nurul Huda 2", coords: [-7.9512, 112.6120], info: "Mitra Edukasi Dasar", mapsUrl: "https://maps.app.goo.gl/Tjs2MEWmry6hhYwn9" },
  { name: "MTS Dzunnuroin", coords: [-7.9720, 112.6450], info: "Mitra Pembelajaran & Seminar", mapsUrl: "https://maps.app.goo.gl/Tjs2MEWmry6hhYwn9" },
  { name: "MTS Taufiqiyah Kab. Malang", coords: [-8.1120, 112.5620], info: "Mitra Sekolah Wilayah Kabupaten", mapsUrl: "https://maps.app.goo.gl/Vy37A8X2gGq7YTb58" },
  { name: "BEM FK UM", coords: [-7.9622, 112.6180], info: "Kemitraan Organisasi Mahasiswa", mapsUrl: "https://maps.app.goo.gl/KSAivNPcLniJ4MuE7" },
  { name: "HMD IKM UM", coords: [-7.9615, 112.6195], info: "Mitra Kesehatan Masyarakat", mapsUrl: "https://maps.app.goo.gl/PzQwPsREtQkru1ut6" },
  { name: "FIK UM", coords: [-7.9630, 112.6165], info: "Fakultas Ilmu Keolahragaan UM", mapsUrl: "https://maps.app.goo.gl/PzQwPsREtQkru1ut6" },
  { name: "Intrans Publishing", coords: [-7.9540, 112.6280], info: "Mitra Distribusi Penerbitan", mapsUrl: "https://maps.app.goo.gl/Vr8gVQUQk6rdGVNS6" },
  { name: "Komunitas Lentera Nusantara", coords: [-7.9890, 112.6050], info: "Komunitas Kreatif Lokal", mapsUrl: "https://maps.app.goo.gl/vAzkcYeyj4RLzNVT7" },
  { name: "SD Mojorejo 2", coords: [-7.8920, 112.5410], info: "Mitra Literasi & Buku Baca", mapsUrl: "https://maps.app.goo.gl/vdyGtvQVZfu1DzDZA" },
  { name: "SMP Negeri 2 Singosari", coords: [-7.8880, 112.6560], info: "Sekolah Mitra Eksternal", mapsUrl: "https://maps.app.goo.gl/RiTaBHazhWRq9Dyd6" },
  { name: "Pusat Kajian Perempuan Solo", coords: [-7.5710, 110.8260], info: "Mitra Pusat Kajian & Riset", mapsUrl: "https://maps.app.goo.gl/S53RFwmy56ZbW6Nw8" },
  { name: "YPK Bali", coords: [-8.6740, 115.2530], info: "Mitra Utama Gerakan Kemanusiaan Bali", mapsUrl: "https://maps.app.goo.gl/mPAwAvzMofzh7KaB7" },
];

function MapCapture({ onMap }: { onMap: (m: L.Map) => void }) {
  const map = useMap();
  useEffect(() => { onMap(map); }, [map, onMap]);
  return null;
}

export default function PetaMitraJaringan() {
  const mapRef = useRef<L.Map | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMap = useCallback((m: L.Map) => { mapRef.current = m; }, []);

  const flyTo = (coords: [number, number]) => {
    mapRef.current?.flyTo(coords, 15, { duration: 1.2 });
  };

  const center: [number, number] = [-8.1000, 113.2000];

  return (
    <div className="w-full bg-[#1A2332] p-4 md:p-6 rounded-2xl font-sans text-white relative shadow-lg border border-gray-800">
      <style dangerouslySetInnerHTML={{ __html: `${pulseKeyframes}\n${lineFlowKeyframes}` }} />

      <div className="mb-3">
        <h2 className="text-sm md:text-base font-bold tracking-wide text-[#F4C46B]">Jaringan Sebaran Mitra</h2>
        <p className="text-[10px] md:text-xs text-gray-400 mt-0.5">
          Pusat koordinasi dan garis hubungan ke setiap mitra lapangan
        </p>
      </div>

      <div className="w-full h-[300px] md:h-[450px] rounded-xl overflow-hidden border border-gray-700">
        {mounted && (
        <MapContainer
          key="mitra-map"
          center={center}
          zoom={8}
          className="w-full h-full mitra-line"
          maxBounds={[
            [-9.5, 109.5],
            [-7.0, 116.5],
          ] as [[number, number], [number, number]]}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          <MapCapture onMap={handleMap} />

          {/* Omah Nalar floating card marker */}
          <Marker
            position={omahNalar}
            icon={createFloatingCardIcon("Omah Nalar", "", "#F4C46B", "#F4C46B", undefined, "/images/logo_omah.png", "/images/omah_nalar.JPG")}
          />

          {/* Partner connections */}
          {daftarMitra.map((mitra, idx) => (
            <Polyline
              key={`line-${idx}`}
              positions={[omahNalar, mitra.coords]}
              pathOptions={{
                color: selected === mitra.name ? "#F4C46B" : "#4FD1C5",
                weight: selected === mitra.name ? 2.5 : 2,
                opacity: selected === mitra.name ? 0.9 : 0.6,
              }}
            />
          ))}

          {/* Partner markers — floating card when selected, dot otherwise */}
          {daftarMitra.map((mitra, idx) => (
            <Marker
              key={`marker-${idx}`}
              position={mitra.coords}
              icon={
                selected === mitra.name
                  ? createFloatingCardIcon(mitra.name, mitra.info, "#4FD1C5", "#4FD1C5", mitra.mapsUrl)
                  : createDotIcon("#4FD1C5", false, 10)
              }
            />
            ))}
          </MapContainer>
        )}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[10px] md:text-[11px] text-gray-400 border-t border-gray-800 pt-2.5 md:pt-3">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-amber-400 rounded-full border border-white inline-block animate-pulse" />
          <span>Omah Nalar (Pusat)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-teal-400 rounded-full border border-white inline-block" />
          <span>Titik Mitra Aktif</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-6 h-0 border-t border-dashed border-teal-400 inline-block" />
          <span>Alur Koordinasi Program</span>
        </div>
      </div>

      {/* Partner Cards */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
        {daftarMitra.map((mitra, idx) => {
          const isActive = selected === mitra.name;
          return (
            <button
              key={idx}
              onClick={() => { setSelected(isActive ? null : mitra.name); flyTo(mitra.coords); }}
              className={`group relative text-left rounded-xl p-3.5 border transition-all duration-300 cursor-pointer ${
                isActive
                  ? "border-amber-400 bg-gradient-to-br from-amber-900/60 to-amber-800/30 shadow-lg shadow-amber-500/20 scale-[1.02]"
                  : "border-gray-700/50 bg-gray-800/40 hover:border-teal-500/50 hover:bg-gray-800/70 hover:scale-[1.02]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 transition-all ${
                  isActive ? "bg-amber-400 shadow-[0_0_8px_#F4C46B] scale-110" : "bg-teal-500/50 group-hover:bg-teal-400 group-hover:scale-110"
                }`} />
                <div className="min-w-0">
                  <p className={`text-[11px] font-bold leading-tight truncate transition-colors ${
                    isActive ? "text-amber-200" : "text-gray-200 group-hover:text-white"
                  }`}>
                    {mitra.name}
                  </p>
                  <p className="text-[9px] text-gray-500 mt-0.5 truncate">{mitra.info}</p>
                </div>
              </div>
              {isActive && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center shadow-md">
                  <svg className="w-2.5 h-2.5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
