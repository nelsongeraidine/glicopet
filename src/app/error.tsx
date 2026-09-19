"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 items-center justify-center px-4 py-8">
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-[#6F6B78]">
          Não foi possível carregar os dados.
          <br />
          Verifique sua conexão e tente novamente.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-4 rounded-full bg-[#B9A0E8] px-5 py-2 text-sm font-semibold text-white shadow-sm"
        >
          Tentar novamente
        </button>
      </div>
    </main>
  );
}
