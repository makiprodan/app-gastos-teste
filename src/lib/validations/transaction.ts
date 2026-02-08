import { z } from "zod";

export const transactionSchema = z.object({
  amount: z.number().positive("O valor deve ser positivo"),
  type: z.enum(["EXPENSE", "INCOME"]),
  categoryId: z.string().min(1, "Selecione uma categoria"),
  description: z.string().max(200, "Descrição muito longa").optional(),
  date: z.string().min(1, "Selecione uma data"),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
