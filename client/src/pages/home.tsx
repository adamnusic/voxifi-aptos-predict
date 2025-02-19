import { AudioComparison } from "@/components/audio-comparison";
import { SiVite } from "react-icons/si";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-primary/5 backdrop-blur supports-[backdrop-filter]:bg-primary/5">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <SiVite className="h-8 w-8 text-primary animate-pulse" />
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
                VoxiFi
              </h1>
              <p className="text-sm text-muted-foreground">
                AI Voice Authentication Platform
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-4">
          <h2 className="text-4xl font-bold tracking-tight">
            Voice Authentication Powered by Crowd Intelligence
          </h2>
          <p className="text-xl text-muted-foreground">
            Listen to the audio clips and help us identify which one is authentic
          </p>
        </div>

        <AudioComparison />
      </main>
    </div>
  );
}