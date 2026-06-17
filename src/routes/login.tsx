import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import logo from "@/assets/logo_nexus_pc.png.asset.json";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Nexus PC" },
      { name: "description", content: "Acesse sua conta Elite da Nexus PC." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-panel px-4 py-12">
      <img
        src={logo.url}
        alt="Nexus PC"
        width={220}
        height={220}
        className="mb-8 w-48 object-contain drop-shadow-[0_0_15px_oklch(0.766_0.124_86/0.3)]"
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
        className="flex w-full max-w-md flex-col rounded-xl border border-border bg-card p-8 shadow-panel"
      >
        <h1 className="mb-1 text-center text-lg font-bold tracking-wide text-gold">
          LOG-IN DE MEMBROS ELITE
        </h1>
        <p className="mb-6 text-center text-xs text-muted-foreground">
          High Performance Gaming Hardware
        </p>

        <label className="mb-2 text-xs font-bold uppercase tracking-widest text-gold">
          E-mail / ID de usuário
        </label>
        <input
          type="email"
          required
          placeholder="Digite seu e-mail"
          className="mb-4 rounded-md border border-border bg-popover px-4 py-3 text-sm outline-none transition-colors focus:border-gold"
        />

        <label className="mb-2 text-xs font-bold uppercase tracking-widest text-gold">
          Senha
        </label>
        <input
          type="password"
          required
          placeholder="Digite sua senha"
          className="mb-6 rounded-md border border-border bg-popover px-4 py-3 text-sm outline-none transition-colors focus:border-gold"
        />

        <button
          type="submit"
          className="rounded-md bg-gradient-gold px-4 py-3 text-sm font-extrabold uppercase tracking-widest text-primary-foreground shadow-gold transition-opacity hover:opacity-90"
        >
          Entrar na Nexus
        </button>

        {sent && (
          <p className="mt-3 text-center text-xs text-gold">
            Bem-vindo de volta, membro Elite!
          </p>
        )}

        <a
          href="#"
          className="mt-4 text-center text-xs text-muted-foreground hover:text-gold"
        >
          Esqueceu a senha?
        </a>
        <div className="my-5 h-px bg-border" />
        <button
          type="button"
          className="rounded-md border border-gold/50 px-4 py-3 text-sm font-bold uppercase tracking-wider text-gold transition-colors hover:bg-secondary"
        >
          Criar Conta Premium
        </button>
      </form>

      <Link
        to="/"
        className="mt-6 text-xs uppercase tracking-wider text-muted-foreground hover:text-gold"
      >
        ← Voltar para a loja
      </Link>
    </div>
  );
}