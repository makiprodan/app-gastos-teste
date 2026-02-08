import { getTransactions, TransactionFilters } from "@/actions/transactions";
import { getCategories } from "@/actions/categories";
import { TransacoesClient } from "./client";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    type?: string;
    categories?: string;
    startDate?: string;
    endDate?: string;
    preset?: string;
  }>;
}

export default async function TransacoesPage({ searchParams }: PageProps) {
  const params = await searchParams;

  // Construir filtros
  const filters: TransactionFilters = {
    page: params.page ? parseInt(params.page) : 1,
    search: params.search,
    type: params.type as "EXPENSE" | "INCOME" | undefined,
    categoryIds: params.categories?.split(",").filter(Boolean),
    startDate: params.startDate,
    endDate: params.endDate,
  };

  const [{ transactions, totalPages, currentPage }, categories] =
    await Promise.all([getTransactions(filters), getCategories()]);

  return (
    <TransacoesClient
      transactions={transactions}
      categories={categories}
      totalPages={totalPages}
      currentPage={currentPage}
      filters={filters}
    />
  );
}
