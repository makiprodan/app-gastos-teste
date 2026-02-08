"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconPicker } from "@/components/icon-picker";
import { ColorPicker } from "@/components/color-picker";
import { createCategory, updateCategory } from "@/actions/categories";

interface CategoryFormProps {
  category?: { id: string; name: string; icon: string; color: string };
  onSuccess: () => void;
}

export function CategoryForm({ category, onSuccess }: CategoryFormProps) {
  const [icon, setIcon] = useState(category?.icon ?? "ellipsis");
  const [color, setColor] = useState(category?.color ?? "#6b7280");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.set("icon", icon);
      formData.set("color", color);

      if (category) {
        await updateCategory(category.id, formData);
        toast.success("Categoria atualizada");
      } else {
        await createCategory(formData);
        toast.success("Categoria criada");
      }
      onSuccess();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao salvar categoria";
      toast.error(message);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          name="name"
          defaultValue={category?.name}
          placeholder="Ex: Alimentação"
          required
          maxLength={50}
        />
      </div>

      <div className="space-y-2">
        <Label>Ícone</Label>
        <IconPicker value={icon} onChange={setIcon} />
      </div>

      <div className="space-y-2">
        <Label>Cor</Label>
        <ColorPicker value={color} onChange={setColor} />
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending
          ? "Salvando..."
          : category
            ? "Salvar alterações"
            : "Criar categoria"}
      </Button>
    </form>
  );
}
