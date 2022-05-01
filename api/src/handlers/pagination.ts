import { z } from "zod";

export const numeric = (n: unknown) => {
  const str = z.string().regex(/^\d+$/).safeParse(n);
  if (str.success) return parseInt(str.data);
  else return NaN;
};

export const PaginationQuery = z.object({
  limit: z.preprocess(numeric, z.number().max(5).min(1).default(5)).optional(),
  page: z.preprocess(numeric, z.number().min(1).default(1)).optional(),
});

export type IPaginationQuery = z.infer<typeof PaginationQuery>;
