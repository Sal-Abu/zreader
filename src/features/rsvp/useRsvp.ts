import { useEffect, useMemo, useState } from 'react';
import { getTokenDelay } from './getTokenDelay';

export function useRsvp(tokens: string[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWpm] = useState(300);

  useEffect(() => {
    setCurrentIndex(0);
    setIsPlaying(false);
  }, [tokens]);

  useEffect(() => {
    if (!isPlaying || tokens.length === 0) {
      return;
    }

    if (currentIndex >= tokens.length) {
      setIsPlaying(false);
      return;
    }

    const delay = getTokenDelay(tokens[currentIndex], wpm);

    const timeoutId = window.setTimeout(() => {
      if (currentIndex >= tokens.length - 1) {
        setIsPlaying(false);
        return;
      }

      setCurrentIndex((previousIndex) => previousIndex + 1);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [currentIndex, isPlaying, tokens, wpm]);

  const currentToken = tokens[currentIndex] ?? '';

  const progress = useMemo(() => {
    if (tokens.length === 0) {
      return 0;
    }

    return ((currentIndex + 1) / tokens.length) * 100;
  }, [currentIndex, tokens.length]);

  function play() {
    if (tokens.length === 0) {
      return;
    }

    setIsPlaying(true);
  }

  function pause() {
    setIsPlaying(false);
  }

  function restart() {
    setIsPlaying(false);
    setCurrentIndex(0);
  }

  function stepForward() {
    setIsPlaying(false);
    setCurrentIndex((previousIndex) =>
      Math.min(previousIndex + 1, Math.max(tokens.length - 1, 0)),
    );
  }

  function stepBackward() {
    setIsPlaying(false);
    setCurrentIndex((previousIndex) => Math.max(previousIndex - 1, 0));
  }

  return {
    currentIndex,
    currentToken,
    isPlaying,
    pause,
    play,
    progress,
    restart,
    setWpm,
    stepBackward,
    stepForward,
    totalTokens: tokens.length,
    wpm,
  };
}
