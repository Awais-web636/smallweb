import { extractSearchableText, sanitizePublishedHtml } from "./html-sanitizer";

describe("published HTML sanitization", () => {
  it("removes scripts, event handlers, dangerous URLs, and embedded active content", () => {
    const clean = sanitizePublishedHtml(
      '<h1 onclick="alert(1)">Hello</h1><script>alert("bad")</script><a href="javascript:alert(1)">bad link</a><iframe src="https://evil.example"></iframe>'
    );
    expect(clean).toContain("<h1>Hello</h1>");
    expect(clean).not.toMatch(/script|onclick|javascript:|iframe|alert/i);
  });

  it("keeps local .zz links and drops real-web destinations", () => {
    const clean = sanitizePublishedHtml('<a href="mountain.zz">local</a><a href="https://example.com">outside</a>');
    expect(clean).toContain('href="mountain.zz"');
    expect(clean).not.toContain("example.com");
  });

  it("extracts readable text without markup", () => {
    expect(extractSearchableText("<h1>Small web</h1><p>Read slowly.</p>")).toBe("Small web Read slowly.");
  });
});
