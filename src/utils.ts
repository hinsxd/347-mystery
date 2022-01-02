export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

export function getCoordOnCircle(
  center: [x: number, y: number],
  radius: number,
  angle: number
): [number, number] {
  const deltaX = radius * Math.cos(angle);
  const deltaY = radius * Math.sin(angle);
  return [center[0] + deltaX, center[1] + deltaY];
}
