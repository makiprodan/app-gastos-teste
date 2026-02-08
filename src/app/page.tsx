import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Gastei</h1>
      <p className="text-muted-foreground">Controle de gastos pessoais</p>
      <UserButton />
    </div>
  );
}
