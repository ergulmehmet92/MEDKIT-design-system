import type { ReactNode } from "react";
import "./pull-quote.css";

export type PullQuoteProps = {
  /** The quote, without quotation marks. */
  children: ReactNode;
  /** Who said it, or where it's from. */
  attribution?: ReactNode;
  /** A second line for the attribution, such as a role or a date. */
  source?: ReactNode;
  /** Defaults by length: a few words are large, a paragraph is smaller. */
  size?: "short" | "medium" | "long";
  /** The quote's source address, for the blockquote's cite. */
  cite?: string;
  className?: string;
};

const sizeFor = (children: ReactNode): "short" | "medium" | "long" => {
  const text = typeof children === "string" ? children : "";
  if (!text) return "medium";
  if (text.length <= 28) return "short";
  return text.length > 140 ? "long" : "medium";
};

/** A quote set in type alone: no marks, no shapes. Three sizes, from a few words to a paragraph. */
export function PullQuote({ children, attribution, source, size, cite, className }: PullQuoteProps) {
  return (
    <figure className={className ? `mk-pull-quote ${className}` : "mk-pull-quote"} data-size={size ?? sizeFor(children)}>
      <blockquote cite={cite}>
        <p>{children}</p>
      </blockquote>
      {attribution ? (
        <figcaption>
          <span className="mk-pull-quote-who">{attribution}</span>
          {source ? <span>{source}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
