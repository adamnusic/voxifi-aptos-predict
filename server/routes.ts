import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPredictionSchema, insertVoteSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/predictions", async (_req, res) => {
    const predictions = await storage.getPredictions();
    res.json(predictions);
  });

  app.post("/api/predictions", async (req, res) => {
    const result = insertPredictionSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: "Invalid prediction data" });
      return;
    }

    const prediction = await storage.createPrediction(result.data);
    res.json(prediction);
  });

  app.post("/api/votes", async (req, res) => {
    const result = insertVoteSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: "Invalid vote data" });
      return;
    }

    const vote = await storage.addVote(result.data);
    await storage.updatePredictionVotes(result.data.predictionId);
    res.json(vote);
  });

  const httpServer = createServer(app);
  return httpServer;
}
