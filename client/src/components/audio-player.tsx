import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  url: string;
}

export function AudioPlayer({ url }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    if (!audioRef.current) return;
    audioRef.current.volume = value[0];
    setVolume(value[0]);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progress = (currentTime / duration) * 100;

  // Generate waveform bars
  const bars = Array.from({ length: 40 }, (_, i) => {
    const height = 30 + Math.sin(i * 0.5) * 20; // Create a wave pattern
    return height;
  });

  return (
    <div className="space-y-2">
      <audio ref={audioRef} src={url} />

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlay}
          className={cn(
            "h-8 w-8 transition-transform",
            isPlaying && "scale-105"
          )}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>

        <span className="text-sm w-16">{formatTime(currentTime)}</span>

        <div className="relative flex-1 h-10 flex items-center">
          {/* Waveform bars */}
          <div className="absolute inset-0 flex items-center justify-between px-2">
            {bars.map((height, i) => (
              <div
                key={i}
                className={cn(
                  "w-[2px] bg-primary/30 rounded-full transition-all duration-300",
                  i < (progress / 100) * bars.length ? "bg-primary" : "",
                  isPlaying && "animate-[wave_2s_ease-in-out_infinite]"
                )}
                style={{
                  height: `${height}%`,
                  animationDelay: `${i * 0.05}s`,
                  transform: `scaleY(${isPlaying ? 1 + Math.sin(i * 0.5) * 0.2 : 1})`,
                }}
              />
            ))}
          </div>

          {/* Playhead */}
          <div
            className="absolute h-full pointer-events-none"
            style={{ left: `${progress}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary shadow-lg" />
          </div>

          {/* Interactive slider */}
          <Slider
            value={[currentTime]}
            max={duration}
            step={0.1}
            onValueChange={handleSeek}
            className="relative z-10"
          />
        </div>

        <span className="text-sm w-16 text-right">{formatTime(duration)}</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          className="h-8 w-8"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>

        <Slider
          value={[isMuted ? 0 : volume]}
          max={1}
          step={0.1}
          onValueChange={handleVolumeChange}
          className="w-24"
        />
      </div>
    </div>
  );
}