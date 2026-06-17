import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import {
  CreditCard,
  QrCode,
  Barcode,
  CheckCircle2,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import { Header } from "@/components/Header";
import { useCart, formatBRL } from "@/lib/cart";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Finalizar Compra | Nexus PC" },
      {
        name: "description",
        content:
          "Informe endereço, CEP e forma de pagamento para concluir sua compra na Nexus PC.",
      },
    ],
  }),
  component: CheckoutPage,
});

type Payment = "cartao" | "pix" | "boleto";

const checkoutSchema = z.object({
  nome: z.string().trim().min(3, "Informe seu nome completo").max(100),
  cep: z
    .string()
    .trim()
    .regex(/^\d{5}-?\d{3}$/, "CEP inválido (use 00000-000)"),
  endereco: z.string().trim().min(3, "Informe o endereço").max(160),
  numero: z.string().trim().min(1, "Informe o número").max(10),
  complemento: z.string().trim().max(60).optional().or(z.literal("")),
  bairro: z.string().trim().min(2, "Informe o bairro").max(80),
  cidade: z.string().trim().min(2, "Informe a cidade").max(80),
  uf: z.string().trim().length(2, "UF inválida"),
});

const PAYMENT_OPTIONS: { id: Payment; label: string; icon: typeof CreditCard }[] = [
  { id: "cartao", label: "Cartão de crédito", icon: CreditCard },
  { id: "pix", label: "Pix", icon: QrCode },
  { id: "boleto", label: "Boleto", icon: Barcode },
];

function CheckoutPage() {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "",
  });
  const [payment, setPayment] = useState<Payment>("pix");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cepLoading, setCepLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function lookupCep(raw: string) {
    const cep = raw.replace(/\D/g, "");
    if (cep.length !== 8) return;
    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setForm((prev) => ({
          ...prev,
          endereco: data.logradouro || prev.endereco,
          bairro: data.bairro || prev.bairro,
          cidade: data.localidade || prev.cidade,
          uf: data.uf || prev.uf,
        }));
      }
    } catch {
      /* ignore — usuário pode preencher manualmente */
    } finally {
      setCepLoading(false);
    }
  }

  function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    const result = checkoutSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    clear();
    setConfirmed(true);
  }

  if (confirmed) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
          <CheckCircle2 className="h-16 w-16 text-gold" />
          <h1 className="mt-6 text-2xl font-extrabold">Pagamento confirmado!</h1>
          <p className="mt-3 text-muted-foreground">
            Obrigado, <strong className="text-foreground">{form.nome}</strong>.
            Seu pedido foi recebido e será enviado para {form.endereco},{" "}
            {form.numero} — {form.cidade}/{form.uf}.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Forma de pagamento:{" "}
            <strong className="text-foreground">
              {PAYMENT_OPTIONS.find((p) => p.id === payment)?.label}
            </strong>
            .
          </p>
          <Link
            to="/"
            className="mt-8 rounded-md bg-gradient-gold px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-gold transition-opacity hover:opacity-90"
          >
            Voltar à loja
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
          <ShoppingBag className="h-14 w-14 text-muted-foreground" />
          <h1 className="mt-6 text-2xl font-extrabold">Seu carrinho está vazio</h1>
          <p className="mt-3 text-muted-foreground">
            Escolha seus componentes ou monte um PC completo para finalizar a
            compra.
          </p>
          <div className="mt-8 flex gap-3">
            <Link
              to="/"
              className="rounded-md border border-gold/40 px-5 py-3 text-sm font-bold uppercase tracking-wider text-gold transition-colors hover:bg-secondary"
            >
              Ver produtos
            </Link>
            <Link
              to="/montar"
              className="rounded-md bg-gradient-gold px-5 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-gold transition-opacity hover:opacity-90"
            >
              Montar PC
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-md border border-border bg-popover px-3 py-2.5 text-sm outline-none focus:border-gold";
  const labelCls =
    "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground";

  return (
    <div className="min-h-screen">
      <Header />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px]">
        <form onSubmit={handleConfirm} className="space-y-8">
          {/* Endereço */}
          <div className="rounded-xl border border-border bg-gradient-panel p-5 shadow-panel">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-gold">
              Endereço de entrega
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1 sm:col-span-2">
                <span className={labelCls}>Nome completo</span>
                <input
                  className={inputCls}
                  value={form.nome}
                  onChange={(e) => update("nome", e.target.value)}
                  placeholder="Seu nome"
                />
                {errors.nome && (
                  <span className="text-xs text-destructive">{errors.nome}</span>
                )}
              </label>

              <label className="flex flex-col gap-1">
                <span className={labelCls}>CEP</span>
                <div className="relative">
                  <input
                    className={inputCls}
                    value={form.cep}
                    onChange={(e) => update("cep", e.target.value)}
                    onBlur={(e) => lookupCep(e.target.value)}
                    placeholder="00000-000"
                    inputMode="numeric"
                  />
                  {cepLoading && (
                    <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gold" />
                  )}
                </div>
                {errors.cep && (
                  <span className="text-xs text-destructive">{errors.cep}</span>
                )}
              </label>

              <label className="flex flex-col gap-1">
                <span className={labelCls}>Cidade</span>
                <input
                  className={inputCls}
                  value={form.cidade}
                  onChange={(e) => update("cidade", e.target.value)}
                />
                {errors.cidade && (
                  <span className="text-xs text-destructive">{errors.cidade}</span>
                )}
              </label>

              <label className="flex flex-col gap-1 sm:col-span-2">
                <span className={labelCls}>Endereço</span>
                <input
                  className={inputCls}
                  value={form.endereco}
                  onChange={(e) => update("endereco", e.target.value)}
                  placeholder="Rua, avenida…"
                />
                {errors.endereco && (
                  <span className="text-xs text-destructive">
                    {errors.endereco}
                  </span>
                )}
              </label>

              <label className="flex flex-col gap-1">
                <span className={labelCls}>Número</span>
                <input
                  className={inputCls}
                  value={form.numero}
                  onChange={(e) => update("numero", e.target.value)}
                />
                {errors.numero && (
                  <span className="text-xs text-destructive">{errors.numero}</span>
                )}
              </label>

              <label className="flex flex-col gap-1">
                <span className={labelCls}>Complemento</span>
                <input
                  className={inputCls}
                  value={form.complemento}
                  onChange={(e) => update("complemento", e.target.value)}
                  placeholder="Apto, bloco… (opcional)"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className={labelCls}>Bairro</span>
                <input
                  className={inputCls}
                  value={form.bairro}
                  onChange={(e) => update("bairro", e.target.value)}
                />
                {errors.bairro && (
                  <span className="text-xs text-destructive">{errors.bairro}</span>
                )}
              </label>

              <label className="flex flex-col gap-1">
                <span className={labelCls}>UF</span>
                <input
                  className={inputCls}
                  value={form.uf}
                  maxLength={2}
                  onChange={(e) => update("uf", e.target.value.toUpperCase())}
                  placeholder="SP"
                />
                {errors.uf && (
                  <span className="text-xs text-destructive">{errors.uf}</span>
                )}
              </label>
            </div>
          </div>

          {/* Pagamento */}
          <div className="rounded-xl border border-border bg-gradient-panel p-5 shadow-panel">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-gold">
              Forma de pagamento
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {PAYMENT_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const active = payment === opt.id;
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setPayment(opt.id)}
                    className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold transition-colors ${
                      active
                        ? "border-gold bg-secondary text-gold"
                        : "border-border text-muted-foreground hover:border-gold/50"
                    }`}
                  >
                    <Icon className="h-4 w-4" /> {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-gradient-gold px-4 py-3.5 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-gold transition-opacity hover:opacity-90"
          >
            <CheckCircle2 className="h-4 w-4" /> Confirmar pagamento ·{" "}
            {formatBRL(total)}
          </button>
        </form>

        {/* Resumo do pedido */}
        <aside className="h-fit lg:sticky lg:top-24">
          <div className="rounded-xl border border-gold/40 bg-card p-5 shadow-panel">
            <h2 className="border-b border-border pb-3 text-lg font-bold tracking-wide">
              SEU PEDIDO
            </h2>
            <ul className="space-y-3 py-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-3 text-sm"
                >
                  <span className="min-w-0 flex-1 text-muted-foreground">
                    {item.qty}× {item.name}
                  </span>
                  <span className="shrink-0 font-semibold">
                    {formatBRL(item.price * item.qty)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t border-border pt-4 text-lg font-bold">
              <span>TOTAL</span>
              <span className="text-gold">{formatBRL(total)}</span>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}