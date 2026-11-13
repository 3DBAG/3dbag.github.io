// The homepage uses ordered numeric ranges; 3dtoml's built-in colormap handles
// exact values. Keep this small adapter local to the pinned engine version.
export function heightStyle(config) {
  const token = attribute => `\${feature['${attribute}']}`;
  const color = value => `color('${value}')`;
  const roof = token(config.heightColors.attribute);
  const ground = token(config.heightColors.groundAttribute);
  const height = `(${roof} - ${ground})`;
  const highlights = config.highlights;
  const conditions = highlights.values.map(value => [
    `${token(highlights.attribute)} === ${JSON.stringify(value)}`,
    color(highlights.color)
  ]);
  // Structural metadata translates noData to null; also reject nonfinite and
  // sentinel elevations before subtracting (two sentinels could cancel out).
  const invalidElevation = value => `!Number.isFinite(${value}) || ${value} < -500 || ${value} > 10000`;
  conditions.push([`(${invalidElevation(roof)}) || (${invalidElevation(ground)}) || ${height} < 0`, color(config.buildingColor)]);
  for (const band of config.heightColors.bands) {
    conditions.push([`${height} < ${band.below}`, color(band.color)]);
  }
  conditions.push(['true', color(config.heightColors.above)]);
  return { color: { conditions } };
}
