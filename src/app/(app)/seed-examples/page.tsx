"use client";

import { useState } from "react";
import { seedExampleData } from "@/actions/seed-examples";
import { Button } from "@/components/ui/button";

export default function SeedExamplesPage() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    setStatus("Criando dados de exemplo...");
    try {
      const result = await seedExampleData();
      setStatus(`${result.message} (${result.count} transações)`);
    } catch (err) {
      setStatus(`Erro: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Seed de Dados de Exemplo</h1>
      <p className="text-muted-foreground text-sm">
        Cria transações, orçamentos e recorrências de exemplo para testar o app.
      </p>
      <Button onClick={handleSeed} disabled={loading}>
        {loading ? "Criando..." : "Criar dados de exemplo"}
      </Button>
      {status && (
        <p className="text-sm font-medium">{status}</p>
      )}
    </div>
  );
}
