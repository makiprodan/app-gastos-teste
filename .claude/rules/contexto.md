# Gestão de Contexto

## Regras

- Use `/clear` entre tarefas não relacionadas
- Use `/compact` quando o contexto estiver cheio
- Corrigiu 2x o mesmo problema → `/clear` e recomece com prompt melhor
- Delegue tarefas pesadas para subagents (preserva contexto principal)

## Modelos por Papel

| Papel | Modelo |
|---|---|
| Orquestrador / decisões | Opus |
| Subagents de execução | Sonnet 4.5 |
| Tasks com skill bem definida | Haiku 4.5 |
