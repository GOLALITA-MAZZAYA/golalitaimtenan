export const toRad = (deg: number) => {
  return (deg * Math.PI) / 180;
};
export const toDeg = (rad: number) => {
  return (rad * 180) / Math.PI;
};

export function bearingBetween(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δλ = toRad(lon2 - lon1);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);
  return (toDeg(θ) + 360) % 360;
}
