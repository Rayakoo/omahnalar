export type BeholdPost = {
  id: string;
  imageUrl: string;
  postUrl: string;
  alt: string;
};

type BeholdSize = {
  width: number;
  height: number;
  mediaUrl: string;
};

type BeholdRawPost = {
  id: string;
  permalink?: string;
  mediaType?: string;
  prunedCaption?: string;
  caption?: string;
  sizes?: {
    small?: BeholdSize;
    medium?: BeholdSize;
    large?: BeholdSize;
  };
};

type BeholdFeed = {
  posts?: BeholdRawPost[];
};

const FEED_ID = "RaaRIGQ5MkDHHokTYtJB";

function toAlt(caption: string | undefined, fallback: string): string {
  if (!caption) return fallback;
  const firstLine = caption.split("\n").find((l) => l.trim().length > 0) || "";
  const clean = firstLine.trim();
  if (!clean) return fallback;
  return clean.length > 80 ? `${clean.slice(0, 77)}...` : clean;
}

export async function getBeholdPosts(limit = 6): Promise<BeholdPost[]> {
  const res = await fetch(`https://feeds.behold.so/${FEED_ID}`);
  if (!res.ok) throw new Error(`Behold feed error: ${res.status}`);
  const feed = (await res.json()) as BeholdFeed;
  const posts = Array.isArray(feed.posts) ? feed.posts : [];

  return posts
    .filter((p) => p.mediaType !== "VIDEO")
    .slice(0, limit)
    .map((p, idx) => ({
      id: p.id || `behold-${idx}`,
      imageUrl: p.sizes?.medium?.mediaUrl || p.sizes?.small?.mediaUrl || "",
      postUrl: p.permalink || "https://www.instagram.com/0mahnalar",
      alt: toAlt(p.prunedCaption || p.caption, "Postingan Instagram Omah Nalar"),
    }))
    .filter((p) => p.imageUrl.length > 0);
}
