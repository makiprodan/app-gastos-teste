# Decisões

> Registrar decisões importantes com contexto e motivo.

## Formato

### D-NNN: Título
- **Data:** YYYY-MM-DD
- **Decisão:** O que foi decidido
- **Motivo:** Por que esta opção
- **Alternativas descartadas:** O que foi considerado

---

### D-001: Valores monetários em centavos (integer)
- **Data:** 2026-02-08
- **Decisão:** Armazenar todos os valores como integer em centavos (R$ 10,50 = 1050)
- **Motivo:** Evitar problemas de ponto flutuante com float/decimal em operações financeiras
- **Alternativas descartadas:** Decimal no banco (mais complexo, Prisma tem limitações com Decimal)

### D-002: Recharts para gráficos
- **Data:** 2026-02-08
- **Decisão:** Usar Recharts como biblioteca de gráficos
- **Motivo:** Leve, boa integração com React/Next.js, componentes declarativos, boa documentação
- **Alternativas descartadas:** Chart.js (mais pesado), D3 (complexo demais para o caso)

### D-003: Server Actions para mutações
- **Data:** 2026-02-08
- **Decisão:** Usar Server Actions do Next.js ao invés de API Routes para CRUD
- **Motivo:** Menos boilerplate, proteção CSRF built-in, revalidação automática, tipo seguro
- **Alternativas descartadas:** API Routes REST (mais código, necessidade de fetch manual)

### D-004: Vercel Cron para recorrências
- **Data:** 2026-02-08
- **Decisão:** Usar Vercel Cron Jobs para gerar transações recorrentes diariamente
- **Motivo:** Integrado ao deploy, sem infra extra, free tier suficiente
- **Alternativas descartadas:** Gerar sob demanda ao abrir o app (risco de inconsistência)
