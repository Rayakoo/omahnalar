import { getAccessToken } from "@/lib/supabaseClient";

export type ProductImage = { url: string; is_thumbnail: boolean };

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  whatsapp_number: string;
  image_url: ProductImage[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateProductInput = {
  name: string;
  slug: string;
  description: string;
  price: number;
  whatsapp_number: string;
  image_url?: ProductImage[];
  is_published?: boolean;
};

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error("Supabase env vars not set");
  return { url, anonKey };
}

async function supabaseGet<T>(path: string): Promise<T> {
  const { url, anonKey } = getSupabaseConfig();
  const res = await fetch(`${url}${path}`, {
    headers: { apikey: anonKey },
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Supabase GET failed: ${res.status} ${errText}`);
  }
  return res.json();
}

export async function getProducts(includeAll?: boolean) {
  let path = `/rest/v1/products?select=*`;
  if (!includeAll) path += `&is_published=eq.true`;
  path += `&order=created_at.desc`;
  return supabaseGet<Product[]>(path);
}

export async function getProductBySlug(slug: string) {
  const data = await supabaseGet<Product[]>(
    `/rest/v1/products?select=*&slug=eq.${encodeURIComponent(slug)}`
  );
  if (!data || data.length === 0) throw new Error("Product not found");
  return data[0];
}

export async function getProductById(id: string) {
  const data = await supabaseGet<Product[]>(
    `/rest/v1/products?select=*&id=eq.${encodeURIComponent(id)}`
  );
  if (!data || data.length === 0) throw new Error("Product not found");
  return data[0];
}

export async function createProduct(input: CreateProductInput) {
  const payload = {
    name: input.name,
    slug: input.slug,
    description: input.description,
    price: input.price,
    whatsapp_number: input.whatsapp_number,
    image_url: input.image_url ?? [],
    is_published: input.is_published ?? false,
  };

  const { url, anonKey } = getSupabaseConfig();
  const token = getAccessToken();
  const res = await fetch(`${url}/rest/v1/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Supabase insert failed: ${res.status} ${errText}`);
  }
  const data: Product[] = await res.json();
  if (!data || data.length === 0) throw new Error("No data returned");
  return data[0];
}

export async function updateProduct(
  id: string,
  updates: Partial<Pick<Product, "name" | "slug" | "description" | "price" | "whatsapp_number" | "image_url" | "is_published">>
) {
  const { url, anonKey } = getSupabaseConfig();
  const token = getAccessToken();
  const res = await fetch(`${url}/rest/v1/products?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify({ ...updates, updated_at: new Date().toISOString() }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Supabase update failed: ${res.status} ${errText}`);
  }
  const data: Product[] = await res.json();
  if (!data || data.length === 0) throw new Error("No data returned");
  return data[0];
}

export async function deleteProduct(id: string) {
  const { url, anonKey } = getSupabaseConfig();
  const token = getAccessToken();
  const res = await fetch(`${url}/rest/v1/products?id=eq.${id}`, {
    method: "DELETE",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Supabase delete failed: ${res.status} ${errText}`);
  }
}
