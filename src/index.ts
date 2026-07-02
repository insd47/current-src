import { parseSrcset } from 'srcset';
import { parseSizes } from './sizes.js';
import { matches } from './utils.js';

export function resolveCurrentSrc(srcSet: string, sizes?: string) {
  const candidates = parseSrcset(srcSet, { strict: true });
  if (candidates.length === 0) return null;

  const size = sizes ? resolveSourceSize(sizes) : null;
  const target = size !== null ? size * window.devicePixelRatio : window.devicePixelRatio;

  const sorted = candidates
    .map(({ url, width, density }) => [url, size !== null ? width : (density ?? 1)] as const)
    .filter((candidate): candidate is readonly [string, number] => Number.isFinite(candidate[1]))
    .sort((a, b) => a[1] - b[1]);

  if (sorted.length !== candidates.length) return null;
  return sorted.find(([, value]) => value >= target)?.[0] ?? sorted.at(-1)?.[0] ?? null;
}

export function resolveSourceSize(sizes: string) {
  if (typeof window === 'undefined') return null;

  for (const [condition, width] of parseSizes(sizes)) {
    if (matches(condition)) return width;
  }

  return null;
}
