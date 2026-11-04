import { render, screen } from "@testing-library/react";
import { BrowserContent } from "./BrowserContent";

describe("BrowserContent", () => {
  it("renders published content in a sandboxed iframe with no script permission", () => {
    render(
      <BrowserContent
        html="<h1>Safe page</h1>"
        address="safe.zz"
        entryId="0123456789abcdef01234567"
        scrollY={0}
        onNavigate={jest.fn()}
        onBlockedLink={jest.fn()}
        onScroll={jest.fn()}
      />
    );
    const frame = screen.getByTitle("Published website: safe.zz");
    expect(frame).toHaveAttribute("sandbox", "allow-same-origin");
    expect(frame).not.toHaveAttribute("allow");
    expect(frame).toHaveAttribute("srcdoc", expect.stringContaining("default-src 'none'"));
  });
});
