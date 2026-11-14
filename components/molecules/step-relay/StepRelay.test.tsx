import { cleanup, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it } from "vitest";
import { StepRelay } from "./StepRelay";

afterEach(cleanup);

const steps = ["What is the problem?", "Why does it exist?", "How can I communicate it to a user?", "What is the optimal experience?"].map((title) => ({ title }));

describe("StepRelay", () => {
  it("is an ordered list of steps, with the numbers and batons hidden from screen readers", () => {
    const { container } = render(<StepRelay steps={steps} />);

    expect(screen.getAllByRole("listitem").map((li) => li.querySelector(".mk-step-relay-title")?.textContent)).toEqual(steps.map((s) => s.title));
    expect(container.querySelectorAll(".mk-step-relay-baton")).toHaveLength(4);
    expect(container.querySelector(".mk-step-relay-number")?.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelector(".mk-step-relay-ruler")).toBeNull();
  });

  it("draws a ruler and marker when vertical, and lights one step at a time", () => {
    const { container } = render(<StepRelay orientation="vertical" steps={steps.map((s) => ({ ...s, description: "Why it matters." }))} />);

    expect(container.querySelector(".mk-step-relay-ruler")?.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelector(".mk-step-relay-marker")).toBeTruthy();
    expect(container.querySelectorAll(".mk-step-relay-baton")).toHaveLength(0);
    expect(container.querySelectorAll("li[data-current]").length).toBeLessThanOrEqual(1);
  });

  it("holds still for reduced motion, and paces the baton at two seconds a step", () => {
    const css = readFileSync("components/molecules/step-relay/step-relay.css", "utf8");
    expect(css).toMatch(/prefers-reduced-motion: reduce[\s\S]*\.mk-step-relay-baton \{\s*animation: none/);
    expect(css).toContain("calc(var(--mk-relay-steps) * 2s)");
  });

  it("passes axe in both orientations", async () => {
    const { container } = render(
      <>
        <StepRelay steps={steps} />
        <StepRelay orientation="vertical" steps={steps} />
      </>,
    );
    expect((await axe.run(container)).violations).toEqual([]);
  });
});
