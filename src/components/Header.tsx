import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import logo from "@/assets/logo_nexus_pc.png.asset.json";
import { useCart } from "@/lib/cart";

const NAV = [
  { to: "/", label: "Loja" },
  { to: "/camera", label: "Câmera" },
  { to: "/login", label: "Entrar" },
] as const;

export function Header() {
  const { count, openCart } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo.url}
            alt="Logo Nexus PC"
            width={48}
            height={48}
            className="h-11 w-11 object-contain"
          />
          <span className="text-xl font-bold tracking-widest">
            NEXUS <span className="text-gold">PC</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-gold [&.active]:text-gold"
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={openCart}
            aria-label="Abrir carrinho"
            className="relative ml-1 rounded-md p-2 text-gold transition-colors hover:bg-secondary"
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                {count}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}