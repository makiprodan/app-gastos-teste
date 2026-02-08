import { getCategories } from "@/actions/categories";
import { CategoriasClient } from "./client";

export default async function CategoriasPage() {
  const categories = await getCategories();

  return <CategoriasClient categories={categories} />;
}
