"use client";

import { useRef, useState, useEffect, useCallback } from "react";
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

const createFloatingCardIcon = (
  title: string,
  subtitle: string,
  color: string,
  dotColor: string,
  link?: string,
  imageUrl?: string,
  coverImageUrl?: string
) => {
  return new L.DivIcon({
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: flex-end; width: 200px; height: ${coverImageUrl ? "260px" : "200px"}; pointer-events: auto;">
        <div style="
          background: linear-gradient(135deg, ${color}dd, ${color});
          backdrop-filter: blur(12px);
          border: 1px solid ${color};
          border-radius: 14px;
          padding: 10px 16px;
          min-width: 160px;
          max-width: 190px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          text-align: center;
        ">
          ${imageUrl ? `<img src="${imageUrl}" alt="${title}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; margin: -34px auto 4px; border: 2px solid white; box-shadow: 0 2px 12px rgba(0,0,0,0.2); display: block;" />` : ""}
          <h4 style="margin: 0; font-size: 12px; font-weight: 800; color: white; letter-spacing: 0.3px;">${title}</h4>
          ${subtitle ? `<p style="margin: 3px 0 0; font-size: 9px; color: #fef08a; font-weight: 600;">${subtitle}</p>` : ""}
          ${coverImageUrl ? `<img src="${coverImageUrl}" alt="" style="width: 100%; height: 80px; object-fit: cover; display: block; border-radius: 8px; margin-top: 6px;" />` : ""}
          ${link ? `<a href="${link}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 4px; margin-top: 6px; padding: 4px 10px; font-size: 9px; font-weight: 700; color: #132c63; background: #f3c246; border-radius: 20px; text-decoration: none; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
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
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(243, 194, 70, 0.7); }
    50% { transform: scale(1.15); box-shadow: 0 0 0 14px rgba(243, 194, 70, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(243, 194, 70, 0); }
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
  { name: "HMD KESMAS UM", coords: [-7.9615, 112.6195], info: "Mitra Kesehatan Masyarakat", mapsUrl: "https://maps.app.goo.gl/PzQwPsREtQkru1ut6" },
  { name: "FIK UM", coords: [-7.9630, 112.6165], info: "Fakultas Ilmu Keolahragaan UM", mapsUrl: "https://maps.app.goo.gl/PzQwPsREtQkru1ut6" },
  { name: "Intrans Publishing", coords: [-7.9540, 112.6280], info: "Mitra Distribusi Penerbitan", mapsUrl: "https://maps.app.goo.gl/Vr8gVQUQk6rdGVNS6" },
  { name: "Komunitas Lentera Nusantara", coords: [-7.9890, 112.6050], info: "Komunitas Kreatif Lokal", mapsUrl: "https://maps.app.goo.gl/vAzkcYeyj4RLzNVT7" },
  { name: "SD Mojorejo 2", coords: [-7.8920, 112.5410], info: "Mitra Literasi & Buku Baca", mapsUrl: "https://maps.app.goo.gl/vdyGtvQVZfu1DzDZA" },
  { name: "SMP Negeri 2 Singosari", coords: [-7.8880, 112.6560], info: "Sekolah Mitra Eksternal", mapsUrl: "https://maps.app.goo.gl/RiTaBHazhWRq9Dyd6" },
  { name: "Pusat Kajian Perempuan Solo", coords: [-7.5710, 110.8260], info: "Mitra Pusat Kajian & Riset", mapsUrl: "https://maps.app.goo.gl/S53RFwmy56ZbW6Nw8" },
  { name: "YPK Bali", coords: [-8.6740, 115.2530], info: "Mitra Utama Gerakan Kemanusiaan Bali", mapsUrl: "https://maps.app.goo.gl/mPAwAvzMofzh7KaB7" },
];

const center: [number, number] = [-8.1000, 113.2000];

export default function PetaMitraJaringan() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const toggleSelect = useCallback((name: string, coords: [number, number], fly = true) => {
    setSelected((prev) => (prev === name ? null : name));
    if (fly) mapRef.current?.flyTo(coords, 15, { duration: 1.2 });
  }, []);

  const toggleRef = useRef(toggleSelect);
  toggleRef.current = toggleSelect;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current) return;

    const map = L.map(container, {
      center,
      zoom: 8,
      scrollWheelZoom: true,
      maxBounds: L.latLngBounds([-9.5, 109.5], [-7.0, 116.5]),
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    }).addTo(map);

    L.marker(omahNalar, {
      icon: createFloatingCardIcon(
        "Omah Nalar",
        "",
        "#f3c246",
        "#f3c246",
        undefined,
        "/images/logo_omah.png",
        "/images/omah_nalar.JPG"
      ),
      interactive: false,
      keyboard: false,
    }).addTo(map);

    mapRef.current = map;

    const raf = requestAnimationFrame(() => map.invalidateSize());

    return () => {
      cancelAnimationFrame(raf);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const group = L.layerGroup();

    daftarMitra.forEach((mitra) => {
      const isActive = selected === mitra.name;
      L.polyline([omahNalar, mitra.coords], {
        color: isActive ? "#f3c246" : "#132c63",
        weight: isActive ? 3 : 2,
        opacity: isActive ? 0.9 : 0.6,
      }).addTo(group);
    });

    daftarMitra.forEach((mitra) => {
      const isActive = selected === mitra.name;
      const marker = L.marker(mitra.coords, {
        icon: isActive
          ? createFloatingCardIcon(mitra.name, mitra.info, "#132c63", "#f3c246", mitra.mapsUrl)
          : createDotIcon("#132c63", false, 10),
        keyboard: false,
      });
      marker.on("click", () => toggleRef.current(mitra.name, mitra.coords));
      marker.addTo(group);
    });

    group.addTo(map);
    return () => {
      map.removeLayer(group);
    };
  }, [selected]);

  return (
    <section className="w-full bg-[#521c67] py-14 px-4 md:px-8 font-sans">
      <style dangerouslySetInnerHTML={{ __html: `${pulseKeyframes}\n${lineFlowKeyframes}` }} />

      {/* Main Section Header */}
      <div className="text-center mb-8">
        <span className="text-xs md:text-sm font-bold text-[#f3c246] tracking-widest uppercase">
          JARINGAN
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-1">
          Mitra & Kolaborasi
        </h2>
        <p className="text-xs md:text-sm text-gray-200 mt-2 font-normal">
          Terhubung dengan berbagai mitra untuk menjadi bagian perubahan
        </p>
      </div>

      {/* Main White Card Container */}
      <div className="max-w-6xl mx-auto bg-white rounded-[2rem] p-5 md:p-8 shadow-xl">

        {/* Card Internal Header */}
        <div className="mb-4">
          <h3 className="text-lg md:text-2xl font-black text-[#e5a000]">
            Jaringan Sebaran Mitra
          </h3>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">
            Pusat koordinasi dan garis hubungan ke setiap mitra lapangan
          </p>
        </div>

        {/* Map Container */}
        <div className="w-full h-[320px] md:h-[480px] rounded-2xl overflow-hidden border-2 border-gray-100 shadow-inner">
          <div ref={containerRef} className="w-full h-full mitra-line" style={{ height: "100%", width: "100%" }} />
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 bg-[#f3c246] rounded-full border border-white shadow-sm inline-block animate-pulse" />
            <span className="font-semibold text-gray-600">Omah Nalar (Pusat)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 bg-[#132c63] rounded-full border border-white shadow-sm inline-block" />
            <span className="font-semibold text-gray-600">Titik Mitra Aktif</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-0 border-t-2 border-dashed border-[#132c63] inline-block" />
            <span className="font-semibold text-gray-600">Alur Koordinasi Program</span>
          </div>
        </div>

        {/* Partner Buttons Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {daftarMitra.map((mitra, idx) => {
            const isActive = selected === mitra.name;
            return (
              <button
                key={idx}
                onClick={() => toggleSelect(mitra.name, mitra.coords)}
                className={`group relative text-left rounded-2xl p-3.5 border-2 transition-all duration-300 cursor-pointer flex items-center justify-between ${
                  isActive
                    ? "border-[#f3c246] bg-[#132c63] text-white shadow-md scale-[1.01]"
                    : "border-transparent bg-[#f3ece0] text-gray-800 hover:bg-[#eae1d2] hover:scale-[1.01]"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 pr-4">
                  <span
                    className={`w-3.5 h-3.5 rounded-full shrink-0 transition-all ${
                      isActive ? "bg-[#f3c246]" : "bg-[#132c63]"
                    }`}
                  />
                  <div className="min-w-0">
                    <p className={`text-xs md:text-sm font-extrabold leading-tight truncate ${
                      isActive ? "text-white" : "text-gray-900"
                    }`}>
                      {mitra.name}
                    </p>
                    <p className={`text-[10px] md:text-xs mt-0.5 truncate ${
                      isActive ? "text-gray-200" : "text-gray-600"
                    }`}>
                      {mitra.info}
                    </p>
                  </div>
                </div>

                {/* Badge checklist untuk kartu yang aktif */}
                {isActive && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#f3c246] rounded-full flex items-center justify-center shadow-md">
                    <svg className="w-3 h-3 text-[#132c63]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
