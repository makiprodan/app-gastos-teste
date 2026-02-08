"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RecurringForm } from "@/components/recurring-form";
import { RecurringList } from "@/components/recurring-list";

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

interface RecorrentesClientProps {
  recurringTransactions: RecurringTransaction[];
  categories: Category[];
}

export default function RecorrentesClient({
  recurringTransactions,
  categories,
}: RecorrentesClientProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Recorrentes</h2>
          <p className="text-muted-foreground">
            Gerencie suas despesas e receitas recorrentes.
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Recorrência</DialogTitle>
            </DialogHeader>
            <RecurringForm
              categories={categories}
              onSuccess={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <RecurringList
        recurringTransactions={recurringTransactions}
        categories={categories}
      />
    </div>
  );
}
