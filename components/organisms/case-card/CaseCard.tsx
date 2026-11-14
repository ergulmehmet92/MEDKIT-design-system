import { Chip } from "../../atoms/chip";
import { Card, CardMedia } from "../../molecules/card";
import "./case-card.css";

export type CaseCardProps = {
  title: string;
  href: string;
  /** "2025 to 2026". */
  period: string;
  summary?: string;
  /** One line on what changed, as plain text. */
  outcome?: string;
  image?: string;
  tags?: string[];
  titleAs?: "h2" | "h3" | "h4";
};

/** A project story: period, title, summary, the outcome in one line, and its tags. */
export function CaseCard({ title, href, period, summary, outcome, image, tags, titleAs }: CaseCardProps) {
  return (
    <Card
      className="mk-case-card"
      title={title}
      href={href}
      titleAs={titleAs}
      media={image !== undefined ? <CardMedia src={image || undefined} ratio="4:3" /> : undefined}
      meta={
        <>
          <span>Case study</span>
          <span>{period}</span>
        </>
      }
      summary={summary}
      foot={tags?.map((t) => <Chip key={t}>{t}</Chip>)}
    >
      {outcome ? <p className="mk-case-outcome">{outcome}</p> : null}
    </Card>
  );
}
