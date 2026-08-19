/**
 * SVG path builders for the lightweight charts in the dashboard.
 *
 * These exist instead of a charting dependency: the dashboard needs exactly two
 * shapes (a smoothed line and its filled area), and hand-rolling them keeps the
 * gradient, stroke and cap behaviour under our own control while adding zero
 * kilobytes to the bundle.
 */

export interface Point {
  x: number;
  y: number;
}

/**
 * Map raw values onto an SVG viewBox.
 *
 * `padY` reserves headroom so the peak of the series never touches the top edge
 * and the stroke is never clipped by the viewBox.
 */
export function toPoints(
  values: number[],
  width: number,
  height: number,
  padY = 4
): Point[] {
  if (values.length === 0) return [];
  if (values.length === 1) {
    return [{ x: 0, y: height / 2 }, { x: width, y: height / 2 }];
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  // A flat series would divide by zero; pin it to the vertical centre instead.
  const span = max - min || 1;
  const usable = height - padY * 2;

  return values.map((value, i) => ({
    x: (i / (values.length - 1)) * width,
    y: padY + usable - ((value - min) / span) * usable,
  }));
}

/**
 * Smooth line through every point using a cardinal spline expressed as cubic
 * beziers. `tension` of 0 gives straight segments, higher values round the
 * corners; 0.2 matches the gentle curve in the design reference.
 *
 * Control points are derived from each point's neighbours, so the curve passes
 * through the data rather than being pulled away from it the way a plain
 * quadratic midpoint smoothing would.
 */
export function smoothLine(points: Point[], tension = 0.2): string {
  if (points.length === 0) return "";
  if (points.length < 3) {
    return points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  }

  let d = `M${points[0].x},${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;

    d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }

  return d;
}

/** Close a line path down to the baseline so it can be filled as an area. */
export function closeArea(line: string, points: Point[], height: number): string {
  if (points.length === 0) return "";
  const first = points[0];
  const last = points[points.length - 1];
  return `${line} L${last.x},${height} L${first.x},${height} Z`;
}
