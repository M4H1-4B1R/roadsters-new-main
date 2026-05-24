// Parse a pasted video URL into something the gallery can render.
// Supports YouTube + Vimeo (iframe embed) and direct video files (mp4/webm/etc.).

export type ParsedVideo =
  | { kind: "youtube"; id: string; embedUrl: string; thumbnail: string }
  | { kind: "vimeo"; id: string; embedUrl: string; thumbnail: null }
  | { kind: "file"; src: string };

export function parseVideoUrl(raw: string): ParsedVideo | null {
  const url = raw?.trim();
  if (!url) return null;

  // YouTube: watch?v=, youtu.be/, /embed/, /shorts/  → 11-char id
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/
  );
  if (yt) {
    const id = yt[1];
    // autoplay+mute+loop+no-controls. loop on YouTube REQUIRES playlist=<same id>.
    const params = new URLSearchParams({
      autoplay: "1",
      mute: "1",
      controls: "0",
      loop: "1",
      playlist: id,
      playsinline: "1",
      rel: "0",
      modestbranding: "1",
      disablekb: "1",
    });
    return {
      kind: "youtube",
      id,
      embedUrl: `https://www.youtube.com/embed/${id}?${params}`,
      thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    };
  }

  // Vimeo: vimeo.com/123456 or player.vimeo.com/video/123456
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) {
    const id = vm[1];
    // background=1 = autoplay + muted + loop + no controls/UI (exactly what we want).
    return {
      kind: "vimeo",
      id,
      embedUrl: `https://player.vimeo.com/video/${id}?background=1`,
      thumbnail: null,
    };
  }

  // Anything else: treat as a direct video file (mp4/webm/mov/ogg,
  // e.g. a Pexels download link videos.pexels.com/.../file.mp4, Supabase Storage, etc.)
  return { kind: "file", src: url };
}
