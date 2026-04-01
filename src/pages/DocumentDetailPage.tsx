import { Link, useParams } from 'react-router-dom';
import { useDocuments } from '../features/documents/DocumentsContext';

export default function DocumentDetailPage() {
  const { documentId = '' } = useParams();
  const { getDocument, isReady } = useDocuments();

  const document = getDocument(documentId);

  if (!isReady) {
    return (
      <main>
        <h1>Loading document...</h1>
      </main>
    );
  }

  if (!document) {
    return (
      <main>
        <h1>Document not found</h1>
        <p>The requested document does not exist.</p>
      </main>
    );
  }

  const readLink = document.normalProgress?.sectionId
    ? `/library/${document.id}/read?section=${document.normalProgress.sectionId}`
    : `/library/${document.id}/read`;

  const speedReadLink = document.speedReadProgress?.sectionId
    ? `/library/${document.id}/speed-read?scope=section&section=${document.speedReadProgress.sectionId}`
    : `/library/${document.id}/speed-read?scope=document`;

  return (
    <main style={{ display: 'grid', gap: '1.5rem', maxWidth: '800px' }}>
      <section style={{ display: 'grid', gap: '0.5rem' }}>
        <p style={{ margin: 0, color: '#555555' }}>
          {document.format.toUpperCase()}
        </p>
        <h1 style={{ margin: 0 }}>{document.title}</h1>
        {document.author ? <p style={{ margin: 0 }}>By {document.author}</p> : null}
        {document.description ? <p>{document.description}</p> : null}
      </section>

      <section style={{ display: 'grid', gap: '0.75rem' }}>
        <h2 style={{ margin: 0 }}>Sections</h2>
        <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
          {document.sections.map((section) => (
            <li key={section.id}>
              <Link to={`/library/${document.id}/read?section=${section.id}`}>
                {section.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <Link to={readLink}>Read normally</Link>
        <Link to={speedReadLink}>Speed read</Link>
        <Link to="/library">Back to library</Link>
      </section>
    </main>
  );
}
