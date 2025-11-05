import { parseLine, ParsedLine } from './parser';
import {
  DbgEvent,
  DEFAULT_TAG_MASK,
  DebugUpdate,
  PlayerDebugBucket,
  SnapshotPayload,
  TAG_TO_BIT,
  Tag,
  TAGS,
  TickBucket,
} from './types';

type Listener = (update: DebugUpdate) => void;

const MAX_EVENTS = 8192;

function createTickBucket(tick: number): TickBucket {
  return {
    tick,
    events: [],
    tags: {},
    perPid: new Map(),
  };
}

function createPidBucket(pid: number): PlayerDebugBucket {
  return {
    pid,
    events: [],
    tags: {},
  };
}

export class DebugStore {
  private readonly byTick = new Map<number, TickBucket>();
  private readonly byPid = new Map<number, PlayerDebugBucket>();
  private readonly tickOrder: number[] = [];
  private readonly ring: DbgEvent[] = [];
  private readonly listeners = new Set<Listener>();

  private seq = 0;
  private mask = DEFAULT_TAG_MASK;

  ingest(line: string): DbgEvent | null {
    const parsed = parseLine(line);
    if (!parsed) {
      return null;
    }
    const event = this.createEvent(parsed);
    this.insert(event);
    this.trimRing();
    this.emit({ kind: 'event', event });
    return event;
  }

  snapshot(tick: number, pid?: number): SnapshotPayload {
    const bucket = this.byTick.get(tick);
    const events = bucket ? bucket.events.filter((e) => !e.hidden) : [];

    const perTag: SnapshotPayload['perTag'] = {};
    if (bucket) {
      for (const tag of TAGS) {
        const list = bucket.tags[tag];
        if (list && list.length > 0) {
          const filtered = list.filter((event) => !event.hidden);
          if (filtered.length > 0) {
            perTag[tag] = filtered;
          }
        }
      }
    }

    let player: PlayerDebugBucket | undefined;
    if (bucket && typeof pid === 'number') {
      const candidate = bucket.perPid.get(pid);
      if (candidate) {
        const filteredEvents = candidate.events.filter((e) => !e.hidden);
        if (filteredEvents.length > 0) {
          player = {
            pid: candidate.pid,
            events: filteredEvents,
            tags: TAGS.reduce<Partial<Record<Tag, DbgEvent[]>>>((acc, tag) => {
              const arr = candidate.tags[tag];
              if (!arr) {
                return acc;
              }
              const filtered = arr.filter((e) => !e.hidden);
              if (filtered.length > 0) {
                acc[tag] = filtered;
              }
              return acc;
            }, {}),
          };
        }
      }
    }

    return {
      tick,
      bucket,
      perTag,
      player,
      events,
    };
  }

  getTicks(): readonly number[] {
    return this.tickOrder;
  }

  getLatestTick(): number | undefined {
    if (this.tickOrder.length === 0) {
      return undefined;
    }
    return this.tickOrder[this.tickOrder.length - 1];
  }

  getRecentEvents(limit = 256): readonly DbgEvent[] {
    if (limit <= 0) {
      return [];
    }
    if (this.ring.length <= limit) {
      return this.ring.slice();
    }
    return this.ring.slice(this.ring.length - limit);
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getMask(): number {
    return this.mask;
  }

  setMask(mask: number): void {
    if (this.mask === mask) {
      return;
    }
    this.mask = mask;
    const enabledTags = new Set<Tag>();
    for (const tag of TAGS) {
      if (this.isTagEnabled(tag)) {
        enabledTags.add(tag);
      }
    }
    for (const event of this.ring) {
      event.hidden = !enabledTags.has(event.tag);
    }
    this.emit({ kind: 'mask', mask });
  }

  clear(): void {
    this.byTick.clear();
    this.byPid.clear();
    this.tickOrder.length = 0;
    this.ring.length = 0;
    this.seq = 0;
  }

  private emit(update: DebugUpdate): void {
    for (const listener of this.listeners) {
      listener(update);
    }
  }

  private insert(event: DbgEvent): void {
    const tickBucket = this.obtainTickBucket(event);
    tickBucket.events.push(event);
    tickBucket.tags[event.tag] = tickBucket.tags[event.tag] || [];
    tickBucket.tags[event.tag]!.push(event);

    if (typeof event.p === 'number') {
      const pidBucket = this.obtainPidBucket(event);
      pidBucket.events.push(event);
      pidBucket.tags[event.tag] = pidBucket.tags[event.tag] || [];
      pidBucket.tags[event.tag]!.push(event);
    }

    this.ring.push(event);
  }

  private obtainTickBucket(event: DbgEvent): TickBucket {
    let bucket = this.byTick.get(event.t);
    if (!bucket) {
      bucket = createTickBucket(event.t);
      this.byTick.set(event.t, bucket);
      this.insertTickOrder(event.t);
    }
    return bucket;
  }

  private obtainPidBucket(event: DbgEvent): PlayerDebugBucket {
    if (typeof event.p !== 'number') {
      throw new Error('obtainPidBucket called for event without pid');
    }
    let bucket = this.byPid.get(event.p);
    if (!bucket) {
      bucket = createPidBucket(event.p);
      this.byPid.set(event.p, bucket);
    }
    return bucket;
  }

  private insertTickOrder(tick: number): void {
    const { tickOrder } = this;
    if (tickOrder.length === 0 || tick > tickOrder[tickOrder.length - 1]) {
      tickOrder.push(tick);
      return;
    }
    const index = this.findInsertIndex(tickOrder, tick);
    if (tickOrder[index] !== tick) {
      tickOrder.splice(index, 0, tick);
    }
  }

  private findInsertIndex(array: number[], value: number): number {
    let low = 0;
    let high = array.length;
    while (low < high) {
      const mid = (low + high) >>> 1;
      if (array[mid] < value) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    return low;
  }

  private trimRing(): void {
    while (this.ring.length > MAX_EVENTS) {
      const oldest = this.ring.shift();
      if (!oldest) {
        break;
      }
      this.removeEvent(oldest);
    }
  }

  private removeEvent(event: DbgEvent): void {
    const bucket = this.byTick.get(event.t);
    if (bucket) {
      this.removeFromArray(bucket.events, event);
      const tagArray = bucket.tags[event.tag];
      if (tagArray) {
        this.removeFromArray(tagArray, event);
        if (tagArray.length === 0) {
          delete bucket.tags[event.tag];
        }
      }
      if (bucket.events.length === 0) {
        this.byTick.delete(event.t);
        this.removeTickOrder(event.t);
      }
    }

    if (typeof event.p === 'number') {
      const pidBucket = this.byPid.get(event.p);
      if (pidBucket) {
        this.removeFromArray(pidBucket.events, event);
        const tagArray = pidBucket.tags[event.tag];
        if (tagArray) {
          this.removeFromArray(tagArray, event);
          if (tagArray.length === 0) {
            delete pidBucket.tags[event.tag];
          }
        }
        if (pidBucket.events.length === 0) {
          this.byPid.delete(event.p);
        }
      }
    }
  }

  private removeTickOrder(tick: number): void {
    const idx = this.tickOrder.indexOf(tick);
    if (idx >= 0) {
      this.tickOrder.splice(idx, 1);
    }
  }

  private removeFromArray<T>(arr: T[], item: T): void {
    const idx = arr.indexOf(item);
    if (idx >= 0) {
      arr.splice(idx, 1);
    }
  }

  private createEvent(parsed: ParsedLine): DbgEvent {
    return {
      seq: this.seq++,
      raw: parsed.raw,
      tag: parsed.tag,
      t: parsed.t,
      p: parsed.p,
      ts: parsed.ts,
      fields: parsed.fields,
      hidden: !this.isTagEnabled(parsed.tag),
    };
  }

  private isTagEnabled(tag: Tag): boolean {
    return (this.mask & TAG_TO_BIT[tag]) !== 0;
  }
}
