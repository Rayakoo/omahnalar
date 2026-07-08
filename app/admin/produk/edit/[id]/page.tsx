"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import { getProductById, updateProduct, type Product } from "@/services/products";
import RichTextEditor from "@/components/admin/RichTextEditor";
import FileUploader from "@/components/FileUploader";

type ImageInput = { url: string; is_thumbnail: boolean };

export default function EditProduk() {
  const router = useRouter();
  const params = useParams();
  const savingRef = useRef(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    whatsapp_number: "",
    is_published: false,
  });
  const [images, setImages] = useState<ImageInput[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = params?.id as string;
    if (!id) return;
    getProductById(id)
      .then((p: Product) => {
        setForm({
          name: p.name,
          slug: p.slug,
          description: p.description,
          price: p.price.toString(),
          whatsapp_number: p.whatsapp_number,
          is_published: p.is_published,
        });
        setImages(p.image_url.length > 0 ? p.image_url : [{ url: "", is_thumbnail: true }]);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Gagal memuat produk"))
      .finally(() => setLoading(false));
  }, [params?.id]);

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleNameChange = (name: string) => {
    update("name", name);
    update("slug", name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
  };

  const addImage = () => setImages((prev) => [...prev, { url: "", is_thumbnail: false }]);
  const removeImage = (idx: number) => {
    if (images.length <= 1) return;
    const next = images.filter((_, i) => i !== idx);
    if (images[idx].is_thumbnail && next.length > 0) next[0].is_thumbnail = true;
    setImages(next);
  };
  const updateImageUrl = (idx: number, url: string) => {
    const next = [...images];
    next[idx].url = url;
    setImages(next);
  };
  const setImageAsThumbnail = (idx: number) => {
    const next = images.map((img, i) => ({ ...img, is_thumbnail: i === idx }));
    setImages(next);
  };

  const handlePriceChange = (val: string) => {
    const digits = val.replace(/\D/g, "");
    const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    update("price", formatted);
  };

  const displayPrice = form.price ? `Rp ${parseInt(form.price).toLocaleString("id-ID")}` : "";

  const handleSubmit = async (publish: boolean) => {
    if (savingRef.current) return;
    if (!form.name || !form.description) {
      setError("Nama produk dan deskripsi harus diisi.");
      return;
    }
    const validImages = images.filter((i) => i.url.trim());
    setError("");
    setSaving(true);
    savingRef.current = true;

    try {
      await updateProduct(params?.id as string, {
        name: form.name,
        slug: form.slug,
        description: form.description,
        price: parseInt(form.price) || 0,
        whatsapp_number: form.whatsapp_number,
        image_url: validImages,
        is_published: publish,
      });
      router.push("/admin/produk");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan produk");
    } finally {
      setSaving(false);
      savingRef.current = false;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#4D455D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => router.push("/admin/produk")} className="p-2 rounded-lg hover:bg-[#EBEAF6] transition-colors">
          <ArrowLeft className="w-5 h-5 text-[#4D455D]" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Produk</h1>
      </div>

      <div className="max-w-3xl space-y-6">
        <div className="bg-[#EBEAF6]/60 border border-[#D9D7EC] rounded-2xl p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Produk <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#D9D7EC] rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi <span className="text-red-500">*</span></label>
            <RichTextEditor
              value={form.description}
              onChange={(v) => update("description", v)}
              placeholder="Tulis deskripsi produk di sini..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Harga <span className="text-red-500">*</span></label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500">Rp</span>
                <input
                  type="text"
                  value={displayPrice}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, "");
                    handlePriceChange(raw);
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#D9D7EC] rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-gray-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">No. WhatsApp <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.whatsapp_number}
                onChange={(e) => update("whatsapp_number", e.target.value)}
                className="w-full px-4 py-3 bg-white border border-[#D9D7EC] rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-gray-900"
              />
            </div>
          </div>

          {/* IMAGES */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-semibold text-gray-700">Foto Produk</label>
              <button type="button" onClick={addImage} className="text-[#4D455D] hover:text-[#3d364a]">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {images.map((img, idx) => (
              <div key={idx} className="flex items-start gap-2 mb-2">
                <input
                  type="url"
                  value={img.url}
                  onChange={(e) => updateImageUrl(idx, e.target.value)}
                  placeholder="https://drive.google.com/file/d/..."
                  className="flex-1 px-4 py-3 bg-white border border-[#D9D7EC] rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder-gray-400 text-sm text-gray-900"
                />
                <FileUploader onUploadComplete={(url) => updateImageUrl(idx, url)} />
                <button
                  type="button"
                  onClick={() => setImageAsThumbnail(idx)}
                  className={`shrink-0 px-2.5 py-3 rounded-xl text-xs font-bold transition-colors ${
                    img.is_thumbnail ? "bg-[#4D455D] text-white" : "bg-white border border-[#D9D7EC] text-gray-500 hover:border-[#4D455D]"
                  }`}
                  title="Jadikan thumbnail"
                >
                  {img.is_thumbnail ? "Thumbnail" : "Thumbnail?"}
                </button>
                <button type="button" onClick={() => removeImage(idx)} className="text-red-400 hover:text-red-600 mt-3">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <p className="text-[10px] text-gray-400 mt-1">Gambar pertama akan otomatis jadi thumbnail.</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 font-medium">{error}</div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={saving}
            className="flex items-center gap-1.5 px-6 py-2.5 text-sm font-semibold text-white bg-gray-500 hover:bg-gray-600 rounded-xl transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? "Menyimpan..." : "Simpan Draft"}
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={saving}
            className="flex items-center gap-1.5 px-6 py-2.5 text-sm font-semibold text-white bg-[#4D455D] hover:bg-[#3d364a] rounded-xl transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? "Menyimpan..." : "Terbitkan"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/produk")}
            className="px-6 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
