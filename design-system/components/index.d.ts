import type * as React from 'react';

export type Status = 'done' | 'progress' | 'blocked' | 'planned';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = orange fill (one per view); secondary = ink outline; quiet = underlined text link. Default primary. */
  variant?: 'primary' | 'secondary' | 'quiet';
  size?: 'md' | 'lg';
  /** Renders an <a> instead of a <button>. */
  href?: string;
  children?: React.ReactNode;
}
export declare function Button(props: ButtonProps): React.ReactElement;

export interface StatusBadgeProps {
  status?: Status;
  /** Overrides the default label (Done, In progress, Blocked, Planned). Keep it a word, never colour alone. */
  children?: React.ReactNode;
}
export declare function StatusBadge(props: StatusBadgeProps): React.ReactElement;

export interface SectionHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  /** The guideline's oversized faded chapter numeral, e.g. 0, 1, 2. Only when sections are a real sequence. */
  numeral?: string | number;
  align?: 'start' | 'center';
  /** Draws the logo's hook stroke under the title. */
  hook?: boolean;
  as?: 'h1' | 'h2' | 'h3';
}
export declare function SectionHeader(props: SectionHeaderProps): React.ReactElement;

export interface StatProps {
  /** The number as shown, e.g. "200" or "1,000". */
  value: string;
  /** Small unit after the number: "min", "+". */
  unit?: string;
  label: React.ReactNode;
  /** Prefixes "~" for field estimates. */
  approx?: boolean;
}
export declare function Stat(props: StatProps): React.ReactElement;

export interface WordCardProps {
  /** Romanised Chak headword. */
  roman: string;
  /** IPA without slashes. */
  ipa?: string;
  /** English (or Bengali) meaning. */
  gloss: React.ReactNode;
  /** Chak-script form, as an image or text, once a font exists. */
  script?: React.ReactNode;
  category?: string;
  speaker?: string;
  credit?: string;
  /** Audio URL (a Commons .mp3 served from your own site). Without it the button only toggles state. */
  src?: string;
}
export declare function WordCard(props: WordCardProps): React.ReactElement;

export interface TimelineItem {
  when?: string;
  title: React.ReactNode;
  text?: React.ReactNode;
  /** step (default) = hollow dot; milestone = filled orange; discovery = yellow; blocker = rust ring. */
  kind?: 'step' | 'milestone' | 'discovery' | 'blocker';
}
export interface TimelineProps { items: TimelineItem[] }
export declare function Timeline(props: TimelineProps): React.ReactElement;

export interface RoadmapCardProps {
  title: React.ReactNode;
  status: Status;
  children?: React.ReactNode;
}
export declare function RoadmapCard(props: RoadmapCardProps): React.ReactElement;

export interface PressCardProps {
  outlet: string;
  headline: React.ReactNode;
  kind?: 'article' | 'reel';
  quote?: React.ReactNode;
  author?: string;
  date?: string;
  href?: string;
  cta?: string;
  /** For kind="reel": the embed iframe or a poster image, shown in a 9:16 frame. */
  media?: React.ReactNode;
}
export declare function PressCard(props: PressCardProps): React.ReactElement;

export interface NoticeProps {
  /** info = sunken explainer; ask = orange-soft call for help. */
  tone?: 'info' | 'ask';
  title?: React.ReactNode;
  children?: React.ReactNode;
  action?: React.ReactNode;
}
export declare function Notice(props: NoticeProps): React.ReactElement;

export interface PotCurveProps {
  /** The colour of the section above, which the curve continues. Default brown. */
  color?: 'brown' | 'surface' | 'sunken' | 'orange';
  /** Mirror vertically to lead INTO a section instead of out of it. */
  flip?: boolean;
}
export declare function PotCurve(props: PotCurveProps): React.ReactElement;

declare global {
  interface Window {
    ShoiUku: {
      Button: typeof Button; StatusBadge: typeof StatusBadge; SectionHeader: typeof SectionHeader; Stat: typeof Stat;
      WordCard: typeof WordCard; Timeline: typeof Timeline; RoadmapCard: typeof RoadmapCard; PressCard: typeof PressCard; Notice: typeof Notice; PotCurve: typeof PotCurve;
    };
  }
}
