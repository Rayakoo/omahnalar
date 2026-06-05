import { getSupabase } from "@/lib/supabaseClient";

export type Story = {
  id: string;
  title: string;
  name: string;
  content: string;
  category: string | null;
  is_anonymous: boolean;
  created_at: string;
};

export type CreateStoryInput = {
  title: string;
  name: string;
  content: string;
  category: string;
  is_anonymous?: boolean;
};

export async function getStories() {
  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Story[];
}

export async function getStoriesPaginated(
  from: number,
  to: number
): Promise<{ data: Story[]; count: number | null }> {
  const { data, error, count } = await supabase
    .from("stories")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { data: data as Story[], count };
}

export async function createStory(input: CreateStoryInput) {
  const { data, error } = await supabase
    .from("stories")
    .insert({
      title: input.title,
      name: input.name,
      content: input.content,
      category: input.category,
      is_anonymous: input.is_anonymous ?? false,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Story;
}

export async function updateStory(
  id: string,
  updates: Partial<Pick<Story, "title" | "name" | "content" | "category" | "is_anonymous">>
) {
  const { data, error } = await supabase
    .from("stories")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Story;
}

export async function deleteStory(id: string) {
  const { error } = await getSupabase().from("stories").delete().eq("id", id);
  if (error) throw error;
}
