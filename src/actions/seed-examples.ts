"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function seedExampleData() {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autenticado");

  // Buscar categorias do usuário
  const categories = await prisma.category.findMany({ where: { userId } });
  const catMap = Object.fromEntries(categories.map((c) => [c.name, c.id]));

  // Verificar se já tem transações (evitar duplicar)
  const txCount = await prisma.transaction.count({ where: { userId } });
  if (txCount > 0) {
    return { message: "Dados de exemplo já existem", count: txCount };
  }

  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();

  // Helper para criar data no mês
  const d = (day: number, monthOffset = 0) =>
    new Date(year, month + monthOffset, day);

  // Transações deste mês
  const thisMonth = [
    { cat: "Alimentação", type: "EXPENSE" as const, amount: 4520, desc: "Supermercado Extra", day: 2 },
    { cat: "Alimentação", type: "EXPENSE" as const, amount: 3280, desc: "iFood - Pizza", day: 5 },
    { cat: "Alimentação", type: "EXPENSE" as const, amount: 1590, desc: "Padaria da esquina", day: 7 },
    { cat: "Alimentação", type: "EXPENSE" as const, amount: 8750, desc: "Supermercado Carrefour", day: 12 },
    { cat: "Alimentação", type: "EXPENSE" as const, amount: 2200, desc: "Restaurante almoço", day: 15 },
    { cat: "Transporte", type: "EXPENSE" as const, amount: 15000, desc: "Gasolina", day: 3 },
    { cat: "Transporte", type: "EXPENSE" as const, amount: 4800, desc: "Uber - semana", day: 10 },
    { cat: "Transporte", type: "EXPENSE" as const, amount: 2100, desc: "Estacionamento shopping", day: 14 },
    { cat: "Moradia", type: "EXPENSE" as const, amount: 150000, desc: "Aluguel", day: 5 },
    { cat: "Moradia", type: "EXPENSE" as const, amount: 18500, desc: "Conta de luz", day: 8 },
    { cat: "Moradia", type: "EXPENSE" as const, amount: 9800, desc: "Conta de água", day: 8 },
    { cat: "Moradia", type: "EXPENSE" as const, amount: 12990, desc: "Internet fibra", day: 10 },
    { cat: "Lazer", type: "EXPENSE" as const, amount: 4500, desc: "Cinema IMAX", day: 6 },
    { cat: "Lazer", type: "EXPENSE" as const, amount: 7900, desc: "Spotify + Netflix", day: 1 },
    { cat: "Lazer", type: "EXPENSE" as const, amount: 12000, desc: "Jantar com amigos", day: 11 },
    { cat: "Saúde", type: "EXPENSE" as const, amount: 25000, desc: "Plano de saúde", day: 5 },
    { cat: "Saúde", type: "EXPENSE" as const, amount: 8500, desc: "Farmácia", day: 9 },
    { cat: "Educação", type: "EXPENSE" as const, amount: 19900, desc: "Curso Udemy", day: 4 },
    { cat: "Outros", type: "EXPENSE" as const, amount: 5500, desc: "Presente aniversário", day: 13 },
    { cat: "Outros", type: "INCOME" as const, amount: 650000, desc: "Salário", day: 5 },
    { cat: "Outros", type: "INCOME" as const, amount: 80000, desc: "Freelance site", day: 12 },
    { cat: "Outros", type: "INCOME" as const, amount: 15000, desc: "Cashback cartão", day: 10 },
  ];

  // Transações do mês passado
  const lastMonth = [
    { cat: "Alimentação", type: "EXPENSE" as const, amount: 5100, desc: "Supermercado Pão de Açúcar", day: 3 },
    { cat: "Alimentação", type: "EXPENSE" as const, amount: 2800, desc: "iFood - Sushi", day: 8 },
    { cat: "Alimentação", type: "EXPENSE" as const, amount: 6200, desc: "Supermercado Extra", day: 15 },
    { cat: "Alimentação", type: "EXPENSE" as const, amount: 1800, desc: "Cafeteria", day: 20 },
    { cat: "Transporte", type: "EXPENSE" as const, amount: 14000, desc: "Gasolina", day: 5 },
    { cat: "Transporte", type: "EXPENSE" as const, amount: 3500, desc: "Uber", day: 12 },
    { cat: "Moradia", type: "EXPENSE" as const, amount: 150000, desc: "Aluguel", day: 5 },
    { cat: "Moradia", type: "EXPENSE" as const, amount: 16200, desc: "Conta de luz", day: 10 },
    { cat: "Moradia", type: "EXPENSE" as const, amount: 8500, desc: "Conta de água", day: 10 },
    { cat: "Moradia", type: "EXPENSE" as const, amount: 12990, desc: "Internet fibra", day: 10 },
    { cat: "Lazer", type: "EXPENSE" as const, amount: 3500, desc: "Cinema", day: 7 },
    { cat: "Lazer", type: "EXPENSE" as const, amount: 7900, desc: "Spotify + Netflix", day: 1 },
    { cat: "Lazer", type: "EXPENSE" as const, amount: 15000, desc: "Bar com amigos", day: 18 },
    { cat: "Saúde", type: "EXPENSE" as const, amount: 25000, desc: "Plano de saúde", day: 5 },
    { cat: "Saúde", type: "EXPENSE" as const, amount: 12000, desc: "Consulta dentista", day: 14 },
    { cat: "Educação", type: "EXPENSE" as const, amount: 4900, desc: "Livro técnico", day: 6 },
    { cat: "Outros", type: "EXPENSE" as const, amount: 8000, desc: "Roupa nova", day: 22 },
    { cat: "Outros", type: "INCOME" as const, amount: 650000, desc: "Salário", day: 5 },
    { cat: "Outros", type: "INCOME" as const, amount: 45000, desc: "Freelance design", day: 20 },
  ];

  // Mais 4 meses anteriores (resumido)
  const olderMonths = [
    // 2 meses atrás
    { cat: "Alimentação", type: "EXPENSE" as const, amount: 42000, desc: "Mercado mensal", day: 5, offset: -2 },
    { cat: "Transporte", type: "EXPENSE" as const, amount: 18000, desc: "Gasolina + Uber", day: 10, offset: -2 },
    { cat: "Moradia", type: "EXPENSE" as const, amount: 187000, desc: "Aluguel + contas", day: 5, offset: -2 },
    { cat: "Lazer", type: "EXPENSE" as const, amount: 22000, desc: "Entretenimento", day: 15, offset: -2 },
    { cat: "Saúde", type: "EXPENSE" as const, amount: 30000, desc: "Plano + farmácia", day: 5, offset: -2 },
    { cat: "Outros", type: "INCOME" as const, amount: 650000, desc: "Salário", day: 5, offset: -2 },
    // 3 meses atrás
    { cat: "Alimentação", type: "EXPENSE" as const, amount: 38000, desc: "Mercado mensal", day: 5, offset: -3 },
    { cat: "Transporte", type: "EXPENSE" as const, amount: 20000, desc: "Gasolina + Uber", day: 10, offset: -3 },
    { cat: "Moradia", type: "EXPENSE" as const, amount: 190000, desc: "Aluguel + contas", day: 5, offset: -3 },
    { cat: "Lazer", type: "EXPENSE" as const, amount: 18000, desc: "Entretenimento", day: 15, offset: -3 },
    { cat: "Saúde", type: "EXPENSE" as const, amount: 25000, desc: "Plano de saúde", day: 5, offset: -3 },
    { cat: "Outros", type: "INCOME" as const, amount: 650000, desc: "Salário", day: 5, offset: -3 },
    { cat: "Outros", type: "INCOME" as const, amount: 120000, desc: "Freelance app", day: 18, offset: -3 },
    // 4 meses atrás
    { cat: "Alimentação", type: "EXPENSE" as const, amount: 35000, desc: "Mercado mensal", day: 5, offset: -4 },
    { cat: "Transporte", type: "EXPENSE" as const, amount: 16000, desc: "Gasolina", day: 10, offset: -4 },
    { cat: "Moradia", type: "EXPENSE" as const, amount: 185000, desc: "Aluguel + contas", day: 5, offset: -4 },
    { cat: "Lazer", type: "EXPENSE" as const, amount: 25000, desc: "Viagem final de semana", day: 20, offset: -4 },
    { cat: "Saúde", type: "EXPENSE" as const, amount: 25000, desc: "Plano de saúde", day: 5, offset: -4 },
    { cat: "Outros", type: "INCOME" as const, amount: 650000, desc: "Salário", day: 5, offset: -4 },
    // 5 meses atrás
    { cat: "Alimentação", type: "EXPENSE" as const, amount: 40000, desc: "Mercado mensal", day: 5, offset: -5 },
    { cat: "Transporte", type: "EXPENSE" as const, amount: 22000, desc: "Gasolina + manutenção", day: 10, offset: -5 },
    { cat: "Moradia", type: "EXPENSE" as const, amount: 182000, desc: "Aluguel + contas", day: 5, offset: -5 },
    { cat: "Lazer", type: "EXPENSE" as const, amount: 15000, desc: "Entretenimento", day: 15, offset: -5 },
    { cat: "Saúde", type: "EXPENSE" as const, amount: 35000, desc: "Plano + exames", day: 5, offset: -5 },
    { cat: "Outros", type: "INCOME" as const, amount: 650000, desc: "Salário", day: 5, offset: -5 },
    { cat: "Outros", type: "INCOME" as const, amount: 50000, desc: "Freelance logo", day: 22, offset: -5 },
  ];

  // Inserir transações deste mês
  const allTransactions = [
    ...thisMonth.map((tx) => ({
      userId,
      categoryId: catMap[tx.cat],
      type: tx.type,
      amount: tx.amount,
      description: tx.desc,
      date: d(tx.day),
    })),
    ...lastMonth.map((tx) => ({
      userId,
      categoryId: catMap[tx.cat],
      type: tx.type,
      amount: tx.amount,
      description: tx.desc,
      date: d(tx.day, -1),
    })),
    ...olderMonths.map((tx) => ({
      userId,
      categoryId: catMap[tx.cat],
      type: tx.type,
      amount: tx.amount,
      description: tx.desc,
      date: d(tx.day, tx.offset),
    })),
  ];

  await prisma.transaction.createMany({ data: allTransactions });

  // Definir orçamentos nas categorias
  const budgets: Record<string, number> = {
    "Alimentação": 50000,
    "Transporte": 25000,
    "Moradia": 200000,
    "Lazer": 30000,
    "Saúde": 40000,
    "Educação": 20000,
    "Outros": 15000,
  };

  for (const [name, limit] of Object.entries(budgets)) {
    if (catMap[name]) {
      await prisma.category.update({
        where: { id: catMap[name] },
        data: { budgetLimit: limit },
      });
    }
  }

  // Criar recorrências
  const recurrences = [
    { cat: "Moradia", type: "EXPENSE" as const, amount: 150000, desc: "Aluguel", day: 5 },
    { cat: "Moradia", type: "EXPENSE" as const, amount: 12990, desc: "Internet fibra", day: 10 },
    { cat: "Saúde", type: "EXPENSE" as const, amount: 25000, desc: "Plano de saúde", day: 5 },
    { cat: "Lazer", type: "EXPENSE" as const, amount: 7900, desc: "Spotify + Netflix", day: 1 },
    { cat: "Outros", type: "INCOME" as const, amount: 650000, desc: "Salário", day: 5 },
  ];

  await prisma.recurringTransaction.createMany({
    data: recurrences.map((r) => ({
      userId,
      categoryId: catMap[r.cat],
      type: r.type,
      amount: r.amount,
      description: r.desc,
      dayOfMonth: r.day,
      active: true,
    })),
  });

  return { message: "Dados de exemplo criados com sucesso!", count: allTransactions.length };
}
