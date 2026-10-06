"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { getProducts, type Product, type ProductImage } from "@/services/products";
import { transformImageUrl } from "@/lib/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { id, en } from "@/data/translations";

function getThumbnail(image_url: ProductImage[]): string | null {
  const thumb = image_url.find((img) => img.is_thumbnail);
  const url = thumb?.url || image_url[0]?.url || null;
  return url ? transformImageUrl(url) : null;
}

export default function ProdukPage() {
  const { locale } = useLanguage();
  const t = locale === "id" ? id.produk : en.produk;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full bg-white font-sans pb-20">

      {/* ================= HERO / TITLE SECTION ================= */}
      <section className="relative w-full py-16 px-6 md:px-12 text-center text-white overflow-hidden bg-gradient-to-r from-[#591662] via-[#721e7c] to-[#00296b] mt-16">

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-4">
          {/* Badge Outline */}
          <div className="px-5 py-1 rounded-full border border-white/80 text-xs font-semibold tracking-wider uppercase bg-white/10 backdrop-blur-sm">
            {t.badge}
          </div>

          {/* Title Utama */}
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            {t.title}
          </h1>

          {/* Subtitle */}
          <p className="text-white/90 text-sm md:text-base font-normal max-w-2xl">
            {t.desc}
          </p>

          {/* Garis Accent Kecil */}
          <div className="w-16 h-1 bg-[#f1e5cd] rounded-full mt-2" />
        </div>
      </section>

      {/* ================= CONTENT SECTION ================= */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 mt-10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#721e7c] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="bg-[#f1e5cd] border-2 border-[#721e7c] rounded-[2rem] p-12 text-center">
            <ShoppingCart className="w-12 h-12 mx-auto text-[#721e7c]/40 mb-3" />
            <p className="text-[#00296b]/80 text-sm font-medium">{t.empty}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((p, idx) => {
              const imgUrl = getThumbnail(p.image_url);

              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (idx % 3) * 0.1 }}
                  className="bg-[#f1e5cd] border-2 border-[#721e7c] rounded-[2rem] p-3 flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1 shadow-sm overflow-hidden"
                >
                  {/* Top Image Section */}
                  <div className="relative w-full aspect-[4/3] rounded-[1.5rem] overflow-hidden mb-4 bg-white">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={p.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[#721e7c]/30">
                        <ShoppingCart className="w-12 h-12" />
                      </div>
                    )}

                    {/* Soft Gradient Overlay (Bawah Image) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#f1e5cd] via-transparent to-transparent opacity-80" />
                  </div>

                  {/* Body Content */}
                  <div className="px-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-[#00296b] font-bold text-sm md:text-base leading-snug mb-2 line-clamp-2">
                        {p.name}
                      </h3>
                      <p className="text-[#00296b]/80 text-xs leading-relaxed mb-4 line-clamp-3 font-medium">
                        {p.description}
                      </p>
                    </div>

                    {/* Card Footer / Harga + Aksi */}
                    <div className="flex items-center justify-between pt-4 border-t border-[#721e7c]/10 mt-auto">
                      <span className="text-sm md:text-base font-extrabold text-[#721e7c]">
                        Rp {p.price.toLocaleString(locale === "id" ? "id-ID" : "en-US")}
                      </span>

                      {/* Arrow Action Button */}
                      <Link
                        href={`/produk/${p.slug}`}
                        className="w-7 h-7 bg-[#721e7c] rounded-full flex items-center justify-center text-white hover:bg-[#591662] transition-colors shrink-0"
                        aria-label={p.name}
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
