import { Link, useParams } from 'react-router-dom';
import RsvpReader from '../features/rsvp/RsvpReader';
import { getDocumentById } from '../features/documents/mockDocuments';
import { tokenizeText } from '../features/rsvp/tokenizeText';

export default function DocumentSpeedReadPage() {
  const { documentId = '' } = useParams();
  const document = getDocumentById(documentId);

  if (!document) {
    return (
      <main>
        <h1>Document not found</h1>
        <p>The requested document does not exist.</p>
      </main>
    );
  }

  const fullText = document.sections.map((section) => section.text).join('\n\n');
  const tokens = tokenizeText(fullText);

  return (
    <main style={{ display: 'grid', gap: '2rem' }}>
      <section style={{ display: 'grid', gap: '0.5rem', maxWidth: '800px' }}>
        <p style={{ margin: 0, color: '#555555' }}>
          {document.format.toUpperCase()}
        </p>
        <h1 style={{ margin: 0 }}>{document.title}</h1>
        <p style={{ margin: 0 }}>
          Speed reading view
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to={`/library/${document.id}/read`}>Read normally</Link>
          <Link to={`/library/${document.id}`}>Back to details</Link>
        </div>
      </section>

      <RsvpReader tokens={tokens} />
    </main>
  );
}
