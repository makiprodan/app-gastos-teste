# PRD — Gastei: Controle de Gastos Pessoais

## Problema

Falta de visibilidade sobre para onde o dinheiro vai no dia a dia. Sem uma ferramenta simples e rápida, é difícil manter orçamento por categoria e controlar gastos recorrentes como assinaturas e aluguel.

## Público-alvo

- Uso pessoal (single user)
- Pessoa que quer controlar gastos de forma prática, direto do celular

## Funcionalidades MVP

### F1 — Cadastro de Transações
- Registrar gastos e receitas (valor, categoria, data, descrição)
- Editar e excluir transações
- Listagem com scroll infinito ou paginação

**Critérios de aceite:**
- [ ] Formulário com campos: valor (R$), tipo (gasto/receita), categoria, data, descrição
- [ ] Validação: valor obrigatório e positivo, categoria obrigatória, data obrigatória
- [ ] Edição inline ou via modal
- [ ] Exclusão com confirmação
- [ ] Lista ordenada por data (mais recente primeiro)

### F2 — Categorias Personalizáveis
- Categorias padrão pré-cadastradas (Alimentação, Transporte, Moradia, Lazer, Saúde, Educação, Outros)
- Criar, editar e excluir categorias
- Ícone e cor por categoria

**Critérios de aceite:**
- [ ] Categorias padrão criadas automaticamente no primeiro acesso
- [ ] CRUD completo de categorias
- [ ] Cada categoria tem nome, ícone e cor
- [ ] Não permitir excluir categoria com transações vinculadas (ou mover para "Outros")

### F3 — Gastos Recorrentes
- Cadastrar gasto/receita recorrente (mensal)
- Lançamento automático no início de cada mês
- Ativar/desativar recorrência

**Critérios de aceite:**
- [ ] Formulário de recorrência: valor, categoria, descrição, dia do mês
- [ ] Transações recorrentes geradas automaticamente
- [ ] Toggle para ativar/desativar sem excluir
- [ ] Indicação visual de que a transação veio de recorrência

### F4 — Dashboard e Resumo
- Resumo mensal: total gasto, total recebido, saldo
- Gráfico de pizza: gastos por categoria
- Gráfico de barras: evolução mensal (últimos 6 meses)
- Cards com indicadores rápidos

**Critérios de aceite:**
- [ ] Dashboard é a tela inicial do app
- [ ] Resumo do mês atual com total de gastos, receitas e saldo
- [ ] Gráfico de pizza interativo com % por categoria
- [ ] Gráfico de barras comparando gastos dos últimos 6 meses
- [ ] Dados atualizados em tempo real ao adicionar transação

### F5 — Orçamento por Categoria
- Definir limite mensal por categoria
- Barra de progresso visual (verde → amarelo → vermelho)
- Alerta visual ao atingir 80% e 100% do limite

**Critérios de aceite:**
- [ ] Configurar orçamento mensal por categoria
- [ ] Barra de progresso com cores (verde < 50%, amarelo 50-80%, vermelho > 80%)
- [ ] Badge de alerta nas categorias que ultrapassaram o limite
- [ ] Resumo de orçamento no dashboard

### F6 — Filtros e Busca
- Filtrar por período (semana, mês, intervalo customizado)
- Filtrar por categoria
- Filtrar por tipo (gasto/receita)
- Busca por descrição

**Critérios de aceite:**
- [ ] Seletor de período com presets (esta semana, este mês, últimos 3 meses)
- [ ] Date picker para intervalo customizado
- [ ] Filtro de categoria (multi-select)
- [ ] Filtro de tipo (gasto/receita/todos)
- [ ] Busca textual na descrição
- [ ] Filtros combináveis entre si

### F7 — Exportar CSV
- Exportar transações filtradas para arquivo CSV
- Download direto no navegador

**Critérios de aceite:**
- [ ] Botão "Exportar CSV" na tela de transações
- [ ] Respeita os filtros ativos
- [ ] Arquivo CSV com colunas: data, tipo, categoria, descrição, valor
- [ ] Formato de valor compatível com Excel (separador decimal)

### F8 — PWA
- Instalável no celular (Add to Home Screen)
- Interface responsiva e mobile-first
- Funcionar offline (leitura de dados em cache)

**Critérios de aceite:**
- [ ] Manifest.json configurado com ícones e tema
- [ ] Service Worker para cache de assets e dados
- [ ] Prompt de instalação no mobile
- [ ] Layout responsivo funcional em telas de 320px+
- [ ] Modo offline: visualizar dados já carregados

## O que NÃO é MVP

- Multi-usuário / compartilhamento
- Integração com bancos (Open Finance)
- Importação de extrato bancário
- Metas de economia
- Contas a pagar/receber com vencimento
- Notificações push
- Tema escuro (pode ser adicionado depois)

## Decisões Técnicas

- **Autenticação:** Clerk — mesmo sendo single user, protege os dados
- **Banco:** Neon (PostgreSQL) — estrutura relacional ideal para transações financeiras
- **Gráficos:** Recharts (leve, integra bem com React/Next.js)
- **PWA:** next-pwa ou Serwist para Service Worker
- **Valores monetários:** armazenados em centavos (integer) para evitar problemas de ponto flutuante

## Métricas de Sucesso

- App funcional e instalável no celular
- Cadastro de transação em menos de 10 segundos
- Dashboard carrega em menos de 2 segundos
