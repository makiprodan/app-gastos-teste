"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { transactionSchema } from "@/lib/validations/transaction";

const ITEMS_PER_PAGE = 20;

export interface TransactionFilters {
  page?: number;
  search?: string;
  type?: "EXPENSE" | "INCOME";
  categoryIds?: string[];
  startDate?: string; // ISO date
  endDate?: string; // ISO date
}

export async function getTransactions(filters: TransactionFilters = {}) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Não autenticado");
  }

  const page = filters.page || 1;
  const skip = (page - 1) * ITEMS_PER_PAGE;

  // Construir where dinâmico
  const where: any = { userId };

  if (filters.search) {
    where.description = {
      contains: filters.search,
      mode: "insensitive",
    };
  }

  if (filters.type) {
    where.type = filters.type;
  }

  if (filters.categoryIds && filters.categoryIds.length > 0) {
    where.categoryId = {
      in: filters.categoryIds,
    };
  }

  if (filters.startDate || filters.endDate) {
    where.date = {};
    if (filters.startDate) {
      where.date.gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      where.date.lte = new Date(filters.endDate);
    }
  }

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: { category: true },
      orderBy: { date: "desc" },
      skip,
      take: ITEMS_PER_PAGE,
    }),
    prisma.transaction.count({ where }),
  ]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return {
    transactions,
    totalPages,
    currentPage: page,
  };
}

export async function createTransaction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Não autenticado");
  }

  const data = {
    amount: Number(formData.get("amount")),
    type: formData.get("type") as string,
    categoryId: formData.get("categoryId") as string,
    description: formData.get("description") as string | undefined,
    date: formData.get("date") as string,
  };

  const validated = transactionSchema.parse(data);

  await prisma.transaction.create({
    data: {
      userId,
      amount: validated.amount,
      type: validated.type as "EXPENSE" | "INCOME",
      categoryId: validated.categoryId,
      description: validated.description || null,
      date: new Date(validated.date),
    },
  });

  revalidatePath("/transacoes");
  return { success: true };
}

export async function updateTransaction(id: string, formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Não autenticado");
  }

  const transaction = await prisma.transaction.findUnique({
    where: { id },
  });

  if (!transaction || transaction.userId !== userId) {
    throw new Error("Transação não encontrada");
  }

  const data = {
    amount: Number(formData.get("amount")),
    type: formData.get("type") as string,
    categoryId: formData.get("categoryId") as string,
    description: formData.get("description") as string | undefined,
    date: formData.get("date") as string,
  };

  const validated = transactionSchema.parse(data);

  await prisma.transaction.update({
    where: { id },
    data: {
      amount: validated.amount,
      type: validated.type as "EXPENSE" | "INCOME",
      categoryId: validated.categoryId,
      description: validated.description || null,
      date: new Date(validated.date),
    },
  });

  revalidatePath("/transacoes");
  return { success: true };
}

export async function deleteTransaction(id: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Não autenticado");
  }

  const transaction = await prisma.transaction.findUnique({
    where: { id },
  });

  if (!transaction || transaction.userId !== userId) {
    throw new Error("Transação não encontrada");
  }

  await prisma.transaction.delete({
    where: { id },
  });

  revalidatePath("/transacoes");
  return { success: true };
}
