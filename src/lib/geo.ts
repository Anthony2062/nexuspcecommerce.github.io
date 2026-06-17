import { CITIES, type City } from "@/data/cities";

/** Distância em km entre duas coordenadas (fórmula de Haversine). */
export function haversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // raio da Terra em km
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

/** Encontra a cidade brasileira mais próxima de uma coordenada. */
export function nearestCity(lat: number, lon: number): { city: City; distance: number } {
  let best = CITIES[0];
  let bestDist = Infinity;
  for (const city of CITIES) {
    const d = haversine(lat, lon, city.lat, city.lon);
    if (d < bestDist) {
      bestDist = d;
      best = city;
    }
  }
  return { city: best, distance: bestDist };
}

export function formatDistance(km: number): string {
  if (km < 1) return "menos de 1 km";
  return `${km.toLocaleString("pt-BR")} km`;
}