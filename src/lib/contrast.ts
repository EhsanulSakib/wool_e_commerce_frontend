/**
 * WCAG 2.x contrast ratio between two colors.
 * Used by tokens.test.ts (fails the build on an AA miss) and /dev/tokens.
 */

/** "#0a0a0a" or "#fff" → [r, g, b] (0–255). */
export function parseHex(hex: string): [number, number, number] {
  let h = hex.trim().replace(/^#/, '');
  if (h.length === 3) h = [...h].map((c) => c + c).join('');
  if (!/^[0-9a-f]{6}$/i.test(h)) throw new Error(`Not a hex color: ${hex}`);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [
    number,
    number,
    number,
  ];
}

function luminance([r, g, b]: [number, number, number]): number {
  const [R, G, B] = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/** Contrast ratio from 1 to 21. AA: ≥ 4.5 for text, ≥ 3 for large text and UI parts. */
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(parseHex(a)), luminance(parseHex(b))].sort(
    (x, y) => y - x,
  );
  return (hi + 0.05) / (lo + 0.05);
}

/** Text/background pairs checked in both themes, with the AA minimum. */
export const contrastPairs = [
  { fg: 'fg', bg: 'bg', min: 4.5 },
  { fg: 'fg', bg: 'surface', min: 4.5 },
  { fg: 'fg', bg: 'surface-raised', min: 4.5 },
  { fg: 'muted-fg', bg: 'bg', min: 4.5 },
  { fg: 'muted-fg', bg: 'surface', min: 4.5 },
  { fg: 'muted-fg', bg: 'muted', min: 4.5 },
  { fg: 'primary-fg', bg: 'primary', min: 4.5 },
  { fg: 'secondary-fg', bg: 'secondary', min: 4.5 },
  { fg: 'success-fg', bg: 'success-soft', min: 4.5 },
  { fg: 'warning-fg', bg: 'warning-soft', min: 4.5 },
  { fg: 'danger-fg', bg: 'danger-soft', min: 4.5 },
  { fg: 'info-fg', bg: 'info-soft', min: 4.5 },
  // Status base colors used as text on the page (e.g. sale price)
  { fg: 'success', bg: 'bg', min: 4.5 },
  { fg: 'warning', bg: 'bg', min: 4.5 },
  { fg: 'danger', bg: 'bg', min: 4.5 },
  { fg: 'info', bg: 'bg', min: 4.5 },
  // Non-text UI: input outlines and the focus ring need 3:1
  { fg: 'border-strong', bg: 'bg', min: 3 },
  { fg: 'ring', bg: 'bg', min: 3 },
] as const;
