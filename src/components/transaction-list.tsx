"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { getIcon } from "@/lib/icons";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Transaction {
  id: string;
  amount: number;
  type: "EXPENSE" | "INCOME";
  description: string | null;
  date: Date;
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
}

interface TransactionListProps {
  transactions: Transaction[];
  totalPages: number;
  currentPage: number;
}

export function TransactionList({
  transactions,
  totalPages,
  currentPage,
}: TransactionListProps) {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    router.push(`/transacoes?page=${page}`);
  };

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">Nenhuma transação encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {transactions.map((transaction) => {
          const Icon = getIcon(transaction.category.icon);
          const isExpense = transaction.type === "EXPENSE";
          const sign = isExpense ? "-" : "+";
          const amountColor = isExpense
            ? "text-red-600 dark:text-red-400"
            : "text-green-600 dark:text-green-400";

          return (
            <div
              key={transaction.id}
              className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${transaction.category.color}20` }}
                >
                  <Icon
                    className="h-5 w-5"
                    style={{ color: transaction.category.color }}
                  />
                </div>
                <div>
                  <p className="font-medium">{transaction.category.name}</p>
                  {transaction.description && (
                    <p className="text-sm text-muted-foreground">
                      {transaction.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className={`text-lg font-semibold ${amountColor}`}>
                {sign} {formatCurrency(transaction.amount)}
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Próxima
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
