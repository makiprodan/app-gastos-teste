import { getTransactions } from "@/actions/transactions";
import { getCategories } from "@/actions/categories";
import { TransacoesClient } from "./client";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function TransacoesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;

  const [{ transactions, totalPages, currentPage }, categories] =
    await Promise.all([getTransactions(page), getCategories()]);

  return (
    <TransacoesClient
      transactions={transactions}
      categories={categories}
      totalPages={totalPages}
      currentPage={currentPage}
    />
  );
}
