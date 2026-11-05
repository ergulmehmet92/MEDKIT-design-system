import { readFileSync } from "node:fs";
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Metric } from "./Metric";

afterEach(cleanup);

describe("Metric", () => {
  it("ties the value to its label, with the label read first", () => {
    const { container } = render(
      <dl>
        <Metric value="12" label="weeks to production" />
      </dl>,
    );

    const parts = container.querySelector(".mk-metric")?.children;
    expect(parts?.[0].tagName).toBe("DT");
    expect(parts?.[0].textContent).toBe("weeks to production");
    expect(parts?.[1].tagName).toBe("DD");
    expect(parts?.[1].textContent).toBe("12");
  });

  it("shows the value above the label, and lets long values wrap", () => {
    const css = readFileSync("components/molecules/metric/metric.css", "utf8");

    expect(css).toMatch(/\.mk-metric-value \{[^}]*order: -1/);
    expect(css).toContain("overflow-wrap: anywhere");
  });
});
