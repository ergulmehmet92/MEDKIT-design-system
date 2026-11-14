import { cleanup, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { PullQuote } from "../../molecules/pull-quote";
import { Footer } from "./Footer";

afterEach(cleanup);

const groups = [
  { title: "Work", links: [{ label: "Case studies", href: "/work" }, { label: "Build log", href: "/log" }] },
  { title: "Elsewhere", links: [{ label: "YouTube", href: "https://youtube.com" }] },
];

describe("Footer", () => {
  it("is the page's footer landmark, with a named link navigation", () => {
    render(<Footer name="Mehmet Ergul" thesis="Not the artifact." groups={groups} smallPrint={["© 2026 Mehmet Ergul", <a key="t" href="#top">Back to top</a>]} />);

    expect(screen.getByRole("contentinfo")).toBeTruthy();
    expect(screen.getByRole("navigation", { name: "Footer" })).toBeTruthy();
    expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual(["Work", "Elsewhere"]);
    expect(screen.getAllByRole("link")).toHaveLength(4);
  });

  it("passes axe", async () => {
    const { container } = render(<Footer name="Mehmet Ergul" groups={groups} />);
    expect((await axe.run(container)).violations).toEqual([]);
  });
});

describe("PullQuote", () => {
  it("is a blockquote in a figure, sized by its length", () => {
    const { container, rerender } = render(<PullQuote attribution="Mehmet Ergul">Not the artifact.</PullQuote>);
    expect(container.querySelector("figure blockquote p")?.textContent).toBe("Not the artifact.");
    expect(container.querySelector("figure")?.getAttribute("data-size")).toBe("short");
    expect(container.querySelector("figcaption")?.textContent).toBe("Mehmet Ergul");

    rerender(<PullQuote>{"A design system earns its keep when the second and third products need it more than the first did, and nobody on any of the three teams has to ask which green to use."}</PullQuote>);
    expect(container.querySelector("figure")?.getAttribute("data-size")).toBe("long");
    expect(container.querySelector("figcaption")).toBeNull();
  });

  it("passes axe", async () => {
    const { container } = render(<PullQuote attribution="Predictor" source="design principle">The gauge shows. The person decides.</PullQuote>);
    expect((await axe.run(container)).violations).toEqual([]);
  });
});
