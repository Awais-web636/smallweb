import sanitizeHtml from "sanitize-html";

export function sanitizePublishedHtml(input: string): string {
  return sanitizeHtml(input, {
    allowedTags: [
      "a", "abbr", "article", "b", "blockquote", "br", "caption", "code", "dd", "del", "details",
      "div", "dl", "dt", "em", "figcaption", "figure", "h1", "h2", "h3", "h4", "hr", "i",
      "li", "main", "ol", "p", "pre", "section", "small", "span", "strong", "summary", "table",
      "tbody", "td", "th", "thead", "tr", "u", "ul"
    ],
    allowedAttributes: {
      a: ["href", "title"],
      "*": ["class", "colspan", "rowspan"]
    },
    allowedSchemes: ["http", "https"],
    allowedSchemesByTag: { a: ["http", "https"] },
    allowProtocolRelative: false,
    disallowedTagsMode: "discard",
    transformTags: {
      a: (_tagName, attributes) => {
        const href = attributes.href || "";
        const normalized = href.trim().toLowerCase();
        const internalAddress = normalized.replace(/^https?:\/\//, "").split(/[/?#]/)[0];
        const safeInternal = /^[a-z0-9][a-z0-9-]*\.zz$/.test(internalAddress);
        return {
          tagName: "a",
          attribs: safeInternal ? { href, title: attributes.title || "" } : {}
        };
      }
    }
  });
}

export function extractSearchableText(html: string): string {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}
