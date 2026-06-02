"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const createCustomIcon = (color: string, isCore: boolean) => {
  return new L.DivIcon({
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        <span style="
          background-color: ${color}; 
          width: ${isCore ? "20px" : "10px"}; 
          height: ${isCore ? "20px" : "10px"}; 
          border-radius: 50%; 
          display: inline-block; 
          border: 2px solid white;
          box-shadow: 0 0 8px rgba(0,0,0,0.4);
          ${isCore ? "animation: pulse-mitra 2s infinite;" : ""}
        "></span>
      </div>
    `,
    className: "custom-marker-icon",
    iconSize: isCore ? [20, 20] : [10, 10],
    iconAnchor: isCore ? [10, 10] : [5, 5],
  });
};

const pulseKeyframes = `
  @keyframes pulse-mitra {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(225, 29, 72, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(225, 29, 72, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(225, 29, 72, 0); }
  }
`;

const coreMalang: [number, number] = [-7.9839, 112.6214];
const coreBali: [number, number] = [-8.6500, 115.2167];

const daftarMitra: {
  name: string;
  coords: [number, number];
  core: [number, number];
  info: string;
}[] = [
  { name: "MI Nurul Huda 2", coords: [-7.9512, 112.6120], core: coreMalang, info: "Mitra Edukasi Dasar" },
  { name: "MTS Dzunnuroin", coords: [-7.9720, 112.6450], core: coreMalang, info: "Mitra Pembelajaran & Seminar" },
  { name: "MTS Taufiqiyah", coords: [-8.1120, 112.5620], core: coreMalang, info: "Mitra Sekolah Wilayah Kabupaten" },
  { name: "BEM FK UM", coords: [-7.9622, 112.6180], core: coreMalang, info: "Kemitraan Organisasi Mahasiswa" },
  { name: "HMD IKM UM", coords: [-7.9615, 112.6195], core: coreMalang, info: "Mitra Kesehatan Masyarakat" },
  { name: "FIK UM", coords: [-7.9630, 112.6165], core: coreMalang, info: "Fakultas Ilmu Keolahragaan UM" },
  { name: "Intrans", coords: [-7.9540, 112.6280], core: coreMalang, info: "Mitra Distribusi / Media" },
  { name: "Lensa", coords: [-7.9890, 112.6050], core: coreMalang, info: "Komunitas Kreatif Lokal" },
  { name: "SD Mojorejo 2", coords: [-7.8920, 112.5410], core: coreMalang, info: "Mitra Literasi & Buku Baca" },
  { name: "SMP Negeri 3 Singosari", coords: [-7.9010, 112.6650], core: coreMalang, info: "Sekolah Mitra Eksternal" },
  { name: "YPK Bali", coords: [-8.6740, 115.2530], core: coreBali, info: "Mitra Utama Gerakan Kemanusiaan Bali" },
];

export default function PetaMitraJaringan() {
  const center: [number, number] = [-8.3000, 113.9000];

  return (
    <div className="w-full bg-[#1A2332] p-4 md:p-6 rounded-2xl font-sans text-white relative shadow-lg border border-gray-800">
      <style dangerouslySetInnerHTML={{ __html: pulseKeyframes }} />

      <div className="mb-3">
        <h2 className="text-sm md:text-base font-bold tracking-wide text-[#F4C46B]">Jaringan Sebaran Mitra</h2>
        <p className="text-[10px] md:text-xs text-gray-400 mt-0.5">
          Pusat koordinasi dan garis hubungan ke setiap mitra lapangan
        </p>
      </div>

      <div className="w-full h-[300px] md:h-[450px] rounded-xl overflow-hidden border border-gray-700">
        <MapContainer
          center={center}
          zoom={8}
          className="w-full h-full"
          maxBounds={[
            [-9.5, 111.0],
            [-7.0, 116.5],
          ] as [[number, number], [number, number]]}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          <Marker position={coreMalang} icon={createCustomIcon("#E11D48", true)}>
            <Popup>
              <div className="text-gray-900 p-1">
                <h4 className="font-bold text-xs text-red-600">Core Region Malang</h4>
                <p className="text-[10px] text-gray-500 mt-0.5">Pusat Koordinasi Wilayah Jawa Timur</p>
              </div>
            </Popup>
          </Marker>

          <Marker position={coreBali} icon={createCustomIcon("#E11D48", true)}>
            <Popup>
              <div className="text-gray-900 p-1">
                <h4 className="font-bold text-xs text-red-600">Core Region Bali</h4>
                <p className="text-[10px] text-gray-500 mt-0.5">Hub Utama Jejaring Bali</p>
              </div>
            </Popup>
          </Marker>

          {daftarMitra.map((mitra, idx) => (
            <div key={idx}>
              <Polyline
                positions={[mitra.core, mitra.coords]}
                pathOptions={{
                  color: "#4FD1C5",
                  weight: 1.5,
                  opacity: 0.6,
                  dashArray: "4, 4",
                }}
              />
              <Marker position={mitra.coords} icon={createCustomIcon("#4FD1C5", false)}>
                <Popup>
                  <div className="text-gray-900 p-1">
                    <h4 className="font-bold text-xs text-teal-700">{mitra.name}</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">{mitra.info}</p>
                  </div>
                </Popup>
              </Marker>
            </div>
          ))}
        </MapContainer>
      </div>

      <div className="mt-3 md:mt-4 flex flex-wrap gap-3 md:gap-4 text-[10px] md:text-[11px] text-gray-400 border-t border-gray-800 pt-2.5 md:pt-3">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-red-500 rounded-full border border-white inline-block animate-pulse" />
          <span>Core Center</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-teal-400 rounded-full border border-white inline-block" />
          <span>Titik Mitra Aktif</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="border-t border-dashed border-teal-400 w-6 h-0 inline-block" />
          <span>Alur Koordinasi Program</span>
        </div>
      </div>
    </div>
  );
}
