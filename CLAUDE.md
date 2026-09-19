# CLAUDE.md — GlicoPet
Data de Atualização: 19-09-2026_Versão 4.01

## Visão geral

GlicoPet é um dashboard web para acompanhamento doméstico da glicemia de um cachorro diabético: registro manual de medições, insulina e alimentação, com histórico visual. Uso doméstico, um único tutor. Nunca diagnóstico, prescrição ou ajuste automático de dose.

Regra de ouro antes de adicionar qualquer funcionalidade: "isso ajuda o tutor a registrar ou compreender melhor os dados do pet?" Se não, não entra no MVP.

## Arquitetura em uma página

Next.js 16 (App Router) + TypeScript + Tailwind, deploy na Vercel.
Fonte de dados: Google Sheets, acessado só pelo servidor via service account (`src/services/dataService.ts`); credenciais em `.env.local`, nunca no client nem commitadas.
Contrato do `dataService`: `getMeasurements / addMeasurement / updateMeasurement / deleteMeasurement / getPetProfile`. A UI nunca fala diretamente com o Sheets, sempre passa por essas funções.
Estrutura: `/src/app` (rotas), `/src/services` (dataService), `/src/types`, `/src/utils`, `/scripts` (seed único, não roda em produção).

## Escopo do projeto

O que o produto deve fazer está inteiramente em `@PRD.md` (visão, modelo de dados, telas, regras clínicas, critérios de aceitação). Este arquivo não duplica esse conteúdo — na dúvida sobre comportamento de produto, ler o PRD, não assumir.
Pendências e backlog vivo estão em `@TODO.md`.

## Regras de comportamento

1. Propor um plano antes de executar quando a mudança envolver: modelo de dados, credenciais/segurança, exclusão ou sobrescrita de algo existente, ou início de uma nova área de funcionalidade. Trabalho rotineiro dentro de uma área já combinada (ex: próximo item do `TODO.md`) segue direto, com aviso do que foi feito, sem esperar aprovação prévia.
2. Nunca adicionar biblioteca, CDN ou pacote novo sem consultar antes.
3. Comentários em português, só quando explicam o "porquê", nunca o "o quê".
4. Antes de criar arquivo novo além de `PRD.md` / `CLAUDE.md` / `TODO.md`, justificar por que ele precisa existir (não se aplica a arquivo de código do projeto em si, que é necessário por natureza).
5. Se um pedido conflitar com o `PRD.md`, avisar antes de implementar.
6. Toda atualização relevante deste arquivo ou do `PRD.md` leva data e versão no cabeçalho (`Data de Atualização: DD-MM-YYYY_Versão X.XX`).

## Convenções de código

TypeScript estrito, sem `any` não justificado. Componentes em PascalCase, funções/variáveis em camelCase, arquivos de rota em minúsculo (padrão Next.js App Router).
Nenhuma lógica de negócio em componente visual; cálculos ficam em `/src/utils`.
Sem overengineering: resolver o problema do MVP, não o hipotético (ver PRD seção 37, fora do escopo).
Critério de pronto de uma funcionalidade: implementada, integrada, funciona com dado real ou de demonstração, trata erro, funciona em desktop e mobile, não viola regra clínica (PRD seção 31).

## Como rodar

`npm install` → `npm run dev` (ou clique duplo em `iniciar-localhost.bat`) → http://localhost:3000
Seed único, só se a planilha estiver vazia: `node --env-file=.env.local scripts/seed.mjs`

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
