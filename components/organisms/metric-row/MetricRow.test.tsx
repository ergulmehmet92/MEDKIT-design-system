import { readFileSync } from "node:fs";
import { cleanup, render } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { Metric } from "../../molecules/metric";
import { MetricRow } from "./MetricRow";

afterEach(cleanup);

describe("MetricRow", () => {
  it.each([1, 2, 3, 4])("holds %i metrics as a valid description list", async (count) => {
    const { container } = render(
      <MetricRow>
        {Array.from({ length: count }, (_, i) => (
          <Metric key={i} value={String(i)} label={`Label ${i}`} />
        ))}
      </MetricRow>,
    );

    expect(container.querySelectorAll("dl dd")).toHaveLength(count);
    expect((await axe.run(container)).violations).toEqual([]);
  });

  it("fits as many columns as the width allows, without overflowing", () => {
    const css = readFileSync("components/organisms/metric-row/metric-row.css", "utf8");

    expect(css).toContain("repeat(auto-fit, minmax(min(11.25rem, 100%), 1fr))");
  });
});
