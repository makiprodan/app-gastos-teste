import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { seedDefaultCategories } from "@/lib/seed";
import { checkAndGenerateRecurring } from "@/lib/check-recurring";
import { Sidebar } from "@/components/sidebar";
import { BottomNav } from "@/components/bottom-nav";
import { Header } from "@/components/header";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Seed de categorias padrão e verificação de recorrências
  await seedDefaultCategories(userId);
  await checkAndGenerateRecurring(userId);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-4 pb-20 md:p-6 md:pb-6">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
