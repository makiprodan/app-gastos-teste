# Desenvolvimento — Git, Testes e Revisão

## Git

- Commite após cada task concluída
- Commite antes de mudanças grandes (save point)
- Mensagens em português, descritivas
- `.env` já está no `.gitignore` — nunca rastreie secrets

## Antes de Modificar Código

1. Leia `docs/mapa-do-sistema.md`
2. Identifique módulos afetados pela mudança
3. Leia os arquivos relacionados
4. Após implementar: atualize o mapa e AGENTS.MD se necessário

## Auto-verificação

- Rode o projeto após implementar
- Confirme que funciona antes de marcar task como concluída
- Se não há como testar automaticamente, avise o usuário

## Código é Rascunho

- Destaque pontos que precisam de revisão humana
- Foco da revisão humana: lógica de negócio

## Tasks (docs/tasks/)

Formato de cada task:

```markdown
### [T-NNN] Título da task
- **Status:** pendente | em andamento | concluída
- **Prioridade:** alta | média | baixa
- **Depende de:** T-XXX (ou nenhuma)
- **Critérios de aceite:**
  - [ ] Critério 1
  - [ ] Critério 2
```

- Mova entre `backlog.md` → `em-andamento.md` → `concluidas.md`
- Respeite dependências: não inicie task bloqueada
