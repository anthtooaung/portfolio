import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, SpeakerHigh, SpeakerSlash } from '@phosphor-icons/react';

const STORAGE_KEY = 'audio-guide-enabled';

interface AudioGuideProps {
  src: string;
  autoPlay?: boolean;
}

export function AudioGuide({ src, autoPlay = false }: AudioGuideProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return stored === 'true';
    return autoPlay;
  });

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = 'none';
    audioRef.current = audio;

    if (isPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false);
      });
    }

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [src]); // eslint-disable-line react-hooks/exhaustive-deps

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

  return (
    <button
      onClick={toggle}
      aria-label={isPlaying ? 'Pause voice guide' : 'Play voice guide'}
      title={isPlaying ? 'Pause voice guide' : 'Play voice guide'}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors duration-300 ${
        isPlaying
          ? 'text-primary hover:bg-primary/10'
          : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
      }`}
    >
      {isPlaying ? (
        <>
          <SpeakerHigh weight="bold" className="size-3.5" />
          <Pause weight="bold" className="size-3.5" />
        </>
      ) : (
        <>
          <SpeakerSlash weight="bold" className="size-3.5" />
          <Play weight="bold" className="size-3.5" />
        </>
      )}
    </button>
  );
}
