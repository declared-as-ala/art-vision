import { parseContent, sanitizeHtml } from "@/lib/cms";

export function RichContent({
  contentJson,
  contentHtml,
  html,
}: {
  contentJson?: string;
  contentHtml?: string;
  html?: string;
}) {
  const safeHtml = html !== undefined
    ? sanitizeHtml(html)
    : parseContent(contentJson || "", contentHtml || "");

  return (
    <div
      className="cms-rich-content text-sm leading-7 text-white/80"
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
