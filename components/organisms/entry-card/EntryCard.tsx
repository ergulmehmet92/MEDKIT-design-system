import type { ReactNode } from "react";
import { Badge } from "../../atoms/badge";
import { Card, CardDate } from "../../molecules/card";
import "./entry-card.css";

export type EntryCardProps = {
  title: string;
  href: string;
  date: Date;
  /** What this entry added and removed, a line each. */
  added?: string[];
  removed?: string[];
  version?: string;
  /** A StatusPill, such as "Shipped". */
  status?: ReactNode;
  /** "Build log" by default; "Iteration" for a design iteration. */
  kind?: string;
  titleAs?: "h2" | "h3" | "h4";
};

/** A build-log entry or design iteration: what it added and removed, and the version it shipped in. */
export function EntryCard({ title, href, date, added = [], removed = [], version, status, kind = "Build log", titleAs }: EntryCardProps) {
  const changes = added.length + removed.length > 0;
  return (
    <Card
      className="mk-entry-card"
      title={title}
      href={href}
      titleAs={titleAs}
      meta={
        <>
          <span>{kind}</span>
          <CardDate date={date} />
        </>
      }
      foot={
        version || status ? (
          <>
            {version ? <Badge tone="version">{version}</Badge> : null}
            {status}
          </>
        ) : undefined
      }
    >
      {changes ? (
        <ul className="mk-entry-changes">
          {added.map((a) => (
            <li key={`+${a}`} data-change="added">
              <span className="mk-entry-hidden">Added: </span>
              {a}
            </li>
          ))}
          {removed.map((r) => (
            <li key={`-${r}`} data-change="removed">
              <span className="mk-entry-hidden">Removed: </span>
              {r}
            </li>
          ))}
        </ul>
      ) : null}
    </Card>
  );
}
