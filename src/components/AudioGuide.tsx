import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, SpeakerHigh, SpeakerSlash } from '@phosphor-icons/react';

const STORAGE_KEY = 'audio-guide-enabled';

interface AudioGuideProps {
  src: string;
  autoPlay?: boolean;
  showControls?: boolean;
}

export function AudioGuide({ src, autoPlay = false, showControls = true }: AudioGuideProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return stored === 'true';
    return autoPlay;
  });

  // Create audio element on mount
  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = 'none';
    audioRef.current = audio;

    // Restore playing state
    if (isPlaying) {
      audio.play().catch(() => {
        // Autoplay blocked — update state
        setIsPlaying(false);
      });
    }

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [src]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync playing state changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }

    localStorage.setItem(STORAGE_KEY, String(isPlaying));
  }, [isPlaying]);

  const toggle = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  if (!showControls) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={toggle}
        aria-label={isPlaying ? 'Pause voice guide' : 'Play voice guide'}
        title={isPlaying ? 'Pause voice guide' : 'Play voice guide'}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full border shadow-lg transition-all duration-300 text-xs font-medium ${
          isPlaying
            ? 'bg-primary text-primary-foreground border-primary shadow-primary/20'
            : 'bg-background text-muted-foreground border-border hover:text-primary hover:border-primary/30'
        }`}
      >
        {isPlaying ? (
          <>
            <Pause weight="bold" className="size-4" />
            <span className="hidden sm:inline">Pause Guide</span>
            <SpeakerHigh weight="bold" className="size-3.5 opacity-60" />
          </>
        ) : (
          <>
            <Play weight="bold" className="size-4" />
            <span className="hidden sm:inline">Play Guide</span>
            <SpeakerSlash weight="bold" className="size-3.5 opacity-60" />
          </>
        )}
      </button>
    </div>
  );
}
