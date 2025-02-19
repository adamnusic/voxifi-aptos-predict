import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { AudioPlayer } from "./audio-player";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Prediction } from "@shared/schema";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full overflow-hidden border-2 hover:border-primary/50 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-48 relative bg-muted rounded-lg overflow-hidden group">
            <motion.img
              src="/assets/trump.webp"
              alt="Donald Trump"
              className="w-full h-full object-cover object-center transition-transform group-hover:scale-105"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

            {/* Vote Statistics Overlay */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-white text-center space-y-2 px-4">
                <div className="text-3xl font-bold">
                  {totalVotes} <span className="text-lg">votes</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-green-400">
                      {realPercentage.toFixed(0)}%
                    </div>
                    <div className="text-sm opacity-80">Real</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-400">
                      {fakePercentage.toFixed(0)}%
                    </div>
                    <div className="text-sm opacity-80">Fake</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <AudioPlayer url={audioUrl} />

          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex justify-between text-sm font-medium">
                <span>Real</span>
                <span className="text-primary">{realPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={realPercentage} className="h-2" />
              <Button 
                className="w-full font-semibold"
                variant="outline"
                onClick={() => realPrediction && voteMutation.mutate(realPrediction.id)}
                disabled={voteMutation.isPending}
              >
                Vote Real
              </Button>
            </motion.div>

            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex justify-between text-sm font-medium">
                <span>Fake</span>
                <span className="text-primary">{fakePercentage.toFixed(1)}%</span>
              </div>
              <Progress value={fakePercentage} className="h-2" />
              <Button
                className="w-full font-semibold"
                variant="outline"
                onClick={() => fakePrediction && voteMutation.mutate(fakePrediction.id)}
                disabled={voteMutation.isPending}
              >
                Vote Fake
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}