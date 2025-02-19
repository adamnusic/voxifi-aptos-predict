import { predictions, votes, type Prediction, type InsertPrediction, type Vote, type InsertVote } from "@shared/schema";

export interface IStorage {
  getPredictions(): Promise<Prediction[]>;
  createPrediction(prediction: InsertPrediction): Promise<Prediction>;
  addVote(vote: InsertVote): Promise<Vote>;
  updatePredictionVotes(predictionId: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private predictions: Map<number, Prediction>;
  private votes: Map<number, Vote>;
  private currentPredictionId: number;
  private currentVoteId: number;

  constructor() {
    this.predictions = new Map();
    this.votes = new Map();
    this.currentPredictionId = 1;
    this.currentVoteId = 1;

    // Initialize with some predictions
    this.createPrediction({ audioId: "clip1", prediction: "real" });
    this.createPrediction({ audioId: "clip1", prediction: "fake" });
    this.createPrediction({ audioId: "clip2", prediction: "real" });
    this.createPrediction({ audioId: "clip2", prediction: "fake" });
  }

  async getPredictions(): Promise<Prediction[]> {
    return Array.from(this.predictions.values());
  }

  async createPrediction(insertPrediction: InsertPrediction): Promise<Prediction> {
    const id = this.currentPredictionId++;
    const prediction: Prediction = { ...insertPrediction, id, votes: 0 };
    this.predictions.set(id, prediction);
    return prediction;
  }

  async addVote(insertVote: InsertVote): Promise<Vote> {
    const id = this.currentVoteId++;
    const vote: Vote = { ...insertVote, id };
    this.votes.set(id, vote);
    return vote;
  }

  async updatePredictionVotes(predictionId: number): Promise<void> {
    const prediction = this.predictions.get(predictionId);
    if (prediction) {
      prediction.votes += 1;
      this.predictions.set(predictionId, prediction);
    }
  }
}

export const storage = new MemStorage();
