import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import "./tabs.css";

export type Tab = { id: string; label: ReactNode; panel: ReactNode };

export type TabsProps = {
  /** Names the tab list. */
  label: string;
  tabs: Tab[];
  defaultSelected?: string;
  /** Controlled selection. Pass with `onSelectedChange`. */
  selected?: string;
  onSelectedChange?: (id: string) => void;
  /** Automatic selects as focus moves; manual waits for Enter or Space, for panels that are slow to show. */
  activation?: "automatic" | "manual";
  className?: string;
};

/**
 * Tabs in the WAI-ARIA pattern: one tab stop, arrow keys between tabs, Home and End. The selected
 * tab is a Lens body with an underline, never colour alone. Narrow lists scroll sideways.
 */
export function Tabs({ label, tabs, defaultSelected, selected: controlled, onSelectedChange, activation = "automatic", className }: TabsProps) {
  const base = useId();
  const [uncontrolled, setUncontrolled] = useState(defaultSelected ?? tabs[0]?.id);
  const selected = controlled ?? uncontrolled;
  const list = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: false, end: false });

  const select = (id: string) => {
    if (controlled === undefined) setUncontrolled(id);
    onSelectedChange?.(id);
  };

  const focusTab = (index: number) => {
    const target = tabs[(index + tabs.length) % tabs.length];
    list.current?.querySelector<HTMLButtonElement>(`[data-tab="${CSS.escape(target.id)}"]`)?.focus();
    if (activation === "automatic") select(target.id);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const next = { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 }[event.key];
    if (next !== undefined) focusTab(index + next);
    else if (event.key === "Home") focusTab(0);
    else if (event.key === "End") focusTab(tabs.length - 1);
    else return;
    event.preventDefault();
  };

  // Keep the selected tab in view, and fade whichever edge has more tabs past it.
  useEffect(() => {
    const node = list.current;
    if (!node) return;
    const measure = () => {
      const start = node.scrollLeft > 1;
      const end = node.scrollLeft + node.clientWidth < node.scrollWidth - 1;
      setEdges((e) => (e.start === start && e.end === end ? e : { start, end }));
    };
    // Scroll the list itself, never the page.
    const tab = node.querySelector<HTMLElement>('[aria-selected="true"]');
    if (tab && (tab.offsetLeft < node.scrollLeft || tab.offsetLeft + tab.offsetWidth > node.scrollLeft + node.clientWidth)) {
      node.scrollLeft = tab.offsetLeft - (node.clientWidth - tab.offsetWidth) / 2;
    }
    measure();
    node.addEventListener("scroll", measure, { passive: true });
    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(measure) : null;
    observer?.observe(node);
    return () => {
      node.removeEventListener("scroll", measure);
      observer?.disconnect();
    };
  }, [selected]);

  const current = tabs.find((t) => t.id === selected) ?? tabs[0];

  return (
    <div className={className ? `mk-tabs ${className}` : "mk-tabs"}>
      <div
        ref={list}
        className="mk-tabs-list"
        role="tablist"
        aria-label={label}
        data-fade-start={edges.start ? "" : undefined}
        data-fade-end={edges.end ? "" : undefined}
      >
        {tabs.map((tab, i) => {
          const on = tab.id === current?.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              className="mk-tab"
              data-tab={tab.id}
              id={`${base}-tab-${tab.id}`}
              aria-selected={on}
              aria-controls={`${base}-panel-${tab.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => select(tab.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {current ? (
        <div className="mk-tabs-panel" role="tabpanel" id={`${base}-panel-${current.id}`} aria-labelledby={`${base}-tab-${current.id}`} tabIndex={0}>
          {current.panel}
        </div>
      ) : null}
    </div>
  );
}
