// True when a URL points to a video file (by extension). Works for disk
// (/uploads/x.mp4), Blob, and DB-backed (/api/media/<id>/<name>.mp4) URLs.
export function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|ogg|mov|m4v|avi|mkv)(\?|#|$)/i.test(url || "");
}
