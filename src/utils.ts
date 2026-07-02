export function matches(condition: string | null) {
  if (!condition) return true;

  try {
    return window.matchMedia(condition).matches;
  } catch {
    return false;
  }
}

export function measure(value: string) {
  const element = document.createElement('div');
  element.style.cssText = 'position:absolute;visibility:hidden;contain:strict;width:0;height:0;';
  element.style.width = value;
  if (!element.style.width) return null;

  (document.body ?? document.documentElement).append(element);
  const measured = element.getBoundingClientRect().width;
  element.remove();

  return Number.isFinite(measured) ? measured : null;
}
