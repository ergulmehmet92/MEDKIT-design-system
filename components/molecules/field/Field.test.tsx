import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it } from "vitest";
import { Input } from "../../atoms/input";
import { Textarea } from "../../atoms/textarea";
import { Field } from "./Field";

afterEach(cleanup);

describe("Field", () => {
  it("ties a real label and hint to its control", () => {
    render(
      <Field label="Weight" hint="Between 0 and 10%">
        <Input inputMode="decimal" />
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: "Weight" });

    expect(input.getAttribute("aria-describedby")).toBe(screen.getByText("Between 0 and 10%").id);
    expect(input.getAttribute("aria-invalid")).toBe("false");
  });

  it("shows an app error at once, as a sentence the control points to", () => {
    render(
      <Field label="Weight" hint="Between 0 and 10%" error="Enter a weight between 0 and 10%.">
        <Input defaultValue="14" />
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: "Weight" });
    const message = screen.getByText("Enter a weight between 0 and 10%.");

    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")?.split(" ")).toContain(message.id);
    expect(message.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("waits until the field is used before showing the browser's check, and clears it once fixed", () => {
    render(
      <Field label="Ticker" invalidMessage="Enter a ticker.">
        <Input required />
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: "Ticker" }) as HTMLInputElement;

    expect(screen.queryByText("Enter a ticker.")).toBeNull();
    fireEvent.input(input, { target: { value: "" } });
    fireEvent.blur(input);
    expect(screen.getByText("Enter a ticker.")).toBeTruthy();
    expect(input.getAttribute("aria-invalid")).toBe("true");

    fireEvent.input(input, { target: { value: "NVDA" } });
    expect(screen.queryByText("Enter a ticker.")).toBeNull();
    expect(input.getAttribute("aria-invalid")).toBe("false");
  });

  it("shows the error for untouched fields after a failed submit", () => {
    render(
      <form>
        <Field label="Reason" invalidMessage="Say why, in a sentence or more.">
          <Textarea required />
        </Field>
      </form>,
    );
    fireEvent.invalid(screen.getByRole("textbox", { name: "Reason" }));
    expect(screen.getByText("Say why, in a sentence or more.")).toBeTruthy();
  });

  it("says optional, and passes axe with a hint and an error", async () => {
    const { container } = render(
      <>
        <Field label="Lapses" optional>
          <Input type="date" />
        </Field>
        <Field label="Reason" hint="Kept with the call." error="Say why.">
          <Textarea />
        </Field>
      </>,
    );
    expect(screen.getByText("optional")).toBeTruthy();
    expect((await axe.run(container)).violations).toEqual([]);
  });
});

describe("Input", () => {
  it("stands alone without a Field, and keeps its icon out of the accessible name", () => {
    render(<Input aria-label="Search tickers" icon={<svg />} />);
    const input = screen.getByRole("textbox", { name: "Search tickers" });

    expect(input.hasAttribute("aria-invalid")).toBe(false);
    expect(input.closest(".mk-input-affix")?.querySelector(".mk-input-icon")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("meets 44px in editorial density and keeps an edge in forced colours", () => {
    const css = readFileSync("components/atoms/input/input.css", "utf8");
    expect(css).toContain("min-block-size: var(--mk-size-control)");
    expect(css).toMatch(/forced-colors: active[\s\S]*border: 1px solid CanvasText/);
    expect(css).toContain(":user-invalid");
  });
});
