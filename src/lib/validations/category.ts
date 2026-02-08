import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(50, "Nome deve ter no máximo 50 caracteres"),
  icon: z.string().min(1, "Ícone é obrigatório"),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Cor inválida"),
  budgetLimit: z
    .number()
    .int()
    .positive("Limite deve ser positivo")
    .nullable()
    .optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
