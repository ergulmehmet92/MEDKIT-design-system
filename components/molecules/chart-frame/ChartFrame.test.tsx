import { readFileSync } from "node:fs";
import { act, cleanup, fireEvent, render, renderHook, screen } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ChartFigure } from "./ChartFigure";
import { ChartPlot } from "./ChartPlot";
import { ChartTable } from "./ChartTable";
import { useCrosshair, useReveal } from "./hooks";
import { Legend } from "./Legend";
import { EventRail } from "./parts";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const css = () => readFileSync("components/molecules/chart-frame/chart-frame.css", "utf8");

const table = (
  <ChartTable
    caption="Portfolio at each month's end"
    columns={[{ label: "Month" }, { label: "Portfolio", numeric: true }]}
    rows={[
      { header: "Jan 2026", cells: ["111.3"] },
      { header: "Feb 2026", cells: ["116.3"] },
    ]}
  />
);

function Reader() {
  const values = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109];
  const reading = useCrosshair({ min: 0, max: 9, start: 9, indexAt: (x) => Math.round(x / 10), describe: (i) => `Day ${i + 1}. Portfolio ${values[i]}.` });
  const i = reading.index;
  return (
    <ChartPlot
      label="Portfolio, indexed to 100"
      reading={reading}
      crosshair={i == null ? null : { x: i * 10, top: 0, bottom: 100, tooltip: { title: `Day ${i + 1}`, rows: [{ value: String(values[i]), label: "Portfolio" }] } }}
    />
  );
}

describe("ChartFigure", () => {
  it("is a figure named by its title, with the chart showing first", () => {
    render(
      <ChartFigure title="The portfolio sits 8.2% below its peak" table={table}>
        <ChartPlot label="Portfolio" />
      </ChartFigure>,
    );

    expect(screen.getByRole("figure", { name: "The portfolio sits 8.2% below its peak" })).toBeTruthy();
    expect(screen.getByRole("img", { name: "Portfolio" })).toBeTruthy();
    expect(screen.queryByRole("table")).toBeNull();
  });

  it("switches to the table and back, in the same place", () => {
    render(
      <ChartFigure title="Portfolio" table={table}>
        <ChartPlot label="Portfolio" />
      </ChartFigure>,
    );

    fireEvent.click(screen.getByRole("button", { name: "View as table" }));
    expect(screen.getByRole("table", { name: "Portfolio at each month's end" })).toBeTruthy();
    expect(screen.queryByRole("img", { name: "Portfolio" })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "View as chart" }));
    expect(screen.getByRole("img", { name: "Portfolio" })).toBeTruthy();
  });

  it("passes axe in both views", async () => {
    const { container } = render(
      <ChartFigure title="Portfolio" legend={<Legend items={[{ label: "Portfolio", key: "line" }]} />} table={table} caption="Sample data">
        <ChartPlot label="Portfolio" />
      </ChartFigure>,
    );

    expect((await axe.run(container)).violations).toEqual([]);
    fireEvent.click(screen.getByRole("button", { name: "View as table" }));
    expect((await axe.run(container)).violations).toEqual([]);
  });
});

describe("keys on demand", () => {
  const figure = (keys?: "on-demand" | "shown") => (
    <ChartFigure title="Portfolio" keys={keys} legend={<Legend items={[{ label: "Portfolio", key: "line" }, { label: "S&P 500", key: "context" }]} />} table={table}>
      <ChartPlot label="Portfolio" />
    </ChartFigure>
  );

  it("hides the key until asked, and a Key button pins it open", () => {
    const { container } = render(figure());
    const fig = container.querySelector("figure")!;
    const key = screen.getByRole("button", { name: "Key" });

    expect(fig.getAttribute("data-keys")).toBe("on-demand");
    expect(key.getAttribute("aria-pressed")).toBe("false");
    expect(document.getElementById(key.getAttribute("aria-controls")!)?.textContent).toContain("S&P 500");

    fireEvent.click(key);
    expect(key.getAttribute("aria-pressed")).toBe("true");
    expect(fig.hasAttribute("data-pinned")).toBe(true);
  });

  it("shows the key from the start when asked to, with no Key button", () => {
    render(figure("shown"));

    expect(screen.queryByRole("button", { name: "Key" })).toBeNull();
    expect(screen.getByText("S&P 500")).toBeTruthy();
  });

  it("reveals the key on hover, keyboard focus or when pinned, in CSS", () => {
    expect(css()).toMatch(/\[data-keys="on-demand"\]:is\(:hover, :focus-within, \[data-pinned\]\) \.mk-chart-key/);
  });
});

describe("chart text", () => {
  it("uses the body face at the chart size, not the mono label face", () => {
    const plot = css().match(/\.mk-chart-plot \{[^}]*\}/)![0];

    expect(plot).toContain("var(--mk-font-family-body)");
    expect(plot).toContain("var(--mk-font-size-chart)");
    expect(css()).not.toMatch(/\.mk-chart-svg \{[^}]*text-transform: uppercase/);
  });
});

describe("ChartTable", () => {
  it("ties every value to its row and column, and its scroll area takes focus", () => {
    render(table);

    const region = screen.getByRole("region", { name: "Portfolio at each month's end" });
    expect(region.tabIndex).toBe(0);
    expect(screen.getAllByRole("columnheader").map((th) => th.textContent)).toEqual(["Month", "Portfolio"]);
    expect(screen.getAllByRole("rowheader").map((th) => th.textContent)).toEqual(["Jan 2026", "Feb 2026"]);
  });
});

describe("ChartPlot", () => {
  it("can be read by keyboard, announcing each point it lands on", () => {
    render(<Reader />);
    const plot = screen.getByRole("group", { name: "Portfolio, indexed to 100" });

    act(() => plot.focus());
    expect(screen.getByText("Day 10. Portfolio 109.")).toBeTruthy();

    fireEvent.keyDown(plot, { key: "ArrowLeft" });
    expect(screen.getByText("Day 9. Portfolio 108.")).toBeTruthy();

    fireEvent.keyDown(plot, { key: "ArrowLeft", shiftKey: true });
    expect(screen.getByText("Day 4. Portfolio 103.")).toBeTruthy();

    fireEvent.keyDown(plot, { key: "Home" });
    expect(screen.getByText("Day 1. Portfolio 100.")).toBeTruthy();

    fireEvent.keyDown(plot, { key: "ArrowLeft" });
    expect(screen.getByText("Day 1. Portfolio 100.")).toBeTruthy();
  });

  it("explains its keys, and hides the drawing and tooltip from assistive technology", () => {
    const { container } = render(<Reader />);
    const plot = screen.getByRole("group");

    expect(document.getElementById(plot.getAttribute("aria-describedby")!)?.textContent).toMatch(/arrow keys/);
    act(() => plot.focus());
    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelector(".mk-chart-tooltip")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("moves with Up and Down too, for charts read top to bottom", () => {
    render(<Reader />);
    const plot = screen.getByRole("group");

    act(() => plot.focus());
    fireEvent.keyDown(plot, { key: "ArrowUp" });
    expect(screen.getByText("Day 9. Portfolio 108.")).toBeTruthy();
    fireEvent.keyDown(plot, { key: "ArrowDown" });
    expect(screen.getByText("Day 10. Portfolio 109.")).toBeTruthy();
  });

  it("can show the tooltip without a crosshair line, at a given height", () => {
    const { container } = render(<ChartPlot label="Bars" crosshair={{ x: 10, top: 0, bottom: 100, line: false, anchorY: 40, tooltip: { title: "Grid", rows: [{ value: "5.1%", label: "This quarter" }] } }} />);

    expect(container.querySelector(".mk-chart-crosshair line")).toBeNull();
    expect((container.querySelector(".mk-chart-tooltip") as HTMLElement).style.transform).toContain("40px");
  });

  it("clears the crosshair on Escape", () => {
    const { container } = render(<Reader />);
    const plot = screen.getByRole("group");

    act(() => plot.focus());
    expect(container.querySelector(".mk-chart-tooltip")).toBeTruthy();
    fireEvent.keyDown(plot, { key: "Escape" });
    expect(container.querySelector(".mk-chart-tooltip")).toBeNull();
  });

  it("shows a message instead of an empty drawing", () => {
    const { container } = render(<ChartPlot label="Portfolio" empty="No data for this range yet." />);

    expect(screen.getByText("No data for this range yet.")).toBeTruthy();
    expect(container.querySelector("svg")).toBeNull();
  });
});

describe("Legend and events", () => {
  it("names each series in text, with decorative keys", () => {
    const { container } = render(<Legend items={[{ label: "Portfolio", key: "line" }, { label: "S&P 500", key: "context" }]} />);

    expect(screen.getAllByRole("listitem").map((li) => li.textContent)).toEqual(["Portfolio", "S&P 500"]);
    expect([...container.querySelectorAll("svg")].every((svg) => svg.getAttribute("aria-hidden") === "true")).toBe(true);
  });

  it("tells past and upcoming events apart by shape, and drops labels with no room", () => {
    const { container } = render(
      <svg>
        <EventRail
          events={[
            { id: "a", x: 10, label: "Rate decision", when: "past" },
            { id: "b", x: 20, label: "Earnings", when: "next" },
          ]}
          y={20}
          bottom={100}
          advance={8}
          limit={400}
        />
      </svg>,
    );

    expect([...container.querySelectorAll(".mk-chart-event")].map((g) => g.getAttribute("data-when"))).toEqual(["past", "next"]);
    expect(container.querySelectorAll(".mk-chart-event text")).toHaveLength(1);
  });
});

describe("motion", () => {
  it("shows a chart whole at once for visitors who ask for reduced motion", () => {
    vi.stubGlobal("matchMedia", (query: string) => ({ matches: query.includes("reduce"), addEventListener() {}, removeEventListener() {} }));

    const { result } = renderHook(() => useReveal(document.body));
    expect(result.current).toBe(1);
  });
});

describe("styles", () => {
  it("keeps dotted lines for forecasts only", () => {
    const dashes = [...css().replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}]+)\{[^}]*stroke-dasharray/g)].map((m) => m[1].trim());

    expect(dashes).toEqual(['&[data-forecast]']);
  });

  it("falls back to system colours in forced-colors mode", () => {
    expect(css()).toMatch(/@media \(forced-colors: active\) \{[\s\S]*\.mk-chart-line[\s\S]*CanvasText/);
  });

  it("reads semantic tokens only, never a primitive", () => {
    expect(css()).not.toMatch(/--mk-color-(viz|forest|honey|grey|signal|off-white|beige)/);
  });
});
