"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { recurringSchema } from "@/lib/validations/recurring";

export async function getRecurringTransactions() {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  return await prisma.recurringTransaction.findMany({
    where: { userId },
    orderBy: { dayOfMonth: "asc" },
    include: { category: true },
  });
}

export async function createRecurring(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  try {
    const data = {
      amount: Number(formData.get("amount")),
      type: formData.get("type") as "EXPENSE" | "INCOME",
      categoryId: formData.get("categoryId") as string,
      description: formData.get("description") as string | undefined,
      dayOfMonth: Number(formData.get("dayOfMonth")),
    };

    const validated = recurringSchema.parse(data);

    await prisma.recurringTransaction.create({
      data: {
        userId,
        ...validated,
      },
    });

    revalidatePath("/recorrentes");
    return { success: true };
  } catch (error) {
    console.error("Erro ao criar recorrência:", error);
    throw new Error("Erro ao criar recorrência");
  }
}

export async function updateRecurring(id: string, formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  try {
    const data = {
      amount: Number(formData.get("amount")),
      type: formData.get("type") as "EXPENSE" | "INCOME",
      categoryId: formData.get("categoryId") as string,
      description: formData.get("description") as string | undefined,
      dayOfMonth: Number(formData.get("dayOfMonth")),
    };

    const validated = recurringSchema.parse(data);

    await prisma.recurringTransaction.updateMany({
      where: { id, userId },
      data: validated,
    });

    revalidatePath("/recorrentes");
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar recorrência:", error);
    throw new Error("Erro ao atualizar recorrência");
  }
}

export async function toggleRecurring(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  try {
    const recurring = await prisma.recurringTransaction.findFirst({
      where: { id, userId },
    });

    if (!recurring) throw new Error("Recorrência não encontrada");

    await prisma.recurringTransaction.update({
      where: { id },
      data: { active: !recurring.active },
    });

    revalidatePath("/recorrentes");
    return { success: true, active: !recurring.active };
  } catch (error) {
    console.error("Erro ao alternar recorrência:", error);
    throw new Error("Erro ao alternar recorrência");
  }
}

export async function deleteRecurring(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  try {
    const recurring = await prisma.recurringTransaction.findFirst({
      where: { id, userId },
      include: { transactions: true },
    });

    if (!recurring) throw new Error("Recorrência não encontrada");

    if (recurring.transactions.length > 0) {
      throw new Error(
        "Não é possível excluir recorrência com transações vinculadas"
      );
    }

    await prisma.recurringTransaction.delete({
      where: { id },
    });

    revalidatePath("/recorrentes");
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir recorrência:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Erro ao excluir recorrência");
  }
}
