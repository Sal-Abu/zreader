import { useRsvp } from './useRsvp';
import './RsvpReader.css';

type RsvpReaderProps = {
  tokens: string[];
};

export default function RsvpReader({ tokens }: RsvpReaderProps) {
  const {
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
    totalTokens,
    wpm,
  } = useRsvp(tokens);

  return (
    <section className="rsvp-reader">
      <div className="rsvp-display">
        <span className="rsvp-token">{currentToken || 'Ready'}</span>
      </div>

      <div className="rsvp-progress">
        <div className="rsvp-progress-bar">
          <div
            className="rsvp-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="rsvp-progress-text">
          Token {totalTokens === 0 ? 0 : currentIndex + 1} of {totalTokens}
        </p>
      </div>

      <div className="rsvp-controls">
        <button type="button" onClick={stepBackward}>
          Back
        </button>

        <button type="button" onClick={isPlaying ? pause : play}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        <button type="button" onClick={restart}>
          Restart
        </button>

        <button type="button" onClick={stepForward}>
          Next
        </button>
      </div>

      <div className="rsvp-settings">
        <label htmlFor="wpm">WPM: {wpm}</label>
        <input
          id="wpm"
          type="range"
          min="100"
          max="1000"
          step="25"
          value={wpm}
          onChange={(event) => setWpm(Number(event.target.value))}
        />
      </div>
    </section>
  );
}
