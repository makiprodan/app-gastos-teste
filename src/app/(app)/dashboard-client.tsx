"use client";

import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/format";
import { getIcon } from "@/lib/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingDown,
  TrendingUp,
  Wallet,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface CategorySummary {
  categoryId: string;
  name: string;
  icon: string;
  color: string;
  total: number;
}

interface MonthlyHistoryItem {
  month: number;
  year: number;
  label: string;
  expenses: number;
  income: number;
}

interface DashboardClientProps {
  totalExpenses: number;
  totalIncome: number;
  balance: number;
  byCategory: CategorySummary[];
  month: number;
  year: number;
  monthlyHistory: MonthlyHistoryItem[];
}

const MONTHS = [
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

export default function DashboardClient({
  totalExpenses,
  totalIncome,
  balance,
  byCategory,
  month,
  year,
  monthlyHistory,
}: DashboardClientProps) {
  const router = useRouter();

  const handlePreviousMonth = () => {
    let newMonth = month - 1;
    let newYear = year;

    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }

    router.push(`/?month=${newMonth}&year=${newYear}`);
  };

  const handleNextMonth = () => {
    let newMonth = month + 1;
    let newYear = year;

    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }

    router.push(`/?month=${newMonth}&year=${newYear}`);
  };

  return (
    <div className="space-y-6">
      {/* Seletor de mês/ano */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePreviousMonth}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Mês anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-lg font-medium min-w-[180px] text-center">
            {MONTHS[month - 1]} {year}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Próximo mês"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Total de gastos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Gastos</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalExpenses)}
            </div>
          </CardContent>
        </Card>

        {/* Total de receitas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Receitas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalIncome)}
            </div>
          </CardContent>
        </Card>

        {/* Saldo */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                balance >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatCurrency(balance)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Gráfico de pizza - Gastos por categoria */}
        <Card>
          <CardHeader>
            <CardTitle>Gastos por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            {byCategory.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground text-center">
                  Nenhum gasto registrado neste mês
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={byCategory}
                    dataKey="total"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry: any) => {
                      const percentage =
                        totalExpenses > 0
                          ? ((entry.total / totalExpenses) * 100).toFixed(1)
                          : 0;
                      return `${entry.name} (${percentage}%)`;
                    }}
                  >
                    {byCategory.map((category) => (
                      <Cell key={category.categoryId} fill={category.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as CategorySummary;
                        const percentage =
                          totalExpenses > 0
                            ? ((data.total / totalExpenses) * 100).toFixed(1)
                            : 0;
                        return (
                          <div className="bg-background border rounded-lg p-2 shadow-lg">
                            <p className="font-medium">{data.name}</p>
                            <p className="text-sm">
                              {formatCurrency(data.total)} ({percentage}%)
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Gráfico de barras - Gastos vs Receitas (últimos 6 meses) */}
        <Card>
          <CardHeader>
            <CardTitle>Gastos vs Receitas (Últimos 6 Meses)</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyHistory.every((item) => item.expenses === 0 && item.income === 0) ? (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground text-center">
                  Nenhuma transação registrada nos últimos 6 meses
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis
                    tickFormatter={(value) => {
                      // Formatar valores grandes (ex: 1000 -> 1k)
                      if (value >= 1000) {
                        return `${(value / 100000).toFixed(0)}k`;
                      }
                      return (value / 100).toFixed(0);
                    }}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border rounded-lg p-3 shadow-lg">
                            <p className="font-medium mb-2">{label}</p>
                            <p className="text-sm text-green-600">
                              Receitas: {formatCurrency(payload[1]?.value as number || 0)}
                            </p>
                            <p className="text-sm text-red-600">
                              Gastos: {formatCurrency(payload[0]?.value as number || 0)}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="expenses" fill="#dc2626" name="Gastos" />
                  <Bar dataKey="income" fill="#16a34a" name="Receitas" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lista de gastos por categoria */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          {byCategory.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhum gasto registrado neste mês
            </p>
          ) : (
            <div className="space-y-4">
              {byCategory.map((category) => {
                const Icon = getIcon(category.icon);
                const percentage =
                  totalExpenses > 0
                    ? (category.total / totalExpenses) * 100
                    : 0;

                return (
                  <div key={category.categoryId} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: `${category.color}20` }}
                        >
                          <Icon
                            className="h-4 w-4"
                            style={{ color: category.color }}
                          />
                        </div>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {formatCurrency(category.total)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    {/* Barra de progresso */}
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: category.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
