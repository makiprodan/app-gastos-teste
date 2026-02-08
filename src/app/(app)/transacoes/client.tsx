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
import { TransactionForm } from "@/components/transaction-form";
import { TransactionList } from "@/components/transaction-list";
import { TransactionFilters } from "@/components/transaction-filters";
import { TransactionFilters as FilterType } from "@/actions/transactions";

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface Transaction {
  id: string;
  amount: number;
  type: "EXPENSE" | "INCOME";
  description: string | null;
  date: Date;
  category: Category;
}

interface TransacoesClientProps {
  transactions: Transaction[];
  categories: Category[];
  totalPages: number;
  currentPage: number;
  filters: FilterType;
}

export function TransacoesClient({
  transactions,
  categories,
  totalPages,
  currentPage,
  filters,
}: TransacoesClientProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Transações</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie seus gastos e receitas
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Transação</DialogTitle>
            </DialogHeader>
            <TransactionForm
              categories={categories}
              onSuccess={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <TransactionFilters categories={categories} />

      <TransactionList
        transactions={transactions}
        totalPages={totalPages}
        currentPage={currentPage}
        categories={categories}
      />
    </div>
  );
}
