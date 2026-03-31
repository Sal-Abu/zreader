import { useMemo, useState } from 'react';
import RsvpReader from '../features/rsvp/RsvpReader';
import { tokenizeText } from '../features/rsvp/tokenizeText';

const SAMPLE_TEXT = `Rapid Serial Visual Presentation displays text one token at a time.
This first prototype helps us validate the core reading experience before we add file uploads,
saved sessions, and document parsing.`;

export default function ReaderPage() {
  const [draftText, setDraftText] = useState(SAMPLE_TEXT);
  const [sessionText, setSessionText] = useState(SAMPLE_TEXT);

  const tokens = useMemo(() => tokenizeText(sessionText), [sessionText]);

  function loadText() {
    const trimmedText = draftText.trim();

    if (!trimmedText) {
      return;
    }

    setSessionText(trimmedText);
  }

  function clearText() {
    setDraftText('');
    setSessionText('');
  }

  return (
    <main style={{ display: 'grid', gap: '2rem' }}>
      <section style={{ display: 'grid', gap: '1rem', maxWidth: '800px' }}>
        <h1>Reader</h1>
        <p>Paste text below, then load it into the RSVP reader.</p>

        <textarea
          rows={10}
          value={draftText}
          onChange={(event) => setDraftText(event.target.value)}
          placeholder="Paste text here"
          style={{
            width: '100%',
            padding: '1rem',
            font: 'inherit',
            lineHeight: 1.5,
            resize: 'vertical',
          }}
        />

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button type="button" onClick={loadText}>
            Load text
          </button>
          <button type="button" onClick={clearText}>
            Clear
          </button>
        </div>

        <p style={{ margin: 0 }}>
          Current session token count: {tokens.length}
        </p>
      </section>

      <RsvpReader tokens={tokens} />
    </main>
  );
}
