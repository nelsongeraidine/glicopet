# PRD.md — GlicoPet
# Product Requirements Document
# Versão 3.1 — Especificação do produto (MVP)
Data de Atualização: 19-09-2026_Versão 3.10

## 0. Relação com o CLAUDE.md

Este arquivo define **o que** o produto deve fazer: visão, modelo de dados, regras de negócio, telas, critérios de aceitação.

Como o agente deve **trabalhar** (processo, sequência de implementação, arquitetura de pastas, comportamento) está em `CLAUDE.md`, não aqui. Evitar duplicar conteúdo entre os dois arquivos.

---

# 1. Informações do produto

**Nome:** GlicoPet
**Tagline:** Monitoramento glicêmico do seu melhor amigo
**Tipo:** Dashboard web responsivo
**Versão:** MVP 1.0
**Fonte de dados inicial:** Google Sheets
**Público:** Tutor de cachorro diabético

---

# 2. Visão do produto

O GlicoPet é uma aplicação para acompanhamento doméstico de medições glicêmicas de um cachorro diabético.

A aplicação transforma registros manuais em um histórico organizado e visual.

O usuário registra:

- glicemia;
- insulina;
- alimentação;
- data;
- horário;
- contexto;
- observações.

O dashboard mostra a evolução dos dados através de cards, gráficos, timeline, histórico e filtros.

O projeto deve ser simples e intuitivo.

---

# 3. Problema

Os dados de acompanhamento são registrados em momentos diferentes, sem frequência fixa.

Sem organização visual, é difícil responder rapidamente:

- qual foi a última glicemia;
- qual foi a menor;
- qual foi a maior;
- como os valores variaram;
- quantas medições foram realizadas;
- quanto de insulina foi registrado;
- quanto de alimentação foi registrada;
- como os dados se distribuíram ao longo do tempo.

O GlicoPet centraliza essas informações.

---

# 4. Objetivo principal

1. Registrar medições.
2. Armazenar os dados.
3. Visualizar a evolução da glicemia.
4. Acompanhar registros de insulina.
5. Acompanhar alimentação.
6. Consultar histórico.
7. Filtrar períodos.
8. Identificar tendências descritivas.
9. Exportar dados.
10. Facilitar a apresentação do histórico ao médico-veterinário.

---

# 5. Não objetivos

O GlicoPet NÃO deve:

- substituir o veterinário;
- diagnosticar doenças;
- prescrever tratamento;
- recomendar doses;
- alterar doses automaticamente;
- recomendar quantidade de alimento;
- interpretar uma medição isolada como diagnóstico;
- obrigar frequência fixa de medições.

---

# 6. Usuário

## Persona principal

Tutor de cachorro diabético que realiza medições domésticas e deseja organizar os registros.

O usuário pode não possuir conhecimento técnico sobre diabetes. Portanto:

- termos devem ser claros;
- unidades devem aparecer;
- ações devem ser óbvias;
- informações complexas devem ser evitadas.

---

# 7. Nome

**Nome oficial:** GlicoPet
**Tagline:** Monitoramento glicêmico do seu melhor amigo

Nomes alternativos considerados (não usar sem autorização explícita): PetGlic, GlicoDog, GlicoPet Care, Meu Pet Glicêmico, GlicosePet, PetGlico, Pet Diabetes Tracker.

---

# 8. Referências visuais

Três imagens em `assets/references/`, usadas como referência de direção, não para cópia literal.

## `referencia_paleta_1.png`

Fundo azul suave. Tela de dashboard com:

- gráfico de tendência combinando glicemia e insulina;
- filtros de período (semana / 2 semanas / mês / personalizado);
- botão de exportação (PDF);
- cards de média, última medição, mínimo e máximo;
- mascote cachorro.

Esta é a referência mais próxima do gráfico principal de glicemia (seção 17) e dos cards (seção 16).

## `referencia_paleta_2.png`

Fundo verde pastel. Tela de estatísticas com:

- glicemia média, mínimo e máximo;
- barra de "tempo dentro da faixa";
- cards de insulina e refeições;
- timeline vertical com ícones por tipo de evento;
- mascote gato.

Referência para a timeline (seção 21) e para o resumo do período (seção 22).

## `referencia_paleta_3.png`

Fundo lilás/rosa. Tela de onboarding (seleção de pet, campo de nome), mascotes estilo super-herói.

Referência apenas para o cadastro inicial do pet (seção 10) e para a paleta de cores (seção 9), não para o dashboard.

## Regra

Combinar esteticamente: pastel + profissional + pet-friendly + simples + claro. Evitar aparência infantil excessiva (os mascotes tipo super-herói das referências não devem ser copiados literalmente).

---

# 9. Design system

## Paleta

| Elemento | Cor |
|---|---|
| Lavanda / Lilás | `#B9A0E8` |
| Rosa pastel | `#F2B8C6` |
| Verde pastel | `#DDF1E7` |
| Azul suave | `#DCEBFA` |
| Fundo | `#F8F7FC` |
| Cards | `#FFFFFF` |
| Texto principal | `#252333` |
| Texto secundário | `#6F6B78` |

## Uso semântico

- Glicemia: verde/azul suave.
- Insulina: azul.
- Alimentação: lilás/rosa.
- Alertas: cor de destaque apenas quando necessário.
- Fundo: neutro e claro.

## Características

Moderno, limpo, acolhedor, pet-friendly, profissional, minimalista, arredondado, bastante espaço em branco. Não usar cores fortes em excesso. Não tornar o visual infantil.

---

# 10. Perfil do pet

## MVP

Um pet inicialmente. Campos:

- Nome;
- Foto;
- Peso (kg) — opcional;
- Data de nascimento/idade — opcional;
- Sexo — opcional;
- Observações — opcional.

O nome aparece no cabeçalho do dashboard:

```text
🐶 GlicoPet
Monitoramento do Thor
```

## Futuro

Arquitetura preparada para múltiplos pets (ver seção 32).

---

# 11. Modelo de dados

## Estrutura

| Campo | Tipo | Obrigatório |
|---|---|---:|
| ID | string/number | Sim |
| Nome do Pet | texto | Sim |
| Data | date | Sim |
| Hora | time | Sim |
| Data/Hora | datetime | Sim |
| Glicemia (mg/dL) | number | Não |
| Insulina (U) | number | Não |
| Alimentação (g) | number | Não |
| Contexto | enum/texto | Não |
| Observação | texto | Não |

---

# 12. Terminologia

Usar **Glicemia (mg/dL)**, não "Valor medido".
Usar **Insulina (U)**, não "Quantidade de unidades de insulina".
Usar **Alimentação (g)**, não "Quantidade em gramas de ração para diabético".

---

# 13. Frequência das medições

Não existe frequência fixa. O sistema aceita:

- 2 medições por dia;
- 1 medição por dia;
- 1 medição por semana;
- múltiplas medições no mesmo dia;
- vários dias sem medições.

### Requisito crítico

O sistema não pode interpretar a ausência de uma medição como erro. Não gerar dados automaticamente. Não preencher lacunas.

---

# 14. Nova medição

Botão: **+ Nova medição**

Campos:

- Pet;
- Data;
- Hora;
- Glicemia (mg/dL);
- Insulina (U);
- Alimentação (g);
- Contexto;
- Observação.

## Contexto

Opções: Antes da alimentação, Após a alimentação, Antes da insulina, Após a insulina, Outro.

## Regras

Todos os campos clínicos são independentes. É válido salvar qualquer combinação, incluindo glicemia preenchida com insulina e alimentação vazias.

---

# 15. Dashboard principal

## Cabeçalho

```text
🐶 GlicoPet
Monitoramento do Thor
```

## Filtro de período

7 dias, 30 dias, 90 dias, 6 meses, Tudo, Personalizado.

---

# 16. Cards

### Glicemia média
```text
135 mg/dL
Média do período
```

### Última medição
```text
138 mg/dL
Hoje, 10:42
```

### Menor
```text
98 mg/dL
```

### Maior
```text
172 mg/dL
```

### Total
```text
24
medições registradas
```

---

# 17. Gráfico de glicemia

Título: **Evolução da Glicemia**

Eixo Y: Glicemia em `mg/dL`.
Eixo X: Dia/horário.
Visualização: gráfico de linhas com pontos.

## Regras

- Cada medição gera um ponto.
- Pontos podem ser conectados.
- Várias medições no mesmo dia aparecem.
- Dias sem medição permanecem sem dados.
- Não criar valores.
- Não interpolar de modo enganoso.

---

# 18. Tooltip

Mostrar data, hora, glicemia, insulina, alimentação, contexto, observação. Exemplo:

```text
06/07/2026 – 07:30
Glicemia: 135 mg/dL
Insulina: 2 U
Alimentação: 80 g
Contexto: Antes da alimentação
```

Não mostrar campos inexistentes como se fossem preenchidos.

---

# 19. Gráfico de insulina

Título: **Insulina administrada**

Barras ou pontos. Eixo Y: `Insulina (U)`. Objetivo: visualizar a quantidade registrada ao longo do tempo. Não utilizar o gráfico para recomendar dose.

---

# 20. Alimentação

Seção **Alimentação**: mostrar gramas, data, horário, observação.

Indicador **Quantidade média de alimento por registro**:

```text
80 g
Média por alimentação
```

Não classificar automaticamente a quantidade como adequada ou inadequada.

---

# 21. Timeline

Timeline vertical, combinando glicemia, insulina e alimentação, ordenada por data/hora:

```text
07:30
🩸 135 mg/dL

07:35
💉 2 U

07:40
🍽️ 80 g
```

---

# 22. Resumo do período

Mostrar: quantidade de medições, glicemia média, menor, maior, amplitude glicêmica, média de insulina, média de alimentação, intervalo entre medições.

---

# 23. Tendência

Quando houver dados suficientes, produzir análise estatística descritiva. Textos permitidos:

```text
Os registros apresentam tendência de aumento no período.
Os registros apresentam tendência de redução no período.
Os valores apresentam grande variação entre as medições.
Não há dados suficientes para identificar uma tendência.
```

A aplicação permanece descritiva. Nunca converter a tendência em orientação médica (nunca escrever "o diabetes está piorando" ou "a dose deve ser aumentada").

---

# 24. Faixa de referência

Configuração: limite inferior e limite superior (exemplo: 80–150 mg/dL), definida pelo tutor conforme orientação veterinária.

O sistema pode identificar visualmente: abaixo, dentro, acima da faixa.

Mensagem obrigatória:

> Os limites exibidos são personalizados e não constituem recomendação médica.

---

# 25. Alertas

Exclusivamente informativos. Exemplo:

```text
Valor fora da faixa de referência configurada.
```

Nunca emitir diagnóstico, recomendação de dose ou recomendação de tratamento.

---

# 26. Histórico

Tabela: Data, Hora, Glicemia, Insulina, Alimentação, Contexto, Observação. Ordenar por mais recente primeiro.

Ações: editar, excluir. Confirmação antes de excluir:

```text
Tem certeza que deseja excluir esta medição?
```

---

# 27. Filtros

Período, data inicial, data final, contexto (Todas / Antes da alimentação / Após a alimentação / Antes da insulina / Após a insulina / Outro). Botão **Limpar filtros**.

---

# 28. Exportação

Botão **Exportar dados**. Formatos: Excel, CSV, PDF. Exportar somente os dados que correspondem aos filtros atuais.

---

# 29. Responsividade

- **Desktop:** dashboard completo.
- **Tablet:** reorganização de cards e gráficos.
- **Mobile:** cards empilhados, gráfico com rolagem horizontal quando necessária, botão de nova medição acessível, timeline em largura total.

---

# 30. Estados da interface

- **Loading:** indicador.
- **Empty:**
```text
Você ainda não possui medições registradas.
+ Registrar primeira medição
```
- **Error:**
```text
Não foi possível carregar os dados.
Verifique sua conexão e tente novamente.
```
- **Success:**
```text
Medição registrada com sucesso.
```

---

# 31. Segurança clínica

O sistema é somente diário, organizador, visualizador e analisador descritivo. Não é sistema de diagnóstico, prescrição ou ajuste de insulina.

## Proibições

Nunca: alterar dose automaticamente, sugerir aumento ou redução de dose, recomendar alimentação, diagnosticar, afirmar controle clínico baseado em uma única medição.

## Aviso obrigatório (rodapé)

> Este aplicativo é uma ferramenta de acompanhamento e registro. Não substitui o acompanhamento do médico-veterinário.

---

# 32. Fonte de dados

**Decisão:** Google Sheets (API nativa do Google), não arquivo Excel bruto no Drive.

Motivo: a API do Google Sheets permite leitura e escrita incremental por linha/célula, sem precisar baixar e reescrever um arquivo binário inteiro a cada operação. Isso reduz risco de conflito de escrita concorrente e latência, e evita reimplementar depois (o plano anterior prometia migrar de Excel para Sheets em versão futura; começar direto em Sheets elimina esse retrabalho).

A estrutura de colunas é a mesma da seção 11, em uma planilha do Google Sheets com uma aba por pet ou uma aba única com coluna "Nome do Pet" (decisão de implementação, ver CLAUDE.md).

## Requisito de portabilidade

A camada de acesso a dados deve ser abstraída (contrato definido no CLAUDE.md) para permitir substituição futura por Supabase, Firebase, SQL ou API própria sem alterar a UI.

## Autenticação (decidido)

Service account do Google Cloud com a planilha compartilhada em modo editor, não OAuth do usuário. Motivo: uso single-user, sem necessidade de tela de login nem risco de expiração de token em modo de teste. Credenciais em variáveis de ambiente (`.env.local` local, variáveis de ambiente da Vercel em produção), nunca no client nem versionadas.

---

# 33. Dados de demonstração

```text
Thor
06/07/2026 07:30
Glicemia: 135 mg/dL
Insulina: 2 U
Alimentação: 80 g

Thor
06/07/2026 18:20
Glicemia: 138 mg/dL
Insulina: 2 U
Alimentação: 80 g

Thor
07/07/2026 07:45
Glicemia: 128 mg/dL
Insulina: 2 U
Alimentação: 80 g
```

Identificar na interface como **Dados de demonstração**.

---

# 34. Critérios de aceitação

## CA-01 — Dashboard
Dado que existem registros, quando o usuário abre o dashboard, então os indicadores e visualizações são exibidos.

## CA-02 — Nova medição
Dado que o usuário está no dashboard, quando clicar em "+ Nova medição", então o formulário aparece.

## CA-03 — Registro
Quando o usuário salvar uma medição, então ela deve ser persistida na planilha.

## CA-04 — Frequência irregular
O sistema aceita qualquer intervalo entre medições.

## CA-05 — Mesmo dia
O sistema aceita duas ou mais medições no mesmo dia.

## CA-06 — Gráfico
O gráfico apresenta somente medições existentes.

## CA-07 — Histórico
O usuário consegue consultar registros anteriores.

## CA-08 — Edição
O usuário consegue editar um registro.

## CA-09 — Exclusão
O usuário consegue excluir um registro após confirmação.

## CA-10 — Filtro
O usuário consegue alterar o período.

## CA-11 — Exportação
O usuário consegue exportar dados filtrados.

## CA-12 — Responsividade
A aplicação funciona em desktop, tablet e celular.

## CA-13 — Dados incompletos
É possível salvar um registro com alguns campos opcionais vazios.

## CA-14 — Integridade
Nenhuma medição inexistente deve ser criada automaticamente.

---

# 35. Métricas de sucesso do MVP

O tutor consegue: cadastrar o pet, registrar uma medição rapidamente, consultar a última medição, visualizar evolução, consultar histórico, filtrar períodos, visualizar insulina, visualizar alimentação, exportar dados, apresentar os dados ao veterinário.

---

# 36. Roadmap futuro

## V2
Múltiplos pets, peso, consumo de água, frequência urinária, apetite, atividade, cetonas, anexos, fotos, observações clínicas.

## V3
Integração com sensores de glicose (se tecnicamente disponível), compartilhamento com veterinário, relatórios automáticos, PDF veterinário, autenticação, notificações.

## V4
Histórico de consultas, medicamentos, exames laboratoriais, múltiplos cuidadores, sincronização em nuvem.

---

# 37. Fora do escopo do MVP

Não implementar: IA para diagnóstico, ajuste automático de insulina, recomendação médica, prescrição, telemedicina, marketplace veterinário, integração com dispositivos complexos, gamificação excessiva.

---

# 38. Princípio final

O GlicoPet deve responder:

> "O que foi registrado e como esses registros estão evoluindo?"

Prioridade: **Simplicidade + Clareza + Fidelidade aos dados + Facilidade de uso.**
