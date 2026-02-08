# Stacks do Projeto

> Tecnologias padrão. Podem ser ajustadas na fase de PRD conforme o tipo de projeto.

## Stack Padrão

### Front-end
- **Framework:** Next.js (App Router)
- **Linguagem:** TypeScript
- **Estilo:** Tailwind CSS
- **Componentes:** shadcn/ui

### Back-end
- **Runtime:** Node.js (via Next.js API Routes / Server Actions)
- **ORM:** Prisma

### Banco de Dados
- **Neon** (PostgreSQL serverless)

### Autenticação e Usuários
- **Clerk** (plataforma completa, free até 10k users/mês)
- Sincroniza com Neon via webhook quando necessário

### Infra e Deploy
- **Repositório:** GitHub
- **Deploy:** Vercel (auto-deploy via push para GitHub)
- **Domínio:** Vercel (subdomínio grátis) ou domínio próprio

### Ferramentas de Desenvolvimento
- **Editor/IA:** Claude Code (orquestrador principal)
- **Testes E2E:** Playwright
- **Linting:** ESLint + Prettier (configuração padrão Next.js)

---

## Alternativas por Tipo de Projeto

| Tipo de projeto | Stack sugerida |
|---|---|
| Site estático / blog | Astro + Tailwind + Markdown |
| App web completo | Next.js + Neon + Clerk (padrão) |
| Landing page simples | Next.js ou Astro |
| API / backend puro | Node.js + Express + Prisma + Neon |

---

## Variáveis de Ambiente Necessárias

```env
# Neon (banco de dados)
DATABASE_URL=

# Clerk (autenticação)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```
