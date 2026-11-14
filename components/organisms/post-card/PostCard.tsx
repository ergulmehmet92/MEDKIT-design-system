import { Chip } from "../../atoms/chip";
import { Card, CardDate, CardMedia } from "../../molecules/card";

export type PostCardProps = {
  title: string;
  href: string;
  published: Date;
  readingMinutes?: number;
  summary?: string;
  image?: string;
  tags?: string[];
  titleAs?: "h2" | "h3" | "h4";
};

/** An article: date and reading time, title, summary, and its tags. */
export function PostCard({ title, href, published, readingMinutes, summary, image, tags, titleAs }: PostCardProps) {
  return (
    <Card
      className="mk-post-card"
      title={title}
      href={href}
      titleAs={titleAs}
      media={image !== undefined ? <CardMedia src={image || undefined} /> : undefined}
      meta={
        <>
          <CardDate date={published} />
          {readingMinutes ? <span>{readingMinutes} min read</span> : null}
        </>
      }
      summary={summary}
      foot={tags?.map((t) => <Chip key={t}>{t}</Chip>)}
    />
  );
}
