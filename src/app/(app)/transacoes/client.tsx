"use client";

import { useState } from "react";
import { Plus, Download } from "lucide-react";
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

  const handleExportCsv = () => {
    // Construir URL com os filtros ativos
    const params = new URLSearchParams();

    if (filters.search) {
      params.set("search", filters.search);
    }
    if (filters.type) {
      params.set("type", filters.type);
    }
    if (filters.categoryIds && filters.categoryIds.length > 0) {
      params.set("categoryIds", filters.categoryIds.join(","));
    }
    if (filters.startDate) {
      params.set("startDate", filters.startDate);
    }
    if (filters.endDate) {
      params.set("endDate", filters.endDate);
    }

    const url = `/api/export/csv?${params.toString()}`;
    window.location.href = url;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Transações</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie seus gastos e receitas
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCsv}>
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
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
