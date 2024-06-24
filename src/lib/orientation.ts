export function convertTo0to360Range(alpha: number) {
  if (alpha < 0) {
    return alpha + 360;
  }
  if (alpha >= 360) {
    return alpha - 360;
  }
  return alpha;
}

export function convertAlphaToProperDirection(alpha: number, gamma: number) {
  const alphaRotated =
    alpha - (Math.abs(gamma) > 45 ? 180 + 90 * (gamma / Math.abs(gamma)) : 0);
  const alphaInverted = alphaRotated * -1;
  return convertTo0to360Range(alphaInverted);
}
