import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  audioId: text("audio_id").notNull(),
  prediction: text("prediction").notNull(),
  votes: integer("votes").notNull().default(0),
});

export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  predictionId: integer("prediction_id").notNull(),
  voteType: text("vote_type").notNull(),
});

export const insertPredictionSchema = createInsertSchema(predictions).pick({
  audioId: true,
  prediction: true,
});

export const insertVoteSchema = createInsertSchema(votes).pick({
  predictionId: true,
  voteType: true,
});

export type InsertPrediction = z.infer<typeof insertPredictionSchema>;
export type Prediction = typeof predictions.$inferSelect;
export type InsertVote = z.infer<typeof insertVoteSchema>;
export type Vote = typeof votes.$inferSelect;
