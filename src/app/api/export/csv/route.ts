import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  // Obter query params
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search") || undefined;
  const type = searchParams.get("type") as "EXPENSE" | "INCOME" | null;
  const categoryIds = searchParams.get("categoryIds")?.split(",").filter(Boolean) || undefined;
  const startDate = searchParams.get("startDate") || undefined;
  const endDate = searchParams.get("endDate") || undefined;

  // Construir where dinâmico (mesma lógica do getTransactions)
  const where: any = { userId };

  if (search) {
    where.description = {
      contains: search,
      mode: "insensitive",
    };
  }

  if (type) {
    where.type = type;
  }

  if (categoryIds && categoryIds.length > 0) {
    where.categoryId = {
      in: categoryIds,
    };
  }

  if (startDate || endDate) {
    where.date = {};
    if (startDate) {
      where.date.gte = new Date(startDate);
    }
    if (endDate) {
      where.date.lte = new Date(endDate);
    }
  }

  // Buscar TODAS as transações (sem paginação)
  const transactions = await prisma.transaction.findMany({
    where,
    include: { category: true },
    orderBy: { date: "desc" },
  });

  // Gerar CSV
  const BOM = "\uFEFF"; // Byte Order Mark para UTF-8 no Excel
  const header = "Data;Tipo;Categoria;Descrição;Valor\n";

  const rows = transactions
    .map((t) => {
      const data = new Date(t.date).toLocaleDateString("pt-BR"); // DD/MM/YYYY
      const tipo = t.type === "EXPENSE" ? "Gasto" : "Receita";
      const categoria = t.category.name;
      const descricao = t.description || "";
      const valor = (t.amount / 100).toFixed(2).replace(".", ","); // 10,50

      // Escapar aspas duplas em campos (se houver)
      const escapeCsv = (str: string) => {
        if (str.includes(";") || str.includes('"') || str.includes("\n")) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      return `${data};${tipo};${escapeCsv(categoria)};${escapeCsv(descricao)};${valor}`;
    })
    .join("\n");

  const csv = BOM + header + rows;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=transacoes.csv",
    },
  });
}
