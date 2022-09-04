import { z } from "zod";

export const PetBody = z.object({
  name: z.string().min(1),
  photos: z.array(z.string().min(1)),

  category: z.number(),
  subcategory: z.number().optional(),
  owner: z.string().uuid().optional(),
});
export type IPetBody = z.infer<typeof PetBody>;
