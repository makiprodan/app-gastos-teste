# TDD — Gastei: Controle de Gastos Pessoais

| Campo | Valor |
|---|---|
| Tech Lead | @makiprodan |
| Status | Draft |
| Criado | 2026-02-08 |
| Atualizado | 2026-02-08 |

---

## Contexto

Gastei é um app web pessoal (single user) para controle financeiro do dia a dia. O objetivo é dar visibilidade sobre gastos, receitas e orçamento por categoria, com interface mobile-first instalável como PWA.

O app usa a stack padrão do projeto: Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui no front, Prisma + Neon (PostgreSQL) no back, e Clerk para autenticação.

## Definição do Problema

### Problemas que resolvemos

- **Sem visibilidade financeira**: Não saber para onde o dinheiro vai no mês
- **Sem controle de orçamento**: Gastar mais do que deveria em categorias específicas
- **Gastos recorrentes esquecidos**: Assinaturas e contas fixas que somam sem perceber

### Por que agora?

- Necessidade pessoal de controle financeiro prático
- Oportunidade de aprender a stack completa com um projeto real

## Escopo

### Em Escopo (MVP)

- Cadastro de gastos e receitas (CRUD completo)
- Categorias personalizáveis com ícone e cor
- Gastos/receitas recorrentes (lançamento automático mensal)
- Dashboard com resumo mensal e gráficos
- Orçamento por categoria com barra de progresso
- Filtros por período, categoria, tipo e busca textual
- Exportar transações para CSV
- PWA (instalável, responsivo, cache offline)
- Autenticação via Clerk

### Fora do Escopo (MVP)

- Multi-usuário / compartilhamento
- Integração com bancos (Open Finance)
- Importação de extrato bancário
- Metas de economia
- Contas a pagar/receber com vencimento
- Notificações push
- Tema escuro

---

## Solução Técnica

### Visão Geral da Arquitetura

App Next.js fullstack com App Router. Server Components para páginas, Server Actions para mutações, e API Routes para endpoints específicos (CSV export). Dados persistidos no Neon (PostgreSQL) via Prisma.

```
[Browser/PWA]
     │
     ├── Server Components (leitura de dados)
     ├── Server Actions (criar/editar/excluir)
     └── API Routes (exportar CSV)
            │
        [Prisma ORM]
            │
        [Neon PostgreSQL]
```

### Componentes Principais

- **Dashboard** (`/`): Tela inicial com resumo e gráficos
- **Transações** (`/transacoes`): Lista, filtros, busca e CRUD
- **Categorias** (`/categorias`): Gerenciar categorias
- **Recorrentes** (`/recorrentes`): Gerenciar gastos/receitas recorrentes
- **Orçamento** (`/orcamento`): Limites por categoria
- **Layout**: Sidebar/bottom nav, responsivo mobile-first

### Modelo de Dados

**Category**
- `id` (UUID, PK)
- `userId` (string, FK Clerk)
- `name` (string, unique por user)
- `icon` (string — nome do ícone Lucide)
- `color` (string — hex)
- `budgetLimit` (integer, nullable — em centavos)
- `createdAt`, `updatedAt`

**Transaction**
- `id` (UUID, PK)
- `userId` (string, FK Clerk)
- `categoryId` (UUID, FK Category)
- `type` (enum: EXPENSE, INCOME)
- `amount` (integer — em centavos)
- `description` (string, nullable)
- `date` (date)
- `isRecurring` (boolean — indica se veio de recorrência)
- `recurringId` (UUID, nullable, FK RecurringTransaction)
- `createdAt`, `updatedAt`

**RecurringTransaction**
- `id` (UUID, PK)
- `userId` (string, FK Clerk)
- `categoryId` (UUID, FK Category)
- `type` (enum: EXPENSE, INCOME)
- `amount` (integer — em centavos)
- `description` (string, nullable)
- `dayOfMonth` (integer, 1-31)
- `active` (boolean)
- `lastGeneratedAt` (date, nullable)
- `createdAt`, `updatedAt`

**Relações:**
- Category 1:N Transaction
- Category 1:N RecurringTransaction
- RecurringTransaction 1:N Transaction

**Índices:**
- `Transaction`: (userId, date), (userId, categoryId), (userId, type)
- `Category`: (userId, name) UNIQUE
- `RecurringTransaction`: (userId, active)

### Decisões sobre valores monetários

Todos os valores armazenados em **centavos (integer)** para evitar problemas de ponto flutuante. Conversão para reais apenas na camada de apresentação.

- R$ 150,00 → armazenado como `15000`
- R$ 9,99 → armazenado como `999`

### APIs e Endpoints

**Server Actions (mutações):**

| Action | Descrição |
|---|---|
| `createTransaction` | Cria gasto ou receita |
| `updateTransaction` | Edita transação existente |
| `deleteTransaction` | Remove transação (com confirmação no front) |
| `createCategory` | Cria nova categoria |
| `updateCategory` | Edita categoria |
| `deleteCategory` | Remove categoria (valida se tem transações) |
| `createRecurring` | Cria recorrência |
| `updateRecurring` | Edita recorrência |
| `toggleRecurring` | Ativa/desativa recorrência |
| `setBudgetLimit` | Define limite de orçamento por categoria |

**API Routes:**

| Endpoint | Método | Descrição |
|---|---|---|
| `/api/export/csv` | GET | Exporta transações filtradas para CSV |
| `/api/cron/recurring` | POST | Gera transações recorrentes (Vercel Cron) |

### Fluxo de Dados

**Cadastro de transação:**
1. Usuário preenche formulário (valor, tipo, categoria, data, descrição)
2. Front converte valor para centavos
3. Server Action valida dados e insere no banco
4. `revalidatePath` atualiza dashboard e lista
5. Toast de sucesso

**Geração de recorrências:**
1. Vercel Cron Job executa diariamente `/api/cron/recurring`
2. Busca recorrências ativas onde `dayOfMonth` = hoje
3. Verifica se já foi gerada no mês atual (`lastGeneratedAt`)
4. Cria transação com `isRecurring = true` e `recurringId`
5. Atualiza `lastGeneratedAt`

**Exportação CSV:**
1. Usuário aplica filtros na tela de transações
2. Clica "Exportar CSV"
3. GET `/api/export/csv` com query params dos filtros
4. API busca transações, formata como CSV (separador `;`, decimal `,`)
5. Retorna arquivo para download

### Gráficos

Biblioteca: **Recharts**

- **Pizza (PieChart)**: Gastos do mês agrupados por categoria, com % e valor
- **Barras (BarChart)**: Comparativo dos últimos 6 meses (gastos vs receitas)

### PWA

- `next-pwa` ou `@serwist/next` para configuração do Service Worker
- Manifest com ícones, nome "Gastei", cor tema verde
- Cache strategy: Network First para dados, Cache First para assets
- Offline: exibe dados da última sincronização

---

## Riscos

| Risco | Impacto | Probabilidade | Mitigação |
|---|---|---|---|
| Vercel Cron falha e recorrências não são geradas | Alto | Baixa | Verificação na abertura do app: se há recorrências pendentes, gera sob demanda |
| Dados offline ficam desatualizados | Médio | Média | Indicação visual de "dados offline" + sync ao reconectar |
| Categorias padrão duplicadas | Baixo | Baixa | Seed de categorias via middleware no primeiro acesso (verifica se já existem) |
| Performance com muitas transações | Médio | Baixa | Paginação no banco (cursor-based), índices adequados |
| Clerk free tier limitado | Baixo | Baixa | Single user = uso mínimo; monitorar uso |

---

## Plano de Implementação

| Fase | Tasks | Estimativa |
|---|---|---|
| **1. Setup** | Criar projeto Next.js, configurar Prisma + Neon, Clerk, Tailwind, shadcn/ui | 1d |
| **2. Banco** | Schema Prisma, migrations, seed de categorias padrão | 0.5d |
| **3. Layout** | Layout responsivo, sidebar/bottom nav, tema | 0.5d |
| **4. Categorias** | CRUD de categorias (página + server actions) | 0.5d |
| **5. Transações** | CRUD completo, listagem com paginação | 1d |
| **6. Dashboard** | Resumo mensal, cards, gráficos (pizza + barras) | 1d |
| **7. Recorrentes** | CRUD de recorrências, cron job, geração automática | 1d |
| **8. Orçamento** | Configurar limites, barra de progresso, alertas | 0.5d |
| **9. Filtros** | Filtros por período/categoria/tipo, busca textual | 0.5d |
| **10. CSV** | API route de exportação, botão de download | 0.5d |
| **11. PWA** | Manifest, service worker, cache, prompt de instalação | 0.5d |
| **12. Polish** | Responsividade, loading states, empty states, toasts | 1d |

**Estimativa total: ~8-9 dias**

---

## Considerações de Segurança

### Autenticação

- Clerk gerencia login/signup completo
- Middleware do Clerk protege todas as rotas (exceto sign-in/sign-up)
- Todas as queries filtram por `userId` do Clerk (isolamento de dados)

### Proteção de Dados

- **Em trânsito**: HTTPS via Vercel (automático)
- **Em repouso**: Neon criptografa dados no PostgreSQL
- **Secrets**: Variáveis de ambiente no Vercel, nunca no código

### Validação

- Server Actions validam todos os inputs (Zod)
- Valores monetários: integer positivo
- Strings: sanitizadas, tamanho máximo
- IDs: UUID válido, pertence ao userId autenticado

### CSRF / XSS

- Server Actions do Next.js têm proteção CSRF built-in
- React escapa HTML por padrão (prevenção XSS)

---

## Estratégia de Testes

| Tipo | Escopo | Abordagem |
|---|---|---|
| **E2E** | Fluxos críticos | Playwright: criar transação, ver dashboard, filtrar, exportar |
| **Manual** | UI/UX | Testar no celular (PWA), responsividade |

**Cenários E2E prioritários:**
- Criar gasto → aparece na lista e no dashboard
- Criar receita → saldo atualiza
- Definir orçamento → barra de progresso reflete
- Filtrar por período → lista atualiza
- Exportar CSV → arquivo baixa corretamente

---

## Monitoramento

- **Vercel Analytics**: Performance, Web Vitals
- **Vercel Logs**: Erros em Server Actions e API Routes
- **Sentry** (opcional futuro): Error tracking detalhado

---

## Plano de Rollback

- **Deploy**: Vercel mantém deploys anteriores, rollback com 1 clique
- **Banco**: Prisma migrations são reversíveis (`prisma migrate reset` em último caso)
- **Feature flags**: Não necessário no MVP (app pessoal)
