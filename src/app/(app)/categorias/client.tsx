"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CategoryForm } from "@/components/category-form";
import { CategoryList } from "@/components/category-list";

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  budgetLimit: number | null;
}

interface Props {
  categories: Category[];
}

export function CategoriasClient({ categories }: Props) {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Categorias</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {categories.length} categoria(s)
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova
        </Button>
      </div>

      <div className="mt-6">
        <CategoryList categories={categories} />
      </div>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova categoria</DialogTitle>
          </DialogHeader>
          <CategoryForm onSuccess={() => setShowCreate(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
