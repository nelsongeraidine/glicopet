"use client";

import { useState, useTransition } from "react";
import { updatePetProfileAction } from "@/app/actions";
import type { Pet } from "@/types/pet";

const fieldClass = "w-full rounded-lg border border-[#DCEBFA] p-2 text-sm";
const labelClass = "mb-1 block text-sm text-[#6F6B78]";

export function PetProfileSettings({ pet }: { pet: Pet | null }) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await updatePetProfileAction(formData);
        setEditing(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Não foi possível salvar o perfil.");
      }
    });
  }

  if (!editing) {
    return (
      <div className="mb-8 rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {pet?.photoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={pet.photoUrl}
                alt={pet?.name ? `Foto de ${pet.name}` : "Foto do pet"}
                className="h-12 w-12 rounded-full object-cover"
              />
            )}
            <div>
              <h2 className="text-lg font-semibold">Perfil do pet</h2>
              <p className="text-sm text-[#6F6B78]">
                {[
                  pet?.name,
                  pet?.weightKg !== undefined ? `${pet.weightKg} kg` : null,
                  pet?.birthDateOrAge,
                  pet?.sex,
                ]
                  .filter(Boolean)
                  .join(" · ") || "Perfil ainda não preenchido."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-sm text-[#6F6B78] underline decoration-dotted"
          >
            {pet ? "Editar" : "Preencher"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 rounded-2xl bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold">Perfil do pet</h2>
      <form action={handleSubmit} className="space-y-3">
        <div>
          <label className={labelClass}>Nome</label>
          <input name="name" defaultValue={pet?.name} className={fieldClass} />
        </div>

        <div>
          <label className={labelClass}>Foto (URL)</label>
          <input name="photoUrl" defaultValue={pet?.photoUrl} className={fieldClass} />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>Peso (kg)</label>
            <input type="number" step="0.1" name="weightKg" defaultValue={pet?.weightKg} className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Nascimento/Idade</label>
            <input name="birthDateOrAge" defaultValue={pet?.birthDateOrAge} className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Sexo</label>
            <input name="sex" defaultValue={pet?.sex} className={fieldClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Observações</label>
          <textarea name="notes" rows={2} defaultValue={pet?.notes} className={fieldClass} />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center gap-3">
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
        </div>
      </form>
    </div>
  );
}
