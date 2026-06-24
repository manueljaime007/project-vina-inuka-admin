"use client";

import { SubmitEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Preencha o email e a palavra-passe.");
      return;
    }

    setLoading(true);
    // Simulação local — sem backend ligado ainda.
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 600);
  }

  function fillDemo() {
    setEmail("admin@aurelie.pt");
    setPassword("aurelie2026");
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-surface-muted px-4">
      {/* ambient brand glow */}
      <div className="pointer-events-none absolute -left-32 -top-32 size-105 rounded-full bg-brand-blush opacity-60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 size-105 rounded-full bg-brand-rose/20 blur-3xl" />

      <div className="relative w-full max-w-110 animate-scale-in rounded-[28px] border border-line-soft bg-surface p-10 shadow-(--shadow-pop)">
        <div className="mb-8">
          <h1 className="font-display text-[28px] leading-tight text-ink">
            Vina Inuka<span className="text-brand-rose-deep">.</span>{" "}
            <span className="text-ink-soft">Admin</span>
          </h1>
          <p className="mt-2 text-[14px] text-ink-soft">
            Inicie sessão para gerir a loja.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="Email"
            type="email"
            placeholder="admin@aurelie.pt"
            leftIcon={<Mail className="size-4.25" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <div className="relative">
            <Input
              label="Palavra-passe"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              leftIcon={<Lock className="size-4.25" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3.5 top-8.5 text-ink-faint transition-colors hover:text-ink-soft"
              aria-label={
                showPassword ? "Ocultar palavra-passe" : "Mostrar palavra-passe"
              }
            >
              {showPassword ? (
                <EyeOff className="size-4.25" />
              ) : (
                <Eye className="size-4.25" />
              )}
            </button>
          </div>

          {error && (
            <p className="rounded-lg bg-danger-bg px-3 py-2 text-[13px] text-danger-deep">
              {error}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            loading={loading}
            className="mt-1 w-full uppercase text-[13px]"
          >
            Entrar
          </Button>
        </form>

        <div className="mt-7 rounded-2xl bg-surface-sunken px-5 py-4">
          <p className="text-[13px] font-medium text-ink">
            Conta de demonstração
          </p>
          <p className="mt-1.5 text-[13px] text-ink-soft">
            Email:{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-[12.5px] text-brand-navy">
              admin@aurelie.pt
            </code>
          </p>
          <p className="text-[13px] text-ink-soft">
            Palavra-passe:{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-[12.5px] text-brand-navy">
              aurelie2026
            </code>
          </p>
          <button
            type="button"
            onClick={fillDemo}
            className="mt-3 text-[12.5px] font-medium text-brand-navy underline-offset-2 hover:underline focus-ring"
          >
            Preencher automaticamente
          </button>
        </div>
      </div>
    </div>
  );
}
