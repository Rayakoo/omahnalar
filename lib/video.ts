export function getVideoEmbedUrl(url: string): string | null {
  // YouTube watch
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

  // YouTube shorts
  const ytShorts = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (ytShorts) return `https://www.youtube.com/embed/${ytShorts[1]}`;

  // YouTube embed (already)
  const ytEmbed = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
  if (ytEmbed) return url;

  // Google Drive file
  const gdMatch = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/);
  if (gdMatch) return `https://drive.google.com/file/d/${gdMatch[1]}/preview`;

  // Google Drive share links with /d/ in path
  const gdSimple = url.match(/drive\.google\.com\/.*\/d\/([a-zA-Z0-9_-]+)/);
  if (gdSimple) return `https://drive.google.com/file/d/${gdSimple[1]}/preview`;

  return null;
}
