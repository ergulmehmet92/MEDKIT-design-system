import { cleanup, render, screen, within } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { StatusPill } from "../status-pill";
import { CaseCard } from "../../organisms/case-card";
import { EntryCard } from "../../organisms/entry-card";
import { MediaCard } from "../../organisms/media-card";
import { PostCard } from "../../organisms/post-card";
import { Card, CardMedia, isoDuration } from "./Card";

afterEach(cleanup);

const day = (iso: string) => new Date(`${iso}T12:00:00Z`);

describe("Card", () => {
  it("is one link, on its title, with nothing else interactive", () => {
    render(<Card title="Not the artifact" href="/posts/not-the-artifact" meta="2 Nov 2026" summary="Why the system matters." foot={<span>Process</span>} />);
    const article = screen.getByRole("article");

    expect(within(article).getAllByRole("link")).toHaveLength(1);
    expect(within(article).getByRole("heading", { level: 3 }).textContent).toBe("Not the artifact");
    expect(within(article).getByRole("link").getAttribute("href")).toBe("/posts/not-the-artifact");
  });

  it("puts the title first in reading order, with the meta shown above it", () => {
    const { container } = render(<Card title="Title" href="#" meta="Meta" />);
    const body = container.querySelector(".mk-card-body")!;
    expect([...body.children].map((c) => c.className)).toEqual(["mk-card-title", "mk-card-meta"]);
  });

  it("keeps a missing picture's frame, and writes durations as time", () => {
    const { container } = render(<CardMedia ratio="9:16" duration="1:04:18" />);
    expect(container.querySelector(".mk-card-media")?.hasAttribute("data-missing")).toBe(true);
    expect(container.querySelector("time")?.getAttribute("datetime")).toBe("PT1H4M18S");
    expect(container.textContent).toBe("Duration 1:04:18");
  });

  it("converts durations to ISO 8601", () => {
    expect(isoDuration("18:42")).toBe("PT18M42S");
    expect(isoDuration("0:48")).toBe("PT48S");
    expect(isoDuration("2:00")).toBe("PT2M");
  });
});

describe("the cards", () => {
  it("MediaCard is 16:9 for long-form and 9:16 for a Short, without a format badge", () => {
    const { container } = render(
      <>
        <MediaCard title="I rebuilt my design system in public" href="#" format="long" duration="18:42" published={day("2026-11-11")} />
        <MediaCard title="One token, two densities" href="#" format="short" duration="0:48" />
      </>,
    );
    expect([...container.querySelectorAll(".mk-card-media")].map((m) => m.getAttribute("data-ratio"))).toEqual(["16:9", "9:16"]);
    expect(container.querySelector(".mk-badge")).toBeNull();
    expect(screen.getAllByRole("article")[1].querySelector(".mk-card-meta")?.textContent).toBe("Short");
  });

  it("PostCard and CaseCard use real dates and plain outcomes", () => {
    render(
      <>
        <PostCard title="Not the artifact" href="#" published={day("2026-11-02")} readingMinutes={7} tags={["Process"]} />
        <CaseCard title="Predictor" href="#" period="2025 to 2026" outcome="The gauge shows; the person decides." image="" />
      </>,
    );
    expect(screen.getByText("2 Nov 2026").getAttribute("datetime")).toBe("2026-11-02");
    expect(screen.getByText("The gauge shows; the person decides.").className).toBe("mk-case-outcome");
  });

  it("EntryCard says what was added and removed, in words too", () => {
    render(<EntryCard title="Controls land in the kit" href="#" date={day("2026-11-14")} added={["Input"]} removed={["Square fields"]} version="v2.0.0-alpha.4" status={<StatusPill status="live">Shipped</StatusPill>} />);
    expect(screen.getAllByRole("listitem").map((li) => li.textContent)).toEqual(["Added: Input", "Removed: Square fields"]);
    expect(screen.getByText("v2.0.0-alpha.4").getAttribute("data-tone")).toBe("version");
  });

  it("pass axe together", async () => {
    const { container } = render(
      <main>
        <MediaCard title="Living light, frame by frame" href="#a" format="long" duration="12:07" summary="Missing thumbnail." />
        <PostCard title="Fewer colours" href="#b" published={day("2026-10-19")} image="" summary="Missing image." />
        <CaseCard title="MED·Kit v2" href="#c" period="2026" tags={["Design system"]} />
        <EntryCard title="Blaze, from the palette" href="#d" date={day("2026-11-15")} added={["Blaze"]} />
      </main>,
    );
    expect((await axe.run(container)).violations).toEqual([]);
  });
});
