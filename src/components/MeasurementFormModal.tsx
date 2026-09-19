"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { createMeasurement, updateMeasurementAction } from "@/app/actions";
import type { Measurement } from "@/types/measurement";

const CONTEXT_OPTIONS = [
  "Antes da alimentação",
  "Após a alimentação",
  "Antes da insulina",
  "Após a insulina",
  "Outro",
];

const fieldClass = "w-full rounded-lg border border-[#DCEBFA] p-2 text-sm";
const labelClass = "mb-1 block text-sm text-[#6F6B78]";

/** Converte "DD/MM/YYYY" (formato da planilha) para "YYYY-MM-DD" (valor esperado por <input type="date">). */
function toIsoDate(brDate: string): string {
  const [day, month, year] = brDate.split("/");
  return `${year}-${month}-${day}`;
}

type Props =
  | { mode: "create"; defaultPetName: string }
  | { mode: "edit"; measurement: Measurement; fullWidth?: boolean };

export function MeasurementFormModal(props: Props) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const titleId = useId();

  const isEdit = props.mode === "edit";

  // Move foco pro primeiro campo ao abrir, restaura o foco de disparo ao fechar (regra WCAG 2.4.3).
  useEffect(() => {
    if (open) {
      firstFieldRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const now = new Date();
  const defaultDate = isEdit ? toIsoDate(props.measurement.date) : now.toISOString().slice(0, 10);
  const defaultTime = isEdit ? props.measurement.time : now.toTimeString().slice(0, 5);
  const defaultPetName = isEdit ? props.measurement.petName : props.defaultPetName;

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        if (isEdit) {
          await updateMeasurementAction(props.measurement.id, formData);
          setSuccessMessage("Medição atualizada com sucesso.");
        } else {
          await createMeasurement(formData);
          formRef.current?.reset();
          setSuccessMessage("Medição registrada com sucesso.");
        }
        setOpen(false);
        setTimeout(() => setSuccessMessage(null), 4000);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Não foi possível salvar a medição.");
      }
    });
  }

  return (
    <>
      {isEdit ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={
            props.fullWidth
              ? "w-full rounded-lg border border-[#DCEBFA] py-2 text-center text-sm text-[#6F6B78]"
              : "text-sm text-[#6F6B78] underline decoration-dotted"
          }
        >
          Editar
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full bg-[#7C5FC4] px-5 py-2 text-sm font-semibold text-white shadow-sm"
        >
          + Nova medição
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-lg"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 id={titleId} className="text-lg font-semibold">
                {isEdit ? "Editar medição" : "Nova medição"}
              </h2>
              <button type="button" onClick={() => setOpen(false)} className="text-sm text-[#6F6B78]">
                Fechar
              </button>
            </div>

            <form ref={formRef} action={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="m-petName" className={labelClass}>Pet</label>
                <input
                  ref={firstFieldRef}
                  id="m-petName"
                  name="petName"
                  defaultValue={defaultPetName}
                  required
                  className={fieldClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="m-date" className={labelClass}>Data</label>
                  <input id="m-date" type="date" name="date" defaultValue={defaultDate} required className={fieldClass} />
                </div>
                <div>
                  <label htmlFor="m-time" className={labelClass}>Hora</label>
                  <input id="m-time" type="time" name="time" defaultValue={defaultTime} required className={fieldClass} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label htmlFor="m-glucose" className={labelClass}>Glicemia (mg/dL)</label>
                  <input
                    id="m-glucose"
                    type="number"
                    step="0.1"
                    min="0"
                    name="glucose"
                    defaultValue={isEdit ? props.measurement.glucose : undefined}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="m-insulin" className={labelClass}>Insulina (U)</label>
                  <input
                    id="m-insulin"
                    type="number"
                    step="0.1"
                    min="0"
                    name="insulin"
                    defaultValue={isEdit ? props.measurement.insulin : undefined}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="m-food" className={labelClass}>Alimentação (g)</label>
                  <input
                    id="m-food"
                    type="number"
                    step="1"
                    min="0"
                    name="food"
                    defaultValue={isEdit ? props.measurement.food : undefined}
                    className={fieldClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="m-context" className={labelClass}>Contexto</label>
                <select
                  id="m-context"
                  name="context"
                  className={fieldClass}
                  defaultValue={isEdit ? props.measurement.context ?? "" : ""}
                >
                  <option value="">Selecionar (opcional)</option>
                  {CONTEXT_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="m-notes" className={labelClass}>Observação</label>
                <textarea
                  id="m-notes"
                  name="notes"
                  rows={2}
                  defaultValue={isEdit ? props.measurement.notes ?? "" : ""}
                  className={fieldClass}
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-full bg-[#7C5FC4] py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {isPending ? "Salvando..." : "Salvar"}
              </button>
            </form>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#DDF1E7] px-4 py-2 text-sm text-[#252333] shadow-md">
          {successMessage}
        </div>
      )}
    </>
  );
}
