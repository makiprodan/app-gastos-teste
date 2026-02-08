"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

interface CategorySummary {
  categoryId: string;
  name: string;
  icon: string;
  color: string;
  total: number;
}

interface DashboardData {
  totalExpenses: number;
  totalIncome: number;
  balance: number;
  byCategory: CategorySummary[];
  month: number;
  year: number;
}

export async function getDashboardData(
  year: number,
  month: number
): Promise<DashboardData> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Não autenticado");
  }

  // Calcular startDate e endDate do mês
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  // Buscar todas as transações do mês
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
    include: {
      category: true,
    },
  });

  // Calcular totais
  let totalExpenses = 0;
  let totalIncome = 0;

  const categoryMap = new Map<string, CategorySummary>();

  for (const transaction of transactions) {
    if (transaction.type === "EXPENSE") {
      totalExpenses += transaction.amount;

      // Agrupar por categoria
      const existing = categoryMap.get(transaction.categoryId);
      if (existing) {
        existing.total += transaction.amount;
      } else {
        categoryMap.set(transaction.categoryId, {
          categoryId: transaction.categoryId,
          name: transaction.category.name,
          icon: transaction.category.icon,
          color: transaction.category.color,
          total: transaction.amount,
        });
      }
    } else if (transaction.type === "INCOME") {
      totalIncome += transaction.amount;
    }
  }

  // Converter Map para array e ordenar por total (decrescente)
  const byCategory = Array.from(categoryMap.values()).sort(
    (a, b) => b.total - a.total
  );

  const balance = totalIncome - totalExpenses;

  return {
    totalExpenses,
    totalIncome,
    balance,
    byCategory,
    month,
    year,
  };
}
