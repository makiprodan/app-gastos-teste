"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validations/category";

export async function getCategories() {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autenticado");

  return prisma.category.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });
}

export async function createCategory(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autenticado");

  const raw = {
    name: formData.get("name") as string,
    icon: formData.get("icon") as string,
    color: formData.get("color") as string,
  };

  const parsed = categorySchema.parse(raw);

  await prisma.category.create({
    data: { userId, ...parsed },
  });

  revalidatePath("/categorias");
}

export async function updateCategory(id: string, formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autenticado");

  const raw = {
    name: formData.get("name") as string,
    icon: formData.get("icon") as string,
    color: formData.get("color") as string,
  };

  const parsed = categorySchema.parse(raw);

  await prisma.category.update({
    where: { id, userId },
    data: parsed,
  });

  revalidatePath("/categorias");
}

export async function deleteCategory(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autenticado");

  const transactionCount = await prisma.transaction.count({
    where: { categoryId: id, userId },
  });

  if (transactionCount > 0) {
    throw new Error(
      `Não é possível excluir: ${transactionCount} transação(ões) vinculada(s)`
    );
  }

  await prisma.category.delete({
    where: { id, userId },
  });

  revalidatePath("/categorias");
}
