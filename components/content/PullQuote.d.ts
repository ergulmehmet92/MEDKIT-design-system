import React from "react";

export interface PullQuoteProps {
  children: React.ReactNode;
  /** Attribution line under the quote. */
  source?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Editorial excerpt with the 3px accent rule — large light quote plus a
 * quiet source line. Follows the active domain --accent.
 */
export function PullQuote(props: PullQuoteProps): React.ReactElement;
