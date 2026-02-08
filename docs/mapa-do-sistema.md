# Mapa do Sistema

> **Leia ANTES de modificar qualquer módulo.** Atualizado após cada feature.

## Módulos

### lib/prisma (src/lib/prisma.ts)
- **Faz:** Exporta instância singleton do PrismaClient com adapter Neon
- **Usa:** @prisma/adapter-neon, @neondatabase/serverless
- **Depende de:** generated/prisma (Prisma Client gerado)
- **Usado por:** Todos os módulos que acessam o banco

### lib/seed (src/lib/seed.ts)
- **Faz:** Seed de categorias padrão no primeiro acesso do usuário
- **Usa:** lib/prisma, lib/default-categories
- **Depende de:** prisma.category
- **Usado por:** (app)/layout.tsx

### lib/default-categories (src/lib/default-categories.ts)
- **Faz:** Define as 7 categorias padrão com ícones e cores
- **Usa:** nenhum
- **Usado por:** lib/seed

### lib/nav-items (src/lib/nav-items.ts)
- **Faz:** Define itens de navegação (href, label, icon) centralizados
- **Usa:** lucide-react
- **Usado por:** sidebar, bottom-nav

### middleware (src/middleware.ts)
- **Faz:** Protege rotas com Clerk (redireciona para login)
- **Usa:** @clerk/nextjs/server
- **Usado por:** Next.js (automático)

### layout raiz (src/app/layout.tsx)
- **Faz:** Layout raiz com ClerkProvider + Toaster
- **Usa:** @clerk/nextjs, @clerk/localizations, sonner
- **Usado por:** Todas as páginas

### layout app (src/app/(app)/layout.tsx)
- **Faz:** Layout autenticado com sidebar, header, bottom nav + seed
- **Usa:** @clerk/nextjs/server, lib/seed, sidebar, header, bottom-nav
- **Usado por:** Todas as páginas dentro de (app)/

### sidebar (src/components/sidebar.tsx)
- **Faz:** Navegação lateral (visível apenas desktop md+)
- **Usa:** lib/nav-items, next/navigation
- **Usado por:** (app)/layout.tsx

### bottom-nav (src/components/bottom-nav.tsx)
- **Faz:** Navegação inferior (visível apenas mobile <md)
- **Usa:** lib/nav-items, next/navigation
- **Usado por:** (app)/layout.tsx

### header (src/components/header.tsx)
- **Faz:** Header com título do app (mobile) e UserButton (Clerk)
- **Usa:** @clerk/nextjs
- **Usado por:** (app)/layout.tsx

### auth pages (src/app/sign-in/, src/app/sign-up/)
- **Faz:** Páginas de login e cadastro (Clerk hosted UI)
- **Usa:** @clerk/nextjs
- **Usado por:** middleware (redireciona usuários não autenticados)

## Fluxo de Dados

```
Browser → middleware (Clerk auth) → (app)/layout (seed + nav) → pages → Server Actions → Prisma → Neon
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
