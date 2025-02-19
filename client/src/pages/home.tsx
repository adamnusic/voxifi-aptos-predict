import { AudioComparison } from "@/components/audio-comparison";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Trump Audio Authenticator</h1>
          <p className="text-muted-foreground">Predict which audio clip is real or fake</p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <AudioComparison />
      </main>
    </div>
  );
}
