import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// API Route protegida por CRON_SECRET para geração automática de transações recorrentes
export async function POST(request: Request) {
  try {
    // Verificar autorização via header
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    // Buscar todas as recorrências ativas onde dayOfMonth = dia atual
    const today = new Date();
    const dayOfMonth = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const activeRecurrings = await prisma.recurringTransaction.findMany({
      where: {
        active: true,
        dayOfMonth,
      },
      include: {
        category: true,
      },
    });

    let generatedCount = 0;

    // Processar cada recorrência em uma transação
    const results = await Promise.all(
      activeRecurrings.map(async (recurring) => {
        // Verificar se já gerou neste mês
        if (recurring.lastGeneratedAt) {
          const lastGenMonth = recurring.lastGeneratedAt.getMonth();
          const lastGenYear = recurring.lastGeneratedAt.getFullYear();

          if (lastGenMonth === currentMonth && lastGenYear === currentYear) {
            // Já gerou neste mês, pular
            return null;
          }
        }

        // Criar transação e atualizar lastGeneratedAt em uma transação atômica
        return prisma.$transaction(async (tx) => {
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

          return recurring.id;
        });
      })
    );

    // Contar quantas transações foram realmente geradas
    generatedCount = results.filter((result) => result !== null).length;

    return NextResponse.json({
      success: true,
      generatedCount,
      processedAt: today.toISOString(),
    });
  } catch (error) {
    console.error("Erro ao gerar transações recorrentes:", error);
    return NextResponse.json(
      { error: "Erro ao processar recorrências" },
      { status: 500 }
    );
  }
}
