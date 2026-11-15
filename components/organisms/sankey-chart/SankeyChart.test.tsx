import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { layoutSankey } from "./layout";
import { SankeyChart } from "./SankeyChart";

afterEach(cleanup);

const nodes = [
  { id: "income", name: "Income" },
  { id: "sales", name: "Sold positions" },
  { id: "portfolio", name: "Portfolio" },
  { id: "ai", name: "AI compute", highlight: true },
  { id: "power", name: "Power" },
  { id: "cash", name: "Cash" },
];
const links = [
  { source: "income", target: "portfolio", value: 60 },
  { source: "sales", target: "portfolio", value: 40 },
  { source: "portfolio", target: "ai", value: 50 },
  { source: "portfolio", target: "power", value: 30 },
  { source: "portfolio", target: "cash", value: 20 },
];
const chart = <SankeyChart title="Money" label="Where this year's money went" nodes={nodes} links={links} format={(v) => `${v}%`} />;

describe("layoutSankey", () => {
  it("puts each node in the column of its longest path, and sizes nodes by their flow", () => {
    const laid = layoutSankey(nodes, links, 400, 200, 10, 10);
    const col = (id: string) => laid.nodes.find((n) => n.id === id)!.column;
    const h = (id: string) => laid.nodes.find((n) => n.id === id)!.height;

    expect([col("income"), col("portfolio"), col("ai")]).toEqual([0, 1, 2]);
    expect(h("portfolio")).toBeCloseTo(h("income") + h("sales"), 5);
  });

  it("stacks flows so their widths add up at each node", () => {
    const laid = layoutSankey(nodes, links, 400, 200, 10, 10);
    const into = laid.links.filter((l) => l.target === "portfolio").reduce((s, l) => s + l.width, 0);

    expect(into).toBeCloseTo(laid.nodes.find((n) => n.id === "portfolio")!.height, 5);
  });
});

describe("SankeyChart", () => {
  it("tints each flow by where it lands, the subject in the accent and upstream in grey", () => {
    const { container } = render(chart);
    const flows = [...container.querySelectorAll<SVGPathElement>(".mk-sankey-flow")];

    expect(flows.filter((f) => f.style.color === "var(--mk-color-dataviz-accent)")).toHaveLength(1);
    expect(flows.filter((f) => f.hasAttribute("data-upstream"))).toHaveLength(2);
  });

  it("reads each flow by keyboard, with its share of the source", () => {
    render(chart);
    const plot = screen.getByRole("group", { name: "Where this year's money went" });

    act(() => plot.focus());
    fireEvent.keyDown(plot, { key: "End" });
    expect(screen.getByText(/^Portfolio to Cash\. 20%, 20% of Portfolio\.$/)).toBeTruthy();
  });

  it("labels nodes with their totals, and passes axe", async () => {
    const { container } = render(chart);

    expect([...container.querySelectorAll(".mk-sankey-label")].map((t) => t.textContent)).toContain("50% AI compute");
    expect((await axe.run(container)).violations).toEqual([]);
  });
});
