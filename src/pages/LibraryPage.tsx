import DocumentCard from '../features/documents/DocumentCard';
import { mockDocuments } from '../features/documents/mockDocuments';

export default function LibraryPage() {
  return (
    <main style={{ display: 'grid', gap: '1.5rem' }}>
      <section style={{ display: 'grid', gap: '0.5rem' }}>
        <h1>Library</h1>
        <p>Choose a document to inspect, read normally, or speed read.</p>
      </section>

      <section
        style={{
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        }}
      >
        {mockDocuments.map((document) => (
          <DocumentCard key={document.id} document={document} />
        ))}
      </section>
    </main>
  );
}
