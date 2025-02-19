import { useQuery } from "@tanstack/react-query";
import { PredictionCard } from "./prediction-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Prediction } from "@shared/schema";

export function AudioComparison() {
  const { data: predictions, isLoading } = useQuery<Prediction[]>({
    queryKey: ["/api/predictions"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Skeleton className="h-[500px]" />
        <Skeleton className="h-[500px]" />
      </div>
    );
  }

  const clip1Predictions = predictions?.filter(p => p.audioId === "clip1") || [];
  const clip2Predictions = predictions?.filter(p => p.audioId === "clip2") || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <PredictionCard
        audioId="clip1"
        audioUrl="/assets/audio.wav"
        predictions={clip1Predictions}
        title="Audio Clip 1"
      />
      <PredictionCard
        audioId="clip2"
        audioUrl="/assets/TrumpTalk.m4a"
        predictions={clip2Predictions}
        title="Audio Clip 2"
      />
    </div>
  );
}