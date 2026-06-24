"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/validations/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, Lock } from "lucide-react";

interface LoginFormProps {
  onSubmit: (
    data: LoginFormData,
  ) => Promise<{ success: boolean; error?: string }>;
  isLoading?: boolean;
  serverError?: string | null;
}

export function LoginForm({
  onSubmit,
  isLoading = false,
  serverError = null,
}: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleFormSubmit = async (data: LoginFormData) => {
    try {
      const result = await onSubmit(data);
      if (!result.success && result.error) {
        setError("root", { message: result.error });
      }
    } catch (error) {
      console.error("Erro no submit:", error);
      setError("root", { message: "Erro inesperado. Tente novamente." });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="admin@aurelie.pt"
          leftIcon={<Mail className="size-4 text-ink-faint" />}
          {...register("email")}
          error={errors.email?.message}
          autoFocus
          required
          disabled={isLoading}
        />

        <Input
          label="Senha"
          type="password"
          placeholder="••••••••"
          leftIcon={<Lock className="size-4 text-ink-faint" />}
          showPasswordToggle
          {...register("password")}
          error={errors.password?.message}
          required
          disabled={isLoading}
        />
      </div>

      {(serverError || errors.root?.message) && (
        <div className="rounded-lg bg-danger-bg px-4 py-3 text-sm text-danger">
          {serverError || errors.root?.message}
        </div>
      )}

      <Button type="submit" className="w-full" loading={isLoading} size="lg">
        {isLoading ? "A entrar..." : "Entrar"}
      </Button>
    </form>
  );
}
