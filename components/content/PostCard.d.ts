import React from "react";

export type PostTone = "editorial" | "content" | "craft" | "neutral";

export interface PostCardProps {
  title: string;
  excerpt?: string;
  /** Category eyebrow, tinted by `tone`. */
  category?: string;
  date?: string;
  /** e.g. "6 min read". */
  readingTime?: string;
  /** Image URL or CSS background. Omit for a typographic (no-media) card. */
  cover?: string;
  /** Accent applied to the category eyebrow. @default "editorial" */
  tone?: PostTone;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  style?: React.CSSProperties;
}

/**
 * Blog / writing card. Theme-aware — works on the dark index and a paper blog.
 *
 * @startingPoint section="Content" subtitle="Blog post card — category, title, excerpt, meta" viewport="420x420"
 */
export function PostCard(props: PostCardProps): React.ReactElement;
