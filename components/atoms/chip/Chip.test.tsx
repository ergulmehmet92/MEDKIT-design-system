import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Field } from "../../molecules/field";
import { Select } from "../select";
import { Chip } from "./Chip";

afterEach(cleanup);

describe("Chip", () => {
  it("is plain text when static", () => {
    const { container } = render(<Chip>Sample data</Chip>);
    expect(container.querySelector("span.mk-chip")?.textContent).toBe("Sample data");
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("toggles with aria-pressed, and shows a tick so the state isn't colour alone", () => {
    function Toggle() {
      const [on, setOn] = useState(false);
      return (
        <Chip pressed={on} onPressedChange={setOn}>
          Power
        </Chip>
      );
    }
    render(<Toggle />);
    const chip = screen.getByRole("button", { name: "Power" });

    expect(chip.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(chip);
    expect(chip.getAttribute("aria-pressed")).toBe("true");
    expect(chip.querySelector(".mk-chip-tick")).toBeTruthy();
  });

  it("removes with a named close button", () => {
    const onRemove = vi.fn();
    render(<Chip onRemove={onRemove}>Nuclear</Chip>);
    fireEvent.click(screen.getByRole("button", { name: "Remove Nuclear" }));
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it("passes axe in all three kinds", async () => {
    const { container } = render(
      <div>
        <Chip>12 positions</Chip>
        <Chip pressed onPressedChange={() => {}}>
          AI compute
        </Chip>
        <Chip onRemove={() => {}}>Cloud</Chip>
      </div>,
    );
    expect((await axe.run(container)).violations).toEqual([]);
  });
});

describe("Select", () => {
  const options = ["Buy", "Add", "Trim", "Sell"].map((o) => <option key={o}>{o}</option>);

  it("is a native select, wired by its Field", () => {
    render(
      <Field label="Call" hint="What you did">
        <Select>{options}</Select>
      </Field>,
    );
    const select = screen.getByRole("combobox", { name: "Call" });

    expect(select.tagName).toBe("SELECT");
    expect(select.getAttribute("aria-describedby")).toBe(screen.getByText("What you did").id);
    expect(select.parentElement?.querySelector(".mk-select-chevron")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("shows a required error after a failed submit, and passes axe", async () => {
    const { container } = render(
      <Field label="Call" invalidMessage="Choose a call.">
        <Select required defaultValue="">
          <option value="" disabled>
            Choose a call
          </option>
          {options}
        </Select>
      </Field>,
    );
    fireEvent.invalid(screen.getByRole("combobox"));
    expect(screen.getByText("Choose a call.")).toBeTruthy();
    expect((await axe.run(container)).violations).toEqual([]);
  });
});
