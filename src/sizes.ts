import { measure } from './utils.js';

export function parseSizes(sizes: string) {
  const parts: SourceSize[] = [];
  let depth = 0;
  let start = 0;

  for (let i = 0; i < sizes.length; i += 1) {
    const char = sizes.charAt(i);

    if (char === '(') depth += 1;
    else if (char === ')') depth = Math.max(0, depth - 1);
    else if (char === ',' && depth === 0) {
      addPart(parts, sizes.slice(start, i));
      start = i + 1;
    }
  }

  addPart(parts, sizes.slice(start));
  return parts;
}

function addPart(parts: SourceSize[], size: string) {
  const part = size.trim();
  if (!part) return;

  let condition: string | null = null;
  let depth = 0;

  for (let i = part.length - 1; i >= 0; i -= 1) {
    const char = part.charAt(i);

    if (char === ')') depth += 1;
    else if (char === '(') depth = Math.max(0, depth - 1);
    else if (depth === 0 && /\s/.test(char)) {
      condition = part.slice(0, i).trim();
      break;
    }
  }

  const value = part.slice(condition?.length ?? 0).trim();
  if (value === 'auto') throw new Error('auto is not supported');

  parts.push([condition, measure(value)]);
}

type SourceSize = readonly [condition: string | null, width: number | null];
