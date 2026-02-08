"use client";

import { useState } from "react";
import { Pencil, Power, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { toggleRecurring, deleteRecurring } from "@/actions/recurring";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { RecurringForm } from "@/components/recurring-form";
import { formatCurrency } from "@/lib/format";
import { getIcon } from "@/lib/icons";

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface RecurringTransaction {
  id: string;
  type: "EXPENSE" | "INCOME";
  amount: number;
  categoryId: string;
  description: string | null;
  dayOfMonth: number;
  active: boolean;
  category: Category;
}

interface RecurringListProps {
  recurringTransactions: RecurringTransaction[];
  categories: Category[];
}

export function RecurringList({
  recurringTransactions,
  categories,
}: RecurringListProps) {
  const [editingRecurring, setEditingRecurring] =
    useState<RecurringTransaction | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isToggling, setIsToggling] = useState<string | null>(null);

  const handleToggle = async (id: string) => {
    setIsToggling(id);
    try {
      const result = await toggleRecurring(id);
      toast.success(
        result.active ? "Recorrência ativada" : "Recorrência desativada"
      );
    } catch (error) {
      console.error("Erro ao alternar recorrência:", error);
      toast.error("Erro ao alternar recorrência");
    } finally {
      setIsToggling(null);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      await deleteRecurring(deletingId);
      toast.success("Recorrência excluída com sucesso");
      setDeletingId(null);
    } catch (error) {
      console.error("Erro ao excluir recorrência:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao excluir recorrência");
      }
    }
  };

  if (recurringTransactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">
          Nenhuma recorrência cadastrada
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {recurringTransactions.map((recurring) => {
          const Icon = getIcon(recurring.category.icon);
          return (
            <div
              key={recurring.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${recurring.category.color}20` }}
                >
                  <Icon
                    className="h-5 w-5"
                    style={{ color: recurring.category.color }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">Todo dia {recurring.dayOfMonth}</p>
                    <Badge
                      variant={recurring.active ? "default" : "secondary"}
                      className={
                        recurring.active
                          ? "bg-green-500 hover:bg-green-600"
                          : ""
                      }
                    >
                      {recurring.active ? "Ativa" : "Inativa"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {recurring.category.name}
                    {recurring.description && ` • ${recurring.description}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p
                  className={`font-semibold ${
                    recurring.type === "EXPENSE"
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {recurring.type === "EXPENSE" ? "-" : "+"}
                  {formatCurrency(recurring.amount)}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleToggle(recurring.id)}
                  disabled={isToggling === recurring.id}
                >
                  <Power className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingRecurring(recurring)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeletingId(recurring.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog
        open={editingRecurring !== null}
        onOpenChange={(open) => !open && setEditingRecurring(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Recorrência</DialogTitle>
          </DialogHeader>
          {editingRecurring && (
            <RecurringForm
              categories={categories}
              recurring={editingRecurring}
              onSuccess={() => setEditingRecurring(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deletingId !== null}
        onOpenChange={(open) => !open && setDeletingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta recorrência? Esta ação não
              pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
