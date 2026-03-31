import { Link, useParams } from 'react-router-dom';
import { getDocumentById } from '../features/documents/mockDocuments';

export default function DocumentReadPage() {
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

  return (
    <main style={{ display: 'grid', gap: '2rem', maxWidth: '800px' }}>
      <section style={{ display: 'grid', gap: '0.5rem' }}>
        <p style={{ margin: 0, color: '#555555' }}>
          {document.format.toUpperCase()}
        </p>
        <h1 style={{ margin: 0 }}>{document.title}</h1>
        <p style={{ margin: 0 }}>
          Normal reading view
        </p>
      </section>

      <section style={{ display: 'grid', gap: '2rem' }}>
        {document.sections.map((section) => (
          <article key={section.id} style={{ display: 'grid', gap: '0.75rem' }}>
            <h2 style={{ margin: 0 }}>{section.title}</h2>
            {section.text.split('\n').map((paragraph, index) => (
              <p key={`${section.id}-${index}`} style={{ margin: 0 }}>
                {paragraph}
              </p>
            ))}
          </article>
        ))}
      </section>

      <section style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <Link to={`/library/${document.id}/speed-read`}>Open in speed reader</Link>
        <Link to={`/library/${document.id}`}>Back to details</Link>
      </section>
    </main>
  );
}
