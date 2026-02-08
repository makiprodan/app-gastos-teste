# Concluídas

> Histórico de tasks finalizadas.

---

## Fase 1 — Setup

### [T-001] Setup do projeto Next.js com dependências
- **Status:** concluída
- **Prioridade:** alta
- **Critérios de aceite:**
  - [x] Projeto Next.js (App Router) criado com TypeScript
  - [x] Tailwind CSS configurado
  - [x] shadcn/ui inicializado com componentes base
  - [x] Clerk configurado (middleware, provider, páginas sign-in/sign-up)
  - [x] Prisma instalado e conectado ao Neon (via adapter)
  - [x] Recharts instalado

### [T-002] Schema Prisma e migrations
- **Status:** concluída
- **Prioridade:** alta
- **Critérios de aceite:**
  - [x] Models: Category, Transaction, RecurringTransaction
  - [x] Enums: TransactionType (EXPENSE, INCOME)
  - [x] Migration executada no Neon sem erros

### [T-003] Seed de categorias padrão
- **Status:** concluída
- **Prioridade:** alta
- **Critérios de aceite:**
  - [x] Seed no primeiro acesso do usuário
  - [x] 7 categorias padrão com ícone e cor
  - [x] Sem duplicação ao re-executar

## Fase 2 — Layout

### [T-004] Layout responsivo e navegação
- **Status:** concluída
- **Prioridade:** alta
- **Critérios de aceite:**
  - [x] Sidebar no desktop, bottom nav no mobile
  - [x] Links: Dashboard, Transações, Categorias, Recorrentes, Orçamento
  - [x] Header com UserButton (Clerk)
  - [x] Navegação destaca a página ativa

## Fase 3 — Categorias

### [T-005] CRUD de categorias
- **Status:** concluída
- **Prioridade:** alta
- **Critérios de aceite:**
  - [x] Página `/categorias` lista categorias do usuário
  - [x] Criar/editar categoria com nome, ícone, cor
  - [x] Excluir com confirmação (bloqueia se tem transações)
  - [x] Server Actions com validação Zod

## Fase 4 — Transações

### [T-006] Criar e listar transações
- **Status:** concluída
- **Prioridade:** alta
- **Critérios de aceite:**
  - [x] Página `/transacoes` com lista ordenada por data
  - [x] Formulário com máscara de moeda brasileira
  - [x] Conversão para centavos antes de salvar
  - [x] Toast de sucesso

### [T-007] Editar e excluir transações
- **Status:** concluída
- **Prioridade:** alta
- **Critérios de aceite:**
  - [x] Editar via modal (pré-preenche campos)
  - [x] Excluir com dialog de confirmação
  - [x] Lista atualiza automaticamente

## Fase 5 — Dashboard

### [T-008] Dashboard com resumo mensal
- **Status:** concluída
- **Prioridade:** alta
- **Critérios de aceite:**
  - [x] Cards: total gastos, receitas, saldo
  - [x] Valores formatados em R$
  - [x] Indicação visual de saldo positivo/negativo
  - [x] Seletor de mês/ano

### [T-009] Gráficos do dashboard
- **Status:** concluída
- **Prioridade:** média
- **Critérios de aceite:**
  - [x] Gráfico de pizza: gastos por categoria
  - [x] Gráfico de barras: gastos vs receitas últimos 6 meses
  - [x] Responsivos com Recharts
  - [x] Cores correspondem às categorias

## Fase 6 — Recorrentes

### [T-010] CRUD de transações recorrentes
- **Status:** concluída
- **Prioridade:** média
- **Critérios de aceite:**
  - [x] Página `/recorrentes` com lista
  - [x] Criar/editar recorrência
  - [x] Toggle ativar/desativar
  - [x] Excluir com confirmação

### [T-011] Geração automática de recorrências
- **Status:** concluída
- **Prioridade:** média
- **Critérios de aceite:**
  - [x] API Route `/api/cron/recurring`
  - [x] Cron diário via vercel.json
  - [x] Fallback ao abrir o app

## Fase 7 — Orçamento

### [T-012] Orçamento por categoria
- **Status:** concluída
- **Prioridade:** média
- **Critérios de aceite:**
  - [x] Página `/orcamento` com limites por categoria
  - [x] Barra de progresso com cores (verde/amarelo/vermelho)
  - [x] Badge de alerta acima de 100%

## Fase 8 — Filtros e Busca

### [T-013] Filtros e busca na listagem de transações
- **Status:** concluída
- **Prioridade:** média
- **Critérios de aceite:**
  - [x] Filtro por período, categoria, tipo
  - [x] Busca textual na descrição
  - [x] Filtros combináveis

## Fase 9 — Exportação

### [T-014] Exportar transações para CSV
- **Status:** concluída
- **Prioridade:** baixa
- **Critérios de aceite:**
  - [x] Botão "Exportar CSV" na página de transações
  - [x] Respeita filtros ativos
  - [x] Formato BR (separador `;`, decimal `,`)

## Fase 10 — PWA

### [T-015] Configurar PWA
- **Status:** concluída
- **Prioridade:** baixa
- **Critérios de aceite:**
  - [x] Manifest.json configurado
  - [x] Service Worker configurado
  - [x] Prompt de instalação no mobile

## Fase 11 — Polish

### [T-016] Loading states, empty states e refinamentos
- **Status:** concluída
- **Prioridade:** baixa
- **Critérios de aceite:**
  - [x] Skeleton loading em todas as páginas
  - [x] Empty states para listas vazias
  - [x] Favicon e meta tags OG configurados
