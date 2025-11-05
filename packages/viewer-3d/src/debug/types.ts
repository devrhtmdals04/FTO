export type Tag = 'K' | 'A' | 'B' | 'G' | 'E' | 'C' | 'F' | 'X' | 'W' | 'R';

export const TAGS: readonly Tag[] = ['K', 'A', 'B', 'G', 'E', 'C', 'F', 'X', 'W', 'R'];

export const TAG_TO_BIT: Record<Tag, number> = TAGS.reduce<Record<Tag, number>>((acc, tag, index) => {
  acc[tag] = 1 << index;
  return acc;
}, {} as Record<Tag, number>);

export const DEFAULT_TAG_MASK = TAGS.reduce((mask, tag) => mask | TAG_TO_BIT[tag], 0);

export interface RawFields {
  [key: string]: string | number | undefined;
}

export interface DbgEvent {
  seq: number;
  raw: string;
  tag: Tag;
  t: number;
  p?: number;
  ts?: number;
  fields: RawFields;
  hidden: boolean;
}

export interface TickBucket {
  tick: number;
  events: DbgEvent[];
  tags: Partial<Record<Tag, DbgEvent[]>>;
  perPid: Map<number, PlayerDebugBucket>;
}

export interface PlayerDebugBucket {
  pid: number;
  events: DbgEvent[];
  tags: Partial<Record<Tag, DbgEvent[]>>;
}

export interface SnapshotPayload {
  tick: number;
  bucket?: TickBucket;
  perTag: Partial<Record<Tag, DbgEvent[]>>;
  player?: PlayerDebugBucket;
  events: DbgEvent[];
}

export type DebugUpdate =
  | { kind: 'event'; event: DbgEvent }
  | { kind: 'mask'; mask: number };

