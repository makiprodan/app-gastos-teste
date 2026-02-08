# Organização — Limites e Auto-atualização

## Limites de Tamanho

| Arquivo | Máximo |
|---|---|
| `CLAUDE.md` | 60 linhas |
| `AGENTS.MD` | 150 linhas |
| Rules (cada) | 80 linhas |
| Docs (cada) | 200 linhas |
| Diário | Sem limite (consulta sob demanda) |

- Se um arquivo ultrapassar o limite: divida em partes menores e atualize ponteiros
- Priorize cortar o que Claude pode inferir sozinho

## Auto-atualização

Atualize automaticamente estes arquivos conforme o projeto evolui:

| Arquivo | Quando atualizar |
|---|---|
| `CLAUDE.md` | Ao identificar melhoria nas regras ou nova preferência do usuário |
| `AGENTS.MD` | Ao mudar arquitetura, tecnologias ou padrões |
| `docs/mapa-do-sistema.md` | Após cada feature implementada |
| `docs/progresso.md` | Após cada tarefa concluída e ao fim de sessão |
| `docs/decisoes.md` | Ao tomar decisão significativa |

## Formato de Escrita

- Use imperativo: "Atualize o mapa" (não "você deve atualizar o mapa")
- Use bullets, não parágrafos
- Inclua apenas o que Claude não pode inferir do código
- Documente a realidade do código, não o ideal
