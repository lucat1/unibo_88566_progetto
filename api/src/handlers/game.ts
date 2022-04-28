import type { RequestHandler } from "express";
import type { AuthenticatedRequest } from "src/auth";

interface ScoreQuery {
  id: string | undefined;
}

export const score: RequestHandler<any, any, any, ScoreQuery> = (req, res) => {
  let id: string;
  if ((req as AuthenticatedRequest).user)
    id = (req as AuthenticatedRequest).user!._id as string;
  else if (req.query.id) id = req.query.id;
  else throw new Error("Missing both authentication and id query parameter");
  res.end("id: " + id);
};
