"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ShoppingCart, Play } from "lucide-react";
import { getProductBySlug, type Product, type ProductImage } from "@/services/products";
import { transformImageUrl } from "@/lib/image";
import { getVideoEmbedUrl } from "@/lib/video";
import { useLanguage } from "@/contexts/LanguageContext";
import { id, en } from "@/data/translations";

function getThumbnail(image_url: ProductImage[]): string | null {
  const thumb = image_url.find((img) => img.is_thumbnail);
  const url = thumb?.url || image_url[0]?.url || null;
  return url ? transformImageUrl(url) : null;
}

export default function ProdukDetail() {
  const router = useRouter();
  const params = useParams();
  const { locale } = useLanguage();
  const t = locale === "id" ? id.produk : en.produk;
  const common = locale === "id" ? id.common : en.common;
  const [produk, setProduk] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const slug = params?.slug as string;
    if (!slug) return;
    getProductBySlug(slug)
      .then(setProduk)
      .catch(() => setProduk(null))
      .finally(() => setLoading(false));
  }, [params?.slug]);

  const handleWhatsApp = () => {
    if (!produk?.whatsapp_number) return;
    const msg = encodeURIComponent(`${t.whatsappMsg} ${produk.name}`);
    const num = produk.whatsapp_number.startsWith("0")
      ? "62" + produk.whatsapp_number.slice(1)
      : produk.whatsapp_number;
    window.open(`https://wa.me/${num}?text=${msg}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-page-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#4D455D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!produk) {
    return (
      <div className="min-h-screen bg-page-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-brand-900">{t.notFound}</h2>
          <button onClick={() => router.push("/produk")} className="mt-4 px-5 py-2 bg-brand-900 text-white rounded-xl text-sm">
            {common.back}
          </button>
        </div>
      </div>
    );
  }

  const images = produk.image_url.filter((img) => img.url);
  const thumb = getThumbnail(produk.image_url);

  return (
    <div className="min-h-screen bg-page-50 font-sans antialiased flex flex-col">
      <div className="max-w-6xl mx-auto w-full px-4 md:px-6 pt-24 md:pt-28">
        <button
          onClick={() => router.push("/produk")}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all text-brand-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> {t.backToAll}
        </button>
      </div>

      <div className="max-w-6xl mx-auto w-full px-4 md:px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-3">
            <div className="rounded-2xl overflow-hidden bg-gray-100 aspect-square shadow-sm">
              {images[selectedImage] ? (
                <img
                  src={transformImageUrl(images[selectedImage].url)}
                  alt={produk.name}
                  className="w-full h-full object-cover bg-gray-100"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <ShoppingCart className="w-16 h-16" />
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? "border-brand-900 shadow-sm" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={transformImageUrl(img.url)}
                      alt={`${produk.name} ${idx + 1}`}
                      className="w-full h-full object-cover bg-gray-100"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-extrabold text-brand-900 tracking-tight leading-tight">
              {produk.name}
            </h1>

            <p className="text-3xl font-bold text-brand-900 mt-4">
              Rp {produk.price.toLocaleString(locale === "id" ? "id-ID" : "en-US")}
            </p>

            <div className="mt-6 prose prose-sm max-w-none text-brand-700/80 leading-relaxed whitespace-pre-wrap">
              {produk.description}
            </div>

            {produk.video_url && getVideoEmbedUrl(produk.video_url) && (
              <div className="mt-6">
                <h3 className="text-sm font-bold text-brand-900 mb-3 flex items-center gap-2">
                  <Play className="w-4 h-4" /> Testimoni Pembeli
                </h3>
                <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
                  <iframe
                    src={getVideoEmbedUrl(produk.video_url)!}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            <div className="mt-auto pt-8">
              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-base rounded-xl transition-colors shadow-sm"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {t.whatsappBtn}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
