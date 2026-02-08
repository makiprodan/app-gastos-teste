# [Nome do Projeto] — Documentação para Agentes

> Atualizado automaticamente conforme o projeto evolui.

- **O que é:** [Descrição — o que faz, para quem]
- **Status:** Playground | PRD | Design Doc | Implementação | Produção
- **Stack:** Ver `docs/stacks.md`

## Arquitetura

```
[Atualizar quando a implementação começar]
```

## Estrutura do Projeto

```
src/
├── [pasta]/ — [descrição]
└── [pasta]/ — [descrição]
```

## Decisões de Design

- [Registrar decisões conforme são tomadas]

## Padrões e Convenções

- **Linguagem:** TypeScript
- **Estilo:** [definir conforme o projeto]
- **Nomenclatura:** [definir conforme o projeto]

## Como Rodar

```bash
npm install
npm run dev
# http://localhost:3000
```

## Integrações

| Serviço | Papel | Config |
|---|---|---|
| Clerk | Autenticação | `CLERK_*` no `.env` |
| Neon | Banco de dados | `DATABASE_URL` no `.env` |
| Vercel | Deploy | Auto-deploy via GitHub |

## Notas para Agentes

- Leia `docs/mapa-do-sistema.md` antes de modificar qualquer módulo
- Siga padrões existentes no código
- Documente a realidade, não o ideal
