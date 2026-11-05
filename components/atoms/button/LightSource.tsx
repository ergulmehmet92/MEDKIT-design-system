"use client";

import { useEffect } from "react";
import { startLight } from "./light";

// Mount once, near the root of the page.
export function LightSource() {
  useEffect(() => startLight(), []);

  return null;
}
