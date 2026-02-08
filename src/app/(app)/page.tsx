import { getDashboardData, getMonthlyHistory } from "@/actions/dashboard";
import DashboardClient from "./dashboard-client";

interface DashboardPageProps {
  searchParams: Promise<{
    month?: string;
    year?: string;
  }>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = await searchParams;

  // Default: mês e ano atuais
  const now = new Date();
  const month = params.month ? parseInt(params.month) : now.getMonth() + 1;
  const year = params.year ? parseInt(params.year) : now.getFullYear();

  const [data, monthlyHistory] = await Promise.all([
    getDashboardData(year, month),
    getMonthlyHistory(year, month),
  ]);

  return <DashboardClient {...data} monthlyHistory={monthlyHistory} />;
}
