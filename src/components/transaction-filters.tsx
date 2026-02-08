"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface TransactionFiltersProps {
  categories: Category[];
}

type PresetPeriod = "week" | "month" | "quarter" | "custom" | "";

export function TransactionFilters({ categories }: TransactionFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Estados dos filtros
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("categories")?.split(",").filter(Boolean) || []
  );
  const [preset, setPreset] = useState<PresetPeriod>(
    (searchParams.get("preset") as PresetPeriod) || ""
  );
  const [startDate, setStartDate] = useState(
    searchParams.get("startDate") || ""
  );
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");

  // Debounce para busca
  useEffect(() => {
    const timer = setTimeout(() => {
      updateURL();
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Atualizar URL quando outros filtros mudarem
  useEffect(() => {
    updateURL();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, selectedCategories, preset, startDate, endDate]);

  const updateURL = () => {
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (type) params.set("type", type);
    if (selectedCategories.length > 0)
      params.set("categories", selectedCategories.join(","));
    if (preset) params.set("preset", preset);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);

    // Resetar página ao filtrar
    params.set("page", "1");

    const query = params.toString();
    router.push(`/transacoes${query ? `?${query}` : ""}`);
  };

  const handlePresetChange = (value: PresetPeriod) => {
    setPreset(value);

    if (value === "custom") {
      // Não altera as datas, usuário vai definir
      return;
    }

    const today = new Date();
    let start = new Date();
    let end = new Date();

    switch (value) {
      case "week":
        start.setDate(today.getDate() - 7);
        break;
      case "month":
        start.setMonth(today.getMonth() - 1);
        break;
      case "quarter":
        start.setMonth(today.getMonth() - 3);
        break;
      default:
        setStartDate("");
        setEndDate("");
        return;
    }

    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearFilters = () => {
    setSearch("");
    setType("");
    setSelectedCategories([]);
    setPreset("");
    setStartDate("");
    setEndDate("");
    router.push("/transacoes");
  };

  // Contar filtros ativos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (search) count++;
    if (type) count++;
    if (selectedCategories.length > 0) count++;
    if (startDate || endDate) count++;
    return count;
  }, [search, type, selectedCategories, startDate, endDate]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
        {/* Busca */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Tipo */}
        <Select value={type || "all"} onValueChange={(v) => setType(v === "all" ? "" : v)}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="EXPENSE">Gastos</SelectItem>
            <SelectItem value="INCOME">Receitas</SelectItem>
          </SelectContent>
        </Select>

        {/* Período */}
        <Select
          value={preset || "all"}
          onValueChange={(value) => handlePresetChange(value === "all" ? "" : value as PresetPeriod)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="week">Esta semana</SelectItem>
            <SelectItem value="month">Este mês</SelectItem>
            <SelectItem value="quarter">Últimos 3 meses</SelectItem>
            <SelectItem value="custom">Personalizado</SelectItem>
          </SelectContent>
        </Select>

        {/* Categorias */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Categorias
              {selectedCategories.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {selectedCategories.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-4" align="end">
            <div className="space-y-3">
              <div className="font-medium text-sm">Filtrar por categoria</div>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`cat-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => toggleCategory(category.id)}
                    />
                    <Label
                      htmlFor={`cat-${category.id}`}
                      className="flex-1 cursor-pointer text-sm font-normal"
                    >
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Limpar filtros */}
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearFilters}
            title="Limpar filtros"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Datas personalizadas */}
      {preset === "custom" && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
          <div className="flex-1">
            <Label htmlFor="start-date" className="text-sm mb-1 block">
              Data inicial
            </Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="end-date" className="text-sm mb-1 block">
              Data final
            </Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Badge de filtros ativos */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {activeFiltersCount} {activeFiltersCount === 1 ? "filtro" : "filtros"} ativo
            {activeFiltersCount > 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  );
}
