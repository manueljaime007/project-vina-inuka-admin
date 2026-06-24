"use client";

import { useState } from "react";
import { Store, Lock } from "lucide-react";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export default function SettingsPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  function handleSave() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast("Definições guardadas.", "success");
    }, 600);
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 pb-20">
      <div>
        <h1 className="font-display text-[34px] text-ink">Definições</h1>
        <p className="mt-1 text-[15px] text-ink-soft">
          Informações básicas da loja.
        </p>
      </div>

      <div className="rounded-2xl border border-line-soft bg-surface p-7 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-brand-blush text-brand-rose-deep">
            <Store className="size-[18px]" strokeWidth={1.8} />
          </span>
          <h2 className="font-display text-xl text-ink">Dados da loja</h2>
        </div>

        <div className="mt-6 flex flex-col gap-5">
          <Input label="Nome da loja" defaultValue="Vina Inuka Cosméticos" />
          <Input label="Número de WhatsApp" defaultValue="+244 900 000 000" />
          <Input label="Email de contacto" defaultValue="ola@aurelie.pt" />
          <Textarea
            label="Morada / zona de entrega"
            placeholder="Ex: Luanda, Talatona…"
          />
        </div>

        <div className="mt-7 flex justify-end border-t border-line-soft pt-6">
          <Button onClick={handleSave} loading={loading}>
            Guardar alterações
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-line-soft bg-surface p-7 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-surface-sunken text-ink-soft">
            <Lock className="size-[18px]" strokeWidth={1.8} />
          </span>
          <h2 className="font-display text-xl text-ink">Segurança</h2>
        </div>
        <p className="mt-3 text-[14px] text-ink-soft">
          A alteração de palavra-passe e outras opções de segurança vão aparecer
          aqui em breve.
        </p>
      </div>
    </div>
  );
}
