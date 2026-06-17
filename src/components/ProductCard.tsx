import { MapPin } from "lucide-react";
import type { Product } from "@/data/products";
import { getCity } from "@/data/cities";
import { productImage } from "@/lib/product-images";
import { useCart, formatBRL } from "@/lib/cart";
import { formatDistance } from "@/lib/geo";

interface ProductCardProps {
  product: Product;
  distance?: number | null;
}

export function ProductCard({ product, distance }: ProductCardProps) {
  const { addItem } = useCart();
  const city = getCity(product.cityId);

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-gradient-panel shadow-panel transition-colors hover:border-gold/50">
      <div className="relative flex aspect-square items-center justify-center bg-black/40 p-4">
        <img
          src={productImage(product)}
          alt={product.name}
          loading="lazy"
          className="max-h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
        {typeof distance === "number" && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-semibold text-gold">
            <MapPin className="h-3 w-3" />
            {formatDistance(distance)}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-bold leading-tight">{product.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>
        {city && (
          <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground/80">
            <MapPin className="h-3 w-3 text-gold" /> Loja {city.name} – {city.uf}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-lg font-bold text-gold">
            {formatBRL(product.price)}
          </span>
          <button
            onClick={() =>
              addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                category: product.category,
              })
            }
            className="rounded-md bg-gradient-gold px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-90"
          >
            Comprar
          </button>
        </div>
      </div>
    </article>
  );
}