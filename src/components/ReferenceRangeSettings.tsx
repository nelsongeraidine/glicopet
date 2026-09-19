"use client";

import { useState, useTransition } from "react";
import { updateReferenceRangeAction } from "@/app/actions";

export function ReferenceRangeSettings({
  min,
  max,
}: {
  min?: number;
  max?: number;
}) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await updateReferenceRangeAction(formData);
        setEditing(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Não foi possível salvar a faixa.");
      }
    });
  }

  const isConfigured = min !== undefined && max !== undefined;

  if (!editing) {
    return (
      <div className="mb-8 rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Faixa de referência</h2>
            {isConfigured ? (
              <p className="text-sm text-[#6F6B78]">
                {min}–{max} mg/dL
              </p>
            ) : (
              <p className="text-sm text-[#6F6B78]">Nenhuma faixa configurada.</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-sm text-[#6F6B78] underline decoration-dotted"
          >
            {isConfigured ? "Editar" : "Configurar"}
          </button>
        </div>
        {isConfigured && (
          <p className="mt-2 text-xs text-[#6F6B78]">
            Os limites exibidos são personalizados e não constituem recomendação médica.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mb-8 rounded-2xl bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold">Faixa de referência</h2>
      <form action={handleSubmit} className="flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-sm text-[#6F6B78]">Limite inferior (mg/dL)</label>
          <input
            type="number"
            step="1"
            name="referenceRangeMin"
            defaultValue={min}
            required
            className="w-32 rounded-lg border border-[#DCEBFA] p-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-[#6F6B78]">Limite superior (mg/dL)</label>
          <input
            type="number"
            step="1"
            name="referenceRangeMax"
            defaultValue={max}
            required
            className="w-32 rounded-lg border border-[#DCEBFA] p-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-[#B9A0E8] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isPending ? "Salvando..." : "Salvar"}
        </button>
        <button type="button" onClick={() => setEditing(false)} className="text-sm text-[#6F6B78]">
          Cancelar
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <p className="mt-2 text-xs text-[#6F6B78]">
        A faixa deve ser configurada conforme orientação do médico-veterinário.
      </p>
    </div>
  );
}
