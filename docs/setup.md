# Setup do Projeto

> Instruções para preparar um novo projeto a partir deste template.
> Execute uma única vez ao criar o projeto.

---

## 1. Criar o Projeto

**Opção A — Via Claude Code / terminal (recomendado):**

```bash
gh repo create nome-do-projeto --template makiprodan/template-projeto-ia --public --clone
cd nome-do-projeto
claude
```

**Opção B — Via GitHub:**
1. Acesse [github.com/makiprodan/template-projeto-ia](https://github.com/makiprodan/template-projeto-ia)
2. Clique "Use this template" → "Create a new repository"
3. Clone: `git clone <url-do-repo>`

---

## 2. Instalar Skills

As skills são ferramentas que a IA usa automaticamente nas fases do workflow.
Abra o terminal na pasta do projeto e execute:

### Skills TLC (Tech Leads Club)

```bash
npx @tech-leads-club/agent-skills
```

Quando perguntado:
- **Agente:** Claude Code
- **Modo:** symlink (recebe atualizações automáticas)
- **Skills recomendadas para instalar:**
  - `technical-design-doc-creator` — Gera design docs (Fase 2)
  - `tlc-spec-driven` — Especificação e tasks (Fase 3)
  - `coding-guidelines` — Padrões de código (Fase 4)
  - `playwright-skill` — Testes E2E (Fase 5)
  - `security-best-practices` — Revisão de segurança (Fase 6)
  - `domain-analysis` — Análise de codebase existente
  - `docs-writer` — Documentação

### GSD (Get Shit Done)

```bash
npx get-shit-done-cc
```

Quando perguntado:
- **Runtime:** Claude Code
- **Escopo:** local (apenas neste projeto)

Comandos disponíveis após instalar:
- `/gsd:new-project` — Inicialização completa
- `/gsd:discuss-phase` — Discussão (Playground)
- `/gsd:plan-phase` — Planejamento (Fase 3)
- `/gsd:execute-phase` — Execução paralela (Fase 4)
- `/gsd:verify-work` — Verificação (Fase 5)
- `/gsd:quick` — Tarefas rápidas (bug fixes, ajustes)

### Superpowers

No Claude Code, execute:
```
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
```

Skills disponíveis após instalar:
- `brainstorming` — Refinamento de ideias (Fase 0: Playground)
- `writing-plans` — Planos detalhados com tasks de 2-5 min
- `executing-plans` — Execução em batch com checkpoints
- `test-driven-development` — Ciclo RED-GREEN-REFACTOR
- `systematic-debugging` — Análise de causa raiz em 4 fases

---

## 3. Configurar Serviços Externos

### Neon (Banco de Dados)
1. Crie uma conta em [neon.tech](https://neon.tech)
2. Crie um novo projeto
3. Copie a `DATABASE_URL` da connection string

### Clerk (Autenticação)
1. Crie uma conta em [clerk.com](https://clerk.com)
2. Crie uma nova aplicação
3. Copie as chaves: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` e `CLERK_SECRET_KEY`

### Vercel (Deploy)
1. Crie uma conta em [vercel.com](https://vercel.com)
2. Conecte seu repositório GitHub
3. Vercel detecta Next.js automaticamente
4. Configure as variáveis de ambiente (mesmas do `.env`)

### Variáveis de Ambiente
1. Copie `.env.example` para `.env`: `cp .env.example .env`
2. Preencha as variáveis com as chaves dos serviços acima
3. **Nunca commite o `.env`** (já está no .gitignore)

---

## 4. Começar a Usar

```bash
claude
```

Diga "oi" ou descreva sua ideia. A IA lê o CLAUDE.md e toma conta do resto.

---

## Referências

- **Skills TLC:** [tech-leads-club.github.io/agent-skills](https://tech-leads-club.github.io/agent-skills/)
- **GSD:** [github.com/glittercowboy/get-shit-done](https://github.com/glittercowboy/get-shit-done)
- **Superpowers:** [github.com/obra/superpowers](https://github.com/obra/superpowers)
- **Neon:** [neon.tech](https://neon.tech)
- **Clerk:** [clerk.com](https://clerk.com)
- **Vercel:** [vercel.com](https://vercel.com)
- **Best Practices Claude Code:** [code.claude.com/docs/en/best-practices](https://code.claude.com/docs/en/best-practices)
