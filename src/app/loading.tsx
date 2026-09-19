export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 items-center justify-center px-4 py-8">
      <div className="flex flex-col items-center gap-3 text-[#6F6B78]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#DCEBFA] border-t-[#B9A0E8]" />
        <p className="text-sm">Carregando...</p>
      </div>
    </main>
  );
}
