export interface City {
  id: string;
  name: string;
  uf: string;
  lat: number;
  lon: number;
}

// Principais cidades brasileiras (lojas/centros de distribuição Nexus PC)
export const CITIES: City[] = [
  { id: "sp", name: "São Paulo", uf: "SP", lat: -23.5505, lon: -46.6333 },
  { id: "rj", name: "Rio de Janeiro", uf: "RJ", lat: -22.9068, lon: -43.1729 },
  { id: "bh", name: "Belo Horizonte", uf: "MG", lat: -19.9167, lon: -43.9345 },
  { id: "cwb", name: "Curitiba", uf: "PR", lat: -25.4284, lon: -49.2733 },
  { id: "poa", name: "Porto Alegre", uf: "RS", lat: -30.0346, lon: -51.2177 },
  { id: "bsb", name: "Brasília", uf: "DF", lat: -15.7939, lon: -47.8828 },
  { id: "ssa", name: "Salvador", uf: "BA", lat: -12.9777, lon: -38.5016 },
  { id: "rec", name: "Recife", uf: "PE", lat: -8.0476, lon: -34.877 },
  { id: "for", name: "Fortaleza", uf: "CE", lat: -3.7319, lon: -38.5267 },
  { id: "mao", name: "Manaus", uf: "AM", lat: -3.119, lon: -60.0217 },
  { id: "gyn", name: "Goiânia", uf: "GO", lat: -16.6869, lon: -49.2648 },
  { id: "fln", name: "Florianópolis", uf: "SC", lat: -27.5949, lon: -48.5482 },
];

export function getCity(id: string): City | undefined {
  return CITIES.find((c) => c.id === id);
}