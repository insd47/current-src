# @insd47/current-src

Resolve the current responsive image source from `srcset` and `sizes`.

This is a browser utility that replicates the algorithm the browser uses to pick
`img.currentSrc`, letting you compute the resolved URL yourself — useful for
preloading, prefetching, or reading the selected candidate before an image element
is rendered.

## Install

```sh
npm install @insd47/current-src
# or
pnpm add @insd47/current-src
```

## Usage

```ts
import { resolveCurrentSrc } from '@insd47/current-src';

// Width-based candidates with sizes
resolveCurrentSrc(
  'small.jpg 480w, medium.jpg 800w, large.jpg 1200w',
  '(max-width: 600px) 480px, 800px'
);
// => 'small.jpg' | 'medium.jpg' | 'large.jpg' depending on viewport & DPR

// Density-based candidates (no sizes)
resolveCurrentSrc('a.jpg 1x, b.jpg 2x, c.jpg 3x');
// => picks the candidate matching window.devicePixelRatio
```

## API

### `resolveCurrentSrc(srcSet, sizes?)`

Returns the resolved image URL, or `null` if the source can't be resolved
(empty/invalid `srcset`, or a mix of width and density descriptors).

- **`srcSet`** — the `srcset` attribute string.
- **`sizes`** — optional `sizes` attribute string. When provided, width descriptors
  (`480w`) are used; otherwise density descriptors (`2x`) are used.

Selection accounts for `window.devicePixelRatio` and picks the smallest candidate
that meets the target, falling back to the largest available.

### `resolveSourceSize(sizes)`

Returns the resolved source size in pixels for the current viewport, or `null`
(e.g. when run outside the browser). Evaluates each `sizes` entry against
`window.matchMedia` and returns the width of the first matching condition.

## Notes

- Browser-only — relies on `window.matchMedia`, `window.devicePixelRatio`, and the
  DOM to measure CSS lengths.
- The `auto` keyword in `sizes` is not supported.

## License

MIT
