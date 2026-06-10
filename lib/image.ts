function extractGoogleDriveId(url: string): string | null {
  const match =
    url.match(/\/file\/d\/([^/?#]+)/) ||
    url.match(/[?&]id=([^&]+)/) ||
    url.match(/\/d\/([^/?#]+)/);
  return match ? match[1] : null;
}

export function transformImageUrl(url: string): string {
  const id = extractGoogleDriveId(url);
  if (id) {
    const directUrl = `https://lh3.googleusercontent.com/d/${id}`;
    return `/api/image-proxy?url=${encodeURIComponent(directUrl)}`;
  }
  return url;
}
