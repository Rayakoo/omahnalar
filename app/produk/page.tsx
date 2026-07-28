"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
    <div className="min-h-screen bg-page-50 font-sans antialiased text-brand-900 flex flex-col">
      {/* Hero */}
      <div className="bg-brand-900 text-white py-14 md:py-20 px-6 mt-16 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-secondary-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-brand-100/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-brand-700/10 blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <span className="inline-block bg-secondary-500 text-brand-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
            {t.badge}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-secondary-500">
            {t.title}
          </h1>
          <p className="text-sm text-brand-100/70 mt-3 max-w-2xl mx-auto leading-relaxed">
            {t.desc}
          </p>
        </div>
      </div>

      {/* Grid */}
      <main className="max-w-6xl mx-auto w-full px-4 md:px-6 -mt-8 mb-16">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#4D455D] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm mt-12">
            <ShoppingCart className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-brand-700/60">{t.empty}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
            {products.map((p) => {
              const imgUrl = getThumbnail(p.image_url);

              return (
                <Link
                  key={p.id}
                  href={`/produk/${p.slug}`}
                  className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={p.name}
                        className="w-full h-full object-cover bg-gray-100 group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ShoppingCart className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-brand-900 leading-snug group-hover:text-brand-700 transition-colors line-clamp-2">
                        {p.name}
                      </h3>
                      <p className="text-xs text-brand-700/60 mt-2 line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                      <span className="text-base font-bold text-brand-900">
                        Rp {p.price.toLocaleString(locale === "id" ? "id-ID" : "en-US")}
                      </span>
                      <span className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center group-hover:bg-brand-900 group-hover:text-white transition-all shrink-0">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
