# Workflow — Fases do Projeto

Identifique a fase pelo estado dos arquivos. Siga automaticamente:

## Fase 0 — Playground
- **Quando:** `docs/playground.md` vazio ou sem conteúdo substancial
- Receba ideias, expanda, questione, sugira alternativas
- Registre tudo em `docs/playground.md`
- Quando houver: problema claro + público + funcionalidades → sugira avançar para PRD
- Skills disponíveis: brainstorming (Superpowers), GSD discuss-phase

## Fase 1 — PRD
- **Quando:** playground maduro, `docs/prd.md` não preenchido
- Gere PRD a partir do playground
- Inclua: problema, público, funcionalidades MVP, critérios de aceite, o que NÃO é MVP
- Modelo: Opus

## Fase 2 — Design Doc
- **Quando:** PRD preenchido, `docs/design-doc/` vazio
- Use skill `technical-design-doc-creator` (TLC)
- Baseie na stack definida em `docs/stacks.md`

## Fase 3 — Especificação + Tasks
- **Quando:** design doc existe, `docs/tasks/backlog.md` sem tasks
- Use skill `tlc-spec-driven` ou GSD plan-phase
- Gere tasks atômicas com critérios de aceite em `docs/tasks/backlog.md`
- Specs detalhadas em `docs/specs/`

## Fase 4 — Implementação
- **Quando:** tasks existem no backlog
- Implemente por ordem de prioridade/dependência
- Commite por task concluída
- Skills: coding-guidelines, GSD execute-phase
- Delegue para subagents (Sonnet/Haiku) em tarefas paralelas

## Fase 5 — Validação
- **Quando:** feature implementada
- Rode o projeto e confirme que funciona
- Skills: playwright-skill, test-driven-development (Superpowers)

## Fase 6 — Revisão
- **Quando:** validação passou
- Destaque pontos para revisão humana — foco: lógica de negócio
- Protótipo → revisão leve | Produção → revisão completa
