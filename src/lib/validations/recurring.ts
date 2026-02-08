import { z } from "zod";

export const recurringSchema = z.object({
  amount: z
    .number()
    .int("Valor deve ser um número inteiro")
    .positive("Valor deve ser positivo"),
  type: z.enum(["EXPENSE", "INCOME"]),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  description: z
    .string()
    .max(200, "Descrição deve ter no máximo 200 caracteres")
    .optional(),
  dayOfMonth: z
    .number()
    .int("Dia do mês deve ser um número inteiro")
    .min(1, "Dia do mês deve ser no mínimo 1")
    .max(31, "Dia do mês deve ser no máximo 31"),
});

export type RecurringInput = z.infer<typeof recurringSchema>;
