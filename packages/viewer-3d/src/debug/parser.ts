import { RawFields, Tag, TAGS } from './types';

export interface ParsedLine {
  raw: string;
  tag: Tag;
  t: number;
  p?: number;
  ts?: number;
  fields: RawFields;
}

const LINE_RE = /^\s*([A-Z])[\s,]*(.*)$/;
const FIELD_RE = /^\s*([^=:\s]+)[=|:](.+)$/;

function coerceValue(value: string): number | string {
  const trimmed = value.trim();
  if (trimmed === '') {
    return '';
  }
  if (/^0x[0-9a-fA-F]+$/.test(trimmed)) {
    return Number.parseInt(trimmed, 16);
  }
  if (/^[+-]?\d+(\.\d+)?$/.test(trimmed)) {
    const num = Number(trimmed);
    if (!Number.isNaN(num)) {
      return num;
    }
  }
  return trimmed;
}

export function parseLine(line: string): ParsedLine | null {
  const match = LINE_RE.exec(line);
  if (!match) {
    return null;
  }
  const [, tagRaw, restRaw] = match;
  const tagChar = tagRaw.charAt(0);
  if (!TAGS.includes(tagChar as Tag)) {
    return null;
  }
  const tag = tagChar as Tag;
  const fields: RawFields = {};

  const rest = restRaw.trim();
  if (rest.length > 0) {
    let cursor = 0;
    let token = '';
    let inQuote = false;
    let quoteChar: '"' | "'" | null = null;
    const pushToken = () => {
      const trimmed = token.trim();
      if (trimmed.length === 0) {
        token = '';
        return;
      }
      const fieldMatch = FIELD_RE.exec(trimmed);
      if (fieldMatch) {
        const key = fieldMatch[1];
        const value = fieldMatch[2];
        fields[key] = coerceValue(value);
      } else if (!fields[tag]) {
        // fallback positional payload
        fields[tag] = coerceValue(trimmed);
      }
      token = '';
    };

    while (cursor < rest.length) {
      const ch = rest[cursor];
      if (inQuote) {
        token += ch;
        if (ch === quoteChar) {
          inQuote = false;
          quoteChar = null;
        }
      } else if (ch === '"' || ch === "'") {
        inQuote = true;
        quoteChar = ch;
        token += ch;
      } else if (ch === ',' || ch === ' ' || ch === '\t') {
        pushToken();
      } else {
        token += ch;
      }
      cursor += 1;
    }
    pushToken();
  }

  const tField = fields.t;
  const pField = fields.p;
  const tsField = fields.ts;

  const t = typeof tField === 'number' ? tField : Number(fields.tick ?? fields.frame ?? fields.T ?? NaN);
  const p = typeof pField === 'number' ? pField : Number.isFinite(Number(pField)) ? Number(pField) : undefined;
  const ts = typeof tsField === 'number' ? tsField : Number(fields.time ?? fields.ts ?? NaN);

  if (!Number.isFinite(t)) {
    return null;
  }

  return {
    raw: line,
    tag,
    t,
    p: Number.isFinite(p) ? (p as number) : undefined,
    ts: Number.isFinite(ts) ? (ts as number) : undefined,
    fields,
  };
}
