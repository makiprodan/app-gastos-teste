import { prisma } from "@/lib/prisma";
import { DEFAULT_CATEGORIES } from "@/lib/default-categories";

export async function seedDefaultCategories(userId: string) {
  const count = await prisma.category.count({ where: { userId } });
  if (count > 0) return;

  await prisma.category.createMany({
    data: DEFAULT_CATEGORIES.map((cat) => ({
      userId,
      name: cat.name,
      icon: cat.icon,
      color: cat.color,
    })),
    skipDuplicates: true,
  });
}
