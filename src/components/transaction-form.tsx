"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createTransaction, updateTransaction } from "@/actions/transactions";
import { getIcon } from "@/lib/icons";

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
  categoryId: string;
  description: string | null;
  date: Date;
}

interface TransactionFormProps {
  categories: Category[];
  onSuccess: () => void;
  transaction?: Transaction;
}

export function TransactionForm({
  categories,
  onSuccess,
  transaction,
}: TransactionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [valueInput, setValueInput] = useState(
    transaction ? (transaction.amount / 100).toFixed(2).replace(".", ",") : ""
  );

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Remove tudo exceto números e vírgula
    value = value.replace(/[^\d,]/g, "");
    // Permite apenas uma vírgula
    const parts = value.split(",");
    if (parts.length > 2) {
      value = parts[0] + "," + parts.slice(1).join("");
    }
    setValueInput(value);
  };

  const convertToCents = (value: string): number => {
    // Remove espaços e substitui vírgula por ponto
    const normalized = value.replace(/\s/g, "").replace(",", ".");
    const parsed = parseFloat(normalized);
    if (isNaN(parsed)) return 0;
    return Math.round(parsed * 100);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const cents = convertToCents(valueInput);
      formData.set("amount", cents.toString());

      if (transaction) {
        await updateTransaction(transaction.id, formData);
        toast.success("Transação atualizada com sucesso!");
      } else {
        await createTransaction(formData);
        toast.success("Transação criada com sucesso!");
      }

      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao salvar transação"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="value">Valor</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            R$
          </span>
          <Input
            id="value"
            value={valueInput}
            onChange={handleValueChange}
            placeholder="0,00"
            className="pl-10"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="type">Tipo</Label>
        <Select
          name="type"
          defaultValue={transaction?.type || undefined}
          required
        >
          <SelectTrigger id="type">
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EXPENSE">Gasto</SelectItem>
            <SelectItem value="INCOME">Receita</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="categoryId">Categoria</Label>
        <Select
          name="categoryId"
          defaultValue={transaction?.categoryId || undefined}
          required
        >
          <SelectTrigger id="categoryId">
            <SelectValue placeholder="Selecione a categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => {
              const Icon = getIcon(category.icon);
              return (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    <Icon
                      className="h-4 w-4"
                      style={{ color: category.color }}
                    />
                    <span>{category.name}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="date">Data</Label>
        <Input
          id="date"
          name="date"
          type="date"
          defaultValue={
            transaction
              ? new Date(transaction.date).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0]
          }
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Descrição (opcional)</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Adicione uma descrição..."
          maxLength={200}
          defaultValue={transaction?.description || ""}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading
          ? "Salvando..."
          : transaction
            ? "Atualizar"
            : "Criar Transação"}
      </Button>
    </form>
  );
}
