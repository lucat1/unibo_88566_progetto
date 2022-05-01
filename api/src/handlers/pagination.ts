import { z } from "zod";

export const PaginationQuery = z.object({
  limit: z
    .number()
    .max(5)
    .min(1)
    .or(z.string().regex(/^\d+$/).transform(Number))
    .refine((n) => n >= 1, { message: "Minimum value is 1" })
    .refine((n) => n <= 5, { message: "Maximum value is 5" })
    .optional()
    .default(5),
  page: z
    .number()
    .min(1)
    .or(z.string().regex(/^\d+$/).transform(Number))
    .refine((n) => n >= 1, { message: "Minimum value is 1" })
    .optional()
    .default(1),
});

export type IPaginationQuery = z.infer<typeof PaginationQuery>;
