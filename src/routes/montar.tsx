import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Cpu, Check } from "lucide-react";
import { Header } from "@/components/Header";
import { PRODUCTS, CATEGORY_LABELS, type Category, type Product } from "@/data/products";
import { productImage } from "@/lib/product-images";
import { useCart, formatBRL } from "@/lib/cart";

export const Route = createFileRoute("/montar")({
  head: () => ({
    meta: [
      { title: "Monte seu PC | Nexus PC" },
      {
        name: "description",
        content:
          "Monte seu computador gamer escolhendo processador, placa de vídeo, memória RAM, SSD, fonte, gabinete e refrigeração. Veja o valor total em tempo real.",
      },
      { property: "og:title", content: "Monte seu PC | Nexus PC" },
      {
        property: "og:description",
        content:
          "Escolha cada peça e veja o valor total da sua build de elite em tempo real.",
      },
    ],
  }),
  component: MontarPage,
});

// Ordem das etapas da montagem
const BUILD_STEPS: { category: Category; required: boolean }[] = [
  { category: "processador", required: true },
  { category: "placa-de-video", required: true },
  { category: "memoria-ram", required: true },
  { category: "ssd", required: true },
  { category: "fonte", required: true },
  { category: "gabinete", required: true },
  { category: "fan", required: false },
];

function MontarPage() {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Record<string, number | null>>({});

  const byCategory = useMemo(() => {
    const map: Record<string, Product[]> = {};
    for (const step of BUILD_STEPS) {
      map[step.category] = PRODUCTS.filter((p) => p.category === step.category);
    }
    return map;
  }, []);

  const chosenProducts = useMemo(
    () =>
      BUILD_STEPS.map((s) => {
        const id = selected[s.category];
        return id ? PRODUCTS.find((p) => p.id === id) ?? null : null;
      }).filter((p): p is Product => p !== null),
    [selected],
  );

  const total = useMemo(
    () => chosenProducts.reduce((acc, p) => acc + p.price, 0),
    [chosenProducts],
  );

  const missingRequired = BUILD_STEPS.filter(
    (s) => s.required && !selected[s.category],
  ).map((s) => CATEGORY_LABELS[s.category]);

  const canCheckout = chosenProducts.length > 0 && missingRequired.length === 0;

  function finalizar() {
    chosenProducts.forEach((p) =>
      addItem({ id: p.id, name: p.name, price: p.price, category: p.category }),
    );
    navigate({ to: "/checkout" });
  }

  return (
    <div className="min-h-screen">
      <Header />

      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-panel" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 text-center sm:px-6">
          <p className="mb-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-gold">
            <Cpu className="h-4 w-4" /> Monte seu PC
          </p>
          <h1 className="mx-auto max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl">
            Configure sua máquina <span className="text-gold">peça por peça</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Escolha cada componente e acompanhe o valor total da sua build em
            tempo real.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_360px]">
        {/* Seleção de peças */}
        <div className="space-y-5">
          {BUILD_STEPS.map((step) => {
            const options = byCategory[step.category];
            const selectedId = selected[step.category] ?? "";
            const chosen = options.find((p) => p.id === selectedId);
            return (
              <div
                key={step.category}
                className="rounded-xl border border-border bg-gradient-panel p-4 shadow-panel"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gold">
                    {CATEGORY_LABELS[step.category]}
                    {!step.required && (
                      <span className="ml-2 text-[10px] font-normal text-muted-foreground">
                        (opcional)
                      </span>
                    )}
                  </h2>
                  {chosen && (
                    <span className="text-sm font-bold text-gold">
                      {formatBRL(chosen.price)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  {chosen && (
                    <img
                      src={productImage(chosen)}
                      alt={chosen.name}
                      loading="lazy"
                      className="h-16 w-16 shrink-0 rounded-md bg-black/40 object-contain p-1"
                    />
                  )}
                  <select
                    value={selectedId}
                    onChange={(e) =>
                      setSelected((prev) => ({
                        ...prev,
                        [step.category]: e.target.value
                          ? Number(e.target.value)
                          : null,
                      }))
                    }
                    className="w-full rounded-md border border-border bg-popover px-3 py-2.5 text-sm outline-none focus:border-gold"
                  >
                    <option value="">Selecione…</option>
                    {options.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {formatBRL(p.price)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>

        {/* Resumo */}
        <aside className="h-fit lg:sticky lg:top-24">
          <div className="rounded-xl border border-gold/40 bg-card p-5 shadow-panel">
            <h2 className="border-b border-border pb-3 text-lg font-bold tracking-wide">
              RESUMO DA BUILD
            </h2>
            <ul className="space-y-2 py-4">
              {chosenProducts.length === 0 ? (
                <li className="text-sm text-muted-foreground">
                  Nenhuma peça selecionada ainda.
                </li>
              ) : (
                chosenProducts.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-start justify-between gap-3 text-sm"
                  >
                    <span className="min-w-0 flex-1 truncate text-muted-foreground">
                      {p.name}
                    </span>
                    <span className="shrink-0 font-semibold">
                      {formatBRL(p.price)}
                    </span>
                  </li>
                ))
              )}
            </ul>
            <div className="flex items-center justify-between border-t border-border pt-4 text-lg font-bold">
              <span>TOTAL</span>
              <span className="text-gold">{formatBRL(total)}</span>
            </div>

            {missingRequired.length > 0 && (
              <p className="mt-3 text-xs text-muted-foreground">
                Faltam: {missingRequired.join(", ")}.
              </p>
            )}

            <button
              disabled={!canCheckout}
              onClick={finalizar}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-gradient-gold px-4 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-gold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Check className="h-4 w-4" /> Finalizar montagem
            </button>
          </div>
        </aside>
      </section>

      <footer className="mt-10 border-t border-border py-8 text-center text-xs text-muted-foreground">
        © 2024 Nexus PC — High Performance Gaming Hardware
      </footer>
    </div>
  );
}