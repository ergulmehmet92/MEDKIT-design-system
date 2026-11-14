import type { ReactNode } from "react";
import "./card.css";

export type CardMediaProps = {
  src?: string;
  /** Empty when the title already says what the picture shows. */
  alt?: string;
  ratio?: "16:9" | "9:16" | "4:3";
  /** A duration such as "18:42" or "1:04:18", shown on the picture as text. */
  duration?: string;
};

/** "18:42" → "PT18M42S", for the time element's datetime. */
export function isoDuration(text: string): string {
  const parts = text.split(":").map(Number);
  const [h, m, s] = parts.length === 3 ? parts : [0, ...parts];
  return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}${s || (!h && !m) ? `${s}S` : ""}`;
}

/** The picture slot. It keeps its ratio, and a missing picture keeps the frame. */
export function CardMedia({ src, alt = "", ratio = "16:9", duration }: CardMediaProps) {
  return (
    <div className="mk-card-media" data-ratio={ratio} data-missing={src ? undefined : ""}>
      {src ? (
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      ) : (
        <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">
          <rect x="6" y="9" width="28" height="22" rx="3" />
          <circle cx="15" cy="17" r="3" />
          <path d="M8 29l9-8 6 5 4-3 7 6" />
        </svg>
      )}
      {duration ? (
        <span className="mk-card-duration">
          <span className="mk-card-hidden">Duration </span>
          <time dateTime={isoDuration(duration)}>{duration}</time>
        </span>
      ) : null}
    </div>
  );
}

export type CardProps = {
  title: ReactNode;
  /** The card's one link. The whole card is its target. */
  href: string;
  titleAs?: "h2" | "h3" | "h4";
  media?: ReactNode;
  /** A short line above the title in the label face: a date, a kind, a duration. */
  meta?: ReactNode;
  summary?: ReactNode;
  /** Anything else in the body, such as a list or an outcome. Never interactive. */
  children?: ReactNode;
  /** Static chips and badges. Never interactive. */
  foot?: ReactNode;
  className?: string;
};

/**
 * One glass surface with slots, from the Cards board. The title is the card's only link and covers
 * the whole card, so it is one tab stop with one name; nothing else inside may be interactive.
 */
export function Card({ title, href, titleAs: Title = "h3", media, meta, summary, children, foot, className }: CardProps) {
  return (
    <article className={className ? `mk-card ${className}` : "mk-card"}>
      {media}
      <div className="mk-card-body">
        <Title className="mk-card-title">
          <a href={href}>{title}</a>
        </Title>
        {meta ? <p className="mk-card-meta">{meta}</p> : null}
        {summary ? <p className="mk-card-summary">{summary}</p> : null}
        {children}
        {foot ? <div className="mk-card-foot">{foot}</div> : null}
      </div>
    </article>
  );
}

/** A date as a real time element: "2 Nov 2026". */
export function CardDate({ date }: { date: Date }) {
  const iso = date.toISOString().slice(0, 10);
  return <time dateTime={iso}>{date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}</time>;
}
