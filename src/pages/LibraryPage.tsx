import DocumentCard from '../features/documents/DocumentCard';
import { useDocuments } from '../features/documents/DocumentsContext';

export default function LibraryPage() {
  const { documents } = useDocuments();

  return (
    <main style={{ display: 'grid', gap: '1.5rem' }}>
      <section style={{ display: 'grid', gap: '0.5rem' }}>
        <h1>Library</h1>
        <p>Choose a document to inspect, read normally, or speed read.</p>
      </section>

      {documents.length === 0 ? (
        <p>Your library is empty.</p>
      ) : (
        <section
          style={{
            display: 'grid',
            gap: '1rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          }}
        >
          {documents.map((document) => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </section>
      )}
    </main>
  );
}
