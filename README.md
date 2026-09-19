# 🐶 GlicoPet

Dashboard doméstico para acompanhamento da glicemia de um cachorro diabético: registro manual de medições, insulina e alimentação, com histórico visual, filtros por período/contexto e faixa de referência configurável.

Uso doméstico, um único tutor. **Não é ferramenta de diagnóstico, prescrição ou ajuste automático de dose** — sempre segue orientação do médico-veterinário.

No ar em: **https://glicopet.vercel.app**

## Funcionalidades

- Registro, edição e exclusão de medições (glicemia, insulina, alimentação, contexto, observação).
- Gráfico combinado de glicemia + insulina ao longo do tempo, com faixa de referência sombreada.
- Cards de resumo (média, última medição, mínimo/máximo, amplitude, tendência descritiva).
- Filtros por período (7/30/90 dias, 6 meses, tudo, personalizado) e contexto — aplicados no navegador, sem recarregar a página.
- Faixa de referência configurável, com alerta visual (cor + ícone) para medições fora da faixa.
- Perfil do pet (nome, foto, peso, idade, sexo, observações).
- Exportação do histórico filtrado em Excel, CSV ou PDF.
- Layout responsivo: tabela completa no desktop, lista de cards no celular.

## Stack técnica

- [Next.js 16](https://nextjs.org/) (App Router) + TypeScript + Tailwind CSS v4.
- [Google Sheets](https://www.google.com/sheets/about/) como banco de dados, acessado só pelo servidor via [service account](https://cloud.google.com/iam/docs/service-account-overview) (nunca pelo cliente).
- [Recharts](https://recharts.org/) para o gráfico, [`xlsx`](https://www.npmjs.com/package/xlsx) + [`jspdf`](https://github.com/parallax/jsPDF) para exportação.
- Deploy na [Vercel](https://vercel.com/), integrado ao GitHub.

## Como rodar localmente

Pré-requisitos: Node.js 20+, uma planilha do Google Sheets compartilhada com uma service account do Google Cloud (ver `CLAUDE.md` para os detalhes de arquitetura e `.env.local.example` se existir para as variáveis necessárias).

```bash
npm install
npm run dev
```

Ou, no Windows, dê duplo clique em `iniciar-localhost.bat` — ele sobe o servidor e abre o navegador automaticamente quando estiver pronto.

Acesse http://localhost:3000.

### Seed de dados (opcional, só planilha vazia)

```bash
node --env-file=.env.local scripts/seed.mjs
```

## Documentação do projeto

- **[`PRD.md`](./PRD.md)** — especificação de produto: visão, modelo de dados, telas, regras clínicas, critérios de aceitação.
- **[`CLAUDE.md`](./CLAUDE.md)** — arquitetura, convenções de código e regras de processo para trabalhar neste repositório com IA.
- **[`TODO.md`](./TODO.md)** — backlog vivo: o que já foi feito, débitos técnicos conhecidos, o que está fora do escopo do MVP.

## Estrutura

```
src/
  app/              # rotas (App Router), Server Actions
  components/       # componentes React
  services/         # dataService.ts — única camada que fala com o Google Sheets
  types/            # tipos TypeScript compartilhados
  utils/            # cálculos, filtros, exportação — sem lógica de UI
scripts/            # seed único, não roda em produção
```
