"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createRecurring, updateRecurring } from "@/actions/recurring";
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
}

interface RecurringFormProps {
  categories: Category[];
  onSuccess: () => void;
  recurring?: RecurringTransaction;
}

export function RecurringForm({
  categories,
  onSuccess,
  recurring,
}: RecurringFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState<string>(recurring?.type || "EXPENSE");
  const [categoryId, setCategoryId] = useState<string>(
    recurring?.categoryId || ""
  );
  const [valueInput, setValueInput] = useState(
    recurring ? (recurring.amount / 100).toFixed(2).replace(".", ",") : ""
  );
  const [description, setDescription] = useState(
    recurring?.description || ""
  );
  const [dayOfMonth, setDayOfMonth] = useState(
    recurring?.dayOfMonth.toString() || ""
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Converte "10,50" para 1050 centavos
      const valueInCents = Math.round(
        parseFloat(valueInput.replace(",", ".")) * 100
      );

      const formData = new FormData();
      formData.append("amount", valueInCents.toString());
      formData.append("type", type);
      formData.append("categoryId", categoryId);
      formData.append("description", description);
      formData.append("dayOfMonth", dayOfMonth);

      if (recurring) {
        await updateRecurring(recurring.id, formData);
        toast.success("Recorrência atualizada com sucesso");
      } else {
        await createRecurring(formData);
        toast.success("Recorrência criada com sucesso");
      }

      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar recorrência:", error);
      toast.error("Erro ao salvar recorrência");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="value">Valor</Label>
        <Input
          id="value"
          type="text"
          placeholder="10,50"
          value={valueInput}
          onChange={(e) => setValueInput(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Tipo</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger id="type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EXPENSE">Gasto</SelectItem>
            <SelectItem value="INCOME">Receita</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => {
              const Icon = getIcon(category.icon);
              return (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" style={{ color: category.color }} />
                    <span>{category.name}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dayOfMonth">Dia do Mês</Label>
        <Input
          id="dayOfMonth"
          type="number"
          min="1"
          max="31"
          placeholder="15"
          value={dayOfMonth}
          onChange={(e) => setDayOfMonth(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição (opcional)</Label>
        <Input
          id="description"
          type="text"
          placeholder="Ex: Aluguel"
          maxLength={200}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "Salvando..."
            : recurring
              ? "Atualizar"
              : "Criar"}
        </Button>
      </div>
    </form>
  );
}
