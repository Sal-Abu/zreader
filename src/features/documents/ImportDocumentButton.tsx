import { useRef, useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocuments } from './DocumentsContext';
import { importEpubDocument } from './importEpubDocument';
import { importTextDocument } from './importTextDocument';

export default function ImportDocumentButton() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const { addDocument } = useDocuments();

  const [isImporting, setIsImporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handlePickFile() {
    inputRef.current?.click();
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsImporting(true);
    setErrorMessage(null);

    try {
      const lowerCaseName = file.name.toLowerCase();

      let document;

      if (lowerCaseName.endsWith('.txt')) {
        document = await importTextDocument(file);
      } else if (lowerCaseName.endsWith('.epub')) {
        document = await importEpubDocument(file);
      } else {
        throw new Error('Only .txt and .epub files are supported right now.');
      }

      await addDocument(document);
      navigate(`/library/${document.id}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to import document.';

      setErrorMessage(message);
    } finally {
      setIsImporting(false);
      event.target.value = '';
    }
  }

  return (
    <section style={{ display: 'grid', gap: '0.75rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button type="button" onClick={handlePickFile} disabled={isImporting}>
          {isImporting ? 'Importing...' : 'Import document'}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".txt,.epub,text/plain,application/epub+zip"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <p style={{ margin: 0, color: '#555555' }}>
        Supported formats: TXT, EPUB
      </p>

      {errorMessage ? (
        <p style={{ margin: 0, color: '#b00020' }}>{errorMessage}</p>
      ) : null}
    </section>
  );
}
