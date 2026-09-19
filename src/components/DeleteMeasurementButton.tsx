"use client";

import { useState, useTransition } from "react";
import { deleteMeasurementAction } from "@/app/actions";

export function DeleteMeasurementButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteMeasurementAction(id);
      setConfirming(false);
    });
  }

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-2 text-sm">
        <span className="text-[#6F6B78]">Tem certeza?</span>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="font-semibold text-red-600 disabled:opacity-60"
        >
          {isPending ? "Excluindo..." : "Confirmar"}
        </button>
        <button type="button" onClick={() => setConfirming(false)} className="text-[#6F6B78]">
          Cancelar
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="text-sm text-[#6F6B78] underline decoration-dotted"
    >
      Excluir
    </button>
  );
}
