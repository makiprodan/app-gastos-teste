import { getBudgetData } from "@/actions/budget";
import OrcamentoClient from "./client";

interface OrcamentoPageProps {
  searchParams: Promise<{ month?: string; year?: string }>;
}

export default async function OrcamentoPage({
  searchParams,
}: OrcamentoPageProps) {
  const params = await searchParams;
  const now = new Date();
  const month = params.month ? parseInt(params.month) : now.getMonth() + 1;
  const year = params.year ? parseInt(params.year) : now.getFullYear();

  const budgetData = await getBudgetData(year, month);

  return <OrcamentoClient budgetData={budgetData} month={month} year={year} />;
}
