# Mapa do Sistema

> **Leia ANTES de modificar qualquer módulo.** Atualizado após cada feature.

## Módulos — Lib

### lib/prisma (src/lib/prisma.ts)
- **Faz:** Exporta instância singleton do PrismaClient com adapter Neon
- **Usa:** @prisma/adapter-neon, @neondatabase/serverless
- **Usado por:** Todos os actions

### lib/seed (src/lib/seed.ts)
- **Faz:** Seed de categorias padrão no primeiro acesso do usuário
- **Usa:** lib/prisma, lib/default-categories
- **Usado por:** (app)/layout.tsx

### lib/default-categories (src/lib/default-categories.ts)
- **Faz:** Define as 7 categorias padrão com ícones e cores
- **Usado por:** lib/seed

### lib/nav-items (src/lib/nav-items.ts)
- **Faz:** Define itens de navegação (href, label, icon) centralizados
- **Usado por:** sidebar, bottom-nav

### lib/format (src/lib/format.ts)
- **Faz:** formatCurrency — converte centavos para R$ formatado
- **Usado por:** dashboard-client, transaction-list, budget page, recurring-list

### lib/icons (src/lib/icons.ts)
- **Faz:** ICON_MAP e getIcon — mapeia nomes de ícones para componentes Lucide
- **Usado por:** icon-picker, category-list, transaction-list, budget page

### lib/colors (src/lib/colors.ts)
- **Faz:** COLOR_OPTIONS — paleta de cores para categorias
- **Usado por:** color-picker, category-form

### lib/check-recurring (src/lib/check-recurring.ts)
- **Faz:** Fallback para gerar recorrências ao abrir o app (caso cron falhe)
- **Usa:** lib/prisma
- **Usado por:** (app)/layout.tsx

### lib/validations/ (src/lib/validations/)
- **Faz:** Schemas Zod para validação
- **Arquivos:** category.ts, transaction.ts, recurring.ts
- **Usado por:** actions (categories, transactions, recurring), forms

## Módulos — Actions (Server Actions)

### actions/categories (src/actions/categories.ts)
- **Faz:** CRUD de categorias (getCategories, createCategory, updateCategory, deleteCategory)
- **Usa:** lib/prisma, lib/validations/category
- **Usado por:** categorias page, transaction-form, recurring-form, transaction-filters

### actions/transactions (src/actions/transactions.ts)
- **Faz:** CRUD de transações com filtros (getTransactions, createTransaction, updateTransaction, deleteTransaction)
- **Usa:** lib/prisma, lib/validations/transaction
- **Usado por:** transações page, transaction-filters

### actions/recurring (src/actions/recurring.ts)
- **Faz:** CRUD de recorrências + toggle ativar/desativar
- **Usa:** lib/prisma, lib/validations/recurring
- **Usado por:** recorrentes page

### actions/dashboard (src/actions/dashboard.ts)
- **Faz:** getDashboardData (resumo mensal) + getMonthlyHistory (últimos 6 meses)
- **Usa:** lib/prisma
- **Usado por:** dashboard page, dashboard-client

### actions/budget (src/actions/budget.ts)
- **Faz:** getBudgetData + updateBudget (orçamento por categoria)
- **Usa:** lib/prisma
- **Usado por:** orçamento page

## Módulos — Componentes

### sidebar (src/components/sidebar.tsx)
- **Faz:** Navegação lateral (desktop md+)
- **Usa:** lib/nav-items

### bottom-nav (src/components/bottom-nav.tsx)
- **Faz:** Navegação inferior (mobile <md)
- **Usa:** lib/nav-items

### header (src/components/header.tsx)
- **Faz:** Header com título e UserButton (Clerk)

### category-form (src/components/category-form.tsx)
- **Faz:** Formulário de criar/editar categoria
- **Usa:** icon-picker, color-picker, lib/validations/category

### category-list (src/components/category-list.tsx)
- **Faz:** Lista de categorias com ações (editar, excluir)
- **Usa:** lib/icons, actions/categories

### transaction-form (src/components/transaction-form.tsx)
- **Faz:** Formulário de criar/editar transação com máscara de moeda
- **Usa:** actions/categories, lib/validations/transaction

### transaction-list (src/components/transaction-list.tsx)
- **Faz:** Lista de transações com edição/exclusão inline
- **Usa:** lib/format, lib/icons, actions/transactions

### transaction-filters (src/components/transaction-filters.tsx)
- **Faz:** Filtros de transações (busca, tipo, categoria, período)
- **Usa:** actions/categories

### recurring-form (src/components/recurring-form.tsx)
- **Faz:** Formulário de criar/editar recorrência
- **Usa:** actions/categories, lib/validations/recurring

### recurring-list (src/components/recurring-list.tsx)
- **Faz:** Lista de recorrências com toggle e ações
- **Usa:** lib/format, lib/icons, actions/recurring

### icon-picker (src/components/icon-picker.tsx)
- **Faz:** Seletor de ícones Lucide para categorias
- **Usa:** lib/icons

### color-picker (src/components/color-picker.tsx)
- **Faz:** Seletor de cores para categorias
- **Usa:** lib/colors

### pwa-prompt (src/components/pwa-prompt.tsx)
- **Faz:** Prompt de instalação do PWA no mobile

## Módulos — Pages

### dashboard (src/app/(app)/page.tsx + dashboard-client.tsx)
- **Faz:** Tela inicial com cards (gastos, receitas, saldo), gráficos (pizza + barras)
- **Usa:** actions/dashboard, lib/format, Recharts

### transações (src/app/(app)/transacoes/)
- **Faz:** Lista, criação, edição e exclusão de transações com filtros
- **Usa:** transaction-form, transaction-list, transaction-filters, actions/transactions

### categorias (src/app/(app)/categorias/)
- **Faz:** CRUD de categorias
- **Usa:** category-form, category-list, actions/categories

### recorrentes (src/app/(app)/recorrentes/)
- **Faz:** CRUD de transações recorrentes
- **Usa:** recurring-form, recurring-list, actions/recurring

### orçamento (src/app/(app)/orcamento/)
- **Faz:** Orçamento por categoria com barra de progresso
- **Usa:** actions/budget, lib/format, lib/icons

### loading pages (src/app/(app)/**/loading.tsx)
- **Faz:** Skeleton loading em todas as páginas

## Módulos — API e Infra

### cron recurring (src/app/api/cron/recurring/route.ts)
- **Faz:** Cron diário que gera transações a partir de recorrências ativas
- **Usa:** lib/prisma
- **Configurado em:** vercel.json

### export CSV (src/app/api/export/csv/route.ts)
- **Faz:** Exporta transações filtradas para CSV (formato BR)
- **Usa:** lib/prisma

### middleware (src/middleware.ts)
- **Faz:** Protege rotas com Clerk (redireciona para login)

### PWA (public/manifest.json + src/app/sw.ts)
- **Faz:** Manifesto PWA + Service Worker para instalação e cache

## Fluxo de Dados

```
Browser → middleware (Clerk auth) → (app)/layout (seed + check-recurring + nav) → pages → Server Actions → Prisma → Neon
```

## Estrutura de Rotas

| Rota | Arquivo | Descrição |
|---|---|---|
| / | (app)/page.tsx | Dashboard |
| /transacoes | (app)/transacoes/page.tsx | Lista de transações |
| /categorias | (app)/categorias/page.tsx | CRUD categorias |
| /recorrentes | (app)/recorrentes/page.tsx | Transações recorrentes |
| /orcamento | (app)/orcamento/page.tsx | Orçamento por categoria |
| /sign-in | sign-in/[[...sign-in]] | Login (Clerk) |
| /sign-up | sign-up/[[...sign-up]] | Cadastro (Clerk) |

## APIs

| Rota | Método | Descrição |
|---|---|---|
| /api/cron/recurring | POST | Gera recorrências diárias (cron Vercel) |
| /api/export/csv | GET | Exporta transações para CSV |
