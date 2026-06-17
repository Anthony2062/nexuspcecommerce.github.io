import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, MapPin, LocateFixed, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS, CATEGORY_LABELS, type Category } from "@/data/products";
import { CITIES, getCity } from "@/data/cities";
import { haversine, nearestCity, formatDistance } from "@/lib/geo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nexus PC | Loja de Hardware Gamer Premium" },
      {
        name: "description",
        content:
          "Compre placas de vídeo, processadores, gabinetes e refrigeração premium. Encontre componentes disponíveis perto de você por geolocalização.",
      },
    ],
  }),
  component: Index,
});

const RADIUS_OPTIONS = [
  { value: 0, label: "Sem limite" },
  { value: 500, label: "Até 500 km" },
  { value: 1000, label: "Até 1.000 km" },
  { value: 2000, label: "Até 2.000 km" },
];

function Index() {
  const [term, setTerm] = useState("");
  const [category, setCategory] = useState<Category | "todos">("todos");
  const [originCityId, setOriginCityId] = useState<string>("");
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [radius, setRadius] = useState(0);
  const [geoStatus, setGeoStatus] = useState<"idle" | "loading" | "error">("idle");

  // Coordenada de referência: GPS detectado OU cidade escolhida manualmente
  const reference = useMemo(() => {
    if (coords) return coords;
    const c = getCity(originCityId);
    return c ? { lat: c.lat, lon: c.lon } : null;
  }, [coords, originCityId]);

  const detected = useMemo(
    () => (coords ? nearestCity(coords.lat, coords.lon) : null),
    [coords],
  );

  function detectLocation() {
    if (!("geolocation" in navigator)) {
      setGeoStatus("error");
      return;
    }
    setGeoStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setOriginCityId("");
        setGeoStatus("idle");
      },
      () => setGeoStatus("error"),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }

  const filtered = useMemo(() => {
    const t = term.toLowerCase().trim();
    return PRODUCTS.map((p) => {
      const city = getCity(p.cityId);
      const distance =
        reference && city
          ? haversine(reference.lat, reference.lon, city.lat, city.lon)
          : null;
      return { product: p, distance };
    })
      .filter(({ product, distance }) => {
        const matchText =
          !t ||
          product.name.toLowerCase().includes(t) ||
          product.description.toLowerCase().includes(t);
        const matchCat = category === "todos" || product.category === category;
        const matchRadius =
          !reference || radius === 0 || (distance !== null && distance <= radius);
        return matchText && matchCat && matchRadius;
      })
      .sort((a, b) => {
        if (a.distance === null || b.distance === null) return 0;
        return a.distance - b.distance;
      });
  }, [term, category, reference, radius]);

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-panel" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-gold">
            High Performance Gaming Hardware
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">
            Construa sua máquina <span className="text-gold">de elite</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Componentes premium com disponibilidade inteligente por região.
            Ative sua localização e veja o que está mais perto de você.
          </p>
        </div>
      </section>

      {/* Painel de geolocalização */}
      <section className="border-b border-border bg-card/40">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <div className="grid gap-4 md:grid-cols-3">
            <button
              onClick={detectLocation}
              className="flex items-center justify-center gap-2 rounded-lg border border-gold/40 bg-secondary/40 px-4 py-3 text-sm font-semibold text-gold transition-colors hover:bg-secondary"
            >
              {geoStatus === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LocateFixed className="h-4 w-4" />
              )}
              Detectar minha localização
            </button>

            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Ou escolha sua cidade
              </span>
              <select
                value={coords ? "" : originCityId}
                onChange={(e) => {
                  setOriginCityId(e.target.value);
                  setCoords(null);
                }}
                className="rounded-md border border-border bg-popover px-3 py-2 text-sm outline-none focus:border-gold"
              >
                <option value="">Selecione uma cidade…</option>
                {CITIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} – {c.uf}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Distância máxima
              </span>
              <select
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                disabled={!reference}
                className="rounded-md border border-border bg-popover px-3 py-2 text-sm outline-none focus:border-gold disabled:opacity-40"
              >
                {RADIUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {reference && (
            <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-gold" />
              {detected ? (
                <>
                  Você está próximo de{" "}
                  <strong className="text-foreground">
                    {detected.city.name} – {detected.city.uf}
                  </strong>{" "}
                  ({formatDistance(detected.distance)}). Mostrando produtos por
                  proximidade.
                </>
              ) : (
                <>
                  Origem:{" "}
                  <strong className="text-foreground">
                    {getCity(originCityId)?.name}
                  </strong>
                  . Produtos ordenados pela distância da loja.
                </>
              )}
            </p>
          )}
        </div>
      </section>

      {/* Busca + categorias */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Pesquisar componentes elite…"
              className="w-full rounded-md border border-border bg-popover py-2.5 pl-9 pr-3 text-sm outline-none focus:border-gold"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(CATEGORY_LABELS) as (Category | "todos")[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  category === cat
                    ? "border-gold bg-gradient-gold text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-gold/50 hover:text-gold"
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de produtos */}
        {filtered.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">
            Nenhum componente premium encontrado para os filtros selecionados.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map(({ product, distance }) => (
              <ProductCard key={product.id} product={product} distance={distance} />
            ))}
          </div>
        )}
      </section>

      <footer className="mt-10 border-t border-border py-8 text-center text-xs text-muted-foreground">
        © 2024 Nexus PC — High Performance Gaming Hardware
      </footer>
    </div>
  );
}
