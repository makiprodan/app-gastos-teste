# Backlog

> Tasks priorizadas. Ver formato em `.claude/rules/desenvolvimento.md`.

---

## Fase 1 — Setup

### [T-001] Setup do projeto Next.js com dependências
- **Status:** concluída
- **Prioridade:** alta
- **Depende de:** nenhuma
- **Critérios de aceite:**
  - [x] Projeto Next.js (App Router) criado com TypeScript
  - [x] Tailwind CSS configurado
  - [x] shadcn/ui inicializado com componentes base (Button, Input, Dialog, Select, Sonner)
  - [x] Clerk configurado (middleware, provider, páginas sign-in/sign-up)
  - [x] Prisma instalado e conectado ao Neon (via adapter)
  - [x] Recharts instalado
  - [x] Variáveis de ambiente configuradas (.env.local com placeholders)
  - [x] TypeScript compila sem erros (app precisa de chaves Clerk/Neon reais para rodar)

### [T-002] Schema Prisma e migrations
- **Status:** concluída
- **Prioridade:** alta
- **Depende de:** T-001
- **Critérios de aceite:**
  - [x] Models: Category, Transaction, RecurringTransaction
  - [x] Enums: TransactionType (EXPENSE, INCOME)
  - [x] Relações: Category 1:N Transaction, Category 1:N RecurringTransaction, RecurringTransaction 1:N Transaction
  - [x] Índices: (userId, date), (userId, categoryId), (userId, type), (userId, name) UNIQUE
  - [x] Valores monetários como Int (centavos)
  - [x] Migration executada no Neon sem erros

### [T-003] Seed de categorias padrão
- **Status:** pendente
- **Prioridade:** alta
- **Depende de:** T-002
- **Critérios de aceite:**
  - [ ] Script de seed ou lógica no primeiro acesso
  - [ ] Categorias: Alimentação, Transporte, Moradia, Lazer, Saúde, Educação, Outros
  - [ ] Cada categoria com ícone (Lucide) e cor (hex) definidos
  - [ ] Seed não duplica categorias se executado novamente

## Fase 2 — Layout

### [T-004] Layout responsivo e navegação
- **Status:** pendente
- **Prioridade:** alta
- **Depende de:** T-001
- **Critérios de aceite:**
  - [ ] Layout com sidebar no desktop e bottom navigation no mobile
  - [ ] Links: Dashboard, Transações, Categorias, Recorrentes, Orçamento
  - [ ] Header com nome do app e avatar/menu do usuário (Clerk UserButton)
  - [ ] Responsivo: funcional a partir de 320px
  - [ ] Navegação destaca a página ativa

## Fase 3 — Categorias

### [T-005] CRUD de categorias
- **Status:** pendente
- **Prioridade:** alta
- **Depende de:** T-003, T-004
- **Critérios de aceite:**
  - [ ] Página `/categorias` lista todas as categorias do usuário
  - [ ] Criar categoria: nome, ícone (seletor de ícones Lucide), cor (color picker)
  - [ ] Editar categoria via modal
  - [ ] Excluir categoria com confirmação (bloqueia se tem transações vinculadas)
  - [ ] Validação: nome obrigatório, único por usuário
  - [ ] Server Actions com validação Zod

## Fase 4 — Transações

### [T-006] Criar e listar transações
- **Status:** pendente
- **Prioridade:** alta
- **Depende de:** T-005
- **Critérios de aceite:**
  - [ ] Página `/transacoes` com lista ordenada por data (mais recente primeiro)
  - [ ] Formulário: valor (R$), tipo (gasto/receita), categoria (select), data, descrição
  - [ ] Input de valor com máscara de moeda brasileira (R$ 0,00)
  - [ ] Validação: valor obrigatório e positivo, categoria obrigatória, data obrigatória
  - [ ] Conversão para centavos antes de salvar
  - [ ] Paginação ou scroll infinito
  - [ ] Toast de sucesso ao criar

### [T-007] Editar e excluir transações
- **Status:** pendente
- **Prioridade:** alta
- **Depende de:** T-006
- **Critérios de aceite:**
  - [ ] Editar transação via modal (pré-preenche campos)
  - [ ] Excluir transação com dialog de confirmação
  - [ ] Lista atualiza automaticamente após edição/exclusão
  - [ ] Toast de feedback

## Fase 5 — Dashboard

### [T-008] Dashboard com resumo mensal
- **Status:** pendente
- **Prioridade:** alta
- **Depende de:** T-006
- **Critérios de aceite:**
  - [ ] Página `/` (dashboard) é a tela inicial
  - [ ] Cards: total de gastos, total de receitas, saldo do mês
  - [ ] Valores formatados em R$ (ex: R$ 1.250,00)
  - [ ] Indicação visual: saldo positivo (verde), negativo (vermelho)
  - [ ] Seletor de mês/ano para navegar entre meses

### [T-009] Gráficos do dashboard
- **Status:** pendente
- **Prioridade:** média
- **Depende de:** T-008
- **Critérios de aceite:**
  - [ ] Gráfico de pizza: gastos por categoria com % e valor
  - [ ] Gráfico de barras: gastos vs receitas dos últimos 6 meses
  - [ ] Gráficos responsivos (Recharts com ResponsiveContainer)
  - [ ] Cores dos gráficos de pizza correspondem às cores das categorias
  - [ ] Estado vazio quando não há dados

## Fase 6 — Recorrentes

### [T-010] CRUD de transações recorrentes
- **Status:** pendente
- **Prioridade:** média
- **Depende de:** T-005
- **Critérios de aceite:**
  - [ ] Página `/recorrentes` lista recorrências do usuário
  - [ ] Criar: valor, tipo, categoria, descrição, dia do mês
  - [ ] Editar via modal
  - [ ] Toggle ativar/desativar sem excluir
  - [ ] Excluir com confirmação
  - [ ] Indicação visual: ativa (verde) / inativa (cinza)

### [T-011] Geração automática de recorrências
- **Status:** pendente
- **Prioridade:** média
- **Depende de:** T-010
- **Critérios de aceite:**
  - [ ] API Route `/api/cron/recurring` (POST)
  - [ ] Busca recorrências ativas onde dayOfMonth = dia atual
  - [ ] Verifica lastGeneratedAt para não duplicar no mês
  - [ ] Cria transação com isRecurring=true e recurringId
  - [ ] Atualiza lastGeneratedAt
  - [ ] Configurar vercel.json com cron schedule diário
  - [ ] Fallback: verificação ao abrir o app

## Fase 7 — Orçamento

### [T-012] Orçamento por categoria
- **Status:** pendente
- **Prioridade:** média
- **Depende de:** T-006
- **Critérios de aceite:**
  - [ ] Página `/orcamento` lista categorias com seus limites
  - [ ] Definir/editar limite mensal por categoria (campo budgetLimit)
  - [ ] Barra de progresso: verde (<50%), amarelo (50-80%), vermelho (>80%)
  - [ ] Badge de alerta nas categorias que ultrapassaram 100%
  - [ ] Resumo de orçamento no dashboard (T-008)
  - [ ] Valores gasto vs limite formatados em R$

## Fase 8 — Filtros e Busca

### [T-013] Filtros e busca na listagem de transações
- **Status:** pendente
- **Prioridade:** média
- **Depende de:** T-006
- **Critérios de aceite:**
  - [ ] Seletor de período: presets (esta semana, este mês, últimos 3 meses) + intervalo customizado
  - [ ] Date picker para intervalo customizado
  - [ ] Filtro de categoria (multi-select)
  - [ ] Filtro de tipo (gasto/receita/todos)
  - [ ] Busca textual na descrição
  - [ ] Filtros combináveis entre si
  - [ ] URL atualiza com query params (compartilhável/bookmarkável)

## Fase 9 — Exportação

### [T-014] Exportar transações para CSV
- **Status:** pendente
- **Prioridade:** baixa
- **Depende de:** T-013
- **Critérios de aceite:**
  - [ ] Botão "Exportar CSV" na página de transações
  - [ ] Respeita filtros ativos
  - [ ] API Route GET `/api/export/csv`
  - [ ] Colunas: Data, Tipo, Categoria, Descrição, Valor
  - [ ] Separador `;` e decimal `,` (compatível com Excel BR)
  - [ ] Download automático do arquivo

## Fase 10 — PWA

### [T-015] Configurar PWA
- **Status:** pendente
- **Prioridade:** baixa
- **Depende de:** T-008
- **Critérios de aceite:**
  - [ ] Manifest.json: nome "Gastei", ícones, cor tema
  - [ ] Service Worker configurado (next-pwa ou Serwist)
  - [ ] Cache: Network First para dados, Cache First para assets
  - [ ] Prompt de instalação no mobile
  - [ ] Modo offline: exibe dados da última sincronização com aviso visual
  - [ ] Layout funcional em telas 320px+

## Fase 11 — Polish

### [T-016] Loading states, empty states e refinamentos
- **Status:** pendente
- **Prioridade:** baixa
- **Depende de:** T-015
- **Critérios de aceite:**
  - [ ] Skeleton loading em todas as páginas
  - [ ] Empty states com ilustração/texto para listas vazias
  - [ ] Toasts de feedback em todas as ações
  - [ ] Animações sutis (transições de página, hover)
  - [ ] Teste manual no celular (responsividade final)
  - [ ] Favicon e meta tags (OG) configurados
