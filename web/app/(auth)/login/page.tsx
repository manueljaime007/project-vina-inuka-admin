"use client";

import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  const { login, isLoading, error } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-blush/30 to-surface p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="font-display text-3xl text-ink">
              Vina Inuka<span className="text-brand-rose-deep">.</span>
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
              Admin
            </span>
          </div>
          <p className="text-[15px] text-ink-soft">
            Acesso à área administrativa
          </p>
        </div>

        <div className="rounded-2xl border border-line-soft bg-surface p-8 shadow-[var(--shadow-card)]">
          <LoginForm onSubmit={login} isLoading={isLoading} serverError={error} />
        </div>
      </div>
    </div>
  );
}