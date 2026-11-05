"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";
import { getTheme, useTheme } from "../../molecules/theme-switch";
import type { LightTheme } from "./palette";
import { startRenderer, type LightForm } from "./renderer";
import "./living-light.css";

export type LivingLightProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  form?: LightForm;
  /** Pins a colourway for a nested tone. By default the light follows the page's theme. */
  theme?: LightTheme;
  /** 0 to 1. Settles the light towards its base colour low down, behind text. */
  calm?: number;
  grain?: number;
  speed?: number;
};

export function LivingLight({ form = "ridge", theme, calm = 0, grain = 0.12, speed = 1, className, ...rest }: LivingLightProps) {
  const pageTheme = useTheme();
  const root = useRef<HTMLDivElement>(null);
  const renderer = useRef<ReturnType<typeof startRenderer>>(null);
  const seed = useRef(0);
  const classes = className ? `mk-living-light ${className}` : "mk-living-light";

  // A fresh canvas per mount, because a released context can't be used again.
  useEffect(() => {
    const canvas = document.createElement("canvas");
    root.current?.append(canvas);
    seed.current = Math.random();
    renderer.current = startRenderer(canvas, { form, theme: theme ?? getTheme(), calm, grain, speed, seed: seed.current });

    return () => {
      renderer.current?.stop();
      renderer.current = null;
      canvas.remove();
    };
    // Later prop changes go through update() below, without rebuilding the context.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    renderer.current?.update({ form, theme: theme ?? pageTheme, calm, grain, speed, seed: seed.current });
  }, [form, theme, pageTheme, calm, grain, speed]);

  return <div ref={root} className={classes} data-theme={theme} aria-hidden="true" {...rest} />;
}
