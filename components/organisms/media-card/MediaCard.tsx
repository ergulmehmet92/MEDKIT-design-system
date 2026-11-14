import { Card, CardDate, CardMedia } from "../../molecules/card";

export type MediaCardProps = {
  title: string;
  href: string;
  /** Long-form is 16:9; a Short is 9:16. */
  format: "long" | "short";
  /** "18:42". Shown on the picture as text. */
  duration: string;
  thumbnail?: string;
  published?: Date;
  /** Where it lives: "YouTube". */
  source?: string;
  summary?: string;
  titleAs?: "h2" | "h3" | "h4";
};

/** A video: YouTube long-form at 16:9 or a Short at 9:16, with its duration on the picture. */
export function MediaCard({ title, href, format, duration, thumbnail, published, source = "YouTube", summary, titleAs }: MediaCardProps) {
  return (
    <Card
      className="mk-media-card"
      title={title}
      href={href}
      titleAs={titleAs}
      media={<CardMedia src={thumbnail} ratio={format === "short" ? "9:16" : "16:9"} duration={duration} />}
      meta={
        <>
          <span>{format === "short" ? "Short" : source}</span>
          {published ? <CardDate date={published} /> : null}
        </>
      }
      summary={format === "long" ? summary : undefined}
    />
  );
}
