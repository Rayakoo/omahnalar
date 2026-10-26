// Metadata video testimoni ahli yang tersimpan di folder Google Drive Omah Nalar.
// Video tidak diunduh/disimpan ulang — hanya metadata yang ditampilkan, lalu
// diputar langsung dari Google Drive saat pengguna menekan tombol play.
//
// Sumber folder:
// https://drive.google.com/drive/folders/125iaR_Y8fc9IQRD7G_XiYPkKnIb_HA-m

export type VideoTestimonial = {
  id: string;
  title: string;
  fileName: string;
  modified: string;
};

export const VIDEO_TESTIMONIALS: VideoTestimonial[] = [
  {
    id: "1XLc4aa0T2EfwL3u55StrDlueOu8YBHWA",
    title: "Testimoni Prof. Dr. Choo Wan Yuen",
    fileName: "Testimoni Prof Claire.mov",
    modified: "25 Oktober 2026",
  },
  {
    id: "1PBLdFrV77Thpn7S7oSoRp4fQDMpZWnUh",
    title: "Testimoni Prof. Low",
    fileName: "Testimoni Prof Low.mov",
    modified: "25 Oktober 2026",
  },
  {
    id: "1Dya7JmjsZ9rjCWKQiST7PB9DPLA0nl_e",
    title: "Prof. Dr. Choo Wan Yuen",
    fileName: "Prof Claire.mov",
    modified: "19 Oktober 2026",
  },
  {
    id: "1_nO7XMOk75o09xIWftK-j7xG6RWJRfSa",
    title: "Prof. Low",
    fileName: "Prof Low.mov",
    modified: "19 Oktober 2026",
  },
];

export function getDrivePreviewUrl(id: string) {
  return `https://drive.google.com/file/d/${id}/preview`;
}

export function getDriveViewUrl(id: string) {
  return `https://drive.google.com/file/d/${id}/view`;
}

export function getDriveThumbnailUrl(id: string, width = 1000) {
  return `https://drive.google.com/thumbnail?id=${id}&sz=w${width}`;
}
