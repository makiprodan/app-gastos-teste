"use server";

import { prisma } from "@/lib/prisma";

/**
 * Verifica e gera transações recorrentes que ainda não foram geradas no mês atual.
 * Esta é uma verificação de fallback executada ao abrir o app.
 */
export async function checkAndGenerateRecurring(userId: string) {
  try {
    const today = new Date();
    const dayOfMonth = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Buscar recorrências ativas do usuário onde dayOfMonth <= dia atual
    const activeRecurrings = await prisma.recurringTransaction.findMany({
      where: {
        userId,
        active: true,
        dayOfMonth: {
          lte: dayOfMonth,
        },
      },
      include: {
        category: true,
      },
    });

    // Para cada recorrência, verificar se já gerou no mês atual
    const pendingRecurrings = activeRecurrings.filter((recurring) => {
      if (!recurring.lastGeneratedAt) {
        return true; // Nunca gerou, precisa gerar
      }

      const lastGenMonth = recurring.lastGeneratedAt.getMonth();
      const lastGenYear = recurring.lastGeneratedAt.getFullYear();

      // Se o último mês gerado é diferente do atual, precisa gerar
      return lastGenMonth !== currentMonth || lastGenYear !== currentYear;
    });

    // Processar cada recorrência pendente
    const results = await Promise.all(
      pendingRecurrings.map(async (recurring) => {
        try {
          // Criar transação e atualizar lastGeneratedAt em uma transação atômica
          await prisma.$transaction(async (tx) => {
            // Criar a transação recorrente
            await tx.transaction.create({
              data: {
                userId: recurring.userId,
                amount: recurring.amount,
                type: recurring.type,
                categoryId: recurring.categoryId,
                description: recurring.description,
                date: today,
                isRecurring: true,
                recurringId: recurring.id,
              },
            });

            // Atualizar lastGeneratedAt
            await tx.recurringTransaction.update({
              where: { id: recurring.id },
              data: { lastGeneratedAt: today },
            });
          });

          return recurring.id;
        } catch (error) {
          console.error(
            `Erro ao gerar recorrência ${recurring.id}:`,
            error
          );
          return null;
        }
      })
    );

    const generatedCount = results.filter((result) => result !== null).length;

    return { success: true, generatedCount };
  } catch (error) {
    console.error("Erro ao verificar recorrências:", error);
    return { success: false, generatedCount: 0 };
  }
}
