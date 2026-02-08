"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getIcon } from "@/lib/icons";
import { formatCurrency } from "@/lib/format";
import { updateBudgetLimit, type BudgetCategoryData } from "@/actions/budget";

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

interface OrcamentoClientProps {
  budgetData: BudgetCategoryData[];
  month: number;
  year: number;
}

export default function OrcamentoClient({
  budgetData,
  month,
  year,
}: OrcamentoClientProps) {
  const router = useRouter();
  const [editingCategory, setEditingCategory] =
    useState<BudgetCategoryData | null>(null);
  const [limitValue, setLimitValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handlePreviousMonth() {
    const newMonth = month === 1 ? 12 : month - 1;
    const newYear = month === 1 ? year - 1 : year;
    router.push(`/orcamento?month=${newMonth}&year=${newYear}`);
  }

  function handleNextMonth() {
    const newMonth = month === 12 ? 1 : month + 1;
    const newYear = month === 12 ? year + 1 : year;
    router.push(`/orcamento?month=${newMonth}&year=${newYear}`);
  }

  function openEditDialog(category: BudgetCategoryData) {
    setEditingCategory(category);
    if (category.budgetLimit) {
      // Converter centavos para reais com vírgula
      const valueInReais = category.budgetLimit / 100;
      setLimitValue(valueInReais.toFixed(2).replace(".", ","));
    } else {
      setLimitValue("");
    }
  }

  function closeEditDialog() {
    setEditingCategory(null);
    setLimitValue("");
    setIsSubmitting(false);
  }

  async function handleSaveLimit() {
    if (!editingCategory) return;

    setIsSubmitting(true);

    try {
      // Converter valor em reais para centavos
      const cleanValue = limitValue.replace(/[^\d,]/g, "").replace(",", ".");
      const valueInCents = Math.round(parseFloat(cleanValue || "0") * 100);

      if (isNaN(valueInCents) || valueInCents < 0) {
        toast.error("Valor inválido");
        return;
      }

      await updateBudgetLimit(editingCategory.id, valueInCents);
      toast.success("Limite atualizado com sucesso!");
      closeEditDialog();
      router.refresh();
    } catch (error) {
      toast.error("Erro ao atualizar limite");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRemoveLimit() {
    if (!editingCategory) return;

    setIsSubmitting(true);

    try {
      await updateBudgetLimit(editingCategory.id, null);
      toast.success("Limite removido com sucesso!");
      closeEditDialog();
      router.refresh();
    } catch (error) {
      toast.error("Erro ao remover limite");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  function getProgressColor(percentage: number) {
    if (percentage < 50) return "bg-green-500";
    if (percentage < 80) return "bg-yellow-500";
    return "bg-red-500";
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho com seletor de mês/ano */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Orçamento</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[150px] text-center font-medium">
            {MESES[month - 1]} {year}
          </span>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Lista de categorias */}
      {budgetData.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Nenhuma categoria cadastrada.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {budgetData.map((category) => {
            const Icon = getIcon(category.icon);
            const hasLimit = category.budgetLimit !== null;

            return (
              <Card key={category.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${category.color}20` }}
                      >
                        <Icon
                          className="h-5 w-5"
                          style={{ color: category.color }}
                        />
                      </div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(category)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {hasLimit ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {formatCurrency(category.spent)} de{" "}
                          {formatCurrency(category.budgetLimit!)}
                        </span>
                        <span className="font-medium">
                          {category.percentage.toFixed(0)}%
                        </span>
                      </div>
                      <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                          className={`h-full rounded-full transition-all ${getProgressColor(
                            category.percentage
                          )}`}
                          style={{
                            width: `${Math.min(category.percentage, 100)}%`,
                          }}
                        />
                      </div>
                      {category.percentage > 100 && (
                        <Badge variant="destructive" className="mt-2">
                          Excedido!
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Sem limite definido
                      {category.spent > 0 && (
                        <span className="ml-2 font-medium text-foreground">
                          • Gasto: {formatCurrency(category.spent)}
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Dialog de edição de limite */}
      <Dialog open={editingCategory !== null} onOpenChange={closeEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory?.budgetLimit
                ? "Editar limite"
                : "Definir limite"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {editingCategory && (
              <div className="flex items-center gap-3 pb-2">
                {(() => {
                  const Icon = getIcon(editingCategory.icon);
                  return (
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor: `${editingCategory.color}20`,
                      }}
                    >
                      <Icon
                        className="h-5 w-5"
                        style={{ color: editingCategory.color }}
                      />
                    </div>
                  );
                })()}
                <div>
                  <p className="font-medium">{editingCategory.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Gasto no mês: {formatCurrency(editingCategory.spent)}
                  </p>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="limit">Limite mensal (R$)</Label>
              <Input
                id="limit"
                type="text"
                placeholder="500,00"
                value={limitValue}
                onChange={(e) => setLimitValue(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            {editingCategory?.budgetLimit && (
              <Button
                variant="outline"
                onClick={handleRemoveLimit}
                disabled={isSubmitting}
              >
                Remover limite
              </Button>
            )}
            <Button onClick={handleSaveLimit} disabled={isSubmitting}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
