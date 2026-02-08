import { getRecurringTransactions } from "@/actions/recurring";
import { getCategories } from "@/actions/categories";
import RecorrentesClient from "./client";

export default async function RecorrentesPage() {
  const recurringTransactions = await getRecurringTransactions();
  const categories = await getCategories();

  return (
    <RecorrentesClient
      recurringTransactions={recurringTransactions}
      categories={categories}
    />
  );
}
