"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { getProducts, deleteProduct, type Product } from "@/services/products";

export default function AdminProdukPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  useEffect(() => {
    getProducts(true)
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const displayed = products.filter((p) => {
    if (filter === "published") return p.is_published === true;
    if (filter === "draft") return p.is_published === false;
    return true;
  });

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Yakin ingin menghapus produk "${name}"?`)) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus");
    }
  };

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString("id-ID")}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#4D455D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#333333]">Kelola Produk</h1>
        <button onClick={() => router.push("/admin/produk/tambah")} className="px-5 py-2 text-sm font-semibold text-white bg-[#4D455D] hover:bg-[#3d364a] rounded-xl transition-colors shadow-sm">
          + Tambah Produk
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        {(["all", "published", "draft"] as const).map((f) => {
          const label = f === "all" ? "Semua Produk" : f === "published" ? "Terbit" : "Draft";
          const count = f === "all" ? products.length : f === "published" ? products.filter((p) => p.is_published).length : products.filter((p) => !p.is_published).length;
          return (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filter === f ? "bg-[#4D455D] text-white" : "bg-[#EBEAF6] text-[#4D455D] hover:bg-[#D9D7EC]"
              }`}>
              {label} ({count})
            </button>
          );
        })}
      </div>

      <div className="bg-[#EBEAF6] border border-[#D9D7EC] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D9D7EC]">
                <th className="p-5 text-sm font-bold text-[#333333] tracking-wider">Nama Produk</th>
                <th className="p-5 text-sm font-bold text-[#333333] tracking-wider">Harga</th>
                <th className="p-5 text-sm font-bold text-[#333333] tracking-wider">No. WhatsApp</th>
                <th className="p-5 text-sm font-bold text-[#333333] tracking-wider">Status</th>
                <th className="p-5 text-sm font-bold text-[#333333] tracking-wider text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1DFEF]">
              {displayed.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-sm text-gray-500">Belum ada produk.</td>
                </tr>
              ) : (
                displayed.map((p) => (
                  <tr key={p.id} className="hover:bg-[#E4E2F2]/50 transition-colors">
                    <td className="p-5 text-sm font-medium text-[#4D4D4D]">{p.name}</td>
                    <td className="p-5 text-sm font-medium text-[#4D4D4D]">{formatPrice(p.price)}</td>
                    <td className="p-5 text-sm font-medium text-[#4D4D4D]">{p.whatsapp_number}</td>
                    <td className="p-5">
                      <span className={`inline-block px-3 py-1 text-xs font-bold text-white rounded-full shadow-sm ${
                        p.is_published ? "bg-[#10A37F]" : "bg-[#E2A955]"
                      }`}>
                        {p.is_published ? "Terbit" : "Draft"}
                      </span>
                    </td>
                    <td className="p-5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => router.push(`/admin/produk/edit/${p.id}`)} className="px-4 py-1.5 text-xs font-semibold text-white bg-[#4D455D] hover:bg-[#3d364a] rounded-lg transition-colors shadow-sm">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(p.id, p.name)} className="p-1.5 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-colors" title="Hapus">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
