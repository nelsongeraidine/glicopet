"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  // Único ponto de telemetria de erro que existe hoje (deploy solo na Vercel, sem serviço externo).
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center bg-[#F8F7FC] px-4 py-8">
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-[#6F6B78]">
          Não foi possível carregar os dados.
          <br />
          Verifique sua conexão e tente novamente.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-4 rounded-full bg-[#7C5FC4] px-5 py-2 text-sm font-semibold text-white shadow-sm"
        >
          Tentar novamente
        </button>
      </div>
    </main>
  );
}
