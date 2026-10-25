import { getObject } from "@/lib/storage";

// Public, read-only proxy for uploaded images (only the uploads/ prefix is exposed).
export async function GET(_: Request, ctx: RouteContext<"/api/media/[...key]">) {
  const { key } = await ctx.params;
  const k = key.join("/");
  if (!k.startsWith("uploads/") || k.includes("..")) return new Response("Not found", { status: 404 });
  try {
    const o = await getObject(k);
    return new Response(o.body, {
      headers: {
        "Content-Type": o.type,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        ...(o.length ? { "Content-Length": String(o.length) } : {}),
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
