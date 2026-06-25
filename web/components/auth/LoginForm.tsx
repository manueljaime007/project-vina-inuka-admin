"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface LoginFormProps {
  onSubmit: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  isLoading?: boolean;
  serverError?: string | null;
}

export function LoginForm({
  onSubmit,
  isLoading = false,
  serverError = null,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Preencha todos os campos");
      return;
    }

    const result = await onSubmit(email, password);
    if (!result.success && result.error) {
      setError(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="admin@inuka.ao"
          leftIcon={<Mail className="size-4 text-ink-faint" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
          autoFocus
        />

        <div className="relative">
          <Input
            label="Senha"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            leftIcon={<Lock className="size-4 text-ink-faint" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-10 -translate-y-1/2 text-ink-faint hover:text-ink"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="size-4" strokeWidth={1.8} />
            ) : (
              <Eye className="size-4" strokeWidth={1.8} />
            )}
          </button>
        </div>
      </div>

      {(error || serverError) && (
        <div className="rounded-lg bg-danger-bg px-4 py-3 text-sm text-danger">
          {error || serverError}
        </div>
      )}

      <Button type="submit" className="w-full" loading={isLoading} size="lg">
        {isLoading ? "A entrar..." : "Entrar"}
      </Button>
    </form>
  );
}
