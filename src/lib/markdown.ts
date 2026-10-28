/**
 * Zero-dependency, lightweight and robust Markdown to Semantic HTML converter
 * tailored specifically for Art Visions blog articles.
 *
 * Supports:
 * - H2, H3, H4 headings
 * - Bold (**), Italic (*)
 * - Links [label](url)
 * - Blockquotes (> quote)
 * - Unordered lists (- item)
 * - Ordered lists (1. item)
 * - Markdown tables (| col | col |)
 * - Horizontal rules (---)
 * - Paragraph separation (\n\n)
 * - Seamless preservation of existing HTML tags (<p>, <div>, etc.)
 */

function formatInline(text: string): string {
  let out = text;

  // Code inline `code`
  out = out.replace(/`([^`]+)`/g, "<code class=\"px-1.5 py-0.5 rounded bg-brand-purple/20 text-brand-orange text-xs font-mono\">$1</code>");

  // Bold + italic ***text***
  out = out.replace(/\*\*\*([^*]+)\*\*\*/g, "<strong><em>$1</em></strong>");

  // Bold **text**
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  // Italic *text*
  out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");

  // Links [text](url)
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, href) => {
    const isInternal = href.startsWith("/") || href.startsWith("#");
    const attrs = isInternal
      ? ""
      : " target=\"_blank\" rel=\"noopener noreferrer\"";
    return `<a href="${href}" class="text-brand-orange hover:text-brand-magenta transition underline font-medium"${attrs}>${label}</a>`;
  });

  return out;
}

export function markdownToHtml(md: string): string {
  if (!md || typeof md !== "string") return "";

  // If already full HTML with <p> or <h2> tags and no markdown headings, return clean HTML
  const trimmed = md.trim();
  const hasHtmlTags = /<(p|h2|h3|ul|ol|table)\b/i.test(trimmed);
  const hasMarkdownHeadings = /^#{2,4}\s+/m.test(trimmed);
  const hasMarkdownLists = /^(\s*[-*]\s+|\s*\d+\.\s+)/m.test(trimmed);

  if (hasHtmlTags && !hasMarkdownHeadings && !hasMarkdownLists) {
    return trimmed;
  }

  // Normalize line breaks
  const lines = trimmed.replace(/\r\n/g, "\n").split("\n");
  const htmlBlocks: string[] = [];

  let inList: "ul" | "ol" | null = null;
  let inTable = false;
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];
  let paragraphLines: string[] = [];

  const flushParagraph = () => {
    if (paragraphLines.length > 0) {
      const pText = paragraphLines.join(" ").trim();
      if (pText) {
        htmlBlocks.push(`<p>${formatInline(pText)}</p>`);
      }
      paragraphLines = [];
    }
  };

  const flushList = () => {
    if (inList) {
      htmlBlocks.push(`</${inList}>`);
      inList = null;
    }
  };

  const flushTable = () => {
    if (inTable) {
      let tHtml = "<div class=\"overflow-x-auto my-6\"><table class=\"w-full border-collapse rounded-xl overflow-hidden text-sm\">";
      if (tableHeaders.length > 0) {
        tHtml += "<thead class=\"bg-brand-purple/30 text-white font-bold\"><tr>";
        for (const h of tableHeaders) {
          tHtml += `<th class="p-3 text-left border-b border-white/10">${formatInline(h)}</th>`;
        }
        tHtml += "</tr></thead>";
      }
      if (tableRows.length > 0) {
        tHtml += "<tbody class=\"divide-y divide-white/5\">";
        for (const row of tableRows) {
          tHtml += "<tr class=\"hover:bg-white/[0.02] transition\">";
          for (let i = 0; i < tableHeaders.length; i++) {
            const cell = row[i] || "";
            tHtml += `<td class="p-3 text-white/80 align-top">${formatInline(cell)}</td>`;
          }
          tHtml += "</tr>";
        }
        tHtml += "</tbody>";
      }
      tHtml += "</table></div>";
      htmlBlocks.push(tHtml);
      inTable = false;
      tableHeaders = [];
      tableRows = [];
    }
  };

  const flushAll = () => {
    flushParagraph();
    flushList();
    flushTable();
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Blank line
    if (!line) {
      flushAll();
      continue;
    }

    // Horizontal rule: --- or ***
    if (/^(\-{3,}|\*{3,})$/.test(line)) {
      flushAll();
      htmlBlocks.push("<hr class=\"my-8 border-white/10\" />");
      continue;
    }

    // Markdown Table row: | cell | cell |
    if (line.startsWith("|") && line.endsWith("|")) {
      flushParagraph();
      flushList();

      const cells = line
        .slice(1, -1)
        .split("|")
        .map((c) => c.trim());

      // Check if separator row like |:---|:---|
      const isSeparator = cells.every((c) => /^:?-+:?$/.test(c));
      if (isSeparator) {
        inTable = true;
        continue;
      }

      if (!inTable && tableHeaders.length === 0) {
        tableHeaders = cells;
        inTable = true;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Headings
    const h2Match = line.match(/^##\s+(.+)$/);
    if (h2Match) {
      flushAll();
      htmlBlocks.push(`<h2>${formatInline(h2Match[1])}</h2>`);
      continue;
    }

    const h3Match = line.match(/^###\s+(.+)$/);
    if (h3Match) {
      flushAll();
      htmlBlocks.push(`<h3>${formatInline(h3Match[1])}</h3>`);
      continue;
    }

    const h4Match = line.match(/^####\s+(.+)$/);
    if (h4Match) {
      flushAll();
      htmlBlocks.push(`<h4>${formatInline(h4Match[1])}</h4>`);
      continue;
    }

    // Blockquote: > text
    const bqMatch = line.match(/^>\s*(.+)$/);
    if (bqMatch) {
      flushAll();
      htmlBlocks.push(`<blockquote><p>${formatInline(bqMatch[1])}</p></blockquote>`);
      continue;
    }

    // Unordered list item: - item or * item
    const ulMatch = line.match(/^[-*]\s+(.+)$/);
    if (ulMatch) {
      flushParagraph();
      flushTable();
      if (inList !== "ul") {
        flushList();
        htmlBlocks.push("<ul>");
        inList = "ul";
      }
      htmlBlocks.push(`<li>${formatInline(ulMatch[1])}</li>`);
      continue;
    }

    // Ordered list item: 1. item
    const olMatch = line.match(/^\d+\.\s+(.+)$/);
    if (olMatch) {
      flushParagraph();
      flushTable();
      if (inList !== "ol") {
        flushList();
        htmlBlocks.push("<ol>");
        inList = "ol";
      }
      htmlBlocks.push(`<li>${formatInline(olMatch[1])}</li>`);
      continue;
    }

    // Plain HTML tags already present on this line (e.g. <p>, <div>, <section>)
    if (/^<[a-z][\s\S]*>/i.test(line)) {
      flushAll();
      htmlBlocks.push(line);
      continue;
    }

    // Normal paragraph text accumulator
    if (inList) flushList();
    if (inTable) flushTable();
    paragraphLines.push(line);
  }

  flushAll();

  return htmlBlocks.join("\n\n");
}
