import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { AudioPlayer } from "./audio-player";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Prediction } from "@shared/schema";

interface PredictionCardProps {
  audioId: string;
  audioUrl: string;
  predictions: Prediction[];
  title: string;
}

export function PredictionCard({ audioId, audioUrl, predictions, title }: PredictionCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const totalVotes = predictions.reduce((sum, p) => sum + p.votes, 0) || 1;
  const realPrediction = predictions.find(p => p.prediction === "real");
  const fakePrediction = predictions.find(p => p.prediction === "fake");

  const realPercentage = ((realPrediction?.votes || 0) / totalVotes) * 100;
  const fakePercentage = ((fakePrediction?.votes || 0) / totalVotes) * 100;

  const voteMutation = useMutation({
    mutationFn: async (predictionId: number) => {
      await apiRequest("POST", "/api/votes", {
        predictionId,
        voteType: "up"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/predictions"] });
      toast({
        title: "Vote recorded",
        description: "Thank you for your prediction!",
      });
    },
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
          <img
            src="/assets/trump.webp"
            alt="Donald Trump"
            className="w-full h-full object-cover"
          />
        </div>

        <AudioPlayer url={audioUrl} />

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Real</span>
              <span>{realPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={realPercentage} />
            <Button 
              className="w-full"
              variant="outline"
              onClick={() => realPrediction && voteMutation.mutate(realPrediction.id)}
              disabled={voteMutation.isPending}
            >
              Vote Real
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Fake</span>
              <span>{fakePercentage.toFixed(1)}%</span>
            </div>
            <Progress value={fakePercentage} />
            <Button
              className="w-full"
              variant="outline"
              onClick={() => fakePrediction && voteMutation.mutate(fakePrediction.id)}
              disabled={voteMutation.isPending}
            >
              Vote Fake
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}