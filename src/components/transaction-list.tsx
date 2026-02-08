"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Pencil, Trash2, ChevronLeft, ChevronRight, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TransactionForm } from "@/components/transaction-form";
import { deleteTransaction } from "@/actions/transactions";
import { formatCurrency } from "@/lib/format";
import { getIcon } from "@/lib/icons";
import { toast } from "sonner";

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
  categories: { id: string; name: string; icon: string; color: string }[];
}

export function TransactionList({
  transactions,
  totalPages,
  currentPage,
  categories,
}: TransactionListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/transacoes?${params.toString()}`);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await deleteTransaction(deleteTarget.id);
      toast.success("Transação excluída com sucesso!");
      setDeleteTarget(null);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao excluir transação"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Wallet className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-lg font-medium">Nenhuma transação encontrada</p>
        <p className="text-sm text-muted-foreground mt-1">
          Adicione sua primeira transação para começar a controlar seus gastos.
        </p>
      </div>
    );
  }

  return (
    <>
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
                <div className="flex items-center gap-3">
                  <div className={`text-lg font-semibold ${amountColor}`}>
                    {sign} {formatCurrency(transaction.amount)}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setEditTransaction(transaction)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget(transaction)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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

      <Dialog
        open={!!editTransaction}
        onOpenChange={(open) => !open && setEditTransaction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Transação</DialogTitle>
          </DialogHeader>
          {editTransaction && (
            <TransactionForm
              categories={categories}
              transaction={{
                id: editTransaction.id,
                amount: editTransaction.amount,
                type: editTransaction.type,
                categoryId: editTransaction.category.id,
                description: editTransaction.description,
                date: editTransaction.date,
              }}
              onSuccess={() => {
                setEditTransaction(null);
                router.refresh();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir transação?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A transação será permanentemente
              removida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
