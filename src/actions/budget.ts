"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export interface BudgetCategoryData {
  id: string;
  name: string;
  icon: string;
  color: string;
  budgetLimit: number | null;
  spent: number;
  percentage: number;
}

export async function getBudgetData(
  year: number,
  month: number
): Promise<BudgetCategoryData[]> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Não autenticado");
  }

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  const categories = await prisma.category.findMany({
    where: { userId },
    include: {
      transactions: {
        where: {
          type: "EXPENSE",
          date: { gte: startDate, lt: endDate },
        },
        select: { amount: true },
      },
    },
    orderBy: { name: "asc" },
  });

  const budgetData: BudgetCategoryData[] = categories.map((category) => {
    const spent = category.transactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    const percentage =
      category.budgetLimit && category.budgetLimit > 0
        ? (spent / category.budgetLimit) * 100
        : 0;

    return {
      id: category.id,
      name: category.name,
      icon: category.icon,
      color: category.color,
      budgetLimit: category.budgetLimit,
      spent,
      percentage,
    };
  });

  // Ordenar: categorias com limite primeiro, depois sem limite
  budgetData.sort((a, b) => {
    if (a.budgetLimit !== null && b.budgetLimit === null) return -1;
    if (a.budgetLimit === null && b.budgetLimit !== null) return 1;
    return 0;
  });

  return budgetData;
}

export async function updateBudgetLimit(
  categoryId: string,
  limitInCents: number | null
) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Não autenticado");
  }

  await prisma.category.update({
    where: { id: categoryId, userId },
    data: { budgetLimit: limitInCents },
  });

  revalidatePath("/orcamento");
  return { success: true };
}
