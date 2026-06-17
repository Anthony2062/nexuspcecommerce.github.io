import { X, Trash2 } from "lucide-react";
import { useCart, formatBRL } from "@/lib/cart";
import { productImage } from "@/lib/product-images";
import type { Category } from "@/data/products";

export function CartDrawer() {
  const { items, total, isOpen, closeCart, removeItem, clear } = useCart();

  return (
    <>
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-50 bg-black/70 transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-[88vw] max-w-sm flex-col border-l border-gold/40 bg-card p-6 shadow-panel transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h3 className="text-lg font-bold tracking-wide">SEU CARRINHO</h3>
          <button onClick={closeCart} aria-label="Fechar" className="text-gold">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Seu carrinho está vazio.
            </p>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 rounded-md border border-border bg-secondary/40 p-3"
                >
                  <img
                    src={productImage(item.category as Category)}
                    alt={item.name}
                    className="h-12 w-12 rounded object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-semibold text-gold">
                      {item.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {item.qty} × {formatBRL(item.price)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label="Remover"
                    className="text-destructive transition-opacity hover:opacity-70"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-border pt-4">
          <div className="mb-4 flex items-center justify-between font-bold">
            <span>TOTAL:</span>
            <span className="text-gold">{formatBRL(total)}</span>
          </div>
          <button
            disabled={items.length === 0}
            onClick={() => {
              clear();
              closeCart();
            }}
            className="w-full rounded-md bg-gradient-gold px-4 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-gold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Finalizar Compra
          </button>
        </div>
      </aside>
    </>
  );
}