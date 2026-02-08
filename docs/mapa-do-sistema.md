# Mapa do Sistema

> **Leia ANTES de modificar qualquer módulo.** Atualizado após cada feature.

## Módulos

### lib/prisma (src/lib/prisma.ts)
- **Faz:** Exporta instância singleton do PrismaClient com adapter Neon
- **Usa:** @prisma/adapter-neon, @neondatabase/serverless
- **Depende de:** generated/prisma (Prisma Client gerado)
- **Usado por:** Todos os módulos que acessam o banco

### middleware (src/middleware.ts)
- **Faz:** Protege rotas com Clerk (redireciona para login)
- **Usa:** @clerk/nextjs/server
- **Depende de:** nenhum
- **Usado por:** Next.js (automático)

### layout (src/app/layout.tsx)
- **Faz:** Layout raiz com ClerkProvider + Toaster
- **Usa:** @clerk/nextjs, @clerk/localizations, sonner
- **Depende de:** globals.css, componentes ui
- **Usado por:** Todas as páginas

### auth pages (src/app/sign-in/, src/app/sign-up/)
- **Faz:** Páginas de login e cadastro (Clerk hosted UI)
- **Usa:** @clerk/nextjs
- **Depende de:** layout
- **Usado por:** middleware (redireciona usuários não autenticados)

## Fluxo de Dados

```
Browser → middleware (Clerk auth) → pages/layouts → Server Actions → Prisma → Neon PostgreSQL
```

## Dependências

| Módulo | Depende de | Usado por |
|---|---|---|
| lib/prisma | generated/prisma | server actions (futuro) |
| middleware | @clerk/nextjs | Next.js |
| layout | ClerkProvider, Toaster | todas as páginas |
