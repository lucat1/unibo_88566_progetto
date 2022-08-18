import { z } from "zod";

export const PaginationQuery = z.object({
  limit: z
    .number()
    .max(20)
    .min(1)
    .or(z.string().regex(/^\d+$/).transform(Number))
    .refine((n) => n >= 1, { message: "Minimum value is 1" })
    .refine((n) => n <= 20, { message: "Maximum value is 20" })
    .optional()
    .default(10),
  page: z
    .number()
    .min(1)
    .or(z.string().regex(/^\d+$/).transform(Number))
    .refine((n) => n >= 1, { message: "Minimum value is 1" })
    .optional()
    .default(1),
});

export type IPaginationQuery = z.infer<typeof PaginationQuery>;

export enum SortingOrders {
  ASCENDING = -1,
  DESCENDING = 1,
}

export const SortingQuery = z.object({
  sort: z.string().optional(),
  order: z
    .nativeEnum(SortingOrders)
    .or(
      z
        .string()
        .regex(/^-?1$/)
        .transform(Number)
        .refine((n) =>
          n > 0 ? SortingOrders.DESCENDING : SortingOrders.ASCENDING
        )
    )
    .optional()
    .default(SortingOrders.ASCENDING),
});

export type ISortingQuery = z.infer<typeof SortingQuery>;
